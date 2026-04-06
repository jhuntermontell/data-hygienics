import { SECTIONS as generalSections } from "./general"
import { SECTIONS as healthcareSections } from "./healthcare"
import { SECTIONS as legalSections } from "./legal"
import { SECTIONS as financialSections } from "./financial"
import { SECTIONS as retailSections } from "./retail"
import { SECTIONS as governmentSections } from "./government"

const INDUSTRY_MAP = {
  "Other / General Business": generalSections,
  Healthcare: healthcareSections,
  Legal: legalSections,
  "Financial Services": financialSections,
  "Retail / E-commerce": retailSections,
  "Government / Defense Contractor": governmentSections,
}

export function getQuestionsForIndustry(industry) {
  return INDUSTRY_MAP[industry] || generalSections
}

export function getTotalQuestions(industry) {
  const sections = getQuestionsForIndustry(industry)
  return sections.reduce((sum, s) => sum + s.questions.length, 0)
}

export function getAllIndustries() {
  return Object.keys(INDUSTRY_MAP)
}
