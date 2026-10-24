/**
 * Healthcare Industry Questionnaire
 * Frameworks: HIPAA Security Rule + NIST CSF 2.0 + HHS Guidelines
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
        rubric: {
          "Not in place":
            "Everyone with a login has roughly the same level of access. A medical assistant can open the same records as a physician, and a billing clerk can see clinical notes. No formal role definitions exist, and permissions were granted based on whoever was available to set up the account.",
          "Partially in place":
            "Some roles have been defined, usually around obvious distinctions like front office versus clinical. But access creep is common. People who changed roles kept their old permissions, and exceptions were granted verbally without being documented. A new hire's access often mirrors the last person who had a similar title rather than being built from a role template.",
          "Fully in place":
            "Roles are defined based on actual job responsibilities and mapped to specific permission sets. When someone is hired or changes roles, their access is provisioned from the template for that role. The EHR and clinical systems enforce these roles rather than relying on the honor system.",
          "Documented & tested":
            "Role definitions are written down, owned by a specific person, and reviewed at least annually against actual job duties. Access reviews produce evidence showing which roles were validated, what exceptions exist, and why. The definition of each role can be produced on request and matches what the systems actually enforce.",
        },
        tooltip: {
          explanation:
            "Role-based access control ensures staff can only access the data and systems required for their job function, enforcing the HIPAA minimum necessary standard.",
          insurerNote:
            "Insurers look for RBAC as a foundational control. Excessive access rights let one compromised or careless account reach far more PHI than it should.",
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
            "Insurers often ask about MFA on EHR and clinical systems. Without it, a stolen password is all an attacker needs to reach patient records.",
          controlSlug: "multi-factor-authentication",
        },
      },
      {
        key: "hc_ac_privileged",
        text: "How is privileged access (admin-level) managed for IT and clinical systems?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 5,
        rubric: {
          "Not in place":
            "Admin accounts are shared, passwords are written down or stored in a file called 'admin creds', and the same account used for daily email is also used to change firewall rules. If that account gets phished, the attacker has the keys to the whole environment.",
          "Partially in place":
            "Admins have separate privileged accounts, but they are not consistently used. People log in with the admin account for convenience even when doing regular work. MFA on privileged accounts is inconsistent, and there is no separate password vault, so credentials live in browser password managers alongside personal logins.",
          "Fully in place":
            "Every administrator has a separate privileged account, used only for admin tasks. Privileged accounts require MFA and have stronger password requirements than regular accounts. A password vault or privileged access management tool controls access, and day-to-day work happens under standard user accounts.",
          "Documented & tested":
            "Privileged account use is logged, reviewed, and tied to specific activities. Sessions on privileged accounts can be audited after the fact. Emergency access procedures exist for situations where the admin is unavailable, and those procedures have been exercised at least once in the past year. The list of who holds which privileged account is current and can be produced on demand.",
        },
        tooltip: {
          explanation:
            "Privileged accounts, such as domain admins and EHR system administrators, have elevated rights that can bypass normal controls. Managing them separately limits blast radius if compromised.",
          insurerNote:
            "A compromised privileged account lets ransomware reach every system that account touches. Insurers want to see dedicated controls around these accounts.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "HIPAA requires timely termination of access when a workforce member's employment ends or their duties change. Access left in place keeps a door open for no reason.",
          insurerNote:
            "Accounts left active after someone leaves are an avoidable way in. Insurers assess whether access removal is prompt and documented.",
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
            "Password policies set minimum standards for credential strength. NIST SP 800-63B guidance now favors longer passphrases and breach-database checks over frequent rotation.",
          insurerNote:
            "Credential-stuffing attacks rely on weak and reused passwords. Insurers want evidence of enforced standards.",
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
        rubric: {
          "Not in place":
            "PHI sits in databases, file shares, and on laptops without encryption. If a server is stolen or a laptop is left at a coffee shop, the data on it is readable by anyone. The organization would almost certainly be required to notify patients and HHS if any device with PHI was lost.",
          "Partially in place":
            "Some systems have encryption enabled, usually the EHR database and cloud storage, but workstations, backup drives, and file servers are inconsistent. No one has verified whether encryption is actually active on devices that claim to have it, and there is no central inventory of which systems are encrypted.",
          "Fully in place":
            "PHI is encrypted at rest across all systems that store it, including EHR databases, file servers, workstations, laptops, backups, and mobile devices. Encryption keys are managed through a key management system rather than stored alongside the data. Lost or stolen devices qualify for HIPAA safe harbor and do not require breach notification.",
          "Documented & tested":
            "Encryption configuration is documented, audited at least annually, and verified across every system that handles PHI. Evidence of encryption status can be produced on request for any specific system. Key management procedures are written down, including how keys are rotated and what happens when an administrator leaves the organization.",
        },
        tooltip: {
          explanation:
            "Encryption converts PHI into unreadable code. Under HIPAA, if encrypted PHI is breached, you may not need to notify patients. This is the 'safe harbor' provision.",
          insurerNote:
            "Insurers view PHI encryption as essential. Encrypted PHI is unreadable to whoever steals it.",
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
        rubric: {
          "Not in place":
            "Any workforce member with an EHR login can see any patient's full chart regardless of whether they are involved in that patient's care. Access is not restricted by department, patient assignment, or data type. The organization is betting on staff behavior rather than system controls.",
          "Partially in place":
            "Some access restrictions exist, usually at the department level, but within a department everyone sees everything. A front-desk clerk cannot open clinical notes, but a nurse in cardiology can see records for patients in dermatology. Exceptions are granted verbally when needed and rarely revoked.",
          "Fully in place":
            "Access is scoped to the data each role actually needs. Clinical staff see clinical data relevant to their role and patient assignments. Billing staff see billing fields and not clinical notes. Break-glass procedures exist for emergency access and are logged separately for review.",
          "Documented & tested":
            "Access scopes are written down per role, matched against actual EHR and system configurations, and reviewed after any policy or role change. Audit logs of PHI access are reviewed on a regular cadence, not just after an incident. Break-glass access events are investigated every time, with documented outcomes.",
        },
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
        rubric: {
          "Not in place":
            "No one can produce a list of everywhere PHI lives. Staff know the EHR has it, but have not thought about the billing system, the fax server, the email archives, the backup tapes in the closet, or the vendor portals. When a breach happens, the scope investigation starts from zero.",
          "Partially in place":
            "A partial inventory exists, usually covering the big systems like the EHR and primary cloud storage. Shadow IT, legacy systems, vendor-hosted portals, and paper-to-digital conversion points are missing. The inventory was built once and has not been updated as systems were added or replaced.",
          "Fully in place":
            "A current inventory documents every system, database, vendor, and location where PHI is created, stored, transmitted, or received. It includes electronic systems, paper records, and third parties. The inventory is updated when new vendors are onboarded or new systems are deployed.",
          "Documented & tested":
            "The inventory is owned by a named role, reviewed at least annually, and validated against discovery tools where possible. Data flow diagrams accompany the inventory to show how PHI moves between systems. The inventory can support a breach scoping exercise in hours rather than weeks, and that has been demonstrated in a tabletop or drill.",
        },
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
            "HIPAA requires that PHI is rendered unreadable and indecipherable when disposed of. Improper disposal, such as recycling unwiped hard drives, can expose PHI long after you stop using it.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
            "Without restore tests, the first time you learn a backup is unusable may be during an actual incident. Insurers often ask about regular, documented restoration testing.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "Offsite and air-gapped backups cannot be reached by ransomware that spreads through the network. Immutable storage prevents backups from being encrypted or deleted by attackers.",
          insurerNote:
            "Ransomware can encrypt or delete backups it can reach. Insurers strongly prefer air-gapped or immutable backups, which attackers cannot change.",
          controlSlug: "offsite-backup-storage",
        },
      },
      {
        key: "hc_br_ehr_backup",
        text: "How is EHR system data specifically protected in the backup strategy?",
        type: "maturity",
        nistFunction: "Recover",
        cisControl: 11,
        rubric: {
          "Not in place":
            "The EHR is backed up the same way file shares are backed up, through a generic nightly job run by the IT team or an outside IT company. No one has verified that a restore would produce a working clinical system. If the EHR went down tomorrow, recovery would be a first-time exercise performed under pressure.",
          "Partially in place":
            "EHR backups run on a dedicated schedule, usually daily, but restoration has never been tested end-to-end. Application configuration and database consistency are assumed rather than verified. The backup vendor or EHR vendor handles the details, and the organization does not have a clear answer on how long a full recovery would take.",
          "Fully in place":
            "EHR backups are treated as a distinct workstream with defined RPOs and RTOs that match clinical operating needs. Backups capture both the database and the application configuration needed to restore a functional system. A restore has been performed in a test environment within the past year and produced a working EHR.",
          "Documented & tested":
            "The EHR recovery procedure is written down, owned by a specific role, and exercised on a regular cadence. Evidence of the last successful restore test exists, including how long it took and what issues were found. The procedure covers scenarios beyond hardware failure, including ransomware that may have affected backups themselves.",
        },
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
            "Insurers often ask whether you run EDR with 24/7 monitoring, not just traditional antivirus, which only catches known threats.",
          controlSlug: "endpoint-protection",
        },
      },
      {
        key: "hc_ep_medical_device_inventory",
        text: "How is the inventory of connected medical devices (IoMT) maintained?",
        type: "maturity",
        nistFunction: "Identify",
        cisControl: 1,
        rubric: {
          "Not in place":
            "No inventory exists. Staff cannot quickly answer which medical devices are connected to the network or whether any are running outdated software. If a vulnerability like the Medtronic insulin pump flaw was disclosed tomorrow, the practice would have no way to know if they own one.",
          "Partially in place":
            "Some devices are tracked, usually in a spreadsheet or the EHR asset module, but the list is incomplete or outdated. New devices get added to the network without being logged. Firmware versions and network locations are not consistently recorded.",
          "Fully in place":
            "Every connected medical device is tracked in a living inventory that includes manufacturer, model, firmware version, network segment, and responsible owner. The list is reviewed and updated at least quarterly. New devices cannot be connected to the network without being added.",
          "Documented & tested":
            "Inventory process is written down, assigned to a specific role, and verified through periodic audits. Evidence of recent audits with sign-off logs and discrepancy reports can be produced on request. A documented procedure exists for handling firmware alerts across the inventory.",
        },
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
            "Each missing security update leaves a publicly known flaw open for attackers to use. Insurers evaluate patch cadence and whether critical patches are expedited.",
          controlSlug: "patch-management",
        },
      },
      {
        key: "hc_ep_device_encryption",
        text: "What is the state of full-disk encryption on laptops, workstations, and portable devices that may contain PHI?",
        type: "maturity",
        nistFunction: "Protect",
        cisControl: 3,
        rubric: {
          "Not in place":
            "Laptops and workstations do not have full-disk encryption enabled. If a laptop is stolen from a car or a workstation walks off during an office move, the data on it is readable by anyone who boots the drive. The organization would owe a breach notification for every patient whose data was on that device.",
          "Partially in place":
            "Some newer devices came with BitLocker or FileVault enabled, but there is no organization-wide standard. Older laptops were never encrypted, and no one can quickly tell which devices have encryption active. When a device is lost, determining whether breach notification is required takes days of investigation.",
          "Fully in place":
            "Full-disk encryption is enabled on every laptop, workstation, and portable device that could contain PHI. Encryption is enforced through device management policies, not left to individual users. Recovery keys are stored centrally so locked-out users can be recovered without data loss.",
          "Documented & tested":
            "Encryption status is monitored continuously across the device fleet, and exceptions are flagged and remediated. Evidence of encryption can be produced on demand for any specific device. Lost-device procedures explicitly reference encryption status so breach assessments can be completed quickly, and that process has been exercised.",
        },
        tooltip: {
          explanation:
            "Full-disk encryption ensures that if a device is lost or stolen, the data on it cannot be accessed without the encryption key. This is critical for HIPAA safe harbor protection.",
          insurerNote:
            "A lost or stolen laptop with PHI on it can become a reportable breach. Full-disk encryption can turn it into a non-reportable security event.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
        rubric: {
          "Not in place":
            "Email relies on whatever spam filtering comes built into Microsoft 365 or Google Workspace at the default level. No additional phishing protection, no link inspection, no attachment sandboxing. Suspicious emails land in inboxes regularly, and staff are the only defense.",
          "Partially in place":
            "Basic email security has been configured, usually by enabling default anti-phishing policies in Microsoft 365 or Google Workspace. But advanced capabilities like URL rewriting, attachment detonation, or impersonation protection are either not licensed or not turned on. Some phishing emails are caught, but targeted attacks frequently get through.",
          "Fully in place":
            "A dedicated email security solution or premium tier is deployed, with URL rewriting, attachment sandboxing, and impersonation protection active. Known-bad senders are blocked at the gateway. Suspicious emails are quarantined and reviewed rather than delivered with a warning banner.",
          "Documented & tested":
            "Email security configuration is documented, tuned based on real incidents, and reviewed at least quarterly. Quarantine review is assigned to a specific role, and false negatives are investigated and used to improve filtering rules. The organization can produce evidence of blocked threat volumes and response times on request.",
        },
        tooltip: {
          explanation:
            "Email filtering inspects inbound messages for malware, phishing links, and social engineering attempts. Advanced solutions use AI to detect sophisticated impersonation attacks targeting healthcare staff.",
          insurerNote:
            "Email reaches every clinician and staff member, which makes it a direct route into healthcare organizations. Insurers want to see advanced email filtering beyond basic spam protection.",
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
            "Regular phishing simulations demonstrate an active security culture. Insurers often ask how often you run them.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "HIPAA requires that electronic PHI is transmitted securely. Consumer messaging apps and unencrypted email do not meet this standard and create compliance risk.",
          insurerNote:
            "PHI sent over insecure channels can be read by anyone who intercepts it. Insurers assess whether secure communication tools are provided and enforced.",
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
            "Domain spoofing enables Business Email Compromise attacks. Insurers often check DMARC records during underwriting.",
          controlSlug: "email-authentication",
        },
      },
      {
        key: "hc_em_breach_comms",
        text: "How prepared is your organization to handle breach notification communications?",
        type: "maturity",
        nistFunction: "Respond",
        cisControl: 17,
        rubric: {
          "Not in place":
            "No one has thought about what to say to patients, staff, or the media if a breach happens. When an incident occurs, leadership will be drafting patient notification letters for the first time during the worst week of the year. Legal and PR support have not been pre-identified.",
          "Partially in place":
            "General awareness exists that breach notification is required, but no templates, contacts, or procedures have been prepared. Leadership knows they will need outside legal help but has not identified who. Communication decisions will be made in real time under pressure, which consistently produces worse outcomes and higher legal exposure.",
          "Fully in place":
            "Breach communication templates exist for the common scenarios, including patient notification letters, staff briefings, media holding statements, and regulator filings. Outside counsel and PR support are pre-identified with contracts or retainers in place. A spokesperson has been designated and briefed on how to handle press inquiries.",
          "Documented & tested":
            "Communication procedures have been exercised through tabletop drills, and the templates have been reviewed by counsel. The decision tree for when and what to communicate is written down, including timing requirements for HHS, state AGs, and affected individuals. Post-exercise findings have been incorporated into updated templates, and the most recent tabletop can be produced on request.",
        },
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
        rubric: {
          "Not in place":
            "The firewall is whatever came with the internet router, running default rules that have not been reviewed since installation. No one can explain what traffic is allowed or blocked, and changes are made ad-hoc by whoever has the admin password. Logs either do not exist or are never looked at.",
          "Partially in place":
            "A dedicated firewall is in place, but the rule base has grown over years without cleanup. Rules that were added for a specific project or vendor are still active long after the need ended. No one has done a full rule review, and next-gen features like intrusion prevention or SSL inspection are either unlicensed or not turned on.",
          "Fully in place":
            "A next-generation firewall is deployed with application awareness, intrusion prevention, and SSL inspection enabled. Rules are documented with a business justification for each, and unused rules are retired. Firewall logs flow to a SIEM or monitoring tool where suspicious activity generates alerts.",
          "Documented & tested":
            "Firewall configuration is version-controlled, reviewed at least quarterly, and tied to specific owners. Rule changes go through a change management process with documented approval. Penetration tests or external scans validate the perimeter on a regular cadence, and findings are remediated and tracked to closure.",
        },
        tooltip: {
          explanation:
            "Firewalls control traffic flow between network zones and the internet. Next-generation firewalls add application awareness, intrusion prevention, and SSL inspection capabilities.",
          insurerNote:
            "Insurers assess whether firewall rules are regularly reviewed and whether next-gen capabilities are enabled for clinical network protection.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "Remote access lets staff work from outside the facility but creates a pathway attackers can exploit. Secure remote access requires encrypted tunnels, strong authentication, and device health checks.",
          insurerNote:
            "Remote desktop (RDP) open to the internet gives attackers a login screen for your network. Insurers often ask whether remote access is protected with VPN and MFA.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "Network monitoring uses sensors and log analysis to detect suspicious activity, such as unusual data transfers, lateral movement, or communication with known malicious servers.",
          insurerNote:
            "Without monitoring, a breach can go unnoticed for as long as the attacker stays quiet. Insurers prefer 24/7 SOC capabilities, which shorten the time an attacker goes undetected.",
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
        rubric: {
          "Not in place":
            "There is no written incident response plan. If a ransomware note appears on a clinical workstation tomorrow, the first hour will be spent figuring out who to call, whether the cyber insurance policy covers this, and how to tell the clinicians whose schedules just evaporated. Decisions will be made by whoever happens to be in the building.",
          "Partially in place":
            "A plan exists, usually written by an outside IT company or compliance vendor, but it is generic and sits on a shared drive that nobody has opened in a year. It does not reflect current staff, current vendors, or current systems. Key contacts in it have left the organization. It has never been exercised, and most staff do not know it exists.",
          "Fully in place":
            "A written IR plan is current, tailored to the organization, and includes HIPAA-specific breach determination and notification steps. Roles are assigned to named individuals with backups. The plan includes contact information for cyber insurance, outside counsel, and breach response vendors. It lives somewhere the team can access even if the primary network is down.",
          "Documented & tested":
            "The IR plan is exercised through tabletop drills at least annually, and the findings feed back into plan updates. Evidence of the last exercise can be produced on request, including who participated and what gaps were found. The plan has been used or rehearsed against realistic scenarios like ransomware, EHR downtime, and business email compromise.",
        },
        tooltip: {
          explanation:
            "A HIPAA-compliant IR plan documents specific steps for identifying, containing, and reporting breaches, including the 60-day notification deadline to HHS and affected individuals for breaches of 500+ records.",
          insurerNote:
            "Insurers often ask whether you have a documented and tested IR plan. Plans that include HIPAA-specific requirements demonstrate regulatory awareness.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
  // 8. Vendor & Business Associate Management (GV.SC)
  // ─────────────────────────────────────────────
  {
    id: "vendor_management",
    title: "Vendor & Business Associate Management",
    nistCategory: "GV.SC",
    questions: [
      {
        key: "hc_vm_baa_tracking",
        text: "How does your organization track Business Associate Agreements (BAAs) across all vendors with PHI access?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 15,
        options: [
          { label: "Centralized system tracking all BAAs with expiration alerts and annual review", weight: 1.0 },
          { label: "Spreadsheet or document listing BAAs with periodic review", weight: 0.55 },
          { label: "BAAs exist but no centralized tracking or review process", weight: 0.25 },
          { label: "No formal BAA tracking in place", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "HIPAA requires a signed BAA with every vendor that creates, receives, maintains, or transmits PHI on your behalf. Missing BAAs create direct regulatory liability.",
          insurerNote:
            "A missing BAA leaves PHI with a vendor that has made no HIPAA commitments to you. Insurers assess BAA management as an indicator of overall vendor risk governance.",
          controlSlug: "baa-compliance-tracking",
        },
      },
      {
        key: "hc_vm_risk_assessment",
        text: "How are vendors assessed for cybersecurity risk before being granted access to PHI or systems?",
        type: "maturity",
        nistFunction: "Govern",
        cisControl: 15,
        rubric: {
          "Not in place":
            "Vendors are onboarded based on whoever sold them to the practice, with no security review. If a vendor asks for VPN access, EHR integration, or admin credentials, they get it. The organization is trusting that any company selling to healthcare must already be secure, which is not a safe assumption.",
          "Partially in place":
            "Some basic due diligence happens for the obvious vendors like the EHR or backup provider, usually consisting of checking whether they have a SOC 2 report. Smaller vendors, contractors, and one-off integrations are not reviewed. There is no consistent process, and decisions are made by whoever is onboarding the vendor.",
          "Fully in place":
            "Every vendor with PHI access or system access is assessed before onboarding. The assessment is sized to the risk, which means a cloud EHR gets a deeper review than a fax-replacement service. Reviews look at SOC 2 reports, security questionnaires, breach history, and contractual security requirements.",
          "Documented & tested":
            "Vendor assessments are owned by a specific role, follow a documented methodology, and produce written findings that drive onboarding decisions. Evidence of assessments can be produced for any current vendor. Reassessments happen on a schedule, and findings that fall below acceptable risk levels trigger remediation discussions or vendor replacement.",
        },
        tooltip: {
          explanation:
            "Vendor risk assessments evaluate a third party's security posture before granting them access to your environment or PHI. This may include questionnaires, SOC 2 report reviews, or external security ratings.",
          insurerNote:
            "A breach at a vendor can expose your patients' PHI even if your own systems are secure. Insurers want to see that vendors are vetted before being granted PHI access.",
          controlSlug: "vendor-risk-assessment",
        },
      },
      {
        key: "hc_vm_phi_sharing",
        text: "How well does your organization maintain an inventory of all third parties that receive or access PHI?",
        type: "maturity",
        nistFunction: "Govern",
        cisControl: 15,
        rubric: {
          "Not in place":
            "No one can produce a list of which vendors receive or touch PHI. The EHR vendor is obvious, but everyone forgets the billing company, the fax service, the transcription vendor, the outside IT company with admin access, and the cloud backup provider. When OCR asks for a list during an audit, the organization scrambles.",
          "Partially in place":
            "A partial list exists, usually the handful of vendors who signed BAAs during the last compliance push. New vendors added since then may or may not be on it. Vendors who touch PHI through integrations rather than contracts (like outside IT companies with admin access) are often missing. The list was accurate once and has not been maintained.",
          "Fully in place":
            "A current inventory lists every third party that creates, receives, maintains, or transmits PHI on the organization's behalf. It includes cloud vendors, on-premises integrations, outside IT companies with administrative access, and subcontractors flagged through primary BAAs. The inventory is updated when new vendors are onboarded.",
          "Documented & tested":
            "The PHI sharing inventory is owned by a named role and reviewed at least annually. It is cross-referenced against BAA tracking to confirm every vendor with PHI access has a signed agreement. The inventory supports breach scoping and regulatory response, and has been used to answer specific 'who sees this data' questions in the past year.",
        },
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
        nistFunction: "Govern",
        cisControl: 15,
        options: [
          { label: "BAAs require downstream subcontractor agreements, with periodic verification", weight: 1.0 },
          { label: "BAAs include subcontractor provisions but verification is not performed", weight: 0.5 },
          { label: "Subcontractor compliance is left to the business associate with no oversight", weight: 0.2 },
          { label: "Subcontractor compliance is not addressed", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
        nistFunction: "Govern",
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
            "One-time assessments become stale quickly. Insurers look for regular vendor reviews as part of an ongoing third-party risk management program.",
          controlSlug: "vendor-audit-frequency",
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. HIPAA Compliance Program (GV)
  // ─────────────────────────────────────────────
  {
    id: "hipaa_compliance",
    title: "HIPAA Compliance Program",
    nistCategory: "GV",
    questions: [
      {
        key: "hc_hc_security_officer",
        text: "How is the role of HIPAA Security Officer fulfilled in your organization?",
        type: "singleselect",
        nistFunction: "Govern",
        cisControl: 17,
        options: [
          { label: "Designated individual with formal authority, dedicated time, and direct executive reporting", weight: 1.0 },
          { label: "Designated individual but role is combined with other full-time duties", weight: 0.6 },
          { label: "Responsibility is informally assigned without formal designation", weight: 0.25 },
          { label: "No one is designated as HIPAA Security Officer", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
        nistFunction: "Govern",
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
            "The HIPAA Security Rule requires covered entities to conduct an accurate and thorough assessment of potential risks and vulnerabilities to ePHI. Without one, you cannot show which risks you found or how you chose to address them.",
          insurerNote:
            "Risk analysis is the cornerstone of HIPAA compliance. Insurers often ask whether yours is current.",
          controlSlug: "hipaa-risk-analysis",
        },
      },
      {
        key: "hc_hc_policies",
        text: "What is the maturity of your HIPAA policies and procedures documentation?",
        type: "maturity",
        nistFunction: "Govern",
        cisControl: 17,
        rubric: {
          "Not in place":
            "HIPAA policies either do not exist or exist only as a generic template downloaded years ago and never customized. Staff have never read them, and they do not reflect how the organization actually operates. In an OCR audit, the gap between the paper and the practice would be the first thing flagged.",
          "Partially in place":
            "Policies exist and cover the major HIPAA requirements, but they have not been updated in years. Some reference systems the organization no longer uses or omit systems recently added. Staff awareness is uneven, and no one owns the policy library. Updates happen only when prompted by an external event like a compliance audit.",
          "Fully in place":
            "Policies and procedures cover the administrative, physical, and technical safeguards required by HIPAA, and they reflect current operations. A designated owner maintains them, and staff are made aware of relevant policies as part of onboarding and annual training. Changes to systems or workflows prompt corresponding policy updates.",
          "Documented & tested":
            "Policies are reviewed on a defined schedule, with evidence of the last review and approval. Changes are version-controlled and communicated to affected staff. Policy exceptions are tracked and time-limited. The library can be produced for an OCR audit with confidence that it matches operational reality.",
        },
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
        nistFunction: "Govern",
        cisControl: 17,
        options: [
          { label: "Documented sanctions policy with graduated consequences, consistently enforced and tracked", weight: 1.0 },
          { label: "Written sanctions policy exists and is applied but not consistently tracked", weight: 0.6 },
          { label: "Informal disciplinary process without a specific HIPAA sanctions policy", weight: 0.25 },
          { label: "No sanctions policy for HIPAA violations", weight: 0.0 },
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
        rubric: {
          "Not in place":
            "Security awareness training is the five-minute HIPAA refresher that happens once a year, covers nothing beyond 'do not share passwords,' and is clicked through by staff during lunch. There is no content on current threats, phishing recognition, or what to do if something goes wrong.",
          "Partially in place":
            "A training program exists beyond bare HIPAA, usually purchased from a vendor, but engagement is low. Completion is tracked but understanding is not. Content is generic and not tailored to healthcare-specific threats. Phishing simulations happen occasionally, and clicking rates are reviewed but rarely translated into targeted follow-up training.",
          "Fully in place":
            "Training covers phishing, ransomware, social engineering, and PHI handling scenarios that staff actually encounter. Content is refreshed with current threats and real incidents the industry has seen. Completion is tracked and enforced. Phishing simulations run at a regular cadence with results used to shape further training for high-risk groups.",
          "Documented & tested":
            "The program has measurable outcomes, including phishing click-rate trends, simulation performance by department, and post-training comprehension checks. Evidence of ongoing improvement can be produced on request. Training content is reviewed at least annually against current threat intelligence, and the most at-risk roles get deeper training tailored to their specific exposure.",
        },
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
            "Social engineering targets people rather than systems, so technical controls alone cannot stop it. Insurers value programs that address multiple attack vectors beyond just email phishing.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "PHI handling training covers practical topics (locking screens, secure printing, verbal discussions in shared spaces, proper faxing, and secure disposal) tailored to each role's daily workflows.",
          insurerNote:
            "Careless PHI handling causes breaches that training can prevent. Insurers value role-specific training that addresses real clinical scenarios.",
          controlSlug: "phi-handling-training",
        },
      },
      {
        key: "hc_sa_incident_reporting",
        text: "How well is the process for reporting suspected security incidents or PHI breaches communicated to staff?",
        type: "maturity",
        nistFunction: "Detect",
        cisControl: 17,
        rubric: {
          "Not in place":
            "Staff do not know how to report a suspicious email, a lost laptop, or a potential PHI exposure. The general assumption is to tell someone in IT if anything weird happens, but nothing is formalized. Incidents often go unreported because staff are worried about getting in trouble or do not realize what they saw mattered.",
          "Partially in place":
            "A reporting process exists on paper, usually mentioned during HIPAA training, but it is not reinforced or top of mind. Staff know there is a reporting email address or phone number but may not remember it. The organization hears about incidents from IT tickets or complaints rather than from staff who noticed something first.",
          "Fully in place":
            "Reporting channels are clear, simple, and communicated repeatedly. Staff know exactly who to contact and are encouraged to report anything suspicious without fear of blame. Reports are acknowledged quickly and followed up with visible action. A culture of reporting exists at every level of the organization.",
          "Documented & tested":
            "The reporting process is written down, distributed to staff, and reinforced through ongoing communication. Metrics on report volume, time-to-acknowledgment, and outcomes are tracked. Staff who report incidents receive recognition or feedback demonstrating that reports are valued. The process has caught real incidents early, and those cases are used as teaching examples.",
        },
        tooltip: {
          explanation:
            "Every workforce member should know how to report a suspected incident: who to contact, what information to provide, and that reporting is encouraged without fear of retaliation. Early reporting reduces breach impact.",
          insurerNote:
            "Clear reporting channels mean incidents surface sooner. Insurers value early detection because it limits how far an incident spreads.",
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
          { label: "I don't know", weight: 0.0, flag: "discovery" },
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
  // ──────────────────────────────────────────────
  // Infrastructure Health (ID.AM)
  // ──────────────────────────────────────────────
  {
    id: "hc_infrastructure",
    title: "Infrastructure Health",
    nistCategory: "ID.AM",
    questions: [
      {
        key: "hc_infra_workstation_age",
        text: "How old are the oldest workstations (desktops/laptops) regularly used in your organization?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "Older workstations may no longer receive security updates from the manufacturer, making them vulnerable to known exploits that cannot be patched.",
          insurerNote:
            "Insurers often ask about end-of-life hardware. Microsoft ended support for Windows 10 in October 2025, so those devices no longer get security fixes unless they are enrolled in Microsoft's Extended Security Updates program.",
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
        key: "hc_infra_server_age",
        text: "If your organization operates on-premises servers, how old are they?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 1,
        tooltip: {
          explanation:
            "Servers older than 5 years are likely running outdated operating systems that no longer receive security patches. Any known flaw in an unpatched system stays open for as long as it runs.",
          insurerNote:
            "Insurers often ask whether you run unsupported server operating systems (such as Windows Server 2012 or 2008), which no longer receive security updates.",
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
        key: "hc_infra_network_age",
        text: "How old is your primary network equipment (firewall, switches, wireless access points)?",
        type: "singleselect",
        nistFunction: "Identify",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network equipment that is past its end-of-life date no longer receives firmware updates, leaving known vulnerabilities permanently unpatched.",
          insurerNote:
            "Insurers often ask about network equipment age. Routers and firewalls that no longer get firmware updates can be found and attacked from the internet.",
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
