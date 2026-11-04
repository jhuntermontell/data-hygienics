// Texas SB 2610 (Business and Commerce Code Chapter 542). Written from the
// enrolled bill and the codified chapter, not from summaries. Keep the safe
// harbor language narrow: it bars exemplary damages only, and only when the
// business shows its program existed at the time of the breach. Not legal
// advice. `tierChecker` renders as a chooser in GuideArticle (TierChecker).
export default {
  kind: "guide",
  slug: "texas-sb-2610-safe-harbor",
  title: "The Texas cybersecurity safe harbor, read from the statute",
  metaTitle: "Texas SB 2610 Safe Harbor, Explained | Data Hygienics",
  metaDescription: "What Texas SB 2610 says: who qualifies, the program each staff-size tier needs, the narrow bar on punitive damages, and how to show your program existed.",
  audience: ["business"],
  pillars: ["hygiene"],
  tldr: "Since September 1, 2025, a Texas business with fewer than 250 employees that holds sensitive personal information can block one kind of damages after a data breach: exemplary damages, which include punitive damages.[^tx-bc-542][^tx-cprc-41] It works only if the business can show that, when the breach happened, it already ran a cybersecurity program that met the statute for its size.[^tx-bc-542] It does not stop lawsuits, compensatory damages or penalties from the attorney general, so read it as a reason to run a real program and keep dated proof, not as a shield.",
  datePublished: "2026-11-04",
  lastReviewed: "2026-11",
  status: "draft",
  featured: false,

  timeToComplete: "Half a day to start, then an hour a quarter",
  difficulty: "moderate",

  why: [
    "Senate Bill 2610 passed the Texas Senate 31 to 0 and the House 109 to 27, was signed on June 20, 2025, and took effect on September 1, 2025.[^tx-sb-2610-enrolled][^tx-sb-2610-history] It added Chapter 542, titled Cybersecurity Program, to the Business and Commerce Code, and it applies only to claims that arise on or after the effective date.[^tx-bc-542][^tx-sb-2610-enrolled]",
    "Two tests decide whether the chapter covers you, and you need both: fewer than 250 employees, and your business owns or licenses computerized data that includes sensitive personal information.[^tx-bc-542] Texas law defines that term narrowly. It means a person's name together with an unencrypted Social Security number, driver's license or government ID number, or a financial account or card number with the code that unlocks it. It also means information that identifies someone and relates to their health, their health care or payment for it.[^tx-bc-521] If you keep client tax files, payroll records or patient charts on a computer or in a cloud service, you almost certainly hold it.",
    "The protection itself is one sentence. In a lawsuit over a breach, a person harmed cannot recover exemplary damages from you if you demonstrate that, at the time of the breach, you implemented and maintained a cybersecurity program that meets Section 542.004.[^tx-bc-542] Exemplary damages are awarded to punish, not to compensate.[^tx-cprc-41] Texas already makes them hard to win: the person suing must prove fraud, malice or gross negligence by clear and convincing evidence, the jury must agree unanimously, and the amount is capped.[^tx-cprc-41] So the safe harbor removes a remedy that was already narrow. The program it asks for is worth running for its own sake, because it is the same work that keeps a breach small or stops it.",
  ],

  tierChecker: {
    title: "Which tier am I in",
    question: "How many employees does your business have?",
    intro: "Chapter 542 scales the program to the size of the business, using employee count.[^tx-bc-542] Pick your band to see what the statute names for it.",
    bands: [
      {
        key: "smallest",
        label: "Fewer than 20 employees[^tx-bc-542]",
        tier: "Simplified requirements",
        requirement: [
          "The statute asks for simplified requirements, including password policies and appropriate employee cybersecurity training.[^tx-bc-542]",
          "Those two items are named examples, not the whole list. Every program, at every size, must also contain administrative, technical and physical safeguards and conform to an industry-recognized framework.[^tx-bc-542] Our reading: a short written program built on the NIST Cybersecurity Framework small business guide, with a password and multi-factor authentication (MFA) policy and dated training records, is a sensible way to meet both.[^nist-csf-small-business-qsg-2024] Confirm that reading with a Texas lawyer.",
        ],
      },
      {
        key: "small",
        label: "20 to 99 employees[^tx-bc-542]",
        tier: "Moderate requirements",
        requirement: [
          "The statute asks for moderate requirements, including the requirements of the Center for Internet Security (CIS) Controls Implementation Group 1, known as IG1.[^tx-bc-542]",
          "IG1 is the CIS starting baseline of 56 safeguards, written for organizations with limited IT and security staff.[^cis-controls-ig1-v8-1] Map your program to it safeguard by safeguard, and note which ones you meet, which you meet another way and which are in progress.",
        ],
      },
      {
        key: "mid-size",
        label: "100 to 249 employees[^tx-bc-542]",
        tier: "A recognized framework",
        requirement: [
          "The statute asks the program to conform to a current version of one or more recognized frameworks.[^tx-bc-542]",
          "The list: the NIST Cybersecurity Framework, NIST SP 800-171, NIST SP 800-53 and 800-53A, the FedRAMP Security Assessment Framework, the CIS Critical Security Controls, the ISO/IEC 27000 series, the HITRUST Common Security Framework, the Secure Controls Framework, the SOC 2 framework, or a similar industry standard.[^tx-bc-542] Pick one and map your controls to it, with its version named in writing.",
        ],
      },
      {
        key: "not-covered",
        label: "250 or more employees[^tx-bc-542]",
        tier: "Not covered",
        requirement: [
          "Chapter 542 does not apply to you.[^tx-bc-542] The rest of Texas law still does, including the duty to keep reasonable procedures to protect sensitive personal information and the breach notice deadlines.[^tx-bc-521]",
        ],
      },
    ],
    notes: [
      "At every size, if HIPAA, the Gramm-Leach-Bliley Act (GLBA), the Federal Information Security Modernization Act or the HITECH Act applies to you, the program must conform to its current version, and if you take payment cards, to a current version of the Payment Card Industry Data Security Standard (PCI DSS).[^tx-bc-542]",
      "The chapter does not say how to count employees, for example part-time staff, contractors or related companies.[^tx-bc-542] Ask counsel how to count yours, and write the answer down with the date.",
    ],
  },

  steps: [
    {
      title: "Confirm the chapter applies to you",
      detail: [
        "Write down your employee count and how you counted it. Then list every place sensitive personal information lives: your practice management or accounting software, payroll, shared drives, email, cloud storage, and paper files that get scanned.",
        "If no computer system holds that kind of information, Chapter 542 does not cover you, though most firms that handle client money, taxes or health care will find they do.[^tx-bc-542]",
      ],
      verify: "You have a one-page note, dated, with your employee count, how you counted it and the systems that hold sensitive personal information.",
    },
    {
      title: "Choose your tier and the framework you will map to",
      detail: [
        "Use the chooser above to find your band, then name the framework and its version in writing, for example the CIS Controls version 8.1, Implementation Group 1.",
        "Frameworks change. When one you rely on publishes an update, the statute gives you until the later of the update's own implementation date or one year after it is published to bring your program in line.[^tx-bc-542] Put that review on your calendar when a new version comes out.",
      ],
      verify: "Your program document names one framework and its version, and the date you chose it.",
    },
    {
      title: "Write the program down",
      detail: [
        "The statute asks for administrative, technical and physical safeguards, designed to protect the security and integrity of personal information and to prevent the unauthorized access that leads to identity theft or fraud.[^tx-bc-542] In practice that means a short document with an owner, the rules your team follows, the settings that enforce them, and how you check that they work.",
        "You do not need to start from a blank page. The Policy Library on this site includes an information security policy, an access control policy and an incident response plan, and its AI Acceptable Use Policy is free. Edit them to say what you actually do.",
      ],
      verify: "One person is named as the owner, the document has a version number and an approval date, and everything in it describes something you do today.",
    },
    {
      title: "Put the named pieces in place first",
      detail: [
        "For every tier, start with what the statute names for the smallest one: a password policy and staff security training.[^tx-bc-542] Turn on multi-factor authentication for email, remote access and administrator accounts, use a password manager, and run short training at hire and at least once a year, with a sign-in sheet.",
        "If you have 20 or more employees, work through the IG1 safeguards next.[^tx-bc-542][^cis-controls-ig1-v8-1] The free Quick Check in our Cyber Audit takes about five minutes and shows where the obvious gaps are; the full assessment, built for your industry, goes deeper.",
      ],
      verify: "An export or screenshot from your email system shows MFA enforced for every user, and your training log shows each current employee's last session date.",
    },
    {
      title: "Keep dated proof that the program was running",
      detail: [
        "The safe harbor turns on what you can show about one moment: the time of the breach.[^tx-bc-542] A policy written the week after an incident proves nothing about the week before. Collect evidence as you go.",
        "Keep each version of the program with its approval date, training rosters, exports or screenshots of key settings (MFA, password rules, backups), backup restore tests, access reviews, vendor contracts with security terms, and a short log of each quarterly review.",
        "Store a copy outside your main systems, such as an encrypted archive held by the owner, so the evidence survives the same breach it needs to describe.",
      ],
      verify: "Pick a random date from last quarter. Within ten minutes you can show which version of the program was in force that day and one piece of evidence that it was being followed.",
    },
    {
      title: "Review on a schedule and when things change",
      detail: [
        "Check the program each quarter and rewrite it once a year. Also revisit it when your headcount crosses into a new band, when you add a system that holds sensitive personal information, or when your framework publishes a new version.[^tx-bc-542]",
        "If an outside IT provider runs your systems, ask them for a dated report of the settings and patch status each quarter and file it with your evidence.",
      ],
      verify: "Your review log has an entry from the last three months, signed by the program owner.",
    },
    {
      title: "Know the breach duties the safe harbor leaves untouched",
      detail: [
        "Texas still requires you to notify affected people without unreasonable delay and no later than 60 days after you determine a breach occurred, and to notify the attorney general within 30 days if it involves at least 250 Texans.[^tx-bc-521] The safe harbor changes none of that.[^tx-bc-542]",
        "Write those deadlines into your incident response plan. Our Incident Response Planner builds a plan with contacts and playbooks you can fill in now.",
      ],
      verify: "Your incident response plan lists both Texas deadlines and who sends each notice.",
    },
    {
      title: "Have a Texas lawyer review it once",
      detail: "The chapter is short and new, and how a court weighs a firm's evidence will depend on the facts. An hour with counsel to confirm your tier, your employee count and what evidence to keep is worth more than any summary, including this one.",
      verify: "Counsel's notes are filed with your program, dated.",
    },
  ],

  limits: [
    "It bars exemplary damages only. A person harmed can still sue and recover compensatory damages, the money that makes up for actual losses.[^tx-bc-542][^tx-cprc-41]",
    "It speaks only to damages claimed by a person harmed. It says nothing about the attorney general's civil penalties for violating Chapter 521, which run from $2,000 to $50,000 per violation, plus up to $100 per person per day for late breach notice, capped at $250,000 per breach.[^tx-bc-521]",
    "It creates no new right to sue and does not change any existing legal duty, including the duty to keep reasonable procedures to protect sensitive personal information.[^tx-bc-542][^tx-bc-521]",
    "You carry the burden. The protection applies only if your business demonstrates the program was in place at the time of the breach, so a program you cannot document is close to no program.[^tx-bc-542]",
    "It does not cover businesses with 250 or more employees, businesses with no computerized sensitive personal information, or claims that arose before September 1, 2025.[^tx-bc-542][^tx-sb-2610-enrolled]",
    "It is a Texas rule. Federal rules such as HIPAA and the FTC Safeguards Rule, and other states' laws, apply on their own terms. This guide is general information, not legal advice.",
  ],

  faqs: [
    {
      question: "Does this mean we can't be sued after a breach?",
      answer: "No. People harmed by a breach can still sue and recover compensatory damages. The safe harbor only takes punitive-style exemplary damages off the table, and only if you can show your program was in place when the breach happened.",
    },
    {
      question: "Do we have to register or file anything with the state?",
      answer: "The chapter has no registration, filing or approval step. The program is something you run and document, then show if you are sued.",
    },
    {
      question: "Does a SOC 2 report or an outside assessment count?",
      answer: "SOC 2 is one of the frameworks the statute lists, and an outside assessment is useful evidence. Neither is required by the chapter for smaller firms. What matters is that your program conforms to the framework for your tier and that you can show it was running.",
    },
    {
      question: "Our outside IT company handles security. Is their work our program?",
      answer: "It can be part of it, but the program is yours. Get their work into your written program, ask them for dated reports of settings and patching, and keep those reports with your other evidence.",
    },
    {
      question: "Can Data Hygienics tell us whether our program qualifies?",
      answer: "No. Only a court decides that, on the facts of a case. Our Cyber Audit, Policy Library and Incident Response Planner help you build and document a program, and a Texas lawyer can tell you how the statute applies to you.",
    },
  ],

  sourceIds: [
    "tx-bc-542",
    "tx-sb-2610-enrolled",
    "tx-sb-2610-history",
    "tx-bc-521",
    "tx-cprc-41",
    "cis-controls-ig1-v8-1",
    "nist-csf-small-business-qsg-2024",
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec"],
    guides: [
      "digital-hygiene-for-your-business",
      "cyber-insurance-application-and-renewal",
      "answering-a-client-security-questionnaire",
    ],
    explainers: [],
    controls: [
      "multi-factor-authentication",
      "password-management",
      "security-training",
      "data-classification",
      "data-backup",
      "access-review",
      "vendor-agreements",
      "incident-response-plan",
    ],
    glossary: ["multi-factor-authentication", "ransomware"],
    toolkit: [],
  },
}
