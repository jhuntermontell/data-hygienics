export default {
  kind: "threat",
  slug: "prompt-injection-and-ai-agent-hijacking",
  title: "Prompt injection and AI agent hijacking",
  metaTitle: "Prompt Injection and AI Agent Hijacking | Data Hygienics",
  metaDescription: "Before you let an AI read your email or browse for you: how hidden instructions hijack AI assistants, real cases, and the settings that keep you in charge.",
  audience: ["home", "business"],
  pillars: ["threats"],
  tldr: "When an AI assistant reads your email, files or web pages, it can mistake text written by a stranger for instructions from you. That is prompt injection, and when the assistant can also send, buy or delete things, an attacker can steer it. The UK's National Cyber Security Centre (NCSC) says it may never be fully fixed,[^ncsc-prompt-injection-2025] so the safe move is to limit what your AI can reach and keep yourself in the approval loop.",
  datePublished: "2026-10-23",
  lastReviewed: "2026-10",
  status: "published",
  featured: false,

  severity: "emerging",
  aiRole: "ai-targeted",

  whatItIs: "Prompt injection means hiding instructions inside content an AI will read, such as an email, a web page, a calendar invite or a shared document. Today's AI models do not reliably separate the instructions you give them from the text they are only supposed to read, so a planted line like \"send the latest invoices to this address\" can get followed.[^ncsc-prompt-injection-2025] Agent hijacking is the next step: when the AI can take actions for you, it is an AI agent (also called agentic AI), and injected instructions make it act for the attacker instead.[^nist-caisi-agent-hijacking-2025]",

  howItLooks: [
    {
      audience: "business",
      title: "The email your assistant read for you",
      scenario: "In June 2025, Microsoft disclosed a critical flaw in Microsoft 365 Copilot that let an outsider pull information out through the assistant; the researchers who found it called it EchoLeak.[^nvd-cve-2025-32711][^bleepingcomputer-echoleak-2025] They showed that one crafted email, written to look like an ordinary business document, could carry hidden instructions, with no click needed from anyone.[^bleepingcomputer-echoleak-2025] When a staff member later asked Copilot a related question, Copilot pulled that email in, followed its instructions and slipped company data into a link that sent it to the attacker.[^bleepingcomputer-echoleak-2025] Microsoft fixed it on its own servers and said it saw no sign of real-world use.[^bleepingcomputer-echoleak-2025] The lesson for a small office: an assistant connected to your mailbox treats every incoming email as text it might obey.",
    },
    {
      audience: "home",
      title: "The page summary that handed over an account",
      scenario: "In August 2025, researchers at Brave showed how the AI in Perplexity's Comet browser could be hijacked by a comment on a Reddit page.[^brave-comet-prompt-injection-2025] The comment hid instructions behind a spoiler tag. When the user asked the browser to summarize the page, the AI went to the user's account page, copied their email address, triggered a one-time login code, read that code from the user's open Gmail tab and posted both in a public reply.[^brave-comet-prompt-injection-2025] Perplexity shipped fixes, though Brave said the first one was incomplete.[^brave-comet-prompt-injection-2025] Brave makes a competing browser, but OpenAI describes the same risk for its own browser agent, including a test where a planted email made the agent send a resignation letter to the user's CEO.[^openai-atlas-prompt-injection-2025]",
    },
  ],

  howItGetsIn: [
    "Emails and attachments that an assistant reads, sorts or summarizes for you.",
    "Web pages an AI browser or agent visits, including comments, reviews and text styled to be invisible to you.",
    "Calendar invites, shared documents and forum or social posts, all of which OpenAI lists as routes for untrusted instructions.[^openai-atlas-prompt-injection-2025]",
    "Connectors, plugins, skills and other add-ons that give an AI new tools, new data or new instructions.",
    "Links that hand over the agent itself: in early 2026 the open-source personal agent OpenClaw fixed a flaw where one malicious link could leak its access token (the digital key it uses to act for you) and let an attacker change its settings and run commands.[^nvd-cve-2026-25253][^openclaw-ghsa-2026]",
    "Coding assistants that read files from projects and websites: in August 2025 Microsoft patched an injection flaw in GitHub Copilot and Visual Studio that could let an attacker run code on a developer's computer.[^nvd-cve-2025-53773]",
    "Broad requests such as \"go through my inbox and handle whatever needs doing\", which give hidden instructions the most room to work.[^openai-atlas-prompt-injection-2025]",
  ],

  whatStopsIt: [
    {
      title: "Assume the AI can be fooled, and limit the damage",
      detail: "Security standards bodies, including the open security community OWASP and the US National Institute of Standards and Technology (NIST), treat prompt injection as a built-in weakness, not a bug one patch removes.[^owasp-llm01-prompt-injection-2025][^nist-ai-100-2-2025] Vendor defenses help but aren't airtight: in Anthropic's late-2025 tests, its best-defended browser agent was still fooled by 1.4% of attacks.[^anthropic-browser-prompt-injection-2025] So plan as if an instruction will slip past the AI, and make sure it can't do much when it does.",
      audience: ["home", "business"],
      controlSlug: "ai-acceptable-use",
    },
    {
      title: "Give the AI the least access that does the job",
      detail: "Government guidance on AI agents says to start with low-risk tasks and avoid broad access to sensitive data or critical systems.[^cisa-agentic-ai-guide-2026] The NCSC puts it simply: the minimum access, for the shortest time.[^ncsc-agentic-ai-2026] If an assistant only needs to read your calendar, do not also give it your inbox and your bank.",
      audience: ["home", "business"],
      controlSlug: "access-control-policy",
    },
    {
      title: "Keep \"ask before acting\" switched on",
      detail: "ChatGPT lets you choose Always ask or Allow read actions for connected apps, and describes Allow all actions as elevated risk.[^openai-app-permissions-2026] On Claude Team and Enterprise plans, owners can set each connector tool to Always allow, Needs approval or Blocked.[^anthropic-connectors-2026] Set anything that sends, shares, buys or deletes to require your approval, and actually read the approval card before you click.",
      audience: ["home", "business"],
      guideSlug: "lock-down-your-ai-assistants",
    },
    {
      title: "Give narrow instructions",
      detail: "Ask for a specific job (\"summarize the three unread emails from our accountant\") rather than open-ended authority over your inbox. OpenAI recommends exactly this for its browser agent, because wide latitude makes hidden instructions easier to slip in.[^openai-atlas-prompt-injection-2025]",
      audience: ["home", "business"],
    },
    {
      title: "Keep agents away from logged-in accounts they don't need",
      detail: "OpenAI recommends logged-out mode for its browser agent when a task does not need your accounts.[^openai-atlas-prompt-injection-2025] Brave recommends keeping AI browsing separate from your everyday browsing.[^brave-comet-prompt-injection-2025] A separate browser profile with no saved logins works the same way.",
      audience: ["home", "business"],
    },
    {
      title: "Never let an AI-relayed request move money",
      detail: "Treat any payment request, bank-detail change or invoice that reached you through an AI summary the way you would treat a suspicious email. Confirm it by calling a number you already had on file.",
      audience: ["home", "business"],
      controlSlug: "out-of-band-verification",
      guideSlug: "two-channel-verification-for-payments",
    },
    {
      title: "Approve AI connections like you approve new vendors",
      detail: "Connecting an AI to company email, files or finance systems should need the owner's sign-off, a named business account and a reason. Anthropic's own help pages advise connecting only services you trust and need.[^anthropic-connectors-2026]",
      audience: ["business"],
      controlSlug: "ai-acceptable-use",
      guideSlug: "one-page-ai-use-rule-for-your-team",
    },
    {
      title: "Remove add-ons and connectors you don't use",
      detail: "Every connector is another door: in IBM's 2026 study, compromised APIs (the connections that let one app talk to another), applications or plug-ins were behind 27% of breaches targeting AI systems.[^ibm-breach-cost-2026-release] Review the list every few months and disconnect anything idle; disconnecting stops future access to that account.[^openai-app-accounts-2026]",
      audience: ["home", "business"],
      controlSlug: "vendor-risk-management",
    },
    {
      title: "Keep AI apps and extensions updated",
      detail: "Some fixes happen on the vendor's servers, but others, like the OpenClaw and GitHub Copilot fixes, only protect you once you install the update.[^openclaw-ghsa-2026][^nvd-cve-2025-53773]",
      audience: ["home", "business"],
      controlSlug: "patch-management",
    },
    {
      title: "Keep logs where your tools allow it",
      detail: "The NCSC recommends logging what goes into and comes out of AI systems, including tool use, so you can spot probing and reconstruct what happened.[^ncsc-prompt-injection-2025] If your business AI plan offers audit or activity logs, turn them on and know where to find them.",
      audience: ["business"],
    },
  ],

  ifItHappens: [
    {
      step: "Stop the agent and disconnect it",
      detail: "End the task, then disconnect the AI from your email, files and other accounts in the assistant's connector settings. Also remove its access from the security or third-party access page of the connected Google or Microsoft account.",
      audience: ["home", "business"],
    },
    {
      step: "Check what it did",
      detail: "Look at sent mail, new forwarding rules, deleted items, shared files, calendar changes and purchases since the agent last ran. Forwarding rules and sharing changes are easy to miss and keep leaking after the agent stops.",
      audience: ["home", "business"],
    },
    {
      step: "Secure the affected accounts",
      detail: "Change passwords, sign out all other sessions and turn on multi-factor authentication (MFA) for every account the agent could reach.",
      audience: ["home", "business"],
    },
    {
      step: "If money moved, call your bank now",
      detail: "Ask the bank to stop or recall the payment, then report it to the FBI's Internet Crime Complaint Center at ic3.gov and to the FTC at ReportFraud.ftc.gov. Speed matters more than paperwork here.",
      audience: ["home", "business"],
    },
    {
      step: "Run your incident plan",
      detail: "Treat it as a possible data breach. If the agent could read client or staff data, use the AI data exposure playbook in our Incident Response Planner (one of our paid business tools) and talk to your IT provider about what was exposed.",
      audience: ["business"],
    },
    {
      step: "Tell the vendor",
      detail: "Report the behavior through the AI vendor's security or support channel with dates, screenshots and the content that triggered it. Vendors fix these issues faster when they see real examples.",
      audience: ["home", "business"],
    },
  ],

  stats: [
    {
      figure: "$5.89 million",
      context: "was the average cost of prompt injection incidents among organizations in IBM's 2026 study that reported a breach involving their AI models or apps.",
      sourceId: "ibm-xforce-codb-ai-2026",
      locator: "Section 'Attacks on AI hit familiar underbellies'",
    },
    {
      figure: "92%",
      context: "of organizations in IBM's 2026 study that reported an AI-related breach lacked proper AI access controls.",
      sourceId: "ibm-xforce-codb-ai-2026",
      locator: "Section 'Attacks on AI hit familiar underbellies'",
    },
    {
      figure: "27%",
      context: "of breaches targeting AI models or apps in IBM's 2026 study traced to compromised APIs (the connections that let one app talk to another), applications or plug-ins, tied with cloud misconfigurations as the top cause.",
      sourceId: "ibm-breach-cost-2026-release",
      locator: "Press release, 'Other Key Findings: AI's Weakest Link'",
    },
    {
      figure: "81%",
      context: "attack success rate when US and UK government testers playing the attacker designed new attacks against a late-2024 AI agent, up from 11% for the best existing attack.",
      sourceId: "nist-caisi-agent-hijacking-2025",
      locator: "Results on held-out Workspace tasks (January 2025 blog)",
    },
    {
      figure: "1.4%",
      context: "was the attack success rate Anthropic measured for its best-defended browser agent in late 2025, which the company still called a meaningful risk.",
      sourceId: "anthropic-browser-prompt-injection-2025",
      locator: "Attack success rate chart (Opus 4.5, improved safeguards)",
    },
  ],

  faqs: [
    {
      question: "Is it safe to let an AI read my email?",
      answer: "Reading and summarizing is lower risk than acting, but it is not risk-free, because a planted email can still steer what the assistant tells you or try to leak data. Keep the assistant read-only where you can, require approval for anything it sends, and double-check any summary that asks you to pay, click or share.",
    },
    {
      question: "Can't the AI companies just fix this?",
      answer: "They are making progress, but the UK's NCSC and the vendors themselves describe prompt injection as a long-term problem that may never be fully solved. Treat vendor defenses as one layer, and your own limits on access and approvals as another.",
    },
    {
      question: "Is this the same as a computer virus?",
      answer: "No. Nothing is installed on your device; the attack is ordinary text that the AI misreads as an instruction. That is why antivirus software and spam filters often miss it.",
    },
    {
      question: "How would I know an assistant was hijacked?",
      answer: "Watch for actions you did not ask for: sent messages you don't recognize, new forwarding rules, files shared with strangers, purchases, or an assistant suddenly asking for permissions or logins it never needed before.",
    },
    {
      question: "Which is riskier, an AI browser or an AI connected to my email?",
      answer: "Both carry the same core risk. What matters most is what the AI can reach and what it can do without asking you, so judge each tool by its access and its approval settings.",
    },
  ],

  sourceIds: [
    "ncsc-prompt-injection-2025",
    "nist-caisi-agent-hijacking-2025",
    "nvd-cve-2025-32711",
    "bleepingcomputer-echoleak-2025",
    "brave-comet-prompt-injection-2025",
    "openai-atlas-prompt-injection-2025",
    "nvd-cve-2026-25253",
    "openclaw-ghsa-2026",
    "nvd-cve-2025-53773",
    "cisa-agentic-ai-guide-2026",
    "ncsc-agentic-ai-2026",
    "openai-app-permissions-2026",
    "anthropic-connectors-2026",
    "openai-app-accounts-2026",
    "ibm-xforce-codb-ai-2026",
    "ibm-breach-cost-2026-release",
    "anthropic-browser-prompt-injection-2025",
    "owasp-llm01-prompt-injection-2025",
    "nist-ai-100-2-2025",
  ],

  related: {
    threats: ["ai-chatbot-data-leaks", "ai-powered-phishing-and-bec"],
    guides: ["lock-down-your-ai-assistants", "two-channel-verification-for-payments", "one-page-ai-use-rule-for-your-team"],
    explainers: [],
    controls: ["ai-acceptable-use", "out-of-band-verification", "access-control-policy", "vendor-risk-management", "patch-management"],
    glossary: ["prompt-injection", "ai-agent", "jailbreak"],
    toolkit: [],
  },
}
