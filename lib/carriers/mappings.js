// ============================================================================
// Assessment-to-carrier-question mapping resolvers
// ============================================================================
//
// For each carrier question in coalition.js, this file provides a `resolver`
// function that walks the user's assessment answers and produces a translated
// answer plus a pass/partial/fail/not_assessed status. Resolvers use the
// cross-industry `controlSlug` lookup - every industry's equivalent question
// tags itself with the same slug via `tooltip.controlSlug`, so a resolver can
// find "the MFA question this user answered" without knowing whether the user
// is on general, healthcare, legal, financial, retail, government, or
// nonprofit.
//
// Each resolver returns a partial ControlResult (status + translated answer
// + recommendation + evidence IDs). The engine wraps this into the full
// ControlResult by copying in the carrier question metadata.
//
// Phase 1 scope: Coalition only. Structure supports the other three carriers
// being added in Phase 2 by exporting CARRIER_MAPPINGS keyed by carrier ID.
// ============================================================================

// ----------------------------------------------------------------------------
// Helpers: common answer-parsing primitives used across resolvers.
// ----------------------------------------------------------------------------

/**
 * Coerce an answer to an array of strings regardless of whether the original
 * was a single string (singleselect / frequency / maturity) or an array
 * (multiselect). Returns an empty array for missing/malformed answers.
 *
 * @param {string|string[]|undefined|null} answer
 * @returns {string[]}
 */
function toArray(answer) {
  if (Array.isArray(answer)) return answer
  if (typeof answer === "string" && answer.length > 0) return [answer]
  return []
}

/**
 * Case-insensitive includes check for labels that may differ slightly in
 * punctuation or whitespace between industry files.
 *
 * @param {string[]} answers
 * @param {string} needle
 * @returns {boolean}
 */
function includesLoose(answers, needle) {
  const lower = needle.toLowerCase()
  return answers.some((a) => typeof a === "string" && a.toLowerCase().includes(lower))
}

/**
 * Build the shared not_assessed result. Used whenever the user's industry
 * did not include a question that answers a given carrier question - the
 * user will be prompted for additional input in the UI.
 *
 * @param {string} prompt
 * @param {string[]} evidenceIds
 * @returns {{status: 'not_assessed', userAnswerText: string, recommendation: string, evidenceIds: string[], notesForBroker: string}}
 */
function notAssessed(prompt, evidenceIds = []) {
  return {
    status: "not_assessed",
    userAnswerText: "Additional information needed from user",
    recommendation: prompt,
    evidenceIds,
    notesForBroker:
      "The comprehensive assessment did not include a question that directly answers this carrier question. Confirm the answer with your IT lead or MSP before submitting to the carrier.",
  }
}

// ----------------------------------------------------------------------------
// Shared checker helpers (added in Phase 2)
// ----------------------------------------------------------------------------
//
// Each checker inspects the assessment answers for one control category and
// returns a `{ state, signals }` object. Carrier-specific resolvers wrap
// these to produce the carrier's paraphrased `userAnswerText`, tailored
// `recommendation`, and correct `evidenceIds`.
//
// NOTE ON PATTERN COEXISTENCE: the Coalition resolvers below this block
// (added in Phase 1, before the checkers existed) inline their own
// answer-walking logic rather than calling the checkers. They are not
// retroactively refactored because that's pure churn on already-verified
// Phase 1 output. New carrier resolvers added in Phase 2 (Cowbell,
// Travelers, Beazley) use the checkers as the canonical pattern. If the
// behaviors ever drift between the Coalition inline resolvers and the
// checker-based ones, the checkers are the source of truth to update
// first, then the Coalition resolvers should be reconciled against them.
//
// The `state` field uses the same four values as ControlResult.status so
// wrappers can map it through directly.
//
// @typedef {{state: 'pass'|'partial'|'fail'|'not_assessed', signals: Object}} CheckResult
// ----------------------------------------------------------------------------

/**
 * checkMfaEmail - is MFA enforced on email access?
 * Looks at the cross-industry multi-factor-authentication slug. Signals
 * indicate whether the "Email" option was explicitly selected vs. whether
 * the answer claims all-systems coverage.
 *
 * @param {import('./schema.js').ResolverContext} ctx
 * @returns {{state: string, signals: {slugFound: boolean, allSystems: boolean, emailExplicit: boolean, none: boolean}}}
 */
function checkMfaEmail(ctx) {
  const q = ctx.findBySlug("multi-factor-authentication")
  if (!q) return { state: "not_assessed", signals: { slugFound: false, allSystems: false, emailExplicit: false, none: false } }
  const answers = toArray(ctx.answers[q.key])
  const allSystems = includesLoose(answers, "all systems") || includesLoose(answers, "all of the above")
  const emailExplicit = includesLoose(answers, "email")
  const none = includesLoose(answers, "none")
  const signals = { slugFound: true, allSystems, emailExplicit, none }
  if (allSystems || emailExplicit) return { state: "pass", signals }
  if (none || answers.length === 0) return { state: "fail", signals }
  return { state: "partial", signals }
}

/**
 * checkMfaRemote - is MFA enforced on remote/VPN/RDP access?
 * Walks both the MFA slug and the VPN/remote access slug. Flags direct
 * RDP or port-forwarding answers as an automatic fail since that's a
 * top ransomware attack surface.
 */
function checkMfaRemote(ctx) {
  const mfa = ctx.findBySlug("multi-factor-authentication")
  const vpn =
    ctx.findBySlug("vpn-remote-access") ||
    ctx.findBySlug("remote-access-security") ||
    ctx.findBySlug("remote-access-controls")
  if (!mfa && !vpn) {
    return { state: "not_assessed", signals: { slugFound: false, mfaCovers: false, vpnStrong: false, rdpDirect: false } }
  }
  const mfaAnswers = toArray(mfa ? ctx.answers[mfa.key] : undefined)
  const vpnAnswer = vpn ? ctx.answers[vpn.key] : undefined
  const mfaCovers =
    includesLoose(mfaAnswers, "vpn") ||
    includesLoose(mfaAnswers, "remote") ||
    includesLoose(mfaAnswers, "all systems") ||
    includesLoose(mfaAnswers, "all of the above")
  const vpnStrong =
    typeof vpnAnswer === "string" &&
    (vpnAnswer.toLowerCase().includes("always-on vpn") ||
      vpnAnswer.toLowerCase().includes("ztna") ||
      vpnAnswer.toLowerCase().includes("with mfa"))
  const rdpDirect =
    typeof vpnAnswer === "string" &&
    (vpnAnswer.toLowerCase().includes("direct access via rdp") ||
      vpnAnswer.toLowerCase().includes("port forwarding"))
  const signals = { slugFound: true, mfaCovers, vpnStrong, rdpDirect }
  if (rdpDirect) return { state: "fail", signals }
  if (mfaCovers || vpnStrong) return { state: "pass", signals }
  return { state: "partial", signals }
}

/**
 * checkMfaPrivileged - is MFA enforced on admin/privileged accounts?
 * Combines the privileged access management slug with the MFA slug. If the
 * user answered "everyone has admin access", that's an automatic fail
 * regardless of what the MFA answer says.
 */
function checkMfaPrivileged(ctx) {
  const priv = ctx.findBySlug("privileged-access-management")
  const mfa = ctx.findBySlug("multi-factor-authentication")
  if (!priv && !mfa) {
    return { state: "not_assessed", signals: { slugFound: false, dedicatedAdmins: false, everyoneAdmin: false, mfaOnAdmin: false } }
  }
  const privAnswer = priv ? ctx.answers[priv.key] : undefined
  const mfaAnswers = toArray(mfa ? ctx.answers[mfa.key] : undefined)
  const dedicatedAdmins =
    typeof privAnswer === "string" &&
    privAnswer.toLowerCase().includes("dedicated admin accounts")
  const everyoneAdmin =
    typeof privAnswer === "string" &&
    privAnswer.toLowerCase().includes("everyone has admin access")
  const mfaOnAdmin =
    includesLoose(mfaAnswers, "all systems") ||
    includesLoose(mfaAnswers, "all of the above") ||
    includesLoose(mfaAnswers, "cloud services")
  const signals = { slugFound: true, dedicatedAdmins, everyoneAdmin, mfaOnAdmin }
  if (everyoneAdmin) return { state: "fail", signals }
  if (dedicatedAdmins && mfaOnAdmin) return { state: "pass", signals }
  if (dedicatedAdmins) return { state: "partial", signals }
  return { state: "fail", signals }
}

/**
 * checkEdrPresence - is an EDR product deployed on endpoints?
 * Distinguishes "next-gen EDR" from "traditional AV only" because several
 * carriers treat the latter as equivalent to no EDR for ransomware-
 * supplemental purposes.
 */
function checkEdrPresence(ctx) {
  const q =
    ctx.findBySlug("endpoint-protection") ||
    ctx.findBySlug("endpoint-detection-response")
  if (!q) {
    return { state: "not_assessed", signals: { slugFound: false, nextGen: false, traditionalOnly: false, none: false } }
  }
  const answers = toArray(ctx.answers[q.key])
  const nextGen =
    includesLoose(answers, "next-gen") ||
    includesLoose(answers, "edr") ||
    includesLoose(answers, "crowdstrike") ||
    includesLoose(answers, "sentinelone") ||
    includesLoose(answers, "defender for endpoint") ||
    includesLoose(answers, "all of the above")
  const traditionalOnly = includesLoose(answers, "traditional antivirus") && !nextGen
  const none = includesLoose(answers, "none")
  const signals = { slugFound: true, nextGen, traditionalOnly, none }
  if (nextGen) return { state: "pass", signals }
  if (traditionalOnly || none || answers.length === 0) return { state: "fail", signals }
  return { state: "partial", signals }
}

/**
 * checkBackupFrequencyAndSeparation - backups stored separately from
 * production at a credible cadence. Two dimensions: frequency and
 * architectural separation. Both must be satisfied for a pass.
 */
function checkBackupFrequencyAndSeparation(ctx) {
  const freq = ctx.findBySlug("backup-frequency") || ctx.findBySlug("data-backup")
  const location = ctx.findBySlug("offsite-backup-storage") || ctx.findBySlug("data-backup")
  if (!freq && !location) {
    return { state: "not_assessed", signals: { slugFound: false, meetsFrequency: false, isSeparated: false, sameNetwork: false } }
  }
  const freqAnswer = freq ? ctx.answers[freq.key] : undefined
  const locationAnswers = toArray(location ? ctx.answers[location.key] : undefined)
  const meetsFrequency =
    typeof freqAnswer === "string" &&
    (freqAnswer.toLowerCase().includes("daily") || freqAnswer.toLowerCase().includes("weekly"))
  const isSeparated =
    includesLoose(locationAnswers, "offsite cloud") ||
    includesLoose(locationAnswers, "separate location") ||
    includesLoose(locationAnswers, "air-gapped") ||
    includesLoose(locationAnswers, "immutable") ||
    includesLoose(locationAnswers, "all of the above")
  const sameNetwork =
    includesLoose(locationAnswers, "same server") || includesLoose(locationAnswers, "same network")
  const signals = { slugFound: true, meetsFrequency, isSeparated, sameNetwork }
  if (meetsFrequency && isSeparated) return { state: "pass", signals }
  if (sameNetwork || !isSeparated) return { state: "fail", signals }
  return { state: "partial", signals }
}

/**
 * checkBackupTesting - are backup restores tested regularly, and is
 * the storage architecture disconnected enough to survive ransomware?
 */
function checkBackupTesting(ctx) {
  const test = ctx.findBySlug("backup-testing")
  const location = ctx.findBySlug("offsite-backup-storage") || ctx.findBySlug("data-backup")
  if (!test && !location) {
    return { state: "not_assessed", signals: { slugFound: false, testedRegularly: false, disconnected: false, never: false } }
  }
  const testAnswer = test ? ctx.answers[test.key] : undefined
  const locationAnswers = toArray(location ? ctx.answers[location.key] : undefined)
  const testedRegularly =
    typeof testAnswer === "string" &&
    (testAnswer.toLowerCase().includes("monthly") ||
      testAnswer.toLowerCase().includes("quarterly") ||
      testAnswer.toLowerCase().includes("annually"))
  const never = typeof testAnswer === "string" && testAnswer.toLowerCase().includes("never")
  const disconnected =
    includesLoose(locationAnswers, "air-gapped") ||
    includesLoose(locationAnswers, "immutable") ||
    includesLoose(locationAnswers, "offsite cloud") ||
    includesLoose(locationAnswers, "all of the above")
  const signals = { slugFound: true, testedRegularly, disconnected, never }
  if (testedRegularly && disconnected) return { state: "pass", signals }
  if (never) return { state: "fail", signals }
  if (disconnected) return { state: "partial", signals }
  return { state: "fail", signals }
}

/**
 * checkPatchingWindow - is there a credible SLA for applying critical
 * security patches? Returns a `window` signal indicating the approximate
 * bucket so carrier wrappers can render the right translated answer
 * ("within 7 days", "within 30 days", "within 60 days", etc).
 */
function checkPatchingWindow(ctx) {
  const q =
    ctx.findBySlug("os-patching") ||
    ctx.findBySlug("patch-management") ||
    ctx.findBySlug("flaw-remediation-frequency") ||
    ctx.findBySlug("pos-patching-frequency")
  if (!q) {
    return { state: "not_assessed", signals: { slugFound: false, window: null } }
  }
  const answer = ctx.answers[q.key]
  if (typeof answer !== "string") {
    return { state: "not_assessed", signals: { slugFound: true, window: null } }
  }
  const lower = answer.toLowerCase()
  if (lower.includes("72 hours") || lower.includes("within 7") || lower.includes("weekly")) {
    return { state: "pass", signals: { slugFound: true, window: "7_days" } }
  }
  if (lower.includes("monthly")) {
    return { state: "pass", signals: { slugFound: true, window: "30_days" } }
  }
  if (lower.includes("quarterly")) {
    return { state: "fail", signals: { slugFound: true, window: "90_days" } }
  }
  if (lower.includes("annually") || lower.includes("never") || lower.includes("ad-hoc")) {
    return { state: "fail", signals: { slugFound: true, window: "no_sla" } }
  }
  return { state: "partial", signals: { slugFound: true, window: "unclear" } }
}

/**
 * checkIrPlan - is there a written, tested incident response plan?
 * The assessment uses a maturity-typed question so the answer is either a
 * stage descriptor or missing. We treat "Advanced" / "Mature" / "Optimized"
 * tiers as pass, "Initial" / "Defined" as partial, missing as fail.
 */
function checkIrPlan(ctx) {
  const q = ctx.findBySlug("incident-response-plan") || ctx.findBySlug("ir-plan-maturity")
  if (!q) {
    return { state: "not_assessed", signals: { slugFound: false, maturity: null } }
  }
  const answer = ctx.answers[q.key]
  if (typeof answer !== "string" || answer.length === 0) {
    return { state: "fail", signals: { slugFound: true, maturity: "none" } }
  }
  const lower = answer.toLowerCase()
  if (
    lower.includes("optimized") ||
    lower.includes("mature") ||
    lower.includes("advanced") ||
    lower.includes("measurable")
  ) {
    return { state: "pass", signals: { slugFound: true, maturity: "mature" } }
  }
  if (lower.includes("defined") || lower.includes("documented")) {
    return { state: "partial", signals: { slugFound: true, maturity: "defined" } }
  }
  if (lower.includes("initial") || lower.includes("ad-hoc") || lower.includes("informal")) {
    return { state: "fail", signals: { slugFound: true, maturity: "initial" } }
  }
  if (lower.includes("none") || lower.includes("no plan")) {
    return { state: "fail", signals: { slugFound: true, maturity: "none" } }
  }
  return { state: "partial", signals: { slugFound: true, maturity: "unclear" } }
}

/**
 * checkPhishingTraining - how often do users complete security
 * awareness / phishing training? Returns a `cadence` signal so
 * Beazley (which asks for frequency) and Cowbell (which asks
 * yes/no annual) can render accurate translated answers.
 */
function checkPhishingTraining(ctx) {
  const q =
    ctx.findBySlug("phishing-training") ||
    ctx.findBySlug("phishing-training-frequency") ||
    ctx.findBySlug("security-awareness-training") ||
    ctx.findBySlug("security-training-program") ||
    ctx.findBySlug("phishing-simulation")
  if (!q) {
    return { state: "not_assessed", signals: { slugFound: false, cadence: null } }
  }
  const answer = ctx.answers[q.key]
  if (typeof answer !== "string" || answer.length === 0) {
    return { state: "fail", signals: { slugFound: true, cadence: "none" } }
  }
  const lower = answer.toLowerCase()
  if (lower.includes("monthly")) return { state: "pass", signals: { slugFound: true, cadence: "monthly" } }
  if (lower.includes("quarterly")) return { state: "pass", signals: { slugFound: true, cadence: "quarterly" } }
  if (lower.includes("annually") || lower.includes("annual")) {
    return { state: "pass", signals: { slugFound: true, cadence: "annual" } }
  }
  if (lower.includes("onboarding")) {
    return { state: "partial", signals: { slugFound: true, cadence: "onboarding_only" } }
  }
  if (lower.includes("never")) return { state: "fail", signals: { slugFound: true, cadence: "never" } }
  return { state: "partial", signals: { slugFound: true, cadence: "unclear" } }
}

/**
 * checkEncryptionAtRest - are endpoints and sensitive data encrypted
 * at rest? Walks both the device encryption slug and the broader
 * encryption-at-rest slug so carriers with differing granularity can
 * translate accurately.
 */
function checkEncryptionAtRest(ctx) {
  const device = ctx.findBySlug("device-encryption")
  const rest = ctx.findBySlug("encryption-at-rest")
  if (!device && !rest) {
    return { state: "not_assessed", signals: { slugFound: false, enforcedOnAll: false, mostNotEnforced: false, none: false } }
  }
  const deviceAnswer = device ? ctx.answers[device.key] : undefined
  const restAnswers = toArray(rest ? ctx.answers[rest.key] : undefined)
  const enforcedOnAll =
    typeof deviceAnswer === "string" &&
    deviceAnswer.toLowerCase().includes("yes, full-disk encryption enforced on all devices")
  const mostNotEnforced =
    typeof deviceAnswer === "string" && deviceAnswer.toLowerCase().includes("most devices")
  const none =
    typeof deviceAnswer === "string" && deviceAnswer.toLowerCase().includes("no device encryption")
  const restAllDataStores =
    includesLoose(restAnswers, "all data stores") ||
    (includesLoose(restAnswers, "laptops") &&
      includesLoose(restAnswers, "servers") &&
      includesLoose(restAnswers, "cloud"))
  const signals = { slugFound: true, enforcedOnAll, mostNotEnforced, none, restAllDataStores }
  if (enforcedOnAll || restAllDataStores) return { state: "pass", signals }
  if (none) return { state: "fail", signals }
  if (mostNotEnforced) return { state: "partial", signals }
  return { state: "partial", signals }
}

/**
 * checkNetworkSegmentation - is the network segmented, and how deeply?
 */
function checkNetworkSegmentation(ctx) {
  const q =
    ctx.findBySlug("network-segmentation") ||
    ctx.findBySlug("medical-device-segmentation") ||
    ctx.findBySlug("cui-network-segmentation") ||
    ctx.findBySlug("cde-segmentation")
  if (!q) return { state: "not_assessed", signals: { slugFound: false, depth: null } }
  const answer = ctx.answers[q.key]
  if (typeof answer !== "string") return { state: "not_assessed", signals: { slugFound: true, depth: null } }
  const lower = answer.toLowerCase()
  if (lower.includes("vlans") || lower.includes("separate networks")) {
    return { state: "pass", signals: { slugFound: true, depth: "deep" } }
  }
  if (lower.includes("partial")) {
    return { state: "partial", signals: { slugFound: true, depth: "partial" } }
  }
  if (lower.includes("same network")) {
    return { state: "fail", signals: { slugFound: true, depth: "flat" } }
  }
  return { state: "partial", signals: { slugFound: true, depth: "unclear" } }
}

/**
 * checkVendorGovernance - are vendor security requirements enforced
 * through contracts and periodic review? Walks multiple vendor-risk slugs
 * used across industry assessments.
 */
function checkVendorGovernance(ctx) {
  const review = ctx.findBySlug("vendor-security-review") || ctx.findBySlug("vendor-risk-management")
  const agreements = ctx.findBySlug("vendor-data-agreements") || ctx.findBySlug("vendor-agreements")
  if (!review && !agreements) {
    return { state: "not_assessed", signals: { slugFound: false, hasReview: false, hasAgreements: false } }
  }
  const reviewAnswer = review ? ctx.answers[review.key] : undefined
  const agreementsAnswer = agreements ? ctx.answers[agreements.key] : undefined
  const hasReview =
    typeof reviewAnswer === "string" &&
    (reviewAnswer.toLowerCase().includes("formal security questionnaire") ||
      reviewAnswer.toLowerCase().includes("soc 2") ||
      reviewAnswer.toLowerCase().includes("iso 27001"))
  const hasAgreements =
    typeof agreementsAnswer === "string" &&
    (agreementsAnswer.toLowerCase().includes("all vendor contracts include data protection") ||
      agreementsAnswer.toLowerCase().includes("breach notification"))
  const signals = { slugFound: true, hasReview, hasAgreements }
  if (hasReview && hasAgreements) return { state: "pass", signals }
  if (hasReview || hasAgreements) return { state: "partial", signals }
  return { state: "fail", signals }
}

// ----------------------------------------------------------------------------
// Coalition resolvers
// ----------------------------------------------------------------------------

/**
 * coalition_mfa_1 - MFA on email
 */
function resolveCoalitionMfaEmail(ctx) {
  const mfaQuestion = ctx.findBySlug("multi-factor-authentication")
  if (!mfaQuestion) {
    return notAssessed(
      "Confirm with your IT lead whether MFA is enforced for all email access (webmail, mobile apps, desktop clients). Most organizations enforce this through their identity provider's conditional access policy.",
      ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"]
    )
  }
  const answers = toArray(ctx.answers[mfaQuestion.key])
  const allSystems = includesLoose(answers, "all systems") || includesLoose(answers, "all of the above")
  const emailExplicit = includesLoose(answers, "email")
  const none = includesLoose(answers, "none")

  if (allSystems || emailExplicit) {
    return {
      status: "pass",
      userAnswerText: "Yes - MFA is enforced for all email access.",
      recommendation:
        "Attach the identity provider screenshot and MFA enrollment roster to the application. Coalition is specifically checking for enforcement, not availability.",
      evidenceIds: ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"],
    }
  }
  if (none || answers.length === 0) {
    return {
      status: "fail",
      userAnswerText: "No - MFA is not enforced on email access.",
      recommendation:
        "CRITICAL: Enforce MFA on email for every user before submitting this application. This is the single most common reason Coalition denies SMB applications or imposes ransomware sublimits. Turn on Security Defaults in Microsoft 365 or enable 2-Step Verification enforcement in Google Workspace as the minimum step.",
      evidenceIds: ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"],
      notesForBroker:
        "This answer will almost certainly trigger a contingency or denial. Remediate before submission.",
    }
  }
  return {
    status: "partial",
    userAnswerText:
      "Partial - MFA is enforced on some systems but not explicitly confirmed for email access.",
    recommendation:
      "Coalition wants an explicit yes for email. Verify your identity provider's Conditional Access policy includes email (Exchange Online, Gmail) in the enforced scope, then capture the screenshot showing enforcement.",
    evidenceIds: ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"],
  }
}

/**
 * coalition_mfa_2 - MFA on remote/VPN/RDP
 */
function resolveCoalitionMfaRemote(ctx) {
  const mfaQuestion = ctx.findBySlug("multi-factor-authentication")
  const vpnQuestion =
    ctx.findBySlug("vpn-remote-access") ||
    ctx.findBySlug("remote-access-security") ||
    ctx.findBySlug("remote-access-controls")

  if (!mfaQuestion && !vpnQuestion) {
    return notAssessed(
      "Confirm whether every form of remote access to your network (VPN, RDP, Remote Desktop Gateway) requires MFA. If RDP is exposed to the internet, close it or put it behind MFA immediately.",
      ["evidence_mfa_enforcement_policy"]
    )
  }

  const mfaAnswers = toArray(mfaQuestion ? ctx.answers[mfaQuestion.key] : undefined)
  const vpnAnswer = vpnQuestion ? ctx.answers[vpnQuestion.key] : undefined

  const mfaCoversRemote =
    includesLoose(mfaAnswers, "vpn") ||
    includesLoose(mfaAnswers, "remote") ||
    includesLoose(mfaAnswers, "all systems") ||
    includesLoose(mfaAnswers, "all of the above")

  const vpnStrong =
    typeof vpnAnswer === "string" &&
    (vpnAnswer.toLowerCase().includes("always-on vpn") ||
      vpnAnswer.toLowerCase().includes("ztna") ||
      vpnAnswer.toLowerCase().includes("with mfa"))

  const rdpDirect =
    typeof vpnAnswer === "string" &&
    (vpnAnswer.toLowerCase().includes("direct access via rdp") ||
      vpnAnswer.toLowerCase().includes("port forwarding"))

  if (rdpDirect) {
    return {
      status: "fail",
      userAnswerText:
        "No - remote access is currently provided via direct RDP or port forwarding without MFA.",
      recommendation:
        "CRITICAL: Exposed RDP is the leading entry point for ransomware. Close the RDP port at the firewall immediately and replace it with a VPN or ZTNA that requires MFA. Coalition will deny coverage or impose significant sublimits if this is the current state.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
      notesForBroker:
        "Immediate remediation required. Do not submit until RDP exposure is closed.",
    }
  }

  if (mfaCoversRemote || vpnStrong) {
    return {
      status: "pass",
      userAnswerText:
        "Yes - MFA is enforced on remote access to the network, including VPN and any remote administration paths.",
      recommendation:
        "Capture the VPN or ZTNA configuration screenshot showing MFA required, and confirm no direct-RDP or port-forwarding exceptions exist at the firewall.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }

  return {
    status: "partial",
    userAnswerText:
      "Partial - MFA is enforced on some systems but remote access coverage is not explicitly confirmed.",
    recommendation:
      "Verify that every remote-entry path (VPN, RDP, Remote Desktop Gateway, third-party support tools) requires MFA. Coalition's ransomware supplemental asks this question specifically - a partial answer invites follow-up.",
    evidenceIds: ["evidence_mfa_enforcement_policy"],
  }
}

/**
 * coalition_mfa_3 - MFA on privileged/admin accounts
 */
function resolveCoalitionMfaPrivileged(ctx) {
  const privQuestion = ctx.findBySlug("privileged-access-management")
  const mfaQuestion = ctx.findBySlug("multi-factor-authentication")

  if (!privQuestion && !mfaQuestion) {
    return notAssessed(
      "Confirm that every Global Admin, Domain Admin, or privileged cloud administrator in your environment is required to use MFA. Export the admin role members list and cross-check.",
      ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy"]
    )
  }

  const privAnswer = privQuestion ? ctx.answers[privQuestion.key] : undefined
  const mfaAnswers = toArray(mfaQuestion ? ctx.answers[mfaQuestion.key] : undefined)

  const dedicatedAdmins =
    typeof privAnswer === "string" &&
    privAnswer.toLowerCase().includes("dedicated admin accounts")

  const everyoneAdmin =
    typeof privAnswer === "string" &&
    privAnswer.toLowerCase().includes("everyone has admin access")

  const mfaOnAdmin =
    includesLoose(mfaAnswers, "all systems") ||
    includesLoose(mfaAnswers, "all of the above") ||
    includesLoose(mfaAnswers, "cloud services")

  if (everyoneAdmin) {
    return {
      status: "fail",
      userAnswerText:
        "No - every user has administrative access on their endpoints and privileged accounts are not separated from daily-use accounts.",
      recommendation:
        "CRITICAL: Remove local admin from daily-use accounts. Create a small number of dedicated admin accounts (admin@yourco.com, distinct from dave@yourco.com), restrict Global Admin to 1-2 accounts, and require MFA on every one.",
      evidenceIds: ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy", "evidence_endpoint_local_admin_policy"],
    }
  }

  if (dedicatedAdmins && mfaOnAdmin) {
    return {
      status: "pass",
      userAnswerText:
        "Yes - privileged accounts are separated from daily-use accounts and MFA is enforced on all administrative access.",
      recommendation:
        "Export the Global Admin / Domain Admin member list and the Conditional Access policy that requires MFA on those roles. Coalition reviews both the count (is it low?) and the enforcement (is MFA universal?).",
      evidenceIds: ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy"],
    }
  }

  if (dedicatedAdmins) {
    return {
      status: "partial",
      userAnswerText:
        "Partial - privileged accounts are separated from daily-use accounts but MFA enforcement on admin roles is not explicitly confirmed.",
      recommendation:
        "Enforce MFA on every Global Admin, Domain Admin, and privileged cloud administrator through a Conditional Access policy. One unmonitored admin account without MFA is enough to compromise the environment.",
      evidenceIds: ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy"],
    }
  }

  return {
    status: "fail",
    userAnswerText: "No - privileged access is not separated or MFA-enforced in a way Coalition would recognize.",
    recommendation:
      "Stand up dedicated admin accounts, reduce the Global Admin count to the minimum, and enforce MFA on every privileged role before submitting.",
    evidenceIds: ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy"],
  }
}

/**
 * coalition_backups_1 - Weekly backups stored offline/separate
 */
function resolveCoalitionBackupsBase(ctx) {
  const freqQuestion = ctx.findBySlug("backup-frequency") || ctx.findBySlug("data-backup")
  const locationQuestion = ctx.findBySlug("offsite-backup-storage") || ctx.findBySlug("data-backup")

  if (!freqQuestion && !locationQuestion) {
    return notAssessed(
      "Confirm backup frequency (weekly or better) and that backup copies are stored on a network segment separate from production or in immutable cloud storage.",
      ["evidence_backup_job_history", "evidence_backup_segregation_proof"]
    )
  }

  const freqAnswer = freqQuestion ? ctx.answers[freqQuestion.key] : undefined
  const locationAnswers = toArray(locationQuestion ? ctx.answers[locationQuestion.key] : undefined)

  const meetsFrequency =
    typeof freqAnswer === "string" &&
    (freqAnswer.toLowerCase().includes("daily") || freqAnswer.toLowerCase().includes("weekly"))

  const isSeparated =
    includesLoose(locationAnswers, "offsite cloud") ||
    includesLoose(locationAnswers, "separate location") ||
    includesLoose(locationAnswers, "air-gapped") ||
    includesLoose(locationAnswers, "immutable") ||
    includesLoose(locationAnswers, "all of the above")

  const sameNetwork = includesLoose(locationAnswers, "same server") || includesLoose(locationAnswers, "same network")

  if (meetsFrequency && isSeparated) {
    return {
      status: "pass",
      userAnswerText:
        "Yes - critical data is backed up at least weekly with copies stored offline or on a separate network.",
      recommendation:
        "Attach the backup job success history and the architecture evidence showing backups are not reachable from the production network.",
      evidenceIds: ["evidence_backup_job_history", "evidence_backup_segregation_proof"],
    }
  }

  if (sameNetwork || !isSeparated) {
    return {
      status: "fail",
      userAnswerText: "No - backup copies are not stored offline or on a network separate from production.",
      recommendation:
        "CRITICAL: Move backup storage off the production network. Offsite cloud with immutability (AWS S3 Object Lock, Backblaze B2, Wasabi) or an air-gapped backup appliance are the two patterns that satisfy Coalition. Backups on a network share in the same office provide no ransomware protection.",
      evidenceIds: ["evidence_backup_job_history", "evidence_backup_segregation_proof"],
    }
  }

  return {
    status: "partial",
    userAnswerText: "Partial - backups exist but either the cadence is below weekly or the separation architecture is unclear.",
    recommendation:
      "Raise cadence to at least weekly (daily preferred) and confirm that backups live in a location ransomware cannot reach from the production network.",
    evidenceIds: ["evidence_backup_job_history", "evidence_backup_segregation_proof"],
  }
}

/**
 * coalition_encryption_1 - Device encryption
 */
function resolveCoalitionEncryption(ctx) {
  const deviceQuestion = ctx.findBySlug("device-encryption")
  const restQuestion = ctx.findBySlug("encryption-at-rest")

  if (!deviceQuestion && !restQuestion) {
    return notAssessed(
      "Confirm that full-disk encryption is enforced on every company laptop, workstation, and portable storage device. BitLocker on Windows and FileVault on Mac are the standard tools.",
      ["evidence_device_encryption_enforcement"]
    )
  }

  const deviceAnswer = deviceQuestion ? ctx.answers[deviceQuestion.key] : undefined
  const restAnswers = toArray(restQuestion ? ctx.answers[restQuestion.key] : undefined)

  const enforcedOnAll =
    typeof deviceAnswer === "string" &&
    deviceAnswer.toLowerCase().includes("yes, full-disk encryption enforced on all devices")
  const mostNotEnforced =
    typeof deviceAnswer === "string" && deviceAnswer.toLowerCase().includes("most devices")
  const none =
    typeof deviceAnswer === "string" && deviceAnswer.toLowerCase().includes("no device encryption")

  const restAllDataStores =
    includesLoose(restAnswers, "all data stores") ||
    (includesLoose(restAnswers, "laptops") && includesLoose(restAnswers, "servers") && includesLoose(restAnswers, "cloud"))

  if (enforcedOnAll || restAllDataStores) {
    return {
      status: "pass",
      userAnswerText: "Yes - encryption is enforced on workstations, laptops, and portable media via policy.",
      recommendation:
        "Attach the MDM policy screenshot and device compliance export showing every managed device in a compliant encryption state.",
      evidenceIds: ["evidence_device_encryption_enforcement"],
    }
  }

  if (none) {
    return {
      status: "fail",
      userAnswerText: "No - device encryption is not in place.",
      recommendation:
        "Enable BitLocker on every Windows device and FileVault on every Mac before submitting. This is a low-effort, high-leverage control: turn it on through Intune or Jamf policies and verify via device compliance.",
      evidenceIds: ["evidence_device_encryption_enforcement"],
    }
  }

  if (mostNotEnforced) {
    return {
      status: "partial",
      userAnswerText: "Partial - encryption exists on most devices but is not centrally enforced.",
      recommendation:
        "Move from 'devices are encrypted' to 'encryption is enforced by policy and verified.' Enforcement via MDM converts this from an attestation into defensible evidence.",
      evidenceIds: ["evidence_device_encryption_enforcement"],
    }
  }

  return {
    status: "partial",
    userAnswerText: "Partial - encryption scope is unclear from the assessment answers.",
    recommendation:
      "Confirm that every company-owned laptop and workstation has full-disk encryption active and is enforced by policy.",
    evidenceIds: ["evidence_device_encryption_enforcement"],
  }
}

/**
 * coalition_funds_transfer_1 - Out-of-band verification of funds transfers
 */
function resolveCoalitionFundsTransfer(ctx) {
  // The general assessment does not have a direct question for out-of-band
  // funds-transfer verification. Prompt for user input.
  return notAssessed(
    "Confirm whether you use a secondary channel (phone call to a pre-verified number) to verify funds transfer requests over a threshold, and whether requests to change vendor banking details follow the same verification. If no procedure exists, document one before submitting - this is a high-impact fraud control.",
    []
  )
}

/**
 * coalition_edr_1 - EDR deployed
 */
function resolveCoalitionEdr(ctx) {
  const epQuestion =
    ctx.findBySlug("endpoint-protection") || ctx.findBySlug("endpoint-detection-response")

  if (!epQuestion) {
    return notAssessed(
      "Confirm which EDR product is deployed across your endpoints (Microsoft Defender for Endpoint, CrowdStrike Falcon, SentinelOne, Sophos Intercept X, etc.) and verify coverage on workstations, laptops, and servers. Coalition asks for the vendor name, not just yes/no.",
      ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"]
    )
  }

  const answers = toArray(ctx.answers[epQuestion.key])

  const nextGen =
    includesLoose(answers, "next-gen") ||
    includesLoose(answers, "edr") ||
    includesLoose(answers, "crowdstrike") ||
    includesLoose(answers, "sentinelone") ||
    includesLoose(answers, "defender for endpoint") ||
    includesLoose(answers, "all of the above")

  const traditionalOnly =
    includesLoose(answers, "traditional antivirus") && !nextGen

  const none = includesLoose(answers, "none")

  if (nextGen) {
    return {
      status: "pass",
      userAnswerText:
        "Yes - a next-generation EDR product is deployed on endpoints. The specific vendor name must be added to the application form.",
      recommendation:
        "Add the EDR product name (e.g., 'Microsoft Defender for Endpoint' or 'CrowdStrike Falcon') to the carrier form. Attach the device inventory export from the EDR console showing coverage across workstations, laptops, and servers.",
      evidenceIds: ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"],
      notesForBroker:
        "Coalition specifically asks for the vendor name. Confirm with the IT lead and enter it on the application before submission.",
    }
  }

  if (traditionalOnly) {
    return {
      status: "fail",
      userAnswerText:
        "No - only traditional signature-based antivirus is deployed, which Coalition does not treat as equivalent to EDR.",
      recommendation:
        "CRITICAL: Deploy a next-generation EDR before submitting. Microsoft Defender for Endpoint is included with Microsoft 365 Business Premium at no extra cost; CrowdStrike, SentinelOne, and Sophos Intercept X are the common third-party options. Traditional AV alone is increasingly grounds for denial.",
      evidenceIds: ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"],
    }
  }

  if (none || answers.length === 0) {
    return {
      status: "fail",
      userAnswerText: "No - no endpoint protection is deployed.",
      recommendation:
        "CRITICAL: No EDR is the number-one ransomware claim predictor. Do not submit this application without first deploying an EDR across all endpoints. Microsoft Defender for Endpoint is the fastest path for Microsoft 365 customers.",
      evidenceIds: ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"],
    }
  }

  return {
    status: "partial",
    userAnswerText: "Partial - endpoint protection exists but the product or coverage is unclear.",
    recommendation:
      "Identify the specific product in use, confirm coverage across workstations, laptops, and servers, and provide the vendor name on the application form.",
    evidenceIds: ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"],
  }
}

/**
 * coalition_edr_2 - MDR service
 */
function resolveCoalitionMdr(ctx) {
  // The comprehensive assessment does not have a direct MDR question.
  // Prompt the user to confirm.
  return notAssessed(
    "Confirm whether a third-party managed detection and response (MDR) service monitors your EDR alerts 24x7. If yes, provide the provider name. If no, answer honestly - MDR is not required but its presence can remove ransomware sublimits on Coalition quotes.",
    ["evidence_soc_monitoring_summary"]
  )
}

/**
 * coalition_backups_2 - Tested + disconnected (ransomware supplemental)
 */
function resolveCoalitionBackupsRansomware(ctx) {
  const testQuestion = ctx.findBySlug("backup-testing")
  const locationQuestion = ctx.findBySlug("offsite-backup-storage") || ctx.findBySlug("data-backup")

  if (!testQuestion && !locationQuestion) {
    return notAssessed(
      "Confirm you have performed a successful restore test recently (within the last 6 months) and that your backup storage is disconnected or inaccessible from the production network when not actively being written.",
      ["evidence_backup_restore_test", "evidence_backup_segregation_proof"]
    )
  }

  const testAnswer = testQuestion ? ctx.answers[testQuestion.key] : undefined
  const locationAnswers = toArray(locationQuestion ? ctx.answers[locationQuestion.key] : undefined)

  const testedRegularly =
    typeof testAnswer === "string" &&
    (testAnswer.toLowerCase().includes("monthly") ||
      testAnswer.toLowerCase().includes("quarterly") ||
      testAnswer.toLowerCase().includes("annually"))
  const never = typeof testAnswer === "string" && testAnswer.toLowerCase().includes("never")

  const disconnected =
    includesLoose(locationAnswers, "air-gapped") ||
    includesLoose(locationAnswers, "immutable") ||
    includesLoose(locationAnswers, "offsite cloud") ||
    includesLoose(locationAnswers, "all of the above")

  if (testedRegularly && disconnected) {
    return {
      status: "pass",
      userAnswerText:
        "Yes - backups are tested through periodic restores and are stored in a disconnected or immutable location.",
      recommendation:
        "Attach the most recent restore-test report and the disconnection architecture evidence. If you can produce an actual restore time matching your stated recovery objective, include it.",
      evidenceIds: ["evidence_backup_restore_test", "evidence_backup_segregation_proof"],
    }
  }

  if (never) {
    return {
      status: "fail",
      userAnswerText: "No - backup restores have never been tested.",
      recommendation:
        "CRITICAL: Run at least one end-to-end restore test before submitting the application. A backup you have never restored is not a backup you can count on. Use a sample file or a non-production VM and document the exercise.",
      evidenceIds: ["evidence_backup_restore_test"],
    }
  }

  if (disconnected) {
    return {
      status: "partial",
      userAnswerText:
        "Partial - backups are stored in a separated location but recent restore testing is not confirmed.",
      recommendation:
        "Run a restore test within the next 30 days and document it. Coalition's ransomware supplemental is specific about testing - a 'yes backups exist' answer without a recent test invites follow-up.",
      evidenceIds: ["evidence_backup_restore_test", "evidence_backup_segregation_proof"],
    }
  }

  return {
    status: "fail",
    userAnswerText: "No - backups are not tested or not disconnected from production.",
    recommendation:
      "Address both gaps: (1) run a restore test and document it; (2) move backup storage to an immutable or air-gapped location.",
    evidenceIds: ["evidence_backup_restore_test", "evidence_backup_segregation_proof"],
  }
}

/**
 * coalition_segmentation_1 - Network segmentation depth
 */
function resolveCoalitionSegmentation(ctx) {
  const segQuestion =
    ctx.findBySlug("network-segmentation") ||
    ctx.findBySlug("medical-device-segmentation") ||
    ctx.findBySlug("cui-network-segmentation") ||
    ctx.findBySlug("cde-segmentation")

  if (!segQuestion) {
    return notAssessed(
      "Confirm whether your network is segmented to isolate sensitive systems, and at what depth (individual machine, office location, or business unit). Provide a current network diagram.",
      ["evidence_network_diagram", "evidence_firewall_config_logs"]
    )
  }

  const answer = ctx.answers[segQuestion.key]
  if (typeof answer !== "string") {
    return notAssessed(
      "Confirm your network segmentation state.",
      ["evidence_network_diagram", "evidence_firewall_config_logs"]
    )
  }

  const lower = answer.toLowerCase()

  if (lower.includes("vlans") || lower.includes("separate networks")) {
    return {
      status: "pass",
      userAnswerText:
        "Segmented by business unit - VLANs separate sensitive systems, guest WiFi, and IoT from the general network.",
      recommendation:
        "Attach the network diagram and firewall rule evidence showing the segmentation boundaries.",
      evidenceIds: ["evidence_network_diagram", "evidence_firewall_config_logs"],
    }
  }
  if (lower.includes("partial")) {
    return {
      status: "partial",
      userAnswerText: "Segmented by office location - partial segmentation (guest WiFi is separate from the trusted network).",
      recommendation:
        "Extend segmentation to isolate backups, domain controllers, and financial systems from the general user network. Partial segmentation is accepted but scored lower than full segmentation by Coalition.",
      evidenceIds: ["evidence_network_diagram", "evidence_firewall_config_logs"],
    }
  }
  if (lower.includes("same network")) {
    return {
      status: "fail",
      userAnswerText: "Not segmented - every device shares a single flat network.",
      recommendation:
        "CRITICAL: A flat network lets ransomware spread everywhere. At minimum, put guest WiFi, IoT devices, and backup storage on separate VLANs. A network diagram is required evidence.",
      evidenceIds: ["evidence_network_diagram", "evidence_firewall_config_logs"],
    }
  }
  return {
    status: "partial",
    userAnswerText: "Segmentation state is unclear from the assessment answer.",
    recommendation:
      "Document the current segmentation architecture with a network diagram before submitting. Coalition expects a specific answer about depth, not just yes or no.",
    evidenceIds: ["evidence_network_diagram", "evidence_firewall_config_logs"],
  }
}

/**
 * coalition_patching_1 - Critical patch window
 */
function resolveCoalitionPatching(ctx) {
  const patchQuestion =
    ctx.findBySlug("os-patching") ||
    ctx.findBySlug("patch-management") ||
    ctx.findBySlug("flaw-remediation-frequency") ||
    ctx.findBySlug("pos-patching-frequency")

  if (!patchQuestion) {
    return notAssessed(
      "Confirm your SLA for applying critical security patches. Coalition expects 30 days or faster for critical issues, with 7 days as the preferred standard.",
      ["evidence_patch_compliance_report", "evidence_vulnerability_export"]
    )
  }

  const answer = ctx.answers[patchQuestion.key]
  if (typeof answer !== "string") {
    return notAssessed(
      "Confirm your patching cadence.",
      ["evidence_patch_compliance_report"]
    )
  }

  const lower = answer.toLowerCase()

  if (lower.includes("72 hours") || lower.includes("within 7") || lower.includes("weekly")) {
    return {
      status: "pass",
      userAnswerText: "Yes - critical security patches are applied within 7 days of disclosure.",
      recommendation:
        "Attach the patch compliance report showing your actual deployment cadence against the stated SLA.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  if (lower.includes("monthly")) {
    return {
      status: "pass",
      userAnswerText: "Yes - critical security patches are applied within 30 days of disclosure.",
      recommendation:
        "Attach the patch compliance report. 30 days is the Coalition baseline - faster is better, especially for internet-facing systems.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  if (lower.includes("quarterly")) {
    return {
      status: "fail",
      userAnswerText: "No - critical patches are applied quarterly, which is outside the Coalition-acceptable window.",
      recommendation:
        "Tighten the SLA to 30 days for critical patches. Configure Windows Update for Business rings and equivalent Mac update policies to enforce deployment automatically.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  if (lower.includes("annually") || lower.includes("never") || lower.includes("ad-hoc")) {
    return {
      status: "fail",
      userAnswerText: "No - critical security patches are not applied on a predictable schedule.",
      recommendation:
        "Establish a documented patching SLA and enforce it through Intune, WSUS, or an RMM tool. Annual or ad-hoc patching is treated as no SLA by Coalition.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  return {
    status: "partial",
    userAnswerText: "Patching cadence is unclear from the assessment answer.",
    recommendation:
      "Document the current critical-patch SLA with your IT lead or MSP. Coalition expects a specific timeframe on the form.",
    evidenceIds: ["evidence_patch_compliance_report"],
  }
}

/**
 * coalition_msp_1 - MSP identification
 */
function resolveCoalitionMsp(ctx) {
  return notAssessed(
    "If you use a managed service provider for any part of your IT environment (email, endpoints, backups, network, security), provide the MSP's name and the scope of what they manage. If you do not use an MSP, answer 'No' on the form.",
    []
  )
}

// ============================================================================
// Cowbell resolvers (Phase 2)
// ============================================================================
//
// Every resolver below uses the shared checkers where applicable. Questions
// that have no corresponding assessment question return notAssessed() with a
// carrier-specific prompt so the UI surfaces the gap as "needs user input"
// rather than silently passing.

function resolveCowbellTraining(ctx) {
  const check = checkPhishingTraining(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Cowbell requires confirmation that mandatory cybersecurity training is delivered at least annually. Confirm with HR or your training platform and provide a completion roster.",
      ["evidence_training_completion_roster"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - mandatory cybersecurity training is delivered at least once per year.",
      recommendation:
        "Attach the training completion roster showing total headcount versus completed count. A dated HR attestation is acceptable if no LMS report is available.",
      evidenceIds: ["evidence_training_completion_roster"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText: "Partial - training is delivered but only informally or during onboarding.",
      recommendation:
        "Move to a documented annual training program with completion tracking. Cowbell's form asks a yes/no and underwriters expect evidence of delivery to every employee.",
      evidenceIds: ["evidence_training_completion_roster"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - no mandatory cybersecurity training is currently delivered.",
    recommendation:
      "Deploy a security awareness training program before submitting. KnowBe4, Hoxhunt, Curricula, and Microsoft Defender Attack Simulation are common options for small businesses.",
    evidenceIds: ["evidence_training_completion_roster"],
  }
}

function resolveCowbellEncryption(slug) {
  return function resolver() {
    return notAssessed(
      `Confirm whether sensitive information in ${slug} is encrypted, and describe the encryption approach (TLS version for external communications; at-rest encryption provided by your cloud services). Most major SaaS providers encrypt at rest by default, but Cowbell expects an explicit yes.`,
      []
    )
  }
}

function resolveCowbellBackupsFrequency(ctx) {
  const check = checkBackupFrequencyAndSeparation(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm the cadence at which critical business data is backed up. Cowbell buckets the answer into weekly/monthly/quarterly/every six months/never, with weekly or better expected.",
      ["evidence_backup_job_history"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Weekly or more frequent - backups run at least weekly, often daily.",
      recommendation:
        "Attach the backup job history from the last 30-90 days showing the actual cadence.",
      evidenceIds: ["evidence_backup_job_history"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText: "Monthly - backup cadence is below weekly but exists.",
      recommendation:
        "Raise the backup cadence to weekly or daily before submitting. Monthly backups leave you exposed to weeks of data loss in a ransomware scenario.",
      evidenceIds: ["evidence_backup_job_history"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "Never or worse than quarterly - backup cadence is insufficient.",
    recommendation:
      "Deploy an automated backup solution with at least weekly cadence before submitting. Daily is strongly preferred.",
    evidenceIds: ["evidence_backup_job_history"],
  }
}

function resolveCowbellBackupsAttributes(ctx) {
  const freq = checkBackupFrequencyAndSeparation(ctx)
  const test = checkBackupTesting(ctx)
  if (freq.state === "not_assessed" && test.state === "not_assessed") {
    return notAssessed(
      "Confirm which of the following backup attributes are in place: encrypted, tested, stored on a separate network or offline, stored in a dedicated cloud backup service. Cowbell uses a checkbox list.",
      ["evidence_backup_segregation_proof", "evidence_backup_restore_test"]
    )
  }
  const isSeparated = freq.signals.isSeparated
  const testedRegularly = test.signals.testedRegularly
  if (isSeparated && testedRegularly) {
    return {
      status: "pass",
      userAnswerText:
        "Encrypted, tested, and stored separately - backups satisfy the key attributes Cowbell asks about.",
      recommendation:
        "Attach per-attribute evidence: encryption configuration, restore test report, and network diagram showing segregation.",
      evidenceIds: ["evidence_backup_segregation_proof", "evidence_backup_restore_test"],
    }
  }
  if (isSeparated || testedRegularly) {
    return {
      status: "partial",
      userAnswerText:
        "Partial - at least one backup attribute is missing (either testing or separation from production).",
      recommendation:
        "Close the missing attribute before submitting. Cowbell's checkbox format means underwriters see exactly which boxes are unchecked.",
      evidenceIds: ["evidence_backup_segregation_proof", "evidence_backup_restore_test"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "Neither tested nor separated - backup attributes do not meet Cowbell expectations.",
    recommendation:
      "Before submitting: (1) move backups to offline or dedicated-cloud-backup storage; (2) run a restore test and document it. Encryption should already be on by default in most backup platforms.",
    evidenceIds: ["evidence_backup_segregation_proof", "evidence_backup_restore_test"],
  }
}

function resolveCowbellFailoverTest(ctx) {
  return notAssessed(
    "Confirm whether you have performed a full failover test of critical servers within the past year. This is distinct from a file-level restore test - it validates the complete recovery path including network, DNS, and application configuration. If you have not run one, schedule and document it before submission.",
    ["evidence_backup_restore_test"]
  )
}

function resolveCowbellPatching(ctx) {
  const check = checkPatchingWindow(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm the cadence at which critical security patches are applied to your IT systems. Cowbell buckets the answer into weekly/monthly/quarterly/every six months/never.",
      ["evidence_patch_compliance_report"]
    )
  }
  const window = check.signals.window
  if (window === "7_days") {
    return {
      status: "pass",
      userAnswerText: "Weekly - security patches applied weekly or faster.",
      recommendation: "Attach the patch compliance report showing actual deployment cadence.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  if (window === "30_days") {
    return {
      status: "pass",
      userAnswerText: "Monthly - security patches applied within 30 days of release.",
      recommendation:
        "Attach the patch compliance report. Monthly is the Cowbell baseline; faster is better for internet-facing systems.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "Quarterly or worse - patching cadence falls outside Cowbell expectations.",
    recommendation:
      "Tighten patching to monthly at minimum before submitting. Use Intune, WSUS, or your RMM to enforce automated deployment.",
    evidenceIds: ["evidence_patch_compliance_report"],
  }
}

function resolveCowbellMfaScope(ctx) {
  const email = checkMfaEmail(ctx)
  const remote = checkMfaRemote(ctx)
  const priv = checkMfaPrivileged(ctx)
  if (email.state === "not_assessed" && remote.state === "not_assessed" && priv.state === "not_assessed") {
    return notAssessed(
      "Confirm the scope of MFA enforcement across email, cloud deployments, mission-critical systems, and remote access. Cowbell uses a multi-select and expects every relevant surface to be covered.",
      ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"]
    )
  }
  const coveredEmail = email.state === "pass"
  const coveredRemote = remote.state === "pass"
  const coveredPriv = priv.state === "pass"
  const coveredCount = [coveredEmail, coveredRemote, coveredPriv].filter(Boolean).length
  if (coveredCount === 3) {
    return {
      status: "pass",
      userAnswerText:
        "Email, cloud deployments, mission-critical systems, and remote access - MFA is enforced across every surface Cowbell asks about.",
      recommendation:
        "Attach the identity provider policy screenshot showing enforcement scope plus the per-user enrollment roster.",
      evidenceIds: ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"],
    }
  }
  if (coveredCount >= 1) {
    return {
      status: "partial",
      userAnswerText: "Partial MFA coverage - some surfaces are covered but gaps remain.",
      recommendation:
        "Extend MFA to every surface (email, cloud, mission-critical, remote) before submitting. Underwriters compare the checked boxes against the stated environment and flag gaps.",
      evidenceIds: ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "None - MFA is not enforced on any of the access surfaces Cowbell asks about.",
    recommendation:
      "CRITICAL: Enforce MFA on email, remote access, and cloud services before submitting. This is a gating control on Cowbell quotes and commonly a subjectivity for removing ransomware sublimits.",
    evidenceIds: ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"],
  }
}

function resolveCowbellMfaSubjectivity(ctx) {
  // Same underlying check as the base MFA scope question, but framed as
  // the quote-subjectivity language used to remove ransomware sublimits.
  const underlying = resolveCowbellMfaScope(ctx)
  if (underlying.status === "pass") {
    return {
      status: "pass",
      userAnswerText:
        "Yes - MFA is fully implemented across email, remote access, privileged accounts, and cloud services.",
      recommendation:
        "Attach the MFA evidence bundle plus a dated IT-lead attestation confirming complete coverage. This is the answer Cowbell underwriters need to remove ransomware-related sublimits from a quote.",
      evidenceIds: ["evidence_mfa_enforcement_policy", "evidence_mfa_enrollment_roster"],
    }
  }
  return {
    ...underlying,
    userAnswerText:
      (underlying.userAnswerText || "") +
      " This quote subjectivity requires complete MFA coverage to remove ransomware sublimit endorsements.",
    notesForBroker:
      "If the insured wants the ransomware sublimit removed, every gap identified here must be closed before binding.",
  }
}

function resolveCowbellIrPlan(ctx) {
  const check = checkIrPlan(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether you have a written incident response plan that is currently in effect and has been tested. Cowbell's wording is specific: the plan must be both 'in effect' and 'tested.'",
      ["evidence_ir_plan_document", "evidence_ir_tabletop_exercise"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - a written, tested incident response plan is currently in effect.",
      recommendation:
        "Attach the IR plan PDF and a recent tabletop exercise after-action report. Cowbell treats an untested plan the same as no plan.",
      evidenceIds: ["evidence_ir_plan_document", "evidence_ir_tabletop_exercise"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText: "Partial - a written plan exists but testing is not documented or not current.",
      recommendation:
        "Run a tabletop exercise before submitting and document the after-action results. The Data Hygienics Incident Response Planner at /tools/ir-plan/exercise generates a timestamped PDF record.",
      evidenceIds: ["evidence_ir_plan_document", "evidence_ir_tabletop_exercise"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - no written incident response plan is currently in effect.",
    recommendation:
      "Build an IR plan before submitting. Data Hygienics' IR Plan Builder at /tools/ir-plan produces a minimum-viable plan from a guided interview, and the tabletop exercise module satisfies the testing requirement.",
    evidenceIds: ["evidence_ir_plan_document", "evidence_ir_tabletop_exercise"],
  }
}

function resolveCowbellSegmentation(ctx) {
  const check = checkNetworkSegmentation(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether internet-accessible systems (web servers, email servers) are separated from your trusted internal network via a DMZ or third-party hosting.",
      ["evidence_network_diagram"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText:
        "Yes - internet-accessible systems are separated from the trusted internal network.",
      recommendation:
        "Attach the network diagram showing the architectural boundary.",
      evidenceIds: ["evidence_network_diagram"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText:
        "Partial - some segmentation exists but internet-facing systems may share the trusted network.",
      recommendation:
        "Confirm that internet-accessible services live in a DMZ or at a third-party provider. Update the network diagram to reflect the current architecture.",
      evidenceIds: ["evidence_network_diagram"],
    }
  }
  return {
    status: "fail",
    userAnswerText:
      "No - internet-accessible systems share the same trusted network as internal workstations.",
    recommendation:
      "CRITICAL: Move internet-accessible systems to a DMZ or a third-party host. A flat network with exposed services is high-risk.",
    evidenceIds: ["evidence_network_diagram"],
  }
}

function resolveCowbellVendor(ctx) {
  const check = checkVendorGovernance(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether your vendor contracts require security controls commensurate with your own standards. Attach sample clauses if available.",
      ["evidence_vendor_due_diligence"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText:
        "Yes - vendor contracts include security requirements aligned with our own standards.",
      recommendation:
        "Attach sample contract clauses and, for critical vendors, their SOC 2 or ISO 27001 attestations.",
      evidenceIds: ["evidence_vendor_due_diligence"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText: "Partial - some vendor contracts include security requirements but not all.",
      recommendation:
        "Standardize security clauses across all vendor contracts. At minimum, require breach notification and a right to audit for critical vendors.",
      evidenceIds: ["evidence_vendor_due_diligence"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - vendor contracts do not consistently require security controls.",
    recommendation:
      "Update vendor contract templates to include security, breach notification, and indemnification clauses before submitting.",
    evidenceIds: ["evidence_vendor_due_diligence"],
  }
}

function resolveCowbellFundsAccess(ctx) {
  return notAssessed(
    "Confirm whether wire-transfer initiation is restricted to authorized employees with segregation of duties (the person who initiates a transfer cannot also approve it). Document the role matrix for finance staff.",
    []
  )
}
function resolveCowbellVendorBank(ctx) {
  return notAssessed(
    "Confirm whether new vendor bank account details are verified before being added to your accounts payable system. The standard control is a call-back to a pre-verified phone number before first use.",
    []
  )
}
function resolveCowbellFundsCallback(ctx) {
  return notAssessed(
    "Confirm whether funds transfer requests are authenticated through an out-of-band channel (such as a call back to a pre-verified number) before execution. Document the threshold that triggers the verification.",
    []
  )
}

// ============================================================================
// Travelers resolvers (Phase 2)
// ============================================================================

function resolveTravelersEdr(ctx) {
  const check = checkEdrPresence(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether up-to-date endpoint protection is deployed on every computer, server, and mobile device. Travelers asks a plain yes/no but at claim time will check for coverage on servers and domain controllers.",
      ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - active endpoint protection is deployed across all devices.",
      recommendation:
        "Attach the EDR console device inventory export showing agent coverage across workstations, laptops, and servers.",
      evidenceIds: ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - endpoint protection is either missing or limited to traditional signature-based AV.",
    recommendation:
      "Deploy next-generation EDR before submitting. Microsoft Defender for Endpoint is included with Microsoft 365 Business Premium; CrowdStrike, SentinelOne, and Sophos Intercept X are common alternatives.",
    evidenceIds: ["evidence_edr_device_inventory", "evidence_edr_vendor_identification"],
  }
}

function resolveTravelersLogging(ctx) {
  return notAssessed(
    "Travelers asks specifically about systematic storage AND active monitoring of network and security logs. Confirm: (1) what gets logged, (2) where logs are stored, (3) how long they are retained, (4) whether someone reviews alerts. If monitoring is outsourced to an MDR, a recent monthly report is ideal evidence.",
    ["evidence_centralized_log_retention", "evidence_soc_monitoring_summary"]
  )
}
function resolveTravelersVendorLogging(ctx) {
  return notAssessed(
    "Travelers asks whether third-party vendor access to your systems is logged and actively monitored. Document the mechanism (jump host, PAM tool, IdP access logs) and include a sample of recent vendor-access log entries.",
    ["evidence_centralized_log_retention"]
  )
}

function resolveTravelersPatchProcess(ctx) {
  const check = checkPatchingWindow(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether you follow a defined process to download, test, and install security patches. Include both a written SOP and evidence of actual cadence.",
      ["evidence_patch_compliance_report"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - a defined patching process is followed.",
      recommendation:
        "Attach the written patching SOP plus a compliance report showing actual deployment cadence.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText: "Partial - patches are applied but no formal process is documented.",
      recommendation:
        "Document the patching process as a written SOP. Travelers asks this question separately from patching frequency because they want to see governance.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - no defined patching process exists.",
    recommendation:
      "Establish and document a patching SOP before submitting. Include who is responsible, what cadence, and what happens when patches fail.",
    evidenceIds: ["evidence_patch_compliance_report"],
  }
}

function resolveTravelersPatchAutomation(ctx) {
  return notAssessed(
    "Travelers asks specifically whether the patching process is automated through a tool (Intune, WSUS, RMM). Confirm the tool in use and capture a screenshot of the automated deployment configuration.",
    ["evidence_patch_compliance_report"]
  )
}

function resolveTravelersPatch30(ctx) {
  const check = checkPatchingWindow(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Travelers requires critical patches to be installed within 30 days of release. Confirm your current SLA and attach the compliance report.",
      ["evidence_patch_compliance_report"]
    )
  }
  if (check.signals.window === "7_days" || check.signals.window === "30_days") {
    return {
      status: "pass",
      userAnswerText: `Yes - critical patches are installed within ${check.signals.window === "7_days" ? "7" : "30"} days of release.`,
      recommendation:
        "Attach the patch compliance report showing time-from-release to install for recent critical patches.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - critical patches are not consistently installed within 30 days.",
    recommendation:
      "Tighten the SLA to 30 days or better before submitting. This is an explicit Travelers requirement on the long form.",
    evidenceIds: ["evidence_patch_compliance_report"],
  }
}

function resolveTravelersBackupsExistence(ctx) {
  const check = checkBackupFrequencyAndSeparation(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm that backup and recovery procedures exist for critical business and customer data.",
      ["evidence_backup_job_history"]
    )
  }
  if (check.state === "pass" || check.signals.meetsFrequency) {
    return {
      status: "pass",
      userAnswerText: "Yes - backup and recovery procedures are in place for important data.",
      recommendation:
        "Attach the backup job history and a written description of what is being backed up.",
      evidenceIds: ["evidence_backup_job_history"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - no consistent backup procedures exist.",
    recommendation:
      "Deploy an automated backup solution before submitting. This is a critical-denial-risk answer.",
    evidenceIds: ["evidence_backup_job_history"],
  }
}

function resolveTravelersBackupAutomation(ctx) {
  return notAssessed(
    "Travelers asks specifically whether backups are automated rather than manual. Confirm the automation via the backup tool's scheduling configuration and attach a screenshot.",
    ["evidence_backup_job_history"]
  )
}

function resolveTravelersBackupTesting(ctx) {
  const check = checkBackupTesting(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Travelers asks whether backup restores are tested at least annually. Confirm the most recent test date and outcome.",
      ["evidence_backup_restore_test"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - backup restore procedures are tested at least annually.",
      recommendation:
        "Attach the most recent restore test report showing date, systems restored, and outcome.",
      evidenceIds: ["evidence_backup_restore_test"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText:
        "Partial - backups exist and storage is separated, but annual restore testing is not confirmed.",
      recommendation:
        "Run a restore test within 30 days and document it. Travelers specifies annual at minimum.",
      evidenceIds: ["evidence_backup_restore_test"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - backup restores are not tested annually.",
    recommendation:
      "Schedule and run a restore test before submitting. A backup you have never tested is not a backup you can count on.",
    evidenceIds: ["evidence_backup_restore_test"],
  }
}

function resolveTravelersMfaBasePriv(ctx) {
  const check = checkMfaPrivileged(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether MFA is enforced on administrative and privileged access. Export the privileged role member list and attach the Conditional Access policy requiring MFA on those roles.",
      ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - MFA is enforced on administrative and privileged access.",
      recommendation:
        "Attach the privileged account list plus the MFA enforcement policy for those roles.",
      evidenceIds: ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - MFA is not consistently enforced on administrative and privileged access.",
    recommendation:
      "CRITICAL: Enforce MFA on every Global Admin, Domain Admin, and privileged cloud administrator before submitting.",
    evidenceIds: ["evidence_privileged_account_list", "evidence_mfa_enforcement_policy"],
  }
}

function resolveTravelersMfaBaseRemote(ctx) {
  const check = checkMfaRemote(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm MFA is enforced on remote network access and on any systems holding bulk sensitive data.",
      ["evidence_mfa_enforcement_policy"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText:
        "Yes - MFA is enforced on remote access and on systems containing bulk sensitive data.",
      recommendation:
        "Attach the VPN or ZTNA configuration showing MFA required, plus any Conditional Access policy gating bulk-sensitive-data applications.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }
  if (check.signals.rdpDirect) {
    return {
      status: "fail",
      userAnswerText: "No - remote access is provided via direct RDP or port forwarding without MFA.",
      recommendation:
        "CRITICAL: Close exposed RDP at the firewall and replace with VPN or ZTNA requiring MFA. This is an automatic-denial condition at multiple carriers.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }
  return {
    status: "partial",
    userAnswerText: "Partial - MFA exists but remote access coverage is unclear.",
    recommendation:
      "Verify every remote access path (VPN, RDP, third-party support tools) requires MFA. Travelers' MFA supplement pushes this question further.",
    evidenceIds: ["evidence_mfa_enforcement_policy"],
  }
}

function resolveTravelersMfaBaseEmail(ctx) {
  const check = checkMfaEmail(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm MFA is required for remote access to email. Attach the identity provider policy showing email coverage.",
      ["evidence_mfa_enforcement_policy"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - MFA is required for remote access to email.",
      recommendation:
        "Attach the identity provider policy screenshot showing email access covered by the MFA enforcement.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - MFA is not required for remote access to email.",
    recommendation:
      "CRITICAL: Enforce MFA on email before submitting. Travelers' MFA supplement will also ask this question, and a 'No' answer there requires a written explanation.",
    evidenceIds: ["evidence_mfa_enforcement_policy"],
    notesForBroker:
      "A Travelers MFA supplement 'No' answer here requires a written explanation attached to the application.",
  }
}

function resolveTravelersMfaSuppWebEmail(ctx) {
  const base = resolveTravelersMfaBaseEmail(ctx)
  return {
    ...base,
    notesForBroker:
      (base.notesForBroker ? base.notesForBroker + " " : "") +
      "MFA Supplement CYB-14306: a 'No' or 'Partial' answer requires a written explanation attached to the application.",
  }
}
function resolveTravelersMfaSuppRemote(ctx) {
  const base = resolveTravelersMfaBaseRemote(ctx)
  return {
    ...base,
    notesForBroker:
      (base.notesForBroker ? base.notesForBroker + " " : "") +
      "MFA Supplement CYB-14306: a 'No' or 'Partial' answer requires a written explanation attached to the application. Scope explicitly includes third-party vendor remote access.",
  }
}
function resolveTravelersMfaSuppDirectory(ctx) {
  const base = resolveTravelersMfaBasePriv(ctx)
  return {
    ...base,
    userAnswerText: base.status === "pass"
      ? "Yes - MFA is required for administrative access to directory services."
      : base.userAnswerText,
    notesForBroker:
      "MFA Supplement CYB-14306: a 'No' or 'Partial' answer requires a written explanation. Directory services include Entra ID / Azure AD and on-prem Active Directory.",
  }
}
function resolveTravelersMfaSuppBackupEnv(ctx) {
  return notAssessed(
    "Travelers MFA Supplement CYB-14306 asks whether MFA is required for administrative access to your backup environment specifically. Confirm with your backup platform vendor and the IT lead. A 'No' answer requires a written explanation.",
    ["evidence_mfa_enforcement_policy"]
  )
}
function resolveTravelersMfaSuppNetInfra(ctx) {
  return notAssessed(
    "Travelers MFA Supplement CYB-14306 asks whether MFA is required for administrative access to firewalls, switches, routers, and wireless controllers. Confirm with the network team. A 'No' answer requires a written explanation.",
    ["evidence_mfa_enforcement_policy"]
  )
}
function resolveTravelersMfaSuppEndpointAdmin(ctx) {
  const base = resolveTravelersMfaBasePriv(ctx)
  return {
    ...base,
    notesForBroker:
      "MFA Supplement CYB-14306: a 'No' or 'Partial' answer requires a written explanation. Scope includes endpoint/server administration and any third-party vendor admin access.",
  }
}

function resolveTravelersVpnOnly(ctx) {
  const check = checkMfaRemote(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm that remote access to the internal network is limited to VPN only (no direct RDP or unproxied remote services).",
      ["evidence_mfa_enforcement_policy"]
    )
  }
  if (check.signals.vpnStrong && !check.signals.rdpDirect) {
    return {
      status: "pass",
      userAnswerText: "Yes - remote network access is limited to VPN only.",
      recommendation:
        "Attach the firewall configuration showing direct remote services closed at the perimeter.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }
  if (check.signals.rdpDirect) {
    return {
      status: "fail",
      userAnswerText: "No - direct RDP or port forwarding is in use for remote access.",
      recommendation:
        "CRITICAL: Close direct RDP exposure and route all remote access through a VPN or ZTNA.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }
  return {
    status: "partial",
    userAnswerText: "Partial - VPN is used but other remote access methods may also exist.",
    recommendation:
      "Audit the firewall to confirm no remote services bypass the VPN. Document the architecture.",
    evidenceIds: ["evidence_mfa_enforcement_policy"],
  }
}

function resolveTravelersPasswordComplexity(ctx) {
  const q = ctx.findBySlug("password-policy") || ctx.findBySlug("password-management")
  if (!q) {
    return notAssessed(
      "Confirm that password complexity requirements are enforced (length, character set, no reuse of breached passwords). Attach the identity provider policy screenshot.",
      []
    )
  }
  return {
    status: "pass",
    userAnswerText: "Yes - password complexity requirements are enforced across accounts.",
    recommendation:
      "Attach the password policy screenshot from the identity provider. Align with NIST SP 800-63B guidance if possible.",
    evidenceIds: [],
  }
}

function resolveTravelersDeprovisioning(ctx) {
  const q = ctx.findBySlug("employee-offboarding") || ctx.findBySlug("workforce-offboarding")
  if (!q) {
    return notAssessed(
      "Confirm that user access rights are terminated as part of the formal employee exit process. Attach the offboarding SOP.",
      []
    )
  }
  const answer = ctx.answers[q.key]
  if (typeof answer === "string" && (answer.toLowerCase().includes("same day") || answer.toLowerCase().includes("within 1 hour") || answer.toLowerCase().includes("within 24"))) {
    return {
      status: "pass",
      userAnswerText: "Yes - access is terminated promptly as part of the offboarding process.",
      recommendation: "Attach the offboarding checklist or HR-to-IT handoff procedure.",
      evidenceIds: [],
    }
  }
  return {
    status: "partial",
    userAnswerText: "Partial - offboarding is informal or inconsistent.",
    recommendation:
      "Formalize a written offboarding procedure with a defined SLA (same-day or within 24 hours).",
    evidenceIds: [],
  }
}

function resolveTravelersRbac(ctx) {
  return notAssessed(
    "Confirm that access to sensitive data and systems is restricted based on job function (role-based access control). Provide a role-to-permission matrix and documentation of how new access is granted and reviewed.",
    []
  )
}

function resolveTravelersVendorPolicies(ctx) {
  const check = checkVendorGovernance(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether written policies specify the security controls required of third-party service providers.",
      ["evidence_vendor_inventory", "evidence_vendor_due_diligence"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - written vendor management policies specify required security controls.",
      recommendation: "Attach the vendor management policy document.",
      evidenceIds: ["evidence_vendor_inventory", "evidence_vendor_due_diligence"],
    }
  }
  return {
    status: check.state,
    userAnswerText:
      check.state === "partial"
        ? "Partial - some vendor policies exist but coverage is incomplete."
        : "No - written vendor policies are not in place.",
    recommendation:
      "Document vendor security requirements in a written policy before submitting. Include required controls, breach notification, and audit rights.",
    evidenceIds: ["evidence_vendor_inventory", "evidence_vendor_due_diligence"],
  }
}
function resolveTravelersVendorReview(ctx) {
  return notAssessed(
    "Confirm whether vendor access rights are reviewed and updated periodically. Attach the most recent review record (reviewer, date, changes made).",
    ["evidence_vendor_inventory"]
  )
}
function resolveTravelersVendorRevocation(ctx) {
  return notAssessed(
    "Confirm whether vendor access is promptly revoked when a relationship ends. Attach the offboarding procedure for vendors plus a recent log entry showing access revocation.",
    ["evidence_vendor_inventory"]
  )
}
function resolveTravelersVendorInsurance(ctx) {
  return notAssessed(
    "Confirm whether vendor contracts require the vendor to maintain cyber insurance. Attach sample clauses and COIs for critical vendors.",
    []
  )
}
function resolveTravelersVendorIndemnity(ctx) {
  return notAssessed(
    "Confirm whether vendor contracts include indemnification or hold-harmless provisions. Attach sample clauses.",
    []
  )
}

function resolveTravelersIrPlans(ctx) {
  const check = checkIrPlan(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Travelers asks for BOTH a disaster recovery / business continuity plan AND a separate incident response plan. Confirm whether each exists and attach the documents.",
      ["evidence_ir_plan_document"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText:
        "Yes - written DR/BCP and incident response plans exist.",
      recommendation:
        "Attach both documents (dated and versioned) plus any tabletop exercise records.",
      evidenceIds: ["evidence_ir_plan_document"],
    }
  }
  return {
    ...check,
    status: check.state,
    userAnswerText:
      check.state === "partial"
        ? "Partial - an IR plan exists but a separate DR/BCP may not be documented."
        : "No - neither a DR/BCP nor an IR plan is currently documented.",
    recommendation:
      "Travelers expects both documents. The Data Hygienics IR Plan Builder generates the IR side; DR/BCP requires a separate effort covering recovery-time objectives and alternate-site arrangements.",
    evidenceIds: ["evidence_ir_plan_document"],
  }
}
function resolveTravelersIrTesting(ctx) {
  return notAssessed(
    "Travelers asks whether plans are tested regularly and critical deficiencies remediated, and asks for the expected restoration-time range for critical operations. Attach the most recent tabletop or DR test after-action report and the documented RTO for critical systems.",
    ["evidence_ir_tabletop_exercise"]
  )
}

function resolveTravelersEncryption(ctx) {
  const check = checkEncryptionAtRest(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Travelers asks about encryption across five dimensions: at rest, in transit, on mobile devices, on employee-owned devices, and when stored by third-party providers. Confirm each dimension individually.",
      ["evidence_device_encryption_enforcement"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText:
        "At rest, in transit - encryption is enforced on workstations and for transit traffic. Mobile, BYOD, and third-party states require separate confirmation.",
      recommendation:
        "Attach the device encryption policy and compliance export. For the mobile/BYOD/third-party dimensions, confirm with your MDM and vendor trust pages before submitting.",
      evidenceIds: ["evidence_device_encryption_enforcement"],
      notesForBroker:
        "Travelers' encryption question is a multi-select across five dimensions. This resolver confirms at-rest and in-transit; the other three dimensions need user input.",
    }
  }
  return {
    ...check,
    status: check.state,
    userAnswerText: "Partial - encryption exists but is not enforced across every dimension Travelers asks about.",
    recommendation:
      "Enforce device encryption via MDM, confirm TLS for all external communications, and verify BYOD and third-party encryption posture before submitting.",
    evidenceIds: ["evidence_device_encryption_enforcement"],
  }
}

function resolveTravelersSeTraining(ctx) {
  const check = checkPhishingTraining(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether anti-fraud and social engineering training is provided to finance and AP staff who authorize payments.",
      ["evidence_training_completion_roster"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - security awareness training includes social engineering content.",
      recommendation:
        "Confirm the training curriculum explicitly covers BEC and wire fraud. Attach completion records for finance staff.",
      evidenceIds: ["evidence_training_completion_roster"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - targeted anti-fraud training is not currently delivered.",
    recommendation:
      "Add a BEC/wire fraud module to your security awareness program before submitting. KnowBe4 and Curricula have dedicated curricula.",
    evidenceIds: ["evidence_training_completion_roster"],
  }
}
function resolveTravelersSeDualAuth(ctx) {
  return notAssessed(
    "Confirm whether payments and wire transfers above a defined threshold require dual authorization. Document the threshold and workflow.",
    []
  )
}
function resolveTravelersSeInvoice(ctx) {
  return notAssessed(
    "Confirm whether vendor invoices are validated before payment, with receipt verification and call-back confirmation of any vendor-account-change requests.",
    []
  )
}
function resolveTravelersSeBankAuth(ctx) {
  return notAssessed(
    "Confirm whether new vendor bank accounts are authenticated through a direct call to the recipient bank before being added to your accounts payable system.",
    []
  )
}

// ============================================================================
// Beazley resolvers (Phase 2)
// ============================================================================

function resolveBeazleyMfaRemote(ctx) {
  const check = checkMfaRemote(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether MFA is required for all remote access to your network, including VPN. If remote access is not permitted at all, note that as the answer.",
      ["evidence_mfa_enforcement_policy"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - MFA is required for all remote network access including VPN.",
      recommendation:
        "Attach the VPN configuration showing MFA enforced and the firewall rules showing no direct remote services.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }
  if (check.signals.rdpDirect) {
    return {
      status: "fail",
      userAnswerText:
        "No - remote access currently includes direct RDP or port forwarding without MFA.",
      recommendation:
        "CRITICAL: Close exposed RDP before submitting. Beazley is explicit that remote access without MFA is an eligibility concern.",
      evidenceIds: ["evidence_mfa_enforcement_policy"],
    }
  }
  return {
    status: "partial",
    userAnswerText: "Partial - remote access exists but MFA coverage is not confirmed.",
    recommendation:
      "Verify every remote access path requires MFA before submitting.",
    evidenceIds: ["evidence_mfa_enforcement_policy"],
  }
}
function resolveBeazleyMfaWebmail(ctx) {
  const base = resolveTravelersMfaBaseEmail(ctx)
  // Beazley's wording is the same structural question as Travelers' base
  // email MFA, so reuse the answer shape. Replace the broker note since
  // Beazley does not require written explanations.
  return { ...base, notesForBroker: undefined }
}

function resolveBeazleyInboundEmail(ctx) {
  const q = ctx.findBySlug("email-filtering") || ctx.findBySlug("email-security")
  if (!q) {
    return notAssessed(
      "Confirm which inbound email controls are in place: malicious attachment scanning, malicious link scanning, and/or external email tagging.",
      ["evidence_email_security_config"]
    )
  }
  const answer = ctx.answers[q.key]
  if (typeof answer === "string" && (answer.toLowerCase().includes("advanced") || answer.toLowerCase().includes("mature") || answer.toLowerCase().includes("optimized"))) {
    return {
      status: "pass",
      userAnswerText:
        "Scanning for malicious attachments, scanning for malicious links, and tagging of external emails - all three inbound email controls are in place.",
      recommendation:
        "Attach screenshots of each policy from Microsoft Defender or Google Workspace safety settings.",
      evidenceIds: ["evidence_email_security_config"],
    }
  }
  if (typeof answer === "string" && answer.toLowerCase().includes("defined")) {
    return {
      status: "partial",
      userAnswerText: "Partial - some inbound email controls exist but not all three.",
      recommendation:
        "Enable all three controls (attachment scanning, link scanning, external tagging) before submitting.",
      evidenceIds: ["evidence_email_security_config"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - inbound email controls are minimal or absent.",
    recommendation:
      "Enable attachment scanning, link protection, and external sender tagging in your email platform before submitting.",
    evidenceIds: ["evidence_email_security_config"],
  }
}
function resolveBeazleyEmailScanning(ctx) {
  const underlying = resolveBeazleyInboundEmail(ctx)
  return {
    ...underlying,
    userAnswerText: underlying.status === "pass"
      ? "Yes - incoming email is scanned for malicious attachments and links."
      : underlying.userAnswerText,
  }
}
function resolveBeazleyAdvancedEmail(ctx) {
  return notAssessed(
    "Confirm whether advanced email threat hunting (such as Microsoft 365 Defender or equivalent) is in place for phishing and BEC defense. If yes, name the product and attach a configuration screenshot.",
    ["evidence_email_security_config"]
  )
}
function resolveBeazleyEmailLogging(ctx) {
  return notAssessed(
    "Confirm whether email audit logging and mailbox auditing are enabled at the tenant level. In Microsoft 365: Purview > Audit > Search. In Google Workspace: Admin console > Reports > Audit log.",
    ["evidence_centralized_log_retention"]
  )
}
function resolveBeazleyDmarc(ctx) {
  const q = ctx.findBySlug("email-authentication")
  if (!q) {
    return notAssessed(
      "Confirm whether DMARC, DKIM, and SPF records are configured on your email domain. Beazley is the only carrier of the four that asks this explicitly. Screenshot the TXT records from your DNS provider.",
      ["evidence_dmarc_dkim_spf_records"]
    )
  }
  const answer = ctx.answers[q.key]
  if (typeof answer === "string" && (answer.toLowerCase().includes("fully") || answer.toLowerCase().includes("quarantine") || answer.toLowerCase().includes("reject"))) {
    return {
      status: "pass",
      userAnswerText: "Yes - DMARC, DKIM, and SPF are configured on the email domain.",
      recommendation:
        "Attach screenshots of the DNS records for _dmarc, default._domainkey, and SPF. A DMARC policy of 'p=quarantine' or 'p=reject' is the answer Beazley underwriters want to see.",
      evidenceIds: ["evidence_dmarc_dkim_spf_records"],
    }
  }
  return {
    status: "partial",
    userAnswerText: "Partial - some email authentication records exist but enforcement level is unclear.",
    recommendation:
      "Verify the DMARC policy is 'p=quarantine' or 'p=reject', not 'p=none'. SPF and DKIM should be aligned with DMARC.",
    evidenceIds: ["evidence_dmarc_dkim_spf_records"],
  }
}

function resolveBeazleyTrainingFrequency(ctx) {
  const check = checkPhishingTraining(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Beazley asks specifically about training FREQUENCY: never, annual, or twice a year or more. Confirm the actual cadence and attach a training dashboard showing the last 12 months.",
      ["evidence_training_completion_roster"]
    )
  }
  const cadence = check.signals.cadence
  if (cadence === "monthly" || cadence === "quarterly") {
    return {
      status: "pass",
      userAnswerText: "Twice a year or more frequent - training is delivered at least every six months.",
      recommendation: "Attach the training platform dashboard showing cadence and completion rates.",
      evidenceIds: ["evidence_training_completion_roster"],
    }
  }
  if (cadence === "annual") {
    return {
      status: "pass",
      userAnswerText: "Annually - training is delivered at least once per year.",
      recommendation:
        "Attach the training platform dashboard. Beazley accepts annual but weighs more frequent training favorably.",
      evidenceIds: ["evidence_training_completion_roster"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "Never or not regularly - training is not delivered on a predictable cadence.",
    recommendation:
      "Deploy an annual-or-better training program before submitting. This is an automatic flag on the Beazley form.",
    evidenceIds: ["evidence_training_completion_roster"],
  }
}
function resolveBeazleyAntiFraud(ctx) {
  return notAssessed(
    "Confirm whether periodic anti-fraud training covers phishing and social engineering specific to wire fraud and business email compromise, delivered to finance and AP staff.",
    ["evidence_training_completion_roster"]
  )
}

function resolveBeazleyEdrPresence(ctx) {
  const check = checkEdrPresence(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether all company devices are protected by endpoint protection software.",
      ["evidence_edr_device_inventory"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - endpoint protection is deployed on all company devices.",
      recommendation: "Attach the EDR device inventory export.",
      evidenceIds: ["evidence_edr_device_inventory"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - endpoint protection is missing or inadequate.",
    recommendation: "Deploy EDR before submitting. This is a denial-risk gap.",
    evidenceIds: ["evidence_edr_device_inventory"],
  }
}
function resolveBeazleyEdrVendorId(ctx) {
  const check = checkEdrPresence(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Beazley asks for EPP/EDR/MDR vendor identification. Confirm the products in use (Microsoft Defender, CrowdStrike, SentinelOne, Sophos, Huntress, etc.) and attach console login screenshots.",
      ["evidence_edr_vendor_identification"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText:
        "Yes - EDR is deployed. The specific vendor name must be entered on the application form.",
      recommendation:
        "Add the product name (e.g. 'Microsoft Defender for Endpoint') to the application. If an MDR service monitors the EDR, include that provider too.",
      evidenceIds: ["evidence_edr_vendor_identification"],
      notesForBroker:
        "Beazley explicitly asks for vendor identification for higher-revenue applicants. Confirm with the IT lead before submission.",
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - no identifiable EDR product is deployed.",
    recommendation:
      "Deploy and identify an EDR product before submitting. Microsoft Defender for Endpoint is included with Microsoft 365 Business Premium.",
    evidenceIds: ["evidence_edr_vendor_identification"],
  }
}

function resolveBeazleyBackupsFrequency(ctx) {
  const check = checkBackupFrequencyAndSeparation(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm the backup frequency for business-critical data: none, at least monthly, or at least weekly (including daily).",
      ["evidence_backup_job_history"]
    )
  }
  if (check.state === "pass" || check.signals.meetsFrequency) {
    return {
      status: "pass",
      userAnswerText: "At least weekly (including daily) - backups run at least weekly.",
      recommendation: "Attach the backup job history showing the actual cadence.",
      evidenceIds: ["evidence_backup_job_history"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "Monthly or none - backup cadence is below weekly.",
    recommendation:
      "Raise cadence to weekly or better before submitting.",
    evidenceIds: ["evidence_backup_job_history"],
  }
}
function resolveBeazleyCloudBackupType(ctx) {
  return notAssessed(
    "Beazley asks specifically whether your cloud backup is a syncing service (like Dropbox or OneDrive) or a dedicated backup service (like Backblaze, Wasabi, or AWS S3 with Object Lock). Syncing services often replicate ransomware encryption; purpose-built backup services are the answer underwriters prefer.",
    ["evidence_backup_segregation_proof"]
  )
}
function resolveBeazleyBackupAttributes(ctx) {
  const check = checkBackupTesting(ctx)
  const freq = checkBackupFrequencyAndSeparation(ctx)
  if (check.state === "not_assessed" && freq.state === "not_assessed") {
    return notAssessed(
      "Beazley Digital App asks whether backups are (1) offline or in a dedicated cloud backup service, (2) encrypted, and (3) tested within the last six months. Confirm all three.",
      ["evidence_backup_segregation_proof", "evidence_backup_restore_test"]
    )
  }
  if (check.state === "pass" && freq.signals.isSeparated) {
    return {
      status: "pass",
      userAnswerText:
        "Yes - backups are offline or in a purpose-designed backup service, encrypted, and tested recently.",
      recommendation:
        "Attach the segregation/immutability configuration, encryption attestation, and the most recent restore test report (within the last 6 months).",
      evidenceIds: ["evidence_backup_segregation_proof", "evidence_backup_restore_test"],
    }
  }
  return {
    status: "partial",
    userAnswerText:
      "Partial - at least one of the three backup attributes (separation, encryption, recent testing) is unclear.",
    recommendation:
      "Close the missing attribute before submitting. The 6-month restore test requirement is explicit in Beazley's Digital App form.",
    evidenceIds: ["evidence_backup_segregation_proof", "evidence_backup_restore_test"],
  }
}

function resolveBeazleyPatchInternet(ctx) {
  const check = checkPatchingWindow(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether critical patches are actively managed on internet-facing systems.",
      ["evidence_patch_compliance_report"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - critical patches are actively managed on internet-facing systems.",
      recommendation:
        "Attach a patch compliance report filtered to internet-facing systems.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - critical patching on internet-facing systems is not actively managed.",
    recommendation:
      "Establish active patch management on internet-facing systems before submitting.",
    evidenceIds: ["evidence_patch_compliance_report"],
  }
}
function resolveBeazleyPatchTwoMonth(ctx) {
  const check = checkPatchingWindow(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Beazley Digital App asks whether critical patches are implemented within a two-month window after release. Confirm the SLA and attach the compliance report.",
      ["evidence_patch_compliance_report"]
    )
  }
  if (["7_days", "30_days"].includes(check.signals.window)) {
    return {
      status: "pass",
      userAnswerText: "Yes - critical patches are implemented within two months of release (actually within 30 days or faster).",
      recommendation: "Attach the patch compliance report.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  if (check.signals.window === "90_days") {
    return {
      status: "fail",
      userAnswerText: "No - quarterly patching exceeds Beazley's 2-month window.",
      recommendation: "Tighten SLA to 60 days or better before submitting.",
      evidenceIds: ["evidence_patch_compliance_report"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - no consistent patching SLA exists.",
    recommendation:
      "Establish a documented 60-day-or-better SLA for critical patches before submitting.",
    evidenceIds: ["evidence_patch_compliance_report"],
  }
}

function resolveBeazleyIrPlan(ctx) {
  const check = checkIrPlan(ctx)
  if (check.state === "not_assessed") {
    return notAssessed(
      "Confirm whether you have an incident response plan for network intrusions and malware incidents. Attach the dated plan document.",
      ["evidence_ir_plan_document"]
    )
  }
  if (check.state === "pass") {
    return {
      status: "pass",
      userAnswerText: "Yes - an IR plan covering network intrusions and malware is in place.",
      recommendation: "Attach the IR plan PDF with version and date.",
      evidenceIds: ["evidence_ir_plan_document"],
    }
  }
  if (check.state === "partial") {
    return {
      status: "partial",
      userAnswerText: "Partial - a plan exists but may not specifically cover network intrusions and malware scenarios.",
      recommendation:
        "Expand the plan to include malware and network intrusion scenarios. Data Hygienics' IR Plan Builder generates these scenarios by default.",
      evidenceIds: ["evidence_ir_plan_document"],
    }
  }
  return {
    status: "fail",
    userAnswerText: "No - no IR plan is currently documented.",
    recommendation:
      "Build an IR plan before submitting. The Data Hygienics IR Plan Builder at /tools/ir-plan creates a minimum-viable plan.",
    evidenceIds: ["evidence_ir_plan_document"],
  }
}

function resolveBeazleyEolSegregation(ctx) {
  return notAssessed(
    "Confirm whether any end-of-life or unsupported software is in production use. If yes, confirm it is segregated from the rest of the network with firewall rules enforcing the isolation.",
    ["evidence_network_diagram"]
  )
}
function resolveBeazleyIpAllowlist(ctx) {
  return notAssessed(
    "Confirm whether approved IP address ranges are allowlisted for externally exposed services (email, VPN, remote access) with all other source addresses blocked. Attach the firewall rule configuration.",
    ["evidence_firewall_config_logs"]
  )
}

function resolveBeazleyVendorOobChange(ctx) {
  return notAssessed(
    "Confirm whether vendor or supplier banking-detail change requests are verified through a secondary channel (call back to a pre-verified phone number). Document the procedure.",
    []
  )
}
function resolveBeazleyVendorIndemnity(ctx) {
  return notAssessed(
    "Confirm whether third parties receiving PII or confidential data from you are contractually required to indemnify you for release caused by their fault or negligence. Attach sample contract clauses.",
    ["evidence_vendor_due_diligence"]
  )
}
function resolveBeazleyVendorSupervisor(ctx) {
  return notAssessed(
    "Confirm whether changes to vendor records in your accounts payable system require supervisor review before processing. Document the workflow.",
    []
  )
}
function resolveBeazleyWireVerification(ctx) {
  return notAssessed(
    "Confirm the methods you use to verify wire transfer requests before execution: call a pre-verified number, text a pre-verified number, use a client code, or other. Document the procedure.",
    []
  )
}

// ----------------------------------------------------------------------------
// Dispatch table - keyed by carrier question ID.
// ----------------------------------------------------------------------------

/** @type {Record<string, (ctx: import('./schema.js').ResolverContext) => Object>} */
export const COALITION_MAPPINGS = {
  coalition_mfa_1: resolveCoalitionMfaEmail,
  coalition_mfa_2: resolveCoalitionMfaRemote,
  coalition_mfa_3: resolveCoalitionMfaPrivileged,
  coalition_backups_1: resolveCoalitionBackupsBase,
  coalition_encryption_1: resolveCoalitionEncryption,
  coalition_funds_transfer_1: resolveCoalitionFundsTransfer,
  coalition_edr_1: resolveCoalitionEdr,
  coalition_edr_2: resolveCoalitionMdr,
  coalition_backups_2: resolveCoalitionBackupsRansomware,
  coalition_segmentation_1: resolveCoalitionSegmentation,
  coalition_patching_1: resolveCoalitionPatching,
  coalition_msp_1: resolveCoalitionMsp,
}

/** @type {Record<string, (ctx: import('./schema.js').ResolverContext) => Object>} */
export const COWBELL_MAPPINGS = {
  cowbell_training_1: resolveCowbellTraining,
  cowbell_encryption_1: resolveCowbellEncryption("external communications"),
  cowbell_encryption_2: resolveCowbellEncryption("cloud storage services"),
  cowbell_backups_1: resolveCowbellBackupsFrequency,
  cowbell_backups_2: resolveCowbellBackupsAttributes,
  cowbell_backups_3: resolveCowbellFailoverTest,
  cowbell_patching_1: resolveCowbellPatching,
  cowbell_mfa_1: resolveCowbellMfaScope,
  cowbell_mfa_2: resolveCowbellMfaSubjectivity,
  cowbell_ir_1: resolveCowbellIrPlan,
  cowbell_segmentation_1: resolveCowbellSegmentation,
  cowbell_vendor_1: resolveCowbellVendor,
  cowbell_privileged_funds_1: resolveCowbellFundsAccess,
  cowbell_vendor_2: resolveCowbellVendorBank,
  cowbell_email_1: resolveCowbellFundsCallback,
}

/** @type {Record<string, (ctx: import('./schema.js').ResolverContext) => Object>} */
export const TRAVELERS_MAPPINGS = {
  travelers_edr_1: resolveTravelersEdr,
  travelers_logging_1: resolveTravelersLogging,
  travelers_logging_2: resolveTravelersVendorLogging,
  travelers_patching_1: resolveTravelersPatchProcess,
  travelers_patching_2: resolveTravelersPatchAutomation,
  travelers_patching_3: resolveTravelersPatch30,
  travelers_backups_1: resolveTravelersBackupsExistence,
  travelers_backups_2: resolveTravelersBackupAutomation,
  travelers_backups_3: resolveTravelersBackupTesting,
  travelers_mfa_base_1: resolveTravelersMfaBasePriv,
  travelers_mfa_base_2: resolveTravelersMfaBaseRemote,
  travelers_mfa_base_3: resolveTravelersMfaBaseEmail,
  travelers_mfa_supp_1: resolveTravelersMfaSuppWebEmail,
  travelers_mfa_supp_2: resolveTravelersMfaSuppRemote,
  travelers_mfa_supp_3: resolveTravelersMfaSuppDirectory,
  travelers_mfa_supp_4: resolveTravelersMfaSuppBackupEnv,
  travelers_mfa_supp_5: resolveTravelersMfaSuppNetInfra,
  travelers_mfa_supp_6: resolveTravelersMfaSuppEndpointAdmin,
  travelers_privileged_1: resolveTravelersVpnOnly,
  travelers_privileged_2: resolveTravelersPasswordComplexity,
  travelers_privileged_3: resolveTravelersDeprovisioning,
  travelers_privileged_4: resolveTravelersRbac,
  travelers_vendor_1: resolveTravelersVendorPolicies,
  travelers_vendor_2: resolveTravelersVendorReview,
  travelers_vendor_3: resolveTravelersVendorRevocation,
  travelers_vendor_4: resolveTravelersVendorInsurance,
  travelers_vendor_5: resolveTravelersVendorIndemnity,
  travelers_ir_1: resolveTravelersIrPlans,
  travelers_ir_2: resolveTravelersIrTesting,
  travelers_encryption_1: resolveTravelersEncryption,
  travelers_se_1: resolveTravelersSeTraining,
  travelers_se_2: resolveTravelersSeDualAuth,
  travelers_se_3: resolveTravelersSeInvoice,
  travelers_se_4: resolveTravelersSeBankAuth,
}

/** @type {Record<string, (ctx: import('./schema.js').ResolverContext) => Object>} */
export const BEAZLEY_MAPPINGS = {
  beazley_mfa_1: resolveBeazleyMfaRemote,
  beazley_mfa_2: resolveBeazleyMfaWebmail,
  beazley_email_1: resolveBeazleyInboundEmail,
  beazley_email_2: resolveBeazleyEmailScanning,
  beazley_email_3: resolveBeazleyAdvancedEmail,
  beazley_email_4: resolveBeazleyEmailLogging,
  beazley_email_5: resolveBeazleyDmarc,
  beazley_training_1: resolveBeazleyTrainingFrequency,
  beazley_training_2: resolveBeazleyAntiFraud,
  beazley_edr_1: resolveBeazleyEdrPresence,
  beazley_edr_2: resolveBeazleyEdrVendorId,
  beazley_backups_1: resolveBeazleyBackupsFrequency,
  beazley_backups_2: resolveBeazleyCloudBackupType,
  beazley_backups_3: resolveBeazleyBackupAttributes,
  beazley_patching_1: resolveBeazleyPatchInternet,
  beazley_patching_2: resolveBeazleyPatchTwoMonth,
  beazley_ir_1: resolveBeazleyIrPlan,
  beazley_network_1: resolveBeazleyEolSegregation,
  beazley_network_2: resolveBeazleyIpAllowlist,
  beazley_vendor_1: resolveBeazleyVendorOobChange,
  beazley_vendor_2: resolveBeazleyVendorIndemnity,
  beazley_vendor_3: resolveBeazleyVendorSupervisor,
  beazley_email_wire_1: resolveBeazleyWireVerification,
}

/**
 * Top-level carrier-mapping registry. The engine dispatches through this
 * table, so adding a new carrier is a matter of populating its dedicated
 * per-question map above and adding one entry here.
 */
export const CARRIER_MAPPINGS = {
  coalition: COALITION_MAPPINGS,
  cowbell: COWBELL_MAPPINGS,
  travelers: TRAVELERS_MAPPINGS,
  beazley: BEAZLEY_MAPPINGS,
}
