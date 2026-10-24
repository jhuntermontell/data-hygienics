// Brand, navigation, and audience configuration shared by the shell
// (Navbar, Footer, hubs, metadata).
//
// Terminology lives in SITE.terms. "AI" is the public term; "SI"
// (superintelligence) is seeded only in the glossary, the stance explainer
// (/digital-sovereignty/ai-or-si-what-we-call-it) and the homepage glossary
// teaser (app/components/GlossaryTeaser.jsx), which shows the AI and SI
// entries side by side. Keep the stance explainer out of the Home and
// Business hubs and the homepage "Latest research" list (lib/library.js
// STANCE_EXPLAINER_SLUG). If that stance changes, flip showAltInBrand and
// revisit those three places rather than rewriting copy site-wide.

export const SITE = {
  name: "Data Hygienics",
  url: "https://datahygienics.com",
  tagline: "Live securely alongside AI.",
  kicker: "Digital hygiene for the AI era",
  description:
    "Independent, researched guidance for households and small businesses living and working alongside AI: the threats, the fixes, and the tools worth using.",
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
    { href: "/digital-sovereignty", label: "Digital Sovereignty" },
  ],
  library: [
    { href: "/threats", label: "Threat Library", description: "What's actually hitting homes and businesses" },
    { href: "/guides", label: "Guides", description: "Step-by-step hygiene, in plain English" },
    { href: "/toolkit", label: "Toolkit", description: "Tools we'd actually use. No referral fees." },
    { href: "/glossary", label: "Glossary", description: "AI and security terms, decoded" },
    { href: "/controls", label: "Controls Library", description: "The safeguards behind the advice" },
  ],
  businessTools: [
    { href: "/tools/cyber-audit", label: "Cyber Audit", description: "Score your security, including AI use" },
    { href: "/tools/policies", label: "Policy Library", description: "Start with the free AI Acceptable Use Policy (free account required)" },
    { href: "/tools/ir-plan", label: "Incident Response Planner", description: "A plan for when it goes wrong" },
    { href: "/pricing", label: "Pricing", description: "What's free and what's paid" },
  ],
  // Clear Path (app/path) is the front door: a personal, ordered path.
  start: { href: "/path", label: "Map your path" },
}

export const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: AUDIENCES.home.href, label: "For Home" },
      { href: AUDIENCES.business.href, label: "For Business" },
      { href: "/digital-sovereignty", label: "Digital Sovereignty" },
      { href: "/path", label: "Clear Path" },
      { href: "/start", label: "Get started" },
    ],
  },
  {
    title: "Library",
    links: NAV.library.map(({ href, label }) => ({ href, label })),
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
