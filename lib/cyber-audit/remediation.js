/**
 * Remediation engine.
 *
 * Takes a list of gaps (from getGaps()) and returns a prioritized remediation
 * plan. Each gap is matched against REMEDIATION_DATABASE by its controlSlug.
 * If an exact match is not found, we fall back to keyword matching against
 * the control slug so every gap gets at least a reasonable entry.
 */

export const REMEDIATION_DATABASE = {
  "multi-factor-authentication": {
    priority: "critical",
    insuranceImpact:
      "This control is specifically asked about on Coalition, Cowbell, Travelers, and Beazley applications. Missing MFA is the number one reason applications are denied.",
    estimatedEffort: "1 to 3 days",
    estimatedCost: "Free to $6 per user per month",
    steps: [
      {
        title: "Enable MFA in your email platform",
        detail:
          "For Microsoft 365: Go to admin.microsoft.com > Settings > Org Settings > Security & Privacy > Multi-factor authentication. Click 'Configure multifactor authentication' and enable for all users. For Google Workspace: Go to admin.google.com > Security > 2-Step Verification > Allow users to turn on 2-Step Verification, then enforce it.",
        verifyStep:
          "Log out and log back in. You should be prompted for a second factor. If you are not, MFA is not enforced.",
      },
      {
        title: "Enforce MFA for remote access",
        detail:
          "If you use a VPN, ensure MFA is required for VPN connections. If you use Remote Desktop (RDP), never expose it directly to the internet. Use a VPN with MFA or a zero-trust solution instead.",
        verifyStep:
          "Try connecting to your VPN from outside the office. You should be required to provide a second factor.",
      },
      {
        title: "Disable legacy authentication protocols",
        detail:
          "Legacy protocols (POP, IMAP, SMTP basic auth) bypass MFA entirely. In Microsoft 365: Azure AD > Security > Conditional Access > Create a policy to block legacy authentication. In Google Workspace: Admin > Security > Less secure apps > Disable.",
        verifyStep:
          "In Microsoft 365, check the Azure AD sign-in logs for any 'legacy authentication' entries. There should be none after blocking.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Is MFA enforced on all user accounts, including email, VPN, and any cloud applications? Are legacy authentication protocols blocked?'",
    discoveryGuide:
      "To check yourself in Microsoft 365: Go to admin.microsoft.com > Active users > select any user > Manage multifactor authentication. The status column shows whether MFA is enforced, enabled, or disabled for each user.",
  },

  "endpoint-detection-response": {
    priority: "critical",
    insuranceImpact:
      "Most carriers now require EDR specifically, not traditional antivirus. Coalition's claims data shows that organizations with EDR experience 60% lower claim severity.",
    estimatedEffort: "1 to 5 days depending on number of devices",
    estimatedCost: "$5 to $15 per device per month",
    steps: [
      {
        title: "Identify your current endpoint protection",
        detail:
          "On any Windows device, go to Settings > Privacy & Security > Windows Security > Virus & threat protection. Note the product name. If it only says 'Microsoft Defender Antivirus' without mentioning 'Defender for Endpoint' or 'Defender for Business,' you have basic antivirus only, not EDR.",
        verifyStep:
          "Check 3 to 5 devices across the organization. All should show the same protection product.",
      },
      {
        title: "Evaluate EDR options appropriate for your size",
        detail:
          "For businesses under 50 employees: Microsoft Defender for Business (included in Microsoft 365 Business Premium at $22 per user per month), CrowdStrike Falcon Go ($4.99 per device per month), or SentinelOne Singularity. For businesses 50 to 250: CrowdStrike Falcon Pro or SentinelOne with managed detection and response (MDR).",
        verifyStep:
          "Confirm the solution is classified as EDR or XDR, not traditional antivirus, before purchasing.",
      },
      {
        title: "Deploy to all endpoints",
        detail:
          "Every device that accesses company data needs EDR protection, including employee laptops, desktops, and servers. Do not skip personal devices used for work (BYOD). Most EDR solutions have a central console where you can verify coverage across all devices.",
        verifyStep:
          "In the EDR console, compare the number of enrolled devices against your total device count. They should match.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'What endpoint protection product is on our devices? Is it EDR or traditional antivirus? What tier or license level are we on? Are all devices enrolled, including any personal devices used for work?'",
    discoveryGuide:
      "To find out which CrowdStrike tier you're on, ask your IT provider for access to the Falcon console and check the subscription page. For Microsoft Defender, your Microsoft 365 license determines whether you have basic antivirus (Business Basic/Standard) or full EDR (Business Premium).",
  },

  "data-backup-recovery": {
    priority: "critical",
    insuranceImpact:
      "Backup status is a standard underwriting question. Untested backups are treated nearly the same as no backups, since recovery failure during a ransomware event is common.",
    estimatedEffort: "1 to 2 days for setup, ongoing testing quarterly",
    estimatedCost: "$10 to $50 per month for cloud backup",
    steps: [
      {
        title: "Verify backup coverage",
        detail:
          "Make a list of all critical data: financial records, customer data, email, documents, databases, application data. For each category, confirm where the backup is stored and when it last ran. Cloud services like Microsoft 365 and Google Workspace do NOT automatically back up your data in a recoverable way. You need a third-party backup solution.",
        verifyStep:
          "You should be able to point to a specific backup solution and a specific last-run timestamp for every category of critical data.",
      },
      {
        title: "Ensure backups are stored separately from your main network",
        detail:
          "Ransomware will encrypt any backup it can reach. Backups must be stored in a location that is not accessible from your main network, either in a separate cloud account, an offsite location, or using immutable storage that cannot be modified or deleted even by an admin.",
        verifyStep:
          "Ask: 'If ransomware encrypted every device and server on our network right now, would our backups survive?' If the answer is uncertain, this is your top priority.",
      },
      {
        title: "Test a restore",
        detail:
          "Pick a specific file, folder, or database. Restore it to a different location. Verify the data is complete and usable. Do this quarterly at minimum. Document the test including what was restored, how long it took, and whether it was successful.",
        verifyStep:
          "You should have a written record of the last restore test, including the date and what was restored. If you have never tested a restore, schedule one this week.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Where are our backups stored? How often do they run? When was the last time we tested a full restore? Are our backups protected from ransomware with immutability or air-gapping?'",
    discoveryGuide:
      "Check your backup situation: For Microsoft 365, go to admin.microsoft.com and look for any third-party backup service (Veeam, Datto, Acronis). If you see nothing, your Microsoft 365 data is likely not backed up beyond Microsoft's limited retention. For on-premises servers, ask your IT provider for the backup console login.",
  },

  "email-security": {
    priority: "high",
    insuranceImpact:
      "Email is the primary attack vector in over 90% of breaches. Carriers specifically ask about email filtering and authentication records (DMARC/SPF/DKIM).",
    estimatedEffort: "2 to 4 hours for email authentication, 1 to 2 days for advanced filtering",
    estimatedCost: "Free for DMARC/SPF/DKIM, $2 to $5 per user per month for advanced filtering",
    steps: [
      {
        title: "Configure DMARC, SPF, and DKIM records",
        detail:
          "These are DNS records that prevent attackers from sending emails that appear to come from your domain. Check your current status for free at dmarcian.com. SPF tells email servers which IP addresses are allowed to send email for your domain. DKIM adds a digital signature. DMARC tells receiving servers what to do with emails that fail SPF/DKIM checks.",
        verifyStep:
          "Go to dmarcian.com/dmarc-inspector and enter your domain. You should see valid SPF, DKIM, and DMARC records. DMARC policy should be set to 'quarantine' or 'reject,' not 'none.'",
      },
      {
        title: "Enable advanced email filtering",
        detail:
          "If you use Microsoft 365: upgrade to Business Premium for Defender for Office 365, which includes anti-phishing, safe links, and safe attachments. If you use Google Workspace: enable the advanced phishing and malware protection in Admin > Security. Third-party options include Proofpoint Essentials, Mimecast, and Barracuda.",
        verifyStep:
          "Send a test phishing email to yourself using a service like knowbe4.com's phishing test. It should be caught by your filter.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Are our DMARC, SPF, and DKIM records configured? What email filtering solution do we use beyond the platform defaults? Do we have protection against impersonation and business email compromise attacks?'",
    discoveryGuide:
      "Check your email authentication right now: Go to dmarcian.com/dmarc-inspector and enter your company's domain name. This free tool will show you whether your SPF, DKIM, and DMARC records are properly configured.",
  },

  "incident-response-plan": {
    priority: "high",
    insuranceImpact:
      "Having a tested incident response plan can reduce claim payouts by up to 35%. Beazley and Coalition explicitly ask whether you have one.",
    estimatedEffort: "2 to 4 hours for initial plan, 2 hours for tabletop exercise",
    estimatedCost: "Free (use our Policy Library template)",
    steps: [
      {
        title: "Create or download an incident response plan",
        detail:
          "Your plan should cover: who is the incident commander, who handles communications, who contacts your insurance carrier, who contacts law enforcement if needed, and step-by-step containment procedures. Our Policy Library includes a customizable template.",
        verifyStep:
          "Print the plan. Can a non-technical person follow it? Does everyone named in it know their role?",
      },
      {
        title: "Distribute the plan and train on it",
        detail:
          "Everyone named in the plan needs a copy and needs to understand their role. Store the plan somewhere accessible even if your network is down (printed copies, personal phones, a separate cloud account).",
        verifyStep:
          "Ask any person named in the plan: 'What would you do in the first 15 minutes of a ransomware attack?' They should be able to answer without looking it up.",
      },
      {
        title: "Run a tabletop exercise",
        detail:
          "A tabletop exercise is a structured discussion where you walk through a hypothetical incident scenario. Walk through each step of your plan. Note where the plan breaks down.",
        verifyStep:
          "After the exercise, update the plan based on what you learned. Document that the exercise occurred, who participated, and what was improved.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Do we have an incident response plan? Has it been tested? If we called you at 2 AM during a ransomware attack, what would you do in the first 30 minutes?'",
    discoveryGuide:
      "Start here: Go to our Policy Library and download the Incident Response Plan template. Customize it with your company's information, contacts, and procedures. Then schedule a 1 hour tabletop exercise with your leadership team within the next 30 days.",
  },

  "patch-management": {
    priority: "high",
    insuranceImpact:
      "Unpatched systems are a top contributor to successful ransomware attacks. Carriers ask about patching cadence and many run external scans to verify.",
    estimatedEffort: "2 to 4 hours for setup, ongoing maintenance",
    estimatedCost: "Free (built into most operating systems and management tools)",
    steps: [
      {
        title: "Enable automatic updates on all workstations",
        detail:
          "On Windows: Settings > Windows Update > Advanced options > Enable 'Receive updates for other Microsoft products.' On Mac: System Settings > General > Software Update > Enable automatic updates. For managed environments, use Microsoft Intune, WSUS, or your RMM tool to enforce update policies.",
        verifyStep:
          "Check 5 random workstations. All should show 'You are up to date' in their update settings with no pending critical patches older than 14 days.",
      },
      {
        title: "Establish a critical patch SLA",
        detail:
          "Define a policy: critical security patches (CVSS 9.0 or higher) must be applied within 14 days. High severity (CVSS 7.0 to 8.9) within 30 days. Medium and below within 90 days. Document this policy and share it with your IT provider.",
        verifyStep:
          "Ask your IT provider to show you a report of current patch compliance. What percentage of devices are fully patched?",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'What is our patching policy? How quickly are critical patches applied? Can you show me a compliance report for our devices?'",
    discoveryGuide:
      "Check any Windows computer right now: Go to Settings > Windows Update. If it says 'Updates are available' with items dated more than 14 days ago, your patching is behind.",
  },

  "security-awareness-training": {
    priority: "medium",
    insuranceImpact:
      "Most carriers ask about training frequency. Organizations with regular training and phishing simulations experience 70% fewer successful phishing attacks.",
    estimatedEffort: "2 to 4 hours to set up, ongoing 15 to 30 minutes per employee per month",
    estimatedCost: "$3 to $8 per user per month",
    steps: [
      {
        title: "Select a training platform",
        detail:
          "KnowBe4 is the most widely used for SMBs ($3 to $5 per user per month). Alternatives include Proofpoint Security Awareness Training, Ninjio (short video format), and Arctic Wolf Managed Security Awareness. All include automated phishing simulations.",
        verifyStep:
          "Sign up for a trial and send a test phishing campaign to your leadership team. The results will demonstrate why training matters.",
      },
      {
        title: "Establish a training schedule",
        detail:
          "At minimum: annual training for all employees with monthly phishing simulations. Better: quarterly training modules with monthly phishing tests and immediate coaching when someone fails a test.",
        verifyStep:
          "After 3 months, compare your phishing simulation click rates. They should be decreasing.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Do we have security awareness training? How often are phishing simulations sent? What is our current click rate?'",
    discoveryGuide:
      "Ask your team: 'Has anyone received cybersecurity training in the past year?' If the answer is no, this is a gap. Most platforms offer free trials so you can evaluate before committing.",
  },

  "privileged-access-management": {
    priority: "high",
    insuranceImpact:
      "Shared admin accounts and unrestricted admin access are red flags for carriers. Privileged access management is a standard underwriting question.",
    estimatedEffort: "1 to 3 days",
    estimatedCost: "Free (process change, not product purchase)",
    steps: [
      {
        title: "Separate admin accounts from daily-use accounts",
        detail:
          "Every person who needs admin access should have two accounts: one for daily email and work (no admin rights), and one for administrative tasks only. The admin account should have MFA enforced and should only be used when performing admin tasks.",
        verifyStep:
          "Check your admin user list: admin.microsoft.com > Active users > filter by admin roles. Each admin account should be a dedicated admin account (e.g., admin-john@company.com), not the person's daily email account.",
      },
      {
        title: "Audit and reduce admin access",
        detail:
          "List everyone with admin access. For each person, ask: 'Do they need this level of access for their job?' Remove admin access from anyone who does not need it. Most employees should not have local admin rights on their workstations.",
        verifyStep:
          "The number of admin accounts should be as small as possible. A company with 50 employees should have 2 to 5 admin accounts, not 20.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'How many people have admin access to our Microsoft 365 or Google Workspace? Do they use separate admin accounts? Is MFA required on all admin accounts?'",
    discoveryGuide:
      "Check yourself in Microsoft 365: Go to admin.microsoft.com > Active Users > filter by 'Global admin' role. Count the number of accounts. If it is more than 3 to 5, or if any are shared/generic accounts, this needs to be addressed.",
  },

  "network-security": {
    priority: "medium",
    insuranceImpact:
      "Carriers ask about firewall presence and configuration. Some carriers run external vulnerability scans before binding coverage.",
    estimatedEffort: "Variable, depends on current infrastructure",
    estimatedCost: "$50 to $200 per month for business-grade firewall",
    steps: [
      {
        title: "Verify you have a business-grade firewall",
        detail:
          "Consumer routers from your ISP are not firewalls. Business-grade options include Fortinet FortiGate, SonicWall, Meraki MX, or pfSense. Your firewall should have active threat subscriptions (IPS/IDS, web filtering, application control).",
        verifyStep:
          "Can you log into a firewall management console? If the only device between your network and the internet is the box your ISP gave you, you likely do not have a business-grade firewall.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'What firewall do we have? Is it under active support with current firmware? Are threat prevention subscriptions active?'",
    discoveryGuide:
      "Look at the device connected to your internet connection. If it says 'Comcast,' 'AT&T,' 'Spectrum,' or similar ISP branding, it is likely a consumer router, not a business firewall.",
  },

  "data-encryption": {
    priority: "medium",
    insuranceImpact:
      "Encryption at rest and in transit is a standard underwriting requirement for any organization handling PII, health records, or financial data.",
    estimatedEffort: "1 to 2 days",
    estimatedCost: "Free (built into operating systems)",
    steps: [
      {
        title: "Enable full-disk encryption on all devices",
        detail:
          "Windows: Enable BitLocker (requires Pro or Enterprise edition). Mac: Enable FileVault. Both are free and built into the operating system. For managed environments, use Intune or your MDM to enforce encryption policies.",
        verifyStep:
          "On Windows: Search for 'BitLocker' and it should say 'BitLocker is on' for the C: drive. On Mac: System Settings > Privacy & Security > FileVault should say 'FileVault is turned on.'",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Is full-disk encryption enabled on all company devices? Are our servers encrypted at rest? Is all data in transit using TLS 1.2 or higher?'",
    discoveryGuide:
      "Check any company laptop: On Windows, search for 'BitLocker' in Settings. On Mac, go to System Settings > Privacy & Security > FileVault. If encryption is off, this should be enabled immediately.",
  },

  "vendor-risk-management": {
    priority: "medium",
    insuranceImpact:
      "Third-party breaches are a growing source of claims. Carriers increasingly ask whether you assess vendor security.",
    estimatedEffort: "4 to 8 hours for initial vendor inventory",
    estimatedCost: "Free (process-based)",
    steps: [
      {
        title: "Create a vendor inventory",
        detail:
          "List every software tool, cloud service, and contractor that has access to your company data. For each, note: what data they can access, whether they have SOC 2 or ISO 27001 certification, whether they offer MFA, and where your data is stored.",
        verifyStep:
          "Your inventory should include at minimum: email provider, file storage, accounting software, CRM, HR/payroll, and any industry-specific applications.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Can you give me a list of all third-party services that have access to our data or our network? Do any of them have admin-level access?'",
    discoveryGuide:
      "Start with your bank and credit card statements. Every recurring software charge is a vendor. Then check: what cloud services are your employees signed into? This is your vendor list.",
  },

  "device-management": {
    priority: "medium",
    insuranceImpact:
      "Carriers ask about device inventory and remote wipe capability. Lost or stolen unencrypted devices are a common breach source.",
    estimatedEffort: "1 to 3 days",
    estimatedCost: "Free with Microsoft 365 Business Premium, or $3 to $8 per device per month for standalone MDM",
    steps: [
      {
        title: "Implement mobile device management (MDM)",
        detail:
          "If you use Microsoft 365 Business Premium, you already have Microsoft Intune included. Enable it: Go to intune.microsoft.com > Devices > Enrollment. Set up device compliance policies requiring encryption, screen lock, and current OS version. Alternatives: Jamf (Mac-focused), Mosyle, or Kandji.",
        verifyStep:
          "In the MDM console, verify every company device shows as enrolled and compliant. The device count should match your actual device inventory.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Are all company devices enrolled in a device management solution? Can we remotely wipe a lost device? Are personal devices used for work subject to any security policies?'",
    discoveryGuide:
      "If you use Microsoft 365 Business Premium, you already have Intune available. Go to intune.microsoft.com and check if any devices are enrolled. If the console is empty, MDM is not set up.",
  },

  "asset-management": {
    priority: "medium",
    insuranceImpact:
      "You cannot secure what you cannot see. Carriers ask about asset inventory as a baseline maturity indicator. End-of-life hardware is increasingly flagged in underwriting.",
    estimatedEffort: "4 to 8 hours for initial inventory",
    estimatedCost: "Free (spreadsheet) to $5 per device per month for automated asset tracking",
    steps: [
      {
        title: "Build a hardware and software inventory",
        detail:
          "List every workstation, server, network device, and mobile device that accesses company data. Record: device model, OS version, last patch date, primary user, and purchase date. For software, list every application installed across the environment with its version.",
        verifyStep:
          "Cross-check your inventory against actual devices at least quarterly. Devices that show up in use but not in the inventory are a red flag.",
      },
      {
        title: "Identify end-of-life hardware and software",
        detail:
          "Any device running Windows 10 (end of support October 2025), Server 2012, or network equipment past its vendor support date should be on a replacement plan. Document end-of-life items with a target replacement date.",
        verifyStep:
          "Your inventory should have no items past their vendor support date. If it does, they should have a planned replacement date within 6 months.",
      },
    ],
    mspQuestion:
      "Ask your IT provider: 'Can you provide a current hardware and software inventory for our organization, including age and support status of each item?'",
    discoveryGuide:
      "Start with a simple spreadsheet: columns for device name, type (laptop/desktop/server/network), OS version, age, and primary user. Ask each employee what devices they use for work and add them to the list.",
  },
}

/**
 * Keyword fallback map. For gaps whose controlSlug does not exactly match an
 * entry in REMEDIATION_DATABASE, we use these keyword substrings to pick the
 * closest canonical entry.
 */
const KEYWORD_FALLBACK = [
  { keywords: ["mfa", "multi-factor", "2fa", "two-factor"], slug: "multi-factor-authentication" },
  { keywords: ["edr", "endpoint", "antivirus", "xdr"], slug: "endpoint-detection-response" },
  { keywords: ["backup", "restore", "recovery", "disaster"], slug: "data-backup-recovery" },
  { keywords: ["email", "phishing-filter", "dmarc", "spf", "dkim"], slug: "email-security" },
  { keywords: ["incident", "ir-plan", "response-plan", "tabletop"], slug: "incident-response-plan" },
  { keywords: ["patch", "update", "vulnerability-management"], slug: "patch-management" },
  { keywords: ["training", "awareness", "phishing-training"], slug: "security-awareness-training" },
  { keywords: ["privileged", "admin-account", "least-privilege", "pam"], slug: "privileged-access-management" },
  { keywords: ["firewall", "network", "segmentation", "vpn"], slug: "network-security" },
  { keywords: ["encryption", "bitlocker", "filevault", "tls"], slug: "data-encryption" },
  { keywords: ["vendor", "third-party", "supply-chain"], slug: "vendor-risk-management" },
  { keywords: ["device-management", "mdm", "byod", "mobile-device"], slug: "device-management" },
  { keywords: ["asset", "inventory", "infrastructure", "infra", "hardware"], slug: "asset-management" },
  { keywords: ["password", "credential"], slug: "multi-factor-authentication" },
  { keywords: ["access-review", "offboarding", "employee-access"], slug: "privileged-access-management" },
]

function findByKeyword(slug) {
  if (!slug) return null
  const lower = slug.toLowerCase()
  for (const entry of KEYWORD_FALLBACK) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return REMEDIATION_DATABASE[entry.slug]
    }
  }
  return null
}

function genericRemediation(gap) {
  return {
    priority: "medium",
    insuranceImpact:
      "Insurance carriers look for evidence that this control is implemented and maintained. Missing or weak implementation may affect underwriting decisions.",
    estimatedEffort: "Varies",
    estimatedCost: "Varies",
    steps: [
      {
        title: "Review this control area",
        detail: `Your answer to '${gap.questionText}' indicates a gap in this area. Review the associated control in our Controls Library for guidance on how to improve your posture.`,
        verifyStep:
          "Document your current state, target state, and the specific actions needed to close the gap. Assign an owner and a target completion date.",
      },
    ],
    mspQuestion: `Ask your IT provider: 'Can you help us understand our current state on ${gap.section || "this control"} and what it would take to bring us to a fully implemented state?'`,
    discoveryGuide:
      "Read the related entry in our Controls Library for plain-English guidance on what this control covers and why it matters.",
  }
}

export function getRemediationPlan(gaps, industry) {
  if (!Array.isArray(gaps) || gaps.length === 0) return []

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }

  return gaps
    .map((gap) => {
      const slug = gap.controlSlug
      let remediation = slug ? REMEDIATION_DATABASE[slug] : null
      if (!remediation) remediation = findByKeyword(slug)
      if (!remediation) remediation = genericRemediation(gap)

      // "I don't know" answers get discovery-first framing
      const isDiscovery =
        typeof gap.answer === "string" && gap.answer.toLowerCase().includes("don't know")

      return {
        ...gap,
        isDiscovery,
        remediation,
      }
    })
    .sort((a, b) => {
      const aPri = priorityOrder[a.remediation.priority] ?? 99
      const bPri = priorityOrder[b.remediation.priority] ?? 99
      return aPri - bPri
    })
}
