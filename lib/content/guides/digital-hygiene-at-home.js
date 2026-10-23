export default {
  kind: "guide",
  slug: "digital-hygiene-at-home",
  title: "Digital hygiene at home: the household baseline",
  metaTitle: "Digital Hygiene at Home: The Baseline | Data Hygienics",
  metaDescription: "Ten steps to secure your household in the AI era: passwords, passkeys, updates, backups, a family safe word, AI settings, kids, older relatives and Wi-Fi.",
  audience: ["home"],
  pillars: ["hygiene"],
  tldr: "A safe household runs on a few habits: one password manager, passkeys or multi-factor authentication (MFA) on the accounts that matter, automatic updates, and backups you've actually tested. AI adds one more: a family safe word and a callback rule, so a panicked call that sounds like family gets checked before anyone pays. People 60 and older reported $7.7 billion in losses to the FBI in 2025, so bring older relatives into the plan.[^fbi-ic3-2025]",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,

  timeToComplete: "2 hours, spread over a weekend",
  difficulty: "easy",

  why: "Criminals rarely need to break encryption when they can reuse a leaked password or borrow a familiar voice. In 2025 the FBI's Internet Crime Complaint Center received 22,364 complaints that mentioned AI, with reported losses near $893 million, and the FBI notes that many victims don't realize AI was involved.[^fbi-ic3-2025] The good news is that most of the defenses are free and already on your devices, and this guide puts them in the order that protects the most for the least effort.",

  steps: [
    {
      title: "Put one password manager in charge",
      detail: [
        "Choose one password manager for the household and install it on every phone and computer. If everyone uses iPhones and Macs, Apple Passwords is free and built in; on Android and Chrome, Google Password Manager is.[^apple-passwords-app-2026][^google-password-manager-2026] Mixed households do better with a cross-platform manager such as Bitwarden, which is free for one person and $47.88 a year for a family of up to six.[^bitwarden-pricing-2026]",
        "Start with your email account, then your bank, then change the rest as you log in over the next few weeks. Let the manager create every new password, and never reuse one. CISA, the US Cybersecurity and Infrastructure Security Agency, pairs a password manager with MFA in its core advice for everyone.[^cisa-awareness-month-2026]",
      ],
      verify: "Your password manager's security or health check shows no reused or leaked passwords on your email and bank accounts.",
    },
    {
      title: "Lock your key accounts with passkeys or MFA",
      detail: [
        "Your email, bank, mobile carrier and Apple or Google account can reset everything else, so protect them first. Turn on a passkey where it's offered; it signs you in with your phone's screen lock and is phishing-resistant, meaning it won't work on a fake site.[^cisa-small-business-guidance-2024] Where passkeys aren't offered, use an authenticator app, and fall back to text-message codes only when nothing else is available.",
        "For the one email account that controls everything, consider two hardware security keys: one on your keyring, one in a drawer. Yubico, which makes them, recommends always registering a backup key.[^yubico-eucleak-advisory-2024]",
      ],
      verify: "Sign out of your email on a computer and sign back in. It asks for your passkey, security key or authenticator code, not just a password.",
    },
    {
      title: "Turn on automatic updates everywhere",
      detail: [
        "Updates close security holes that criminals already know about, so let phones, computers, browsers and apps update themselves. Updating software is one of CISA's four core steps for everyone.[^cisa-awareness-month-2026]",
        "Don't skip the router, the smart TV or anything else with a login. Check each maker's app or settings for automatic updates, and replace devices that no longer get them.[^ftc-home-wifi-2022]",
      ],
      verify: "Each phone's and computer's software update screen says it's up to date, with automatic updates switched on.",
    },
    {
      title: "Back up phones and computers, then test a restore",
      detail: [
        "On iPhone, go to Settings, tap your name, then iCloud, then iCloud Backup, and turn on Back Up This iPhone.[^apple-icloud-backup-2026] On Android, go to Settings, then Google services, then All services, then Backup.[^google-android-backup-2026]",
        "For computers, use a cloud backup service such as Backblaze, which costs $99 a year per computer, or an external drive you unplug between backups.[^backblaze-pricing-2026] Keep irreplaceable photos and documents in at least two places.",
      ],
      verify: "On iPhone, the iCloud Backup screen shows a recent successful backup. On a computer, restore one file from last week's backup and open it.",
    },
    {
      title: "Agree on a family safe word and a callback rule",
      detail: [
        "Criminals use AI to make audio in a loved one's voice and stage an emergency, so a call that sounds exactly like your grandchild is no longer proof.[^fbi-psa-genai-fraud-2024] The FBI recommends agreeing on a secret word or phrase with family, and hanging up to call back on a number you find yourself.[^fbi-psa-genai-fraud-2024]",
        "In 2025, victims told the FBI they lost more than $5 million to 'distress' scams that used voice cloning to imitate a loved one.[^fbi-ic3-2025] Pick a word you'd never post online, say it in person, and practice the callback once so it feels normal.",
      ],
      verify: "Everyone in the family, grandparents included, can tell you the safe word and the number they'd call back on.",
    },
    {
      title: "Check your AI assistants' settings",
      detail: [
        "Open the settings of every chatbot your family uses and look for the setting that lets your chats train the AI. On ChatGPT's personal plans, for example, your content is used for training unless you opt out.[^openai-chatgpt-pricing-2026]",
        "While you're there, review what the assistant remembers about you and which apps or accounts it's connected to, and switch off anything you don't use. Our guide to locking down AI assistants walks through each major one.",
      ],
      verify: "In each assistant's privacy or data controls, the training setting is off, and you've looked at what it remembers about you.",
    },
    {
      title: "Know what never goes into a chatbot",
      detail: [
        "Treat a chatbot like a stranger's notebook. Keep out passwords, one-time codes, full card or bank account numbers, Social Security numbers, medical records and other people's private details.",
        "If you need help with a document such as a tax form or a medical letter, remove the names and numbers first. Be cautious about AI agents, tools that read your email or browse websites for you, because hidden instructions on a web page can try to steer them.",
      ],
      verify: "Search your chatbot history for words like password, account and SSN, and delete any conversation that contains them.",
    },
    {
      title: "Set up kids' devices with controls and a conversation",
      detail: [
        "Use the controls built into your children's devices: Screen Time through Family Sharing on iPhone and iPad, or Google Family Link on Android and Chrome devices.[^apple-parental-controls-2026][^google-family-link-2026] Turn on approval for new apps and purchases, and limit who can contact them.",
        "Then talk. Tell them that any message asking for secrecy, money, gift cards or photos is a reason to come to you, and that they won't be in trouble for asking.",
      ],
      verify: "Try to download a new app on your child's device. It asks you for approval first.",
    },
    {
      title: "Protect older relatives without taking over",
      detail: [
        "People 60 and older filed 201,266 complaints and reported $7.7 billion in losses to the FBI's complaint center in 2025, more than any other age group.[^fbi-ic3-2025] With their permission, turn on Screen Unknown Callers on an iPhone or Call Screen on a Pixel, and check that their carrier's free scam-call blocking is on.[^apple-unknown-callers-2026][^google-call-screen-2026][^tmobile-scamshield-2026][^verizon-call-filter-2026][^att-activearmor-app-2026]",
        "Freeze their credit at all three bureaus, which is free and lasts until they lift it.[^ftc-credit-freeze-2025] Share the family safe word with them, and agree that any request for money gets a call to you first.",
      ],
      verify: "Call their phone from a number they haven't saved. The call is screened or labeled before it rings, and they can tell you the safe word.",
    },
    {
      title: "Tidy up your router and smart home",
      detail: [
        "Log in to your router, change the default admin password, use WPA3 encryption (or WPA2 if that's all it offers), and turn off remote management and the convenience features called WPS and UPnP. Put visitors on a guest network with its own password.[^ftc-home-wifi-2022]",
        "For an easy extra layer, set the router's DNS, the internet's address book, to a filtering service such as Quad9 at 9.9.9.9, which blocks known malware and phishing sites for every device.[^quad9-service-addresses-2026] Give smart speakers, cameras and TVs strong passwords and MFA in their apps, and remove devices you no longer use.",
      ],
      verify: "The router no longer accepts its default admin password, its firmware page shows the latest version, and its DNS settings show the filtering service you chose.",
    },
  ],

  limits: [
    "No checklist stops every scam. The callback rule only works if you use it when you're rattled, which is exactly when a scammer calls.",
    "We don't know yet how much call screening reduces AI voice scams; we found no independent measurement of it.",
    "Parental controls and DNS filters can be worked around by a determined teenager. They support the conversation; they don't replace it.",
    "Settings move. The menu paths here were checked in October 2026, and phone makers rename things often.",
  ],

  faqs: [
    {
      question: "Do I really need to pay for a password manager?",
      answer: "No. Apple Passwords and Google Password Manager are free and work well if everyone uses the same kind of phone. A paid family plan makes sense when your household mixes Apple and Android, or when you want easy shared vaults.",
    },
    {
      question: "What is a passkey, in plain terms?",
      answer: "A passkey replaces your password with your phone's or computer's screen lock: your face, fingerprint or PIN. It only works on the real site it was made for, so a fake login page can't trick you into handing it over.",
    },
    {
      question: "Is it safe to use chatbots at home?",
      answer: "Yes, with care. Check the training and memory settings, and keep passwords, account numbers, ID numbers and medical records out of your chats.",
    },
    {
      question: "What makes a good family safe word?",
      answer: "Something easy to remember but impossible to guess from social media, so not a pet's name, street or birthday. Agree on it out loud, in person, rather than by text.",
    },
    {
      question: "How often should we redo this?",
      answer: "Glance at backups and updates once a month. Walk through the whole list once a year, and again whenever someone gets a new phone or computer.",
    },
  ],

  sourceIds: [
    "fbi-ic3-2025",
    "fbi-psa-genai-fraud-2024",
    "cisa-awareness-month-2026",
    "cisa-small-business-guidance-2024",
    "apple-passwords-app-2026",
    "google-password-manager-2026",
    "bitwarden-pricing-2026",
    "yubico-eucleak-advisory-2024",
    "ftc-home-wifi-2022",
    "apple-icloud-backup-2026",
    "google-android-backup-2026",
    "backblaze-pricing-2026",
    "openai-chatgpt-pricing-2026",
    "apple-parental-controls-2026",
    "google-family-link-2026",
    "apple-unknown-callers-2026",
    "google-call-screen-2026",
    "tmobile-scamshield-2026",
    "verizon-call-filter-2026",
    "att-activearmor-app-2026",
    "ftc-credit-freeze-2025",
    "quad9-service-addresses-2026",
  ],

  related: {
    threats: [
      "voice-cloning-and-deepfake-scams",
      "ai-scaled-romance-and-investment-scams",
      "ai-chatbot-data-leaks",
      "ai-powered-phishing-and-bec",
      "prompt-injection-and-ai-agent-hijacking",
    ],
    guides: [
      "family-safe-word-and-callback-rule",
      "protect-an-older-relative-from-ai-phone-scams",
      "lock-down-your-ai-assistants",
      "digital-hygiene-for-your-business",
    ],
    explainers: ["who-owns-your-ai-conversations", "what-digital-sovereignty-means"],
    controls: [
      "password-management",
      "multi-factor-authentication",
      "patch-management",
      "data-backup",
      "backup-testing",
      "out-of-band-verification",
    ],
    glossary: ["passkey", "authenticator-app", "hardware-security-key", "voice-cloning", "deepfake", "prompt-injection"],
    toolkit: [
      "bitwarden",
      "1password",
      "apple-passwords",
      "google-password-manager",
      "ente-auth",
      "yubikey",
      "backblaze",
      "signal",
      "quad9",
      "nextdns",
      "iphone-call-screening",
      "pixel-call-screen",
      "credit-freeze",
      "have-i-been-pwned",
      "simplelogin",
      "icloud-hide-my-email",
    ],
  },
}
