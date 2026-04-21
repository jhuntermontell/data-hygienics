// ============================================================================
// Coalition - carrier profile and application question catalog
// ============================================================================
//
// Source forms (paraphrased from publicly posted PDFs; every questionText
// in this file is REPHRASED in our own words from the source material to
// avoid copyright issues):
//
//   - Coalition Cyber Policy Application, form code CYUSP-00NA-1022-01.
//     Base application with encryption, backup, MFA, and funds-transfer
//     verification questions.
//   - Coalition Ransomware Supplemental Questionnaire, version 202404.
//     Adds EDR, segmentation, patch timeframe, MSP identification, and
//     backup disconnection questions.
//
// Denial risk levels are assigned per the viability research:
//
//   - critical: failing this control is a top-3 reason SMBs get denied or
//     see ransomware sublimits imposed. MFA on email + remote, EDR, and
//     offline/separate backups.
//   - high: failing hurts but does not automatically deny. Privileged MFA,
//     network segmentation, patching SLA, backup testing.
//   - medium: failing is flaggable but rarely blocks binding on its own.
//     Funds-transfer verification, encryption attestation.
//   - low: not used for Coalition's published questions at this scope.
//
// Last verified: 2026-04-11. This is the date we last cross-checked the
// published form content against the Coalition broker help center. If the
// Coalition application materially changes, bump this date and re-verify.
// ============================================================================

/** @type {import('./schema.js').CarrierProfile} */
export const COALITION_PROFILE = {
  id: "coalition",
  name: "Coalition",
  formName: "Coalition Cyber Policy Application + Ransomware Supplemental",
  formVersion: "CYUSP-00NA-1022-01 + Ransomware Supplemental 202404",
  lastVerified: "2026-04-11",
  accentColor: "#0F766E",
  sourceCitations: [
    "https://help.coalitioninc.com/hc/en-us/articles/25683628876053",
    "https://www.coalitioninc.com/en-us/broker",
  ],
}

/** @type {import('./schema.js').CarrierQuestion[]} */
export const COALITION_QUESTIONS = [
  // ──────────────────────────────────────────────
  // MFA - Base application (CYUSP-00NA-1022-01)
  // ──────────────────────────────────────────────
  {
    id: "coalition_mfa_1",
    carrierId: "coalition",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication enforced for all users when they access email, whether from the web, a mobile app, or a desktop client?",
    responseType: "yes_no_na",
    evidenceExpected:
      "Screenshot of the identity provider policy that enforces MFA on email access, plus an optional roster showing per-user MFA enrollment state.",
    denialRiskLevel: "critical",
    formSource: "Coalition Cyber Policy Application CYUSP-00NA-1022-01 (base application, MFA section)",
    notes:
      "This is one of the three most common reasons Coalition denies SMB applications or imposes ransomware sublimits. Availability is not enough - underwriters want enforcement. An N/A answer is only defensible if the organization truly has no email system, which is almost never the case.",
  },
  {
    id: "coalition_mfa_2",
    carrierId: "coalition",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication enforced on every form of remote access to your network, including VPN, RDP, Remote Desktop Gateway, and any other remote-entry path?",
    responseType: "yes_no_na",
    evidenceExpected:
      "Screenshot of the VPN or ZTNA configuration showing MFA required, and evidence that any RDP exposure is either blocked at the firewall or also gated by MFA.",
    denialRiskLevel: "critical",
    formSource: "Coalition Cyber Policy Application CYUSP-00NA-1022-01 (base application, MFA section)",
    notes:
      "Exposed RDP without MFA is the single most exploited SMB attack surface. Coalition has explicitly conditioned coverage on closing this gap when present.",
  },
  {
    id: "coalition_mfa_3",
    carrierId: "coalition",
    controlCategory: "privileged_access",
    questionText:
      "Is multi-factor authentication enforced on privileged administrator accounts for the network, cloud services, and any other administrative consoles?",
    responseType: "yes_no_na",
    evidenceExpected:
      "List of accounts with Global Admin, Domain Admin, or equivalent elevated roles plus a Conditional Access policy screenshot requiring MFA on those roles.",
    denialRiskLevel: "critical",
    formSource: "Coalition Cyber Policy Application CYUSP-00NA-1022-01 (base application, MFA section)",
    notes:
      "The Coalition form explicitly calls out 'admin accounts and all cloud services where supported' as the expected scope. Missing MFA on even a single privileged account is treated as a critical finding because that one account is usually enough to pivot through an environment.",
  },

  // ──────────────────────────────────────────────
  // Backups - Base application
  // ──────────────────────────────────────────────
  {
    id: "coalition_backups_1",
    carrierId: "coalition",
    controlCategory: "backups",
    questionText:
      "Are critical business data and systems backed up at least weekly, with backups stored offline or on a network segment separate from production?",
    responseType: "yes_no_na",
    evidenceExpected:
      "Backup job success history showing weekly-or-better cadence plus a screenshot or written description showing the backup storage is not reachable from the production network.",
    denialRiskLevel: "critical",
    formSource: "Coalition Cyber Policy Application CYUSP-00NA-1022-01 (base application, backups section)",
    notes:
      "Offline or separate-network storage is the key phrase. A backup that sits on the same file share as production offers no protection against ransomware. Coalition specifically calls out this separation in the form wording.",
  },

  // ──────────────────────────────────────────────
  // Encryption - Base application
  // ──────────────────────────────────────────────
  {
    id: "coalition_encryption_1",
    carrierId: "coalition",
    controlCategory: "encryption",
    questionText:
      "Is encryption applied to workstations, laptops, and portable storage media that hold sensitive business data?",
    responseType: "yes_no",
    evidenceExpected:
      "Screenshot of the MDM policy enforcing disk encryption (BitLocker on Windows, FileVault on Mac) plus a device compliance export showing every managed device in a compliant state.",
    denialRiskLevel: "medium",
    formSource: "Coalition Cyber Policy Application CYUSP-00NA-1022-01 (base application, encryption section)",
    notes:
      "Encryption is usually assumed 'yes' on modern laptops but carriers still ask because missing device encryption is a liability multiplier under state breach-notification laws. Enforcement via MDM is what converts this from an attestation into defensible evidence.",
  },

  // ──────────────────────────────────────────────
  // Funds transfer verification - Base application
  // ──────────────────────────────────────────────
  {
    id: "coalition_funds_transfer_1",
    carrierId: "coalition",
    controlCategory: "vendor_risk",
    questionText:
      "Do you use a secondary, out-of-band communication channel (such as a phone call to a pre-verified number) to verify the authenticity of funds transfer requests over a threshold amount, and to verify any requests to change vendor banking details?",
    responseType: "yes_no_na",
    evidenceExpected:
      "Written procedure describing the call-back process, the threshold amount that triggers verification, and any approval workflow for vendor bank-detail changes.",
    denialRiskLevel: "high",
    formSource: "Coalition Cyber Policy Application CYUSP-00NA-1022-01 (base application, funds transfer section)",
    notes:
      "Coalition added this question in response to the rise of business email compromise claims. The out-of-band verification is the single most effective control against wire fraud. A documented procedure is enough for the form; proof that the procedure is actually followed comes up in claims investigation.",
  },

  // ──────────────────────────────────────────────
  // EDR - Ransomware Supplemental 202404
  // ──────────────────────────────────────────────
  {
    id: "coalition_edr_1",
    carrierId: "coalition",
    controlCategory: "edr",
    questionText:
      "Do you deploy endpoint detection and response (EDR) software on your endpoints, and if so, which product do you use?",
    responseType: "conditional",
    evidenceExpected:
      "EDR vendor name (plain-text answer) plus an endpoint inventory export from the EDR console showing installation and health status across workstations, laptops, and servers.",
    denialRiskLevel: "critical",
    formSource: "Coalition Ransomware Supplemental Questionnaire 202404",
    notes:
      "Coalition explicitly asks for vendor identification, not just a yes/no. If you use Microsoft Defender for Endpoint, SentinelOne, CrowdStrike, or another named product, say so. 'Our antivirus' or 'the built-in Windows one' is not an acceptable answer for the ransomware supplemental.",
  },
  {
    id: "coalition_edr_2",
    carrierId: "coalition",
    controlCategory: "edr",
    questionText:
      "Do you use a managed detection and response (MDR) service, and if so, which provider?",
    responseType: "conditional",
    evidenceExpected:
      "MDR provider name plus a recent monthly service report (can be redacted for sensitive details).",
    denialRiskLevel: "high",
    formSource: "Coalition Ransomware Supplemental Questionnaire 202404",
    notes:
      "Not required for all tiers, but having an MDR can remove ransomware-related sublimits. If you have EDR but no MDR, answer honestly: 'EDR alerts are reviewed internally by [name/role]' is better than implying an MDR relationship that does not exist.",
  },

  // ──────────────────────────────────────────────
  // Backups (ransomware-specific) - Supplemental
  // ──────────────────────────────────────────────
  {
    id: "coalition_backups_2",
    carrierId: "coalition",
    controlCategory: "backups",
    questionText:
      "Are your backups regularly tested by performing restores, and are backup copies kept disconnected or inaccessible from the corporate network when not actively being written?",
    responseType: "yes_no",
    evidenceExpected:
      "A recent restore-test report (within the last 6 months is typical, within the last quarter is better) plus evidence of the disconnection or immutability architecture.",
    denialRiskLevel: "critical",
    formSource: "Coalition Ransomware Supplemental Questionnaire 202404",
    notes:
      "This is distinct from the base-application backup question. The ransomware supplemental pushes harder on TESTING and DISCONNECTION. A backup nobody has ever restored from is a backup you cannot count on; a backup that lives on the same network as production is a backup ransomware will encrypt alongside everything else.",
  },

  // ──────────────────────────────────────────────
  // Network segmentation - Supplemental
  // ──────────────────────────────────────────────
  {
    id: "coalition_segmentation_1",
    carrierId: "coalition",
    controlCategory: "network_segmentation",
    questionText:
      "Is your network segmented, and if so, at what depth? For example, are individual machines isolated, or are offices, business units, or subsidiaries separated from one another?",
    responseType: "multiple_choice",
    responseOptions: [
      "Segmented by individual machine",
      "Segmented by office location",
      "Segmented by business unit or subsidiary",
      "Not segmented",
    ],
    evidenceExpected:
      "Network diagram showing the segmentation boundaries plus firewall rules enforcing the separation.",
    denialRiskLevel: "high",
    formSource: "Coalition Ransomware Supplemental Questionnaire 202404",
    notes:
      "Underwriters use segmentation depth to estimate blast radius. A flat network means ransomware can spread to everything; segmentation by business unit limits the damage to one unit before containment.",
  },

  // ──────────────────────────────────────────────
  // Patching - Supplemental
  // ──────────────────────────────────────────────
  {
    id: "coalition_patching_1",
    carrierId: "coalition",
    controlCategory: "patching",
    questionText:
      "Do you have a process to patch or otherwise mitigate critical vulnerabilities, and what is your required patch timeframe for critical issues?",
    responseType: "multiple_choice",
    responseOptions: [
      "Within 7 days of disclosure",
      "Within 30 days of disclosure",
      "Within 60 days of disclosure",
      "More than 60 days or no defined timeframe",
    ],
    evidenceExpected:
      "Patch compliance report plus a written SLA from your IT provider or MSP describing the required window for critical patches.",
    denialRiskLevel: "high",
    formSource: "Coalition Ransomware Supplemental Questionnaire 202404",
    notes:
      "30 days is the baseline Coalition expects. 7 days is preferred for internet-facing systems. More than 60 days is treated as no SLA at all.",
  },

  // ──────────────────────────────────────────────
  // Vendor / MSP identification - Supplemental
  // ──────────────────────────────────────────────
  {
    id: "coalition_msp_1",
    carrierId: "coalition",
    controlCategory: "vendor_risk",
    questionText:
      "Do you use a managed service provider (MSP) to administer any part of your IT environment, and if so, what is the MSP's name?",
    responseType: "conditional",
    evidenceExpected:
      "MSP company name, the scope of what they manage (email, endpoints, backups, network), and any service-level or security contract terms if available.",
    denialRiskLevel: "medium",
    formSource: "Coalition Ransomware Supplemental Questionnaire 202404",
    notes:
      "MSP identification lets Coalition cross-reference against their internal risk tables - some MSPs are associated with higher or lower claim frequencies. This is not a denial-risk question on its own, but answering accurately matters because a misstatement discovered during claims can become grounds for rescission.",
  },
]

/**
 * Lookup helper for engine code. Returns null for unknown IDs.
 *
 * @param {string} questionId
 * @returns {import('./schema.js').CarrierQuestion | null}
 */
export function getCoalitionQuestion(questionId) {
  return COALITION_QUESTIONS.find((q) => q.id === questionId) || null
}
