// The rules engine's predicates: one per control, each a pure function of a
// plain facts object. The rules alone decide whether a control's facts hold;
// nothing AI-shaped, no network, no database. lib/verified/evaluate.js turns
// a rule's result into a state.
//
// ── The facts object ─────────────────────────────────────────────────────
// {
//   context: {
//     tenant: "m365" | "google" | null   a connected tenant (makes `api` available)
//     cloudIdentity: boolean             the business uses Microsoft 365 or Google Workspace at all
//     deviceCount: number                the device inventory the Hygienist collects
//     staffCount: number                 people who work here (the staff list from control 10)
//     overlay: "general" | "healthcare" | "financial" | "legal" | "government" | "retail"
//     systems: [{ id, name, supportsMfa }]  the system inventory gathered with control 10
//   },
//   [controlId]: { [proofType]: { ...facts from that proof } },
// }
//
// Facts are summaries (counts, states, dates), never names, lists of people
// or raw responses. Every proof carries `asOf`, the day it speaks for: the
// day of the check, of the reviewed document, of the generated record or of
// the owner's statement.
//
// ── What a rule returns ──────────────────────────────────────────────────
// { ok, tier, proofType, proofs, passedAt, validUntil, reason, notApplicable? }
//   ok          the facts satisfy the control
//   tier        the MFA tier reached (0 to 3); null for every other control
//   proofs      the proof types the pass rests on, strongest first
//   proofType   the weakest of those, so the public label never claims more
//               than was checked
//   passedAt    the newest proof day the pass rests on
//   validUntil  the earliest day a proof it rests on runs out (validity, or
//               the live-check grace for continuous controls)
//
// ── Proof acceptance (spec section 1 and decision 3) ─────────────────────
// `pick` walks a control's `proof` list strongest first and takes the first
// method present whose `only` condition holds. A connected tenant makes
// `api` available, so weaker proof for a tenant component is refused until
// the check runs. A generated record, when present, is used ahead of an
// uploaded document even if it fails: the weaker proof is not accepted once
// the stronger exists. Methods a control does not list (owner attestation
// for endpoint_protection, access_lifecycle and payment_verification) are
// refused outright.
import {
  CONTROLS_BY_ID,
  PROOF_ORDER,
  PROOF_TYPES,
  MFA_MINIMUM_TIER,
  LIVE_CHECK_GRACE_DAYS,
  requiredPolicies,
  POLICY_NAMES,
} from "./baseline.js"
import { addDays, daysBetween, earliest, latest, toDay } from "./dates.js"

const LABEL = Object.fromEntries(PROOF_TYPES.map((p) => [p.id, p.label]))

const CONDITION = {
  no_tenant: { holds: (ctx) => !ctx.tenant, text: "only when no tenant is connected" },
  under_five_devices: { holds: (ctx) => Number.isFinite(ctx.deviceCount) && ctx.deviceCount < 5, text: "only for businesses with fewer than five devices" },
  under_five_people: { holds: (ctx) => Number.isFinite(ctx.staffCount) && ctx.staffCount < 5, text: "only for businesses with fewer than five people" },
}

const WAITING = "The tenant is connected, so this line waits for its check. Weaker proof is not accepted while a tenant is connected."

// Microsoft's published guidance recommends fewer than five global admins.
// Cite the page and its date before this number appears anywhere public.
export const MAX_GLOBAL_ADMINS = 4

const isNum = (v) => Number.isFinite(v)
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// The strongest accepted proof present for a control, or for one component
// of it. Returns { type, value } or { type: null, reason }.
export function pick(facts, id, { component, types } = {}) {
  const control = CONTROLS_BY_ID[id]
  const ctx = facts?.context || {}
  const own = facts?.[id] || {}
  const get = (type) => {
    const v = own[type]
    if (v == null) return null
    return component ? (v[component] ?? null) : v
  }
  let refusal = null
  for (const p of control.proof) {
    if (types && !types.includes(p.type)) continue
    const value = get(p.type)
    const condition = p.only ? CONDITION[p.only] : null
    if (condition && !condition.holds(ctx)) {
      if (value != null && !refusal) refusal = `${LABEL[p.type]} is accepted here ${condition.text}.`
      continue
    }
    if (value != null) return { type: p.type, value }
    if (p.type === "api" && ctx.tenant) return { type: null, reason: WAITING }
  }
  if (!refusal) {
    const stray = PROOF_ORDER.find((t) => own[t] != null && !control.proof.some((p) => p.type === t))
    if (stray) refusal = `${LABEL[stray]} is not accepted for this control.`
  }
  return { type: null, reason: refusal || "No proof yet." }
}

function fail(reason, extra = {}) {
  return { ok: false, tier: null, proofType: null, proofs: [], passedAt: null, validUntil: null, reason, ...extra }
}

// dates: proof days governed by the control's validity (or the live-check
// grace when validity is null). expiries: explicit end days for proofs with
// their own validity. seen: other proof days with no expiry of their own.
function passed(id, { proofs, dates = [], expiries = [], seen = [], tier = null, reason = null }) {
  const control = CONTROLS_BY_ID[id]
  // An undated proof could never run out, so it is no proof.
  if ([...dates, ...seen, ...expiries.flatMap((e) => [e.from, e.until])].some((d) => !toDay(d)))
    return fail("A proof this line rests on carries no date.", { tier })
  const span = control.validity ?? LIVE_CHECK_GRACE_DAYS
  const ordered = PROOF_ORDER.filter((t) => proofs.includes(t))
  return {
    ok: true,
    tier,
    proofType: ordered[ordered.length - 1] || null,
    proofs: ordered,
    passedAt: latest([...dates, ...seen, ...expiries.map((e) => e.from)]),
    validUntil: earliest([...dates.map((d) => addDays(d, span)), ...expiries.map((e) => e.until)]),
    reason,
  }
}

// ── 1. mfa ───────────────────────────────────────────────────────────────
// facts.mfa.api       { asOf, provider: "m365" | "google", securityDefaults,
//                       mfaAllUsers, mfaAllAdmins, exemptUsers,
//                       phishingResistantAllUsers }
//                     Google: mfaAllUsers is 2-Step Verification enforced for
//                     all organizational units; phishingResistantAllUsers is
//                     the security-key-only setting for everyone.
// facts.mfa.document  { systems: { [systemId]: { asOf, mfaOn } } }  systems outside the tenant
// facts.mfa.attested  { asOf, mfaAllUsers, mfaAllAdmins }           only with no tenant
// context.systems     the inventory; each `supportsMfa` system needs a document for Tier 2
// Tier 1: the tenant enforces MFA for all users and admins with zero
// exemptions, or Security Defaults is on. Tier 2: Tier 1, current proof for
// every listed system that supports MFA, and legacy_signin holding. Tier 3:
// Tier 2 and a phishing-resistant policy for all users (API only). The
// control passes at MFA_MINIMUM_TIER. `now` drops system documents older than
// the validity, which lowers the tier rather than expiring the control.
export function mfa(facts, { now } = {}) {
  const ctx = facts?.context || {}
  const basis = pick(facts, "mfa", { types: ["api", "attested"] })
  if (!basis.type) return fail(basis.reason, { tier: 0 })
  const b = basis.value
  const tierOne =
    basis.type === "api"
      ? b.securityDefaults === true || (b.mfaAllUsers === true && b.mfaAllAdmins === true && b.exemptUsers === 0)
      : b.mfaAllUsers === true && b.mfaAllAdmins === true
  if (!tierOne) {
    let reason = "The statement does not say MFA is enforced for every user and every admin."
    if (basis.type === "api") {
      if (isNum(b.exemptUsers) && b.exemptUsers > 0) reason = `${plural(b.exemptUsers, "account is", "accounts are")} exempt from MFA.`
      else if (b.mfaAllUsers !== true) reason = "MFA is not enforced for every user."
      else if (b.mfaAllAdmins !== true) reason = "MFA is not enforced for every admin account."
      else reason = "The check could not confirm MFA enforcement."
    }
    return fail(reason, { tier: 0 })
  }

  let tier = 1
  const proofs = [basis.type]
  let next = null
  const systems = ctx.systems
  const docs = facts?.mfa?.document?.systems || {}
  const validity = CONTROLS_BY_ID.mfa.validity
  if (!Array.isArray(systems)) next = "Tier 2 needs the system inventory from the access review."
  else {
    const needed = systems.filter((s) => s.supportsMfa)
    const missing = needed.filter((s) => {
      const d = docs[s.id]
      if (!d || d.mfaOn !== true || !toDay(d.asOf)) return true
      return Boolean(now) && daysBetween(d.asOf, now) > validity
    })
    const legacy = legacy_signin(facts)
    if (missing.length) next = `Tier 2 needs current proof of MFA on ${missing.map((s) => s.name || s.id).join(", ")}.`
    else if (!legacy.ok && !legacy.notApplicable) next = "Tier 2 also needs old sign-in methods blocked."
    else {
      tier = 2
      if (needed.length) proofs.push("document")
      if (basis.type !== "api") next = "Tier 3 is checked only through a connected tenant."
      else if (b.phishingResistantAllUsers !== true) next = "Tier 3 needs phishing-resistant sign-in enforced for every user."
      else tier = 3
    }
  }
  if (tier < MFA_MINIMUM_TIER) return fail(`Tier ${tier} reached; the minimum is Tier ${MFA_MINIMUM_TIER}.`, { tier })
  const how = basis.type === "api" && b.securityDefaults === true ? " Security Defaults is on." : ""
  return passed("mfa", { proofs, dates: [b.asOf], tier, reason: `Tier ${tier} reached.${how}${next ? ` ${next}` : ""}` })
}

// ── 2. admin_accounts ────────────────────────────────────────────────────
// facts.admin_accounts.api       { asOf, admins: [{ shared, dedicated, mailbox, breakGlass }] }
// facts.admin_accounts.document  same shape, read from a screenshot (no tenant connected)
// facts.admin_accounts.attested  same shape, the owner's statement (no tenant)
// At most MAX_GLOBAL_ADMINS, none shared, each a dedicated account without a
// mailbox or a documented break-glass account, and MFA at Tier 1 or above.
export function admin_accounts(facts, opts = {}) {
  const p = pick(facts, "admin_accounts")
  if (!p.type) return fail(p.reason)
  const admins = p.value.admins
  if (!Array.isArray(admins) || !admins.length) return fail("The proof lists no admin accounts.")
  if (admins.length > MAX_GLOBAL_ADMINS) return fail(`There are ${admins.length} global admins; the baseline allows at most ${MAX_GLOBAL_ADMINS}.`)
  if (admins.some((a) => a.shared === true)) return fail("An admin account is shared by more than one person.")
  if (admins.some((a) => a.breakGlass !== true && !(a.dedicated === true && a.mailbox === false)))
    return fail("An admin account is also an everyday account or holds a mailbox.")
  if (mfa(facts, opts).tier < 1) return fail("Admin accounts need MFA at Tier 1 or above.")
  return passed("admin_accounts", { proofs: [p.type], dates: [p.value.asOf] })
}

// ── 3. legacy_signin ─────────────────────────────────────────────────────
// facts.legacy_signin.api       { asOf, securityDefaults, legacyBlocked, exceptions }
//                               Google: legacyBlocked is less secure apps off and app passwords disabled
// facts.legacy_signin.attested  { asOf, legacyBlocked }  only with no tenant
// facts.legacy_signin.notApplicable  { reason }  optional wording for the line
// Not applicable when context.cloudIdentity is false and no tenant is
// connected: there is no cloud sign-in to block.
export function legacy_signin(facts) {
  const ctx = facts?.context || {}
  if (ctx.cloudIdentity === false && !ctx.tenant) {
    const reason = facts?.legacy_signin?.notApplicable?.reason || "No cloud identity provider, so there is no old sign-in to block."
    return fail(reason, { notApplicable: true })
  }
  const p = pick(facts, "legacy_signin")
  if (!p.type) return fail(p.reason)
  const v = p.value
  if (p.type === "api") {
    if (v.securityDefaults !== true) {
      if (v.legacyBlocked !== true) return fail("Old sign-in methods are not blocked tenant-wide.")
      if (v.exceptions !== 0) return fail(`${plural(v.exceptions, "account has", "accounts have")} an exception that allows old sign-in.`)
    }
  } else if (v.legacyBlocked !== true) return fail("The statement does not say old sign-in methods are blocked.")
  return passed("legacy_signin", { proofs: [p.type], dates: [v.asOf] })
}

// ── 4. email_auth ────────────────────────────────────────────────────────
// facts.email_auth.dns  { asOf, domains: [{ domain, proven, spfRecords, spfAll,
//                         dmarcPolicy, dmarcPct, dmarcRua, dkimSelectors }] }
//   spfAll: "-all" | "~all" | "?all" | "+all" | null
//   dmarcPolicy: "none" | "quarantine" | "reject" | null (no record)
//   dmarcPct: number, or null when the record omits it (DMARC's default is 100)
//   dmarcRua: true when a reporting address is published
//   dkimSelectors: DKIM keys found for the primary sending service
// Every sending domain proven and passing; DNS lookup only.
export function emailDomainProblems(d) {
  const at = d.domain ? `On ${d.domain}, ` : ""
  const out = []
  if (d.proven !== true) out.push({ key: "proven", sentence: `${at}this domain is not proven to be yours yet.` })
  if (d.spfRecords !== 1)
    out.push({ key: "spf_count", sentence: d.spfRecords > 1 ? `${at}more than one SPF record is published, so receivers ignore them.` : `${at}no SPF record is published.` })
  else if (!["-all", "~all"].includes(d.spfAll)) out.push({ key: "spf_all", sentence: `${at}the SPF record does not end in -all or ~all.` })
  if (!["quarantine", "reject"].includes(d.dmarcPolicy))
    out.push({ key: "dmarc_policy", sentence: d.dmarcPolicy ? `${at}the DMARC policy is p=${d.dmarcPolicy}, which does not ask receivers to reject forgeries.` : `${at}no DMARC record is published.` })
  else if ((d.dmarcPct ?? 100) !== 100) out.push({ key: "dmarc_pct", sentence: `${at}the DMARC policy covers only part of the mail (pct below 100).` })
  if (d.dmarcPolicy && d.dmarcRua !== true) out.push({ key: "dmarc_rua", sentence: `${at}the DMARC record names no reporting address.` })
  if (!(d.dkimSelectors >= 1)) out.push({ key: "dkim", sentence: `${at}no DKIM key was found for the main sending service.` })
  return out
}

export function email_auth(facts) {
  const p = pick(facts, "email_auth")
  if (!p.type) return fail(p.reason)
  const domains = p.value.domains
  if (!Array.isArray(domains) || !domains.length) return fail("No sending domain has been looked up yet.")
  const problems = domains.flatMap(emailDomainProblems)
  if (problems.length) return fail(capitalize(problems[0].sentence))
  return passed("email_auth", { proofs: [p.type], dates: [p.value.asOf] })
}

// ── 5. email_protection ──────────────────────────────────────────────────
// facts.email_protection.api       { asOf, linkScanning, attachmentScanning, reportButton, outsideFilter }
//   linkScanning / attachmentScanning: a policy applied to all users
//   outsideFilter: the tenant routes inbound mail through a third-party filter
// facts.email_protection.document  { asOf, linkScanning, attachmentScanning, reportButton }  third-party filter
// facts.email_protection.attested  same, only with no tenant and no document
// With a tenant, the API decides; a third-party filter's document is read
// only when the tenant shows mail arrives through an outside filter.
export const filterGap = (v) =>
  v.linkScanning !== true
    ? "Links are not checked for every mailbox."
    : v.attachmentScanning !== true
      ? "Attachments are not checked for every mailbox."
      : v.reportButton !== true
        ? "Staff have no one-click way to report a suspicious message."
        : null

export function email_protection(facts) {
  const p = pick(facts, "email_protection")
  if (!p.type) return fail(p.reason)
  const gap = filterGap(p.value)
  if (!gap) return passed("email_protection", { proofs: [p.type], dates: [p.value.asOf] })
  const doc = facts?.email_protection?.document
  if (p.type === "api" && p.value.outsideFilter === true && doc) {
    const docGap = filterGap(doc)
    if (!docGap) return passed("email_protection", { proofs: ["document"], dates: [doc.asOf] })
    return fail(docGap)
  }
  return fail(gap)
}

// ── 6. endpoint_protection ───────────────────────────────────────────────
// facts.endpoint_protection.document  { asOf, consoleDevices, protectionOff, notSeen30Days }
// context.deviceCount                 the inventory the console count must equal
// Document only in 2027.1; owner attestation is never accepted.
export function endpoint_protection(facts) {
  const ctx = facts?.context || {}
  const p = pick(facts, "endpoint_protection")
  if (!p.type) return fail(p.reason)
  const v = p.value
  if (!isNum(ctx.deviceCount) || ctx.deviceCount < 1) return fail("The device inventory is missing.")
  if (v.consoleDevices !== ctx.deviceCount)
    return fail(`The console shows ${plural(v.consoleDevices ?? 0, "device", "devices")} and the inventory lists ${ctx.deviceCount}.`)
  if (v.protectionOff !== 0) return fail("A device has protection turned off.")
  if (v.notSeen30Days !== 0) return fail("A device has not checked in to the console in the last 30 days.")
  return passed("endpoint_protection", { proofs: [p.type], dates: [v.asOf] })
}

// ── 7. patching ──────────────────────────────────────────────────────────
// facts.patching.document  { asOf, devices, unsupported, autoUpdatesOff, over60DaysBehind }
// facts.patching.attested  { asOf, lines: [{ supported, autoUpdates, over60DaysBehind }] }
//                          under five devices, one line per inventory device
export function patching(facts) {
  const ctx = facts?.context || {}
  const p = pick(facts, "patching")
  if (!p.type) return fail(p.reason)
  const v = p.value
  if (p.type === "attested") {
    if (!Array.isArray(v.lines) || v.lines.length !== ctx.deviceCount) return fail("The statement must list every device in the inventory, one line each.")
    if (v.lines.some((l) => l.supported !== true)) return fail("A device runs a version its maker no longer supports.")
    if (v.lines.some((l) => l.autoUpdates !== true)) return fail("A device does not install updates on its own.")
    if (v.lines.some((l) => l.over60DaysBehind === true)) return fail("A device is more than 60 days behind the current release.")
  } else {
    if (isNum(ctx.deviceCount) && !(v.devices >= ctx.deviceCount)) return fail("The report does not cover every device in the inventory.")
    if (v.unsupported !== 0) return fail("A device runs a version its maker no longer supports.")
    if (v.autoUpdatesOff !== 0) return fail("A device does not install updates on its own.")
    if (v.over60DaysBehind !== 0) return fail("A device is more than 60 days behind the current release.")
  }
  return passed("patching", { proofs: [p.type], dates: [v.asOf] })
}

// ── 8. device_encryption ─────────────────────────────────────────────────
// facts.device_encryption.document  { asOf, laptops, laptopsEncrypted, mailPhones, mailPhonesWipeable }
// facts.device_encryption.attested  { asOf, lines: [{ kind: "laptop" | "phone" | "other",
//                                     encrypted, holdsMail, remoteWipe }] }  under five devices
export function device_encryption(facts) {
  const ctx = facts?.context || {}
  const p = pick(facts, "device_encryption")
  if (!p.type) return fail(p.reason)
  const v = p.value
  if (p.type === "attested") {
    if (!Array.isArray(v.lines) || v.lines.length !== ctx.deviceCount) return fail("The statement must list every device in the inventory, one line each.")
    if (v.lines.some((l) => l.kind === "laptop" && l.encrypted !== true)) return fail("A laptop is not encrypted.")
    if (v.lines.some((l) => l.kind === "phone" && l.holdsMail === true && l.remoteWipe !== true)) return fail("A phone with business mail cannot be wiped remotely.")
  } else {
    if (!isNum(v.laptops) || v.laptopsEncrypted !== v.laptops) return fail("A laptop is not encrypted.")
    if (!isNum(v.mailPhones) || v.mailPhonesWipeable !== v.mailPhones) return fail("A phone with business mail cannot be wiped remotely.")
  }
  return passed("device_encryption", { proofs: [p.type], dates: [v.asOf] })
}

// ── 9. backups ───────────────────────────────────────────────────────────
// facts.backups.document   { report: { asOf, offsite, lastSuccessAt },
//                            restoreTest: { asOf, succeeded } }
// facts.backups.generated  { restoreTest: { asOf, succeeded } }  logged through the restore-test checklist
//   offsite: an off-site or immutable destination
// The report shows a successful job within 30 days of its date and stands
// 90 days; the restore test stands 365 days. A generated restore test is
// used ahead of an uploaded one.
const RESTORE_TEST_DAYS = 365
export function backups(facts) {
  const report = pick(facts, "backups", { component: "report", types: ["document"] })
  if (!report.type) return fail(report.reason === "No proof yet." ? "No backup job report yet." : report.reason)
  const r = report.value
  if (r.offsite !== true) return fail("The backup report shows no off-site or immutable copy.")
  const gap = daysBetween(r.lastSuccessAt, r.asOf)
  if (gap == null || gap < 0 || gap > 30) return fail("The report shows no successful backup job in the 30 days before it.")
  const test = pick(facts, "backups", { component: "restoreTest" })
  if (!test.type) return fail("No restore test on record.")
  if (test.value.succeeded !== true) return fail("The last restore test did not succeed.")
  return passed("backups", {
    proofs: [report.type, test.type],
    dates: [r.asOf],
    expiries: [{ from: test.value.asOf, until: addDays(test.value.asOf, RESTORE_TEST_DAYS) }],
  })
}

// ── 10. access_lifecycle ─────────────────────────────────────────────────
// facts.access_lifecycle.api        { asOf, enabledAccounts, lateDisables,
//                                     markedForRemovalStillEnabled, newAccountsUntrained }
//   lateDisables: departed people's accounts left enabled more than one business day
//   newAccountsUntrained: accounts over 30 days old with no training completion (read by `training`)
// facts.access_lifecycle.generated  { asOf, accountsReviewed, accountsEnabled, lateDepartures }
//   the quarterly access review; accountsEnabled is the owner's count, used when no tenant is connected
// facts.access_lifecycle.document   { asOf, lateDepartures }  an offboarding checklist
// A review in the last 90 days covering every enabled account, and no
// departed person's account left enabled late. A late departure shown by
// any proof present fails the line.
export function access_lifecycle(facts) {
  const ctx = facts?.context || {}
  const own = facts?.access_lifecycle || {}
  if (own.attested) return fail("Owner attested is not accepted for this control.")
  const review = own.generated
  if (!review) return fail("No access review yet. The quarterly review runs through the Hygienist.")
  const proofs = ["generated"]
  const dates = [review.asOf]
  let enabled = review.accountsEnabled
  if (ctx.tenant) {
    const api = pick(facts, "access_lifecycle", { types: ["api"] })
    if (!api.type) return fail(api.reason)
    enabled = api.value.enabledAccounts
    proofs.push("api")
    dates.push(api.value.asOf)
    if (api.value.markedForRemovalStillEnabled > 0)
      return fail(`${plural(api.value.markedForRemovalStillEnabled, "account", "accounts")} the last review marked for removal ${api.value.markedForRemovalStillEnabled === 1 ? "is" : "are"} still enabled.`)
    if (api.value.lateDisables !== 0) return fail("An account for someone who left stayed enabled more than one business day.")
  }
  if (!isNum(enabled) || !(review.accountsReviewed >= enabled)) return fail("The access review does not cover every enabled account.")
  if (review.lateDepartures !== 0 || (own.document && own.document.lateDepartures !== 0))
    return fail("An account for someone who left stayed enabled more than one business day.")
  return passed("access_lifecycle", { proofs, dates })
}

// ── 11. credentials ──────────────────────────────────────────────────────
// facts.credentials.document  { asOf, businessManager, enrolled, managerMfa }
// facts.credentials.attested  { asOf, managerName, allEnrolled, managerMfa }  under five people
//   managerMfa: the password manager itself enforces MFA (Tier 1 or above)
export function credentials(facts) {
  const ctx = facts?.context || {}
  const p = pick(facts, "credentials")
  if (!p.type) return fail(p.reason)
  const v = p.value
  if (p.type === "attested") {
    if (!v.managerName) return fail("The statement must name the password manager.")
    if (v.allEnrolled !== true) return fail("Not every staff member uses the password manager.")
  } else {
    if (v.businessManager !== true) return fail("The console is not a business password manager.")
    if (!isNum(ctx.staffCount) || !(v.enrolled >= ctx.staffCount)) return fail("Not every staff member is enrolled in the password manager.")
  }
  if (v.managerMfa !== true) return fail("The password manager itself needs MFA.")
  return passed("credentials", { proofs: [p.type], dates: [v.asOf] })
}

// ── 12. training ─────────────────────────────────────────────────────────
// facts.training.generated | facts.training.document
//   { asOf, people: [{ startedAt, completedAt }] }  one line per person, no names
//   startedAt: the start day for anyone hired in the last year, else null
// context.staffCount                       every person must have a line
// facts.access_lifecycle.api.newAccountsUntrained  with a tenant, must be 0
// Each person completed training in the 365 days before `asOf`, or started
// within the 30 days before it. Each completion stands 365 days; a new
// starter's pass stands until their 30th day.
export function training(facts) {
  const ctx = facts?.context || {}
  const p = pick(facts, "training")
  if (!p.type) return fail(p.reason)
  const v = p.value
  const people = Array.isArray(v.people) ? v.people : []
  if (!isNum(ctx.staffCount) || people.length < ctx.staffCount) return fail("The completion records do not cover everyone on the staff list.")
  const expiries = []
  let missing = 0
  for (const person of people) {
    const done = person.completedAt ? daysBetween(person.completedAt, v.asOf) : null
    if (done != null && done >= 0 && done <= 365) expiries.push({ from: person.completedAt, until: addDays(person.completedAt, 365) })
    else if (person.startedAt && daysBetween(person.startedAt, v.asOf) <= 30) expiries.push({ from: v.asOf, until: addDays(person.startedAt, 30) })
    else missing++
  }
  if (missing) return fail(`${plural(missing, "person has", "people have")} no training completion in the last twelve months.`)
  const untrained = facts?.access_lifecycle?.api?.newAccountsUntrained
  if (ctx.tenant && untrained > 0) return fail(`${plural(untrained, "account", "accounts")} older than 30 days ${untrained === 1 ? "has" : "have"} no training completion.`)
  return passed("training", { proofs: [p.type], expiries, seen: [v.asOf] })
}

// ── 13. incident_plan ────────────────────────────────────────────────────
// facts.incident_plan.generated | facts.incident_plan.document
//   { plan: { asOf, namedRoles, outsideContacts }, exercise: { asOf } }
//   plan.asOf: the day the plan was dated or last reviewed
//   exercise.asOf: the day of the tabletop or live exercise
// Each component is taken from the strongest proof that has it.
export function incident_plan(facts) {
  const plan = pick(facts, "incident_plan", { component: "plan" })
  if (!plan.type) return fail(plan.reason === "No proof yet." ? "No incident plan yet." : plan.reason)
  if (!(plan.value.namedRoles >= 2)) return fail("The plan names fewer than two roles.")
  if (!(plan.value.outsideContacts >= 1)) return fail("The plan lists no outside contacts.")
  const exercise = pick(facts, "incident_plan", { component: "exercise" })
  if (!exercise.type) return fail("The plan has not been exercised.")
  return passed("incident_plan", { proofs: [plan.type, exercise.type], dates: [plan.value.asOf, exercise.value.asOf] })
}

// ── 14. written_program ──────────────────────────────────────────────────
// facts.written_program.generated | facts.written_program.document
//   { policies: { [policyId]: { asOf, acknowledged } } }
//   acknowledged: true, false, or null when the policy asks for no acknowledgment
// context.overlay picks the required set (baseline.js requiredPolicies).
// Each policy is taken from the strongest proof that has it.
export function written_program(facts) {
  const ctx = facts?.context || {}
  if (facts?.written_program?.attested) return fail("Owner attested is not accepted for this control.")
  const needed = requiredPolicies(ctx.overlay)
  const own = facts?.written_program || {}
  const proofs = []
  const dates = []
  const missing = []
  for (const id of needed) {
    const type = ["generated", "document"].find((t) => own[t]?.policies?.[id])
    if (!type) {
      missing.push(id)
      continue
    }
    const policy = own[type].policies[id]
    if (policy.acknowledged === false) return fail(`Staff have not acknowledged the ${POLICY_NAMES[id] || id}.`)
    proofs.push(type)
    dates.push(policy.asOf)
  }
  if (missing.length) return fail(`Missing: ${missing.map((m) => POLICY_NAMES[m] || m).join(", ")}.`)
  return passed("written_program", { proofs, dates })
}

// ── 15. payment_verification ─────────────────────────────────────────────
// facts.payment_verification.generated | facts.payment_verification.document
//   { rule: { asOf, twoChannel, newPayees, changedDetails, approvers },
//     drill: { asOf, stopped } }
//   approvers: named approvers; stopped: the test request was stopped
// Owner attestation is never accepted: the drill is the point.
export function payment_verification(facts) {
  const rule = pick(facts, "payment_verification", { component: "rule" })
  if (!rule.type) return fail(rule.reason === "No proof yet." ? "No written payment rule yet." : rule.reason)
  const r = rule.value
  if (r.twoChannel !== true) return fail("The written rule does not require a call to a number you already had.")
  if (r.newPayees !== true || r.changedDetails !== true) return fail("The written rule must cover both new payees and changed bank details.")
  if (!(r.approvers >= 1)) return fail("The written rule names no approvers.")
  const drill = pick(facts, "payment_verification", { component: "drill" })
  if (!drill.type) return fail("No fraud drill on record.")
  if (drill.value.stopped !== true) return fail("In the last drill, the test request was not stopped.")
  return passed("payment_verification", { proofs: [rule.type, drill.type], dates: [r.asOf, drill.value.asOf] })
}

// ── 16. connected_apps ───────────────────────────────────────────────────
// facts.connected_apps.api        { asOf, consentRestricted, unreviewedApps }
//   consentRestricted: user consent needs an admin (Microsoft) or unreviewed apps are blocked (Google)
//   unreviewedApps: apps holding mail or file read scopes that are not in the reviewed inventory
// facts.connected_apps.generated  { asOf, missingOwnerOrReason }  the reviewed inventory
// facts.connected_apps.attested   same, only with no tenant, for the inventory alone
// The consent setting can only be proven through a connected tenant, so a
// business on Microsoft 365 or Google Workspace stays open until it connects
// one. A business with no cloud identity provider needs the inventory only.
export function connected_apps(facts) {
  const ctx = facts?.context || {}
  const proofs = []
  const dates = []
  if (ctx.tenant) {
    const api = pick(facts, "connected_apps", { types: ["api"] })
    if (!api.type) return fail(api.reason)
    if (api.value.consentRestricted !== true) return fail("Anyone can approve a new app without an admin.")
    if (api.value.unreviewedApps !== 0) return fail(`${plural(api.value.unreviewedApps ?? 0, "app holds", "apps hold")} mail or file access and ${api.value.unreviewedApps === 1 ? "is" : "are"} not on the reviewed list.`)
    proofs.push("api")
    dates.push(api.value.asOf)
  } else if (ctx.cloudIdentity !== false) {
    return fail("The app consent setting can only be checked through a connected tenant.")
  }
  const inventory = pick(facts, "connected_apps", { types: ["generated", "attested"] })
  if (!inventory.type) return fail(inventory.reason === "No proof yet." ? "No reviewed app inventory yet." : inventory.reason)
  if (inventory.value.missingOwnerOrReason !== 0) return fail("An app on the inventory has no owner or no reason.")
  proofs.push(inventory.type)
  dates.push(inventory.value.asOf)
  return passed("connected_apps", { proofs, dates })
}

// ── 17. external_exposure ────────────────────────────────────────────────
// facts.external_exposure.dns       { asOf, proven, portConsentAt, openPorts, https, certValid, registrarLock }
//   proven: every domain and address looked up is proven to be the owner's
//   portConsentAt: the day the owner consented to a port check naming the address
//   openPorts: remote desktop, SMB, database or VNC ports answering on proven addresses
// facts.external_exposure.attested  { asOf, registrarMfa }  the registrar account's MFA only
// Continuous: the lookup stands while the weekly check confirms it. The
// registrar statement has no validity of its own in 2027.1.
export function external_exposure(facts) {
  const look = pick(facts, "external_exposure", { types: ["dns"] })
  if (!look.type) return fail(look.reason)
  const v = look.value
  if (v.proven !== true) return fail("Only domains and addresses you have proven are checked, and none is proven yet.")
  if (!v.portConsentAt) return fail("The port check waits for your consent naming the address.")
  if (v.openPorts !== 0) return fail("A remote desktop, file share, database or VNC port answers on your address.")
  if (v.https !== true || v.certValid !== true) return fail("The website does not serve HTTPS with a valid certificate.")
  if (v.registrarLock !== true) return fail("The registrar lock is off.")
  const att = facts?.external_exposure?.attested
  if (!att || att.registrarMfa !== true) return fail("The registrar account's MFA is not attested yet.")
  return passed("external_exposure", { proofs: ["dns", "attested"], dates: [v.asOf], seen: [att.asOf] })
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Control rule names (baseline.js `rule`) to predicates.
export const RULES = {
  mfa,
  admin_accounts,
  legacy_signin,
  email_auth,
  email_protection,
  endpoint_protection,
  patching,
  device_encryption,
  backups,
  access_lifecycle,
  credentials,
  training,
  incident_plan,
  written_program,
  payment_verification,
  connected_apps,
  external_exposure,
}
