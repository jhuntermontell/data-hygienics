// Clear Path: turns quiz answers into an ordered, personal path.
//
// Content is pure data under lib/content/path/ (quiz.js, home.js,
// business.js, long-view.js). This module holds the logic: which steps apply,
// what order they go in, what fits this week, and where someone stands.
// It is import-free of React so scripts/validate-content.mjs can load it.
//
// Ordering, in short:
// 1. Stages run in their authored order, except that stages marked `rankable`
//    move up when they serve what the person ranked highest. Foundation
//    stages (email, passwords, sign-in) never move: they protect everything.
// 2. Inside a stage, steps that serve higher-ranked priorities come first,
//    then starter before solid before advanced, then quicker steps first.
// 3. A step applies when its `when` matches the answers (devices, household,
//    stack, industry...). Steps that don't apply are "set aside", and the
//    reveal says how many, so nothing is hidden.
import { QUIZZES, DEFAULT_ANSWERS } from "./content/path/quiz.js"
import { HOME_STAGES, HOME_STEPS } from "./content/path/home.js"
import { BUSINESS_STAGES, BUSINESS_STEPS, INDUSTRIES } from "./content/path/business.js"

export { QUIZZES, INDUSTRIES }

export const AUDIENCE_PATHS = {
  home: { stages: HOME_STAGES, steps: HOME_STEPS, priorityKey: "priorities" },
  business: { stages: BUSINESS_STAGES, steps: BUSINESS_STEPS, priorityKey: "stakes" },
}

// The four honest outcomes in "Where you stand". Counts only, no score.
export const OUTCOMES = {
  "break-in": { key: "break-in", label: "Hard to break into", description: "Accounts and devices that a stolen password alone can't open." },
  fool: { key: "fool", label: "Hard to fool", description: "Habits that hold up against a convincing message, call or video." },
  recover: { key: "recover", label: "Quick to recover", description: "Copies, contacts and plans that turn a bad day into an inconvenience." },
  control: { key: "control", label: "In your control", description: "Choices about what apps, companies and AI know about you." },
}
export const OUTCOME_ORDER = ["break-in", "fool", "recover", "control"]

// Step progress marks. "said" comes from the quiz ("already doing this") and
// shows as "You said it's in place" until checked.
export const STATUS = {
  said: { label: "You said it's in place", handled: true },
  done: { label: "Done", handled: true },
  checked: { label: "Done and checked", handled: true },
  skipped: { label: "Skipped for now", handled: false },
  declined: { label: "Your call: not for us", handled: true },
}

// Minutes a week, by the time-budget answer. "afternoon" front-loads setup.
export const TIME_BUDGET = { 10: 10, 30: 30, 60: 60, afternoon: 180 }

// `when` is { questionId: [values] } (every question must match), or an
// array of those (any one must match).
export function matchesWhen(when, answers) {
  if (!when) return true
  if (Array.isArray(when)) return when.some((w) => matchesWhen(w, answers))
  return Object.entries(when).every(([id, values]) => {
    const answer = answers[id]
    const list = Array.isArray(answer) ? answer : answer ? [answer] : []
    return list.some((v) => values.includes(v))
  })
}

// `unless` is the opposite of `when`: drop the step if any answer matches.
function applies(step, answers) {
  if (!matchesWhen(step.when, answers)) return false
  if (step.unless && Object.keys(step.unless).some((id) => matchesWhen({ [id]: step.unless[id] }, answers))) return false
  return true
}

// Across stages: when ranking puts a step ahead of a prerequisite in a later
// stage (e.g. photo encryption before the sealed recovery kit), the step
// moves into the prerequisite's stage, right after it. Prerequisites in
// foundation or earlier stages need no move.
function placeAfterPrerequisites(stages) {
  for (let pass = 0; pass < 50; pass++) {
    let moved = false
    const where = new Map()
    stages.forEach((stage, si) => stage.steps.forEach((s, i) => where.set(s.id, [si, i])))
    for (const [si, stage] of stages.entries()) {
      for (const step of [...stage.steps]) {
        const later = (step.requires || []).map((r) => where.get(r)).filter((pos) => pos && pos[0] > si)
        if (!later.length) continue
        const [ti, tj] = later.sort((a, b) => b[0] - a[0] || b[1] - a[1])[0]
        stage.steps = stage.steps.filter((s) => s !== step)
        stages[ti].steps.splice(tj + 1, 0, step)
        moved = true
        break
      }
      if (moved) break
    }
    if (!moved) return
  }
}

// Within a stage, a step never comes before a step it requires.
function respectRequires(steps) {
  const out = []
  const placed = new Set()
  const pending = [...steps]
  const ids = new Set(steps.map((s) => s.id))
  while (pending.length) {
    const i = pending.findIndex((s) => (s.requires || []).every((r) => !ids.has(r) || placed.has(r)))
    const [next] = pending.splice(i === -1 ? 0 : i, 1)
    out.push(next)
    placed.add(next.id)
  }
  return out
}

export function withDefaults(audience, answers = {}) {
  const defaults = DEFAULT_ANSWERS[audience] || {}
  const merged = { ...defaults }
  for (const [key, value] of Object.entries(answers)) {
    if (value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)) merged[key] = value
  }
  return merged
}

// Weight of a step for this person: priorities ranked 1, 2, 3 score 3, 2, 1.
function priorityWeight(step, ranked) {
  let best = 0
  for (const domain of step.domains || []) {
    const at = ranked.indexOf(domain)
    if (at !== -1) best = Math.max(best, ranked.length - at)
  }
  return best
}

const LEVEL_ORDER = { starter: 0, solid: 1, advanced: 2 }
const HORIZON_RANK = { now: 0, next: 1, future: 2 }

// Minutes it takes this person. When an outside IT company handles IT and
// the step has a written request to send them, the owner's part is sending
// it and checking the reply.
export const HANDOFF_MINUTES = 10
export function minutesFor(step, answers = {}) {
  return answers.it === "provider" && step.handoff ? HANDOFF_MINUTES : step.minutes || 0
}

export function buildPath(audience, rawAnswers = {}) {
  const config = AUDIENCE_PATHS[audience]
  if (!config) return null
  const answers = withDefaults(audience, rawAnswers)
  const ranked = Array.isArray(answers[config.priorityKey]) ? answers[config.priorityKey] : []

  const included = []
  const setAside = []
  for (const step of config.steps) (applies(step, answers) ? included : setAside).push(step)

  const stageWeight = (stage) =>
    Math.max(0, ...included.filter((s) => s.stage === stage.id).map((s) => priorityWeight(s, ranked)))

  // Fixed stages keep their slots; rankable stages are re-dealt into the
  // remaining slots, highest priority weight first.
  const indexed = config.stages.map((stage, index) => ({ ...stage, index }))
  const rankable = indexed
    .filter((stage) => stage.rankable)
    .map((stage) => ({ stage, weight: stageWeight(stage) }))
    .sort((a, b) => b.weight - a.weight || a.stage.index - b.stage.index)
    .map(({ stage }) => stage)
  const ordered = indexed.map((stage) => (stage.rankable ? rankable.shift() : stage))

  const built = ordered.map((stage) => {
      // Fixed stages (foundation, industry) keep their authored order;
      // elsewhere starter comes before solid before advanced, today's
      // horizon before the Long View, then priority.
      const inStage = included.filter((s) => s.stage === stage.id)
      const sorted = stage.rankable
        ? inStage
            .map((s, i) => ({ s, i, w: priorityWeight(s, ranked) }))
            .sort(
              (a, b) =>
                (LEVEL_ORDER[a.s.level] ?? 1) - (LEVEL_ORDER[b.s.level] ?? 1) ||
                (HORIZON_RANK[a.s.horizon] ?? 0) - (HORIZON_RANK[b.s.horizon] ?? 0) ||
                b.w - a.w ||
                a.i - b.i
            )
            .map(({ s }) => s)
        : inStage
      const steps = respectRequires(sorted)
      return { id: stage.id, title: stage.title, summary: stage.summary, milestone: stage.milestone, steps }
    })
  placeAfterPrerequisites(built)
  const stages = built.filter((stage) => stage.steps.length)
  const steps = stages.flatMap((stage) => stage.steps)
  const inPlace = new Set(Array.isArray(answers.inPlace) ? answers.inPlace : [])
  const headStart = steps.filter((s) => (s.inPlaceKeys || []).some((k) => inPlace.has(k))).map((s) => s.id)

  return { audience, answers, ranked, stages, steps, setAside, headStart }
}

// Progress for a fresh path: quiz "already doing this" answers become "said".
export function initialProgress(path, at = new Date().toISOString()) {
  const progress = {}
  for (const id of path.headStart) progress[id] = { status: "said", at }
  return progress
}

// No mark, an Undo (status: null) or a skip all leave a step open.
function isOpen(step, progress) {
  const status = progress[step.id]?.status
  return !status || status === "skipped"
}

// Longest single step we'll put in a week, so week one never needs a whole
// weekend (the first pick is exempt: it's the one that matters most).
const WEEK_STEP_CAP = { home: 30, business: 90 }

// The steps for this week: at most three, never fewer than one.
// 1. the reset key: the account that resets everything (`weekOne` order);
// 2. the money habit: the zero-cost procedure that stops the costliest scams;
// 3. the best starter step for what they ranked first (for a business, the
//    first step for their industry).
// Done steps drop out and the next open steps in path order fill in. The
// first pick is always shown and doesn't count against the weekly budget;
// the rest must fit it, each within the per-step cap.
export function thisWeek(path, progress = {}) {
  const fresh = path.steps.filter((s) => isOpen(s, progress) && progress[s.id]?.status !== "skipped")
  const pool = fresh.length ? fresh : path.steps.filter((s) => isOpen(s, progress))
  if (!pool.length) return []

  const keyed = pool.filter((s) => s.weekOne).sort((a, b) => a.weekOne - b.weekOne)
  const top = path.ranked[0]
  const third =
    path.audience === "business"
      ? pool.find((s) => s.stage === "industry")
      : pool.find((s) => s.level === "starter" && top && (s.domains || []).includes(top) && !s.weekOne)
  const candidates = [...keyed.slice(0, 2), third, ...pool].filter(Boolean)

  const budget = TIME_BUDGET[path.answers.time] || 30
  const cap = WEEK_STEP_CAP[path.audience] || 30
  const picks = []
  let used = 0
  for (const s of candidates) {
    if (picks.length >= 3) break
    if (picks.includes(s)) continue
    const minutes = minutesFor(s, path.answers)
    if (picks.length && (minutes > cap || used + minutes > budget)) continue
    if (picks.length) used += minutes
    picks.push(s)
  }
  return picks
}

// "Where you stand": per outcome, how many of the path's steps are handled.
// Declined steps are the person's call; they're counted apart, not as done.
export function whereYouStand(path, progress = {}) {
  return OUTCOME_ORDER.map((key) => {
    const steps = path.steps.filter((s) => s.outcome === key)
    const handled = steps.filter((s) => ["said", "done", "checked"].includes(progress[s.id]?.status))
    const declined = steps.filter((s) => progress[s.id]?.status === "declined")
    // Suggest the simplest open step for this outcome, in path order.
    const open = steps.filter((s) => isOpen(s, progress))
    const next = ["starter", "solid", "advanced"].map((level) => open.find((s) => s.level === level)).find(Boolean) || open[0]
    return { ...OUTCOMES[key], total: steps.length, handled: handled.length, declined: declined.length, next }
  }).filter((row) => row.total > 0)
}

export function stageProgress(stage, progress = {}) {
  const handled = stage.steps.filter((s) => STATUS[progress[s.id]?.status]?.handled).length
  return { handled, total: stage.steps.length, complete: handled === stage.steps.length }
}

export function getStep(audience, id) {
  return AUDIENCE_PATHS[audience]?.steps.find((s) => s.id === id) || null
}
