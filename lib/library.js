// Cross-cutting queries over the whole research library: latest items,
// related-content resolution, and audience filters for the hubs.
import { threats, getThreatBySlug } from "./threats.js"
import { guides, getGuideBySlug } from "./guides.js"
import { explainers, getExplainerBySlug } from "./sovereignty.js"
import { tools, getToolBySlug } from "./toolkit.js"
import { getTermBySlug } from "./glossary.js"
import { CONTROLS } from "./controls.js"

// The AI-or-SI stance explainer is the one place outside the glossary that
// talks about "SI" at length (see lib/site.js). It belongs on
// /digital-sovereignty, not in the Home and Business hubs.
export const STANCE_EXPLAINER_SLUG = "ai-or-si-what-we-call-it"

export function getAllEntries() {
  return [...threats, ...guides, ...explainers]
}

// Newest first by datePublished, then title for a stable order. `exclude`
// is a list of slugs to leave out.
export function getLatest(limit = 6, { audience, exclude = [] } = {}) {
  return getAllEntries()
    .filter((e) => !audience || e.audience?.includes(audience))
    .filter((e) => !exclude.includes(e.slug))
    .sort((a, b) =>
      (b.datePublished || "").localeCompare(a.datePublished || "") || a.title.localeCompare(b.title)
    )
    .slice(0, limit)
}

// Resolve entry.related slugs into visible entries, dropping anything that
// is missing or still a draft so pages never link to a 404.
export function resolveRelated(entry) {
  const related = entry?.related || {}
  const pick = (slugs, getter) => (slugs || []).map(getter).filter(Boolean)
  return {
    threats: pick(related.threats, getThreatBySlug),
    guides: pick(related.guides, getGuideBySlug),
    explainers: pick(related.explainers, getExplainerBySlug),
    toolkit: pick(related.toolkit, getToolBySlug),
    glossary: pick(related.glossary, getTermBySlug),
    controls: pick(related.controls, (slug) => CONTROLS.find((c) => c.slug === slug)),
  }
}

// Resolve a list of toolkit slugs to visible tools, in the order given,
// dropping drafts and unknown slugs.
export function getToolsBySlugs(slugs = []) {
  return slugs.map(getToolBySlug).filter(Boolean)
}

// Entries for the Home and Business hubs. When `featuredTools` is given, the
// tools list is that hand-picked selection instead of every tool for the
// audience.
export function getHubContent(audience, { featuredTools } = {}) {
  return {
    threats: threats.filter((t) => t.kind === "threat" && t.audience?.includes(audience)),
    guides: guides.filter((g) => g.audience?.includes(audience)),
    explainers: explainers.filter((e) => e.audience?.includes(audience) && e.slug !== STANCE_EXPLAINER_SLUG),
    tools: featuredTools ? getToolsBySlugs(featuredTools) : tools.filter((t) => t.audience?.includes(audience)),
  }
}
