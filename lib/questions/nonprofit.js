/**
 * Nonprofit / Church / Parish - NIST CSF + IRS Cybersecurity Guidelines Questionnaire
 *
 * Answer types: singleselect | multiselect | frequency | maturity | yesno | text
 * Every question carries nistFunction, cisControl, and a tooltip.
 */

export const SECTIONS = [
  // ──────────────────────────────────────────────
  // 1. Access Control (PR.AC)
  // ──────────────────────────────────────────────
  {
    id: "np_access_control",
    title: "Access Control",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "np_ac_volunteer_accounts",
        text: "How does your organization manage user accounts for volunteers and temporary staff?",
        type: "singleselect",
        options: [
          { label: "Individual accounts with defined expiration dates and limited permissions", weight: 1.0 },
          { label: "Individual accounts but no expiration or permission limits", weight: 0.6 },
          { label: "Shared generic accounts used by multiple volunteers", weight: 0.2 },
          { label: "Volunteers use a staff member's account", weight: 0.1 },
          { label: "No formal process for volunteer access", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "Volunteers often need temporary access to church management systems, email, or donor databases. Giving each volunteer their own account with limited permissions reduces the risk of unauthorized access or accidental data exposure.",
          insurerNote:
            "Shared accounts make it impossible to trace actions to a specific person. Insurers view shared credentials as a significant control weakness during claims investigation.",
          controlSlug: "access-control-policy",
        },
      },
      {
        key: "np_ac_mfa",
        text: "Which systems require multi-factor authentication (MFA) at your organization?",
        type: "multiselect",
        options: [
          { label: "Email", weight: 0.2 },
          { label: "Donor management / CRM system", weight: 0.2 },
          { label: "Financial or accounting software", weight: 0.2 },
          { label: "Cloud storage (Google Drive, OneDrive, Dropbox)", weight: 0.2 },
          { label: "All systems", weight: 1.0 },
          { label: "None", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Multi-factor authentication requires a second verification step, like a code from your phone, in addition to your password. This prevents unauthorized access even if a password is stolen.",
          insurerNote:
            "MFA is the single most common requirement on cyber insurance applications. Nonprofits that lack MFA on email and financial systems face higher premiums or denial of coverage.",
          controlSlug: "multi-factor-authentication",
        },
      },
      {
        key: "np_ac_shared_devices",
        text: "How do you manage access on shared computers or devices used by multiple staff and volunteers?",
        type: "singleselect",
        options: [
          { label: "Separate user profiles for each person with automatic session lockout", weight: 1.0 },
          { label: "Separate user profiles but no automatic lockout", weight: 0.6 },
          { label: "One shared profile with a common password", weight: 0.2 },
          { label: "Devices are left logged in for convenience", weight: 0.1 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Shared computers in church offices, parish halls, or volunteer rooms can expose sensitive data if sessions are not properly separated. Individual profiles and automatic lockout help prevent unauthorized access.",
          insurerNote:
            "Uncontrolled shared devices are a common finding in breach investigations at nonprofits. Insurers expect basic session management controls on any device that accesses sensitive data.",
          controlSlug: "access-control-policy",
        },
      },
      {
        key: "np_ac_offboarding",
        text: "When a volunteer or staff member leaves, how quickly is their access to systems revoked?",
        type: "singleselect",
        options: [
          { label: "Same day, using a documented checklist", weight: 1.0 },
          { label: "Within a few days, informally handled", weight: 0.5 },
          { label: "Eventually, when someone remembers", weight: 0.2 },
          { label: "We do not have a consistent process", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "Nonprofits and churches often have high volunteer turnover. Former volunteers who retain access to email, donor databases, or financial systems pose a serious security risk.",
          insurerNote:
            "Insider-threat claims often trace back to accounts that were never deactivated. Insurers look for a documented offboarding process, especially in organizations with frequent personnel changes.",
          controlSlug: "employee-offboarding",
        },
      },
      {
        key: "np_ac_password_management",
        text: "How does your organization manage passwords for staff and volunteers?",
        type: "singleselect",
        options: [
          { label: "Password manager enforced for all staff and volunteers", weight: 1.0 },
          { label: "Password manager available but optional", weight: 0.6 },
          { label: "Passwords stored in a shared document or spreadsheet", weight: 0.2 },
          { label: "Each person manages their own passwords", weight: 0.1 },
          { label: "No formal approach", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "A password manager generates and stores strong, unique passwords for every account. Without one, people tend to reuse passwords or write them down, making breaches more likely.",
          insurerNote:
            "Insurers view password management as a foundational control. Password reuse across systems is a leading cause of credential-stuffing attacks that trigger claims.",
          controlSlug: "password-management",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. Donor Data Protection (PR.DS)
  // ──────────────────────────────────────────────
  {
    id: "np_donor_data",
    title: "Donor Data Protection",
    nistCategory: "PR.DS",
    questions: [
      {
        key: "np_dd_encryption",
        text: "Is donor personally identifiable information (PII) encrypted both at rest and in transit?",
        type: "singleselect",
        options: [
          { label: "Yes, all donor PII is encrypted at rest and in transit", weight: 1.0 },
          { label: "Encrypted in transit only (e.g., HTTPS) but not at rest", weight: 0.5 },
          { label: "Some donor data is encrypted, but not consistently", weight: 0.3 },
          { label: "We are not sure what is encrypted", weight: 0.1 },
          { label: "No encryption is in place", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Donor data includes names, addresses, email addresses, phone numbers, and giving history. Encrypting this information ensures it remains unreadable if a device is lost or a system is breached.",
          insurerNote:
            "Encryption of PII is a baseline expectation for cyber insurance. Nonprofits handling donor data without encryption face significant liability exposure in a breach.",
          controlSlug: "data-encryption",
        },
      },
      {
        key: "np_dd_payment_processing",
        text: "How are online donations and payment card transactions processed?",
        type: "singleselect",
        options: [
          { label: "PCI-compliant third-party processor handles all card data (we never see card numbers)", weight: 1.0 },
          { label: "Third-party processor, but we are not sure about PCI compliance", weight: 0.5 },
          { label: "We collect card numbers through our own website or forms", weight: 0.2 },
          { label: "Donations are cash or check only, no card processing", weight: 0.7 },
          { label: "Not sure how card data is handled", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Payment Card Industry (PCI) compliance ensures credit card data is handled securely. Using a compliant third-party processor means your organization never touches raw card numbers, which dramatically reduces risk.",
          insurerNote:
            "PCI compliance is a key factor in cyber insurance underwriting. Nonprofits that handle card data directly face higher premiums and greater liability if a breach occurs.",
          controlSlug: "data-encryption",
        },
      },
      {
        key: "np_dd_data_classification",
        text: "Has your organization classified its data by sensitivity level (e.g., public, internal, confidential)?",
        type: "singleselect",
        options: [
          { label: "Yes, we have a formal data classification policy applied to all data", weight: 1.0 },
          { label: "We have informal guidelines but nothing documented", weight: 0.5 },
          { label: "We classify some data but not consistently", weight: 0.3 },
          { label: "We have not classified our data", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 3,
        tooltip: {
          explanation:
            "Data classification helps your organization understand what information is most sensitive, such as donor financial records, member health prayer requests, or counseling notes, so you can apply the right level of protection.",
          insurerNote:
            "Organizations that classify data can demonstrate they understand their risk exposure. This maturity indicator often leads to more favorable insurance terms.",
          controlSlug: "data-classification",
        },
      },
      {
        key: "np_dd_retention",
        text: "Does your organization have a data retention and disposal policy for donor and member records?",
        type: "singleselect",
        options: [
          { label: "Yes, with defined retention periods and secure disposal procedures", weight: 1.0 },
          { label: "We have informal guidelines but no formal policy", weight: 0.5 },
          { label: "We keep everything indefinitely", weight: 0.2 },
          { label: "We do not have a retention policy", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Keeping data longer than necessary increases your risk. A retention policy defines how long to keep donor records, financial data, and member information, and how to securely dispose of it when no longer needed.",
          insurerNote:
            "Data minimization reduces breach impact. Insurers view retention policies favorably because less stored data means lower potential claim costs.",
          controlSlug: "data-retention",
        },
      },
      {
        key: "np_dd_access_review",
        text: "How often do you review who has access to donor and financial data?",
        type: "frequency",
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.8 },
          { label: "Annually", weight: 0.5 },
          { label: "Only when there is a problem", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 5,
        tooltip: {
          explanation:
            "Regular reviews ensure only authorized staff and volunteers can see sensitive donor information. Over time, permissions accumulate as people change roles but keep old access.",
          insurerNote:
            "Periodic access reviews demonstrate governance maturity and reduce the blast radius of compromised credentials. This is especially important for nonprofits with frequent volunteer turnover.",
          controlSlug: "access-review",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. Data Backup & Recovery (RC.RP)
  // ──────────────────────────────────────────────
  {
    id: "np_backup_recovery",
    title: "Data Backup & Recovery",
    nistCategory: "RC.RP",
    questions: [
      {
        key: "np_br_backup_frequency",
        text: "How often are your critical data and systems backed up?",
        type: "frequency",
        options: [
          { label: "Daily or more frequently", weight: 1.0 },
          { label: "Weekly", weight: 0.7 },
          { label: "Monthly", weight: 0.4 },
          { label: "Quarterly or less", weight: 0.2 },
          { label: "We do not have regular backups", weight: 0.0 },
        ],
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Regular backups ensure your organization can recover donor databases, financial records, and ministry documents if a system fails, is stolen, or is hit by ransomware.",
          insurerNote:
            "Backup frequency directly impacts recovery time after an incident. Insurers want to see at least daily backups of critical systems to minimize business interruption claims.",
          controlSlug: "data-backup",
        },
      },
      {
        key: "np_br_backup_location",
        text: "Where are your backups stored?",
        type: "singleselect",
        options: [
          { label: "Offsite and offline (or immutable cloud storage), separate from primary systems", weight: 1.0 },
          { label: "Cloud backup service, separate from primary environment", weight: 0.8 },
          { label: "On a separate drive or server in the same building", weight: 0.4 },
          { label: "On the same system as the original data", weight: 0.1 },
          { label: "Not sure where backups are stored", weight: 0.0 },
        ],
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "If backups are stored on the same network as your primary data, ransomware can encrypt both. Offsite or immutable backups ensure you have a clean copy to restore from.",
          insurerNote:
            "Ransomware attacks increasingly target backup systems. Insurers strongly prefer offsite or immutable backups that attackers cannot reach from the primary network.",
          controlSlug: "data-backup",
        },
      },
      {
        key: "np_br_backup_testing",
        text: "How often does your organization test restoring from backups?",
        type: "frequency",
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.8 },
          { label: "Annually", weight: 0.5 },
          { label: "We have tested once but not regularly", weight: 0.2 },
          { label: "We have never tested a restore", weight: 0.0 },
        ],
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "A backup is only useful if it actually works. Testing restores regularly confirms that your data can be recovered when you need it most.",
          insurerNote:
            "Untested backups are a leading cause of prolonged outages after ransomware attacks. Insurers increasingly require documented restore testing as part of coverage.",
          controlSlug: "backup-testing",
        },
      },
      {
        key: "np_br_critical_systems",
        text: "Have you identified which systems and data are most critical to your organization's operations?",
        type: "singleselect",
        options: [
          { label: "Yes, we have a documented list of critical systems with recovery priorities", weight: 1.0 },
          { label: "We have a general idea but nothing documented", weight: 0.5 },
          { label: "We have not formally identified critical systems", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 11,
        tooltip: {
          explanation:
            "Knowing which systems are most important, such as your donor database, accounting software, or communication platform, helps you prioritize backup and recovery efforts.",
          insurerNote:
            "Organizations that can articulate their critical assets demonstrate risk awareness. This supports faster claims processing and more targeted recovery after an incident.",
          controlSlug: "data-backup",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. Endpoint & Device Security (PR.PT)
  // ──────────────────────────────────────────────
  {
    id: "np_endpoint_security",
    title: "Endpoint & Device Security",
    nistCategory: "PR.PT",
    questions: [
      {
        key: "np_ep_antivirus",
        text: "What endpoint protection (antivirus/anti-malware) is installed on your organization's devices?",
        type: "singleselect",
        options: [
          { label: "Managed endpoint detection and response (EDR) on all devices", weight: 1.0 },
          { label: "Antivirus software installed on all devices, centrally managed", weight: 0.7 },
          { label: "Antivirus installed on some devices", weight: 0.3 },
          { label: "We rely on the built-in OS protection only", weight: 0.2 },
          { label: "No endpoint protection in place", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "Endpoint protection software detects and blocks malware, ransomware, and other threats on computers and devices. Modern EDR solutions provide deeper visibility and faster response than traditional antivirus.",
          insurerNote:
            "Endpoint protection is a baseline requirement for cyber insurance. Many insurers now specifically require EDR rather than basic antivirus for full coverage.",
          controlSlug: "endpoint-protection",
        },
      },
      {
        key: "np_ep_patch_management",
        text: "How are software updates and security patches applied to your organization's devices?",
        type: "singleselect",
        options: [
          { label: "Automatic updates enabled and centrally managed with compliance monitoring", weight: 1.0 },
          { label: "Automatic updates enabled but not centrally monitored", weight: 0.6 },
          { label: "Updates are applied manually when someone remembers", weight: 0.3 },
          { label: "Updates are applied infrequently or inconsistently", weight: 0.1 },
          { label: "We do not have a patching process", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 7,
        tooltip: {
          explanation:
            "Software updates fix known security vulnerabilities. Delaying patches leaves your systems exposed to attacks that exploit these known weaknesses.",
          insurerNote:
            "Unpatched systems are one of the most common attack vectors in breach claims. Insurers expect timely patching, especially for internet-facing systems and critical applications.",
          controlSlug: "patch-management",
        },
      },
      {
        key: "np_ep_device_encryption",
        text: "Are hard drives encrypted on your organization's computers and laptops?",
        type: "singleselect",
        options: [
          { label: "Yes, full-disk encryption is enabled on all devices", weight: 1.0 },
          { label: "Encryption is enabled on most devices", weight: 0.6 },
          { label: "Only on some devices", weight: 0.3 },
          { label: "No, devices are not encrypted", weight: 0.0 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Full-disk encryption protects data on a device if it is lost or stolen. Without encryption, anyone with physical access to the device can read all stored files, including donor information and financial records.",
          insurerNote:
            "Device encryption is a standard requirement for cyber insurance. A lost unencrypted laptop containing donor PII can trigger mandatory breach notification and significant costs.",
          controlSlug: "device-encryption",
        },
      },
      {
        key: "np_ep_byod",
        text: "Do volunteers or staff use personal devices (phones, laptops, tablets) to access organizational data?",
        type: "singleselect",
        options: [
          { label: "Yes, with a formal BYOD policy that includes security requirements", weight: 1.0 },
          { label: "Yes, with some informal guidelines", weight: 0.5 },
          { label: "Yes, but with no policy or controls", weight: 0.2 },
          { label: "No, only organization-owned devices are used", weight: 0.8 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "Volunteers and staff often use personal phones or laptops to check email, access cloud files, or update donor records. A BYOD policy sets minimum security standards like screen locks, encryption, and the ability to remotely wipe organizational data.",
          insurerNote:
            "Unmanaged personal devices are a common source of data breaches. Insurers expect organizations to have a BYOD policy if personal devices access sensitive data.",
          controlSlug: "byod-policy",
        },
      },
      {
        key: "np_ep_remote_wipe",
        text: "Can your organization remotely wipe data from lost or stolen devices?",
        type: "singleselect",
        options: [
          { label: "Yes, we can remotely wipe all managed devices", weight: 1.0 },
          { label: "Yes, but only for some devices or accounts", weight: 0.5 },
          { label: "No, we do not have remote wipe capability", weight: 0.0 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "If a laptop or phone containing donor data is lost or stolen, remote wipe lets you erase the data before someone else can access it. This is critical for devices used by volunteers who may leave the organization.",
          insurerNote:
            "Remote wipe capability can prevent a lost device from becoming a reportable breach. Insurers view this as an important compensating control, especially for organizations with BYOD.",
          controlSlug: "remote-wipe",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. Email & Communication Security (PR.AT + DE.CM)
  // ──────────────────────────────────────────────
  {
    id: "np_email_security",
    title: "Email & Communication Security",
    nistCategory: "PR.AT + DE.CM",
    questions: [
      {
        key: "np_em_filtering",
        text: "What email security protections are in place for your organization?",
        type: "multiselect",
        options: [
          { label: "Spam and phishing filtering", weight: 0.25 },
          { label: "Malicious attachment blocking", weight: 0.25 },
          { label: "Link scanning and URL rewriting", weight: 0.25 },
          { label: "Advanced threat protection (sandboxing)", weight: 0.25 },
          { label: "None of the above", weight: 0.0 },
        ],
        nistFunction: "Detect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Email is the primary way attackers target nonprofits and churches. Filtering blocks malicious messages before they reach staff inboxes, reducing the chance of someone clicking a dangerous link or opening an infected attachment.",
          insurerNote:
            "Email-based attacks account for the majority of cyber insurance claims. Robust email filtering is a key control that insurers evaluate during underwriting.",
          controlSlug: "email-filtering",
        },
      },
      {
        key: "np_em_authentication",
        text: "Has your organization configured email authentication records (SPF, DKIM, DMARC)?",
        type: "singleselect",
        options: [
          { label: "Yes, all three are configured and enforced", weight: 1.0 },
          { label: "Some are configured but not all", weight: 0.5 },
          { label: "We are not sure", weight: 0.1 },
          { label: "No, none are configured", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "SPF, DKIM, and DMARC are email authentication standards that prevent attackers from sending emails that appear to come from your organization's domain. This protects your congregation and donors from phishing scams that impersonate your church or nonprofit.",
          insurerNote:
            "Email impersonation is a common vector for business email compromise (BEC). Insurers increasingly check for DMARC enforcement as part of their underwriting process.",
          controlSlug: "email-authentication",
        },
      },
      {
        key: "np_em_phishing_training",
        text: "Do staff and volunteers receive training on how to recognize phishing emails?",
        type: "singleselect",
        options: [
          { label: "Yes, with regular simulated phishing exercises", weight: 1.0 },
          { label: "Yes, annual training but no simulations", weight: 0.6 },
          { label: "Informal reminders or occasional tips", weight: 0.3 },
          { label: "No phishing training is provided", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Churches and nonprofits are frequent targets of phishing because attackers exploit trust and goodwill. Training helps staff and volunteers recognize suspicious emails before clicking links or sharing information.",
          insurerNote:
            "Phishing awareness training with simulated exercises is a top-tier control for reducing email-based claims. Many insurers offer premium discounts for organizations that conduct regular training.",
          controlSlug: "phishing-training",
        },
      },
      {
        key: "np_em_reporting",
        text: "Is there a clear process for staff and volunteers to report suspicious emails?",
        type: "singleselect",
        options: [
          { label: "Yes, with a dedicated report button or email address and defined response process", weight: 1.0 },
          { label: "Yes, they know to tell someone, but no formal process", weight: 0.5 },
          { label: "No formal reporting process exists", weight: 0.0 },
        ],
        nistFunction: "Detect",
        cisControl: 14,
        tooltip: {
          explanation:
            "A simple reporting process, like a 'Report Phishing' button in the email client, makes it easy for anyone to flag suspicious messages. Quick reporting helps your organization respond before damage is done.",
          insurerNote:
            "Organizations with established reporting mechanisms detect incidents faster. Faster detection reduces the scope and cost of incidents, which insurers value highly.",
          controlSlug: "email-reporting",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 6. Network Security (PR.AC + DE.CM)
  // ──────────────────────────────────────────────
  {
    id: "np_network_security",
    title: "Network Security",
    nistCategory: "PR.AC + DE.CM",
    questions: [
      {
        key: "np_ns_segmentation",
        text: "Is the network your organization uses segmented (e.g., separate guest Wi-Fi from staff and financial systems)?",
        type: "singleselect",
        options: [
          { label: "Yes, separate networks for guests, staff, and sensitive systems", weight: 1.0 },
          { label: "Guest Wi-Fi is separate, but staff and systems share one network", weight: 0.6 },
          { label: "Everything is on one flat network", weight: 0.2 },
          { label: "Not sure how the network is set up", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Many churches and nonprofits offer guest Wi-Fi for visitors and congregation members. If that guest network shares the same network as your donor database or financial systems, a compromised guest device could reach sensitive data.",
          insurerNote:
            "Network segmentation limits lateral movement during an attack. Insurers view flat networks as high risk because a single compromised device can reach everything.",
          controlSlug: "network-segmentation",
        },
      },
      {
        key: "np_ns_firewall",
        text: "Does your organization have a firewall protecting its network?",
        type: "singleselect",
        options: [
          { label: "Yes, a managed next-generation firewall with regular rule reviews", weight: 1.0 },
          { label: "Yes, a firewall is in place but rarely reviewed or updated", weight: 0.5 },
          { label: "We use the default router provided by our internet service provider", weight: 0.2 },
          { label: "No firewall is in place", weight: 0.0 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "A firewall controls what network traffic is allowed in and out. It acts as a barrier between your organization's internal network and the internet, blocking unauthorized access attempts.",
          insurerNote:
            "A properly configured firewall is a fundamental security control. Insurers expect at minimum a business-grade firewall with regularly updated rules.",
          controlSlug: "firewall-management",
        },
      },
      {
        key: "np_ns_remote_access",
        text: "How do staff or volunteers access your network or systems remotely?",
        type: "singleselect",
        options: [
          { label: "VPN with multi-factor authentication", weight: 1.0 },
          { label: "VPN without multi-factor authentication", weight: 0.5 },
          { label: "Remote desktop or screen sharing tools without VPN", weight: 0.2 },
          { label: "Direct access to cloud services only (no VPN needed)", weight: 0.7 },
          { label: "Remote access is not used", weight: 0.6 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "If staff or volunteers connect to your systems from home or while traveling, a VPN creates an encrypted tunnel that protects the connection. Without it, sensitive data could be intercepted on public networks.",
          insurerNote:
            "Unsecured remote access is a top attack vector for ransomware. Insurers frequently require VPN with MFA for any remote connections to internal systems.",
          controlSlug: "vpn-remote-access",
        },
      },
      {
        key: "np_ns_monitoring",
        text: "Does your organization monitor network activity for suspicious behavior?",
        type: "singleselect",
        options: [
          { label: "Yes, with automated monitoring and alerts reviewed by IT staff or a managed provider", weight: 1.0 },
          { label: "Basic logging is enabled but not regularly reviewed", weight: 0.4 },
          { label: "No network monitoring is in place", weight: 0.0 },
          { label: "Not sure", weight: 0.0 },
        ],
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "Network monitoring watches for unusual patterns like large data transfers, connections to known malicious sites, or unauthorized access attempts. Early detection can stop an attack before significant damage occurs.",
          insurerNote:
            "Organizations with network monitoring capabilities detect breaches faster and contain them more effectively. This directly reduces claim severity and is viewed favorably by insurers.",
          controlSlug: "network-monitoring",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 7. Incident Response (RS.RP + RS.CO)
  // ──────────────────────────────────────────────
  {
    id: "np_incident_response",
    title: "Incident Response",
    nistCategory: "RS.RP + RS.CO",
    questions: [
      {
        key: "np_ir_plan",
        text: "Does your organization have a written incident response plan?",
        type: "singleselect",
        options: [
          { label: "Yes, documented, tested, and updated at least annually", weight: 1.0 },
          { label: "Yes, documented but not recently tested or updated", weight: 0.5 },
          { label: "We have an informal understanding of what to do", weight: 0.2 },
          { label: "No incident response plan exists", weight: 0.0 },
        ],
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "An incident response plan outlines who to contact, what steps to take, and how to communicate during a security event. Without a plan, confusion during a crisis wastes valuable time and can increase damage.",
          insurerNote:
            "A documented and tested incident response plan is a common requirement for cyber insurance. Organizations without one face longer recovery times and higher claim costs.",
          controlSlug: "incident-response-plan",
        },
      },
      {
        key: "np_ir_contacts",
        text: "Does your organization maintain an up-to-date list of emergency contacts for cybersecurity incidents?",
        type: "singleselect",
        options: [
          { label: "Yes, including IT support, legal counsel, insurance carrier, and law enforcement contacts", weight: 1.0 },
          { label: "We have some contacts but the list is incomplete or outdated", weight: 0.4 },
          { label: "No emergency contact list exists for cyber incidents", weight: 0.0 },
        ],
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "During a cyber incident, you need to quickly reach your IT provider, insurance carrier, legal counsel, and possibly law enforcement. Having these contacts documented and accessible saves critical time.",
          insurerNote:
            "Delayed notification to insurers can jeopardize coverage. An up-to-date emergency contact list ensures the right people are engaged quickly, which reduces overall incident costs.",
          controlSlug: "emergency-contacts",
        },
      },
      {
        key: "np_ir_insurance",
        text: "Does your organization carry cyber liability insurance?",
        type: "singleselect",
        options: [
          { label: "Yes, with coverage reviewed annually", weight: 1.0 },
          { label: "Yes, but we have not reviewed coverage recently", weight: 0.6 },
          { label: "We are exploring options but do not currently have a policy", weight: 0.2 },
          { label: "No cyber insurance", weight: 0.0 },
        ],
        nistFunction: "Recover",
        cisControl: 17,
        tooltip: {
          explanation:
            "Cyber insurance helps cover costs from data breaches, ransomware attacks, and other cyber incidents, including legal fees, notification costs, and recovery expenses. Nonprofits are not immune to these threats.",
          insurerNote:
            "Having cyber insurance demonstrates risk awareness. Regularly reviewing coverage ensures your policy matches your current risk profile as your organization grows or changes technology.",
          controlSlug: "cyber-insurance",
        },
      },
      {
        key: "np_ir_communication",
        text: "Does your incident response plan include communication procedures for notifying donors and members if their data is compromised?",
        type: "singleselect",
        options: [
          { label: "Yes, with templates and defined notification timelines", weight: 1.0 },
          { label: "We have a general idea but no documented procedures", weight: 0.4 },
          { label: "No communication procedures exist", weight: 0.0 },
        ],
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Most states require organizations to notify affected individuals after a data breach within a specific timeframe. Having pre-written templates and clear procedures speeds up this process and helps maintain trust with your community.",
          insurerNote:
            "Breach notification costs are a major component of cyber insurance claims. Pre-planned communication procedures reduce legal exposure and demonstrate responsible data stewardship.",
          controlSlug: "incident-response-plan",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8. Vendor & Third-Party Risk (ID.SC)
  // ──────────────────────────────────────────────
  {
    id: "np_vendor_risk",
    title: "Vendor & Third-Party Risk",
    nistCategory: "ID.SC",
    questions: [
      {
        key: "np_vr_inventory",
        text: "Does your organization maintain a list of third-party services that have access to your data (donation platforms, CRM, accounting software, email providers)?",
        type: "singleselect",
        options: [
          { label: "Yes, a documented inventory that is reviewed regularly", weight: 1.0 },
          { label: "We have a general idea but no formal inventory", weight: 0.4 },
          { label: "No, we do not track which vendors have access to our data", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Nonprofits often use many third-party services like donation platforms, church management software, email marketing tools, and accounting applications. Knowing which vendors have access to your data is the first step in managing that risk.",
          insurerNote:
            "Vendor-related breaches are increasingly common. Insurers want to see that organizations know who has access to their data and have evaluated the associated risks.",
          controlSlug: "vendor-risk-management",
        },
      },
      {
        key: "np_vr_assessment",
        text: "Do you evaluate the security practices of your key vendors (donation processor, CRM provider, cloud services)?",
        type: "singleselect",
        options: [
          { label: "Yes, we review security certifications or questionnaires before and during engagement", weight: 1.0 },
          { label: "We check basic information but do not do a formal assessment", weight: 0.5 },
          { label: "We trust vendors based on reputation only", weight: 0.2 },
          { label: "No, we do not assess vendor security", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Your organization is responsible for protecting data even when a vendor handles it. Asking vendors about their security practices, such as SOC 2 compliance or encryption standards, helps ensure they protect your data appropriately.",
          insurerNote:
            "If a vendor suffers a breach affecting your data, your organization may still face notification obligations and reputational harm. Insurers increasingly require vendor due diligence as part of their underwriting.",
          controlSlug: "vendor-risk-management",
        },
      },
      {
        key: "np_vr_agreements",
        text: "Do your contracts with key vendors include data protection requirements and breach notification obligations?",
        type: "singleselect",
        options: [
          { label: "Yes, all key vendor contracts include data protection and breach notification clauses", weight: 1.0 },
          { label: "Some contracts include these provisions", weight: 0.5 },
          { label: "We use standard vendor terms without modification", weight: 0.2 },
          { label: "We do not have written contracts with most vendors", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Vendor agreements should specify how your data is protected, who is responsible in the event of a breach, and how quickly you will be notified. Without these terms, you may not learn about a breach affecting your donors until it is too late.",
          insurerNote:
            "Contractual protections with vendors can shift liability and ensure timely breach notification. Insurers view strong vendor agreements as a risk-reduction measure.",
          controlSlug: "vendor-agreements",
        },
      },
      {
        key: "np_vr_donation_platform",
        text: "How confident are you in the security of your online donation platform?",
        type: "singleselect",
        options: [
          { label: "Very confident - platform is PCI-compliant and we have verified their security practices", weight: 1.0 },
          { label: "Somewhat confident - platform claims compliance but we have not verified", weight: 0.5 },
          { label: "Not confident - we have not evaluated the platform's security", weight: 0.2 },
          { label: "We do not accept online donations", weight: 0.6 },
        ],
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Online donation platforms handle sensitive payment card data from your supporters. Ensuring the platform is PCI-compliant and follows strong security practices protects your donors and your organization's reputation.",
          insurerNote:
            "A breach at your donation platform can expose donor financial data and trigger regulatory obligations. Insurers expect organizations to perform due diligence on platforms handling payment data.",
          controlSlug: "vendor-risk-management",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 9. Security Awareness & Training (PR.AT)
  // ──────────────────────────────────────────────
  {
    id: "np_security_awareness",
    title: "Security Awareness & Training",
    nistCategory: "PR.AT",
    questions: [
      {
        key: "np_sa_onboarding",
        text: "Do new staff and volunteers receive security awareness training when they join your organization?",
        type: "singleselect",
        options: [
          { label: "Yes, security training is a required part of onboarding for all staff and volunteers", weight: 1.0 },
          { label: "Yes, but only for paid staff, not volunteers", weight: 0.5 },
          { label: "Informal guidance is given but no formal training", weight: 0.2 },
          { label: "No security training is provided during onboarding", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Volunteers and new staff need to understand basic security practices from day one, such as recognizing phishing, using strong passwords, and protecting donor information. Even a brief session significantly reduces risk.",
          insurerNote:
            "Human error is the leading cause of security incidents. Insurers view security onboarding as a critical control, especially for organizations with large volunteer workforces.",
          controlSlug: "security-onboarding",
        },
      },
      {
        key: "np_sa_ongoing_training",
        text: "How often do staff and volunteers receive ongoing security awareness training?",
        type: "frequency",
        options: [
          { label: "Quarterly or more frequently", weight: 1.0 },
          { label: "Twice a year", weight: 0.7 },
          { label: "Annually", weight: 0.5 },
          { label: "Only during onboarding", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Security threats evolve constantly. Regular training keeps your team aware of new scams and attack methods that target nonprofits and religious organizations.",
          insurerNote:
            "Annual or more frequent security training is a standard requirement for many cyber insurance policies. Regular training measurably reduces the likelihood of successful phishing attacks.",
          controlSlug: "security-training",
        },
      },
      {
        key: "np_sa_topics",
        text: "Which security topics are covered in your training program?",
        type: "multiselect",
        options: [
          { label: "Phishing and social engineering awareness", weight: 0.2 },
          { label: "Password best practices", weight: 0.2 },
          { label: "Safe internet and email use", weight: 0.2 },
          { label: "Protecting donor and member data", weight: 0.2 },
          { label: "Reporting suspicious activity", weight: 0.2 },
          { label: "We do not provide security training", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Effective security training covers multiple topics relevant to your organization. For nonprofits and churches, protecting donor data and recognizing scams targeting generous communities are especially important.",
          insurerNote:
            "Comprehensive training programs that address multiple threat vectors demonstrate security maturity. Insurers look for programs that go beyond a single annual compliance checkbox.",
          controlSlug: "security-training",
        },
      },
      {
        key: "np_sa_leadership",
        text: "Does organizational leadership (board, pastor, executive director) participate in security awareness efforts?",
        type: "singleselect",
        options: [
          { label: "Yes, leadership actively participates and champions security awareness", weight: 1.0 },
          { label: "Leadership is supportive but does not actively participate", weight: 0.5 },
          { label: "Leadership delegates security entirely to IT or a volunteer", weight: 0.2 },
          { label: "Leadership is not engaged in security", weight: 0.0 },
        ],
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "When leadership visibly supports security practices, staff and volunteers are more likely to take them seriously. A pastor or executive director who models good security behavior sets the tone for the entire organization.",
          insurerNote:
            "Leadership engagement in security is a strong indicator of organizational security culture. Insurers recognize that top-down commitment to security reduces overall risk.",
          controlSlug: "security-training",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 10. Compliance & Governance (ID.GV)
  // ──────────────────────────────────────────────
  {
    id: "np_compliance_governance",
    title: "Compliance & Governance",
    nistCategory: "ID.GV",
    questions: [
      {
        key: "np_cg_security_policy",
        text: "Does your organization have a written information security policy?",
        type: "singleselect",
        options: [
          { label: "Yes, documented, approved by leadership, and reviewed at least annually", weight: 1.0 },
          { label: "Yes, but it has not been reviewed or updated recently", weight: 0.5 },
          { label: "We have informal practices but nothing written down", weight: 0.2 },
          { label: "No information security policy exists", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "A written security policy establishes the rules and expectations for how your organization protects its data and systems. It provides a foundation for all other security efforts and demonstrates commitment to data protection.",
          insurerNote:
            "A documented security policy is a baseline expectation for cyber insurance coverage. It demonstrates that the organization takes a deliberate approach to managing cyber risk.",
          controlSlug: "access-control-policy",
        },
      },
      {
        key: "np_cg_responsible_person",
        text: "Who is responsible for cybersecurity at your organization?",
        type: "singleselect",
        options: [
          { label: "A designated staff member or managed IT provider with clear accountability", weight: 1.0 },
          { label: "A volunteer with IT knowledge", weight: 0.5 },
          { label: "Shared responsibility with no single point of accountability", weight: 0.2 },
          { label: "No one is specifically responsible", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "Someone needs to be accountable for your organization's cybersecurity. This could be a staff member, a board member, or an outsourced IT provider. Without clear ownership, security tasks tend to fall through the cracks.",
          insurerNote:
            "Clear security ownership is a governance fundamental. Insurers want to know who is responsible for security decisions and incident management.",
          controlSlug: "access-control-policy",
        },
      },
      {
        key: "np_cg_irs_compliance",
        text: "Is your organization aware of and following IRS guidelines for protecting taxpayer and donor information?",
        type: "singleselect",
        options: [
          { label: "Yes, we follow IRS Publication 4557 guidelines and review compliance regularly", weight: 1.0 },
          { label: "We are aware of the guidelines but have not fully implemented them", weight: 0.5 },
          { label: "We are not familiar with IRS cybersecurity guidelines", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "IRS Publication 4557 provides data security guidelines for organizations that handle taxpayer information, including nonprofits that issue tax-deductible donation receipts. Following these guidelines helps protect sensitive financial information.",
          insurerNote:
            "Regulatory compliance reduces legal exposure after a breach. Organizations that follow IRS guidelines demonstrate a higher level of data protection maturity.",
          controlSlug: "access-control-policy",
        },
      },
      {
        key: "np_cg_breach_notification",
        text: "Is your organization aware of your state's data breach notification requirements?",
        type: "singleselect",
        options: [
          { label: "Yes, we know our obligations and have a notification plan in place", weight: 1.0 },
          { label: "We have a general awareness but no specific plan", weight: 0.4 },
          { label: "We are not familiar with our state's breach notification laws", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "All 50 states have data breach notification laws requiring organizations to notify affected individuals within a specific timeframe. Nonprofits are not exempt from these requirements when they hold donor PII.",
          insurerNote:
            "Failure to comply with breach notification laws can result in fines and increased liability. Insurers expect organizations to understand and plan for their legal obligations.",
          controlSlug: "incident-response-plan",
        },
      },
      {
        key: "np_cg_access_review_governance",
        text: "Does your board or leadership team review cybersecurity posture at least annually?",
        type: "singleselect",
        options: [
          { label: "Yes, cybersecurity is a regular agenda item for the board or leadership team", weight: 1.0 },
          { label: "Occasionally discussed but not a regular agenda item", weight: 0.4 },
          { label: "Leadership is not involved in cybersecurity oversight", weight: 0.0 },
        ],
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "Board or leadership oversight of cybersecurity ensures that security receives the attention and resources it needs. Even a brief annual review helps keep security on the organizational radar.",
          insurerNote:
            "Governance-level engagement with cybersecurity demonstrates organizational maturity. Insurers view board-level oversight as a positive indicator of risk management commitment.",
          controlSlug: "access-control-policy",
        },
      },
    ],
  },
];
