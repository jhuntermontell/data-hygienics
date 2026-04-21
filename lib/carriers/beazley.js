// ============================================================================
// Beazley - carrier profile and application question catalog
// ============================================================================
//
// Source forms (paraphrased from publicly posted PDFs; every questionText
// in this file is REPHRASED in our own words from the source material to
// avoid copyright issues):
//
//   - Beazley Cyber Insurance Application for applicants with revenues
//     lower than $250M, form F00863, 042023 edition. Covers MFA for
//     remote access and webmail, inbound email controls (malicious
//     attachment scanning, malicious link scanning, external email
//     tagging), interactive phishing training frequency, endpoint
//     protection, EPP/EDR/MDR vendor identification, backup frequency,
//     cloud backup type (syncing service vs dedicated backup), patching
//     of internet-facing systems, incident response plan, and out-of-band
//     vendor bank-detail change verification.
//   - Beazley Cyber Insurance Questionnaire for applicants with revenues
//     lower than £20M. Covers MFA for webmail and remote access, backups
//     offline/tested, security awareness training, EPP/EDR/MDR presence,
//     advanced email threat hunting (e.g. Microsoft 365 Defender or
//     equivalent), and IP allowlisting for exposed services.
//   - Beazley Digital Application, form F00839, 112021 edition.
//     Additional questions on remote access MFA with VPN, cloud email MFA,
//     annual cybersecurity training, 2-month critical patch window, email
//     scanning, endpoint protection, backup attributes (offline/encrypted/
//     tested within 6 months), EOL software segregation, email logging and
//     DMARC/DKIM/SPF, vendor indemnification, supervisor review of vendor
//     changes, anti-fraud training, and specific wire-transfer verification
//     methods.
//
// Beazley's distinguishing characteristic versus the other three carriers:
// they ask about granularity the others skip. Phishing training FREQUENCY
// (never/annual/2x+), inbound email CONTROL SELECTION (multi-select for
// attachment vs link vs tagging), and explicit email authentication
// (DMARC/DKIM/SPF) questions are all Beazley-specific.
//
// Denial risk levels assigned per the Phase 2 brief:
//   - critical: MFA scope, EDR presence, backup existence/architecture.
//   - high: inbound email filtering, phishing training frequency,
//     patching internet-facing systems, IR plan existence.
//   - medium: remaining line items across vendor governance, EOL
//     segregation, email logging/DMARC/DKIM/SPF, and wire-transfer
//     verification procedures.
//
// Last verified: 2026-04-11.
// ============================================================================

/** @type {import('./schema.js').CarrierProfile} */
export const BEAZLEY_PROFILE = {
  id: "beazley",
  name: "Beazley",
  formName:
    "Beazley Cyber Insurance Application (sub-$250M) plus UK Questionnaire and Digital App",
  formVersion: "F00863 042023 ed. + UK questionnaire + F00839 112021 ed.",
  lastVerified: "2026-04-11",
  accentColor: "#0F766E",
  sourceCitations: [
    "https://www.beazley.com/united-states/cyber-and-tech/cyber-risks",
  ],
}

/** @type {import('./schema.js').CarrierQuestion[]} */
export const BEAZLEY_QUESTIONS = [
  // ──────────────────────────────────────────────
  // MFA - sub-$250M application (F00863)
  // ──────────────────────────────────────────────
  {
    id: "beazley_mfa_1",
    carrierId: "beazley",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication required for all remote access to your network, including VPN connections? If remote access is not permitted at all, note that as the answer.",
    responseType: "yes_no_na",
    evidenceExpected:
      "VPN or ZTNA configuration screenshot showing MFA enforced for every remote access path, or a written statement that remote access is not permitted.",
    denialRiskLevel: "critical",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (access controls section)",
  },
  {
    id: "beazley_mfa_2",
    carrierId: "beazley",
    controlCategory: "mfa",
    questionText:
      "Is multi-factor authentication required for web-based email access? If web-based email access is not permitted at all, note that as the answer.",
    responseType: "yes_no_na",
    evidenceExpected:
      "Identity provider policy screenshot showing MFA enforced on web and cloud email access.",
    denialRiskLevel: "critical",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (access controls section)",
  },

  // ──────────────────────────────────────────────
  // Email security - sub-$250M and Digital App
  // ──────────────────────────────────────────────
  {
    id: "beazley_email_1",
    carrierId: "beazley",
    controlCategory: "email_security",
    questionText:
      "Which inbound email controls are in place? Select all that apply: scanning for malicious attachments, scanning for malicious links, tagging of external emails.",
    responseType: "multi_select",
    responseOptions: [
      "Scan inbound attachments for malware",
      "Scan inbound links for known phishing destinations",
      "Tag external emails with a visible warning banner",
    ],
    evidenceExpected:
      "Screenshots of the email security configuration: anti-malware policy, safe links policy, and external sender tagging policy. In Microsoft 365 these are under Microsoft Defender > Email and collaboration; in Google Workspace they are under Gmail Safety settings.",
    denialRiskLevel: "high",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (email security section)",
  },
  {
    id: "beazley_email_2",
    carrierId: "beazley",
    controlCategory: "email_security",
    questionText:
      "Is incoming email scanned for malicious attachments and malicious links, either by your email platform or by a dedicated email security service?",
    responseType: "yes_no",
    evidenceExpected:
      "Email security configuration screenshot showing attachment scanning and link protection enabled.",
    denialRiskLevel: "high",
    formSource: "Beazley Digital Application F00839 112021 ed. (email security section)",
  },
  {
    id: "beazley_email_3",
    carrierId: "beazley",
    controlCategory: "email_security",
    questionText:
      "Is advanced email threat hunting (for example, Microsoft 365 Defender or an equivalent capability) in place to detect phishing and business email compromise attempts?",
    responseType: "yes_no",
    evidenceExpected:
      "Screenshot of the advanced threat protection feature set active on the email platform, plus (if applicable) a recent Defender alert summary.",
    denialRiskLevel: "medium",
    formSource: "Beazley UK Questionnaire (<£20M revenue)",
  },
  {
    id: "beazley_email_4",
    carrierId: "beazley",
    controlCategory: "email_security",
    questionText:
      "If your organization uses a hosted or cloud email service, are default email logging and mailbox auditing enabled?",
    responseType: "yes_no",
    evidenceExpected:
      "In Microsoft 365: Microsoft Purview > Audit > Search showing audit logs are enabled at the tenant level. In Google Workspace: Admin console > Reports > Audit log confirming retention and access.",
    denialRiskLevel: "medium",
    formSource: "Beazley Digital Application F00839 112021 ed. (cloud email section)",
  },
  {
    id: "beazley_email_5",
    carrierId: "beazley",
    controlCategory: "email_security",
    questionText:
      "Are DMARC, DKIM, and SPF records implemented on your email domain?",
    responseType: "yes_no",
    evidenceExpected:
      "Screenshots of the TXT records from your DNS provider for _dmarc, default._domainkey, and the SPF record, plus an optional DMARC analyzer report.",
    denialRiskLevel: "medium",
    formSource: "Beazley Digital Application F00839 112021 ed. (cloud email section)",
    notes:
      "Beazley is the only carrier of the four that asks about email authentication standards explicitly. Underwriters treat a DMARC policy of 'p=reject' or 'p=quarantine' as the answer they want to see; 'p=none' is monitoring-only and provides no spoofing protection.",
  },

  // ──────────────────────────────────────────────
  // Security awareness training (frequency matters)
  // ──────────────────────────────────────────────
  {
    id: "beazley_training_1",
    carrierId: "beazley",
    controlCategory: "security_awareness",
    questionText:
      "How often is interactive social engineering or phishing training delivered to your workforce? Options: never or not regularly, annually, or twice a year or more frequent.",
    responseType: "multiple_choice",
    responseOptions: [
      "Never or not regularly",
      "Annually",
      "Twice a year or more frequent",
    ],
    evidenceExpected:
      "Training platform dashboard showing campaign cadence and completion rates for the most recent 12 months.",
    denialRiskLevel: "high",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (awareness section)",
    notes:
      "Beazley is one of the few SMB carriers that quantifies training frequency. 'Never or not regularly' is an automatic flag.",
  },
  {
    id: "beazley_training_2",
    carrierId: "beazley",
    controlCategory: "security_awareness",
    questionText:
      "Is periodic anti-fraud training provided to employees regarding phishing and other social engineering scams specific to wire fraud and business email compromise?",
    responseType: "yes_no",
    evidenceExpected:
      "Training records showing anti-fraud or BEC-specific content delivered to finance and AP staff in the last 12 months.",
    denialRiskLevel: "medium",
    formSource: "Beazley Digital Application F00839 112021 ed. (social engineering section)",
  },

  // ──────────────────────────────────────────────
  // Endpoint protection and EDR/MDR vendor naming
  // ──────────────────────────────────────────────
  {
    id: "beazley_edr_1",
    carrierId: "beazley",
    controlCategory: "edr",
    questionText:
      "Are all company devices protected by anti-virus, anti-malware, or endpoint protection software?",
    responseType: "yes_no",
    evidenceExpected:
      "EDR console device inventory export showing agent coverage across workstations, laptops, and servers.",
    denialRiskLevel: "critical",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (endpoint section); also asked on Digital App F00839 112021",
  },
  {
    id: "beazley_edr_2",
    carrierId: "beazley",
    controlCategory: "edr",
    questionText:
      "Identify the endpoint protection platform (EPP), endpoint detection and response (EDR), and managed detection and response (MDR) products in use, including vendor names.",
    responseType: "free_text",
    evidenceExpected:
      "Vendor and product name for each tool (e.g. 'Microsoft Defender for Endpoint' for EPP/EDR, 'Huntress' for MDR). Include a console login screenshot showing the branded product in use.",
    denialRiskLevel: "critical",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (endpoint section, required for higher-revenue applicants)",
    notes:
      "Beazley explicitly asks for vendor identification for applicants above a revenue threshold (roughly $35M). Smaller applicants are asked a yes/no. Either way, an honest vendor name is expected.",
  },

  // ──────────────────────────────────────────────
  // Backups
  // ──────────────────────────────────────────────
  {
    id: "beazley_backups_1",
    carrierId: "beazley",
    controlCategory: "backups",
    questionText:
      "How often is business-critical data backed up? Options: none, at least monthly, or at least weekly (including daily).",
    responseType: "multiple_choice",
    responseOptions: [
      "None",
      "At least monthly",
      "At least weekly (including daily)",
    ],
    evidenceExpected:
      "Backup job history showing the actual cadence matching the selected bucket.",
    denialRiskLevel: "critical",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (business continuity section)",
  },
  {
    id: "beazley_backups_2",
    carrierId: "beazley",
    controlCategory: "backups",
    questionText:
      "If you use cloud-based backups, is your cloud backup a syncing service (such as general-purpose cloud storage where the backup mirrors production) or a dedicated backup service?",
    responseType: "multiple_choice",
    responseOptions: [
      "Dedicated backup service",
      "Syncing service",
      "No cloud backups",
    ],
    evidenceExpected:
      "Name of the cloud backup service plus a screenshot of the configuration showing immutability, versioning, or object lock if applicable.",
    denialRiskLevel: "high",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (business continuity section)",
    notes:
      "Beazley distinguishes between syncing services (Dropbox, OneDrive file sync) and purpose-built backup services (Backblaze B2, AWS S3 with Object Lock, Datto). Syncing services often replicate ransomware encryption to the cloud copy; purpose-built backup is the answer underwriters prefer.",
  },
  {
    id: "beazley_backups_3",
    carrierId: "beazley",
    controlCategory: "backups",
    questionText:
      "Are backups kept offline or stored in a purpose-designed cloud backup service, encrypted, and tested through a successful restore within the last six months?",
    responseType: "yes_no",
    evidenceExpected:
      "Segregation or immutability configuration, encryption attestation, and a dated restore test report from within the last six months.",
    denialRiskLevel: "critical",
    formSource: "Beazley Digital Application F00839 112021 ed. (backup section)",
  },

  // ──────────────────────────────────────────────
  // Patching
  // ──────────────────────────────────────────────
  {
    id: "beazley_patching_1",
    carrierId: "beazley",
    controlCategory: "patching",
    questionText:
      "Are critical patches actively managed and installed on internet-facing systems, either in-house or through an outsourced provider?",
    responseType: "yes_no",
    evidenceExpected:
      "Patch compliance report filtered to internet-facing systems showing deployment within the stated window.",
    denialRiskLevel: "high",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (patch management section)",
  },
  {
    id: "beazley_patching_2",
    carrierId: "beazley",
    controlCategory: "patching",
    questionText:
      "Are critical patches implemented within a two-month window after release?",
    responseType: "yes_no",
    evidenceExpected:
      "Patch compliance report showing time-from-release to deployment for recent critical patches, with the two-month window met or beaten.",
    denialRiskLevel: "high",
    formSource: "Beazley Digital Application F00839 112021 ed. (patching section)",
    notes:
      "Beazley's Digital Application specifies 2 months as the acceptable critical-patch window. Travelers asks 30 days. Beazley's threshold is more permissive but is still stricter than 'ad-hoc'.",
  },

  // ──────────────────────────────────────────────
  // Incident response
  // ──────────────────────────────────────────────
  {
    id: "beazley_ir_1",
    carrierId: "beazley",
    controlCategory: "incident_response",
    questionText:
      "Do you have an incident response plan for network intrusions and malware incidents?",
    responseType: "yes_no",
    evidenceExpected:
      "Dated IR plan document covering network intrusion and malware scenarios, with defined roles and notification steps.",
    denialRiskLevel: "high",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (incident response section)",
  },

  // ──────────────────────────────────────────────
  // Network / EOL software
  // ──────────────────────────────────────────────
  {
    id: "beazley_network_1",
    carrierId: "beazley",
    controlCategory: "network_segmentation",
    questionText:
      "If you run any end-of-life or unsupported software in production, is it segregated from the rest of the network?",
    responseType: "conditional",
    evidenceExpected:
      "Inventory of any EOL software in use plus a network diagram showing the segment it runs in and the firewall rules enforcing isolation.",
    denialRiskLevel: "medium",
    formSource: "Beazley Digital Application F00839 112021 ed. (legacy software section)",
  },
  {
    id: "beazley_network_2",
    carrierId: "beazley",
    controlCategory: "network_segmentation",
    questionText:
      "Are approved IP address ranges allowlisted for externally exposed services (such as email, VPN, or remote access), with all other source addresses blocked?",
    responseType: "yes_no_na",
    evidenceExpected:
      "Firewall rule export or configuration screenshot showing the allowlist for externally exposed services.",
    denialRiskLevel: "medium",
    formSource: "Beazley UK Questionnaire (<£20M revenue)",
  },

  // ──────────────────────────────────────────────
  // Vendor / change management
  // ──────────────────────────────────────────────
  {
    id: "beazley_vendor_1",
    carrierId: "beazley",
    controlCategory: "vendor_risk",
    questionText:
      "When a vendor or supplier sends a request to change their banking or account details, do you confirm the change through a secondary channel (such as a call back to a pre-verified phone number)?",
    responseType: "yes_no",
    evidenceExpected:
      "Written procedure describing the out-of-band verification workflow, the trigger conditions, and the approval chain.",
    denialRiskLevel: "medium",
    formSource: "Beazley Cyber Insurance Application F00863 042023 ed. (social engineering section)",
  },
  {
    id: "beazley_vendor_2",
    carrierId: "beazley",
    controlCategory: "vendor_risk",
    questionText:
      "Do third parties who receive PII or confidential data from you have to indemnify your organization for liability arising from a release caused by their fault or negligence?",
    responseType: "yes_no",
    evidenceExpected:
      "Sample vendor contract indemnification clauses plus a list of critical vendors confirming the clauses apply.",
    denialRiskLevel: "medium",
    formSource: "Beazley Digital Application F00839 112021 ed. (third party liability section)",
  },
  {
    id: "beazley_vendor_3",
    carrierId: "beazley",
    controlCategory: "vendor_risk",
    questionText:
      "Do changes to vendor or supplier records in your accounts payable system require review or approval by a supervisor before being processed?",
    responseType: "yes_no",
    evidenceExpected:
      "Accounts payable system workflow screenshot or written procedure describing the supervisor-review step.",
    denialRiskLevel: "medium",
    formSource: "Beazley Digital Application F00839 112021 ed. (social engineering section)",
  },
  {
    id: "beazley_email_wire_1",
    carrierId: "beazley",
    controlCategory: "email_security",
    questionText:
      "Before executing wire transfers, do you verify the request using a secondary communications method? Which methods do you use: call a pre-verified number, text a pre-verified number, use a code known only to the client, or another method?",
    responseType: "multi_select",
    responseOptions: [
      "Call a pre-verified number",
      "Text a pre-verified number",
      "Use a code known only to the client",
      "Other method",
    ],
    evidenceExpected:
      "Written wire-transfer verification procedure and a sample of recent verifications captured in the AP system.",
    denialRiskLevel: "medium",
    formSource: "Beazley Digital Application F00839 112021 ed. (wire transfer section)",
  },
]

/**
 * Lookup helper for engine code.
 *
 * @param {string} questionId
 * @returns {import('./schema.js').CarrierQuestion | null}
 */
export function getBeazleyQuestion(questionId) {
  return BEAZLEY_QUESTIONS.find((q) => q.id === questionId) || null
}
