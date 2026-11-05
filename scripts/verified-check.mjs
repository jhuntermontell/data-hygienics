#!/usr/bin/env node
// Harness for the Verified rules engine (lib/verified/).
//
//   node scripts/verified-check.mjs
//
// Plain Node, no network, no database, no model. Runs fixtures through
// rules, evaluate and drift: every control in every state it can reach, each
// MFA tier, Security Defaults as Tier 1, an exemption as drift, an expired
// restore test, a connected tenant refusing an MFA attestation, and
// not_applicable only where the baseline allows it. Exits non-zero when any
// check fails, so it can sit beside `npm run validate`.
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href)

const baseline = await load("lib/verified/baseline.js")
const { RULES, pick } = await load("lib/verified/rules.js")
const { evaluate, toRecord } = await load("lib/verified/evaluate.js")
const { detectDrift } = await load("lib/verified/drift.js")
const { addDays } = await load("lib/verified/dates.js")

const { CONTROLS, CONTROL_IDS } = baseline

let failures = 0
let passes = 0
const check = (ok, message) => {
  if (ok) {
    passes++
    if (verbose) console.log(`  ok    ${message}`)
  } else {
    failures++
    console.log(`  FAIL  ${message}`)
  }
}
const verbose = process.argv.includes("--verbose")
const section = (title) => console.log(`\n${title}`)

const clone = (v) => structuredClone(v)
const CHECKED = "2027-03-01"
const NOW = "2027-03-10"
const days = (n) => addDays(CHECKED, n)

// ── A business where every line holds: Microsoft 365 connected ──────────
function baseFacts() {
  return {
    context: {
      tenant: "m365",
      cloudIdentity: true,
      deviceCount: 6,
      staffCount: 6,
      overlay: "financial",
      systems: [
        { id: "banking", name: "the bank portal", supportsMfa: true },
        { id: "payroll", name: "payroll", supportsMfa: true },
        { id: "scanner", name: "the office scanner", supportsMfa: false },
      ],
    },
    mfa: {
      api: { asOf: CHECKED, provider: "m365", securityDefaults: false, mfaAllUsers: true, mfaAllAdmins: true, exemptUsers: 0, phishingResistantAllUsers: false },
      document: { systems: { banking: { asOf: days(-10), mfaOn: true }, payroll: { asOf: days(-10), mfaOn: true } } },
    },
    admin_accounts: {
      api: { asOf: CHECKED, admins: [{ shared: false, dedicated: true, mailbox: false, breakGlass: false }, { shared: false, dedicated: true, mailbox: true, breakGlass: true }] },
    },
    legacy_signin: { api: { asOf: CHECKED, securityDefaults: false, legacyBlocked: true, exceptions: 0 } },
    email_auth: {
      dns: { asOf: CHECKED, domains: [{ domain: "example.com", proven: true, spfRecords: 1, spfAll: "-all", dmarcPolicy: "reject", dmarcPct: null, dmarcRua: true, dkimSelectors: 1 }] },
    },
    email_protection: { api: { asOf: CHECKED, linkScanning: true, attachmentScanning: true, reportButton: true, outsideFilter: false } },
    endpoint_protection: { document: { asOf: days(-20), consoleDevices: 6, protectionOff: 0, notSeen30Days: 0 } },
    patching: { document: { asOf: days(-20), devices: 6, unsupported: 0, autoUpdatesOff: 0, over60DaysBehind: 0 } },
    device_encryption: { document: { asOf: days(-20), laptops: 4, laptopsEncrypted: 4, mailPhones: 2, mailPhonesWipeable: 2 } },
    backups: {
      document: { report: { asOf: days(-5), offsite: true, lastSuccessAt: days(-6) } },
      generated: { restoreTest: { asOf: days(-100), succeeded: true } },
    },
    access_lifecycle: {
      api: { asOf: CHECKED, enabledAccounts: 7, lateDisables: 0, markedForRemovalStillEnabled: 0, newAccountsUntrained: 0 },
      generated: { asOf: days(-30), accountsReviewed: 7, accountsEnabled: 7, lateDepartures: 0 },
    },
    credentials: { document: { asOf: days(-60), businessManager: true, enrolled: 6, managerMfa: true } },
    training: {
      generated: {
        asOf: days(-1),
        people: [
          { startedAt: null, completedAt: days(-200) },
          { startedAt: null, completedAt: days(-150) },
          { startedAt: null, completedAt: days(-90) },
          { startedAt: null, completedAt: days(-90) },
          { startedAt: days(-60), completedAt: days(-45) },
          { startedAt: days(-10), completedAt: null },
        ],
      },
    },
    incident_plan: { generated: { plan: { asOf: days(-40), namedRoles: 3, outsideContacts: 2 }, exercise: { asOf: days(-35) } } },
    written_program: {
      generated: {
        policies: {
          information_security: { asOf: days(-50), acknowledged: true },
          acceptable_use: { asOf: days(-50), acknowledged: true },
          ai_acceptable_use: { asOf: days(-50), acknowledged: true },
          wisp: { asOf: days(-50), acknowledged: null },
        },
      },
    },
    payment_verification: {
      generated: { rule: { asOf: days(-70), twoChannel: true, newPayees: true, changedDetails: true, approvers: 2 }, drill: { asOf: days(-60), stopped: true } },
    },
    connected_apps: {
      api: { asOf: CHECKED, consentRestricted: true, unreviewedApps: 0 },
      generated: { asOf: days(-20), missingOwnerOrReason: 0 },
    },
    external_exposure: {
      dns: { asOf: CHECKED, proven: true, portConsentAt: days(-90), openPorts: 0, https: true, certValid: true, registrarLock: true },
      attested: { asOf: days(-90), registrarMfa: true },
    },
  }
}

const run = (facts, opts = {}) => evaluate({ facts, now: opts.now || NOW, record: opts.record, insurerAnswers: opts.insurerAnswers })
const lineOf = (result, id) => result.controls.find((c) => c.id === id)
const stateOf = (facts, id, opts) => lineOf(run(facts, opts), id).state

// ── Baseline data ────────────────────────────────────────────────────────
section("Baseline data")
check(baseline.BASELINE_VERSION === "2027.1", "baseline version is 2027.1")
check(CONTROLS.length === 17, `${CONTROLS.length} controls`)
check(CONTROLS.every((c) => typeof RULES[c.rule] === "function"), "every control's rule names a predicate")
check(CONTROLS.filter((c) => c.notApplicableAllowed).map((c) => c.id).join() === "legacy_signin", "not_applicable allowed on legacy_signin only")
check(CONTROLS.find((c) => c.id === "mfa").tiers.length === 3, "mfa carries three tiers")
for (const id of ["endpoint_protection", "access_lifecycle", "payment_verification"])
  check(!CONTROLS.find((c) => c.id === id).proof.some((p) => p.type === "attested"), `${id} never lists attested`)
for (const id of ["mfa", "admin_accounts", "legacy_signin", "email_protection", "connected_apps"])
  check(CONTROLS.find((c) => c.id === id).proof.find((p) => p.type === "attested")?.only === "no_tenant", `${id} attested only with no tenant`)

// ── Every control passes on the base facts ───────────────────────────────
section("Passed: the base business")
const base = run(baseFacts())
for (const c of base.controls) check(c.state === "passed", `${c.id} passed (${c.proofType}, ${c.passedAt} to ${c.validUntil})${c.state !== "passed" ? `: ${c.reason}` : ""}`)
check(Object.keys(base).sort().join() === "baselineVersion,controls,evaluatedAt,events", "result keys: baselineVersion, controls, evaluatedAt, events")
check(base.controls.every((c) => Object.keys(c).sort().join() === "id,passedAt,proofType,proofs,reason,state,tier,validUntil"), "each line carries exactly id, state, tier, proofType, proofs, passedAt, validUntil, reason")
check(!JSON.stringify(base).match(/"(score|grade|percent|percentage|total|passedCount)"/i), "no composite number anywhere in the result")
check(base.controls.every((c) => c.id === "mfa" || c.tier === null), "tier only on the mfa line")
check(base.events.length === 0, "no drift events on a first evaluation")
check(lineOf(base, "backups").proofType === "document" && lineOf(base, "backups").proofs.join() === "generated,document", "backups: generated restore test plus reviewed report, labelled by the weaker proof")
check(lineOf(base, "external_exposure").proofType === "attested", "external_exposure labelled by its weakest proof (the registrar attestation)")
check(lineOf(base, "email_auth").validUntil === addDays(CHECKED, baseline.LIVE_CHECK_GRACE_DAYS), "continuous control stands for the live-check grace")

// ── Open: every control with its facts removed ───────────────────────────
section("Open: no proof")
for (const id of CONTROL_IDS) {
  const f = baseFacts()
  delete f[id]
  const line = lineOf(run(f), id)
  check(line.state === "open" && line.reason, `${id} open without facts: ${line.reason}`)
}

// ── Open: the rule does not hold ─────────────────────────────────────────
section("Open: the rule fails")
const breaks = {
  mfa: (f) => (f.mfa.api.mfaAllUsers = false),
  admin_accounts: (f) => f.admin_accounts.api.admins.push(...Array(3).fill({ shared: false, dedicated: true, mailbox: false, breakGlass: false })),
  legacy_signin: (f) => (f.legacy_signin.api.exceptions = 2),
  email_auth: (f) => (f.email_auth.dns.domains[0].dmarcPolicy = "none"),
  email_protection: (f) => (f.email_protection.api.reportButton = false),
  endpoint_protection: (f) => (f.endpoint_protection.document.consoleDevices = 5),
  patching: (f) => (f.patching.document.unsupported = 1),
  device_encryption: (f) => (f.device_encryption.document.laptopsEncrypted = 3),
  backups: (f) => (f.backups.document.report.offsite = false),
  access_lifecycle: (f) => (f.access_lifecycle.generated.accountsReviewed = 5),
  credentials: (f) => (f.credentials.document.managerMfa = false),
  training: (f) => (f.training.generated.people[0].completedAt = days(-400)),
  incident_plan: (f) => (f.incident_plan.generated.plan.namedRoles = 1),
  written_program: (f) => delete f.written_program.generated.policies.wisp,
  payment_verification: (f) => (f.payment_verification.generated.drill.stopped = false),
  connected_apps: (f) => (f.connected_apps.generated.missingOwnerOrReason = 1),
  external_exposure: (f) => (f.external_exposure.dns.registrarLock = false),
}
check(Object.keys(breaks).sort().join() === [...CONTROL_IDS].sort().join(), "a failing fixture for every control")
for (const [id, mutate] of Object.entries(breaks)) {
  const f = baseFacts()
  mutate(f)
  const line = lineOf(run(f), id)
  check(line.state === "open", `${id} open when the rule fails: ${line.reason}`)
}

// ── Expired: every control, far in the future ────────────────────────────
section("Expired: every pass runs out")
const later = run(baseFacts(), { now: addDays(CHECKED, 400) })
for (const c of later.controls) check(c.state === "expired" && c.validUntil < addDays(CHECKED, 400), `${c.id} expired (valid until ${c.validUntil})`)
{
  const f = baseFacts()
  f.backups.generated.restoreTest.asOf = days(-360)
  check(stateOf(f, "backups", { now: CHECKED }) === "passed", "restore test 360 days old: still passed")
  const at = run(f, { now: days(10) })
  check(lineOf(at, "backups").state === "expired" && lineOf(at, "backups").validUntil === days(5), "restore test past 365 days: backups expired on the restore test's date")
}
{
  const f = baseFacts()
  check(stateOf(f, "email_auth", { now: days(baseline.LIVE_CHECK_GRACE_DAYS) }) === "passed", "lookup within the grace: passed")
  check(stateOf(f, "email_auth", { now: days(baseline.LIVE_CHECK_GRACE_DAYS + 1) }) === "expired", "lookup older than the grace: expired")
  check(stateOf(f, "mfa", { now: days(91) }) === "expired" && stateOf(f, "mfa", { now: days(90) }) === "passed", "mfa tenant check stands 90 days")
  check(stateOf(f, "training", { now: days(21) }) === "expired", "new starter past 30 days with no completion: training needs fresh proof")
}

// ── MFA tiers ────────────────────────────────────────────────────────────
section("MFA tiers")
{
  const tierOf = (f, now = NOW) => RULES.mfa(f, { now })
  const t2 = tierOf(baseFacts())
  check(t2.ok && t2.tier === 2, `base business reaches Tier 2 (${t2.reason})`)
  check(t2.proofType === "document", "Tier 2 rests on system documents, so the line says Document reviewed")

  const f3 = baseFacts()
  f3.mfa.api.phishingResistantAllUsers = true
  const t3 = tierOf(f3)
  check(t3.ok && t3.tier === 3, "phishing-resistant policy for everyone reaches Tier 3")

  const f1 = baseFacts()
  delete f1.mfa.document.systems.payroll
  const t1 = tierOf(f1)
  check(t1.ok && t1.tier === 1 && /payroll/.test(t1.reason) && t1.proofType === "api", `a missing system document holds the tier at 1 (${t1.reason})`)

  const fLegacy = baseFacts()
  fLegacy.legacy_signin.api.legacyBlocked = false
  check(tierOf(fLegacy).tier === 1, "legacy sign-in open holds the tier at 1")

  const fStaleDoc = baseFacts()
  check(tierOf(fStaleDoc, days(81)).tier === 1 && tierOf(fStaleDoc, days(80)).tier === 2, "a system document past 90 days drops Tier 2 to Tier 1, the line still passes")

  const fNoInv = baseFacts()
  delete fNoInv.context.systems
  check(tierOf(fNoInv).tier === 1, "no system inventory: Tier 1")

  const f0 = baseFacts()
  f0.mfa.api.exemptUsers = 1
  const t0 = tierOf(f0)
  check(!t0.ok && t0.tier === 0 && /exempt/.test(t0.reason), `an exemption means Tier 0 (${t0.reason})`)
  check(lineOf(run(f0), "mfa").state === "open" && lineOf(run(f0), "mfa").tier === 0, "Tier 0 is open, tier 0 on the line")

  const fSD = baseFacts()
  fSD.mfa.api = { asOf: CHECKED, provider: "m365", securityDefaults: true, mfaAllUsers: false, mfaAllAdmins: false, exemptUsers: 0, phishingResistantAllUsers: false }
  fSD.mfa.document = undefined
  fSD.context.systems = [{ id: "banking", name: "the bank portal", supportsMfa: true }]
  const tSD = tierOf(fSD)
  check(tSD.ok && tSD.tier === 1 && /Security Defaults/.test(tSD.reason), `Security Defaults on is a Tier 1 pass (${tSD.reason})`)
  check(lineOf(run(fSD), "mfa").state === "passed", "Security Defaults: the line is passed")

  const fG = baseFacts()
  fG.context.tenant = "google"
  fG.mfa.api = { asOf: CHECKED, provider: "google", mfaAllUsers: true, mfaAllAdmins: true, exemptUsers: 0, phishingResistantAllUsers: true }
  check(tierOf(fG).tier === 3, "Google: 2-Step Verification enforced plus security-key-only reaches Tier 3")

  const fAtt = baseFacts()
  fAtt.context.tenant = null
  fAtt.mfa = { attested: { asOf: CHECKED, mfaAllUsers: true, mfaAllAdmins: true }, document: baseFacts().mfa.document }
  fAtt.legacy_signin = { attested: { asOf: CHECKED, legacyBlocked: true } }
  const tAtt = tierOf(fAtt)
  check(tAtt.ok && tAtt.tier === 2 && tAtt.proofs.join() === "document,attested" && tAtt.proofType === "attested", `no tenant: attested Tier 1 plus documents reaches Tier 2, labelled Owner attested (${tAtt.reason})`)
  fAtt.mfa.attested.mfaAllUsers = true
  fAtt.mfa.document = undefined
  fAtt.context.systems = []
  check(tierOf(fAtt).tier === 2 && /Tier 3 is checked only through a connected tenant/.test(tierOf(fAtt).reason), "attested basis never reaches Tier 3")
}

// ── Proof acceptance ─────────────────────────────────────────────────────
section("Proof acceptance")
{
  // A connected tenant makes `attested` unacceptable for mfa.
  const f = baseFacts()
  f.mfa = { attested: { asOf: CHECKED, mfaAllUsers: true, mfaAllAdmins: true } }
  const line = lineOf(run(f), "mfa")
  check(line.state === "open" && /tenant is connected/i.test(line.reason), `tenant connected, mfa attested only: open (${line.reason})`)
  f.context.tenant = null
  check(lineOf(run(f), "mfa").state === "passed" && lineOf(run(f), "mfa").proofType === "attested", "same attestation with no tenant: passed, Owner attested")
}
{
  const f = baseFacts()
  f.mfa.attested = { asOf: CHECKED, mfaAllUsers: true, mfaAllAdmins: true }
  f.mfa.api.mfaAllUsers = false
  check(lineOf(run(f), "mfa").state === "open", "a failing tenant check is not rescued by an attestation")
}
for (const id of ["admin_accounts", "legacy_signin", "email_protection", "connected_apps"]) {
  const f = baseFacts()
  const att = { asOf: CHECKED, admins: [{ shared: false, dedicated: true, mailbox: false }], legacyBlocked: true, linkScanning: true, attachmentScanning: true, reportButton: true, missingOwnerOrReason: 0 }
  f[id] = { attested: att }
  check(lineOf(run(f), id).state === "open", `${id}: attestation refused while a tenant is connected`)
}
for (const id of ["endpoint_protection", "access_lifecycle", "payment_verification", "written_program"]) {
  const f = baseFacts()
  f.context.tenant = null
  f[id] = { attested: { asOf: CHECKED } }
  const line = lineOf(run(f), id)
  check(line.state === "open" && /not accepted/.test(line.reason), `${id}: attestation never accepted (${line.reason})`)
}
{
  // Under five devices, patching and device encryption accept a line-by-line statement.
  const small = baseFacts()
  small.context.deviceCount = 3
  small.endpoint_protection.document.consoleDevices = 3
  small.patching = { attested: { asOf: CHECKED, lines: Array(3).fill({ supported: true, autoUpdates: true, over60DaysBehind: false }) } }
  small.device_encryption = { attested: { asOf: CHECKED, lines: [{ kind: "laptop", encrypted: true }, { kind: "laptop", encrypted: true }, { kind: "phone", holdsMail: true, remoteWipe: true }] } }
  check(stateOf(small, "patching") === "passed", "patching attested accepted under five devices")
  check(stateOf(small, "device_encryption") === "passed", "device_encryption attested accepted under five devices")
  small.patching.attested.lines = small.patching.attested.lines.slice(0, 2)
  check(stateOf(small, "patching") === "open", "patching statement missing a device: open")
  const big = baseFacts()
  big.patching = { attested: { asOf: CHECKED, lines: Array(6).fill({ supported: true, autoUpdates: true, over60DaysBehind: false }) } }
  const line = lineOf(run(big), "patching")
  check(line.state === "open" && /fewer than five devices/.test(line.reason), `patching attested refused at six devices (${line.reason})`)
}
{
  const small = baseFacts()
  small.context.staffCount = 3
  small.credentials = { attested: { asOf: CHECKED, managerName: "a business password manager", allEnrolled: true, managerMfa: true } }
  check(stateOf(small, "credentials") === "passed", "credentials attested accepted under five people")
  const big = baseFacts()
  big.credentials = { attested: { asOf: CHECKED, managerName: "x", allEnrolled: true, managerMfa: true } }
  check(stateOf(big, "credentials") === "open", "credentials attested refused at six people")
}
{
  // A generated record is used ahead of an uploaded document, even when it fails.
  const f = baseFacts()
  f.incident_plan.document = { plan: { asOf: days(-10), namedRoles: 4, outsideContacts: 3 }, exercise: { asOf: days(-10) } }
  f.incident_plan.generated.plan.namedRoles = 1
  check(stateOf(f, "incident_plan") === "open", "incident_plan: a failing generated plan is not replaced by an uploaded one")
  delete f.incident_plan.generated
  check(stateOf(f, "incident_plan") === "passed" && lineOf(run(f), "incident_plan").proofType === "document", "incident_plan: the uploaded plan stands when nothing was generated here")
  const b = baseFacts()
  b.backups.document.restoreTest = { asOf: days(-10), succeeded: true }
  b.backups.generated.restoreTest.succeeded = false
  check(stateOf(b, "backups") === "open", "backups: a failed generated restore test is not replaced by an uploaded record")
}
{
  // email_protection: a third-party filter's document counts only when the tenant shows the outside filter.
  const f = baseFacts()
  f.email_protection.api = { asOf: CHECKED, linkScanning: false, attachmentScanning: false, reportButton: true, outsideFilter: false }
  f.email_protection.document = { asOf: days(-10), linkScanning: true, attachmentScanning: true, reportButton: true }
  check(stateOf(f, "email_protection") === "open", "third-party filter document ignored when the tenant shows no outside filter")
  f.email_protection.api.outsideFilter = true
  check(stateOf(f, "email_protection") === "passed" && lineOf(run(f), "email_protection").proofType === "document", "third-party filter document accepted when mail arrives through it")
}
{
  // connected_apps without a tenant.
  const f = baseFacts()
  f.context.tenant = null
  f.connected_apps = { attested: { asOf: CHECKED, missingOwnerOrReason: 0 } }
  check(stateOf(f, "connected_apps") === "open", "connected_apps: on Microsoft 365 with no tenant connected, the consent setting cannot be proven")
  f.context.cloudIdentity = false
  check(stateOf(f, "connected_apps") === "passed", "connected_apps: no cloud identity provider, the attested inventory alone stands")
}
for (const id of ["mfa", "email_auth", "credentials"]) {
  const f = baseFacts()
  const proof = Object.values(f[id])[0]
  delete proof.asOf
  const line = lineOf(run(f), id)
  check(line.state === "open" && /no date/.test(line.reason), `${id}: an undated proof is refused`)
}
{
  const f = baseFacts()
  delete f.mfa.document.systems.banking.asOf
  check(RULES.mfa(f, { now: NOW }).tier === 1, "mfa: an undated system document does not count toward Tier 2")
}
{
  const p = pick(baseFacts(), "mfa", { types: ["api", "attested"] })
  check(p.type === "api", "pick takes the strongest proof present")
}

// ── not_applicable ───────────────────────────────────────────────────────
section("Not applicable")
{
  const f = baseFacts()
  f.context.tenant = null
  f.context.cloudIdentity = false
  f.legacy_signin = { notApplicable: { reason: "We use no cloud email or identity provider." } }
  const line = lineOf(run(f), "legacy_signin")
  check(line.state === "not_applicable" && line.reason === "We use no cloud email or identity provider.", "legacy_signin not_applicable with no cloud identity, owner's reason kept")
  delete f.legacy_signin
  check(lineOf(run(f), "legacy_signin").state === "not_applicable", "legacy_signin not_applicable with a default reason")
  const g = baseFacts()
  g.legacy_signin.notApplicable = { reason: "We think it does not apply." }
  check(stateOf(g, "legacy_signin") === "passed", "legacy_signin with a cloud identity provider is evaluated, not waived")
}
for (const id of CONTROL_IDS.filter((x) => x !== "legacy_signin")) {
  const f = baseFacts()
  delete f[id]
  f[id] = { notApplicable: { reason: "Does not apply to us." } }
  f.context.cloudIdentity = false
  f.context.tenant = null
  const line = lineOf(run(f), id)
  check(line.state === "open", `${id}: not_applicable refused`)
}

// ── Drift ────────────────────────────────────────────────────────────────
section("Drifted")
const stored = toRecord(base, baseFacts())
const driftBreaks = {
  mfa: (f) => (f.mfa.api.exemptUsers = 2),
  admin_accounts: (f) => (f.admin_accounts.api.admins[0].shared = true),
  legacy_signin: (f) => (f.legacy_signin.api.legacyBlocked = false),
  email_auth: (f) => (f.email_auth.dns.domains[0].dmarcPolicy = "none"),
  email_protection: (f) => (f.email_protection.api.attachmentScanning = false),
  access_lifecycle: (f) => (f.access_lifecycle.api.markedForRemovalStillEnabled = 1),
  training: (f) => (f.access_lifecycle.api.newAccountsUntrained = 1),
  connected_apps: (f) => (f.connected_apps.api.unreviewedApps = 1),
  external_exposure: (f) => (f.external_exposure.dns.openPorts = 1),
}
const drifting = CONTROLS.filter((c) => c.drift).map((c) => c.id)
check(Object.keys(driftBreaks).sort().join() === [...drifting].sort().join(), "a drift fixture for every control with a live check")
for (const [id, mutate] of Object.entries(driftBreaks)) {
  const f = baseFacts()
  mutate(f)
  const result = run(f, { record: stored })
  const line = lineOf(result, id)
  const event = result.events.find((e) => e.controlId === id)
  check(line.state === "drifted" && line.passedAt === lineOf(base, id).passedAt && event?.sentence, `${id} drifted: ${event?.sentence}`)
  // Without a previous pass, the same facts are just open.
  check(stateOf(f, id) === "open", `${id} with no previous pass is open, not drifted`)
  // Still contradicted next week: stays drifted.
  const again = run(f, { record: toRecord(result, f), now: days(16) })
  check(lineOf(again, id).state === "drifted", `${id} stays drifted while the check still contradicts it`)
  // Fixed: back to passed.
  const fixed = run(baseFacts(), { record: toRecord(result, f) })
  check(lineOf(fixed, id).state === "passed", `${id} passes again once the check agrees`)
}
for (const id of CONTROL_IDS.filter((x) => !drifting.includes(x))) {
  const f = baseFacts()
  breaks[id](f)
  check(stateOf(f, id, { record: stored }) === "open", `${id} has no live check, so a failure after a pass is open, not drifted`)
}
{
  // The named cases.
  const f = baseFacts()
  f.mfa.api.exemptUsers = 1
  const events = detectDrift({ previous: { mfa: baseFacts().mfa }, current: f })
  check(events.length === 1 && events[0].controlId === "mfa" && events[0].kind === "check" && /exemption/i.test(events[0].sentence), `an exemption added is drift: "${events[0]?.sentence}"`)
  const sdPrev = { mfa: { api: { asOf: CHECKED, securityDefaults: true, mfaAllUsers: false, mfaAllAdmins: false, exemptUsers: 0 } } }
  const sdNow = baseFacts()
  sdNow.mfa.api = { asOf: days(7), securityDefaults: false, mfaAllUsers: false, mfaAllAdmins: false, exemptUsers: 0 }
  const sd = detectDrift({ previous: sdPrev, current: sdNow })
  check(sd.length === 1 && /Security Defaults was turned off/.test(sd[0].sentence), "Security Defaults turned off is drift")
  const strength = baseFacts()
  strength.mfa.api.phishingResistantAllUsers = true
  const lost = baseFacts()
  const s = detectDrift({ previous: { mfa: strength.mfa }, current: lost })
  check(s.length === 1 && s[0].key === "strength" && lineOf(run(lost, { record: toRecord(run(strength), strength) }), "mfa").state === "passed", "a strength policy removed is drift, while the line still passes at Tier 2")
  const fromAttested = baseFacts()
  fromAttested.mfa.api.mfaAllAdmins = false
  const fa = detectDrift({ previous: { mfa: { attested: { asOf: CHECKED, mfaAllUsers: true, mfaAllAdmins: true } } }, current: fromAttested })
  check(fa.length === 1 && fa[0].key === "all_admins", "the first tenant check contradicting an earlier attestation is drift")
  check(detectDrift({ previous: {}, current: f }).length === 0, "no previous pass, no drift")
}
{
  // Insurer answers.
  const f = baseFacts()
  f.mfa.api.mfaAllUsers = false
  const answers = [
    { carrier: "Example Mutual", questionId: "q7", controlId: "mfa", answer: "yes", answeredAt: days(-30) },
    { carrier: "Example Mutual", questionId: "q8", controlId: "email_auth", answer: "yes", answeredAt: days(-30) },
    { carrier: "Example Mutual", questionId: "q9", controlId: "backups", answer: "yes", answeredAt: days(-30) },
  ]
  const events = detectDrift({ previous: {}, current: f, insurerAnswers: answers, now: NOW })
  check(events.length === 1 && events[0].kind === "insurer" && events[0].controlId === "mfa" && /Example Mutual/.test(events[0].sentence), `an insurer answer contradicted by the tenant check: "${events[0]?.sentence}"`)
  check(detectDrift({ previous: {}, current: baseFacts(), insurerAnswers: answers }).length === 0, "insurer answers that the checks agree with raise nothing")
}

// ── Public words ─────────────────────────────────────────────────────────
section("Public words")
{
  const banned = /\b(certified|compliant|secure|protected|safe|pass(es|ed|ing)?|grade|score)\b/i
  const labels = [
    ...baseline.GROUPS.map((g) => g.name),
    ...baseline.STATES.map((s) => s.label).filter(Boolean),
    ...baseline.PROOF_TYPES.map((p) => p.label),
    ...CONTROLS.flatMap((c) => [c.name, c.promise, ...(c.tiers || []).flatMap((t) => [t.name, t.text])]),
  ]
  const hits = labels.filter((l) => banned.test(l))
  check(!hits.length, `no banned word in public labels${hits.length ? `: ${hits.join(" | ")}` : ""}`)
}

console.log(failures ? `\n${failures} check(s) failed, ${passes} passed` : `\nAll ${passes} checks passed`)
process.exit(failures ? 1 : 0)
