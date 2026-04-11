"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getSubscription } from "@/lib/stripe/subscription"
import { getScenario } from "@/lib/ir-plan/scenarios"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Download,
  Shield,
  X,
} from "lucide-react"

const IrPlanPdf = dynamic(
  () => import("@/app/tools/ir-plan/components/IrPlanPdf"),
  { ssr: false }
)

export default function ExerciseFlowPage() {
  const { scenario: scenarioKey } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stageIdx, setStageIdx] = useState(0)
  const [decisions, setDecisions] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [savedExercise, setSavedExercise] = useState(null)
  const [downloadPdf, setDownloadPdf] = useState(false)
  const [finalScore, setFinalScore] = useState(null)
  const [finalDecisionsState, setFinalDecisionsState] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [isPaid, setIsPaid] = useState(true)
  const [saveWarning, setSaveWarning] = useState(false)
  const [savingExercise, setSavingExercise] = useState(false)
  const [lockingAnswer, setLockingAnswer] = useState(false)
  const decisionsRef = useRef([])

  const scenario = getScenario(scenarioKey)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }
      setUser(session.user)
      const [{ data }, subData] = await Promise.all([
        supabase
          .from("ir_plans")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle(),
        getSubscription(session.user.id),
      ])
      setPlan(data || null)
      setIsPaid(subData.access.canAccessPolicies || subData.plan === "starter")
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0F766E]/30 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <Shield className="w-12 h-12 text-[#0F766E] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Tabletop Exercises</h1>
          <p className="text-[#475569] mb-6">
            Tabletop exercises are available with a Starter subscription or higher.
          </p>
          <Button
            onClick={() => router.push("/pricing")}
            className="bg-[#0F766E] hover:bg-[#0E7490]"
          >
            View Plans
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 text-center">
          <p className="text-[#475569] mb-4">Unknown scenario.</p>
          <Link href="/tools/ir-plan/exercise" className="text-[#0F766E] font-semibold underline">
            Choose a scenario
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 text-center">
          <p className="text-[#475569] mb-4">
            Build your incident response plan before running an exercise.
          </p>
          <Link
            href="/tools/ir-plan/builder"
            className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Build your plan
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const totalStages = scenario.stages.length

  // Completed view
  if (completed) {
    return (
      <CompletedView
        scenario={scenario}
        decisions={finalDecisionsState || decisions}
        precomputedPct={finalScore}
        plan={plan}
        savedExercise={savedExercise}
        downloadPdf={downloadPdf}
        setDownloadPdf={setDownloadPdf}
        saveError={saveError}
        saveWarning={saveWarning}
        router={router}
      />
    )
  }

  // Intro view
  if (stageIdx === -1) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
          <Link
            href="/tools/ir-plan/exercise"
            className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to scenarios
          </Link>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#0F766E]" />
              <span className="text-[#0F766E] text-xs font-medium tracking-wide">
                Tabletop Exercise
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">{scenario.title}</h1>
            <p className="text-sm text-[#475569] mb-6 leading-relaxed">{scenario.narrative_intro}</p>
            <button
              onClick={() => setStageIdx(0)}
              className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0E7490]"
            >
              Begin <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const currentStage = scenario.stages[stageIdx]

  function selectOption(idx) {
    if (showFeedback) return
    setSelectedOptionIdx(idx)
  }

  function confirmDecision() {
    if (lockingAnswer) return
    if (showFeedback) return
    if (selectedOptionIdx === null) return
    // Idempotency: if a decision for this stage is already recorded, ignore
    if (decisionsRef.current.some((d) => d.stageId === currentStage.id)) return

    setLockingAnswer(true)
    const opt = currentStage.options[selectedOptionIdx]
    const newDecision = {
      stageId: currentStage.id,
      question: currentStage.question,
      chosen: selectedOptionIdx,
      chosenText: opt.text,
      score: opt.score,
      feedback: opt.feedback,
      best: !!opt.best,
    }
    // Use a ref so finishExercise reads the same array regardless of any
    // outstanding setState batches.
    const updated = [...decisionsRef.current, newDecision]
    decisionsRef.current = updated
    setDecisions(updated)
    setShowFeedback(true)
    setLockingAnswer(false)
  }

  async function nextStage() {
    if (stageIdx < totalStages - 1) {
      setShowFeedback(false)
      setSelectedOptionIdx(null)
      setStageIdx(stageIdx + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    // Last stage: finalize. Guard against double-clicks on "See results".
    if (savingExercise) return
    setSavingExercise(true)
    setShowFeedback(false)
    setSelectedOptionIdx(null)
    // Always read from the ref, never from state
    await finishExercise(decisionsRef.current)
  }

  async function finishExercise(finalDecisions) {
    const totalScore = finalDecisions.reduce((sum, d) => sum + (d.score || 0), 0)
    const maxScore = scenario.stages.reduce(
      (sum, s) => sum + Math.max(...s.options.map((o) => o.score || 0)),
      0
    )
    const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

    const supabase = createClient()

    let session
    try {
      const sessionRes = await supabase.auth.getSession()
      session = sessionRes.data.session
    } catch {
      session = null
    }
    if (!session) {
      setSavingExercise(false)
      router.push("/tools/cyber-audit/login")
      return
    }

    let savedRow = null
    try {
      const res = await fetch("/api/ir-plan/save-exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          exerciseData: {
            plan_id: plan.id,
            scenario_type: scenarioKey,
            decisions: finalDecisions,
            score: pct,
            completed_at: new Date().toISOString(),
            summary_text: `Completed tabletop exercise: ${scenario.title}. Score: ${pct}%.`,
          },
        }),
      })

      if (!res.ok) {
        if (res.status === 403) {
          setSavingExercise(false)
          setIsPaid(false)
          return
        }
        const err = await res.json().catch(() => ({}))
        console.error("Failed to save exercise:", err.error || res.status)
        setSaveWarning(true)
      } else {
        const result = await res.json().catch(() => ({}))
        savedRow = result.exercise || null
      }
    } catch (err) {
      console.error("Network error saving exercise:", err)
      setSaveWarning(true)
    }

    setSavedExercise(
      savedRow || {
        score: pct,
        decisions: finalDecisions,
        scenario_type: scenarioKey,
        created_at: new Date().toISOString(),
        notSaved: !savedRow,
      }
    )
    setFinalScore(pct)
    setFinalDecisionsState(finalDecisions)
    setCompleted(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/tools/ir-plan/exercise"
            className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </Link>
          <p className="text-xs text-[#94A3B8]">
            Stage {stageIdx + 1} of {totalStages}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {scenario.stages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < stageIdx ? "bg-[#0F766E]" : i === stageIdx ? "bg-[#0F766E]" : "bg-[#E2E8F0]"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${stageIdx}-${showFeedback}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm"
          >
            <p className="text-sm text-[#475569] leading-relaxed mb-5">
              {currentStage.narrative}
            </p>
            <h2 className="text-lg font-bold text-[#0F172A] mb-5">{currentStage.question}</h2>

            <div className="space-y-3">
              {currentStage.options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx
                const showResult = showFeedback && isSelected
                const isBest = opt.best
                return (
                  <button
                    key={idx}
                    onClick={() => selectOption(idx)}
                    disabled={showFeedback}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      showFeedback && isBest
                        ? "border-[#0F766E] bg-[#F0FDFA]"
                        : isSelected
                        ? "border-[#0F766E] bg-[#F0FDFA]"
                        : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
                    } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 ${
                          isSelected || (showFeedback && isBest)
                            ? "border-[#0F766E] bg-[#0F766E]"
                            : "border-[#94A3B8]"
                        }`}
                      >
                        {(isSelected || (showFeedback && isBest)) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#0F172A] leading-relaxed">{opt.text}</p>
                        {showResult && (
                          <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                            <p className="text-xs text-[#475569] leading-relaxed">{opt.feedback}</p>
                            <p className="text-[10px] font-semibold text-[#0F766E] uppercase tracking-wider mt-2">
                              Score: {opt.score} {opt.best && "| Best choice"}
                            </p>
                          </div>
                        )}
                        {showFeedback && isBest && !isSelected && (
                          <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                            <p className="text-[10px] font-semibold text-[#0F766E] uppercase tracking-wider mb-1">
                              Best choice
                            </p>
                            <p className="text-xs text-[#475569] leading-relaxed">{opt.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex justify-end">
              {!showFeedback ? (
                <button
                  onClick={confirmDecision}
                  disabled={selectedOptionIdx === null || lockingAnswer}
                  className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0E7490] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lock in answer <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={nextStage}
                  disabled={savingExercise}
                  className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0E7490] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingExercise
                    ? "Saving..."
                    : stageIdx < totalStages - 1
                    ? "Next stage"
                    : "See results"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}

function CompletedView({ scenario, decisions, precomputedPct, plan, savedExercise, downloadPdf, setDownloadPdf, saveError, saveWarning, router }) {
  let pct = precomputedPct
  if (pct === null || pct === undefined) {
    const totalScore = decisions.reduce((sum, d) => sum + (d.score || 0), 0)
    const maxScore = scenario.stages.reduce(
      (sum, s) => sum + Math.max(...s.options.map((o) => o.score || 0)),
      0
    )
    pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  }

  let grade
  if (pct >= 90) {
    grade = {
      label: "Excellent",
      body: "Your instincts align well with your response plan.",
      color: "#0F766E",
      bg: "#F0FDFA",
    }
  } else if (pct >= 70) {
    grade = {
      label: "Good",
      body: "You made solid decisions overall, with a few areas to review.",
      color: "#0F766E",
      bg: "#F0FDFA",
    }
  } else if (pct >= 50) {
    grade = {
      label: "Fair",
      body: "Review the feedback on the steps you missed. Consider running through the playbook with your team.",
      color: "#CA8A04",
      bg: "#FEF9C3",
    }
  } else {
    grade = {
      label: "Needs Work",
      body: "This exercise identified significant gaps in your response readiness. The good news: that is exactly what tabletop exercises are for.",
      color: "#DC2626",
      bg: "#FEE2E2",
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <div
          className="rounded-2xl p-8 mb-8 border-2"
          style={{ borderColor: grade.color, backgroundColor: grade.bg }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6" style={{ color: grade.color }} />
            <h1 className="text-2xl font-bold text-[#0F172A]">Exercise complete</h1>
          </div>
          <p className="text-5xl font-bold mb-1" style={{ color: grade.color }}>
            {pct}%
          </p>
          <p className="text-base font-semibold text-[#0F172A] mb-1">{grade.label}</p>
          <p className="text-sm text-[#475569]">{grade.body}</p>
        </div>

        {saveWarning && (
          <div className="mb-6 rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-4 text-sm text-[#92400E]">
            Your exercise results could not be saved to your account. They are displayed below but will not appear in your history. Please check your internet connection and try running the exercise again.
          </div>
        )}
        {saveError && !saveWarning && (
          <div className="mb-6 rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-4 text-sm text-[#92400E]">
            {saveError}
          </div>
        )}

        <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">
          Your decisions
        </h2>
        <div className="space-y-4 mb-8">
          {decisions.map((d, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <p className="text-xs text-[#94A3B8] mb-1">Stage {i + 1}</p>
              <p className="text-sm font-semibold text-[#0F172A] mb-2">{d.question}</p>
              <p className="text-xs text-[#475569] mb-3">
                <span className="font-semibold">Your choice: </span>
                {d.chosenText}
              </p>
              <p className="text-xs text-[#475569] italic leading-relaxed">{d.feedback}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider mt-2 text-[#0F766E]">
                Score: {d.score} {d.best && "| Best choice"}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDownloadPdf(true)}
            className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0E7490]"
          >
            <Download className="w-4 h-4" /> Download summary PDF
          </button>
          <Link
            href="/tools/ir-plan/exercise"
            className="inline-flex items-center gap-2 text-[#475569] text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-white"
          >
            Try another scenario
          </Link>
          <Link
            href="/tools/ir-plan"
            className="inline-flex items-center gap-2 text-[#475569] text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-white"
          >
            Back to plan
          </Link>
        </div>
      </div>
      <Footer />
      {downloadPdf && savedExercise && (
        <IrPlanPdf
          mode="exercise"
          plan={plan}
          exercise={savedExercise}
          onClose={() => setDownloadPdf(false)}
        />
      )}
    </div>
  )
}
