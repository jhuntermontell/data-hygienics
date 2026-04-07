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
          text: "[COMPANY_NAME] recognizes that artificial intelligence tools are becoming part of everyday business operations. This policy provides clear guidelines for using AI responsibly, protecting sensitive data, and maintaining trust with clients and stakeholders.\n\nAll employees, contractors, and authorized users who access AI tools in the course of their work at [COMPANY_NAME] are expected to follow this policy."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] is committed to leveraging artificial intelligence to improve productivity, decision-making, and service delivery while managing the associated risks. This AI Acceptable Use Policy establishes the standards, requirements, and guardrails for the responsible use of AI tools across the organization.\n\nAI capabilities are evolving rapidly, and this policy is designed to be a living document that adapts as the technology matures. All personnel are expected to exercise sound judgment, follow these guidelines, and escalate questions to the designated policy owner.\n\nThis policy applies to all employees, contractors, temporary workers, and third-party partners who use AI tools in connection with [COMPANY_NAME] business activities."
        },
        {
          id: "c",
          label: "Comprehensive",
          text: "[COMPANY_NAME] recognizes that artificial intelligence, including generative AI, represents both a significant opportunity and a material risk to the organization. This policy establishes a governance framework for the responsible adoption, deployment, and oversight of AI tools across all business functions.\n\nThe objectives of this policy are to: (1) enable productive and innovative use of AI while protecting organizational interests, (2) ensure compliance with applicable laws, regulations, and ethical standards, (3) protect confidential, proprietary, and personal data from unauthorized exposure through AI systems, and (4) establish accountability and oversight mechanisms for AI use.\n\nThis policy applies to all employees, contractors, temporary staff, interns, board members, and any third party who accesses AI tools in connection with [COMPANY_NAME] operations, regardless of whether those tools are provided by the organization or accessed independently."
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
          text: "This policy covers the use of any AI tool in the workplace, including chatbots like ChatGPT and Claude, AI features built into existing software (such as Microsoft Copilot or Google Gemini), image generators, coding assistants, and any other tool that uses artificial intelligence to generate content or make recommendations.\n\nIt applies whether the tool is provided by [COMPANY_NAME] or accessed by an individual using personal accounts for work purposes."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "This policy governs the use of all artificial intelligence systems, tools, and services used in connection with [COMPANY_NAME] business, including but not limited to: standalone generative AI platforms (e.g., ChatGPT, Claude, Gemini), AI features embedded in existing business applications (e.g., Microsoft Copilot, Salesforce Einstein), AI-powered coding assistants (e.g., GitHub Copilot), image and media generation tools, and any custom or third-party AI models or APIs.\n\nThis policy applies regardless of whether the AI tool is: procured and managed by [COMPANY_NAME], accessed through a personal account for business purposes, embedded within an approved business application, or accessed through a free or trial tier.\n\nAll use of AI for [COMPANY_NAME] business purposes falls within the scope of this policy."
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
          text: "Artificial Intelligence (AI): Software that can learn from data and make predictions, generate content, or automate decisions. Generative AI: AI that creates new content such as text, images, code, or audio based on prompts. Open AI Systems: AI tools where user inputs may be used to train or improve the model. Closed AI Systems: AI tools with enterprise agreements that do not use inputs for training. Embedded AI: AI features built into existing software tools the organization already uses."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "Artificial Intelligence (AI): Technology systems that perform tasks typically requiring human intelligence, including natural language processing, pattern recognition, content generation, and decision support. Generative AI: A subset of AI that creates new content, including text, images, code, audio, and video, based on user prompts and training data.\n\nOpen AI Systems: AI platforms where user inputs, prompts, and outputs may be retained, reviewed, or used to train and improve the underlying model. These systems present higher data exposure risk. Closed AI Systems: AI platforms operating under enterprise-grade agreements that contractually prohibit the use of customer data for model training. These systems offer stronger data protection guarantees.\n\nEmbedded AI: AI capabilities integrated into existing business software and productivity tools, such as grammar checkers, email assistants, and workflow automation features. These may operate transparently without explicit user invocation."
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
          text: "All AI use at [COMPANY_NAME] should follow four principles: Lawful, meaning we comply with all applicable laws and regulations. Ethical, meaning we use AI in ways that are fair, honest, and respectful. Transparent, meaning we are open about when and how AI is being used. Necessary, meaning we use AI when it adds genuine value, not simply because it is available."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] adopts the following guiding principles for all AI use:\n\nLawful: All AI use must comply with applicable federal, state, and local laws, as well as industry-specific regulations. Users are responsible for understanding legal requirements that apply to their specific function and use case.\n\nEthical: AI must be used in ways that are fair, unbiased, and respectful of individual rights. Users should critically evaluate AI outputs for potential bias, misinformation, or harmful content before relying on or distributing them.\n\nTransparent: [COMPANY_NAME] is committed to appropriate disclosure of AI use. When AI-generated content is used in client deliverables, external communications, or decision-making processes, this should be disclosed as required by organizational standards.\n\nNecessary: AI tools should be used to enhance productivity, quality, or decision-making, not as a substitute for professional judgment. Users should evaluate whether AI is the appropriate tool for each task."
        }
      ]
    },
    {
      id: "use_standards",
      title: "General Use Standards & Approval Process",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Employees may use [COMPANY_NAME]-approved AI tools for routine tasks such as drafting documents, summarizing information, brainstorming, and research assistance. Before using any AI tool not already approved by the organization, employees must request approval from their manager.\n\nAll AI-generated content used in business deliverables must be reviewed and verified by a qualified person before distribution."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] maintains a list of approved AI tools and platforms. Employees may use approved tools for business purposes without additional authorization for routine tasks including: drafting and editing documents, summarizing or organizing information, generating ideas and brainstorming, coding assistance and debugging, research and analysis support, and translation or language assistance.\n\nAny AI tool or platform not on the approved list requires written approval from the designated policy owner before use. Requests should include the tool name, intended use case, data types involved, and vendor security documentation.\n\nAll AI-generated content must be reviewed for accuracy, completeness, and appropriateness before being used in business deliverables, client communications, or decision-making. The individual who submits or presents the content is responsible for its accuracy, regardless of whether AI was used in its creation."
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
          text: "The following uses of AI are prohibited at [COMPANY_NAME]: Entering client personal data, financial records, health information, or other sensitive data into any AI tool unless explicitly approved. Using AI to make final decisions about hiring, termination, or compensation without human review. Representing AI-generated work as original human work when disclosure is required. Using AI to circumvent security controls or access restrictions. Using AI to generate misleading, deceptive, or fraudulent content."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "The following activities are strictly prohibited when using AI tools in connection with [COMPANY_NAME] business:\n\nData exposure: Entering personally identifiable information (PII), protected health information (PHI), financial account data, trade secrets, attorney-client privileged communications, or any data classified as Moderate or High sensitivity into open AI systems without explicit written authorization.\n\nAutomated decision-making: Using AI as the sole basis for decisions that materially affect individuals, including employment decisions, credit determinations, insurance underwriting, or legal conclusions, without meaningful human review and oversight.\n\nMisrepresentation: Presenting AI-generated content as original human work in contexts where such disclosure is legally or contractually required, or where it would be materially misleading to stakeholders.\n\nSecurity circumvention: Using AI tools to bypass, test, or undermine [COMPANY_NAME] security controls, access restrictions, or monitoring systems.\n\nHarmful content: Using AI to generate content that is discriminatory, harassing, defamatory, fraudulent, or in violation of any [COMPANY_NAME] policy."
        }
      ]
    },
    {
      id: "data_handling",
      title: "Data Handling & Training Data Rules",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Before using any data with an AI tool, consider the sensitivity of the information. Public or non-sensitive data may be used freely with approved tools. Confidential or sensitive data should only be used with closed AI systems that have enterprise agreements protecting the data.\n\nNever enter passwords, API keys, or security credentials into any AI tool. When in doubt about whether data is appropriate for AI use, consult the policy owner."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] data must be handled according to the following rules when used with AI tools:\n\nLow-sensitivity data (public information, general business knowledge) may be used with any approved AI tool. Moderate-sensitivity data (internal documents, non-public business information) may only be used with closed AI systems operating under enterprise data protection agreements. High-sensitivity data (PII, PHI, financial records, legal privileged materials) is prohibited from use with AI tools unless the specific tool and use case have received written approval from the policy owner and the data protection requirements have been verified.\n\nUnder no circumstances should authentication credentials, encryption keys, API tokens, or security configurations be entered into any AI system.\n\nUsers should be aware that free-tier and consumer-grade AI services typically retain and may use input data for model training. These services should be treated as open AI systems regardless of their privacy statements."
        }
      ]
    },
    {
      id: "ethics",
      title: "AI Ethics Requirements",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "[COMPANY_NAME] expects all AI use to be fair and ethical. Users should review AI outputs for bias or inaccuracy before acting on them. AI should augment human judgment, not replace it, especially for decisions that significantly affect people.\n\nIf you encounter AI outputs that appear biased, discriminatory, or factually incorrect, report it to the policy owner."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] is committed to the ethical use of AI and requires all users to exercise responsible judgment:\n\nBias awareness: AI systems can reflect and amplify biases present in their training data. Users must critically evaluate AI outputs for potential bias, particularly in contexts involving personnel decisions, client interactions, or content that will be widely distributed.\n\nAccuracy verification: AI systems can produce plausible-sounding but factually incorrect outputs (commonly called hallucinations). All AI-generated facts, statistics, citations, and recommendations must be independently verified before use.\n\nHuman oversight: AI should serve as a tool to support and enhance human decision-making, not to replace it. For any decision with material impact on individuals or the organization, a qualified person must review and approve the outcome.\n\nIncident reporting: Any instance of AI producing biased, harmful, inaccurate, or unexpected results should be reported to the policy owner for documentation and review."
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
          text: "Certain uses of AI carry higher risk and require additional approval before proceeding. These include: using AI to process personal data about individuals, using AI in hiring or employment decisions, using AI for financial analysis or recommendations that affect business decisions, and using AI to generate legal or compliance-related content.\n\nFor any of these use cases, employees must obtain approval from the policy owner and document the intended use, data involved, and review process."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "The following use cases are classified as high-risk and require documented approval from the policy owner before implementation:\n\nPersonal data processing: Any use of AI that involves processing, analyzing, or generating content about identifiable individuals, including employees, clients, or members of the public.\n\nEmployment decisions: Using AI tools to screen resumes, evaluate candidates, assess employee performance, or inform promotion, compensation, or termination decisions.\n\nFinancial decisions: Using AI for financial forecasting, investment analysis, credit assessment, pricing decisions, or any output that directly informs material business decisions.\n\nLegal and compliance: Using AI to draft legal documents, analyze regulatory requirements, assess compliance posture, or generate content that could create legal obligations for [COMPANY_NAME].\n\nClient-facing automation: Deploying AI-powered chatbots, virtual assistants, or automated response systems that interact directly with clients or the public on behalf of [COMPANY_NAME].\n\nFor each approved high-risk use case, [COMPANY_NAME] will document the purpose, data inputs, review procedures, and responsible oversight person."
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
          text: "[COMPANY_NAME] believes in being straightforward about the use of AI. When AI has been used to generate or substantially contribute to client deliverables, external communications, or published content, this should be disclosed where appropriate.\n\nThe specific disclosure requirements will depend on the context, industry regulations, and client expectations. When in doubt, disclose."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "[COMPANY_NAME] is committed to appropriate transparency regarding AI use:\n\nInternal communications: AI assistance in routine internal communications (emails, meeting notes, documentation) does not require disclosure. However, when AI-generated analysis or recommendations are presented to leadership for decision-making, the use of AI should be noted.\n\nClient deliverables: When AI is used to substantially generate or contribute to client-facing deliverables, the use of AI should be disclosed in accordance with industry standards, contractual obligations, and client expectations. The responsible professional remains accountable for the accuracy and quality of all deliverables.\n\nPublished content: AI-generated or AI-assisted content published externally (blog posts, reports, marketing materials) should include appropriate attribution where required by platform policies, industry standards, or organizational guidelines.\n\nRegulatory compliance: Any AI use that falls within a regulated domain must comply with applicable disclosure and transparency requirements specific to that regulatory framework."
        }
      ]
    },
    {
      id: "violations",
      title: "Violations & Reporting",
      options: [
        {
          id: "a",
          label: "Simplified",
          text: "Violations of this policy may result in disciplinary action, up to and including termination of employment or contract. If you become aware of a violation or potential violation of this policy, please report it to the policy owner immediately.\n\n[COMPANY_NAME] will not retaliate against anyone who reports a good-faith concern about AI misuse."
        },
        {
          id: "b",
          label: "Standard",
          default: true,
          text: "All personnel are expected to comply with this policy. Violations may result in disciplinary action proportionate to the severity of the violation, up to and including termination of employment or contract.\n\nExamples of violations include but are not limited to: entering prohibited data into AI systems, using unapproved AI tools for business purposes, failing to verify AI-generated content before use in business contexts, misrepresenting AI-generated work as human-created where disclosure is required, and using AI in prohibited ways as defined in this policy.\n\nReporting: Any person who becomes aware of a potential violation of this policy should report it promptly to the policy owner. Reports may also be submitted through [COMPANY_NAME]'s standard reporting channels. [COMPANY_NAME] prohibits retaliation against anyone who reports a concern in good faith.\n\nThis policy will be reviewed and updated on a [REVIEW_FREQUENCY] basis, or more frequently as the AI landscape evolves and new risks or regulations emerge."
        }
      ]
    }
  ]
}
