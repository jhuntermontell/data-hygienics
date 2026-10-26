"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { getQuestionsForIndustry } from "@/lib/questions"
import { calculateTotalScore, calculateSectionScores } from "@/lib/cyber-audit/scoring"
import { getActiveDrillDowns } from "@/lib/cyber-audit/drill-downs"
import { getSubscription } from "@/lib/stripe/subscription"
import Navbar from "@/app/components/Navbar"
import ProgressBar from "../components/ProgressBar"
import QuestionRenderer from "../components/QuestionRenderer"
import IntakeModal from "../components/IntakeModal"
import UpgradeModal from "../components/UpgradeModal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Shield, CheckCircle, Lock, Loader2, AlertTriangle } from "lucide-react"

const FREE_TIER_QUESTION_LIMIT = 3

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
  const [initError, setInitError] = useState(null)
  const [saveError, setSaveError] = useState(null)
  // "idle" | "saving" | "saved" | "error". Used by the small status pill.
  const [saveStatus, setSaveStatus] = useState("idle")
  const [isPaid, setIsPaid] = useState(false)
  const [subLoading, setSubLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)

  // Debounced save machinery. We track every pending debounce timer and
  // every in-flight save promise so handleComplete can flush all of them
  // before calculating the final score.
  const pendingSavesRef = useRef(new Map()) // questionKey -> timeoutId
  const savePromisesRef = useRef(new Map()) // questionKey -> Promise<{error}>
  const latestAnswerRef = useRef({}) // questionKey -> latest value to flush
  // Keys whose most recent save errored. flushPendingSaves uses this to
  // retry them; doSave adds on failure and removes on success so the set
  // always reflects the current error state.
  const erroredKeysRef = useRef(new Set())

  // Clear every queued debounce timer on unmount so a late-firing save
  // cannot touch state after the component has been torn down.
  useEffect(() => {
    return () => {
      for (const [, timeoutId] of pendingSavesRef.current) {
        clearTimeout(timeoutId)
      }
      pendingSavesRef.current.clear()
    }
  }, [])

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push("/tools/cyber-audit/login")

      // Fetch subscription in parallel with the assessment lookup so the
      // free-tier gate has entitlement data ready by the time questions
      // are rendered.
      const [{ data: assessments, error: assessmentsError }, subData] = await Promise.all([
        supabase
          .from("assessments")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "in_progress")
          .order("created_at", { ascending: false })
          .limit(1),
        getSubscription(user.id),
      ])

      if (subData.entitlementUnknown) {
        // Treat "unknown" as unpaid for question rendering; the user can
        // still answer the first 3 questions and the completion path will
        // re-check.
        setIsPaid(false)
      } else {
        // access is the merged view from getPlanAccess: paid subscription or
        // promo plan, one-time purchases (Documentation Pack, legacy
        // Assessment Bundle) and the admin override. Checking the
        // subscription row alone left Documentation Pack buyers, promo users
        // and admins stuck at the 3-question free-tier wall.
        setIsPaid(subData.access?.canTakeAssessment === true)
      }
      setSubLoading(false)

      if (assessmentsError) {
        console.error("Failed to load assessments:", assessmentsError)
        setInitError("Could not load your assessment. Please refresh and try again.")
        setLoading(false)
        return
      }

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
    setInitError(null)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let id = assessmentId

    if (!id) {
      // Create new assessment with intake data
      const { data, error } = await supabase
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
      if (error || !data) {
        console.error("Failed to create assessment:", error)
        setInitError("Could not start the assessment. Please try again.")
        return
      }
      id = data.id
    } else {
      // Update existing assessment with intake data
      const { error } = await supabase
        .from("assessments")
        .update({
          industry: intakeAnswers.industry,
          employee_count: intakeAnswers.employee_count,
          has_insurance: intakeAnswers.has_insurance,
        })
        .eq("id", id)
      if (error) {
        console.error("Failed to update assessment:", error)
        setInitError("Could not save your intake answers. Please try again.")
        return
      }
    }

    setShowIntake(false)
    await loadAssessment({
      id,
      industry: intakeAnswers.industry,
      employee_count: intakeAnswers.employee_count,
      has_insurance: intakeAnswers.has_insurance,
    })
  }

  // Immediate persist for one (questionKey, answer) pair. Returns the
  // Supabase result so callers can check for errors. Never rejects. Callers
  // go through startSave, which serializes saves per key.
  const doSave = useCallback(
    async (questionKey, answer) => {
      if (!assessmentId) return { error: null }
      setSaveStatus("saving")
      // Resolve section id for both main questions and drill-downs.
      // Drill-down keys are scoped as `${parentKey}_dd_${drillKey}` by the
      // renderer, so a drill-down belongs to the same section as its parent.
      const resolveSection = (key) => {
        if (!sections) return null
        // Direct match: main question
        const direct = sections.find((s) =>
          s.questions.some((q) => q.key === key)
        )
        // Banks key sections by `id` (most) or `key` (financial).
        if (direct) return direct.id ?? direct.key
        // Drill-down: strip `_dd_...` suffix and look up the parent
        const ddIndex = key.indexOf("_dd_")
        if (ddIndex === -1) return null
        const parentKey = key.slice(0, ddIndex)
        const parentSection = sections.find((s) =>
          s.questions.some((q) => q.key === parentKey)
        )
        return parentSection?.id ?? parentSection?.key ?? null
      }

      const sectionKey = resolveSection(questionKey)

      if (!sectionKey && process.env.NODE_ENV !== "production") {
        console.warn("[autosave] Could not resolve section for key:", questionKey)
      }
      try {
        const result = await supabase.from("responses").upsert(
          {
            assessment_id: assessmentId,
            question_key: questionKey,
            section: sectionKey,
            answer,
            answered_at: new Date().toISOString(),
          },
          { onConflict: "assessment_id,question_key" }
        )
        if (result.error) {
          console.error("Autosave failed:", result.error)
          erroredKeysRef.current.add(questionKey)
          setSaveError(
            "Answer could not be saved. We will retry on the next change."
          )
          setSaveStatus("error")
          return { error: result.error }
        }
        // Success: drop this key from the errored set.
        erroredKeysRef.current.delete(questionKey)
        return { error: null }
      } catch (err) {
        console.error("Autosave exception:", err)
        erroredKeysRef.current.add(questionKey)
        setSaveError("Answer could not be saved. Please try again.")
        setSaveStatus("error")
        return { error: err }
      }
    },
    [assessmentId, sections, supabase]
  )

  // Save the latest answer for questionKey. Saves for one key run one at a
  // time, each queued behind the previous one, so two upserts for the same
  // question never race and the newest answer always lands last. A queued
  // save that has been superseded skips its write, since the newer save
  // will send the same latest answer. savePromisesRef holds the newest save
  // per key, and a settled save removes its entry only if it is still the
  // newest, so flushPendingSaves can always find a save that is pending.
  const startSave = useCallback(
    (questionKey) => {
      const previous = savePromisesRef.current.get(questionKey) || Promise.resolve()
      const run = () =>
        savePromisesRef.current.get(questionKey) === promise
          ? doSave(questionKey, latestAnswerRef.current[questionKey])
          : { error: null }
      const promise = previous.then(run, run).finally(() => {
        if (savePromisesRef.current.get(questionKey) === promise) {
          savePromisesRef.current.delete(questionKey)
        }
        // Update the top-level status pill only once everything has settled.
        if (
          savePromisesRef.current.size === 0 &&
          pendingSavesRef.current.size === 0 &&
          erroredKeysRef.current.size === 0
        ) {
          setSaveStatus("saved")
          setSaveError(null)
        }
      })
      savePromisesRef.current.set(questionKey, promise)
      return promise
    },
    [doSave]
  )

  // Schedule a debounced save. Tracks the timer by key so we can flush
  // or cancel it later.
  const scheduleSave = useCallback(
    (questionKey, answer) => {
      if (!assessmentId) return
      latestAnswerRef.current[questionKey] = answer
      if (pendingSavesRef.current.has(questionKey)) {
        clearTimeout(pendingSavesRef.current.get(questionKey))
      }
      setSaveStatus("saving")
      const timerId = setTimeout(() => {
        pendingSavesRef.current.delete(questionKey)
        startSave(questionKey)
      }, 300)
      pendingSavesRef.current.set(questionKey, timerId)
    },
    [assessmentId, startSave]
  )

  // Fire every pending debounced save immediately, then wait for all
  // in-flight promises to resolve. Returns true if every save succeeded.
  // Also retries any key whose most recent save errored. Without this
  // retry, flush would await stale already-rejected promises and fail
  // forever even on transient network errors.
  const flushPendingSaves = useCallback(async () => {
    // Phase 1: drain pending debounce timers
    for (const [key, timerId] of pendingSavesRef.current.entries()) {
      clearTimeout(timerId)
      startSave(key)
    }
    pendingSavesRef.current.clear()

    // Phase 2: retry any previously errored keys that aren't already
    // in flight. A settled save clears its slot, so a key is "errored but
    // not in flight" when it's in erroredKeysRef and NOT in
    // savePromisesRef. We fire a fresh save for each.
    for (const key of Array.from(erroredKeysRef.current)) {
      if (savePromisesRef.current.has(key)) continue
      if (latestAnswerRef.current[key] === undefined) continue
      startSave(key)
    }

    // Phase 3: wait for the newest save of every key to resolve (success
    // or error). A save started while we wait (the user changed an answer
    // again) replaces its key's entry, so loop until no unseen save is left
    // and judge each key by its newest result.
    const seen = new Set()
    const latestResults = new Map()
    for (;;) {
      const fresh = Array.from(savePromisesRef.current.entries()).filter(
        ([, promise]) => !seen.has(promise)
      )
      if (fresh.length === 0) break
      fresh.forEach(([, promise]) => seen.add(promise))
      const results = await Promise.all(fresh.map(([, promise]) => promise))
      fresh.forEach(([key], i) => latestResults.set(key, results[i]))
    }
    return Array.from(latestResults.values()).every((r) => !r?.error)
  }, [startSave])

  const handleAnswer = (questionKey, value) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }))
    scheduleSave(questionKey, value)
  }

  if (loading || showIntake) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        {showIntake ? (
          <>
            <IntakeModal onComplete={handleIntakeComplete} />
            {initError && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-[#DC2626]/40 bg-[#FEF2F2] px-5 py-3 shadow-lg">
                <p className="text-sm text-[#B91C1C]">{initError}</p>
              </div>
            )}
          </>
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

  // Returns true when every scored, visible question in a section has an
  // answer. "Visible" includes any drill-down that is currently active
  // because the parent question was answered.
  function isSectionFullyAnswered(s) {
    for (const q of s.questions) {
      if (q.optional) continue
      const parentAnswer = answers[q.key]
      if (parentAnswer === undefined || parentAnswer === "") return false
      // Drill-downs: if the parent answer triggered them, they must also
      // be answered (unless flagged as optional).
      const activeDrillDowns = getActiveDrillDowns(q, parentAnswer)
      for (const dd of activeDrillDowns) {
        if (dd.optional) continue
        const scopedKey = `${q.key}${dd.key}`
        const v = answers[scopedKey]
        if (v === undefined || v === "") return false
      }
    }
    return true
  }

  const completedSections = new Set()
  sections.forEach((s, i) => {
    if (isSectionFullyAnswered(s)) completedSections.add(i)
  })

  const isLastStep = currentStep === sections.length - 1
  const allComplete = sections.every(isSectionFullyAnswered)

  // ----- Free-tier gating ----------------------------------------------
  // Build a flat ordered list of scored parent questions across all sections,
  // then compute how many the current section is allowed to show for a
  // free-tier user. Drill-downs do not count against the limit; they live
  // under their parent and are metadata, not independent questions.
  const flatQuestionIndex = []
  sections.forEach((s, si) => {
    s.questions.forEach((q, qi) => {
      flatQuestionIndex.push({ sectionIndex: si, questionIndex: qi, key: q.key })
    })
  })

  const effectiveLimit = isPaid ? Infinity : FREE_TIER_QUESTION_LIMIT
  // Get the set of question keys the user is allowed to interact with.
  const allowedKeys = new Set(
    flatQuestionIndex.slice(0, effectiveLimit).map((q) => q.key)
  )
  const sectionVisibleQuestions = section.questions.filter((q) =>
    allowedKeys.has(q.key)
  )
  const sectionHasLockedQuestions =
    sectionVisibleQuestions.length < section.questions.length
  // The user has hit the free-tier limit in the current section when we
  // can't show every question here, OR they've progressed to a section
  // that is entirely past the limit.
  const freeTierWall = !isPaid && (sectionHasLockedQuestions || sectionVisibleQuestions.length === 0)

  const handleComplete = async () => {
    setSaveError(null)
    // Completion is paid-only. Free users must upgrade.
    if (!isPaid) {
      setShowUpgrade(true)
      return
    }
    setCompleting(true)

    // 1. Flush any debounced save that hasn't fired yet, plus any
    //    in-flight saves, and refuse to complete if any of them errored.
    const flushOk = await flushPendingSaves()
    if (!flushOk) {
      setSaveError(
        "Some answers could not be saved. Please try again in a moment."
      )
      setCompleting(false)
      return
    }

    // 2. Calculate the final score and mark the assessment complete.
    const score = calculateTotalScore(answers, sections)
    const sectionScores = calculateSectionScores(answers, sections)

    const { error } = await supabase
      .from("assessments")
      .update({
        status: "completed",
        score,
        section_scores: JSON.stringify(sectionScores),
        completed_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)

    if (error) {
      console.error("Failed to complete assessment:", error)
      setSaveError(
        "Could not save your results. Your answers are safe. Please try completing again."
      )
      setCompleting(false)
      return
    }

    router.push("/tools/cyber-audit/results")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Assessment type indicator banner */}
      <div className="pt-16">
        <div className="bg-[#0F766E]">
          <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-semibold tracking-wide uppercase">
              Comprehensive Cyber Audit
              {industry && <> &nbsp;&middot;&nbsp; {industry}</>}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">

        <ProgressBar
          currentStep={currentStep}
          completedSections={completedSections}
          sections={sections}
          onNavigate={setCurrentStep}
        />

        {/* Save status pill + error banner */}
        <div className="flex items-center justify-between mb-4 min-h-[24px]">
          <div className="text-xs flex items-center gap-1.5">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-[#94A3B8]" />
                <span className="text-[#94A3B8]">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && !saveError && (
              <>
                <CheckCircle className="w-3 h-3 text-[#059669]" />
                <span className="text-[#059669]">All answers saved</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                <span className="text-[#DC2626]">{saveError || "Save failed"}</span>
              </>
            )}
          </div>
        </div>

        {saveError && saveStatus !== "error" && (
          <div className="mb-4 rounded-xl border border-[#DC2626]/40 bg-[#FEF2F2] p-4">
            <p className="text-sm text-[#B91C1C]">{saveError}</p>
          </div>
        )}

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
              {sectionVisibleQuestions.map((question, i) => {
                const activeDrillDowns = getActiveDrillDowns(question, answers[question.key])
                return (
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

                    {activeDrillDowns.length > 0 && (
                      <div className="mt-6 pl-4 border-l-2 border-[#1D4ED8]/20 space-y-6">
                        <p className="text-[10px] font-semibold text-[#1D4ED8] uppercase tracking-widest">
                          Follow-up details
                        </p>
                        {activeDrillDowns.map((dd, ddIdx) => {
                          const scopedKey = `${question.key}${dd.key}`
                          const scopedQuestion = { ...dd, key: scopedKey }
                          return (
                            <QuestionRenderer
                              key={scopedKey}
                              question={scopedQuestion}
                              value={answers[scopedKey]}
                              onChange={(val) => handleAnswer(scopedKey, val)}
                              index={ddIdx}
                            />
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* Free-tier paywall card: replaces the remaining questions */}
              {freeTierWall && !subLoading && (
                <div className="rounded-2xl border-2 border-dashed border-[#1D4ED8]/30 bg-[#EFF6FF] p-8 text-center">
                  <Lock className="w-10 h-10 text-[#1D4ED8] mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                    Unlock the full assessment
                  </h3>
                  <p className="text-sm text-[#475569] max-w-md mx-auto mb-5">
                    The free preview shows the first {FREE_TIER_QUESTION_LIMIT} questions. The Documentation Pack ($299, one-time) unlocks every section of the comprehensive audit along with your summary and remediation reports, all 9 policies (including an AI Acceptable Use Policy), and your incident response plan.
                  </p>
                  <Button onClick={() => setShowUpgrade(true)}>
                    <span className="flex items-center gap-2">
                      Unlock Full Assessment <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              )}
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
                <Button
                  onClick={handleComplete}
                  disabled={!allComplete || completing || !isPaid}
                >
                  <span className="flex items-center gap-2">
                    {completing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : !isPaid ? (
                      <>
                        <Lock className="w-4 h-4" /> Upgrade to complete
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
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={freeTierWall}
                >
                  <span className="flex items-center gap-2">
                    {freeTierWall ? (
                      <>
                        <Lock className="w-4 h-4" /> Upgrade to continue
                      </>
                    ) : (
                      <>
                        Next Section
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature="Full Assessment" />}
    </div>
  )
}
