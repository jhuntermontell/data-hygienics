import { getQuestionsForIndustry } from "@/lib/questions"

// Default export for backward compatibility — uses general business questions
export const SECTIONS = getQuestionsForIndustry("Other / General Business")

export const TOTAL_QUESTIONS = SECTIONS.reduce(
  (sum, s) => sum + s.questions.length,
  0
)

// Re-export the industry selector
export { getQuestionsForIndustry }
