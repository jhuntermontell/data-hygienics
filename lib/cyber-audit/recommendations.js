export const RECOMMENDATIONS = {
  // ============================================================
  // ACCESS CONTROL - New keys (general.js)
  // ============================================================
  ac_password_manager: {
    priority: "high",
    title: "Adopt a Business Password Manager",
    action:
      "Deploy a password manager (Bitwarden, 1Password, or Dashlane) for all employees and require its use for every business account.",
  },
  ac_mfa_systems: {
    priority: "high",
    title: "Enable Multi-Factor Authentication on All Systems",
    action:
      "Enforce MFA on email, cloud services, VPN, and financial accounts using authenticator apps or hardware keys rather than SMS.",
  },
  ac_privilege_management: {
    priority: "high",
    title: "Implement Least-Privilege Access",
    action:
      "Assign users only the minimum permissions they need to do their jobs. Eliminate shared admin accounts and use role-based access control.",
  },
  ac_offboarding: {
    priority: "high",
    title: "Formalize Employee Offboarding",
    action:
      "Maintain a checklist of every system and credential an employee has. Revoke all access within 24 hours of their last day.",
  },
  ac_access_review_frequency: {
    priority: "medium",
    title: "Schedule Regular Access Reviews",
    action:
      "Review user access rights at least quarterly. Remove stale accounts and adjust permissions for employees who have changed roles.",
  },
  ac_password_policy_maturity: {
    priority: "medium",
    title: "Strengthen Your Password Policy",
    action:
      "Require minimum 14-character passphrases, prohibit password reuse, and enforce password manager usage across the organization.",
  },

  // ============================================================
  // DATA PROTECTION - New keys (general.js)
  // ============================================================
  dp_backup_frequency: {
    priority: "high",
    title: "Increase Backup Frequency",
    action:
      "Move to daily automated backups for critical data. For high-transaction systems, implement continuous or hourly backups.",
  },
  dp_backup_testing: {
    priority: "high",
    title: "Test Backup Restores Regularly",
    action:
      "Perform a full restore test at least quarterly. A backup that has never been tested is not a reliable backup.",
  },
  dp_offsite_storage: {
    priority: "high",
    title: "Store Backups Off-Site or in a Separate Cloud Region",
    action:
      "Keep at least one backup copy in a physically separate location or different cloud region to protect against ransomware and disasters.",
  },
  dp_encryption_at_rest: {
    priority: "high",
    title: "Encrypt Data at Rest",
    action:
      "Enable encryption on databases, file servers, and backup storage. Use AES-256 or equivalent and manage keys securely.",
  },
  dp_data_classification: {
    priority: "medium",
    title: "Classify Your Business Data",
    action:
      "Label data as public, internal, confidential, or restricted. Apply security controls appropriate to each classification level.",
  },
  dp_retention_maturity: {
    priority: "medium",
    title: "Define a Data Retention Policy",
    action:
      "Document how long each type of data is kept and when it must be securely deleted. This reduces exposure and supports compliance.",
  },

  // ============================================================
  // ENDPOINT PROTECTION - New keys (general.js)
  // ============================================================
  ep_protection_coverage: {
    priority: "high",
    title: "Deploy Endpoint Protection on All Devices",
    action:
      "Install a business-grade EDR/EPP solution (CrowdStrike, SentinelOne, or Defender for Business) on every company-managed device.",
  },
  ep_os_patching_frequency: {
    priority: "high",
    title: "Patch Operating Systems Promptly",
    action:
      "Enable automatic OS updates on all endpoints. Critical patches should be applied within 14 days of release.",
  },
  ep_device_encryption: {
    priority: "high",
    title: "Encrypt All Company Devices",
    action:
      "Enable FileVault (Mac) or BitLocker (Windows) on every laptop and desktop to protect data if a device is lost or stolen.",
  },
  ep_byod_controls: {
    priority: "medium",
    title: "Enforce Controls on Personal Devices",
    action:
      "Require screen locks, disk encryption, and up-to-date OS on any personal device accessing business data. Use MDM or conditional access policies.",
  },
  ep_remote_wipe_maturity: {
    priority: "medium",
    title: "Enable Remote Wipe Capability",
    action:
      "Enroll devices in an MDM solution so lost or stolen devices can be remotely locked and wiped to prevent data exposure.",
  },

  // ============================================================
  // EMAIL SECURITY - New keys (general.js)
  // ============================================================
  es_filtering_maturity: {
    priority: "high",
    title: "Strengthen Email Filtering",
    action:
      "Enable advanced spam, phishing, and malware filtering in your email provider. Consider a dedicated secure email gateway for enhanced protection.",
  },
  es_phishing_training_frequency: {
    priority: "high",
    title: "Conduct Regular Phishing Training",
    action:
      "Run phishing simulations and awareness training at least quarterly. Use services like KnowBe4, Proofpoint, or free CISA resources.",
  },
  es_business_domain: {
    priority: "medium",
    title: "Use a Business Email Domain",
    action:
      "Set up email on your own domain (you@company.com) via Google Workspace or Microsoft 365 for better security controls and brand credibility.",
  },
  es_dmarc_dkim_spf: {
    priority: "medium",
    title: "Configure DMARC, DKIM, and SPF Records",
    action:
      "Set up SPF, DKIM, and DMARC DNS records to prevent attackers from spoofing your business domain in phishing emails.",
  },
  es_suspicious_reporting: {
    priority: "low",
    title: "Create a Suspicious Email Reporting Process",
    action:
      "Set up a dedicated reporting channel (email alias or button in the mail client) so employees can easily flag suspicious messages.",
  },

  // ============================================================
  // NETWORK SECURITY - New keys (general.js)
  // ============================================================
  ns_wifi_security: {
    priority: "high",
    title: "Secure Your WiFi Networks",
    action:
      "Use WPA3 (or WPA2-AES at minimum) with a strong passphrase. Separate guest and IoT traffic from business systems on a dedicated VLAN.",
  },
  ns_segmentation: {
    priority: "medium",
    title: "Implement Network Segmentation",
    action:
      "Isolate sensitive systems (finance, HR, servers) on separate network segments so a breach in one area cannot easily spread.",
  },
  ns_firewall_maturity: {
    priority: "high",
    title: "Deploy and Maintain a Business Firewall",
    action:
      "Use a next-generation firewall with intrusion detection. Review and tighten rules at least quarterly.",
  },
  ns_vpn_remote: {
    priority: "medium",
    title: "Require VPN for Remote Access",
    action:
      "Deploy a business VPN and require all remote employees to connect through it when accessing company resources.",
  },
  ns_access_review_frequency: {
    priority: "low",
    title: "Review Network Access Regularly",
    action:
      "Audit the list of devices and users on your network at least quarterly. Remove anything that is no longer authorized.",
  },

  // ============================================================
  // INCIDENT RESPONSE - New keys (general.js)
  // ============================================================
  ir_plan_maturity: {
    priority: "high",
    title: "Develop an Incident Response Plan",
    action:
      "Create a documented plan covering identification, containment, eradication, recovery, and lessons learned. Test it with a tabletop exercise annually.",
  },
  ir_emergency_contacts: {
    priority: "high",
    title: "Document Emergency Contacts",
    action:
      "Maintain a printed and digital list of who to call in a cyber emergency: IT provider, insurance carrier, legal counsel, and FBI IC3 (ic3.gov).",
  },
  ir_incident_tracking: {
    priority: "medium",
    title: "Implement Incident Tracking",
    action:
      "Log all security incidents in a central system, even minor ones. Tracking patterns helps you identify recurring threats and measure improvement.",
  },
  ir_cyber_insurance: {
    priority: "high",
    title: "Obtain Cyber Liability Insurance",
    action:
      "Purchase a cyber liability policy that covers breach response costs, legal fees, regulatory fines, and business interruption.",
  },
  ir_plan_communication: {
    priority: "medium",
    title: "Communicate the Incident Response Plan",
    action:
      "Brief all employees on the IR plan so everyone knows their role. Post emergency contacts visibly and conduct annual refresher walkthroughs.",
  },

  // ============================================================
  // VENDOR RISK - New keys (general.js)
  // ============================================================
  vr_vendor_inventory: {
    priority: "medium",
    title: "Maintain a Vendor Inventory",
    action:
      "List every third-party service that accesses or stores your business data, including what data they handle and the business justification.",
  },
  vr_security_review: {
    priority: "medium",
    title: "Evaluate Vendor Security Before Onboarding",
    action:
      "Before granting a vendor access, verify they use encryption, have a published security posture, and meet your compliance requirements.",
  },
  vr_data_protection_agreements: {
    priority: "medium",
    title: "Require Data Protection Agreements",
    action:
      "Ensure every vendor with access to sensitive data signs a DPA or BAA. Most reputable SaaS providers already have these available.",
  },
  vr_access_audit_frequency: {
    priority: "low",
    title: "Audit Vendor Access Regularly",
    action:
      "Review connected third-party apps and API keys quarterly. Revoke access for any tools or integrations no longer in use.",
  },
  vr_supply_chain_awareness: {
    priority: "medium",
    title: "Assess Supply Chain Risk",
    action:
      "Identify which vendors are critical to your operations and evaluate their continuity plans. Have a backup strategy if a key vendor is compromised.",
  },

  // ============================================================
  // SECURITY AWARENESS - New keys (general.js)
  // ============================================================
  sa_training_maturity: {
    priority: "high",
    title: "Provide Regular Security Awareness Training",
    action:
      "Conduct security awareness training at least annually for all employees. Use interactive modules and track completion rates.",
  },
  sa_reporting_policy: {
    priority: "medium",
    title: "Establish a Security Incident Reporting Policy",
    action:
      "Create a clear, blame-free process for employees to report anything suspicious. Make the reporting channel easy to find and use.",
  },
  sa_security_onboarding: {
    priority: "medium",
    title: "Include Security in Employee Onboarding",
    action:
      "Add a mandatory security briefing to new hire orientation covering passwords, phishing, device security, and acceptable use policies.",
  },
  sa_byod_policy: {
    priority: "medium",
    title: "Publish a BYOD Policy",
    action:
      "Document requirements for personal devices used for work: mandatory screen locks, encryption, current OS, and prohibited jailbreaking/rooting.",
  },
  sa_phishing_response: {
    priority: "high",
    title: "Train Staff on Phishing Response Procedures",
    action:
      "Teach employees to disconnect, report to IT immediately, change passwords, and preserve the suspicious email for investigation.",
  },

  // ============================================================
  // OLD KEYS - Backward compatibility (legacy questionnaire)
  // ============================================================

  // Access Control (legacy)
  ac_unique_passwords: {
    priority: "high",
    title: "Use Unique Passwords for Every Account",
    action:
      "Set up a password manager like Bitwarden or 1Password and generate unique passwords for each business account.",
  },
  ac_mfa_enabled: {
    priority: "high",
    title: "Enable Multi-Factor Authentication",
    action:
      "Turn on MFA for email, banking, and cloud storage accounts immediately. Use an authenticator app rather than SMS when possible.",
  },
  ac_password_policy: {
    priority: "medium",
    title: "Write a Password Policy",
    action:
      "Create a short, clear document requiring minimum 12-character passwords, unique passwords per account, and mandatory MFA.",
  },

  // Data Backup (legacy)
  db_regular_backups: {
    priority: "high",
    title: "Start Backing Up Business Files",
    action:
      "Set up automated cloud backups using a service like Backblaze, Carbonite, or your cloud provider's backup feature.",
  },
  db_separate_location: {
    priority: "high",
    title: "Store Backups Off-Site",
    action:
      "Ensure backups are stored in a different physical or cloud location from your primary systems to protect against ransomware.",
  },
  db_frequency: {
    priority: "medium",
    title: "Increase Backup Frequency",
    action:
      "Move to daily automated backups. Most cloud backup services support this with minimal configuration.",
  },
  db_tested_restore: {
    priority: "medium",
    title: "Test Your Backup Restore Process",
    action:
      "Schedule a quarterly test to restore files from backup. A backup you have never tested may not work when you need it.",
  },
  db_automated: {
    priority: "medium",
    title: "Automate Your Backups",
    action:
      "Switch from manual to automated backups. Manual backups are frequently forgotten and leave gaps in protection.",
  },

  // Endpoint Protection (legacy)
  ep_antivirus: {
    priority: "high",
    title: "Install Endpoint Protection Software",
    action:
      "Deploy a business-grade endpoint protection solution like CrowdStrike, SentinelOne, or Microsoft Defender for Business on all devices.",
  },
  ep_updates: {
    priority: "high",
    title: "Enable Automatic OS Updates",
    action:
      "Turn on automatic updates for all operating systems. Unpatched systems are one of the most common entry points for attackers.",
  },
  ep_byod_policy: {
    priority: "medium",
    title: "Create a Personal Device Policy",
    action:
      "Define rules for personal devices accessing business data: require screen locks, encryption, and up-to-date software.",
  },
  ep_encryption: {
    priority: "medium",
    title: "Encrypt Company Devices",
    action:
      "Enable FileVault (Mac) or BitLocker (Windows) on all company laptops and desktops to protect data if a device is lost or stolen.",
  },
  ep_remote_wipe: {
    priority: "medium",
    title: "Set Up Remote Wipe Capability",
    action:
      "Use an MDM solution or built-in tools (Find My Mac, Microsoft Intune) to remotely wipe lost or stolen devices.",
  },

  // Email Security (legacy)
  es_spam_filter: {
    priority: "high",
    title: "Enable Email Filtering",
    action:
      "Activate the built-in spam and phishing filters in your email provider. Consider adding a dedicated email security gateway for better protection.",
  },
  es_phishing_training: {
    priority: "high",
    title: "Conduct Phishing Awareness Training",
    action:
      "Run a phishing simulation and training session for all employees. Services like KnowBe4 or free resources from CISA can help.",
  },
  es_dmarc: {
    priority: "medium",
    title: "Configure Email Authentication (DMARC/DKIM/SPF)",
    action:
      "Ask your email provider or IT person to set up SPF, DKIM, and DMARC records. This prevents others from spoofing your domain.",
  },
  es_reporting_process: {
    priority: "low",
    title: "Create a Suspicious Email Reporting Process",
    action:
      "Designate a person or email address where employees can forward suspicious messages. Make it easy and judgment-free.",
  },

  // Network Security (legacy)
  ns_wifi_password: {
    priority: "high",
    title: "Secure Your WiFi Network",
    action:
      "Set a strong, unique password on your business WiFi using WPA3 or WPA2 encryption. Change it from the default.",
  },
  ns_guest_network: {
    priority: "medium",
    title: "Set Up a Guest WiFi Network",
    action:
      "Create a separate WiFi network for visitors and personal devices to keep them isolated from your business systems.",
  },
  ns_firewall: {
    priority: "high",
    title: "Deploy a Firewall",
    action:
      "Ensure your router has its built-in firewall enabled. For additional protection, consider a dedicated business firewall appliance.",
  },
  ns_vpn: {
    priority: "medium",
    title: "Require VPN for Remote Work",
    action:
      "Set up a business VPN for employees working from home or public networks. This encrypts their connection to company resources.",
  },
  ns_access_review: {
    priority: "low",
    title: "Review Network Access Regularly",
    action:
      "Quarterly, review the list of devices and users with network access. Remove any that are no longer needed.",
  },

  // Incident Response (legacy)
  ir_documented_plan: {
    priority: "high",
    title: "Create an Incident Response Plan",
    action:
      "Write a simple one-page plan covering: who to call, how to contain the breach, how to communicate, and recovery steps.",
  },
  ir_contacts: {
    priority: "high",
    title: "Identify Your Emergency Contacts",
    action:
      "Document who to call in a cyber emergency: your IT provider, insurance carrier, legal counsel, and the FBI's IC3 (ic3.gov).",
  },
  ir_plan_communicated: {
    priority: "medium",
    title: "Share the Incident Response Plan with Your Team",
    action:
      "Walk your team through the plan so everyone knows their role. Post emergency contact numbers where they are easy to find.",
  },

  // Vendor Risk (legacy)
  vr_inventory: {
    priority: "medium",
    title: "Create a Vendor Inventory",
    action:
      "List every third-party app and service that has access to your business data. Include what data they can access and why.",
  },
  vr_agreements: {
    priority: "medium",
    title: "Require Vendor Data Protection Agreements",
    action:
      "Ask vendors to sign a data protection agreement or confirm they have one. Most reputable SaaS providers already offer this.",
  },
  vr_audit_access: {
    priority: "low",
    title: "Audit Third-Party Access Regularly",
    action:
      "Quarterly, review connected apps and revoke access for any tools you no longer use.",
  },

  // Employee Awareness (legacy)
  ea_training: {
    priority: "high",
    title: "Provide Cybersecurity Training",
    action:
      "Schedule annual security awareness training for all employees. Free resources are available from CISA and the SANS Institute.",
  },
  ea_reporting_policy: {
    priority: "medium",
    title: "Establish a Security Reporting Policy",
    action:
      "Create a clear, simple process for employees to report anything suspicious without fear of blame.",
  },
  ea_onboarding: {
    priority: "medium",
    title: "Add Security to Employee Onboarding",
    action:
      "Include a 15-minute security briefing in your new hire process covering passwords, phishing, and device security.",
  },
  ea_byod_policy: {
    priority: "medium",
    title: "Create a BYOD Policy",
    action:
      "Document requirements for personal devices used for work: screen locks, encryption, no jailbreaking, and required security apps.",
  },
  ea_phishing_response: {
    priority: "high",
    title: "Train Your Team on Phishing Response",
    action:
      "Teach employees the steps: disconnect from network, report to IT/manager, change passwords, and do not delete the email.",
  },

  // ============================================================
  // HEALTHCARE (hc_*) - Industry-specific
  // ============================================================
  hc_phi_encryption: {
    priority: "high",
    title: "Encrypt Protected Health Information (PHI)",
    action:
      "Encrypt all PHI at rest and in transit using AES-256 and TLS 1.2+. This is a core HIPAA Security Rule requirement.",
  },
  hc_baa_compliance: {
    priority: "high",
    title: "Execute Business Associate Agreements",
    action:
      "Ensure every vendor that handles PHI has a signed BAA in place. Audit existing vendors and close any gaps immediately.",
  },
  hc_hipaa_risk_analysis: {
    priority: "high",
    title: "Conduct a HIPAA Security Risk Analysis",
    action:
      "Perform a formal risk analysis as required by HIPAA. Document threats, vulnerabilities, and remediation plans. Repeat annually.",
  },
  hc_phi_access_controls: {
    priority: "high",
    title: "Restrict Access to PHI",
    action:
      "Implement role-based access controls so only authorized staff can view patient data. Log and audit all PHI access.",
  },
  hc_breach_notification: {
    priority: "high",
    title: "Establish a HIPAA Breach Notification Process",
    action:
      "Document procedures for notifying HHS, affected individuals, and media (if over 500 records) within the required 60-day window.",
  },
  hc_security_officer: {
    priority: "medium",
    title: "Designate a HIPAA Security Officer",
    action:
      "Appoint a specific individual responsible for HIPAA compliance, risk management, and security policy enforcement.",
  },

  // ============================================================
  // LEGAL (leg_*) - Industry-specific
  // ============================================================
  leg_client_access: {
    priority: "high",
    title: "Restrict Access to Client Files",
    action:
      "Implement strict access controls on client matter files so only assigned attorneys and staff can access them. Use matter-level permissions.",
  },
  leg_encryption_comms: {
    priority: "high",
    title: "Encrypt Client Communications",
    action:
      "Use encrypted email (TLS at minimum, consider end-to-end encryption for sensitive matters) and secure file-sharing portals for client communications.",
  },
  leg_matter_access: {
    priority: "medium",
    title: "Implement Matter-Level Access Controls",
    action:
      "Configure your practice management system so staff can only access matters they are assigned to, enforcing ethical wall requirements.",
  },
  leg_aba_compliance: {
    priority: "medium",
    title: "Review ABA Cybersecurity Guidance",
    action:
      "Audit your firm's practices against ABA Formal Opinion 477R and 483 to ensure competent, reasonable efforts to protect client information.",
  },

  // ============================================================
  // FINANCIAL (fin_*) - Industry-specific
  // ============================================================
  fin_pci_compliance: {
    priority: "high",
    title: "Achieve and Maintain PCI DSS Compliance",
    action:
      "Complete a PCI DSS self-assessment questionnaire and remediate any gaps. If you process card payments, this is mandatory.",
  },
  fin_transaction_monitoring: {
    priority: "high",
    title: "Implement Transaction Monitoring",
    action:
      "Deploy automated monitoring for unusual transaction patterns, large transfers, and out-of-hours activity to detect fraud early.",
  },
  fin_fraud_detection: {
    priority: "high",
    title: "Strengthen Fraud Detection Controls",
    action:
      "Implement multi-person approval for large transactions, verify wire transfer requests via callback, and use behavioral analytics.",
  },
  fin_glba_safeguards: {
    priority: "high",
    title: "Comply with GLBA Safeguards Rule",
    action:
      "Develop a written information security plan as required by the Gramm-Leach-Bliley Act. Designate a qualified individual to oversee it.",
  },

  // ============================================================
  // RETAIL (ret_*) - Industry-specific
  // ============================================================
  ret_pci_compliance: {
    priority: "high",
    title: "Ensure PCI DSS Compliance",
    action:
      "Complete the appropriate PCI DSS self-assessment questionnaire for your payment processing method and remediate all findings.",
  },
  ret_pos_security: {
    priority: "high",
    title: "Secure Point-of-Sale Systems",
    action:
      "Keep POS software updated, use network segmentation to isolate POS terminals, and disable unnecessary services and ports.",
  },
  ret_payment_terminal: {
    priority: "high",
    title: "Protect Payment Terminals",
    action:
      "Inspect terminals daily for tampering, use P2PE (point-to-point encryption) terminals, and restrict physical access to payment devices.",
  },
  ret_cardholder_data: {
    priority: "high",
    title: "Minimize Cardholder Data Storage",
    action:
      "Never store full card numbers, CVVs, or PINs. Use tokenization and ensure your payment processor handles data securely.",
  },

  // ============================================================
  // GOVERNMENT (gov_*) - Industry-specific
  // ============================================================
  gov_cui_handling: {
    priority: "high",
    title: "Implement CUI Handling Procedures",
    action:
      "Establish marking, safeguarding, and dissemination controls for Controlled Unclassified Information per NIST SP 800-171.",
  },
  gov_cmmc_assessment: {
    priority: "high",
    title: "Prepare for CMMC Assessment",
    action:
      "Conduct a gap analysis against the required CMMC level, remediate findings, and document your System Security Plan and POA&M.",
  },
  gov_dfars_reporting: {
    priority: "high",
    title: "Comply with DFARS Incident Reporting",
    action:
      "Establish a 72-hour cyber incident reporting process to DIBNet as required by DFARS 252.204-7012. Train your IR team on the procedure.",
  },
  gov_ssp_documentation: {
    priority: "medium",
    title: "Maintain a System Security Plan",
    action:
      "Document your security controls, system boundaries, and data flows in a formal SSP. Review and update it at least annually.",
  },
};
