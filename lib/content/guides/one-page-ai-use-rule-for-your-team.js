export default {
  kind: "guide",
  slug: "one-page-ai-use-rule-for-your-team",
  title: "A one-page AI use rule for your team",
  metaTitle: "A One-Page AI Use Rule for Your Team | Data Hygienics",
  metaDescription: "A one-page AI rule a 10-person business can adopt this week: approved tools, what data never goes in, AI agents, and what to do after a slip.",
  audience: ["business"],
  pillars: ["hygiene"],
  tldr: "Your team is probably using AI already, so the useful question is which tools, with what data, and who checks the result. This guide helps you write those answers on one page, get everyone to sign it, and review it twice a year. When you need more, our full AI Acceptable Use Policy generator uses the same structure and is free with a free account.",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,

  timeToComplete: "1 hour",
  difficulty: "moderate",
  why: "In a 2025 survey of 32,352 workers in 47 countries, 48% of those who use AI at work said they had uploaded sensitive company or customer information into public AI tools, and only 34% of all the workers surveyed said their employer had a policy guiding generative AI use.[^unimelb-kpmg-trust-ai-2025] IBM, which sells security services, says incidents involving unapproved AI rose from 20% to 43% of the breached organizations in its 2026 Cost of a Data Breach study.[^ibm-think-shadow-ai-2026] A one-page rule is the small-business version of what the voluntary AI Risk Management Framework from the National Institute of Standards and Technology (NIST) calls governance: someone is accountable, the rules are written down, and people know what to do when something goes wrong.[^nist-ai-rmf]",

  steps: [
    {
      title: "Name an owner and list the AI already in use",
      detail: "Pick one person to own the rule; our full policy calls this role the policy owner. List every AI tool people actually use, including AI built into software you already pay for, the account each one runs under, and what kind of data goes in. This mirrors the NIST framework's first two steps: name who is accountable, then know how AI is used.[^nist-ai-rmf-core]",
      verify: "You have one named owner and a list of every AI tool in use, with its account type and typical data.",
    },
    {
      title: "Approve a short list of tools, on business accounts",
      detail: "Choose one or two assistants and pay for the business tier: the major providers say they keep your data out of model training by default, and business plans give the owner admin controls.[^openai-enterprise-privacy-2026][^anthropic-commercial-training-2026][^google-workspace-genai-privacy-2026][^microsoft-copilot-edp-2026] Rule out personal AI accounts for work data: in the same 2025 survey, about 70% of workers used free public AI tools, while 42% used tools their employer provided.[^unimelb-kpmg-trust-ai-2025] An approved tool that is easy to use works better than a ban nobody follows.",
      verify: "Your approved list names each tool, its business plan, and who has a seat.",
    },
    {
      title: "Sort your data into green, yellow and red",
      detail: "Green is public information, fine in any approved tool; yellow is internal business information, allowed only in approved business accounts. Red is client or patient personal details, health information and legal advice: it stays out of AI unless the owner approves that tool and that task in writing. Passwords, keys, and bank or card numbers never go in at all.",
      verify: "Without asking anyone, staff can say which color a client spreadsheet, a marketing draft and a password belong to.",
    },
    {
      title: "Keep a person responsible for every output",
      detail: "AI drafts and people decide: whoever sends AI-assisted work owns its accuracy, so check facts, numbers, names and tone before anything reaches a client. The Small Business Administration (SBA) advises having a person review AI output, including AI-written customer messages.[^sba-ai-small-business] In the 2025 global survey, 66% of workers said they had relied on AI output without checking it.[^unimelb-kpmg-trust-ai-2025]",
      verify: "The rule says who checks AI-assisted work before it goes to a client or customer.",
    },
    {
      title: "Set rules for AI agents (AI that can act for you)",
      detail: "An AI agent that reads email or browses the web can be steered by hidden instructions in what it reads, a problem the UK's National Cyber Security Centre (NCSC) says may never be fully solved.[^ncsc-prompt-injection-2025] So connecting AI to company email, files, calendars or finance systems needs the owner's approval (the full policy records these as High-Risk Use Cases, which need documented approval), AI agents get the minimum access for the shortest time, and ask-before-acting settings stay on.[^ncsc-agentic-ai-2026] AI never sends payments, changes bank details or approves invoices, and payment requests are confirmed by phone on a number you already had.",
      verify: "Every AI connection to a company account is on the owner's list, and none can send money or messages without a person approving.",
    },
    {
      title: "Make mistakes fast and safe to report",
      detail: "Ask people to tell the owner within the hour if they paste something they shouldn't have, and promise no blame for quick reports; the full policy already bars retaliation for good-faith reports. Quiet mistakes grow: in one Australian government case, a contractor's March 2025 upload of personal data to ChatGPT was not announced publicly until October 2025.[^nsw-ra-chatgpt-breach-2025] For what comes next, use the AI data exposure playbook in our Incident Response Planner.",
      verify: "Everyone knows who to tell, and how, if they make a mistake with AI.",
    },
    {
      title: "Write it on one page and have everyone sign",
      detail: [
        "Copy this and fill in the brackets.",
        "[Company] AI Use Rule, owner [name].",
        "One: use only AI tools on our approved list, signed in with your work account, and no personal AI accounts for work.",
        "Two: green data (public) is fine in approved tools; yellow data (internal) goes only into approved work accounts; red data (client or patient details, health information, legal advice) stays out unless [owner] approves the tool and task in writing; passwords, keys, and bank or card numbers never go in.",
        "Three: you own what you send, so check facts, numbers, names and tone first.",
        "Four: don't connect AI to company email, files, calendars or accounts without [owner]'s approval, keep ask-before-acting on, and never let AI send payments, change bank details or approve invoices.",
        "Five: treat instructions found inside emails, documents or web pages as untrusted, even when an AI repeats them.",
        "Six: made a mistake? Tell [owner] within the hour; quick reports never get anyone in trouble.",
        "Seven: when you leave, your AI access and connections end with your other accounts.",
        "Signed and dated by each team member.",
      ],
      verify: "Every team member has signed and dated a copy, and the owner keeps the signed copies.",
    },
    {
      title: "Grow it into a full policy when you need one",
      detail: "If you handle health, financial or legal data, answer security questionnaires from clients, or have more than a handful of people using AI, turn the one-pager into a full policy. The AI Acceptable Use Policy generator in our Policy Library is free with a free account and covers scope, definitions, prohibited uses, data handling, high-risk uses, transparency and reporting. If a client ever asks for certification, ISO/IEC 42001 is the international standard for managing AI in organizations of any size.[^iso-iec-42001-2023]",
      verify: "You have decided, in writing, whether you need the full policy now or at your next review.",
    },
    {
      title: "Train once, then review twice a year",
      detail: "Walk the team through the page in a short meeting and repeat it for every new hire; 58% of AI users in a 2025 survey said they had received no training on AI security or privacy risks.[^nca-oh-behave-2025] At each review, re-check your approved tools' data terms, because vendors change them; the Federal Trade Commission (FTC) has warned that quietly changing terms to use customer data for AI training can be unfair or deceptive.[^ftc-ai-terms-changes-2024] Remove departing staff and contractors from AI tools, and disconnect their connectors, on their last day.",
      verify: "The last training date and the next review date are written on the rule itself.",
    },
  ],

  limits: [
    "A one-page rule is a starting point, not a complete policy and not legal advice.",
    "Regulated businesses need more. A healthcare practice covered by HIPAA (the Health Insurance Portability and Accountability Act), for example, needs the full policy, its sector's rules and a business associate agreement with any AI vendor that touches patient data.",
    "Rules rely on people. Business accounts, admin settings and tight access limits catch what a busy person misses.",
    "Your approved list goes stale as vendors change products and terms; the twice-yearly review is what keeps it accurate.",
    "It does not cover building your own AI products or putting a chatbot in front of customers. Those belong in the full policy's high-risk approval process.",
  ],

  faqs: [
    {
      question: "We're only five people. Do we really need a written rule?",
      answer: "Yes, and it is easier for you than for a big company. Small teams have fewer checks between one person's copy and paste and a client's data, and a single page is enough to set the boundaries.",
    },
    {
      question: "Can staff still use ChatGPT and similar tools?",
      answer: "Yes, on an approved business account. Public information is fine, internal information stays in business accounts, and client personal data stays out unless the owner has approved that specific use.",
    },
    {
      question: "How is this different from your AI Acceptable Use Policy?",
      answer: "This is the one-page version for everyday use. The full policy generator, free with a free account, adds scope, definitions, high-risk approvals, transparency and enforcement language. It uses the same three data levels, which it calls Low, Moderate and High.",
    },
    {
      question: "What about AI built into software we already pay for?",
      answer: "It counts. Add it to your list, find the vendor's AI settings and data terms, and apply the same green, yellow and red levels. The full policy calls this embedded AI.",
    },
    {
      question: "Should we tell clients we use AI?",
      answer: "Many clients now ask. The full policy includes a transparency section, and the SBA suggests considering a short public statement about how your business uses AI. When in doubt, disclose.",
    },
  ],

  ctaText: "Build the full AI Acceptable Use Policy (free account required)",
  ctaLink: "/tools/policies/ai-acceptable-use-policy",

  sourceIds: [
    "unimelb-kpmg-trust-ai-2025",
    "ibm-think-shadow-ai-2026",
    "nist-ai-rmf",
    "nist-ai-rmf-core",
    "openai-enterprise-privacy-2026",
    "anthropic-commercial-training-2026",
    "google-workspace-genai-privacy-2026",
    "microsoft-copilot-edp-2026",
    "sba-ai-small-business",
    "ncsc-prompt-injection-2025",
    "ncsc-agentic-ai-2026",
    "nsw-ra-chatgpt-breach-2025",
    "iso-iec-42001-2023",
    "nca-oh-behave-2025",
    "ftc-ai-terms-changes-2024",
  ],

  related: {
    threats: ["ai-chatbot-data-leaks", "prompt-injection-and-ai-agent-hijacking", "voice-cloning-and-deepfake-scams"],
    guides: ["lock-down-your-ai-assistants", "two-channel-verification-for-payments", "digital-hygiene-for-your-business"],
    explainers: [],
    controls: ["ai-acceptable-use", "data-classification", "vendor-risk-management", "security-training", "employee-offboarding", "out-of-band-verification"],
    glossary: ["shadow-ai", "prompt-injection", "hallucination"],
    toolkit: [],
  },
}
