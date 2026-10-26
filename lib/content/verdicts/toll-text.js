// Verdict: a text about an unpaid toll. Pure data, import-free.
// Above the fold (tldr, verdict, nextTwoMinutes, whoToTell, sayThis) carries
// no statistics; figures live in `why` and `stats` with their sources.
export default {
  kind: "verdict",
  slug: "toll-text",
  title: "A text says I owe a toll",
  chip: "A text about an unpaid toll",
  metaTitle: "A text says I owe a toll. Is it real?",
  metaDescription:
    "Almost always a scam. What to do in the next two minutes, who to tell, and the one rule that keeps a toll text from costing you anything.",
  audience: ["home"],
  pillars: ["threats"],
  datePublished: "2026-10-26",
  lastReviewed: "2026-10",
  status: "published",

  tldr: "This is almost always a scam. Don't pay through the link; check what you owe on the toll agency's own website or app, which you look up yourself.",
  verdict:
    "This is almost always a scam. Don't pay through the link; check what you owe on the toll agency's own website or app, which you look up yourself.",

  nextTwoMinutes: [
    "Don't tap the link or reply, not even to send STOP.",
    "Look up your toll agency's website or app yourself and check your balance there. If the real account shows nothing due, the text wasn't real.",
    "Report the text as junk in your messaging app, or forward it to 7726, then delete it.",
    "Already paid or typed a card number? Call the number on the back of your card now and ask to block the card and dispute the charge.",
  ],

  whoToTell: [
    {
      label: "Your card's fraud line",
      detail: "The number on the back of your card, if you paid or typed in card details.",
      href: null,
    },
    {
      label: "ReportFraud.ftc.gov",
      detail: "Tell the Federal Trade Commission. Reports shape the warnings everyone else gets.",
      href: "https://reportfraud.ftc.gov/",
    },
    {
      label: "ic3.gov",
      detail: "The FBI's internet crime center asks for the number the text came from and the website it pointed to.",
      href: "https://www.ic3.gov/",
    },
  ],

  sayThis: "If a text says I owe a toll, I don't tap the link. I check my balance on the agency's own site.",

  pathChip: { audience: "home", start: "money", label: "Start my path from here" },

  why: [
    "Reports of government imposter scams to the Federal Trade Commission (FTC) rose 40% in 2025, thanks in part to messages about overdue tolls.[^ftc-imposter-trends-2026] The texts borrow the names of real toll programs and threaten late fees or a suspended registration, so you pay before you check.[^ftc-imposter-trends-2026]",
    "Unpaid-toll notices were one of the five most reported text scams of 2024, a year in which people reported losing $470 million to scams that started with a text.[^ftc-top-text-scams-2024]",
    "In spring 2024, the FBI's internet crime center logged more than 2,000 complaints about toll texts in just over a month, and told people to check their account on the toll service's real website instead of the link.[^fbi-psa-toll-smishing-2024]",
    "Why the rule holds: you never have to judge whether the text looks real. Your actual balance lives on the agency's own site, and checking there takes the same minute either way.",
  ],

  stats: [
    {
      figure: "40%",
      text: "Rise in government imposter reports to the FTC in 2025, driven in part by overdue-toll texts.",
      sourceId: "ftc-imposter-trends-2026",
      locator: "FTC consumer alert, May 7, 2026",
    },
    {
      figure: "$470 million",
      text: "Reported lost in 2024 to scams that started with a text message.",
      sourceId: "ftc-top-text-scams-2024",
      locator: "FTC Data Spotlight, April 14, 2025",
    },
  ],

  faqs: [
    {
      question: "What if I really do owe a toll?",
      answer:
        "Then it will show on the toll agency's own website or app, or on a bill sent to the address on your vehicle registration. Paying there settles it. Paying through a link in a text does not.",
    },
    {
      question: "I tapped the link but didn't type anything. Am I okay?",
      answer:
        "Most likely. Close the page and keep your phone's software up to date. If you typed a card number or any other details, follow the steps for a clicked link: call your card's fraud line and change any password you entered.",
    },
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec"],
    guides: ["digital-hygiene-at-home"],
  },

  sourceIds: ["ftc-imposter-trends-2026", "ftc-top-text-scams-2024", "fbi-psa-toll-smishing-2024"],
}
