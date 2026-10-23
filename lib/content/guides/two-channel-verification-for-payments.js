export default {
  kind: "guide",
  slug: "two-channel-verification-for-payments",
  title: "Two-channel verification for payments",
  metaTitle: "Two-Channel Payment Verification | Data Hygienics",
  metaDescription: "A callback and two-person rule a small office can adopt today: known-good numbers, bank-change steps, sample policy text, and the first hour after fraud.",
  audience: ["business"],
  pillars: ["hygiene"],
  tldr: "Money only moves after a second channel confirms it. Keep a list of known-good phone numbers, call back on those numbers before paying or changing bank details, require two people above a set amount, and know who to call in the first hour if money goes out. Among the controls finance teams use against business email compromise, that callback is the one most often rated very effective.[^afp-payments-fraud-2026]",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,

  timeToComplete: "45 minutes",
  difficulty: "moderate",

  why: "Business email compromise (BEC), where a criminal poses as a boss or vendor to redirect a payment, drew $3.05 billion in reported losses to the FBI in 2025, more than any crime except investment fraud.[^fbi-ic3-2025] AI now writes those requests in clean, tailored language, so 'look for typos' no longer protects you.[^fbi-psa-genai-fraud-2024][^hao-llm-malicious-email-2025] What still works is procedural: in a 2026 survey of finance teams, calling the payee back on a number from your own records was the BEC control most often rated very effective.[^afp-payments-fraud-2026]",

  steps: [
    {
      title: "Build a known-good contact list",
      detail: [
        "A known-good number is one you got from a source a criminal can't edit: the signed contract, your vendor setup form, the vendor's website typed in by you, or a number you've already called and confirmed. It is never a number from the email, invoice, text, voicemail or caller ID that came with a payment request.",
        "List every vendor, client and staff member who can ask for or receive money, plus your bank's fraud line and your account contact. For each, record the number, where it came from, who checked it and when.",
        "Keep the list where an email can't change it, such as a shared vault in your password manager or a locked spreadsheet only two people can edit.",
      ],
      verify: "Pick three vendors you paid last month. Each has an entry with a source and a date, and the number matches the one on their contract or website.",
    },
    {
      title: "Adopt the callback rule",
      detail: [
        "Any request to send money, change bank details, change where a payment goes, or buy gift cards gets a callback before anyone acts. That covers email, text, chat, voicemail and video calls, and requests that appear to come from the owner.",
        "Close the message, then call the known-good number yourself. The FBI gives the same advice: contact the person or organization on a number you find independently.[^fbi-psa-genai-fraud-2024]",
        "Treat a push to switch channels, or a caller who blames a bad connection for skipping video or verification, as a warning sign, not a reason to relax.[^fincen-deepfake-alert-2024]",
      ],
      verify: "Ask a colleague to send a mock 'urgent bank change' from a personal address. The person who receives it calls the known-good number before replying, and nobody opens the bank portal.",
    },
    {
      title: "Require two people above a threshold",
      detail: [
        "Pick a dollar amount that would hurt to lose; for a small office, a few thousand dollars is a reasonable starting point. Above it, one person sets up the payment and a second approves it after making their own callback. Apply the same two-person step to every new payee, every change to payee details, and anything marked urgent or confidential, whatever the amount.",
        "In a five-person office, the second approver can be the owner on a phone call. Ask your bank to switch on dual approval or payment limits in its online portal, so the rule doesn't depend on memory.",
        "Senior sign-off above a set amount is one of the most common BEC controls among finance teams, used by 94% of organizations in the 2026 survey by the Association for Financial Professionals (AFP).[^afp-payments-fraud-2026]",
      ],
      verify: "Log in as a single user and try to release a test payment above the threshold. The bank portal holds it for a second approver.",
    },
    {
      title: "Use a fixed procedure for vendor bank changes",
      detail: [
        "Freeze: a bank-change request never takes effect from the request itself, even when it arrives inside a real email thread. Criminals reply in genuine conversations, and 39% of organizations in AFP's 2026 survey had genuine emails intercepted by fraudsters.[^afp-payments-fraud-2026]",
        "Confirm: call the vendor at the known-good number, reach someone you've dealt with before, and ask them to read the new account details to you. Don't read them out yourself.",
        "Approve and record: a second person approves the change in your accounting system or bank portal. Log the date, who called, the number used and who approved.",
        "Close the loop: after the first payment to the new account, call the vendor to confirm it arrived before sending the next one. Tell your contact the change was made, so a hijacked mailbox on their side gets noticed.",
        "If you send ACH (Automated Clearing House) payments, such as payroll or vendor transfers, through your bank, this step also helps you meet the network's rules. Since June 22, 2026, those rules expect business senders to have risk-based steps for catching payments made under false pretenses, such as vendor impersonation, and Nacha, which writes them, gives change controls on vendor and payroll payment details as an example.[^nacha-fraud-monitoring-2026]",
      ],
      verify: "Your change log shows a callback, a known-good number and a second approver for every bank-detail change in the last quarter.",
    },
    {
      title: "Make urgency and secrecy a stop sign",
      detail: [
        "Write into your rule that 'urgent', 'confidential' or 'don't tell anyone' automatically triggers the callback and second approval, even below the threshold. Real executives and vendors can wait the few minutes a callback takes.",
        "AFP's 2026 report makes the same point: allowing more time before a payment helps prevent fraud, and same-day or emergency payments deserve a closer look.[^afp-payments-fraud-2026]",
      ],
      verify: "Everyone who can pay bills can say, without looking it up, what they do when a payment request says 'urgent'.",
    },
    {
      title: "Adopt the policy in writing",
      detail: [
        "Paste this paragraph into your handbook, fill in the brackets, and have everyone who touches payments sign it.",
        "Sample policy: Payment verification rule. No one at [Company] sends money, adds a payee, or changes payment details based on an email, text, chat, voicemail or video call alone. Before acting, the person handling the request calls the requester back on the number in our known-good contact list, never a number supplied with the request.",
        "Payments over [threshold], every new payee, every change to a payee's bank details, and any request described as urgent or confidential also need approval from a second authorized person who makes their own callback. Anyone may pause a payment to verify it, and no one will be criticized for doing so. Suspected fraud is reported at once to [name] and to our bank.",
        "Tell vendors and clients too: 'We will never change our bank details by email, and we will call you to confirm any change you send us.' It sets expectations and makes a fake request stand out.",
      ],
      verify: "Everyone with payment access has signed, and the paragraph sits wherever invoices get paid.",
    },
    {
      title: "Practice once a quarter",
      detail: "Run a short drill: an internal test request to change a vendor's bank details or pay an 'urgent' invoice. Debrief without blame and fix whatever slowed people down. Re-check a few known-good numbers each quarter and remove people who have left.",
      verify: "Your last drill is logged with the date and what you changed afterward.",
    },
    {
      title: "Know the first hour if money already went out",
      detail: [
        "First ten minutes: call your bank's fraud line, using the number on its website or your card. Say the payment was fraud, ask for an immediate recall of the wire or ACH payment, ask your bank to send the receiving bank a hold harmless letter (the paperwork that lets that bank return the money), and write down the reference number.[^fbi-ic3-2025]",
        "Next twenty minutes: file a complaint at ic3.gov, the FBI's Internet Crime Complaint Center (IC3), whatever the amount. Include full transaction details: date, amount, sending and receiving banks, account numbers and the messages involved. The FBI's Recovery Asset Team uses these reports to ask banks to freeze money, and in 2025 it froze $679 million, 58% of the money at stake in the incidents it worked.[^fbi-ic3-2025]",
        "By the end of the hour: lock down the email account involved. From a clean device, change its password, sign out all sessions, delete forwarding rules you didn't create, and turn on multi-factor authentication (MFA). Call the real vendor or executive on the known-good number, keep every message with full headers, and tell your IT provider and your cyber insurer if you have one.",
        "Afterward, ignore anyone who offers to recover the money for a fee. The IC3 never charges and does not contact victims by phone, email or social media.[^fbi-psa-ic3-impersonation-2025]",
      ],
      verify: "Your bank's fraud number and ic3.gov are on the known-good list, and at least two people can walk through this sequence from memory.",
    },
  ],

  limits: [
    "A callback is only as good as the number. If your list was built from emails, or a criminal has taken over the person's phone number, the call can reach the wrong person. For large changes, add a passphrase agreed in person; 42% of organizations in AFP's 2026 survey used passcodes known only to both parties for wires.[^afp-payments-fraud-2026]",
    "Dual approval fails when the second person approves without checking. Make the callback part of the approval, not a step someone assumes was already done.",
    "Recovery is uncertain even when you move fast. Among organizations under $1 billion in revenue that had payments fraud in 2025, 48% lost money and 24% of those got none of it back.[^afp-payments-fraud-2026]",
    "This rule covers payments you send. It doesn't stop check fraud, fake invoices from vendors you never vetted, or an insider who controls both approvals; those need their own controls.",
    "Your bank's agreement decides what it can do. Ask now which dual-approval, payment-limit and recall options your account supports, so you aren't learning them during an incident.",
  ],

  faqs: [
    {
      question: "What counts as a known-good number?",
      answer: "One you got from a source the requester doesn't control: your signed contract, your vendor setup paperwork, the company's website typed in by you, or a number you've already confirmed. A number in the email, the invoice, a voicemail or caller ID doesn't count, because the criminal can put anything there.",
    },
    {
      question: "Won't calling vendors back annoy them?",
      answer: "Most vendors are glad you checked, because a redirected payment is their loss too. Tell them in advance that you always call back on changes, and the call becomes routine.",
    },
    {
      question: "What if the request really is from the owner and they can't be reached?",
      answer: "Then the payment waits. A rule with an exception for 'the boss is unreachable' is the exact gap impersonators aim for, so owners should agree in writing that their own requests get the same callback.",
    },
    {
      question: "Does this apply to Zelle, payment apps and card payments?",
      answer: "Yes. The rule is about any payment you push out or any change to where money goes, whatever the rail. Instant payments are harder to recall, which makes the check before sending even more important.",
    },
    {
      question: "Our bank already monitors for fraud. Isn't that enough?",
      answer: "Banks see the payment, not the conversation behind it. A transfer you authorized to a criminal's account can look completely normal to the bank, so the check has to happen on your side before you press send.",
    },
  ],

  sourceIds: [
    "afp-payments-fraud-2026",
    "fbi-ic3-2025",
    "fbi-psa-genai-fraud-2024",
    "hao-llm-malicious-email-2025",
    "fincen-deepfake-alert-2024",
    "nacha-fraud-monitoring-2026",
    "fbi-psa-ic3-impersonation-2025",
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec", "voice-cloning-and-deepfake-scams"],
    guides: [
      "digital-hygiene-for-your-business",
      "one-page-ai-use-rule-for-your-team",
      "family-safe-word-and-callback-rule",
    ],
    explainers: [],
    controls: [
      "out-of-band-verification",
      "email-authentication",
      "phishing-training",
      "multi-factor-authentication",
      "vendor-risk-management",
      "incident-response-plan",
      "emergency-contacts",
    ],
    glossary: ["business-email-compromise", "social-engineering"],
    toolkit: [],
  },
}
