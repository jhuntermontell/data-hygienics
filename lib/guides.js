// Hygiene guides, one per file under lib/content/guides/.
import familySafeWord from "./content/guides/family-safe-word-and-callback-rule.js"
import olderRelative from "./content/guides/protect-an-older-relative-from-ai-phone-scams.js"
import twoChannel from "./content/guides/two-channel-verification-for-payments.js"
import lockDownAssistants from "./content/guides/lock-down-your-ai-assistants.js"
import aiUseRule from "./content/guides/one-page-ai-use-rule-for-your-team.js"
import hygieneHome from "./content/guides/digital-hygiene-at-home.js"
import hygieneBusiness from "./content/guides/digital-hygiene-for-your-business.js"
import { isVisible } from "./content.js"

export const ALL_GUIDES = [
  hygieneHome,
  hygieneBusiness,
  familySafeWord,
  lockDownAssistants,
  twoChannel,
  aiUseRule,
  olderRelative,
]

export const guides = ALL_GUIDES.filter(isVisible)

export function getGuideBySlug(slug) {
  return guides.find((g) => g.slug === slug)
}

export function getGuidesForAudience(audience) {
  return guides.filter((g) => g.audience?.includes(audience))
}
