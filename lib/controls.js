export const CONTROLS = [
  // ─────────────────────────────────────────────
  // 1. Multi-Factor Authentication
  // ─────────────────────────────────────────────
  {
    slug: "multi-factor-authentication",
    name: "Multi-Factor Authentication (MFA)",
    nistFunction: "Protect",
    nistCategory: "PR.AC-7",
    cisControl: 6,
    cisControlName: "Access Control Management",

    explanation:
      "Multi-factor authentication (MFA) requires users to present two or more distinct forms of evidence before gaining access to an account or system. These factors typically fall into three categories: something you know (a password), something you have (a phone or hardware token), and something you are (a fingerprint or facial scan). By requiring more than one factor, MFA dramatically reduces the risk that a compromised password alone can lead to unauthorized access.\n\nPasswords by themselves are an increasingly unreliable security boundary. Credential stuffing attacks, phishing campaigns, and large-scale data breaches regularly expose millions of username-and-password pairs. When an attacker obtains a valid password, MFA serves as the critical second barrier that prevents account takeover. Studies consistently show that MFA blocks over 99% of automated credential-based attacks.\n\nFor small and mid-sized businesses, MFA is one of the highest-impact, lowest-cost security improvements available. Most major cloud platforms, email providers, and SaaS applications offer built-in MFA at no additional charge. Authenticator apps such as Microsoft Authenticator, Google Authenticator, or Duo Mobile provide time-based one-time passwords (TOTP) that are significantly more secure than SMS-based codes, which can be intercepted through SIM-swapping attacks.\n\nImplementing MFA should be treated as a foundational security control rather than an optional enhancement. Organizations that delay MFA adoption expose themselves to preventable breaches that can result in data loss, regulatory penalties, and reputational harm. A phased rollout starting with the most critical systems — email, VPN, financial applications — allows organizations to build user familiarity while rapidly reducing their attack surface.",

    insuranceRelevance:
      "MFA is one of the most commonly required controls on cyber liability insurance applications. Many insurers now treat the absence of MFA as an automatic disqualifier or a reason to significantly increase premiums. Underwriters view MFA as a baseline expectation because its absence is correlated with a dramatically higher likelihood of ransomware incidents and business email compromise claims.\n\nInsurance carriers increasingly ask granular questions about where MFA is enforced — email, remote access, privileged accounts, and cloud administration. Organizations that can demonstrate comprehensive MFA coverage across all critical systems are more likely to receive favorable terms, lower deductibles, and broader coverage. Conversely, a breach that occurs in a system where MFA was available but not enabled may result in a coverage dispute or claim denial.",

    industryNotes: {
      healthcare:
        "Under HIPAA, MFA is considered an addressable safeguard for access control (45 CFR 164.312(d)). While not explicitly mandated, covered entities must document their rationale if they choose not to implement it. The HHS Office for Civil Rights has increasingly cited lack of MFA in enforcement actions following breaches involving electronic protected health information (ePHI).",
      legal:
        "The ABA Formal Opinion 477R recommends MFA as part of a lawyer's duty of competence when transmitting confidential client information. Many state bar ethics opinions now reference MFA as a reasonable safeguard. Law firms are high-value targets for attackers seeking privileged communications, making MFA essential for protecting attorney-client privilege.",
      financial:
        "GLBA Safeguards Rule updates require MFA for any individual accessing customer information systems. PCI-DSS Requirement 8.3 mandates MFA for all non-console administrative access and all remote network access to cardholder data environments. FINRA and SEC examination priorities regularly include MFA verification.",
      retail:
        "PCI-DSS Requirement 8.3 mandates MFA for all personnel with non-console administrative access to systems handling cardholder data. Retail organizations with e-commerce platforms must also secure customer-facing administrative portals with MFA. Failure to implement MFA can result in PCI non-compliance findings during qualified security assessor (QSA) audits.",
      government:
        "CMMC Level 2 requires MFA per NIST 800-171 control IA.L2-3.5.3 for all network access to privileged and non-privileged accounts. Executive Order 14028 mandates MFA across all federal agencies and their contractors. State and local governments receiving federal grants increasingly face MFA requirements as a condition of funding.",
    },

    implementationSteps: [
      "Inventory all business-critical accounts and systems that support MFA",
      "Enable MFA on email accounts first, as email is the highest-risk vector for business email compromise",
      "Roll out MFA to VPN, cloud services, and financial systems in the next phase",
      "Train employees on using authenticator apps (prefer TOTP apps over SMS-based codes)",
      "Document the MFA policy, including enforcement procedures and exception handling",
      "Establish a process for MFA recovery when employees lose their authentication device",
    ],
  },

  // ─────────────────────────────────────────────
  // 2. Password Management
  // ─────────────────────────────────────────────
  {
    slug: "password-management",
    name: "Password Policies & Managers",
    nistFunction: "Protect",
    nistCategory: "PR.AC-1",
    cisControl: 5,
    cisControlName: "Account Management",

    explanation:
      "Password management encompasses the policies, tools, and practices that govern how credentials are created, stored, and rotated across an organization. Strong password hygiene remains a critical layer of defense even when multi-factor authentication is in place, because passwords are still the primary authentication factor for most systems and many legacy applications do not support MFA.\n\nModern password guidance from NIST SP 800-63B has shifted away from the traditional approach of requiring complex character combinations and frequent rotation. Instead, the emphasis is on password length (at least 14 characters), screening against known-breached password lists, and eliminating predictable patterns. Longer passphrases composed of random words are both easier to remember and harder to crack than short, complex strings.\n\nEnterprise password managers such as 1Password Business, Bitwarden, or Keeper solve the practical problem of credential sprawl. The average employee manages dozens of accounts, and without a password manager, reuse is nearly inevitable. A centralized password manager generates unique, high-entropy credentials for every account, stores them in an encrypted vault, and enables secure sharing among team members without exposing plaintext passwords.\n\nOrganizations should enforce password manager adoption through policy and make it easy by providing a company-licensed solution. Combining a password manager with a ban on browser-saved passwords and regular audits of weak or reused credentials creates a robust credential hygiene program that significantly reduces the risk of credential-based attacks.",

    insuranceRelevance:
      "Cyber insurance applications frequently ask about password policies, including minimum length requirements, complexity rules, and whether the organization uses a password manager. Insurers view poor password hygiene as a leading indicator of breach risk because credential reuse and weak passwords are the root cause of a large percentage of claims.\n\nDemonstrating a mature password management program — enterprise password manager deployment, enforced length minimums, and screening against breached-credential databases — signals to underwriters that the organization takes proactive steps to reduce its attack surface. Some carriers offer premium discounts for organizations with documented, enforced password policies.",

    industryNotes: {
      healthcare:
        "HIPAA requires unique user identification and emergency access procedures under the Security Rule. Shared credentials violate the audit trail requirements of 45 CFR 164.312(a)(2)(i). Password managers help healthcare organizations maintain individual accountability while managing access to EHR systems and clinical applications.",
      legal:
        "Client trust accounts and case management systems contain highly sensitive information that demands strong credential protection. The ABA Model Rules of Professional Conduct Rule 1.6 requires reasonable efforts to prevent unauthorized disclosure, and the use of unique, strong passwords for each system is a baseline expectation in ethics guidance.",
      financial:
        "The GLBA Safeguards Rule requires access controls that include authentication mechanisms. FFIEC guidance specifies that financial institutions should implement password policies commensurate with the risk of the systems being protected. PCI-DSS Requirement 8.2 mandates unique IDs and strong authentication for all users accessing cardholder data.",
      retail:
        "PCI-DSS Requirement 8.2 requires unique identification and strong authentication for all personnel with access to cardholder data. Default vendor passwords must be changed before systems go into production. Retail organizations managing point-of-sale systems must ensure that service account credentials are unique and securely stored.",
      government:
        "NIST 800-171 control IA.L2-3.5.7 requires a minimum password complexity, and IA.L2-3.5.8 prohibits password reuse for a specified number of generations. CMMC assessors verify that password policies are documented, enforced technically, and audited regularly. FedRAMP-authorized services must comply with NIST 800-63B password guidelines.",
    },

    implementationSteps: [
      "Select and deploy an enterprise password manager for all employees",
      "Establish a password policy requiring a minimum of 14 characters and screening against breached-credential lists",
      "Disable browser-based password saving on managed devices via group policy or MDM",
      "Migrate shared credentials (Wi-Fi passwords, service accounts) into the password manager's secure sharing vaults",
      "Conduct quarterly audits using the password manager's reporting tools to identify weak or reused credentials",
    ],
  },

  // ─────────────────────────────────────────────
  // 3. Access Control Policy
  // ─────────────────────────────────────────────
  {
    slug: "access-control-policy",
    name: "Access Control & Least Privilege",
    nistFunction: "Protect",
    nistCategory: "PR.AC-4",
    cisControl: 6,
    cisControlName: "Access Control Management",

    explanation:
      "Access control is the practice of restricting system and data access to only those individuals who need it to perform their job functions. The principle of least privilege states that every user, application, and process should operate with the minimum set of permissions necessary — no more, no less. This limits the blast radius when an account is compromised and reduces the likelihood of accidental data exposure.\n\nRole-based access control (RBAC) is the most practical model for small and mid-sized organizations. Under RBAC, permissions are assigned to defined roles (e.g., 'Sales Rep,' 'Finance Manager,' 'IT Admin') rather than to individual users. When an employee changes roles, their permissions are updated by reassigning their role rather than manually adjusting dozens of individual access rights.\n\nPrivileged accounts — those with administrative access to systems, networks, or data — require special handling. Admin credentials should be separate from daily-use accounts, stored in a privileged access management (PAM) solution, and used only when administrative tasks are required. The practice of using an admin account for everyday email and web browsing is one of the most dangerous habits in any organization.\n\nDocumenting access control policies is as important as implementing them technically. A written policy should define who approves access requests, how access is granted and revoked, and what constitutes appropriate use. Without documentation, access decisions become ad hoc, inconsistent, and impossible to audit — all of which create risk and compliance gaps.",

    insuranceRelevance:
      "Insurers evaluate access control maturity because overly permissive access is a root cause of insider threats and lateral movement during breaches. Applications commonly ask whether the organization follows the principle of least privilege and whether administrative access is restricted to dedicated accounts.\n\nOrganizations that can demonstrate documented access control policies, role-based permissions, and separation of administrative and standard accounts are viewed as lower-risk by underwriters. In claims investigations, insurers examine whether excessive access contributed to the scope of a breach, and findings of poor access control can affect coverage decisions.",

    industryNotes: {
      healthcare:
        "HIPAA's minimum necessary standard (45 CFR 164.502(b)) requires that access to protected health information be limited to the minimum necessary to accomplish the intended purpose. Role-based access is the standard approach for EHR systems. OCR enforcement actions have cited overly broad access as a contributing factor in breach investigations.",
      legal:
        "Ethical walls (also called information barriers) are a critical access control requirement in law firms handling matters with potential conflicts of interest. The ABA Model Rules require firms to implement measures that prevent unauthorized access to confidential client information across practice groups.",
      financial:
        "The GLBA Safeguards Rule requires financial institutions to restrict access to customer information to authorized personnel only. Segregation of duties is a core principle — no single individual should be able to initiate and approve financial transactions. SOX compliance for publicly traded companies requires documented access controls over financial reporting systems.",
      retail:
        "PCI-DSS Requirement 7 mandates that access to cardholder data be restricted to personnel whose jobs require it. Access must be granted on a need-to-know basis, and all access must be documented and authorized by management. Point-of-sale system access must be tightly controlled to prevent skimming and fraud.",
      government:
        "NIST 800-171 control AC.L2-3.1.5 requires the principle of least privilege, and AC.L2-3.1.2 requires limiting system access to authorized transactions and functions. CMMC Level 2 assessors verify that access control policies are not only documented but technically enforced and regularly audited.",
    },

    implementationSteps: [
      "Document an access control policy that defines roles, approval workflows, and the principle of least privilege",
      "Implement role-based access control (RBAC) in all major systems, mapping job functions to permission sets",
      "Separate administrative accounts from daily-use accounts for all IT staff",
      "Require manager approval for all access requests and maintain an access request log",
      "Review and remove unnecessary permissions when employees change roles or responsibilities",
    ],
  },

  // ─────────────────────────────────────────────
  // 4. Employee Offboarding
  // ─────────────────────────────────────────────
  {
    slug: "employee-offboarding",
    name: "Employee Offboarding & Account Deprovisioning",
    nistFunction: "Protect",
    nistCategory: "PR.AC-1",
    cisControl: 6,
    cisControlName: "Access Control Management",

    explanation:
      "Employee offboarding is the process of revoking all access rights when an individual leaves the organization, whether through resignation, termination, or contract completion. A structured deprovisioning process ensures that former employees cannot access company systems, data, or facilities after their departure. Failing to revoke access promptly is one of the most common and preventable security gaps in small and mid-sized businesses.\n\nThe risk is not limited to malicious intent. Even well-meaning former employees who retain access to shared drives, email, or cloud services create compliance violations and increase the organization's liability. In cases of involuntary termination, the risk of retaliatory data theft or sabotage is significantly elevated, making same-day deprovisioning essential for terminated employees.\n\nAn effective offboarding checklist should cover every system the employee accessed: email, directory services (Active Directory, Entra ID), cloud applications, VPN, physical access badges, shared credentials, and any devices issued to the employee. The checklist should be maintained jointly by HR and IT, triggered automatically by HR status changes when possible, and completed within a defined timeframe — ideally within hours for involuntary departures.\n\nOrganizations should also address shared credentials that the departing employee knew. If the employee had access to shared accounts, Wi-Fi passwords, or service credentials, those should be rotated as part of the offboarding process. This is another reason enterprise password managers are valuable — they make it easy to identify and rotate shared secrets when someone leaves.",

    insuranceRelevance:
      "Cyber insurance claims frequently involve former employees who retained access after departure. Insurers ask whether the organization has a formal offboarding process and how quickly access is revoked. A documented, consistently followed offboarding procedure demonstrates operational maturity and reduces the risk profile assessed by underwriters.\n\nIn the event of a breach traced to a former employee's credentials, the insurer will investigate whether timely deprovisioning could have prevented the incident. Organizations without a documented process may face coverage challenges if the breach resulted from negligent access management.",

    industryNotes: {
      healthcare:
        "HIPAA requires the termination of access to ePHI when employment ends, as part of the workforce clearance procedure under 45 CFR 164.308(a)(3). OCR has investigated breaches where former workforce members accessed patient records post-departure. Healthcare organizations must ensure EHR access is revoked on the employee's last day.",
      legal:
        "Former attorneys and staff who retain access to case management systems and client files pose a significant risk to attorney-client privilege. State bar ethics rules require firms to take reasonable measures to prevent unauthorized access, which includes timely deprovisioning when personnel leave the firm.",
      financial:
        "GLBA and FFIEC guidance require prompt revocation of access when employees leave. SOX-regulated companies must maintain audit trails showing when access was removed. Delayed deprovisioning at financial institutions can lead to regulatory findings during examinations.",
      retail:
        "PCI-DSS Requirement 8.1.3 mandates that access for terminated users be immediately revoked. Retail environments with high turnover are particularly vulnerable to lingering access. Point-of-sale and inventory systems must be included in the deprovisioning checklist.",
      government:
        "NIST 800-171 control PS.L2-3.9.2 requires that CUI access be revoked upon personnel termination. Government contractors must also recover all government-furnished equipment and media. Failure to deprovision promptly can jeopardize facility clearances and contract eligibility.",
    },

    implementationSteps: [
      "Create a comprehensive offboarding checklist covering all systems, devices, and physical access",
      "Integrate the offboarding process with HR so that IT is notified immediately upon an employee's departure",
      "Establish a same-day deprovisioning requirement for involuntary terminations",
      "Rotate any shared credentials the departing employee had access to",
      "Recover all company-issued devices, including laptops, phones, and access badges",
      "Conduct a post-offboarding audit to verify all access has been revoked",
    ],
  },

  // ─────────────────────────────────────────────
  // 5. Access Review
  // ─────────────────────────────────────────────
  {
    slug: "access-review",
    name: "Periodic Access Reviews",
    nistFunction: "Protect",
    nistCategory: "PR.AC-1",
    cisControl: 6,
    cisControlName: "Access Control Management",

    explanation:
      "Periodic access reviews are scheduled evaluations of user permissions to ensure that access rights remain appropriate over time. Even with strong onboarding and offboarding processes, permission drift is inevitable — employees change roles, temporary access becomes permanent, and new systems are added without consistent permission models. Regular reviews catch these gaps before they become vulnerabilities.\n\nAccess reviews should examine both user-to-system mappings and the permissions within each system. A user may still need access to a financial application, but their role may have changed such that they no longer need administrative privileges within it. Reviewing at both levels ensures that the principle of least privilege is maintained over time.\n\nFor small and mid-sized businesses, a quarterly review cycle strikes a practical balance between thoroughness and administrative burden. The review should involve system owners or department managers who can verify whether each user's access is still appropriate for their current role. IT should facilitate the process and execute any changes, but the business decision about who needs access should rest with the people who understand the work.\n\nDocumenting the review process and its outcomes is critical for both security and compliance. Maintain records of who conducted each review, what was examined, what changes were made, and the date of completion. These records demonstrate due diligence to auditors, regulators, and insurance carriers, and they create an institutional memory that makes future reviews more efficient.",

    insuranceRelevance:
      "Insurance carriers recognize that access controls degrade over time without active maintenance. Applications may ask whether the organization conducts periodic access reviews and how frequently. Demonstrating a regular review cadence — supported by documentation — is a strong signal of mature access management.\n\nIn claims scenarios, insurers may examine whether a compromised account had permissions that exceeded the user's current job requirements. If a routine access review would have caught and corrected the excessive permissions, the insurer may question whether the organization met its duty of care.",

    industryNotes: {
      healthcare:
        "HIPAA requires periodic review of information system activity records, including access audits, under 45 CFR 164.308(a)(1)(ii)(D). OCR expects covered entities to review access to ePHI regularly and adjust permissions based on workforce changes. Annual reviews are a common audit finding when not performed.",
      legal:
        "Law firms handling matters with conflicts of interest must regularly verify that ethical walls are intact and that personnel changes have not inadvertently granted access across restricted matters. Many legal malpractice insurers inquire about access review practices as part of their underwriting process.",
      financial:
        "FFIEC examination procedures specifically assess whether financial institutions conduct regular access reviews. SOX Section 404 requires that access controls over financial systems be tested annually. Bank examiners routinely verify that access review documentation is current and complete.",
      retail:
        "PCI-DSS Requirement 7.1.2 requires that access to cardholder data systems be reviewed at least every six months. Retail organizations with seasonal staff must be especially diligent about reviewing and revoking temporary access grants after peak periods.",
      government:
        "NIST 800-171 control AC.L2-3.1.7 requires periodic review of user privileges. CMMC assessors look for evidence of regular access reviews with documented outcomes. Federal contractors must also review access whenever there is a change in personnel security status.",
    },

    implementationSteps: [
      "Establish a quarterly access review schedule and assign responsibility to system owners or department managers",
      "Generate user access reports from each critical system, listing all users and their permission levels",
      "Have managers verify that each user's access is appropriate for their current role and responsibilities",
      "Remove or adjust permissions that are no longer required, documenting the rationale for each change",
      "Maintain a review log with dates, reviewers, findings, and remediation actions for audit purposes",
    ],
  },

  // ─────────────────────────────────────────────
  // 6. Data Encryption
  // ─────────────────────────────────────────────
  {
    slug: "data-encryption",
    name: "Encryption at Rest & in Transit",
    nistFunction: "Protect",
    nistCategory: "PR.DS-1",
    cisControl: 3,
    cisControlName: "Data Protection",

    explanation:
      "Data encryption transforms readable information into an unreadable format using cryptographic algorithms, ensuring that even if data is intercepted or stolen, it remains unintelligible without the corresponding decryption key. Encryption should be applied both at rest (data stored on disks, databases, and backups) and in transit (data moving across networks).\n\nEncryption in transit protects data as it travels between systems, whether across the public internet or within an internal network. TLS 1.2 or 1.3 should be enforced for all web traffic, email transmission, API communications, and remote access connections. Unencrypted protocols such as HTTP, FTP, and Telnet should be disabled or replaced with their encrypted equivalents (HTTPS, SFTP, SSH).\n\nEncryption at rest protects data stored on servers, databases, laptops, and removable media. Modern operating systems and cloud platforms offer built-in encryption — BitLocker for Windows, FileVault for macOS, and server-side encryption for cloud storage services like AWS S3 and Azure Blob Storage. Database-level encryption (Transparent Data Encryption) protects structured data without requiring application changes.\n\nKey management is the often-overlooked companion to encryption. Encryption is only as strong as the protection of the keys used to decrypt the data. Keys should be stored separately from the data they protect, rotated on a defined schedule, and access to key management systems should be tightly restricted. For cloud environments, managed key services (AWS KMS, Azure Key Vault) simplify key management while maintaining strong security controls.",

    insuranceRelevance:
      "Encryption is a standard requirement on cyber insurance applications, particularly for organizations handling sensitive personal, financial, or health data. Insurers ask whether data is encrypted at rest and in transit, and what encryption standards are used. The absence of encryption is a red flag that can increase premiums or narrow coverage.\n\nIn breach scenarios, the presence of encryption can be the difference between a reportable incident and a non-event. Many data breach notification laws include safe harbor provisions that exempt encrypted data from notification requirements, provided the encryption keys were not also compromised. This directly reduces the financial impact of an incident and the resulting insurance claim.",

    industryNotes: {
      healthcare:
        "HIPAA requires encryption as an addressable specification under the Security Rule (45 CFR 164.312(a)(2)(iv) and 164.312(e)(2)(ii)). The Breach Notification Rule provides a safe harbor for encrypted ePHI — if encrypted data is breached but the key is secure, individual notification is not required. This makes encryption one of the most cost-effective controls in healthcare.",
      legal:
        "The ABA Formal Opinion 477R states that lawyers must use encryption when transmitting information relating to client representation, particularly when the communication includes sensitive content. Many state bar opinions reinforce this requirement. Encrypting client data at rest protects against privilege breaches in the event of a firm's systems being compromised.",
      financial:
        "PCI-DSS Requirement 3.4 requires rendering of primary account numbers (PAN) unreadable wherever they are stored, with strong cryptography as the preferred method. GLBA's Safeguards Rule requires encryption of customer data in transit over external networks. Banking regulators expect encryption to be the default for all sensitive financial data.",
      retail:
        "PCI-DSS Requirement 4.1 mandates strong cryptography for cardholder data transmitted over open, public networks. Retail organizations processing card-present and card-not-present transactions must ensure that encryption extends from the point of interaction through the entire payment processing chain.",
      government:
        "NIST 800-171 controls SC.L2-3.13.8 and SC.L2-3.13.11 require encryption of CUI at rest and in transit. FIPS 140-2 validated cryptographic modules are required for federal systems and strongly recommended for contractors. CMMC Level 2 assessors verify both the presence and strength of encryption implementations.",
    },

    implementationSteps: [
      "Enable TLS 1.2 or higher for all web services, email, and API communications",
      "Activate full-disk encryption on all endpoints (BitLocker for Windows, FileVault for macOS)",
      "Enable server-side encryption for all cloud storage buckets and database instances",
      "Disable unencrypted protocols (HTTP, FTP, Telnet) on all systems and replace with encrypted alternatives",
      "Implement a key management policy defining key storage, rotation schedules, and access controls",
    ],
  },

  // ─────────────────────────────────────────────
  // 7. Data Backup
  // ─────────────────────────────────────────────
  {
    slug: "data-backup",
    name: "Backup Strategy & Frequency",
    nistFunction: "Recover",
    nistCategory: "RC.RP-1",
    cisControl: 11,
    cisControlName: "Data Recovery",

    explanation:
      "A data backup strategy defines what data is backed up, how often, where backups are stored, and how long they are retained. Backups are the last line of defense against data loss caused by ransomware, hardware failure, accidental deletion, or natural disasters. Without reliable backups, any of these events can be catastrophic for a business.\n\nThe 3-2-1 backup rule is a widely accepted framework: maintain at least three copies of critical data, on two different types of media, with one copy stored offsite or in the cloud. This approach ensures resilience against single points of failure. If a ransomware attack encrypts local servers and the on-site backup, the offsite copy remains available for recovery.\n\nBackup frequency should be determined by the organization's recovery point objective (RPO) — the maximum acceptable amount of data loss measured in time. If losing more than four hours of work is unacceptable, backups must run at least every four hours. Critical databases and financial systems may require continuous or near-continuous backup through transaction log shipping or real-time replication.\n\nImmutability is an increasingly important backup feature. Immutable backups cannot be modified or deleted for a specified retention period, even by administrators. This protects against ransomware variants that specifically target and encrypt backup systems. Cloud providers and modern backup solutions offer immutable storage options that should be enabled for all critical backup sets.",

    insuranceRelevance:
      "Backup practices are a core focus of cyber insurance underwriting because ransomware is the leading cause of claims. Insurers want to know that the organization can recover without paying a ransom. Applications ask about backup frequency, offsite storage, and — increasingly — whether backups are immutable and air-gapped from the production network.\n\nOrganizations with mature backup strategies receive more favorable terms because they are less likely to file large ransomware claims. Conversely, organizations that rely solely on local backups or have not tested their restoration process may face higher premiums, larger deductibles, or coverage exclusions for ransomware events.",

    industryNotes: {
      healthcare:
        "HIPAA requires a data backup plan as part of the contingency plan under 45 CFR 164.308(a)(7)(ii)(A). Backups of ePHI must be encrypted and stored securely. Healthcare organizations must also maintain the ability to restore data within a timeframe that does not compromise patient care.",
      legal:
        "Legal hold obligations require law firms to preserve relevant data indefinitely during litigation. Backup systems must support granular retention policies and the ability to restore specific files or mailboxes. Loss of client files due to inadequate backups can constitute malpractice.",
      financial:
        "SEC Rule 17a-4 and FINRA regulations require financial firms to maintain backup copies of critical records. FFIEC guidance requires that backup strategies account for both data and system recovery. Financial institutions must demonstrate that backups can support recovery within defined timeframes during examinations.",
      retail:
        "PCI-DSS does not mandate specific backup requirements, but loss of transaction data can create reconciliation issues and compliance gaps. Retail organizations should ensure that POS transaction logs, inventory databases, and customer records are included in backup schedules.",
      government:
        "NIST 800-171 control CP.L2-3.8.9 requires the protection of backup CUI at storage locations. Government contractors must ensure that backups of controlled unclassified information are encrypted and stored with protections equivalent to the primary data. CMMC assessors verify backup procedures and storage security.",
    },

    implementationSteps: [
      "Inventory all critical data and systems, categorizing them by recovery priority",
      "Implement the 3-2-1 backup rule: three copies, two media types, one offsite or cloud location",
      "Configure backup frequency based on recovery point objectives (RPO) for each data category",
      "Enable immutable backup features to prevent ransomware from encrypting or deleting backup sets",
      "Document the backup strategy, including schedules, retention periods, and responsible personnel",
    ],
  },

  // ─────────────────────────────────────────────
  // 8. Backup Testing
  // ─────────────────────────────────────────────
  {
    slug: "backup-testing",
    name: "Backup Restoration Testing",
    nistFunction: "Recover",
    nistCategory: "RC.RP-1",
    cisControl: 11,
    cisControlName: "Data Recovery",

    explanation:
      "Backup restoration testing is the process of periodically verifying that backups can be successfully restored to a functional state. A backup that cannot be restored is worthless, yet many organizations discover this only during an actual emergency. Regular testing transforms backups from a theoretical safety net into a proven recovery capability.\n\nTesting should simulate realistic recovery scenarios. Restoring a single file proves that the backup media is readable, but it does not validate the organization's ability to recover an entire system or database under pressure. Full system restoration tests — where an entire server or application is rebuilt from backup — provide the most meaningful assurance. These tests should be conducted at least quarterly.\n\nRestoration testing also reveals practical information that is critical during an actual incident: how long does recovery take? Is the backup data complete and current? Are there dependencies (software licenses, configuration files, encryption keys) that are not included in the backup? These findings should be documented and used to refine the backup strategy and recovery procedures.\n\nOrganizations should test multiple scenarios, including recovery from local backups, recovery from offsite or cloud backups, and recovery to alternative hardware. Each scenario has different timelines and challenges. Knowing these in advance allows the organization to set realistic recovery time objectives (RTO) and communicate accurate expectations to leadership during an incident.",

    insuranceRelevance:
      "Insurers increasingly ask not just whether backups exist, but whether they have been tested. An organization that performs and documents regular backup restoration tests demonstrates that its recovery capability is real, not theoretical. This is a meaningful differentiator in underwriting because untested backups frequently fail when needed most.\n\nClaims data shows that organizations with tested backups recover from ransomware faster and file smaller claims. Some insurers specifically ask about the date of the last successful restoration test and the scope of what was tested. Documenting test results provides concrete evidence of recovery readiness.",

    industryNotes: {
      healthcare:
        "HIPAA's contingency plan requirements under 45 CFR 164.308(a)(7)(ii)(D) include testing and revision procedures. Healthcare organizations must verify that ePHI backups can be restored accurately and completely. Testing should include restoration of EHR data to ensure patient care continuity.",
      legal:
        "Law firms must be able to demonstrate that client files and communications can be recovered in the event of data loss. Courts have sanctioned parties for spoliation when data was lost and backups proved unrecoverable. Regular testing provides defensible evidence that preservation obligations are being met.",
      financial:
        "FFIEC examination procedures assess whether financial institutions regularly test their backup and recovery capabilities. Examiners expect documented test results, including recovery time measurements and identified gaps. Annual disaster recovery testing is a standard expectation for banks and credit unions.",
      retail:
        "Retail businesses that experience extended downtime due to failed backups face direct revenue loss. Testing should include restoration of point-of-sale systems, inventory databases, and e-commerce platforms. Recovery speed is especially critical during high-volume sales periods.",
      government:
        "NIST 800-53 control CP-4 requires testing of contingency plans, including backup restoration. CMMC assessors verify that backup testing is performed regularly and that results are documented. Federal contractors must demonstrate that CUI can be recovered within defined timeframes.",
    },

    implementationSteps: [
      "Schedule quarterly backup restoration tests for critical systems and data",
      "Perform at least one full system restoration test annually, rebuilding a complete server from backup",
      "Document the results of each test, including restoration time, data completeness, and any issues encountered",
      "Verify that restoration procedures work across all backup locations (local, offsite, cloud)",
      "Update recovery time objectives (RTO) based on actual test results and communicate them to leadership",
    ],
  },

  // ─────────────────────────────────────────────
  // 9. Data Classification
  // ─────────────────────────────────────────────
  {
    slug: "data-classification",
    name: "Data Classification & Handling",
    nistFunction: "Protect",
    nistCategory: "PR.DS-1",
    cisControl: 3,
    cisControlName: "Data Protection",

    explanation:
      "Data classification is the process of categorizing an organization's data based on its sensitivity and the impact of its unauthorized disclosure, modification, or loss. A typical classification scheme includes levels such as Public, Internal, Confidential, and Restricted. Classification provides the foundation for all other data protection decisions — you cannot protect data appropriately if you do not know what you have and how sensitive it is.\n\nOnce data is classified, handling rules define how each category should be stored, transmitted, shared, and disposed of. Confidential data might require encryption at rest and in transit, restricted sharing, and secure deletion. Public data might have no special handling requirements. These rules create consistent, repeatable protection across the organization.\n\nSmall and mid-sized businesses often believe data classification is only for large enterprises, but even simple classification schemes deliver significant value. Knowing that customer PII is 'Confidential' and marketing materials are 'Public' helps employees make better decisions about how to handle information in daily operations. It also helps IT teams prioritize their security investments toward the data that matters most.\n\nData classification should be integrated into the organization's data lifecycle — from creation and collection through storage, use, sharing, and eventual disposal. Data owners (typically department heads) should be responsible for classifying the data their teams generate and manage, with IT providing the tools and infrastructure to enforce handling requirements.",

    insuranceRelevance:
      "Insurers recognize that organizations with data classification programs have a clearer understanding of their risk exposure. When an organization knows where its most sensitive data resides and how it is protected, it can more accurately assess its insurance needs and demonstrate appropriate safeguards to underwriters.\n\nIn breach response, data classification accelerates the critical task of determining what was exposed. If the organization can quickly identify that the affected systems contained only 'Internal' data rather than 'Confidential' PII, the scope of the incident — and the resulting claim — may be significantly reduced.",

    industryNotes: {
      healthcare:
        "HIPAA implicitly requires data classification because protected health information (PHI) must be handled differently from non-PHI data. Healthcare organizations should classify data as PHI, non-PHI sensitive, and public at minimum. The Privacy Rule's minimum necessary standard depends on knowing what data is in each system.",
      legal:
        "Law firms handle data with varying levels of privilege and sensitivity. Attorney-client privileged communications, work product, and client PII each require different protections. Data classification helps firms implement appropriate ethical walls and ensure that privilege is maintained across systems.",
      financial:
        "GLBA requires financial institutions to identify and protect customer financial information. Data classification helps institutions distinguish between non-public personal information (NPI) subject to GLBA, cardholder data subject to PCI-DSS, and general business information. This distinction drives appropriate control selection.",
      retail:
        "Retail organizations handle cardholder data (PCI scope), customer PII, employee data, and business information. Classifying data helps delineate the cardholder data environment from other systems, reducing PCI-DSS scope and compliance costs. It also supports targeted protection of customer loyalty and e-commerce data.",
      government:
        "NIST 800-171 is specifically designed for protecting Controlled Unclassified Information (CUI), which is itself a classification category. Government contractors must identify and mark CUI appropriately, and apply protections commensurate with its classification. Failure to properly classify CUI can result in CMMC assessment failures.",
    },

    implementationSteps: [
      "Define a data classification scheme with clear levels (e.g., Public, Internal, Confidential, Restricted)",
      "Establish handling requirements for each classification level covering storage, transmission, sharing, and disposal",
      "Assign data ownership to department heads responsible for classifying data within their domains",
      "Conduct a data inventory to identify where sensitive data resides across systems and storage locations",
      "Train all employees on the classification scheme and their responsibilities for handling data at each level",
    ],
  },

  // ─────────────────────────────────────────────
  // 10. Data Retention
  // ─────────────────────────────────────────────
  {
    slug: "data-retention",
    name: "Data Retention & Disposal",
    nistFunction: "Protect",
    nistCategory: "PR.DS-3",
    cisControl: 3,
    cisControlName: "Data Protection",

    explanation:
      "Data retention and disposal policies define how long different categories of data should be kept and how they should be securely destroyed when the retention period expires. Retaining data longer than necessary increases the organization's attack surface — every record stored is a record that can be breached. Thoughtful retention policies balance legal and regulatory requirements against the principle of data minimization.\n\nRetention periods vary by data type and regulatory framework. Tax records typically must be retained for seven years, HIPAA requires six years for covered entity documentation, and PCI-DSS has no specific retention mandate but encourages minimizing cardholder data storage. A retention schedule should document these requirements for each data category, along with the legal or business justification for the chosen period.\n\nSecure disposal is the counterpart to retention. Simply deleting a file does not make it unrecoverable — data must be destroyed using methods appropriate to the media and sensitivity level. Digital data should be overwritten using NIST 800-88 compliant methods, and physical media should be degaussed, shredded, or incinerated. Cloud data requires verification that provider deletion processes meet the organization's requirements.\n\nImplementing retention and disposal at scale requires automation. Manual tracking of retention periods is error-prone and unsustainable. Data lifecycle management tools, automated deletion policies in cloud storage, and email retention rules in platforms like Microsoft 365 and Google Workspace help ensure that data is disposed of consistently and on schedule.",

    insuranceRelevance:
      "Data minimization directly reduces breach impact. Insurers increasingly recognize that organizations retaining data beyond its useful or required life are creating unnecessary exposure. A breach of a database containing ten years of customer records results in a far larger claim than a breach of a database containing only two years of records.\n\nRetention and disposal policies demonstrate to underwriters that the organization actively manages its data footprint. In claims investigations, the presence of a retention policy — and evidence that it is followed — supports the argument that the organization took reasonable steps to minimize the impact of a breach.",

    industryNotes: {
      healthcare:
        "HIPAA requires that documentation related to policies, procedures, and compliance activities be retained for six years from the date of creation or the date when it was last in effect. State medical record retention laws vary but typically require 7-10 years for adult patient records. Secure disposal of PHI is required under 45 CFR 164.310(d)(2)(i).",
      legal:
        "Law firms must balance retention obligations (litigation holds, regulatory requirements) with the risk of over-retention. The ABA recommends that firms establish clear policies for retaining and destroying closed client files. Over-retention exposes firms to expanded discovery obligations and increased breach impact.",
      financial:
        "SEC Rule 17a-4 requires certain records to be retained for three to six years. FINRA has similar requirements. The GLBA Safeguards Rule requires secure disposal of customer information. Financial institutions must also comply with IRS record retention requirements for tax-related documents.",
      retail:
        "PCI-DSS Requirement 3.1 requires organizations to keep cardholder data storage to a minimum and implement retention policies that limit storage amount and duration. Stored cardholder data that exceeds the retention policy must be securely deleted. Retail organizations should also address customer PII retention under state privacy laws.",
      government:
        "Federal records management requirements under NARA guidelines define retention periods for government records. NIST 800-171 control MP.L2-3.8.3 requires sanitization of media containing CUI before disposal or reuse. Government contractors must follow NIST 800-88 guidelines for media sanitization.",
    },

    implementationSteps: [
      "Create a data retention schedule documenting retention periods for each data category with legal justifications",
      "Implement automated retention policies in email, cloud storage, and database systems",
      "Establish secure disposal procedures following NIST 800-88 guidelines for digital media",
      "Contract with a certified shredding service for physical document and media destruction",
      "Conduct annual reviews of the retention schedule to account for new regulations and data types",
    ],
  },

  // ─────────────────────────────────────────────
  // 11. Endpoint Protection
  // ─────────────────────────────────────────────
  {
    slug: "endpoint-protection",
    name: "Antivirus & Endpoint Detection and Response (EDR)",
    nistFunction: "Protect",
    nistCategory: "PR.PT-1",
    cisControl: 10,
    cisControlName: "Malware Defenses",

    explanation:
      "Endpoint protection encompasses the security tools deployed on individual devices — laptops, desktops, servers, and mobile devices — to prevent, detect, and respond to malware, ransomware, and other threats. Traditional antivirus software relies on signature-based detection, matching files against a database of known threats. While still useful, signature-based detection alone is insufficient against modern threats that use fileless techniques, polymorphic code, and zero-day exploits.\n\nEndpoint Detection and Response (EDR) represents the evolution of endpoint protection. EDR solutions continuously monitor endpoint activity, using behavioral analysis and machine learning to detect suspicious patterns that signature-based tools miss. When a threat is detected, EDR provides detailed forensic data about the attack chain and, in many cases, automated response capabilities such as isolating the compromised device from the network.\n\nFor small and mid-sized businesses, managed EDR solutions offer enterprise-grade protection without requiring in-house security expertise. Providers like SentinelOne, CrowdStrike, and Microsoft Defender for Endpoint include 24/7 monitoring by security analysts who investigate alerts and coordinate responses. This is significantly more effective than traditional antivirus running without human oversight.\n\nEndpoint protection must be deployed consistently across all devices that access organizational resources. A single unprotected endpoint can serve as the initial entry point for an attack that spreads across the entire network. Centralized management consoles ensure that all endpoints are running current protection, policies are applied consistently, and security teams have visibility into the health of every device.",

    insuranceRelevance:
      "Endpoint protection is a foundational requirement on virtually all cyber insurance applications. Insurers differentiate between traditional antivirus and modern EDR solutions, with many now requiring EDR specifically due to its superior detection capabilities. Organizations running only legacy antivirus may face higher premiums or limited coverage.\n\nManaged EDR solutions are particularly valued by insurers because they include human analysts who can detect and respond to threats that automated tools alone might miss. The ability to demonstrate 24/7 managed endpoint protection is a significant factor in obtaining favorable insurance terms.",

    industryNotes: {
      healthcare:
        "HIPAA requires technical safeguards to protect against malicious software under 45 CFR 164.308(a)(5)(ii)(B). Healthcare organizations must protect all devices that access ePHI, including clinical workstations, mobile devices, and medical IoT devices. EDR solutions with healthcare-specific configurations help manage the unique endpoint landscape in clinical environments.",
      legal:
        "Law firms are high-value targets for advanced persistent threats seeking privileged communications and confidential case information. Signature-based antivirus is inadequate against the targeted attacks firms face. EDR with managed detection and response provides the level of protection commensurate with the sensitivity of legal data.",
      financial:
        "FFIEC guidance requires financial institutions to maintain current malware protection on all systems. PCI-DSS Requirement 5 mandates anti-malware solutions on all systems commonly affected by malware. Financial regulators expect institutions to deploy solutions that address emerging threats, not just known signatures.",
      retail:
        "PCI-DSS Requirement 5.1 requires anti-malware on all systems commonly affected by malicious software, particularly POS terminals and payment processing systems. Retail environments with distributed locations must ensure consistent endpoint protection across all sites, including seasonal or temporary locations.",
      government:
        "NIST 800-171 control SI.L2-3.14.2 requires malicious code protection at designated locations. CMMC assessors verify that endpoint protection is deployed on all endpoints within the CUI boundary. Government contractors handling CUI are increasingly expected to deploy EDR rather than traditional antivirus.",
    },

    implementationSteps: [
      "Deploy a modern EDR solution on all endpoints, including laptops, desktops, and servers",
      "Configure centralized management to ensure consistent policy application and visibility across all devices",
      "Enable automated response actions such as device isolation for high-confidence threat detections",
      "Establish a process for reviewing and investigating EDR alerts within defined response timeframes",
      "Ensure all endpoints are enrolled and reporting, with alerts for devices that lose connectivity or become non-compliant",
    ],
  },

  // ─────────────────────────────────────────────
  // 12. Patch Management
  // ─────────────────────────────────────────────
  {
    slug: "patch-management",
    name: "OS & Software Patching",
    nistFunction: "Protect",
    nistCategory: "PR.PT-3",
    cisControl: 7,
    cisControlName: "Continuous Vulnerability Management",

    explanation:
      "Patch management is the process of identifying, testing, and deploying software updates that fix security vulnerabilities and bugs in operating systems, applications, and firmware. Unpatched software is one of the most exploited attack vectors — the majority of breaches involve vulnerabilities for which patches were available but not applied. A structured patch management program is essential for maintaining a defensible security posture.\n\nEffective patch management requires knowing what software is installed across the environment. A complete software inventory, mapped to vendor patch release schedules, provides the foundation for a proactive patching program. Critical and high-severity vulnerabilities should be patched within 14 days of release, while moderate vulnerabilities should be addressed within 30 days.\n\nAutomation is key to sustainable patch management. Manual patching does not scale and is error-prone. Tools like Microsoft WSUS, Intune, Automox, or Ivanti can automate the deployment of patches across endpoints and servers, with the ability to stage rollouts, schedule maintenance windows, and report on compliance rates. Cloud-based patch management tools are particularly valuable for organizations with remote workforces.\n\nNot all patches can be deployed immediately. Some updates require testing to ensure compatibility with business-critical applications. A risk-based approach prioritizes patches based on the severity of the vulnerability, the exposure of the affected system, and the availability of active exploits. Patches for actively exploited vulnerabilities (as tracked by CISA's Known Exploited Vulnerabilities catalog) should be treated as emergencies and deployed as quickly as possible.",

    insuranceRelevance:
      "Patch management is a standard topic on cyber insurance applications. Insurers ask about patching cadence, the timeframe for deploying critical patches, and whether the organization uses automated patch management tools. Unpatched systems are involved in a significant percentage of ransomware and data breach claims, making this a critical underwriting factor.\n\nOrganizations that can demonstrate a documented patch management policy with defined timelines, automated deployment, and compliance reporting are viewed as lower-risk. Insurers may also ask specifically about end-of-life software — systems that no longer receive security patches — and whether such systems are isolated or replaced.",

    industryNotes: {
      healthcare:
        "HIPAA requires organizations to protect against reasonably anticipated threats, which includes applying security patches. Healthcare environments often include legacy systems and medical devices with delayed patch cycles. Organizations should implement compensating controls for devices that cannot be patched immediately.",
      legal:
        "Law firms rely on a diverse set of applications including case management, document management, and billing systems. Each must be included in the patch management program. The ABA's duty of technology competence extends to keeping systems current with security updates.",
      financial:
        "PCI-DSS Requirement 6.3.3 mandates that critical patches be applied within one month of release. FFIEC guidance requires financial institutions to maintain a formal patch management program. Bank examiners specifically assess patching practices and compliance rates during examinations.",
      retail:
        "PCI-DSS Requirement 6.3.3 requires installation of critical security patches within one month of release for systems in the cardholder data environment. Retail organizations with distributed POS systems must ensure patches are deployed across all locations, including franchise and seasonal sites.",
      government:
        "NIST 800-171 control SI.L2-3.14.1 requires flaw remediation, including patching. CISA's Binding Operational Directive 22-01 requires federal agencies and contractors to remediate known exploited vulnerabilities within specific timeframes. CMMC assessors verify that patching procedures are documented and followed.",
    },

    implementationSteps: [
      "Maintain a complete inventory of all software and operating systems deployed in the environment",
      "Deploy automated patch management tools to streamline distribution across endpoints and servers",
      "Establish patching timelines: 14 days for critical vulnerabilities, 30 days for moderate, 90 days for low",
      "Monitor CISA's Known Exploited Vulnerabilities catalog and treat listed vulnerabilities as emergencies",
      "Generate monthly patch compliance reports and remediate non-compliant systems promptly",
      "Identify and develop a plan to replace or isolate end-of-life software that no longer receives patches",
    ],
  },

  // ─────────────────────────────────────────────
  // 13. Device Encryption
  // ─────────────────────────────────────────────
  {
    slug: "device-encryption",
    name: "Full Disk Encryption",
    nistFunction: "Protect",
    nistCategory: "PR.DS-1",
    cisControl: 3,
    cisControlName: "Data Protection",

    explanation:
      "Full disk encryption (FDE) protects all data on a device's storage drive by encrypting it automatically and transparently. When FDE is enabled, the entire contents of the drive — operating system, applications, and data files — are encrypted. Without the correct authentication (password, PIN, or biometric), the drive's contents are inaccessible, even if the physical drive is removed from the device.\n\nFDE is critical for mobile devices that leave the office. Laptops are lost or stolen regularly, and without encryption, all data on the device is immediately accessible to whoever possesses it. With FDE enabled, a lost or stolen laptop is a hardware loss rather than a data breach. This distinction has significant implications for breach notification obligations and regulatory compliance.\n\nModern operating systems include built-in FDE capabilities: BitLocker for Windows and FileVault for macOS. Both can be managed centrally through endpoint management tools, ensuring that encryption is enabled on all devices and that recovery keys are securely stored. Organizations should use their MDM or endpoint management platform to enforce encryption policies rather than relying on individual users to enable it.\n\nRecovery key management is an essential component of an FDE program. If an employee forgets their password or a device malfunctions, the recovery key is needed to access the encrypted data. Recovery keys should be stored in a centralized, secure location — such as Active Directory, Entra ID, or the MDM platform — and access to recovery keys should be restricted and audited.",

    insuranceRelevance:
      "Device encryption is specifically asked about on most cyber insurance applications, particularly for organizations with mobile workforces. Insurers recognize that encrypted devices significantly reduce breach risk from lost or stolen hardware. Many breach notification laws include safe harbor provisions for encrypted data, which directly reduces claim costs.\n\nOrganizations that can confirm that all endpoints are encrypted — and provide evidence of centralized enforcement and recovery key management — demonstrate a mature security posture. This is particularly important for organizations whose employees handle sensitive data on laptops in the field.",

    industryNotes: {
      healthcare:
        "The HIPAA Breach Notification Rule provides a safe harbor for encrypted ePHI. If a laptop containing patient data is lost but FDE was enabled with a strong password, the incident may not require individual notification. This makes FDE one of the most financially impactful controls for healthcare organizations.",
      legal:
        "Lawyers frequently carry laptops containing privileged client information. The duty to protect confidential information under ABA Model Rule 1.6 requires reasonable measures, and FDE is considered a baseline expectation. Several state bar opinions specifically recommend encryption for mobile devices used by attorneys.",
      financial:
        "GLBA requires financial institutions to protect customer information, and FDE is a primary control for mobile devices. FFIEC guidance expects institutions to encrypt sensitive data on portable devices. Bank examiners verify encryption status as part of their IT examination procedures.",
      retail:
        "Retail managers and regional staff who access POS management systems, financial reports, and customer data on laptops must have FDE enabled. PCI-DSS Requirement 3.4 supports rendering cardholder data unreadable, and FDE contributes to this objective for devices that may contain stored PAN data.",
      government:
        "NIST 800-171 control SC.L2-3.13.16 requires protection of CUI at rest, which includes encryption of portable devices. FIPS 140-2 validated encryption is required for federal systems. Government contractors must demonstrate that all devices accessing CUI are encrypted with approved algorithms.",
    },

    implementationSteps: [
      "Enable BitLocker on all Windows devices and FileVault on all macOS devices through centralized MDM policies",
      "Verify encryption status across all endpoints using MDM reporting dashboards",
      "Store recovery keys centrally in Active Directory, Entra ID, or the MDM platform with restricted access",
      "Block access to corporate resources from devices that do not have verified encryption enabled",
      "Include encryption verification in the device provisioning checklist for new endpoints",
    ],
  },

  // ─────────────────────────────────────────────
  // 14. BYOD Policy
  // ─────────────────────────────────────────────
  {
    slug: "byod-policy",
    name: "Bring Your Own Device (BYOD) Controls",
    nistFunction: "Protect",
    nistCategory: "PR.AC-3",
    cisControl: 1,
    cisControlName: "Inventory and Control of Enterprise Assets",

    explanation:
      "A Bring Your Own Device (BYOD) policy governs the use of personal devices — smartphones, tablets, and laptops — for work purposes. As remote and hybrid work has become standard, personal devices increasingly access corporate email, file storage, and business applications. Without a BYOD policy, organizations have no visibility into or control over these devices, creating significant security blind spots.\n\nThe core challenge of BYOD is balancing security with employee privacy. The organization needs to protect its data, but employees rightfully expect that their personal devices remain under their own control. Mobile Device Management (MDM) or Mobile Application Management (MAM) solutions address this by creating a managed container on the personal device that separates work data from personal data. The organization can enforce policies within the container — encryption, passcode requirements, remote wipe of work data — without accessing personal content.\n\nA BYOD policy should clearly define which devices are permitted, what security requirements they must meet (OS version, encryption, passcode complexity), what corporate resources they can access, and what happens to work data when the employee leaves the organization. The policy should also address the organization's right to remotely wipe the work container and the circumstances under which this would occur.\n\nOrganizations that do not want to manage personal devices can adopt an alternative approach: providing company-owned devices for all work functions and prohibiting BYOD entirely. While this is simpler from a security perspective, it is more expensive and may not be practical for all organizations. The key is to have a deliberate policy — whether permissive or restrictive — rather than allowing unmanaged personal devices to access corporate resources by default.",

    insuranceRelevance:
      "Cyber insurers ask about BYOD because unmanaged personal devices represent a significant and growing risk vector. A documented BYOD policy with technical enforcement (MDM/MAM) demonstrates that the organization has considered and addressed the risks of personal device usage. Organizations that allow BYOD without any controls may face unfavorable underwriting decisions.\n\nIn breach scenarios involving personal devices, insurers will examine whether the organization had policies and controls in place. If an employee's personal phone was compromised and led to a corporate data breach, the presence of a BYOD policy with MDM enforcement supports the argument that the organization took reasonable precautions.",

    industryNotes: {
      healthcare:
        "Personal devices that access ePHI must comply with HIPAA security requirements. MDM solutions with encrypted containers are essential for healthcare BYOD programs. OCR has investigated breaches involving unmanaged personal devices accessing patient data, making a documented BYOD policy a compliance necessity.",
      legal:
        "Attorneys frequently access client communications and documents from personal devices. Without managed containers, privileged information may be stored unencrypted on personal devices that are shared with family members. Law firms must ensure that BYOD policies protect attorney-client privilege.",
      financial:
        "FFIEC guidance requires financial institutions to assess the risks of mobile devices, including personal devices used for business purposes. GLBA's Safeguards Rule requires controls over all systems accessing customer information. Financial institutions must ensure that BYOD devices meet the same security standards as corporate devices.",
      retail:
        "Retail managers and district staff often use personal phones to access scheduling, inventory, and communication systems. Without BYOD controls, corporate credentials and business data reside on unmanaged devices with no encryption or passcode requirements. Even basic MDM enrollment provides meaningful risk reduction.",
      government:
        "NIST 800-171 control AC.L2-3.1.18 requires control of CUI on mobile devices. Personal devices that access CUI must meet the same security requirements as government-furnished equipment. Many government contractors prohibit BYOD for CUI-related work due to the complexity of compliance.",
    },

    implementationSteps: [
      "Draft a BYOD policy defining permitted devices, security requirements, and acceptable use",
      "Deploy MDM or MAM solutions to create managed work containers on personal devices",
      "Enforce minimum device requirements: current OS version, passcode, and encryption",
      "Configure conditional access policies to block non-compliant devices from corporate resources",
      "Communicate the policy to all employees and obtain signed acknowledgment",
    ],
  },

  // ─────────────────────────────────────────────
  // 15. Remote Wipe
  // ─────────────────────────────────────────────
  {
    slug: "remote-wipe",
    name: "Remote Device Wipe Capability",
    nistFunction: "Protect",
    nistCategory: "PR.PT-2",
    cisControl: 1,
    cisControlName: "Inventory and Control of Enterprise Assets",

    explanation:
      "Remote wipe is the ability to erase data from a device over the network, even when the device is not physically in the organization's possession. This capability is essential for responding to lost or stolen devices, employee departures where devices are not returned, and compromised devices that need immediate remediation. Without remote wipe, a lost device with corporate data is an uncontained breach.\n\nRemote wipe can be implemented at two levels. A full device wipe erases all data and returns the device to factory settings — appropriate for company-owned devices. A selective wipe removes only the managed work profile and corporate data while leaving personal content intact — appropriate for BYOD scenarios. The distinction matters both technically and legally, and the organization's policies should clearly define which type of wipe will be used in each scenario.\n\nMDM platforms like Microsoft Intune, Jamf, VMware Workspace ONE, and others provide remote wipe capabilities as a core feature. These platforms can also enforce other protective measures before a wipe is necessary, such as locking the device, resetting the passcode, or locating the device geographically. Remote wipe should be viewed as the last resort after other containment measures have been attempted.\n\nFor remote wipe to be effective, devices must be enrolled in the MDM platform before they are lost. Enrollment should be part of the device provisioning process for company-owned devices and a requirement of the BYOD policy for personal devices. Organizations should also test the wipe process periodically to confirm it works as expected and to train the IT team on executing it quickly during an incident.",

    insuranceRelevance:
      "Remote wipe capability is a common inquiry on cyber insurance applications, particularly for organizations with mobile workforces or BYOD programs. Insurers view it as a critical incident response tool that can prevent a lost device from becoming a data breach. The ability to demonstrate that corporate data was remotely wiped from a lost device can change the classification of an incident from a breach to a non-event.\n\nOrganizations that can confirm MDM enrollment across all devices with remote wipe capability enabled are demonstrating proactive risk management. This is especially important for industries where employees regularly handle sensitive data on mobile devices.",

    industryNotes: {
      healthcare:
        "Remote wipe is a critical control for healthcare organizations where clinicians access ePHI on mobile devices. The ability to wipe a lost device containing patient data can invoke HIPAA's breach notification safe harbor if the wipe is executed before unauthorized access occurs. Organizations should document the timeline of wipe execution for compliance records.",
      legal:
        "Lost devices containing privileged client information create immediate ethical and legal obligations. Remote wipe provides a mechanism to contain the exposure before confidential communications are accessed. Law firms should maintain remote wipe capability for all devices that access case management systems or client files.",
      financial:
        "Financial institutions must protect customer financial information on all devices. FFIEC guidance expects institutions to have the ability to remotely wipe lost or stolen devices. The ability to quickly wipe a device containing customer account information can significantly reduce the scope of a potential breach.",
      retail:
        "Retail field staff who access corporate systems from tablets and phones create a distributed risk profile. Remote wipe ensures that when devices are lost at customer sites, in transit, or at trade shows, corporate data can be removed before it is accessed by unauthorized parties.",
      government:
        "NIST 800-171 control MP.L2-3.8.9 requires protection of CUI on mobile devices, including the ability to purge or wipe data remotely. Government contractors must demonstrate that devices accessing CUI can be wiped in the event of loss. The wipe must be documented as part of the incident response record.",
    },

    implementationSteps: [
      "Enroll all company-owned and approved BYOD devices in the organization's MDM platform",
      "Configure remote wipe policies defining full wipe for corporate devices and selective wipe for BYOD",
      "Establish a lost device response procedure with clear steps and defined timeframes for initiating a wipe",
      "Test the remote wipe process quarterly to verify functionality and train the IT team on execution",
      "Document all remote wipe actions, including the timestamp, device, and reason, for compliance records",
    ],
  },

  // ─────────────────────────────────────────────
  // 16. Email Filtering
  // ─────────────────────────────────────────────
  {
    slug: "email-filtering",
    name: "Spam & Phishing Filters",
    nistFunction: "Detect",
    nistCategory: "DE.CM-1",
    cisControl: 9,
    cisControlName: "Email and Web Browser Protections",

    explanation:
      "Email filtering is the deployment of automated systems that scan inbound email to identify and block spam, phishing attempts, malware attachments, and business email compromise (BEC) schemes. Email remains the primary attack vector for most organizations, with phishing responsible for the initial foothold in a large percentage of breaches and ransomware incidents.\n\nModern email filtering goes far beyond simple spam detection. Advanced threat protection features analyze URLs in real time (rewriting and scanning them at the time of click), detonate attachments in sandboxes to detect zero-day malware, and use machine learning to identify impersonation attempts where an attacker spoofs a trusted sender's name or writing style. These capabilities are available in platforms like Microsoft Defender for Office 365, Proofpoint, Mimecast, and Google Workspace's advanced security features.\n\nConfiguration matters as much as the choice of platform. Email filters should be tuned to block executable file types (.exe, .scr, .js), password-protected archives (commonly used to bypass scanning), and messages with mismatched display names and sender addresses. Quarantine policies should route suspicious messages for admin review rather than silently dropping them, ensuring that legitimate messages are not lost.\n\nEmail filtering should be complemented by internal email security measures. Outbound filtering can detect data exfiltration attempts and compromised accounts sending spam. Transport rules can flag external emails with a visible banner warning recipients that the message originated outside the organization — a simple but effective defense against impersonation attacks.",

    insuranceRelevance:
      "Email filtering is a baseline expectation on cyber insurance applications. Insurers ask about the specific platform and features deployed because email is the leading entry point for the attacks that generate the most claims — ransomware and business email compromise. Organizations relying on basic, unconfigured email filtering may face higher premiums.\n\nAdvanced email protection features such as URL sandboxing, attachment detonation, and impersonation detection directly reduce the likelihood of successful phishing attacks. Insurers view these features favorably and may offer better terms to organizations that can demonstrate comprehensive email security.",

    industryNotes: {
      healthcare:
        "Healthcare is one of the most targeted industries for phishing, with attackers seeking access to ePHI and EHR systems. Email filtering must catch both mass phishing campaigns and targeted spear-phishing directed at clinical staff and administrators. HIPAA's security awareness training requirements should be complemented by strong technical email controls.",
      legal:
        "Law firms are frequent targets of spear-phishing aimed at intercepting wire transfer instructions, stealing client data, and compromising privileged communications. Email filtering must be particularly aggressive in detecting BEC attempts that impersonate partners, clients, or opposing counsel.",
      financial:
        "Financial institutions face constant phishing attacks targeting credentials for banking systems and wire transfer authorization. FFIEC guidance requires email security controls, and PCI-DSS Requirement 5 extends anti-malware requirements to include email-borne threats. Financial institutions should deploy the most advanced available email filtering.",
      retail:
        "Retail organizations are targeted by phishing campaigns that seek POS credentials, e-commerce admin access, and customer databases. Seasonal spikes in email volume during holiday periods create additional risk. Email filtering must scale to handle increased volume without degrading protection.",
      government:
        "CISA's Binding Operational Directive 18-01 requires federal agencies to implement DMARC, which works in conjunction with email filtering to prevent spoofed messages. Government contractors must protect their email systems to prevent compromise of CUI. CMMC assessors evaluate email security as part of the Security Protection subcategory.",
    },

    implementationSteps: [
      "Deploy advanced email filtering with URL rewriting, attachment sandboxing, and impersonation detection",
      "Block high-risk attachment types (executables, scripts, password-protected archives) at the mail gateway",
      "Enable external email banners to visually flag messages originating from outside the organization",
      "Configure quarantine policies for suspicious messages with admin review and user notification",
      "Monitor email filtering dashboards weekly for trends in blocked threats and false positives",
    ],
  },

  // ─────────────────────────────────────────────
  // 17. Phishing Training
  // ─────────────────────────────────────────────
  {
    slug: "phishing-training",
    name: "Phishing Awareness Training",
    nistFunction: "Protect",
    nistCategory: "PR.AT-1",
    cisControl: 14,
    cisControlName: "Security Awareness and Skills Training",

    explanation:
      "Phishing awareness training educates employees to recognize and respond appropriately to phishing emails, social engineering attempts, and other deceptive tactics used by attackers. No email filter catches 100% of malicious messages, so trained employees serve as the last line of defense when a phishing email reaches their inbox.\n\nEffective phishing training goes beyond annual slide decks. The most impactful programs combine formal training content with regular simulated phishing exercises. Simulations send realistic but harmless phishing emails to employees, measuring who clicks the link, who reports the email, and who ignores it. Results drive targeted follow-up training for employees who are susceptible, creating a continuous improvement cycle.\n\nTraining content should cover the most common phishing indicators: urgency or threat language, mismatched sender addresses, suspicious URLs, unexpected attachments, and requests for credentials or financial transactions. It should also address business email compromise (BEC) scenarios where the attacker impersonates an executive or vendor to request wire transfers or sensitive data.\n\nOrganizations should track phishing simulation metrics over time — click rates, report rates, and susceptibility by department. Initial click rates of 20-30% are common and should decrease to under 5% with consistent training and simulation. These metrics demonstrate program effectiveness to leadership, auditors, and insurance underwriters.",

    insuranceRelevance:
      "Phishing training is a standard requirement on cyber insurance applications. Insurers ask whether the organization conducts regular security awareness training and simulated phishing exercises. Because phishing is the entry point for the majority of ransomware and BEC claims, carriers view trained employees as a meaningful risk reduction factor.\n\nOrganizations that can provide phishing simulation metrics — showing declining click rates over time — demonstrate a measurably effective program. Some insurers offer premium credits for organizations with documented, ongoing phishing awareness programs that include regular simulations.",

    industryNotes: {
      healthcare:
        "HIPAA requires security awareness training under 45 CFR 164.308(a)(5)(i), which should include phishing recognition. Healthcare workers are frequently targeted with phishing emails disguised as patient notifications, insurance correspondence, and EHR system alerts. Training should include healthcare-specific phishing examples.",
      legal:
        "Lawyers and legal staff are targets for sophisticated spear-phishing that exploits publicly available case information. Phishing training for law firms should include scenarios involving fake court notices, opposing counsel impersonation, and fraudulent wire instructions for real estate closings or settlement disbursements.",
      financial:
        "FFIEC guidance requires financial institutions to include phishing awareness in their security training programs. Financial staff who handle wire transfers are prime targets for BEC. Training should specifically address the verification procedures required before executing financial transactions requested by email.",
      retail:
        "Retail employees, particularly store managers with access to POS and corporate systems, need training on phishing attempts that mimic vendor communications, shipping notifications, and corporate directives. High turnover in retail makes frequent, brief training modules more effective than annual comprehensive courses.",
      government:
        "NIST 800-171 control AT.L2-3.2.1 requires literacy training that includes recognition of social engineering. CISA recommends regular phishing simulations for all federal agencies and contractors. CMMC assessors may request evidence of phishing training completion rates and simulation results.",
    },

    implementationSteps: [
      "Deploy a phishing simulation platform (KnowBe4, Proofpoint, or similar) and run a baseline test",
      "Enroll all employees in foundational phishing awareness training covering common attack patterns",
      "Conduct monthly phishing simulations with varying difficulty and topic (credential harvesting, BEC, malware)",
      "Provide immediate educational feedback to employees who click simulated phishing links",
      "Track and report click rates and report rates monthly, targeting a click rate below 5%",
    ],
  },

  // ─────────────────────────────────────────────
  // 18. Email Authentication
  // ─────────────────────────────────────────────
  {
    slug: "email-authentication",
    name: "Email Authentication (DMARC, DKIM, SPF)",
    nistFunction: "Protect",
    nistCategory: "PR.DS-5",
    cisControl: 9,
    cisControlName: "Email and Web Browser Protections",

    explanation:
      "Email authentication protocols — SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), and DMARC (Domain-based Message Authentication, Reporting and Conformance) — work together to verify that emails claiming to come from your domain are actually sent by authorized servers. These protocols are the primary defense against domain spoofing, where attackers send fraudulent emails that appear to come from your organization.\n\nSPF specifies which mail servers are authorized to send email on behalf of your domain by publishing a DNS TXT record. DKIM adds a cryptographic signature to outgoing emails, allowing receiving servers to verify that the message was not altered in transit. DMARC ties SPF and DKIM together with a policy that tells receiving servers what to do when authentication fails — monitor (p=none), quarantine, or reject the message.\n\nImplementing DMARC at enforcement level (p=quarantine or p=reject) prevents attackers from sending convincing spoofed emails using your domain to customers, partners, and employees. This protects your brand reputation and reduces the risk of business email compromise attacks that impersonate your executives or employees. Without DMARC enforcement, anyone can send email that appears to come from your domain.\n\nDMARC implementation should be phased. Start with p=none to collect reports on who is sending email using your domain. Analyze the reports to identify legitimate senders (marketing platforms, CRMs, ticketing systems) and add them to your SPF record. Once all legitimate sources are accounted for, move to p=quarantine and eventually p=reject. This phased approach prevents accidentally blocking legitimate email.",

    insuranceRelevance:
      "Email authentication is increasingly asked about on cyber insurance applications, reflecting its importance in preventing business email compromise — one of the costliest attack types for insurers. Organizations with DMARC at enforcement level demonstrate proactive protection against domain spoofing, a key factor in BEC attacks.\n\nInsuers recognize that DMARC protects not only the organization but also its customers and partners from fraudulent emails sent in the organization's name. This broader protection reduces the risk of third-party claims and reputational damage, both of which factor into underwriting decisions.",

    industryNotes: {
      healthcare:
        "Healthcare organizations frequently communicate with patients via email, making domain spoofing a significant risk. Fraudulent emails appearing to come from a healthcare provider can be used for phishing, insurance fraud, and social engineering. DMARC enforcement protects patients and preserves trust in provider communications.",
      legal:
        "Law firms are prime targets for domain spoofing because clients trust communications from their attorneys. Fraudulent emails impersonating a firm can redirect settlement payments, steal case information, or compromise client relationships. DMARC at enforcement level is a baseline expectation for protecting the firm's domain.",
      financial:
        "Financial institutions face constant attempts to spoof their domains for phishing attacks targeting customers. FFIEC guidance supports email authentication as a security control. PCI-DSS compliance benefits from DMARC as part of the broader email security posture. Many banking regulators now explicitly recommend DMARC enforcement.",
      retail:
        "Retail brands are frequently spoofed in phishing campaigns targeting consumers with fake promotions, order confirmations, and shipping notifications. DMARC enforcement protects customers from these attacks and preserves brand reputation. Large retailers should also monitor DMARC reports for unauthorized use of their domain.",
      government:
        "CISA's Binding Operational Directive 18-01 requires all federal domains to implement DMARC at p=reject. Government contractors are strongly encouraged to follow the same standard. CMMC assessors evaluate email authentication as part of communication protection controls.",
    },

    implementationSteps: [
      "Publish an SPF record listing all authorized mail servers for your domain",
      "Configure DKIM signing for all outbound email from your mail platform",
      "Publish a DMARC record at p=none and begin collecting authentication reports",
      "Analyze DMARC reports to identify all legitimate email sources and update SPF/DKIM accordingly",
      "Escalate DMARC policy to p=quarantine, then p=reject once all legitimate sources are authenticated",
      "Monitor DMARC reports ongoing to detect new unauthorized senders and maintain compliance",
    ],
  },

  // ─────────────────────────────────────────────
  // 19. Email Reporting
  // ─────────────────────────────────────────────
  {
    slug: "email-reporting",
    name: "Suspicious Email Reporting",
    nistFunction: "Respond",
    nistCategory: "RS.CO-2",
    cisControl: 17,
    cisControlName: "Incident Management",

    explanation:
      "A suspicious email reporting mechanism provides employees with a simple, standardized way to flag potentially malicious emails for review by the security team. When employees can easily report suspicious messages — typically through a one-click button in their email client — the organization gains a human sensor network that complements automated email filtering.\n\nReporting is the desired behavior when an employee receives a suspicious email. Without a clear reporting mechanism, employees may ignore the email, delete it, or attempt to evaluate it themselves — sometimes by clicking links or opening attachments. A dedicated report button in Outlook, Gmail, or other email clients removes friction and encourages the right response.\n\nWhen a suspicious email is reported, the security team (or managed security provider) should triage it promptly. If the email is confirmed as malicious, the team can search for and remove the same email from all other inboxes before additional employees interact with it. This 'pull and purge' response significantly reduces the blast radius of phishing campaigns that reach multiple employees simultaneously.\n\nReporting metrics — how many employees report suspicious emails and how quickly — are a strong indicator of security culture maturity. Organizations should track report rates alongside phishing simulation results and recognize employees who consistently report suspicious messages. Positive reinforcement builds a culture where reporting is seen as a valuable contribution rather than an inconvenience.",

    insuranceRelevance:
      "Insurers value incident reporting mechanisms because they enable rapid response to phishing attacks, reducing the likelihood that a single phishing email escalates into a full breach. Applications may ask whether the organization has a process for employees to report suspicious emails and how quickly the security team responds.\n\nOrganizations that can demonstrate an active email reporting program — with metrics showing employee participation and response timelines — signal to underwriters that they have both the technical controls and the cultural practices needed to detect and contain email-based threats.",

    industryNotes: {
      healthcare:
        "Healthcare environments with large, distributed workforces benefit particularly from email reporting mechanisms. Clinical staff who are too busy for extensive security analysis can report suspicious emails with one click. Rapid triage prevents phishing campaigns from spreading across hospital systems and departments.",
      legal:
        "Law firm staff who receive suspicious emails impersonating clients, courts, or opposing counsel need a frictionless way to report them. Quick triage by the security team can prevent BEC attacks that attempt to redirect settlement funds or obtain confidential case information.",
      financial:
        "Financial institutions must maintain vigilance against phishing targeting wire transfer processes and customer account access. An active email reporting culture helps detect targeted attacks that bypass automated filters. FFIEC guidance supports employee reporting as part of the incident detection framework.",
      retail:
        "Retail employees at distributed locations may have less security awareness than headquarters staff. A simple reporting mechanism works across all technical skill levels. Reports from store locations can reveal targeted phishing campaigns aimed at specific regions or roles.",
      government:
        "NIST 800-171 control IR.L2-3.6.1 requires the ability to detect and report incidents, which includes phishing attempts. Government contractors should implement email reporting as part of their incident response framework. CMMC assessors evaluate whether the organization has mechanisms for personnel to report security events.",
    },

    implementationSteps: [
      "Deploy a report phishing button in the organization's email client (Outlook add-in, Gmail integration)",
      "Establish a triage workflow so reported emails are reviewed by the security team within one hour",
      "Configure automated search and purge capabilities to remove confirmed malicious emails from all inboxes",
      "Acknowledge reporters with a brief response so employees know their reports are valued and acted upon",
      "Track reporting rates and include them in the organization's security awareness metrics dashboard",
    ],
  },

  // ─────────────────────────────────────────────
  // 20. Network Segmentation
  // ─────────────────────────────────────────────
  {
    slug: "network-segmentation",
    name: "Network Segmentation & Guest WiFi",
    nistFunction: "Protect",
    nistCategory: "PR.AC-5",
    cisControl: 12,
    cisControlName: "Network Infrastructure Management",

    explanation:
      "Network segmentation divides a computer network into smaller, isolated segments to limit the spread of attacks and restrict access to sensitive resources. In a flat, unsegmented network, an attacker who compromises a single device can potentially reach every other device and system. Segmentation creates internal boundaries that contain breaches and enforce access controls between different parts of the network.\n\nThe most common segmentation boundaries include separating guest WiFi from the corporate network, isolating IoT devices on their own network segment, placing servers in a dedicated subnet, and creating separate segments for different sensitivity levels (e.g., payment processing systems isolated from general office traffic). VLANs (Virtual Local Area Networks) are the standard technical mechanism for segmentation, with firewall rules controlling traffic between segments.\n\nGuest WiFi deserves specific attention because it is a common and often poorly configured entry point. Guest networks should be completely isolated from the corporate network — visitors should be able to access the internet but not internal resources. The guest network should have its own SSID, its own VLAN, and firewall rules that block all traffic to internal network segments.\n\nFor small and mid-sized businesses, even basic segmentation provides significant security improvement. Separating guest WiFi, server infrastructure, and general office endpoints into three segments with appropriate firewall rules between them is far better than a flat network. More mature organizations may implement micro-segmentation, where individual workloads or applications are isolated with granular access controls.",

    insuranceRelevance:
      "Network segmentation is a key underwriting factor for cyber insurance because it directly limits the blast radius of ransomware and lateral movement attacks. Insurers ask whether the network is segmented and how critical systems are isolated. Organizations with flat networks present a higher risk profile because a single compromised endpoint can lead to enterprise-wide ransomware encryption.\n\nDemonstrating network segmentation — particularly isolation of sensitive systems like payment processing, financial databases, and backup infrastructure — signals to underwriters that the organization has taken steps to contain potential incidents. This can result in lower premiums and more favorable coverage terms.",

    industryNotes: {
      healthcare:
        "Healthcare networks must segment medical devices, clinical systems, and administrative networks. Medical IoT devices often run outdated operating systems that cannot be patched, making segmentation the primary control for containing compromise. HIPAA's Technical Safeguard requirements support network segmentation as part of access control.",
      legal:
        "Law firms should segment networks to isolate case management systems and document management servers from general office traffic. Ethical wall requirements for conflicts of interest can be supported by network-level segmentation in addition to application-level access controls.",
      financial:
        "PCI-DSS strongly encourages network segmentation to reduce the scope of the cardholder data environment. A well-segmented network where payment processing occurs in an isolated segment dramatically reduces the number of systems subject to PCI-DSS requirements and audit. FFIEC guidance expects financial institutions to segment their networks.",
      retail:
        "Retail locations should segment POS networks from back-office and customer WiFi networks. PCI-DSS compliance is significantly simplified when cardholder data flows are isolated in a dedicated network segment. Multi-location retailers should ensure consistent segmentation across all sites.",
      government:
        "NIST 800-171 control SC.L2-3.13.1 requires monitoring and control of communications at external and key internal boundaries. Network segmentation is a primary mechanism for implementing this control. CMMC assessors verify that CUI environments are appropriately segmented from general-purpose networks.",
    },

    implementationSteps: [
      "Assess the current network architecture and identify critical systems that require isolation",
      "Implement VLANs to separate guest WiFi, server infrastructure, and general office endpoints at minimum",
      "Configure firewall rules between segments, allowing only the traffic necessary for business operations",
      "Isolate IoT devices and any legacy systems that cannot be patched onto dedicated network segments",
      "Document the network architecture, segmentation boundaries, and inter-segment traffic rules",
      "Test segmentation effectiveness by verifying that devices on one segment cannot reach resources on restricted segments",
    ],
  },

  // ─────────────────────────────────────────────
  // 21. Firewall Management
  // ─────────────────────────────────────────────
  {
    slug: "firewall-management",
    name: "Firewall Configuration & Management",
    nistFunction: "Protect",
    nistCategory: "PR.PT-4",
    cisControl: 13,
    cisControlName: "Network Monitoring and Defense",

    explanation:
      "Firewall management encompasses the configuration, maintenance, and monitoring of firewalls that control traffic between the organization's network and the internet, as well as between internal network segments. Firewalls are the most fundamental network security control, enforcing rules that permit or deny traffic based on source, destination, port, and protocol.\n\nA well-configured firewall follows the principle of default deny — all traffic is blocked unless explicitly permitted by a rule. Rules should be specific, permitting only the minimum traffic necessary for business operations. Over time, firewall rule sets tend to accumulate permissive rules that are no longer needed, a condition known as rule bloat. Regular rule reviews are essential to maintain the firewall's effectiveness.\n\nModern next-generation firewalls (NGFWs) provide capabilities beyond basic packet filtering. Application-layer inspection identifies traffic by the application generating it rather than just the port number. Intrusion prevention (IPS) signatures detect and block known attack patterns. SSL/TLS inspection decrypts and inspects encrypted traffic to detect threats that would otherwise be invisible. These features should be enabled and tuned appropriately.\n\nFirewall management also includes maintaining firmware updates, monitoring logs for suspicious activity, and ensuring that administrative access to the firewall is restricted and secured with MFA. The firewall is a critical security device — if it is compromised or misconfigured, the entire network's security posture is undermined. Changes to firewall rules should follow a formal change management process with documentation and approval.",

    insuranceRelevance:
      "Firewalls are a foundational security control expected by every cyber insurer. Applications ask about the type of firewall deployed, whether it is a next-generation firewall, and how it is managed. Insurers view unmanaged or default-configured firewalls as a significant risk indicator.\n\nOrganizations with managed firewall services — where a security provider handles configuration, monitoring, and updates — are viewed favorably by underwriters. Demonstrating a formal rule review process, change management procedures, and current firmware reduces the risk of misconfigurations that lead to breaches.",

    industryNotes: {
      healthcare:
        "Healthcare networks must protect ePHI with properly configured firewalls as part of HIPAA's technical safeguards. Firewalls should restrict access to EHR systems and medical device networks. OCR has cited firewall misconfigurations as contributing factors in breach investigations involving unauthorized access to patient data.",
      legal:
        "Law firms must protect their network perimeters to prevent unauthorized access to privileged client information. Firewall rules should restrict inbound access to only necessary services and monitor outbound traffic for data exfiltration indicators. Managed firewall services help firms without dedicated IT security staff.",
      financial:
        "PCI-DSS Requirement 1 mandates installation and maintenance of firewalls to protect cardholder data. Firewall rules must be reviewed at least every six months. FFIEC guidance requires financial institutions to implement firewalls with intrusion detection and prevention capabilities.",
      retail:
        "PCI-DSS Requirement 1 is the most prescriptive firewall requirement in any compliance framework, detailing specific configuration requirements for protecting the cardholder data environment. Multi-location retailers must ensure consistent firewall management across all sites, including small stores with limited IT support.",
      government:
        "NIST 800-171 control SC.L2-3.13.1 requires boundary protection, and SC.L2-3.13.6 requires denial of communications by default. Government contractors must implement firewalls that restrict traffic to only that which is necessary for CUI-related business functions. CMMC assessors examine firewall configurations and rule sets.",
    },

    implementationSteps: [
      "Deploy a next-generation firewall with application-layer inspection and intrusion prevention capabilities",
      "Configure the firewall with a default-deny policy, explicitly permitting only required traffic",
      "Enable SSL/TLS inspection for outbound traffic to detect threats in encrypted communications",
      "Establish a formal change management process for all firewall rule modifications",
      "Review firewall rules quarterly, removing rules that are no longer necessary",
      "Restrict administrative access to the firewall to designated personnel using MFA and dedicated management networks",
    ],
  },

  // ─────────────────────────────────────────────
  // 22. VPN & Remote Access
  // ─────────────────────────────────────────────
  {
    slug: "vpn-remote-access",
    name: "VPN for Remote Workers",
    nistFunction: "Protect",
    nistCategory: "PR.AC-3",
    cisControl: 12,
    cisControlName: "Network Infrastructure Management",

    explanation:
      "A Virtual Private Network (VPN) creates an encrypted tunnel between a remote device and the organization's network, ensuring that data transmitted over public or untrusted networks is protected from interception. For organizations with remote or hybrid workforces, VPN (or equivalent secure remote access technology) is essential for maintaining confidentiality when employees access corporate resources from home, hotels, airports, or other locations.\n\nTraditional VPNs route all traffic through the corporate network, while split-tunnel VPNs route only corporate-destined traffic through the tunnel, allowing personal browsing to go directly to the internet. Full-tunnel VPNs provide better security oversight but can create bandwidth bottlenecks. Split-tunnel configurations are more performant but require that the endpoint has adequate security controls (EDR, DNS filtering) to protect the direct internet connection.\n\nZero Trust Network Access (ZTNA) is emerging as the next evolution of remote access, providing application-level access rather than full network access. ZTNA solutions verify the user's identity, device posture, and context before granting access to specific applications, reducing the risk of lateral movement that exists with traditional VPNs. For organizations evaluating new remote access solutions, ZTNA is worth considering.\n\nRegardless of the technology chosen, remote access must be secured with MFA, restricted to managed or compliant devices, and monitored for suspicious activity. VPN accounts should be included in the offboarding process to ensure that former employees cannot connect remotely. Logging all remote access sessions provides the visibility needed for both security monitoring and compliance.",

    insuranceRelevance:
      "Secure remote access is a critical focus area for cyber insurers, especially since the shift to remote work dramatically expanded attack surfaces. Applications ask whether the organization uses a VPN or equivalent for remote access and whether MFA is required for remote connections. Unsecured remote access is frequently cited as the entry point in ransomware claims.\n\nOrganizations that can demonstrate VPN with MFA, device compliance checks, and logging of remote access sessions are viewed as lower-risk. Insurers increasingly ask about the specific remote access technology, including whether the organization uses always-on VPN or ZTNA.",

    industryNotes: {
      healthcare:
        "Healthcare workers who access EHR systems and patient data remotely must do so over encrypted connections. HIPAA's transmission security requirements under 45 CFR 164.312(e)(1) support VPN usage for remote access to ePHI. Telehealth expansion has increased the number of remote access points that must be secured.",
      legal:
        "Attorneys frequently work remotely and need secure access to case files, email, and client communications. The ABA Formal Opinion 477R emphasizes the need for encryption when transmitting client information. VPN with MFA is the baseline expectation for remote access to firm resources.",
      financial:
        "Financial institutions must secure all remote access to customer information systems. FFIEC guidance requires encrypted connections and strong authentication for remote access. PCI-DSS Requirement 8.3 mandates MFA for all remote network access to the cardholder data environment.",
      retail:
        "Retail corporate staff who remotely manage POS systems, inventory databases, and e-commerce platforms must use secure connections. PCI-DSS requires encrypted remote access to the cardholder data environment with MFA. Multi-location retailers should ensure that all remote management tools are routed through secure channels.",
      government:
        "NIST 800-171 controls AC.L2-3.1.12 and SC.L2-3.13.8 require encrypted remote access sessions. CMMC assessors verify that remote access is authenticated, encrypted, and monitored. Government contractors must ensure that remote access to CUI-containing systems meets FIPS 140-2 encryption standards.",
    },

    implementationSteps: [
      "Deploy a VPN or ZTNA solution that provides encrypted remote access to corporate resources",
      "Require MFA for all remote access connections without exception",
      "Implement device compliance checks to ensure only managed, up-to-date devices can connect",
      "Enable logging of all remote access sessions, including connection times, source IPs, and accessed resources",
      "Include VPN accounts in the employee offboarding checklist for immediate deprovisioning",
    ],
  },

  // ─────────────────────────────────────────────
  // 23. Network Monitoring
  // ─────────────────────────────────────────────
  {
    slug: "network-monitoring",
    name: "Network Access Review & Monitoring",
    nistFunction: "Detect",
    nistCategory: "DE.CM-1",
    cisControl: 13,
    cisControlName: "Network Monitoring and Defense",

    explanation:
      "Network monitoring is the continuous observation and analysis of network traffic to detect suspicious activity, unauthorized access, and performance anomalies. Without monitoring, breaches can persist undetected for weeks or months — the median dwell time for breaches discovered by internal teams rather than external parties remains measured in weeks. Effective monitoring reduces this dwell time dramatically.\n\nNetwork monitoring tools range from basic flow analysis (NetFlow, sFlow) that tracks traffic patterns and volumes, to full packet capture that records all network data, to Security Information and Event Management (SIEM) platforms that correlate events from multiple sources. For small and mid-sized businesses, a managed SIEM or managed detection and response (MDR) service provides the most practical path to effective monitoring without requiring an in-house security operations center.\n\nKey indicators to monitor include unusual outbound data transfers (potential exfiltration), connections to known malicious IP addresses, lateral movement between internal systems, failed authentication attempts, and new devices connecting to the network. Alerting thresholds should be tuned to minimize false positives while ensuring that genuine threats are escalated promptly.\n\nNetwork access review complements monitoring by periodically verifying which devices and users are connected to the network. Network access control (NAC) solutions can enforce policies requiring devices to meet security standards (current patches, active endpoint protection, encryption enabled) before allowing network access. Unknown or non-compliant devices should be quarantined or placed on a restricted network segment.",

    insuranceRelevance:
      "Monitoring and detection capabilities are increasingly important to cyber insurers because they directly affect how quickly a breach is contained and how large the resulting claim becomes. Applications ask whether the organization monitors its network for suspicious activity and whether it has a managed detection and response service.\n\nOrganizations with 24/7 monitoring and defined escalation procedures receive more favorable underwriting because they can detect and contain incidents faster. The difference between detecting a breach in hours versus months often translates to orders of magnitude difference in claim costs.",

    industryNotes: {
      healthcare:
        "HIPAA requires audit controls under 45 CFR 164.312(b) and monitoring of information system activity under 45 CFR 164.308(a)(1)(ii)(D). Healthcare organizations must monitor access to systems containing ePHI and be able to detect unauthorized access or data exfiltration. Network monitoring complements application-level audit logs.",
      legal:
        "Law firms must monitor for unauthorized access to systems containing privileged client information. Network monitoring can detect data exfiltration attempts and unauthorized access to case management systems. Firms handling high-profile or sensitive matters should consider enhanced monitoring for those specific data repositories.",
      financial:
        "FFIEC requires financial institutions to implement robust monitoring and detection capabilities. PCI-DSS Requirements 10 and 11 mandate logging, monitoring, and regular testing of security systems. Financial institutions are expected to have or contract for continuous security monitoring.",
      retail:
        "PCI-DSS Requirement 10 requires tracking and monitoring all access to network resources and cardholder data. Requirement 11 requires regular testing of security systems and processes. Retail organizations must ensure monitoring covers all locations, including distributed stores and warehouses.",
      government:
        "NIST 800-171 controls AU.L2-3.3.1 and SI.L2-3.14.6 require audit logging and monitoring for security-relevant events. CMMC assessors verify that monitoring capabilities exist and are actively used. Government contractors must demonstrate the ability to detect and report security incidents affecting CUI.",
    },

    implementationSteps: [
      "Deploy a SIEM or subscribe to a managed detection and response (MDR) service for 24/7 monitoring",
      "Configure log collection from firewalls, servers, endpoints, and cloud services into the central monitoring platform",
      "Define alerting rules for high-risk indicators: data exfiltration, lateral movement, and connections to known malicious IPs",
      "Establish escalation procedures defining who is notified and what actions are taken when alerts are triggered",
      "Conduct quarterly reviews of monitoring coverage to ensure new systems and services are included",
    ],
  },

  // ─────────────────────────────────────────────
  // 24. Incident Response Plan
  // ─────────────────────────────────────────────
  {
    slug: "incident-response-plan",
    name: "Incident Response Plan Documentation & Testing",
    nistFunction: "Respond",
    nistCategory: "RS.RP-1",
    cisControl: 17,
    cisControlName: "Incident Management",

    explanation:
      "An incident response plan (IRP) is a documented set of procedures that guides the organization's response to cybersecurity incidents such as data breaches, ransomware attacks, business email compromise, and system intrusions. Without a plan, organizations respond reactively and inconsistently, leading to delayed containment, greater damage, regulatory missteps, and larger financial losses.\n\nA comprehensive IRP should define incident classification levels (severity tiers), roles and responsibilities (who does what), communication protocols (internal and external), containment and eradication procedures, evidence preservation steps, and recovery procedures. It should also include contact information for key parties: internal leadership, IT team, legal counsel, cyber insurance carrier, breach response vendors, and law enforcement.\n\nTesting the plan through tabletop exercises is as important as writing it. A tabletop exercise walks the response team through a realistic scenario — such as a ransomware attack or a compromised vendor — to identify gaps, confusion, and bottlenecks in the plan. These exercises should be conducted at least annually and should involve leadership, IT, legal, and communications, not just the technical team.\n\nThe incident response plan should be treated as a living document that is updated based on lessons learned from exercises, actual incidents, and changes to the organization's environment. Storing the plan only on the corporate network defeats its purpose if a ransomware attack renders that network inaccessible — offline copies should be maintained and accessible during an emergency.",

    insuranceRelevance:
      "An incident response plan is one of the most commonly required controls on cyber insurance applications. Insurers know that organizations with tested IRPs contain incidents faster and file smaller claims. Some carriers require an IRP as a condition of coverage, while others offer premium reductions for organizations with documented, tested plans.\n\nInsurers also want to know that the plan includes their contact information and outlines the process for reporting incidents to the carrier promptly. Late notification to the insurer can jeopardize coverage. The IRP should specify at what point the insurance carrier is contacted and who is responsible for that notification.",

    industryNotes: {
      healthcare:
        "HIPAA requires a security incident response plan under 45 CFR 164.308(a)(6). The plan must address detection, response, mitigation, and documentation of security incidents involving ePHI. Healthcare organizations must also account for HHS breach notification requirements (60-day notification window) and state-specific requirements.",
      legal:
        "Law firms face unique incident response challenges related to preserving attorney-client privilege during an investigation. The IRP should designate outside counsel to direct the breach response under privilege. Ethical obligations require prompt notification to affected clients, which must be coordinated with the legal assessment of the incident.",
      financial:
        "FFIEC requires financial institutions to maintain and regularly test incident response plans. Bank examiners specifically assess whether the IRP has been tested through tabletop exercises. Financial institutions must also account for regulatory notification requirements (OCC, FDIC, Federal Reserve) that have specific timeframes.",
      retail:
        "Retail incident response plans must account for PCI-DSS breach notification requirements to card brands and acquirers, as well as state consumer notification laws. The plan should include procedures for isolating compromised POS systems while maintaining business operations during peak periods.",
      government:
        "NIST 800-171 control IR.L2-3.6.1 requires an incident response capability that includes preparation, detection, analysis, containment, recovery, and user response. CMMC assessors verify that the IRP exists, is tested, and includes all required elements. Federal contractors must also comply with DFARS 252.204-7012 72-hour reporting requirements.",
    },

    implementationSteps: [
      "Draft an incident response plan covering classification, roles, communication, containment, eradication, and recovery",
      "Include contact information for leadership, legal counsel, insurance carrier, breach coach, forensics vendor, and law enforcement",
      "Conduct an annual tabletop exercise with representatives from IT, leadership, legal, and communications",
      "Maintain offline copies of the IRP (printed and on USB) accessible during network outages",
      "Update the plan based on lessons learned from exercises, actual incidents, and organizational changes",
    ],
  },

  // ─────────────────────────────────────────────
  // 25. Emergency Contacts
  // ─────────────────────────────────────────────
  {
    slug: "emergency-contacts",
    name: "Cyber Emergency Contact List",
    nistFunction: "Respond",
    nistCategory: "RS.CO-1",
    cisControl: 17,
    cisControlName: "Incident Management",

    explanation:
      "A cyber emergency contact list is a pre-assembled directory of internal and external parties who need to be contacted during a cybersecurity incident. During the chaos of an active breach, searching for phone numbers, email addresses, and account information wastes critical time. Having this information compiled, current, and accessible before an incident occurs enables a faster, more coordinated response.\n\nThe contact list should include internal contacts (CEO, CFO, CISO or IT lead, legal counsel, HR, communications), external contacts (cyber insurance carrier and policy number, breach response attorney, forensics firm, managed security provider), and regulatory contacts (relevant regulators, law enforcement, breach notification entities). Each entry should include the individual's name, role, phone number, email, and the circumstances under which they should be contacted.\n\nThe contact list must be accessible during the incident — which means it cannot live solely on systems that may be compromised. Printed copies should be distributed to key personnel, digital copies should be stored on personal devices or in a secure cloud location separate from the corporate environment, and the list should be included with offline copies of the incident response plan.\n\nThe contact list should be reviewed and updated quarterly. Personnel changes, vendor changes, and insurance renewals can all render contact information stale. Assigning a specific individual to maintain the list ensures that updates happen on schedule. After any actual incident, the contact list should be reviewed for accuracy based on the experience of attempting to reach the listed parties.",

    insuranceRelevance:
      "Insurance carriers want to be notified promptly when incidents occur, and the emergency contact list is where that notification process begins. Applications may not ask about the contact list specifically, but carriers expect that their claims line and policy number are accessible to the response team during an incident.\n\nDelayed notification to the insurer can complicate claims and, in some cases, jeopardize coverage under policy terms. Including the insurance carrier's contact information — including after-hours claims numbers — in the emergency contact list ensures that notification happens early in the response process.",

    industryNotes: {
      healthcare:
        "Healthcare emergency contacts should include the HHS OCR breach reporting portal information, state health department notification contacts, and any Health Information Sharing and Analysis Center (H-ISAC) resources. Clinical leadership should also be included for incidents that may affect patient care systems.",
      legal:
        "Law firm emergency contact lists should include the firm's designated breach response counsel (typically a different firm to maintain privilege), malpractice insurer, and the state bar ethics hotline. The list should also include contacts for clients who may need to be notified if their data is affected.",
      financial:
        "Financial institution emergency contacts must include relevant regulators (OCC, FDIC, Federal Reserve, state regulators), card brand notification contacts for PCI incidents, and the institution's BSA/AML officer if the incident may involve financial crime. FinCEN SAR filing information should also be accessible.",
      retail:
        "Retail emergency contacts should include card brand notification numbers (Visa, Mastercard, etc.), the acquiring bank, and PCI forensic investigator (PFI) contact information. For franchise operations, the franchisor's security team should be on the list with escalation procedures.",
      government:
        "Government contractor emergency contacts must include the contracting officer, DIBCIS reporting portal information for DFARS 252.204-7012 compliance (72-hour reporting requirement), and CISA incident reporting contacts. The organizational ISSO and ISSM should be primary contacts.",
    },

    implementationSteps: [
      "Compile a comprehensive contact list including internal leadership, external vendors, insurance carrier, and regulators",
      "Include after-hours and emergency phone numbers for all critical contacts",
      "Distribute printed copies to all members of the incident response team",
      "Store digital copies on personal devices and in a secure cloud location separate from corporate infrastructure",
      "Review and update the contact list quarterly, assigning ownership to a specific individual",
    ],
  },

  // ─────────────────────────────────────────────
  // 26. Cyber Insurance
  // ─────────────────────────────────────────────
  {
    slug: "cyber-insurance",
    name: "Cyber Liability Insurance",
    nistFunction: "Identify",
    nistCategory: "ID.GV-3",
    cisControl: 17,
    cisControlName: "Incident Management",

    explanation:
      "Cyber liability insurance provides financial protection against the costs associated with cybersecurity incidents, including data breaches, ransomware attacks, business email compromise, and network intrusions. A cyber policy typically covers incident response costs (forensics, legal, notification, credit monitoring), business interruption losses, extortion payments, regulatory fines and penalties, and third-party liability from lawsuits.\n\nCyber insurance is not a substitute for security controls — it is a financial risk transfer mechanism that complements them. Insurers expect policyholders to maintain reasonable security practices, and the application process itself serves as a de facto security assessment. Organizations that cannot meet baseline security requirements may be unable to obtain coverage at any price.\n\nWhen evaluating cyber insurance policies, organizations should pay careful attention to coverage limits, sublimits (which may cap specific categories like ransomware or business interruption at lower amounts than the overall policy limit), exclusions (acts of war, failure to maintain security controls, known vulnerabilities), retention or deductible amounts, and the insurer's panel of breach response vendors.\n\nThe insurance carrier's breach response resources are a significant source of value beyond the financial coverage. Most cyber policies provide access to a breach coach (specialized attorney), forensics firms, notification vendors, and credit monitoring services. Establishing a relationship with these resources before an incident occurs — rather than scrambling to engage them during a crisis — improves response speed and outcomes.",

    insuranceRelevance:
      "This control is about the insurance itself. The key consideration is whether the organization has appropriate cyber liability coverage with adequate limits for its size, industry, and risk profile. A $1 million policy is a common starting point for small businesses, but organizations handling significant volumes of sensitive data or those with higher revenue may need $5-10 million or more.\n\nOrganizations should review their cyber insurance policy annually to ensure that coverage keeps pace with changing risks, regulatory requirements, and business growth. Working with a broker who specializes in cyber insurance ensures that the policy is properly structured and that the organization understands its coverage, exclusions, and obligations under the policy.",

    industryNotes: {
      healthcare:
        "Healthcare organizations face elevated breach costs due to the high value of medical records and strict HIPAA penalties. Cyber insurance policies for healthcare should include coverage for HHS OCR fines, state attorney general actions, and patient notification costs. Coverage limits should account for the large number of records typically involved in healthcare breaches.",
      legal:
        "Law firms need cyber insurance that covers both first-party losses and third-party claims from clients whose data was compromised. Professional liability (malpractice) policies typically exclude cyber incidents, making a dedicated cyber policy essential. The policy should cover the costs of client notification and regulatory defense.",
      financial:
        "Financial institutions face regulatory scrutiny, customer lawsuits, and card brand assessments following breaches. Cyber insurance for financial services should include coverage for PCI fines and assessments, regulatory defense costs, and customer notification. Limits should reflect the potential for large-scale customer impact.",
      retail:
        "Retail organizations should ensure their cyber policy covers PCI-DSS fines and assessments from card brands, point-of-sale breach response costs, and business interruption during recovery. E-commerce businesses should verify that their policy covers online transaction fraud and website compromise scenarios.",
      government:
        "Government contractors should ensure their cyber policy covers costs associated with DFARS incident reporting, forensic investigation to satisfy contracting officer requirements, and potential contract penalties. Coverage for CUI breach notification and regulatory defense under CMMC-related obligations is increasingly important.",
    },

    implementationSteps: [
      "Engage a broker specializing in cyber insurance to assess coverage needs based on industry, size, and data types",
      "Obtain cyber liability insurance with limits appropriate for the organization's risk profile",
      "Review the policy carefully for sublimits, exclusions, and policyholder obligations",
      "Document the insurance carrier's claims line number and breach response resources in the emergency contact list",
      "Review and renew the policy annually, updating coverage to reflect changes in risk and business operations",
    ],
  },

  // ─────────────────────────────────────────────
  // 27. Vendor Risk Management
  // ─────────────────────────────────────────────
  {
    slug: "vendor-risk-management",
    name: "Vendor Security Assessments",
    nistFunction: "Identify",
    nistCategory: "ID.SC-1",
    cisControl: 15,
    cisControlName: "Service Provider Management",

    explanation:
      "Vendor risk management is the process of evaluating and monitoring the security practices of third-party vendors, suppliers, and service providers that have access to the organization's data or systems. A breach at a vendor can directly impact the organization — many of the most significant data breaches in recent years have originated through compromised vendors. Your security is only as strong as the weakest link in your supply chain.\n\nVendor security assessments should be conducted before onboarding a new vendor (due diligence) and periodically throughout the relationship (ongoing monitoring). The depth of the assessment should be proportional to the vendor's access level and the sensitivity of the data they handle. A cloud provider hosting customer data warrants a thorough assessment, while a vendor supplying office furniture does not.\n\nAssessment methods range from security questionnaires (standardized formats like SIG, CAIQ, or VSAQ) and review of compliance certifications (SOC 2 Type II, ISO 27001, HITRUST) to more rigorous approaches like on-site audits and penetration test result reviews. For small and mid-sized businesses, requesting a SOC 2 Type II report from critical vendors is an efficient way to evaluate their security posture.\n\nVendor risk management should be formalized in a policy that defines how vendors are categorized by risk level, what assessment is required for each level, how often reassessments occur, and who is responsible for managing vendor relationships. A vendor inventory that tracks all third parties, their access level, and their last assessment date provides the operational foundation for the program.",

    insuranceRelevance:
      "Insurers increasingly recognize supply chain risk as a driver of claims. Applications may ask whether the organization evaluates the security practices of its vendors and how critical vendors are selected and monitored. Supply chain attacks and vendor breaches have generated significant insurance losses, making this a growing focus in underwriting.\n\nDemonstrating a formal vendor risk management program — with documented assessments, risk categorization, and ongoing monitoring — reduces the perceived risk from third-party relationships. Organizations that simply trust vendors without verification are taking on unmeasured risk that insurers are increasingly unwilling to underwrite without appropriate controls.",

    industryNotes: {
      healthcare:
        "HIPAA requires Business Associate Agreements (BAAs) with all vendors that handle ePHI, but a BAA alone does not ensure security. Healthcare organizations should assess business associates' security practices before and during the relationship. OCR has held covered entities accountable for breaches that occurred at business associates.",
      legal:
        "Law firms must ensure that vendors handling client data — cloud providers, e-discovery platforms, document management services — maintain security commensurate with the sensitivity of the data. The duty of competence under ABA Model Rule 1.1 extends to supervising third-party service providers.",
      financial:
        "FFIEC and OCC guidance require financial institutions to manage vendor risk through the entire lifecycle: due diligence, contracting, ongoing monitoring, and termination. Bank examiners specifically assess the vendor management program and may request evidence of assessments for critical vendors.",
      retail:
        "Retail organizations must assess the security of payment processors, e-commerce platforms, and POS system vendors. PCI-DSS Requirement 12.8 requires maintaining a list of service providers, and Requirement 12.9 requires service provider acknowledgment of their PCI responsibilities. Vendor compromise is a leading cause of retail breaches.",
      government:
        "NIST 800-171 control SR.L2-3.17.1 requires developing a process for identifying, assessing, and managing supply chain risks. CMMC extends this requirement with additional supply chain security practices. Government contractors must also comply with DFARS clause 252.204-7012, which flows down to subcontractors handling CUI.",
    },

    implementationSteps: [
      "Create a vendor inventory listing all third parties, their access level, data they handle, and risk category",
      "Establish vendor risk tiers (critical, high, medium, low) based on data access and system integration",
      "Require SOC 2 Type II reports or equivalent evidence from critical and high-risk vendors",
      "Conduct security questionnaires for medium-risk vendors using standardized formats (SIG or similar)",
      "Schedule annual reassessments for critical vendors and biennial reassessments for high-risk vendors",
    ],
  },

  // ─────────────────────────────────────────────
  // 28. Vendor Agreements
  // ─────────────────────────────────────────────
  {
    slug: "vendor-agreements",
    name: "Data Protection Agreements",
    nistFunction: "Identify",
    nistCategory: "ID.SC-3",
    cisControl: 15,
    cisControlName: "Service Provider Management",

    explanation:
      "Data protection agreements (DPAs) are contractual provisions that define the security obligations, data handling requirements, and liability terms between an organization and its vendors. While vendor security assessments evaluate what a vendor does, DPAs create legally binding obligations for what they must do. Without appropriate contractual protections, the organization has limited recourse if a vendor breach affects its data.\n\nKey provisions in a DPA include the scope of data the vendor will access or process, the security controls the vendor must maintain, breach notification obligations (including timeframe and content of notice), data return and destruction requirements upon contract termination, the right to audit the vendor's security practices, and indemnification for losses caused by the vendor's security failures.\n\nBreach notification clauses deserve special attention. The agreement should require the vendor to notify the organization within a specific timeframe (24-72 hours is standard) of discovering a breach affecting the organization's data. Without this clause, the organization may not learn about a vendor breach until weeks or months later, severely limiting its ability to contain the impact and meet its own regulatory notification obligations.\n\nDPAs should be tailored to the sensitivity of the data and the nature of the vendor relationship. A cloud provider hosting customer databases requires more comprehensive protections than a marketing firm that receives aggregate analytics data. Legal counsel should review DPAs for critical vendors to ensure that the organization's interests are properly protected.",

    insuranceRelevance:
      "Data protection agreements support insurability by creating a contractual framework for managing vendor risk. Insurers view organizations with strong vendor agreements as having better control over their extended risk surface. In the event of a vendor-caused breach, the existence of a DPA with appropriate indemnification and breach notification clauses supports the organization's recovery efforts.\n\nThe breach notification clause in vendor agreements is particularly relevant to insurance because it determines how quickly the organization learns about a vendor breach and can begin its own response. Delayed notification from vendors can exacerbate breach costs and complicate insurance claims.",

    industryNotes: {
      healthcare:
        "HIPAA requires Business Associate Agreements (BAAs) with all vendors that create, receive, maintain, or transmit ePHI on behalf of a covered entity. The BAA must specify permitted uses and disclosures, security obligations, breach notification requirements, and data return/destruction terms. Operating without a BAA is a HIPAA violation regardless of whether a breach occurs.",
      legal:
        "Law firms must ensure that vendor agreements protect attorney-client privilege and comply with confidentiality obligations. Agreements should include provisions restricting the vendor's use of client data, requiring security controls, and mandating return or destruction of data upon engagement completion.",
      financial:
        "FFIEC and OCC guidance require financial institutions to include specific security provisions in vendor contracts, including the right to audit, breach notification timelines, and business continuity requirements. Bank examiners review vendor contracts as part of their third-party risk management assessments.",
      retail:
        "PCI-DSS Requirement 12.8.2 requires maintaining written agreements that include acknowledgment by service providers of their responsibility for cardholder data security. Retail organizations should ensure that payment processing agreements include PCI compliance requirements, breach notification, and indemnification for card brand fines.",
      government:
        "Government contractors must flow down DFARS clause 252.204-7012 to subcontractors that handle CUI, creating a contractual chain of security obligations. Vendor agreements must include requirements for safeguarding CUI, incident reporting, and access to facilities and systems for audit purposes.",
    },

    implementationSteps: [
      "Develop a standard data protection agreement template covering security obligations, breach notification, and data handling",
      "Include breach notification clauses requiring vendor notification within 24-72 hours of discovering an incident",
      "Require the right to audit vendor security practices or request evidence of compliance (SOC 2, penetration test results)",
      "Include data return and secure destruction requirements upon contract termination",
      "Review all existing vendor contracts and prioritize adding DPA provisions to critical and high-risk vendor agreements",
    ],
  },

  // ─────────────────────────────────────────────
  // 29. Security Training
  // ─────────────────────────────────────────────
  {
    slug: "security-training",
    name: "Security Awareness Training Program",
    nistFunction: "Protect",
    nistCategory: "PR.AT-1",
    cisControl: 14,
    cisControlName: "Security Awareness and Skills Training",

    explanation:
      "A security awareness training program provides ongoing education to all employees about cybersecurity threats, safe computing practices, and their responsibilities for protecting organizational data. Human error is a contributing factor in the majority of security incidents, making employee awareness one of the most impactful — and cost-effective — security investments an organization can make.\n\nEffective security awareness training covers a broad curriculum: recognizing phishing and social engineering, password hygiene, safe web browsing, physical security (locking screens, securing documents), data handling and classification, mobile device security, reporting suspicious activity, and compliance requirements specific to the organization's industry.\n\nTraining should be delivered in multiple formats to maximize engagement and retention. Annual comprehensive training provides the foundation, while monthly or quarterly micro-learning modules (short videos, quizzes, scenarios) reinforce key concepts throughout the year. Just-in-time training triggered by specific behaviors — such as clicking a simulated phishing link — provides targeted education at the moment it is most relevant.\n\nMeasuring training effectiveness is essential. Completion rates confirm that training was delivered, but behavioral metrics (phishing simulation click rates, reporting rates, policy compliance) measure whether the training actually changed behavior. Organizations should track these metrics over time and use them to identify departments or roles that need additional focus.",

    insuranceRelevance:
      "Security awareness training is a standard requirement on cyber insurance applications. Insurers ask whether the organization conducts regular training and how frequently. Because human error drives the majority of claims — phishing clicks, credential compromise, accidental data exposure — insurers view trained employees as a critical risk reduction factor.\n\nOrganizations that can provide evidence of an ongoing training program — including completion rates, phishing simulation results, and year-over-year improvement metrics — demonstrate to underwriters that they are actively managing human risk. Some carriers offer premium discounts for documented, comprehensive training programs.",

    industryNotes: {
      healthcare:
        "HIPAA requires security awareness training under 45 CFR 164.308(a)(5)(i) for all workforce members. Training must cover the organization's HIPAA policies and procedures, recognizing threats to ePHI, and reporting security incidents. Healthcare-specific training should address risks unique to clinical environments, including verbal disclosure of patient information.",
      legal:
        "The ABA Model Rules require lawyers to stay current with technology relevant to their practice (Comment 8 to Rule 1.1). Security awareness training helps attorneys meet this duty of technology competence. Training for law firms should address risks specific to legal practice, including targeted phishing, client impersonation, and wire fraud.",
      financial:
        "FFIEC and GLBA require financial institutions to implement security awareness training programs. Training should cover industry-specific threats including wire transfer fraud, account takeover, and ATM/card skimming. Regulatory examiners verify training completion rates and curriculum adequacy during examinations.",
      retail:
        "Retail organizations with high turnover must ensure that training is efficient and reaches new employees quickly. Training should address retail-specific risks including POS security, social engineering at checkout, and customer data handling. Brief, role-specific modules are more effective than lengthy generic courses in retail environments.",
      government:
        "NIST 800-171 control AT.L2-3.2.1 requires security literacy training, and AT.L2-3.2.2 requires role-based training for personnel with security responsibilities. CMMC assessors verify that training is provided, documented, and periodically updated. Government contractors must ensure training covers CUI handling requirements.",
    },

    implementationSteps: [
      "Select a security awareness training platform (KnowBe4, Proofpoint, Ninjio, or similar) and deploy it to all employees",
      "Conduct annual comprehensive security awareness training covering all core topics",
      "Supplement with monthly or quarterly micro-learning modules to reinforce key concepts throughout the year",
      "Track completion rates and require 100% participation with follow-up for non-completers",
      "Measure behavioral outcomes (phishing simulation results, reporting rates) alongside completion metrics",
    ],
  },

  // ─────────────────────────────────────────────
  // 30. Security Onboarding
  // ─────────────────────────────────────────────
  {
    slug: "security-onboarding",
    name: "New Hire Security Onboarding",
    nistFunction: "Protect",
    nistCategory: "PR.AT-2",
    cisControl: 14,
    cisControlName: "Security Awareness and Skills Training",

    explanation:
      "New hire security onboarding is the process of training newly hired employees on the organization's security policies, acceptable use requirements, and their individual responsibilities for protecting data before they begin accessing systems and data. The onboarding period is the most effective window for establishing security expectations because employees are focused on learning how the organization operates.\n\nSecurity onboarding should cover the acceptable use policy, data handling and classification procedures, password requirements and password manager enrollment, MFA setup, email security awareness, physical security practices, incident reporting procedures, and any industry-specific compliance requirements (HIPAA, PCI-DSS, etc.). Employees should sign an acknowledgment confirming they have received, read, and understood the policies.\n\nThe onboarding process should also include the practical setup of security tools. New employees should be guided through enrolling in the password manager, setting up MFA on their accounts, installing required security software (EDR, VPN client), and enrolling their devices in MDM. Leaving these steps for employees to complete independently leads to delays and inconsistencies.\n\nSecurity onboarding should be mandatory — no employee should receive access to systems until they have completed security training and acknowledged the policies. This requirement should be built into the HR onboarding workflow so that it happens consistently for every new hire, regardless of role or seniority. Executives and contractors should go through the same process as every other employee.",

    insuranceRelevance:
      "Insurers value security onboarding as evidence that the organization establishes security expectations from day one. New employees who are not properly onboarded represent a risk during the period before they encounter the annual training cycle. Applications may ask whether new hires receive security training as part of their onboarding.\n\nA documented onboarding process with signed policy acknowledgments creates evidence that the organization communicated its security expectations to every employee. This documentation is valuable in claims scenarios where an employee's actions are under scrutiny — it demonstrates that the organization took reasonable steps to inform the employee of their responsibilities.",

    industryNotes: {
      healthcare:
        "HIPAA requires that workforce members receive training on policies and procedures before they are granted access to ePHI. New hire security onboarding in healthcare must include HIPAA-specific training on privacy practices, minimum necessary use, breach reporting, and the organization's Notice of Privacy Practices.",
      legal:
        "New attorneys and staff must understand their obligations for protecting attorney-client privilege and confidential client information from their first day. Onboarding should cover the firm's specific security policies, ethical walls, document handling procedures, and the duty of technology competence.",
      financial:
        "Financial institution onboarding must cover GLBA privacy and security requirements, insider trading prevention (if applicable), and specific procedures for handling customer financial information. Regulatory examiners verify that new hire training records are maintained and that training occurs before system access is granted.",
      retail:
        "Retail new hire onboarding should include POS security procedures, customer data handling rules, and social engineering awareness. Given high turnover in retail, the onboarding security module should be concise and role-specific. Seasonal employees must receive the same onboarding as permanent staff.",
      government:
        "Government contractor onboarding must include CUI handling training, marking requirements, and incident reporting obligations under DFARS. CMMC assessors verify that personnel are trained before they are granted access to CUI. Onboarding records must be maintained as evidence of compliance.",
    },

    implementationSteps: [
      "Develop a security onboarding checklist covering all required training, policy acknowledgments, and tool setup",
      "Integrate security onboarding into the HR new hire workflow so it is triggered automatically for every new employee",
      "Require completion of security onboarding before granting access to corporate systems and data",
      "Guide new hires through practical setup: password manager enrollment, MFA configuration, and device security",
      "Collect signed policy acknowledgments and retain them as documentation of the employee's security training",
    ],
  },
];
