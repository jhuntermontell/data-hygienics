// Forced moment: a client or prospect sends a small supplier a security
// questionnaire. Explains why buyers ask (NIST supply chain guidance, FTC
// Safeguards Rule service-provider duty, HIPAA business associate
// assurances) and how to answer honestly. Makes no promise that answers
// will be accepted.
export default {
  kind: "guide",
  slug: "answering-a-client-security-questionnaire",
  title: "When a client sends you a security questionnaire",
  metaTitle: "Answering a Client Security Questionnaire | Data Hygienics",
  metaDescription: "Why clients send small suppliers security questionnaires, how to answer honestly with what you have, what proof to attach, and how to speed the next one.",
  audience: ["business"],
  pillars: ["hygiene"],
  tldr: "A client or prospect sends a spreadsheet of security questions before signing or renewing. It is how they check their suppliers, and federal guidance tells them to ask for evidence such as a self-attestation or conformance to a known standard.[^nist-sp-1305-2024] Answer what is true today, attach proof for the answers that carry weight, mark gaps plainly with a plan and a date, and save your answers so the next questionnaire takes an afternoon instead of a week.",
  datePublished: "2026-11-04",
  lastReviewed: "2026-11",
  status: "draft",
  featured: false,

  timeToComplete: "One to two days the first time, an afternoon after that",
  difficulty: "moderate",

  why: [
    "The questionnaire is your client doing their homework. NIST's guide to supply chain risk tells organizations to rank suppliers by how important they are, how sensitive the data they hold is and how much access they have to the organization's systems, then to set security requirements in contracts and ask suppliers for evidence of acceptable security practices, for example a self-attestation, conformance to a known standard or an inspection.[^nist-sp-1305-2024] NIST's small business guide gives the same advice to small firms buying from others.[^nist-csf-small-business-qsg-2024]",
    "For some clients it is a legal duty, not a preference. Financial institutions under the FTC Safeguards Rule, such as tax preparation firms, mortgage brokers and collection agencies, must choose service providers that can keep customer information safe, require it in the contract and check on them periodically.[^ecfr-ftc-safeguards-rule] Health care providers and plans may let a business associate handle patients' health information only with written assurance that it will be protected.[^ecfr-hipaa-business-associates] When one of those clients sends you a questionnaire, your answers go into their compliance file.",
    "Most questionnaires cover the same ground in different words: who is responsible for security, how people sign in and whether multi-factor authentication (MFA) is required, how laptops and phones are kept updated and protected, backups and whether you test them, email security, staff training, what you would do in an incident, which other vendors touch the client's data, how you encrypt and dispose of data, and, if the form asks, how your team uses AI tools.",
  ],

  steps: [
    {
      title: "Read it all before you answer anything",
      detail: [
        "Skim every question and note the deadline. Then ask your contact three things: which questions are must-haves for them, whether they will accept your own policies or a standard format instead of their form, and who to ask when a question doesn't fit a business your size.",
        "A short, polite question now saves you from guessing at the meaning of a question written for a bank's data center.",
      ],
      verify: "You know the deadline, the must-have questions and the name of the person who will read your answers.",
    },
    {
      title: "Gather the facts in one place",
      detail: [
        "Collect what you already have: a list of your systems and where client data lives, your IT provider's contact and what they manage, any written policies, and your insurance details if the form asks.",
        "If you have never looked at your security as a whole, the free Quick Check in our Cyber Audit takes about five minutes, needs no account, and shows where the obvious gaps are. The full assessment, built for your industry, goes deeper.",
      ],
      verify: "One folder holds your systems list, your IT provider's details and every policy you have.",
    },
    {
      title: "Answer with four honest options",
      detail: [
        "Use Yes only when it is true today for everyone and everything the question covers. Use Partly with one sentence on what is and isn't covered. Use No with a plan and a target date. Use Not applicable with a short reason, such as 'We host no servers; all systems are cloud services.'",
        "Never answer yes for something you plan to do. A client who relies on a wrong answer may have contract remedies, and it ends trust faster than an honest no.",
      ],
      verify: "Every Partly and No answer has a sentence of explanation, and every No has a date.",
    },
    {
      title: "Attach proof for the answers that carry weight",
      detail: [
        "Clients look hardest at sign-in security, backups, incident response and who else handles their data. For those, attach evidence: a screenshot of MFA enforcement, your training log, a dated backup restore test, your incident response plan and a list of the vendors that touch client data.",
        "If you need written policies, the Policy Library on this site includes an information security policy, an access control policy, a vendor management policy and an incident response plan, and its AI Acceptable Use Policy is free. Edit each one to describe what you actually do before you send it.",
      ],
      verify: "Each must-have question has either a policy, a screenshot or a short written description attached.",
    },
    {
      title: "Fix the quick gaps before you send it",
      detail: "Some gaps close in an afternoon: turning on MFA for the last few email accounts, switching laptops to automatic updates, testing a restore from backup. Close them, take a dated screenshot, and answer yes honestly.",
      verify: "Your list of No answers holds only items that take more than a few days.",
    },
    {
      title: "Send a short cover note",
      detail: "Write a few sentences: who is responsible for security at your business, what you attached, the gaps you are working on with their dates, and an offer of a call. A clear summary helps the person who has to review it.",
      verify: "The note fits on one screen and names a person they can call.",
    },
    {
      title: "Save your answers as a library",
      detail: [
        "Keep a copy of every question and answer, with the date and who approved it. Most of the next questionnaire will repeat these questions in new words, and you can answer from the library after checking that each answer is still true.",
        "Review the library every quarter. An answer that was true in January can be wrong by June after a new hire or a new system.",
      ],
      verify: "Your answer library has a review date within the last three months.",
    },
    {
      title: "Keep the promises in the contract",
      detail: "Questionnaire answers often turn into contract terms: a security addendum, a duty to tell the client about an incident within a set time, or a right for them to ask again next year. Read those terms before you sign, put any notice deadline into your incident response plan, and ask a lawyer about anything that shifts liability to you.",
      verify: "Your incident response plan lists each client's notice deadline and contact.",
    },
  ],

  limits: [
    "No tool, template or answer can promise that a client will accept your responses. Each client sets its own bar, and some will require controls a small firm doesn't have yet.",
    "Our Cyber Audit and Policy Library help you find gaps and write down what you do. They are not an outside assessment, and a client may still ask for one.",
    "A questionnaire is a snapshot. It shows what was true on the day you answered, so answers need the same upkeep as the controls behind them.",
    "Contract terms that come with a questionnaire, such as indemnity, notice windows and insurance minimums, are legal questions. Have a lawyer read them.",
  ],

  faqs: [
    {
      question: "The questionnaire has hundreds of questions. Do we have to answer all of them?",
      answer: "Ask your contact which ones matter most and whether they accept Not applicable for questions that don't fit a business your size. Many reviewers would rather get honest answers to the important questions than guesses to all of them.",
    },
    {
      question: "Can we send our policies instead of filling out their form?",
      answer: "Sometimes. Ask. Some clients accept a written policy set and a cover note, and others have to use their own form for their records.",
    },
    {
      question: "We use an outside IT company. Whose answers are these?",
      answer: "Yours. Ask the IT company to answer the technical questions in writing and to explain how they checked, then review and approve the answers yourself. You are the one making the promise to your client.",
    },
    {
      question: "They asked about AI. What should we say?",
      answer: "Say which AI tools staff use, whether client data may go into them, and what rules you follow. If you have no rules yet, our free AI Acceptable Use Policy and the one-page AI use rule guide are a quick place to start.",
    },
  ],

  sourceIds: [
    "nist-sp-1305-2024",
    "nist-csf-small-business-qsg-2024",
    "ecfr-ftc-safeguards-rule",
    "ecfr-hipaa-business-associates",
  ],

  related: {
    threats: ["ai-chatbot-data-leaks"],
    guides: [
      "digital-hygiene-for-your-business",
      "one-page-ai-use-rule-for-your-team",
      "cyber-insurance-application-and-renewal",
      "texas-sb-2610-safe-harbor",
    ],
    explainers: [],
    controls: [
      "multi-factor-authentication",
      "access-control-policy",
      "data-backup",
      "backup-testing",
      "patch-management",
      "security-training",
      "incident-response-plan",
      "vendor-risk-management",
      "vendor-agreements",
      "data-encryption",
      "ai-acceptable-use",
    ],
    glossary: ["multi-factor-authentication", "shadow-ai"],
    toolkit: [],
  },
}
