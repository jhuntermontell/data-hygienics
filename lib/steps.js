// Public step pages (/steps/<id>): every Clear Path step, readable without
// the quiz. Reads the same data the Path uses (AUDIENCE_PATHS in lib/path.js)
// and resolves link keys with the Path's own resolver, so a step page and
// the step inside someone's path never disagree.
//
// Step ids are stored keys and unique across audiences, so the URL is flat.
// Nothing here is hidden: a `when` that would drop a do item or a whole step
// from someone's path becomes an "If you ..." line built from the quiz label.
import { AUDIENCE_PATHS, QUIZZES } from "./path.js"
import { resolvePathLinks } from "./path-links.js"

export const AUDIENCE_LABELS = { home: "Home", business: "Business" }

// Home first, then business: the order the plan resolves ids in.
const ALL = Object.entries(AUDIENCE_PATHS).flatMap(([audience, config]) =>
  config.steps.map((step) => ({ audience, step }))
)

const BY_ID = new Map()
for (const entry of ALL) if (!BY_ID.has(entry.step.id)) BY_ID.set(entry.step.id, entry)

export function getStepById(id) {
  return BY_ID.get(id)?.step || null
}

export function getStepAudience(id) {
  return BY_ID.get(id)?.audience || null
}

export function allStepParams() {
  return [...BY_ID.keys()].map((id) => ({ id }))
}

export function stepHref(step) {
  return `/steps/${step.id}`
}

export function getStage(audience, stageId) {
  return AUDIENCE_PATHS[audience]?.stages.find((s) => s.id === stageId) || null
}

// The /steps index: per audience, stages in authored order with their steps.
export function stepsByStage() {
  return Object.entries(AUDIENCE_PATHS).map(([audience, config]) => ({
    audience,
    label: AUDIENCE_LABELS[audience] || audience,
    stages: config.stages
      .map((stage) => ({ ...stage, steps: config.steps.filter((s) => s.stage === stage.id) }))
      .filter((stage) => stage.steps.length),
  }))
}

// The one sentence a step is summed up by: what's true after, else why.
export function stepSummary(step) {
  return step.after || step.why || ""
}

export function stepMetaDescription(step) {
  const text = stepSummary(step)
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text
}

// "Set once" or "Ongoing", from `type` unless `cadence` overrides it.
// Any other type shows no label.
export const CADENCE_LABELS = { once: "Set once", ongoing: "Ongoing" }
const TYPE_CADENCE = { setup: "once", conversation: "once", decision: "once", habit: "ongoing", rehearsal: "ongoing" }

export function cadenceFor(step) {
  const key = CADENCE_LABELS[step.cadence] ? step.cadence : TYPE_CADENCE[step.type]
  return key ? { key, label: CADENCE_LABELS[key] } : null
}

// --- "If you ..." lines from the quiz -------------------------------------

function question(audience, id) {
  return (QUIZZES[audience] || []).find((q) => q.id === id) || null
}

function optionLabel(q, value) {
  return q?.options?.find((o) => o.value === value)?.label || value
}

function orList(items) {
  if (items.length <= 1) return items.join("")
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`
}

// Product names read naturally after "you use"; everything else quotes the
// option exactly as the quiz shows it.
const USE_VALUES = { stack: ["m365", "google"] }

function clausePhrase(audience, clause) {
  return Object.entries(clause)
    .map(([id, values]) => {
      const q = question(audience, id)
      const labels = values.map((v) => optionLabel(q, v))
      if (USE_VALUES[id] && values.every((v) => USE_VALUES[id].includes(v))) return `you use ${orList(labels)}`
      const picked = `you picked ${orList(labels.map((l) => `“${l}”`))}`
      return q?.title ? `${picked} for “${q.title}”` : picked
    })
    .join(" and ")
}

// `when` is a clause or an array of clauses (any one matches).
export function conditionPhrase(audience, when) {
  if (!when) return ""
  const clauses = Array.isArray(when) ? when : [when]
  return clauses.map((c) => clausePhrase(audience, c)).filter(Boolean).join(", or ")
}

// Do items with their condition spelled out. Every item shows.
export function doItems(step, audience) {
  return (Array.isArray(step.do) ? step.do : [])
    .map((item) => {
      if (typeof item === "string") return { text: item, condition: "" }
      if (!item?.text) return null
      const phrase = conditionPhrase(audience, item.when)
      return { text: item.text, condition: phrase ? `If ${phrase}` : "" }
    })
    .filter(Boolean)
}

// Who the whole step is for, when the Path only includes it for some answers.
export function stepAudienceNotes(step, audience) {
  const notes = []
  const forWhom = conditionPhrase(audience, step.when)
  if (forWhom) notes.push(`On your path if ${forWhom}.`)
  if (step.unless) {
    const clauses = Object.entries(step.unless).map(([id, values]) => ({ [id]: values }))
    const leftOff = conditionPhrase(audience, clauses)
    if (leftOff) notes.push(`Left off your path if ${leftOff}.`)
  }
  return notes
}

// --- Links, prerequisites and the way into the Path ------------------------

export function stepLinks(step) {
  const resolved = resolvePathLinks([step])
  return (step.links || []).map((key) => resolved[key]).filter(Boolean)
}

export function prerequisites(step) {
  return (step.requires || []).map((id) => getStepById(id)).filter(Boolean)
}

// One chip into /path/<audience>?start=<value>: the step's first domain, or
// a value from its `when` on the quiz's first question (a business industry
// step starts at that industry), if it's an option of that first question.
export function startLink(step, audience) {
  const first = (QUIZZES[audience] || [])[0]
  const base = `/path/${audience}`
  if (!first) return { href: base, label: null }
  const fromWhen = (Array.isArray(step.when) ? step.when : step.when ? [step.when] : []).flatMap((c) => c[first.id] || [])
  const candidates = [...(step.domains || []), ...fromWhen]
  const option = candidates.map((v) => first.options?.find((o) => o.value === v)).find(Boolean)
  return option ? { href: `${base}?start=${encodeURIComponent(option.value)}`, label: option.label } : { href: base, label: null }
}
