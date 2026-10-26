// Verdict: a call or text claiming to be the bank's fraud department.
// Pure data, import-free. No statistics above the fold.
export default {
  kind: "verdict",
  slug: "bank-fraud-call",
  title: "A call or text says it's my bank's fraud department",
  chip: "My bank's \"fraud department\" called or texted",
  metaTitle: "My bank's fraud department called. Is it real?",
  metaDescription:
    "Treat it as a scam until you call your bank yourself. The next two minutes, who to tell, and the one rule a fake fraud team can't get around.",
  audience: ["home"],
  pillars: ["threats"],
  datePublished: "2026-10-26",
  lastReviewed: "2026-10",
  status: "published",

  tldr: "Treat it as a scam until you've called your bank yourself. Hang up, then dial the number on the back of your card or open your bank's app; a real fraud team will still be there.",
  verdict:
    "Treat it as a scam until you've called your bank yourself. Hang up, then dial the number on the back of your card or open your bank's app; a real fraud team will still be there.",

  nextTwoMinutes: [
    "Hang up, or stop replying. You don't need a reason, and you don't need to be polite.",
    "Call the number on the back of your card, or use your bank's app. Don't use any number from the call or text.",
    "Tell the bank what happened. If there really is a problem, they'll see it on your account.",
    "Already moved money, read out a code, or shared a password? Say that first, and ask the bank to stop or recall the transfer right away.",
  ],

  whoToTell: [
    {
      label: "Your bank's fraud line",
      detail: "The number on your card or in the bank's app. Ask them to note the contact on your account.",
      href: null,
    },
    {
      label: "ReportFraud.ftc.gov",
      detail: "Tell the Federal Trade Commission, even if you didn't lose anything.",
      href: "https://reportfraud.ftc.gov/",
    },
    {
      label: "Anyone at home who answers the phone",
      detail: "Share the rule below so they hang up and call the card too.",
      href: null,
    },
  ],

  sayThis: "If someone calls about fraud on my account, I'll hang up and call the number on my card.",

  pathChip: { audience: "home", start: "money", label: "Start my path from here" },

  why: [
    "Copycat bank fraud alerts topped the Federal Trade Commission's (FTC) list of text scams for 2022. Reports of texts impersonating banks were up nearly twentyfold since 2019, and the median reported loss was $3,000.[^ftc-text-scams-2022]",
    "The usual pattern is a text about a large charge. If you reply, a fake fraud department calls, and people believe the bank is protecting their money while they are the ones moving it out.[^ftc-text-scams-2022] Fake fraud alerts were still among the five most reported text scams in 2024.[^ftc-top-text-scams-2024]",
    "Bank impersonators often tell people to move money to keep it safe.[^ftc-older-consumers-2026] The FTC's advice is to ignore unexpected requests to move or send money, and to check the story using a phone number, website or app you know is real.[^ftc-move-money-alert-2024]",
    "Caller ID can be faked, so a familiar name on the screen proves nothing.[^fcc-deepfake-robocalls-guide-2024] Why the rule holds: the call you start is the only one you can trust, and that stays true however convincing the caller sounds.",
  ],

  stats: [
    {
      figure: "Nearly 20x",
      text: "Growth in reports of texts impersonating banks, 2019 to 2022.",
      sourceId: "ftc-text-scams-2022",
      locator: "FTC Data Spotlight, June 8, 2023",
    },
    {
      figure: "$3,000",
      text: "Median reported loss to bank-impersonation texts in 2022.",
      sourceId: "ftc-text-scams-2022",
      locator: "FTC Data Spotlight, June 8, 2023",
    },
  ],

  faqs: [
    {
      question: "What if it really was my bank?",
      answer:
        "Then calling the number on your card reaches the same fraud team. Hanging up costs you a minute and nothing else, and a real bank expects you to check.",
    },
    {
      question: "The caller knew part of my card number. Doesn't that prove it's real?",
      answer:
        "No. Scammers often have pieces of your information from old data breaches. Knowing a few digits is not proof, and a real bank never needs you to read them a code, move money, or install an app.",
    },
  ],

  related: {
    threats: ["voice-cloning-and-deepfake-scams"],
    guides: ["protect-an-older-relative-from-ai-phone-scams", "family-safe-word-and-callback-rule"],
  },

  sourceIds: [
    "ftc-text-scams-2022",
    "ftc-top-text-scams-2024",
    "ftc-older-consumers-2026",
    "ftc-move-money-alert-2024",
    "fcc-deepfake-robocalls-guide-2024",
  ],
}
