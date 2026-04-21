// ============================================================================
// Carrier readiness engine
// ============================================================================
//
// Two exported functions:
//
//   generateCarrierReadiness(assessment, answers, carrierId)
//     → CarrierReadinessResult. Walks every carrier question for the given
//       carrier, invokes the matching resolver from mappings.js, aggregates
//       per-question results into an overall readiness score and a
//       deduplicated evidence checklist. This is the dashboard's primary
//       data source.
//
//   generateProofPackData(assessment, answers, carrierId, profile)
//     → structured object ready for PDF rendering. Cover page, executive
//       summary, control-by-control breakdown, evidence collection guide,
//       remediation priorities, legal disclaimer. Shares the underlying
//       readiness computation so proof pack and dashboard never disagree.
//
// The engine is carrier-agnostic by design: it takes a carrierId and
// dispatches through CARRIER_PROFILES + CARRIER_MAPPINGS. Adding Cowbell,
// Travelers, or Beazley in Phase 2 will be pure data additions.
// ============================================================================

import { getQuestionsForIndustry } from "@/lib/questions"
import { COALITION_PROFILE, COALITION_QUESTIONS } from "./coalition"
import { COWBELL_PROFILE, COWBELL_QUESTIONS } from "./cowbell"
import { TRAVELERS_PROFILE, TRAVELERS_QUESTIONS } from "./travelers"
import { BEAZLEY_PROFILE, BEAZLEY_QUESTIONS } from "./beazley"
import { CARRIER_MAPPINGS } from "./mappings"
import { EVIDENCE_CATALOG, getEvidenceById } from "./evidence"

// Carrier registry. Extended in Phase 2 to include Cowbell, Travelers, and
// Beazley. These are plain lookup-table entries, not logic changes; the
// dispatch logic in generateCarrierReadiness() is carrier-agnostic and
// walks whatever carriers are registered here.
const CARRIER_PROFILES = {
  coalition: COALITION_PROFILE,
  cowbell: COWBELL_PROFILE,
  travelers: TRAVELERS_PROFILE,
  beazley: BEAZLEY_PROFILE,
}
const CARRIER_QUESTIONS = {
  coalition: COALITION_QUESTIONS,
  cowbell: COWBELL_QUESTIONS,
  travelers: TRAVELERS_QUESTIONS,
  beazley: BEAZLEY_QUESTIONS,
}

/**
 * Every carrier ID currently supported by the engine. The UI uses this for
 * the carrier selector and to know which tabs should be active vs. "Coming
 * Soon". Phase 1 returns only Coalition; Phase 2 adds the rest.
 *
 * @returns {string[]}
 */
export function getSupportedCarrierIds() {
  return Object.keys(CARRIER_PROFILES)
}

/**
 * Get a carrier profile by ID, or null if unknown.
 *
 * @param {string} carrierId
 * @returns {import('./schema.js').CarrierProfile | null}
 */
export function getCarrierProfile(carrierId) {
  return CARRIER_PROFILES[carrierId] || null
}

// ----------------------------------------------------------------------------
// Resolver context builder
// ----------------------------------------------------------------------------

/**
 * Build the context object passed to each resolver. Bundles the raw answers
 * with the industry's section list and a set of lookup helpers keyed on the
 * cross-industry `tooltip.controlSlug`.
 *
 * @param {Object} assessment
 * @param {Record<string, string|string[]>} answers
 * @returns {import('./schema.js').ResolverContext}
 */
function buildResolverContext(assessment, answers) {
  const industry = assessment?.industry || "Other / General Business"
  const sections = getQuestionsForIndustry(industry)

  // Flatten sections into a controlSlug → question map. First match wins;
  // industries that have multiple questions for the same control category
  // use industry-specific slugs (e.g. "phi-data-inventory") that won't
  // collide with the canonical cross-industry slugs.
  /** @type {Record<string, Object>} */
  const slugMap = {}
  for (const section of sections || []) {
    for (const q of section.questions || []) {
      const slug = q.tooltip?.controlSlug
      if (slug && !slugMap[slug]) {
        slugMap[slug] = q
      }
    }
  }

  return {
    answers: answers || {},
    sections: sections || [],
    industry,
    findBySlug: (slug) => slugMap[slug] || null,
    answerForSlug: (slug) => {
      const q = slugMap[slug]
      if (!q) return undefined
      return answers?.[q.key]
    },
  }
}

// ----------------------------------------------------------------------------
// Score math
// ----------------------------------------------------------------------------

/**
 * Readiness score penalty by failing control's denial risk level. Critical
 * failures are weighted far above the others because the business impact
 * of missing critical controls at binding time is disproportionate.
 */
const PENALTY_BY_SEVERITY = {
  critical: 25,
  high: 10,
  medium: 5,
  low: 2,
}

/**
 * Compute the readiness score (0-100) given a list of control results.
 * Start at 100, subtract penalties per failing or partial control, floor
 * at 0. A partial control is half the penalty of a full fail.
 *
 * @param {import('./schema.js').ControlResult[]} controlResults
 * @returns {number}
 */
function computeReadinessScore(controlResults) {
  let score = 100
  for (const r of controlResults) {
    if (r.status === "fail") {
      score -= PENALTY_BY_SEVERITY[r.denialRiskLevel] || 0
    } else if (r.status === "partial") {
      score -= Math.ceil((PENALTY_BY_SEVERITY[r.denialRiskLevel] || 0) / 2)
    }
    // pass → no penalty
    // not_assessed → no penalty (user will fill in later)
  }
  return Math.max(0, Math.min(100, score))
}

/**
 * Convert a numeric readiness score to a human-readable band. Mirrors the
 * score interpretation promised to the user in the task spec.
 *
 * @param {number} score
 * @returns {'ready'|'gaps_exist'|'likely_denial'}
 */
function bandForScore(score) {
  if (score >= 80) return "ready"
  if (score >= 50) return "gaps_exist"
  return "likely_denial"
}

// ----------------------------------------------------------------------------
// Main readiness computation
// ----------------------------------------------------------------------------

/**
 * Compute a full carrier readiness report.
 *
 * @param {Object} assessment
 *   The assessment row from Supabase (must include `industry` string).
 * @param {Record<string, string|string[]>} answers
 *   Responses keyed by question_key.
 * @param {string} carrierId
 * @returns {import('./schema.js').CarrierReadinessResult}
 */
export function generateCarrierReadiness(assessment, answers, carrierId) {
  const profile = CARRIER_PROFILES[carrierId]
  const questions = CARRIER_QUESTIONS[carrierId]
  const resolvers = CARRIER_MAPPINGS[carrierId]

  if (!profile || !questions || !resolvers) {
    // Unsupported carrier. Return a well-formed empty result rather than
    // throwing - the UI can render a "Coming Soon" state from this shape.
    return {
      carrierId,
      overallReadiness: "gaps_exist",
      readinessScore: 0,
      controlResults: [],
      denialRiskFlags: [],
      evidenceChecklist: [],
      generatedAt: new Date().toISOString(),
    }
  }

  const ctx = buildResolverContext(assessment, answers)

  /** @type {import('./schema.js').ControlResult[]} */
  const controlResults = questions.map((q) => {
    const resolver = resolvers[q.id]
    /** @type {any} */
    let partial
    if (typeof resolver === "function") {
      try {
        partial = resolver(ctx)
      } catch (err) {
        // Never let a bad resolver crash the whole report. Log for
        // debugging and return a not_assessed shape so the UI shows the
        // question with a follow-up prompt.
        console.error(`Resolver for ${q.id} threw:`, err)
        partial = {
          status: "not_assessed",
          userAnswerText: "Unable to compute translated answer from assessment data.",
          recommendation:
            "The automated mapping failed for this question. Review the carrier question manually and provide an answer based on your environment.",
          evidenceIds: [],
          notesForBroker:
            "Manual follow-up required. The resolver for this carrier question encountered an error.",
        }
      }
    } else {
      partial = {
        status: "not_assessed",
        userAnswerText: "Additional information needed from user",
        recommendation:
          "No mapping is defined for this carrier question. Answer manually based on your environment.",
        evidenceIds: [],
        notesForBroker: "No automatic mapping. Broker should review.",
      }
    }

    return {
      carrierQuestionId: q.id,
      controlCategory: q.controlCategory,
      carrierQuestionText: q.questionText,
      userAnswerText: partial.userAnswerText || "",
      status: partial.status || "not_assessed",
      denialRiskLevel: q.denialRiskLevel,
      evidenceNeeded: Array.isArray(partial.evidenceIds) ? partial.evidenceIds : [],
      recommendation: partial.recommendation || "",
      notesForBroker: partial.notesForBroker,
    }
  })

  const readinessScore = computeReadinessScore(controlResults)
  const overallReadiness = bandForScore(readinessScore)

  // Denial risk flags: surfaced at the top of the dashboard. Only include
  // critical and high-severity failures; partials and medium/low failures
  // are shown only inside the per-control accordion.
  /** @type {import('./schema.js').DenialRiskFlag[]} */
  const denialRiskFlags = controlResults
    .filter(
      (r) =>
        r.status === "fail" &&
        (r.denialRiskLevel === "critical" || r.denialRiskLevel === "high")
    )
    .map((r) => {
      const question = questions.find((q) => q.id === r.carrierQuestionId)
      return {
        controlCategory: r.controlCategory,
        severity: r.denialRiskLevel,
        message: denialMessageFor(r, question),
        carrierSpecific: profile.name,
        remediation: r.recommendation,
      }
    })

  // Evidence checklist: deduplicate across controls, tag priority with the
  // highest severity of any control that references each evidence item.
  const evidenceChecklist = buildEvidenceChecklist(controlResults)

  return {
    carrierId,
    overallReadiness,
    readinessScore,
    controlResults,
    denialRiskFlags,
    evidenceChecklist,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Compose a plain-English denial-risk message from a failing control.
 *
 * @param {import('./schema.js').ControlResult} result
 * @param {import('./schema.js').CarrierQuestion | undefined} question
 * @returns {string}
 */
function denialMessageFor(result, question) {
  const category = result.controlCategory
  if (category === "mfa") {
    return "Missing MFA is the number-one reason carriers deny SMB applications. This gap alone can block coverage or impose ransomware sublimits."
  }
  if (category === "edr") {
    return "No EDR deployed on endpoints. This is a top-3 ransomware claim predictor and a common automatic denial trigger."
  }
  if (category === "backups") {
    return "Backups are missing a critical attribute (offline separation or tested restores). Carriers treat this as a ransomware-recoverability failure."
  }
  if (category === "network_segmentation") {
    return "Network is flat or insufficiently segmented. Carriers weight segmentation depth heavily when estimating ransomware blast radius."
  }
  if (category === "privileged_access") {
    return "Privileged accounts are not adequately separated or MFA-enforced. One compromised admin account is usually enough to own the environment."
  }
  if (category === "patching") {
    return "Critical patching cadence does not meet the carrier's expected SLA. Unpatched internet-facing systems are a primary ransomware entry point."
  }
  return (
    question?.notes ||
    `Failing control in category ${category}. Review the recommendation below for remediation guidance.`
  )
}

/**
 * Deduplicate evidence IDs across all control results and build a priority-
 * sorted checklist. Each evidence item keeps the highest severity of any
 * control that references it, so a single MFA screenshot needed by both a
 * critical and a high-severity control gets priority "critical".
 *
 * @param {import('./schema.js').ControlResult[]} controlResults
 * @returns {import('./schema.js').EvidenceChecklistItem[]}
 */
function buildEvidenceChecklist(controlResults) {
  const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 }
  /** @type {Map<string, {priority: 'critical'|'high'|'medium'|'low', item: import('./schema.js').EvidenceItem}>} */
  const byId = new Map()

  for (const r of controlResults) {
    // Only surface evidence for controls that actually need attention
    // (failing, partial, or not_assessed). Passing controls still reference
    // evidence in their recommendation text, but it does not crowd the
    // checklist.
    if (r.status === "pass") continue
    for (const evidenceId of r.evidenceNeeded) {
      const item = getEvidenceById(evidenceId)
      if (!item) continue
      const existing = byId.get(evidenceId)
      if (!existing) {
        byId.set(evidenceId, { priority: r.denialRiskLevel, item })
      } else if (priorityRank[r.denialRiskLevel] < priorityRank[existing.priority]) {
        byId.set(evidenceId, { priority: r.denialRiskLevel, item })
      }
    }
  }

  return [...byId.values()]
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
    .map(({ priority, item }) => ({
      evidenceItemId: item.id,
      controlCategory: item.controlCategory,
      artifactName: item.artifactName,
      format: item.format,
      whereToFind: item.whereToFind,
      priority,
    }))
}

// ----------------------------------------------------------------------------
// Proof pack data
// ----------------------------------------------------------------------------

/**
 * Build the structured payload for the proof pack PDF. Shares the underlying
 * readiness computation with the dashboard so the two cannot disagree.
 *
 * @param {Object} assessment
 * @param {Record<string, string|string[]>} answers
 * @param {string} carrierId
 * @param {Object} businessProfile
 *   Optional business-profile fields. Safe to pass an empty object; the
 *   proof pack will substitute generic placeholders for missing fields.
 * @param {string} [businessProfile.companyName]
 * @param {string} [businessProfile.contactName]
 * @param {string} [businessProfile.email]
 * @returns {Object}
 */
export function generateProofPackData(assessment, answers, carrierId, businessProfile = {}) {
  const profile = CARRIER_PROFILES[carrierId]
  const readiness = generateCarrierReadiness(assessment, answers, carrierId)
  const questions = CARRIER_QUESTIONS[carrierId] || []

  const groupedByCategory = groupControlResultsByCategory(readiness.controlResults)
  const remediationPriorities = buildRemediationPriorities(readiness.controlResults, questions)

  return {
    // ----- Cover page -----
    cover: {
      businessName: businessProfile.companyName || "[Business Name]",
      contactName: businessProfile.contactName || "",
      contactEmail: businessProfile.email || "",
      carrierName: profile?.name || carrierId,
      formName: profile?.formName || "",
      formVersion: profile?.formVersion || "",
      generatedOn: new Date().toISOString().slice(0, 10),
      industry: assessment?.industry || "",
      employeeCount: assessment?.employee_count || "",
    },

    // ----- Executive summary -----
    summary: {
      readinessScore: readiness.readinessScore,
      overallReadiness: readiness.overallReadiness,
      passCount: readiness.controlResults.filter((r) => r.status === "pass").length,
      partialCount: readiness.controlResults.filter((r) => r.status === "partial").length,
      failCount: readiness.controlResults.filter((r) => r.status === "fail").length,
      notAssessedCount: readiness.controlResults.filter((r) => r.status === "not_assessed").length,
      criticalDenialRiskCount: readiness.denialRiskFlags.filter((f) => f.severity === "critical").length,
      headline: summaryHeadlineFor(readiness.overallReadiness, readiness.readinessScore),
    },

    // ----- Denial risk flags -----
    denialRiskFlags: readiness.denialRiskFlags,

    // ----- Control-by-control breakdown, grouped by category -----
    controlsByCategory: groupedByCategory,

    // ----- Evidence collection guide -----
    evidenceChecklist: readiness.evidenceChecklist,

    // ----- Remediation priorities -----
    remediationPriorities,

    // ----- Disclaimer (legally required) -----
    disclaimer:
      "This tool helps you prepare documentation for your cyber insurance application. Coverage decisions are made solely by the carrier. Data Hygienics is not an insurance provider, broker, or agent. The translated answers in this proof pack are derived from your assessment responses and are intended as a starting point - review every answer with your broker before submitting to the carrier. Carrier application forms change; the form version used for this translation is listed on the cover page. If your broker says a carrier answer is different from what appears here, trust your broker.",
  }
}

function summaryHeadlineFor(overallReadiness, score) {
  if (overallReadiness === "ready") {
    return `Your assessment scores ${score}/100 against Coalition's published application. The controls that matter most are in place, and the evidence checklist below lets you assemble a submission pack for your broker.`
  }
  if (overallReadiness === "gaps_exist") {
    return `Your assessment scores ${score}/100 against Coalition's published application. Real gaps exist, but nothing on this list is a permanent blocker. Remediate the items flagged critical before submitting.`
  }
  return `Your assessment scores ${score}/100 against Coalition's published application. This score is in the likely-denial range. Remediate the critical flags at the top of this report before submitting to any carrier.`
}

/**
 * @param {import('./schema.js').ControlResult[]} controlResults
 * @returns {Record<string, import('./schema.js').ControlResult[]>}
 */
function groupControlResultsByCategory(controlResults) {
  /** @type {Record<string, import('./schema.js').ControlResult[]>} */
  const out = {}
  for (const r of controlResults) {
    if (!out[r.controlCategory]) out[r.controlCategory] = []
    out[r.controlCategory].push(r)
  }
  return out
}

/**
 * Remediation priority list: failing + partial controls ordered by denial
 * risk. Each entry carries the carrier question, the recommendation, and
 * the evidence IDs needed to prove remediation.
 *
 * @param {import('./schema.js').ControlResult[]} controlResults
 * @param {import('./schema.js').CarrierQuestion[]} questions
 */
function buildRemediationPriorities(controlResults, questions) {
  const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 }
  return controlResults
    .filter((r) => r.status === "fail" || r.status === "partial")
    .map((r) => ({
      controlCategory: r.controlCategory,
      carrierQuestionText: r.carrierQuestionText,
      denialRiskLevel: r.denialRiskLevel,
      status: r.status,
      recommendation: r.recommendation,
      evidenceNeeded: r.evidenceNeeded,
    }))
    .sort((a, b) => {
      // Fails before partials, then by severity.
      if (a.status !== b.status) return a.status === "fail" ? -1 : 1
      return priorityRank[a.denialRiskLevel] - priorityRank[b.denialRiskLevel]
    })
}
