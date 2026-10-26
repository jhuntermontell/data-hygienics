#!/usr/bin/env node
// Content validator for the research library (lib/content/**).
//
//   node scripts/validate-content.mjs           errors fail, warnings print
//   node scripts/validate-content.mjs --strict  warnings fail too
//
// Checks: required fields, unique slugs, date formats, every citation marker
// and sourceId resolves, published entries rest on tier 1-2 sources, related
// links resolve, no tracking/affiliate parameters, duplicate source ids
// agree, uncited statistics, banned tone words, and stray "SI" usage.
// Verdicts (/check) add: no statistics or markers above the fold, Path
// chips that land on a real quiz answer, official-only "who to tell" links,
// and no detection claims. Path steps add: optional `after`, `sayThis` and
// `cadence` fields, and step ids unique across both audiences.

import { fileURLToPath, pathToFileURL } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href)

const strict = process.argv.includes("--strict")
const errors = []
const warnings = []
const err = (where, msg) => errors.push(`${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`${where}: ${msg}`)

const { SOURCES, SOURCE_GROUPS } = await load("lib/sources.js")
const { ALL_THREATS } = await load("lib/threats.js")
const { ALL_GUIDES } = await load("lib/guides.js")
const { ALL_EXPLAINERS, PRINCIPLES } = await load("lib/sovereignty.js")
const { ALL_VERDICTS } = await load("lib/verdicts.js")
const { ALL_TOOLS, TOOLKIT_CATEGORIES } = await load("lib/toolkit.js")
const { GLOSSARY } = await load("lib/content/glossary.js")
const { WHAT_CHANGED, LOSSES_BY_YEAR } = await load("lib/content/home.js")
const { CONTROLS } = await load("lib/controls.js")
const { CITATION_FIELD_ORDER, CITATION_MARKER } = await load("lib/content.js")

const HAS_MARKER = /\[\^[a-z0-9][a-z0-9-]*\]/
const TRACKING = /[?&](utm_[a-z]+|ref|aff|aff_?id|affid|affiliate|tag|irclickid|clickid|gclid|fbclid|msclkid|partner|via)=|\/ref=/i
const DATE_DAY = /^\d{4}-\d{2}-\d{2}$/
const DATE_MONTH = /^\d{4}-\d{2}$/
const BANNED = [
  /\blurking\b/i,
  /\bunprecedented\b/i,
  /rapidly evolving/i,
  /\b(we|this|it will) guarantee/i,
  /\bguaranteed (safe|secure|protection|results)\b/i,
  /100% (safe|secure|protected)/i,
  /you will be hacked/i,
]
const SOURCE_TYPES = ["government", "standards", "regulation", "incident-report", "research", "vendor-doc", "journalism"]
const SI_ALLOWED = new Set(["ai-or-si-what-we-call-it"])

// ── Sources ──────────────────────────────────────────────────────────────
const seenUrl = {}
for (const [group, sources] of Object.entries(SOURCE_GROUPS)) {
  for (const [id, s] of Object.entries(sources)) {
    const where = `source ${id} (${group})`
    if (s.id !== id) err(where, `id field "${s.id}" does not match key`)
    for (const f of ["label", "publisher", "url", "published", "type", "tier", "accessed"]) {
      if (s[f] === undefined || s[f] === "") err(where, `missing ${f}`)
    }
    if (s.url && !/^https:\/\//.test(s.url)) warn(where, `non-https url ${s.url}`)
    if (s.url && TRACKING.test(s.url)) err(where, `tracking parameter in url ${s.url}`)
    if (s.published && !DATE_DAY.test(s.published) && !DATE_MONTH.test(s.published) && !/^\d{4}$/.test(s.published))
      err(where, `bad published date ${s.published}`)
    if (s.accessed && !DATE_DAY.test(s.accessed)) err(where, `bad accessed date ${s.accessed}`)
    if (s.type && !SOURCE_TYPES.includes(s.type)) err(where, `unknown type ${s.type}`)
    if (s.tier && ![1, 2, 3].includes(s.tier)) err(where, `tier must be 1, 2, or 3`)
    if (seenUrl[id] && seenUrl[id].url !== s.url)
      err(where, `duplicate id with different url (also in ${seenUrl[id].group}): ${s.url} vs ${seenUrl[id].url}`)
    seenUrl[id] = seenUrl[id] || { url: s.url, group }
  }
}

// ── Entries ──────────────────────────────────────────────────────────────
const SHARED = ["kind", "slug", "title", "metaTitle", "metaDescription", "audience", "pillars", "tldr", "datePublished", "lastReviewed", "status", "faqs", "sourceIds", "related"]
const BY_KIND = {
  threat: ["severity", "aiRole", "whatItIs", "howItLooks", "howItGetsIn", "whatStopsIt", "ifItHappens", "stats"],
  "industry-brief": ["industry", "content"],
  guide: ["timeToComplete", "difficulty", "why", "steps"],
  explainer: ["question", "shortAnswer", "sections", "actions"],
  verdict: ["chip", "verdict", "nextTwoMinutes", "whoToTell", "sayThis", "pathChip", "why"],
}
// Verdict fields shown above the fold: plain instructions, never figures.
const VERDICT_ABOVE_FOLD = ["chip", "tldr", "verdict", "nextTwoMinutes", "whoToTell", "sayThis", "pathChip"]
// Verdicts give a procedure, never a detection claim.
const VERDICT_BANNED = [/\b(detect|spot the fake|tell if it's fake)\b/i]

const entries = [...ALL_THREATS, ...ALL_GUIDES, ...ALL_EXPLAINERS, ...ALL_VERDICTS]
const slugIndex = {
  threats: new Set(ALL_THREATS.map((e) => e.slug)),
  guides: new Set(ALL_GUIDES.map((e) => e.slug)),
  explainers: new Set(ALL_EXPLAINERS.map((e) => e.slug)),
  verdicts: new Set(ALL_VERDICTS.map((e) => e.slug)),
  toolkit: new Set(ALL_TOOLS.map((t) => t.slug)),
  glossary: new Set(GLOSSARY.map((g) => g.slug)),
  controls: new Set(CONTROLS.map((c) => c.slug)),
}
const toolkitCategories = new Set(TOOLKIT_CATEGORIES.map((c) => c.slug))

function walkStrings(value, fn, trail = "") {
  if (typeof value === "string") fn(value, trail)
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, fn, `${trail}[${i}]`))
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) walkStrings(v, fn, trail ? `${trail}.${k}` : k)
}

function markersIn(value) {
  const ids = []
  walkStrings(value, (s) => {
    for (const m of s.matchAll(CITATION_MARKER)) ids.push(m[1])
  })
  return ids
}

// A sentence "has a statistic" if it contains a %, a currency amount, or a
// number of 2+ digits that is not just a year.
function uncitedStats(text) {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\b([ap])\.m\./gi, "$1m")
  return plain
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => {
      const scrubbed = sentence
        .replace(CITATION_MARKER, "")
        .replace(/\b(19|20)\d{2}(-\d{2}){0,2}\b/g, "")
        .replace(/\b(ages?\s+)?\d{2}\s*(\+|and older|or older|and over|or over|and up)/gi, "")
        .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{3}-[A-Z]+-\d+\b/g, "")
        .replace(/\b(Microsoft|Office|Google Workspace|Windows|iOS|Android|macOS)\s+\d+/g, "")
        // Names of rules, standards and forms, including lists like
        // "FIPS 203, 204 and 205" and "DFARS 7012, 7019 and 7020".
        .replace(
          /\b(Article|Art\.|Section|SP|NIST|ISO\/IEC|CIS|Control|Top|Part|CFR|IG|IR|Rules?|Publications?|FIPS|DFARS|FAR|Order|Level|Form)\s*[\d.-]+(?:(?:,\s*|,?\s+and\s+|\s*\/\s*)[\d.-]+)*/gi,
          ""
        )
        // The 988 crisis line, "over 21", "112-bit", EU regulation numbers,
        // clock times in stories ("6:52 am").
        // 7726 is the carriers' SPAM short code for forwarding scam texts.
        .replace(/\b988\b|\b7726\b|\bover \d{2}\b(?!\s?(%|percent|million|billion|thousand))|\b\d+-bit\b|\(EU\) \/\d+|\b\d{1,2}:\d{2}\b/gi, "")
      const hasStat = /\d+(\.\d+)?\s?%|[$€£]\s?\d|\b\d{2,}\b|\b\d+(\.\d+)?\s?(million|billion|thousand)\b/i.test(scrubbed)
      return hasStat && !HAS_MARKER.test(sentence)
    })
}

const allSlugs = {}
for (const e of entries) {
  const where = `${e.kind || "?"} ${e.slug || "?"}`
  for (const f of [...SHARED, ...(BY_KIND[e.kind] || [])]) {
    if (e[f] === undefined) err(where, `missing ${f}`)
  }
  if (!BY_KIND[e.kind]) err(where, `unknown kind ${e.kind}`)
  if (allSlugs[e.slug]) err(where, `slug collides with ${allSlugs[e.slug]}`)
  allSlugs[e.slug] = where
  if (e.datePublished && !DATE_DAY.test(e.datePublished)) err(where, `datePublished must be YYYY-MM-DD`)
  if (e.lastReviewed && !DATE_MONTH.test(e.lastReviewed)) err(where, `lastReviewed must be YYYY-MM`)
  if (!["draft", "published"].includes(e.status)) err(where, `status must be draft or published`)
  if (e.metaTitle && e.metaTitle.length > 60) warn(where, `metaTitle is ${e.metaTitle.length} chars (max 60)`)
  if (e.metaDescription && e.metaDescription.length > 155)
    warn(where, `metaDescription is ${e.metaDescription.length} chars (max 155)`)
  for (const a of e.audience || []) if (!["home", "business"].includes(a)) err(where, `bad audience ${a}`)

  // Citations
  const cited = []
  for (const field of CITATION_FIELD_ORDER[e.kind] || []) {
    cited.push(...markersIn(e[field]))
  }
  for (const stat of e.stats || []) {
    if (!stat.sourceId) err(where, `stat "${stat.figure}" has no sourceId`)
    else cited.push(stat.sourceId)
    if (!stat.locator) warn(where, `stat "${stat.figure}" has no locator`)
  }
  const listed = new Set(e.sourceIds || [])
  for (const id of new Set(cited)) {
    if (!SOURCES[id]) err(where, `cites unknown source ${id}`)
    if (!listed.has(id)) warn(where, `cites ${id} but it is missing from sourceIds`)
  }
  for (const id of listed) if (!SOURCES[id]) err(where, `sourceIds has unknown source ${id}`)
  for (const field of ["faqs", "metaDescription", "title"]) {
    if (markersIn(e[field]).length) err(where, `${field} must not contain citation markers`)
  }

  const strong = [...listed].filter((id) => SOURCES[id] && SOURCES[id].tier <= 2)
  if (strong.length < 2) (e.status === "published" ? err : warn)(where, `only ${strong.length} tier 1-2 sources`)

  // stats[] cite through their sourceId field, not inline markers. A
  // verdict's tldr is checked more strictly below (no figures at all).
  for (const field of (CITATION_FIELD_ORDER[e.kind] || []).filter((f) => f !== "stats" && !(e.kind === "verdict" && f === "tldr"))) {
    walkStrings(e[field], (s, trail) => {
      for (const sentence of uncitedStats(s)) warn(where, `uncited statistic in ${field}${trail ? "." + trail : ""}: "${sentence.slice(0, 110)}"`)
    })
  }

  // Related links
  for (const [type, slugs] of Object.entries(e.related || {})) {
    if (!slugIndex[type]) {
      err(where, `unknown related type ${type}`)
      continue
    }
    for (const slug of slugs) if (!slugIndex[type].has(slug)) err(where, `related.${type} -> missing ${slug}`)
  }
  for (const item of e.whatStopsIt || []) {
    if (item.controlSlug && !slugIndex.controls.has(item.controlSlug)) err(where, `whatStopsIt control ${item.controlSlug} missing`)
    if (item.guideSlug && !slugIndex.guides.has(item.guideSlug)) err(where, `whatStopsIt guide ${item.guideSlug} missing`)
    if (item.toolkitCategory && !toolkitCategories.has(item.toolkitCategory))
      err(where, `whatStopsIt toolkitCategory ${item.toolkitCategory} missing`)
  }
  for (const list of Object.values(e.actions || {}))
    for (const a of list) if (a.guideSlug && !slugIndex.guides.has(a.guideSlug)) err(where, `action guide ${a.guideSlug} missing`)

  // Tone and terminology
  walkStrings(e, (s, trail) => {
    for (const re of BANNED) if (re.test(s)) warn(where, `tone: ${re} in ${trail}`)
    if (/\bSI\b/.test(s.replace(CITATION_MARKER, "")) && !SI_ALLOWED.has(e.slug)) warn(where, `"SI" used in ${trail}`)
    if (/\bMSPs?\b/.test(s)) err(where, `"MSP" in ${trail}; say "IT provider"`)
    if (/coalition|cowbell|travelers|beazley/i.test(s)) warn(where, `insurance carrier name in ${trail}`)
    if (e.kind === "verdict") for (const re of VERDICT_BANNED) if (re.test(s)) warn(where, `detection claim: ${re} in ${trail}`)
  })
}

// Internal links inside industry-brief HTML must point at real, known pages.
const ROUTE_SETS = {
  threats: slugIndex.threats,
  guides: slugIndex.guides,
  "digital-sovereignty": slugIndex.explainers,
  controls: slugIndex.controls,
}
for (const e of entries.filter((x) => x.kind === "industry-brief")) {
  for (const m of (e.content || "").matchAll(/href="(\/[^"#?]*)/g)) {
    const [, section, slug] = m[1].split("/")
    if (slug && ROUTE_SETS[section] && !ROUTE_SETS[section].has(slug))
      err(`industry-brief ${e.slug}`, `content links to missing ${m[1]}`)
    if (slug && ROUTE_SETS[section] && e.status === "published") {
      const target = [...ALL_THREATS, ...ALL_GUIDES, ...ALL_EXPLAINERS].find((x) => x.slug === slug)
      if (target && target.status !== "published") err(`industry-brief ${e.slug}`, `published brief links to draft ${m[1]}`)
    }
  }
}

// Controls link to threat pages; those slugs must exist.
for (const c of CONTROLS) {
  for (const slug of c.relatedThreats || [])
    if (!slugIndex.threats.has(slug)) err(`control ${c.slug}`, `relatedThreats -> missing ${slug}`)
}

// Citation markers outside article entries (glossary, toolkit, homepage).
function checkMarkers(where, value) {
  for (const id of markersIn(value)) if (!SOURCES[id]) err(where, `marker cites unknown source ${id}`)
}

// ── Toolkit ──────────────────────────────────────────────────────────────
const toolSlugs = new Set()
for (const t of ALL_TOOLS) {
  const where = `tool ${t.slug}`
  for (const f of ["slug", "name", "category", "audience", "whatItsFor", "whyWeLikeIt", "cost", "url", "status"])
    if (t[f] === undefined) err(where, `missing ${f}`)
  if (toolSlugs.has(t.slug)) err(where, "duplicate slug")
  checkMarkers(where, t)
  toolSlugs.add(t.slug)
  if (!toolkitCategories.has(t.category)) err(where, `unknown category ${t.category}`)
  if (t.url && TRACKING.test(t.url)) err(where, `tracking/affiliate parameter in url ${t.url}`)
  for (const id of t.sourceIds || []) if (!SOURCES[id]) err(where, `unknown source ${id}`)
  if (t.pricingVerified && !DATE_DAY.test(t.pricingVerified)) err(where, "pricingVerified must be YYYY-MM-DD")
}

// ── Glossary ─────────────────────────────────────────────────────────────
const termSlugs = new Set()
for (const g of GLOSSARY) {
  const where = `glossary ${g.slug}`
  for (const f of ["term", "slug", "shortDef", "longDef"]) if (!g[f]) err(where, `missing ${f}`)
  if (termSlugs.has(g.slug)) err(where, "duplicate slug")
  checkMarkers(where, g)
  termSlugs.add(g.slug)
  if (g.shortDef && g.shortDef.split(/\s+/).length > 30) warn(where, `shortDef is ${g.shortDef.split(/\s+/).length} words (max 30)`)
  for (const id of g.sourceIds || []) if (!SOURCES[id]) err(where, `unknown source ${id}`)
  for (const [type, slugs] of Object.entries(g.seeAlso || {})) {
    if (!slugIndex[type]) {
      err(where, `unknown seeAlso type ${type}`)
      continue
    }
    for (const slug of slugs) if (!slugIndex[type].has(slug)) err(where, `seeAlso.${type} -> missing ${slug}`)
  }
}

// ── Homepage facts and principles ────────────────────────────────────────
for (const [i, item] of (WHAT_CHANGED || []).entries()) {
  const where = `WHAT_CHANGED[${i}]`
  if (!item.text || !item.sourceId) err(where, "needs text and sourceId")
  checkMarkers(where, item)
  if (item.sourceId && !SOURCES[item.sourceId]) err(where, `unknown source ${item.sourceId}`)
  else if (item.sourceId && SOURCES[item.sourceId].tier > 2) err(where, "homepage facts need a tier 1-2 source")
}
// The homepage losses chart: every point and the hero resolve to a tier 1-2
// source with a page locator; years run ascending with no repeats.
{
  const chart = LOSSES_BY_YEAR || { points: [] }
  const sourced = (where, item) => {
    if (!item.sourceId || !SOURCES[item.sourceId]) err(where, `unknown source ${item.sourceId}`)
    else if (SOURCES[item.sourceId].tier > 2) err(where, "homepage facts need a tier 1-2 source")
    if (!item.locator) err(where, "needs a locator")
  }
  let lastYear = -Infinity
  for (const [i, pt] of (chart.points || []).entries()) {
    const where = `LOSSES_BY_YEAR.points[${i}]`
    sourced(where, pt)
    if (typeof pt.value !== "number" || !Number.isFinite(pt.value)) err(where, "value must be a number")
    if (!(pt.year > lastYear)) err(where, `year ${pt.year} must be after ${lastYear} (ascending, unique)`)
    lastYear = pt.year
  }
  if (!chart.hero?.figure || !chart.hero?.text) err("LOSSES_BY_YEAR.hero", "needs figure and text")
  if (chart.hero) sourced("LOSSES_BY_YEAR.hero", chart.hero)
  walkStrings(chart, (s, trail) => {
    for (const re of BANNED) if (re.test(s)) warn("LOSSES_BY_YEAR", `tone: ${re} in ${trail}`)
  })
}
for (const [i, p] of (PRINCIPLES || []).entries()) if (!p.title || !p.detail) err(`PRINCIPLES[${i}]`, "needs title and detail")

// ── Clear Path (lib/content/path) ────────────────────────────────────────
// Steps carry no citations, so they carry no statistics: numbers about
// threats live in the sourced library entries the steps link to.
const { AUDIENCE_PATHS, QUIZZES } = await load("lib/path.js")
const { PATH_CONTENT } = await load("lib/content/path/long-view.js")
const { resolvePathLink } = await load("lib/path-links.js")
const PATH_LINK_KINDS = {
  guide: slugIndex.guides,
  threat: slugIndex.threats,
  explainer: slugIndex.explainers,
  glossary: slugIndex.glossary,
  control: slugIndex.controls,
  toolkit: toolkitCategories,
  tool: slugIndex.toolkit,
}
const PATH_ENUMS = {
  level: ["starter", "solid", "advanced"],
  horizon: ["now", "next", "future"],
  outcome: ["break-in", "fool", "recover", "control"],
  type: ["setup", "habit", "conversation", "rehearsal", "decision"],
}
const CADENCES = ["once", "ongoing"]
const stepAudience = {}
let pathSteps = 0
for (const [audience, config] of Object.entries(AUDIENCE_PATHS)) {
  const quiz = QUIZZES[audience] || []
  const answers = Object.fromEntries(quiz.map((q) => [q.id, new Set(q.options.map((o) => o.value))]))
  const checkWhen = (where, when) => {
    for (const clause of [].concat(when || [])) {
      for (const [id, values] of Object.entries(clause)) {
        if (!answers[id]) err(where, `when/unless uses unknown question ${id}`)
        else for (const v of values) if (!answers[id].has(v)) err(where, `when/unless ${id} has unknown answer ${v}`)
      }
    }
  }
  const quizWhere = `path ${audience} quiz`
  const qids = new Set()
  for (const q of quiz) {
    if (qids.has(q.id)) err(quizWhere, `duplicate question ${q.id}`)
    qids.add(q.id)
    const values = q.options.map((o) => o.value)
    if (new Set(values).size !== values.length) err(quizWhere, `${q.id} has duplicate option values`)
    checkWhen(`${quizWhere} ${q.id}`, q.when)
  }

  const stageIds = new Set(config.stages.map((s) => s.id))
  const ids = new Set(config.steps.map((s) => s.id))
  const priorityKey = config.priorityKey
  const seen = new Set()
  for (const step of config.steps) {
    pathSteps++
    const where = `path ${audience} ${step.id}`
    for (const f of ["id", "stage", "title", "why", "do", "check", "minutes", "level", "horizon", "outcome", "type", "links"])
      if (step[f] === undefined || step[f] === "") err(where, `missing ${f}`)
    if (seen.has(step.id)) err(where, "duplicate step id")
    seen.add(step.id)
    // Step ids are public URLs (/steps/<id>), so they must be unique across
    // both audiences, not just within one.
    if (stepAudience[step.id] && stepAudience[step.id] !== audience)
      err(where, `step id also used in the ${stepAudience[step.id]} path`)
    stepAudience[step.id] = stepAudience[step.id] || audience
    // Optional fields added in milestone 1: "what is true after" and the
    // if-then line are plain sentences with no figures; cadence overrides
    // the label derived from `type`.
    for (const f of ["after", "sayThis"]) {
      if (step[f] === undefined) continue
      if (typeof step[f] !== "string" || !step[f].trim()) {
        err(where, `${f} must be a non-empty string`)
        continue
      }
      if (markersIn(step[f]).length) err(where, `${f} must not contain citation markers`)
      for (const sentence of uncitedStats(step[f])) err(where, `statistic in ${f} (path steps carry no sources): "${sentence.slice(0, 110)}"`)
    }
    if (step.cadence !== undefined && !CADENCES.includes(step.cadence)) err(where, `cadence must be one of ${CADENCES.join(", ")}`)
    if (!stageIds.has(step.stage)) err(where, `unknown stage ${step.stage}`)
    for (const [f, allowed] of Object.entries(PATH_ENUMS)) if (step[f] && !allowed.includes(step[f])) err(where, `${f} must be one of ${allowed.join(", ")}`)
    for (const r of [...(step.requires || []), ...(step.extends ? [step.extends] : [])])
      if (!ids.has(r)) err(where, `requires/extends missing step ${r}`)
    for (const d of step.domains || []) if (!answers[priorityKey]?.has(d)) err(where, `domain ${d} is not a ${priorityKey} answer`)
    for (const k of step.inPlaceKeys || []) if (!answers.inPlace?.has(k)) err(where, `inPlaceKey ${k} is not an inPlace answer`)
    checkWhen(where, step.when)
    checkWhen(where, step.unless)
    for (const item of step.do || []) if (typeof item === "object") checkWhen(where, item.when)
    for (const key of step.links || []) {
      const at = key.indexOf(":")
      const kind = key.slice(0, at)
      const slug = key.slice(at + 1)
      if (kind === "page") {
        if (!resolvePathLink(key)) err(where, `link ${key} is not a known page`)
      } else if (!PATH_LINK_KINDS[kind]) err(where, `unknown link kind ${kind}`)
      else if (!PATH_LINK_KINDS[kind].has(slug)) err(where, `link ${key} -> missing ${slug}`)
    }
    walkStrings(step, (s, trail) => {
      for (const re of BANNED) if (re.test(s)) warn(where, `tone: ${re} in ${trail}`)
      if (/\bSI\b/.test(s)) warn(where, `"SI" used in ${trail}`)
      if (/\bMSPs?\b/.test(s)) err(where, `"MSP" in ${trail}; say "IT provider"`)
      if (/coalition|cowbell|travelers|beazley/i.test(s)) warn(where, `insurance carrier name in ${trail}`)
    })
    for (const field of ["why", "do", "check", "detail", "simple", "story", "newcomer", "thread"])
      walkStrings(step[field], (s) => {
        for (const sentence of uncitedStats(s)) warn(where, `statistic in ${field} (path steps carry no sources): "${sentence.slice(0, 110)}"`)
      })
  }
  for (const e of PATH_CONTENT[audience]?.endStates || [])
    for (const id of e.stepIds) if (!ids.has(id)) err(`path ${audience} end state ${e.id}`, `missing step ${id}`)
}

// ── Verdicts (/check) ────────────────────────────────────────────────────
// Shared entry checks ran above (fields, citations, tier 1-2 sources, tone).
// These are the verdict-only rules: the first screen is a procedure, so it
// carries no statistics or markers; the Path chip lands on a real first
// answer; "who to tell" links only to official (.gov) addresses.
const OFFICIAL_HREF = /^(https:\/\/([a-z0-9-]+\.)+gov(\/[^\s]*)?|mailto:[^@\s]+@([a-z0-9-]+\.)+gov)$/i
for (const v of ALL_VERDICTS) {
  const where = `verdict ${v.slug || "?"}`
  for (const field of VERDICT_ABOVE_FOLD) {
    if (markersIn(v[field]).length) err(where, `${field} must not contain citation markers (sources go in why and stats)`)
    walkStrings(v[field], (s, trail) => {
      for (const sentence of uncitedStats(s))
        err(where, `statistic above the fold in ${field}${trail ? "." + trail : ""}: "${sentence.slice(0, 110)}"`)
    })
  }
  for (const f of ["chip", "verdict", "sayThis"]) if (v[f] !== undefined && (typeof v[f] !== "string" || !v[f].trim())) err(where, `${f} must be a non-empty string`)

  const steps = v.nextTwoMinutes
  if (!Array.isArray(steps) || steps.length < 3 || steps.length > 4) err(where, "nextTwoMinutes needs 3 to 4 items")
  else steps.forEach((s, i) => typeof s === "string" && s.trim() ? null : err(where, `nextTwoMinutes[${i}] must be a non-empty string`))

  if (!Array.isArray(v.whoToTell) || !v.whoToTell.length) err(where, "whoToTell needs at least one item")
  for (const [i, item] of (Array.isArray(v.whoToTell) ? v.whoToTell : []).entries()) {
    if (!item?.label) err(where, `whoToTell[${i}] needs a label`)
    if (item?.href != null && !OFFICIAL_HREF.test(item.href)) err(where, `whoToTell[${i}].href must be an official .gov address or null: ${item.href}`)
  }

  const chip = v.pathChip || {}
  const quiz = QUIZZES[chip.audience]
  if (!quiz) err(where, `pathChip.audience must be one of ${Object.keys(QUIZZES).join(", ")}`)
  else {
    const first = quiz[0]
    if (!first.options.some((o) => o.value === chip.start)) err(where, `pathChip.start "${chip.start}" is not an answer to the ${chip.audience} quiz's first question (${first.id})`)
  }
  if (!chip.label) err(where, "pathChip needs a label")
  if (chip.audience && !(v.audience || []).includes(chip.audience)) warn(where, `pathChip.audience ${chip.audience} is not one of the verdict's audiences`)
}

// ── Report ───────────────────────────────────────────────────────────────
const counts = `${entries.length} entries (${ALL_VERDICTS.length} verdicts), ${ALL_TOOLS.length} tools, ${GLOSSARY.length} terms, ${Object.keys(SOURCES).length} sources, ${pathSteps} path steps`
for (const w of warnings) console.log(`warn  ${w}`)
for (const e of errors) console.log(`ERROR ${e}`)
console.log(`\n${counts}: ${errors.length} errors, ${warnings.length} warnings`)
process.exit(errors.length || (strict && warnings.length) ? 1 : 0)
