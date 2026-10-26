// Verdict: a text says a package couldn't be delivered. Pure data,
// import-free. No statistics above the fold.
export default {
  kind: "verdict",
  slug: "package-text",
  title: "A text says my package couldn't be delivered",
  chip: "A text about a package that couldn't be delivered",
  metaTitle: "A text says my package is stuck. Is it real?",
  metaDescription:
    "Almost always a scam, especially if you never asked for text updates. The next two minutes, who to tell, and how to track a real package safely.",
  audience: ["home"],
  pillars: ["threats"],
  datePublished: "2026-10-26",
  lastReviewed: "2026-10",
  status: "published",

  tldr: "This is almost always a scam, especially if you never asked for text updates. Don't tap the link; track the package in the carrier's own app or on its website, typed in yourself.",
  verdict:
    "This is almost always a scam, especially if you never asked for text updates. Don't tap the link; track the package in the carrier's own app or on its website, typed in yourself.",

  nextTwoMinutes: [
    "Don't tap the link, and don't pay any \"redelivery fee.\"",
    "Expecting something? Find the tracking number on the store's own website or app, then enter it in the carrier's app or on its website, typed in yourself.",
    "Report the text as junk in your messaging app, or forward it to 7726, then delete it.",
    "Already paid a fee or typed a card number? Call the number on the back of your card and ask to block it.",
  ],

  whoToTell: [
    {
      label: "Your card's fraud line",
      detail: "The number on the back of your card, if you paid a fee or typed card details.",
      href: null,
    },
    {
      label: "spam@uspis.gov",
      detail: "If it claimed to be the Postal Service: send a screenshot showing the sender's number and the date, without tapping the link.",
      href: "mailto:spam@uspis.gov",
    },
    {
      label: "ReportFraud.ftc.gov",
      detail: "Tell the Federal Trade Commission, even if you didn't lose anything.",
      href: "https://reportfraud.ftc.gov/",
    },
  ],

  sayThis: "If a text says a package is stuck, I don't tap the link. I track it in the carrier's own app.",

  pathChip: { audience: "home", start: "money", label: "Start my path from here" },

  why: [
    "Fake delivery problems, usually pretending to be the Postal Service, were the most reported text scam of 2024. Many people reported paying a small redelivery fee that turned out to be a trick to get their card number.[^ftc-top-text-scams-2024]",
    "The U.S. Postal Inspection Service says the Postal Service won't text or email you unless you first asked for updates with a tracking number, and those messages won't contain a link. If you interacted with a link, even without entering anything, it says to contact your bank.[^uspis-smishing-2025]",
    "This isn't new: delivery texts were among the top five text scams of 2022 too, a year in which people reported losing $330 million to text scams.[^ftc-text-scams-2022]",
    "Why the rule holds: you never have to judge the text. A real tracking number works in the carrier's own app, and that's where any real problem will show.",
  ],

  stats: [
    {
      figure: "#1",
      text: "Fake package delivery problems were the most reported text scam of 2024.",
      sourceId: "ftc-top-text-scams-2024",
      locator: "FTC Data Spotlight, April 14, 2025",
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
      question: "I am waiting for a package. What if this one is real?",
      answer:
        "Then the problem will show when you track the package in the carrier's own app or on the store's website. Tracking it there costs you nothing, and you never need a link from a text to do it.",
    },
    {
      question: "I signed up for delivery texts. Does that change anything?",
      answer:
        "Real tracking texts you asked for don't ask you to pay a fee or type in a card number. If a text does either, treat it as a scam and check in the carrier's app.",
    },
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec"],
    guides: ["digital-hygiene-at-home"],
  },

  sourceIds: ["ftc-top-text-scams-2024", "uspis-smishing-2025", "ftc-text-scams-2022"],
}
