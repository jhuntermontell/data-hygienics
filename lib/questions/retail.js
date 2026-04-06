/**
 * Retail / E-commerce Industry Cybersecurity Assessment Questions
 * Based on PCI-DSS + NIST CSF
 */

const SECTIONS = [
  // ── Section 1: Access Control (PR.AC) ──
  {
    title: "Access Control",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "retail_ac_1",
        text: "How is access to POS (Point of Sale) systems controlled?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "POS systems process payment card data and are prime targets for attackers. Restricting access reduces the risk of data skimming and fraud.",
          insurerNote:
            "Unrestricted POS access is a leading cause of payment card breaches in retail environments.",
          controlSlug: "pos-access-control",
        },
        options: [
          { label: "Individual user accounts with role-based permissions and activity logging", weight: 1.0 },
          { label: "Individual accounts with basic role assignments", weight: 0.65 },
          { label: "Shared accounts per shift or department", weight: 0.3 },
          { label: "Single shared login for all POS terminals", weight: 0.0 },
        ],
      },
      {
        key: "retail_ac_2",
        text: "What level of multi-factor authentication (MFA) is enforced on administrative and payment systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "MFA on systems handling payment data and administrative functions prevents unauthorized access even if credentials are compromised.",
          insurerNote:
            "MFA on payment and admin systems is a PCI DSS requirement and a cyber insurance baseline.",
          controlSlug: "mfa-admin-payment",
        },
        options: [
          { label: "MFA enforced on all admin, payment, and remote access systems", weight: 1.0 },
          { label: "MFA on admin and remote access but not POS management", weight: 0.6 },
          { label: "MFA available but not enforced across all critical systems", weight: 0.3 },
          { label: "No MFA in use on any systems", weight: 0.0 },
        ],
      },
      {
        key: "retail_ac_3",
        text: "How are employee access levels managed across retail systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Least-privilege access ensures employees only have permissions necessary for their role, limiting damage from compromised accounts.",
          insurerNote:
            "Over-provisioned access increases the impact of credential theft and insider threats.",
          controlSlug: "employee-access-levels",
        },
        options: [
          { label: "Automated role-based access with regular certification reviews", weight: 1.0 },
          { label: "Defined access tiers assigned during onboarding and reviewed annually", weight: 0.7 },
          { label: "Managers assign access informally based on requests", weight: 0.3 },
          { label: "All employees have the same level of system access", weight: 0.0 },
        ],
      },
      {
        key: "retail_ac_4",
        text: "How does the organization manage system access for seasonal or temporary workers?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Seasonal workers create temporary access needs that must be carefully provisioned and promptly revoked to prevent unauthorized access.",
          insurerNote:
            "Failure to deprovision seasonal workers is a frequent audit finding in retail breach investigations.",
          controlSlug: "seasonal-worker-access",
        },
        options: [
          { label: "Automated provisioning with expiration dates and mandatory deprovisioning workflows", weight: 1.0 },
          { label: "Time-limited accounts with manager-triggered deprovisioning", weight: 0.7 },
          { label: "Standard accounts created and manually disabled when employment ends", weight: 0.3 },
          { label: "Seasonal workers share existing accounts or credentials", weight: 0.0 },
        ],
      },
      {
        key: "retail_ac_5",
        text: "How does the organization enforce password policies across retail systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Strong password policies prevent brute-force attacks and credential stuffing, especially on systems handling payment data.",
          insurerNote:
            "PCI DSS mandates specific password requirements for systems in the cardholder data environment.",
          controlSlug: "password-policy",
        },
        options: [
          { label: "Enforced complexity requirements with password manager and regular rotation for privileged accounts", weight: 1.0 },
          { label: "Enforced complexity and length requirements with periodic rotation", weight: 0.7 },
          { label: "Basic password requirements with no enforcement mechanism", weight: 0.3 },
          { label: "No password policy or default passwords in use", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 2: Payment Card Security (PR.DS) ──
  {
    title: "Payment Card Security",
    nistCategory: "PR.DS",
    questions: [
      {
        key: "retail_pcs_1",
        text: "How mature is the organization's PCI DSS compliance program?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "PCI DSS compliance is mandatory for any organization that stores, processes, or transmits cardholder data.",
          insurerNote:
            "PCI DSS compliance status directly affects cyber insurance eligibility and premium rates for retail organizations.",
          controlSlug: "pci-compliance-maturity",
        },
      },
      {
        key: "retail_pcs_2",
        text: "How does the organization handle cardholder data storage?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Minimizing cardholder data storage reduces the scope of PCI compliance and limits exposure in a breach.",
          insurerNote:
            "Storing cardholder data unnecessarily is a significant risk factor and potential policy exclusion trigger.",
          controlSlug: "cardholder-data-storage",
        },
        options: [
          { label: "No cardholder data stored; fully tokenized with third-party vault", weight: 1.0 },
          { label: "Minimal data stored with encryption and strict access controls", weight: 0.65 },
          { label: "Some cardholder data stored with basic protections", weight: 0.3 },
          { label: "Full card numbers stored in databases or flat files", weight: 0.0 },
        ],
      },
      {
        key: "retail_pcs_3",
        text: "How are payment terminals secured against tampering and skimming?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "Physical and logical security of payment terminals prevents card skimming, RAM scraping, and unauthorized firmware modifications.",
          insurerNote:
            "Terminal tampering is a leading cause of payment card breaches in brick-and-mortar retail.",
          controlSlug: "payment-terminal-security",
        },
        options: [
          { label: "All of the above", weight: 1.0 },
          { label: "Regular physical inspection for tampering", weight: 0.2 },
          { label: "Tamper-evident seals or locks on terminals", weight: 0.2 },
          { label: "P2PE (Point-to-Point Encryption) enabled terminals", weight: 0.25 },
          { label: "Terminal firmware integrity monitoring", weight: 0.2 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "retail_pcs_4",
        text: "What tokenization strategy is used for payment card data?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Tokenization replaces sensitive card data with non-sensitive tokens, dramatically reducing the value of data to attackers.",
          insurerNote:
            "Tokenization reduces PCI scope and is viewed favorably during insurance underwriting.",
          controlSlug: "tokenization-strategy",
        },
        options: [
          { label: "Network-level tokenization with certified third-party token vault for all transactions", weight: 1.0 },
          { label: "Tokenization for stored data and recurring transactions", weight: 0.7 },
          { label: "Tokenization for e-commerce only, not in-store", weight: 0.4 },
          { label: "No tokenization implemented", weight: 0.0 },
        ],
      },
      {
        key: "retail_pcs_5",
        text: "How is the e-commerce checkout process secured?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "E-commerce checkout pages are targeted by Magecart and formjacking attacks that steal card data during online purchases.",
          insurerNote:
            "E-commerce breaches via checkout page compromise are among the most common retail cyber claims.",
          controlSlug: "ecommerce-checkout-security",
        },
        options: [
          { label: "All of the above", weight: 1.0 },
          { label: "Hosted payment page or iframe from PCI-compliant provider", weight: 0.25 },
          { label: "Content Security Policy (CSP) headers enforced", weight: 0.2 },
          { label: "Subresource Integrity (SRI) checks on third-party scripts", weight: 0.2 },
          { label: "Regular web application security scanning", weight: 0.2 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "retail_pcs_6",
        text: "How does the organization handle payment data on printed receipts?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "PCI DSS requires masking of card numbers on receipts. Improper receipt handling can expose cardholder data.",
          insurerNote:
            "Receipt data handling failures are a common PCI compliance gap identified during assessments.",
          controlSlug: "receipt-data-handling",
        },
        options: [
          { label: "Card numbers fully masked on all receipts with secure disposal procedures for copies", weight: 1.0 },
          { label: "Card numbers truncated per PCI requirements on customer receipts", weight: 0.7 },
          { label: "Partial masking with some legacy systems showing extra digits", weight: 0.3 },
          { label: "Full card numbers printed on merchant copy receipts", weight: 0.0 },
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
        key: "retail_br_1",
        text: "How frequently are retail system databases and transaction records backed up?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Regular backups of POS data, inventory, and transaction records ensure business continuity after ransomware or system failure.",
          insurerNote:
            "Backup frequency directly impacts recovery time and potential revenue loss during an outage.",
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
        key: "retail_br_2",
        text: "How are POS system configurations and transaction data backed up?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "POS-specific backups allow rapid restoration of checkout operations, minimizing revenue loss during incidents.",
          insurerNote:
            "Inability to restore POS operations quickly can result in significant business interruption claims.",
          controlSlug: "pos-data-backup",
        },
        options: [
          { label: "Automated POS image backups with transaction log shipping to secure secondary location", weight: 1.0 },
          { label: "Daily POS configuration and transaction data backups", weight: 0.7 },
          { label: "POS data included in general server backups", weight: 0.35 },
          { label: "No specific POS backup procedures", weight: 0.0 },
        ],
      },
      {
        key: "retail_br_3",
        text: "What cloud backup strategy is in place for retail operations data?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Cloud backups provide geographic redundancy and protect against site-level disasters affecting retail locations.",
          insurerNote:
            "Immutable cloud backups are increasingly required for ransomware resilience.",
          controlSlug: "cloud-backup-strategy",
        },
        options: [
          { label: "Immutable cloud backups with versioning, geographic redundancy, and encryption", weight: 1.0 },
          { label: "Cloud backups with versioning and encryption", weight: 0.7 },
          { label: "Cloud backups without immutability or versioning", weight: 0.35 },
          { label: "No cloud backup strategy in place", weight: 0.0 },
        ],
      },
      {
        key: "retail_br_4",
        text: "How frequently are backup restoration procedures tested?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Untested backups may fail during a real incident. Regular testing verifies that systems can be restored within acceptable timeframes.",
          insurerNote:
            "Documented backup restoration tests are required by many cyber insurance policies.",
          controlSlug: "restoration-testing",
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
        key: "retail_br_5",
        text: "How mature is the organization's disaster recovery plan for retail operations?",
        type: "maturity",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "A disaster recovery plan ensures rapid restoration of store operations, e-commerce, and payment processing after a major incident.",
          insurerNote:
            "Business interruption coverage often requires a documented and tested disaster recovery plan.",
          controlSlug: "disaster-recovery-plan",
        },
      },
    ],
  },

  // ── Section 4: Endpoint & POS Security (PR.PT) ──
  {
    title: "Endpoint & POS Security",
    nistCategory: "PR.PT",
    questions: [
      {
        key: "retail_ep_1",
        text: "What endpoint protection is deployed on POS systems and back-office devices?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "POS endpoints require specialized protection against RAM scraping, malware, and unauthorized software installation.",
          insurerNote:
            "EDR on POS systems is increasingly required by insurers given the prevalence of POS malware attacks.",
          controlSlug: "pos-endpoint-protection",
        },
        options: [
          { label: "Managed EDR with application whitelisting on POS and 24/7 monitoring on all endpoints", weight: 1.0 },
          { label: "EDR deployed on all systems with centralized management", weight: 0.7 },
          { label: "Traditional antivirus on back-office devices, basic protection on POS", weight: 0.35 },
          { label: "No endpoint protection on POS systems", weight: 0.0 },
        ],
      },
      {
        key: "retail_ep_2",
        text: "How frequently are POS systems and retail endpoints patched?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 7,
        tooltip: {
          explanation:
            "Unpatched POS systems are vulnerable to known exploits that can compromise payment card data.",
          insurerNote:
            "Patching cadence for POS systems is a critical factor in PCI compliance and insurance assessments.",
          controlSlug: "pos-patching-frequency",
        },
        options: [
          { label: "Critical patches within 48 hours, routine patches within 14 days", weight: 1.0 },
          { label: "Weekly patch cycle for all systems", weight: 0.75 },
          { label: "Monthly patch cycle", weight: 0.5 },
          { label: "Quarterly or ad-hoc patching", weight: 0.2 },
          { label: "Never or only during major upgrades", weight: 0.0 },
        ],
      },
      {
        key: "retail_ep_3",
        text: "How is encryption managed on retail devices (POS terminals, laptops, tablets)?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Device encryption protects cardholder and business data if a device is stolen or physically compromised.",
          insurerNote:
            "Unencrypted retail devices containing payment data can trigger PCI non-compliance and claim denials.",
          controlSlug: "device-encryption",
        },
        options: [
          { label: "Full-disk encryption enforced with centralized key management on all devices", weight: 1.0 },
          { label: "Encryption enabled on all company-owned devices via policy", weight: 0.7 },
          { label: "Encryption on some devices but not consistently enforced", weight: 0.35 },
          { label: "No device encryption in place", weight: 0.0 },
        ],
      },
      {
        key: "retail_ep_4",
        text: "How does the organization track and manage its inventory of retail IT assets?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "A complete asset inventory is foundational to security — you cannot protect what you do not know exists.",
          insurerNote:
            "Unknown or unmanaged devices in the cardholder data environment are a critical PCI compliance gap.",
          controlSlug: "asset-tracking",
        },
        options: [
          { label: "Automated asset discovery and inventory with real-time tracking across all locations", weight: 1.0 },
          { label: "Centralized asset database updated during procurement and decommissioning", weight: 0.7 },
          { label: "Spreadsheet-based tracking updated periodically", weight: 0.35 },
          { label: "No formal asset inventory or tracking", weight: 0.0 },
        ],
      },
      {
        key: "retail_ep_5",
        text: "How does the organization control USB and removable media on retail systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "USB devices can introduce malware or be used to exfiltrate payment data from POS and back-office systems.",
          insurerNote:
            "Uncontrolled USB access in the cardholder data environment is a high-risk finding.",
          controlSlug: "usb-media-controls",
        },
        options: [
          { label: "USB ports disabled via policy with exceptions requiring approval and logging", weight: 1.0 },
          { label: "USB access restricted to approved devices only", weight: 0.7 },
          { label: "USB access allowed but monitored", weight: 0.35 },
          { label: "No USB or removable media controls in place", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 5: Email & Phishing Protection (PR.AT) ──
  {
    title: "Email & Phishing Protection",
    nistCategory: "PR.AT",
    questions: [
      {
        key: "retail_em_1",
        text: "What email filtering and protection is in place for corporate email?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Email filtering blocks phishing, malware, and business email compromise attacks targeting retail management and finance teams.",
          insurerNote:
            "Advanced email filtering is a baseline control expected by cyber insurance carriers.",
          controlSlug: "email-filtering",
        },
        options: [
          { label: "Advanced email security gateway with sandboxing, URL rewriting, and impersonation protection", weight: 1.0 },
          { label: "Cloud email security with anti-phishing and attachment scanning", weight: 0.7 },
          { label: "Basic spam filtering provided by email platform", weight: 0.3 },
          { label: "No email filtering beyond default provider settings", weight: 0.0 },
        ],
      },
      {
        key: "retail_em_2",
        text: "How frequently does the organization conduct phishing awareness training?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Regular phishing training helps employees recognize social engineering attempts targeting payment systems and financial data.",
          insurerNote:
            "Documented phishing training with simulations is a standard insurance application requirement.",
          controlSlug: "phishing-training-frequency",
        },
        options: [
          { label: "Monthly simulations with continuous micro-training", weight: 1.0 },
          { label: "Quarterly training and simulations", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Only during onboarding", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "retail_em_3",
        text: "Does the organization use a dedicated business domain for corporate email?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "A business domain enables proper email authentication and prevents brand impersonation by attackers.",
          insurerNote:
            "Use of free email providers for business operations is considered a significant risk factor.",
          controlSlug: "business-domain",
        },
        options: [
          { label: "Dedicated business domain with full email authentication (SPF, DKIM, DMARC enforce)", weight: 1.0 },
          { label: "Dedicated domain for management, mixed use at store level", weight: 0.5 },
          { label: "Mix of business and personal email accounts", weight: 0.2 },
          { label: "Free email providers used for business communications", weight: 0.0 },
        ],
      },
      {
        key: "retail_em_4",
        text: "How does the organization secure customer-facing email communications?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Customer communications must be protected from spoofing to prevent phishing attacks that impersonate the brand.",
          insurerNote:
            "Brand impersonation via email spoofing can lead to customer fraud and reputational damage claims.",
          controlSlug: "customer-communication-security",
        },
        options: [
          { label: "Authenticated transactional emails with DMARC enforcement and brand indicators (BIMI)", weight: 1.0 },
          { label: "DMARC in enforcement mode for the primary domain", weight: 0.7 },
          { label: "SPF and DKIM configured but DMARC in monitor-only mode", weight: 0.35 },
          { label: "No email authentication for customer communications", weight: 0.0 },
        ],
      },
      {
        key: "retail_em_5",
        text: "What process exists for employees to report suspicious activity or emails?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 17,
        tooltip: {
          explanation:
            "A clear reporting process enables rapid detection of phishing campaigns and social engineering attempts.",
          insurerNote:
            "Established reporting workflows demonstrate security awareness culture to underwriters.",
          controlSlug: "suspicious-activity-reporting",
        },
        options: [
          { label: "One-click report button with automated triage, response workflow, and feedback loop", weight: 1.0 },
          { label: "Dedicated reporting channel (email, phone, app) with response SLA", weight: 0.7 },
          { label: "Informal reporting to manager or IT department", weight: 0.3 },
          { label: "No process for reporting suspicious activity", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 6: Network Security (PR.AC + DE.CM) ──
  {
    title: "Network Security",
    nistCategory: "PR.AC + DE.CM",
    questions: [
      {
        key: "retail_ns_1",
        text: "How is the store WiFi network separated between customer and POS/payment systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "PCI DSS requires that payment systems be isolated from guest and general-purpose networks to protect cardholder data.",
          insurerNote:
            "Lack of network separation between customer WiFi and POS systems is a critical PCI compliance failure.",
          controlSlug: "wifi-separation",
        },
        options: [
          { label: "Fully isolated networks with separate physical or logical infrastructure and firewall enforcement", weight: 1.0 },
          { label: "VLAN separation between customer, POS, and corporate networks", weight: 0.7 },
          { label: "Separate SSIDs on the same network infrastructure", weight: 0.3 },
          { label: "Single flat network shared by customers and POS systems", weight: 0.0 },
        ],
      },
      {
        key: "retail_ns_2",
        text: "How mature is the organization's firewall configuration and management?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 13,
        tooltip: {
          explanation:
            "Firewalls are the first line of defense for retail networks and are a core PCI DSS requirement for protecting cardholder data.",
          insurerNote:
            "Firewall maturity and rule management are evaluated in both PCI assessments and insurance applications.",
          controlSlug: "firewall-maturity",
        },
      },
      {
        key: "retail_ns_3",
        text: "How is the cardholder data environment (CDE) segmented from the rest of the network?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network segmentation of the CDE reduces PCI scope and limits the blast radius of a network compromise.",
          insurerNote:
            "Proper CDE segmentation is a fundamental PCI DSS requirement and a key insurance underwriting factor.",
          controlSlug: "cde-segmentation",
        },
        options: [
          { label: "Micro-segmented CDE with continuous monitoring, access controls, and regular penetration testing", weight: 1.0 },
          { label: "CDE isolated in a dedicated network segment with firewall rules", weight: 0.7 },
          { label: "Basic VLAN separation with some shared services", weight: 0.35 },
          { label: "No segmentation; CDE systems share the general network", weight: 0.0 },
        ],
      },
      {
        key: "retail_ns_4",
        text: "How is remote access to retail systems secured?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Remote access to POS and payment systems by vendors and IT staff must be tightly controlled to prevent unauthorized access.",
          insurerNote:
            "Unsecured remote access is one of the most common attack vectors in retail breaches.",
          controlSlug: "remote-access-security",
        },
        options: [
          { label: "Zero-trust access with MFA, just-in-time provisioning, and session recording", weight: 1.0 },
          { label: "VPN with MFA required for all remote access to retail networks", weight: 0.7 },
          { label: "VPN available but MFA not consistently enforced", weight: 0.35 },
          { label: "Direct remote access (RDP, VNC) without VPN or MFA", weight: 0.0 },
        ],
      },
      {
        key: "retail_ns_5",
        text: "What network monitoring capabilities are in place across retail locations?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 13,
        tooltip: {
          explanation:
            "Network monitoring detects anomalous traffic patterns, data exfiltration attempts, and unauthorized access across retail sites.",
          insurerNote:
            "Network monitoring and intrusion detection are expected controls for organizations handling payment data.",
          controlSlug: "network-monitoring",
        },
        options: [
          { label: "24/7 SOC monitoring with IDS/IPS, network flow analysis, and automated alerting across all locations", weight: 1.0 },
          { label: "IDS/IPS deployed with centralized log monitoring", weight: 0.7 },
          { label: "Basic traffic monitoring at headquarters with limited store visibility", weight: 0.35 },
          { label: "No network monitoring in place", weight: 0.0 },
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
        key: "retail_ir_1",
        text: "How mature is the organization's incident response plan for payment card breaches?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "A payment-specific IR plan provides structured guidance for containing card data breaches and meeting PCI notification requirements.",
          insurerNote:
            "A tested IR plan specific to payment breaches is a baseline requirement for retail cyber insurance.",
          controlSlug: "ir-plan-maturity",
        },
      },
      {
        key: "retail_ir_2",
        text: "How prepared is the organization for PCI breach notification requirements?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "PCI DSS and card brand rules require specific notification procedures when cardholder data is compromised.",
          insurerNote:
            "Failure to follow PCI breach notification procedures can result in significant fines from card brands.",
          controlSlug: "pci-breach-notification",
        },
        options: [
          { label: "Documented PCI-specific notification plan with card brand contacts, QSA engagement, and legal review", weight: 1.0 },
          { label: "General breach notification plan with PCI-specific addendum", weight: 0.65 },
          { label: "Awareness of requirements but no documented procedures", weight: 0.3 },
          { label: "Unaware of PCI breach notification obligations", weight: 0.0 },
        ],
      },
      {
        key: "retail_ir_3",
        text: "How does the organization handle customer notification after a data breach?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Timely and transparent customer notification maintains trust and meets legal obligations across multiple jurisdictions.",
          insurerNote:
            "Customer notification procedures and timelines are closely evaluated during breach claims.",
          controlSlug: "customer-notification",
        },
        options: [
          { label: "Pre-drafted notification templates with multi-channel delivery plan and legal pre-approval", weight: 1.0 },
          { label: "Documented notification procedures with legal review process", weight: 0.65 },
          { label: "Ad-hoc notification process developed during an incident", weight: 0.3 },
          { label: "No customer notification procedures defined", weight: 0.0 },
        ],
      },
      {
        key: "retail_ir_4",
        text: "What is the organization's cyber insurance coverage status?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Cyber insurance provides financial protection against breach costs, PCI fines, customer notification, and legal defense.",
          insurerNote:
            "Retail organizations should ensure coverage includes PCI fines, forensic investigation, and business interruption.",
          controlSlug: "cyber-insurance",
        },
        options: [
          { label: "Comprehensive policy with PCI fine coverage, reviewed annually and aligned to risk profile", weight: 1.0 },
          { label: "Active cyber insurance policy with standard retail coverage", weight: 0.7 },
          { label: "Basic policy with minimal coverage or significant exclusions", weight: 0.35 },
          { label: "No cyber insurance coverage", weight: 0.0 },
        ],
      },
      {
        key: "retail_ir_5",
        text: "How prepared is the organization for PCI forensic investigations (PFI)?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "PCI forensic investigations are mandatory after confirmed payment card breaches. Preparation ensures evidence preservation and cooperation.",
          insurerNote:
            "Organizations that can rapidly engage a PFI and preserve evidence receive faster claims resolution.",
          controlSlug: "forensics-readiness",
        },
        options: [
          { label: "Pre-engaged PFI firm with evidence preservation procedures and log retention policies", weight: 1.0 },
          { label: "PFI firm identified with basic evidence preservation guidelines", weight: 0.65 },
          { label: "Aware of PFI requirements but no preparations in place", weight: 0.3 },
          { label: "Unaware of PCI forensic investigation requirements", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 8: Vendor & Supply Chain (ID.SC) ──
  {
    title: "Vendor & Supply Chain",
    nistCategory: "ID.SC",
    questions: [
      {
        key: "retail_vs_1",
        text: "How does the organization assess the security of its payment processor?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Payment processors handle cardholder data and must maintain PCI compliance. Their security directly affects your risk.",
          insurerNote:
            "Payment processor security is a primary factor in retail cyber risk assessments.",
          controlSlug: "payment-processor-security",
        },
        options: [
          { label: "Annual review of PCI AOC, SOC 2 report, and contractual security requirements", weight: 1.0 },
          { label: "PCI compliance validation and contractual review during onboarding", weight: 0.65 },
          { label: "Reliance on processor's stated PCI compliance without verification", weight: 0.3 },
          { label: "No assessment of payment processor security", weight: 0.0 },
        ],
      },
      {
        key: "retail_vs_2",
        text: "How does the organization evaluate POS hardware and software vendors?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "POS vendors have privileged access to payment systems. Supply chain attacks via POS vendors can affect thousands of locations.",
          insurerNote:
            "POS vendor compromises have been responsible for some of the largest retail breaches.",
          controlSlug: "pos-vendor-assessment",
        },
        options: [
          { label: "Comprehensive vendor assessment with PCI validation, code review requirements, and ongoing monitoring", weight: 1.0 },
          { label: "Security questionnaire and PCI compliance verification during procurement", weight: 0.7 },
          { label: "Basic vendor reputation check before purchasing", weight: 0.3 },
          { label: "No security evaluation of POS vendors", weight: 0.0 },
        ],
      },
      {
        key: "retail_vs_3",
        text: "How does the organization manage security for third-party applications and plugins (loyalty, analytics, marketing)?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Third-party apps often have access to customer data and can introduce vulnerabilities, especially in e-commerce environments.",
          insurerNote:
            "Unvetted third-party applications are a growing source of data breaches in retail.",
          controlSlug: "third-party-app-security",
        },
        options: [
          { label: "Formal approval process with security review, sandboxed testing, and ongoing monitoring", weight: 1.0 },
          { label: "Security review required before deployment with periodic reassessment", weight: 0.7 },
          { label: "Basic review of app permissions before installation", weight: 0.35 },
          { label: "Third-party apps installed without security evaluation", weight: 0.0 },
        ],
      },
      {
        key: "retail_vs_4",
        text: "How frequently are vendor access permissions reviewed and recertified?",
        type: "frequency",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Vendor access should be regularly reviewed to ensure it remains appropriate and is revoked when no longer needed.",
          insurerNote:
            "Stale vendor access credentials are a common finding in retail breach investigations.",
          controlSlug: "vendor-access-review-frequency",
        },
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Annually", weight: 0.4 },
          { label: "Rarely or only when issues arise", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "retail_vs_5",
        text: "How does the organization assess supply chain cyber risk for retail operations?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Supply chain disruptions and compromises can affect inventory systems, order fulfillment, and customer data.",
          insurerNote:
            "Supply chain cyber risk is an emerging concern that insurers evaluate for retail organizations.",
          controlSlug: "supply-chain-risk",
        },
        options: [
          { label: "Formal supply chain risk program with vendor tiering, continuous monitoring, and contingency plans", weight: 1.0 },
          { label: "Risk assessment of critical suppliers with backup vendor identification", weight: 0.65 },
          { label: "Informal awareness of supply chain risks", weight: 0.3 },
          { label: "No supply chain cyber risk assessment", weight: 0.0 },
        ],
      },
    ],
  },

  // ── Section 9: Employee Training & Awareness (PR.AT) ──
  {
    title: "Employee Training & Awareness",
    nistCategory: "PR.AT",
    questions: [
      {
        key: "retail_ta_1",
        text: "How mature is the organization's security awareness training program?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "A mature training program ensures all retail employees understand their role in protecting payment data and customer information.",
          insurerNote:
            "Documented security training programs are a standard requirement for cyber insurance eligibility.",
          controlSlug: "security-training-maturity",
        },
      },
      {
        key: "retail_ta_2",
        text: "How is PCI DSS awareness maintained across the organization?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "All employees handling payment data must understand PCI requirements and their responsibilities for protecting cardholder data.",
          insurerNote:
            "PCI awareness training is mandatory for personnel in the cardholder data environment.",
          controlSlug: "pci-awareness",
        },
        options: [
          { label: "Role-based PCI training with annual certification and ongoing reinforcement", weight: 1.0 },
          { label: "Annual PCI awareness training for all relevant staff", weight: 0.65 },
          { label: "PCI training during onboarding only", weight: 0.3 },
          { label: "No PCI-specific awareness training", weight: 0.0 },
        ],
      },
      {
        key: "retail_ta_3",
        text: "How are employees trained to recognize social engineering attacks (in-person and digital)?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Retail employees face social engineering through phone calls, in-store interactions, and digital channels targeting payment systems.",
          insurerNote:
            "Social engineering awareness is critical in retail where employees interact directly with the public.",
          controlSlug: "social-engineering-awareness",
        },
        options: [
          { label: "Comprehensive program covering in-person, phone, and digital social engineering with regular simulations", weight: 1.0 },
          { label: "Training covering common retail social engineering scenarios", weight: 0.65 },
          { label: "Basic awareness included in general security training", weight: 0.3 },
          { label: "No social engineering specific training", weight: 0.0 },
        ],
      },
      {
        key: "retail_ta_4",
        text: "How does the organization manage BYOD (Bring Your Own Device) for retail employees?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "Personal devices accessing corporate systems can introduce malware and create data leakage risks if not properly managed.",
          insurerNote:
            "Unmanaged BYOD devices accessing payment or customer data represent significant breach risk.",
          controlSlug: "byod-policy",
        },
        options: [
          { label: "Formal BYOD policy with MDM enrollment, containerization, and compliance enforcement", weight: 1.0 },
          { label: "BYOD policy with required security settings and app restrictions", weight: 0.65 },
          { label: "Written BYOD guidelines with no technical enforcement", weight: 0.3 },
          { label: "No BYOD policy; personal devices used without restrictions", weight: 0.0 },
        ],
      },
      {
        key: "retail_ta_5",
        text: "How are employees trained on incident reporting procedures?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 17,
        tooltip: {
          explanation:
            "Employees are often the first to notice suspicious activity. Clear reporting procedures enable rapid incident detection.",
          insurerNote:
            "Organizations with documented and practiced reporting procedures detect breaches faster.",
          controlSlug: "incident-reporting-procedures",
        },
        options: [
          { label: "Regular training with clear escalation paths, practice scenarios, and accessible reporting tools", weight: 1.0 },
          { label: "Annual training on reporting procedures with documented escalation paths", weight: 0.65 },
          { label: "Basic instructions during onboarding to report issues to manager", weight: 0.3 },
          { label: "No training on incident reporting procedures", weight: 0.0 },
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
