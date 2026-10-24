// Clear Path content around the steps: the reveal's mirror sentence, Long
// View end states, "What we cut" cards and recurring routines. Pure data
// (plus two small formatting functions), import-free.
//
// End states are calm outcome statements, not predictions; each lists the
// step ids (lib/content/path/home.js, business.js) that lead to it, in path
// order. "What we cut" stays at category level: never vendor ratings
// (vendor scorecards were retired in the 2026-10 pivot). No statistics here.

const HOME_PRIORITY_PHRASES = {
  memories: "your photos and memories",
  money: "your money",
  accounts: "your accounts",
  people: "the people you look out for",
  identity: "your identity and credit",
  privacy: "your privacy",
  home: "your home and devices",
  work: "your work",
}

const INDUSTRY_PHRASES = {
  healthcare: "healthcare practice",
  financial: "financial services firm",
  retail: "retail business",
  government: "government contractor",
  nonprofit: "nonprofit",
  professional: "professional services firm",
  trades: "trades business",
  education: "education or childcare provider",
  other: "small business",
}

const SIZE_PHRASES = { solo: "one-person", "2-5": "small", "6-15": "growing", "16-50": "50-person-or-smaller", "50+": "larger" }

function list(items) {
  if (items.length <= 1) return items.join("")
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
}

function homeMirror(path) {
  const phrases = path.ranked.map((p) => HOME_PRIORITY_PHRASES[p]).filter(Boolean)
  return phrases.length
    ? `Built around what you said matters most: ${list(phrases)}.`
    : "Built around the basics that protect every home."
}

function businessMirror(path) {
  const a = path.answers
  const size = a.size === "solo" ? "one-person" : SIZE_PHRASES[a.size] || "small"
  const industry = INDUSTRY_PHRASES[a.industry] || INDUSTRY_PHRASES.other
  const stack = Array.isArray(a.stack) ? a.stack : []
  const email = stack.includes("m365") ? " on Microsoft 365" : stack.includes("google") ? " on Google Workspace" : ""
  return `For a ${size} ${industry}${email}: here's the order that protects the most first.`
}

export const PATH_CONTENT = {
  home: {
    mirror: homeMirror,
    endStates: [
      {
        id: "check-not-spot",
        text: "Anyone in your family can check a voice or video request without needing to spot the fake.",
        stepIds: ["f-safe-word", "money-bank-callback", "elder-conversation", "elder-call-screening", "kids-no-trouble-rule", "ai-verify-answers"],
      },
      {
        id: "no-passwords",
        text: "You sign in to what matters without typing passwords.",
        stepIds: ["f-email-key", "f-password-manager", "sign-in-key-accounts", "sign-in-recovery", "sign-in-hardware-keys"],
      },
      {
        id: "two-copies",
        text: "Your photos live in two places you control, and someone you trust can reach them if you can't.",
        stepIds: ["f-phone-backup", "memories-find", "memories-second-copy", "memories-offline-copy", "memories-test-restore"],
      },
      {
        id: "agents-have-limits",
        text: "Any AI assistant that acts for you has limits you chose: what it can read, buy and send.",
        stepIds: ["ai-settings", "ai-account-lock", "ai-connected-apps", "ai-approval-rule", "money-agent-spending"],
      },
      {
        id: "family-can-reach",
        text: "If something happens to you, your family can reach what matters without guessing a single password.",
        stepIds: ["legacy-inventory", "legacy-contacts", "legacy-emergency-access", "legacy-paper-kit", "legacy-wishes"],
      },
      {
        id: "credit-locked",
        text: "Nobody can open credit in your name, and you'd hear quickly if someone tried.",
        stepIds: ["f-credit-freeze", "identity-extra-freezes", "identity-claim-accounts", "money-alerts", "sign-in-carrier-lock", "identity-data-brokers"],
      },
    ],
    noise: [
      {
        id: "security-bundles",
        hear: "Security suites that bundle antivirus, a VPN and identity monitoring",
        take: "Current phones and computers ship with solid built-in protection, so for most homes the bundle mostly adds alerts and a renewal bill. Updates, a password manager and passkeys do more.",
        worthIt: "Someone in the house uses a computer that can no longer get updates, or you'd rather pay for one family dashboard.",
      },
      {
        id: "vpns",
        hear: "VPNs that promise to make you anonymous or hack-proof",
        take: "A VPN hides your browsing from the network you're on and moves that trust to the VPN company. It doesn't stop scam calls, fake login pages or bad downloads.",
        worthIt: "You often use public or hotel Wi-Fi, or your job asks you to.",
      },
      {
        id: "identity-monitoring",
        hear: "Paid identity theft protection",
        take: "A credit freeze at the three bureaus is free and stops most new accounts being opened in your name. Monitoring tells you after something happens.",
        worthIt: "You want hands-on help with recovery paperwork, or a breach notice offers the service at no cost.",
      },
      {
        id: "deepfake-detectors",
        hear: "Apps that promise to detect deepfake calls and videos",
        take: "Fakes keep getting better, so a plan that depends on spotting them won't age well. A safe word and a callback don't depend on spotting anything.",
        worthIt: "Rarely, for a household. Use the procedure instead.",
      },
      {
        id: "broker-removal",
        hear: "Subscriptions that remove you from data broker sites",
        take: "They save time, but listings can come back. Free opt-outs and your state's privacy rights, where you have them, cover a lot of the same ground.",
        worthIt: "You're being harassed or targeted, or you'd never find the hours to do opt-outs yourself.",
      },
      {
        id: "inbox-ai",
        hear: "AI apps that ask for full access to your email to \"protect\" or organize it",
        take: "Every app with access to your inbox is another way into everything your email can reset. Lock down sign-in first.",
        worthIt: "It's built into an email service you already use and trust, with limits you can see and change.",
      },
    ],
    routines: [
      {
        id: "monthly",
        title: "Monthly tidy",
        minutes: 10,
        tasks: [
          "Check the date of your last phone and photo backup.",
          "Install any updates that are waiting on phones, computers and the router.",
          "Glance at what your AI assistants remember, and delete what you don't want kept.",
          "Read any new sign-in or security alerts from your email provider.",
        ],
        saves: "lost photos, and takeovers that start quietly",
      },
      {
        id: "quarterly",
        title: "Every season",
        minutes: 20,
        tasks: [
          "Restore one photo or file from your backup to prove it works.",
          "Review which apps can use your camera, microphone and location.",
          "Check who you share your location, albums and passwords with.",
        ],
        saves: "the day you need a backup and find out it stopped months ago",
      },
      {
        id: "yearly",
        title: "Once a year",
        minutes: 45,
        tasks: [
          "Run the safe-word drill with the family, and change the word if it got around.",
          "Confirm your credit freezes are still on, and update your legacy contacts.",
          "Replace or retire devices that no longer get security updates.",
        ],
        saves: "money, memories and a scramble if something happens to you",
      },
    ],
  },

  business: {
    mirror: businessMirror,
    endStates: [
      {
        id: "no-single-message",
        text: "No money moves on one message, however real it looks or sounds.",
        stepIds: ["b-payment-callback", "gen-payroll-diversion", "gen-bank-portal", "ps-wire-protocol", "b-training-reporting", "b-verify-people"],
      },
      {
        id: "ai-has-owners",
        text: "Every AI tool on your team has an owner and written permissions.",
        stepIds: ["b-ai-rule", "b-connected-apps", "b-agent-rules", "hc-baa-ai", "gov-ai-cui", "ps-client-ai-terms"],
      },
      {
        id: "more-than-a-password",
        text: "Every account that matters needs more than a password, and nobody shares logins.",
        stepIds: ["b-business-accounts", "b-admin-mfa", "b-tenant-settings", "b-password-manager", "b-offboarding"],
      },
      {
        id: "inconvenience-not-crisis",
        text: "Losing any one laptop, account or person is an inconvenience, not a crisis.",
        stepIds: ["b-backups-cloud", "b-updates-edge", "hc-downtime", "b-ir-plan", "b-offboarding"],
      },
      {
        id: "show-what-you-do",
        text: "You can show a customer or regulator what you do, because you actually do it.",
        stepIds: ["b-owner-inventory", "hc-risk-analysis", "fin-wisp", "gov-affirm", "b-ir-plan", "b-data-minimize"],
      },
    ],
    noise: [
      {
        id: "ai-platforms",
        hear: "AI-powered security platforms built for small teams",
        take: "Most small-business losses start with a stolen login or a fake payment request. Two-step sign-in, a callback rule and tested backups come first, and they're cheap.",
        worthIt: "The basics are done and someone, you or your IT provider, will actually read and act on the alerts.",
      },
      {
        id: "phish-sims",
        hear: "Monthly phishing tests that catch staff clicking",
        take: "Gotcha tests can teach people to hide mistakes. A no-blame way to report something odd, and a firm payment procedure, matter more.",
        worthIt: "The tests are short and kind, followed by a quick lesson, and you track how many people report, not who clicked.",
      },
      {
        id: "deepfake-detection",
        hear: "Deepfake detection for calls and video meetings",
        take: "Detection is a race. A rule that no payment or bank change happens on one channel works however good the fake gets.",
        worthIt: "You run high-value transfers daily and already have the callback procedure in place.",
      },
      {
        id: "dark-web",
        hear: "Paid dark web monitoring",
        take: "It's a useful signal, but two-step sign-in and a password manager make most leaked passwords harmless. Free breach alerts cover the basics.",
        worthIt: "You hold sensitive client data and want an outside watcher as part of a managed service.",
      },
      {
        id: "compliance-in-a-box",
        hear: "Compliance-in-a-box platforms",
        take: "Paperwork without practice doesn't stop anything. Get the habits in place and a few rules in writing first.",
        worthIt: "A customer or regulator needs evidence on a schedule and the habits already exist.",
      },
    ],
    routines: [
      {
        id: "monthly",
        title: "Monthly tidy",
        minutes: 20,
        tasks: [
          "Confirm backups ran, and restore one file to prove it.",
          "Review admin accounts and anyone without two-step sign-in.",
          "Ask the team what new AI tools or connectors they've started using.",
          "Check that updates installed on every laptop and phone that holds work.",
        ],
        saves: "the lost week after ransomware or a dead laptop",
      },
      {
        id: "quarterly",
        title: "Every quarter",
        minutes: 45,
        tasks: [
          "Review who has access to what, and close accounts for anyone who's gone.",
          "Run a ten-minute payment-request rehearsal with whoever pays the bills.",
          "Review any vendor bank-detail changes and confirm each was called back.",
        ],
        saves: "money sent to the wrong place, and accounts no one is watching",
      },
      {
        id: "yearly",
        title: "Once a year",
        minutes: 120,
        tasks: [
          "Walk through your incident plan as a team, with one realistic scenario.",
          "Review your AI use rules and the list of approved tools.",
          "Check your domain's registrar lock, renewal and recovery contacts.",
        ],
        saves: "jobs, clients and days of downtime when something does go wrong",
      },
    ],
  },
}
