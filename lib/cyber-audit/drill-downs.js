/**
 * Product-specific drill-down questions.
 *
 * These are conditional follow-ups that appear when a parent question is
 * answered. They are industry-agnostic because the products they collect
 * (MFA solutions, EDR vendors, backup platforms, etc.) are the same across
 * industries.
 *
 * The drill-downs are keyed by `domain` (matching the parent question's
 * `domain` or `tooltip.controlSlug` keyword). They carry `scored: false` so
 * they never affect the overall score. They exist to collect the specific
 * details insurance carriers need.
 *
 * The comprehensive assessment renderer reads these via `getDrillDownsForQuestion`
 * which inspects a parent question and returns the matching drill-down group
 * if any.
 */

export const DRILL_DOWNS = {
  mfa: {
    domain: "mfa",
    matchKeywords: ["mfa", "multi-factor", "multifactor"],
    trigger: (answer) => {
      if (typeof answer !== "string") return false
      const lower = answer.toLowerCase()
      if (lower.includes("don't know")) return false
      // Show drill-downs when any form of MFA is in place
      return !lower.startsWith("no") && !lower.includes("not use")
    },
    questions: [
      {
        key: "_dd_mfa_product",
        text: "What MFA solution does your organization use?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Microsoft Authenticator", weight: 0 },
          { label: "Duo Security", weight: 0 },
          { label: "Okta Verify", weight: 0 },
          { label: "Google Authenticator", weight: 0 },
          { label: "Authy (Twilio)", weight: 0 },
          { label: "YubiKey or hardware token", weight: 0 },
          {
            label: "SMS or text message codes only",
            weight: 0,
            riskFlag: "medium",
            riskNote:
              "SMS-based MFA is vulnerable to SIM swapping attacks. App-based or hardware MFA is recommended.",
          },
          { label: "Other", weight: 0 },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
        tooltip: {
          explanation:
            "Different MFA solutions offer different levels of security. Hardware tokens and authenticator apps are stronger than SMS codes.",
          insurerNote:
            "Some carriers specifically ask which MFA method is used. SMS-only MFA may receive a lower score.",
        },
      },
      {
        key: "_dd_mfa_coverage",
        text: "Which systems is MFA enforced on today?",
        type: "multiselect",
        scored: false,
        options: [
          { label: "Email", weight: 0 },
          { label: "VPN / Remote access", weight: 0 },
          { label: "Cloud apps (Microsoft 365, Google Workspace)", weight: 0 },
          { label: "Financial / banking systems", weight: 0 },
          { label: "Admin consoles", weight: 0 },
          { label: "All of the above", weight: 0 },
          { label: "None", weight: 0 },
        ],
      },
    ],
  },

  endpoint: {
    domain: "endpoint",
    matchKeywords: ["endpoint", "edr", "xdr", "antivirus"],
    trigger: (answer) => typeof answer === "string" && !answer.toLowerCase().includes("don't know"),
    questions: [
      {
        key: "_dd_edr_product",
        text: "Which endpoint protection product do you use?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "CrowdStrike Falcon", weight: 0 },
          { label: "SentinelOne", weight: 0 },
          { label: "Microsoft Defender for Endpoint / for Business", weight: 0 },
          { label: "Sophos Intercept X", weight: 0 },
          { label: "Bitdefender GravityZone", weight: 0 },
          { label: "Webroot", weight: 0 },
          { label: "Traditional antivirus (brand not listed)", weight: 0, riskFlag: "medium" },
          { label: "Built-in Windows Defender Antivirus only", weight: 0, riskFlag: "medium" },
          { label: "Other", weight: 0 },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
      {
        key: "_dd_edr_tier",
        text: "What tier or license level are you on?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Managed Detection and Response (MDR) or XDR", weight: 0 },
          { label: "Full EDR with threat hunting", weight: 0 },
          { label: "Basic EDR", weight: 0 },
          { label: "Antivirus only (no EDR features)", weight: 0 },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
    ],
  },

  backup: {
    domain: "backup",
    matchKeywords: ["backup", "disaster", "restore", "recovery"],
    trigger: (answer) => typeof answer === "string" && !answer.toLowerCase().includes("don't know"),
    questions: [
      {
        key: "_dd_backup_product",
        text: "What backup solution do you use?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Veeam", weight: 0 },
          { label: "Datto", weight: 0 },
          { label: "Acronis", weight: 0 },
          { label: "Backblaze", weight: 0 },
          { label: "Carbonite", weight: 0 },
          { label: "AWS / Azure / Google Cloud backup", weight: 0 },
          { label: "External drive only", weight: 0, riskFlag: "medium" },
          { label: "Other", weight: 0 },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
      {
        key: "_dd_backup_last_restore_test",
        text: "When did you last test a restore from backup?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Within the past 3 months", weight: 0 },
          { label: "Within the past 6 months", weight: 0 },
          { label: "Within the past year", weight: 0 },
          { label: "More than a year ago", weight: 0, riskFlag: "medium" },
          { label: "We have never tested a restore", weight: 0, riskFlag: "high" },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
    ],
  },

  email: {
    domain: "email",
    matchKeywords: ["email", "phishing", "dmarc"],
    trigger: (answer) => typeof answer === "string" && !answer.toLowerCase().includes("don't know"),
    questions: [
      {
        key: "_dd_email_filter_product",
        text: "What email filtering or anti-phishing product do you use?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Microsoft Defender for Office 365", weight: 0 },
          { label: "Google Workspace advanced protection", weight: 0 },
          { label: "Proofpoint Essentials", weight: 0 },
          { label: "Mimecast", weight: 0 },
          { label: "Barracuda", weight: 0 },
          { label: "Abnormal Security", weight: 0 },
          { label: "Default platform filtering only", weight: 0, riskFlag: "medium" },
          { label: "Other", weight: 0 },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
      {
        key: "_dd_email_dmarc",
        text: "Is DMARC configured for your domain?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Yes, with policy set to quarantine or reject", weight: 0 },
          { label: "Yes, but policy is set to none (monitor only)", weight: 0, riskFlag: "medium" },
          { label: "Not configured", weight: 0, riskFlag: "high" },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
    ],
  },

  incident_response: {
    domain: "incident_response",
    matchKeywords: ["incident", "response", "ir-plan"],
    trigger: (answer) => typeof answer === "string" && !answer.toLowerCase().includes("don't know"),
    questions: [
      {
        key: "_dd_ir_primary_contact",
        text: "Who is the primary contact in your incident response plan?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "A named internal employee", weight: 0 },
          { label: "Our IT / managed service provider", weight: 0 },
          { label: "A dedicated incident response firm on retainer", weight: 0 },
          { label: "We do not have a primary contact defined", weight: 0, riskFlag: "high" },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
      {
        key: "_dd_ir_insurance_awareness",
        text: "Does your cyber insurance carrier know about your incident response plan?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Yes, and they have approved it as part of our policy", weight: 0 },
          { label: "Yes, but it is not formally part of our policy", weight: 0 },
          { label: "No, they have not seen it", weight: 0 },
          { label: "We do not have cyber insurance", weight: 0 },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
    ],
  },

  patching: {
    domain: "patching",
    matchKeywords: ["patch", "update", "vulnerability"],
    trigger: (answer) => typeof answer === "string" && !answer.toLowerCase().includes("don't know"),
    questions: [
      {
        key: "_dd_patching_automation",
        text: "How are patches applied?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Fully automated via an RMM or patch management tool", weight: 0 },
          { label: "Partially automated with manual review", weight: 0 },
          { label: "Manually applied by IT staff", weight: 0 },
          { label: "Users apply their own updates", weight: 0, riskFlag: "medium" },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
      {
        key: "_dd_patching_tool",
        text: "What tool manages patching in your environment?",
        type: "singleselect",
        scored: false,
        options: [
          { label: "Microsoft Intune / WSUS / Configuration Manager", weight: 0 },
          { label: "Automox", weight: 0 },
          { label: "NinjaOne", weight: 0 },
          { label: "ConnectWise Automate", weight: 0 },
          { label: "Kaseya VSA", weight: 0 },
          { label: "None (manual patching)", weight: 0, riskFlag: "medium" },
          { label: "Other", weight: 0 },
          { label: "I don't know", weight: 0, flag: "discovery" },
        ],
      },
    ],
  },
}

/**
 * Given a parent question, return the drill-down group that applies to it,
 * or null. Matches by (1) explicit `domain` field on the question or
 * (2) keyword match against `tooltip.controlSlug`.
 */
export function getDrillDownsForQuestion(question) {
  if (!question) return null

  if (question.domain && DRILL_DOWNS[question.domain]) {
    return DRILL_DOWNS[question.domain]
  }

  const slug = (question.tooltip?.controlSlug || "").toLowerCase()
  if (!slug) return null

  for (const group of Object.values(DRILL_DOWNS)) {
    if (group.matchKeywords.some((k) => slug.includes(k))) {
      return group
    }
  }
  return null
}

/**
 * Given a parent question and its current answer, return the drill-down
 * questions that should be rendered right now. Returns an empty array if
 * no drill-downs apply or the trigger condition is not satisfied.
 */
export function getActiveDrillDowns(question, answer) {
  const group = getDrillDownsForQuestion(question)
  if (!group) return []
  if (group.trigger && !group.trigger(answer)) return []
  return group.questions
}
