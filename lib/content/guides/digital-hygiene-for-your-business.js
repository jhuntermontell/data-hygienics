export default {
  kind: "guide",
  slug: "digital-hygiene-for-your-business",
  title: "Digital hygiene for your business: the 1-50 person baseline",
  metaTitle: "Digital Hygiene for Small Business | Data Hygienics",
  metaDescription: "The 1-50 person business baseline: MFA, a team password manager, updates, tested backups, payment checks, an AI rule, offboarding and an incident plan.",
  audience: ["business"],
  pillars: ["hygiene"],
  tldr: "A small business's security baseline fits on one page: passkeys or multi-factor authentication (MFA) on every account, email and banking first; a shared password manager; automatic updates and endpoint protection; and backups you've actually restored from. Add a second-channel check before any payment change, a one-page AI rule, same-day offboarding and a short incident plan. Business email compromise alone drew $3.05 billion in reported losses to the FBI in 2025.[^fbi-ic3-2025]",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,

  timeToComplete: "4 hours to set up, then an hour a month",
  difficulty: "moderate",

  why: "You don't need a security team to cover the basics that stop everyday, untargeted attacks; you need one person who owns them. Small-business guidance from the Cybersecurity and Infrastructure Security Agency (CISA), the starter set (Implementation Group 1) of the Center for Internet Security (CIS) Controls, and the Small Business Quick-Start Guide to the National Institute of Standards and Technology (NIST) Cybersecurity Framework 2.0 all land on the same short list: strong sign-in, updates, backups, trained people and a plan.[^cisa-small-business-guidance-2024][^cis-controls-ig1-v8-1][^nist-csf-small-business-qsg-2024] AI makes old scams more convincing rather than different: in 2025, businesses told the FBI they lost more than $30 million to email-impersonation scams that involved AI.[^fbi-ic3-2025]",

  steps: [
    {
      title: "Make one person the owner and write down what you have",
      detail: [
        "Pick one person, often the owner or office manager, to own security and report on it at least monthly. CISA's guidance says the CEO should back that person visibly and personally drive MFA enrollment, because culture can't be delegated.[^cisa-small-business-guidance-2024]",
        "List your accounts (email, bank, payroll, accounting, cloud storage, domain registrar, social media), who has admin rights to each, and every laptop and phone that touches company data. NIST's quick-start guide starts the same way: decide who is responsible, and know what you'd lose if a system went down.[^nist-csf-small-business-qsg-2024]",
      ],
      verify: "You have a one-page list of accounts, admins and devices, with a named owner and the date it was last checked.",
    },
    {
      title: "Put passkeys or MFA on every account, email and banking first",
      detail: [
        "Turn on MFA, a second proof beyond the password, for every account that offers it. NIST calls MFA one of the fastest, cheapest protections you have and suggests starting with banking, accounting and tax, merchant, email, password manager and Google, Microsoft or Apple accounts.[^nist-csf-small-business-qsg-2024] CISA adds that administrator accounts must always have it.[^cisa-small-business-guidance-2024]",
        "Prefer phishing-resistant options, meaning passkeys or hardware security keys, which CISA recommends for small and medium businesses.[^cisa-secure-your-business-2026][^cisa-small-business-guidance-2024] In Microsoft 365 or Google Workspace, enforce MFA for everyone from the admin console instead of asking nicely, and check for gaps when people join or change phones.[^cisa-small-business-guidance-2024]",
      ],
      verify: "Your email platform's admin report (Microsoft or Google) shows every user enrolled in MFA, and your bank's portal requires a second factor for everyone who can move money.",
    },
    {
      title: "Give the team a password manager",
      detail: [
        "A business password manager gets passwords out of spreadsheets and sticky notes, lets you share logins by role, and makes offboarding faster. Bitwarden Teams costs $4 per user a month and 1Password Business $8.99, both billed annually; 1Password's Teams Starter Pack covers 10 people for $24.95 a month.[^bitwarden-business-pricing-2026][^onepassword-business-pricing-2026]",
        "Set up shared vaults by role, such as finance, operations and social media, and require everyone to use it for work accounts. NIST's quick-start guide recommends password managers alongside MFA, and changing every default manufacturer password.[^nist-csf-small-business-qsg-2024]",
      ],
      verify: "Every shared login lives in a shared vault, and the old password spreadsheet is deleted.",
    },
    {
      title: "Turn on automatic updates and endpoint protection",
      detail: [
        "Turn on automatic updates for operating systems, browsers and apps on every work device, and patch anything on CISA's Known Exploited Vulnerabilities catalog first. Remove administrator rights from everyday accounts and turn on full-disk encryption on laptops.[^cisa-small-business-guidance-2024][^nist-csf-small-business-qsg-2024]",
        "Run endpoint protection on every computer. On Microsoft 365, Defender for Business is included in Business Premium or sold alone for $3 per user a month.[^microsoft-365-business-pricing-2026] The office router and firewall need updates too.",
      ],
      verify: "Your device list shows every laptop updated within the past month, encrypted, and reporting to your endpoint protection.",
    },
    {
      title: "Back up, then prove you can restore",
      detail: [
        "Back up company data on a schedule, and keep at least one copy that ransomware can't reach, such as an offline drive or a backup service with version history. CISA tells small businesses to test both partial and full restores and to write the restore steps down.[^cisa-small-business-guidance-2024]",
        "Don't assume your email and file platform is your backup. Ask Microsoft, Google or your outside IT company how long deleted files and mailboxes can be recovered, and whether that meets your needs. After an incident, NIST advises checking that the backup itself is intact before you restore from it.[^nist-csf-small-business-qsg-2024]",
      ],
      verify: "This quarter, someone restored a real file and a whole folder or mailbox from backup, timed it, and wrote down the steps.",
    },
    {
      title: "Verify every payment change on a second channel",
      detail: [
        "Business email compromise (BEC), where a criminal poses as a boss or vendor to redirect money, drew $3.05 billion in reported losses to the FBI in 2025.[^fbi-ic3-2025] AI now helps criminals write convincing emails and clone voices, so the defense has to be a habit, not a hunch.[^fbi-psa-genai-fraud-2024]",
        "Before paying a new account or changing anyone's bank details, call back on a number you already had, never one from the request, and require two people to approve payments above a set amount. Our two-channel verification guide has policy wording you can copy.",
        "If money does go out, call your bank immediately to request a recall, then file at ic3.gov. In 2025 the FBI's Recovery Asset Team froze $679 million, about 58% of the money in the cases it handled.[^fbi-ic3-2025]",
      ],
      verify: "Walk through a pretend bank-change request from a real vendor: the person handling it calls the known number and gets a second approver before anything changes.",
    },
    {
      title: "Write a one-page AI rule and pick an approved tool",
      detail: [
        "Assume someone on your team already uses AI. Decide which tools are approved, which account to use, and what never goes in: client records, health or financial details, passwords, and anything under a confidentiality agreement.",
        "ChatGPT Business, Claude Team and Microsoft Copilot Chat with a work account say they keep your data out of model training by default, and Google says Workspace data isn't used to train models outside your domain without permission.[^openai-enterprise-privacy-2026][^anthropic-commercial-training-2026][^microsoft-copilot-edp-2026][^google-workspace-ai-privacy-2026] Personal accounts are different: on ChatGPT's personal plans, for example, content is used for training unless the user opts out.[^openai-chatgpt-pricing-2026]",
        "Our one-page AI use rule guide walks through the wording, and the AI Acceptable Use Policy in our Policy Library (free account required) turns it into a full policy.",
      ],
      verify: "Everyone has acknowledged the one-page rule in writing, and your approved tool's admin console shows staff signed in with work accounts.",
    },
    {
      title: "Offboard the same day",
      detail: [
        "When someone leaves, disable their accounts that day, remove them from shared vaults, and change any shared passwords they knew. Transfer ownership of their files and email, collect or wipe company devices, and remove company data from their personal phone.",
        "Check the less obvious places too: bank and payroll portals, the domain registrar, social media, and any AI tools or browser extensions connected to company data. NIST's quick-start guide asks whether access is removed when people no longer need it, and the CIS Controls give account management and access control management their own controls.[^nist-csf-small-business-qsg-2024][^cis-controls-list-v8-1]",
      ],
      verify: "For the last person who left, you can show the date each account was disabled, and none of their old sign-ins work.",
    },
    {
      title: "Write a one-page incident plan and practice it",
      detail: [
        "Decide now who leads if something goes wrong, and who calls the bank, your IT provider, your insurer and a lawyer. Keep those numbers somewhere other than your computers. NIST's Respond section starts with knowing your plan and who has authority, and CISA recommends drilling the plan and reviewing it at least once a year.[^nist-csf-small-business-qsg-2024][^cisa-secure-your-business-2026]",
        "Report fraud and cybercrime to the FBI at ic3.gov and cyber incidents to CISA.[^fbi-ic3-2025][^cisa-secure-your-business-2026] Our Incident Response Planner builds a plan with playbooks for deepfake payment fraud and AI data exposure, and our Cyber Audit shows where your baseline has gaps.",
      ],
      verify: "Your plan fits on one or two pages, a printed copy lives outside your computers, and the team has walked through one scenario in the past year.",
    },
  ],

  limits: [
    "This is a baseline, not compliance. Healthcare practices, financial firms and businesses that take card payments have specific legal duties this guide doesn't cover.",
    "Settings only help once they're configured and checked. Re-run the verify steps every quarter, and after any change of IT provider.",
    "AI vendors change their terms and features often. Re-check your approved tool's data terms at least once a year and whenever it announces new connections to your data.",
    "No baseline stops a determined, targeted attacker. It's built for the common, untargeted attacks that the CIS starter set is designed against.[^cis-controls-ig1-v8-1]",
  ],

  faqs: [
    {
      question: "We're only five people. Is this overkill?",
      answer: "No. Most of these steps are settings in tools you already pay for. Size changes how long it takes, not what matters: email MFA, payment callbacks and tested backups come first.",
    },
    {
      question: "Do we need an outside IT company?",
      answer: "Not for the baseline. Many owner-run businesses work through these steps themselves, an afternoon at a time. An outside IT provider earns its fee for device management, backups and the incident plan when no one on staff has the time.",
    },
    {
      question: "Which AI tool should we approve?",
      answer: "Usually the one inside the suite you already pay for, such as Copilot Chat with a work account in Microsoft 365 or Gemini in Google Workspace, because your data already lives there under business terms. A standalone business plan is the next option. Keep personal accounts out of work.",
    },
    {
      question: "What's the single most important step?",
      answer: "Lock down email. Whoever controls your email can reset most of your other accounts and impersonate you to clients and vendors.",
    },
    {
      question: "How does this line up with the frameworks?",
      answer: "The steps follow CISA's small-business guidance, the CIS Controls Implementation Group 1 starter set and NIST's Cybersecurity Framework 2.0 Small Business Quick-Start Guide. Our Controls Library shows the NIST and CIS mapping for each related control.",
    },
  ],

  sourceIds: [
    "fbi-ic3-2025",
    "fbi-psa-genai-fraud-2024",
    "cisa-small-business-guidance-2024",
    "cisa-secure-your-business-2026",
    "nist-csf-small-business-qsg-2024",
    "cis-controls-ig1-v8-1",
    "cis-controls-list-v8-1",
    "bitwarden-business-pricing-2026",
    "onepassword-business-pricing-2026",
    "microsoft-365-business-pricing-2026",
    "openai-enterprise-privacy-2026",
    "openai-chatgpt-pricing-2026",
    "anthropic-commercial-training-2026",
    "microsoft-copilot-edp-2026",
    "google-workspace-ai-privacy-2026",
  ],

  related: {
    threats: [
      "ai-powered-phishing-and-bec",
      "voice-cloning-and-deepfake-scams",
      "ai-chatbot-data-leaks",
      "prompt-injection-and-ai-agent-hijacking",
    ],
    guides: [
      "two-channel-verification-for-payments",
      "one-page-ai-use-rule-for-your-team",
      "lock-down-your-ai-assistants",
      "digital-hygiene-at-home",
    ],
    explainers: ["who-owns-your-ai-conversations"],
    controls: [
      "multi-factor-authentication",
      "password-management",
      "patch-management",
      "endpoint-protection",
      "device-encryption",
      "data-backup",
      "backup-testing",
      "out-of-band-verification",
      "ai-acceptable-use",
      "employee-offboarding",
      "access-review",
      "incident-response-plan",
      "emergency-contacts",
      "security-training",
    ],
    glossary: ["business-email-compromise", "passkey", "hardware-security-key", "shadow-ai", "ransomware"],
    toolkit: [
      "bitwarden",
      "1password",
      "yubikey",
      "google-titan-security-key",
      "backblaze",
      "microsoft-365-business-premium",
      "microsoft-copilot-chat",
      "chatgpt-business",
      "ollama",
      "have-i-been-pwned",
      "quad9",
      "nextdns",
      "proton-drive",
      "signal",
    ],
  },
}
