/**
 * General Business - NIST CSF + CIS Controls Questionnaire
 *
 * Answer types: singleselect | multiselect | frequency | maturity
 * Every question carries nistFunction, cisControl, and a tooltip.
 */

export const SECTIONS = [
  // ──────────────────────────────────────────────
  // 1. Access Control (PR.AC)
  // ──────────────────────────────────────────────
  {
    id: "access_control",
    title: "Access Control",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "ac_password_manager",
        text: "How does your organization manage passwords?",
        type: "singleselect",
        options: [
          { label: "Enterprise password manager enforced for all staff", weight: 1.0 },
          { label: "Password manager available but optional", weight: 0.6 },
          { label: "Shared spreadsheet or document", weight: 0.2 },
          { label: "Each person manages their own passwords", weight: 0.1 },
          { label: "No formal approach", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "A password manager generates and stores strong, unique passwords for every account. Without one, people tend to reuse passwords or write them down, making breaches much more likely.",
          insurerNote:
            "Insurers view password management as a foundational control. Reuse of passwords across systems is a leading cause of credential-stuffing attacks that trigger claims.",
          controlSlug: "password-management",
        },
      },
      {
        key: "ac_mfa_systems",
        text: "Which of your business systems require multi-factor authentication (MFA)?",
        type: "multiselect",
        options: [
          { label: "Email", weight: 0.2 },
          { label: "VPN / Remote Access", weight: 0.2 },
          { label: "Cloud Services (Microsoft 365, Google Workspace)", weight: 0.2 },
          { label: "Financial / Banking Systems", weight: 0.2 },
          { label: "All Systems", weight: 1.0 },
          { label: "None", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Multi-factor authentication adds a second verification step beyond your password, like a code from your phone. Even if someone steals your password, they can't get in without the second factor.",
          insurerNote:
            "MFA is the single most common requirement on cyber insurance applications. Lack of MFA on email and remote access is a top reason for claim denials.",
          controlSlug: "multi-factor-authentication",
        },
      },
      {
        key: "ac_privilege_management",
        text: "How are admin and privileged accounts managed in your organization?",
        type: "singleselect",
        options: [
          { label: "Dedicated admin accounts separate from daily-use accounts with logging", weight: 1.0 },
          { label: "Dedicated admin accounts but limited logging", weight: 0.7 },
          { label: "Some staff use the same account for admin and daily tasks", weight: 0.3 },
          { label: "Everyone has admin access on their machines", weight: 0.1 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "Privileged accounts (admin accounts) can change system settings, install software, and access sensitive data. Separating them from everyday accounts limits the damage if one account is compromised.",
          insurerNote:
            "Uncontrolled admin access is a common finding in breach investigations. Insurers increasingly require privileged access management as a condition of coverage.",
          controlSlug: "privileged-access-management",
        },
      },
      {
        key: "ac_offboarding",
        text: "When an employee leaves, how quickly is their access to systems revoked?",
        type: "singleselect",
        options: [
          { label: "Same day, via automated or documented checklist", weight: 1.0 },
          { label: "Within a few days, informally handled", weight: 0.5 },
          { label: "Eventually, when someone remembers", weight: 0.2 },
          { label: "We don't have a consistent process", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "Former employees who retain access to email, cloud drives, or business applications pose a serious security risk. Fast, reliable offboarding closes those gaps.",
          insurerNote:
            "Insider-threat claims often trace back to accounts that were never deactivated. Insurers look for a documented offboarding process with defined timelines.",
          controlSlug: "employee-offboarding",
        },
      },
      {
        key: "ac_access_review_frequency",
        text: "How often do you review who has access to critical systems and data?",
        type: "frequency",
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.8 },
          { label: "Annually", weight: 0.5 },
          { label: "Only when there's a problem", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 5,
        tooltip: {
          explanation:
            "Access reviews check that only the right people still have access to sensitive systems. Over time, permissions accumulate. People change roles but keep old access. Regular reviews catch this drift.",
          insurerNote:
            "Periodic access reviews demonstrate governance maturity and can lower premiums. They also reduce the blast radius of compromised credentials.",
          controlSlug: "access-reviews",
        },
      },
      {
        key: "ac_password_policy_maturity",
        text: "How mature is your organization's password policy?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "A password policy defines rules like minimum length, complexity, and rotation. Modern guidance (NIST 800-63B) favors longer passphrases over frequent rotation and bans known-breached passwords.",
          insurerNote:
            "Weak or outdated password policies are flagged in underwriting questionnaires. Policies aligned with current NIST guidance demonstrate security awareness.",
          controlSlug: "password-policy",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. Data Protection & Backup (PR.DS + RC.RP)
  // ──────────────────────────────────────────────
  {
    id: "data_protection",
    title: "Data Protection & Backup",
    nistCategory: "PR.DS + RC.RP",
    questions: [
      {
        key: "dp_backup_frequency",
        text: "How often are your critical business data and systems backed up?",
        type: "frequency",
        options: [
          { label: "Daily (or more frequently)", weight: 1.0 },
          { label: "Weekly", weight: 0.7 },
          { label: "Monthly", weight: 0.4 },
          { label: "Quarterly", weight: 0.2 },
          { label: "Annually", weight: 0.1 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Backups are copies of your data stored separately so you can restore operations after ransomware, hardware failure, or accidental deletion. More frequent backups mean less data lost.",
          insurerNote:
            "Backup frequency directly affects recovery time and ransom negotiation leverage. Daily or better is the standard expectation on cyber insurance applications.",
          controlSlug: "backup-frequency",
        },
      },
      {
        key: "dp_backup_testing",
        text: "How often do you test restoring from your backups?",
        type: "frequency",
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Only when we've had a problem", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "A backup you've never tested may not work when you need it. Restore tests verify that data is complete, uncorrupted, and that your team knows the recovery steps.",
          insurerNote:
            "Untested backups are a top cause of extended outages after ransomware. Insurers consider tested backups a strong indicator of recovery readiness.",
          controlSlug: "backup-testing",
        },
      },
      {
        key: "dp_offsite_storage",
        text: "Where are your backups stored?",
        type: "multiselect",
        options: [
          { label: "Offsite cloud storage (e.g., AWS S3, Azure Blob)", weight: 0.25 },
          { label: "Physically separate location (different building/city)", weight: 0.25 },
          { label: "Air-gapped or immutable storage", weight: 0.25 },
          { label: "All of the above", weight: 1.0 },
          { label: "Same server or network as production", weight: 0.05 },
          { label: "None / No backups", weight: 0.0 },
        ],
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "If backups live on the same network as your main systems, ransomware can encrypt them too. Offsite, air-gapped, or immutable backups survive even a total network compromise.",
          insurerNote:
            "Ransomware that destroys on-network backups is the most common reason for large payouts. Insurers specifically ask about offsite and immutable backup storage.",
          controlSlug: "offsite-backup-storage",
        },
      },
      {
        key: "dp_encryption_at_rest",
        text: "Which data stores use encryption at rest?",
        type: "multiselect",
        options: [
          { label: "Laptops / workstations (e.g., BitLocker, FileVault)", weight: 0.25 },
          { label: "Servers and databases", weight: 0.25 },
          { label: "Cloud storage", weight: 0.25 },
          { label: "All data stores", weight: 1.0 },
          { label: "None", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Encryption at rest scrambles stored data so it can't be read without the proper key. If a laptop is stolen or a server is breached, encrypted data remains protected.",
          insurerNote:
            "Data breach notification laws often have safe-harbor exceptions for encrypted data. Encryption can significantly reduce the cost and scope of a breach response.",
          controlSlug: "encryption-at-rest",
        },
      },
      {
        key: "dp_data_classification",
        text: "Does your organization classify data by sensitivity level (e.g., public, internal, confidential)?",
        type: "singleselect",
        options: [
          { label: "Yes, with documented classification and handling procedures", weight: 1.0 },
          { label: "Informal classification, people generally know what's sensitive", weight: 0.5 },
          { label: "We treat all data the same", weight: 0.15 },
          { label: "No classification system", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Identify",
        cisControl: 3,
        tooltip: {
          explanation:
            "Data classification labels information by sensitivity so you can apply the right level of protection. Customer financial data needs stronger safeguards than a public marketing brochure.",
          insurerNote:
            "Classification helps demonstrate regulatory compliance (HIPAA, PCI-DSS, GDPR). Insurers see it as a sign of mature data governance, which reduces breach likelihood.",
          controlSlug: "data-classification",
        },
      },
      {
        key: "dp_retention_maturity",
        text: "How mature is your data retention and disposal policy?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "A retention policy defines how long you keep different types of data and how you securely dispose of it when it's no longer needed. Holding data indefinitely increases risk if a breach occurs.",
          insurerNote:
            "Over-retained data inflates the scope and cost of breaches. Insurers favor organizations that minimize stored data to what's necessary for business and compliance.",
          controlSlug: "data-retention-policy",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. Endpoint Protection (PR.PT)
  // ──────────────────────────────────────────────
  {
    id: "endpoint_protection",
    title: "Endpoint Protection",
    nistCategory: "PR.PT",
    questions: [
      {
        key: "ep_protection_coverage",
        text: "What endpoint protection is deployed on your devices?",
        type: "multiselect",
        options: [
          { label: "Next-gen antivirus / EDR (e.g., CrowdStrike, SentinelOne, Defender for Endpoint)", weight: 0.25 },
          { label: "Traditional antivirus (e.g., Norton, McAfee)", weight: 0.15 },
          { label: "Host-based firewall enabled on all devices", weight: 0.2 },
          { label: "Centrally managed and monitored", weight: 0.2 },
          { label: "All of the above (next-gen + firewall + centrally managed)", weight: 1.0 },
          { label: "None / Not sure", weight: 0.0 },
        ],
        nistFunction: "Detect",
        cisControl: 10,
        tooltip: {
          explanation:
            "Endpoint protection software detects and blocks malware, ransomware, and suspicious activity on laptops, desktops, and servers. Modern EDR tools go beyond signature-based antivirus to detect behavioral threats.",
          insurerNote:
            "EDR/next-gen antivirus is a baseline requirement for most cyber insurance policies. Traditional antivirus alone is increasingly considered insufficient.",
          controlSlug: "endpoint-protection",
        },
      },
      {
        key: "ep_os_patching_frequency",
        text: "How frequently are operating system updates and security patches applied to your devices?",
        type: "frequency",
        options: [
          { label: "Within 72 hours of release (critical patches)", weight: 1.0 },
          { label: "Weekly", weight: 0.85 },
          { label: "Monthly", weight: 0.6 },
          { label: "Quarterly", weight: 0.3 },
          { label: "Annually", weight: 0.1 },
          { label: "Never / Ad-hoc", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 7,
        tooltip: {
          explanation:
            "Security patches fix known vulnerabilities in operating systems and software. Attackers often exploit these vulnerabilities within days of disclosure, so timely patching is critical.",
          insurerNote:
            "Unpatched systems are among the most common root causes of breaches. Insurers expect critical patches to be applied within 30 days. Faster is better.",
          controlSlug: "os-patching",
        },
      },
      {
        key: "ep_device_encryption",
        text: "Are all company-owned laptops and mobile devices encrypted?",
        type: "singleselect",
        options: [
          { label: "Yes, full-disk encryption enforced on all devices via policy", weight: 1.0 },
          { label: "Most devices, but not enforced centrally", weight: 0.6 },
          { label: "Only some devices", weight: 0.3 },
          { label: "No device encryption", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Full-disk encryption (like BitLocker on Windows or FileVault on Mac) ensures that if a device is lost or stolen, no one can read the data without the decryption key.",
          insurerNote:
            "Lost or stolen devices are a top cause of data breach notifications. Encryption provides safe-harbor protection under most breach notification laws.",
          controlSlug: "device-encryption",
        },
      },
      {
        key: "ep_byod_controls",
        text: "How do you manage personal devices (BYOD) that access company data?",
        type: "singleselect",
        options: [
          { label: "Mobile Device Management (MDM) required with enforced security policies", weight: 1.0 },
          { label: "Basic requirements (e.g., screen lock, passcode) but no MDM", weight: 0.5 },
          { label: "Personal devices can access company data with no restrictions", weight: 0.15 },
          { label: "We don't allow personal devices for work", weight: 0.8 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "When employees use personal phones or laptops for work, company data lives on devices you don't fully control. MDM software lets you enforce security settings and remotely wipe company data if needed.",
          insurerNote:
            "Unmanaged personal devices are a blind spot in breach investigations. Insurers look for either BYOD restrictions or MDM enrollment as a compensating control.",
          controlSlug: "byod-controls",
        },
      },
      {
        key: "ep_remote_wipe_maturity",
        text: "How mature is your ability to remotely wipe or lock lost/stolen devices?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 1,
        tooltip: {
          explanation:
            "Remote wipe lets you erase all data from a lost or stolen device over the internet. Remote lock prevents anyone from accessing the device. These capabilities limit data exposure from physical loss.",
          insurerNote:
            "The ability to remotely wipe devices reduces potential breach scope. Insurers may require this capability, especially for organizations with mobile workforces.",
          controlSlug: "remote-wipe-capability",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. Email Security (PR.AT + DE.CM)
  // ──────────────────────────────────────────────
  {
    id: "email_security",
    title: "Email Security",
    nistCategory: "PR.AT + DE.CM",
    questions: [
      {
        key: "es_filtering_maturity",
        text: "How mature is your email filtering and threat protection?",
        type: "maturity",
        nistFunction: "Detect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Email filtering scans incoming messages for spam, phishing links, malware attachments, and impersonation attempts. Advanced solutions use AI and sandboxing to catch sophisticated attacks.",
          insurerNote:
            "Email is the number-one attack vector for ransomware and business email compromise. Insurers expect dedicated email security beyond basic spam filtering.",
          controlSlug: "email-filtering",
        },
      },
      {
        key: "es_phishing_training_frequency",
        text: "How often do employees receive phishing awareness training or simulated phishing tests?",
        type: "frequency",
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Only during onboarding", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Phishing simulations send fake phishing emails to employees to test their ability to recognize and report threats. Regular training keeps awareness high as attack techniques evolve.",
          insurerNote:
            "Phishing training is a standard question on cyber insurance applications. Regular simulation testing demonstrates proactive risk reduction.",
          controlSlug: "phishing-training",
        },
      },
      {
        key: "es_business_domain",
        text: "Does your organization use a business email domain (e.g., you@yourcompany.com) rather than free email (Gmail, Yahoo)?",
        type: "singleselect",
        options: [
          { label: "Yes, all business communication uses our company domain", weight: 1.0 },
          { label: "Mostly, but some staff still use personal email for work", weight: 0.5 },
          { label: "We primarily use free email services for business", weight: 0.1 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "A business domain gives you control over email security settings, user accounts, and data retention. Free email accounts can't be centrally managed or secured when employees leave.",
          insurerNote:
            "Using free email for business signals low security maturity to underwriters. Business domains enable critical controls like DMARC, centralized logging, and account recovery.",
          controlSlug: "business-email-domain",
        },
      },
      {
        key: "es_dmarc_dkim_spf",
        text: "Which email authentication protocols are configured for your domain?",
        type: "multiselect",
        options: [
          { label: "SPF (Sender Policy Framework)", weight: 0.2 },
          { label: "DKIM (DomainKeys Identified Mail)", weight: 0.2 },
          { label: "DMARC (with enforce/reject policy)", weight: 0.25 },
          { label: "All three (SPF + DKIM + DMARC)", weight: 1.0 },
          { label: "Not sure", weight: 0.05 },
          { label: "None", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "SPF, DKIM, and DMARC are email authentication standards that prevent attackers from sending emails that appear to come from your domain. Together, they protect your brand and your contacts from spoofing.",
          insurerNote:
            "Email spoofing is a primary vector for business email compromise (BEC) fraud. Insurers increasingly check DMARC records during underwriting and may require enforcement mode.",
          controlSlug: "email-authentication",
        },
      },
      {
        key: "es_suspicious_reporting",
        text: "How do employees report suspicious emails?",
        type: "singleselect",
        options: [
          { label: "Dedicated 'Report Phish' button in email client with automated triage", weight: 1.0 },
          { label: "Forward to a specific IT/security email address", weight: 0.7 },
          { label: "Tell a manager or IT person verbally/via chat", weight: 0.35 },
          { label: "No clear process, most people just delete suspicious emails", weight: 0.1 },
          { label: "Employees aren't aware they should report suspicious emails", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Detect",
        cisControl: 14,
        tooltip: {
          explanation:
            "A clear reporting process turns every employee into a sensor. When suspicious emails are reported quickly, IT can block the threat before others click. Without a process, threats go unnoticed.",
          insurerNote:
            "Rapid phishing reporting reduces the window of exposure. Insurers see established reporting mechanisms as evidence of a security-aware culture.",
          controlSlug: "suspicious-email-reporting",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. Network Security (PR.AC + PR.PT)
  // ──────────────────────────────────────────────
  {
    id: "network_security",
    title: "Network Security",
    nistCategory: "PR.AC + PR.PT",
    questions: [
      {
        key: "ns_wifi_security",
        text: "How is your business WiFi network secured?",
        type: "singleselect",
        options: [
          { label: "WPA3-Enterprise with unique credentials per user", weight: 1.0 },
          { label: "WPA2/WPA3 with a strong, regularly rotated password", weight: 0.7 },
          { label: "WPA2 with a shared password that rarely changes", weight: 0.35 },
          { label: "Open network or WEP encryption", weight: 0.05 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "WiFi encryption prevents unauthorized devices from joining your network and intercepting traffic. WPA3-Enterprise is the current gold standard; older protocols like WEP are easily cracked.",
          insurerNote:
            "An unsecured WiFi network is an easy entry point for attackers. Insurers may ask about wireless security as part of network segmentation questions.",
          controlSlug: "wifi-security",
        },
      },
      {
        key: "ns_segmentation",
        text: "Is your network segmented to separate sensitive systems from general traffic?",
        type: "singleselect",
        options: [
          { label: "Yes, with VLANs or separate networks for sensitive systems, guest WiFi, and IoT", weight: 1.0 },
          { label: "Partial segmentation (e.g., guest WiFi is separate)", weight: 0.5 },
          { label: "Everything is on the same network", weight: 0.1 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network segmentation divides your network into zones so that a compromised device in one zone can't easily reach sensitive systems in another. It limits lateral movement by attackers.",
          insurerNote:
            "Flat networks (no segmentation) allow ransomware to spread to every device rapidly. Segmentation is increasingly a rated factor in cyber insurance pricing.",
          controlSlug: "network-segmentation",
        },
      },
      {
        key: "ns_firewall_maturity",
        text: "How mature is your firewall and perimeter defense?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Firewalls filter network traffic based on rules, blocking unauthorized connections. A mature firewall setup includes regular rule reviews, intrusion prevention, and logging of blocked traffic.",
          insurerNote:
            "Firewalls are a baseline expectation. Insurers look for evidence of active management. Unreviewed firewall rules often contain dangerous exceptions.",
          controlSlug: "firewall-management",
        },
      },
      {
        key: "ns_vpn_remote",
        text: "How do remote employees access your internal network and systems?",
        type: "singleselect",
        options: [
          { label: "Always-on VPN or Zero Trust Network Access (ZTNA) with MFA", weight: 1.0 },
          { label: "VPN required for internal resources, with MFA", weight: 0.85 },
          { label: "VPN available but not required", weight: 0.4 },
          { label: "Direct access via RDP or port forwarding", weight: 0.1 },
          { label: "No remote access controls", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "VPN and ZTNA create encrypted tunnels between remote devices and your network, preventing eavesdropping. Exposed remote desktop (RDP) is one of the most exploited attack surfaces.",
          insurerNote:
            "Exposed RDP is the leading entry point for ransomware attacks. Insurers commonly deny claims or decline coverage when RDP is open to the internet without VPN and MFA.",
          controlSlug: "vpn-remote-access",
        },
      },
      {
        key: "ns_access_review_frequency",
        text: "How often are network access rules and firewall configurations reviewed?",
        type: "frequency",
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Only when changes are needed", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network rules accumulate over time. Old exceptions, temporary rules, and outdated access create hidden vulnerabilities. Regular reviews ensure rules match current business needs.",
          insurerNote:
            "Stale firewall rules are a common finding in breach forensics. Periodic review demonstrates active governance and can positively influence underwriting.",
          controlSlug: "network-access-review",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 6. Incident Response (RS.RP + RS.CO)
  // ──────────────────────────────────────────────
  {
    id: "incident_response",
    title: "Incident Response",
    nistCategory: "RS.RP + RS.CO",
    questions: [
      {
        key: "ir_plan_maturity",
        text: "How mature is your organization's incident response plan?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "An incident response plan is a documented playbook for handling security incidents: who to call, what to do, how to contain damage, and how to communicate. Without one, teams waste critical time during a crisis.",
          insurerNote:
            "Having a written, tested IR plan is a standard question on cyber insurance applications. Organizations without one face higher premiums and slower claim resolution.",
          controlSlug: "incident-response-plan",
        },
      },
      {
        key: "ir_emergency_contacts",
        text: "Do you maintain an up-to-date list of emergency contacts for cyber incidents (IT provider, legal, insurance carrier, PR)?",
        type: "singleselect",
        options: [
          { label: "Yes, documented and accessible offline (printed or in a separate secure location)", weight: 1.0 },
          { label: "Yes, but only stored digitally on our network", weight: 0.6 },
          { label: "We have some contacts but it's not formalized", weight: 0.3 },
          { label: "No emergency contact list exists", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "During a ransomware attack, your systems may be offline. If your emergency contacts are only stored on those systems, you can't reach them. An offline copy ensures you can activate your response team immediately.",
          insurerNote:
            "Insurers provide breach hotline numbers that should be included in your contact list. Fast engagement of insurer resources can significantly reduce claim costs.",
          controlSlug: "emergency-contacts",
        },
      },
      {
        key: "ir_incident_tracking",
        text: "How does your organization track and learn from security incidents?",
        type: "singleselect",
        options: [
          { label: "Formal incident log with post-incident reviews and remediation tracking", weight: 1.0 },
          { label: "Incidents are logged but rarely reviewed for lessons learned", weight: 0.5 },
          { label: "Incidents are handled ad-hoc with no documentation", weight: 0.2 },
          { label: "We haven't had any incidents (that we know of)", weight: 0.1 },
          { label: "No tracking process", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Tracking incidents and conducting post-mortems helps you identify patterns, fix root causes, and improve your defenses over time. Organizations that don't track incidents often repeat the same mistakes.",
          insurerNote:
            "Incident history and lessons-learned documentation show insurers you actively improve your security posture. Repeat incidents of the same type raise red flags during renewal.",
          controlSlug: "incident-tracking",
        },
      },
      {
        key: "ir_cyber_insurance",
        text: "What is the status of your organization's cyber insurance coverage?",
        type: "singleselect",
        options: [
          { label: "Active policy with coverage reviewed and updated annually", weight: 1.0 },
          { label: "Active policy but hasn't been reviewed recently", weight: 0.7 },
          { label: "Currently shopping for coverage", weight: 0.3 },
          { label: "Had coverage but let it lapse", weight: 0.1 },
          { label: "No cyber insurance", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Cyber insurance helps cover costs from data breaches, ransomware, business interruption, and liability. Policies vary widely, so review yours to understand what's covered and what's excluded.",
          insurerNote:
            "This question establishes your current coverage baseline. Organizations without coverage bear the full financial impact of incidents, which can be existential for small businesses.",
          controlSlug: "cyber-insurance-status",
        },
      },
      {
        key: "ir_plan_communication",
        text: "How is your incident response plan communicated to staff?",
        type: "singleselect",
        options: [
          { label: "Annual tabletop exercises plus written documentation shared with all staff", weight: 1.0 },
          { label: "Documented and shared with key stakeholders only", weight: 0.65 },
          { label: "Exists but most employees don't know about it", weight: 0.25 },
          { label: "Verbal understanding only, nothing documented", weight: 0.1 },
          { label: "No plan to communicate", weight: 0.0 },
        ],
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "An IR plan only works if people know it exists and understand their role. Tabletop exercises walk teams through simulated incidents so they can practice decision-making before a real crisis hits.",
          insurerNote:
            "Tabletop exercises are a strong differentiator in underwriting. They demonstrate that the plan is not just a document on a shelf but a practiced capability.",
          controlSlug: "ir-plan-communication",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 7. Vendor & Third-Party Risk (ID.SC)
  // ──────────────────────────────────────────────
  {
    id: "vendor_risk",
    title: "Vendor & Third-Party Risk",
    nistCategory: "ID.SC",
    questions: [
      {
        key: "vr_vendor_inventory",
        text: "Do you maintain an inventory of third-party vendors who have access to your systems or data?",
        type: "singleselect",
        options: [
          { label: "Yes, with documented access levels and data shared with each vendor", weight: 1.0 },
          { label: "Partial list, we know the major vendors but not all of them", weight: 0.5 },
          { label: "Informal awareness but no documented inventory", weight: 0.2 },
          { label: "No vendor inventory", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "You can't secure what you don't know about. A vendor inventory tracks who has access to your data and systems, what they can do, and what data they handle. It's the foundation of third-party risk management.",
          insurerNote:
            "Supply chain breaches (via vendors) are a growing source of claims. Insurers assess your vendor management practices to understand your extended attack surface.",
          controlSlug: "vendor-inventory",
        },
      },
      {
        key: "vr_security_review",
        text: "Do you assess a vendor's security posture before granting them access to your systems or data?",
        type: "singleselect",
        options: [
          { label: "Yes, formal security questionnaire or SOC 2 / ISO 27001 review required", weight: 1.0 },
          { label: "Basic due diligence (e.g., check for certifications, references)", weight: 0.6 },
          { label: "Only for major vendors handling sensitive data", weight: 0.4 },
          { label: "No security review before granting access", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Assessing vendor security before granting access helps you avoid bringing risk into your environment. A SOC 2 report or security questionnaire reveals how a vendor protects the data you share with them.",
          insurerNote:
            "Third-party breaches can trigger your own insurance claim. Insurers expect due diligence on vendors who access sensitive data or critical systems.",
          controlSlug: "vendor-security-review",
        },
      },
      {
        key: "vr_data_protection_agreements",
        text: "Do your vendor contracts include data protection and security requirements?",
        type: "singleselect",
        options: [
          { label: "Yes, all vendor contracts include data protection clauses, breach notification requirements, and liability terms", weight: 1.0 },
          { label: "Some contracts include basic data protection language", weight: 0.5 },
          { label: "Standard vendor contracts only, no security-specific terms", weight: 0.2 },
          { label: "No contracts with vendors", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Contractual requirements ensure vendors are obligated to protect your data, notify you of breaches, and maintain agreed-upon security standards. Without them, you have little recourse if a vendor is breached.",
          insurerNote:
            "Contractual risk transfer is a key element of third-party risk management. Insurers look for breach notification clauses and indemnification terms in vendor agreements.",
          controlSlug: "vendor-data-agreements",
        },
      },
      {
        key: "vr_access_audit_frequency",
        text: "How often do you review and audit vendor access to your systems?",
        type: "frequency",
        options: [
          { label: "Quarterly", weight: 1.0 },
          { label: "Annually", weight: 0.6 },
          { label: "Only when renewing contracts", weight: 0.3 },
          { label: "Only when there's a problem", weight: 0.1 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Vendor relationships change over time. Services end, contacts change, and access should be adjusted accordingly. Regular audits ensure vendors only have the access they currently need.",
          insurerNote:
            "Stale vendor access is a common breach vector. Regular audits demonstrate active vendor lifecycle management, which is viewed favorably during underwriting.",
          controlSlug: "vendor-access-audit",
        },
      },
      {
        key: "vr_supply_chain_awareness",
        text: "How does your organization assess supply chain and fourth-party risk (your vendors' vendors)?",
        type: "singleselect",
        options: [
          { label: "We evaluate critical vendors' supply chain practices and require transparency", weight: 1.0 },
          { label: "We ask about sub-processors but don't formally evaluate them", weight: 0.5 },
          { label: "We're aware of the risk but don't take specific action", weight: 0.2 },
          { label: "We haven't considered supply chain risk beyond our direct vendors", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Your vendors use vendors too. A breach at a fourth party (like the SolarWinds or MOVEit incidents) can cascade through your supply chain. Understanding this risk helps you prepare and set expectations.",
          insurerNote:
            "Supply chain attacks are among the fastest-growing claim categories. Insurers are beginning to assess fourth-party risk awareness as part of underwriting for larger policies.",
          controlSlug: "supply-chain-risk",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8. Security Awareness & Training (PR.AT)
  // ──────────────────────────────────────────────
  {
    id: "security_awareness",
    title: "Security Awareness & Training",
    nistCategory: "PR.AT",
    questions: [
      {
        key: "sa_training_maturity",
        text: "How mature is your organization's security awareness training program?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Security awareness training educates employees about threats like phishing, social engineering, and safe data handling. A mature program goes beyond annual compliance to build a security-minded culture.",
          insurerNote:
            "Security awareness training is a standard requirement on cyber insurance applications. Mature programs with measurable outcomes (e.g., phishing test click rates) can positively impact premiums.",
          controlSlug: "security-training-program",
        },
      },
      {
        key: "sa_reporting_policy",
        text: "Do employees know how to report a suspected security incident?",
        type: "singleselect",
        options: [
          { label: "Yes, clear documented process with multiple reporting channels, and employees are regularly reminded", weight: 1.0 },
          { label: "General awareness, most people would contact IT", weight: 0.6 },
          { label: "Some employees know, but it's not widely communicated", weight: 0.3 },
          { label: "No defined reporting process", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Detect",
        cisControl: 14,
        tooltip: {
          explanation:
            "The faster a security incident is reported, the faster it can be contained. Employees should know exactly who to contact and feel comfortable reporting without fear of blame.",
          insurerNote:
            "Delayed incident reporting increases breach costs. Insurers value organizations where employees are trained and empowered to report issues immediately.",
          controlSlug: "incident-reporting-policy",
        },
      },
      {
        key: "sa_security_onboarding",
        text: "What security training do new employees receive during onboarding?",
        type: "singleselect",
        options: [
          { label: "Formal security onboarding covering policies, acceptable use, phishing awareness, and incident reporting", weight: 1.0 },
          { label: "Brief overview of security policies as part of general onboarding", weight: 0.6 },
          { label: "Informal guidance from their manager or team", weight: 0.25 },
          { label: "No security-specific onboarding", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "New employees are particularly vulnerable. They don't yet know your systems, policies, or communication norms. Attackers target new hires with social engineering because they're less likely to question unusual requests.",
          insurerNote:
            "Onboarding training establishes a security baseline for every employee from day one. Insurers view this as evidence of a comprehensive security culture.",
          controlSlug: "security-onboarding",
        },
      },
      {
        key: "sa_byod_policy",
        text: "Does your organization have a documented acceptable use and BYOD (Bring Your Own Device) policy?",
        type: "singleselect",
        options: [
          { label: "Yes, documented policy covering acceptable use, BYOD, and regularly reviewed", weight: 1.0 },
          { label: "Acceptable use policy exists but doesn't address BYOD specifically", weight: 0.5 },
          { label: "Informal guidelines but nothing documented", weight: 0.2 },
          { label: "No acceptable use or BYOD policy", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "An acceptable use policy sets clear expectations for how employees can use company technology and personal devices for work. It covers topics like approved software, personal use limits, and data handling on personal devices.",
          insurerNote:
            "Written policies demonstrate governance and set the foundation for enforcement. Insurers may request copies of key policies during the application or claims process.",
          controlSlug: "acceptable-use-policy",
        },
      },
      {
        key: "sa_phishing_response",
        text: "What happens when an employee fails a phishing simulation or clicks a real phishing link?",
        type: "singleselect",
        options: [
          { label: "Immediate coaching plus additional targeted training, tracked over time", weight: 1.0 },
          { label: "Automated notification with a brief training reminder", weight: 0.7 },
          { label: "Manager is notified but no structured follow-up", weight: 0.3 },
          { label: "Nothing, we don't track or follow up on phishing failures", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Phishing simulation follow-up turns a mistake into a learning moment. Employees who receive immediate coaching are far less likely to fall for real attacks. Tracking repeat offenders helps identify who needs extra support.",
          insurerNote:
            "Measuring and acting on phishing simulation results demonstrates program effectiveness. Insurers value programs that show improvement over time rather than just checkbox compliance.",
          controlSlug: "phishing-response-procedures",
        },
      },
    ],
  },
  // ──────────────────────────────────────────────
  // Infrastructure Health (ID.AM)
  // ──────────────────────────────────────────────
  {
    id: "gen_infrastructure",
    title: "Infrastructure Health",
    nistCategory: "ID.AM",
    questions: [
      {
        key: "gen_infra_workstation_age",
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
        key: "gen_infra_server_age",
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
        key: "gen_infra_network_age",
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

export const TOTAL_QUESTIONS = SECTIONS.reduce(
  (sum, section) => sum + section.questions.length,
  0
);
