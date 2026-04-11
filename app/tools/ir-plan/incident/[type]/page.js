"use client"

// NOTE: Incident writes go directly to Supabase (not through API routes).
// This is intentional. Active Incident Mode is always available if the user
// has a saved plan, regardless of subscription status. RLS enforces ownership.
// Builder and exercise writes go through /api/ir-plan/ routes for entitlement
// enforcement; incident writes do not need that gate.

import { useEffect, useMemo, useState, useRef, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { createClient } from "@/lib/supabase/client"
import {
  PLAYBOOKS,
  buildPlanContext,
  interpolateStep,
  getIncidentType,
  getPlanReadinessWarnings,
} from "@/lib/ir-plan/playbooks"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  Copy,
  Download,
  Edit3,
  Phone,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  WifiOff,
} from "lucide-react"

const IrPlanPdf = dynamic(() => import("@/app/tools/ir-plan/components/IrPlanPdf"), {
  ssr: false,
})

export default function ActiveIncidentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#DC2626]/30 border-t-[#DC2626] rounded-full animate-spin" />
        </div>
      }
    >
      <ActiveIncidentInner />
    </Suspense>
  )
}

function ActiveIncidentInner() {
  const { type } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("resume")

  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  // confirm | active | summary | activation_failed
  const [phase, setPhase] = useState("confirm")
  const [incident, setIncident] = useState(null)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [completedSteps, setCompletedSteps] = useState({})
  const [actionLog, setActionLog] = useState([])
  const [expandedWhy, setExpandedWhy] = useState({})
  const [phaseNotes, setPhaseNotes] = useState({})
  const [conditionalAnswers, setConditionalAnswers] = useState({})
  const [finalSummary, setFinalSummary] = useState("")
  const [lessonsLearned, setLessonsLearned] = useState("")
  const [planUpdates, setPlanUpdates] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const [pdfReady, setPdfReady] = useState(false)
  const [draftPdfReady, setDraftPdfReady] = useState(false)
  const [showPhaseTransition, setShowPhaseTransition] = useState(false)
  const [activationError, setActivationError] = useState(null)
  const [existingActive, setExistingActive] = useState(null)
  const [resumedFrom, setResumedFrom] = useState(null) // "url" | "local" | null
  const [copiedScripts, setCopiedScripts] = useState({})
  const [closeoutError, setCloseoutError] = useState(false)
  const [closing, setClosing] = useState(false)
  const [closingOut, setClosingOut] = useState(false)
  const notesTimerRef = useRef(null)

  // Refs that mirror state for any code path that persists to Supabase. Async
  // callbacks (debounced note saves, retry loops, double-click guards) close
  // over render-time state and would otherwise see stale values. The update*
  // helpers below keep ref and state in lock-step.
  const completedStepsRef = useRef({})
  const actionLogRef = useRef([])
  const conditionalAnswersRef = useRef({})
  const phaseNotesRef = useRef({})
  const phaseIdxRef = useRef(0)
  const incidentIdRef = useRef(null)

  // Pending operations: refs gate against double-clicks; state mirrors them
  // so the disabled prop on buttons re-renders correctly.
  const pendingStepsRef = useRef(new Set())
  const [pendingSteps, setPendingSteps] = useState(new Set())
  const pendingDecisionsRef = useRef(new Set())
  const [pendingDecisions, setPendingDecisions] = useState(new Set())
  const closingOutRef = useRef(false)

  // Sync state: idle | saving | success | failed
  const [syncStatus, setSyncStatus] = useState("idle")
  const successTimeoutRef = useRef(null)
  const startedAtRef = useRef(null)

  // ===== Ref-mirrored state setters =====
  function updateCompletedSteps(updater) {
    const next = typeof updater === "function" ? updater(completedStepsRef.current) : updater
    completedStepsRef.current = next
    setCompletedSteps(next)
  }
  function updateActionLog(updater) {
    const next = typeof updater === "function" ? updater(actionLogRef.current) : updater
    actionLogRef.current = next
    setActionLog(next)
  }
  function updateConditionalAnswers(updater) {
    const next = typeof updater === "function" ? updater(conditionalAnswersRef.current) : updater
    conditionalAnswersRef.current = next
    setConditionalAnswers(next)
  }
  function updatePhaseNotes(updater) {
    const next = typeof updater === "function" ? updater(phaseNotesRef.current) : updater
    phaseNotesRef.current = next
    setPhaseNotes(next)
  }
  function updatePhaseIdx(value) {
    phaseIdxRef.current = value
    setPhaseIdx(value)
  }
  function updateIncident(value) {
    incidentIdRef.current = value?.id || null
    setIncident(value)
  }

  const incidentMeta = getIncidentType(type)
  const playbook = PLAYBOOKS[type]

  // ===== Init =====
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
      const { data: planData } = await supabase
        .from("ir_plans")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle()
      setPlan(planData || null)

      if (!planData) {
        setLoading(false)
        return
      }

      // Resume from URL ?resume=<id>
      if (resumeId) {
        const { data: incidentRow } = await supabase
          .from("ir_incidents")
          .select("*")
          .eq("id", resumeId)
          .eq("user_id", session.user.id)
          .maybeSingle()
        if (incidentRow && incidentRow.incident_type === type) {
          restoreFromIncident(incidentRow)
          setResumedFrom("url")
          setLoading(false)
          return
        }
      }

      // Fallback: check localStorage for an active-incident marker. This
      // covers the case where the user closed and reopened the tab without
      // a resume URL (or the marker outlives a stale browser session).
      let localId = null
      try {
        localId = localStorage.getItem(`ir_active_incident_${planData.id}`)
      } catch {
        // ignore
      }
      if (localId) {
        const { data: localIncident } = await supabase
          .from("ir_incidents")
          .select("*")
          .eq("id", localId)
          .eq("user_id", session.user.id)
          .eq("status", "active")
          .maybeSingle()
        if (localIncident && localIncident.incident_type === type) {
          restoreFromIncident(localIncident)
          setResumedFrom("local")
          setLoading(false)
          return
        }
        // Stale marker, clean it up
        try {
          localStorage.removeItem(`ir_active_incident_${planData.id}`)
        } catch {
          // ignore
        }
      }

      // Otherwise check for an existing active incident of this type
      const { data: activeRows } = await supabase
        .from("ir_incidents")
        .select("*")
        .eq("plan_id", planData.id)
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(5)

      const sameType = (activeRows || []).find((r) => r.incident_type === type)
      const otherActive = (activeRows || []).find((r) => r.incident_type !== type)

      if (sameType) {
        setExistingActive(sameType)
      } else if (otherActive) {
        setExistingActive(otherActive)
      }

      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId, type])

  function restoreFromIncident(incidentRow) {
    updateIncident(incidentRow)
    updateActionLog(Array.isArray(incidentRow.action_log) ? incidentRow.action_log : [])
    const ws = incidentRow.workflow_state || {}
    // Clamp the restored phase index to current playbook bounds in case the
    // playbook structure changed since the incident was started.
    const maxPhaseIdx = (PLAYBOOKS[type]?.phases?.length || 1) - 1
    const clampedPhaseIdx = Math.min(
      Math.max(0, ws.currentPhaseIdx || 0),
      Math.max(0, maxPhaseIdx)
    )
    updatePhaseIdx(clampedPhaseIdx)
    const completedFromLog = {}
    if (Array.isArray(incidentRow.action_log)) {
      // Reconstruct the per-step completion timestamps from any non-reopened entries
      for (const entry of incidentRow.action_log) {
        if (entry.step_id && entry.type !== "step_reopened") {
          completedFromLog[entry.step_id] = entry.timestamp
        }
        if (entry.type === "step_reopened" && entry.step_id) {
          delete completedFromLog[entry.step_id]
        }
      }
    }
    updateCompletedSteps({ ...(ws.completedStepsTimestamps || {}), ...completedFromLog })
    updateConditionalAnswers(ws.conditionalAnswers || {})
    updatePhaseNotes(ws.phaseNotes || {})
    if (incidentRow.started_at) {
      startedAtRef.current = new Date(incidentRow.started_at).getTime()
    }
    setPhase("active")
  }

  // Live elapsed clock
  useEffect(() => {
    if (phase !== "active" || !startedAtRef.current) return
    setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000))
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  // ===== Loading / not found / no plan =====
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#DC2626]/30 border-t-[#DC2626] rounded-full animate-spin" />
      </div>
    )
  }

  if (!incidentMeta || !playbook) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 text-center">
          <p className="text-[#475569] mb-4">Unknown incident type.</p>
          <Link href="/tools/ir-plan" className="text-[#0F766E] font-semibold underline">
            Back to incident response
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 text-center">
          <p className="text-[#475569] mb-4">
            You need to build your incident response plan before you can activate it.
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

  const ctx = buildPlanContext(plan)
  const warnings = getPlanReadinessWarnings(plan)

  // ===== Activation =====
  async function startIncident(isPractice) {
    setActivationError(null)
    const supabase = createClient()
    const startedAt = new Date()

    const initialLog = [
      {
        timestamp: startedAt.toISOString(),
        action: `Incident response activated: ${incidentMeta.title}${isPractice ? " (practice run)" : ""}`,
      },
    ]

    const { data, error } = await supabase
      .from("ir_incidents")
      .insert({
        plan_id: plan.id,
        user_id: user.id,
        incident_type: type,
        severity: incidentMeta.severity,
        status: isPractice ? "practice" : "active",
        started_at: startedAt.toISOString(),
        action_log: initialLog,
        workflow_state: {
          currentPhaseIdx: 0,
          completedStepsTimestamps: {},
          conditionalAnswers: {},
          phaseNotes: {},
        },
      })
      .select()
      .single()

    if (error || !data) {
      console.error("Failed to start incident:", error)
      setActivationError(
        "We could not start the incident log. Please check your internet connection and try again. If this continues, use the printable quick-reference cards from your plan while we resolve the issue."
      )
      setPhase("activation_failed")
      return
    }

    // Persist incident ID locally as a fallback
    try {
      localStorage.setItem(`ir_active_incident_${plan.id}`, data.id)
    } catch {
      // ignore localStorage failures
    }

    startedAtRef.current = startedAt.getTime()
    updateIncident(data)
    updateActionLog(initialLog)
    setPhase("active")
  }

  function shouldShowStep(step) {
    if (!step.conditional) return true
    if (step.conditional === "has_legal_counsel") {
      return !!plan.legal_counsel?.name
    }
    if (step.conditional === "data_possibly_compromised") {
      return conditionalAnswers.data_compromised === true
    }
    if (step.conditional === "has_mdm") {
      return conditionalAnswers.has_mdm === true
    }
    if (step.conditional === "no_mdm") {
      return conditionalAnswers.has_mdm === false
    }
    if (step.conditional === "unencrypted_sensitive_data") {
      return conditionalAnswers.unencrypted_sensitive === true
    }
    return true
  }

  const currentPhase = playbook.phases[phaseIdx]
  const visibleSteps = currentPhase ? currentPhase.steps.filter(shouldShowStep) : []
  const completedInCurrentPhase = visibleSteps.filter((s) => !!completedSteps[s.id]).length

  // ===== Persistence =====
  function flashSyncSuccess() {
    setSyncStatus("success")
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    successTimeoutRef.current = setTimeout(() => setSyncStatus("idle"), 2000)
  }

  // Always reads action_log + workflow_state from refs at call time. Callers
  // may pass `overrides` to add status/resolved_at/etc.
  async function persistIncidentUpdate(overrides = {}) {
    const id = incidentIdRef.current
    if (!id) return { error: null }

    // During closeout, only allow writes that explicitly include status/
    // resolved_at. Routine step/decision/note saves no-op so they cannot
    // race with the final close write.
    if (closingOutRef.current && !overrides.status && !overrides.resolved_at) {
      return { error: null }
    }

    const payload = {
      action_log: actionLogRef.current,
      workflow_state: buildWorkflowState(),
      ...overrides,
    }

    setSyncStatus("saving")
    const supabase = createClient()
    let lastError = null
    for (let attempt = 1; attempt <= 3; attempt++) {
      let query = supabase.from("ir_incidents").update(payload).eq("id", id)
      // For routine writes (no explicit status), gate on status='active' so
      // a stale request cannot mutate a resolved or practice incident.
      if (!overrides.status) {
        query = query.eq("status", incident?.status || "active")
      }
      const { error } = await query
      if (!error) {
        flashSyncSuccess()
        return { error: null }
      }
      lastError = error
      console.error(`Sync attempt ${attempt} failed:`, error)
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 5000))
      }
    }
    console.error("All sync retries failed:", lastError)
    setSyncStatus("failed")
    return { error: lastError }
  }

  function buildWorkflowState() {
    return {
      currentPhaseIdx: phaseIdxRef.current,
      completedStepsTimestamps: completedStepsRef.current,
      conditionalAnswers: conditionalAnswersRef.current,
      phaseNotes: phaseNotesRef.current,
    }
  }

  // ===== Note timer cancel/flush =====
  function cancelPendingNoteTimer() {
    if (notesTimerRef.current) {
      clearTimeout(notesTimerRef.current)
      notesTimerRef.current = null
    }
  }

  async function flushPendingNotes() {
    cancelPendingNoteTimer()
    await persistIncidentUpdate()
  }

  // Phase notes are debounced to workflow_state so a refresh or browser
  // crash mid-typing does not lose them. Notes are only appended to the
  // append-only action_log when the user advances the phase.
  function handlePhaseNoteChange(value) {
    if (closingOutRef.current) return
    updatePhaseNotes((prev) => ({ ...prev, [phaseIdxRef.current]: value }))
    cancelPendingNoteTimer()
    notesTimerRef.current = setTimeout(() => {
      notesTimerRef.current = null
      persistIncidentUpdate()
    }, 2000)
  }

  function handlePhaseNoteBlur() {
    if (closingOutRef.current) return
    cancelPendingNoteTimer()
    persistIncidentUpdate()
  }

  // ===== Step toggling (append-only audit log) =====
  async function toggleStep(rawStep) {
    const stepId = rawStep.id
    if (closingOutRef.current) return
    if (pendingStepsRef.current.has(stepId)) return
    pendingStepsRef.current.add(stepId)
    setPendingSteps((prev) => {
      const next = new Set(prev)
      next.add(stepId)
      return next
    })
    cancelPendingNoteTimer()

    const isCompleted = !!completedStepsRef.current[stepId]
    const stamp = new Date().toISOString()
    const interpolated = interpolateStep(rawStep, ctx)

    let entry
    if (isCompleted) {
      // Reopen: append, never delete
      updateCompletedSteps((prev) => {
        const next = { ...prev }
        delete next[stepId]
        return next
      })
      const trimmed = (interpolated.action || "").substring(0, 80)
      entry = {
        timestamp: stamp,
        step_id: stepId,
        action: `Step reopened: ${trimmed}${interpolated.action.length > 80 ? "..." : ""}`,
        type: "step_reopened",
      }
    } else {
      updateCompletedSteps((prev) => ({ ...prev, [stepId]: stamp }))
      entry = {
        timestamp: stamp,
        action: interpolated.action,
        step_id: stepId,
      }
    }

    updateActionLog((prev) => [...prev, entry])
    await persistIncidentUpdate()

    pendingStepsRef.current.delete(stepId)
    setPendingSteps((prev) => {
      const next = new Set(prev)
      next.delete(stepId)
      return next
    })
  }

  async function setConditionalAnswer(key, value) {
    if (closingOutRef.current) return
    if (pendingDecisionsRef.current.has(key)) return
    pendingDecisionsRef.current.add(key)
    setPendingDecisions((prev) => {
      const next = new Set(prev)
      next.add(key)
      return next
    })
    cancelPendingNoteTimer()

    updateConditionalAnswers((prev) => ({ ...prev, [key]: value }))
    const stamp = new Date().toISOString()
    const entry = {
      timestamp: stamp,
      action: `Decision recorded: ${key.replace(/_/g, " ")} = ${value ? "yes" : "no"}`,
      type: "decision",
    }
    updateActionLog((prev) => [...prev, entry])
    await persistIncidentUpdate()

    pendingDecisionsRef.current.delete(key)
    setPendingDecisions((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  async function copyScript(scriptText, key) {
    if (typeof navigator === "undefined" || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(scriptText)
      setCopiedScripts((p) => ({ ...p, [key]: true }))
      setTimeout(() => {
        setCopiedScripts((p) => ({ ...p, [key]: false }))
      }, 2000)
    } catch {
      // ignore
    }
  }

  const allCriticalDone = useMemo(() => {
    return playbook.phases.every((p) =>
      p.steps.filter(shouldShowStep).every((s) => !s.critical || completedSteps[s.id])
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedSteps, conditionalAnswers, playbook])

  // Detect unanswered decision points relevant to the current phase
  const unansweredDecisions = useMemo(() => {
    const list = []
    if (
      (type === "data_breach" || type === "ransomware" || type === "phishing") &&
      phaseIdx === 0 &&
      conditionalAnswers.data_compromised === undefined
    ) {
      list.push("data_compromised")
    }
    if (type === "lost_device" && phaseIdx === 0 && conditionalAnswers.has_mdm === undefined) {
      list.push("has_mdm")
    }
    if (
      type === "lost_device" &&
      phaseIdx === 0 &&
      completedSteps["l4"] &&
      conditionalAnswers.unencrypted_sensitive === undefined
    ) {
      list.push("unencrypted_sensitive")
    }
    return list
  }, [type, phaseIdx, conditionalAnswers, completedSteps])

  async function advancePhase() {
    if (closingOutRef.current) return
    cancelPendingNoteTimer()

    const noteText = phaseNotesRef.current[phaseIdxRef.current]
    if (noteText) {
      const stamp = new Date().toISOString()
      const entry = {
        timestamp: stamp,
        action: `Note for "${currentPhase.title}": ${noteText}`,
        type: "note",
      }
      updateActionLog((prev) => [...prev, entry])
    }
    if (phaseIdxRef.current < playbook.phases.length - 1) {
      const nextPhase = phaseIdxRef.current + 1
      updatePhaseIdx(nextPhase)
      setShowPhaseTransition(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
      await persistIncidentUpdate()
    } else {
      await persistIncidentUpdate()
      setPhase("summary")
    }
  }

  async function endIncident() {
    if (!incidentIdRef.current) {
      setPhase("summary")
      return
    }
    // Block any new step/decision/note writes during the close write
    closingOutRef.current = true
    setClosingOut(true)
    setClosing(true)
    setCloseoutError(false)
    cancelPendingNoteTimer()

    // Give any in-flight persist a chance to settle
    await new Promise((resolve) => setTimeout(resolve, 100))

    const supabase = createClient()
    const resolved = new Date().toISOString()
    const finalLog = [
      ...actionLogRef.current,
      { timestamp: resolved, action: "Incident response closed" },
    ]

    // Use a status-gated update so a concurrent stale write that somehow
    // got past the closingOutRef gate cannot mutate a resolved incident.
    const { error } = await supabase
      .from("ir_incidents")
      .update({
        action_log: finalLog,
        status: "resolved",
        resolved_at: resolved,
        summary: finalSummary,
        lessons_learned: lessonsLearned,
        plan_updates_needed: planUpdates,
        workflow_state: {},
      })
      .eq("id", incidentIdRef.current)
      .eq("status", "active")

    setClosing(false)

    if (error) {
      console.error("Failed to close incident:", error)
      // Do NOT remove the localStorage marker. Do NOT mark as resolved.
      // Re-open the gate so the user can retry.
      closingOutRef.current = false
      setClosingOut(false)
      setCloseoutError(true)
      return
    }

    try {
      localStorage.removeItem(`ir_active_incident_${plan.id}`)
    } catch {
      // ignore
    }

    updateActionLog(finalLog)
    setPdfReady(true)
  }

  function downloadLocalDraft() {
    setDraftPdfReady(true)
  }

  // ===== Existing-active modal (Fix 1E) =====
  if (existingActive && phase === "confirm") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 pt-32 pb-20">
          <div className="bg-white border-2 border-[#F59E0B] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h1 className="text-xl font-bold text-[#0F172A]">
                You have an active incident
              </h1>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed mb-6">
              An active{" "}
              <span className="font-semibold capitalize">
                {(existingActive.incident_type || "").replace(/_/g, " ")}
              </span>{" "}
              incident was started on{" "}
              {new Date(existingActive.started_at).toLocaleString()}. Would you like to resume it or start a new one?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setExistingActive(null)
                  router.replace(
                    `/tools/ir-plan/incident/${existingActive.incident_type}?resume=${existingActive.id}`
                  )
                }}
                className="flex-1 bg-[#0F766E] text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#0E7490] transition-colors"
              >
                Resume existing
              </button>
              <button
                onClick={() => setExistingActive(null)}
                className="flex-1 bg-white text-[#475569] text-sm font-semibold px-5 py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              >
                Start new incident
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ===== Activation failed =====
  if (phase === "activation_failed") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 pt-32 pb-20">
          <div className="bg-white border-2 border-[#DC2626] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              </div>
              <h1 className="text-xl font-bold text-[#0F172A]">Could not start incident log</h1>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed mb-6">{activationError}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setActivationError(null)
                  setPhase("confirm")
                }}
                className="flex-1 bg-[#0F766E] text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#0E7490]"
              >
                Try again
              </button>
              <Link
                href="/tools/ir-plan/view?download=cards"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-[#475569] text-sm font-semibold px-5 py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC]"
              >
                <Download className="w-4 h-4" /> Download quick-reference cards
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ===== Confirmation screen =====
  if (phase === "confirm") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
          <Link
            href="/tools/ir-plan"
            className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="bg-white border-2 border-[#DC2626] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Activate Response</h1>
            </div>
            <p className="text-[#475569] text-base leading-relaxed mb-6">
              You are activating the <strong>{incidentMeta.title}</strong> response playbook. This will begin logging your actions with timestamps. Is this a real incident or a practice run?
            </p>

            {warnings.length > 0 && (
              <div className="mb-6 rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-4">
                <p className="text-sm font-semibold text-[#92400E] mb-2">
                  Your plan is missing some critical contact information.
                </p>
                <p className="text-xs text-[#92400E] leading-relaxed mb-3">
                  The playbook will show placeholder text where these details should be. We recommend updating your plan before activating.
                </p>
                <ul className="space-y-1.5 mb-3">
                  {warnings.map((w, i) => (
                    <li key={i} className="text-xs text-[#92400E] flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> {w.field}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/tools/ir-plan/builder"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#92400E] hover:underline"
                >
                  <Edit3 className="w-3 h-3" /> Fix now
                </Link>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => startIncident(false)}
                className="flex-1 bg-[#DC2626] text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#B91C1C] transition-colors min-h-[48px]"
              >
                This is a real incident
              </button>
              <button
                onClick={() => startIncident(true)}
                className="flex-1 bg-white text-[#475569] text-sm font-semibold px-5 py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors min-h-[48px]"
              >
                This is a practice run
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ===== Summary screen =====
  if (phase === "summary") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#F0FDFA] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#0F766E]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Incident response complete</h1>
              <p className="text-sm text-[#475569]">
                {actionLog.length} actions logged over {formatElapsed(elapsed)}
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-3">
              Action timeline
            </h2>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 max-h-72 overflow-y-auto">
              {actionLog.map((entry, i) => (
                <div
                  key={i}
                  className="mb-3 pb-3 border-b border-[#E2E8F0] last:border-0 last:mb-0 last:pb-0"
                >
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#0F766E]">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-[#0F172A] mt-1">{entry.action}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <label className="text-sm font-semibold text-[#0F172A] block mb-2">Final summary</label>
            <textarea
              value={finalSummary}
              onChange={(e) => setFinalSummary(e.target.value)}
              rows={3}
              placeholder="What happened, in your own words?"
              className="w-full rounded-lg border border-[#E2E8F0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </section>
          <section className="mb-6">
            <label className="text-sm font-semibold text-[#0F172A] block mb-2">Lessons learned</label>
            <textarea
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              rows={3}
              placeholder="What worked? What did not?"
              className="w-full rounded-lg border border-[#E2E8F0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </section>
          <section className="mb-8">
            <label className="text-sm font-semibold text-[#0F172A] block mb-2">
              Updates needed to your plan
            </label>
            <textarea
              value={planUpdates}
              onChange={(e) => setPlanUpdates(e.target.value)}
              rows={3}
              placeholder="Anything that should be added, removed, or changed in the plan?"
              className="w-full rounded-lg border border-[#E2E8F0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </section>

          {closeoutError && (
            <div className="mb-5 rounded-xl border border-[#DC2626]/40 bg-[#FEF2F2] p-5">
              <p className="text-sm font-semibold text-[#B91C1C] mb-2">
                Could not save your incident summary
              </p>
              <p className="text-sm text-[#7F1D1D] leading-relaxed mb-4">
                Your incident summary could not be saved. Please check your internet connection and try again. You can download a local draft of your incident report, but it will be marked as &quot;UNSAVED DRAFT&quot; and may not reflect what is stored in your account.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={endIncident}
                  disabled={closing}
                  className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#B91C1C] disabled:opacity-60"
                >
                  {closing ? "Saving..." : "Try again"}
                </button>
                <button
                  onClick={downloadLocalDraft}
                  className="inline-flex items-center gap-2 bg-white text-[#7F1D1D] text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#DC2626]/40 hover:bg-[#FEE2E2]"
                >
                  <Download className="w-4 h-4" /> Download local draft
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={endIncident}
              disabled={closing}
              className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0E7490] disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {closing ? "Saving..." : "Save and download report"}
            </button>
            <Link
              href="/tools/ir-plan"
              className="inline-flex items-center gap-2 text-[#475569] text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC]"
            >
              Back to plan
            </Link>
          </div>
        </div>
        {pdfReady && (
          <IrPlanPdf
            mode="incident"
            plan={plan}
            incident={{
              ...incident,
              action_log: actionLog,
              summary: finalSummary,
              lessons_learned: lessonsLearned,
              plan_updates_needed: planUpdates,
              status: "resolved",
            }}
            onClose={() => {
              setPdfReady(false)
              router.push("/tools/ir-plan")
            }}
          />
        )}
        {draftPdfReady && (
          <IrPlanPdf
            mode="incident"
            draft
            plan={plan}
            incident={{
              ...incident,
              action_log: actionLog,
              summary: finalSummary,
              lessons_learned: lessonsLearned,
              plan_updates_needed: planUpdates,
              status: "draft_unsaved",
            }}
            onClose={() => setDraftPdfReady(false)}
          />
        )}
      </div>
    )
  }

  // ===== Active incident UI =====
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar - mobile responsive */}
      <div className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                  {incident?.status === "practice" ? "Practice Run" : "Active Incident"}
                </p>
                <p className="text-sm font-bold text-[#0F172A] truncate">{incidentMeta.title}</p>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 hidden sm:inline ${
                  incidentMeta.severity === "critical"
                    ? "bg-[#FEE2E2] text-[#B91C1C]"
                    : incidentMeta.severity === "high"
                    ? "bg-[#FFEDD5] text-[#C2410C]"
                    : "bg-[#FEF3C7] text-[#92400E]"
                }`}
              >
                {incidentMeta.severity}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <SyncIndicator status={syncStatus} />
              <div className="flex items-center gap-1.5 text-sm font-mono text-[#475569]">
                <Clock className="w-4 h-4" />
                {formatElapsed(elapsed)}
              </div>
              {allCriticalDone && (
                <button
                  onClick={() => setPhase("summary")}
                  disabled={closingOut}
                  className="text-xs font-semibold text-[#475569] hover:text-[#DC2626] px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#DC2626] transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  End incident
                </button>
              )}
            </div>
          </div>
          {syncStatus === "failed" && (
            <div className="mt-2 rounded-lg bg-[#FEF2F2] border border-[#DC2626]/30 px-3 py-2 flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-[#DC2626]" />
              <p className="text-xs text-[#B91C1C]">
                Some actions may not be saved. Your progress is preserved locally. Please check your internet connection.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {resumedFrom && (
          <div className="mb-6 rounded-xl bg-[#F0FDFA] border border-[#0F766E]/30 px-4 py-3">
            <p className="text-sm text-[#0F766E] font-semibold">
              Resuming incident started at{" "}
              {incident?.started_at ? new Date(incident.started_at).toLocaleString() : ""}.{" "}
              {Object.keys(completedSteps).length} step
              {Object.keys(completedSteps).length === 1 ? "" : "s"} completed.
            </p>
          </div>
        )}

        {/* Phase indicator */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            {playbook.phases.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < phaseIdx ? "bg-[#0F766E]" : i === phaseIdx ? "bg-[#DC2626]" : "bg-[#E2E8F0]"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#94A3B8]">
            Phase {phaseIdx + 1} of {playbook.phases.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showPhaseTransition ? (
            <motion.div
              key={`phase-${phaseIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <h2 className="text-2xl font-bold text-[#0F172A] mb-1">{currentPhase.title}</h2>
              <p className="text-base text-[#475569] mb-6">{currentPhase.subtitle}</p>

              <div className="space-y-4">
                {visibleSteps.map((rawStep) => {
                  const step = interpolateStep(rawStep, ctx)
                  const stepId = step.id
                  const isDone = !!completedSteps[stepId]
                  const showWhy = !!expandedWhy[stepId]
                  const phoneInScript = extractPhone(step.script)

                  return (
                    <div
                      key={stepId}
                      className={`rounded-xl border bg-white overflow-hidden transition-all ${
                        step.critical
                          ? "border-l-4 border-l-[#DC2626] border-y border-r border-[#E2E8F0]"
                          : "border border-[#E2E8F0]"
                      } ${isDone ? "opacity-60" : ""}`}
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          {/* Larger tap target wrapper */}
                          <button
                            type="button"
                            onClick={() => toggleStep(rawStep)}
                            disabled={pendingSteps.has(stepId) || closingOut}
                            className="shrink-0 w-11 h-11 -m-2 p-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={isDone ? "Mark step incomplete" : "Mark step complete"}
                          >
                            <div
                              className={`w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all ${
                                isDone
                                  ? "bg-[#0F766E] border-[#0F766E]"
                                  : "border-[#94A3B8] hover:border-[#0F766E] bg-white"
                              }`}
                            >
                              {isDone && <Check className="w-5 h-5 text-white" />}
                            </div>
                          </button>
                          <div className="flex-1 min-w-0">
                            {step.critical && (
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded-full mb-1.5">
                                Critical
                              </span>
                            )}
                            <p
                              className={`text-base leading-relaxed ${isDone ? "line-through" : ""}`}
                            >
                              {step.action}
                            </p>
                            {phoneInScript && (
                              <a
                                href={`tel:${phoneInScript.replace(/[^0-9+]/g, "")}`}
                                className="inline-flex items-center gap-1.5 mt-2 bg-[#0F766E] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0E7490] min-h-[44px]"
                              >
                                <Phone className="w-3.5 h-3.5" /> Call {phoneInScript}
                              </a>
                            )}
                            {isDone && completedSteps[stepId] && (
                              <p className="text-[10px] text-[#0F766E] font-semibold mt-1">
                                Completed at {new Date(completedSteps[stepId]).toLocaleTimeString()}
                              </p>
                            )}
                            <button
                              onClick={() =>
                                setExpandedWhy((p) => ({ ...p, [stepId]: !p[stepId] }))
                              }
                              className="text-xs text-[#0F766E] font-semibold mt-2 inline-flex items-center gap-1 hover:underline min-h-[32px]"
                            >
                              Why{" "}
                              {showWhy ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                            {showWhy && (
                              <p className="text-xs text-[#475569] italic mt-2 leading-relaxed">
                                {step.why}
                              </p>
                            )}
                            {step.script && (
                              <div className="mt-3 rounded-lg border-l-4 border-[#3B82F6] bg-[#EFF6FF] p-3">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#1D4ED8]">
                                    What to say
                                  </p>
                                  <button
                                    onClick={() => copyScript(step.script, stepId)}
                                    className="text-[11px] font-semibold text-[#1D4ED8] hover:underline inline-flex items-center gap-1 min-h-[44px] px-2"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    {copiedScripts[stepId] ? "Copied" : "Copy"}
                                  </button>
                                </div>
                                <p className="text-sm text-[#0F172A] leading-relaxed">
                                  {step.script}
                                </p>
                              </div>
                            )}
                            {Array.isArray(rawStep.checklist) && (
                              <div className="mt-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-[#475569] mb-2">
                                  Checklist
                                </p>
                                <ul className="space-y-1.5">
                                  {rawStep.checklist.map((c, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-xs text-[#475569]"
                                    >
                                      <ClipboardCheck className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 mt-0.5" />
                                      <span>{c}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <DecisionPoints
                type={type}
                phaseIdx={phaseIdx}
                completedSteps={completedSteps}
                conditionalAnswers={conditionalAnswers}
                pendingDecisions={pendingDecisions}
                closingOut={closingOut}
                onAnswer={setConditionalAnswer}
              />

              {/* Phase note + advance */}
              <div className="mt-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5">
                <label className="text-sm font-semibold text-[#0F172A] block mb-2">
                  Anything else to document about this phase?
                </label>
                <textarea
                  value={phaseNotes[phaseIdx] || ""}
                  onChange={(e) => handlePhaseNoteChange(e.target.value)}
                  onBlur={handlePhaseNoteBlur}
                  rows={2}
                  placeholder="Optional notes that will be added to the action log"
                  className="w-full rounded-lg border border-[#E2E8F0] p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#94A3B8]">
                  {completedInCurrentPhase} of {visibleSteps.length} steps in this phase
                </p>
                <button
                  onClick={() => setShowPhaseTransition(true)}
                  disabled={unansweredDecisions.length > 0 || closingOut}
                  className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {unansweredDecisions.length > 0
                    ? "Answer the decision point above to continue"
                    : phaseIdx < playbook.phases.length - 1
                    ? "Continue to next phase"
                    : "Finish response"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="transition"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#F0FDFA] border border-[#0F766E]/30 rounded-2xl p-8 text-center"
            >
              <Check className="w-10 h-10 text-[#0F766E] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Phase complete: {currentPhase.title}
              </h3>
              <p className="text-sm text-[#475569] mb-6">
                {completedInCurrentPhase} step{completedInCurrentPhase === 1 ? "" : "s"} marked complete in this phase. Take a breath, then continue.
              </p>
              <button
                onClick={advancePhase}
                className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#0E7490] min-h-[44px]"
              >
                {phaseIdx < playbook.phases.length - 1
                  ? `Continue to ${playbook.phases[phaseIdx + 1].title}`
                  : "Begin closeout"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowPhaseTransition(false)}
                className="block mx-auto mt-3 text-xs text-[#475569] hover:text-[#0F172A]"
              >
                Wait, go back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SyncIndicator({ status }) {
  if (status === "saving") {
    return (
      <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
        <span className="w-3 h-3 border border-[#94A3B8] border-t-transparent rounded-full animate-spin" />
        Saving
      </span>
    )
  }
  if (status === "success") {
    return (
      <span className="text-[10px] text-[#0F766E] flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Saved
      </span>
    )
  }
  if (status === "failed") {
    return (
      <span className="text-[10px] text-[#DC2626] flex items-center gap-1">
        <WifiOff className="w-3 h-3" />
        Not synced
      </span>
    )
  }
  return null
}

function DecisionPoints({
  type,
  phaseIdx,
  completedSteps,
  conditionalAnswers,
  pendingDecisions,
  closingOut,
  onAnswer,
}) {
  const showDataQuestion =
    (type === "data_breach" || type === "ransomware" || type === "phishing") &&
    phaseIdx === 0 &&
    conditionalAnswers.data_compromised === undefined

  const showMdm =
    type === "lost_device" && phaseIdx === 0 && conditionalAnswers.has_mdm === undefined

  const showUnencrypted =
    type === "lost_device" &&
    phaseIdx === 0 &&
    completedSteps["l4"] &&
    conditionalAnswers.unencrypted_sensitive === undefined

  if (!showDataQuestion && !showMdm && !showUnencrypted) return null

  return (
    <div className="mt-6 space-y-3">
      {showDataQuestion && (
        <DecisionCard
          conditionKey="data_compromised"
          disabled={pendingDecisions.has("data_compromised") || closingOut}
          question="Was sensitive data (client information, health records, financial data) potentially accessed?"
          onYes={() => onAnswer("data_compromised", true)}
          onNo={() => onAnswer("data_compromised", false)}
        />
      )}
      {showMdm && (
        <DecisionCard
          conditionKey="has_mdm"
          disabled={pendingDecisions.has("has_mdm") || closingOut}
          question="Does your organization have mobile device management (MDM) for this device?"
          onYes={() => onAnswer("has_mdm", true)}
          onNo={() => onAnswer("has_mdm", false)}
        />
      )}
      {showUnencrypted && (
        <DecisionCard
          conditionKey="unencrypted_sensitive"
          disabled={pendingDecisions.has("unencrypted_sensitive") || closingOut}
          question="Was the device unencrypted AND did it contain sensitive data?"
          onYes={() => onAnswer("unencrypted_sensitive", true)}
          onNo={() => onAnswer("unencrypted_sensitive", false)}
        />
      )}
    </div>
  )
}

function DecisionCard({ question, onYes, onNo, disabled }) {
  return (
    <div className="rounded-xl bg-[#FFFBEB] border border-[#F59E0B]/40 p-5">
      <p className="text-sm font-semibold text-[#0F172A] mb-3">{question}</p>
      <div className="flex gap-2">
        <button
          onClick={onYes}
          disabled={disabled}
          className="flex-1 bg-[#0F172A] text-white text-sm font-semibold py-3 rounded-lg hover:bg-[#1E293B] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Yes
        </button>
        <button
          onClick={onNo}
          disabled={disabled}
          className="flex-1 bg-white text-[#0F172A] text-sm font-semibold py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          No
        </button>
      </div>
    </div>
  )
}

function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

// Find the first phone-number-looking pattern in a script string
function extractPhone(text) {
  if (!text) return null
  const match = text.match(/\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/)
  return match ? match[0] : null
}
