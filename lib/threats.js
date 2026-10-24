// Threat Library. Entries live one per file under lib/content/threats/.
// kind "threat" entries are AI-era threats; kind "industry-brief" entries
// are the retained long-form industry guides (HTML content).
import voiceCloning from "./content/threats/voice-cloning-and-deepfake-scams.js"
import aiPhishing from "./content/threats/ai-powered-phishing-and-bec.js"
import romanceInvestment from "./content/threats/ai-scaled-romance-and-investment-scams.js"
import chatbotLeaks from "./content/threats/ai-chatbot-data-leaks.js"
import promptInjection from "./content/threats/prompt-injection-and-ai-agent-hijacking.js"
import healthcare from "./content/threats/healthcare.js"
import financial from "./content/threats/financial.js"
import { isVisible } from "./content.js"

export const ALL_THREATS = [
  voiceCloning,
  aiPhishing,
  chatbotLeaks,
  romanceInvestment,
  promptInjection,
  healthcare,
  financial,
]

export const threats = ALL_THREATS.filter(isVisible)

export function getThreatBySlug(slug) {
  return threats.find((t) => t.slug === slug)
}

export function getAiThreats() {
  return threats.filter((t) => t.kind === "threat")
}

export function getIndustryBriefs() {
  return threats.filter((t) => t.kind === "industry-brief")
}

export function getThreatsForAudience(audience) {
  return getAiThreats().filter((t) => t.audience?.includes(audience))
}

export function getFeaturedThreats(limit = 3) {
  const featured = getAiThreats().filter((t) => t.featured)
  return (featured.length ? featured : getAiThreats()).slice(0, limit)
}
