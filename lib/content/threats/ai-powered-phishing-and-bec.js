export default {
  kind: "threat",
  slug: "ai-powered-phishing-and-bec",
  title: "AI-powered phishing and business email compromise",
  metaTitle: "AI Phishing and Business Email Compromise | Data Hygienics",
  metaDescription: "AI now writes fluent phishing and fake payment requests. How business email compromise works, the checks that stop it, and what to do if money moved.",
  audience: ["home", "business"],
  pillars: ["threats"],
  tldr: "Criminals now use AI to write fluent, personalized phishing emails and payment requests, in any language and at volume. Business email compromise (BEC), where a scammer poses as a boss, vendor or title company to redirect a payment, drew $3.05 billion in reported losses to the FBI in 2025.[^fbi-ic3-2025] Typos are no longer the tell; a request to move money or change bank details is. Confirm every one on a second channel you already trust.",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: true,

  severity: "high",
  aiRole: "ai-enabled",
  irIncidentType: "deepfake_fraud",

  whatItIs: [
    "Phishing is a message that tricks you into clicking a link, typing a password, or paying. Business email compromise is phishing aimed squarely at money: the criminal poses as an executive, vendor, lawyer or title company, by email, phone or video meeting, and asks for a payment or a change of bank details.[^fbi-ic3-2025]",
    "AI doesn't change the trick; it removes the friction. Chat tools translate away the spelling mistakes that used to give scammers away and produce tailored variants in seconds.[^fbi-psa-genai-fraud-2024] Researchers estimate that by April 2025 about 14% of BEC emails in one large dataset were machine-written.[^hao-llm-malicious-email-2025]",
  ],

  stats: [
    {
      figure: "$3.05 billion",
      context: "Business email compromise losses reported to the FBI in 2025, from 24,768 complaints; only investment fraud cost more.",
      sourceId: "fbi-ic3-2025",
      locator: "p.7 (complaint counts) and p.8 (losses)",
    },
    {
      figure: "$30 million+",
      context: "2025 BEC losses in complaints that mentioned AI. The FBI says chat tools and voice cloning can be used in BEC; it tags AI only when a complaint mentions it, so this is a floor.",
      sourceId: "fbi-ic3-2025",
      locator: "p.39 and p.42; 'AI Related' defined p.61",
    },
    {
      figure: "54% vs 12%",
      context: "Click rate for fully AI-automated spear-phishing emails in a 101-person study, matching emails written by human experts (54%) and far above generic phishing (12%).",
      sourceId: "heiding-ai-spear-phishing-2024",
      locator: "Abstract",
    },
    {
      figure: "About 14%",
      context: "Share of BEC emails in a large email-security dataset estimated to be AI-written as of April 2025, alongside about 51% of spam.",
      sourceId: "hao-llm-malicious-email-2025",
      locator: "Abstract",
    },
    {
      figure: "74%",
      context: "Organizations hit by BEC attempts or losses in 2025, per a survey of 465 corporate treasury professionals. Firms with treasury staff tend to be larger than a typical small office, so read it as a signal, not a small-business rate.",
      sourceId: "afp-payments-fraud-2026",
      locator: "Key Findings, p.3",
    },
    {
      figure: "$679 million",
      context: "Money the FBI's Recovery Asset Team froze in 2025 through the Financial Fraud Kill Chain, 58% of the $1.16 billion at stake across 3,900 incidents. Fast reporting is what makes a freeze possible.",
      sourceId: "fbi-ic3-2025",
      locator: "p.17",
    },
    {
      figure: "48,064",
      context: "Phishing and spoofing complaints to the FBI from people 60 and older in 2025, about double the 23,252 filed in 2024.",
      sourceId: "fbi-ic3-2025",
      locator: "p.47, three-year comparison for 60+",
    },
  ],

  howItLooks: [
    {
      audience: "business",
      title: "The vendor thread that switches banks",
      scenario: "Your bookkeeper is trading emails with a regular supplier about an overdue invoice. A new reply lands in the same thread, friendly and fluent, quoting the invoice number and attaching 'updated' bank details because the supplier changed banks. In a 2026 survey of finance teams, criminals most often posed as vendors or executives asking to change payment instructions, and 39% of organizations had genuine emails intercepted by fraudsters.[^afp-payments-fraud-2026] Nothing in the message looks wrong. The only reliable tell is the request itself: new bank details, arriving by email.",
    },
    {
      audience: "business",
      title: "The owner who can't talk right now",
      scenario: "Late on a Friday, an email that looks like it's from the owner asks you to pay a new consultant before close of business and keep it quiet until a deal is announced. When you hesitate, a voice note arrives that sounds just like them. The FBI says chat tools can produce official-sounding emails that mimic a chief executive, and cloned voices can be used to request wire payments.[^fbi-ic3-2025] Treasury's Financial Crimes Enforcement Network (FinCEN) and Europol both report criminals using AI to impersonate executives and make this kind of CEO fraud more convincing.[^fincen-deepfake-alert-2024][^europol-iocta-2026]",
    },
    {
      audience: "home",
      title: "The closing-day wire",
      scenario: "You're days from closing on a house when an email from the 'title company' arrives with wiring instructions for the down payment. In a case the FBI worked in March 2025, a senior in Missouri received a compromised title-company email directing a wire of more than $1.3 million to a criminal's account.[^fbi-ic3-2025] After the complaint came in, the FBI's Recovery Asset Team had the receiving bank freeze the account. In an August 2025 case, a couple closing on a home wired over $449,000 after an email impersonating their attorneys, and after they filed with the FBI the receiving bank confirmed the full amount was still on hold.[^fbi-ic3-2025]",
    },
    {
      audience: "home",
      title: "The 'security alert' text",
      scenario: "A text that looks like it's from your bank, Amazon or Apple warns of a suspicious charge and gives you a link or a number to call. Among older adults who reported losing money to text scams in 2025, 31% described texts impersonating well-known businesses, often dressed up as security alerts.[^ftc-older-consumers-2026] The link leads to a convincing login page, or the 'fraud team' on the phone tells you to move your savings somewhere 'safe'.[^ftc-older-consumers-2026] AI makes these messages fluent, and the FBI has tracked campaigns that pair texts with AI-generated voice messages before sending a link that steals passwords.[^fbi-psa-genai-fraud-2024][^fbi-psa-senior-officials-2025]",
    },
  ],

  howItGetsIn: [
    "A compromised mailbox: once criminals are inside your email or a vendor's, they can read real threads and reply inside them, from the right address.[^afp-payments-fraud-2026]",
    "Lookalike addresses and display names: a domain one letter off, or a familiar name over an unfamiliar address, which is especially hard to spot on a phone.[^fbi-psa-bec-2024]",
    "Fake login pages: a link captures your password, and without multi-factor authentication (MFA) the account is theirs.[^fbi-psa-senior-officials-2025]",
    "Research at machine speed: AI tools can gather public details about you and your company and write to them; in one study an automated tool built accurate profiles of targets 88% of the time.[^heiding-ai-spear-phishing-2024]",
    "Fluent in any language: translation tools remove the grammar and spelling errors people were taught to look for.[^fbi-psa-genai-fraud-2024]",
    "Channel-hopping: the scam can start in email and move to a call, a text or a video meeting, where a cloned voice or face does the persuading.[^fbi-ic3-2025][^fincen-deepfake-alert-2024]",
    "Organized tooling: criminal groups use AI to draft phishing in several languages and to script call-center conversations.[^openai-malicious-uses-2025][^europol-iocta-2026]",
  ],

  whatStopsIt: [
    {
      title: "Verify every money request on a second channel",
      detail: "Before you pay, add a payee or change bank details, call the person back on a number you already had, never one from the message. In a 2026 survey, finance teams rated this callback the most effective BEC control they use: 63% of organizations using it called it very effective.[^afp-payments-fraud-2026]",
      audience: ["home", "business"],
      controlSlug: "out-of-band-verification",
      guideSlug: "two-channel-verification-for-payments",
    },
    {
      title: "Require two people for large or unusual payments",
      detail: "Above a dollar threshold you set, and for every new payee or bank-detail change, one person prepares the payment and a second approves it after their own callback. Ask your bank to enforce dual approval in its online portal so the rule doesn't depend on memory.",
      audience: ["business"],
      guideSlug: "two-channel-verification-for-payments",
    },
    {
      title: "Turn on multi-factor authentication for email",
      detail: "MFA stops a stolen password from opening your mailbox, which is how many BEC schemes get inside real threads. Prefer phishing-resistant options such as passkeys or security keys, which FinCEN recommends to banks facing deepfake fraud.[^fincen-deepfake-alert-2024]",
      audience: ["home", "business"],
      controlSlug: "multi-factor-authentication",
    },
    {
      title: "Publish email authentication for your domain",
      detail: "Sender Policy Framework (SPF), DomainKeys Identified Mail (DKIM) and Domain-based Message Authentication, Reporting and Conformance (DMARC) tell receiving mail servers who may send as your domain. They make your exact address much harder to spoof, though they don't stop lookalike domains or a hijacked real account.",
      audience: ["business"],
      controlSlug: "email-authentication",
    },
    {
      title: "Train for the request, not the typo",
      detail: "Retire 'look for spelling mistakes' as your main tip, because AI removed most of them.[^fbi-psa-genai-fraud-2024] Teach one pattern instead: money, plus a change, plus urgency or secrecy, means stop and verify. In one study, AI-written spear-phishing was clicked as often as emails crafted by human experts.[^heiding-ai-spear-phishing-2024]",
      audience: ["home", "business"],
      controlSlug: "phishing-training",
    },
    {
      title: "Let a password manager fill in your logins",
      detail: "A password manager offers your saved login only on the real site, so a lookalike page gets nothing. That quiet refusal is often the first sign a link is fake.",
      audience: ["home", "business"],
      toolkitCategory: "password-manager",
    },
    {
      title: "Make reporting fast and blame-free",
      detail: "Give staff one easy way to flag a suspicious message, such as a report button or a shared address, and thank the people who use it. Early reports let you warn others and catch a compromised account before money moves.",
      audience: ["business"],
      controlSlug: "email-reporting",
    },
    {
      title: "Go to the source yourself",
      detail: "For a bank, store or delivery alert, don't use the link or number in the message. Open the company's app, type its address yourself, or call the number on the back of your card.[^fbi-psa-genai-fraud-2024]",
      audience: ["home"],
      guideSlug: "digital-hygiene-at-home",
    },
    {
      title: "Confirm home-closing and large wires by phone",
      detail: "When you buy a home or send any large transfer, get the title company's or lawyer's number from your contract or their official website at the start, and call it to confirm wire instructions before you send. Treat any emailed change to those instructions as fraud until that call says otherwise.",
      audience: ["home"],
    },
  ],

  ifItHappens: [
    {
      step: "Call your bank's fraud line immediately",
      detail: "Use the number on the bank's website or your card, not one from any email. Say the payment was fraud, ask for an immediate recall of the wire or transfer, ask your bank to send the receiving bank a hold harmless letter (the paperwork that lets that bank return the money), and write down the reference number.[^fbi-ic3-2025]",
      audience: ["home", "business"],
    },
    {
      step: "File a complaint at ic3.gov, whatever the amount",
      detail: [
        "The Internet Crime Complaint Center (IC3) is the FBI's reporting site. Include full transaction details: date, amount, sending and receiving banks, account numbers, and the messages involved. Its Recovery Asset Team uses these reports to ask banks to freeze money, and in 2025 it froze $679 million across 3,900 incidents.[^fbi-ic3-2025]",
        "If the scam reached you at home, also report it to the Federal Trade Commission (FTC) at ReportFraud.ftc.gov.[^ftc-if-you-were-scammed-2026]",
      ],
      audience: ["home", "business"],
    },
    {
      step: "Secure the email account involved",
      detail: "From a clean device, change the password, sign out every session, delete any forwarding rules or filters you didn't create, and turn on MFA. Tell your IT provider: a mailbox that sent or received the fake request may still be in the attacker's hands.",
      audience: ["home", "business"],
    },
    {
      step: "Warn the real person or company",
      detail: "Call the real vendor, executive, title company or lawyer on a number you already trust. Their account may be the one that was taken over, and their other customers could be next.",
      audience: ["home", "business"],
    },
    {
      step: "Preserve the evidence",
      detail: "Keep the emails with full headers, texts, call logs, invoices and bank confirmations. Don't delete anything, even the parts that feel embarrassing; investigators and insurers need the whole trail.",
      audience: ["home", "business"],
    },
    {
      step: "Run your incident playbook and call your insurer",
      detail: "Open your incident response plan, notify your cyber insurer if you have one, and log every action with a time. Then fix the payment step that let the request through.",
      audience: ["business"],
    },
    {
      step: "Ignore anyone who offers to get the money back for a fee",
      detail: "The IC3 does not contact victims by phone, email or social media and never charges to recover funds.[^fbi-psa-ic3-impersonation-2025] Unsolicited 'recovery' offers are a second scam aimed at people who just lost money.[^fbi-psa-recovery-scams-2025]",
      audience: ["home", "business"],
    },
  ],

  faqs: [
    {
      question: "Can I still spot an AI-written phishing email?",
      answer: "Sometimes, but don't rely on it. AI removed most of the spelling and grammar mistakes people were taught to look for. Judge the request instead: anything that asks you to pay, change bank details, log in through a link, or keep a secret gets checked through a channel you already trust.",
    },
    {
      question: "Is business email compromise only an email problem?",
      answer: "No. The same scam runs through texts, phone calls, messaging apps and video meetings, and it often moves between them. A rule that covers only email leaves the door open, so verify the request whatever channel it arrived on.",
    },
    {
      question: "We're a small office. Would criminals bother with us?",
      answer: "Yes. Automation makes small targets cheap to reach, and small offices often have one person who can both set up and send a payment. That is exactly the gap a callback and a second approver close.",
    },
    {
      question: "Will my bank refund a payment I approved?",
      answer: "Not automatically. If you authorized the payment, getting it back usually depends on how fast the bank can recall it or have the receiving account frozen. Call right away, file at ic3.gov, and ask your bank now what recall options your account has.",
    },
    {
      question: "Doesn't DMARC stop this?",
      answer: "It helps against one trick: mail that pretends to come from your exact domain. It does nothing about lookalike domains or a real account that has been taken over, which is why a phone callback still matters.",
    },
  ],

  sourceIds: [
    "fbi-ic3-2025",
    "fbi-psa-genai-fraud-2024",
    "hao-llm-malicious-email-2025",
    "heiding-ai-spear-phishing-2024",
    "afp-payments-fraud-2026",
    "fincen-deepfake-alert-2024",
    "europol-iocta-2026",
    "ftc-older-consumers-2026",
    "fbi-psa-senior-officials-2025",
    "fbi-psa-bec-2024",
    "openai-malicious-uses-2025",
    "ftc-if-you-were-scammed-2026",
    "fbi-psa-ic3-impersonation-2025",
    "fbi-psa-recovery-scams-2025",
  ],

  related: {
    threats: ["voice-cloning-and-deepfake-scams", "ai-scaled-romance-and-investment-scams"],
    guides: [
      "two-channel-verification-for-payments",
      "family-safe-word-and-callback-rule",
      "digital-hygiene-for-your-business",
      "digital-hygiene-at-home",
    ],
    explainers: [],
    controls: [
      "out-of-band-verification",
      "email-authentication",
      "phishing-training",
      "multi-factor-authentication",
      "email-filtering",
      "email-reporting",
      "incident-response-plan",
    ],
    glossary: ["business-email-compromise", "phishing", "social-engineering", "deepfake"],
    toolkit: [],
  },
}
