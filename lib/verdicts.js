// "Is this real?" verdicts (/check). Entries live one per file under
// lib/content/verdicts/, in the order the /check grid shows them. Adding a
// verdict means creating the file and importing it here.
import tollText from "./content/verdicts/toll-text.js"
import bankFraudCall from "./content/verdicts/bank-fraud-call.js"
import familyVoiceCall from "./content/verdicts/family-voice-call.js"
import clickedALink from "./content/verdicts/clicked-a-link.js"
import packageText from "./content/verdicts/package-text.js"
import vendorNewBankDetails from "./content/verdicts/vendor-new-bank-details.js"
import { isVisible } from "./content.js"

export const ALL_VERDICTS = [tollText, bankFraudCall, familyVoiceCall, clickedALink, packageText, vendorNewBankDetails]

export const verdicts = ALL_VERDICTS.filter(isVisible)

export function getVerdictBySlug(slug) {
  return verdicts.find((v) => v.slug === slug)
}

export function getVerdictsForAudience(audience) {
  return verdicts.filter((v) => v.audience?.includes(audience))
}
