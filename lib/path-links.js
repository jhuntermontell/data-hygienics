// Server-side resolution of Clear Path step links. Steps name what they link
// to with short keys so content stays import-free:
//   "guide:<slug>"  "threat:<slug>"  "explainer:<slug>"  "glossary:<slug>"
//   "control:<slug>"  "toolkit:<category-slug>"  "tool:<slug>"  "page:<path>"
// Drafts and unknown slugs drop out, so a path never links to a 404.
// scripts/validate-content.mjs checks every key against the library.
import { getGuideBySlug } from "./guides.js"
import { getThreatBySlug } from "./threats.js"
import { getExplainerBySlug } from "./sovereignty.js"
import { getTermBySlug } from "./glossary.js"
import { getToolBySlug, TOOLKIT_CATEGORIES } from "./toolkit.js"
import { CONTROLS } from "./controls.js"
import { getPolicyBySlug } from "./policies/index.js"
import { getScenario } from "./ir-plan/scenarios.js"
import { glossaryHref, hrefFor } from "./content.js"

// Fixed pages a step can point at, with the label to show. Policy and
// tabletop-exercise pages resolve from their own registries below.
export const PATH_PAGES = {
  "/tools/cyber-audit": "Cyber Audit",
  "/tools/cyber-audit/quick": "Quick Cyber Audit",
  "/tools/policies": "Policy Library",
  "/tools/ir-plan": "Incident Response Planner",
  "/tools/ir-plan/builder": "Build your incident response plan",
  "/toolkit": "Toolkit",
  "/household": "Data Hygienics for Home",
  "/business": "Data Hygienics for Business",
}

function pageLabel(route) {
  if (PATH_PAGES[route]) return PATH_PAGES[route]
  const policy = route.match(/^\/tools\/policies\/([a-z0-9-]+)$/)
  if (policy) {
    const p = getPolicyBySlug(policy[1])
    return p ? (p.free ? `Free ${p.name}` : p.name) : null
  }
  const exercise = route.match(/^\/tools\/ir-plan\/exercise\/([a-z_]+)$/)
  if (exercise) {
    const s = getScenario(exercise[1])
    return s ? `Practice: ${s.title}` : null
  }
  return null
}

export function resolvePathLink(key) {
  const at = key.indexOf(":")
  const kind = key.slice(0, at)
  const slug = key.slice(at + 1)
  switch (kind) {
    case "guide": {
      const e = getGuideBySlug(slug)
      return e ? { href: hrefFor(e), label: e.title, type: "Guide" } : null
    }
    case "threat": {
      const e = getThreatBySlug(slug)
      return e ? { href: hrefFor(e), label: e.title, type: "Threat" } : null
    }
    case "explainer": {
      const e = getExplainerBySlug(slug)
      return e ? { href: hrefFor(e), label: e.title, type: "Explainer" } : null
    }
    case "glossary": {
      const t = getTermBySlug(slug)
      return t ? { href: glossaryHref(t.slug), label: t.term, type: "Term" } : null
    }
    case "control": {
      const c = CONTROLS.find((x) => x.slug === slug)
      return c ? { href: `/controls/${c.slug}`, label: c.title || c.name, type: "Control" } : null
    }
    case "toolkit": {
      const c = TOOLKIT_CATEGORIES.find((x) => x.slug === slug)
      return c ? { href: `/toolkit#cat-${c.slug}`, label: c.name, type: "Tools" } : null
    }
    case "tool": {
      const t = getToolBySlug(slug)
      return t ? { href: hrefFor({ ...t, kind: "tool" }), label: t.name, type: "Tool" } : null
    }
    case "page": {
      const label = pageLabel(slug)
      return label ? { href: slug, label, type: "Tool" } : null
    }
    default:
      return null
  }
}

export function resolvePathLinks(steps) {
  const links = {}
  for (const step of steps) {
    for (const key of step.links || []) {
      if (links[key] !== undefined) continue
      const link = resolvePathLink(key)
      if (link) links[key] = link
    }
  }
  return links
}
