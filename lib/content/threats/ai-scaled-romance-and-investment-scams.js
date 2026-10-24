export default {
  kind: "threat",
  slug: "ai-scaled-romance-and-investment-scams",
  title: "AI-scaled romance and investment scams",
  metaTitle: "AI Romance and Investment Scams | Data Hygienics",
  metaDescription: "How scam operations use AI to run fake romances and crypto 'investment' pitches at scale, how to protect yourself or a parent, and what to do next.",
  audience: ["home"],
  pillars: ["threats"],
  tldr: "Organized scam operations now use AI to translate, script and run many online 'relationships' at once, usually steering people toward fake crypto investments. Investment fraud was the costliest crime reported to the FBI in 2025 at $8.6 billion, and people 60 and older reported $3.5 billion of it.[^fbi-ic3-2025] Being targeted says nothing about your intelligence; these are professional operations. The rule that holds: never send money or crypto to someone you have only met online, and talk it over with someone you trust first.",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,

  severity: "high",
  aiRole: "ai-enabled",

  whatItIs: [
    "These scams build trust over weeks or months, as a romance, a friendship or a mentor relationship, then turn that trust into 'investments' on a fake trading platform that shows invented profits.[^fbi-ic3-2025] INTERPOL calls the romance-plus-crypto version romance baiting; you may also see the slang name 'pig butchering' in news and government notices.[^interpol-fraud-assessment-2026][^treasury-prince-group-2025]",
    "Many run from scam compounds in Southeast Asia, where trafficked workers are often forced to do the typing.[^fbi-ic3-2025][^unodc-inflection-point-2025] In October 2025 the Justice Department charged the alleged head of one Cambodian network and moved to seize about 127,271 bitcoin, then worth about $15 billion;[^doj-prince-group-2025] in January 2026 Cambodia arrested him and sent him to China to face charges there.[^occrp-chen-zhi-extradition-2026]",
    "AI doesn't change the playbook. It lets each operator handle more conversations in fluent language, with translation, scripted replies and fake profiles on tap.[^openai-malicious-uses-2025][^europol-iocta-2026]",
  ],

  stats: [
    {
      figure: "$8.6 billion",
      context: "Investment fraud losses reported to the FBI in 2025, the largest of any crime type, from 72,984 complaints.",
      sourceId: "fbi-ic3-2025",
      locator: "p.7 (complaint counts) and p.8 (losses)",
    },
    {
      figure: "$7.2 billion",
      context: "The cryptocurrency share of those losses. The FBI says crypto investment fraud is largely run by Southeast Asian crime groups using trafficked people as forced labor.",
      sourceId: "fbi-ic3-2025",
      locator: "p.11 and p.53",
    },
    {
      figure: "$929 million",
      context: "Romance and confidence fraud losses reported to the FBI in 2025, from 23,159 complaints.",
      sourceId: "fbi-ic3-2025",
      locator: "p.7 and p.8",
    },
    {
      figure: "$632 million",
      context: "Investment fraud losses in 2025 complaints that mentioned AI. Total investment losses reached $8.6 billion, and the FBI notes that many victims don't realize how much AI was involved.",
      sourceId: "fbi-ic3-2025",
      locator: "p.40 and p.42",
    },
    {
      figure: "At least $10 billion",
      context: "A US government estimate of what Americans lost to Southeast Asia-based scam operations in 2024, up 66% from the year before.",
      sourceId: "treasury-prince-group-2025",
      locator: "Press release, section 'Over $16 billion lost to online scams'",
    },
    {
      figure: "Nearly 60%",
      context: "Share of people who reported losing money to a romance scam to the FTC in 2025 who said it started on social media.",
      sourceId: "ftc-social-media-scams-2026",
      locator: "Footnote 5",
    },
    {
      figure: "78%",
      context: "Share of the 3,780 crypto investment fraud victims the FBI contacted in 2025 who didn't know they were being scammed.",
      sourceId: "fbi-ic3-2025",
      locator: "p.20, Operation Level Up",
    },
    {
      figure: "$1.4 billion",
      context: "Losses in 10,516 complaints about 'recovery' scams that target people who already lost money; the total can include the earlier loss.",
      sourceId: "fbi-ic3-2025",
      locator: "p.53",
    },
  ],

  howItLooks: [
    {
      audience: "home",
      title: "The wrong-number text",
      scenario: "A friendly text arrives for someone else, you reply to say so, and the sender keeps chatting. Within days you're invited to a WhatsApp 'investment club' where half a dozen members swap tips and celebrate wins. OpenAI documented one Cambodia-linked operation that bulk-texted US phone numbers with invitations to groups like this, where every 'investor' was played by the scammers and the chatter was translated from Chinese in one block.[^openai-malicious-uses-2025] The club's mentor points you to a trading app that shows steady profits, and when you try to withdraw, you're told to pay taxes or fees first.[^fbi-ic3-2025]",
    },
    {
      audience: "home",
      title: "The attentive new friend",
      scenario: "After losing her husband, a retired teacher starts talking with a kind, attentive man she met on social media. His messages arrive at all hours in warm, perfect English, and he never quite manages a long video call. Anthropic found a Telegram service with more than 10,000 monthly users offering AI tools to write emotionally persuasive replies for romance scams, and UNODC, the UN's crime agency, reports scam centers using deepfake filters on video calls.[^anthropic-threat-intel-2025][^unodc-inflection-point-2025] Weeks later he mentions his crypto gains and offers to show her how. The FTC finds older adults are 48% more likely than younger adults to report losing money to a romance scam, and people 60 and older reported $584 million in romance and confidence losses to the FBI in 2025.[^ftc-older-consumers-2026][^fbi-ic3-2025]",
    },
    {
      audience: "home",
      title: "The celebrity-backed investment club",
      scenario: "An ad on social media shows a famous investor or chief executive in a video, inviting you to a private stock or crypto 'club'. The FBI warns that these clubs use AI-generated video and voices of celebrities and trusted figures so the pitch looks endorsed.[^fbi-ic3-2025] Inside the group, an 'analyst' shares picks that seem to work at first. In 2025, people reported $1.1 billion lost to investment scams that began on social media.[^ftc-social-media-scams-2026]",
    },
    {
      audience: "home",
      title: "The 'law firm' that offers to help",
      scenario: "Months after losing savings to a fake platform, a man hears from a law firm that says he's on a government list of scam victims. It knows the exact amounts and dates of his transfers, claims to work with federal agencies, and asks for a fee in crypto or gift cards to release his recovered money.[^fbi-psa-recovery-scams-2025] The FBI warns these firms are fake and that the government does not charge for law enforcement help.[^fbi-psa-recovery-scams-2025] Recovery-scam complaints reported $1.4 billion in losses in 2025, a total that can include the original scam.[^fbi-ic3-2025]",
    },
  ],

  howItGetsIn: [
    "A cold start that looks harmless: a wrong-number text, a social media message, a dating match or an ad, followed quickly by a move to a private messaging app.[^fbi-ic3-2025]",
    "Social media above all: in 2025, $2.1 billion in losses reported to the FTC began on social media, more than any other way scammers made contact.[^ftc-social-media-scams-2026]",
    "AI translation and scripts: scam centers use large language models to translate and write messages, and chatbots to screen and groom targets at volume.[^unodc-inflection-point-2025][^europol-iocta-2026][^interpol-fraud-assessment-2026]",
    "Machines that can win trust: in one small week-long study (22 volunteers), participants trusted an AI chat partner more than human ones, and 46% followed its harmless request versus 18% for the humans.[^gressel-romance-baiting-2025]",
    "Fake faces and proof: AI-generated profile photos, plus short videos or video calls that seem to prove a real person is there.[^fbi-psa-genai-fraud-2024]",
    "Borrowed authority: AI-generated videos of celebrities, chief executives or other trusted figures promoting investment clubs.[^fbi-ic3-2025]",
    "A fake platform: a professional-looking app or website that shows growing profits, offers loans to invest more, and demands fees before any withdrawal.[^fbi-ic3-2025]",
    "A second wave: 'recovery' firms and fake officials who contact people who already lost money.[^fbi-psa-recovery-scams-2025][^fbi-psa-ic3-impersonation-2025]",
  ],

  whatStopsIt: [
    {
      title: "Keep one rule: no money for people you've only met online",
      detail: "Don't send money, gift cards or crypto to anyone you know only from the internet or the phone, however long you've been talking. That is the FBI's own advice for AI-enabled scams.[^fbi-psa-genai-fraud-2024]",
      audience: ["home"],
    },
    {
      title: "Talk it through with someone you trust",
      detail: "Before acting on any investment idea that came from an online contact, describe it out loud to a friend, a relative or your bank. Scammers push secrecy because a second opinion breaks the spell, and asking is a strength, not an admission.",
      audience: ["home"],
      guideSlug: "protect-an-older-relative-from-ai-phone-scams",
    },
    {
      title: "Check the person and the platform yourself",
      detail: "Search the app's or firm's name with the word 'scam', and look up any broker or adviser on BrokerCheck, the free lookup run by the Financial Industry Regulatory Authority (FINRA), or with your state securities regulator. Run a reverse image search on profile photos. If the only way to reach a platform is a link from your new contact, treat it as fake.",
      audience: ["home"],
    },
    {
      title: "Treat 'pay to withdraw' as the end of the story",
      detail: "A real investment doesn't make you pay taxes or fees upfront to get your own money out. The FBI describes that demand as the scammers' last attempt to take more before they disappear.[^fbi-ic3-2025]",
      audience: ["home"],
    },
    {
      title: "Name a trusted contact on financial accounts",
      detail: "Brokerage firms ask for a trusted contact they may call if they can't reach you or suspect financial exploitation. That person can't trade or see your balance, so it adds a safety net without giving up control.[^finra-trusted-contact-2025]",
      audience: ["home"],
      guideSlug: "protect-an-older-relative-from-ai-phone-scams",
    },
    {
      title: "Assume a voice or a face can be faked",
      detail: "A video call or voice note no longer proves a person is who they say.[^fbi-psa-genai-fraud-2024] Agree on a family safe word and call back on numbers you already have.",
      audience: ["home"],
      guideSlug: "family-safe-word-and-callback-rule",
    },
    {
      title: "Help a parent with curiosity, not blame",
      detail: "If you're worried about a parent's new online friend, ask open questions about how they met and whether money or investing has come up. Offer to look at the 'platform' together, and keep the door open so they keep talking to you.",
      audience: ["home"],
      guideSlug: "protect-an-older-relative-from-ai-phone-scams",
    },
  ],

  ifItHappens: [
    {
      step: "Stop sending money, and save everything",
      detail: "Don't confront or warn the scammer. Save the chats, profile names, phone numbers, website and app addresses, wallet addresses and transaction IDs; reports and any recovery depend on them.",
      audience: ["home"],
    },
    {
      step: "Call your bank or crypto exchange right away",
      detail: "Tell them the payment was fraud and ask them to stop or reverse it. Crypto has fewer protections than cards or bank transfers, so speed matters.[^ftc-if-you-were-scammed-2026]",
      audience: ["home"],
    },
    {
      step: "Report to the FBI and the FTC",
      detail: "File at ic3.gov with full transaction details, whatever the amount, and at ReportFraud.ftc.gov.[^fbi-ic3-2025][^ftc-if-you-were-scammed-2026] Also report the profile to the app or social network where it started.",
      audience: ["home"],
    },
    {
      step: "Older adults can get help filing",
      detail: "The Justice Department's National Elder Fraud Hotline, 833-FRAUD-11 (833-372-8311), helps people 60 and older and their families file a report.[^ovc-elder-fraud-hotline-2026]",
      audience: ["home"],
    },
    {
      step: "Say no to anyone offering recovery for a fee",
      detail: "The IC3, the FBI's Internet Crime Complaint Center, never contacts victims directly by phone, email or social media and never charges to recover money.[^fbi-psa-ic3-impersonation-2025] Law firms or 'agents' who know your losses and ask for fees are running a second scam.[^fbi-psa-recovery-scams-2025]",
      audience: ["home"],
    },
    {
      step: "Secure your accounts and identity",
      detail: "If you shared passwords, ID documents or remote access to your computer, change those passwords, turn on multi-factor authentication (MFA), and consider freezing your credit with the three credit bureaus.",
      audience: ["home"],
    },
    {
      step: "Be kind to yourself, and reach out",
      detail: "These scams are run by organized crime with scripts and AI, and in 2025 most of the victims the FBI contacted had no idea they were being scammed.[^fbi-ic3-2025] Tell someone you trust. If shame or despair feels overwhelming, call or text 988 at any hour.[^samhsa-988-2025]",
      audience: ["home"],
    },
  ],

  faqs: [
    {
      question: "Why don't you call these 'pig butchering' scams?",
      answer: "That slang name likens the people targeted to animals being fattened for slaughter. We use plainer terms, romance baiting or relationship investment scams, because the people harmed deserve better than the criminals' vocabulary.",
    },
    {
      question: "How can I tell if I'm chatting with AI?",
      answer: "Often you can't, and you don't need to. Watch the behavior instead: someone you've never met in person who moves you to a private app, avoids live video, and sooner or later brings up money or investing.",
    },
    {
      question: "My parent is in one of these relationships and won't listen. What can I do?",
      answer: "Stay close and stay calm, because shame pushes people to hide transfers. Ask questions, offer to review the 'platform' together, and talk with their bank or brokerage about alerts and a trusted contact. Our guide to protecting an older relative walks through the conversation.",
    },
    {
      question: "Can stolen crypto ever be recovered?",
      answer: "Sometimes. Law enforcement does freeze and seize scam funds, which is why a fast, detailed report at ic3.gov matters. No legitimate agency or firm will ask you to pay upfront to get it back.",
    },
    {
      question: "Is it ever safe to invest with someone I met online?",
      answer: "Not through them. If you want to invest, go to a registered firm you find yourself, never through an app, link or contact that came from a new online acquaintance.",
    },
  ],

  sourceIds: [
    "fbi-ic3-2025",
    "interpol-fraud-assessment-2026",
    "treasury-prince-group-2025",
    "unodc-inflection-point-2025",
    "doj-prince-group-2025",
    "openai-malicious-uses-2025",
    "europol-iocta-2026",
    "ftc-social-media-scams-2026",
    "anthropic-threat-intel-2025",
    "ftc-older-consumers-2026",
    "fbi-psa-recovery-scams-2025",
    "gressel-romance-baiting-2025",
    "fbi-psa-genai-fraud-2024",
    "fbi-psa-ic3-impersonation-2025",
    "finra-trusted-contact-2025",
    "ftc-if-you-were-scammed-2026",
    "samhsa-988-2025",
    "ovc-elder-fraud-hotline-2026",
    "occrp-chen-zhi-extradition-2026",
  ],

  related: {
    threats: ["voice-cloning-and-deepfake-scams", "ai-powered-phishing-and-bec"],
    guides: [
      "protect-an-older-relative-from-ai-phone-scams",
      "family-safe-word-and-callback-rule",
      "digital-hygiene-at-home",
    ],
    explainers: [],
    controls: [],
    glossary: ["romance-baiting", "social-engineering", "deepfake"],
    toolkit: [],
  },
}
