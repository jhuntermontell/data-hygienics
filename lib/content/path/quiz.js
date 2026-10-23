// Clear Path onboarding questions. Pure data, import-free.
// Rendered by app/components/path/QuizRunner.jsx; answers feed lib/path.js.
//
// Question: { id, title, helper, why, type: "single" | "multi" | "rank", max,
//   optional, options: [{ value, label, description, icon, group, exclusive }], when }
// - "rank": pick up to `max`; the order picked is the priority order.
// - `exclusive` options (e.g. "None of these yet") clear the others.
// - `when` shows a question only if an earlier answer matches.
// - Optional questions can be skipped; DEFAULT_ANSWERS fill the gaps.
// Option values are stable keys stored in saved paths: don't rename them.
// Copy rules: plain English, no statistics, no fear words (CLAUDE.md).

const KNOWLEDGE = {
  id: "knowledge",
  title: "How much do you already know?",
  helper: "There's no wrong answer. It only changes how much we explain.",
  why: "So we explain terms when you want them and skip the basics when you don't.",
  type: "single",
  optional: true,
}

const STYLE = {
  id: "style",
  title: "How should we show you each step?",
  helper: "You can switch on any step, any time.",
  why: "People learn differently. The steps are the same; only the telling changes.",
  type: "single",
  optional: true,
  options: [
    { value: "do", label: "Just tell me what to do", description: "Short steps, exact settings, a check at the end.", icon: "ListChecks" },
    { value: "simple", label: "Explain it simply", description: "An everyday comparison first, then the steps.", icon: "Lightbulb" },
    { value: "detail", label: "Give me the detail", description: "How it works, the tradeoffs, the limits and the sources.", icon: "Microscope" },
    { value: "story", label: "Show me how it plays out", description: "A short story of the moment it matters, then the steps.", icon: "Clapperboard" },
  ],
}

const TIME = {
  id: "time",
  title: "How much time can you give this most weeks?",
  helper: "Be honest. A path you finish beats a perfect one you don't.",
  why: "So your first week fits your real week.",
  type: "single",
  optional: true,
  options: [
    { value: "10", label: "About 10 minutes", description: "One small step a week.", icon: "Timer" },
    { value: "30", label: "About 30 minutes", description: "A step or two a week.", icon: "Clock" },
    { value: "60", label: "About an hour", description: "Steady progress, a few steps a week.", icon: "Zap" },
    { value: "afternoon", label: "One afternoon, then upkeep", description: "Do the big setup in one go, then a monthly check-up.", icon: "Sunrise" },
  ],
}

export const HOME_QUIZ = [
  {
    id: "priorities",
    title: "What would you hate to lose?",
    helper: "Pick up to three. The first one you pick counts most.",
    why: "We start with what matters to you, not with what's out to get you. It sets the order of your path.",
    type: "rank",
    max: 3,
    options: [
      { value: "memories", label: "Photos and memories", description: "Family photos, videos, voice memos, kids' art.", icon: "Images" },
      { value: "money", label: "Our money", description: "Bank accounts, cards, payment apps, savings.", icon: "Wallet" },
      { value: "accounts", label: "Our accounts", description: "Email, Apple or Google account, social media: the keys to everything else.", icon: "AtSign" },
      { value: "people", label: "The people I look out for", description: "Kids, older parents, anyone who might get a convincing call.", icon: "HeartHandshake" },
      { value: "identity", label: "Our identity and credit", description: "Social Security numbers, credit, IDs, medical records.", icon: "Fingerprint" },
      { value: "privacy", label: "Our privacy", description: "What apps, data brokers and AI assistants know and keep.", icon: "EyeOff" },
      { value: "ai", label: "What AI can see and do", description: "Chatbots, assistants and agents that read, remember or buy for us.", icon: "Bot" },
      { value: "home", label: "Our home and devices", description: "Cameras, doorbells, smart speakers, Wi-Fi.", icon: "Cctv" },
      { value: "work", label: "My work", description: "Work I do from home, and the job that depends on it.", icon: "Briefcase" },
    ],
  },
  {
    id: "household",
    title: "Who's at home?",
    helper: "Pick everyone who applies.",
    why: "So we include the right steps for the right people, like a first-phone talk or a call plan with a parent.",
    type: "multi",
    optional: true,
    options: [
      { value: "solo", label: "Just me", icon: "User", exclusive: true },
      { value: "partner", label: "A partner or spouse", icon: "UsersRound" },
      { value: "kids", label: "Kids under 13", icon: "Baby" },
      { value: "teens", label: "Teenagers", icon: "Users" },
      { value: "elder", label: "An older parent or relative I help", description: "They don't have to live with you.", icon: "HandHeart" },
      { value: "roommates", label: "Roommates or other adults", icon: "UserRound" },
    ],
  },
  {
    id: "devices",
    title: "What's connected?",
    helper: "Pick what you have. We only show steps for things you own.",
    why: "So instructions match your phone and we drop steps for devices you don't have.",
    type: "multi",
    optional: true,
    options: [
      { value: "iphone", label: "iPhone or iPad", icon: "Smartphone", group: "Phones and computers" },
      { value: "android", label: "Android phone or tablet", icon: "Smartphone", group: "Phones and computers" },
      { value: "mac", label: "Mac", icon: "Laptop", group: "Phones and computers" },
      { value: "windows", label: "Windows PC", icon: "Monitor", group: "Phones and computers" },
      { value: "cameras", label: "Cameras or a video doorbell", icon: "Cctv", group: "Around the house" },
      { value: "speakers", label: "Smart speakers or displays", icon: "Speaker", group: "Around the house" },
      { value: "tv", label: "Smart TV or streaming stick", icon: "Tv", group: "Around the house" },
      { value: "consoles", label: "Game consoles", icon: "Gamepad2", group: "Around the house" },
      { value: "smart-home", label: "Smart locks, plugs or thermostats", icon: "Lock", group: "Around the house" },
      { value: "work-device", label: "A work laptop, or work apps on my phone", icon: "Briefcase", group: "Work" },
      { value: "unsure", label: "Not sure what's connected", description: "We'll include the smart-home steps, just in case.", icon: "CircleHelp", group: "Not sure?" },
    ],
  },
  {
    id: "aiUse",
    title: "How does your household use AI?",
    helper: "Pick everything that applies. A rough idea is fine.",
    why: "An AI that only answers questions needs different care from one that can read your email or spend money.",
    type: "multi",
    optional: true,
    options: [
      { value: "none", label: "We don't, as far as I know", icon: "CircleHelp", exclusive: true },
      { value: "chat", label: "Chatbots for questions and writing", icon: "Bot" },
      { value: "connected", label: "Connected to email, files or calendar", description: "An assistant that can read or search your stuff.", icon: "AtSign" },
      { value: "agents", label: "Agents that book, buy or act for us", description: "Shopping, travel or tasks done on your behalf.", icon: "CreditCard" },
      { value: "companions", label: "Companion or friend apps", description: "Chatbots someone talks to for company or advice.", icon: "HeartHandshake" },
    ],
  },
  {
    id: "inPlace",
    title: "Already doing any of these?",
    helper: "Not sure? Leave it unticked. We'll help you check.",
    why: "So you get credit for what's done. We mark these as \"you said it's in place\" until you check them.",
    type: "multi",
    optional: true,
    options: [
      { value: "password-manager", label: "A password manager for most accounts" },
      { value: "email-mfa", label: "A passkey or two-step sign-in on my main email" },
      { value: "auto-updates", label: "Automatic updates on phones and computers" },
      { value: "phone-backup", label: "Phone backups that run on their own" },
      { value: "safe-word", label: "A family safe word" },
      { value: "chatbot-privacy", label: "Checked my AI assistants' privacy settings" },
      { value: "credit-freeze", label: "Credit frozen at all three bureaus" },
      { value: "none", label: "None of these yet", exclusive: true },
    ],
  },
  {
    ...KNOWLEDGE,
    options: [
      { value: "new", label: "New to this", description: "Explain terms as we go.", icon: "Sprout" },
      { value: "basics", label: "I know the basics", description: "I've heard of two-step sign-in and updates. Skip the 101.", icon: "ShieldCheck" },
      { value: "expert", label: "I'm the family's tech person", description: "Give me the settings, the edge cases and how to set it up for others.", icon: "Wrench" },
    ],
  },
  STYLE,
  TIME,
]

export const BUSINESS_QUIZ = [
  {
    id: "industry",
    title: "What's your industry?",
    helper: "We'll bring in your industry's rules and the scams aimed at it.",
    why: "Your industry decides which rules apply to you and which scams target you most.",
    type: "single",
    options: [
      { value: "healthcare", label: "Healthcare", description: "Clinics, dental, therapy, home health, pharmacies.", icon: "Stethoscope" },
      { value: "financial", label: "Financial services", description: "Accounting, bookkeeping, tax prep, advisers, insurance agencies, lenders.", icon: "Landmark" },
      { value: "retail", label: "Retail and e-commerce", description: "Shops, online stores, restaurants, anyone taking cards.", icon: "Store" },
      { value: "government", label: "Government contractor", description: "You hold or bid on government contracts.", icon: "Building2" },
      { value: "nonprofit", label: "Nonprofit or faith community", description: "Charities, churches, parishes, associations.", icon: "HandHeart" },
      { value: "professional", label: "Professional services", description: "Consulting, design, marketing, architecture, engineering, real estate.", icon: "Briefcase" },
      { value: "trades", label: "Trades and field services", description: "Construction, HVAC, plumbing, landscaping, cleaning.", icon: "Wrench" },
      { value: "education", label: "Education and childcare", description: "Tutoring, schools, daycares, camps.", icon: "GraduationCap" },
      { value: "other", label: "Something else", description: "You'll get our small-business path.", icon: "CircleHelp" },
    ],
  },
  {
    id: "size",
    title: "How many people work here, including you?",
    helper: "Count anyone with a company email or login.",
    why: "A team of one and a team of thirty need different steps.",
    type: "single",
    optional: true,
    options: [
      { value: "solo", label: "Just me" },
      { value: "2-5", label: "2 to 5 people" },
      { value: "6-15", label: "6 to 15 people" },
      { value: "16-50", label: "16 to 50 people" },
      { value: "50+", label: "More than 50", description: "We're built for teams up to 50. The path still works; some steps assume a small team." },
    ],
  },
  {
    id: "it",
    title: "Who handles IT?",
    helper: "Pick the closest match.",
    why: "If an outside IT company handles it, we'll write the request for you to send them.",
    type: "single",
    optional: true,
    options: [
      { value: "me", label: "I do", description: "Along with everything else.", icon: "User" },
      { value: "teammate", label: "Someone on the team, on the side", icon: "Users" },
      { value: "provider", label: "An outside IT company", description: "An IT provider handles some or all of it.", icon: "Building2" },
      { value: "nobody", label: "Nobody, really", description: "Things get fixed when they break.", icon: "CircleHelp" },
    ],
  },
  {
    id: "stakes",
    title: "What would hurt the business most?",
    helper: "Pick up to three. The first one you pick counts most.",
    why: "We order your path around what you'd most hate to happen.",
    type: "rank",
    max: 3,
    options: [
      { value: "payments", label: "Money sent to the wrong place", description: "Fake invoices, changed bank details, a call that sounds like the boss.", icon: "Banknote" },
      { value: "data", label: "Client or patient data getting out", icon: "Fingerprint" },
      { value: "lockout", label: "Being locked out for days", description: "Ransomware, a lost admin account, a dead laptop with no backup.", icon: "ServerCrash" },
      { value: "takeover", label: "A key account taken over", description: "Email, domain, website, social media, payment processor.", icon: "KeyRound" },
      { value: "ai", label: "AI tools leaking something", description: "Client data pasted into chatbots, AI agents following bad instructions.", icon: "Bot" },
      { value: "compliance", label: "Falling short of a rule we must follow", icon: "Scale" },
      { value: "time", label: "Hours lost to IT headaches", description: "Resets, lockouts, fixing the same thing twice.", icon: "Clock" },
    ],
  },
  {
    id: "stack",
    title: "What runs your business?",
    helper: "Pick everything that applies.",
    why: "So the steps name your actual email system, money flows and devices.",
    type: "multi",
    optional: true,
    options: [
      { value: "m365", label: "Microsoft 365", group: "Email and files" },
      { value: "google", label: "Google Workspace", group: "Email and files" },
      { value: "personal-email", label: "Personal email accounts (Gmail, Outlook.com)", group: "Email and files" },
      { value: "office-pc", label: "Important files on one office computer", group: "Email and files" },
      { value: "wires", label: "We pay vendors by transfer, ACH or wire", group: "Money" },
      { value: "cards", label: "We take card payments", group: "Money" },
      { value: "payroll", label: "We run payroll through a service", group: "Money" },
      { value: "records", label: "Customer, client or patient records in an app", group: "Data and people" },
      { value: "byod", label: "Staff use personal phones or laptops", group: "Data and people" },
      { value: "remote", label: "Remote or hybrid staff", group: "Data and people" },
      { value: "shared-logins", label: "Some logins are shared", group: "Data and people" },
      { value: "ai-approved", label: "Staff use AI tools we approved", group: "AI" },
      { value: "ai-anything", label: "Staff use whatever AI tools they like", group: "AI" },
      { value: "ai-unsure", label: "Not sure what AI staff use", group: "AI" },
    ],
  },
  {
    id: "inPlace",
    title: "What's already in place?",
    helper: "Not sure? Leave it unticked. We'll help you check.",
    why: "So you get credit for what's done. We mark these as \"you said it's in place\" until you check them.",
    type: "multi",
    optional: true,
    options: [
      { value: "mfa-all", label: "Two-step sign-in on everyone's email" },
      { value: "team-pm", label: "A team password manager" },
      { value: "callback", label: "A callback rule for bank-detail changes" },
      { value: "ai-rules", label: "Written rules for AI tools" },
      { value: "tested-backups", label: "Backups we've test-restored" },
      { value: "offboarding", label: "Same-day account shutoff when someone leaves" },
      { value: "ir-plan", label: "A written incident response plan" },
      { value: "reporting", label: "Staff know how to report something suspicious" },
      { value: "none", label: "None of these yet", exclusive: true },
    ],
  },
  {
    ...KNOWLEDGE,
    options: [
      { value: "new", label: "New to this", description: "I got handed IT and I'm learning as I go.", icon: "Sprout" },
      { value: "basics", label: "I know the basics", description: "Two-step sign-in, backups, updates.", icon: "ShieldCheck" },
      { value: "expert", label: "I'm technical", description: "Admin settings, policies and the reasoning.", icon: "Wrench" },
    ],
  },
  STYLE,
  { ...TIME, title: "How much time can you or whoever handles IT give this most weeks?" },
]

export const QUIZZES = { home: HOME_QUIZ, business: BUSINESS_QUIZ }

// Used for any question that's skipped.
export const DEFAULT_ANSWERS = {
  home: { household: ["solo"], devices: [], aiUse: ["chat"], inPlace: [], knowledge: "basics", style: "do", time: "30" },
  business: { size: "2-5", it: "me", stack: [], inPlace: [], knowledge: "basics", style: "do", time: "30" },
}
