// Verdict: I clicked a link, or gave out information, and I'm not sure what
// happens now. Pure data, import-free. No statistics above the fold.
export default {
  kind: "verdict",
  slug: "clicked-a-link",
  title: "I clicked a link and I'm not sure what happens now",
  chip: "I clicked a link or gave out information",
  metaTitle: "I clicked a scam link. What happens now?",
  metaDescription:
    "Usually fixable, in order. Close it, change that password from the real app, lock the account down, and freeze your credit if you shared an ID number.",
  audience: ["home"],
  pillars: ["threats"],
  datePublished: "2026-10-26",
  lastReviewed: "2026-10",
  status: "published",

  tldr: "A click is usually fixable, and what you do next matters more than the click. Close the page, then change the password for the account the link pretended to be, from the real app and from a different device if you can.",
  verdict:
    "A click is usually fixable, and what you do next matters more than the click. Close the page, then change the password for the account the link pretended to be, from the real app and from a different device if you can.",

  nextTwoMinutes: [
    "Close the page. Don't type anything else into it, and don't call any number it showed you.",
    "Open the real app, or type the website yourself, and change that account's password. If you used the same password anywhere else, change it there too.",
    "Turn on two-step sign-in or a passkey for that account, and check that the recovery email and phone number are still yours.",
    "Typed a card number? Call the number on the card. Gave a Social Security number? Freeze your credit with each of the three credit bureaus; it's free.",
  ],

  whoToTell: [
    {
      label: "Your bank or card company",
      detail: "If you entered any card or bank details. Use the number on your card, not one from the page.",
      href: null,
    },
    {
      label: "IdentityTheft.gov",
      detail: "If you shared a Social Security number or an ID. It builds a recovery plan based on what was taken.",
      href: "https://www.identitytheft.gov/",
    },
    {
      label: "ReportFraud.ftc.gov",
      detail: "Tell the Federal Trade Commission what the message said and where it led.",
      href: "https://reportfraud.ftc.gov/",
    },
  ],

  sayThis: "If I click something I shouldn't, I close it and change that password from the real app, not from the link.",

  pathChip: { audience: "home", start: "accounts", label: "Start my path from here" },

  why: [
    "Phishing and spoofing were the most reported crime type to the FBI's internet crime center in 2025, with 191,561 complaints.[^fbi-ic3-2025] Clicking one of these links is common, and it is not the end of the story.",
    "If you think a scammer has your information, the Federal Trade Commission (FTC) points you to IdentityTheft.gov, which lists steps based on what was taken. If you think a link downloaded harmful software, update your security software and run a scan.[^ftc-phishing-2022]",
    "A credit freeze costs nothing to place or lift, and it doesn't affect your credit score. You ask each of the three credit bureaus separately.[^ftc-credit-freeze-2025]",
    "If you paid, the FTC's recovery steps depend on how: your bank for transfers, your card company for cards, the gift card company for gift cards.[^ftc-if-you-were-scammed-2026]",
    "Why the rule holds: most of the harm from a bad link comes from what gets typed into it. Changing the password from the real app takes back a password you gave away, and two-step sign-in means a password alone isn't enough next time.",
  ],

  stats: [
    {
      figure: "191,561",
      text: "Phishing and spoofing complaints to the FBI in 2025, the most of any crime type.",
      sourceId: "fbi-ic3-2025",
      locator: "2025 IC3 Annual Report, p. 7 (complaints by crime type)",
    },
  ],

  faqs: [
    {
      question: "I only opened the page and didn't type anything. Do I still need to do all this?",
      answer:
        "Close the page and keep your phone or computer updated. Changing the password is a cheap extra step if you're unsure what you typed. The credit freeze is only for when you shared an ID number.",
    },
    {
      question: "Should I wipe my phone?",
      answer:
        "Usually not. Update it, run the security scan your device offers, and change the passwords in the steps above. If your accounts keep changing without you, ask the account provider for help through its real app or website.",
    },
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec"],
    guides: ["digital-hygiene-at-home"],
  },

  sourceIds: ["fbi-ic3-2025", "ftc-phishing-2022", "ftc-credit-freeze-2025", "ftc-if-you-were-scammed-2026"],
}
