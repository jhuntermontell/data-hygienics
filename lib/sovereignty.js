// Digital Sovereignty pillar: principles plus explainers, one explainer per
// file under lib/content/explainers/.
import whatItMeans from "./content/explainers/what-digital-sovereignty-means.js"
import aiConversations from "./content/explainers/who-owns-your-ai-conversations.js"
import aiOrSi from "./content/explainers/ai-or-si-what-we-call-it.js"
import { isVisible } from "./content.js"

export { PRINCIPLES } from "./content/sovereignty.js"

export const ALL_EXPLAINERS = [whatItMeans, aiConversations, aiOrSi]

export const explainers = ALL_EXPLAINERS.filter(isVisible)

export function getExplainerBySlug(slug) {
  return explainers.find((e) => e.slug === slug)
}

export function getExplainersForAudience(audience) {
  return explainers.filter((e) => e.audience?.includes(audience))
}
