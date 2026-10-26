// Copy for the three hub pages: /household (Home), /business (Business) and
// /digital-sovereignty. Rendered by app/components/hub/HubPage.jsx.
//
// "Start here" items point at library entries by kind + slug so a hub can
// drop any that are still drafts (no links to a 404). Items with a plain
// `href` point at pages that always exist and always render.
//
// `featuredTools` lists toolkit slugs (lib/content/toolkit.js) in display
// order. They resolve through lib/library.js getToolsBySlugs(), so drafts
// and unknown slugs drop out.
//
// Copy rules (CONTRACT.md): plain English, second person, no statistics
// here (numbers live in sourced content), no fear words, "AI" only.
import { SITE } from "./site.js"

export const HUBS = {
  home: {
    key: "home",
    audience: "home",
    path: "/household",
    accent: "home",
    eyebrow: "For Home",
    // Clear Path entry (app/path): the personal, ordered version of this hub.
    clearPath: { href: "/path/home", label: "Map my home path", line: "About two minutes. Nothing to sign up for." },
    name: "Data Hygienics for Home",
    title: "Home is where the safe word is",
    promise: [
      "Plain-English help for families, parents, remote workers and anyone looking out for an older relative.",
      "Learn how AI-powered scams reach your phone and inbox, the habits that stop them, and the tools we'd use ourselves.",
    ],
    metaTitle: "AI Security for Households and Families | Data Hygienics",
    metaDescription:
      "Voice-clone scams, chatbot privacy and account safety for households, in plain English with sources. Habits and tools we'd use with our own families.",
    startHere: [
      {
        kind: "guide",
        slug: "family-safe-word-and-callback-rule",
        label: "Set a family safe word",
        description: "A word only your family knows, plus a rule for calling back before anyone sends money.",
      },
      {
        kind: "guide",
        slug: "lock-down-your-ai-assistants",
        label: "Lock down your AI assistants",
        description: "Check what your chatbots remember, keep and learn from, and change the settings you don't like.",
      },
      {
        kind: "guide",
        slug: "protect-an-older-relative-from-ai-phone-scams",
        label: "Look out for an older relative",
        description: "Set up their phone and a plan together, without taking over.",
      },
    ],
    featuredTools: ["bitwarden", "iphone-call-screening", "pixel-call-screen", "credit-freeze", "backblaze", "signal"],
    // Reporting channels for the "If it already happened" box. Fixed
    // official sites and phone numbers, no statistics.
    alreadyHappened: {
      title: "If it already happened",
      intro:
        "Move quickly, and don't let embarrassment slow you down. These scams are built to fool careful people, and reporting helps you and the next family.",
      steps: [
        {
          title: "Call your bank's fraud line",
          detail:
            "Use the number on the back of your card or in your banking app, not one from the message. Ask them to stop or reverse the payment and secure your account.",
        },
        {
          title: "Report it to the FBI",
          detail: "The FBI's Internet Crime Complaint Center (IC3) takes reports of online scams, including voice-clone and investment scams.",
          href: "https://www.ic3.gov/",
          linkLabel: "ic3.gov",
        },
        {
          title: "Report it to the FTC",
          detail: "The Federal Trade Commission uses reports to track scams and warn others. You'll get next steps for your situation.",
          href: "https://reportfraud.ftc.gov/",
          linkLabel: "ReportFraud.ftc.gov",
        },
        {
          title: "60 or older? Call the National Elder Fraud Hotline",
          detail:
            "The Justice Department's hotline helps people 60 and older, and their families, report fraud and find support.",
          href: "tel:+18333728311",
          linkLabel: "833-FRAUD-11 (833-372-8311)",
        },
      ],
    },
    sections: {
      threats: {
        title: "Threats to know now",
        intro:
          "The AI-era scams and privacy leaks most likely to reach your household, with what they look like and what stops them.",
      },
      guides: {
        title: "Habits that hold up",
        intro: "Step-by-step routines you can finish in one sitting and share with the people you live with.",
      },
      tools: {
        title: "Tools we'd use",
        intro:
          "What we'd set up for our own families. Nobody paid to be on this list, and we earn nothing when you click.",
      },
      explainers: {
        title: "Own your digital life",
        intro: "Who holds your data, who learns from it and how you leave. Digital sovereignty, sized for a household.",
      },
    },
  },

  business: {
    key: "business",
    audience: "business",
    path: "/business",
    accent: "business",
    eyebrow: "For Business",
    clearPath: {
      href: "/path/business",
      label: "Map my business path",
      line: "Free. About three minutes. Starts with your industry.",
    },
    name: "Data Hygienics for Business",
    title: "AI-era security for whoever got handed IT",
    promise: [
      "Built for owner-operators, office managers and the person who became the IT department by accident, at organizations of up to 50 people.",
      "See what's reaching small teams now, set the rules your staff need, and get your plan in writing.",
    ],
    metaTitle: "AI Security for Small Businesses | Data Hygienics",
    metaDescription:
      "Deepfake payment fraud, AI phishing and staff chatbot use, explained for small teams. Free guides, a free AI policy, and tools to get it in writing.",
    startHere: [
      {
        kind: "guide",
        slug: "two-channel-verification-for-payments",
        label: "Verify payments on a second channel",
        description: "A simple callback rule for any request to move money or change bank details.",
      },
      {
        href: "/tools/policies/ai-acceptable-use-policy",
        label: "Get the free AI Acceptable Use Policy",
        description: "Decide which AI tools your team can use and what data stays out of them. Free account required.",
      },
      {
        kind: "guide",
        slug: "digital-hygiene-for-your-business",
        label: "Cover the small-business basics",
        description: "The habits that matter most for a small team, in the order to tackle them.",
      },
    ],
    featuredTools: [
      "bitwarden",
      "1password",
      "microsoft-copilot-chat",
      "chatgpt-business",
      "backblaze",
      "microsoft-365-business-premium",
    ],
    sections: {
      threats: {
        title: "Threats to know now",
        intro: "What's reaching small organizations now, how it gets in, and which controls stop it.",
      },
      briefs: {
        title: "Industry briefs",
        intro: "Deeper reads for regulated fields.",
      },
      guides: {
        title: "Habits that hold up",
        intro: "Routines and one-page rules a five-person team can run without a security department.",
      },
      tools: {
        title: "Tools we'd use",
        intro: "Products we'd put in front of a small team. No sponsorships, no referral fees, no affiliate links.",
      },
      explainers: {
        title: "Keep control of your data",
        intro: "Who learns from your company's data, how to get it back out, and how to avoid lock-in.",
      },
    },
  },

  sovereignty: {
    key: "sovereignty",
    audience: null,
    path: "/digital-sovereignty",
    accent: "sovereignty",
    eyebrow: "Digital Sovereignty",
    clearPath: {
      href: "/#start",
      label: "Map your path",
      line: "Your answers stay on your device. Export or delete them any time.",
    },
    name: "Digital Sovereignty",
    title: "Your data. Your identity. Your call",
    promise: [
      "Digital sovereignty means you decide who holds your information, who learns from it and how you leave.",
      "Here's what that looks like for a household and for a small business, without the politics.",
    ],
    metaTitle: "Digital Sovereignty in the Age of AI | Data Hygienics",
    metaDescription:
      "Own your data, identity and choices as AI moves into everything: who keeps your chats, how to leave a service, and steps for home and business.",
    startHere: [
      {
        kind: "explainer",
        slug: "what-digital-sovereignty-means",
        label: "What digital sovereignty means",
        description: "The idea in plain English, and why AI raises the stakes.",
      },
      {
        kind: "explainer",
        slug: "who-owns-your-ai-conversations",
        label: "Who owns your AI conversations",
        description: "What chatbots keep, what they learn from and the settings that change it.",
      },
      {
        kind: "guide",
        slug: "lock-down-your-ai-assistants",
        label: "Lock down your AI assistants",
        description: "Change the memory, history and training settings yourself.",
      },
    ],
    note:
      "We're non-partisan. This is about control over your own information, not about any party, country or flag.",
    featuredTools: ["proton-drive", "signal", "ollama", "bitwarden"],
    sections: {
      principles: {
        title: "What owning it looks like",
        intro: "Plain principles you can apply at home or at work. None of them needs a technical background.",
      },
      stance: {
        title: "Our stance on the words",
        intro: "Names shape how people think about a technology, so we picked ours on purpose and wrote down why.",
      },
      explainers: {
        title: "Explainers",
        intro: "Short answer first, then the detail, with a source for every number.",
      },
      actions: {
        title: "What to do about it",
        intro: "Concrete steps, sized for a household and for a small team.",
        home: "At home",
        business: "At work",
      },
      tools: {
        title: "Tools that keep it yours",
        intro:
          "Encrypted file storage and messaging, AI that runs on your own computer, and an open-source password manager. Nobody paid to be here.",
      },
    },
  },
}

export function getHub(key) {
  return HUBS[key]
}

// Page metadata for a hub. Child openGraph/twitter objects replace the root
// layout's, so the image is restated here.
export function hubMetadata(hub) {
  const url = `${SITE.url}${hub.path}`
  // Each hub folder has its own opengraph-image.js (app/<hub>/opengraph-image.js).
  const image = { url: `${hub.path}/opengraph-image`, width: 1200, height: 630, alt: `${hub.name}: ${hub.title}` }
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      siteName: SITE.name,
      title: hub.metaTitle,
      description: hub.metaDescription,
      url,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: [image],
    },
  }
}
