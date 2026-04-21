// ============================================================================
// Travelers - carrier profile and application question catalog
// ============================================================================
//
// Source forms (paraphrased from publicly posted PDFs; every questionText
// in this file is REPHRASED in our own words from the source material to
// avoid copyright issues):
//
//   - Travelers CyberRisk Application, form code CYB-14102 Ed. 01-19.
//     The long-form application. Covers AV/endpoint, log storage and
//     monitoring, vendor access logging, patching process and automation
//     and 30-day critical window, backup procedures and automation and
//     annual testing, MFA for admin/remote/email, VPN-only remote, password
//     complexity, user deprovisioning, role-based access, vendor governance
//     (policies/review/revocation/logging/insurance/indemnity), DR/BCP/IR
//     plans, plan testing and restoration time, encryption (at rest, in
//     transit, mobile, BYOD, third-party).
//   - Travelers CyberRisk Short Form Application, form code
//     CYB-14103 Ed. 01-19. The smaller-risk lane covering AV, patching,
//     backups, encryption, and vendor security requirements.
//   - Travelers Multi-Factor Authentication Supplement, form code
//     CYB-14306 Rev. 03-23. Granular MFA questions for web email, remote
//     access, and admin access to directory services, backup environments,
//     network infrastructure, and endpoints/servers. "No" answers on this
//     supplement require written explanations.
//   - Travelers CyberRisk Social Engineering Fraud Short Form Supplement,
//     form code CYB-14301 Ed. 01-19, and Social Engineering Fraud
//     Supplement, form code CYB-14302 Ed. 01-19. Cover anti-fraud training,
//     dual authorization of wire transfers, vendor invoice validation,
//     bank account authentication, call-back verification, and
//     segregation of duties.
//
// Denial risk levels assigned per the Phase 2 brief:
//   - critical: MFA across every surface the supplement asks about, EDR
//     presence, backup existence and testing.
//   - high: log storage/monitoring (Travelers' long form asks explicitly),
//     30-day critical patching, IR plan existence and testing.
//   - medium: vendor governance line items, encryption attestations,
//     social engineering controls outside the MFA scope.
//
// Important: the MFA Supplement carries a form-level rule that a "No"
// answer on any MFA question requires a written explanation attached to
// the application. Every MFA-supplement question in this file carries a
// `notes` field reminding the user of this requirement so the proof pack
// renders the reminder next to the translated answer.
//
// Last verified: 2026-04-11.
// ============================================================================

/** @type {import('./schema.js').CarrierProfile} */
export const TRAVELERS_PROFILE = {
  id: "travelers",
  name: "Travelers",
  formName:
    "Travelers CyberRisk Application (long form) plus MFA Supplement and Social Engineering Supplements",
  formVersion: "CYB-14102 Ed. 01-19 + CYB-14306 Rev. 03-23 + CYB-14301/14302 Ed. 01-19",
  lastVerified: "2026-04-11",
  accentColor: "#0F766E",
  sourceCitations: [
    "https://www.travelers.com/cyber-insurance/applications-forms",
  ],
}

const MFA_SUPPLEMENT_NOTE =
  "Travelers' MFA Supplement (CYB-14306 Rev. 03-23) requires a written explanation attached to the application for any 'No' answer on this question. If the translated answer below is 'No' or 'Partial,' prepare a short explanation describing the scope and the compensating controls in place before submitting."

/** @type {import('./schema.js').CarrierQuestion[]} */
export const TRAVELERS_QUESTIONS = [
  // ──────────────────────────────────────────────
  // EDR / endpoint protection
  // ──────────────────────────────────────────────
  {
    id: "travelers_edr_1",
    carrierId: "travelers",
    controlCategory: "edr",
    questionText:
      "Is up-to-date, active anti-virus or endpoint protection software deployed on every computer, server, and mobile device in your environment?",
    responseType: "yes_no",
    evidenceExpected:
      "EDR console device inventory export showing agent installed and healthy across workstations, laptops, and servers, plus the vendor name.",
    denialRiskLevel: "critical",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (antivirus/endpoint section); also asked on the short form CYB-14103",
    notes:
      "Travelers' long form asks plain yes/no, but at claim time they will check whether the answer matched forensic reality. A 'Yes' answered without EDR coverage on servers or domain controllers is grounds for dispute.",
  },

  // ──────────────────────────────────────────────
  // Log storage and monitoring
  // ──────────────────────────────────────────────
  {
    id: "travelers_logging_1",
    carrierId: "travelers",
    controlCategory: "logging_monitoring",
    questionText:
      "Does your organization systematically store and actively monitor network and security logs?",
    responseType: "yes_no",
    evidenceExpected:
      "Screenshot of the SIEM or log aggregator configuration showing retention duration and alerting; if monitoring is outsourced to an MDR, include a recent monthly service report.",
    denialRiskLevel: "high",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (security operations section)",
    notes:
      "Travelers is one of the few SMB carriers that asks about log monitoring explicitly. 'We have an EDR' and 'we monitor our EDR alerts' are different things from their perspective.",
  },
  {
    id: "travelers_logging_2",
    carrierId: "travelers",
    controlCategory: "logging_monitoring",
    questionText:
      "Is third-party vendor access to your systems logged and actively monitored?",
    responseType: "yes_no",
    evidenceExpected:
      "Written description of how vendor access is monitored (jump host logging, PAM tool, or identity provider access logs) plus a sample of recent vendor-access log entries.",
    denialRiskLevel: "high",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (vendor access section)",
  },

  // ──────────────────────────────────────────────
  // Patching
  // ──────────────────────────────────────────────
  {
    id: "travelers_patching_1",
    carrierId: "travelers",
    controlCategory: "patching",
    questionText:
      "Do you follow a defined process to regularly download, test, and install security patches on all systems?",
    responseType: "yes_no",
    evidenceExpected:
      "Written patching SOP plus a compliance report from Intune, WSUS, or your RMM tool showing actual deployment cadence.",
    denialRiskLevel: "high",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (patch management section); short form CYB-14103 asks a simpler version",
  },
  {
    id: "travelers_patching_2",
    carrierId: "travelers",
    controlCategory: "patching",
    questionText:
      "Is the patching process automated through a patch management tool or equivalent solution?",
    responseType: "yes_no",
    evidenceExpected:
      "Screenshot of the patch management tool showing automated deployment rings, update rules, or scheduled jobs.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (patch management section)",
  },
  {
    id: "travelers_patching_3",
    carrierId: "travelers",
    controlCategory: "patching",
    questionText:
      "Are critical security patches installed within 30 days of their release?",
    responseType: "yes_no",
    evidenceExpected:
      "Patch compliance report showing the deployment window for recent critical patches, measured from release date to install date.",
    denialRiskLevel: "high",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (patch management section)",
    notes:
      "Travelers specifies 30 days as the expected SLA. Anything slower should be flagged with an explanation. Internet-facing systems should be patched faster than the 30-day window.",
  },

  // ──────────────────────────────────────────────
  // Backups
  // ──────────────────────────────────────────────
  {
    id: "travelers_backups_1",
    carrierId: "travelers",
    controlCategory: "backups",
    questionText:
      "Are backup and recovery procedures in place for important business data and customer information?",
    responseType: "yes_no",
    evidenceExpected:
      "Backup job history from the backup platform showing the last 30-90 days of runs, plus a written description of what is being backed up.",
    denialRiskLevel: "critical",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (business continuity section); short form CYB-14103 asks the same",
  },
  {
    id: "travelers_backups_2",
    carrierId: "travelers",
    controlCategory: "backups",
    questionText:
      "Is the backup process automated rather than manual?",
    responseType: "yes_no",
    evidenceExpected:
      "Screenshot of the backup scheduling configuration showing automated jobs, retention policies, and notification rules.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (business continuity section)",
  },
  {
    id: "travelers_backups_3",
    carrierId: "travelers",
    controlCategory: "backups",
    questionText:
      "Are backup restore procedures tested at least annually to confirm data can actually be recovered?",
    responseType: "yes_no",
    evidenceExpected:
      "Restore test report showing the most recent test date, what was restored, the outcome, and the recovery time observed.",
    denialRiskLevel: "critical",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (business continuity section)",
  },

  // ──────────────────────────────────────────────
  // MFA - base application
  // ──────────────────────────────────────────────
  {
    id: "travelers_mfa_base_1",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Is multi-factor authentication enforced for administrative and privileged access to your systems?",
    responseType: "yes_no_na",
    evidenceExpected:
      "List of privileged accounts plus the Conditional Access or equivalent policy requiring MFA on those roles.",
    denialRiskLevel: "critical",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (access control section)",
  },
  {
    id: "travelers_mfa_base_2",
    carrierId: "travelers",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication enforced for remote access to the network and to any systems or applications that contain bulk sensitive data?",
    responseType: "yes_no_na",
    evidenceExpected:
      "VPN or ZTNA configuration screenshot showing MFA required, plus any Conditional Access policy gating bulk-sensitive-data systems behind MFA.",
    denialRiskLevel: "critical",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (access control section)",
  },
  {
    id: "travelers_mfa_base_3",
    carrierId: "travelers",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication required for remote access to email?",
    responseType: "yes_no_na",
    evidenceExpected:
      "Identity provider policy screenshot showing MFA required for email access, with particular attention to web-based and mobile app access paths.",
    denialRiskLevel: "critical",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (access control section)",
  },

  // ──────────────────────────────────────────────
  // MFA Supplement (CYB-14306)
  // ──────────────────────────────────────────────
  {
    id: "travelers_mfa_supp_1",
    carrierId: "travelers",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication required for all employees who access email through a web browser or cloud email service?",
    responseType: "yes_no",
    evidenceExpected:
      "Identity provider policy screenshot showing MFA enforced on web-based and cloud email access specifically.",
    denialRiskLevel: "critical",
    formSource: "Travelers MFA Supplement CYB-14306 Rev. 03-23",
    notes: MFA_SUPPLEMENT_NOTE,
  },
  {
    id: "travelers_mfa_supp_2",
    carrierId: "travelers",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication required for every form of remote network access provided to employees, contractors, and third-party service providers?",
    responseType: "yes_no",
    evidenceExpected:
      "VPN, ZTNA, or remote access tool configuration showing MFA enforced for every access path, with explicit note on third-party vendor access.",
    denialRiskLevel: "critical",
    formSource: "Travelers MFA Supplement CYB-14306 Rev. 03-23",
    notes: MFA_SUPPLEMENT_NOTE,
  },
  {
    id: "travelers_mfa_supp_3",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Is multi-factor authentication required for administrative access to directory services (Active Directory, Entra ID, or equivalent)?",
    responseType: "yes_no",
    evidenceExpected:
      "Directory services admin role membership list plus the Conditional Access or group policy requiring MFA on those roles.",
    denialRiskLevel: "critical",
    formSource: "Travelers MFA Supplement CYB-14306 Rev. 03-23",
    notes: MFA_SUPPLEMENT_NOTE,
  },
  {
    id: "travelers_mfa_supp_4",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Is multi-factor authentication required for administrative access to your backup environment?",
    responseType: "yes_no",
    evidenceExpected:
      "Backup platform admin console screenshot showing MFA enforcement plus the list of accounts with backup-admin privileges.",
    denialRiskLevel: "critical",
    formSource: "Travelers MFA Supplement CYB-14306 Rev. 03-23",
    notes: MFA_SUPPLEMENT_NOTE,
  },
  {
    id: "travelers_mfa_supp_5",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Is multi-factor authentication required for administrative access to network infrastructure (firewalls, switches, routers, wireless controllers)?",
    responseType: "yes_no",
    evidenceExpected:
      "Network device admin access policy showing MFA enforcement (RADIUS/TACACS+ with MFA, or jump host with MFA gating).",
    denialRiskLevel: "high",
    formSource: "Travelers MFA Supplement CYB-14306 Rev. 03-23",
    notes: MFA_SUPPLEMENT_NOTE,
  },
  {
    id: "travelers_mfa_supp_6",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Is multi-factor authentication required for administrative access to endpoints and servers, including when that access is provided to third-party service providers?",
    responseType: "yes_no",
    evidenceExpected:
      "Endpoint/server admin tool configuration showing MFA enforcement plus documentation of how third-party access is authenticated.",
    denialRiskLevel: "high",
    formSource: "Travelers MFA Supplement CYB-14306 Rev. 03-23",
    notes: MFA_SUPPLEMENT_NOTE,
  },

  // ──────────────────────────────────────────────
  // Privileged access / password controls
  // ──────────────────────────────────────────────
  {
    id: "travelers_privileged_1",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Is remote access to the internal network limited to VPN connections only?",
    responseType: "yes_no_na",
    evidenceExpected:
      "Firewall configuration showing external access restricted to the VPN concentrator, and no direct RDP or other remote protocol exposed to the internet.",
    denialRiskLevel: "high",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (access control section)",
  },
  {
    id: "travelers_privileged_2",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Are password complexity requirements enforced across all user accounts?",
    responseType: "yes_no",
    evidenceExpected:
      "Password policy screenshot from the identity provider showing length, complexity, and rotation requirements.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (access control section)",
  },
  {
    id: "travelers_privileged_3",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Are user access rights terminated as part of the formal employee exit process?",
    responseType: "yes_no",
    evidenceExpected:
      "Written offboarding checklist or HR-to-IT handoff procedure showing access revocation steps and timing expectations.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (access control section)",
  },
  {
    id: "travelers_privileged_4",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Is access to sensitive data and systems restricted based on job function (role-based access control)?",
    responseType: "yes_no",
    evidenceExpected:
      "Role-to-permission matrix plus documentation of how new access is granted and reviewed.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (access control section)",
  },

  // ──────────────────────────────────────────────
  // Vendor governance
  // ──────────────────────────────────────────────
  {
    id: "travelers_vendor_1",
    carrierId: "travelers",
    controlCategory: "vendor_risk",
    questionText:
      "Do you maintain written policies specifying the security controls required of third-party service providers?",
    responseType: "yes_no",
    evidenceExpected:
      "Vendor management policy document or sample vendor contract template with security and data protection clauses.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (vendor management section)",
  },
  {
    id: "travelers_vendor_2",
    carrierId: "travelers",
    controlCategory: "vendor_risk",
    questionText:
      "Are vendor access rights reviewed and updated periodically to ensure they remain aligned with current needs?",
    responseType: "yes_no",
    evidenceExpected:
      "Most recent vendor access review record, with reviewer, date, and any changes made.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (vendor management section)",
  },
  {
    id: "travelers_vendor_3",
    carrierId: "travelers",
    controlCategory: "vendor_risk",
    questionText:
      "Is vendor access promptly revoked when a vendor relationship ends or access is no longer needed?",
    responseType: "yes_no",
    evidenceExpected:
      "Written offboarding procedure for vendors plus a recent example of access revocation from a log.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (vendor management section)",
  },
  {
    id: "travelers_vendor_4",
    carrierId: "travelers",
    controlCategory: "vendor_risk",
    questionText:
      "Do vendor contracts require the vendor to maintain their own cyber insurance or other financial-responsibility protection?",
    responseType: "yes_no",
    evidenceExpected:
      "Sample contract clauses requiring cyber insurance, plus certificates of insurance (COI) for critical vendors.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (vendor management section)",
  },
  {
    id: "travelers_vendor_5",
    carrierId: "travelers",
    controlCategory: "vendor_risk",
    questionText:
      "Do vendor contracts include indemnification or hold-harmless provisions in case of a vendor-caused breach?",
    responseType: "yes_no",
    evidenceExpected:
      "Sample contract indemnification clauses plus a list of critical vendors confirming the clauses are in place.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (vendor management section)",
  },

  // ──────────────────────────────────────────────
  // Incident response
  // ──────────────────────────────────────────────
  {
    id: "travelers_ir_1",
    carrierId: "travelers",
    controlCategory: "incident_response",
    questionText:
      "Do you have a written disaster recovery or business continuity plan and a separate incident response plan?",
    responseType: "yes_no",
    evidenceExpected:
      "DR/BCP document plus the IR plan document, both dated and versioned.",
    denialRiskLevel: "high",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (business continuity section)",
  },
  {
    id: "travelers_ir_2",
    carrierId: "travelers",
    controlCategory: "incident_response",
    questionText:
      "Are those plans tested regularly, with any critical deficiencies remediated afterward? What is your expected restoration-time range for critical operations following an interruption?",
    responseType: "conditional",
    evidenceExpected:
      "Tabletop or DR test after-action report showing date, participants, deficiencies found, and remediation tracking; plus the documented RTO range for critical systems.",
    denialRiskLevel: "high",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (business continuity section)",
  },

  // ──────────────────────────────────────────────
  // Encryption
  // ──────────────────────────────────────────────
  {
    id: "travelers_encryption_1",
    carrierId: "travelers",
    controlCategory: "encryption",
    questionText:
      "Are your covered data types encrypted at rest, in transit, on mobile devices, on employee-owned devices, and when stored by third-party providers?",
    responseType: "multi_select",
    responseOptions: [
      "At rest",
      "In transit",
      "Mobile devices",
      "Employee-owned devices",
      "Third-party provider storage",
    ],
    evidenceExpected:
      "Encryption policy document plus per-state evidence: MDM disk encryption report, TLS configuration, BYOD encryption attestation, and vendor trust pages for third-party storage.",
    denialRiskLevel: "medium",
    formSource: "Travelers CyberRisk Application CYB-14102 Ed. 01-19 (data protection section); short form CYB-14103 asks a similar select-all",
    notes:
      "Travelers asks about encryption as a scope question, not a plain yes/no. A partial answer here is better than a 'Yes' that cannot be substantiated at claim time.",
  },

  // ──────────────────────────────────────────────
  // Social engineering supplements
  // ──────────────────────────────────────────────
  {
    id: "travelers_se_1",
    carrierId: "travelers",
    controlCategory: "security_awareness",
    questionText:
      "Is anti-fraud and social engineering training provided to every employee who authorizes or executes payments?",
    responseType: "yes_no",
    evidenceExpected:
      "Training completion records for finance and AP staff specifically, with training content covering BEC and wire fraud scenarios.",
    denialRiskLevel: "medium",
    formSource: "Travelers Social Engineering Fraud Short Form Supplement CYB-14301 Ed. 01-19",
  },
  {
    id: "travelers_se_2",
    carrierId: "travelers",
    controlCategory: "privileged_access",
    questionText:
      "Do payments and funds transfers above a defined threshold require dual authorization by two separate individuals?",
    responseType: "yes_no",
    evidenceExpected:
      "Written financial controls policy describing the dual-authorization threshold and workflow, plus a sample audit trail showing the control in practice.",
    denialRiskLevel: "medium",
    formSource: "Travelers Social Engineering Fraud Short Form Supplement CYB-14301 Ed. 01-19",
  },
  {
    id: "travelers_se_3",
    carrierId: "travelers",
    controlCategory: "vendor_risk",
    questionText:
      "Are vendor invoices validated before payment, including verification of receipt against the invoice and call-back confirmation of any vendor-account-change request using a pre-existing phone number?",
    responseType: "yes_no",
    evidenceExpected:
      "Written invoice-validation procedure and a documented call-back verification workflow for vendor banking changes.",
    denialRiskLevel: "medium",
    formSource: "Travelers Social Engineering Fraud Supplement CYB-14302 Ed. 01-19",
  },
  {
    id: "travelers_se_4",
    carrierId: "travelers",
    controlCategory: "vendor_risk",
    questionText:
      "Are vendor bank accounts authenticated through a direct call to the recipient bank prior to initial setup in your accounts payable system?",
    responseType: "yes_no",
    evidenceExpected:
      "Vendor onboarding procedure describing the bank verification call, plus a sample completed verification record.",
    denialRiskLevel: "medium",
    formSource: "Travelers Social Engineering Fraud Supplement CYB-14302 Ed. 01-19",
  },
]

/**
 * Lookup helper for engine code.
 *
 * @param {string} questionId
 * @returns {import('./schema.js').CarrierQuestion | null}
 */
export function getTravelersQuestion(questionId) {
  return TRAVELERS_QUESTIONS.find((q) => q.id === questionId) || null
}
