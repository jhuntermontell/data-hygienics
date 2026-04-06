"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Building2, Users, Shield } from "lucide-react"

const STEPS = [
  {
    key: "industry",
    icon: Building2,
    title: "What industry are you in?",
    description: "We will tailor the assessment to your regulatory environment.",
    options: [
      "Healthcare",
      "Legal",
      "Financial Services",
      "Retail / E-commerce",
      "Government / Defense Contractor",
      "Nonprofit / Church / Parish",
      "Other / General Business",
    ],
  },
  {
    key: "employee_count",
    icon: Users,
    title: "How many employees does your organization have?",
    description: "This helps us calibrate expectations for your security maturity.",
    options: ["1-10", "11-50", "51-250", "250+"],
  },
  {
    key: "has_insurance",
    icon: Shield,
    title: "Do you currently have cyber insurance?",
    description: "This helps us frame recommendations around your coverage status.",
    options: ["Yes", "No", "Not sure"],
  },
]

export default function IntakeModal({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentStep = STEPS[step]
  const currentAnswer = answers[currentStep.key]
  const isLast = step === STEPS.length - 1

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [currentStep.key]: value }))
  }

  const handleNext = () => {
    if (isLast) {
      onComplete(answers)
    } else {
      setStep((s) => s + 1)
    }
  }

  const Icon = currentStep.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0d0d0d] overflow-hidden"
      >
        {/* Progress indicator */}
        <div className="flex gap-1.5 p-4 pb-0">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-blue-500" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-zinc-500 text-xs font-semibold">
                  Step {step + 1} of {STEPS.length}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-1 mt-4">
                {currentStep.title}
              </h2>
              <p className="text-zinc-500 text-sm mb-6">
                {currentStep.description}
              </p>

              <div className="grid gap-2.5">
                {currentStep.options.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      currentAnswer === option
                        ? "bg-blue-500/15 border-2 border-blue-500 text-white"
                        : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </span>
            </Button>

            <Button onClick={handleNext} disabled={!currentAnswer}>
              <span className="flex items-center gap-2">
                {isLast ? "Begin Assessment" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
