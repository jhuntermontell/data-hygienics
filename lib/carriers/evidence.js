// ============================================================================
// Carrier-agnostic evidence catalog
// ============================================================================
//
// Source: Deep Research "Evidence Artifacts Underwriters Typically Request"
// document. Each entry covers a control category plus one or more primary
// artifacts underwriters commonly ask for when evaluating SMB cyber
// applications. Per-carrier requirement levels are set from that research -
// "required" means the carrier's published materials explicitly ask for or
// workflow-require the artifact; "recommended" means the carrier's guidance
// or platform advocates for it without mandating it; "unspecified" means the
// carrier does not publicly specify an artifact format, even though the
// broader market commonly requests it.
//
// The `whereToFind` strings are written in plain English for a non-technical
// small business owner. They favor admin-console navigation paths over jargon
// so an operator can actually follow them without calling their MSP first.
// Microsoft 365 and Google Workspace paths are included wherever the
// artifact has an equivalent in both platforms.
//
// Nothing in this file depends on a specific carrier. The mapping layer
// references evidence items by ID so the same artifact can be surfaced in
// multiple carriers' readiness reports without duplication.
// ============================================================================

/** @type {import('./schema.js').EvidenceItem[]} */
export const EVIDENCE_CATALOG = [
  // ──────────────────────────────────────────────
  // MFA
  // ──────────────────────────────────────────────
  {
    id: "evidence_mfa_enforcement_policy",
    controlCategory: "mfa",
    artifactName: "MFA enforcement policy screenshot",
    format: "PNG or JPG screenshot, plus optional PDF export of the policy settings",
    whereToFind:
      "In Microsoft 365: go to Entra ID (formerly Azure AD) > Overview > Properties to verify Security Defaults, or open Entra ID > Security > Conditional Access to capture any policy that requires MFA. In Google Workspace: open Admin console > Security > Authentication > 2-step verification and screenshot the enforcement settings for every organizational unit. Date-stamp the screenshot by including the browser clock in the capture.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "required",
      travelers: "required",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "Underwriters are looking for ENFORCEMENT, not availability. A screenshot of 'MFA is available if users opt in' is not the same as 'MFA is required.' Capture the policy that blocks login for anyone who has not enrolled, including an enrollment deadline if one is set. Underwriters also want to know the scope: is it enforced on every user, or only a subset?",
  },
  {
    id: "evidence_mfa_enrollment_roster",
    controlCategory: "mfa",
    artifactName: "Per-user MFA enrollment status export",
    format: "CSV or Excel export from the identity provider, with a total user count",
    whereToFind:
      "In Microsoft 365: Microsoft Graph 'userRegistrationDetails' report can be exported to CSV via the Entra ID admin center > Monitoring > Sign-in logs, or through a Microsoft Graph query. In Google Workspace: Admin console > Reports > Audit > 2-Step Verification enrollment report, then export to CSV. The goal is a dated roster showing total users versus enrolled users.",
    carrierRequirements: {
      coalition: "recommended",
      cowbell: "recommended",
      travelers: "recommended",
      beazley: "recommended",
    },
    detailUnderwritersLookFor:
      "Coverage percentage. Ideally 100 percent for in-scope populations. Underwriters also want to know how break-glass and administrator accounts are handled. If a few accounts are exempted, the exemption reasoning should be documented.",
  },

  // ──────────────────────────────────────────────
  // EDR
  // ──────────────────────────────────────────────
  {
    id: "evidence_edr_device_inventory",
    controlCategory: "edr",
    artifactName: "EDR console device inventory export",
    format: "CSV export plus a screenshot showing agent installed and healthy count",
    whereToFind:
      "In Microsoft Defender for Endpoint: Device inventory > Export > CSV. The export shows every endpoint with its onboarding status and health state. In third-party EDRs like SentinelOne, CrowdStrike, or Sophos, use the equivalent Endpoints or Agents page and export the full list. The final document should show total endpoint count, agent installed count, and healthy count.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "recommended",
      travelers: "unspecified",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "Coverage percentage. Underwriters want to see servers and domain controllers specifically included, not just employee laptops. If any endpoints are running without EDR, they should be documented with a reason. If the EDR is monitored by an MDR provider (SOC-as-a-service), include a redacted MDR monthly report alongside the inventory.",
  },
  {
    id: "evidence_edr_vendor_identification",
    controlCategory: "edr",
    artifactName: "EDR and MDR vendor name",
    format: "Plain text answer on the application, backed by a screenshot of the product console login",
    whereToFind:
      "The vendor name is whatever shows in the top-left of your security console (CrowdStrike Falcon, Microsoft Defender, SentinelOne Singularity, Sophos Intercept X, etc.). If you use an MSP that manages the EDR for you, ask them which product is deployed and whether they are providing managed detection (MDR).",
    carrierRequirements: {
      coalition: "required",
      cowbell: "unspecified",
      travelers: "unspecified",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "The actual product name. Carriers map vendor names to their internal risk tables, and unknown or unnamed products tend to get flagged for follow-up. 'Our IT guy handles it' is not an answer that survives underwriting.",
  },

  // ──────────────────────────────────────────────
  // Backups
  // ──────────────────────────────────────────────
  {
    id: "evidence_backup_job_history",
    controlCategory: "backups",
    artifactName: "Backup job success history (last 30-90 days)",
    format: "PDF report export or screenshots of the backup console",
    whereToFind:
      "In Veeam: Reports > Backup Job History > Export as PDF. In Microsoft 365 backup tools like Datto or AvePoint: Reports > Backup Status, export date range. In Google Workspace backup tools (Spinbackup, Afi, SpanningBackup): use the Reports or History view. The document should show the last 30 to 90 days of jobs with success and failure counts.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "required",
      travelers: "recommended",
      beazley: "recommended",
    },
    detailUnderwritersLookFor:
      "Consistency of success. A backup that ran successfully 28 out of 30 days is fine. A backup that has been failing silently for two weeks is a critical gap. Underwriters also want to see the scope of what is being backed up: are the systems your business actually depends on covered, or only a subset?",
  },
  {
    id: "evidence_backup_segregation_proof",
    controlCategory: "backups",
    artifactName: "Proof of backup separation from production (offline or immutable)",
    format: "Configuration screenshot plus written description of the architecture",
    whereToFind:
      "If you use cloud backups: screenshot the bucket or container settings showing immutability, object lock, or versioning enabled. If you use an on-premises backup appliance: document the network topology showing the backup server is not reachable from the general network, and capture firewall rules that enforce the isolation. If your backups live in a purpose-designed backup service (Backblaze B2, Wasabi, AWS S3 with Object Lock), that architecture is itself the evidence.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "required",
      travelers: "recommended",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "Whether ransomware that encrypts your production network can also reach and encrypt the backup copies. 'We back up to a network share in the same office' is the answer that terrifies underwriters. Offline, immutable, or geographically separate backups are the answer that gets claims paid.",
  },
  {
    id: "evidence_backup_restore_test",
    controlCategory: "backups",
    artifactName: "Recent restore test evidence",
    format: "PDF test report or ticketing-system change record with date and outcome",
    whereToFind:
      "Most backup platforms include a restore-test log. In Veeam: SureBackup job history. In Datto: Screenshot Verification reports. If your backup tool does not generate formal test reports, restore a sample file or VM to a safe location and document the exercise in a ticketing system or a dated Word document that includes what was restored, where to, by whom, and whether it was successful.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "required",
      travelers: "required",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "A recent test - within the last 6 months is common, within the last quarter is better. Underwriters want to see that the restore actually worked and that the recovery time objective (RTO) matches your application answer. A backup you have never tested is a backup you cannot count on.",
  },

  // ──────────────────────────────────────────────
  // Incident response
  // ──────────────────────────────────────────────
  {
    id: "evidence_ir_plan_document",
    controlCategory: "incident_response",
    artifactName: "Written Incident Response Plan",
    format: "PDF document with version, effective date, and roles",
    whereToFind:
      "If you have an IR plan, it lives in your shared drive, SharePoint, or policy management system. Export the current version to PDF. If you do not have one, Data Hygienics has an Incident Response Planner tool (/tools/ir-plan) that generates a minimum-viable plan from a guided interview. Every carrier wants to see a named incident commander, containment steps, and insurer/broker notification procedures.",
    carrierRequirements: {
      coalition: "recommended",
      cowbell: "required",
      travelers: "required",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "Roles and contact info for the first hour of a breach: who calls the insurer, who calls legal, who calls the MSP, who talks to staff, who talks to customers. A plan that says 'call IT' is not a plan. Underwriters are also checking for external vendor contacts: DFIR firm, breach counsel, insurance hotline number.",
  },
  {
    id: "evidence_ir_tabletop_exercise",
    controlCategory: "incident_response",
    artifactName: "Tabletop exercise records",
    format: "PDF after-action report or meeting minutes from a simulated incident walk-through",
    whereToFind:
      "If your team has run a tabletop in the last year, the after-action report lives wherever your IR plan does. Data Hygienics' Incident Response Planner includes interactive tabletop scenarios (/tools/ir-plan/exercise) that generate a timestamped PDF record after each run. If you have not run a tabletop, schedule one before submitting for insurance - most carriers expect at least one exercise per year for mature terms.",
    carrierRequirements: {
      coalition: "unspecified",
      cowbell: "recommended",
      travelers: "required",
      beazley: "recommended",
    },
    detailUnderwritersLookFor:
      "Evidence that the IR plan is practiced, not just filed. Underwriters have seen too many plans that look good on paper and fall apart during a real incident. A tabletop record shows the team has actually walked through the decision points and uncovered any gaps.",
  },

  // ──────────────────────────────────────────────
  // Patching
  // ──────────────────────────────────────────────
  {
    id: "evidence_patch_compliance_report",
    controlCategory: "patching",
    artifactName: "Patch compliance report by device or OS",
    format: "CSV export plus screenshot of the compliance dashboard",
    whereToFind:
      "In Microsoft Intune: Reports > Windows updates > Windows update ring policy reports. Export the compliance view to CSV. In Windows Server Update Services (WSUS): Reports > Computer Status > Detailed. In Jamf or Kandji for Macs: Reports > Inventory > Update Status. If you use a third-party RMM like NinjaOne or Atera, the patch compliance report is in the Reports tab.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "required",
      travelers: "required",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "An SLA for critical patches - 7, 14, or 30 days is common - and evidence that the SLA is actually being met. The coverage percentage matters: 95 percent of endpoints patched is reasonable, 60 percent is a red flag. Internet-facing systems should be patched faster than internal-only systems.",
  },
  {
    id: "evidence_vulnerability_export",
    controlCategory: "patching",
    artifactName: "Vulnerability findings export",
    format: "CSV export plus an optional PDF summary",
    whereToFind:
      "In Microsoft Defender Vulnerability Management: Weaknesses > Export. Alternative tools include Rapid7 InsightVM, Qualys, Tenable Nessus, or a recent third-party penetration test summary. The goal is a list of known CVEs affecting your environment along with the remediation cadence.",
    carrierRequirements: {
      coalition: "recommended",
      cowbell: "unspecified",
      travelers: "recommended",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "Operational patching behavior, not just written policy. A vulnerability list with unaddressed critical findings older than 30 days is worse than no list at all - it proves the organization knows about gaps and has not fixed them.",
  },

  // ──────────────────────────────────────────────
  // Security awareness training
  // ──────────────────────────────────────────────
  {
    id: "evidence_training_completion_roster",
    controlCategory: "security_awareness",
    artifactName: "Training completion roster and phishing simulation results",
    format: "CSV roster plus screenshot of the training platform dashboard",
    whereToFind:
      "In KnowBe4: Reports > Training Campaigns > Export. In Hoxhunt, Curricula, or Infosec IQ: equivalent Reports > Campaign History > Export. If training is delivered through Microsoft Defender for Office 365 Attack Simulation: Reports > Simulations > Export. The final artifact should show total users, completion percentage, and phishing simulation click and report rates.",
    carrierRequirements: {
      coalition: "unspecified",
      cowbell: "required",
      travelers: "required",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "Frequency and completion rate. At least annual is table stakes; two or more sessions per year is better. Completion near 100 percent is the target - a program where only 60 percent of staff finished the training is a program underwriters will question. Phishing simulation trends matter too: click rates should decline over time.",
  },

  // ──────────────────────────────────────────────
  // Privileged access
  // ──────────────────────────────────────────────
  {
    id: "evidence_privileged_account_list",
    controlCategory: "privileged_access",
    artifactName: "Inventory of privileged and admin accounts",
    format: "CSV export or a dated spreadsheet signed by an executive",
    whereToFind:
      "In Microsoft 365: Entra ID > Roles and administrators > select each role (Global Admin, Privileged Role Admin, Exchange Admin) and export the member list. In Google Workspace: Admin console > Admin roles > each role's members list. For on-prem Active Directory: export members of Domain Admins, Enterprise Admins, and Schema Admins groups. If MFA is enforced on these accounts (as it should be), include a screenshot of the Conditional Access policy that requires it.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "recommended",
      travelers: "required",
      beazley: "recommended",
    },
    detailUnderwritersLookFor:
      "Low admin count. A 15-person business does not need 8 Global Admins. Underwriters also want distinct admin accounts (admin@yourco.com separate from dave@yourco.com), MFA required on every privileged account, and a quarterly review cadence for the admin group membership.",
  },
  {
    id: "evidence_endpoint_local_admin_policy",
    controlCategory: "privileged_access",
    artifactName: "Endpoint local-admin restriction policy",
    format: "Screenshot of the Intune, Jamf, or Group Policy configuration",
    whereToFind:
      "In Microsoft Intune: Endpoint security > Account protection > Local admin password solution (LAPS) and the accompanying restriction policies. In Group Policy: Computer Configuration > Windows Settings > Security Settings > Restricted Groups. On Macs managed with Jamf: Configuration Profiles > Restrictions > Prevent users from having administrator privileges.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "unspecified",
      travelers: "unspecified",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "Regular users should not be able to run as local admin on their own machines. If everyone is a local admin, a single successful phishing click can install persistent malware. The policy should show explicit enforcement, not reliance on employee self-restraint.",
  },

  // ──────────────────────────────────────────────
  // Email security
  // ──────────────────────────────────────────────
  {
    id: "evidence_email_security_config",
    controlCategory: "email_security",
    artifactName: "Email security configuration screenshot",
    format: "PNG or JPG screenshots of anti-phishing, safe links, and external email tagging settings",
    whereToFind:
      "In Microsoft 365: Microsoft Defender > Email and collaboration > Policies and rules > Threat policies > Anti-phishing, Safe Attachments, Safe Links. In Google Workspace: Admin console > Apps > Google Workspace > Gmail > Safety, and capture the settings for Attachments, Links and external images, Spoofing and authentication. Screenshot each policy in its enabled state.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "recommended",
      travelers: "recommended",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "Whether advanced threat protection is enabled, not just default spam filtering. External email tagging (a banner on emails from outside the organization) is becoming table stakes. Attachment sandboxing, URL rewriting, and impersonation detection are the next tier up.",
  },
  {
    id: "evidence_external_forwarding_disabled",
    controlCategory: "email_security",
    artifactName: "Proof external auto-forwarding is disabled",
    format: "Screenshot of the outbound spam policy plus an optional policy export",
    whereToFind:
      "In Microsoft 365: Microsoft Defender > Email and collaboration > Policies and rules > Threat policies > Anti-spam > Outbound spam filter policy > Forwarding rules. Set to 'Off - Forwarding is disabled' and screenshot. In Google Workspace: Admin console > Apps > Google Workspace > Gmail > End User Access > Automatic forwarding. Disable and screenshot.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "unspecified",
      travelers: "unspecified",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "External auto-forwarding is the primary mechanism attackers use to quietly exfiltrate email after compromising a mailbox. Coalition explicitly checks this via their Control platform integration. Underwriters want default-blocked with documented exceptions, not default-on.",
  },
  {
    id: "evidence_dmarc_dkim_spf_records",
    controlCategory: "email_security",
    artifactName: "DMARC, DKIM, and SPF DNS record evidence",
    format: "Screenshot of the DNS records or a DMARC analyzer report",
    whereToFind:
      "Open your DNS provider's admin console (GoDaddy, Cloudflare, Route 53, Google Domains) and screenshot the TXT records for _dmarc, default._domainkey, and @ (SPF). Alternatively, run your domain through a free DMARC analyzer (dmarcian.com, mxtoolbox.com) and export the report. Both platforms document the setup steps: Microsoft's guidance is at learn.microsoft.com under 'Set up DMARC' and Google's is at support.google.com for Workspace.",
    carrierRequirements: {
      coalition: "recommended",
      cowbell: "unspecified",
      travelers: "unspecified",
      beazley: "required",
    },
    detailUnderwritersLookFor:
      "DMARC policy strength. A 'p=none' DMARC record is monitoring-only and provides no protection against spoofing. 'p=quarantine' or 'p=reject' is the enforced state underwriters want to see. SPF and DKIM should be aligned with DMARC for the protection to actually take effect.",
  },

  // ──────────────────────────────────────────────
  // Encryption
  // ──────────────────────────────────────────────
  {
    id: "evidence_device_encryption_enforcement",
    controlCategory: "encryption",
    artifactName: "Device encryption enforcement proof",
    format: "Screenshot of the MDM policy plus a device compliance export",
    whereToFind:
      "In Microsoft Intune: Endpoint security > Disk encryption. Screenshot the BitLocker (Windows) or FileVault (macOS) enforcement policy. In Jamf: Configuration Profiles > Computer Level > FileVault. The export showing each device's encryption state is the second artifact.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "unspecified",
      travelers: "required",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "100 percent coverage on laptops and mobile devices, not just desktops in the office. Encryption provides safe-harbor protection under most state breach-notification laws, so a missing encryption control on laptops is a direct liability multiplier.",
  },

  // ──────────────────────────────────────────────
  // Vendor / third-party risk
  // ──────────────────────────────────────────────
  {
    id: "evidence_vendor_inventory",
    controlCategory: "vendor_risk",
    artifactName: "Vendor list with access scope",
    format: "CSV or XLSX spreadsheet plus a written summary of critical vendors",
    whereToFind:
      "Start with your accounts payable system for the list of vendors paid in the last year. For each one, document what data they access or handle, whether they have a login to your systems, and whether they have signed a data protection agreement. Critical vendors (your MSP, your payroll provider, your cloud email host, your backup platform) should be flagged separately.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "recommended",
      travelers: "required",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "Who has remote access to your systems, how that access is authenticated (MFA? SSO?), and what data they handle. A breach at a vendor is increasingly common as a claim trigger, and underwriters want to see that you know your vendor attack surface.",
  },
  {
    id: "evidence_vendor_due_diligence",
    controlCategory: "vendor_risk",
    artifactName: "Third-party security attestations for critical vendors",
    format: "PDF SOC 2, ISO 27001, or penetration test summary reports",
    whereToFind:
      "Ask each critical vendor for their most recent SOC 2 Type II report and their ISO 27001 certificate if they have one. Most reputable B2B SaaS vendors have a Trust Center (trust.vendor.com) with these documents available for download or under NDA. If they will not share a full report, a SOC 2 bridge letter is the minimum acceptable substitute.",
    carrierRequirements: {
      coalition: "unspecified",
      cowbell: "recommended",
      travelers: "recommended",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "Evidence that you asked. A folder full of SOC 2 reports for your top 5 vendors is a strong signal. Underwriters understand you cannot SOC-2-audit your own vendors, but they want to see that you are using the vendors' own attestations as part of onboarding.",
  },

  // ──────────────────────────────────────────────
  // Network segmentation
  // ──────────────────────────────────────────────
  {
    id: "evidence_network_diagram",
    controlCategory: "network_segmentation",
    artifactName: "Network diagram showing segmentation",
    format: "PDF diagram exported from Visio, Lucidchart, or PowerPoint",
    whereToFind:
      "If you have an IT provider or MSP, they should be able to produce this. The diagram should show: internet connection, firewall, DMZ for public-facing servers, internal network for workstations, separate segment for critical systems (finance, HR, clinical, backups), and remote access paths. If you do not have a formal diagram, a dated sketch in the IR plan is a better-than-nothing starting point.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "recommended",
      travelers: "unspecified",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "Whether a ransomware infection on one workstation can reach the backup server, the domain controller, and the financial systems without crossing any segmentation boundary. A flat network where everything sees everything is the architecture carriers flag first.",
  },
  {
    id: "evidence_firewall_config_logs",
    controlCategory: "network_segmentation",
    artifactName: "Firewall configuration and log retention evidence",
    format: "Screenshot of firewall rules and logging configuration plus the log retention duration",
    whereToFind:
      "Open your firewall admin console (Fortinet FortiGate, SonicWall, Cisco Meraki, pfSense, Ubiquiti) and screenshot the rule list and the logging and retention settings. The retention duration is the key number: 30 days minimum, 90 days common, 12 months for mature programs.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "unspecified",
      travelers: "recommended",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "Whether the firewall actually logs, and whether the logs are retained long enough to investigate an incident that only becomes obvious weeks after it started. Default firewall installs often have logging off or keeping only a day or two of history.",
  },

  // ──────────────────────────────────────────────
  // Logging and monitoring
  // ──────────────────────────────────────────────
  {
    id: "evidence_centralized_log_retention",
    controlCategory: "logging_monitoring",
    artifactName: "Centralized log retention proof",
    format: "Screenshot of retention settings plus an optional SIEM export",
    whereToFind:
      "In Microsoft 365: Microsoft Purview > Audit > Search. Check the retention duration under the tenant's licensing tier. In Google Workspace: Admin console > Reports > Audit log. For firewall and endpoint logs: screenshot the retention settings in your SIEM or log aggregator (Datadog, Sumo Logic, Elastic, Graylog) or the native retention setting in your EDR console.",
    carrierRequirements: {
      coalition: "required",
      cowbell: "unspecified",
      travelers: "required",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "What is logged, where the logs go, how long they are kept, and whether anyone actually watches them. Underwriters want the evidence chain: if an incident happens today, can you reconstruct what an attacker touched 30 days ago? 90 days? The answer to that question should come from the log retention setting, not from guessing.",
  },
  {
    id: "evidence_soc_monitoring_summary",
    controlCategory: "logging_monitoring",
    artifactName: "SOC or MDR monitoring summary",
    format: "PDF monthly report from your MDR provider or a runbook describing internal monitoring",
    whereToFind:
      "If you use an MDR service (Arctic Wolf, Huntress, Red Canary, Expel, a local MSP with SOC-as-a-service), request a recent monthly report. It should show alert volumes, investigations performed, and mean time to detection. If monitoring is internal, document the on-call process, who watches which alerts, and what the escalation path looks like.",
    carrierRequirements: {
      coalition: "recommended",
      cowbell: "unspecified",
      travelers: "recommended",
      beazley: "unspecified",
    },
    detailUnderwritersLookFor:
      "Someone is watching the alerts and responds quickly. 'We have an EDR' and 'our EDR is monitored by a SOC' are worlds apart in underwriting impact. If your MDR provider is well-known, naming them alone is worth something; if monitoring is internal, documented runbooks and on-call rotation are the evidence.",
  },
]

/**
 * Look up an evidence item by ID. Returns null (not undefined) if not found
 * so callers can use `if (item) { ... }` without type coercion surprises.
 *
 * @param {string} id
 * @returns {import('./schema.js').EvidenceItem | null}
 */
export function getEvidenceById(id) {
  return EVIDENCE_CATALOG.find((e) => e.id === id) || null
}

/**
 * All evidence items for one control category. Used by the control accordion
 * to render the "evidence needed for this control" list below each control.
 *
 * @param {import('./schema.js').ControlCategory} category
 * @returns {import('./schema.js').EvidenceItem[]}
 */
export function getEvidenceForCategory(category) {
  return EVIDENCE_CATALOG.filter((e) => e.controlCategory === category)
}
