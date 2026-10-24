// Maturity tier weights
const MATURITY_WEIGHTS = {
  "Not in place": 0.0,
  "Partially in place": 0.33,
  "Fully in place": 0.67,
  "Documented & tested": 1.0,
}

// Regulated industries have higher grade thresholds
const INDUSTRY_THRESHOLD_SHIFT = {
  Healthcare: 5,
  "Financial Services": 5,
  "Government / Defense Contractor": 5,
  "Retail / E-commerce": 2,
  "Nonprofit / Church / Parish": 0,
  "Other / General Business": 0,
  // Retired track: kept so stored Legal assessments keep their grade.
  Legal: 3,
}

// Larger orgs have higher expectations
const EMPLOYEE_THRESHOLD_SHIFT = {
  "1-10": 0,
  "11-50": 0,
  "51-250": 1,
  "250+": 3,
}

// True when a stored answer exists. Mirrors the assessment UI, which treats
// undefined and "" as unanswered.
function hasAnswer(answer) {
  if (answer === null || answer === undefined) return false
  if (typeof answer === "string") return answer.trim() !== ""
  if (Array.isArray(answer)) return answer.length > 0
  return true
}

// A section added to the question banks after launch carries `introduced`
// (for example the shared AI Use and Data Handling section). On an
// assessment where none of its scored questions has an answer, the section
// did not exist when the assessment was taken, so it is "not assessed": it
// gets no weight and produces no gaps. Sections without `introduced` are
// always scored, so a missing answer there still counts as zero.
function isUnassessedNewSection(section, answers) {
  if (!section?.introduced) return false
  return section.questions
    .filter((q) => q.scored !== false)
    .every((q) => !hasAnswer(answers[q.key]))
}

export function calculateSectionScores(answers, sections) {
  const safeAnswers = answers || {}
  const assessed = sections.filter(
    (section) => !isUnassessedNewSection(section, safeAnswers)
  )
  const scoredSections = assessed.length > 0 ? assessed : sections
  const sectionWeight = 100 / scoredSections.length

  return scoredSections.map((section) => {
    const scoredQuestions = section.questions.filter((q) => q.scored !== false)
    const pointsPerQuestion =
      scoredQuestions.length > 0 ? sectionWeight / scoredQuestions.length : 0

    let earned = 0
    scoredQuestions.forEach((q) => {
      const answer = safeAnswers[q.key]
      if (!answer) return

      earned += pointsPerQuestion * scoreAnswer(q, answer)
    })

    return {
      key: section.id || section.key,
      title: section.title,
      earned: Math.round(earned * 10) / 10,
      max: sectionWeight,
      percentage: Math.round((earned / sectionWeight) * 100),
    }
  })
}

function scoreAnswer(question, answer) {
  // Guard against missing / null / undefined answers. Legacy rows and
  // malformed JSONB can also feed non-matching types into this function, so
  // each case below additionally type-checks before doing work that assumes
  // a particular shape.
  if (answer === null || answer === undefined) return 0

  switch (question.type) {
    case "yesno":
      if (typeof answer !== "string") return 0
      return answer === "yes" ? 1.0 : 0.0

    case "singleselect":
    case "choice":
    case "frequency": {
      if (typeof answer !== "string") return 0
      const option = question.options?.find((o) => o.label === answer)
      return option ? option.weight : 0
    }

    case "multiselect": {
      let selected
      if (Array.isArray(answer)) {
        selected = answer
      } else if (typeof answer === "string") {
        try {
          selected = JSON.parse(answer)
        } catch {
          selected = []
        }
      } else {
        selected = []
      }
      if (!Array.isArray(selected) || selected.length === 0) return 0

      // Check for "All" option first
      const allOption = question.options?.find(
        (o) => o.label.startsWith("All ") || o.label === "All of the above"
      )
      if (allOption && selected.includes(allOption.label)) return allOption.weight

      // Check for "None"
      if (selected.includes("None")) return 0

      // Sum individual weights, cap at 1.0
      const total = selected.reduce((sum, label) => {
        const opt = question.options?.find((o) => o.label === label)
        return sum + (opt ? opt.weight : 0)
      }, 0)
      return Math.min(total, 1.0)
    }

    case "maturity":
      if (typeof answer !== "string") return 0
      return MATURITY_WEIGHTS[answer] ?? 0

    case "text":
    case "textarea":
      if (typeof answer !== "string") return 0
      return answer.trim().length > 0 ? 1.0 : 0.0

    default:
      return 0
  }
}

export function calculateTotalScore(answers, sections) {
  const sectionScores = calculateSectionScores(answers, sections)
  return Math.round(sectionScores.reduce((sum, s) => sum + s.earned, 0))
}

export function getLetterGrade(score, industry, employeeCount) {
  const shift =
    (INDUSTRY_THRESHOLD_SHIFT[industry] || 0) +
    (EMPLOYEE_THRESHOLD_SHIFT[employeeCount] || 0)

  // Shift thresholds up - harder to get a good grade in regulated/large orgs
  if (score >= 90 + shift) return { grade: "A", label: "Excellent", color: "text-emerald-400" }
  if (score >= 80 + shift) return { grade: "B", label: "Good", color: "text-blue-400" }
  if (score >= 70 + shift) return { grade: "C", label: "Fair", color: "text-yellow-400" }
  if (score >= 60 + shift) return { grade: "D", label: "Needs Work", color: "text-orange-400" }
  return { grade: "F", label: "Critical", color: "text-red-400" }
}

export function getGaugeColor(score) {
  if (score >= 80) return "#34d399"
  if (score >= 60) return "#facc15"
  return "#f87171"
}

// Gaps are drawn only from answered questions. A completed assessment has an
// answer for every question that existed when it was taken (the assessment
// UI will not complete otherwise), so an unanswered question means the
// question was added later or belongs to a retired industry bank. Neither is
// a measured weakness, so neither is reported as a gap.
export function getGaps(answers, sections) {
  const safeAnswers = answers || {}
  const gaps = []
  sections.forEach((section) => {
    section.questions.forEach((q) => {
      if (q.scored === false) return
      const answer = safeAnswers[q.key]
      if (!hasAnswer(answer)) return
      const questionScore = scoreAnswer(q, answer)
      const isGap = questionScore < 0.7

      if (isGap) {
        gaps.push({
          questionKey: q.key,
          questionText: q.text,
          section: section.title,
          sectionKey: section.key || section.id,
          answer,
          nistFunction: q.nistFunction,
          cisControl: q.cisControl,
          controlSlug: q.tooltip?.controlSlug,
        })
      }
    })
  })
  return gaps
}
