import { SECTIONS as generalSections } from "./general"
import { SECTIONS as healthcareSections } from "./healthcare"
import { SECTIONS as financialSections } from "./financial"
import { SECTIONS as retailSections } from "./retail"
import { SECTIONS as governmentSections } from "./government"
import { SECTIONS as nonprofitSections } from "./nonprofit"
import { QUICK_SECTIONS, QUICK_DISCOVERY_GUIDES } from "./quick"
import { AI_USE_SECTION } from "./shared/ai-use"
import { SECTIONS as retiredLegalSections } from "./retired/legal"

const DEFAULT_INDUSTRY = "Other / General Business"

// Appends the shared AI Use and Data Handling section to an industry bank.
// It goes last so the free-tier question limit and the resume-at-first-
// incomplete-section logic behave exactly as before for earlier sections.
export function withAiSection(sections) {
  return [...sections, AI_USE_SECTION]
}

const INDUSTRY_MAP = {
  [DEFAULT_INDUSTRY]: withAiSection(generalSections),
  Healthcare: withAiSection(healthcareSections),
  "Financial Services": withAiSection(financialSections),
  "Retail / E-commerce": withAiSection(retailSections),
  "Government / Defense Contractor": withAiSection(governmentSections),
  "Nonprofit / Church / Parish": withAiSection(nonprofitSections),
}

// Industry tracks no longer offered for new assessments. Stored assessments
// can still carry these values in `assessments.industry`; they keep loading
// their frozen bank (RETIRED_BANKS) so gaps, remediation, and grades stay
// accurate. RETIRED_INDUSTRIES maps each to the track that now serves new
// work (used for the news feed and any "start a new assessment" prompt).
export const RETIRED_INDUSTRIES = {
  Legal: DEFAULT_INDUSTRY,
}

const RETIRED_BANKS = {
  Legal: withAiSection(retiredLegalSections),
}

export function isRetiredIndustry(industry) {
  return (
    typeof industry === "string" &&
    Object.prototype.hasOwnProperty.call(RETIRED_INDUSTRIES, industry)
  )
}

export function getQuestionsForIndustry(industry) {
  if (isRetiredIndustry(industry)) {
    return RETIRED_BANKS[industry] || INDUSTRY_MAP[RETIRED_INDUSTRIES[industry]] || INDUSTRY_MAP[DEFAULT_INDUSTRY]
  }
  return (
    (Object.prototype.hasOwnProperty.call(INDUSTRY_MAP, industry) && INDUSTRY_MAP[industry]) ||
    INDUSTRY_MAP[DEFAULT_INDUSTRY]
  )
}

export function getTotalQuestions(industry) {
  const sections = getQuestionsForIndustry(industry)
  return sections.reduce((sum, s) => sum + s.questions.length, 0)
}

export function getAllIndustries() {
  return Object.keys(INDUSTRY_MAP)
}

export function getQuickAssessmentQuestions() {
  return QUICK_SECTIONS
}

export { QUICK_SECTIONS, QUICK_DISCOVERY_GUIDES, AI_USE_SECTION }
