export default {
  kind: "explainer",
  slug: "who-owns-your-ai-conversations",
  title: "Who owns your AI conversations?",
  metaTitle: "Who Owns Your AI Conversations? | Data Hygienics",
  metaDescription: "Who can read, train on, keep and hand over your AI chats. What ChatGPT, Claude, Gemini, Copilot and Meta AI say, and what you can do about it.",
  audience: ["home", "business"],
  pillars: ["sovereignty", "hygiene"],
  question: "Who owns your AI conversations?",
  shortAnswer: "In practice, the company that runs the assistant holds your conversations, and its terms decide who can read them, whether they train future models and how long they're kept. Some consumer plans, including ChatGPT's, use your chats for training unless you switch it off, while the major business plans say they don't by default. You can usually export or delete your chats, but deleting doesn't undo training that already happened, and legal holds can override deletion.",
  tldr: "Your AI chats sit on the provider's servers under its terms. Training defaults differ by product and plan: ChatGPT's Free, Go, Plus and Pro plans train on chats unless you opt out, Claude asks you to choose, Gemini ties it to a Keep Activity setting, and Microsoft says its updated consumer Copilot app doesn't train the core models behind its AI on your chats.[^openai-data-controls-2026][^anthropic-consumer-terms-2025][^google-gemini-privacy-hub-2026][^microsoft-copilot-activity-history-2026] Ads are starting to draw on chat context too, so check those settings as well.[^openai-chatgpt-ads-2026][^meta-ai-recommendations-2025]",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,
  sections: [
    {
      heading: "Control matters more than ownership",
      paragraphs: [
        "When you type into an artificial intelligence (AI) assistant, your words go to the provider's servers and are stored under its terms. Those terms, plus your settings, decide who can read the chat, whether it trains future models, how long it's kept and when it can be handed to someone else.",
        "So instead of asking who owns the words, ask the practical questions: who can read them, who can reuse them, how long they last, and whether you can take them with you or get rid of them.",
      ],
    },
    {
      heading: "Who can read your chats",
      paragraphs: [
        "People at the company, in limited cases. Google says a subset of Gemini chats is reviewed by people, including trained service providers, and that reviewed chats are kept for up to 3 years, disconnected from your account, even if you delete your activity.[^google-gemini-privacy-hub-2026] Anthropic keeps the inputs and outputs of chats flagged for policy violations for up to 2 years.[^anthropic-retention-2026]",
        "Your employer, on a work account. Microsoft says prompts and responses in Copilot Chat for work are logged, and IT administrators can search and audit them.[^microsoft-copilot-work-2026] On ChatGPT and Claude business plans, the organization, not the individual user, controls exports of your chats.[^openai-data-controls-2026][^anthropic-claude-export-2026]",
        "Courts and authorities, through legal process. OpenAI's privacy policy says it may keep data longer when legally required, such as under a subpoena, and may share it with government authorities to comply with the law.[^openai-privacy-policy-2026]",
        "This has happened. In 2025 a court order in a copyright lawsuit required OpenAI to preserve consumer ChatGPT conversations, including deleted ones; OpenAI says the order ended on September 26, 2025, and that it still holds a limited set of April to September 2025 data under legal hold.[^openai-nyt-data-demands-2025]",
      ],
    },
    {
      heading: "Who can reuse them: model training",
      paragraphs: [
        "ChatGPT (Free, Go, Plus and Pro): sharing for training is on by default, and you can turn off \"Improve the model for everyone\" in Data controls.[^openai-data-controls-2026] Rating a reply with a thumbs up or down can still send that whole conversation for training after you opt out; Temporary Chats aren't used for training.[^openai-model-training-2026]",
        "Claude (Free, Pro and Max): since 2025, Anthropic asks each user to choose whether chats can train its models.[^anthropic-consumer-terms-2025] If you allow it, de-identified chats can be kept for up to 5 years, and Incognito chats aren't used for training either way.[^anthropic-retention-2026][^anthropic-model-training-2026]",
        "Gemini: the Keep Activity setting controls it. When it's on, chats are saved (auto-deleted after 18 months by default) and can be used to improve Google's AI; when it's off, Google keeps chats for 72 hours and doesn't use them for training unless you send feedback.[^google-gemini-privacy-hub-2026] Temporary chats are also kept for 72 hours and aren't used for training, and Google notes that its Gemini settings don't control the creation of anonymized data from your chats.[^google-gemini-privacy-hub-2026]",
        "Microsoft Copilot (personal account): Microsoft says that in the updated Copilot app available since August 18, 2026, your prompts, responses and files aren't used to train the core models behind its AI.[^microsoft-copilot-activity-history-2026] If you haven't updated, the older terms apply, and chats can be used for training unless you opt out.[^microsoft-copilot-privacy-faq-2026]",
        "Meta AI: Meta lists your interactions with its AI features, along with public posts and photos, among its training sources.[^meta-genai-privacy-2026] It says it doesn't train on private messages with friends and family unless someone in the chat shares them with the AI.[^meta-genai-privacy-2026]",
        "Business plans work differently. OpenAI doesn't train on ChatGPT Business, Enterprise, Edu or developer (API) data by default, and neither does Anthropic for Claude for Work or its API, though Anthropic may use chats that staff rate with a thumbs up or down unless an owner turns rating off.[^openai-model-training-2026][^anthropic-commercial-training-2026] Google says Workspace content isn't used to train models outside your organization without permission, and Microsoft says work-account Copilot Chat isn't used to train the core models behind its AI.[^google-workspace-ai-privacy-2026][^microsoft-copilot-work-2026]",
      ],
    },
    {
      heading: "Who can reuse them: ads and recommendations",
      paragraphs: [
        "ChatGPT began testing ads on its Free and Go plans in the US on February 9, 2026.[^openai-chatgpt-ads-2026] Ads can draw on your current chat and, if ad personalization is on, on past chats and memory; OpenAI says it doesn't share conversations with advertisers.[^openai-chatgpt-ads-2026]",
        "Microsoft says people without a Microsoft 365 subscription may see ads in Copilot, and personalized ads can use chat history and saved memories unless you turn that off.[^microsoft-copilot-privacy-controls-2026] Since December 16, 2025, Meta has used interactions with its AI features to personalize content and ads in most regions, and says it won't use conversations about sensitive topics such as health and religion to show ads.[^meta-ai-recommendations-2025]",
        "Google says Gemini chats aren't currently used to show you ads and that it will tell you if that changes.[^google-gemini-privacy-hub-2026]",
      ],
    },
    {
      heading: "How long they last, and why delete isn't undo",
      paragraphs: [
        "At OpenAI and Anthropic, deleted chats leave their systems within 30 days, with exceptions for legal and safety reasons.[^openai-privacy-policy-2026][^anthropic-retention-2026] Feedback is different: Anthropic keeps thumbs-up and thumbs-down reports, with the whole conversation, for up to 5 years.[^anthropic-model-training-2026]",
        "Training can't be reversed. Anthropic says that if you turn training off, your data stays in training runs already under way and in models already trained; it just won't be used in future runs.[^anthropic-retention-2026]",
      ],
    },
    {
      heading: "Taking your conversations with you",
      paragraphs: [
        "Most assistants let you download your history, but an export is a copy, not a move. ChatGPT and Claude offer self-service exports to individual users, and Microsoft offers Copilot history export through its privacy dashboard.[^openai-data-controls-2026][^anthropic-claude-export-2026][^microsoft-copilot-activity-history-2026] Anthropic notes that an export can't be imported into another personal Claude account.[^anthropic-claude-export-2026]",
        "The law backs some of this. In the European Union, the General Data Protection Regulation (GDPR) gives a right to data portability in Article 20 for data you provided under consent or a contract.[^eu-gdpr-2016] California's privacy law requires businesses to provide your data in a portable, machine-readable format where technically feasible, within 45 days of a verified request.[^ca-ccpa-1798-130]",
      ],
    },
    {
      heading: "What regulators have said",
      paragraphs: [
        "The Federal Trade Commission (FTC) has warned that quietly rewriting a privacy policy to start using customer data for AI training could be unfair or deceptive.[^ftc-ai-terms-change-2024] It has also said AI companies are bound by the privacy promises they make, noting that past FTC orders required companies to delete models built from improperly obtained data.[^ftc-ai-privacy-commitments-2024]",
        "In September 2025 the FTC ordered seven companies with consumer chatbots, including Alphabet, Meta, OpenAI, Snap and xAI, to explain how they use and share personal information from conversations.[^ftc-ai-companion-inquiry-2025] It's a study, not an enforcement case.",
        "In the EU, a proposal to amend the GDPR would spell out when companies may use personal data to develop AI under \"legitimate interest\"; as of October 2026 it was still being negotiated.[^eu-council-digital-omnibus-mandate-2026]",
      ],
    },
    {
      heading: "Set it once, then check it",
      paragraphs: [
        "Our step-by-step guide, Lock down your AI assistants, shows where each of these switches lives. Settings and terms change, so recheck them whenever a provider emails you about an update.",
      ],
    },
  ],
  actions: {
    home: [
      {
        label: "Decide on training in every assistant you use",
        detail: "Turn training off where you don't want it, and recheck after app updates or a terms-change email.",
        guideSlug: "lock-down-your-ai-assistants",
      },
      {
        label: "Use temporary or incognito chats for sensitive questions",
        detail: "ChatGPT Temporary Chat, Claude Incognito and Gemini temporary chats aren't used for training. They may still be kept briefly for safety checks.",
      },
      {
        label: "Skip the thumbs on sensitive chats",
        detail: "Rating a reply can send the whole conversation for review or training, even if you've opted out.",
      },
      {
        label: "Turn off ad personalization where it's offered",
        detail: "Check the ad settings in ChatGPT and Copilot. Meta describes no opt-out from using AI chats for ads; you can only adjust ads in Ads Preferences.[^meta-ai-recommendations-2025]",
      },
      {
        label: "Leave out details you'd want kept private",
        detail: "Remove names, account numbers and health details before you ask. Treat an AI chat like an email: stored by a company and reachable in a lawsuit.",
      },
    ],
    business: [
      {
        label: "Move staff onto business plans",
        detail: "Business tiers from the major providers say they keep your data out of model training by default. Business plans add admin controls; custom data-retention periods are generally an Enterprise-tier feature.[^openai-enterprise-privacy-2026][^anthropic-claude-pricing-2026]",
        guideSlug: "one-page-ai-use-rule-for-your-team",
      },
      {
        label: "Write down what never goes into an AI tool",
        detail: "Client records, health and financial data, passwords and anything under a confidentiality agreement are the usual starting list.",
        guideSlug: "one-page-ai-use-rule-for-your-team",
      },
      {
        label: "Review the admin settings",
        detail: "Check retention settings if your plan has them, who can export chats, which connected apps are allowed, and whether staff can rate replies, since some providers may use rated chats for training.",
        guideSlug: "lock-down-your-ai-assistants",
      },
      {
        label: "Tell staff work chats are company records",
        detail: "On work accounts, chats can be logged, reviewed by admins and preserved for legal holds, just like email.",
      },
      {
        label: "Ask vendors about AI features before you turn them on",
        detail: "Get in writing whether your data trains their models, how long it's kept and where it's processed.",
      },
    ],
  },
  faqs: [
    {
      question: "Can the company read my AI chats?",
      answer: "Sometimes. Providers use automated systems and, in limited cases, human reviewers, mainly for safety checks and product improvement. On a work account, your employer's administrators may also be able to see your chats.",
    },
    {
      question: "If I delete a chat, is it gone?",
      answer: "It leaves your history right away, and some major providers, including OpenAI and Anthropic, delete it from their systems within about a month. Exceptions include legal holds, safety investigations, chats already reviewed by people, and anything already used to train a model.",
    },
    {
      question: "Does turning off training stop all data collection?",
      answer: "No. The provider still stores your chats to show your history and to check for abuse, usually for a set period. Turning off training only keeps your future chats out of model improvement.",
    },
    {
      question: "Are business plans really different?",
      answer: "Yes, in the ways that matter most here. The major providers say their business plans don't train on your data by default, and those plans add admin controls, though custom data-retention periods are generally an Enterprise-tier feature. Your employer then decides how those chats are kept.",
    },
    {
      question: "Are my AI chats private, like a talk with my doctor?",
      answer: "Treat them like email instead. They're stored by a company, can be reviewed in limited cases, and can be preserved and requested in lawsuits. Keep truly confidential details out of them.",
    },
  ],
  sourceIds: [
    "openai-data-controls-2026",
    "anthropic-consumer-terms-2025",
    "google-gemini-privacy-hub-2026",
    "microsoft-copilot-activity-history-2026",
    "openai-chatgpt-ads-2026",
    "meta-ai-recommendations-2025",
    "anthropic-retention-2026",
    "microsoft-copilot-work-2026",
    "anthropic-claude-export-2026",
    "openai-privacy-policy-2026",
    "openai-nyt-data-demands-2025",
    "openai-model-training-2026",
    "anthropic-model-training-2026",
    "microsoft-copilot-privacy-faq-2026",
    "meta-genai-privacy-2026",
    "google-workspace-ai-privacy-2026",
    "microsoft-copilot-privacy-controls-2026",
    "anthropic-commercial-training-2026",
    "openai-enterprise-privacy-2026",
    "anthropic-claude-pricing-2026",
    "eu-gdpr-2016",
    "ca-ccpa-1798-130",
    "ftc-ai-terms-change-2024",
    "ftc-ai-privacy-commitments-2024",
    "ftc-ai-companion-inquiry-2025",
    "eu-council-digital-omnibus-mandate-2026",
  ],
  related: {
    threats: ["ai-chatbot-data-leaks", "prompt-injection-and-ai-agent-hijacking"],
    guides: ["lock-down-your-ai-assistants", "one-page-ai-use-rule-for-your-team", "digital-hygiene-for-your-business"],
    explainers: ["what-digital-sovereignty-means"],
    controls: ["ai-acceptable-use", "data-retention", "data-classification", "vendor-agreements"],
    glossary: ["model-memory", "data-portability", "shadow-ai", "generative-ai"],
    toolkit: [],
  },
}
