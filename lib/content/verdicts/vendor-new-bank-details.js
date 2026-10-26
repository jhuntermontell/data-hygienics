// Verdict (business): a vendor emailed new bank details. Pure data,
// import-free. No statistics above the fold.
export default {
  kind: "verdict",
  slug: "vendor-new-bank-details",
  title: "A vendor emailed us new bank details",
  chip: "A vendor emailed new bank details",
  metaTitle: "A vendor emailed new bank details. Is it real?",
  metaDescription:
    "Don't pay the new account until a phone call confirms it. The next two minutes, who to tell, and the two-channel rule that stops invoice fraud.",
  audience: ["business"],
  pillars: ["threats"],
  datePublished: "2026-10-26",
  lastReviewed: "2026-10",
  status: "published",

  tldr: "Don't pay the new account until a phone call confirms the change. Call the vendor on a number you already had before this email, and hold the payment until someone you know there says yes.",
  verdict:
    "Don't pay the new account until a phone call confirms the change. Call the vendor on a number you already had before this email, and hold the payment until someone you know there says yes.",

  nextTwoMinutes: [
    "Hold the payment. Don't reply to the email, and don't use any phone number or link in it.",
    "Call the vendor on a number from your own records: an earlier invoice, your contacts, or their website typed in yourself.",
    "Ask someone you know there to confirm the change. If they didn't send it, tell them their email may be compromised.",
    "Already paid the new account? Call your bank now and ask them to recall the transfer, then report it at ic3.gov.",
  ],

  whoToTell: [
    {
      label: "Your bank",
      detail: "Right away if money went out. Ask for a recall of the transfer and what else they can do.",
      href: null,
    },
    {
      label: "ic3.gov",
      detail: "The FBI asks businesses to report every case, whatever the amount, with the transfer details.",
      href: "https://www.ic3.gov/",
    },
    {
      label: "The vendor",
      detail: "On the number you already had. Someone may be inside their email, and their other customers are next.",
      href: null,
    },
  ],

  sayThis: "If a vendor emails new bank details, we call them on the number we already have before we pay.",

  pathChip: { audience: "business", start: "other", label: "Start our path from here" },

  why: [
    "Business email compromise, where a criminal poses as a vendor or a colleague to redirect a payment, cost $3.05 billion across 24,768 complaints to the FBI in 2025, second only to investment fraud.[^fbi-ic3-2025] Businesses also reported more than $30 million in these losses where AI was involved, a floor because only complaints that mention AI are counted.[^fbi-ic3-2025]",
    "Fraudsters mostly impersonate vendors or executives to change payment instructions. In a 2026 survey of treasury professionals, calling an authorized contact on a number from your own records was the control most often rated very effective against it.[^afp-payments-fraud-2026]",
    "The FBI's advice is to verify any change to account information through a second channel. If money has gone, contact your bank immediately to request a recall, and file at ic3.gov regardless of the amount.[^fbi-psa-bec-2024]",
    "Speed matters. In 2025 the FBI's Recovery Asset Team froze $679 million of the $1.16 billion in attempted theft it worked on, which is why the call to your bank comes first.[^fbi-ic3-2025]",
    "Why the rule holds: you never have to judge whether the email is real. A real change survives a phone call to a number you already had, and a fake one doesn't.",
  ],

  stats: [
    {
      figure: "$3.05 billion",
      text: "Reported business email compromise losses in 2025, from 24,768 complaints.",
      sourceId: "fbi-ic3-2025",
      locator: "2025 IC3 Annual Report, pp. 7-8 (complaints and losses by crime type)",
    },
    {
      figure: "$679 million",
      text: "Frozen by the FBI's Recovery Asset Team in 2025, out of $1.16 billion in attempted theft it worked on.",
      sourceId: "fbi-ic3-2025",
      locator: "2025 IC3 Annual Report, p. 17 (Recovery Asset Team)",
    },
  ],

  faqs: [
    {
      question: "The email came from the vendor's real address. Isn't that enough?",
      answer:
        "No. If a criminal is inside the vendor's mailbox, the email really does come from their address, sometimes as a reply in a thread you already have. That's why the check is a phone call on a number you had before, not a look at the email.",
    },
    {
      question: "Won't calling every time annoy our vendors?",
      answer:
        "Most vendors are glad you checked, because the fraud hurts them too. Tell them once that you confirm every bank-detail change by phone, and the call becomes routine.",
    },
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec"],
    guides: ["two-channel-verification-for-payments", "one-page-ai-use-rule-for-your-team"],
  },

  sourceIds: ["fbi-ic3-2025", "afp-payments-fraud-2026", "fbi-psa-bec-2024"],
}
