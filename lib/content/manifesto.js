// How we work (/how-it-works): the manifesto in three parts, then the method.
// Pure data, import-free, checked by scripts/validate-content.mjs like the
// library: every marker resolves to a tier 1-2 source, no uncited
// statistics, no banned tone words, no detection claims, titles carry no
// trailing period. Cite inline with [^source-id] right after the claim.
// Part 3 describes only what is true today; the custody rule for what we
// build next is stated as a rule, not a feature.

export const MANIFESTO = {
  kind: "manifesto",
  title: "How we work",
  line: "Three rules run everything we publish and everything we build. Here they are, with the reasons and the receipts.",
  lastReviewed: "2026-10",
  parts: [
    {
      id: "procedure",
      title: "Procedure beats detection",
      lede: "We don't teach you to spot fakes. We teach you what to do however good the fake gets.",
      paragraphs: [
        "In 2025, people reported $20.9 billion in losses to the FBI's internet crime center, up 26% from the year before.[^fbi-ic3-2025] Most of it arrived the ordinary way: a message, a call or a login page that looked real.",
        "Most security advice still asks you to judge. Is the voice really your grandson? Does the email look right? That job keeps getting harder. A scammer can copy a voice from a short audio clip, often taken from something posted online.[^ftc-ai-family-emergency-2023] The FBI warns that the same tools now make real-time video of executives and authority figures, and photos sent to prove a stranger is real.[^fbi-psa-genai-fraud-2024]",
        "Caller ID can be faked as well.[^fcc-deepfake-robocalls-guide-2024] Even the scam warnings built into phones come with the maker's own caveat that they do not catch every call.[^google-scam-detection-2026]",
        "So we teach a procedure instead. Hang up, and call back on a number you already have. Agree on a family word. Never send money, gift cards or crypto to someone you only know from a call or a screen. The FBI and the Federal Communications Commission (FCC) give the same advice.[^fbi-psa-genai-fraud-2024][^fcc-deepfake-robocalls-guide-2024]",
        "That is why every Threat Check verdict ends in a sentence you can say out loud, and every step on the Path changes what you do, not what you notice. You never have to win an argument with a voice.",
      ],
    },
    {
      id: "independence",
      title: "Independence is the product",
      lede: "Advice is only as good as the incentives behind it. Ours are written down.",
      rules: [
        { title: "No referral fees, no affiliate links", detail: "Links to products are clean, with no tracking codes. Our content checker rejects any link that carries one. We earn nothing when you click or buy." },
        { title: "No sponsors", detail: "Nobody pays to appear in the Toolkit, the Threat Library or anywhere else." },
        { title: "We sell only our own work", detail: "Membership and our business tools are the only things we sell, and we label them wherever they appear." },
        { title: "Products only where they help", detail: "We name a product only in the Toolkit, in step-by-step guides, or where a fix depends on one product's setting, and we say why it made the cut." },
      ],
      paragraphs: [
        "Members and our business tools pay for the work. Everything we publish is free to read, and it stays free.",
        "Because we sell no security products, our answer to \"do I need this?\" is allowed to be no.",
      ],
    },
    {
      id: "custody",
      title: "Your home stays yours",
      lede: "The safest data is data nobody else holds. So we hold as little of yours as we can.",
      rules: [
        { title: "Your Path lives in your browser", detail: "It reaches your account only if you sign in to keep it on another device, and you can export or delete it any time." },
        { title: "Search runs on your device", detail: "The site downloads one public index and searches it in your browser. What you type never leaves it." },
        { title: "Ask keeps no transcript", detail: "Our member assistant counts how much you use it, not what you asked." },
        { title: "We never ask for secrets", detail: "No passwords, codes or account numbers, anywhere on the site." },
      ],
      paragraphs: [
        "And a rule for what we build next: we will not hold your household's device list, account map or recovery notes. When a check needs them, it runs on your device. We keep your progress, not your house.",
      ],
    },
  ],
  method: {
    title: "Where our numbers come from",
    intro: "Every entry starts with a question a household or small business actually has. We go to the most authoritative source that answers it, read it, and record exactly where each figure lives. If a sentence has a statistic, it carries a numbered link to a named, dated source. When sources disagree, we use the more conservative figure. When nobody knows yet, we say so.",
    tiers: [
      { tier: "Tier 1", title: "Government, regulators and standards bodies", detail: "Agencies such as the FBI's Internet Crime Complaint Center, the FTC and CISA, standards bodies such as NIST and OWASP, and the text of laws themselves. Any headline number needs a source from this tier or the next." },
      { tier: "Tier 2", title: "Research with a published method", detail: "Annual reports that explain how they gathered their data, peer-reviewed studies, and AI companies' own threat reports. When a company reports on a problem it also sells a fix for, we note that interest." },
      { tier: "Tier 3", title: "Reputable journalism", detail: "Used for documented incidents and context, pointing back to the primary source where one exists. Never the only support for a statistic." },
    ],
    never: [
      "Marketing posts with no method behind the numbers",
      "AI-generated summaries, content farms and social media posts",
      "Wikipedia as a source (we use it to find the primary one)",
      "Our own earlier articles as proof of anything",
    ],
    dated: "Each entry shows when we published it and when we last reviewed it. Each source shows when it was published and when we checked it. When a new edition of a report we cite comes out, we update the figure or flag it as older. Our stance pieces name the event that would change our minds, and we revisit them when it happens.",
  },
  crawlers: {
    title: "AI can read this site",
    detail: "Our robots.txt lets AI crawlers read every page. If someone asks an assistant what to do about a call that sounded like family, we would rather it learned from sourced, dated guidance than from a guess. Our research pages carry structured data and a numbered source list, so an assistant can cite us accurately. If one ever gets us wrong, tell us.",
  },
}
