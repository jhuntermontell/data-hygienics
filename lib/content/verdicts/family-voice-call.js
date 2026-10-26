// Verdict: a call that sounded like a child or grandchild asking for money.
// Pure data, import-free. No statistics above the fold. Procedure, not
// detection: the page never asks the reader to judge the voice.
export default {
  kind: "verdict",
  slug: "family-voice-call",
  title: "A call sounded like my child or grandchild and asked for money",
  chip: "A call that sounded like family, asking for money",
  metaTitle: "A call sounded like family asking for money. Real?",
  metaDescription:
    "Treat it as a scam until you reach them yourself. The next two minutes, who to tell, and the call-back rule that works however real the voice sounds.",
  audience: ["home"],
  pillars: ["threats"],
  datePublished: "2026-10-26",
  lastReviewed: "2026-10",
  status: "published",

  tldr: "Treat it as a scam until you reach them yourself, because AI can copy a voice from a short clip. Hang up and call them on the number you already have before you send anything.",
  verdict:
    "Treat it as a scam until you reach them yourself, because AI can copy a voice from a short clip. Hang up and call them on the number you already have before you send anything.",

  nextTwoMinutes: [
    "Hang up, even if they beg you not to. Hurry and secrecy are part of the script.",
    "Call your family member on the number saved in your phone. No answer? Call someone who would be with them.",
    "If your family has a safe word, ask for it. No word, no money.",
    "Never pay by gift card, wire, crypto or cash handed to a courier on a call you didn't start.",
  ],

  whoToTell: [
    {
      label: "The rest of your family",
      detail: "Tell them it happened, so the next call reaches someone who already knows the rule.",
      href: null,
    },
    {
      label: "ReportFraud.ftc.gov",
      detail: "Tell the Federal Trade Commission, even if you didn't send anything.",
      href: "https://reportfraud.ftc.gov/",
    },
    {
      label: "ic3.gov",
      detail: "If money was sent, report it to the FBI's internet crime center with every detail you have, and call your bank.",
      href: "https://www.ic3.gov/",
    },
  ],

  sayThis: "If a call sounds like family asking for money, I hang up and call them back on the number I already have.",

  pathChip: { audience: "home", start: "people", label: "Start my path from here" },

  why: [
    "A scammer can copy a voice from a short audio clip, often taken from video posted online.[^ftc-ai-family-emergency-2023] The FBI's report on 2025 complaints says losses to these \"distress\" calls that used voice cloning passed $5 million, and that the calls now imitate other relatives and friends, not only grandchildren.[^fbi-ic3-2025]",
    "The FBI recommends a secret word or phrase that only your family knows, and hanging up to call back on a number you look up yourself.[^fbi-psa-genai-fraud-2024] The Federal Communications Commission (FCC) gives the same advice: reach the person directly before you send money.[^fcc-deepfake-robocalls-guide-2024]",
    "Pressure to keep the call secret, and requests for a wire, crypto, a payment app or gift cards, are signs of a scam. Call another relative or friend even if the caller says not to.[^ftc-fake-emergencies-2023]",
    "Why the rule holds: you never have to judge the voice. Calling back on a number you already have works whether the copy is perfect or not.",
  ],

  stats: [
    {
      figure: "Over $5 million",
      text: "Reported lost in 2025 to distress calls that used voice cloning, as counted in complaints that mentioned AI.",
      sourceId: "fbi-ic3-2025",
      locator: "2025 IC3 Annual Report, p. 39 (Artificial Intelligence section)",
    },
  ],

  faqs: [
    {
      question: "It really sounded like them. How can it not be real?",
      answer:
        "AI tools can copy a voice well enough to fool a parent, so the sound of the voice tells you nothing either way. That's why the answer is a procedure, not a judgment: hang up and call the number you already have.",
    },
    {
      question: "What if they really are in trouble and I can't reach them?",
      answer:
        "Call someone who would be with them, or the place they said they are, using a number you look up yourself. Real emergencies still have real people you can reach, and none of them need a gift card.",
    },
  ],

  related: {
    threats: ["voice-cloning-and-deepfake-scams"],
    guides: ["family-safe-word-and-callback-rule", "protect-an-older-relative-from-ai-phone-scams"],
  },

  sourceIds: [
    "ftc-ai-family-emergency-2023",
    "fbi-ic3-2025",
    "fbi-psa-genai-fraud-2024",
    "fcc-deepfake-robocalls-guide-2024",
    "ftc-fake-emergencies-2023",
  ],
}
