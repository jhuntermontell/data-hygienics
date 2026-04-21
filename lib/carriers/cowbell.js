// ============================================================================
// Cowbell - carrier profile and application question catalog
// ============================================================================
//
// Source forms (paraphrased from publicly posted PDFs; every questionText
// in this file is REPHRASED in our own words from the source material to
// avoid copyright issues):
//
//   - Cowbell Cyber Risk Insurance Application, Prime 250 form code
//     PRIME 250 003 07 20. Asks about security training, encryption,
//     backup cadence and attributes, patching cadence, MFA scope, IR
//     plan testing status, DMZ/segregation, vendor security contract
//     terms, funds-transfer controls, and vendor bank-account verification.
//   - Cowbell Prime 100 Pro quote subjectivities. Publicly posted quote
//     proposals show MFA as a gating condition for removing a ransomware
//     sublimit endorsement across email, remote access, admin/privileged
//     accounts, and cloud services.
//
// Denial risk levels assigned per the Phase 2 brief:
//   - critical: MFA scope (backbone of Cowbell's risk signaling), backup
//     separation (encrypted/tested/offline attributes checked explicitly)
//   - high: IR plan tested and in-effect, patching cadence, vendor
//     contract requirements
//   - medium: security training, encryption attestation, DMZ/segregation,
//     funds-transfer call-back, vendor bank verification
//
// Last verified: 2026-04-11. This is the date we last cross-checked the
// published form content against Cowbell's public application catalog.
// ============================================================================

/** @type {import('./schema.js').CarrierProfile} */
export const COWBELL_PROFILE = {
  id: "cowbell",
  name: "Cowbell",
  formName: "Cowbell Prime 250 Application",
  formVersion: "PRIME 250 003 07 20",
  lastVerified: "2026-04-11",
  accentColor: "#0F766E",
  sourceCitations: [
    "https://cowbell.insure/",
    "https://cowbell.insure/partners/brokers/",
  ],
}

/** @type {import('./schema.js').CarrierQuestion[]} */
export const COWBELL_QUESTIONS = [
  // ──────────────────────────────────────────────
  // Security awareness training
  // ──────────────────────────────────────────────
  {
    id: "cowbell_training_1",
    carrierId: "cowbell",
    controlCategory: "security_awareness",
    questionText:
      "Do you require every employee to complete mandatory cybersecurity training at least once per year?",
    responseType: "yes_no",
    evidenceExpected:
      "Training completion roster showing total headcount vs. completed count, ideally with per-employee completion dates from a learning management system.",
    denialRiskLevel: "medium",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), security program section",
    notes:
      "Cowbell's Prime 250 form asks a plain yes/no here, but underwriters commonly expect at least annual training with measurable completion. A signed HR attestation can substitute if a formal LMS report is unavailable.",
  },

  // ──────────────────────────────────────────────
  // Encryption
  // ──────────────────────────────────────────────
  {
    id: "cowbell_encryption_1",
    carrierId: "cowbell",
    controlCategory: "encryption",
    questionText:
      "Is sensitive information encrypted when transmitted externally (email, file transfers, customer-facing portals)?",
    responseType: "yes_no",
    evidenceExpected:
      "Written description of the transport encryption posture (TLS 1.2 or higher on all external services, email encryption for sensitive messages) plus a screenshot or configuration export from the tool(s) enforcing it.",
    denialRiskLevel: "medium",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), data protection section",
  },
  {
    id: "cowbell_encryption_2",
    carrierId: "cowbell",
    controlCategory: "encryption",
    questionText:
      "Is sensitive information stored in cloud services encrypted at rest?",
    responseType: "yes_no",
    evidenceExpected:
      "List of cloud services in use with encryption-at-rest status for each (most major SaaS platforms encrypt by default; confirm via the provider's trust documentation).",
    denialRiskLevel: "medium",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), data protection section",
  },

  // ──────────────────────────────────────────────
  // Backups
  // ──────────────────────────────────────────────
  {
    id: "cowbell_backups_1",
    carrierId: "cowbell",
    controlCategory: "backups",
    questionText:
      "How often are business-critical data and systems backed up? Select one: weekly, monthly, quarterly, every six months, or never.",
    responseType: "multiple_choice",
    responseOptions: [
      "Weekly or more frequent",
      "Monthly",
      "Quarterly",
      "Every six months",
      "Never",
    ],
    evidenceExpected:
      "Backup job history from the backup platform showing the last 30 to 90 days of runs, with success and failure counts.",
    denialRiskLevel: "critical",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), data recovery section",
    notes:
      "Cowbell's published form buckets cadence into five specific options. Anything worse than weekly is treated as a gap by underwriters.",
  },
  {
    id: "cowbell_backups_2",
    carrierId: "cowbell",
    controlCategory: "backups",
    questionText:
      "Which of the following backup attributes are in place? Select all that apply: encrypted, tested, stored on a separate network or offline, stored in a dedicated cloud backup service.",
    responseType: "multi_select",
    responseOptions: [
      "Encrypted",
      "Tested",
      "Separate network or offline",
      "Dedicated cloud backup service",
    ],
    evidenceExpected:
      "Per-attribute proof: encryption configuration screenshot, most recent restore-test report, network diagram showing segregation, and cloud backup provider trust page.",
    denialRiskLevel: "critical",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), data recovery section",
    notes:
      "Cowbell uses a checkbox list. Underwriters compare the checked boxes against the backup-frequency answer and flag inconsistencies. Offline or dedicated-service separation is the attribute most weighted for ransomware resilience.",
  },
  {
    id: "cowbell_backups_3",
    carrierId: "cowbell",
    controlCategory: "backups",
    questionText:
      "Have you performed a full failover test of your most critical servers within the past year?",
    responseType: "yes_no",
    evidenceExpected:
      "Disaster recovery test report or ticketing record showing the date, systems involved, outcome, and recovery time observed.",
    denialRiskLevel: "high",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), disaster recovery endorsement context",
    notes:
      "A full failover test is distinct from a file-level restore test. Cowbell asks specifically about critical servers because carriers have seen many claims where file restores succeeded but full-stack failover revealed configuration gaps during a live incident.",
  },

  // ──────────────────────────────────────────────
  // Patching
  // ──────────────────────────────────────────────
  {
    id: "cowbell_patching_1",
    carrierId: "cowbell",
    controlCategory: "patching",
    questionText:
      "How frequently do you apply security patches to critical IT systems and applications? Weekly, monthly, quarterly, every six months, or never.",
    responseType: "multiple_choice",
    responseOptions: ["Weekly", "Monthly", "Quarterly", "Every six months", "Never"],
    evidenceExpected:
      "Patch compliance report from Intune, WSUS, or your RMM tool showing deployment cadence against an internal SLA.",
    denialRiskLevel: "high",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), security operations section",
  },

  // ──────────────────────────────────────────────
  // MFA scope
  // ──────────────────────────────────────────────
  {
    id: "cowbell_mfa_1",
    carrierId: "cowbell",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication enforced for employees, contractors, and partners across email, cloud deployments, mission-critical systems, and remote access?",
    responseType: "multi_select",
    responseOptions: [
      "Email",
      "Cloud deployments",
      "Mission-critical systems",
      "Remote access",
      "Other",
    ],
    evidenceExpected:
      "Identity provider policy screenshot showing MFA enforcement scope plus an enrollment roster showing per-user coverage.",
    denialRiskLevel: "critical",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), access management section",
    notes:
      "Cowbell uses a select-all-that-apply scope question. Missing email or remote access coverage is treated as a gap by underwriters even if other boxes are checked.",
  },
  {
    id: "cowbell_mfa_2",
    carrierId: "cowbell",
    controlCategory: "mfa",
    questionText:
      "Subjectivity to bind: confirm MFA is fully implemented across email, remote computer system access, admin and privileged accounts, and cloud services, with documented enforcement.",
    responseType: "yes_no",
    evidenceExpected:
      "Same evidence as the MFA scope question plus a dated attestation from the IT lead that every in-scope account is covered.",
    denialRiskLevel: "critical",
    formSource: "Cowbell Prime 100 Pro quote subjectivities (publicly posted)",
    notes:
      "This is not a question on the base Prime 250 application. It is an underwriting subjectivity that appears on some Cowbell quotes as a condition for removing a ransomware sublimit endorsement. Included here because the subjectivity effectively functions as a supplemental MFA question for binding purposes.",
  },

  // ──────────────────────────────────────────────
  // Incident response
  // ──────────────────────────────────────────────
  {
    id: "cowbell_ir_1",
    carrierId: "cowbell",
    controlCategory: "incident_response",
    questionText:
      "Do you have an incident response plan that is currently in effect and has been tested, with defined actions and responsibilities for a cyber incident or data breach?",
    responseType: "yes_no",
    evidenceExpected:
      "Written incident response plan PDF (dated, versioned, with roles and escalation paths) plus a tabletop exercise after-action report or change-record showing the plan has been tested.",
    denialRiskLevel: "high",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), incident response section",
    notes:
      "Cowbell's wording is specific: the plan must be 'tested and in-effect.' Underwriters treat an untested plan the same as no plan. A Data Hygienics Incident Response Planner run satisfies the written-plan half; a tabletop exercise satisfies the testing half.",
  },

  // ──────────────────────────────────────────────
  // Network segmentation
  // ──────────────────────────────────────────────
  {
    id: "cowbell_segmentation_1",
    carrierId: "cowbell",
    controlCategory: "network_segmentation",
    questionText:
      "Are internet-accessible systems (such as web servers and email servers) separated from your trusted internal network, for example through a DMZ or by hosting them at a third-party provider?",
    responseType: "yes_no",
    evidenceExpected:
      "Network diagram or written description showing the architectural boundary between internet-facing systems and the trusted internal network.",
    denialRiskLevel: "medium",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), network architecture section",
  },

  // ──────────────────────────────────────────────
  // Vendor risk
  // ──────────────────────────────────────────────
  {
    id: "cowbell_vendor_1",
    carrierId: "cowbell",
    controlCategory: "vendor_risk",
    questionText:
      "Do your agreements with third-party service providers require security controls commensurate with your own organization's security standards?",
    responseType: "yes_no",
    evidenceExpected:
      "Sample vendor contract clauses covering security requirements, breach notification, and audit rights. For critical vendors, a SOC 2 or ISO 27001 attestation.",
    denialRiskLevel: "high",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), vendor management section",
  },

  // ──────────────────────────────────────────────
  // Funds transfer / social engineering
  // ──────────────────────────────────────────────
  {
    id: "cowbell_privileged_funds_1",
    carrierId: "cowbell",
    controlCategory: "privileged_access",
    questionText:
      "Is access to initiate wire transfers restricted to authorized employees, with segregation of duties preventing unauthorized staff from starting a transfer?",
    responseType: "yes_no",
    evidenceExpected:
      "Written access-control procedure for funds transfers plus a role matrix showing who can initiate, approve, and release.",
    denialRiskLevel: "medium",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), financial controls section",
  },
  {
    id: "cowbell_vendor_2",
    carrierId: "cowbell",
    controlCategory: "vendor_risk",
    questionText:
      "Are vendor and supplier bank account details verified before they are added to your accounts payable system?",
    responseType: "yes_no",
    evidenceExpected:
      "Written vendor-onboarding procedure describing the bank-detail verification step (phone call to a known number, signed form, or equivalent out-of-band confirmation).",
    denialRiskLevel: "medium",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), vendor management section",
  },
  {
    id: "cowbell_email_1",
    carrierId: "cowbell",
    controlCategory: "email_security",
    questionText:
      "Are funds transfer requests authenticated through an out-of-band channel, such as a call back to a pre-verified phone number?",
    responseType: "yes_no",
    evidenceExpected:
      "Written procedure describing the call-back verification workflow, the threshold amount that triggers it, and the approval chain.",
    denialRiskLevel: "medium",
    formSource: "Cowbell Prime 250 Application (PRIME 250 003 07 20), social engineering controls section",
  },
]

/**
 * Lookup helper for engine code.
 *
 * @param {string} questionId
 * @returns {import('./schema.js').CarrierQuestion | null}
 */
export function getCowbellQuestion(questionId) {
  return COWBELL_QUESTIONS.find((q) => q.id === questionId) || null
}
