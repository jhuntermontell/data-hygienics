export default {
  kind: "guide",
  slug: "family-safe-word-and-callback-rule",
  title: "The family safe word and callback rule",
  metaTitle: "Family Safe Word and Callback Rule | Data Hygienics",
  metaDescription: "Set up a private family safe word and a hang-up-and-call-back habit so a cloned voice asking for money can't rush you into paying.",
  audience: ["home"],
  pillars: ["hygiene"],
  tldr: "Pick a private word your family uses only to prove who's really calling, and agree that any urgent request for money gets a hang-up and a callback to a number you already have. The FBI recommends the secret word, and the FTC and FCC recommend the callback.[^fbi-psa-genai-fraud-2024][^ftc-voice-cloning-challenge-2024][^fcc-deepfake-robocalls-guide-2024] Setting it up takes one family conversation.",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,

  timeToComplete: "15 minutes",
  difficulty: "easy",

  why: "AI can copy a voice well enough that recognizing it no longer proves who's calling. People reported losing more than $5 million in 2025 to 'distress' calls that used voice cloning, and the FBI says the script is spreading from grandchildren to other relatives and friends.[^fbi-ic3-2025] The FBI recommends a family secret word, AARP recommends a code word, and the FTC and FCC tell you to hang up and call back on a number you know.[^fbi-psa-genai-fraud-2024][^aarp-grandparent-scams-2025][^ftc-voice-cloning-challenge-2024][^fcc-deepfake-robocalls-guide-2024]",

  steps: [
    {
      title: "Gather the people who'd call each other in a crisis",
      detail: "Include grandparents, parents, adult children, teens, and anyone who handles money for the family. Do it in person or on a call you placed, not over text or email. Explain that this is about AI copying voices, not about anyone being gullible.",
      verify: "Everyone who might make or receive an emergency call was part of the conversation.",
    },
    {
      title: "Choose a word nobody could look up",
      detail: "Skip pet names, street names, birthdays, school mascots, and anything that appears on social media. Two unrelated words or an odd phrase works well, as long as everyone can remember it when they're scared. A family story only you share is another option AARP suggests.[^aarp-grandparent-scams-2025]",
      verify: "Scroll your family's public social profiles; the word isn't there and couldn't be guessed from them.",
    },
    {
      title: "Keep it in people's heads, not in chats",
      detail: "Don't text it, email it, post it, or put it in a shared note. If someone needs a reminder, give it in person or on a call you started. Adults who use a password manager can store it there.",
      verify: "The word doesn't appear in any family group chat or email thread.",
    },
    {
      title: "Agree exactly how to use it",
      detail: "Whoever gets an urgent call asks for the word, and the caller has to say it without hints. If the caller can't give it, changes the subject, or gets angry, treat it as a scam. The FBI recommends the same kind of code word for 'virtual kidnapping' texts that arrive with altered photos as proof.[^fbi-psa-virtual-kidnapping-2025]",
      verify: "Each person can explain the rule back in one sentence, such as 'No word, no money.'",
    },
    {
      title: "Add the callback rule",
      detail: "For any request to send money, share a code, or give personal details, hang up and call the person back on the number saved in your contacts, even if they gave the word. If you can't reach them, call another relative or friend, even if the caller asked you to keep it secret.[^ftc-fake-emergencies-2023] Caller ID can be faked, so never call back the number that called you.[^fcc-deepfake-robocalls-guide-2024]",
      verify: "Everyone has the others' numbers saved as contacts, and a backup person to call for each.",
    },
    {
      title: "Plan for the 'lawyer' or 'officer' on the line",
      detail: "Scammers often hand the phone to a fake police officer, lawyer, or court official who couldn't know the word anyway. Agree that nobody pays bail, fines, or fees over the phone, by gift card, by wire, by crypto, or to a courier at the door. AARP notes that law enforcement doesn't collect bail from relatives this way.[^aarp-grandparent-scams-2025]",
      verify: "Everyone agrees that a stranger taking over the call is a reason to hang up and call family.",
    },
    {
      title: "Practice once",
      detail: "Run a short drill: one person calls with a made-up emergency and the other asks for the word, then hangs up and calls back. Keep it light, and do it again with grandparents and kids, who are the most likely to get a real attempt.",
      verify: "The person answering asked for the word and called back without being prompted.",
    },
    {
      title: "Change the word when it's been exposed",
      detail: "Pick a new word after it's used in a real call, if it was said where others could hear, or if someone leaves the family circle. Otherwise, revisit it once a year.",
      verify: "You've set a yearly calendar reminder to check the word still works for everyone.",
    },
  ],

  limits: [
    "A safe word only works while it stays secret. Once it's said on speakerphone, typed in a group chat, or posted, treat it as burned and pick a new one.",
    "Scammers usually dodge the question rather than fail it. They claim to be too hurt or panicked to think, or they pass the phone to a fake official, so the rule has to be 'no word, no money', not 'they sounded right'.",
    "A callback can't help if a relative's own phone or messaging account has been taken over. That's why the rule includes a second family member to check with.",
    "People forget under stress, especially young children and anyone with memory changes. Keep the word simple, and lean on the callback rule when the word fails.",
    "It doesn't cover scams that impersonate banks, government agencies, or tech support instead of someone you know. The callback rule still works for those; the safe word doesn't.",
    "It can delay help in a real emergency by a few minutes while you check. Agree as a family that a short delay to verify is acceptable.",
  ],

  faqs: [
    {
      question: "Isn't a safe word overkill?",
      answer: "It costs nothing and takes one conversation. AI can now copy a voice from a short clip, so a word that only your family knows is one of the few checks a scammer can't fake.",
    },
    {
      question: "What if a relative in a real emergency can't remember the word?",
      answer: "Fall back on the callback rule. Hang up, call them on the number in your contacts, and if you can't reach them, call someone else in the family before sending anything.",
    },
    {
      question: "Should we use the safe word over text?",
      answer: "No. Typing it leaves a copy that a hacked phone or account could expose. Use it only in live voice conversations, and verify texts by calling the person.",
    },
    {
      question: "Does this work for businesses too?",
      answer: "The callback part does. Businesses should require a second, separate channel to confirm any payment request, which our two-channel verification guide walks through.",
    },
  ],

  sourceIds: [
    "fbi-psa-genai-fraud-2024",
    "ftc-voice-cloning-challenge-2024",
    "fcc-deepfake-robocalls-guide-2024",
    "fbi-ic3-2025",
    "aarp-grandparent-scams-2025",
    "fbi-psa-virtual-kidnapping-2025",
    "ftc-fake-emergencies-2023",
  ],

  related: {
    threats: ["voice-cloning-and-deepfake-scams"],
    guides: [
      "protect-an-older-relative-from-ai-phone-scams",
      "two-channel-verification-for-payments",
      "digital-hygiene-at-home",
    ],
    explainers: [],
    controls: ["out-of-band-verification"],
    glossary: ["voice-cloning", "deepfake", "vishing"],
    toolkit: [],
  },
}
