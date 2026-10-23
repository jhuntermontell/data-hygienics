// AI Acceptable Use Policy generator data.
//
// Saved policies store { selections: { [section.id]: option.id } } in
// generated_policies.policy_data (see app/tools/policies/[slug]/page.js), so
// never rename or remove a section id or an option id. New sections are safe:
// the wizard fills them with the Standard option. Only [COMPANY_NAME] is
// substituted in option text, so do not add other placeholders. The PDF splits
// option text into paragraphs on blank lines and has no tables, so the
// inventory appendix puts each row in its own paragraph.
//
// How the sections line up with the AI Use and Data Handling assessment
// questions (lib/questions/shared/ai-use.js):
//   ai_tool_inventory           -> use_standards (approval, inventory check,
//                                  renewal check, offboarding) and tool_inventory
//                                  (tool, plan or account type, approved data
//                                  levels, owner, renewal date)
//   ai_use_policy               -> purpose, principles, violations (written rule,
//                                  training at hire and yearly, acknowledgment,
//                                  enforcement)
//   ai_data_handling            -> definitions (personal vs business accounts),
//                                  data_handling (Low/Moderate/High levels, no
//                                  personal accounts for Moderate or High data,
//                                  never list, training settings, memory, share
//                                  links, ratings, temporary chats), prohibited
//   ai_vendor_features          -> embedded_ai (review before enabling) and
//                                  agents (connected apps, least access, approval
//                                  prompts, no AI in payments, prompt injection)
//   ai_voice_video_verification -> verification (callback rule)
// Also covered: human review of outputs (ethics), AI incident reporting
// (incidents: no-blame self-reporting, then the IR Planner playbooks
// ai_data_exposure "AI Tool Data Exposure" and deepfake_fraud "Deepfake or
// Voice-Clone Fraud" in lib/ir-plan/playbooks.js).
//
// Anchors, checked 2026-10-23: NIST AI RMF 1.0 (Jan 2023) and the Generative
// AI Profile NIST AI 600-1 (Jul 2024), https://www.nist.gov/itl/ai-risk-management-framework;
// ISO/IEC 42001:2023, https://www.iso.org/standard/42001; FBI PSA
// I-120324-PSA (callback on a number you look up, secret word); FinCEN
// FIN-2024-Alert004 (executive impersonation, channel-switch red flag);
// HIPAA 45 CFR 164.502(e) (business associate assurances before sharing PHI).
// Source ids below are in lib/content/sources/ai-data.js.
//   Agents: the joint guide on careful adoption of agentic AI services (ASD's
//   ACSC with CISA, NSA, Canada's Cyber Centre, NCSC-NZ and NCSC-UK, May 2026):
//   cisa-agentic-ai-guide-2026, ncsc-agentic-ai-2026. Minimum access for the
//   shortest time, low-risk pilots first, a person can stop it. CISA's resource
//   page for the guide now says "SI" for AI; the policy text says AI.
//   Approval prompt labels: openai-app-permissions-2026 ("Always ask"),
//   anthropic-connectors-2026 ("Needs approval").
//   Prompt injection has no complete fix: ncsc-prompt-injection-2025,
//   owasp-llm01-prompt-injection-2025, openai-atlas-prompt-injection-2025.
//   Business plans exclude content from training by default, with a ratings
//   and feedback exception: openai-enterprise-privacy-2026,
//   anthropic-commercial-training-2026, openai-data-controls-2026 (personal
//   Free, Plus and Pro train by default; thumbs up/down can send the chat for
//   training; temporary chats kept up to 30 days), anthropic-consumer-training-2026
//   (Free, Pro and Max are consumer plans).
//   Memory survives chat deletion: openai-memory-2026, anthropic-memory-2026.
//   Share links: openai-shared-links-2026 (personal links open to anyone with
//   the link), google-gemini-activity-2026 (deleting a chat keeps its link).
//   Re-check terms at renewal: ftc-ai-terms-changes-2024.
export const POLICY_DATA = {
  slug: "ai-acceptable-use-policy",
  name: "AI Acceptable Use Policy",
  sections: [
    {
      id: "purpose",
      title: "Purpose & Introduction",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "[COMPANY_NAME] uses AI tools in its everyday work. This policy explains how to use them safely: which tools and accounts are approved, what information may go into them, what AI tools may and may not do on their own, how to check their work, and how to handle requests that might come from a cloned voice or a faked video.\n\nIt applies to everyone who uses AI tools for [COMPANY_NAME] work, on any device and any account."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] supports the use of artificial intelligence (AI) tools to improve productivity, quality, and service, as long as the risks are managed. This AI Acceptable Use Policy sets the rules for choosing AI tools, protecting the information we put into them, limiting what AI agents and connected apps can do, reviewing what AI tools produce, and verifying requests now that voices, faces, and writing styles can be convincingly faked.\n\nEveryone covered by this policy is expected to use good judgment, follow these rules, and ask the policy owner when something is unclear. The policy owner reviews this policy at least once a year, as described in the Training, Acknowledgment & Enforcement section.\n\nThis policy applies to all employees, contractors, temporary workers, and third parties who use AI tools in connection with [COMPANY_NAME] business."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "[COMPANY_NAME] recognizes that artificial intelligence, including generative AI and AI agents that can act on a user's behalf, is both a significant opportunity and a material risk. This policy establishes how [COMPANY_NAME] governs the selection, use, and oversight of AI tools across all business functions.\n\nThe objectives of this policy are to: (1) enable productive use of AI while protecting confidential, personal, and regulated information; (2) keep a current inventory of the AI tools, accounts, and features in use; (3) require human review of AI outputs that affect clients, employees, or the public; (4) limit AI agents and connected apps to the access they need, keep a person in control of their actions, and keep AI out of payments; (5) protect payments, credentials, and sensitive data from AI-enabled impersonation, including cloned voices and synthetic video; and (6) assign clear accountability for AI use and AI-related incidents.\n\nThis policy is informed by the NIST AI Risk Management Framework (AI RMF 1.0, 2023) and its Generative AI Profile (NIST AI 600-1, 2024), and follows the management-system approach of ISO/IEC 42001:2023: set a policy, assign responsibilities, assess risks, and improve continually. Its rules for AI agents follow the joint guidance on careful adoption of agentic AI services published in May 2026 by CISA, the UK National Cyber Security Centre (NCSC), and partner agencies.\n\nIt applies to all employees, contractors, temporary staff, interns, board members, and any third party who uses AI tools in connection with [COMPANY_NAME] operations, whether the tools are provided by [COMPANY_NAME] or accessed independently."
        }
      ]
    },
    {
      id: "scope",
      title: "Scope",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "This policy covers any AI tool used for [COMPANY_NAME] work. That includes chatbots such as ChatGPT, Claude, and Gemini; AI features built into software we already use, such as email assistants and meeting summaries; AI meeting note-takers; AI browser extensions; image, voice, and video generators; coding assistants; AI tools connected to email, files, or calendars; and AI agents that can take actions such as sending email or making purchases.\n\nIt applies whether the tool is provided by [COMPANY_NAME] or accessed through a personal account, on a company or a personal device."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "This policy governs all artificial intelligence systems, tools, and services used in connection with [COMPANY_NAME] business, including: standalone AI assistants (for example ChatGPT, Claude, Gemini, and Microsoft Copilot); AI features embedded in existing business applications such as email, documents, CRM, accounting, and video meeting software; AI meeting recorders and note-takers; AI browser extensions and plug-ins; connected apps that link an AI tool to email, files, calendars, or finance systems; AI agents that can take actions on a user's behalf; coding assistants; image, audio, voice, and video generation tools; and any custom or third-party AI model or API.\n\nThis policy applies whether the AI tool is procured and managed by [COMPANY_NAME], accessed through a personal account for business purposes, switched on inside an application we already use, or used on a free or trial plan, and regardless of the device used.\n\nIt also covers how [COMPANY_NAME] responds to AI used against us, such as requests that arrive through a cloned voice, a faked video call, or an AI-written message impersonating someone we trust."
        }
      ]
    },
    {
      id: "definitions",
      title: "Definitions",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "AI tool: Any software that uses artificial intelligence to generate content, answer questions, make recommendations, or take actions. Generative AI: AI that creates text, images, audio, video, or code from a prompt. AI agent: An AI tool that can take actions for you, such as sending email, editing files, or making purchases. Connected app: A link that lets an AI tool read from or act in another system, such as email, files, or a calendar.\n\nPersonal AI account: Any AI account that is not under a [COMPANY_NAME] business agreement, free or paid, such as a ChatGPT Plus or Claude Pro subscription someone pays for themselves. Its terms may let the provider keep your conversations or use them to train its models. Business AI account: A seat on a business or enterprise plan that [COMPANY_NAME] buys under a company agreement and manages. Business plans exclude our content from model training by default, but rating a response (thumbs up or down) or sending feedback can let the vendor keep that conversation and use it to improve its models.\n\nPrompt injection: Instructions hidden in an email, document, or web page that try to make an AI tool do something its user did not ask for. Deepfake: Audio, video, or images made or altered by AI to look or sound like a real person. Low, Moderate, and High data: The sensitivity levels set out in the Data Handling section of this policy."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "Artificial Intelligence (AI): Technology that performs tasks that typically require human judgment, such as understanding language, recognizing patterns, generating content, or supporting decisions. Generative AI: AI that creates new text, images, code, audio, or video from prompts and training data.\n\nAI agent: An AI system that can take actions on a user's behalf, such as reading and sending email, editing files, browsing websites, or making purchases, with limited step-by-step human direction.\n\nConnected app: An integration, connector, plug-in, or extension that lets an AI tool read data from, or take actions in, another system such as email, file storage, calendars, a CRM, or accounting software.\n\nPersonal AI account: Any AI account that is not provided under a [COMPANY_NAME] business agreement, including free accounts and paid individual plans (for example, a ChatGPT Plus or Claude Pro subscription an employee pays for). Their terms may allow the provider to retain conversations, have people review them, or use them to train its models unless the user opts out. Personal AI accounts may be used for [COMPANY_NAME] work only for Low data, and only with the policy owner's approval.\n\nBusiness AI account: A seat on an AI service that [COMPANY_NAME] buys under a business or enterprise agreement and administers. On these plans the vendor excludes our content from model training by default and gives administrators control over users, retention, and features. There are exceptions: on some business plans, rating a response (thumbs up or down) or sending feedback or a bug report lets the vendor keep that conversation and use it to improve its models. These terms must be confirmed in the vendor's current documentation before approval and at each renewal.\n\nEmbedded AI: AI capabilities inside software [COMPANY_NAME] already uses, such as email assistants, meeting summaries, document drafting, and search. These may be switched on by the vendor or by individual users.\n\nPrompt injection: Instructions hidden in content an AI tool reads, such as an email, document, web page, or calendar invite, that try to make the tool do something its user did not ask for, such as revealing data or sending a message.\n\nDeepfake: Audio, video, or images generated or altered by AI to make it appear that a real person said or did something they did not.\n\nLow, Moderate, and High data: The three sensitivity levels defined in the Data Handling section of this policy.\n\nApproved AI tool: An AI tool, feature, or connected app on the [COMPANY_NAME] approved AI tools list (the Approved AI Tools Inventory at the end of this policy), for the purposes and data levels recorded there."
        }
      ]
    },
    {
      id: "principles",
      title: "Guiding Principles",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "All AI use at [COMPANY_NAME] follows five principles. Lawful: we comply with all applicable laws and regulations. Protective: we keep personal, client, and confidential information out of tools that are not approved for it. Accountable: a named person is responsible for every AI output we use. Honest: we are open about AI use where it matters and never use AI to deceive. Verified: we confirm requests for money, access, or sensitive data through a channel we trust, never by voice or video alone."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] adopts the following guiding principles for all AI use:\n\nLawful: AI use must comply with applicable federal, state, and local laws and industry regulations. Users are responsible for understanding the requirements that apply to their role.\n\nProtective: Information entrusted to [COMPANY_NAME] by clients, employees, and partners comes first. Convenience never justifies putting it into a tool that is not approved for it.\n\nAccountable: AI supports human work; it does not replace human responsibility. The person who uses an AI output is accountable for it as if they had produced it themselves.\n\nFair and honest: AI must not be used to deceive, to discriminate, or to impersonate real people. Outputs are checked for bias and error before they affect anyone.\n\nVerified: Because voices, faces, and writing styles can now be convincingly faked, requests involving money, access, or sensitive information are confirmed through a trusted channel before anyone acts on them."
        }
      ]
    },
    {
      id: "use_standards",
      title: "Approved Tools, Inventory & Offboarding",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "[COMPANY_NAME] keeps a list of approved AI tools in the Approved AI Tools Inventory at the end of this policy: each tool, its plan or account type, the data levels it may handle, who owns it, and when it renews. Use only approved tools, signed in with your work account, and only for the purposes listed.\n\nAsk the policy owner before you use a new AI tool, switch on a new AI feature in software we already use, or connect AI to a company account. At least twice a year the policy owner asks the team which AI tools they actually use, so the list stays accurate. Telling us about a tool you already use is always welcome.\n\nBefore each renewal, the policy owner re-checks the vendor's data terms. When an employee or contractor leaves, their AI seats are removed and any AI connections they set up are disconnected by their last day."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] maintains an approved AI tools list, kept in the Approved AI Tools Inventory at the end of this policy. For each AI tool, feature, connected app, or agent it records the tool and vendor, the plan or account type (business or personal), the data levels it is approved for (Low, Moderate, or High), who may use it and for what, the other systems it connects to, the person responsible for it, and its renewal date.\n\nEmployees may use approved tools for approved purposes without further authorization, signed in with a [COMPANY_NAME] business account wherever one is provided. Typical approved purposes include drafting and editing, summarizing material within the tool's approved data levels, brainstorming, research support, coding assistance, and translation.\n\nNew tools: Any AI tool, plan, browser extension, plug-in, meeting bot, connected app, or agent that is not on the list requires written approval from the policy owner before it is used with [COMPANY_NAME] data or accounts. Requests should state the tool, the intended use, the data level involved, and whether the vendor's terms allow it to retain or train on that data.\n\nInventory check: At least twice a year, the policy owner checks the list against what is actually in use by asking each team which AI tools and features they use, reviewing card statements and expense reports for AI subscriptions, reviewing the AI apps connected to our email and file accounts, checking which of our existing applications have added AI features, and removing tools and connections that are no longer used. Disclosing an unlisted tool is encouraged; the goal is an accurate inventory, not blame.\n\nRenewal check: Vendors can change their data terms. Before each renewal, and whenever a vendor announces a change to its terms, the policy owner re-reads the vendor's current terms on model training, retention, human review, and sharing, confirms that the admin settings still match this policy, and records the date checked in the inventory. A tool whose terms no longer meet this policy is restricted or removed.\n\nOffboarding: The policy owner assigns business AI seats. When an employee or contractor leaves or changes role, their AI seats are removed, and any connected apps, agents, API keys, and automations they set up are disconnected or reassigned, by their last day and as part of [COMPANY_NAME]'s normal offboarding. Work the business still needs, such as shared projects or custom assistants, is transferred to another account first."
        }
      ]
    },
    {
      id: "data_handling",
      title: "Data Handling: What May Go Into AI Tools",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "[COMPANY_NAME] uses three data levels. High: client, patient, or customer personal details; health information; Social Security, driver's license, or passport numbers; confidential client files or anything covered by a confidentiality agreement; and employee personnel or payroll records. High data goes only into a business AI account the policy owner has approved in writing for that data and that task. Moderate: internal business information such as plans, pricing, and internal documents. Moderate data goes only into approved business AI accounts. Low: public information, which is fine in any approved tool.\n\nNever use a personal AI account, free or paid, for Moderate or High data. Never put passwords, login or MFA codes, API keys, or bank or card numbers into any AI tool.\n\nKeep memory off unless the policy owner has approved it. Do not create share links to conversations with Moderate or High data, and do not rate those conversations with a thumbs up or down, because some vendors keep rated conversations to improve their models. Temporary or incognito chats are still kept by the provider for a while, so the same rules apply. Share only what the task needs, and remove names where you can. When in doubt, leave it out and ask."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] information is sorted into three sensitivity levels for AI use. The level decides which AI tools and accounts the information may go into.\n\nHigh: Client, patient, and customer personal information; health, medical, and insurance claim information; Social Security, driver's license, passport, and other government ID numbers; client confidential information, privileged legal material, and anything covered by a confidentiality agreement; employee personnel, payroll, and benefits records; and any data a client contract says may not be shared with third parties. High data may be used only in a business AI account that the policy owner has approved in writing for that data and that task, after reviewing the vendor's terms and contract. Protected health information (PHI) may only be used with an AI tool covered by a signed business associate agreement with [COMPANY_NAME].\n\nModerate: Non-public business information, such as internal documents, plans, pricing, financial summaries, and operational data. Moderate data may be used only in approved business AI accounts.\n\nLow: Information [COMPANY_NAME] has already published, and general knowledge. Low data may be used in any approved AI tool.\n\nNo personal AI accounts for Moderate or High data: Moderate and High data must never be entered into, uploaded to, or connected to a personal AI account, free or paid, even with model training turned off. A personal account approved for limited use may hold Low data only.\n\nNever, in any AI tool: Passwords, login and MFA codes, recovery codes, API keys, access tokens, encryption keys, and full bank account or payment card numbers are never entered into or uploaded to any AI tool, approved or not.\n\nTraining settings: In every approved tool, settings that let the provider use our content to train or improve its models are turned off. The policy owner confirms they are still off after major product updates and at each renewal.\n\nMemory: Many AI tools can remember details from earlier conversations and connected apps and reuse them later. Memory stays off for work use unless the policy owner has approved it for that tool. Deleting a chat does not always delete what the tool remembered from it, so saved memories are reviewed and cleared whenever Moderate or High data may have reached them.\n\nShare links: Conversations containing Moderate or High data are never shared by link. A link created from a personal account can usually be opened by anyone who has it, and deleting a chat does not always remove its link. Share links that are no longer needed are deleted.\n\nRatings and feedback: Users do not rate responses (thumbs up or down) or send feedback or bug reports from conversations that contain Moderate or High data. Some vendors keep a rated conversation and may use it to improve their models, even on business plans or when training is otherwise turned off. Where the business plan allows, the policy owner turns rating off.\n\nTemporary chats: Temporary, incognito, or history-off chats are not erased when they close. Providers keep them for a period, up to 30 days for some, so the same data rules apply to them.\n\nMinimum necessary: Share only what the task needs. Remove names and identifiers where possible, and use summaries or made-up examples instead of real records. When in doubt, leave it out and ask the policy owner."
        }
      ]
    },
    {
      id: "prohibited",
      title: "Prohibited Uses",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "The following are prohibited at [COMPANY_NAME]: Putting data into AI tools against the Data Handling section, including any Moderate or High data in a personal AI account. Using AI to make final decisions about hiring, firing, pay, credit, or similar matters without a person's review. Using AI to create fake audio, video, or images of real people, including coworkers and clients, without their consent. Connecting an unapproved AI tool, extension, or agent to company email, files, calendars, or finance systems. Letting AI send payments, change bank details, or approve invoices. Letting an AI agent delete records or message people outside the company without a person approving each action, or switching off its approval prompts. Using AI to get around security controls, or to create misleading, harassing, or fraudulent content."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "The following activities are prohibited when using AI tools in connection with [COMPANY_NAME] business:\n\nData exposure: Entering data into an AI tool contrary to the Data Handling section, including any Moderate or High data in a personal AI account, or any password, key, or bank or card number in any AI tool.\n\nUnreviewed decisions about people: Using AI as the sole basis for decisions that materially affect individuals, including hiring, discipline, termination, compensation, credit, insurance, or legal outcomes.\n\nImpersonation: Creating or using AI-generated voice, video, images, or writing that imitates a real person, including colleagues, clients, or public figures, without that person's documented consent and a legitimate business purpose. Using AI to impersonate anyone in order to obtain money, access, or information is grounds for termination and may be reported to law enforcement.\n\nUnapproved connections: Connecting an AI tool, browser extension, plug-in, meeting bot, connected app, or agent to [COMPANY_NAME] email, files, calendars, finance systems, or other systems without the policy owner's approval.\n\nAI handling money: Allowing any AI tool or agent to send payments, add or change payees or bank details, or approve invoices.\n\nUnsupervised actions: Allowing an AI agent to delete or alter records, change security settings, share data, or send external communications without a person reviewing and approving each action, or switching off a tool's approval prompts to avoid that review.\n\nSecurity circumvention: Using AI tools to bypass, test, or undermine [COMPANY_NAME] security controls, monitoring, or access restrictions without written authorization.\n\nHarmful content: Using AI to generate content that is discriminatory, harassing, defamatory, deceptive, or in violation of any [COMPANY_NAME] policy."
        }
      ]
    },
    {
      id: "embedded_ai",
      title: "AI Features in Existing Software",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Many programs we already use are adding AI features, such as email assistants, meeting summaries, and smart search. Before anyone switches on a new AI feature, plug-in, or connected app, the policy owner checks what data it can see, whether the vendor keeps or trains on that data, and how to turn it off. Approved features are added to the approved tools list.\n\nAI meeting recorders and note-takers may only be used when everyone in the meeting has been told. Any AI feature that can connect to other systems or take actions also follows the AI Agents & Connected Apps section."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "AI features added to software [COMPANY_NAME] already uses are treated as new AI tools.\n\nReview before enabling: Before an AI feature, connected app, plug-in, meeting bot, or agent is switched on, the policy owner (with IT support where needed) confirms: what data it can access; whether the vendor stores, shares, or trains on that data, and for how long; whether people at the vendor may review it; what administrative controls exist to limit, log, or disable it; and whether it is covered by our existing contract and, where relevant, a business associate or data processing agreement. Approved features are recorded on the approved AI tools list. Where the software allows it, new AI features stay off until reviewed.\n\nMeeting recorders and note-takers: AI recording or transcription is used only when all participants have been told, and not for meetings involving legal, medical, or personnel matters unless approved. Recording laws vary by state, and some require every participant's consent.\n\nFeatures that act or connect: AI features that can read from or act in other systems, such as an email assistant that can send replies or a search feature that reaches across all company files, also follow the AI Agents & Connected Apps section."
        }
      ]
    },
    {
      id: "agents",
      title: "AI Agents & Connected Apps",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Some AI tools can connect to other systems or act for you: reading and sending email, opening files, booking meetings, or filling in web forms. These rules follow the May 2026 guidance on agentic AI from CISA, the UK National Cyber Security Centre, and partner agencies.\n\nAsk the policy owner before connecting any AI tool to company email, files, calendars, or finance systems. Give it only the access the task needs, for only as long as it needs it, and disconnect it when you are done. Keep the settings that make it ask before acting switched on. AI never sends payments, changes bank details, or approves invoices; people do that, using the callback rule.\n\nTreat instructions found inside emails, documents, or web pages as untrusted, even when an AI tool repeats them to you. If an AI tool suggests you click a link, call a number, send a file, or pay someone because of something it read, check with the sender through a channel you already trust. Report any AI tool that does something no one asked it to do."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "AI agents and connected apps can read from, or act in, other systems: for example, an assistant connected to email, files, or calendars, a browser agent that fills in forms, or an automation that updates records. They act with whatever access they are given, so [COMPANY_NAME] applies the rules below. These rules follow the joint guidance on careful adoption of agentic AI services published in May 2026 by CISA and the NSA, the UK National Cyber Security Centre (NCSC), and partner agencies in Australia, Canada, and New Zealand.\n\nOwner approval first: No AI tool, agent, plug-in, browser extension, or connected app may be connected to [COMPANY_NAME] email, files, calendars, contacts, or finance systems (accounting, banking, payroll, or payment platforms) without the policy owner's written approval, following the review in the AI Features in Existing Software section. Connections use [COMPANY_NAME] accounts, never personal ones, and each one is recorded in the Approved AI Tools Inventory with what it can reach and who set it up.\n\nLeast access, shortest time: Each connection gets only the access its task needs, such as read-only access or a single mailbox or folder instead of everything, and only for as long as the task needs it. New uses start with low-risk tasks on non-sensitive data, and access is widened only after review. Connections that are no longer needed are disconnected, and all connections are reviewed at each inventory check.\n\nApproval prompts stay on: Settings that make an AI tool ask before it acts (often labelled 'Always ask' or 'Needs approval') stay on for any action that sends, deletes, shares, buys, or changes something. Users read each request before approving it and do not switch these prompts off to save time.\n\nNo AI in payments: AI tools and agents never send payments, add or change payees or bank details, or approve invoices, even with a person's approval. A person does these steps directly in the finance system, following the callback rule in the Voice, Video & Payment Verification section.\n\nUntrusted instructions (prompt injection): Emails, documents, web pages, calendar invites, and messages can contain instructions written to hijack an AI tool that reads them. Instructions found inside content are untrusted, even when an AI tool repeats them back as a summary, a suggested next step, or a request to click a link, call a number, send a file, or make a payment. Act only on requests from people you know, confirmed through channels you already trust. There is no complete technical fix for prompt injection, which is why the access and approval limits above apply.\n\nAble to stop it: For every approved agent or connection, the policy owner knows how to pause or disconnect it and, where the tool allows, keeps its activity log. An agent whose actions cannot be understood, monitored, or stopped is not approved.\n\nReporting: An AI tool that takes an action no one asked for, or appears to follow instructions hidden in something it read, is reported as an AI incident under the Reporting AI Incidents & Mistakes section."
        }
      ]
    },
    {
      id: "verification",
      title: "Voice, Video & Payment Verification",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Voices, faces, and writing styles can now be faked with AI. So at [COMPANY_NAME], a call, voice message, video meeting, text, or email is never enough on its own to approve any of the following: a payment, a new payee, a change to bank or payment details, a gift card purchase, a password or MFA reset, or a request for sensitive data.\n\nBefore acting, hang up and call the person back using a number already on file, such as our company directory or a signed contract, never a number or link from the request. New payees and bank-detail changes also need a second approver. This applies even when the voice or face is familiar, the person is senior, or the request is urgent or secret. No one at [COMPANY_NAME] will ever be criticized for taking the time to verify."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "AI tools can clone a voice from a short recording and generate convincing live video. [COMPANY_NAME] therefore does not treat a familiar voice, face, writing style, or caller ID as proof of identity.\n\nCovered requests: Any request to send a payment, add a payee, change bank or payment details, buy gift cards or cryptocurrency, reset a password or MFA method, grant system access, or share sensitive data.\n\nThe callback rule: Before acting on a covered request received by phone, voicemail, video meeting, text, chat, or email, the recipient confirms it by contacting the requester through a channel the recipient starts, using contact details already on file (the company directory, a signed contract, or the vendor master file), never contact details supplied in the request. This applies even when the requester appears to be a senior leader and even when the request is marked urgent or confidential.\n\nPayments and payee changes: New payees and changes to payment details require approval by two people, one of whom performed the callback. Vendor bank changes are confirmed with a known contact at the vendor before the next payment is released.\n\nCode phrase (optional): Leaders and finance staff may agree on a private code phrase, shared in person, as an extra check for urgent requests. A code phrase adds to the callback; it does not replace it.\n\nRed flags: Pressure to act quickly, requests for secrecy, a request to skip normal steps, a new or changed phone number or email address, or a caller who asks to switch channels because of poor audio or video. Any of these is a reason to slow down and verify.\n\nNo penalty for verifying: Employees will never be disciplined for delaying a request in order to verify it, no matter who appears to be asking."
        }
      ]
    },
    {
      id: "ethics",
      title: "Human Review of AI Outputs",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "AI tools make mistakes. They can invent facts, sources, and figures, and they can reflect bias. A person must review AI output before it is sent to a client, published, or used to make a decision, and that person is responsible for it.\n\nCheck facts, numbers, names, and citations against a reliable source. If an AI tool produces something biased, harmful, or clearly wrong, report it to the policy owner."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] requires human review of AI outputs in proportion to their impact:\n\nAccuracy: AI tools can produce plausible but false statements, citations, figures, and code (often called hallucinations). Facts, statistics, quotations, legal or regulatory statements, and citations must be checked against a reliable source before use.\n\nReview before release: Any AI-generated or AI-assisted content sent to clients, regulators, or the public, or used in a decision about a person, must be reviewed and approved by a qualified person, who is accountable for it as their own work.\n\nBias: AI systems can reflect and amplify bias in their training data. Reviewers must check outputs used in hiring, performance, pricing, eligibility, or client communications for unfair treatment.\n\nCode and automation: AI-generated code, formulas, and automations must be reviewed and tested before they are used with live systems or real data.\n\nReporting: Biased, harmful, or unexpectedly wrong outputs are reported to the policy owner so the approved tools list and guidance can be updated."
        }
      ]
    },
    {
      id: "high_risk",
      title: "High-Risk Use Cases",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Some uses of AI carry higher risk and need the policy owner's approval before they start: processing personal data about clients or employees, anything to do with hiring or employment decisions, financial analysis that drives business decisions, legal or compliance content, chatbots or voice agents that talk to clients or the public, and AI tools connected to company email, files, calendars, or finance systems or able to take actions in company systems.\n\nFor each approved high-risk use, record the purpose, the data involved, who reviews the output, and who is responsible."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "The following use cases are classified as high-risk and require documented approval from the policy owner before implementation:\n\nPersonal data processing: Any use of AI that processes, analyzes, or generates content about identifiable individuals, including employees, clients, or members of the public.\n\nEmployment decisions: Using AI tools to screen resumes, evaluate candidates, assess employee performance, or inform promotion, compensation, or termination decisions.\n\nFinancial decisions: Using AI for financial forecasting, credit assessment, pricing decisions, or any output that directly informs material business decisions.\n\nLegal and compliance: Using AI to draft legal documents, analyze regulatory requirements, assess compliance, or generate content that could create legal obligations for [COMPANY_NAME].\n\nClient-facing automation: Deploying AI chatbots, voice agents, or automated response systems that interact directly with clients or the public on behalf of [COMPANY_NAME].\n\nAI agents and connected apps: Any AI tool connected to [COMPANY_NAME] email, files, calendars, or finance systems, and any AI agent or automation that can send communications, change records, or access Moderate or High data in [COMPANY_NAME] systems. These also follow the AI Agents & Connected Apps section, and no AI agent may move money.\n\nSynthetic media: Creating AI-generated voice, video, or images for marketing or communications, especially anything depicting a real person.\n\nFor each approved high-risk use case, [COMPANY_NAME] documents the purpose, data inputs, human review steps, and the person responsible for oversight, and reviews the approval at least annually."
        }
      ]
    },
    {
      id: "transparency",
      title: "AI Transparency & Attribution",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "[COMPANY_NAME] is straightforward about its use of AI. When AI has been used to generate or substantially contribute to client deliverables, external communications, or published content, we disclose it where appropriate. AI-generated voice, video, or images that could be mistaken for a real person are always labeled.\n\nThe specific disclosure requirements depend on the context, industry rules, and client expectations. When in doubt, disclose."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] is committed to appropriate transparency about AI use:\n\nInternal communications: AI assistance with routine internal communications (emails, meeting notes, documentation) does not require disclosure. When AI-generated analysis or recommendations are presented to leadership for a decision, the use of AI should be noted.\n\nClient deliverables: When AI substantially generates or contributes to client-facing deliverables, its use is disclosed in line with industry standards, contractual obligations, and client expectations. The responsible professional remains accountable for the accuracy and quality of all deliverables.\n\nPublished content: AI-generated or AI-assisted content published externally (articles, reports, marketing materials) includes attribution where required by platform rules, industry standards, or [COMPANY_NAME] guidelines.\n\nSynthetic media: AI-generated voice, video, or images that could be mistaken for a real person or a real event are clearly labeled, and are never created of a real person without that person's documented consent.\n\nRegulatory compliance: AI use within a regulated activity must meet the disclosure and transparency requirements of that regulatory framework."
        }
      ]
    },
    {
      id: "incidents",
      title: "Reporting AI Incidents & Mistakes",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Made a mistake with AI? Tell the policy owner straight away, ideally within the hour and no later than the same business day. Reporting your own slip quickly is exactly what we want, and you will not be disciplined for a mistake you report promptly.\n\nReport these: sensitive data put into an AI tool or a personal AI account by mistake; a call, voice message, or video that may have been a deepfake, especially one asking for money, access, or data; an AI tool or agent that did something no one asked it to do, or seemed to follow instructions hidden in an email, document, or web page; and an AI feature that showed information to the wrong people. If money was sent, also call the bank immediately.\n\nIf you shared something you shouldn't have, stop, take screenshots of what you shared, and tell us before deleting anything. [COMPANY_NAME] handles these reports using its incident response plan; for data put into the wrong AI tool, that means its AI tool data exposure playbook."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "AI-related incidents are security incidents. They must be reported to the policy owner immediately, ideally within the hour, and in any case within the same business day.\n\nNo blame for prompt reporting: A quick report from the person who made a mistake is the fastest way to limit the damage, so [COMPANY_NAME] wants to hear about slips straight away. Anyone who pastes, uploads, shares, or connects something they shouldn't have should tell the policy owner at once instead of trying to fix it quietly. Employees who report their own AI mistakes promptly will not be disciplined for the mistake itself. Concealing an AI incident is a violation of this policy.\n\nReportable AI incidents include:\n\nData exposure: Moderate or High data entered into an unapproved AI tool or a personal AI account, or exposed by an AI feature, share link, connected app, or agent.\n\nSuspected deepfake or impersonation: A call, voice message, video meeting, or message that may have used AI to impersonate a colleague, client, vendor, or official, whether or not anyone acted on it. If money was sent, the bank must also be called immediately, because recovery depends on speed.\n\nUnexpected AI actions: An AI tool or agent that sends, deletes, buys, shares, or changes something no one asked it to, or appears to follow instructions hidden in content it read.\n\nWhat to do: Stop using the tool for that task. Capture screenshots of what was shared or what happened before deleting anything. Do not try to fix it alone. The policy owner follows [COMPANY_NAME]'s incident response plan: its AI tool data exposure playbook for data put into or exposed by an AI tool, and its deepfake or voice-clone fraud playbook for suspected impersonation. Steps may include deleting the conversation, its saved memories, and any share links; filing deletion requests with the vendor; disconnecting connected apps and revoking access; changing any exposed passwords or keys; and assessing whether anyone must be notified."
        }
      ]
    },
    {
      id: "violations",
      title: "Training, Acknowledgment & Enforcement",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Everyone covered by this policy receives AI use training when they join and at least once a year, and signs to confirm they have read this policy. Training covers the approved tools list and work accounts, the Low, Moderate, and High data levels, the rules for AI agents and connected apps, spotting instructions hidden in emails, documents, and web pages, the callback rule, and how to report AI incidents, including your own slips.\n\nBreaking this policy may lead to disciplinary action, up to and including termination of employment or contract. [COMPANY_NAME] will not retaliate against anyone who raises a good-faith concern about AI use. This policy is reviewed at least once a year, and sooner when our tools or the risks change significantly."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "Training: All personnel receive training on this policy when they join and at least once a year. Training covers the approved AI tools list and business accounts; the Low, Moderate, and High data levels and the never list; settings such as memory, share links, and ratings; human review of outputs; the rules for AI agents and connected apps; how prompt injection works and what to do about it; the callback rule for payment and access requests; and how to report AI incidents, including your own mistakes. Staff who approve or send payments also practice the callback rule, for example in a tabletop exercise.\n\nAcknowledgment: All personnel acknowledge in writing that they have read and will follow this policy, at onboarding and whenever it changes materially.\n\nEnforcement: Violations may result in disciplinary action proportionate to their severity, up to and including termination of employment or contract. Examples include putting Moderate or High data into a personal AI account, putting never-list data into any AI tool, using or connecting unapproved AI tools, letting AI handle payments, skipping the callback rule, releasing AI output without review, and concealing an AI incident. Retaliation against anyone who reports a concern in good faith is prohibited.\n\nReview: The policy owner reviews this policy at least annually, and sooner when [COMPANY_NAME] adopts a significant new AI tool, a vendor materially changes its data terms, a relevant law or regulation changes, or an AI incident reveals a gap. The approved AI tools list is reviewed as described in the Approved Tools, Inventory & Offboarding section."
        }
      ]
    },
    {
      id: "tool_inventory",
      title: "Appendix: Approved AI Tools Inventory",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "This is [COMPANY_NAME]'s list of approved AI tools. The policy owner keeps it up to date, checks it against the AI tools people actually use at least twice a year, and re-checks each vendor's data terms before the renewal date. A shared spreadsheet with the same five columns works just as well.\n\nLast checked against tools in use: __________ Checked by: __________\n\n1. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n2. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n3. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n4. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________"
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "This appendix is [COMPANY_NAME]'s approved AI tools list. The policy owner updates it whenever an AI tool, feature, connected app, or agent is approved, changed, or retired; checks it against the AI tools staff actually use at least twice a year; and re-checks each vendor's data terms before the renewal date. It may be kept as a shared spreadsheet instead, as long as it has the same columns.\n\nColumns: Tool (name and vendor, plus any connected apps and what they can reach). Plan or account type (for example, a business account under a [COMPANY_NAME] agreement, an AI feature included in software we already license, or a personal account approved for Low data only). Approved data levels (Low, Moderate, or High; High only for tasks the policy owner has approved in writing). Owner (the person responsible for its settings, seats, and renewal). Renewal date (when the plan renews, and when its data terms were last checked).\n\nLast checked against tools in use: __________ Checked by: __________\n\n1. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n2. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n3. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n4. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n5. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________\n\n6. Tool: __________ | Plan or account type: __________ | Approved data levels: __________ | Owner: __________ | Renewal date: __________"
        }
      ]
    }
  ]
}
