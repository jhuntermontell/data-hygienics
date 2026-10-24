// Shared helpers for researched content (threats, guides, explainers,
// toolkit, glossary). Content modules under lib/content/ are pure data; this
// file holds the logic that turns them into pages.
//
// Citations: prose fields carry inline markers like "[^fbi-ic3-2025]".
// citationOrder() walks an entry in the same order the article renderers
// lay it out and numbers each source by first appearance, so the
// superscripts and the SourceList agree. Any id listed in entry.sourceIds
// but never cited inline is appended at the end.

export const CITATION_MARKER = /\[\^([a-z0-9][a-z0-9-]*)\]/g

// Render order per kind. Article renderers must lay fields out in this order
// (FAQs never carry markers).
export const CITATION_FIELD_ORDER = {
  threat: ["tldr", "whatItIs", "stats", "howItLooks", "howItGetsIn", "whatStopsIt", "ifItHappens"],
  "industry-brief": ["tldr", "content"],
  guide: ["tldr", "why", "steps", "limits"],
  explainer: ["tldr", "shortAnswer", "sections", "actions", "stance"],
}

function collectIds(value, out) {
  if (typeof value === "string") {
    for (const match of value.matchAll(CITATION_MARKER)) out.push(match[1])
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectIds(v, out))
  } else if (value && typeof value === "object") {
    if (typeof value.sourceId === "string") out.push(value.sourceId)
    Object.values(value).forEach((v) => collectIds(v, out))
  }
}

// Returns { ids: [...ordered unique ids], number: { [id]: n } }.
export function citationOrder(entry) {
  const fields = CITATION_FIELD_ORDER[entry.kind] || []
  const found = []
  fields.forEach((field) => collectIds(entry[field], found))
  ;(entry.sourceIds || []).forEach((id) => found.push(id))

  const ids = []
  const number = {}
  for (const id of found) {
    if (number[id]) continue
    ids.push(id)
    number[id] = ids.length
  }
  return { ids, number }
}

// Split a prose string into text and citation segments for React rendering.
export function splitCitations(text) {
  if (typeof text !== "string" || !text) return []
  const segments = []
  let last = 0
  for (const match of text.matchAll(CITATION_MARKER)) {
    if (match.index > last) segments.push({ type: "text", value: text.slice(last, match.index) })
    segments.push({ type: "cite", id: match[1] })
    last = match.index + match[0].length
  }
  if (last < text.length) segments.push({ type: "text", value: text.slice(last) })
  return segments
}

// Remove markers, for meta descriptions, JSON-LD, and card excerpts.
export function stripCitations(text) {
  if (typeof text !== "string") return ""
  return text.replace(CITATION_MARKER, "").replace(/\s+([.,;:!?])/g, "$1").trim()
}

// Industry briefs keep hand-authored HTML. Markers in that HTML become
// numbered superscript links. Ids are restricted to [a-z0-9-] by the marker
// regex, so nothing user-controlled reaches the output.
export function htmlWithCitations(html, number) {
  if (typeof html !== "string") return ""
  return html.replace(CITATION_MARKER, (_, id) =>
    number[id]
      ? `<sup class="cite"><a href="#src-${id}" aria-label="Source ${number[id]}">${number[id]}</a></sup>`
      : ""
  )
}

// "2026-10" -> "October 2026"
export function formatMonth(yyyymm) {
  if (!yyyymm) return ""
  const date = new Date(`${yyyymm.slice(0, 7)}-01T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return yyyymm
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" })
}

// "2026-10-23" -> "October 23, 2026"; "2026-10" -> "October 2026"
export function formatDate(value) {
  if (!value) return ""
  if (/^\d{4}-\d{2}$/.test(value)) return formatMonth(value)
  const date = new Date(`${value}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
}

export const KIND_LABELS = {
  threat: "Threat",
  "industry-brief": "Industry brief",
  guide: "Guide",
  explainer: "Explainer",
  tool: "Tool",
}

export const AUDIENCE_LABELS = {
  home: "Home",
  business: "Business",
}

export const SEVERITY_LABELS = {
  high: "High impact",
  medium: "Moderate impact",
  emerging: "Emerging",
}

export const AI_ROLE_LABELS = {
  "ai-enabled": "Attackers use AI",
  "ai-targeted": "Targets AI tools",
  "ai-native": "Born with AI",
}

// Canonical URL path for any content entry.
export function hrefFor(entry) {
  switch (entry?.kind) {
    case "threat":
    case "industry-brief":
      return `/threats/${entry.slug}`
    case "guide":
      return `/guides/${entry.slug}`
    case "explainer":
      return `/digital-sovereignty/${entry.slug}`
    case "tool":
      return `/toolkit#tool-${entry.slug}`
    default:
      return "/"
  }
}

export function glossaryHref(slug) {
  return `/glossary#term-${slug}`
}

export function controlHref(slug) {
  return `/controls/${slug}`
}

// Drafts render only when NEXT_PUBLIC_SHOW_DRAFTS=1 (local review).
export function isVisible(entry) {
  return entry?.status === "published" || process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1"
}
