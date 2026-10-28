// Brand, navigation, and audience configuration shared by the shell
// (Navbar, Footer, hubs, metadata).
//
// Terminology lives in SITE.terms. "AI" is the public term; "SI"
// (superintelligence) is seeded only in the glossary, the stance explainer
// (/digital-sovereignty/ai-or-si-what-we-call-it) and the Digital
// Sovereignty hub's glossary teaser (app/components/GlossaryTeaser.jsx),
// which shows the AI and SI entries side by side. Keep the stance explainer
// out of the Home and Business hubs (lib/library.js STANCE_EXPLAINER_SLUG).
// If that stance changes, flip showAltInBrand and revisit those three places
// rather than rewriting copy site-wide.

export const SITE = {
  name: "Data Hygienics",
  url: "https://datahygienics.com",
  tagline: "Security, in order.",
  headline: "Your digital life, in order",
  kicker: "The field guide for the AI era",
  description:
    "Independent security for homes and businesses of 1 to 50: what's reaching people now, what to do in order, and the tools worth using. Every number sourced.",
  terms: {
    ai: "AI",
    aiLong: "artificial intelligence",
    alt: "SI",
    altLong: "superintelligence",
    showAltInBrand: false,
  },
}

export const AUDIENCES = {
  home: {
    key: "home",
    label: "Home",
    navLabel: "For Home",
    href: "/household",
    description: "Families, parents, remote workers and anyone looking out for an older relative.",
  },
  business: {
    key: "business",
    label: "Business",
    navLabel: "For Business",
    href: "/business",
    description: "Owner-operators and whoever got handed IT at a 1-50 person organization.",
  },
}

export const PILLARS = {
  threats: { key: "threats", label: "Threats" },
  hygiene: { key: "hygiene", label: "Hygiene" },
  sovereignty: { key: "sovereignty", label: "Digital Sovereignty" },
}

export const NAV = {
  primary: [
    { href: AUDIENCES.home.href, label: AUDIENCES.home.navLabel },
    { href: AUDIENCES.business.href, label: AUDIENCES.business.navLabel },
  ],
  library: [
    { href: "/digital-sovereignty", label: "Digital Sovereignty", description: "Own your data, identity and choices" },
    { href: "/threats", label: "Threat Library", description: "What's reaching homes and businesses now" },
    { href: "/guides", label: "Guides", description: "Setups, step by step, in plain English" },
    { href: "/toolkit", label: "Toolkit", description: "Tools we'd use ourselves. No referral fees" },
    { href: "/glossary", label: "Glossary", description: "AI and security terms, decoded" },
    { href: "/controls", label: "Controls Library", description: "The safeguards behind the advice" },
  ],
  businessTools: [
    { href: "/tools/cyber-audit", label: "Cyber Audit", description: "Find the gaps. Close them" },
    { href: "/tools/policies", label: "Policy Library", description: "Your rules, in writing. The AI policy is free" },
    { href: "/tools/ir-plan", label: "Incident Response Planner", description: "A plan you've practiced" },
    { href: "/tools/ask", label: "Ask", description: "Get the answer, with the source" },
    { href: "/pricing", label: "Pricing", description: "What's free, and what members get" },
  ],
  // Clear Path is the front door: the homepage chips (#start) open a
  // personal, ordered path at /path/home or /path/business.
  start: { href: "/#start", label: "Map your path" },
  // The door into the checker: for the moment something just happened. It
  // sits apart from the rest of the bar (LifeBuoy icon, teal) on every page.
  door: { href: "/check", label: "Threat Check", description: "Is this real?" },
  // A quiet text link to the membership, for signed-out visitors.
  members: { href: "/pricing", label: "Members" },
}

export const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: AUDIENCES.home.href, label: "For Home" },
      { href: AUDIENCES.business.href, label: "For Business" },
      { href: "/digital-sovereignty", label: "Digital Sovereignty" },
      { href: "/#start", label: "Map your path" },
    ],
  },
  {
    title: "Library",
    // Digital Sovereignty heads the Library menu but already sits under Explore here.
    links: NAV.library.filter(({ href }) => href !== "/digital-sovereignty").map(({ href, label }) => ({ href, label })),
  },
  {
    title: "Business Tools",
    links: [
      ...NAV.businessTools.map(({ href, label }) => ({ href, label })),
      { href: "/tools", label: "All business tools" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How we work" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
]
