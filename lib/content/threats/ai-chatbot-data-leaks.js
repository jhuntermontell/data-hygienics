export default {
  kind: "threat",
  slug: "ai-chatbot-data-leaks",
  title: "AI chatbot data leaks and shadow AI",
  metaTitle: "AI Chatbot Data Leaks and Shadow AI | Data Hygienics",
  metaDescription: "What happens to what you type into ChatGPT, Gemini, Claude, Copilot or Meta AI, how staff leak client data, and the settings and rules that stop it.",
  audience: ["home", "business"],
  pillars: ["threats", "sovereignty"],
  tldr: "Whatever you paste into an AI assistant can be stored, read by reviewers or used to train future models, depending on the app, the plan and your settings. In a 2025 survey of workers in 47 countries, 48% of those who use AI at work said they had uploaded sensitive company or customer information into public AI tools.[^unimelb-kpmg-trust-ai-2025] The fix is mostly unglamorous: business accounts for work, the right settings at home, and a clear rule about what never goes in.",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: true,

  severity: "high",
  aiRole: "ai-native",
  irIncidentType: "ai_data_exposure",

  whatItIs: "An AI chatbot data leak happens when private information you type or upload into an AI assistant ends up somewhere you did not intend: kept on the provider's servers, read by human reviewers, used to train future models, exposed through a share link, or available to whoever gets into the account. \"Shadow AI\" is the workplace version, where staff use AI tools the business never approved, usually on personal accounts. No hacker is needed; the leak starts with a helpful copy and paste.",

  howItLooks: [
    {
      audience: "business",
      title: "The spreadsheet that went to ChatGPT",
      scenario: "Between March 12 and 15, 2025, a former contractor for the NSW Reconstruction Authority in Australia uploaded an Excel file with more than 12,000 rows of program applicants' details to ChatGPT, a tool the agency had not authorized.[^nsw-ra-chatgpt-breach-2025] The file held names, addresses, phone numbers, email addresses and some health information for up to 3,000 people.[^nsw-ra-chatgpt-breach-2025] The agency announced it in October 2025, brought in forensic analysts, and said it had no evidence anyone else had accessed the data but could not rule out that it had been made public.[^nsw-ra-chatgpt-breach-2025] The small-business version is quieter: a bookkeeper pastes a client list into a free chatbot to fix the formatting, or an office manager uploads a patient letter to tidy the wording. Nobody meant harm, and nobody can now say exactly where that data lives.",
    },
    {
      audience: "home",
      title: "The health question on a public feed",
      scenario: "In June 2025, people using the Meta AI app posted chats about health and legal questions to the app's public Discover feed, often without realizing everyone could read them.[^engadget-meta-ai-discover-2025] Meta responded by adding a warning to the post button.[^engadget-meta-ai-discover-2025] Most leaks at home are less visible. A ChatGPT share link made from a personal account can be opened by anyone who has it.[^openai-shared-links-2026] In Gemini's consumer app, a sample of chats is read by human reviewers, and reviewed chats can be kept for up to three years even after you delete your activity.[^google-gemini-privacy-hub-2026] And in a Messenger group chat, anyone who uses Meta AI can share up to 50 recent messages with it, and @mentioning Meta AI in a group can share the past 30 days of messages, including yours, unless sharing is turned off for that chat.[^meta-messenger-ai-sharing-2026]",
    },
  ],

  howItGetsIn: [
    "Staff paste client, patient or financial details into a free or personal AI account because it is faster than asking.",
    "Whole files get uploaded (spreadsheets, contracts, scans, lab results) when the task needed one sentence.",
    "Consumer defaults favor the vendor: ChatGPT's personal plans, including paid Plus and Pro, have training turned on until you switch it off.[^openai-data-controls-2026]",
    "Memory features keep personal details and bring them back in later chats, and deleting the original chat does not always delete the memory.[^openai-memory-2026][^anthropic-memory-2026]",
    "Share links and public feeds turn a private chat into a public page.",
    "Thumbs-up and thumbs-down feedback can send the entire conversation to the vendor for training, even on accounts that opted out.[^openai-data-controls-2026][^anthropic-commercial-training-2026]",
    "Connected apps (email, cloud drives, calendars) pull far more data into a chat than anyone typed.",
    "Other people share your words: a colleague runs your email through an assistant, or a relative brings an AI into the family group chat.",
    "Former staff and contractors keep logins to AI accounts that hold months of company chats.",
    "A stolen AI account password turns your chat history into a searchable file about your life or your business.",
  ],

  whatStopsIt: [
    {
      title: "Use business accounts for work",
      detail: "Business tiers from the major vendors say they keep your data out of model training by default: ChatGPT Business and Enterprise,[^openai-enterprise-privacy-2026] Claude Team and Enterprise,[^anthropic-commercial-training-2026] and Microsoft Copilot used with a work account.[^microsoft-copilot-edp-2026] With Gemini under Google Workspace, your content isn't used to train models outside your domain without permission.[^google-workspace-genai-privacy-2026] Business plans also give an owner admin controls, such as how long chats are kept and which apps can connect; a paid personal plan is not the same thing.",
      audience: ["business"],
      controlSlug: "ai-acceptable-use",
      toolkitCategory: "private-ai",
    },
    {
      title: "Write down what never goes in",
      detail: "Only 34% of employees in a 2025 global survey said their employer had a policy guiding generative AI use,[^unimelb-kpmg-trust-ai-2025] and 58% of AI users in another 2025 survey said they had never been trained on AI privacy or security risks.[^nca-oh-behave-2025] A one-page rule that names approved tools and bans client personal data, health information, account numbers and passwords, plus a short team walkthrough, goes a long way. Our free AI Acceptable Use Policy generator (free account required) turns it into a full policy.",
      audience: ["business"],
      controlSlug: "ai-acceptable-use",
      guideSlug: "one-page-ai-use-rule-for-your-team",
    },
    {
      title: "Label your data before it goes near AI",
      detail: "Sort information into public, internal and confidential so staff can decide in seconds what is allowed. The same labels drive your AI rule, your sharing settings and your vendor reviews.",
      audience: ["business"],
      controlSlug: "data-classification",
    },
    {
      title: "Switch off training and trim memory on personal accounts",
      detail: "Every major assistant now has a training setting, a memory setting and a way to delete history, though the defaults differ. About five minutes per assistant covers it.",
      audience: ["home", "business"],
      guideSlug: "lock-down-your-ai-assistants",
    },
    {
      title: "Use temporary or incognito chats for one-off sensitive questions",
      detail: "ChatGPT's Temporary Chat and Claude's incognito chats are not used for training and do not feed memory.[^openai-data-controls-2026][^anthropic-consumer-training-2026] They are not invisible: ChatGPT may keep temporary chats for up to 30 days and Gemini keeps temporary chats for 72 hours.[^openai-data-controls-2026][^google-gemini-privacy-hub-2026]",
      audience: ["home", "business"],
      guideSlug: "lock-down-your-ai-assistants",
    },
    {
      title: "Strip names and numbers first",
      detail: "Most tasks work just as well with placeholders. Replace names with \"Client A\", drop account and ID numbers, and paste only the paragraph that matters instead of the whole file.",
      audience: ["home", "business"],
    },
    {
      title: "Check each vendor's AI terms when you sign up and when you renew",
      detail: "Vendors change data terms; Anthropic, for example, asked consumer users to choose a training setting in 2025.[^anthropic-consumer-terms-2025] The Federal Trade Commission (FTC) has warned companies that quietly changing privacy terms to use data for AI training may be unfair or deceptive.[^ftc-ai-terms-changes-2024] Put AI features on your vendor review checklist anyway.",
      audience: ["business"],
      controlSlug: "vendor-risk-management",
    },
    {
      title: "Protect the AI account itself",
      detail: "Turn on multi-factor authentication (MFA) for every AI account, and remove departing staff and contractors from AI tools the same day you remove their email.",
      audience: ["home", "business"],
      controlSlug: "multi-factor-authentication",
    },
    {
      title: "Clean up share links and public posts",
      detail: "Review the share links you have created and delete the ones you no longer need. In Gemini, deleting a shared chat does not delete its public link, so remove the link separately.[^google-gemini-activity-2026]",
      audience: ["home"],
      guideSlug: "lock-down-your-ai-assistants",
    },
  ],

  ifItHappens: [
    {
      step: "Write down what went in, where and when",
      detail: "Note the tool, whether it was a personal or business account, the time, and exactly what data was shared. You will need this for every decision that follows.",
      audience: ["home", "business"],
    },
    {
      step: "Delete the chat, its share links and any saved memories",
      detail: "OpenAI and Anthropic say deleted chats leave their back-end systems within 30 days, with legal and safety exceptions.[^openai-delete-chats-2026][^anthropic-consumer-retention-2026] Delete saved memories separately, because deleting a chat does not always remove them.[^openai-memory-2026][^anthropic-memory-2026] Chats that Google's reviewers already read can be kept for up to three years.[^google-gemini-privacy-hub-2026]",
      audience: ["home", "business"],
    },
    {
      step: "Turn training off for that account",
      detail: "This stops future use. Anthropic notes that data already used in a training run stays in models trained with it.[^anthropic-consumer-retention-2026]",
      audience: ["home", "business"],
    },
    {
      step: "Start your incident plan",
      detail: "Open the AI data exposure playbook in our Incident Response Planner (one of our paid business tools). Tell whoever owns your AI rule, and treat it as a possible data breach until you know otherwise.",
      audience: ["business"],
    },
    {
      step: "Check whether you have to notify anyone",
      detail: "If client personal information or health information was involved, ask your lawyer or IT provider whether breach notification laws apply. Health data covered by HIPAA (the Health Insurance Portability and Accountability Act) has its own rules.",
      audience: ["business"],
    },
    {
      step: "Ask the vendor to delete it",
      detail: "Use the vendor's privacy request form or business support channel to request deletion, and keep the confirmation.",
      audience: ["home", "business"],
    },
    {
      step: "If ID or account numbers were exposed, protect your identity",
      detail: "Call your bank or card issuer, consider a credit freeze, and use the FTC's IdentityTheft.gov to get a recovery plan. If someone has already stolen money or tricked you, report it at ReportFraud.ftc.gov and to the FBI's Internet Crime Complaint Center at ic3.gov.",
      audience: ["home", "business"],
    },
  ],

  stats: [
    {
      figure: "48%",
      context: "of employees who use AI at work (from 32,352 surveyed in 47 countries) said they had uploaded sensitive company or customer information into public AI tools.",
      sourceId: "unimelb-kpmg-trust-ai-2025",
      locator: "KPMG/UniMelb global report p.75, Fig. 44",
    },
    {
      figure: "34%",
      context: "of employees in the same survey said their organization had a policy guiding generative AI use.",
      sourceId: "unimelb-kpmg-trust-ai-2025",
      locator: "Section on training, guidance and governance",
    },
    {
      figure: "43%",
      context: "of breached organizations in IBM's 2026 study had security incidents involving unapproved AI use, up from 20% the year before.",
      sourceId: "ibm-think-shadow-ai-2026",
      locator: "Section 'The three gaps between your data and your controls'",
    },
    {
      figure: "58%",
      context: "of AI users in a seven-country 2025 survey said they had received no training on AI security or privacy risks.",
      sourceId: "nca-oh-behave-2025",
      locator: "Press release, paragraph 3",
    },
    {
      figure: "Up to 3,000 people",
      context: "were potentially affected when a former government contractor uploaded a program spreadsheet to ChatGPT in March 2025.",
      sourceId: "nsw-ra-chatgpt-breach-2025",
      locator: "Media release, October 6, 2025",
    },
    {
      figure: "Up to 3 years",
      context: "is how long Google can keep Gemini chats that human reviewers have read, even after you delete your activity.",
      sourceId: "google-gemini-privacy-hub-2026",
      locator: "Privacy Notice, 'How long we retain your data'",
    },
  ],

  faqs: [
    {
      question: "Is it safe to use ChatGPT or other chatbots for work?",
      answer: "Yes, for the right data in the right account. Public and general information is low risk in any approved tool. Client, patient and financial details belong only in a business account your company controls, and passwords never belong in any chatbot.",
    },
    {
      question: "If I pay for ChatGPT Plus, is my data private?",
      answer: "Not automatically. Paid personal plans have the same training setting as the free plan, and it starts switched on. Business and Enterprise workspaces are the tiers that say they keep your data out of model training by default.",
    },
    {
      question: "Does deleting a chat remove it everywhere?",
      answer: "Mostly, with delays and exceptions. Vendors remove deleted chats from their systems over a period of weeks, but memories created from that chat, share links, data already used for training and chats already read by reviewers can outlast it.",
    },
    {
      question: "Are temporary or incognito chats completely private?",
      answer: "They are more private, not invisible. They skip your history, memory and training, but the vendor still keeps them for a short safety window.",
    },
    {
      question: "What is shadow AI?",
      answer: "Shadow AI is any AI tool used for work without the business knowing or approving it, most often a personal chatbot account. The answer is rarely a ban; it is an approved tool that is easier to use than the unapproved one, plus a short rule about data.",
    },
  ],

  sourceIds: [
    "unimelb-kpmg-trust-ai-2025",
    "nsw-ra-chatgpt-breach-2025",
    "engadget-meta-ai-discover-2025",
    "openai-shared-links-2026",
    "google-gemini-privacy-hub-2026",
    "meta-messenger-ai-sharing-2026",
    "openai-data-controls-2026",
    "openai-memory-2026",
    "anthropic-memory-2026",
    "anthropic-commercial-training-2026",
    "openai-enterprise-privacy-2026",
    "google-workspace-genai-privacy-2026",
    "microsoft-copilot-edp-2026",
    "anthropic-consumer-training-2026",
    "anthropic-consumer-terms-2025",
    "ftc-ai-terms-changes-2024",
    "google-gemini-activity-2026",
    "openai-delete-chats-2026",
    "anthropic-consumer-retention-2026",
    "ibm-think-shadow-ai-2026",
    "nca-oh-behave-2025",
  ],

  related: {
    threats: ["prompt-injection-and-ai-agent-hijacking", "ai-powered-phishing-and-bec"],
    guides: ["lock-down-your-ai-assistants", "one-page-ai-use-rule-for-your-team", "digital-hygiene-for-your-business"],
    explainers: ["who-owns-your-ai-conversations"],
    controls: ["ai-acceptable-use", "data-classification", "vendor-risk-management", "multi-factor-authentication", "employee-offboarding"],
    glossary: ["shadow-ai", "model-memory", "generative-ai"],
    toolkit: [],
  },
}
