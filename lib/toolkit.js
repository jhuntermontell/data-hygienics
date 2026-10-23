// Toolkit: tools we'd actually use. No affiliate links, referral fees, or
// sponsorships; scripts/validate-content.mjs rejects tracking parameters.
import { TOOLKIT, TOOLKIT_CATEGORIES } from "./content/toolkit.js"
import { isVisible } from "./content.js"

export { TOOLKIT_CATEGORIES }

export const ALL_TOOLS = TOOLKIT

export const tools = TOOLKIT.filter(isVisible)

export function getToolBySlug(slug) {
  return tools.find((t) => t.slug === slug)
}

export function getToolsForAudience(audience) {
  return tools.filter((t) => t.audience?.includes(audience))
}

export function getToolsByCategory() {
  return TOOLKIT_CATEGORIES.map((category) => ({
    ...category,
    tools: tools.filter((t) => t.category === category.slug),
  })).filter((category) => category.tools.length > 0)
}
