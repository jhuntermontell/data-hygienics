export default {
  kind: "threat",
  slug: "voice-cloning-and-deepfake-scams",
  title: "Voice cloning and deepfake scams",
  metaTitle: "Voice Cloning and Deepfake Scams | Data Hygienics",
  metaDescription: "How scammers fake a loved one's voice or a boss on a video call, the checks that stop them, and who to call fast if money has already moved.",
  audience: ["home", "business"],
  pillars: ["threats"],
  tldr: "Criminals can copy a voice from a short clip and fake faces on a video call, then use them to ask for money in a hurry. In 2025 the FBI logged 22,364 complaints that mentioned AI, with losses near $893 million, most of it in investment scams; voice-cloned 'distress' calls alone cost victims more than $5 million.[^fbi-ic3-2025] The defense is low-tech: pause, hang up, and confirm through a number or channel you already trust.",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: true,

  severity: "high",
  aiRole: "ai-enabled",
  irIncidentType: "deepfake_fraud",

  whatItIs: "Voice cloning uses AI to copy how a real person sounds, often from audio they or their family posted online.[^ftc-ai-family-emergency-2023] A deepfake goes further and fakes a face, a video, or a whole meeting. Scammers use both to pose as someone you trust, such as a grandchild, a boss, or a senior official, and push you to send money or share information before you can check.[^fbi-psa-genai-fraud-2024][^fbi-psa-senior-officials-2025]",

  howItLooks: [
    {
      audience: "home",
      title: "The grandchild in trouble",
      scenario: "Your phone rings and it sounds exactly like your grandson, scared after a car crash or an arrest. Then a 'lawyer' or 'officer' takes over, asks for bail by gift card, wire, crypto or a courier who picks up cash, and tells you to keep it quiet.[^aarp-grandparent-scams-2025] The FBI warns that criminals make short audio clips of a loved one's voice for exactly this kind of crisis call.[^fbi-psa-genai-fraud-2024] People told the FBI they lost more than $5 million in 2025 to these 'distress' calls built on voice cloning, and the script is spreading to other relatives and friends.[^fbi-ic3-2025] The giveaway is rarely the voice; it's the rush, the secrecy, and a payment you can't take back.[^ftc-fake-emergencies-2023]",
    },
    {
      audience: "home",
      title: "The ransom text with fake proof",
      scenario: "A text says someone has kidnapped your daughter and demands money right now. It comes with a photo or video of her, altered from pictures she posted on social media, and the messages may be timed so you can't study them.[^fbi-psa-virtual-kidnapping-2025] Look closely and details are often off, like a missing tattoo or scar, or body proportions that don't match. The FBI's advice is to try to reach your loved one before paying anything, and to agree on a family safe word in advance.[^fbi-psa-virtual-kidnapping-2025]",
    },
    {
      audience: "business",
      title: "The video meeting where nobody was real",
      scenario: "In early 2024, an employee in the Hong Kong office of engineering firm Arup joined video calls with people who looked and sounded like the company's senior officers.[^guardian-arup-deepfake-2024] Following their instructions, the employee made 15 transfers totaling HK$200 million (about US$25 million) to five local bank accounts.[^guardian-arup-deepfake-2024] Arup later confirmed that fake voices and images were used and said none of its internal systems were compromised.[^guardian-arup-deepfake-2024] Nothing was hacked; the attack only needed a convincing meeting and a payment process that trusted it. US Treasury's financial crimes unit now warns banks about this pattern of executive impersonation.[^fincen-deepfake-alert-2024]",
    },
    {
      audience: "business",
      title: "The boss's voice note",
      scenario: "Your bookkeeper gets a call or a messaging-app voice note from the owner, who says they're traveling and need a vendor paid today. The voice is right, the details are plausible, and the request skips the usual approval because 'the deal will fall through'. The FBI notes that voice cloning can be used to request wire payments in business email compromise (BEC) schemes, and businesses reported more than $30 million in 2025 BEC losses involving AI.[^fbi-ic3-2025] In 2024 the head of WPP, the world's largest advertising group, was targeted with an AI clone of his voice.[^guardian-arup-deepfake-2024]",
    },
    {
      audience: "business",
      title: "The remote hire who isn't who they claim",
      scenario: "A strong candidate for a remote IT job interviews well on video, but their lips don't quite match the audio and a cough doesn't line up with the picture.[^fbi-psa-deepfake-interviews-2022] The FBI says these interviews usually aren't about stealing money up front; the goal is a job that comes with access to your network.[^fbi-ic3-2025] A 2026 multinational alert on North Korean IT workers lists manipulated or artificially generated video feeds and refusals to join video calls as hiring red flags.[^ic3-dprk-it-workers-alert-2026] One simple test the FBI suggests is asking the person to wave a hand in front of their face, which can make AI-generated video glitch.[^fbi-psa-dprk-it-workers-2025]",
    },
  ],

  howItGetsIn: [
    "Public audio and video: social media clips, voicemail greetings, podcasts, webinars, and company videos give scammers the voice and face samples they need.[^ftc-ai-family-emergency-2023]",
    "Faked caller ID: the incoming number can be spoofed to look local or familiar, so the number on screen proves nothing.[^fcc-deepfake-robocalls-guide-2024]",
    "Text first, then an encrypted app: in an FBI-tracked campaign impersonating senior officials, contact opened with a text, then moved to Signal, WhatsApp or Telegram, where voice notes are easy to fake.[^fbi-psa-senior-officials-update-2025]",
    "Robocalls with cloned voices: the FCC ruled that AI-generated voices count as 'artificial' voices under the Telephone Consumer Protection Act (TCPA), so these calls generally need your prior consent, but scammers ignore the law.[^fcc-ai-voice-robocalls-2024][^fcc-deepfake-robocalls-guide-2024]",
    "Video meetings: fake participants join what looks like a normal meeting, and the request borrows the authority of familiar faces.[^guardian-arup-deepfake-2024]",
    "Remote hiring and account opening: altered faces, voices, and ID documents are used to pass interviews and identity checks.[^fincen-deepfake-alert-2024][^fbi-psa-deepfake-interviews-2022]",
    "Processes that trust a voice: any payment, bank-detail change, password reset, or code that can be approved on a call alone is an open door.",
    "Pressure and secrecy: urgency, fear, and 'don't tell anyone' are there to stop you from checking with someone else.[^ftc-fake-emergencies-2023]",
  ],

  whatStopsIt: [
    {
      title: "Hang up and call back on a number you already have",
      detail: "If a call or message asks for money, codes, or personal details, end it and call the person or organization back using a number saved in your contacts or printed on a statement. The FTC, FBI, and FCC all give this same advice.[^ftc-voice-cloning-challenge-2024][^fbi-psa-genai-fraud-2024][^fcc-deepfake-robocalls-guide-2024] If you can't reach them, check with another relative, friend, or colleague, even if the caller said to keep it secret.[^ftc-fake-emergencies-2023]",
      audience: ["home", "business"],
      controlSlug: "out-of-band-verification",
      guideSlug: "family-safe-word-and-callback-rule",
    },
    {
      title: "Agree on a family safe word",
      detail: "Pick a private word or phrase that a real relative can give on request and a scammer can't look up. The FBI recommends a family secret word in several recent warnings, and AARP recommends a code word for grandparent scams.[^fbi-psa-genai-fraud-2024][^fbi-psa-senior-officials-update-2025][^aarp-grandparent-scams-2025] No word, no money.",
      audience: ["home"],
      guideSlug: "family-safe-word-and-callback-rule",
    },
    {
      title: "Require two-channel verification for every payment change",
      detail: "No wire, new payee, bank-detail change, or gift card purchase goes out on the strength of a call, voice note, or video meeting alone. Confirm it through a second channel you start yourself, using contact details already on file, and let anyone pause a payment without penalty. FinCEN reports criminals using AI to impersonate executives and order large transfers.[^fincen-deepfake-alert-2024]",
      audience: ["business"],
      controlSlug: "out-of-band-verification",
      guideSlug: "two-channel-verification-for-payments",
    },
    {
      title: "Turn on call screening and carrier spam blocking",
      detail: "iPhone and Pixel phones can screen or silence calls from numbers that aren't in your contacts, and Pixel phones in the US can warn you during a likely scam call.[^apple-unknown-callers-2026][^google-call-screen-2026][^google-scam-detection-2026] AT&T, Verizon, and T-Mobile each include free scam and spam call blocking on most plans.[^att-activearmor-plans-2026][^verizon-call-filter-2026][^tmobile-scamshield-2026] These cut the number of scam calls that reach you, but none of them catch every call.",
      audience: ["home", "business"],
      guideSlug: "protect-an-older-relative-from-ai-phone-scams",
      toolkitCategory: "call-screening",
    },
    {
      title: "Share less voice and video in public",
      detail: "Make personal social accounts private, limit followers to people you know, and think twice before posting long clips of your own or your kids' voices. The FBI recommends limiting the images and voice recordings of you that are online.[^fbi-psa-genai-fraud-2024] For businesses, a generic voicemail greeting gives away less than an executive's recorded voice.",
      audience: ["home", "business"],
    },
    {
      title: "Use multi-factor authentication and never read a code to a caller",
      detail: "Turn on multi-factor authentication (MFA), a second check beyond your password, for email, banking, and messaging apps. Never give a one-time code to someone who calls or messages you, whoever they sound like.[^fbi-psa-senior-officials-update-2025]",
      audience: ["home", "business"],
      controlSlug: "multi-factor-authentication",
    },
    {
      title: "Verify remote hires with live checks",
      detail: "Require cameras on with an unobscured background, ask candidates to wave a hand in front of their face, and save images to compare at later meetings.[^fbi-psa-dprk-it-workers-2025] For roles with system access, confirm identity in person or through a trusted verification step before you ship a laptop or grant accounts.[^ic3-dprk-it-workers-alert-2026]",
      audience: ["business"],
    },
    {
      title: "Train the people who move money",
      detail: "Walk your bookkeeper, office manager, and anyone who approves payments through a fake-executive call. Make it clear in writing that verifying a request from the owner is never insubordination. Run the drill again whenever someone new takes over payments.",
      audience: ["business"],
      controlSlug: "security-training",
    },
    {
      title: "Know the tells, but don't rely on them",
      detail: "Fakes can show lag, distorted hands or teeth, unnatural movement, and odd word choices.[^fbi-psa-genai-fraud-2024] But the FBI warns that a cloned voice can sound nearly identical to the real person.[^fbi-psa-senior-officials-2025] Treat spotting a fake as a bonus; verification is the control.",
      audience: ["home", "business"],
    },
  ],

  ifItHappens: [
    {
      step: "Stop and verify before anything else",
      detail: "If you're still on the call, hang up. Call the person or company back on a number you already have, and don't use any number, link, or app the caller gave you.[^ftc-voice-cloning-challenge-2024]",
      audience: ["home", "business"],
    },
    {
      step: "Call your bank's fraud line right away",
      detail: "Use the number on the back of your card or on your statement, say the payment was fraud, ask for a recall of the transfer, and ask your bank to send the receiving bank a hold harmless letter (the paperwork that lets that bank return the money).[^ic3-elder-fraud-2026] The FBI says time is of the essence: in 2025 its Recovery Asset Team helped freeze about $679 million, a 58% success rate on the losses it acted on.[^fbi-ic3-2025] If you sent money through a wire service such as Western Union or MoneyGram, call its fraud line too.[^aarp-grandparent-scams-2025]",
      audience: ["home", "business"],
    },
    {
      step: "Report it to the FBI's Internet Crime Complaint Center",
      detail: "File a complaint at ic3.gov whatever the amount, with the full transaction details, because IC3 can help banks and law enforcement freeze funds.[^fbi-ic3-2025] Someone else, such as an adult child, can file on a victim's behalf.[^ic3-elder-fraud-2026]",
      audience: ["home", "business"],
    },
    {
      step: "Report it to the FTC",
      detail: "Report the scam at ReportFraud.ftc.gov, and consider telling your state attorney general.[^ftc-fake-emergencies-2023] Reports help regulators spot new scripts and warn others.",
      audience: ["home"],
    },
    {
      step: "Get free help if you or a relative is 60 or older",
      detail: "The Justice Department's National Elder Fraud Hotline, 833-FRAUD-11 (833-372-8311), serves victims 60 and older and assigns a case manager who helps with reporting, weekdays, Eastern time, from 10 a.m. to 6 p.m.[^ovc-elder-fraud-hotline-2026] The AARP Fraud Watch Network Helpline, 877-908-3360, offers guidance and support to victims and worried family members.[^aarp-fraud-helpline-2026]",
      audience: ["home"],
    },
    {
      step: "Save the evidence",
      detail: "Keep the phone numbers, voicemails, voice notes, texts, screenshots, meeting links, and payment receipts. The FBI asks for the scammer's name, how they contacted you, the dates, how you paid, and where the money went.[^fbi-ic3-2025-release]",
      audience: ["home", "business"],
    },
    {
      step: "Lock down anything you shared",
      detail: "If you gave out a password, code, or account number, change it and turn on MFA. If you shared your Social Security number or ID, contact the three credit bureaus and use identitytheft.gov.[^ic3-elder-fraud-2026]",
      audience: ["home", "business"],
    },
    {
      step: "Warn the person who was impersonated",
      detail: "Tell the relative, executive, or vendor whose voice or face was faked, so they can warn others who might be next. At work, alert finance staff and run your incident response plan for deepfake fraud.",
      audience: ["home", "business"],
    },
    {
      step: "Ignore anyone who offers to get the money back for a fee",
      detail: "Fake law firms and 'recovery agents' target people who have just lost money, sometimes claiming ties to government agencies.[^fbi-psa-recovery-scams-2025] Government agencies don't charge fees to recover your money, and no legitimate helper can promise to get it back.[^ftc-recovery-scams-2023]",
      audience: ["home", "business"],
    },
  ],

  stats: [
    {
      figure: "$893 million",
      context: "Losses in 2025 complaints to the FBI that mentioned AI, across 22,364 complaints; the FBI counts only complaints that reference AI, so the true figure is likely higher.",
      sourceId: "fbi-ic3-2025",
      locator: "p.39 and p.61 (AI Related descriptor definition)",
    },
    {
      figure: "$5 million+",
      context: "Losses people reported to the FBI in 2025 from grandparent or 'distress' scams that used voice cloning.",
      sourceId: "fbi-ic3-2025",
      locator: "p.39, Confidence/Romance Scams",
    },
    {
      figure: "$30 million+",
      context: "2025 business email compromise losses in complaints that mentioned AI. The FBI tags AI only when a complaint mentions it, so this is a floor.",
      sourceId: "fbi-ic3-2025",
      locator: "p.39, BEC",
    },
    {
      figure: "$352 million",
      context: "Losses reported by people 60 and older in 2025 FBI complaints that mentioned AI, across 3,143 complaints.",
      sourceId: "fbi-ic3-2025",
      locator: "p.45-46, Crime Types Reported by 60+ (AI Related descriptor)",
    },
    {
      figure: "58%",
      context: "Share of the $1.16 billion in attempted theft that the FBI's Recovery Asset Team helped freeze in 2025 through its Financial Fraud Kill Chain, about $679 million across 3,900 incidents.",
      sourceId: "fbi-ic3-2025",
      locator: "p.17, IC3 Recovery Asset Team - Financial Fraud Kill Chain in 2025",
    },
    {
      figure: "HK$200 million",
      context: "Amount (about US$25 million) an Arup employee transferred in early 2024 after video calls with deepfaked senior officers.",
      sourceId: "guardian-arup-deepfake-2024",
      locator: "Paragraphs 1 and 9-10",
    },
  ],

  faqs: [
    {
      question: "Can a scammer really copy my voice from social media?",
      answer: "Yes. The FTC and FBI both warn that a short clip of someone talking, such as a video posted online, can be enough to make a convincing copy. That's why recognizing the voice is no longer proof of who's calling.",
    },
    {
      question: "Can I tell a deepfake by listening or watching carefully?",
      answer: "Sometimes. Lag, mismatched lips, and odd phrasing are clues, but the FBI warns that cloned voices can sound nearly identical to the real person. Rely on hanging up and calling back, not on your ears.",
    },
    {
      question: "Are AI voices in robocalls legal?",
      answer: "The FCC has ruled that AI-generated voices count as artificial voices under federal robocall law, so these calls generally need your prior consent. Scammers ignore that rule, so the ruling helps enforcement but won't stop a call from reaching you.",
    },
    {
      question: "What should a small business change first?",
      answer: "Make it a written rule that no payment or bank-detail change is approved on a call, voice note, or video meeting alone. Every request gets confirmed through a second channel that your staff start themselves, using contact details already on file.",
    },
    {
      question: "I already sent money. Is it too late?",
      answer: "Not necessarily. Call your bank's fraud line immediately and ask for a recall, then report it to the FBI's Internet Crime Complaint Center. The FBI's recovery team can sometimes freeze funds, but speed matters more than anything else.",
    },
  ],

  sourceIds: [
    "fbi-ic3-2025",
    "fbi-ic3-2025-release",
    "ftc-ai-family-emergency-2023",
    "fbi-psa-genai-fraud-2024",
    "fbi-psa-senior-officials-2025",
    "fbi-psa-senior-officials-update-2025",
    "fbi-psa-virtual-kidnapping-2025",
    "aarp-grandparent-scams-2025",
    "ftc-fake-emergencies-2023",
    "guardian-arup-deepfake-2024",
    "fincen-deepfake-alert-2024",
    "fbi-psa-deepfake-interviews-2022",
    "ic3-dprk-it-workers-alert-2026",
    "fbi-psa-dprk-it-workers-2025",
    "fcc-deepfake-robocalls-guide-2024",
    "fcc-ai-voice-robocalls-2024",
    "ftc-voice-cloning-challenge-2024",
    "apple-unknown-callers-2026",
    "google-call-screen-2026",
    "google-scam-detection-2026",
    "att-activearmor-plans-2026",
    "verizon-call-filter-2026",
    "tmobile-scamshield-2026",
    "ic3-elder-fraud-2026",
    "ovc-elder-fraud-hotline-2026",
    "aarp-fraud-helpline-2026",
    "fbi-psa-recovery-scams-2025",
    "ftc-recovery-scams-2023",
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec", "ai-scaled-romance-and-investment-scams"],
    guides: [
      "family-safe-word-and-callback-rule",
      "protect-an-older-relative-from-ai-phone-scams",
      "two-channel-verification-for-payments",
    ],
    explainers: [],
    controls: [
      "out-of-band-verification",
      "security-training",
      "multi-factor-authentication",
      "incident-response-plan",
    ],
    glossary: ["voice-cloning", "deepfake", "vishing", "social-engineering"],
    toolkit: [],
  },
}
