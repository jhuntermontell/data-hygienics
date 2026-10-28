// Data Hygienics Membership: the pitch, first written in
// design/strategy/membership-pitch.md and rewritten in the voice of
// design/brand-book/personality.md (Phase 4), with prices from
// design/strategy/membership-pricing.md. Pure data, import-free. Every
// surface that shows the membership reads from here, so the copy stays
// identical on the homepage, the Path reveal, the pricing page and Ask.
//
// Rules (CLAUDE.md): headings carry no trailing period, no statistics, no
// fear vocabulary, "AI" never "SI". Only what ships today is sold here: Ask,
// the saved Path, independence and the exit terms. The monthly note, printable
// cards and early verdicts are promises and stay out of this file until built.
// Never type a price into copy: write {home.monthly}, {home.yearly},
// {business.monthly} and so on, and render the string through withPrices().

export const MEMBERSHIP = {
  name: "Data Hygienics Membership",
  cta: "Become a member",
  ctaShort: "Join",
  headline: "Answers from our research, for {home.monthly} a month",
  subhead:
    "Ask answers from our published research and shows you the page. Your Path follows you to every device. We sell nothing else.",
  proofs: [
    {
      key: "ask",
      title: "Ask. Get the answer, with the source",
      text: "Paste the text that worried you, describe the call, name the setting you can't find. Ask answers only from our published research and links to the page it came from. When we don't know, it says so.",
    },
    {
      key: "path",
      title: "One Path, every device",
      text: "Start on your laptop, mark a step done on your phone, open it again at your parent's kitchen table. Home and business under one membership.",
    },
    {
      key: "independent",
      title: "Paid by members. Nobody else",
      text: "No security products to sell you, no referral fees, no ads. Your membership is what pays for that.",
    },
    {
      key: "free",
      title: "Free stays free",
      text: "The Path, every guide, the Threat Check. Membership adds the help, not the basics.",
    },
    {
      key: "leave",
      title: "Leave in two clicks",
      text: "Cancel any time. Export or delete your path whenever you like. Your questions to Ask are never stored by us.",
    },
  ],
  guarantee: "Cancel any time.",
  exit: "Two clicks to cancel. Export or delete your data any time. We never sell it.",
  secondary: "Or keep using the free Path",
  free: ["The Path, home and business", "Every guide and threat page", "The Threat Check and its verdicts", "Every step page", "The glossary"],

  homepage: {
    eyebrow: "Membership",
    headline: "A message feels wrong. Ask before you act",
    body: "Members get answers drawn only from our research, with the page they came from, and a Path that follows them to every device. Free stays free. Membership pays for the independence.",
    cta: "Become a member",
    secondary: "See what's included",
    checks: ["Ask Data Hygienics", "Your Path on every device", "Cancel any time"],
  },

  reveal: {
    headline: "Save this path. Add someone to ask",
    body: "Save your path to a free account so it's on every device. Members also get Ask: answers from our research for the moments a step raises a question, or a message does.",
    save: "Save my path (free)",
    join: "Become a member",
    saved: "You're saved. Members also get Ask: answers from our research for the moments a step raises a question, or a message does.",
    learn: "See what members get",
    notNow: "Not now",
  },

  nudge: {
    text: "Three done. When the next one raises a question, members ask us.",
    cta: "Join",
  },

  joined: {
    headline: "You're a member. Here's your path",
    body: "Ask is ready whenever a step raises a question. Your path is saved to your account.",
  },

  ask: {
    headline: "Ask Data Hygienics is for members",
    body: "Paste the text that worried you, describe the call, name the setting you can't find. Ask answers only from our published research, links to the page it came from, and says \"we don't know yet\" instead of guessing.",
    example: "A text says my package couldn't be delivered and asks me to confirm my address. Is that real?",
    cta: "Join",
    urgent: "Something urgent? Threat Check",
  },

  pricing: {
    h1: "Answers from our research, for {home.monthly} a month",
    line: "Ask answers from our published research and shows you the page. Your Path follows you to every device. We sell nothing else.",
    home: {
      title: "Home",
      who: "Everyone at your address, and the people you look out for",
      includes: [
        "Ask Data Hygienics: answers from our research, with the page they came from",
        "Your home and business paths on every device",
        "One account for your home and your work",
        "Cancel in two clicks; export or delete your data any time",
      ],
      cta: "Join Home",
    },
    business: {
      title: "Business",
      who: "One organization, up to 50 people, and whoever got handed IT",
      includes: [
        "Everything in Home, for your home path too",
        "The full Cyber Audit, with the plain-English score and both reports",
        "The Policy Library, all nine policies, including the AI Acceptable Use Policy",
        "The Incident Response Planner, with practice runs",
        "Cancel in two clicks; export or delete your data any time",
      ],
      cta: "Join Business",
    },
    founding: {
      label: "Founding rate, locked for life",
      note: "Annual only. The rate you join at is the rate you keep.",
    },
    pack: {
      title: "Documentation Pack",
      line: "Your AI-era security in writing, in one go: a deliverable for the client, lender or insurer who asks for paper.",
      includes: ["The full Cyber Audit", "All nine policies, including the AI Acceptable Use Policy", "An Incident Response Plan", "A remediation priority plan"],
      priceLabel: "one-time",
      cta: "Buy the Pack",
      conversion: "Bought the Pack? Email us and your first year of Business membership is on us.",
    },
    freeAlways: {
      title: "Free, always",
      intro: "Membership adds the help, not the basics. These never go behind a price.",
      items: ["The Path, home and business", "Every guide and threat page", "The Threat Check and its verdicts", "Every step page", "The glossary"],
    },
    faq: [
      {
        q: "Why pay when the Path is free?",
        a: "The Path is free and stays free. Membership is for the moment the Path can't anticipate: the text you're holding, the setting you can't find, the call that didn't feel right. Ask answers that, from our research, in a minute. And the money is what keeps the free part free of ads and affiliate deals.",
      },
      {
        q: "I already have Aura or LifeLock",
        a: "Keep it if it's working for you. Those products monitor and insure; they tell you after something happened. We're the other half: the habits that stop it, in order, and a place to ask before you act. We also sell no product, so our answer to \"do I need this\" is allowed to be no.",
      },
      {
        q: "I don't trust an AI chat with my security",
        a: "Neither would we, which is why Ask only answers from pages we wrote and sourced, shows you the page, and says \"we don't know yet\" instead of guessing. It never asks for passwords, codes or account numbers, and your questions aren't stored by us. You can read every rule it follows.",
      },
      {
        q: "I'm not technical",
        a: "Good. Every step is written four ways, including \"just tell me what to do.\" Ask is for the person who was handed a phone, a router or a company inbox without a manual. If a word trips you up, ask what it means.",
      },
      {
        q: "My business is tiny",
        a: "That's who we built this for: the owner, the office manager, the person who got handed IT. One membership covers your business path and your home path. If a client or lender asks for paperwork, the Documentation Pack is there.",
      },
      {
        q: "How much can I ask?",
        a: "As much as a person reasonably would: about fifty questions a month, forty a day. The caps exist so one account can't run up the bill for everyone else, and nobody using Ask for their own home or business will meet them.",
      },
    ],
  },

  // Prices in US dollars. Founding rates are annual only and sunset in code
  // (FOUNDING_UNTIL in lib/stripe/prices.js); whoever joins keeps the rate.
  prices: {
    home: { monthly: 8, yearly: 69, founding: 59 },
    business: { monthly: 39, yearly: 390, founding: 349 },
    pack: 299,
  },
}

// Fills {home.monthly}, {business.yearly} and the like from MEMBERSHIP.prices,
// so a price shown in copy always matches the price at checkout.
export function withPrices(text) {
  return String(text || "").replace(/\{(home|business)\.(monthly|yearly|founding)\}/g, (match, plan, cadence) => {
    const value = MEMBERSHIP.prices?.[plan]?.[cadence]
    return typeof value === "number" ? `$${value.toLocaleString("en-US")}` : match
  })
}
