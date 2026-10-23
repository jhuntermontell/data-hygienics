/**
 * AI Use and Data Handling - shared section appended to every industry bank
 * by withAiSection() in lib/questions/index.js.
 *
 * Frameworks: NIST CSF 2.0 (GV.PO, ID.AM, PR.DS, GV.SC, PR.AA),
 * NIST AI RMF 1.0 (GOVERN 1.6, 2.2, 6.1), CIS Controls v8.1 (2, 3, 14, 15).
 *
 * `introduced` marks a section added after launch. Scoring treats such a
 * section as "not assessed" (no weight, no gaps) on any assessment where
 * none of its questions has an answer, so assessments completed before the
 * section existed keep their original score and gap list.
 *
 * Pure data, import-free.
 */

export const AI_USE_SECTION = {
  id: "ai_use",
  key: "ai_use",
  title: "AI Use and Data Handling",
  nistCategory: "GV.PO",
  introduced: "2026-10",
  questions: [
    {
      key: "ai_tool_inventory",
      text: "Do you know which AI tools your staff use for work, including free chatbots, browser extensions, meeting note-takers, and AI features inside software you already pay for?",
      type: "singleselect",
      options: [
        { label: "Yes, we keep a list of approved AI tools and check it against what staff actually use", weight: 1.0 },
        { label: "We have a list of approved tools, but staff may use others we have not reviewed", weight: 0.6 },
        { label: "We have a rough idea, but nothing is written down", weight: 0.3 },
        { label: "We have not looked into which AI tools staff use", weight: 0.0 },
        { label: "I don't know", weight: 0.0, flag: "discovery" },
      ],
      nistFunction: "Identify",
      cisControl: 2,
      tooltip: {
        explanation:
          "Staff often pick up AI tools on their own: a free chatbot, a browser extension, a meeting note-taker, or an AI assistant switched on inside an app you already use. You can't set rules for, or protect data in, a tool you don't know about. A simple list is the starting point for every other AI safeguard.",
        insurerNote:
          "After any data incident, insurers, clients, and regulators will ask where the data went. An AI tool nobody listed is a place nobody checked.",
        controlSlug: "ai-tool-inventory",
      },
    },
    {
      key: "ai_use_policy",
      text: "How mature is your organization's AI use policy (the written rule for which AI tools staff may use and what information must stay out of them)?",
      type: "maturity",
      nistFunction: "Govern",
      cisControl: 14,
      rubric: {
        "Not in place":
          "Nothing about AI is written down. Each person decides which tools to use and what to paste into them. If someone asked whether they may put a client's details into a chatbot, nobody could point to an answer.",
        "Partially in place":
          "Leadership has said something about AI, maybe in an email or a meeting, but it is not written in one place. Some staff know the expectations and others don't. New hires don't hear about it.",
        "Fully in place":
          "A short written AI use rule exists. It names the approved tools, lists the information that must never go into AI tools, and says who approves new tools. Every staff member has read it, and new hires get it during onboarding.",
        "Documented & tested":
          "The rule has a named owner and is reviewed at least once a year and whenever you adopt a significant new AI tool. Staff acknowledge it in writing. You have checked that people follow it, for example by comparing the approved list with the AI tools actually in use, and exceptions are recorded with a reason.",
      },
      tooltip: {
        explanation:
          "An AI acceptable use policy is a short, plain-language rule. It says which AI tools staff may use, what information must never go into them, and who approves new tools. It replaces individual guesses with one shared standard.",
        insurerNote:
          "Insurers may ask how you govern AI use. A written rule that staff have read also shows clients and regulators that a leak broke your rules rather than reflecting them.",
        controlSlug: "ai-acceptable-use",
      },
    },
    {
      key: "ai_data_handling",
      text: "Which of these rules for handling data in AI tools are in place?",
      type: "multiselect",
      options: [
        { label: "Client, patient, or customer personal information goes only into AI tools approved for it", weight: 0.25 },
        { label: "Passwords, login codes, and bank or card numbers never go into AI tools", weight: 0.2 },
        { label: "Staff use business AI accounts for work, not personal ones", weight: 0.2 },
        { label: "Settings that let AI providers train on our data are turned off", weight: 0.2 },
        { label: "Confidential documents (contracts, financials, plans) go only into approved tools", weight: 0.15 },
        { label: "All of the above", weight: 1.0 },
        { label: "None", weight: 0.0 },
      ],
      nistFunction: "Protect",
      cisControl: 3,
      tooltip: {
        explanation:
          "Anything typed or uploaded into an AI tool leaves your systems and is stored by the provider under its own terms. Many personal and free AI accounts keep conversations and may use them to train future models unless that setting is turned off. Clear data rules keep sensitive information in tools you have checked.",
        insurerNote:
          "Putting client, patient, or customer records into an unapproved AI tool can count as an unauthorized disclosure, with the same notification and contract consequences as any other data leak.",
        controlSlug: "ai-data-handling",
      },
    },
    {
      key: "ai_vendor_features",
      text: "When software you already use adds AI features (for example, an AI assistant in your email, documents, or customer system), does anyone review them before they are turned on?",
      type: "singleselect",
      options: [
        { label: "Yes, someone checks what data the feature can reach and how the provider uses that data before we turn it on", weight: 1.0 },
        { label: "We review major AI features, but some get turned on by default without review", weight: 0.55 },
        { label: "AI features get turned on by staff or the vendor without review", weight: 0.15 },
        { label: "We have not thought about AI features in our existing software", weight: 0.0 },
        { label: "I don't know", weight: 0.0, flag: "discovery" },
      ],
      nistFunction: "Govern",
      cisControl: 15,
      tooltip: {
        explanation:
          "Many business apps now include AI assistants that can read your email, files, or customer records, and some arrive switched on. Each one is a new path for data to leave. It is also a new way for hidden instructions planted in an email or document to steer the assistant, which is called prompt injection.",
        insurerNote:
          "Insurers and clients already ask how you vet vendors. An AI feature that can read your whole mailbox deserves the same review you would give a new vendor with that access.",
        controlSlug: "ai-vendor-features",
      },
    },
    {
      key: "ai_voice_video_verification",
      text: "If someone asks by phone, video call, voicemail, text, or email to send money, change bank details, or share a password or login code, do staff confirm the request through a separate channel first, even when the voice or face is familiar?",
      type: "singleselect",
      options: [
        { label: "Yes, staff call back on a number we already have on file before acting, and payment or bank-detail changes need a second person's approval", weight: 1.0 },
        { label: "Staff are expected to call back on a known number, but it is not written down or not always followed", weight: 0.5 },
        { label: "Staff check only when something seems off", weight: 0.2 },
        { label: "No, a familiar voice, face, or email address is usually enough to act", weight: 0.0 },
        { label: "I don't know", weight: 0.0, flag: "discovery" },
      ],
      nistFunction: "Protect",
      cisControl: 14,
      tooltip: {
        explanation:
          "AI tools can imitate a familiar voice or face, so recognizing someone is no longer proof it's them. A callback rule means any request for money, bank changes, or login details is confirmed through a channel the requester didn't choose, such as a phone number already on file. It works however convincing the fake is.",
        insurerNote:
          "The FBI's 2025 Internet Crime Report recorded more than $3 billion in reported business email compromise losses. Cyber insurance applications commonly ask whether you confirm payment changes by calling a known number.",
        controlSlug: "out-of-band-verification",
      },
    },
  ],
}
