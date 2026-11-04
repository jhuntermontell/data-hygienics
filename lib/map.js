// Home map: the logic behind the local-first map of a household's devices
// and the accounts that control them.
//
// Content is pure data under lib/content/map/ (categories, catalog, rules,
// future). This module matches models to the catalog, turns a stored map
// into findings and counts them per outcome. Relative imports only, no
// React, no DOM, so Node loads it (scripts/map-check.mjs and
// scripts/validate-content.mjs do).
//
// Custody rule (design/strategy/five-year-value-roadmap.md): the map itself
// lives in the browser, a saved file and paper. `resultFor` is the only shape
// that may ever leave the device: counts per outcome, an item count and a
// check date. There is no composite score anywhere, by design.
//
// Stored record (lib/map/storage.js, key dh.map.v1.<audience>):
//   { version: 1, audience, items: [item], handled: { [findingKey]: ISO },
//     checkedAt, exportedAt, createdAt, updatedAt }
//   item: { id, kind, category, label, brand, model, hardwareVersion,
//     catalogId, controlledBy (an account item id or null), answers: {},
//     source: "typed" | "catalog" | "photo" | "screenshot" | "csv", addedAt }
// Never stored: MAC or IP addresses, serial numbers, Wi-Fi names or
// passwords, email addresses, or a user id.
import { CATEGORIES, CATEGORY_GROUPS, DEVICE_RANK } from "./content/map/categories.js"
import { CATALOG } from "./content/map/catalog.js"
import { RULES } from "./content/map/rules.js"
import { FUTURE } from "./content/map/future.js"
import { OUTCOMES, OUTCOME_ORDER } from "./path.js"
import { isVisible } from "./content.js"

export { CATEGORIES, CATEGORY_GROUPS, DEVICE_RANK, RULES, OUTCOMES, OUTCOME_ORDER }

export const VERSION = 1
export const SEVERITY_ORDER = ["weak", "watch", "ok"]
export const ITEM_SOURCES = ["typed", "catalog", "photo", "screenshot", "csv"]
export const ITEM_KEYS = ["id", "kind", "category", "label", "brand", "model", "hardwareVersion", "catalogId", "controlledBy", "answers", "source", "addedAt"]

// Values that must never be stored: hardware (MAC) addresses, IPv4
// addresses and email addresses. Shared by storage, CSV import and summary.
export const FORBIDDEN_PATTERNS = [
  { name: "a hardware (MAC) address", re: /\b([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/ },
  { name: "a network (IP) address", re: /\b(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/ },
  { name: "an email address", re: /[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/i },
]
export function forbiddenIn(text) {
  if (typeof text !== "string") return null
  const hit = FORBIDDEN_PATTERNS.find((p) => p.re.test(text))
  return hit ? hit.name : null
}

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))
const CATEGORY_INDEX = byId(CATEGORIES)

export function categoriesFor(audience) {
  return CATEGORIES.filter((c) => (c.audience || []).includes(audience))
}

export function getCategory(id) {
  return CATEGORY_INDEX[id] || null
}

export function catalogFor(audience) {
  return CATALOG.filter((e) => (e.audience || []).includes(audience) && isVisible(e))
}

export function getCatalogEntry(id, audience = "home") {
  return catalogFor(audience).find((e) => e.id === id) || null
}

export function futureFor(audience) {
  return FUTURE.filter((f) => (f.audience || []).includes(audience) && isVisible(f)).sort((a, b) => a.date.localeCompare(b.date))
}

// ── Model matching ─────────────────────────────────────────────────────
// A trailing hardware version ("v2", "V1.6", "_V4", "(v3)", "hw ver 2.0").
// The "v" must not follow a letter, so "Apple TV 4" keeps its name.
const HARDWARE_SUFFIX = /[\s_\-(]*(?<![a-z])(?:hw\s*)?(?:v|ver\.?|version)\s*(\d+(?:\.\d+)*)\)?\s*$/i

// The hardware version printed after a model, kept separately: "R7000 v2" -> "2".
export function hardwareVersionOf(text) {
  const m = String(text || "").match(HARDWARE_SUFFIX)
  return m ? m[1] : null
}

const lightTokens = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(HARDWARE_SUFFIX, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)

// Lowercase, hardware suffix removed, spaces, dashes and punctuation removed:
// "Nighthawk R7000-100NAS v2" -> "nighthawkr7000100nas".
export function normalizeModel(text) {
  return lightTokens(text).join("")
}

// Does a run of consecutive tokens spell `compact` exactly? Keeps "r7000"
// from matching inside "r7000p".
function containsRun(tokens, compact) {
  for (let i = 0; i < tokens.length; i++) {
    let joined = ""
    for (let j = i; j < tokens.length && joined.length < compact.length; j++) {
      joined += tokens[j]
      if (joined === compact) return true
    }
  }
  return false
}

const namesOf = (entry) => [entry.model, `${entry.brand} ${entry.model}`, ...(entry.aliases || [])]

// { brand, model } -> { entry, confidence: "high" | "medium" } | null.
// high: the text is exactly the model or an alias (with or without brand).
// medium: a model name or alias appears whole inside the text. Longest name
// wins; a matching brand breaks ties. Free text that matches nothing is fine:
// the item is kept with no catalogId and reads as "unknown".
export function matchCatalog({ brand = "", model = "" } = {}, audience = "home", { entries } = {}) {
  const pool = entries || catalogFor(audience)
  const modelTokens = lightTokens(model)
  const fullTokens = lightTokens(`${brand} ${model}`)
  if (!modelTokens.length && !fullTokens.length) return null
  const exact = new Set([modelTokens.join(""), fullTokens.join("")].filter(Boolean))
  const brandKey = normalizeModel(brand)
  const brandMatches = (e) => Boolean(brandKey) && normalizeModel(e.brand) === brandKey

  let best = null
  for (const entry of pool) {
    for (const name of namesOf(entry)) {
      const key = normalizeModel(name)
      if (!key) continue
      let confidence = null
      if (exact.has(key)) confidence = "high"
      else if (key.length >= 3 && (containsRun(modelTokens, key) || containsRun(fullTokens, key))) confidence = "medium"
      if (!confidence) continue
      const score = (confidence === "high" ? 1000 : 0) + key.length * 2 + (brandMatches(entry) ? 1 : 0)
      if (!best || score > best.score) best = { entry, confidence, score }
    }
  }
  return best ? { entry: best.entry, confidence: best.confidence } : null
}

// ── Records ────────────────────────────────────────────────────────────
const now = () => new Date().toISOString()

export function emptyMap(audience) {
  const at = now()
  return { version: VERSION, audience, items: [], handled: {}, checkedAt: null, exportedAt: null, createdAt: at, updatedAt: at }
}

function shortId() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
  let out = ""
  const bytes = new Uint8Array(6)
  try {
    globalThis.crypto.getRandomValues(bytes)
  } catch {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  for (const b of bytes) out += alphabet[b % alphabet.length]
  return `it_${out}`
}

const str = (v) => (typeof v === "string" ? v.trim() : "")

export function newItem(fields = {}) {
  const category = getCategory(fields.category)
  return {
    id: fields.id || shortId(),
    kind: fields.kind || category?.kind || "device",
    category: str(fields.category) || "unknown",
    label: str(fields.label),
    brand: str(fields.brand),
    model: str(fields.model),
    hardwareVersion: str(fields.hardwareVersion) || hardwareVersionOf(fields.model) || "",
    catalogId: fields.catalogId || null,
    controlledBy: fields.controlledBy || null,
    answers: fields.answers && typeof fields.answers === "object" ? { ...fields.answers } : {},
    source: ITEM_SOURCES.includes(fields.source) ? fields.source : "typed",
    addedAt: fields.addedAt || now(),
  }
}

// ── Findings ───────────────────────────────────────────────────────────
// Brands that tell us nothing about who patches a box.
const GENERIC_BRANDS = new Set(["", "unknown", "generic", "noname", "nobrand", "none", "other", "android", "androidtv", "androidtvbox", "tvbox", "smarttvbox", "iptvbox"])
const isGenericBrand = (brand) => GENERIC_BRANDS.has(normalizeModel(brand))

function catalogFacts(item, audience) {
  const entry = item.catalogId ? getCatalogEntry(item.catalogId, audience) : null
  if (!entry) return { matched: false, supportStatus: "unknown", ispManaged: false, exploited: false }
  return { matched: true, supportStatus: entry.supportStatus, ispManaged: Boolean(entry.ispManaged), exploited: Boolean(entry.exploited) }
}

const answerIn = (answers, spec) =>
  Object.entries(spec || {}).every(([id, values]) => values.includes((answers || {})[id]))

function itemMatches(when, item, audience) {
  if (Array.isArray(when)) return when.some((w) => itemMatches(w, item, audience))
  const category = getCategory(item.category)
  if (when.kind && item.kind !== when.kind) return false
  if (when.category && !when.category.includes(item.category)) return false
  if (when.group && !when.group.includes(category?.group)) return false
  if (when.catalog) {
    const facts = catalogFacts(item, audience)
    for (const [key, expected] of Object.entries(when.catalog)) {
      if (Array.isArray(expected) ? !expected.includes(facts[key]) : facts[key] !== expected) return false
    }
  }
  if (when.answer && !answerIn(item.answers, when.answer)) return false
  if (when.controlledBy === "none" && item.controlledBy) return false
  if (when.brand === "generic" && !isGenericBrand(item.brand)) return false
  return true
}

function mapMatches(when, record) {
  if (Array.isArray(when)) return when.some((w) => mapMatches(w, record))
  const items = record.items || []
  const groupOf = (item) => getCategory(item.category)?.group
  if (when.minDevicesInGroups) {
    const { groups, min } = when.minDevicesInGroups
    if (items.filter((i) => i.kind === "device" && groups.includes(groupOf(i))).length < min) return false
  }
  if (when.routerAnswer && !items.some((i) => groupOf(i) === "network" && answerIn(i.answers, when.routerAnswer))) return false
  if (when.minAccounts !== undefined && items.filter((i) => i.kind === "account").length < when.minAccounts) return false
  if (when.exportedAt === "null" && record.exportedAt) return false
  return true
}

const findingKey = (ruleId, itemId) => `${ruleId}:${itemId || "map"}`

function toFinding(rule, item, record) {
  const key = findingKey(rule.id, item?.id)
  return {
    key,
    ruleId: rule.id,
    itemId: item?.id || null,
    outcome: rule.outcome,
    severity: rule.severity,
    title: rule.title,
    body: rule.body,
    stepId: (item && rule.stepIdByCategory?.[item.category]) || rule.stepId,
    handledAt: record.handled?.[key] || null,
  }
}

// Every rule against every item (or the whole map), in rule order. Within an
// `exclusive` group only the first matching rule fires per item. Sorted weak,
// then watch, then ok; ties keep rule order, then item order.
export function assess(record) {
  if (!record) return []
  const audience = record.audience || "home"
  const rules = RULES.filter((r) => (r.audience || []).includes(audience))
  const findings = []
  for (const item of record.items || []) {
    const taken = new Set()
    for (const rule of rules) {
      if (rule.scope !== "item") continue
      if (rule.exclusive && taken.has(rule.exclusive)) continue
      if (!itemMatches(rule.when, item, audience)) continue
      if (rule.exclusive) taken.add(rule.exclusive)
      findings.push(toFinding(rule, item, record))
    }
  }
  for (const rule of rules) if (rule.scope === "map" && mapMatches(rule.when, record)) findings.push(toFinding(rule, null, record))
  const ruleIndex = Object.fromEntries(rules.map((r, i) => [r.id, i]))
  const itemIndex = Object.fromEntries((record.items || []).map((it, i) => [it.id, i]))
  return findings
    .map((f, i) => ({ f, i }))
    .sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.f.severity) - SEVERITY_ORDER.indexOf(b.f.severity) ||
        ruleIndex[a.f.ruleId] - ruleIndex[b.f.ruleId] ||
        (itemIndex[a.f.itemId] ?? Infinity) - (itemIndex[b.f.itemId] ?? Infinity) ||
        a.i - b.i
    )
    .map(({ f }) => f)
}

// Per outcome: open findings counted by severity, handled ones apart. Counts
// only. Never a total, a percentage or a grade.
export function readout(findings = []) {
  return OUTCOME_ORDER.map((key) => {
    const mine = findings.filter((f) => f.outcome === key)
    const open = mine.filter((f) => !f.handledAt)
    return {
      ...OUTCOMES[key],
      weak: open.filter((f) => f.severity === "weak").length,
      watch: open.filter((f) => f.severity === "watch").length,
      ok: open.filter((f) => f.severity === "ok").length,
      handled: mine.filter((f) => f.handledAt).length,
    }
  })
}

// The only thing about a map that may sync to an account: counts per
// outcome, how many items, and when it was checked. No names, models or
// answers.
export function resultFor(record, findings = assess(record)) {
  const counts = {}
  for (const row of readout(findings)) counts[row.key] = { weak: row.weak, watch: row.watch, ok: row.ok, handled: row.handled }
  return { audience: record?.audience || "home", counts, items: (record?.items || []).length, checkedAt: record?.checkedAt || now() }
}
