"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Download,
  Lock,
  ExternalLink,
  Scale,
  Sparkles,
  RotateCcw,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  generateCarrierReadiness,
  generateProofPackData,
  getCarrierProfile,
  CARRIER_REGISTRY,
} from "@/lib/carriers"

// react-pdf's renderer is ~200kB of browser code and breaks SSR. Dynamic
// import with ssr: false matches the pattern used by the existing PdfReport
// component on the same results page.
const CarrierProofPackPdf = dynamic(() => import("./CarrierProofPackPdf"), {
  ssr: false,
})

// localStorage key prefix for the evidence checklist. One key per assessment
// so running multiple assessments doesn't collide the checklist state.
const EVIDENCE_STORAGE_PREFIX = "dh_evidence_checklist_"

const CONTROL_CATEGORY_LABELS = {
  mfa: "Multi-Factor Authentication",
  edr: "Endpoint Detection & Response",
  backups: "Backups",
  incident_response: "Incident Response",
  patching: "Patch Management",
  logging_monitoring: "Logging & Monitoring",
  security_awareness: "Security Awareness",
  privileged_access: "Privileged Access",
  email_security: "Email Security",
  encryption: "Encryption",
  vendor_risk: "Vendor Risk",
  network_segmentation: "Network Segmentation",
}

const STATUS_META = {
  pass: {
    label: "Pass",
    color: "#0F766E",
    bg: "#F0FDFA",
    border: "#0F766E",
    Icon: CheckCircle2,
  },
  partial: {
    label: "Partial",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#D97706",
    Icon: AlertTriangle,
  },
  fail: {
    label: "Fail",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#DC2626",
    Icon: XCircle,
  },
  not_assessed: {
    label: "Needs Input",
    color: "#475569",
    bg: "#F8FAFC",
    border: "#CBD5E1",
    Icon: HelpCircle,
  },
}

const READINESS_META = {
  ready: {
    label: "Ready",
    color: "#0F766E",
    bg: "#F0FDFA",
    border: "#0F766E",
    message:
      "You have the controls carriers want to see. Assemble the evidence checklist and submit.",
  },
  gaps_exist: {
    label: "Gaps Exist",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#D97706",
    message:
      "Real gaps exist, but nothing on this list is a permanent blocker. Remediate the critical flags before submitting.",
  },
  likely_denial: {
    label: "Likely Denial",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#DC2626",
    message:
      "This score is in the likely-denial range. Remediate the critical flags at the top of this report before submitting to any carrier.",
  },
}

// ============================================================================
// Top-level section - renders inside the results page. Everything below is
// internal sub-components.
// ============================================================================

/**
 * @param {Object} props
 * @param {Object} props.assessment
 * @param {Record<string, string|string[]>} props.answers
 * @param {boolean} props.canViewReadiness
 *   True when the user's entitlement includes assessment access (dashboard
 *   is visible). Gated on access.canTakeAssessment in results/page.js.
 * @param {boolean} props.canDownloadProofPack
 *   True when the user's entitlement includes the full proof pack PDF.
 *   Gated on access.canAccessPolicies in results/page.js so Docs Pack buyers
 *   and Ongoing Protection subscribers both get access, while a free user
 *   sees the upgrade prompt.
 * @param {boolean} [props.entitlementUnknown]
 *   True when the subscription fetch failed (Supabase outage, network
 *   error). When this is set, we render a neutral retry state instead of
 *   the upgrade prompt. A paid user hitting a transient fetch failure must
 *   never see an upsell for a product they already own.
 * @param {() => void} [props.onRetryEntitlement]
 *   Callback wired to refreshSubscription() in the parent. Invoked when
 *   the user clicks "Try again" on the entitlement-unknown retry card.
 * @param {boolean} [props.refreshingEntitlement]
 *   True while the parent's refreshSubscription() is in flight, so the
 *   retry button can show a spinner.
 * @param {Object} props.businessProfile
 *   Optional company/contact info from the profile row for the PDF cover page.
 */
export default function InsuranceReadinessSection({
  assessment,
  answers,
  canViewReadiness,
  canDownloadProofPack,
  entitlementUnknown = false,
  onRetryEntitlement,
  refreshingEntitlement = false,
  businessProfile,
}) {
  const [selectedCarrierId, setSelectedCarrierId] = useState("coalition")
  const [showProofPack, setShowProofPack] = useState(false)
  const [expandedControlId, setExpandedControlId] = useState(null)
  // Inline error surface for proof pack PDF generation failures. When the
  // @react-pdf/renderer promise rejects, the PDF wrapper calls onError and
  // we render a red card next to the Generate Proof Pack button. Cleared
  // whenever the user retries or dismisses.
  const [proofPackError, setProofPackError] = useState(null)

  // Compute readiness for the currently selected carrier. Recomputes only
  // when the assessment, answers, or carrier changes. Engine is pure and
  // deterministic so memoization is safe.
  const readiness = useMemo(() => {
    if (!canViewReadiness || entitlementUnknown || !assessment) return null
    return generateCarrierReadiness(assessment, answers, selectedCarrierId)
  }, [assessment, answers, selectedCarrierId, canViewReadiness, entitlementUnknown])

  // Order of state checks matters here:
  //   1. Entitlement fetch failed -> show neutral retry state (highest
  //      priority, since a paid user must never be downgraded to an upsell
  //      by a transient failure).
  //   2. User does not have the feature -> show the upgrade prompt.
  //   3. Otherwise render the dashboard.
  if (entitlementUnknown) {
    return (
      <EntitlementUnknownState
        onRetry={onRetryEntitlement}
        refreshing={refreshingEntitlement}
      />
    )
  }
  if (!canViewReadiness) {
    return <LockedReadinessPrompt />
  }
  if (!readiness) return null

  const carrierProfile = getCarrierProfile(selectedCarrierId)
  const readinessMeta = READINESS_META[readiness.overallReadiness]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border-2 border-[#0F766E]/20 bg-white shadow-sm mb-8 overflow-hidden"
      aria-labelledby="insurance-readiness-heading"
    >
      {/* Section header */}
      <div className="p-6 border-b border-[#E2E8F0] bg-[#F0FDFA]/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#0F766E]/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
          </div>
          <div className="flex-1">
            <h2
              id="insurance-readiness-heading"
              className="text-xl font-bold text-[#0F172A]"
            >
              Insurance Readiness
            </h2>
            <p className="text-sm text-[#475569] mt-1 leading-relaxed">
              Your assessment, translated into the language your insurance
              carrier actually asks on their application form. Surfaces the
              gaps likely to block a quote and the evidence underwriters
              typically request.
            </p>
          </div>
        </div>
      </div>

      {/* Carrier selector */}
      <CarrierSelector
        selectedCarrierId={selectedCarrierId}
        onChange={setSelectedCarrierId}
      />

      {/* Carrier metadata strip */}
      {carrierProfile && (
        <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#475569] flex flex-wrap items-center gap-x-6 gap-y-1">
          <span>
            <span className="font-semibold text-[#0F172A]">Form:</span>{" "}
            {carrierProfile.formName}
          </span>
          <span>
            <span className="font-semibold text-[#0F172A]">Version:</span>{" "}
            {carrierProfile.formVersion}
          </span>
          <span>
            <span className="font-semibold text-[#0F172A]">Last verified:</span>{" "}
            {carrierProfile.lastVerified}
          </span>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Readiness summary */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: readinessMeta.bg,
            borderColor: `${readinessMeta.color}33`,
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                Readiness Score
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-5xl font-black"
                  style={{ color: readinessMeta.color }}
                >
                  {readiness.readinessScore}
                </span>
                <span className="text-sm text-[#94A3B8]">/ 100</span>
              </div>
              <span
                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
                style={{
                  color: readinessMeta.color,
                  backgroundColor: "white",
                  border: `1px solid ${readinessMeta.color}33`,
                }}
              >
                {readinessMeta.label}
              </span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed flex-1">
              {readinessMeta.message}
            </p>
          </div>
        </div>

        {/* Denial risk flags - unmissable red cards at the top */}
        {readiness.denialRiskFlags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Denial Risk Flags ({readiness.denialRiskFlags.length})
            </h3>
            {readiness.denialRiskFlags.map((flag, i) => (
              <div
                key={i}
                role="alert"
                className="rounded-xl border-2 border-[#DC2626]/30 bg-[#FEF2F2] p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DC2626] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                        {flag.severity === "critical" ? "Critical" : "High"}
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {CONTROL_CATEGORY_LABELS[flag.controlCategory]}
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        · Applies to: {flag.carrierSpecific}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#0F172A] mb-2 leading-relaxed">
                      {flag.message}
                    </p>
                    {flag.remediation && (
                      <p className="text-xs text-[#475569] leading-relaxed">
                        <span className="font-semibold text-[#0F172A]">
                          Action:
                        </span>{" "}
                        {flag.remediation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Control-by-control breakdown */}
        <ControlBreakdown
          controlResults={readiness.controlResults}
          expandedControlId={expandedControlId}
          onToggle={setExpandedControlId}
        />

        {/* Evidence checklist */}
        {readiness.evidenceChecklist.length > 0 && (
          <EvidenceChecklist
            checklist={readiness.evidenceChecklist}
            assessmentId={assessment.id}
          />
        )}

        {/* Proof pack CTA */}
        <div className="rounded-xl border border-[#0F766E]/20 bg-[#F0FDFA]/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-base font-bold text-[#0F172A] mb-1">
                Generate your broker proof pack
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                A printable PDF containing everything on this page: readiness
                summary, denial flags, control-by-control answers in carrier
                language, evidence guide, and remediation priorities. Built
                to hand to an insurance broker alongside your application.
              </p>
            </div>
            {canDownloadProofPack ? (
              <Button
                onClick={() => {
                  // Clear any stale error before starting a new generation
                  // so the error card disappears when the user retries.
                  setProofPackError(null)
                  setShowProofPack(true)
                }}
                className="shrink-0"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Generate Proof Pack
                </span>
              </Button>
            ) : (
              <Link href="/pricing" className="shrink-0">
                <Button variant="outline">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Unlock Proof Pack
                  </span>
                </Button>
              </Link>
            )}
          </div>
          {!canDownloadProofPack && (
            <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
              Proof pack PDFs are included in the Documentation Pack ($299 one-time),
              Ongoing Protection subscription, and Agency Plan. The dashboard
              above is available to every paid user.
            </p>
          )}
          {/* Inline error surface. Appears only after a failed generation
              attempt. Dismissable, and also clears automatically when the
              user clicks Generate Proof Pack again. */}
          {proofPackError && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-[#DC2626]/30 bg-[#FEF2F2] px-4 py-3 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2 flex-1">
                <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <p className="text-sm text-[#B91C1C] leading-relaxed">
                  Something went wrong generating your proof pack. Please try
                  again or contact support if the problem continues.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProofPackError(null)}
                className="text-xs font-semibold text-[#B91C1C] hover:underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Legal disclaimer */}
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-xs text-[#475569] leading-relaxed">
          <p className="font-semibold text-[#0F172A] mb-1">
            Important disclaimer
          </p>
          <p>
            This tool helps you prepare documentation for your cyber insurance
            application. Coverage decisions are made solely by the carrier.
            Data Hygienics is not an insurance provider, broker, or agent. The
            translated answers above are derived from your assessment responses
            and are intended as a starting point. Review every answer with your
            broker before submitting to the carrier.
          </p>
        </div>
      </div>

      {/* Proof pack PDF modal. Nothing visible - the wrapper component
          triggers a download in an effect and then calls onClose. The
          onError callback flips proofPackError so the red inline error
          card appears next to the Generate Proof Pack button. */}
      {showProofPack && canDownloadProofPack && (
        <CarrierProofPackPdf
          proofPackData={generateProofPackData(
            assessment,
            answers,
            selectedCarrierId,
            businessProfile || {}
          )}
          onClose={() => setShowProofPack(false)}
          onError={(err) => {
            console.error("Carrier proof pack generation failed:", err)
            setProofPackError(err || new Error("PDF generation failed"))
            setShowProofPack(false)
          }}
        />
      )}
    </motion.section>
  )
}

// ============================================================================
// Carrier selector - four tabs, Phase 1 has only Coalition active
// ============================================================================

function CarrierSelector({ selectedCarrierId, onChange }) {
  // Phase 2: every carrier in CARRIER_REGISTRY is active. The isEnabled
  // and "Coming Soon" branches are retained defensively for any future
  // carrier added in `coming_soon` state but are not exercised at render
  // time by any current entry.
  return (
    <div
      role="tablist"
      aria-label="Insurance carrier"
      className="flex flex-wrap gap-2 px-6 pt-5 pb-4 border-b border-[#E2E8F0]"
    >
      {CARRIER_REGISTRY.map((carrier) => {
        const isActive = selectedCarrierId === carrier.id
        const isEnabled = carrier.status === "active"
        return (
          <button
            key={carrier.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={!isEnabled}
            onClick={() => isEnabled && onChange(carrier.id)}
            title={
              isEnabled
                ? `View ${carrier.name} readiness`
                : `${carrier.name} support is not yet available`
            }
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive
                ? "bg-[#0F766E] text-white shadow-sm"
                : isEnabled
                ? "bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0F766E]/40 hover:text-[#0F172A] cursor-pointer"
                : "bg-[#F1F5F9] border border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
            }`}
          >
            {carrier.name}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// Control breakdown - expandable accordion
// ============================================================================

function ControlBreakdown({ controlResults, expandedControlId, onToggle }) {
  // Order: fails first by severity, then partials, then not_assessed, then pass.
  const sortRank = {
    fail: 0,
    partial: 1,
    not_assessed: 2,
    pass: 3,
  }
  const severityRank = { critical: 0, high: 1, medium: 2, low: 3 }
  const sorted = [...controlResults].sort((a, b) => {
    if (a.status !== b.status) return sortRank[a.status] - sortRank[b.status]
    return severityRank[a.denialRiskLevel] - severityRank[b.denialRiskLevel]
  })

  return (
    <div>
      <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">
        Control-by-Control Breakdown
      </h3>
      <div className="space-y-2">
        {sorted.map((control) => {
          const meta = STATUS_META[control.status]
          const isExpanded = expandedControlId === control.carrierQuestionId
          const Icon = meta.Icon
          return (
            <div
              key={control.carrierQuestionId}
              className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  onToggle(isExpanded ? null : control.carrierQuestionId)
                }
                aria-expanded={isExpanded}
                className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: meta.bg,
                    border: `1px solid ${meta.color}33`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        color: meta.color,
                        backgroundColor: meta.bg,
                      }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      {CONTROL_CATEGORY_LABELS[control.controlCategory]}
                    </span>
                  </div>
                  <p className="text-sm text-[#0F172A] leading-snug pr-4">
                    {control.carrierQuestionText}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#475569] transition-transform shrink-0 mt-2 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-[#F1F5F9] space-y-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                          Your translated answer
                        </p>
                        <p className="text-sm text-[#0F172A]">
                          {control.userAnswerText}
                        </p>
                      </div>
                      {control.recommendation && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                            Recommendation
                          </p>
                          <p className="text-sm text-[#475569] leading-relaxed">
                            {control.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Evidence checklist - persistent via localStorage
// ============================================================================

function EvidenceChecklist({ checklist, assessmentId }) {
  const storageKey = `${EVIDENCE_STORAGE_PREFIX}${assessmentId}`
  const [checkedMap, setCheckedMap] = useState(() => ({}))
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage once on mount. The render path below is
  // hydration-safe: we default to an empty object during SSR and then
  // overwrite after mount so React does not warn about mismatched markup.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === "object") {
          setCheckedMap(parsed)
        }
      }
    } catch {
      // localStorage unavailable (privacy mode, quota exceeded). Start fresh.
    }
    setHydrated(true)
  }, [storageKey])

  function toggle(evidenceItemId) {
    const next = { ...checkedMap, [evidenceItemId]: !checkedMap[evidenceItemId] }
    setCheckedMap(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // Best-effort persistence. If the write fails, in-memory state still
      // reflects the toggle for this session.
    }
  }

  const collectedCount = checklist.filter((c) => checkedMap[c.evidenceItemId]).length

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            Evidence Checklist
          </h3>
          <span className="text-xs text-[#475569]">
            <span className="font-semibold text-[#0F172A]">
              {collectedCount} of {checklist.length}
            </span>{" "}
            collected
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1">
          Items sorted by priority. Critical-risk evidence first. Progress
          saves to your browser between visits.
        </p>
      </div>
      <ul className="divide-y divide-[#F1F5F9]">
        {checklist.map((item) => {
          const isChecked = !!checkedMap[item.evidenceItemId]
          const severityMeta = STATUS_META[item.priority === "critical" || item.priority === "high" ? "fail" : "partial"]
          return (
            <li key={item.evidenceItemId} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <label className="flex items-start gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hydrated ? isChecked : false}
                    onChange={() => toggle(item.evidenceItemId)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#0F766E] cursor-pointer"
                    aria-label={`Mark ${item.artifactName} as collected`}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: severityMeta.color,
                          backgroundColor: severityMeta.bg,
                        }}
                      >
                        {item.priority}
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {CONTROL_CATEGORY_LABELS[item.controlCategory]}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-semibold text-[#0F172A] ${
                        isChecked ? "line-through text-[#94A3B8]" : ""
                      }`}
                    >
                      {item.artifactName}
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">{item.format}</p>
                    <p className="text-xs text-[#475569] leading-relaxed mt-2">
                      {item.whereToFind}
                    </p>
                  </div>
                </label>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ============================================================================
// Locked state - shown to free-tier users who have not unlocked assessment
// ============================================================================

function LockedReadinessPrompt() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 border-dashed border-[#0F766E]/30 bg-[#F0FDFA]/40 p-8 mb-8 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F0FDFA] border border-[#0F766E]/20 mb-4">
        <Lock className="w-6 h-6 text-[#0F766E]" />
      </div>
      <h2 className="text-xl font-bold text-[#0F172A] mb-2">
        Unlock Insurance Readiness
      </h2>
      <p className="text-sm text-[#475569] max-w-md mx-auto mb-5 leading-relaxed">
        Translate your assessment into the language your insurance carrier
        actually uses. See which controls will block your quote, what
        evidence underwriters typically request, and get a broker-ready proof
        pack. Available to every paid user.
      </p>
      <Link href="/pricing">
        <Button>Unlock with the Documentation Pack</Button>
      </Link>
    </motion.section>
  )
}

// ============================================================================
// Entitlement-unknown state - shown when the subscription fetch failed.
// ============================================================================
//
// Crucial UX difference from LockedReadinessPrompt: this state is neutral,
// not an upsell. A paid user hitting a transient Supabase outage must
// never see a "Unlock with the Documentation Pack" card for a product they
// already own. The retry button calls refreshSubscription() in the parent,
// which refetches with skipCache and updates the entitlementUnknown flag
// when the fetch succeeds.

function EntitlementUnknownState({ onRetry, refreshing }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className="rounded-2xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-8 mb-8 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#F59E0B]/40 mb-4">
        <AlertTriangle className="w-6 h-6 text-[#D97706]" />
      </div>
      <h2 className="text-xl font-bold text-[#0F172A] mb-2">
        Unable to verify your access
      </h2>
      <p className="text-sm text-[#475569] max-w-md mx-auto mb-5 leading-relaxed">
        We could not confirm your subscription status, so the Insurance
        Readiness dashboard is temporarily hidden. Your results are safe.
        This is usually a transient issue - try again in a moment.
      </p>
      <Button onClick={onRetry} disabled={refreshing || !onRetry}>
        <span className="flex items-center gap-2">
          {refreshing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              Try again
            </>
          )}
        </span>
      </Button>
    </motion.section>
  )
}
