// Forced moment: a cyber insurance renewal or first application. The case
// facts come from the court record (complaint and order), not press
// coverage; the complaint's facts are the insurer's allegations and the
// order was agreed, so say so. Carrier names stay out of entry prose (the
// validator warns on them); the source labels carry the caption.
export default {
  kind: "guide",
  slug: "cyber-insurance-application-and-renewal",
  title: "Your cyber insurance answers have to stay true all year",
  metaTitle: "Cyber Insurance Applications and Renewals | Data Hygienics",
  metaDescription: "What a cyber insurance application asks, why a wrong yes can void the policy, and how to answer from evidence and keep the answers true until renewal.",
  audience: ["business"],
  pillars: ["hygiene"],
  tldr: "A cyber insurance application asks yes-or-no questions about your security, and someone at your business signs that the answers are true. In a 2022 federal case, a business answered yes to questions about multi-factor authentication, was hit by ransomware less than two months after its policy began, and then agreed to a court order voiding the policy from the start, after the insurer said the protection covered only its firewall.[^ics-rescission-complaint-2022][^ics-rescission-order-2022] Answer only what is true today, keep the proof, and tell your broker when something changes.",
  datePublished: "2026-11-04",
  lastReviewed: "2026-11",
  status: "draft",
  featured: false,

  timeToComplete: "Two to three hours before you sign, then 20 minutes a month",
  difficulty: "moderate",

  why: [
    "The application is the insurer's way of measuring your risk, and regulators expect it to be thorough. New York's financial regulator tells insurers writing cyber coverage to gather information about each insured's security program through surveys and interviews, on topics such as access controls, encryption, endpoint monitoring, incident response planning and the security of the vendors you rely on, and to price policies on how well that program works.[^nydfs-cyber-insurance-framework-2021]",
    "Here is what a wrong answer can cost. In March 2022 a small company's chief executive signed an application answering yes to whether it required multi-factor authentication (MFA) for administrative access, and signed a separate MFA attestation saying it required MFA for employee email, all remote access, and administrator access to its servers, backups and network equipment.[^ics-rescission-complaint-2022] The attestation called those controls the minimum needed to be eligible for a policy.[^ics-rescission-complaint-2022] The policy began on April 4, 2022, and ransomware hit the company around May 25.[^ics-rescission-complaint-2022] The insurer said its investigation found MFA protected only the firewall, asked a federal court to rescind the policy, and returned the premium.[^ics-rescission-complaint-2022] The company agreed, and in August 2022 the court declared the policy void from its start, with no coverage for any claim under it.[^ics-rescission-order-2022]",
    "Two details matter for you. The facts about MFA are the insurer's account, which the company chose not to contest, so the case is a warning rather than a ruling on how courts read these forms.[^ics-rescission-order-2022] And the application's signature block said the company would notify the insurer of any material changes to the information it gave.[^ics-rescission-complaint-2022] Look for similar wording in your own application. Where it appears, your answers are a promise about the whole policy year, not a snapshot of one afternoon.",
  ],

  steps: [
    {
      title: "Get the real questions early",
      detail: [
        "Ask your broker for the full application now, including any supplemental forms such as an MFA attestation or a ransomware questionnaire. Questions can change between renewals, so don't copy last year's answers.",
        "Block time to answer them while there is still room to fix a gap before the policy is bound.",
      ],
      verify: "You have every form you will be asked to sign, and a date on your calendar to finish your answers well before the deadline.",
    },
    {
      title: "Answer with the person who actually knows",
      detail: [
        "The attestation in the 2022 case said it should be completed with the person in charge of IT security.[^ics-rescission-complaint-2022] If that is an outside IT provider, send them the questions and ask for written answers, question by question, with how they checked each one.",
        "The person who signs is still the one making the promise. Read every answer before you sign it.",
      ],
      verify: "Each technical answer has a name next to it and a note of how it was checked.",
    },
    {
      title: "Check every yes against the system, not memory",
      detail: [
        "MFA questions are usually split by where you sign in: email, remote access, administrator accounts, backups, servers and network equipment. Check each one separately. Pull the MFA enrollment report from your email system and confirm every active user, including the owner and any shared mailbox someone can sign in to.",
        "Do the same for backups (when did you last restore a file from them?), endpoint protection (does every laptop on the network have it?) and software updates (are they on automatic?).",
      ],
      verify: "For every yes, you have a screenshot or report dated within a week of signing.",
    },
    {
      title: "Answer partly true as partly true",
      detail: [
        "If MFA covers email but not the old server in the closet, say so. Use the form's comment space or a cover note through your broker, and give a date for the fix. A clear answer with a plan is something a broker can place. A wrong yes can cost you the policy when you need it.",
        "If the fix takes an afternoon, such as turning on MFA for the last few accounts, do it before you sign, then answer yes.",
      ],
      verify: "No answer on the form depends on the words 'mostly' or 'we plan to'.",
    },
    {
      title: "Keep an evidence file for the policy year",
      detail: "Save the signed application, every supplemental form, your IT provider's written answers and the dated screenshots behind each yes, in one folder outside your everyday email. If you ever file a claim, this is the file that shows what was true when you signed.",
      verify: "One folder holds the full application and the proof for each security answer, and two people know where it is.",
    },
    {
      title: "Check the promised controls every month",
      detail: [
        "Pick the five or six controls your application asked about and check them on the first business day of each month: MFA enrollment, backup success and a test restore, endpoint protection coverage, update status, and accounts for anyone who has left.",
        "The free Quick Check in our Cyber Audit takes about five minutes and is a fast way to spot a control that has slipped before renewal.",
      ],
      verify: "Your monthly check log has an entry for each month of the current policy year.",
    },
    {
      title: "Tell your broker when something material changes",
      detail: "If a control you described is switched off, a new system goes live without it, or you have a security incident, call your broker and ask how to report it under your policy. Read your application and policy for notice wording so you know what you agreed to.",
      verify: "You know where your policy's notice requirements are and who at your business is responsible for calling the broker.",
    },
    {
      title: "Put the claims line where you can find it",
      detail: "Add your insurer's claims or breach hotline and your policy number to your emergency contact list and your incident response plan. Our Incident Response Planner has a place for both.",
      verify: "Two people can find the claims number in under a minute without opening email.",
    },
  ],

  limits: [
    "This guide can't tell you how your insurer or a court will treat a particular answer. Policies and state laws differ, and the 2022 case ended in an agreed order, not a decision on contested facts.[^ics-rescission-order-2022]",
    "Honest answers can raise your premium or narrow your coverage. That is still better than coverage that disappears when you file a claim.",
    "Getting a policy issued is not the same as being secure. Underwriting looks at the answers on a form, and attackers look at your actual systems.",
    "We don't sell, place or recommend insurance policies, and we take no commission from insurers or brokers.",
  ],

  faqs: [
    {
      question: "Our IT provider handles all of this. Can they just fill out the form?",
      answer: "They should answer the technical questions in writing, but someone at your business signs the application. Read each answer, ask how they checked it, and keep their written answers in your evidence file.",
    },
    {
      question: "We answered yes last year, and it wasn't fully true. What now?",
      answer: "Fix the gap as fast as you can, then talk to your broker, and a lawyer if you're worried, about how to correct the record. Don't wait for a claim to find out.",
    },
    {
      question: "Will a 'no' answer mean we can't get coverage?",
      answer: "It depends on the insurer and the question. Some treat certain controls as a condition of coverage. A clear no with a date for the fix gives your broker something to work with; a wrong yes can leave you with no policy at all.",
    },
    {
      question: "Does the policy cover us if we were hit before the policy started?",
      answer: "Check your policy wording and ask your broker. Applications can ask about past incidents and what you changed afterward. Those answers need the same care as the security questions.",
    },
  ],

  sourceIds: [
    "ics-rescission-complaint-2022",
    "ics-rescission-order-2022",
    "nydfs-cyber-insurance-framework-2021",
  ],

  related: {
    threats: ["ai-powered-phishing-and-bec"],
    guides: [
      "digital-hygiene-for-your-business",
      "two-channel-verification-for-payments",
      "answering-a-client-security-questionnaire",
      "texas-sb-2610-safe-harbor",
    ],
    explainers: [],
    controls: [
      "cyber-insurance",
      "multi-factor-authentication",
      "data-backup",
      "backup-testing",
      "endpoint-protection",
      "patch-management",
      "employee-offboarding",
      "incident-response-plan",
      "emergency-contacts",
    ],
    glossary: ["multi-factor-authentication", "phishing-resistant-mfa", "ransomware"],
    toolkit: [],
  },
}
