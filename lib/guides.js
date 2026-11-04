// Hygiene guides, one per file under lib/content/guides/.
import familySafeWord from "./content/guides/family-safe-word-and-callback-rule.js"
import olderRelative from "./content/guides/protect-an-older-relative-from-ai-phone-scams.js"
import twoChannel from "./content/guides/two-channel-verification-for-payments.js"
import lockDownAssistants from "./content/guides/lock-down-your-ai-assistants.js"
import aiUseRule from "./content/guides/one-page-ai-use-rule-for-your-team.js"
import hygieneHome from "./content/guides/digital-hygiene-at-home.js"
import hygieneBusiness from "./content/guides/digital-hygiene-for-your-business.js"
import texasSafeHarbor from "./content/guides/texas-sb-2610-safe-harbor.js"
import cyberInsurance from "./content/guides/cyber-insurance-application-and-renewal.js"
import clientQuestionnaire from "./content/guides/answering-a-client-security-questionnaire.js"
import ptinWisp from "./content/guides/ptin-renewal-and-your-wisp.js"
import { isVisible } from "./content.js"

export const ALL_GUIDES = [
  hygieneHome,
  hygieneBusiness,
  familySafeWord,
  lockDownAssistants,
  twoChannel,
  aiUseRule,
  olderRelative,
  // Forced moments (drafts until the owner approves them)
  texasSafeHarbor,
  cyberInsurance,
  clientQuestionnaire,
  ptinWisp,
]

export const guides = ALL_GUIDES.filter(isVisible)

export function getGuideBySlug(slug) {
  return guides.find((g) => g.slug === slug)
}

export function getGuidesForAudience(audience) {
  return guides.filter((g) => g.audience?.includes(audience))
}
