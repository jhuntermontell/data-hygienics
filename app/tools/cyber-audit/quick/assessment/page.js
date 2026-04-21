"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Tooltip from "../../components/Tooltip"
import { Button } from "@/components/ui/button"
import { QUICK_SECTIONS } from "@/lib/questions/quick"
import { ArrowLeft, ArrowRight, Shield, CheckCircle, Lightbulb } from "lucide-react"

const QUICK_LEAD_KEY = "dh_quick_lead"
const QUICK_ANSWERS_KEY = "dh_quick_answers"

// Flatten QUICK_SECTIONS so we have one question per step
const QUICK_STEPS = QUICK_SECTIONS.flatMap((section) =>
  section.questions.map((q) => ({ section, question: q }))
)
const TOTAL_STEPS = QUICK_STEPS.length

export default function QuickAssessmentRunnerPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [hasLead, setHasLead] = useState(false)

  useEffect(() => {
    try {
      const lead = localStorage.getItem(QUICK_LEAD_KEY)
      if (!lead) {
        router.replace("/tools/cyber-audit/quick")
        return
      }
      setHasLead(true)

      const stored = localStorage.getItem(QUICK_ANSWERS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setAnswers(parsed)
      }
    } catch {
      router.replace("/tools/cyber-audit/quick")
    }
  }, [router])

  function handleAnswer(questionKey, label) {
    const next = { ...answers, [questionKey]: label }
    setAnswers(next)
    try {
      localStorage.setItem(QUICK_ANSWERS_KEY, JSON.stringify(next))
    } catch {}
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1)
      return
    }
    // Last question: go to create account
    router.push("/tools/cyber-audit/quick/create-account")
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  if (!hasLead) return null

  const step = QUICK_STEPS[currentStep]
  const question = step.question
  const section = step.section
  const currentAnswer = answers[question.key]
  const canAdvance = Boolean(currentAnswer)
  const progressPct = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)
  const isLast = currentStep === TOTAL_STEPS - 1

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Indicator banner */}
      <div className="pt-16">
        <div className="bg-[#1D4ED8]">
          <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-semibold tracking-wide uppercase">
              Quick Security Check &nbsp;&middot;&nbsp; 12 Questions
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#475569] text-xs font-semibold">
              Question {currentStep + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-[#94A3B8] text-xs">{section.title}</span>
          </div>
          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-[#1D4ED8] rounded-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
                NIST CSF 2.0 {question.nistFunction}
              </span>
              {question.cisControl && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E]">
                  CIS {question.cisControl}
                </span>
              )}
              {question.insuranceCritical && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                  Insurance Critical
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 mb-6">
              <h2 className="text-xl font-bold text-[#0F172A] leading-snug">
                {question.text}
              </h2>
              {question.tooltip && <Tooltip tooltip={question.tooltip} />}
            </div>

            <div className="space-y-2.5">
              {question.options.map((option) => {
                const isSelected = currentAnswer === option.label
                const isDiscovery = option.flag === "discovery"

                return (
                  <div key={option.label}>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(question.key, option.label)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? isDiscovery
                            ? "bg-[#F8FAFC] border-2 border-[#64748B] text-[#0F172A] italic"
                            : "bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#0F172A]"
                          : isDiscovery
                          ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] italic hover:border-[#94A3B8]"
                          : "bg-white border border-[#E2E8F0] text-[#475569] hover:shadow-sm hover:border-[#94A3B8]"
                      }`}
                    >
                      {option.label}
                      {isDiscovery && (
                        <span className="block text-[11px] text-[#94A3B8] font-normal not-italic mt-1">
                          That&apos;s okay. We&apos;ll help you find out.
                        </span>
                      )}
                    </motion.button>

                    {/* Hint callout: only when this discovery option is selected AND has a hint */}
                    <AnimatePresence>
                      {isSelected && isDiscovery && option.hint && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -4, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 mx-2 rounded-lg bg-[#EFF6FF] border border-[#1D4ED8]/15 px-3.5 py-3 flex items-start gap-2.5">
                            <Lightbulb className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0 mt-0.5" />
                            <p className="text-[#1E3A8A] text-xs leading-relaxed">{option.hint}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </span>
          </Button>
          <Button onClick={handleNext} disabled={!canAdvance}>
            <span className="flex items-center gap-2">
              {isLast ? (
                <>
                  See My Results
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
