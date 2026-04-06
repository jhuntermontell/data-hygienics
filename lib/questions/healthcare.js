/**
 * Healthcare Industry Questionnaire
 * Frameworks: HIPAA Security Rule + NIST CSF + HHS Guidelines
 * ~52 questions across 10 sections
 */

export const SECTIONS = [
  // ─────────────────────────────────────────────
  // 1. Access Control & Identity Management (PR.AC)
  // ─────────────────────────────────────────────
  {
    id: "access_control",
    title: "Access Control & Identity Management",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "hc_ac_rbac",
        text: "How is role-based access control (RBAC) implemented across clinical and administrative systems?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 6,
        tooltip: {
          explanation:
            "Role-based access control ensures staff can only access the data and systems required for their job function, enforcing the HIPAA minimum necessary standard.",
          insurerNote:
            "Insurers look for RBAC as a foundational control. Excessive access rights are a top contributor to insider-threat claims.",
          controlSlug: "role-based-access-control",
        },
      },
      {
        key: "hc_ac_mfa_ehr",
        text: "Which clinical and EHR systems require multi-factor authentication (MFA) for user access?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 6,
        options: [
          { label: "Electronic Health Record (EHR) system", weight: 0.25 },
          { label: "Clinical decision support tools", weight: 0.2 },
          { label: "E-prescribing systems", weight: 0.2 },
          { label: "Remote / VPN access to clinical networks", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "MFA requires two or more verification factors to log in, such as a password plus a badge tap or phone code. It dramatically reduces unauthorized access even if credentials are stolen.",
          insurerNote:
            "MFA on EHR and clinical systems is one of the most scrutinized controls in cyber insurance underwriting for healthcare organizations.",
          controlSlug: "multi-factor-authentication",
        },
      },
      {
        key: "hc_ac_privileged",
        text: "How is privileged access (admin-level) managed for IT and clinical systems?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 5,
        tooltip: {
          explanation:
            "Privileged accounts, such as domain admins and EHR system administrators, have elevated rights that can bypass normal controls. Managing them separately limits blast radius if compromised.",
          insurerNote:
            "Compromised privileged accounts are involved in the majority of ransomware events. Insurers want to see dedicated controls around these accounts.",
          controlSlug: "privileged-access-management",
        },
      },
      {
        key: "hc_ac_offboarding",
        text: "How quickly is system access revoked when a workforce member leaves or changes roles?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 6,
        options: [
          { label: "Within 1 hour of separation or role change", weight: 1.0 },
          { label: "Within 24 hours", weight: 0.75 },
          { label: "Within 1 week", weight: 0.4 },
          { label: "No formal process exists", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires timely termination of access when a workforce member's employment ends or their duties change. Lingering access is a common audit finding.",
          insurerNote:
            "Delayed offboarding is a frequent root cause in insider-threat claims. Insurers assess whether access removal is prompt and documented.",
          controlSlug: "workforce-offboarding",
        },
      },
      {
        key: "hc_ac_access_reviews",
        text: "How often are user access rights reviewed to ensure they align with current job responsibilities?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 6,
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.8 },
          { label: "Semi-annually", weight: 0.5 },
          { label: "Annually", weight: 0.3 },
          { label: "Never", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Regular access reviews catch privilege creep, when employees accumulate permissions over time that exceed what their current role requires.",
          insurerNote:
            "Access review logs demonstrate ongoing compliance. Lack of reviews suggests potential for unauthorized data exposure.",
          controlSlug: "access-reviews",
        },
      },
      {
        key: "hc_ac_password_policy",
        text: "Which password policy controls are enforced across your organization?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 5,
        options: [
          { label: "Minimum length of 12+ characters", weight: 0.2 },
          { label: "Complexity requirements (uppercase, numbers, symbols)", weight: 0.15 },
          { label: "Password history enforcement (no reuse)", weight: 0.15 },
          { label: "Lockout after failed attempts", weight: 0.2 },
          { label: "Centralized password manager provided to staff", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Password policies set minimum standards for credential strength. NIST guidance now favors longer passphrases and breach-database checks over frequent rotation.",
          insurerNote:
            "Weak password policies are frequently exploited in credential-stuffing attacks. Insurers want evidence of enforced standards.",
          controlSlug: "password-policy",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. Protected Health Information (PHI) Safeguards (PR.DS)
  // ─────────────────────────────────────────────
  {
    id: "phi_safeguards",
    title: "Protected Health Information (PHI) Safeguards",
    nistCategory: "PR.DS",
    questions: [
      {
        key: "hc_phi_encryption",
        text: "What is the current state of encryption for Protected Health Information (PHI)?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Encryption converts PHI into unreadable code. Under HIPAA, if encrypted PHI is breached, you may not need to notify patients. This is the 'safe harbor' provision.",
          insurerNote:
            "Insurers view PHI encryption as essential. Unencrypted PHI breaches result in significantly higher regulatory fines and claim costs.",
          controlSlug: "data-encryption",
        },
      },
      {
        key: "hc_phi_transit_encryption",
        text: "Which methods are used to protect PHI during electronic transmission?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 3,
        options: [
          { label: "TLS 1.2 or higher for all web-based PHI transmission", weight: 0.25 },
          { label: "Encrypted email (S/MIME, TLS, or portal-based)", weight: 0.2 },
          { label: "VPN for remote clinical access", weight: 0.2 },
          { label: "Encrypted file transfer (SFTP/SCP) for data exchange", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires that PHI transmitted electronically is protected against interception. Encryption in transit ensures data cannot be read if network traffic is captured.",
          insurerNote:
            "Man-in-the-middle attacks on unencrypted health data transmissions lead to costly breaches. Insurers expect encryption of all PHI in transit.",
          controlSlug: "encryption-in-transit",
        },
      },
      {
        key: "hc_phi_minimum_necessary",
        text: "How is the HIPAA minimum necessary standard enforced when granting access to PHI?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "The minimum necessary rule requires that workforce members only access the PHI they need for their specific job tasks, not entire patient records when only a subset is required.",
          insurerNote:
            "Over-provisioned access to PHI increases the severity of both insider threats and external breaches. Insurers want evidence this principle is actively enforced.",
          controlSlug: "minimum-necessary-access",
        },
      },
      {
        key: "hc_phi_inventory",
        text: "How well does your organization maintain an inventory of where PHI is stored, processed, and transmitted?",
        type: "maturity",
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "A PHI inventory (also called a data map) documents every system, database, device, and third party that touches patient data. You cannot protect what you do not know exists.",
          insurerNote:
            "Incomplete PHI inventories lead to shadow data exposures. Insurers value organizations that can definitively map where their sensitive data lives.",
          controlSlug: "phi-data-inventory",
        },
      },
      {
        key: "hc_phi_disposal",
        text: "Which secure disposal methods are used when PHI is no longer needed?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 3,
        options: [
          { label: "Certified data wiping for electronic media", weight: 0.25 },
          { label: "Physical destruction (shredding/degaussing) of hard drives", weight: 0.25 },
          { label: "Cross-cut shredding of paper PHI", weight: 0.2 },
          { label: "Documented chain-of-custody for disposal vendors", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires that PHI is rendered unreadable and indecipherable when disposed of. Improper disposal, such as recycling unwiped hard drives, is a common cause of breaches.",
          insurerNote:
            "Disposal-related breaches generate negative publicity and regulatory penalties. Insurers assess whether documented destruction procedures exist.",
          controlSlug: "secure-data-disposal",
        },
      },
      {
        key: "hc_phi_deidentification",
        text: "What de-identification practices are used when sharing data for research or analytics?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        options: [
          { label: "HIPAA Safe Harbor method (all 18 identifiers removed) with documented process", weight: 1.0 },
          { label: "Expert Determination method with statistical validation", weight: 0.85 },
          { label: "Ad-hoc redaction without formal methodology", weight: 0.3 },
          { label: "De-identification is not practiced", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA defines two approved methods for de-identifying data: Safe Harbor (removing 18 identifier types) and Expert Determination (statistical certification). Properly de-identified data is no longer PHI.",
          insurerNote:
            "Sharing data without proper de-identification exposes the organization to breach liability. Insurers view formal de-identification programs favorably.",
          controlSlug: "phi-deidentification",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. Data Backup & Recovery (RC.RP)
  // ─────────────────────────────────────────────
  {
    id: "backup_recovery",
    title: "Data Backup & Recovery",
    nistCategory: "RC.RP",
    questions: [
      {
        key: "hc_br_backup_frequency",
        text: "How frequently are critical systems and PHI data backed up?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        options: [
          { label: "Continuously (real-time replication)", weight: 1.0 },
          { label: "Daily", weight: 0.85 },
          { label: "Weekly", weight: 0.5 },
          { label: "Monthly", weight: 0.25 },
          { label: "Never", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires covered entities to maintain retrievable exact copies of ePHI. Backup frequency determines how much data could be lost in a disaster or ransomware event.",
          insurerNote:
            "Backup frequency directly impacts claim severity. More frequent backups mean less data loss and faster recovery, reducing the overall cost of an incident.",
          controlSlug: "backup-frequency",
        },
      },
      {
        key: "hc_br_backup_testing",
        text: "How often are backup restoration procedures tested to verify data can actually be recovered?",
        type: "frequency",
        nistFunction: "Recover",
        cisControl: 11,
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Semi-annually", weight: 0.5 },
          { label: "Annually", weight: 0.3 },
          { label: "Never", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Untested backups are unreliable backups. Restoration tests confirm that backup data is complete, uncorrupted, and can be recovered within acceptable timeframes.",
          insurerNote:
            "Many organizations discover their backups are unusable only during an actual incident. Insurers heavily weight regular, documented restoration testing.",
          controlSlug: "backup-testing",
        },
      },
      {
        key: "hc_br_offsite",
        text: "Where are backup copies stored relative to primary systems?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        options: [
          { label: "Air-gapped offsite location plus immutable cloud storage", weight: 1.0 },
          { label: "Offsite location or immutable cloud storage", weight: 0.75 },
          { label: "Separate network segment at the same facility", weight: 0.35 },
          { label: "Same network as production systems", weight: 0.1 },
          { label: "No dedicated backup storage", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Offsite and air-gapped backups cannot be reached by ransomware that spreads through the network. Immutable storage prevents backups from being encrypted or deleted by attackers.",
          insurerNote:
            "Ransomware operators routinely target online backups. Insurers strongly prefer air-gapped or immutable backup strategies as they are the primary defense against total data loss.",
          controlSlug: "offsite-backup-storage",
        },
      },
      {
        key: "hc_br_ehr_backup",
        text: "How is EHR system data specifically protected in the backup strategy?",
        type: "maturity",
        nistFunction: "Recover",
        cisControl: 11,
        tooltip: {
          explanation:
            "EHR systems are the lifeblood of clinical operations. A dedicated EHR backup strategy accounts for database consistency, application configuration, and the ability to restore to a functional clinical state.",
          insurerNote:
            "EHR downtime directly impacts patient care and revenue. Insurers assess whether EHR backups are treated with higher priority and tested independently.",
          controlSlug: "ehr-backup-strategy",
        },
      },
      {
        key: "hc_br_rto",
        text: "What is your documented Recovery Time Objective (RTO) for critical clinical systems?",
        type: "singleselect",
        nistFunction: "Recover",
        cisControl: 11,
        options: [
          { label: "Less than 4 hours with documented and tested procedures", weight: 1.0 },
          { label: "4-24 hours with documented procedures", weight: 0.7 },
          { label: "1-3 days with informal procedures", weight: 0.35 },
          { label: "No defined RTO", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "The Recovery Time Objective defines the maximum acceptable downtime before clinical operations are critically impacted. It drives decisions about backup technology, redundancy, and staffing.",
          insurerNote:
            "Undefined RTOs suggest the organization has not planned for recovery. Insurers use RTOs to estimate business interruption exposure and claim potential.",
          controlSlug: "recovery-time-objective",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. Endpoint & Medical Device Security (PR.PT)
  // ─────────────────────────────────────────────
  {
    id: "endpoint_device_security",
    title: "Endpoint & Medical Device Security",
    nistCategory: "PR.PT",
    questions: [
      {
        key: "hc_ep_protection",
        text: "What endpoint protection capabilities are deployed on workstations and servers?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 10,
        options: [
          { label: "Endpoint Detection and Response (EDR) with 24/7 monitoring", weight: 0.25 },
          { label: "Next-generation antivirus with behavioral analysis", weight: 0.2 },
          { label: "Host-based firewall on all endpoints", weight: 0.15 },
          { label: "Application whitelisting on clinical workstations", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Endpoint protection stops malware, ransomware, and unauthorized software from executing on computers and servers. EDR provides continuous monitoring and the ability to investigate threats after detection.",
          insurerNote:
            "EDR with 24/7 monitoring is increasingly a prerequisite for cyber insurance coverage. Traditional antivirus alone is no longer considered sufficient.",
          controlSlug: "endpoint-protection",
        },
      },
      {
        key: "hc_ep_medical_device_inventory",
        text: "How is the inventory of connected medical devices (IoMT) maintained?",
        type: "maturity",
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "Internet of Medical Things (IoMT) devices, such as infusion pumps, imaging systems, and patient monitors, are often overlooked in asset inventories. Many run legacy operating systems and cannot be patched.",
          insurerNote:
            "Untracked medical devices represent hidden attack surface. Insurers want to see that organizations know exactly what devices are on their network.",
          controlSlug: "medical-device-inventory",
        },
      },
      {
        key: "hc_ep_patching",
        text: "How frequently are operating system and application patches applied to endpoints and servers?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 7,
        options: [
          { label: "Within 72 hours of critical patch release, monthly for others", weight: 1.0 },
          { label: "Weekly patch cycles", weight: 0.85 },
          { label: "Monthly", weight: 0.6 },
          { label: "Quarterly", weight: 0.3 },
          { label: "Annually or ad-hoc", weight: 0.1 },
          { label: "Never", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Patching fixes known software vulnerabilities before attackers can exploit them. Critical patches should be applied rapidly, while routine patches follow a regular cycle.",
          insurerNote:
            "Unpatched systems are among the top attack vectors in healthcare breaches. Insurers evaluate patch cadence and whether critical patches are expedited.",
          controlSlug: "patch-management",
        },
      },
      {
        key: "hc_ep_device_encryption",
        text: "What is the state of full-disk encryption on laptops, workstations, and portable devices that may contain PHI?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Full-disk encryption ensures that if a device is lost or stolen, the data on it cannot be accessed without the encryption key. This is critical for HIPAA safe harbor protection.",
          insurerNote:
            "Lost/stolen device claims are common in healthcare. Full-disk encryption converts a potential breach into a non-reportable security event, significantly reducing claim costs.",
          controlSlug: "device-encryption",
        },
      },
      {
        key: "hc_ep_medical_segmentation",
        text: "How are medical devices segmented from the rest of the network?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        options: [
          { label: "Dedicated VLAN with strict firewall rules and continuous monitoring", weight: 1.0 },
          { label: "Dedicated VLAN with basic access controls", weight: 0.65 },
          { label: "Partial segmentation, some devices isolated, others on general network", weight: 0.3 },
          { label: "Medical devices share the general network with other systems", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Medical devices often cannot be patched or run security software. Network segmentation isolates them so a compromise of a medical device cannot spread to EHR or administrative systems.",
          insurerNote:
            "Unsegmented medical devices are a major ransomware risk. Insurers assess network segmentation as a compensating control for unpatchable devices.",
          controlSlug: "medical-device-segmentation",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. Email & Communication Security (PR.AT + DE.CM)
  // ─────────────────────────────────────────────
  {
    id: "email_communication_security",
    title: "Email & Communication Security",
    nistCategory: "PR.AT + DE.CM",
    questions: [
      {
        key: "hc_em_filtering",
        text: "What is the maturity of your email filtering and anti-phishing solution?",
        type: "maturity",
        nistFunction: "Detect",
        cisControl: 9,
        tooltip: {
          explanation:
            "Email filtering inspects inbound messages for malware, phishing links, and social engineering attempts. Advanced solutions use AI to detect sophisticated impersonation attacks targeting healthcare staff.",
          insurerNote:
            "Email is the number one attack vector in healthcare breaches. Insurers want to see advanced email filtering beyond basic spam protection.",
          controlSlug: "email-filtering",
        },
      },
      {
        key: "hc_em_phishing_training",
        text: "How frequently does your organization conduct simulated phishing exercises for all staff?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 14,
        options: [
          { label: "Monthly", weight: 1.0 },
          { label: "Quarterly", weight: 0.75 },
          { label: "Semi-annually", weight: 0.45 },
          { label: "Annually", weight: 0.25 },
          { label: "Never", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Simulated phishing sends realistic but harmless test emails to staff and tracks who clicks. It builds muscle memory for recognizing real attacks and identifies departments that need additional training.",
          insurerNote:
            "Regular phishing simulations demonstrate an active security culture. Insurers correlate simulation frequency with reduced social engineering claim rates.",
          controlSlug: "phishing-simulation",
        },
      },
      {
        key: "hc_em_secure_messaging",
        text: "How is PHI communicated between workforce members and with patients electronically?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 3,
        options: [
          { label: "Dedicated secure messaging platform with encryption and audit logging", weight: 1.0 },
          { label: "Encrypted email with DLP rules preventing PHI in unencrypted channels", weight: 0.75 },
          { label: "Standard email with optional encryption available", weight: 0.3 },
          { label: "Standard email or consumer messaging apps (texting, WhatsApp)", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires that electronic PHI is transmitted securely. Consumer messaging apps and unencrypted email do not meet this standard and create compliance risk.",
          insurerNote:
            "PHI sent via insecure channels is a top cause of HIPAA complaints. Insurers assess whether secure communication tools are provided and enforced.",
          controlSlug: "secure-messaging",
        },
      },
      {
        key: "hc_em_dmarc",
        text: "Which email authentication protocols are implemented for your organization's domain?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 9,
        options: [
          { label: "SPF (Sender Policy Framework) configured", weight: 0.2 },
          { label: "DKIM (DomainKeys Identified Mail) signing enabled", weight: 0.2 },
          { label: "DMARC policy set to quarantine or reject", weight: 0.25 },
          { label: "DMARC reporting monitored regularly", weight: 0.2 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "SPF, DKIM, and DMARC prevent attackers from spoofing your email domain to send phishing emails that appear to come from your organization. This protects both your staff and your patients.",
          insurerNote:
            "Domain spoofing enables Business Email Compromise attacks. Insurers check DMARC records as a baseline security indicator during underwriting.",
          controlSlug: "email-authentication",
        },
      },
      {
        key: "hc_em_breach_comms",
        text: "How prepared is your organization to handle breach notification communications?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "HIPAA requires notification to affected individuals within 60 days of discovering a breach. Having pre-drafted templates, communication plans, and designated spokespeople accelerates response.",
          insurerNote:
            "Poorly handled breach notifications increase regulatory scrutiny and lawsuits. Insurers value pre-planned communication strategies that reduce reputational and legal damage.",
          controlSlug: "breach-notification-readiness",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. Network Security (PR.AC + PR.PT)
  // ─────────────────────────────────────────────
  {
    id: "network_security",
    title: "Network Security",
    nistCategory: "PR.AC + PR.PT",
    questions: [
      {
        key: "hc_ns_segmentation",
        text: "How is network segmentation implemented between clinical, administrative, and guest networks?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        options: [
          { label: "Fully segmented with firewall rules, monitoring, and documented network diagrams", weight: 1.0 },
          { label: "Separate VLANs for clinical, admin, and guest with basic ACLs", weight: 0.7 },
          { label: "Partial segmentation, guest network is separate but clinical and admin share", weight: 0.35 },
          { label: "Flat network, all systems on the same segment", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Network segmentation divides the network into zones so a breach in one area cannot easily spread to others. Clinical systems handling PHI should be isolated from guest WiFi and general office traffic.",
          insurerNote:
            "Flat networks allow ransomware to spread unchecked. Insurers consider network segmentation a critical control for limiting incident scope and claim costs.",
          controlSlug: "network-segmentation",
        },
      },
      {
        key: "hc_ns_firewall",
        text: "What is the maturity of your firewall and perimeter security controls?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 13,
        tooltip: {
          explanation:
            "Firewalls control traffic flow between network zones and the internet. Next-generation firewalls add application awareness, intrusion prevention, and SSL inspection capabilities.",
          insurerNote:
            "Firewalls are a baseline expectation. Insurers assess whether rules are regularly reviewed and whether next-gen capabilities are enabled for clinical network protection.",
          controlSlug: "firewall-management",
        },
      },
      {
        key: "hc_ns_wifi",
        text: "What security standard is used for wireless networks that carry clinical or administrative traffic?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        options: [
          { label: "WPA3-Enterprise with certificate-based authentication (802.1X)", weight: 1.0 },
          { label: "WPA2-Enterprise with 802.1X authentication", weight: 0.75 },
          { label: "WPA2-Personal with a shared passphrase", weight: 0.25 },
          { label: "Open network or WEP encryption", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Wireless networks that carry PHI must be secured with enterprise-grade encryption and authentication. Shared passwords are easily compromised when staff leave.",
          insurerNote:
            "Weak WiFi security enables network intrusion. Insurers assess whether wireless access to clinical systems uses enterprise authentication.",
          controlSlug: "wireless-security",
        },
      },
      {
        key: "hc_ns_vpn",
        text: "How is remote access to the clinical and administrative network secured?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 12,
        options: [
          { label: "Zero-trust network access (ZTNA) with device posture checks and MFA", weight: 1.0 },
          { label: "VPN with MFA and device compliance verification", weight: 0.8 },
          { label: "VPN with MFA only", weight: 0.55 },
          { label: "VPN with username and password only", weight: 0.2 },
          { label: "Direct RDP or other unencrypted remote access", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Remote access lets staff work from outside the facility but creates a pathway attackers can exploit. Secure remote access requires encrypted tunnels, strong authentication, and device health checks.",
          insurerNote:
            "Exposed RDP is one of the most common ransomware entry points. Insurers will decline coverage or add exclusions for organizations using unprotected remote access.",
          controlSlug: "remote-access-security",
        },
      },
      {
        key: "hc_ns_monitoring",
        text: "What level of network monitoring and threat detection is in place?",
        type: "singleselect",
        nistFunction: "Detect",
        cisControl: 13,
        options: [
          { label: "24/7 SOC with SIEM, IDS/IPS, and automated alerting", weight: 1.0 },
          { label: "SIEM with IDS/IPS monitored during business hours", weight: 0.65 },
          { label: "Basic IDS/IPS or log collection without active monitoring", weight: 0.3 },
          { label: "No network monitoring in place", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Network monitoring uses sensors and log analysis to detect suspicious activity, such as unusual data transfers, lateral movement, or communication with known malicious servers.",
          insurerNote:
            "Without monitoring, breaches go undetected for months. Insurers prefer 24/7 SOC capabilities as they significantly reduce dwell time and breach costs.",
          controlSlug: "network-monitoring",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. Incident Response & Breach Notification (RS.RP)
  // ─────────────────────────────────────────────
  {
    id: "incident_response",
    title: "Incident Response & Breach Notification",
    nistCategory: "RS.RP",
    questions: [
      {
        key: "hc_ir_breach_plan",
        text: "What is the maturity of your HIPAA breach notification and incident response plan?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        tooltip: {
          explanation:
            "A HIPAA-compliant IR plan documents specific steps for identifying, containing, and reporting breaches, including the 60-day notification deadline to HHS and affected individuals for breaches of 500+ records.",
          insurerNote:
            "A documented and tested IR plan is often a prerequisite for cyber insurance. Plans that include HIPAA-specific requirements demonstrate regulatory awareness.",
          controlSlug: "incident-response-plan",
        },
      },
      {
        key: "hc_ir_team",
        text: "Which roles are formally designated on the incident response team?",
        type: "multiselect",
        nistFunction: "Respond",
        cisControl: 17,
        options: [
          { label: "HIPAA Privacy Officer", weight: 0.2 },
          { label: "HIPAA Security Officer", weight: 0.2 },
          { label: "IT/Security lead", weight: 0.15 },
          { label: "Legal counsel (internal or external)", weight: 0.15 },
          { label: "Executive sponsor / decision-maker", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None formally designated", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "An effective IR team includes technical, legal, privacy, and executive roles. Pre-designating these contacts with current information prevents delays during an actual incident.",
          insurerNote:
            "Insurers want to see named individuals with defined responsibilities. Unclear ownership leads to slower response and higher claim costs.",
          controlSlug: "ir-team-structure",
        },
      },
      {
        key: "hc_ir_tracking",
        text: "How are security incidents and potential breaches tracked and documented?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        options: [
          { label: "Dedicated incident management system with breach assessment workflow", weight: 1.0 },
          { label: "Ticketing system adapted for security incidents with basic categorization", weight: 0.65 },
          { label: "Spreadsheet or shared document tracking", weight: 0.3 },
          { label: "No formal tracking process", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires a breach risk assessment for every security incident to determine if notification is required. A consistent tracking system ensures no incidents are overlooked and provides audit evidence.",
          insurerNote:
            "Incident documentation supports both regulatory compliance and insurance claims. Insurers rely on incident records to validate claim timelines and response actions.",
          controlSlug: "incident-tracking",
        },
      },
      {
        key: "hc_ir_cyber_insurance",
        text: "What is the current state of your organization's cyber insurance coverage?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        options: [
          { label: "Comprehensive policy with healthcare-specific endorsements, reviewed annually", weight: 1.0 },
          { label: "Standard cyber liability policy in place", weight: 0.65 },
          { label: "General liability only, no dedicated cyber policy", weight: 0.2 },
          { label: "No cyber insurance coverage", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Cyber insurance helps cover the costs of breach response, including forensics, legal fees, notification, credit monitoring, and regulatory fines. Healthcare-specific policies address HIPAA-related exposures.",
          insurerNote:
            "Having appropriate coverage demonstrates risk awareness. Insurers assess whether limits are adequate relative to the volume of PHI the organization handles.",
          controlSlug: "cyber-insurance-coverage",
        },
      },
      {
        key: "hc_ir_ocr_reporting",
        text: "How familiar is your workforce with HHS Office for Civil Rights (OCR) breach reporting requirements?",
        type: "singleselect",
        nistFunction: "Respond",
        cisControl: 17,
        options: [
          { label: "Privacy and security officers are trained, process is documented and rehearsed", weight: 1.0 },
          { label: "Key personnel understand requirements but process is not formally documented", weight: 0.55 },
          { label: "Limited awareness among leadership only", weight: 0.25 },
          { label: "Staff are not familiar with OCR reporting requirements", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Breaches affecting 500+ individuals must be reported to HHS OCR within 60 days. Smaller breaches must be logged and reported annually. Failure to report results in additional penalties.",
          insurerNote:
            "Delayed or missed OCR reporting triggers enforcement actions and increases penalties. Insurers value organizations that demonstrate regulatory reporting readiness.",
          controlSlug: "ocr-breach-reporting",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. Vendor & Business Associate Management (ID.SC)
  // ─────────────────────────────────────────────
  {
    id: "vendor_management",
    title: "Vendor & Business Associate Management",
    nistCategory: "ID.SC",
    questions: [
      {
        key: "hc_vm_baa_tracking",
        text: "How does your organization track Business Associate Agreements (BAAs) across all vendors with PHI access?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 15,
        options: [
          { label: "Centralized system tracking all BAAs with expiration alerts and annual review", weight: 1.0 },
          { label: "Spreadsheet or document listing BAAs with periodic review", weight: 0.55 },
          { label: "BAAs exist but no centralized tracking or review process", weight: 0.25 },
          { label: "No formal BAA tracking in place", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires a signed BAA with every vendor that creates, receives, maintains, or transmits PHI on your behalf. Missing BAAs create direct regulatory liability.",
          insurerNote:
            "BAA gaps are a frequent OCR audit finding. Insurers assess BAA management as an indicator of overall vendor risk governance.",
          controlSlug: "baa-compliance-tracking",
        },
      },
      {
        key: "hc_vm_risk_assessment",
        text: "How are vendors assessed for cybersecurity risk before being granted access to PHI or systems?",
        type: "maturity",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "Vendor risk assessments evaluate a third party's security posture before granting them access to your environment or PHI. This may include questionnaires, SOC 2 report reviews, or external security ratings.",
          insurerNote:
            "Third-party breaches are a growing percentage of healthcare incidents. Insurers want to see that vendors are vetted before being granted PHI access.",
          controlSlug: "vendor-risk-assessment",
        },
      },
      {
        key: "hc_vm_phi_sharing",
        text: "How well does your organization maintain an inventory of all third parties that receive or access PHI?",
        type: "maturity",
        nistFunction: "Identify",
        cisControl: 15,
        tooltip: {
          explanation:
            "A PHI sharing inventory lists every vendor, partner, and subcontractor that touches patient data, including cloud services, billing companies, labs, and IT support providers.",
          insurerNote:
            "Unknown PHI sharing creates unquantified risk. Insurers value organizations that can enumerate their PHI data flows to third parties.",
          controlSlug: "phi-sharing-inventory",
        },
      },
      {
        key: "hc_vm_subcontractors",
        text: "How does your organization ensure that business associates' subcontractors also comply with HIPAA?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 15,
        options: [
          { label: "BAAs require downstream subcontractor agreements, with periodic verification", weight: 1.0 },
          { label: "BAAs include subcontractor provisions but verification is not performed", weight: 0.5 },
          { label: "Subcontractor compliance is left to the business associate with no oversight", weight: 0.2 },
          { label: "Subcontractor compliance is not addressed", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Under the HIPAA Omnibus Rule, business associates must ensure their subcontractors also sign BAAs and comply with HIPAA. Your organization can be impacted by a breach at a subcontractor level.",
          insurerNote:
            "Supply-chain breaches are difficult to contain. Insurers assess whether the organization has visibility into downstream data handling.",
          controlSlug: "subcontractor-oversight",
        },
      },
      {
        key: "hc_vm_audit_frequency",
        text: "How often does your organization audit or re-assess the security posture of existing business associates?",
        type: "frequency",
        nistFunction: "Identify",
        cisControl: 15,
        options: [
          { label: "Annually with documented re-assessment", weight: 1.0 },
          { label: "Every two years", weight: 0.6 },
          { label: "Only at contract renewal", weight: 0.3 },
          { label: "Only during initial onboarding", weight: 0.15 },
          { label: "Never", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Vendor security postures change over time. Regular re-assessments ensure that business associates maintain adequate protections as threats evolve and their own systems change.",
          insurerNote:
            "One-time assessments become stale quickly. Insurers prefer annual vendor reviews as part of an ongoing third-party risk management program.",
          controlSlug: "vendor-audit-frequency",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. HIPAA Compliance Program (ID.GV)
  // ─────────────────────────────────────────────
  {
    id: "hipaa_compliance",
    title: "HIPAA Compliance Program",
    nistCategory: "ID.GV",
    questions: [
      {
        key: "hc_hc_security_officer",
        text: "How is the role of HIPAA Security Officer fulfilled in your organization?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 17,
        options: [
          { label: "Designated individual with formal authority, dedicated time, and direct executive reporting", weight: 1.0 },
          { label: "Designated individual but role is combined with other full-time duties", weight: 0.6 },
          { label: "Responsibility is informally assigned without formal designation", weight: 0.25 },
          { label: "No one is designated as HIPAA Security Officer", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires a designated Security Officer responsible for developing and implementing security policies. This person is the point of accountability for the organization's security program.",
          insurerNote:
            "A clearly designated Security Officer signals organizational commitment to security. Insurers view this as a foundational governance control.",
          controlSlug: "hipaa-security-officer",
        },
      },
      {
        key: "hc_hc_risk_analysis",
        text: "How frequently is a comprehensive HIPAA security risk analysis conducted?",
        type: "frequency",
        nistFunction: "Identify",
        cisControl: 4,
        options: [
          { label: "Annually with updates after significant changes", weight: 1.0 },
          { label: "Annually", weight: 0.8 },
          { label: "Every two years", weight: 0.45 },
          { label: "Only once or upon initial HIPAA compliance effort", weight: 0.15 },
          { label: "Never conducted", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "The HIPAA Security Rule requires covered entities to conduct an accurate and thorough assessment of potential risks and vulnerabilities to ePHI. This is the single most cited deficiency in OCR audits.",
          insurerNote:
            "Risk analysis is the cornerstone of HIPAA compliance. Its absence is the top finding in OCR enforcement actions and a red flag for insurers.",
          controlSlug: "hipaa-risk-analysis",
        },
      },
      {
        key: "hc_hc_policies",
        text: "What is the maturity of your HIPAA policies and procedures documentation?",
        type: "maturity",
        nistFunction: "Identify",
        cisControl: 17,
        tooltip: {
          explanation:
            "HIPAA requires documented policies and procedures for all administrative, physical, and technical safeguards. These must be reviewed and updated regularly to reflect current practices and threats.",
          insurerNote:
            "Outdated or missing policies indicate compliance gaps. Insurers expect policies that are current, comprehensive, and accessible to the workforce.",
          controlSlug: "hipaa-policies-procedures",
        },
      },
      {
        key: "hc_hc_training",
        text: "How often do all workforce members receive HIPAA compliance training?",
        type: "frequency",
        nistFunction: "Protect",
        cisControl: 14,
        options: [
          { label: "Annually with role-specific modules and comprehension testing", weight: 1.0 },
          { label: "Annually with general HIPAA overview", weight: 0.7 },
          { label: "Only at hire / onboarding", weight: 0.3 },
          { label: "Training is available but not required", weight: 0.15 },
          { label: "No HIPAA training program", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires that all workforce members, including volunteers, trainees, and contractors, receive training on policies and procedures related to PHI protection.",
          insurerNote:
            "Untrained staff are the weakest link. Insurers assess training frequency and whether it goes beyond checkbox compliance to include role-specific content.",
          controlSlug: "hipaa-training-program",
        },
      },
      {
        key: "hc_hc_sanctions",
        text: "How does your organization enforce its HIPAA sanctions policy for workforce violations?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 17,
        options: [
          { label: "Documented sanctions policy with graduated consequences, consistently enforced and tracked", weight: 1.0 },
          { label: "Written sanctions policy exists and is applied but not consistently tracked", weight: 0.6 },
          { label: "Informal disciplinary process without a specific HIPAA sanctions policy", weight: 0.25 },
          { label: "No sanctions policy for HIPAA violations", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "HIPAA requires a sanctions policy that defines consequences for workforce members who violate security policies. This must be applied consistently regardless of role or seniority.",
          insurerNote:
            "A sanctions policy demonstrates accountability. Insurers view it as evidence that security is taken seriously at all levels of the organization.",
          controlSlug: "hipaa-sanctions-policy",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10. Security Awareness & Workforce Training (PR.AT)
  // ─────────────────────────────────────────────
  {
    id: "security_awareness",
    title: "Security Awareness & Workforce Training",
    nistCategory: "PR.AT",
    questions: [
      {
        key: "hc_sa_training_program",
        text: "What is the maturity of your overall security awareness training program beyond HIPAA basics?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 14,
        tooltip: {
          explanation:
            "Security awareness training educates staff on current threats (ransomware, phishing, social engineering, and safe computing practices) beyond the minimum HIPAA requirements.",
          insurerNote:
            "Comprehensive security awareness programs reduce human-error incidents. Insurers assess whether training goes beyond compliance checkboxes to address real-world threats.",
          controlSlug: "security-awareness-program",
        },
      },
      {
        key: "hc_sa_social_engineering",
        text: "Which social engineering attack types are covered in your security awareness program?",
        type: "multiselect",
        nistFunction: "Protect",
        cisControl: 14,
        options: [
          { label: "Email phishing and spear phishing", weight: 0.2 },
          { label: "Voice phishing (vishing) and phone pretexting", weight: 0.2 },
          { label: "SMS phishing (smishing)", weight: 0.15 },
          { label: "Physical social engineering (tailgating, impersonation)", weight: 0.15 },
          { label: "Business Email Compromise (BEC) scenarios", weight: 0.15 },
          { label: "All of the above", weight: 1.0 },
          { label: "None of the above", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "Social engineering attacks exploit human psychology rather than technical vulnerabilities. Healthcare workers are high-value targets because of their access to PHI and clinical systems.",
          insurerNote:
            "Social engineering is the leading cause of healthcare data breaches. Insurers value programs that address multiple attack vectors beyond just email phishing.",
          controlSlug: "social-engineering-awareness",
        },
      },
      {
        key: "hc_sa_phi_handling",
        text: "How are workforce members trained on proper PHI handling in day-to-day clinical workflows?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 14,
        options: [
          { label: "Role-specific training with practical scenarios, refreshed annually and after policy changes", weight: 1.0 },
          { label: "General PHI handling training included in annual HIPAA training", weight: 0.6 },
          { label: "Brief overview during onboarding only", weight: 0.25 },
          { label: "No specific PHI handling training", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "PHI handling training covers practical topics (locking screens, secure printing, verbal discussions in shared spaces, proper faxing, and secure disposal) tailored to each role's daily workflows.",
          insurerNote:
            "Improper PHI handling causes a large share of breaches that are preventable. Insurers value role-specific training that addresses real clinical scenarios.",
          controlSlug: "phi-handling-training",
        },
      },
      {
        key: "hc_sa_incident_reporting",
        text: "How well is the process for reporting suspected security incidents or PHI breaches communicated to staff?",
        type: "maturity",
        nistFunction: "Detect",
        cisControl: 17,
        tooltip: {
          explanation:
            "Every workforce member should know how to report a suspected incident: who to contact, what information to provide, and that reporting is encouraged without fear of retaliation. Early reporting reduces breach impact.",
          insurerNote:
            "Organizations with clear reporting channels detect incidents faster. Insurers correlate early detection with lower claim severity.",
          controlSlug: "incident-reporting-culture",
        },
      },
      {
        key: "hc_sa_new_hire",
        text: "What security training do new hires receive before being granted access to systems and PHI?",
        type: "singleselect",
        nistFunction: "Protect",
        cisControl: 14,
        options: [
          { label: "Mandatory security onboarding completed before any system access is provisioned", weight: 1.0 },
          { label: "Security onboarding completed within first week, access granted in parallel", weight: 0.65 },
          { label: "Security training scheduled within first 30 days of employment", weight: 0.3 },
          { label: "No structured security onboarding for new hires", weight: 0.0 },
        ],
        tooltip: {
          explanation:
            "New hires are vulnerable to social engineering and accidental PHI exposure because they do not yet know organizational policies. Training before access provisioning prevents early mistakes.",
          insurerNote:
            "New employees represent elevated risk. Insurers assess whether security training is a prerequisite for system access, not an afterthought.",
          controlSlug: "new-hire-security-onboarding",
        },
      },
    ],
  },
];

export const TOTAL_QUESTIONS = SECTIONS.reduce(
  (sum, section) => sum + section.questions.length,
  0,
);
