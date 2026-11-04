// Forced moment: PTIN renewal season for paid tax preparers. Cites the
// renewal form itself (Form W-12, line 11), the FTC Safeguards Rule text and
// the IRS publications. Per the business plan's words to avoid, no FTC fine
// or investigation threats: the duty is stated, not used as a scare.
export default {
  kind: "guide",
  slug: "ptin-renewal-and-your-wisp",
  title: "PTIN renewal asks about your security plan, so write one",
  metaTitle: "PTIN Renewal and Your WISP | Data Hygienics",
  metaDescription: "Your PTIN renewal asks you to confirm you know a written information security plan is required. What the plan must cover and how to write a short one.",
  audience: ["business"],
  pillars: ["hygiene"],
  tldr: "The IRS renewal form for your Preparer Tax Identification Number (PTIN) asks you to confirm that you know paid preparers are required by law to keep a written information security plan, or WISP.[^irs-form-w12-2026] Current PTINs expire on December 31, 2026.[^irs-ptin-renewal-2027] If you can tick that box but couldn't hand someone your plan, use the weeks before filing season to write it: the IRS publishes a free template, and a sole practitioner's plan can be short.[^irs-pub-5708-2024]",
  datePublished: "2026-11-04",
  lastReviewed: "2026-11",
  status: "draft",
  featured: false,

  timeToComplete: "Three to four hours for a small practice",
  difficulty: "moderate",

  why: [
    "Anyone paid to prepare or help prepare federal returns needs a valid PTIN, and every current one expires on December 31, 2026.[^irs-ptin-renewal-2027] Renewing online takes about 15 minutes and costs $18.75.[^irs-ptin-renewal-2027] The form also asks about security. Line 11 of Form W-12, titled Data Security Responsibilities, reads: 'I am aware that paid tax return preparers are required by law to create and maintain a written information security plan that provides data and system security protections for all taxpayer information.' You must check yes or no.[^irs-form-w12-2026]",
    "The law behind that line is the Gramm-Leach-Bliley Act (GLBA) and the FTC Safeguards Rule, which treat tax preparation firms as financial institutions, whatever their size.[^ecfr-ftc-safeguards-rule][^irs-pub-5708-2024] The rule requires a written information security program with administrative, technical and physical safeguards that fit your size, the work you do and how sensitive your clients' information is.[^ecfr-ftc-safeguards-rule] The IRS and its Security Summit partners repeated the point to tax professionals in August 2026.[^irs-wisp-2026]",
    "The plan has to do specific things. Name a qualified individual to run it, assess the risks to client information, put safeguards in place and test them, require MFA (multi-factor authentication) for anyone who signs in to a system holding client information, oversee your service providers by contract, adjust the plan as your practice changes, and report a security event involving 500 or more people to the FTC within 30 days of discovering it.[^irs-pub-5708-2024][^ecfr-ftc-safeguards-rule]",
    "Small practices get some relief, but not from the plan itself. If you hold information on fewer than 5,000 consumers, the rule excuses you from four items: a written risk assessment, continuous monitoring or annual penetration testing, a written incident response plan, and a yearly report to your board.[^ecfr-ftc-safeguards-rule] You still need the written plan, the qualified individual, MFA and the rest.",
  ],

  steps: [
    {
      title: "Answer the data security question honestly, then make it true",
      detail: "The question asks whether you are aware of the requirement, and you are now. Awareness is not a plan, though. If you don't have a written one, check yes on the form and start the plan this week, while client work is lighter than it will be in January.",
      verify: "Your renewal is submitted, and the first working session on your plan is on your calendar.",
    },
    {
      title: "Name your qualified individual",
      detail: "For a sole practitioner, that is you. In a larger office, pick one person who has the time and authority to run the plan, and name a backup. Write both names at the top of the plan.",
      verify: "The plan names a qualified individual and a backup, with the date they agreed.",
    },
    {
      title: "List the client data and where it lives",
      detail: [
        "Publication 5708's outline starts here: the types of information you handle, every computer, phone and drive that stores it, where each one is kept, and where data could leak, inside or outside the office.[^irs-pub-5708-2024]",
        "Include the cloud: your tax software, client portal, email, file storage and backups. If you hold information on 5,000 or more consumers, this list becomes the base of the written risk assessment the rule requires.[^ecfr-ftc-safeguards-rule]",
      ],
      verify: "Every device and service that touches client data appears on one list with its location and owner.",
    },
    {
      title: "Turn on MFA wherever client data lives",
      detail: "The rule requires MFA for anyone accessing any information system, unless your qualified individual approves an equally strong control in writing.[^ecfr-ftc-safeguards-rule] Start with your tax software, email, client portal, cloud storage and any remote access to the office. Use an authenticator app or a security key where the service allows it.",
      verify: "An admin report or screenshot from each system on your list shows MFA on for every user.",
    },
    {
      title: "Write the plan from the IRS template",
      detail: [
        "Publication 5708 includes an outline and a sample plan written for small practices. The IRS says the plan should match the size of your firm and that a sole practitioner can use a shorter, simpler plan than a 10-partner firm.[^irs-pub-5708-2024]",
        "Cover the physical, technical and administrative safeguards: locked storage and clean desks, devices and network protection, and staff rules and training.[^irs-pub-5708-2024] Keep the finished plan in a readable format and store a copy offsite or in the cloud.[^irs-pub-5708-2024] Our Policy Library can add companion documents, such as an information security policy and an incident response plan, if you want more than the template covers.",
      ],
      verify: "The plan follows the Publication 5708 outline, has a version date, and a copy sits somewhere other than your office computer.",
    },
    {
      title: "Check your service providers",
      detail: "List every outside company that can reach client data: your software vendor, IT provider, cloud storage, payroll or bookkeeping partners. The rule says to pick providers that can protect the data, require it in the contract and check on them from time to time.[^ecfr-ftc-safeguards-rule] Ask each for its security terms and file them with the plan.",
      verify: "Each provider on your list has a contract or terms on file that address protecting client data.",
    },
    {
      title: "Train your staff and get signatures",
      detail: "Walk everyone through the plan, including seasonal staff, before they touch client files. The IRS suggests a signed acknowledgment from each person, renewed at each annual training.[^irs-pub-5708-2024]",
      verify: "Every current staff member has a signed, dated acknowledgment on file.",
    },
    {
      title: "Write down who you call if data is stolen",
      detail: [
        "Publication 4557 lists the calls: your local IRS Stakeholder Liaison, the states where you prepare returns (through the Federation of Tax Administrators), your insurance company, and the FBI and CISA if it is ransomware.[^irs-pub-4557-2024] If 500 or more people are affected, the FTC must hear from you within 30 days of discovery.[^ecfr-ftc-safeguards-rule]",
        "During filing season, check your PTIN account weekly with 'View Returns Filed Per PTIN'. More returns than you filed is an early sign someone is using your number.[^irs-pub-4557-2024]",
      ],
      verify: "The contact list is in your plan and printed, and the weekly PTIN check is on your calendar from January to April.",
    },
    {
      title: "Review the plan at every renewal",
      detail: "Make next year's PTIN renewal your reminder. Before you answer line 11 again, reread the plan, update the device and provider lists, and redo staff acknowledgments.[^irs-form-w12-2026][^irs-pub-5708-2024]",
      verify: "The plan's review history has an entry dated this renewal season.",
    },
  ],

  limits: [
    "A plan on paper doesn't stop an attack. It helps only if the safeguards it describes are switched on and someone checks them.",
    "The IRS template is a starting point. The IRS says it is not exhaustive and is not a substitute for a plan built around your own practice.[^irs-pub-5708-2024]",
    "This guide covers the federal Safeguards Rule. If you e-file, the IRS also points authorized e-file providers to the security and privacy standards in Publication 1345, and your state may have its own rules.[^irs-pub-4557-2024] This is general information, not legal advice.",
    "Your PTIN renewal and your plan are separate. Renewing on time doesn't mean anyone has reviewed your plan, and a good plan doesn't renew your PTIN.",
  ],

  faqs: [
    {
      question: "I'm a one-person practice. Does this really apply to me?",
      answer: "Yes. The rule covers tax preparation firms regardless of size. Your plan can be shorter and simpler than a large firm's, and you are likely your own qualified individual.",
    },
    {
      question: "What happens if I check no on line 11?",
      answer: "The form doesn't say. Checking no doesn't remove the legal requirement, so the practical answer is to learn what the plan requires and write one.",
    },
    {
      question: "Does my tax software vendor's security count as my plan?",
      answer: "It covers part of your risk, but the plan has to be yours. List the vendor as a service provider, keep its security terms on file, and add your own safeguards for email, devices, paper and staff.",
    },
    {
      question: "Can I use the IRS sample plan word for word?",
      answer: "Use it as a draft. Replace every bracket with what you actually do, delete what doesn't apply, and add what the sample doesn't cover. A plan that describes someone else's office won't help you.",
    },
  ],

  sourceIds: [
    "irs-form-w12-2026",
    "irs-ptin-renewal-2027",
    "irs-pub-5708-2024",
    "irs-pub-4557-2024",
    "ecfr-ftc-safeguards-rule",
    "irs-wisp-2026",
  ],

  related: {
    threats: ["financial", "ai-powered-phishing-and-bec"],
    guides: [
      "digital-hygiene-for-your-business",
      "two-channel-verification-for-payments",
      "answering-a-client-security-questionnaire",
      "texas-sb-2610-safe-harbor",
    ],
    explainers: [],
    controls: [
      "multi-factor-authentication",
      "data-encryption",
      "data-backup",
      "data-retention",
      "security-training",
      "vendor-agreements",
      "incident-response-plan",
      "emergency-contacts",
    ],
    glossary: ["multi-factor-authentication", "phishing", "authenticator-app"],
    toolkit: [],
  },
}
