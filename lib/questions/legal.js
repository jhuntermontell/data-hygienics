/**
 * Legal Industry Cybersecurity Assessment Questions
 * Based on ABA Cybersecurity Guidelines + NIST CSF 2.0
 */

const SECTIONS = [
  // ── Section 1: Access Control & Client Data Protection (PR.AC) ──
  {
    title: "Access Control & Client Data Protection",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "legal_ac_1",
        text: "How is access to client files and case management systems controlled?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Client files contain privileged and confidential information. Access controls ensure only authorized personnel can view or modify case data.",
          insurerNote:
            "Insurers evaluate whether firms restrict access to sensitive client data on a need-to-know basis.",
          controlSlug: "access-control-client-files",
        },
        options: [
          { label: "Role-based access with matter-level permissions enforced automatically", weight: 1.0 },
          { label: "Role-based access assigned manually per matter", weight: 0.7 },
          { label: "Firm-wide shared access with some folder restrictions", weight: 0.35 },
          { label: "All attorneys and staff have unrestricted access to all files", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ac_2",
        text: "What level of multi-factor authentication (MFA) is enforced for accessing firm systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "MFA adds a second verification step beyond passwords, significantly reducing the risk of unauthorized access to client data.",
          insurerNote:
            "MFA on all systems, especially email and remote access, is a baseline requirement for most cyber insurance policies.",
          controlSlug: "mfa-enforcement",
        },
        options: [
          { label: "MFA enforced on all systems including email, VPN, and case management", weight: 1.0 },
          { label: "MFA enforced on email and remote access only", weight: 0.65 },
          { label: "MFA available but optional for users", weight: 0.3 },
          { label: "No MFA in use", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ac_3",
        text: "How is privileged access (administrator accounts) managed within the firm?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Privileged accounts can modify security settings, access all data, and install software. Tight controls prevent misuse or compromise.",
          insurerNote:
            "Firms without privileged access management are at higher risk of insider threats and lateral movement attacks.",
          controlSlug: "privileged-access-management",
        },
        options: [
          { label: "Dedicated admin accounts with just-in-time access and full audit logging", weight: 1.0 },
          { label: "Separate admin accounts with periodic access reviews", weight: 0.7 },
          { label: "Shared admin credentials among IT staff", weight: 0.3 },
          { label: "Attorneys or staff use admin accounts for daily work", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ac_4",
        text: "How does the firm enforce matter-based access control (ethical walls)?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Matter-based access control ensures that only attorneys and staff assigned to a case can access its files, supporting conflict-of-interest obligations.",
          insurerNote:
            "Ethical wall failures can lead to malpractice claims and regulatory sanctions, increasing liability exposure.",
          controlSlug: "matter-based-access-control",
        },
        options: [
          { label: "Automated ethical walls enforced in DMS and case management with conflict checks", weight: 1.0 },
          { label: "Manual ethical walls set up per matter with periodic reviews", weight: 0.65 },
          { label: "Ethical walls exist but are inconsistently applied", weight: 0.3 },
          { label: "No matter-based access restrictions in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ac_5",
        text: "What is the firm's process for revoking access when an employee or contractor departs?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Timely offboarding prevents former employees from accessing confidential client data after they leave the firm.",
          insurerNote:
            "Delayed access revocation is a common finding in breach investigations and can affect claims outcomes.",
          controlSlug: "offboarding-process",
        },
        options: [
          { label: "Automated deprovisioning triggered by HR system within hours of departure", weight: 1.0 },
          { label: "IT manually revokes access within 24 hours using a checklist", weight: 0.7 },
          { label: "Access revoked within a week on an ad-hoc basis", weight: 0.3 },
          { label: "No formal offboarding process for system access", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 2: Client Confidentiality & Data Handling (PR.DS) ──
  {
    title: "Client Confidentiality & Data Handling",
    nistCategory: "PR.DS",
    questions: [
      {
        key: "legal_ds_1",
        text: "How does the firm encrypt client communications (email and messaging)?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Encrypting client communications protects attorney-client privilege and prevents interception of sensitive case information.",
          insurerNote:
            "Unencrypted client communications are a significant liability factor in data breach claims.",
          controlSlug: "client-communication-encryption",
        },
        options: [
          { label: "End-to-end encryption enforced on all client communications with automated policies", weight: 1.0 },
          { label: "TLS encryption on email with optional end-to-end encryption for sensitive matters", weight: 0.7 },
          { label: "Standard email encryption (TLS in transit) only", weight: 0.35 },
          { label: "No encryption measures for client communications", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ds_2",
        text: "How does the firm classify and label documents by sensitivity level?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 3,
        tooltip: {
          explanation:
            "Document classification ensures that privileged, confidential, and public documents are handled with appropriate security measures.",
          insurerNote:
            "Firms with formal classification policies demonstrate stronger data governance during underwriting reviews.",
          controlSlug: "document-classification",
        },
        options: [
          { label: "Automated classification with enforced handling rules per sensitivity tier", weight: 1.0 },
          { label: "Defined classification tiers with manual labeling by attorneys", weight: 0.65 },
          { label: "Informal classification with no enforced handling rules", weight: 0.3 },
          { label: "No document classification system in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ds_3",
        text: "How does the firm share files securely with clients and opposing counsel?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Secure file sharing prevents accidental disclosure and ensures confidential documents are only accessed by intended recipients.",
          insurerNote:
            "Use of consumer-grade file sharing tools without access controls is flagged as a risk factor.",
          controlSlug: "secure-file-sharing",
        },
        options: [
          { label: "Firm-managed secure portal with access logging, expiration, and watermarking", weight: 1.0 },
          { label: "Approved secure file sharing platform with access controls", weight: 0.7 },
          { label: "Encrypted email attachments or password-protected files", weight: 0.35 },
          { label: "Standard email attachments or consumer cloud storage links", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ds_4",
        text: "How does the firm manage data retention and destruction for closed matters?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Proper retention and destruction policies reduce the volume of data at risk and ensure compliance with ethical obligations.",
          insurerNote:
            "Retaining data indefinitely increases breach impact; insurers favor firms with defined retention schedules.",
          controlSlug: "data-retention-policy",
        },
        options: [
          { label: "Automated retention schedules with certified destruction and client notification", weight: 1.0 },
          { label: "Documented retention policy with periodic manual destruction", weight: 0.65 },
          { label: "Informal retention practices with occasional cleanup", weight: 0.3 },
          { label: "No data retention or destruction policy", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ds_5",
        text: "How does the firm enforce conflict walls (information barriers) for sensitive matters?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Conflict walls prevent personnel working on adverse matters from accessing each other's case information, a core ethical obligation.",
          insurerNote:
            "Conflict wall failures can result in disqualification, malpractice claims, and reputational damage.",
          controlSlug: "conflict-walls",
        },
        options: [
          { label: "System-enforced information barriers integrated with conflict checking software", weight: 1.0 },
          { label: "Documented conflict wall procedures with manual DMS restrictions", weight: 0.65 },
          { label: "Verbal instructions to avoid accessing certain files", weight: 0.3 },
          { label: "No conflict wall procedures in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 3: Data Backup & Recovery (RC.RP) ──
  {
    title: "Data Backup & Recovery",
    nistCategory: "RC.RP",
    questions: [
      {
        key: "legal_br_1",
        text: "How frequently are firm data and client matter files backed up?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Regular backups ensure that client data can be restored after a ransomware attack, hardware failure, or accidental deletion.",
          insurerNote:
            "Backup frequency directly impacts recovery time objectives and is a key underwriting factor.",
          controlSlug: "backup-frequency",
        },
        options: [
          { label: "Continuously (real-time replication)", weight: 1.0 },
          { label: "Daily", weight: 0.85 },
          { label: "Weekly", weight: 0.5 },
          { label: "Monthly", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "legal_br_2",
        text: "How often are backup restoration procedures tested?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Untested backups may fail when needed most. Regular restoration tests verify that data can actually be recovered.",
          insurerNote:
            "Insurers increasingly require documented evidence of backup restoration testing.",
          controlSlug: "backup-testing",
        },
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Rarely or only after incidents", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "legal_br_3",
        text: "What offsite or air-gapped backup strategy does the firm use?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Offsite and air-gapped backups protect against ransomware that encrypts all network-connected storage.",
          insurerNote:
            "Air-gapped or immutable backups are considered essential for ransomware resilience.",
          controlSlug: "offsite-backup",
        },
        options: [
          { label: "Immutable cloud backups plus air-gapped offline copies", weight: 1.0 },
          { label: "Offsite cloud backups with versioning enabled", weight: 0.7 },
          { label: "Offsite backups without immutability or versioning", weight: 0.35 },
          { label: "All backups are on the same network with no offsite copies", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_br_4",
        text: "How does the firm ensure the integrity of archived matter data?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Archived matter data must remain intact and accessible for future reference, audits, or reopened cases.",
          insurerNote:
            "Corrupt or inaccessible archives can lead to malpractice exposure and compliance failures.",
          controlSlug: "matter-archive-integrity",
        },
        options: [
          { label: "Automated integrity checks with checksums and periodic validation", weight: 1.0 },
          { label: "Periodic manual spot-checks of archived data", weight: 0.6 },
          { label: "Archives stored but never verified", weight: 0.25 },
          { label: "No formal archiving or integrity verification process", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_br_5",
        text: "How mature are the firm's documented recovery procedures for critical systems?",
        type: "maturity",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Documented recovery procedures ensure the firm can restore operations quickly and consistently after a disruption.",
          insurerNote:
            "Firms with tested and documented recovery plans receive more favorable policy terms.",
          controlSlug: "recovery-procedures",
        },
      },
    ],
  },

  // ── Section 4: Endpoint Security (PR.PT) ──
  {
    title: "Endpoint Security",
    nistCategory: "PR.PT",
    questions: [
      {
        key: "legal_ep_1",
        text: "What type of endpoint protection is deployed on firm devices?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "Endpoint protection detects and prevents malware, ransomware, and other threats on laptops, desktops, and mobile devices.",
          insurerNote:
            "EDR (Endpoint Detection and Response) solutions are increasingly required by cyber insurance carriers.",
          controlSlug: "endpoint-protection",
        },
        options: [
          { label: "Managed EDR with 24/7 monitoring and automated response", weight: 1.0 },
          { label: "EDR solution deployed and monitored by internal IT", weight: 0.7 },
          { label: "Traditional antivirus with scheduled scans", weight: 0.35 },
          { label: "No endpoint protection deployed", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ep_2",
        text: "How frequently are operating systems and applications patched on firm devices?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 7,
        tooltip: {
          explanation:
            "Timely patching closes known vulnerabilities that attackers exploit to gain access to firm systems and client data.",
          insurerNote:
            "Unpatched systems are a leading cause of breaches and a common exclusion trigger in cyber policies.",
          controlSlug: "patching-frequency",
        },
        options: [
          { label: "Automatically within 24-48 hours of release for critical patches", weight: 1.0 },
          { label: "Weekly patch cycle", weight: 0.75 },
          { label: "Monthly patch cycle", weight: 0.5 },
          { label: "Quarterly or ad-hoc", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "legal_ep_3",
        text: "How does the firm manage mobile devices used for work (phones, tablets)?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "Mobile devices accessing client email and documents must be secured to prevent data loss from theft or compromise.",
          insurerNote:
            "Unmanaged mobile devices with access to client data represent significant breach exposure.",
          controlSlug: "mobile-device-policy",
        },
        options: [
          { label: "MDM enforced with remote wipe, encryption, and app management", weight: 1.0 },
          { label: "MDM enrolled with basic policies (passcode, encryption)", weight: 0.65 },
          { label: "Written BYOD policy but no technical enforcement", weight: 0.3 },
          { label: "No mobile device management or policy", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ep_4",
        text: "What security measures are in place for remote work environments?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "Remote work expands the attack surface. Multiple layers of security are needed to protect client data outside the office.",
          insurerNote:
            "Remote work security controls are heavily scrutinized in insurance applications and audits.",
          controlSlug: "remote-work-security",
        },
        options: [
          { label: "All of the above", weight: 1.0 },
          { label: "VPN required for all remote access", weight: 0.2 },
          { label: "Firm-managed devices required for remote work", weight: 0.2 },
          { label: "Endpoint compliance checks before network access", weight: 0.2 },
          { label: "Virtual desktop infrastructure (VDI) for sensitive matters", weight: 0.2 },
          { label: "Split tunneling disabled on VPN connections", weight: 0.2 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "legal_ep_5",
        text: "How is full-disk encryption managed on firm laptops and workstations?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Full-disk encryption protects client data if a device is lost or stolen, a critical safeguard for attorneys who travel.",
          insurerNote:
            "Device encryption is a standard requirement for cyber insurance covering portable devices.",
          controlSlug: "device-encryption",
        },
        options: [
          { label: "Enforced via policy with centralized key management and compliance reporting", weight: 1.0 },
          { label: "Enforced on all firm-owned devices via MDM or GPO", weight: 0.75 },
          { label: "Enabled on most devices but not centrally managed", weight: 0.4 },
          { label: "No full-disk encryption policy or enforcement", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 5: Email & Communication Security (PR.AT + DE.CM) ──
  {
    title: "Email & Communication Security",
    nistCategory: "PR.AT + DE.CM",
    questions: [
      {
        key: "legal_em_1",
        text: "How does the firm secure email communications containing client-privileged information?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Email is the primary communication channel for legal work. Securing it protects attorney-client privilege.",
          insurerNote:
            "Email compromise is the most common attack vector against law firms and a leading cause of claims.",
          controlSlug: "email-encryption-client",
        },
        options: [
          { label: "Automatic encryption rules for sensitive content with DLP integration", weight: 1.0 },
          { label: "One-click encryption option available to all attorneys", weight: 0.65 },
          { label: "Manual encryption available but rarely used", weight: 0.3 },
          { label: "No email encryption capabilities", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_em_2",
        text: "How frequently does the firm conduct phishing awareness training for all personnel?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Phishing is the top attack vector against law firms. Regular training helps staff recognize and report suspicious messages.",
          insurerNote:
            "Documented phishing training programs are a baseline requirement for most cyber insurance policies.",
          controlSlug: "phishing-training",
        },
        options: [
          { label: "Monthly simulated phishing with ongoing training modules", weight: 1.0 },
          { label: "Quarterly training and simulations", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Rarely or only during onboarding", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "legal_em_3",
        text: "Does the firm use a dedicated business domain for all official communications?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "A dedicated business domain enables proper email security controls and prevents confusion with personal accounts.",
          insurerNote:
            "Use of free email providers (Gmail, Yahoo) for client communications is a red flag for insurers.",
          controlSlug: "business-domain",
        },
        options: [
          { label: "Dedicated firm domain with enforced email security policies for all personnel", weight: 1.0 },
          { label: "Dedicated domain for attorneys, mixed use for staff", weight: 0.5 },
          { label: "Mix of firm domain and personal email accounts", weight: 0.2 },
          { label: "Free email provider used for firm communications", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_em_4",
        text: "What email authentication protocols (SPF, DKIM, DMARC) are configured on the firm's domain?",
        type: "multiselect",
        nistFunction: "Detect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Email authentication protocols prevent attackers from spoofing the firm's domain to send fraudulent messages to clients.",
          insurerNote:
            "DMARC enforcement is increasingly expected by insurers to mitigate business email compromise risk.",
          controlSlug: "dmarc-configuration",
        },
        options: [
          { label: "All of the above", weight: 1.0 },
          { label: "SPF configured and validated", weight: 0.2 },
          { label: "DKIM signing enabled", weight: 0.2 },
          { label: "DMARC set to reject or quarantine", weight: 0.25 },
          { label: "DMARC reporting monitored regularly", weight: 0.2 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "legal_em_5",
        text: "What process exists for reporting and handling suspicious emails?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 17,
        tooltip: {
          explanation:
            "A clear reporting process enables rapid response to phishing attempts before they lead to compromise.",
          insurerNote:
            "Firms with established reporting workflows demonstrate stronger security culture to underwriters.",
          controlSlug: "suspicious-email-reporting",
        },
        options: [
          { label: "One-click report button with automated triage and response workflow", weight: 1.0 },
          { label: "Dedicated email address or form for reporting with documented response SLA", weight: 0.7 },
          { label: "Informal process of forwarding to IT", weight: 0.3 },
          { label: "No process for reporting suspicious emails", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 6: Network Security (PR.AC) ──
  {
    title: "Network Security",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "legal_ns_1",
        text: "How is the firm's wireless network secured?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Unsecured WiFi can allow attackers to intercept client communications and access firm systems.",
          insurerNote:
            "WiFi security configuration is evaluated as part of network security assessments.",
          controlSlug: "wifi-security",
        },
        options: [
          { label: "WPA3 Enterprise with certificate-based authentication and separate guest network", weight: 1.0 },
          { label: "WPA2/3 Enterprise with RADIUS authentication", weight: 0.7 },
          { label: "WPA2 Personal with a shared password", weight: 0.3 },
          { label: "Open WiFi or WEP encryption", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ns_2",
        text: "How is the firm's network segmented to protect sensitive systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network segmentation limits lateral movement by isolating client data systems from general network traffic.",
          insurerNote:
            "Flat networks without segmentation significantly increase the blast radius of a breach.",
          controlSlug: "network-segmentation",
        },
        options: [
          { label: "Micro-segmented network with zero-trust architecture and continuous verification", weight: 1.0 },
          { label: "VLANs separating client data, guest, and operational networks", weight: 0.7 },
          { label: "Basic segmentation between guest and internal networks only", weight: 0.35 },
          { label: "Flat network with no segmentation", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ns_3",
        text: "What firewall protection does the firm have in place?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 13,
        tooltip: {
          explanation:
            "Firewalls control traffic flow and prevent unauthorized access to firm systems from external networks.",
          insurerNote:
            "Next-generation firewalls with intrusion prevention are considered a minimum security standard.",
          controlSlug: "firewall-protection",
        },
        options: [
          { label: "Next-gen firewall with IPS, application control, and threat intelligence feeds", weight: 1.0 },
          { label: "Next-gen firewall with basic rule sets and logging", weight: 0.7 },
          { label: "Standard stateful firewall with minimal rules", weight: 0.35 },
          { label: "No dedicated firewall or using ISP-provided router only", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ns_4",
        text: "How does the firm provide secure remote access to its network?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Secure remote access ensures that attorneys working from home, court, or travel can safely access client data.",
          insurerNote:
            "VPN with MFA is a minimum expectation; zero-trust network access is increasingly preferred.",
          controlSlug: "vpn-remote-access",
        },
        options: [
          { label: "Zero-trust network access with continuous device and user verification", weight: 1.0 },
          { label: "Always-on VPN with MFA and device compliance checks", weight: 0.75 },
          { label: "VPN available with MFA required", weight: 0.5 },
          { label: "Direct RDP or remote access without VPN", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ns_5",
        text: "How frequently are network access permissions and firewall rules reviewed?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Regular access reviews ensure that network permissions remain appropriate and outdated rules are removed.",
          insurerNote:
            "Stale access rules and over-permissive configurations are common audit findings.",
          controlSlug: "network-access-review",
        },
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Rarely or only after incidents", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 7: Incident Response (RS.RP) ──
  {
    title: "Incident Response",
    nistCategory: "RS.RP",
    questions: [
      {
        key: "legal_ir_1",
        text: "How mature is the firm's incident response plan?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "An incident response plan provides structured guidance for containing and recovering from security incidents affecting client data.",
          insurerNote:
            "A documented and tested IR plan is a baseline requirement for cyber insurance eligibility.",
          controlSlug: "ir-plan-maturity",
        },
      },
      {
        key: "legal_ir_2",
        text: "How does the firm handle client notification following a data breach?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Attorneys have ethical obligations to notify clients when their data is compromised. Timely notification preserves trust.",
          insurerNote:
            "Breach notification procedures and timelines are closely evaluated during claims investigations.",
          controlSlug: "client-notification-procedures",
        },
        options: [
          { label: "Documented notification plan with legal templates, timelines, and assigned roles", weight: 1.0 },
          { label: "General notification procedures with case-by-case assessment", weight: 0.6 },
          { label: "Ad-hoc notification handled by managing partner", weight: 0.3 },
          { label: "No client notification procedures defined", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ir_3",
        text: "How prepared is the firm for bar association reporting obligations after a breach?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Many jurisdictions require reporting breaches to bar associations or regulatory bodies. Preparation ensures compliance.",
          insurerNote:
            "Failure to meet bar association reporting requirements can compound regulatory exposure.",
          controlSlug: "bar-association-reporting",
        },
        options: [
          { label: "Documented procedures mapped to each jurisdiction's reporting requirements", weight: 1.0 },
          { label: "General awareness of reporting obligations with legal counsel identified", weight: 0.6 },
          { label: "Minimal awareness of bar association reporting requirements", weight: 0.25 },
          { label: "Unaware of bar association reporting obligations", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ir_4",
        text: "What is the firm's cyber insurance coverage status?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Cyber insurance provides financial protection against breach costs, client claims, and regulatory penalties.",
          insurerNote:
            "Appropriate coverage limits and first-party/third-party coverage are essential for law firms.",
          controlSlug: "cyber-insurance",
        },
        options: [
          { label: "Comprehensive policy with coverage reviewed annually and limits aligned to firm size", weight: 1.0 },
          { label: "Active cyber insurance policy with standard coverage", weight: 0.7 },
          { label: "Basic policy with minimal coverage or high deductibles", weight: 0.35 },
          { label: "No cyber insurance coverage", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ir_5",
        text: "How does the firm ensure secure communication among the incident response team during a breach?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "If firm email is compromised, the IR team needs an alternative secure channel to coordinate response without being monitored by the attacker.",
          insurerNote:
            "Pre-established out-of-band communication channels demonstrate mature incident preparedness.",
          controlSlug: "ir-team-communication",
        },
        options: [
          { label: "Pre-established out-of-band communication channels tested during IR exercises", weight: 1.0 },
          { label: "Designated alternate communication platform identified but not tested", weight: 0.6 },
          { label: "Plan to use personal phones/email if needed", weight: 0.25 },
          { label: "No alternate communication plan exists", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ── Section 8: Vendor & Technology Management (GV.SC) ──
  {
    title: "Vendor & Technology Management",
    nistCategory: "GV.SC",
    questions: [
      {
        key: "legal_vm_1",
        text: "How does the firm assess the security posture of cloud services used for client data?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Cloud services storing client data must meet appropriate security standards to maintain confidentiality obligations.",
          insurerNote:
            "Firms using unevaluated cloud services for client data face increased underwriting scrutiny.",
          controlSlug: "cloud-service-assessment",
        },
        options: [
          { label: "Formal assessment framework with SOC 2 review, data residency checks, and contractual requirements", weight: 1.0 },
          { label: "Vendor security questionnaire and review of certifications before adoption", weight: 0.7 },
          { label: "Informal evaluation based on vendor reputation", weight: 0.3 },
          { label: "No security assessment of cloud services", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_vm_2",
        text: "How does the firm evaluate legal technology vendors (practice management, e-billing, DMS)?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Legal tech vendors have deep access to client data and firm operations. Security assessments protect against supply chain risk.",
          insurerNote:
            "Vendor compromise is an increasingly common breach vector in the legal sector.",
          controlSlug: "legal-tech-vendor-review",
        },
        options: [
          { label: "Comprehensive vendor risk assessment with ongoing monitoring and contractual SLAs", weight: 1.0 },
          { label: "Security review during procurement with periodic reassessment", weight: 0.7 },
          { label: "Basic security questions during initial vendor selection", weight: 0.35 },
          { label: "No security evaluation of legal tech vendors", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_vm_3",
        text: "How does the firm manage data sharing agreements with vendors and co-counsel?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Data sharing agreements define how client data is handled, stored, and protected when shared with third parties.",
          insurerNote:
            "Absence of data sharing agreements complicates liability determination during breach investigations.",
          controlSlug: "data-sharing-agreements",
        },
        options: [
          { label: "Standardized agreements with data protection clauses, breach notification, and audit rights", weight: 1.0 },
          { label: "Data sharing agreements used for most vendor relationships", weight: 0.65 },
          { label: "Agreements used only for major vendors or when requested", weight: 0.3 },
          { label: "No formal data sharing agreements in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_vm_4",
        text: "How does the firm assess the security of e-discovery vendors and platforms?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "E-discovery platforms handle large volumes of privileged and sensitive documents, making their security critical.",
          insurerNote:
            "E-discovery vendor breaches can expose massive amounts of privileged data across multiple matters.",
          controlSlug: "ediscovery-vendor-security",
        },
        options: [
          { label: "Formal security assessment with SOC 2, encryption requirements, and access audit trails", weight: 1.0 },
          { label: "Security questionnaire and certification review before engagement", weight: 0.65 },
          { label: "Reliance on vendor reputation and referrals", weight: 0.3 },
          { label: "No security assessment of e-discovery vendors", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_vm_5",
        text: "How frequently does the firm audit or reassess critical vendor security?",
        type: "frequency",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Vendor security postures change over time. Regular reassessment ensures continued protection of client data.",
          insurerNote:
            "Annual vendor reassessment is considered a best practice and is often required by insurers.",
          controlSlug: "vendor-audit-frequency",
        },
        options: [
          { label: "Quarterly", weight: 1.0 },
          { label: "Semi-annually", weight: 0.75 },
          { label: "Annually", weight: 0.5 },
          { label: "Rarely or only when issues arise", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 9: Ethics & Compliance (GV) ──
  {
    title: "Ethics & Compliance",
    nistCategory: "GV",
    questions: [
      {
        key: "legal_ec_1",
        text: "How does the firm address ABA Model Rule 1.6(c) obligations for technology competence?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 17,
        tooltip: {
          explanation:
            "ABA Model Rule 1.6(c) requires attorneys to make reasonable efforts to prevent unauthorized access to client information.",
          insurerNote:
            "Demonstrated compliance with ABA ethics rules signals mature security governance to underwriters.",
          controlSlug: "aba-ethics-compliance",
        },
        options: [
          { label: "Formal compliance program with regular audits, training, and documented safeguards", weight: 1.0 },
          { label: "Documented policies addressing technology competence with periodic review", weight: 0.65 },
          { label: "General awareness among partners with informal practices", weight: 0.3 },
          { label: "No specific program addressing ABA cybersecurity ethics obligations", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ec_2",
        text: "How mature is the firm's overall information security policy framework?",
        type: "maturity",
        nistFunction: "Govern",
        cisControl: 17,
        tooltip: {
          explanation:
            "A comprehensive security policy framework provides the foundation for all cybersecurity activities and demonstrates governance commitment.",
          insurerNote:
            "A mature, documented security policy framework is essential for favorable insurance terms and coverage.",
          controlSlug: "security-policy-maturity",
        },
      },
      {
        key: "legal_ec_3",
        text: "How frequently does the firm conduct a formal cybersecurity risk assessment?",
        type: "frequency",
        nistFunction: "Govern",
        cisControl: 17,
        tooltip: {
          explanation:
            "Regular risk assessments identify gaps in security controls and prioritize remediation of vulnerabilities.",
          insurerNote:
            "Annual risk assessments are a standard requirement for cyber insurance renewals.",
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
        key: "legal_ec_4",
        text: "How does the firm protect client trust accounts from cyber threats?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 17,
        tooltip: {
          explanation:
            "Client trust accounts (IOLTA) are high-value targets for business email compromise and wire fraud schemes.",
          insurerNote:
            "Trust account compromise is one of the most common and costly cyber claims against law firms.",
          controlSlug: "trust-account-protection",
        },
        options: [
          { label: "Multi-layer verification for all transactions with dual authorization and callback procedures", weight: 1.0 },
          { label: "Dual authorization required for transfers above a threshold", weight: 0.65 },
          { label: "Single-person authorization with verbal confirmation for large transfers", weight: 0.3 },
          { label: "Standard online banking with no additional verification", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "legal_ec_5",
        text: "How comprehensive is the firm's cybersecurity training program for attorneys and staff?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Comprehensive training ensures all personnel understand their role in protecting client data and firm systems.",
          insurerNote:
            "Firms with documented, role-based training programs demonstrate stronger security culture to underwriters.",
          controlSlug: "training-program",
        },
        options: [
          { label: "Role-based training with CLE-eligible cybersecurity modules, phishing simulations, and annual refreshers", weight: 1.0 },
          { label: "Annual firm-wide training covering key topics with attendance tracking", weight: 0.65 },
          { label: "Onboarding training only with occasional reminders", weight: 0.3 },
          { label: "No formal cybersecurity training program", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },
  // ──────────────────────────────────────────────
  // Infrastructure Health (ID.AM)
  // ──────────────────────────────────────────────
  {
    id: "legal_infrastructure",
    title: "Infrastructure Health",
    nistCategory: "ID.AM",
    questions: [
      {
        key: "legal_infra_workstation_age",
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
        key: "legal_infra_server_age",
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
        key: "legal_infra_network_age",
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
