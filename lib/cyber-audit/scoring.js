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
  Legal: 3,
  "Retail / E-commerce": 2,
  "Nonprofit / Church / Parish": 0,
  "Other / General Business": 0,
}

// Larger orgs have higher expectations
const EMPLOYEE_THRESHOLD_SHIFT = {
  "1-10": 0,
  "11-50": 0,
  "51-250": 1,
  "250+": 3,
}

export function calculateSectionScores(answers, sections) {
  const sectionWeight = 100 / sections.length

  return sections.map((section) => {
    const scoredQuestions = section.questions.filter((q) => q.scored !== false)
    const pointsPerQuestion =
      scoredQuestions.length > 0 ? sectionWeight / scoredQuestions.length : 0

    let earned = 0
    scoredQuestions.forEach((q) => {
      const answer = answers[q.key]
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
  switch (question.type) {
    case "yesno":
      return answer === "yes" ? 1.0 : 0.0

    case "singleselect":
    case "choice":
    case "frequency": {
      const option = question.options?.find((o) => o.label === answer)
      return option ? option.weight : 0
    }

    case "multiselect": {
      let selected
      if (Array.isArray(answer)) {
        selected = answer
      } else {
        try {
          selected = JSON.parse(answer)
        } catch {
          selected = []
        }
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
      return MATURITY_WEIGHTS[answer] ?? 0

    case "text":
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

export function getGaps(answers, sections) {
  const gaps = []
  sections.forEach((section) => {
    section.questions.forEach((q) => {
      if (q.scored === false) return
      const answer = answers[q.key]
      const questionScore = scoreAnswer(q, answer || "")
      const isGap = questionScore < 0.7

      if (isGap) {
        gaps.push({
          questionKey: q.key,
          questionText: q.text,
          section: section.title,
          sectionKey: section.key,
          answer: answer || "Not answered",
          nistFunction: q.nistFunction,
          cisControl: q.cisControl,
          controlSlug: q.tooltip?.controlSlug,
        })
      }
    })
  })
  return gaps
}
