/**
 * Government / Defense Contractor Cybersecurity Assessment Questions
 * Based on CMMC 2.0 + NIST SP 800-171
 */

const SECTIONS = [
  // ── Section 1: Access Control (AC) ──
  {
    title: "Access Control",
    nistCategory: "AC",
    questions: [
      {
        key: "gov_ac_1",
        text: "How does the organization restrict access to Controlled Unclassified Information (CUI)?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "CUI access must be limited to authorized individuals with a legitimate need. NIST 800-171 requires strict access control policies.",
          insurerNote:
            "Failure to restrict CUI access can result in loss of government contracts and significant legal liability.",
          controlSlug: "cui-access-restrictions",
        },
        options: [
          { label: "Automated role-based access with CUI-specific permissions, need-to-know enforcement, and continuous monitoring", weight: 1.0 },
          { label: "Role-based access with CUI designated systems and periodic access reviews", weight: 0.7 },
          { label: "Basic access controls with informal need-to-know practices", weight: 0.3 },
          { label: "No specific access restrictions for CUI", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ac_2",
        text: "What level of multi-factor authentication (MFA) is enforced across all organizational systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "NIST 800-171 requires MFA for network access to privileged and non-privileged accounts on systems processing CUI.",
          insurerNote:
            "MFA on all systems handling CUI is a CMMC Level 2 requirement and a cyber insurance baseline.",
          controlSlug: "mfa-all-systems",
        },
        options: [
          { label: "Phishing-resistant MFA (FIDO2/PIV) enforced on all systems including local and remote access", weight: 1.0 },
          { label: "MFA enforced on all network and remote access with app-based authenticators", weight: 0.75 },
          { label: "MFA on remote access and privileged accounts only", weight: 0.4 },
          { label: "No MFA implementation", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ac_3",
        text: "How is privileged access managed for systems processing CUI?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Privileged accounts on CUI systems require additional controls including separation of duties and enhanced monitoring.",
          insurerNote:
            "Privileged access compromise on CUI systems can result in DFARS violations and contract termination.",
          controlSlug: "privileged-access-management",
        },
        options: [
          { label: "PAM solution with just-in-time access, session recording, and automated credential rotation", weight: 1.0 },
          { label: "Dedicated admin accounts with periodic rotation and access logging", weight: 0.7 },
          { label: "Separate admin accounts without centralized management", weight: 0.35 },
          { label: "Shared admin credentials or daily use of privileged accounts", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ac_4",
        text: "How are remote access connections to CUI systems controlled?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "NIST 800-171 requires organizations to monitor and control remote access sessions and encrypt all remote connections.",
          insurerNote:
            "Unsecured remote access to CUI environments is a critical compliance gap and insurance risk factor.",
          controlSlug: "remote-access-controls",
        },
        options: [
          { label: "Encrypted VPN with MFA, device compliance checks, session monitoring, and automatic timeout", weight: 1.0 },
          { label: "Encrypted VPN with MFA and session logging", weight: 0.7 },
          { label: "VPN required but without consistent MFA or monitoring", weight: 0.35 },
          { label: "Remote access without VPN encryption or authentication controls", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ac_5",
        text: "How does the organization manage session controls (timeout, lock, termination)?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Session management prevents unauthorized access through unattended workstations and enforces re-authentication after inactivity.",
          insurerNote:
            "Session control failures can expose CUI on shared or public-facing systems.",
          controlSlug: "session-management",
        },
        options: [
          { label: "Automated session lock after 15 minutes, forced re-authentication, and configurable timeout policies per system type", weight: 1.0 },
          { label: "Session lock enforced with 30-minute timeout across CUI systems", weight: 0.7 },
          { label: "Screen lock policies exist but are inconsistently enforced", weight: 0.3 },
          { label: "No session management controls in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ac_6",
        text: "How frequently are user access rights reviewed and recertified?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Regular access reviews ensure that permissions remain appropriate as roles change and employees transition.",
          insurerNote:
            "Access review frequency is evaluated during CMMC assessments and insurance audits.",
          controlSlug: "access-review-frequency",
        },
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Semi-annually", weight: 0.5 },
          { label: "Annually", weight: 0.25 },
          { label: "Never", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 2: CUI Protection (MP + SC) ──
  {
    title: "Controlled Unclassified Information (CUI) Protection",
    nistCategory: "MP + SC",
    questions: [
      {
        key: "gov_cui_1",
        text: "How does the organization handle CUI marking and labeling requirements?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 3,
        tooltip: {
          explanation:
            "Proper CUI marking ensures that all personnel can identify controlled information and apply appropriate handling procedures.",
          insurerNote:
            "Unmarked CUI increases the risk of inadvertent disclosure and DFARS non-compliance.",
          controlSlug: "cui-marking-handling",
        },
        options: [
          { label: "Automated CUI detection and marking tools with enforced labeling workflows and compliance checks", weight: 1.0 },
          { label: "Documented marking procedures with manual labeling and periodic compliance audits", weight: 0.7 },
          { label: "Basic CUI marking guidelines with inconsistent application", weight: 0.3 },
          { label: "No CUI marking or labeling procedures", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cui_2",
        text: "How is CUI encrypted at rest and in transit?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "NIST 800-171 requires FIPS-validated cryptographic mechanisms to protect the confidentiality of CUI at rest and in transit.",
          insurerNote:
            "Non-FIPS encryption of CUI is a compliance gap that can void coverage for related breaches.",
          controlSlug: "cui-encryption",
        },
        options: [
          { label: "All of the above", weight: 1.0 },
          { label: "FIPS 140-2/3 validated encryption at rest", weight: 0.25 },
          { label: "FIPS 140-2/3 validated encryption in transit", weight: 0.25 },
          { label: "Centralized key management with rotation policies", weight: 0.25 },
          { label: "Encryption status monitoring and compliance reporting", weight: 0.2 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "gov_cui_3",
        text: "How does the organization restrict where CUI can be stored?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "CUI storage must be limited to authorized systems and locations to prevent unauthorized access and data sprawl.",
          insurerNote:
            "CUI stored on unauthorized systems expands the compliance boundary and increases breach exposure.",
          controlSlug: "cui-storage-restrictions",
        },
        options: [
          { label: "DLP-enforced storage restrictions with approved CUI repositories and automated enforcement", weight: 1.0 },
          { label: "Designated CUI storage locations with access controls and periodic audits", weight: 0.7 },
          { label: "Written policy designating approved storage but limited enforcement", weight: 0.3 },
          { label: "No restrictions on where CUI can be stored", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cui_4",
        text: "How does the organization handle secure disposal of CUI media and documents?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "CUI must be sanitized or destroyed using approved methods (NIST SP 800-88) when no longer needed.",
          insurerNote:
            "Improper CUI disposal can lead to data breaches and loss of government contracting eligibility.",
          controlSlug: "cui-secure-disposal",
        },
        options: [
          { label: "NIST 800-88 compliant sanitization with certificates of destruction and audit trail", weight: 1.0 },
          { label: "Documented disposal procedures with cross-cut shredding and secure media wiping", weight: 0.7 },
          { label: "Basic shredding for paper; standard deletion for electronic media", weight: 0.3 },
          { label: "No secure disposal procedures for CUI", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cui_5",
        text: "How does the organization protect removable media containing CUI?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "Removable media (USB drives, external hard drives) containing CUI must be encrypted, tracked, and physically secured.",
          insurerNote:
            "Lost or stolen removable media with CUI is a reportable incident under DFARS requirements.",
          controlSlug: "cui-media-protection",
        },
        options: [
          { label: "Encrypted removable media only, with device tracking, logging, and physical security controls", weight: 1.0 },
          { label: "Approved encrypted devices with usage logging", weight: 0.7 },
          { label: "Policy requiring encryption but no enforcement mechanism", weight: 0.3 },
          { label: "No controls on removable media containing CUI", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cui_6",
        text: "How well documented are the organization's CUI data flows?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 3,
        tooltip: {
          explanation:
            "Understanding where CUI is created, processed, stored, and transmitted is essential for defining the CMMC assessment boundary.",
          insurerNote:
            "Undocumented CUI data flows indicate gaps in scope understanding and increase compliance risk.",
          controlSlug: "cui-data-flow-documentation",
        },
        options: [
          { label: "Comprehensive data flow diagrams with automated discovery, regular updates, and boundary documentation", weight: 1.0 },
          { label: "Documented data flow diagrams reviewed and updated annually", weight: 0.65 },
          { label: "Partial documentation of major CUI data flows", weight: 0.3 },
          { label: "No CUI data flow documentation exists", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 3: System & Communication Protection (SC) ──
  {
    title: "System & Communication Protection",
    nistCategory: "SC",
    questions: [
      {
        key: "gov_sc_1",
        text: "How does the organization implement boundary protection for CUI systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 13,
        tooltip: {
          explanation:
            "Boundary protection controls communications at external and key internal network boundaries to prevent unauthorized data transfer.",
          insurerNote:
            "Boundary protection is a fundamental NIST 800-171 requirement and a critical security control for CUI environments.",
          controlSlug: "boundary-protection",
        },
        options: [
          { label: "Defense-in-depth with DMZ, managed boundary devices, and proxied connections with content inspection", weight: 1.0 },
          { label: "Firewall and IDS/IPS at network boundaries with documented rule sets", weight: 0.7 },
          { label: "Basic firewall at the perimeter with default rules", weight: 0.3 },
          { label: "No boundary protection specific to CUI systems", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_sc_2",
        text: "How is the CUI network environment segmented from general-purpose systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network segmentation isolates CUI processing environments and reduces the CMMC assessment scope.",
          insurerNote:
            "Proper segmentation limits breach impact and demonstrates mature security architecture.",
          controlSlug: "cui-network-segmentation",
        },
        options: [
          { label: "Dedicated CUI enclave with micro-segmentation, zero-trust access, and continuous monitoring", weight: 1.0 },
          { label: "CUI systems in a dedicated VLAN with firewall rules and access controls", weight: 0.7 },
          { label: "Basic separation of CUI and non-CUI systems with limited enforcement", weight: 0.35 },
          { label: "No network segmentation for CUI systems", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_sc_3",
        text: "How does the organization ensure encrypted communications for CUI data?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "All communications transmitting CUI must use FIPS-validated encryption to prevent interception and disclosure.",
          insurerNote:
            "Non-FIPS encrypted CUI transmissions are a compliance violation and potential coverage exclusion.",
          controlSlug: "encrypted-communications",
        },
        options: [
          { label: "FIPS-validated encryption on all communication channels with automated compliance verification", weight: 1.0 },
          { label: "FIPS-validated VPN and TLS for CUI communications with monitoring", weight: 0.7 },
          { label: "Standard TLS encryption without FIPS validation", weight: 0.35 },
          { label: "No encryption requirements for CUI communications", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_sc_4",
        text: "How does the organization verify the authenticity of communications sessions?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Session authenticity protects against man-in-the-middle attacks and ensures communications are between verified endpoints.",
          insurerNote:
            "Session authenticity controls are evaluated as part of CMMC Level 2 assessments.",
          controlSlug: "session-authenticity",
        },
        options: [
          { label: "Certificate-based session authentication with mutual TLS and certificate pinning", weight: 1.0 },
          { label: "Server certificate validation with session token integrity checks", weight: 0.65 },
          { label: "Basic HTTPS with standard certificate validation", weight: 0.3 },
          { label: "No session authenticity verification mechanisms", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_sc_5",
        text: "How does the organization manage collaborative computing devices (cameras, microphones, displays) in CUI areas?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "NIST 800-171 requires that collaborative computing devices in CUI areas be managed to prevent unauthorized audio/video capture.",
          insurerNote:
            "Unmanaged conferencing equipment in CUI spaces creates eavesdropping risks.",
          controlSlug: "collaborative-computing-devices",
        },
        options: [
          { label: "Physical and logical controls with automatic disable, indicator lights, and usage policies enforced", weight: 1.0 },
          { label: "Cameras and microphones disabled by default with manual activation for meetings", weight: 0.65 },
          { label: "Policy guidance to disable devices but no enforcement", weight: 0.3 },
          { label: "No controls on collaborative computing devices in CUI areas", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 4: Audit & Accountability (AU) ──
  {
    title: "Audit & Accountability",
    nistCategory: "AU",
    questions: [
      {
        key: "gov_au_1",
        text: "How mature is the organization's audit logging capability for CUI systems?",
        type: "maturity",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "Comprehensive audit logging is required by NIST 800-171 to create accountability and support incident investigation.",
          insurerNote:
            "Audit logging maturity directly affects the ability to investigate and scope breaches, impacting claims outcomes.",
          controlSlug: "audit-logging-maturity",
        },
      },
      {
        key: "gov_au_2",
        text: "How long are audit logs retained for CUI systems?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "Adequate log retention ensures that historical data is available for incident investigation and compliance audits.",
          insurerNote:
            "Insufficient log retention hampers breach investigation and can affect forensic findings.",
          controlSlug: "log-retention",
        },
        options: [
          { label: "Minimum 1 year online with 3+ years archived, with immutable storage and tamper detection", weight: 1.0 },
          { label: "1 year retention with secure archived storage", weight: 0.7 },
          { label: "90 days online retention with limited archiving", weight: 0.4 },
          { label: "Less than 30 days or no defined retention policy", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_au_3",
        text: "How frequently are audit logs reviewed for anomalies and security events?",
        type: "frequency",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "Regular log review enables early detection of unauthorized access attempts and security incidents affecting CUI.",
          insurerNote:
            "Log review frequency indicates the organization's ability to detect breaches in a timely manner.",
          controlSlug: "log-review-frequency",
        },
        options: [
          { label: "Continuously (real-time SIEM monitoring with automated alerting)", weight: 1.0 },
          { label: "Daily review of security events and alerts", weight: 0.75 },
          { label: "Weekly", weight: 0.45 },
          { label: "Monthly or ad-hoc", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "gov_au_4",
        text: "How does the organization protect audit records from unauthorized modification or deletion?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "NIST 800-171 requires protection of audit information and tools from unauthorized access, modification, and deletion.",
          insurerNote:
            "Tampered audit logs undermine forensic investigations and can invalidate breach evidence.",
          controlSlug: "audit-record-protection",
        },
        options: [
          { label: "WORM storage with separate access controls, integrity verification, and centralized SIEM with restricted access", weight: 1.0 },
          { label: "Centralized log server with restricted access and integrity monitoring", weight: 0.7 },
          { label: "Logs stored on separate systems with basic access controls", weight: 0.35 },
          { label: "Logs stored locally on the same systems they monitor", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_au_5",
        text: "What system-level monitoring is in place for CUI environments?",
        type: "multiselect",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "System-level monitoring provides visibility into activities on CUI systems beyond network monitoring.",
          insurerNote:
            "Comprehensive system monitoring capability is essential for breach detection and forensic readiness.",
          controlSlug: "system-level-monitoring",
        },
        options: [
          { label: "All of the above", weight: 1.0 },
          { label: "File integrity monitoring (FIM) on CUI systems", weight: 0.2 },
          { label: "User behavior analytics (UBA) for anomaly detection", weight: 0.2 },
          { label: "Process and command-line auditing", weight: 0.2 },
          { label: "Privileged session monitoring and recording", weight: 0.2 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 5: Configuration Management (CM) ──
  {
    title: "Configuration Management",
    nistCategory: "CM",
    questions: [
      {
        key: "gov_cm_1",
        text: "How does the organization establish and maintain baseline configurations for CUI systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Baseline configurations provide a known secure state for systems. Deviations from baselines can indicate compromise.",
          insurerNote:
            "STIG-compliant baselines demonstrate strong configuration management practices.",
          controlSlug: "baseline-configurations",
        },
        options: [
          { label: "DISA STIG or CIS Benchmark baselines with automated enforcement and continuous compliance monitoring", weight: 1.0 },
          { label: "Documented baselines with periodic compliance scanning", weight: 0.7 },
          { label: "Standard build images without formal baseline documentation", weight: 0.3 },
          { label: "No baseline configurations established", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cm_2",
        text: "How mature is the organization's change management process for CUI systems?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Formal change management ensures that modifications to CUI systems are authorized, documented, and do not introduce vulnerabilities.",
          insurerNote:
            "Uncontrolled changes are a leading cause of security misconfigurations and compliance gaps.",
          controlSlug: "change-management-maturity",
        },
      },
      {
        key: "gov_cm_3",
        text: "How does the organization enforce the principle of least functionality on CUI systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Least functionality means disabling unnecessary services, ports, and functions to reduce the attack surface on CUI systems.",
          insurerNote:
            "Systems with unnecessary services running increase the attack surface and compliance risk.",
          controlSlug: "least-functionality",
        },
        options: [
          { label: "Hardened configurations with only required services enabled, application whitelisting, and continuous verification", weight: 1.0 },
          { label: "Documented hardening standards applied during deployment with periodic audits", weight: 0.7 },
          { label: "Some unnecessary services disabled but no comprehensive hardening standard", weight: 0.3 },
          { label: "Default configurations with all services and features enabled", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cm_4",
        text: "How does the organization control software installation on CUI systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 2,
        tooltip: {
          explanation:
            "Restricting software installation prevents unauthorized or malicious applications from being introduced to CUI environments.",
          insurerNote:
            "Unrestricted software installation is a significant risk factor for malware introduction.",
          controlSlug: "software-restrictions",
        },
        options: [
          { label: "Application whitelisting with automated enforcement, approval workflows, and exception tracking", weight: 1.0 },
          { label: "Software installation restricted to IT with an approved software list", weight: 0.7 },
          { label: "Admin rights restricted but no formal approved software list", weight: 0.35 },
          { label: "Users can install software without restrictions", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cm_5",
        text: "How does the organization monitor CUI systems for configuration drift?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Configuration drift from baselines can introduce vulnerabilities. Continuous monitoring detects unauthorized changes.",
          insurerNote:
            "Configuration monitoring demonstrates ongoing compliance rather than point-in-time assessments.",
          controlSlug: "configuration-monitoring",
        },
        options: [
          { label: "Automated configuration monitoring with real-time drift detection and alerting", weight: 1.0 },
          { label: "Scheduled configuration compliance scans (weekly or more frequent)", weight: 0.7 },
          { label: "Periodic manual configuration audits", weight: 0.35 },
          { label: "No configuration drift monitoring", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 6: Incident Response (IR) ──
  {
    title: "Incident Response",
    nistCategory: "IR",
    questions: [
      {
        key: "gov_ir_1",
        text: "How mature is the organization's incident response plan for CUI-related incidents?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "A CUI-specific IR plan ensures compliance with DFARS reporting requirements and minimizes impact on government contracts.",
          insurerNote:
            "A tested IR plan specific to CUI incidents is a baseline requirement for defense contractor cyber insurance.",
          controlSlug: "ir-plan-maturity",
        },
      },
      {
        key: "gov_ir_2",
        text: "How prepared is the organization to meet the DFARS 72-hour incident reporting requirement?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "DFARS 252.204-7012 requires contractors to report cyber incidents affecting CUI to the DoD within 72 hours.",
          insurerNote:
            "Failure to meet the 72-hour reporting window can result in contract penalties and loss of future eligibility.",
          controlSlug: "dfars-72-hour-reporting",
        },
        options: [
          { label: "Documented 72-hour reporting procedures with pre-staged templates, DIBNet access verified, and regular drills", weight: 1.0 },
          { label: "Documented reporting procedures with DIBNet access and assigned responsibility", weight: 0.7 },
          { label: "Awareness of 72-hour requirement but no documented procedures", weight: 0.3 },
          { label: "Unaware of DFARS incident reporting requirements", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ir_3",
        text: "How does the organization track and document security incidents?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Incident tracking ensures consistent documentation, supports lessons learned, and provides evidence for compliance audits.",
          insurerNote:
            "Incident tracking documentation quality affects claims processing and forensic investigation outcomes.",
          controlSlug: "incident-tracking",
        },
        options: [
          { label: "Dedicated incident management system with automated workflows, evidence preservation, and metrics tracking", weight: 1.0 },
          { label: "Ticketing system used for incident tracking with documented procedures", weight: 0.65 },
          { label: "Spreadsheet or email-based incident tracking", weight: 0.3 },
          { label: "No formal incident tracking or documentation", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ir_4",
        text: "What is the organization's cyber insurance coverage status for government contract work?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Cyber insurance for defense contractors should cover CUI breach costs, government investigation cooperation, and contract-related liabilities.",
          insurerNote:
            "Defense contractor policies should specifically address DFARS obligations and government contract risks.",
          controlSlug: "cyber-insurance",
        },
        options: [
          { label: "Comprehensive policy tailored to government contracting with DFARS coverage, reviewed annually", weight: 1.0 },
          { label: "Active cyber insurance with general coverage applicable to government work", weight: 0.65 },
          { label: "Basic cyber insurance not specifically addressing government contract risks", weight: 0.3 },
          { label: "No cyber insurance coverage", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ir_5",
        text: "How frequently does the organization test its incident response plan?",
        type: "frequency",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Regular IR testing through tabletop exercises and simulations ensures the team is prepared for real incidents.",
          insurerNote:
            "Documented IR testing is a standard requirement for CMMC Level 2 and cyber insurance policies.",
          controlSlug: "ir-testing-frequency",
        },
        options: [
          { label: "Quarterly (tabletop exercises and annual full simulation)", weight: 1.0 },
          { label: "Semi-annually", weight: 0.75 },
          { label: "Annually", weight: 0.45 },
          { label: "Rarely or only after incidents", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 7: Risk Assessment (RA) ──
  {
    title: "Risk Assessment",
    nistCategory: "RA",
    questions: [
      {
        key: "gov_ra_1",
        text: "How frequently does the organization conduct formal risk assessments of CUI systems?",
        type: "frequency",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "NIST 800-171 requires periodic risk assessments to identify threats to CUI and inform security control selection.",
          insurerNote:
            "Regular risk assessments demonstrate proactive risk management and support favorable insurance terms.",
          controlSlug: "risk-assessment-frequency",
        },
        options: [
          { label: "Quarterly", weight: 1.0 },
          { label: "Semi-annually", weight: 0.75 },
          { label: "Annually", weight: 0.5 },
          { label: "Every few years", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "gov_ra_2",
        text: "How frequently does the organization perform vulnerability scanning on CUI systems?",
        type: "frequency",
        nistFunction: "Identify",
        cisControl: 7,
        tooltip: {
          explanation:
            "Regular vulnerability scanning identifies known weaknesses before attackers can exploit them.",
          insurerNote:
            "Vulnerability scanning frequency is a key metric in CMMC assessments and insurance evaluations.",
          controlSlug: "vulnerability-scanning",
        },
        options: [
          { label: "Continuously (automated scanning with real-time results)", weight: 1.0 },
          { label: "Weekly", weight: 0.75 },
          { label: "Monthly", weight: 0.5 },
          { label: "Quarterly", weight: 0.25 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "gov_ra_3",
        text: "How does the organization incorporate threat intelligence into risk management?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "Threat intelligence provides context on adversary tactics targeting the defense industrial base, informing prioritized defenses.",
          insurerNote:
            "Threat-informed risk management demonstrates advanced security program maturity.",
          controlSlug: "threat-intelligence",
        },
        options: [
          { label: "Integrated threat intelligence platform with automated indicator ingestion and defense adjustment", weight: 1.0 },
          { label: "Subscribed threat intelligence feeds reviewed regularly and incorporated into risk decisions", weight: 0.7 },
          { label: "Occasional review of public threat advisories (CISA, FBI)", weight: 0.35 },
          { label: "No threat intelligence capability", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ra_4",
        text: "How does the organization assess supply chain risk for CUI systems?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Supply chain risk assessment identifies threats from hardware, software, and service providers that could compromise CUI.",
          insurerNote:
            "Supply chain risk management is an emerging CMMC requirement and an increasing focus for insurers.",
          controlSlug: "supply-chain-risk",
        },
        options: [
          { label: "Formal SCRM program with vendor risk tiering, continuous monitoring, and approved product lists", weight: 1.0 },
          { label: "Risk assessment of critical suppliers with contractual security requirements", weight: 0.65 },
          { label: "Basic vendor evaluation during procurement", weight: 0.3 },
          { label: "No supply chain risk assessment for CUI systems", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ra_5",
        text: "How mature is the organization's overall risk management plan?",
        type: "maturity",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "A comprehensive risk management plan documents the organization's approach to identifying, assessing, and mitigating cybersecurity risks.",
          insurerNote:
            "A mature risk management plan is foundational to CMMC compliance and insurability.",
          controlSlug: "risk-management-plan-maturity",
        },
      },
    ],
  },

  // ── Section 8: System & Information Integrity (SI) ──
  {
    title: "System & Information Integrity",
    nistCategory: "SI",
    questions: [
      {
        key: "gov_si_1",
        text: "How frequently are security flaws remediated on CUI systems?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 7,
        tooltip: {
          explanation:
            "Timely flaw remediation (patching) closes known vulnerabilities that adversaries target on defense contractor systems.",
          insurerNote:
            "Patching cadence is a critical factor in CMMC assessments and insurance underwriting.",
          controlSlug: "flaw-remediation-frequency",
        },
        options: [
          { label: "Critical flaws within 48 hours, high within 7 days, with automated deployment", weight: 1.0 },
          { label: "Weekly patching cycle for all severity levels", weight: 0.75 },
          { label: "Monthly patching cycle", weight: 0.45 },
          { label: "Quarterly or ad-hoc", weight: 0.2 },
          { label: "Never or only during system upgrades", weight: 0.0 },
        ],
      },
      {
        key: "gov_si_2",
        text: "How does the organization protect CUI systems against malicious code?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "Multiple layers of malicious code protection are required to defend against advanced threats targeting the defense industrial base.",
          insurerNote:
            "Comprehensive anti-malware capabilities are a baseline requirement for CUI system protection.",
          controlSlug: "malicious-code-protection",
        },
        options: [
          { label: "All of the above", weight: 1.0 },
          { label: "Managed EDR with behavioral analysis on all endpoints", weight: 0.25 },
          { label: "Real-time scanning of inbound and outbound traffic", weight: 0.2 },
          { label: "Application whitelisting on CUI systems", weight: 0.2 },
          { label: "Automatic signature and engine updates", weight: 0.15 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "gov_si_3",
        text: "How does the organization monitor security alerts and advisories for CUI systems?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 7,
        tooltip: {
          explanation:
            "Monitoring security alerts from vendors, CISA, and threat intelligence sources enables proactive defense of CUI systems.",
          insurerNote:
            "Proactive alert monitoring demonstrates continuous vigilance expected for defense contractor environments.",
          controlSlug: "security-alerts-monitoring",
        },
        options: [
          { label: "Automated ingestion of CISA, vendor, and DIB-specific alerts with prioritized response workflows", weight: 1.0 },
          { label: "Regular monitoring of CISA and vendor security advisories with manual triage", weight: 0.65 },
          { label: "Occasional review of security advisories when issues are reported", weight: 0.3 },
          { label: "No systematic monitoring of security alerts", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_si_4",
        text: "How does the organization verify the integrity of CUI systems and software?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 10,
        tooltip: {
          explanation:
            "System integrity verification detects unauthorized changes to operating systems, software, and configurations on CUI systems.",
          insurerNote:
            "Integrity verification capabilities support forensic investigation and demonstrate advanced security maturity.",
          controlSlug: "system-integrity-verification",
        },
        options: [
          { label: "Automated integrity monitoring with baseline comparison, alerting, and rollback capabilities", weight: 1.0 },
          { label: "File integrity monitoring (FIM) on critical system files with alerting", weight: 0.7 },
          { label: "Periodic manual integrity checks using checksums", weight: 0.3 },
          { label: "No system integrity verification in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_si_5",
        text: "How does the organization manage spam and unauthorized email threats for CUI users?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Spam protection for CUI system users prevents phishing and malware delivery through email, a top attack vector.",
          insurerNote:
            "Advanced email protection is expected for all users with CUI system access.",
          controlSlug: "spam-protection",
        },
        options: [
          { label: "Advanced email security with sandboxing, URL rewriting, attachment analysis, and impersonation detection", weight: 1.0 },
          { label: "Cloud-based email security gateway with anti-phishing capabilities", weight: 0.7 },
          { label: "Basic spam filtering provided by the email platform", weight: 0.35 },
          { label: "No spam protection beyond default settings", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 9: Personnel Security & Training (PS + AT) ──
  {
    title: "Personnel Security & Training",
    nistCategory: "PS + AT",
    questions: [
      {
        key: "gov_ps_1",
        text: "How does the organization screen personnel who will access CUI systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Personnel screening ensures that individuals with access to CUI meet trustworthiness requirements.",
          insurerNote:
            "Personnel screening is a NIST 800-171 requirement and an important factor in insider threat mitigation.",
          controlSlug: "personnel-screening",
        },
        options: [
          { label: "Background checks with periodic reinvestigation, continuous evaluation, and clearance verification", weight: 1.0 },
          { label: "Background checks for all CUI-access personnel with periodic reinvestigation", weight: 0.7 },
          { label: "Background checks during hiring only", weight: 0.35 },
          { label: "No personnel screening for CUI system access", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ps_2",
        text: "How frequently do personnel with CUI access receive cybersecurity training?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "CUI-specific training ensures personnel understand handling requirements, marking, and their responsibilities under DFARS.",
          insurerNote:
            "Documented CUI training is a CMMC Level 2 requirement and a standard insurance expectation.",
          controlSlug: "cui-training-frequency",
        },
        options: [
          { label: "Monthly micro-training with annual comprehensive CUI handling course", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Annually", weight: 0.45 },
          { label: "Only during onboarding", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "gov_ps_3",
        text: "How mature is the organization's overall security awareness program?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "A mature security awareness program builds a culture of security that goes beyond compliance checkbox training.",
          insurerNote:
            "Organizations with mature awareness programs have significantly lower rates of successful social engineering attacks.",
          controlSlug: "security-awareness-maturity",
        },
      },
      {
        key: "gov_ps_4",
        text: "How does the organization address insider threat awareness?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Insider threat awareness helps employees recognize and report suspicious behavior that could indicate CUI compromise.",
          insurerNote:
            "Insider threat programs are increasingly required for CMMC Level 2 and evaluated during insurance assessments.",
          controlSlug: "insider-threat-awareness",
        },
        options: [
          { label: "Formal insider threat program with training, behavioral indicators, reporting mechanisms, and monitoring", weight: 1.0 },
          { label: "Insider threat training included in security awareness program with reporting channel", weight: 0.65 },
          { label: "Basic awareness of insider threats mentioned during training", weight: 0.3 },
          { label: "No insider threat awareness program", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_ps_5",
        text: "How does the organization provide role-based security training for specialized functions?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Role-based training ensures that system administrators, developers, and other specialized roles receive training specific to their security responsibilities.",
          insurerNote:
            "Role-based training demonstrates a tailored approach to security education beyond generic awareness.",
          controlSlug: "role-based-training",
        },
        options: [
          { label: "Customized training tracks per role with hands-on exercises, certifications, and annual refreshers", weight: 1.0 },
          { label: "Role-specific training modules for IT, admin, and privileged users", weight: 0.65 },
          { label: "Same general training for all roles with some additional guidance for IT", weight: 0.3 },
          { label: "No role-specific security training", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 10: CMMC Compliance Program (ID.GV) ──
  {
    title: "CMMC Compliance Program",
    nistCategory: "ID.GV",
    questions: [
      {
        key: "gov_cmmc_1",
        text: "What CMMC maturity level has the organization assessed itself against?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "Self-assessment against CMMC levels establishes the organization's current compliance posture and identifies gaps.",
          insurerNote:
            "CMMC assessment level directly affects eligibility for government contracts and insurance coverage.",
          controlSlug: "cmmc-level-assessment",
        },
        options: [
          { label: "CMMC Level 2 or higher assessed with third-party C3PAO validation completed or scheduled", weight: 1.0 },
          { label: "CMMC Level 2 self-assessment completed with documented results", weight: 0.7 },
          { label: "CMMC Level 1 self-assessment completed", weight: 0.4 },
          { label: "No CMMC assessment performed", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cmmc_2",
        text: "How comprehensive is the organization's System Security Plan (SSP)?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "The SSP documents all NIST 800-171 security controls, their implementation status, and the CUI system boundary.",
          insurerNote:
            "A complete SSP is a DFARS requirement and foundational to CMMC assessment readiness.",
          controlSlug: "ssp-documentation",
        },
        options: [
          { label: "Complete SSP covering all 110 controls with implementation details, boundary diagrams, and regular updates", weight: 1.0 },
          { label: "SSP documenting most controls with implementation descriptions", weight: 0.65 },
          { label: "Partial SSP with high-level control descriptions", weight: 0.3 },
          { label: "No System Security Plan documented", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cmmc_3",
        text: "How does the organization track and manage its Plan of Action and Milestones (POA&M)?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "POA&Ms track known security gaps with remediation plans and timelines, demonstrating commitment to continuous improvement.",
          insurerNote:
            "Active POA&M management shows underwriters that known risks are being addressed systematically.",
          controlSlug: "poam-tracking",
        },
        options: [
          { label: "Automated POA&M tracking with milestone dates, assigned owners, resource allocation, and executive reporting", weight: 1.0 },
          { label: "Documented POA&M with regular reviews and milestone tracking", weight: 0.7 },
          { label: "Basic list of known gaps without formal tracking or timelines", weight: 0.3 },
          { label: "No POA&M documented", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cmmc_4",
        text: "How prepared is the organization for a third-party CMMC assessment (C3PAO)?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "CMMC Level 2 requires third-party assessment. Preparation ensures evidence is organized and controls are demonstrable.",
          insurerNote:
            "Assessment readiness indicates the organization's confidence in its security posture.",
          controlSlug: "c3pao-readiness",
        },
        options: [
          { label: "Evidence repository organized per control, mock assessments completed, and C3PAO engaged or scheduled", weight: 1.0 },
          { label: "Evidence collection in progress with most controls documented", weight: 0.65 },
          { label: "Early stages of evidence gathering with gaps identified", weight: 0.35 },
          { label: "No preparation for third-party assessment", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_cmmc_5",
        text: "How mature is the organization's continuous monitoring program for CMMC compliance?",
        type: "maturity",
        nistFunction: "Detect",
        cisControl: 17,
        tooltip: {
          explanation:
            "Continuous monitoring ensures that security controls remain effective between assessments and compliance is maintained.",
          insurerNote:
            "Continuous monitoring maturity indicates sustainable compliance versus point-in-time certification.",
          controlSlug: "continuous-monitoring-maturity",
        },
      },
    ],
  },
  // ──────────────────────────────────────────────
  // Infrastructure Health (ID.AM)
  // ──────────────────────────────────────────────
  {
    id: "gov_infrastructure",
    title: "Infrastructure Health",
    nistCategory: "ID.AM",
    questions: [
      {
        key: "gov_infra_workstation_age",
        text: "How old are the oldest workstations (desktops/laptops) regularly used in your organization?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "Older workstations may no longer receive security updates from the manufacturer, making them vulnerable to known exploits that cannot be patched.",
          insurerNote:
            "End-of-life hardware is a risk factor in underwriting. Windows 10 reaches end of support in October 2025, affecting millions of business devices.",
          controlSlug: "asset-management",
        },
        options: [
          { label: "All workstations are less than 3 years old", weight: 1.0 },
          { label: "Most are less than 5 years old with a few older exceptions", weight: 0.65 },
          { label: "Many workstations are 5 to 7 years old", weight: 0.3 },
          { label: "Some workstations are over 7 years old or running unsupported operating systems", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_infra_server_age",
        text: "If your organization operates on-premises servers, how old are they?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "Servers older than 5 years are likely running outdated operating systems that no longer receive security patches. This is one of the most common findings in breach investigations.",
          insurerNote:
            "Unsupported server operating systems (Windows Server 2012, 2008) are often flagged as automatic exclusions in cyber insurance policies.",
          controlSlug: "asset-management",
        },
        options: [
          { label: "All servers are less than 3 years old and running supported operating systems", weight: 1.0 },
          { label: "Servers are 3 to 5 years old and running supported OS versions", weight: 0.7 },
          { label: "Some servers are over 5 years old or running older OS versions", weight: 0.3 },
          { label: "We have servers running unsupported operating systems (e.g., Server 2012 or earlier)", weight: 0.0 },
          { label: "We do not have on-premises servers (fully cloud-based)", weight: 1.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "gov_infra_network_age",
        text: "How old is your primary network equipment (firewall, switches, wireless access points)?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network equipment that is past its end-of-life date no longer receives firmware updates, leaving known vulnerabilities permanently unpatched.",
          insurerNote:
            "Outdated network equipment is increasingly flagged in carrier security scans. Some carriers run external vulnerability scans before binding coverage.",
          controlSlug: "network-security",
        },
        options: [
          { label: "All network equipment is current and under active vendor support", weight: 1.0 },
          { label: "Most equipment is current, with replacement planned for older items", weight: 0.7 },
          { label: "Some equipment is past vendor support but still in use", weight: 0.3 },
          { label: "We are not sure of the age or support status of our network equipment", weight: 0.0, flag: "discovery" },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

];

const TOTAL_QUESTIONS = SECTIONS.reduce(
  (sum, section) => sum + section.questions.length,
  0
);

export { SECTIONS, TOTAL_QUESTIONS };
