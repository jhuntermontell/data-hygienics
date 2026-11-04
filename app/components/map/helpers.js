// Small shared helpers for the home map components. Plain module: no React
// state, no DOM, safe on the server.
import {
  CircleHelp,
  Cctv,
  HardDrive,
  KeyRound,
  Laptop,
  Lightbulb,
  Lock,
  Printer,
  Router,
  Smartphone,
  Speaker,
  Thermometer,
  Tv,
  Vault,
} from "lucide-react"
import { CATEGORY_GROUPS, OUTCOME_ORDER, SEVERITY_ORDER, categoriesFor, forbiddenIn, getCategory, matchCatalog } from "@/lib/map"

export const AUDIENCE = "home"

export const GROUP_ICONS = {
  account: KeyRound,
  network: Router,
  storage: HardDrive,
  camera: Cctv,
  lock: Lock,
  computer: Laptop,
  phone: Smartphone,
  safe: Vault,
  climate: Thermometer,
  tv: Tv,
  speaker: Speaker,
  printer: Printer,
  "plug-bulb": Lightbulb,
}

export const iconFor = (item) => GROUP_ICONS[getCategory(item?.category)?.group] || CircleHelp

export const NETWORK_CATEGORIES = ["router", "mesh", "isp-gateway"]

export function categoryLabel(id) {
  return getCategory(id)?.label || "Not sorted yet"
}

// "Living room router", else "Netgear Nighthawk R7000", else the category.
export function displayName(item) {
  if (!item) return ""
  if (item.label) return item.label
  const made = [item.brand, item.model].filter(Boolean).join(" ")
  return made || categoryLabel(item.category)
}

// Categories for this audience grouped for a <select>, in CATEGORY_GROUPS
// order. `kind` limits to "device" or "account".
export function groupedCategories(kind) {
  const cats = categoriesFor(AUDIENCE).filter((c) => !kind || c.kind === kind)
  return [...CATEGORY_GROUPS]
    .sort((a, b) => a.order - b.order)
    .map((g) => ({ ...g, categories: cats.filter((c) => c.group === g.id) }))
    .filter((g) => g.categories.length)
}

// An item still has something to ask: what it is, an unanswered question, or
// (for a device) which account controls it. answers.account === "none" is
// how "None / not sure" is remembered, so the walk-through doesn't ask again.
export function needsWalkThrough(item) {
  const category = getCategory(item.category)
  if (!category) return true
  if ((category.questions || []).some((q) => !item.answers?.[q.id])) return true
  if (item.kind === "device" && !item.controlledBy && item.answers?.account !== "none") return true
  return false
}

// Items in display order: CATEGORY_GROUPS order, then the order added.
// Items whose category isn't known yet come last.
export function itemsByGroup(items) {
  const groups = [...CATEGORY_GROUPS].sort((a, b) => a.order - b.order)
  const out = groups
    .map((g) => ({ id: g.id, label: g.label, items: items.filter((i) => getCategory(i.category)?.group === g.id) }))
    .filter((g) => g.items.length)
  const unsorted = items.filter((i) => !getCategory(i.category))
  if (unsorted.length) out.push({ id: "unknown", label: "Not sorted yet", items: unsorted })
  return out
}

// Weak first, then watch, then fine; within a severity, the outcome order.
export function sortFindings(findings) {
  return findings
    .map((f, i) => ({ f, i }))
    .sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.f.severity) - SEVERITY_ORDER.indexOf(b.f.severity) ||
        OUTCOME_ORDER.indexOf(a.f.outcome) - OUTCOME_ORDER.indexOf(b.f.outcome) ||
        a.i - b.i
    )
    .map(({ f }) => f)
}

// The worst open mark per item id: "weak" | "watch".
export function marksByItem(findings) {
  const marks = {}
  for (const f of findings) {
    if (!f.itemId || f.handledAt) continue
    if (f.severity === "weak") marks[f.itemId] = "weak"
    else if (f.severity === "watch" && marks[f.itemId] !== "weak") marks[f.itemId] = "watch"
  }
  return marks
}

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

// Shared classes. Buttons are at least 44px tall for thumbs.
export const BTN_PRIMARY =
  "inline-flex min-h-11 items-center justify-center gap-1.5 bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115E59] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
export const BTN_SECONDARY =
  "inline-flex min-h-11 items-center justify-center gap-1.5 border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
export const BTN_QUIET =
  "inline-flex min-h-11 items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
export const FIELD =
  "block w-full min-h-11 border border-[#CBD5E1] bg-white px-3 py-2 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0F766E]"
export const LABEL = "block text-sm font-semibold text-[#0F172A] mb-1.5"
export const chipClass = (on) =>
  `min-h-11 border px-3 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
    on ? "border-[#0F766E] bg-[#F0FDFA] font-semibold text-[#0F172A]" : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#0F766E] hover:text-[#0F172A]"
  }`

// A catalog match for a network item only: a router model typed as a camera
// shouldn't borrow the router's support facts.
export function matchFor(category, brand, model) {
  if (!NETWORK_CATEGORIES.includes(category) || !(brand || model)) return null
  const hit = matchCatalog({ brand, model }, AUDIENCE)
  return hit && NETWORK_CATEGORIES.includes(hit.entry.category) ? hit : null
}

// The first problem with what was typed, as a plain sentence, or null.
export function forbiddenMessage(...values) {
  for (const v of values) {
    const hit = forbiddenIn(v)
    if (hit) return `That looks like ${hit}. The map never keeps one, so leave it out.`
  }
  return null
}
