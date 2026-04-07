"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { getQuestionsForIndustry } from "@/lib/questions"
import { calculateTotalScore, calculateSectionScores } from "@/lib/cyber-audit/scoring"
import Navbar from "@/app/components/Navbar"
import ProgressBar from "../components/ProgressBar"
import QuestionRenderer from "../components/QuestionRenderer"
import IntakeModal from "../components/IntakeModal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Shield, CheckCircle } from "lucide-react"

export default function AssessmentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [assessmentId, setAssessmentId] = useState(null)
  const [industry, setIndustry] = useState(null)
  const [sections, setSections] = useState(null)
  const [showIntake, setShowIntake] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const saveTimeouts = useRef({})

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push("/tools/cyber-audit/login")

      // Find existing in-progress assessment
      const { data: assessments } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "in_progress")
        .order("created_at", { ascending: false })
        .limit(1)

      let activeAssessment = assessments?.[0]

      if (!activeAssessment) {
        // No assessment yet - show intake modal
        setShowIntake(true)
        setLoading(false)
        return
      }

      // Assessment exists - check if it has industry set
      if (!activeAssessment.industry) {
        setAssessmentId(activeAssessment.id)
        setShowIntake(true)
        setLoading(false)
        return
      }

      await loadAssessment(activeAssessment)
    }
    init()
  }, [])

  async function loadAssessment(assessment) {
    setAssessmentId(assessment.id)
    setIndustry(assessment.industry)

    const industrySections = getQuestionsForIndustry(assessment.industry)
    setSections(industrySections)

    // Load existing responses
    const { data: responses } = await supabase
      .from("responses")
      .select("question_key, answer")
      .eq("assessment_id", assessment.id)

    if (responses) {
      const loaded = {}
      responses.forEach((r) => {
        loaded[r.question_key] = r.answer
      })
      setAnswers(loaded)

      // Resume at first incomplete section
      for (let i = 0; i < industrySections.length; i++) {
        const allAnswered = industrySections[i].questions.every(
          (q) => loaded[q.key]
        )
        if (!allAnswered) {
          setCurrentStep(i)
          break
        }
        if (i === industrySections.length - 1) setCurrentStep(i)
      }
    }

    setLoading(false)
  }

  const handleIntakeComplete = async (intakeAnswers) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let id = assessmentId

    if (!id) {
      // Create new assessment with intake data
      const { data } = await supabase
        .from("assessments")
        .insert({
          user_id: user.id,
          status: "in_progress",
          industry: intakeAnswers.industry,
          employee_count: intakeAnswers.employee_count,
          has_insurance: intakeAnswers.has_insurance,
        })
        .select()
        .single()
      id = data.id
    } else {
      // Update existing assessment with intake data
      await supabase
        .from("assessments")
        .update({
          industry: intakeAnswers.industry,
          employee_count: intakeAnswers.employee_count,
          has_insurance: intakeAnswers.has_insurance,
        })
        .eq("id", id)
    }

    setShowIntake(false)
    await loadAssessment({
      id,
      industry: intakeAnswers.industry,
      employee_count: intakeAnswers.employee_count,
      has_insurance: intakeAnswers.has_insurance,
    })
  }

  // Auto-save a single response with debounce
  const saveResponse = useCallback(
    (questionKey, answer) => {
      if (!assessmentId) return

      if (saveTimeouts.current[questionKey]) {
        clearTimeout(saveTimeouts.current[questionKey])
      }

      saveTimeouts.current[questionKey] = setTimeout(async () => {
        const sectionKey = sections?.find((s) =>
          s.questions.some((q) => q.key === questionKey)
        )?.id

        await supabase.from("responses").upsert(
          {
            assessment_id: assessmentId,
            question_key: questionKey,
            section: sectionKey,
            answer,
            answered_at: new Date().toISOString(),
          },
          { onConflict: "assessment_id,question_key" }
        )
      }, 300)
    },
    [assessmentId, sections, supabase]
  )

  const handleAnswer = (questionKey, value) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }))
    saveResponse(questionKey, value)
  }

  if (loading || showIntake) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        {showIntake ? (
          <IntakeModal onComplete={handleIntakeComplete} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  if (!sections) return null

  const section = sections[currentStep]
  const completedSections = new Set()
  sections.forEach((s, i) => {
    if (s.questions.every((q) => answers[q.key])) {
      completedSections.add(i)
    }
  })

  const isLastStep = currentStep === sections.length - 1
  const allComplete = sections.every((s) =>
    s.questions.every((q) => answers[q.key])
  )

  const handleComplete = async () => {
    setCompleting(true)
    const score = calculateTotalScore(answers, sections)
    const sectionScores = calculateSectionScores(answers, sections)

    await supabase
      .from("assessments")
      .update({
        status: "completed",
        score,
        section_scores: JSON.stringify(sectionScores),
        completed_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)

    router.push("/tools/cyber-audit/results")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-[#1D4ED8]" />
          <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
            Cyber Audit
          </span>
          {industry && (
            <span className="text-[#94A3B8] text-xs">- {industry}</span>
          )}
        </div>

        <ProgressBar
          currentStep={currentStep}
          completedSections={completedSections}
          sections={sections}
          onNavigate={setCurrentStep}
        />

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                {section.title}
              </h2>
              <p className="text-[#475569] text-sm">{section.description}</p>
            </div>

            <div className="space-y-8">
              {section.questions.map((question, i) => (
                <motion.div
                  key={question.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
                >
                  <QuestionRenderer
                    question={question}
                    value={answers[question.key]}
                    onChange={(val) => handleAnswer(question.key, val)}
                    index={i}
                  />
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E2E8F0]">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </span>
              </Button>

              {isLastStep ? (
                <Button onClick={handleComplete} disabled={!allComplete || completing}>
                  <span className="flex items-center gap-2">
                    {completing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        Complete Assessment
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </Button>
              ) : (
                <Button onClick={() => setCurrentStep((s) => s + 1)}>
                  <span className="flex items-center gap-2">
                    Next Section
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
