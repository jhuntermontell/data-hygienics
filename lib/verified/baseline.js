// Data Hygienics Verified: the seventeen-control baseline as data.
// Spec: design/verified/baseline.md (approved 2026-11-04). Pure data, no
// imports, so plain Node and the validator can load it.
//
// Stored keys, never renamed once committed: control ids, group ids, state
// ids, proof type ids, tier numbers, policy ids and `only` condition ids. A
// control that changes meaning gets a new id; the old one moves to RETIRED
// with a `retiredAt` date (the validator fails if an id disappears without
// that).
//
// Control fields (spec section 1):
//   id, name, group, promise, question
//   proof     accepted methods, strongest first: { type, covers, only }
//             `only` limits a method to a condition the rules check:
//               "no_tenant"            no Microsoft 365 or Google tenant connected
//               "under_five_devices"   the device inventory lists fewer than five
//               "under_five_people"    the staff count is under five
//             When a stronger method is available to the business, a weaker
//             one is refused (lib/verified/rules.js enforces both).
//   rule      the name of the predicate in lib/verified/rules.js RULES
//   validity  days a pass stands without fresh proof; null = continuous
//             (stands while the weekly live check keeps confirming it)
//   drift     the live check that can contradict a pass: "tenant" | "lookup" | null
//   refs      { nist: [CSF 2.0 subcategories], cis: [CIS v8 IG1 safeguards] }
//             CIS numbers stay off public pages until the license answer.
//   library   { controls: [lib/controls.js slugs], guides: [lib/guides.js slugs] }
//   insurer   reserved for the carrier pack; empty in 2027.1
//   tiers     mfa only
//   notApplicableAllowed  true only where the spec permits `not_applicable`
//
// Public copy here (names, promises, questions, tier text, labels) never says
// certified, compliant, secure, protected, safe, pass, grade or score. There
// is no score for the record as a whole: seventeen lines and the MFA tier.

export const BASELINE_VERSION = "2027.1"

// Controls that left the baseline: { id, retiredAt: "YYYY-MM-DD", replacedBy }.
export const RETIRED = []

// The weekly live checks re-confirm a continuous control. Two missed weeks
// and the pass needs fresh proof.
export const LIVE_CHECK_GRACE_DAYS = 14

// The lowest MFA tier that counts as passing in 2027 (spec decision 1). The
// minimum rises to 2 on a date announced a year ahead.
export const MFA_MINIMUM_TIER = 1

export const GROUPS = [
  { id: "sign_in", name: "Sign-in" },
  { id: "email", name: "Email" },
  { id: "devices", name: "Devices" },
  { id: "data", name: "Data" },
  { id: "people_access", name: "People and access" },
  { id: "plans_papers", name: "Plans and papers" },
  { id: "money", name: "Money" },
  { id: "connected", name: "What's connected" },
  { id: "outside_view", name: "Outside view" },
]

// `label` is the verify page's words for the state. A passed line shows its
// proof label and date instead; a not_applicable line shows its reason.
export const STATES = [
  { id: "passed", meaning: "the rule holds on current facts", label: null, shows: "proof" },
  { id: "open", meaning: "no proof yet, or the rule does not hold", label: "Not yet", shows: "label" },
  { id: "expired", meaning: "the last pass is older than its validity", label: "Needs fresh proof", shows: "label" },
  { id: "drifted", meaning: "a live check now contradicts the last pass", label: "Changed since last check", shows: "label" },
  { id: "not_applicable", meaning: "allowed only where the control says so, with a stated reason", label: null, shows: "reason" },
]

// Strongest first (spec section 1 and decision 6).
export const PROOF_TYPES = [
  { id: "api", label: "Checked by API", what: "a read-only check of a connected Microsoft 365 or Google Workspace tenant" },
  { id: "dns", label: "Checked by lookup", what: "a public DNS or TLS lookup of a domain the owner has proven they control" },
  { id: "generated", label: "Made and dated here", what: "a document made and dated inside Data Hygienics (an IR plan, a policy, a drill record, a training record)" },
  { id: "document", label: "Document reviewed", what: "an uploaded document or screenshot, facts extracted by the Hygienist, extraction confirmed by a person in the review queue" },
  { id: "attested", label: "Owner attested", what: "the owner's dated statement, allowed only where the control lists it" },
]

// Industry overlays (spec section 7) and the written policies each requires
// for `written_program`. Every overlay starts from the base set.
export const OVERLAYS = ["general", "healthcare", "financial", "legal", "government", "retail"]
export const BASE_POLICIES = ["information_security", "acceptable_use", "ai_acceptable_use"]
export const OVERLAY_POLICIES = {
  general: [],
  healthcare: ["hipaa_risk_analysis", "hipaa_policies"],
  financial: ["wisp"],
  legal: [],
  government: [],
  retail: [],
}
export const POLICY_NAMES = {
  information_security: "information security policy",
  acceptable_use: "acceptable use policy",
  ai_acceptable_use: "AI acceptable use policy",
  wisp: "written information security program (WISP)",
  hipaa_risk_analysis: "HIPAA risk analysis",
  hipaa_policies: "HIPAA policies",
}

const TENANT = "no_tenant"

export const CONTROLS = [
  // ── Sign-in ──────────────────────────────────────────────────────────
  {
    id: "mfa",
    name: "Multi-factor authentication, in three tiers",
    group: "sign_in",
    promise: "Nobody signs in to our email, files or admin tools with a password alone.",
    question: "When someone signs in to your email from a new device, what happens after the password?",
    proof: [
      { type: "api", covers: "the tenant (enforcement state, exempt users, authentication strengths)", only: null },
      { type: "document", covers: "the systems outside the tenant (a settings page screenshot per system)", only: null },
      { type: "attested", covers: "only when no tenant is connected, and then the line says so", only: TENANT },
    ],
    rule: "mfa",
    validity: 90,
    drift: "tenant",
    refs: { nist: ["PR.AA-03"], cis: ["6.3", "6.4", "6.5"] },
    library: { controls: ["multi-factor-authentication"], guides: [] },
    insurer: [],
    tiers: [
      {
        tier: 1,
        name: "Tier 1",
        text: "MFA enforced for every user on the identity provider (Microsoft 365 or Google Workspace) and on every admin account. Microsoft Security Defaults count at this tier, so tenants without Conditional Access are not shut out. Google: 2-Step Verification enforced for all organizational units with no exempt users.",
      },
      {
        tier: 2,
        name: "Tier 2",
        text: "Tier 1, plus MFA on every other system that offers it: remote access, banking and payment portals, the password manager, payroll, the practice or case management system, and legacy sign-in blocked.",
      },
      {
        tier: 3,
        name: "Tier 3",
        text: "Phishing-resistant MFA for everyone: passkeys or FIDO2 security keys, Windows Hello for Business, or certificate-based sign-in, enforced through a Conditional Access authentication strength or Google's security-key-only setting.",
      },
    ],
  },
  {
    id: "admin_accounts",
    name: "Admin accounts are separate, few and named",
    group: "sign_in",
    promise: "The accounts that can change everything are not the accounts we read email on, and we know whose they are.",
    question: "Who can change settings for everyone, and do they use a separate account to do it?",
    proof: [
      { type: "api", covers: "global admin and super admin count, whether those accounts also hold a mailbox or license, last sign-in", only: null },
      { type: "document", covers: "systems outside the tenant", only: null },
      { type: "attested", covers: "only with no tenant", only: TENANT },
    ],
    rule: "admin_accounts",
    validity: 90,
    drift: "tenant",
    refs: { nist: ["PR.AA-05"], cis: ["5.4"] },
    library: { controls: ["access-control-policy", "access-review"], guides: [] },
    insurer: [],
  },
  {
    id: "legacy_signin",
    name: "Old sign-in methods are blocked",
    group: "sign_in",
    promise: "Nothing can sign in with just a password through an old protocol that skips MFA.",
    question: "Can an old email app or scanner still sign in with only a password?",
    proof: [
      { type: "api", covers: "Microsoft: basic authentication and legacy protocol state, or Security Defaults on; Google: less secure app access and app passwords disabled", only: null },
      { type: "attested", covers: "only with no tenant", only: TENANT },
    ],
    rule: "legacy_signin",
    validity: 90,
    drift: "tenant",
    refs: { nist: ["PR.AA-03"], cis: ["6.3"] },
    library: { controls: ["multi-factor-authentication"], guides: [] },
    insurer: [],
    notApplicableAllowed: true,
  },

  // ── Email ────────────────────────────────────────────────────────────
  {
    id: "email_auth",
    name: "Email that claims to be from us can be checked",
    group: "email",
    promise: "Other mail systems can tell our real mail from forgeries, and we told them to reject the forgeries.",
    question: "What is your domain's DMARC policy?",
    proof: [{ type: "dns", covers: "every sending domain the owner has proven they control (a one-time TXT challenge per domain)", only: null }],
    rule: "email_auth",
    validity: null,
    drift: "lookup",
    refs: { nist: ["PR.DS-02"], cis: ["9.5"] },
    library: { controls: ["email-authentication"], guides: [] },
    insurer: [],
  },
  {
    id: "email_protection",
    name: "Phishing and dangerous attachments are filtered before people see them",
    group: "email",
    promise: "A filter that checks links and attachments sits in front of every mailbox, and staff can report a suspicious message with one click.",
    question: "What checks a message for bad links or attachments before it reaches an inbox?",
    proof: [
      { type: "api", covers: "Microsoft Defender for Office 365 Safe Links and Safe Attachments policies, or Exchange Online Protection defaults with the preset security policy applied; Google: enhanced pre-delivery scanning and attachment protection on; the report-message feature state", only: null },
      { type: "document", covers: "a third-party filter (its policy page)", only: null },
      { type: "attested", covers: "only with neither", only: TENANT },
    ],
    rule: "email_protection",
    validity: 90,
    drift: "tenant",
    refs: { nist: ["PR.PS-05"], cis: ["9.6", "9.7"] },
    library: { controls: ["email-filtering", "email-reporting"], guides: [] },
    insurer: [],
  },

  // ── Devices ──────────────────────────────────────────────────────────
  {
    id: "endpoint_protection",
    name: "Every computer runs managed protection",
    group: "devices",
    promise: "Each computer we work on runs protection that someone can see from one console, and we know how many computers there are.",
    question: "How many computers does the business use, and what shows you they are all protected?",
    proof: [{ type: "document", covers: "the protection console's device list with counts and last-seen dates, against the device inventory the Hygienist collects", only: null }],
    rule: "endpoint_protection",
    validity: 180,
    drift: null,
    refs: { nist: ["DE.CM-09"], cis: ["10.1", "10.2"] },
    library: { controls: ["endpoint-protection"], guides: [] },
    insurer: [],
  },
  {
    id: "patching",
    name: "Updates install on their own, and nothing unsupported is in use",
    group: "devices",
    promise: "Operating systems and browsers update automatically, and we run nothing the maker stopped supporting.",
    question: "How do updates get installed, and is anything in use that its maker no longer supports?",
    proof: [
      { type: "document", covers: "the same console's OS version list, or a device-management report", only: null },
      { type: "attested", covers: "businesses under five devices, with the device inventory listed line by line", only: "under_five_devices" },
    ],
    rule: "patching",
    validity: 180,
    drift: null,
    refs: { nist: ["PR.PS-02"], cis: ["7.3", "7.4"] },
    library: { controls: ["patch-management"], guides: [] },
    insurer: [],
  },
  {
    id: "device_encryption",
    name: "Lost devices keep their data",
    group: "devices",
    promise: "A lost laptop or phone gives up nothing, and we can wipe it.",
    question: "If a laptop were left in a taxi tonight, what could the finder read?",
    proof: [
      { type: "document", covers: "BitLocker or FileVault status from the console, mobile device management enrollment with remote wipe", only: null },
      { type: "attested", covers: "businesses under five devices, line by line", only: "under_five_devices" },
    ],
    rule: "device_encryption",
    validity: 180,
    drift: null,
    refs: { nist: ["PR.DS-01"], cis: ["3.6"] },
    library: { controls: ["device-encryption", "remote-wipe"], guides: [] },
    insurer: [],
  },

  // ── Data ─────────────────────────────────────────────────────────────
  {
    id: "backups",
    name: "Backups exist off-site and have been restored on purpose",
    group: "data",
    promise: "A copy of what matters lives somewhere ransomware on our network cannot reach, and we have proved we can get it back.",
    question: "When did you last restore a file from backup to prove it works?",
    proof: [
      { type: "generated", covers: "the restore test when it is logged through the Hygienist's restore-test checklist", only: null },
      { type: "document", covers: "a backup job report dated within 30 days showing an off-site or immutable destination, and a restore test record dated within 12 months", only: null },
    ],
    rule: "backups",
    // The job report stands 90 days; the restore test stands 365 (the rule
    // applies the second).
    validity: 90,
    drift: null,
    refs: { nist: ["PR.DS-11", "RC.RP-03"], cis: ["11.2", "11.3", "11.4", "11.5"] },
    library: { controls: ["data-backup", "backup-testing"], guides: [] },
    insurer: [],
  },

  // ── People and access ────────────────────────────────────────────────
  {
    id: "access_lifecycle",
    name: "Access is granted on purpose and removed on time",
    group: "people_access",
    promise: "When someone leaves, their access ends within one business day, and every quarter we look at who still has what.",
    question: "When the last person left, how long did their email keep working?",
    proof: [
      { type: "api", covers: "accounts disabled in the period, last sign-in of disabled accounts, a list of enabled accounts for the review", only: null },
      { type: "generated", covers: "the quarterly access review completed through the Hygienist, listing every account and the owner's decision", only: null },
      { type: "document", covers: "an offboarding checklist with dates", only: null },
    ],
    rule: "access_lifecycle",
    validity: 90,
    drift: "tenant",
    refs: { nist: ["PR.AA-01", "PR.AA-05"], cis: ["5.1", "5.3", "6.1", "6.2"] },
    library: { controls: ["employee-offboarding", "access-review"], guides: [] },
    insurer: [],
  },
  {
    id: "credentials",
    name: "Passwords are unique and kept in a manager",
    group: "people_access",
    promise: "Nobody reuses a password across systems, because a manager makes each one and remembers it.",
    question: "Where do staff keep the passwords they cannot remember?",
    proof: [
      { type: "document", covers: "the password manager's admin console showing seats and enrollment", only: null },
      { type: "attested", covers: "businesses under five people, naming the manager", only: "under_five_people" },
    ],
    rule: "credentials",
    validity: 365,
    drift: null,
    refs: { nist: ["PR.AA-01"], cis: ["5.2"] },
    library: { controls: ["password-management"], guides: [] },
    insurer: [],
  },
  {
    id: "training",
    name: "Everyone has been trained in the last year, and we can show the record",
    group: "people_access",
    promise: "Every person who works here finished security training in the last twelve months, and we keep the completion record.",
    question: "When did the most recently hired person do their security training?",
    proof: [
      { type: "generated", covers: "completion records from Data Hygienics training, a 2027 add-on", only: null },
      { type: "document", covers: "completion records from another provider, with names and dates, matched against the staff list from control 10", only: null },
    ],
    rule: "training",
    validity: 365,
    drift: "tenant",
    refs: { nist: ["PR.AT-01"], cis: ["14.1", "14.2", "14.3", "14.4", "14.5", "14.6"] },
    library: { controls: ["security-training", "security-onboarding", "phishing-training"], guides: [] },
    insurer: [],
  },

  // ── Plans and papers ─────────────────────────────────────────────────
  {
    id: "incident_plan",
    name: "A written plan exists, with names, and was exercised this year",
    group: "plans_papers",
    promise: "If something happens at 9 p.m., the people who need to act know the plan and have practiced it.",
    question: "Who is the first person called when something looks wrong, and when did you last walk through the plan?",
    proof: [
      { type: "generated", covers: "an IR plan from the IR Plan Builder with named roles and contacts, and a tabletop completion record from its exercises", only: null },
      { type: "document", covers: "another plan, reviewed for the same fields", only: null },
    ],
    rule: "incident_plan",
    validity: 365,
    drift: null,
    refs: { nist: ["GV.RR-01", "RS.MA-01"], cis: ["17.1", "17.2", "17.3", "17.4"] },
    library: { controls: ["incident-response-plan", "emergency-contacts"], guides: [] },
    insurer: [],
  },
  {
    id: "written_program",
    name: "The written security program matches the business",
    group: "plans_papers",
    promise: "The policies we are asked for exist, say what we actually do, and were reviewed this year.",
    question: "Which written policy would you hand a client who asked for one?",
    proof: [
      { type: "generated", covers: "policies from the Policy Library: at minimum the information security policy, the acceptable use policy and the AI acceptable use policy, plus the industry one the overlay names", only: null },
      { type: "document", covers: "equivalent policies from elsewhere, reviewed for the required sections", only: null },
    ],
    rule: "written_program",
    validity: 365,
    drift: null,
    refs: { nist: ["GV.PO-01", "GV.PO-02"], cis: ["14.1"] },
    library: { controls: ["ai-acceptable-use", "data-classification", "byod-policy"], guides: [] },
    insurer: [],
  },

  // ── Money ────────────────────────────────────────────────────────────
  {
    id: "payment_verification",
    name: "Nobody moves money on an email alone, and we have practiced saying no",
    group: "money",
    promise: "A change of bank details or a new payee is confirmed by a call to a number we already had, every time, and we have drilled it.",
    question: "If the owner emailed the bookkeeper today asking for an urgent wire, what would the bookkeeper do?",
    proof: [
      { type: "generated", covers: "the written rule from the payment verification module and a dated fraud drill record with the outcome", only: null },
      { type: "document", covers: "a written procedure from elsewhere, plus the drill record", only: null },
    ],
    rule: "payment_verification",
    validity: 365,
    drift: null,
    refs: { nist: ["GV.RR-04", "PR.AA-06"], cis: ["14.2"] },
    library: { controls: ["out-of-band-verification"], guides: ["two-channel-verification-for-payments"] },
    insurer: [],
  },

  // ── What's connected ─────────────────────────────────────────────────
  {
    id: "connected_apps",
    name: "We know every app and AI tool with access to our mail and files",
    group: "connected",
    promise: "Every third-party app and AI connector that can read our mail, files or calendar is on a list we reviewed, and nobody can add one without an admin.",
    question: "Which apps and AI tools can read your email or files right now, without anyone typing a password?",
    proof: [
      { type: "api", covers: "Microsoft: enterprise applications and user consent settings, with granted permissions; Google: connected third-party apps and the setting that restricts unreviewed apps", only: null },
      { type: "generated", covers: "the AI tools inventory completed through the Hygienist, from the Cyber Audit's AI Use section", only: null },
      { type: "attested", covers: "only with no tenant, for the inventory alone", only: TENANT },
    ],
    rule: "connected_apps",
    validity: 90,
    drift: "tenant",
    refs: { nist: ["ID.AM-02", "PR.AA-05", "GV.SC-04"], cis: ["2.1", "2.3", "15.1"] },
    library: { controls: ["vendor-risk-management", "ai-acceptable-use"], guides: ["lock-down-your-ai-assistants"] },
    insurer: [],
  },

  // ── Outside view ─────────────────────────────────────────────────────
  {
    id: "external_exposure",
    name: "Nothing of ours is open to the internet that should not be",
    group: "outside_view",
    promise: "No remote desktop, file share or admin page of ours answers to strangers, and our domain and website are locked down.",
    question: "Can someone on the internet reach a remote desktop or file share of yours by typing an address?",
    proof: [
      { type: "dns", covers: "outside-in lookups against domains and addresses the owner has proven they control, and only those: TLS on the website, security headers, the registrar lock state, DNS records that point at remote access services, and a port check of the business's own public address, run only after a consent step that names the address", only: null },
      { type: "attested", covers: "the registrar account's MFA", only: null },
    ],
    rule: "external_exposure",
    validity: null,
    drift: "lookup",
    refs: { nist: ["ID.AM-01", "PR.IR-01"], cis: ["4.4", "12.2", "13.10"] },
    library: { controls: ["firewall-management", "vpn-remote-access", "network-monitoring"], guides: [] },
    insurer: [],
  },
]

export const CONTROL_IDS = CONTROLS.map((c) => c.id)
export const CONTROLS_BY_ID = Object.fromEntries(CONTROLS.map((c) => [c.id, c]))
export const PROOF_ORDER = PROOF_TYPES.map((p) => p.id)
export const STATE_IDS = STATES.map((s) => s.id)

// The policies `written_program` requires for an overlay. Unknown overlays
// fall back to general.
export function requiredPolicies(overlay) {
  return [...BASE_POLICIES, ...(OVERLAY_POLICIES[overlay] || OVERLAY_POLICIES.general)]
}
