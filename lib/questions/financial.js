export const SECTIONS = [
  // ──────────────────────────────────────────────
  // 1. Access Control & Authentication (PR.AC)
  // ──────────────────────────────────────────────
  {
    key: "access_control_auth",
    title: "Access Control & Authentication",
    nistCategory: "PR.AC",
    description:
      "Evaluate how your organization manages identity, authentication, and access to financial systems and customer data.",
    questions: [
      {
        key: "fin_mfa_financial_systems",
        text: "Which financial systems and platforms currently enforce multi-factor authentication (MFA)?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "MFA requires users to verify their identity with two or more factors (e.g., password plus a code from a phone) before accessing a system. For financial institutions, this is critical on core banking, trading, and payment platforms.",
          insurerNote:
            "Lack of MFA on financial systems is a leading cause of claim denials. Insurers view MFA as table-stakes for coverage eligibility.",
          controlSlug: "mfa-financial-systems",
        },
        options: [
          { label: "Core banking / ERP", weight: 0.25 },
          { label: "Payment processing platforms", weight: 0.25 },
          { label: "Customer-facing portals", weight: 0.2 },
          { label: "Email and collaboration tools", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_pam",
        text: "How does your organization manage privileged access to critical financial infrastructure?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Privileged access management (PAM) controls who has elevated permissions on systems that handle money, customer data, or regulatory records. PAM solutions enforce least-privilege principles and audit admin activity.",
          insurerNote:
            "Compromised privileged accounts are involved in the majority of financial breaches. Insurers look for dedicated PAM tooling and audit trails.",
          controlSlug: "privileged-access-management",
        },
        options: [
          { label: "Dedicated PAM solution with session recording and just-in-time access", weight: 1.0 },
          { label: "Shared admin accounts with manual logging", weight: 0.4 },
          { label: "Role-based access with periodic review but no dedicated PAM tool", weight: 0.6 },
          { label: "No formal privileged access controls", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_customer_data_access",
        text: "Which controls are in place to restrict employee access to customer financial data?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Customer financial data (account numbers, balances, transaction history) must be limited to employees who need it for their job. Controls include role-based access, data masking, and approval workflows.",
          insurerNote:
            "Insider threats and over-provisioned access are top concerns in financial services. Insurers want evidence of granular, need-to-know access controls.",
          controlSlug: "customer-data-access-controls",
        },
        options: [
          { label: "Role-based access control (RBAC) tied to job function", weight: 0.25 },
          { label: "Data masking or redaction for sensitive fields", weight: 0.2 },
          { label: "Manager approval required for elevated data access", weight: 0.2 },
          { label: "Audit logging of all customer data queries", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_offboarding",
        text: "How quickly is system access revoked when an employee or contractor is terminated?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "Offboarding is the process of removing all system access when someone leaves the organization. In financial services, delays create significant fraud and data theft risk.",
          insurerNote:
            "Claims stemming from former-employee access are common and often preventable. Insurers look for same-day revocation as a baseline.",
          controlSlug: "employee-offboarding",
        },
        options: [
          { label: "Automated same-day revocation across all systems", weight: 1.0 },
          { label: "Manual same-day revocation with a checklist", weight: 0.75 },
          { label: "Within one week of departure", weight: 0.35 },
          { label: "No formal offboarding process", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_access_review_frequency",
        text: "How often does your organization review and certify user access rights across financial systems?",
        type: "frequency",
        nistFunction: "Identify",
        cisControl: 5,
        tooltip: {
          explanation:
            "Access reviews (also called access certifications) verify that every user still needs the permissions they hold. This prevents privilege creep and catches orphaned accounts.",
          insurerNote:
            "Regulators and insurers both expect periodic access reviews. Quarterly reviews are considered best practice for financial institutions.",
          controlSlug: "access-review-frequency",
        },
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.85 },
          { label: "Semi-annually", weight: 0.6 },
          { label: "Annually", weight: 0.35 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "fin_auth_policy_maturity",
        text: "How mature is your organization's authentication and password policy?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "An authentication policy defines rules for passwords, MFA, session timeouts, and lockout thresholds. Mature policies align with NIST SP 800-63 and are enforced technically, not just on paper.",
          insurerNote:
            "A documented and enforced authentication policy is a baseline underwriting requirement. Policies that exist only on paper receive minimal credit.",
          controlSlug: "authentication-policy-maturity",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. Data Protection & Encryption (PR.DS)
  // ──────────────────────────────────────────────
  {
    key: "data_protection_encryption",
    title: "Data Protection & Encryption",
    nistCategory: "PR.DS",
    description:
      "Assess how your organization protects sensitive financial data through encryption, classification, and secure handling procedures.",
    questions: [
      {
        key: "fin_encryption_at_rest_transit",
        text: "Where is encryption applied to protect customer and financial data?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Encryption scrambles data so only authorized parties can read it. 'At rest' means stored data (databases, file servers). 'In transit' means data moving across networks (TLS/SSL). Both are essential for financial institutions.",
          insurerNote:
            "Unencrypted data at rest or in transit significantly increases breach severity and may reduce coverage. Insurers expect encryption on both fronts.",
          controlSlug: "encryption-at-rest-transit",
        },
        options: [
          { label: "Data at rest in databases and storage", weight: 0.25 },
          { label: "Data in transit (TLS 1.2+ enforced)", weight: 0.25 },
          { label: "Backups and archives", weight: 0.2 },
          { label: "Laptop and workstation full-disk encryption", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_pci_cde",
        text: "How is your cardholder data environment (CDE) segmented and protected?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "The cardholder data environment includes all systems that store, process, or transmit payment card data. PCI DSS requires the CDE to be isolated from the rest of the network to reduce attack surface.",
          insurerNote:
            "A poorly segmented CDE expands the scope of PCI audits and breach liability. Insurers look for strong network segmentation around payment data.",
          controlSlug: "cardholder-data-environment",
        },
        options: [
          { label: "Fully segmented with dedicated network zones, firewalls, and monitoring", weight: 1.0 },
          { label: "Partially segmented with some controls in place", weight: 0.55 },
          { label: "CDE exists but is not segmented from the general network", weight: 0.2 },
          { label: "Not applicable, we do not process card data directly", weight: 0.8 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_data_classification",
        text: "Which data classification practices does your organization follow?",
        type: "multiselect",
        nistFunction: "Identify",
        cisControl: 3,
        tooltip: {
          explanation:
            "Data classification assigns labels (e.g., Public, Internal, Confidential, Restricted) to information based on sensitivity. This guides how data should be stored, transmitted, and accessed.",
          insurerNote:
            "Without classification, organizations cannot demonstrate they treat sensitive financial data differently from general data. Insurers expect a formal scheme aligned with regulatory requirements.",
          controlSlug: "data-classification",
        },
        options: [
          { label: "Formal classification scheme (e.g., Public / Internal / Confidential / Restricted)", weight: 0.25 },
          { label: "Automated data discovery and labeling tools", weight: 0.2 },
          { label: "Classification-based access and handling rules", weight: 0.2 },
          { label: "Regular review and reclassification of data assets", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_secure_disposal",
        text: "How does your organization handle secure disposal of financial records and media?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Secure disposal ensures that decommissioned hardware, expired records, and obsolete media cannot be recovered. Methods include cryptographic erasure, degaussing, and physical destruction.",
          insurerNote:
            "Improper disposal of financial records has led to significant regulatory fines under GLBA. Insurers look for documented and verifiable destruction processes.",
          controlSlug: "secure-disposal",
        },
        options: [
          { label: "Certified destruction with chain-of-custody documentation for all media types", weight: 1.0 },
          { label: "Secure shredding for paper; software-based wipe for digital media", weight: 0.65 },
          { label: "Ad-hoc disposal with no formal documentation", weight: 0.2 },
          { label: "No secure disposal process in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_tokenization",
        text: "What tokenization practices are used to protect sensitive financial data?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Tokenization replaces sensitive data (e.g., card numbers, account numbers) with non-sensitive tokens that have no exploitable value. This reduces the scope of PCI compliance and limits breach impact.",
          insurerNote:
            "Tokenization dramatically reduces the value of stolen data. Insurers view it as a strong mitigating control that can lower premiums.",
          controlSlug: "tokenization-practices",
        },
        options: [
          { label: "Tokenization applied to all stored payment and sensitive account data", weight: 1.0 },
          { label: "Tokenization applied to payment card data only", weight: 0.7 },
          { label: "Tokenization in limited use or pilot phase", weight: 0.35 },
          { label: "No tokenization in use", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_dlp",
        text: "Which data loss prevention (DLP) controls does your organization have in place?",
        type: "multiselect",
        nistFunction: "Detect",
        cisControl: 3,
        tooltip: {
          explanation:
            "DLP tools and policies prevent sensitive data from leaving the organization through email, file transfers, USB drives, or cloud uploads. They can block, quarantine, or alert on policy violations.",
          insurerNote:
            "DLP is a key detective control. Insurers want to see that the organization can detect and stop unauthorized data exfiltration, especially of customer financial records.",
          controlSlug: "data-loss-prevention",
        },
        options: [
          { label: "Email DLP rules blocking sensitive data in outbound messages", weight: 0.25 },
          { label: "Endpoint DLP preventing unauthorized USB or cloud uploads", weight: 0.25 },
          { label: "Network DLP monitoring data flows at egress points", weight: 0.2 },
          { label: "Cloud DLP for SaaS and IaaS environments", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. Transaction & Payment Security (PR.DS + DE.CM)
  // ──────────────────────────────────────────────
  {
    key: "transaction_payment_security",
    title: "Transaction & Payment Security",
    nistCategory: "PR.DS + DE.CM",
    description:
      "Evaluate how your organization secures payment processing, monitors transactions, and detects fraudulent activity.",
    questions: [
      {
        key: "fin_pci_compliance",
        text: "What is the current state of your PCI DSS compliance program?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "PCI DSS is the Payment Card Industry Data Security Standard, a set of security requirements for any organization that stores, processes, or transmits cardholder data. Compliance is validated through self-assessment questionnaires or on-site audits.",
          insurerNote:
            "PCI non-compliance can void coverage for payment-related breaches. Insurers expect at minimum a current SAQ or Report on Compliance.",
          controlSlug: "pci-dss-compliance",
        },
      },
      {
        key: "fin_payment_processing_security",
        text: "Which security controls protect your payment processing infrastructure?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Payment processing security encompasses the hardware, software, and procedures that protect transactions from initiation to settlement. This includes point-to-point encryption, secure APIs, and isolated processing environments.",
          insurerNote:
            "Weak payment processing controls are a direct path to financial loss. Insurers want to see layered defenses around all payment channels.",
          controlSlug: "payment-processing-security",
        },
        options: [
          { label: "Point-to-point encryption (P2PE) on card-present transactions", weight: 0.25 },
          { label: "Secure API gateways with mutual TLS for payment integrations", weight: 0.25 },
          { label: "Isolated payment processing environment (separate VLAN/subnet)", weight: 0.2 },
          { label: "Real-time transaction validation and velocity checks", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_transaction_monitoring",
        text: "How does your organization monitor transactions for anomalies and suspicious activity?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "Transaction monitoring uses rules and analytics to identify unusual patterns such as large transfers, rapid-fire transactions, or activity outside normal business hours. Advanced systems use machine learning for behavioral analysis.",
          insurerNote:
            "Real-time transaction monitoring is a key underwriting factor. Insurers look for automated detection that can flag and hold suspicious transactions before they complete.",
          controlSlug: "transaction-monitoring",
        },
        options: [
          { label: "Automated real-time monitoring with ML-based anomaly detection", weight: 1.0 },
          { label: "Rule-based automated alerts with manual review", weight: 0.7 },
          { label: "Periodic manual review of transaction logs", weight: 0.35 },
          { label: "No formal transaction monitoring", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_fraud_detection",
        text: "Which fraud detection capabilities does your organization employ?",
        type: "multiselect",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "Fraud detection goes beyond transaction monitoring to include identity verification, behavioral biometrics, device fingerprinting, and cross-channel correlation to catch sophisticated fraud schemes.",
          insurerNote:
            "Financial institutions with multi-layered fraud detection programs demonstrate lower loss ratios. Insurers reward organizations that invest in proactive fraud prevention.",
          controlSlug: "fraud-detection",
        },
        options: [
          { label: "Behavioral analytics and user profiling", weight: 0.25 },
          { label: "Device fingerprinting and geolocation checks", weight: 0.2 },
          { label: "Cross-channel fraud correlation (online, mobile, branch)", weight: 0.2 },
          { label: "Identity verification for high-value transactions", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_secure_payment_channels",
        text: "How does your organization secure customer-facing payment channels?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Secure payment channels include online banking portals, mobile apps, ACH interfaces, and wire transfer systems. Each must be hardened against interception, session hijacking, and unauthorized access.",
          insurerNote:
            "Customer-facing payment channels are a primary attack vector. Insurers assess whether all channels have equivalent security controls and session protections.",
          controlSlug: "secure-payment-channels",
        },
        options: [
          { label: "All channels enforce MFA, TLS 1.2+, session timeouts, and device binding", weight: 1.0 },
          { label: "Most channels have strong security but some legacy systems lack full controls", weight: 0.6 },
          { label: "Basic HTTPS and password authentication on most channels", weight: 0.3 },
          { label: "Security varies significantly across payment channels", weight: 0.1 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. Backup & Business Continuity (RC.RP)
  // ──────────────────────────────────────────────
  {
    key: "backup_business_continuity",
    title: "Backup & Business Continuity",
    nistCategory: "RC.RP",
    description:
      "Assess your organization's ability to maintain operations and recover critical financial systems during and after a disruption.",
    questions: [
      {
        key: "fin_backup_frequency",
        text: "How frequently are critical financial systems and databases backed up?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Backup frequency determines the maximum amount of data that can be lost in a disaster (the recovery point). Financial institutions typically need daily or more frequent backups for transaction-critical systems.",
          insurerNote:
            "Insurers assess backup frequency against data criticality. Infrequent backups of financial data increase exposure to ransomware and operational disruption claims.",
          controlSlug: "backup-frequency",
        },
        options: [
          { label: "Continuous / real-time replication", weight: 1.0 },
          { label: "Daily", weight: 0.85 },
          { label: "Weekly", weight: 0.5 },
          { label: "Monthly", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "fin_dr_testing",
        text: "How often does your organization conduct disaster recovery tests for critical financial systems?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Disaster recovery testing validates that backup systems, failover procedures, and recovery runbooks actually work under simulated failure conditions. Without testing, recovery plans are theoretical.",
          insurerNote:
            "Untested DR plans are a red flag. Insurers expect at least annual full-scale DR tests, with quarterly tabletop exercises for financial institutions.",
          controlSlug: "disaster-recovery-testing",
        },
        options: [
          { label: "Quarterly or more frequently", weight: 1.0 },
          { label: "Semi-annually", weight: 0.75 },
          { label: "Annually", weight: 0.5 },
          { label: "Rarely (ad-hoc or upon audit request)", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "fin_offsite_storage",
        text: "How are backups stored to protect against site-wide failures?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "Offsite backup storage ensures that a localized disaster (fire, flood, ransomware) cannot destroy both production systems and their backups. The 3-2-1 rule (3 copies, 2 media types, 1 offsite) is a common standard.",
          insurerNote:
            "Ransomware actors deliberately target local backups. Insurers strongly favor air-gapped or immutable offsite storage that cannot be encrypted by attackers.",
          controlSlug: "offsite-backup-storage",
        },
        options: [
          { label: "Air-gapped / immutable offsite backups with geographically separate storage", weight: 1.0 },
          { label: "Cloud-based backups with versioning and deletion protection", weight: 0.8 },
          { label: "Offsite tape or disk rotation without immutability", weight: 0.5 },
          { label: "All backups stored on-premises only", weight: 0.1 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_rto_rpo",
        text: "How well documented and validated are your Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "RTO is the maximum acceptable downtime for a system. RPO is the maximum acceptable data loss measured in time. Both must be defined per system, agreed upon with the business, and validated through testing.",
          insurerNote:
            "Documented and tested RTO/RPO targets demonstrate operational resilience maturity. Insurers use these to assess potential business interruption exposure.",
          controlSlug: "rto-rpo-documentation",
        },
        options: [
          { label: "Documented per system, approved by business owners, and validated through DR tests", weight: 1.0 },
          { label: "Documented per system but not regularly validated through testing", weight: 0.6 },
          { label: "General targets exist but not defined per system", weight: 0.3 },
          { label: "No formal RTO/RPO targets defined", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_bcp_maturity",
        text: "How mature is your organization's business continuity plan (BCP)?",
        type: "maturity",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "A business continuity plan covers how the organization will maintain critical operations during disruptions, including alternate work sites, communication plans, manual processing fallbacks, and escalation procedures.",
          insurerNote:
            "Financial regulators (OCC, FFIEC) require documented BCPs. Insurers assess BCP maturity when evaluating business interruption coverage limits.",
          controlSlug: "business-continuity-plan-maturity",
        },
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. Endpoint & Infrastructure Security (PR.PT)
  // ──────────────────────────────────────────────
  {
    key: "endpoint_infrastructure_security",
    title: "Endpoint & Infrastructure Security",
    nistCategory: "PR.PT",
    description:
      "Evaluate how your organization protects endpoints, servers, and infrastructure components from threats.",
    questions: [
      {
        key: "fin_endpoint_protection",
        text: "What level of endpoint protection is deployed across your organization?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 10,
        tooltip: {
          explanation:
            "Endpoint protection covers antivirus, anti-malware, endpoint detection and response (EDR), and host-based firewalls on desktops, laptops, and servers. Modern EDR solutions provide behavioral analysis and automated response.",
          insurerNote:
            "EDR with 24/7 monitoring is increasingly a baseline requirement for cyber insurance. Traditional antivirus alone is no longer considered sufficient.",
          controlSlug: "endpoint-protection-coverage",
        },
        options: [
          { label: "EDR with 24/7 managed detection and response (MDR) on all endpoints", weight: 1.0 },
          { label: "EDR deployed on all endpoints with internal monitoring", weight: 0.8 },
          { label: "Traditional antivirus on most endpoints", weight: 0.4 },
          { label: "Inconsistent or no endpoint protection", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_patch_management",
        text: "How frequently are critical security patches applied to production systems?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 7,
        tooltip: {
          explanation:
            "Patch management is the process of applying vendor-released updates that fix security vulnerabilities. Critical patches address actively exploited flaws and should be applied rapidly, especially on internet-facing and financial systems.",
          insurerNote:
            "Unpatched vulnerabilities are a top root cause in breaches. Insurers expect critical patches within 14 days and may deny claims where known vulnerabilities were left unpatched.",
          controlSlug: "patch-management-frequency",
        },
        options: [
          { label: "Within 72 hours for critical, weekly for others", weight: 1.0 },
          { label: "Within 14 days for critical, monthly for others", weight: 0.75 },
          { label: "Monthly patch cycle for all priorities", weight: 0.5 },
          { label: "Quarterly or less frequently", weight: 0.2 },
          { label: "Never / no formal patch process", weight: 0.0 },
        ],
      },
      {
        key: "fin_server_hardening",
        text: "Which server hardening practices does your organization follow?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 4,
        tooltip: {
          explanation:
            "Server hardening reduces the attack surface by removing unnecessary services, applying secure configurations, and enforcing baseline standards. CIS Benchmarks provide industry-accepted hardening guides.",
          insurerNote:
            "Hardened servers are significantly more resistant to exploitation. Insurers look for evidence of baseline configurations and regular compliance scanning.",
          controlSlug: "server-hardening",
        },
        options: [
          { label: "CIS Benchmarks or equivalent hardening standards applied", weight: 0.25 },
          { label: "Unnecessary services and ports disabled", weight: 0.2 },
          { label: "Configuration compliance scanning and drift detection", weight: 0.2 },
          { label: "Automated provisioning from hardened images/templates", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_mdm",
        text: "How does your organization manage and secure mobile devices used to access financial systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "Mobile device management (MDM) enforces security policies on smartphones and tablets that access corporate data, including encryption, remote wipe, app restrictions, and containerization of work data.",
          insurerNote:
            "Mobile devices are an expanding attack surface. Insurers want assurance that lost or compromised devices cannot provide access to financial systems and customer data.",
          controlSlug: "mobile-device-management",
        },
        options: [
          { label: "Full MDM/UEM with containerization, conditional access, and remote wipe", weight: 1.0 },
          { label: "MDM with basic policies (encryption, PIN, remote wipe)", weight: 0.7 },
          { label: "BYOD with some access restrictions but no MDM", weight: 0.3 },
          { label: "No mobile device management in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_infrastructure_monitoring",
        text: "What infrastructure monitoring capabilities are in place for critical financial systems?",
        type: "multiselect",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "Infrastructure monitoring tracks the health, performance, and security of servers, databases, and network equipment. It provides early warning of failures, capacity issues, and potential security incidents.",
          insurerNote:
            "Comprehensive monitoring reduces mean time to detect and respond to incidents. Insurers view robust monitoring as evidence of operational maturity.",
          controlSlug: "infrastructure-monitoring",
        },
        options: [
          { label: "Real-time performance and availability monitoring with alerting", weight: 0.25 },
          { label: "Log aggregation and centralized analysis", weight: 0.25 },
          { label: "Automated capacity planning and threshold alerts", weight: 0.2 },
          { label: "Database activity monitoring for critical data stores", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 6. Email & Communication Security (PR.AT + DE.CM)
  // ──────────────────────────────────────────────
  {
    key: "email_communication_security",
    title: "Email & Communication Security",
    nistCategory: "PR.AT + DE.CM",
    description:
      "Assess how your organization defends against email-based threats and secures sensitive financial communications.",
    questions: [
      {
        key: "fin_email_security_maturity",
        text: "How mature is your organization's email security program?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Email security encompasses spam filtering, malware scanning, URL rewriting, attachment sandboxing, impersonation protection, and user awareness. A mature program layers technical controls with training.",
          insurerNote:
            "Email is the number one attack vector for financial institutions. Insurers expect advanced email security beyond basic spam filtering.",
          controlSlug: "email-security-maturity",
        },
      },
      {
        key: "fin_phishing_simulation",
        text: "How often does your organization conduct phishing simulation exercises?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Phishing simulations send mock phishing emails to employees to test awareness and measure click rates. Results identify who needs additional training and track improvement over time.",
          insurerNote:
            "Regular phishing testing is a top-tier underwriting factor. Insurers look for ongoing programs (monthly or quarterly) with documented improvement trends.",
          controlSlug: "phishing-simulation-frequency",
        },
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Semi-annually", weight: 0.5 },
          { label: "Annually", weight: 0.25 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "fin_secure_file_transfer",
        text: "How does your organization securely transfer sensitive financial documents with external parties?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Secure file transfer replaces ad-hoc email attachments with encrypted, auditable channels for sharing sensitive documents like account statements, tax records, and wire instructions.",
          insurerNote:
            "Unencrypted financial documents sent via email are a common source of data exposure claims. Insurers prefer dedicated secure file transfer solutions.",
          controlSlug: "secure-file-transfer",
        },
        options: [
          { label: "Dedicated SFTP/MFT platform with encryption, access controls, and audit logs", weight: 1.0 },
          { label: "Encrypted email with DLP rules for sensitive attachments", weight: 0.7 },
          { label: "Cloud file sharing with link expiration and password protection", weight: 0.5 },
          { label: "Regular email attachments with no special protections", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_dmarc",
        text: "What is your organization's DMARC enforcement level for email authentication?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 9,
        tooltip: {
          explanation:
            "DMARC (Domain-based Message Authentication, Reporting & Conformance) prevents attackers from spoofing your email domain. Combined with SPF and DKIM, DMARC at 'reject' policy blocks fraudulent emails claiming to be from your organization.",
          insurerNote:
            "DMARC at 'reject' is increasingly required for cyber insurance eligibility. Financial institutions without DMARC are highly vulnerable to business email compromise.",
          controlSlug: "dmarc-configuration",
        },
        options: [
          { label: "DMARC at p=reject with SPF and DKIM aligned on all domains", weight: 1.0 },
          { label: "DMARC at p=quarantine", weight: 0.7 },
          { label: "DMARC at p=none (monitoring only)", weight: 0.35 },
          { label: "No DMARC record configured", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_wire_transfer_verification",
        text: "Which controls are in place to verify wire transfer and ACH payment requests?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Wire transfer fraud (including business email compromise) is one of the costliest cyber threats to financial institutions. Verification procedures ensure that transfer requests are legitimate before funds are released.",
          insurerNote:
            "Wire transfer fraud is the single largest category of financial cyber claims. Insurers specifically ask about callback verification and dual authorization procedures.",
          controlSlug: "wire-transfer-verification",
        },
        options: [
          { label: "Out-of-band callback verification to a known number for all transfers above a threshold", weight: 0.25 },
          { label: "Dual authorization (two-person approval) for high-value transfers", weight: 0.25 },
          { label: "Automated alerts for new payees or changed banking details", weight: 0.2 },
          { label: "Staff training specific to BEC and wire fraud scenarios", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 7. Network Security & Monitoring (PR.AC + DE.CM)
  // ──────────────────────────────────────────────
  {
    key: "network_security_monitoring",
    title: "Network Security & Monitoring",
    nistCategory: "PR.AC + DE.CM",
    description:
      "Evaluate how your organization segments, defends, and monitors network traffic across financial systems.",
    questions: [
      {
        key: "fin_network_segmentation",
        text: "How is your network segmented to isolate critical financial systems?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network segmentation divides the network into zones (e.g., production, development, PCI, guest) with firewalls or access controls between them. This limits lateral movement if an attacker gains a foothold.",
          insurerNote:
            "Flat networks allow attackers to move freely from a compromised workstation to critical servers. Insurers strongly favor micro-segmentation or at minimum zone-based segmentation.",
          controlSlug: "network-segmentation",
        },
        options: [
          { label: "Micro-segmentation with zero-trust network architecture", weight: 1.0 },
          { label: "Zone-based segmentation with firewalls between critical and general networks", weight: 0.7 },
          { label: "VLANs with basic ACLs but limited enforcement", weight: 0.4 },
          { label: "Flat network with no segmentation", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_firewall_ids_maturity",
        text: "How mature is your firewall and intrusion detection/prevention system (IDS/IPS) deployment?",
        type: "maturity",
        nistFunction: "Detect",
        cisControl: 13,
        tooltip: {
          explanation:
            "Firewalls control traffic flow between network zones. IDS/IPS systems detect and can block malicious traffic patterns. Mature deployments include next-gen firewalls, regularly updated rule sets, and 24/7 monitoring.",
          insurerNote:
            "Firewall and IDS/IPS are foundational controls. Insurers expect next-generation capabilities with regular rule tuning and centralized log analysis.",
          controlSlug: "firewall-ids-maturity",
        },
      },
      {
        key: "fin_siem",
        text: "What is your organization's approach to Security Information and Event Management (SIEM)?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 8,
        tooltip: {
          explanation:
            "A SIEM collects, correlates, and analyzes security logs from across the environment to detect threats. It provides centralized visibility and is essential for regulatory compliance and incident investigation.",
          insurerNote:
            "SIEM with 24/7 monitoring demonstrates strong detection capability. Insurers increasingly require centralized logging and monitoring as a condition of coverage.",
          controlSlug: "siem-implementation",
        },
        options: [
          { label: "SIEM with 24/7 SOC monitoring, automated correlation, and SOAR integration", weight: 1.0 },
          { label: "SIEM with business-hours monitoring and manual investigation", weight: 0.65 },
          { label: "Centralized logging without SIEM correlation or active monitoring", weight: 0.3 },
          { label: "No centralized logging or SIEM", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_nac",
        text: "How does your organization control which devices can connect to the network?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "Network Access Control (NAC) ensures only authorized and compliant devices can access the network. NAC can check for updated antivirus, OS patches, and approved configurations before granting access.",
          insurerNote:
            "Unmanaged devices on the network are a significant risk. Insurers look for NAC or equivalent device trust verification, especially in financial environments.",
          controlSlug: "network-access-control",
        },
        options: [
          { label: "802.1X NAC with device health checks and automatic remediation", weight: 1.0 },
          { label: "NAC with device authentication but limited health checks", weight: 0.65 },
          { label: "MAC address filtering or basic port security", weight: 0.3 },
          { label: "No network access controls, any device can connect", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_pentest_frequency",
        text: "How often does your organization conduct penetration testing on financial systems and applications?",
        type: "frequency",
        nistFunction: "Identify",
        cisControl: 18,
        tooltip: {
          explanation:
            "Penetration testing simulates real-world attacks to find vulnerabilities before adversaries do. For financial institutions, this should cover external networks, web applications, internal networks, and social engineering.",
          insurerNote:
            "Annual penetration testing is a common insurance requirement. Insurers look for third-party testing with documented remediation of critical findings.",
          controlSlug: "penetration-testing-frequency",
        },
        options: [
          { label: "Quarterly or continuous", weight: 1.0 },
          { label: "Semi-annually", weight: 0.75 },
          { label: "Annually", weight: 0.5 },
          { label: "Less than annually or ad-hoc", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8. Incident Response & Regulatory Reporting (RS.RP)
  // ──────────────────────────────────────────────
  {
    key: "incident_response_regulatory",
    title: "Incident Response & Regulatory Reporting",
    nistCategory: "RS.RP",
    description:
      "Evaluate your organization's preparedness for security incidents and ability to meet regulatory reporting obligations.",
    questions: [
      {
        key: "fin_ir_plan_maturity",
        text: "How mature is your organization's incident response plan?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "An incident response plan defines roles, procedures, and communication protocols for handling security incidents. Mature plans are documented, regularly tested through tabletop exercises, and updated based on lessons learned.",
          insurerNote:
            "A tested IR plan is a top underwriting factor. Insurers may require proof of annual tabletop exercises and named IR team members as a condition of coverage.",
          controlSlug: "incident-response-plan-maturity",
        },
      },
      {
        key: "fin_regulatory_notification",
        text: "How prepared is your organization to meet regulatory breach notification requirements under GLBA and state laws?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "GLBA's Safeguards Rule and various state laws require financial institutions to notify regulators, customers, and sometimes law enforcement within specific timeframes after a data breach. Preparation includes pre-drafted templates, legal counsel on retainer, and documented escalation paths. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
          insurerNote:
            "Failure to meet notification deadlines can result in regulatory fines that may not be covered by insurance. Insurers want to see documented notification procedures specific to financial regulations.",
          controlSlug: "regulatory-notification-procedures",
        },
        options: [
          { label: "Documented procedures with pre-drafted notifications, legal counsel on retainer, and regular drills", weight: 1.0 },
          { label: "General notification procedures exist but are not specific to financial regulations", weight: 0.55 },
          { label: "Awareness of requirements but no documented procedures", weight: 0.2 },
          { label: "No preparation for regulatory breach notification", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_cyber_insurance",
        text: "What is the current state of your organization's cyber insurance coverage?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Cyber insurance provides financial protection against losses from data breaches, ransomware, business interruption, and regulatory fines. Coverage should be tailored to financial services risks and aligned with the organization's risk profile.",
          insurerNote:
            "This question helps assess risk transfer strategy. Organizations with adequate coverage demonstrate mature risk management. Underinsured organizations face catastrophic out-of-pocket costs.",
          controlSlug: "cyber-insurance-coverage",
        },
        options: [
          { label: "Comprehensive policy with coverage limits aligned to risk assessment, reviewed annually", weight: 1.0 },
          { label: "Cyber insurance in place but limits may not reflect current risk exposure", weight: 0.6 },
          { label: "Basic cyber rider on general liability policy", weight: 0.3 },
          { label: "No cyber insurance coverage", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_incident_tracking",
        text: "How does your organization track and learn from security incidents?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Incident tracking includes logging all security events, conducting root cause analysis, documenting lessons learned, and feeding improvements back into security controls. This creates a continuous improvement cycle.",
          insurerNote:
            "Organizations that track and learn from incidents demonstrate lower repeat-incident rates. Insurers value evidence of continuous improvement in security posture.",
          controlSlug: "incident-tracking",
        },
        options: [
          { label: "Dedicated incident management platform with root cause analysis, metrics, and trend reporting", weight: 1.0 },
          { label: "Ticketing system used for incidents with post-incident reviews for major events", weight: 0.7 },
          { label: "Informal tracking with occasional after-action discussions", weight: 0.3 },
          { label: "No formal incident tracking or review process", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_forensics",
        text: "What forensic investigation capabilities does your organization have access to?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "Digital forensics involves collecting, preserving, and analyzing digital evidence after a security incident. Capabilities include disk imaging, memory analysis, network packet capture, and chain-of-custody procedures.",
          insurerNote:
            "Forensic readiness reduces investigation time and cost. Many cyber policies require using approved forensic firms. Having a retainer in place accelerates response.",
          controlSlug: "forensics-capability",
        },
        options: [
          { label: "Retainer with approved forensic firm plus internal forensic tools and trained staff", weight: 1.0 },
          { label: "Retainer with external forensic firm but no internal capability", weight: 0.7 },
          { label: "Internal IT staff with some forensic tools but no formal training", weight: 0.35 },
          { label: "No forensic investigation capability", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 9. Vendor & Third-Party Risk (GV.SC)
  // ──────────────────────────────────────────────
  {
    key: "vendor_third_party_risk",
    title: "Vendor & Third-Party Risk",
    nistCategory: "GV.SC",
    description:
      "Assess how your organization evaluates and manages cybersecurity risk from vendors, partners, and service providers.",
    questions: [
      {
        key: "fin_vendor_risk_program",
        text: "How does your organization assess cybersecurity risk for third-party vendors?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Vendor risk assessment evaluates the security posture of third parties before and during the relationship. This includes security questionnaires, evidence review, risk tiering, and ongoing monitoring.",
          insurerNote:
            "Third-party breaches are a leading cause of financial institution incidents. Insurers expect a formal vendor risk management program with tiered assessments based on data access.",
          controlSlug: "vendor-risk-assessment-program",
        },
        options: [
          { label: "Formal program with risk tiering, pre-contract assessment, and continuous monitoring", weight: 1.0 },
          { label: "Security questionnaires and evidence review during onboarding only", weight: 0.6 },
          { label: "Informal review of vendor security on a case-by-case basis", weight: 0.25 },
          { label: "No vendor security assessment process", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_fourth_party_risk",
        text: "How does your organization address fourth-party (your vendors' vendors) risk?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Fourth-party risk arises from your vendors' own supply chain. A breach at a subcontractor or cloud provider used by your vendor can impact your data. Managing this requires contractual requirements, subcontractor disclosure, and concentration risk analysis.",
          insurerNote:
            "Major supply chain breaches (SolarWinds, MOVEit) have shown the impact of fourth-party risk. Insurers are increasingly asking about supply chain visibility beyond direct vendors.",
          controlSlug: "fourth-party-risk-awareness",
        },
        options: [
          { label: "Contractual requirements for subcontractor disclosure with concentration risk analysis", weight: 1.0 },
          { label: "Awareness and contractual flow-down clauses but no active monitoring", weight: 0.55 },
          { label: "Reliance on vendor attestations without independent verification", weight: 0.25 },
          { label: "No consideration of fourth-party risk", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_soc2_requirements",
        text: "Which assurance reports or certifications does your organization require from critical vendors?",
        type: "multiselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Assurance reports like SOC 2 Type II provide independent verification of a vendor's security controls. Other relevant certifications include PCI DSS (for payment processors), ISO 27001, and HITRUST for health-adjacent financial services.",
          insurerNote:
            "SOC 2 Type II reports are the gold standard for vendor assurance. Insurers look favorably on organizations that require and review these reports from critical vendors.",
          controlSlug: "soc2-requirements",
        },
        options: [
          { label: "SOC 2 Type II reports reviewed annually", weight: 0.25 },
          { label: "PCI DSS Attestation of Compliance from payment-related vendors", weight: 0.25 },
          { label: "ISO 27001 certification verification", weight: 0.2 },
          { label: "Penetration test results or security assessment summaries", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
      {
        key: "fin_vendor_access_controls",
        text: "How does your organization control and monitor vendor access to your systems and data?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 15,
        tooltip: {
          explanation:
            "Vendor access controls limit what third parties can see and do within your environment. Best practices include dedicated vendor accounts, just-in-time access, session recording, and separate network segments for vendor connectivity.",
          insurerNote:
            "Vendor credentials are a frequent attack vector. Insurers want to see that vendor access is tightly controlled, monitored, and regularly reviewed.",
          controlSlug: "vendor-access-controls",
        },
        options: [
          { label: "Dedicated vendor accounts with just-in-time access, MFA, session recording, and network segmentation", weight: 1.0 },
          { label: "Dedicated vendor accounts with MFA and access logging", weight: 0.7 },
          { label: "Shared accounts with basic access restrictions", weight: 0.25 },
          { label: "Vendors use employee-equivalent accounts with no special controls", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_vendor_audit_frequency",
        text: "How often does your organization re-assess the security posture of critical vendors?",
        type: "frequency",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Ongoing vendor risk assessment ensures that vendors maintain their security posture over time. This includes reviewing updated SOC reports, reassessing risk ratings, and monitoring for vendor-related security incidents.",
          insurerNote:
            "Point-in-time vendor assessments lose value quickly. Insurers expect annual re-assessment of critical vendors at minimum, with continuous monitoring for high-risk relationships.",
          controlSlug: "vendor-audit-frequency",
        },
        options: [
          { label: "Quarterly with continuous monitoring for critical vendors", weight: 1.0 },
          { label: "Annually for all critical vendors", weight: 0.7 },
          { label: "Every 2-3 years or upon contract renewal", weight: 0.35 },
          { label: "Only during initial onboarding", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 10. Compliance & Governance (GV)
  // ──────────────────────────────────────────────
  {
    key: "compliance_governance",
    title: "Compliance & Governance",
    nistCategory: "GV",
    description:
      "Evaluate your organization's governance framework, regulatory compliance posture, and security program oversight.",
    questions: [
      {
        key: "fin_glba_safeguards",
        text: "What is the current state of your organization's compliance with the GLBA Safeguards Rule?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "The GLBA Safeguards Rule requires financial institutions to develop, implement, and maintain a comprehensive information security program. FTC amended the Safeguards Rule in 2021. Portions became effective in January 2022, and the compliance deadline for certain updated requirements was extended to June 9, 2023. Updated requirements include a qualified individual, written risk assessments, and encryption. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
          insurerNote:
            "GLBA non-compliance exposes the organization to regulatory action and may affect coverage. Insurers expect documented compliance with the updated Safeguards Rule requirements. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
          controlSlug: "glba-safeguards-compliance",
        },
        options: [
          { label: "Fully compliant with updated Safeguards Rule, validated by independent assessment", weight: 1.0 },
          { label: "Substantially compliant with minor gaps being remediated", weight: 0.7 },
          { label: "Partially compliant with a documented remediation roadmap", weight: 0.4 },
          { label: "Compliance status unknown or significant gaps exist", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_infosec_program_maturity",
        text: "How mature is your organization's overall information security program?",
        type: "maturity",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "An information security program is the overarching framework that includes policies, procedures, risk management, training, incident response, and governance. Maturity indicates how well-established, documented, and continuously improved the program is.",
          insurerNote:
            "Program maturity is a holistic indicator of security posture. Insurers use this to gauge overall risk and determine appropriate coverage terms and pricing.",
          controlSlug: "information-security-program-maturity",
        },
      },
      {
        key: "fin_risk_assessment_frequency",
        text: "How often does your organization conduct formal cybersecurity risk assessments?",
        type: "frequency",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Cybersecurity risk assessments identify threats, vulnerabilities, and their potential business impact. For financial institutions, this should cover regulatory risk, operational risk, and technology risk aligned with frameworks like NIST CSF 2.0 or FFIEC CAT.",
          insurerNote:
            "Regular risk assessments demonstrate proactive risk management. Insurers expect at least annual assessments, with more frequent reviews for material changes in the environment.",
          controlSlug: "risk-assessment-frequency",
        },
        options: [
          { label: "Quarterly or upon significant change", weight: 1.0 },
          { label: "Semi-annually", weight: 0.75 },
          { label: "Annually", weight: 0.5 },
          { label: "Less than annually", weight: 0.2 },
          { label: "Never", weight: 0.0 },
        ],
      },
      {
        key: "fin_board_reporting",
        text: "How does your organization report cybersecurity risk to the board or senior management?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Board reporting on cybersecurity ensures that leadership has visibility into the organization's risk posture, major threats, and security investment effectiveness. The GLBA Safeguards Rule requires reporting to the board or governing body. FTC Safeguards Rule citation: https://www.ftc.gov/business-guidance/privacy-security/safeguards-rule",
          insurerNote:
            "Board-level cybersecurity oversight is a sign of organizational commitment to security. Insurers view regular board reporting as an indicator of governance maturity.",
          controlSlug: "board-management-reporting",
        },
        options: [
          { label: "Quarterly board reporting with risk metrics, incident summaries, and strategic roadmap", weight: 1.0 },
          { label: "Semi-annual reports to board with key metrics and major incidents", weight: 0.7 },
          { label: "Annual presentation to senior management only", weight: 0.4 },
          { label: "No regular cybersecurity reporting to leadership", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
      },
      {
        key: "fin_employee_training",
        text: "Which elements are included in your organization's security awareness training program?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Security awareness training educates employees about threats and safe practices. For financial institutions, training should cover phishing, social engineering, data handling, regulatory requirements, and role-specific risks.",
          insurerNote:
            "Comprehensive training programs directly reduce human-factor risk. Insurers look for annual mandatory training with role-specific modules and completion tracking.",
          controlSlug: "employee-training-program",
        },
        options: [
          { label: "Annual mandatory training with completion tracking for all staff", weight: 0.2 },
          { label: "Role-specific modules (e.g., developers, finance, executives)", weight: 0.2 },
          { label: "New-hire security onboarding within first week", weight: 0.2 },
          { label: "Ongoing micro-learning and threat briefings throughout the year", weight: 0.25 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
      },
    ],
  },
  // ──────────────────────────────────────────────
  // Infrastructure Health (ID.AM)
  // ──────────────────────────────────────────────
  {
    id: "fin_infrastructure",
    title: "Infrastructure Health",
    nistCategory: "ID.AM",
    questions: [
      {
        key: "fin_infra_workstation_age",
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
        key: "fin_infra_server_age",
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
        key: "fin_infra_network_age",
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
  0,
);
