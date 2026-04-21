/**
 * Quick Assessment - 12 insurance-critical questions, industry-agnostic.
 * Plain-English phrasing. All jargon lives in tooltips, not question text.
 * Each "I don't know" option carries a `hint` that the UI surfaces as a
 * contextual helper callout.
 */

export const QUICK_SECTIONS = [
  {
    id: "quick_identity",
    key: "quick_identity",
    title: "Identity and Access",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "quick_mfa",
        text: "Does your organization require multi-factor authentication (MFA) to access email and critical business systems?",
        type: "singleselect",
        domain: "mfa",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 6,
        insuranceCritical: true,
        denialRisk: true,
        tooltip: {
          explanation:
            "Multi-factor authentication requires a second verification step beyond your password, like a code sent to your phone. It is the single most effective control against unauthorized access.",
          insurerNote:
            "MFA is the number one reason cyber insurance applications are denied. Coalition, Cowbell, Travelers, and Beazley all require it.",
          controlSlug: "multi-factor-authentication",
        },
        options: [
          { label: "Yes, MFA is required on all systems including email, VPN, and cloud apps", weight: 1.0 },
          { label: "MFA is required on some systems but not all", weight: 0.5 },
          { label: "MFA is available but not required", weight: 0.2 },
          { label: "We do not use MFA", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "If you use Microsoft 365, go to admin.microsoft.com > Security > MFA. If you use Google Workspace, go to admin.google.com > Security > 2-Step Verification. Or ask your IT provider: 'Is MFA required for email and all our cloud apps?'",
          },
        ],
      },
    ],
  },
  {
    id: "quick_endpoint",
    key: "quick_endpoint",
    title: "Endpoint Protection",
    nistCategory: "DE.CM",
    questions: [
      {
        key: "quick_edr",
        text: "What software protects your company computers from viruses, hackers, and ransomware?",
        type: "singleselect",
        domain: "endpoint",
        quickAssessment: true,
        nistFunction: "Detect",
        cisControl: 10,
        insuranceCritical: true,
        denialRisk: true,
        tooltip: {
          explanation:
            "Endpoint detection and response (EDR) goes beyond traditional antivirus. It actively monitors for suspicious behavior, not just known viruses, and can isolate a compromised device before damage spreads.",
          insurerNote:
            "Most carriers now require EDR specifically, not just antivirus. Traditional antivirus alone may result in application denial or coverage exclusions.",
          controlSlug: "endpoint-detection-response",
        },
        options: [
          { label: "We use an advanced security tool that actively monitors for threats and can isolate infected devices (e.g., CrowdStrike, SentinelOne, Microsoft Defender for Endpoint)", weight: 1.0 },
          { label: "We use business antivirus software (e.g., Sophos, Webroot, Bitdefender)", weight: 0.5 },
          { label: "We rely on the free protection built into Windows or Mac", weight: 0.2 },
          { label: "We don't have security software on all devices", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Check any company laptop: on Windows, go to Settings > Privacy & Security > Windows Security. Or ask your IT provider: 'What security software is installed on our computers, and is it an advanced tool or basic antivirus?'",
          },
        ],
      },
    ],
  },
  {
    id: "quick_backup",
    key: "quick_backup",
    title: "Data Backup",
    nistCategory: "PR.IP",
    questions: [
      {
        key: "quick_backup",
        text: "How does your organization back up its critical business data?",
        type: "singleselect",
        domain: "backup",
        quickAssessment: true,
        nistFunction: "Recover",
        cisControl: 11,
        insuranceCritical: true,
        tooltip: {
          explanation:
            "Backups are your last line of defense against ransomware and data loss. The 3-2-1 rule means 3 copies of your data, on 2 different types of storage, with 1 copy stored offsite or in the cloud.",
          insurerNote:
            "Carriers want to know that your backups exist, are tested regularly, and are stored separately from your main network so ransomware cannot encrypt them too.",
          controlSlug: "data-backup-recovery",
        },
        options: [
          { label: "Automated backups following the 3-2-1 rule with regular restore testing", weight: 1.0 },
          { label: "Automated cloud or offsite backups but we have not tested restoring from them", weight: 0.6 },
          { label: "We back up to an external drive or local server", weight: 0.3 },
          { label: "We do not have a formal backup process", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Ask your IT provider: 'Where are our backups stored, how often do they run, and when was the last time we tested restoring a file?' If they cannot answer the restore test question, that is the gap.",
          },
        ],
      },
    ],
  },
  {
    id: "quick_email",
    key: "quick_email",
    title: "Email Security",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "quick_email",
        text: "How is your company email protected from phishing and scam messages?",
        type: "singleselect",
        domain: "email",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 9,
        insuranceCritical: true,
        tooltip: {
          explanation:
            "Email is the number one attack vector for small businesses. Phishing, business email compromise, and credential theft almost always start with an email. Advanced filtering catches threats that basic spam filters miss. Insurance carriers also look for DMARC, SPF, and DKIM records, which are technical settings on your domain that prevent attackers from sending emails that look like they came from you.",
          insurerNote:
            "Carriers specifically ask about email filtering, impersonation protection, and email authentication (DMARC, SPF, DKIM records).",
          controlSlug: "email-security",
        },
        options: [
          { label: "We have advanced email filtering that catches phishing, impersonation attempts, and dangerous links automatically", weight: 1.0 },
          { label: "We use the built-in filtering from our email provider (Microsoft 365 or Google Workspace defaults)", weight: 0.5 },
          { label: "We have basic spam filtering only", weight: 0.2 },
          { label: "No additional protection beyond what comes with our email service", weight: 0.1 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Ask your IT provider: 'Do we have advanced email filtering, and are our email authentication records set up?' You can also check your own domain for free at dmarcian.com/dmarc-inspector.",
          },
        ],
      },
    ],
  },
  {
    id: "quick_ir",
    key: "quick_ir",
    title: "Incident Response",
    nistCategory: "RS.RP",
    questions: [
      {
        key: "quick_ir",
        text: "Does your organization have a written plan for what to do if you experience a cyberattack or data breach?",
        type: "singleselect",
        domain: "incident_response",
        quickAssessment: true,
        nistFunction: "Respond",
        cisControl: 17,
        insuranceCritical: true,
        tooltip: {
          explanation:
            "An incident response plan defines who does what when something goes wrong. It includes contact information, escalation steps, and procedures for containing damage. Without one, the first hours of a breach are spent figuring out what to do instead of doing it.",
          insurerNote:
            "Beazley, Coalition, and most carriers explicitly ask whether you have an incident response plan. Having a tested plan can reduce claim payouts by up to 35%.",
          controlSlug: "incident-response-plan",
        },
        options: [
          { label: "Yes, we have a written plan that has been tested or rehearsed within the past year", weight: 1.0 },
          { label: "Yes, we have a written plan but it has not been tested recently", weight: 0.6 },
          { label: "We have informal procedures but nothing written down", weight: 0.25 },
          { label: "No, we do not have any incident response plan", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "This is something you can find out fast. Ask your leadership team: 'If we got hit with ransomware tomorrow, is there a document that tells us who to call first?' If no one can point to one, there is no plan.",
          },
        ],
      },
    ],
  },
  {
    id: "quick_training",
    key: "quick_training",
    title: "Security Awareness",
    nistCategory: "PR.AT",
    questions: [
      {
        key: "quick_training",
        text: "Do employees receive cybersecurity awareness training?",
        type: "singleselect",
        domain: "training",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 14,
        insuranceCritical: true,
        tooltip: {
          explanation:
            "Security awareness training teaches employees to recognize phishing emails, social engineering, and other common attacks. Regular training with simulated phishing tests is far more effective than a one-time presentation.",
          insurerNote:
            "Most carriers ask about training frequency and whether you conduct phishing simulations. Annual training is the minimum expectation.",
          controlSlug: "security-awareness-training",
        },
        options: [
          { label: "Regular training (at least quarterly) with simulated phishing tests", weight: 1.0 },
          { label: "Annual training for all employees", weight: 0.6 },
          { label: "Training during onboarding only", weight: 0.3 },
          { label: "No formal security training", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Ask your team: 'When was the last time anyone did cybersecurity training?' If no one can remember, or if it was only at hire, that is the answer.",
          },
        ],
      },
    ],
  },
  {
    id: "quick_patching",
    key: "quick_patching",
    title: "Patch Management",
    nistCategory: "PR.IP",
    questions: [
      {
        key: "quick_patching",
        text: "How does your business keep its software and systems up to date?",
        type: "singleselect",
        domain: "patching",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 7,
        insuranceCritical: true,
        tooltip: {
          explanation:
            "Software vendors release security updates (sometimes called patches) to fix known vulnerabilities. Delaying updates leaves those vulnerabilities open for attackers to exploit. Critical security updates should be applied within 14 days.",
          insurerNote:
            "Carriers ask about patching cadence. Unpatched systems are a top contributor to successful ransomware attacks and frequently cited in claim denials.",
          controlSlug: "patch-management",
        },
        options: [
          { label: "Automated patching with a policy to apply critical patches within 14 days", weight: 1.0 },
          { label: "Regular manual updates, usually within 30 days", weight: 0.6 },
          { label: "Updates are applied when someone remembers or when problems arise", weight: 0.2 },
          { label: "We do not have a patching process", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Check any Windows computer: go to Settings > Windows Update. If there are pending updates older than 14 days, updates are behind. Or ask your IT provider: 'What is our policy for applying critical security updates?'",
          },
        ],
      },
    ],
  },
  {
    id: "quick_access",
    key: "quick_access",
    title: "Access Management",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "quick_privileged_access",
        text: "Who has the highest level of access to your company's systems, and how is that access controlled?",
        type: "singleselect",
        domain: "privileged_access",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 5,
        insuranceCritical: true,
        tooltip: {
          explanation:
            "Admin accounts have the highest level of access to your systems. If compromised, an attacker can do anything: install software, access all data, create new accounts. These accounts need extra protection and should only be used when necessary.",
          insurerNote:
            "Privileged access management is a standard underwriting question. Shared admin passwords and unrestricted admin access are red flags for carriers.",
          controlSlug: "privileged-access-management",
        },
        options: [
          { label: "Specific people have separate admin accounts with extra security, used only when needed", weight: 1.0 },
          { label: "A few people have admin access on their regular accounts with extra login security", weight: 0.5 },
          { label: "We have a shared admin account that multiple people use", weight: 0.15 },
          { label: "Most employees can install software and change settings on their own computers", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Ask your IT provider: 'How many people have admin access, and do they use dedicated admin accounts?' If the answer is 'everyone is an admin' or 'we share one admin login,' that is the gap.",
          },
        ],
      },
    ],
  },
  {
    id: "quick_network",
    key: "quick_network",
    title: "Network Security",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "quick_network",
        text: "How is your business network protected from unauthorized access?",
        type: "singleselect",
        domain: "network",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 12,
        tooltip: {
          explanation:
            "Network security includes firewalls, network segmentation (separating sensitive systems from general use), and monitoring for unusual activity. A properly configured firewall is the front door lock of your digital environment.",
          insurerNote:
            "Carriers ask about firewall presence and configuration, VPN usage for remote access, and whether sensitive systems are segmented from the general network.",
          controlSlug: "network-security",
        },
        options: [
          { label: "Business-grade firewall, secure remote access (VPN), and our network separates sensitive systems from general use", weight: 1.0 },
          { label: "Business-grade firewall and VPN for remote workers, but everything is on one network", weight: 0.6 },
          { label: "We use the router provided by our internet company with no additional protection", weight: 0.25 },
          { label: "No dedicated firewall or network security", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Look at the device connecting your office to the internet. If it is branded Comcast, AT&T, Spectrum, or similar, it is likely a consumer router. Ask your IT provider: 'What firewall do we have, and how do remote employees connect?'",
          },
        ],
      },
    ],
  },
  {
    id: "quick_encryption",
    key: "quick_encryption",
    title: "Data Protection",
    nistCategory: "PR.DS",
    questions: [
      {
        key: "quick_encryption",
        text: "If a company laptop were lost or stolen, could someone access the data on it?",
        type: "singleselect",
        domain: "encryption",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 3,
        tooltip: {
          explanation:
            "Encryption scrambles the data on a device so that even if someone physically steals the laptop, they cannot read the files without the login password. On Windows this is called BitLocker, on Mac it is called FileVault. Both are free and built-in.",
          insurerNote:
            "Encryption at rest and in transit is a standard underwriting requirement, especially for organizations handling health records, financial data, or personally identifiable information.",
          controlSlug: "data-encryption",
        },
        options: [
          { label: "No, all our devices are encrypted and data cannot be accessed without a login", weight: 1.0 },
          { label: "Most devices are encrypted but we are not sure about all of them", weight: 0.5 },
          { label: "Some devices might be encrypted but we have not checked", weight: 0.2 },
          { label: "We have not set up encryption on our devices", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Check any company laptop. On Windows, search for 'BitLocker' in Settings and look for 'BitLocker is on'. On Mac, go to System Settings > Privacy & Security > FileVault.",
          },
        ],
      },
    ],
  },
  {
    id: "quick_vendor",
    key: "quick_vendor",
    title: "Vendor and Third-Party Risk",
    nistCategory: "GV.SC",
    questions: [
      {
        key: "quick_vendor_risk",
        text: "Before signing up for new software or giving a contractor access to company data, do you check whether they handle data securely?",
        type: "singleselect",
        domain: "vendor_risk",
        quickAssessment: true,
        nistFunction: "Govern",
        cisControl: 15,
        tooltip: {
          explanation:
            "Your business is only as secure as the weakest vendor with access to your data. Vendor risk management means checking whether your software providers, cloud services, and contractors meet basic security standards before giving them access.",
          insurerNote:
            "Third-party breaches are a growing source of claims. Carriers increasingly ask whether you assess vendor security and have data processing agreements in place.",
          controlSlug: "vendor-risk-management",
        },
        options: [
          { label: "Yes, we have a formal review process and require vendors to meet security standards before we give them access", weight: 1.0 },
          { label: "We check for basic security certifications before adopting major tools", weight: 0.6 },
          { label: "We think about it informally but do not have a process", weight: 0.25 },
          { label: "We do not evaluate vendor security", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Start here: review your recurring software charges and list every vendor with access to company data. For each, check whether they advertise a security certification like SOC 2 or ISO 27001 on their website.",
          },
        ],
      },
    ],
  },
  {
    id: "quick_physical",
    key: "quick_physical",
    title: "Physical and Device Security",
    nistCategory: "PR.AC",
    questions: [
      {
        key: "quick_device_management",
        text: "How does your organization manage and secure company devices (laptops, phones, tablets)?",
        type: "singleselect",
        domain: "device_management",
        quickAssessment: true,
        nistFunction: "Protect",
        cisControl: 1,
        tooltip: {
          explanation:
            "Mobile device management (MDM) gives your organization the ability to enforce security policies on every device that accesses company data, including the ability to remotely wipe a lost or stolen device.",
          insurerNote:
            "Carriers ask about device inventory and remote wipe capability. Lost or stolen devices with unencrypted company data are a common breach source for SMBs.",
          controlSlug: "device-management",
        },
        options: [
          { label: "All devices are centrally managed with encryption, security policies, and we can remotely wipe a lost device", weight: 1.0 },
          { label: "Company devices have encryption and basic security rules but no central management tool", weight: 0.55 },
          { label: "Employees mostly use personal devices with minimal company security controls", weight: 0.2 },
          { label: "No device management or security policies", weight: 0.0 },
          {
            label: "I don't know",
            weight: 0.0,
            flag: "discovery",
            hint:
              "Ask your IT provider: 'If an employee lost their laptop today, could we remotely wipe the company data from it?' If yes, you likely have device management. If no, you need it.",
          },
        ],
      },
    ],
  },
]

// Hardcoded discovery guides for "I don't know" answers, keyed by question key.
// Used on the results page. The question-level `hint` is used inline during
// the assessment.
export const QUICK_DISCOVERY_GUIDES = {
  quick_mfa:
    "Ask your IT provider: 'Is multi-factor authentication required for our email and all cloud applications?' If you use Microsoft 365, go to admin.microsoft.com > Security > MFA to check. If you use Google Workspace, go to admin.google.com > Security > 2-Step Verification.",
  quick_edr:
    "Ask your IT provider: 'What endpoint protection software is installed on our devices, and is it EDR or traditional antivirus?' Check any computer: on Windows, go to Settings > Privacy & Security > Windows Security. If it only says 'Microsoft Defender Antivirus' with no mention of 'Defender for Endpoint,' you likely have basic protection only.",
  quick_backup:
    "Ask your IT provider: 'Where are our backups stored, how often do they run, and when was the last time we tested a restore?' If they cannot answer the restore test question, that is a significant gap.",
  quick_email:
    "Ask your IT provider: 'Do we have advanced email filtering beyond the default, and are our DMARC, SPF, and DKIM records configured?' You can check your own DMARC record for free at dmarcian.com/dmarc-inspector by entering your domain.",
  quick_ir:
    "This is something you can start yourself. A basic incident response plan answers: Who do we call first? How do we contain the damage? Who communicates with customers? Do we have cyber insurance and what is the claim number? Our Policy Library includes a template you can customize.",
  quick_training:
    "Ask your team: 'When was the last time anyone received cybersecurity training?' If no one can remember, or if it was only during onboarding, this is a gap. Solutions like KnowBe4, Proofpoint Security Awareness, and Ninjio start at $3 to $5 per user per month.",
  quick_patching:
    "Ask your IT provider: 'Are automatic updates enabled on all workstations and servers, and what is our policy for critical security patches?' On any Windows machine, go to Settings > Windows Update to check if updates are current.",
  quick_privileged_access:
    "Ask your IT provider: 'How many people have admin access to our systems, and do they use separate admin accounts or their daily accounts?' If the answer is 'everyone is an admin' or 'we use one shared admin account,' this is a critical gap.",
  quick_network:
    "Ask your IT provider: 'What firewall do we have, is our network segmented, and how do employees connect remotely?' If remote access is through anything other than a VPN or zero-trust solution, flag this as a priority.",
  quick_encryption:
    "Check any company laptop: on Windows, search for 'BitLocker' in Settings. If it says 'BitLocker is off,' your hard drive is not encrypted. On Mac, go to System Settings > Privacy & Security > FileVault. Ask your IT provider about encryption on servers and cloud storage.",
  quick_vendor_risk:
    "Make a list of every software tool your business pays for. For each one, check: Does it have SOC 2 or ISO 27001 certification? Does it offer MFA? Where is your data stored? Start with the tools that hold your most sensitive data (financial, health, legal, customer information).",
  quick_device_management:
    "Ask your IT provider: 'If an employee loses their laptop tomorrow, can we remotely wipe the company data from it?' If the answer is no, you need mobile device management (MDM). Microsoft Intune is included with Microsoft 365 Business Premium.",
}
