#!/usr/bin/env node
// Write Data Hygienics' own Verified record, the first real one
// (design/verified/baseline.md section 8, step 2).
//
//   node scripts/verified-seed-own.mjs                 # evaluate and write
//   node scripts/verified-seed-own.mjs --dry           # evaluate, print, write nothing
//   node scripts/verified-seed-own.mjs --no-lookup     # skip the live DNS lookup
//   node scripts/verified-seed-own.mjs --owner me@example.com
//
// Facts come from scripts/verified-own-facts.mjs plus a live DNS lookup of
// the primary domain (lib/email-check/, the same code as /email-check),
// which becomes the `email_auth` dns proof and a verified_checks row. The
// rules engine (lib/verified/evaluate.js) turns facts into states; this
// script never sets `passed` or any other state itself.
//
// Idempotent: the record is found by slug and updated, the seventeen lines
// are upserted, and a check row is added only when the lookup's facts
// differ from the last check. A second run with the same facts changes
// nothing but `evaluated_at`.
//
// Keys: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, from the
// environment first, then .env.local. The owner is `--owner <email>`,
// VERIFIED_OWNER_EMAIL, or the one profile with is_admin = true. Nothing
// secret is printed.
import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { createClient } from "@supabase/supabase-js"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href)

const { CONTROLS, BASELINE_VERSION } = await load("lib/verified/baseline.js")
const { evaluate, toRecord } = await load("lib/verified/evaluate.js")
const { toDay } = await load("lib/verified/dates.js")
const { checkDomain } = await load("lib/email-check/check.js")
const { RECORD, CONTEXT, FACTS } = await load("scripts/verified-own-facts.mjs")

// ---------- Arguments ----------
const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith("--")))
const known = new Set(["--dry", "--no-lookup", "--owner"])
for (const f of flags)
  if (!known.has(f)) {
    console.error(`Unknown option: ${f}\nUsage: node scripts/verified-seed-own.mjs [--dry] [--no-lookup] [--owner <email>]`)
    process.exit(1)
  }
const DRY = flags.has("--dry")
const LOOKUP = !flags.has("--no-lookup")
const ownerArg = args.includes("--owner") ? args[args.indexOf("--owner") + 1] : null

// ---------- Tiny .env.local reader (no dotenv) ----------
function readEnvFile(file) {
  if (!existsSync(file)) return {}
  const out = {}
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith("#")) continue
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    else value = value.replace(/\s+#.*$/, "")
    out[match[1]] = value
  }
  return out
}
const fileEnv = readEnvFile(path.join(root, ".env.local"))
const env = (name) => process.env[name] || fileEnv[name] || ""

const today = toDay(new Date())
const stable = (v) => JSON.stringify(sortKeys(v))
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys)
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]))
  return v
}

// ---------- The live lookup: the email_auth dns proof ----------
const SPF_ALL = { fail: "-all", softfail: "~all", neutral: "?all", pass: "+all" }

function dnsFacts(result) {
  const { spf, dmarc, dkim } = result
  return {
    domain: result.domain,
    // Our own site runs on this domain; the TXT challenge for customers'
    // domains arrives with the intake in step 3.
    proven: true,
    spfRecords: spf.status === "found" ? spf.records.length : 0,
    spfAll: spf.parsed ? SPF_ALL[spf.parsed.all] ?? null : null,
    dmarcPolicy: dmarc.status === "found" && dmarc.parsed ? dmarc.parsed.policy : null,
    dmarcPct: dmarc.parsed ? (dmarc.parsed.pct ?? null) : null,
    dmarcRua: Boolean(dmarc.parsed && dmarc.parsed.rua?.length),
    dkimSelectors: dkim.status === "found" ? dkim.keys.length : 0,
  }
}

async function lookup(domain) {
  const result = await checkDomain(domain)
  const unsure = ["spf", "dmarc", "dkim"].filter((k) => result[k].status === "could_not_check" && !(k === "dkim" && result.dkim.reason === "no_selector"))
  if (!result.exists || unsure.length) {
    console.warn(`Lookup of ${domain} did not finish (${unsure.join(", ") || "domain not in DNS"}); the email_auth line is left as it was.`)
    return null
  }
  const raw = { spf: result.spf.records, dmarc: result.dmarc.records, dkim: result.dkim.keys?.map((k) => k.record) || [] }
  return {
    asOf: toDay(result.checkedAt),
    facts: dnsFacts(result),
    rawHash: createHash("sha256").update(JSON.stringify(raw)).digest("hex"),
  }
}

// ---------- Facts ----------
const facts = structuredClone({ context: CONTEXT, ...FACTS })
let check = null
if (LOOKUP && RECORD.primaryDomain) {
  check = await lookup(RECORD.primaryDomain)
  if (check) facts.email_auth = { ...(facts.email_auth || {}), dns: { asOf: check.asOf, domains: [check.facts] } }
}

// ---------- Supabase ----------
const url = env("NEXT_PUBLIC_SUPABASE_URL")
const key = env("SUPABASE_SERVICE_ROLE_KEY")
let supabase = null
if (!DRY) {
  if (!url || !key) {
    console.error("Refusing to run: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are needed (environment or .env.local). Use --dry to evaluate without a database.")
    process.exit(1)
  }
  supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

const fail = (what, error) => {
  console.error(`${what}: ${error?.message || error}`)
  process.exit(1)
}

// The stored record, so drift can compare with the last pass and so a
// previous dns check can be compared with this one.
let existing = null
let priorLines = {}
let lastCheck = null
if (supabase) {
  const { data, error } = await supabase.from("verified_records").select("id, user_id, slug").eq("slug", RECORD.slug).maybeSingle()
  if (error) fail("Reading verified_records (is the 20261105_verified migration applied?)", error)
  existing = data
  if (existing) {
    const lines = await supabase.from("verified_controls").select("control_id, state, tier, proof_type, proofs, facts, passed_at, valid_until").eq("record_id", existing.id)
    if (lines.error) fail("Reading verified_controls", lines.error)
    for (const row of lines.data || [])
      priorLines[row.control_id] = { state: row.state, tier: row.tier, proofType: row.proof_type, proofs: row.proofs || [], facts: row.facts, passedAt: row.passed_at, validUntil: row.valid_until }
    const checks = await supabase
      .from("verified_checks")
      .select("facts, checked_at")
      .eq("record_id", existing.id)
      .eq("control_id", "email_auth")
      .order("checked_at", { ascending: false })
      .limit(1)
    if (checks.error) fail("Reading verified_checks", checks.error)
    lastCheck = checks.data?.[0] || null
  }
}
if (!LOOKUP && priorLines.email_auth?.facts?.dns && !facts.email_auth?.dns) facts.email_auth = { ...(facts.email_auth || {}), dns: priorLines.email_auth.facts.dns }

// ---------- Evaluate: the rules decide ----------
const result = evaluate({ record: { controls: priorLines }, facts, now: today })
const record = toRecord(result, facts)

console.log(`${RECORD.businessName} (${RECORD.slug}) · baseline ${BASELINE_VERSION} · evaluated ${result.evaluatedAt}${DRY ? " · dry run" : ""}`)
for (const line of result.controls) {
  const proof = line.proofType ? ` · ${line.proofType}` : ""
  const when = line.passedAt ? ` · ${line.passedAt} to ${line.validUntil}` : ""
  const tier = line.id === "mfa" ? ` · tier ${line.tier}` : ""
  console.log(`  ${line.id.padEnd(22)} ${line.state.padEnd(15)}${proof}${when}${tier}`)
  if (line.reason) console.log(`  ${"".padEnd(22)} ${line.reason}`)
}
for (const e of result.events) console.log(`  drift: ${e.controlId}: ${e.sentence}`)
if (DRY) process.exit(0)

// ---------- The owner ----------
async function ownerId() {
  if (existing?.user_id && !ownerArg) return existing.user_id
  const email = (ownerArg || env("VERIFIED_OWNER_EMAIL") || "").trim().toLowerCase()
  if (email) {
    let page = 1
    for (;;) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
      if (error) fail("Listing users", error)
      const hit = data.users.find((u) => (u.email || "").toLowerCase() === email)
      if (hit) return hit.id
      if (data.users.length < 200) break
      page += 1
    }
    fail("Owner", `no user with the email ${email}`)
  }
  const { data, error } = await supabase.from("profiles").select("id").eq("is_admin", true)
  if (error) fail("Reading profiles", error)
  if (data.length !== 1) fail("Owner", `${data.length} admin profiles; pass --owner <email> or set VERIFIED_OWNER_EMAIL`)
  return data[0].id
}
const userId = await ownerId()
if (existing && existing.user_id !== userId) console.warn("The record's owner stays as stored; --owner changes nothing on an existing record.")

// ---------- Write ----------
const fields = {
  business_name: RECORD.businessName,
  slug: RECORD.slug,
  primary_domain: RECORD.primaryDomain || null,
  industry: RECORD.industry || "general",
  baseline_version: record.baselineVersion,
  public: RECORD.public === true,
}
let recordId = existing?.id
if (existing) {
  const { error } = await supabase.from("verified_records").update(fields).eq("id", existing.id)
  if (error) fail("Updating verified_records", error)
} else {
  const { data, error } = await supabase.from("verified_records").insert({ ...fields, user_id: userId }).select("id").single()
  if (error) fail("Inserting verified_records", error)
  recordId = data.id
}

const rows = CONTROLS.map((c) => {
  const line = record.controls[c.id]
  return {
    record_id: recordId,
    control_id: c.id,
    state: line.state,
    tier: c.id === "mfa" ? line.tier : null,
    proof_type: line.proofType,
    proofs: line.proofs || [],
    facts: line.facts,
    passed_at: line.passedAt,
    valid_until: line.validUntil,
    evaluated_at: record.evaluatedAt,
    reason: line.reason,
  }
})
{
  const { error } = await supabase.from("verified_controls").upsert(rows, { onConflict: "record_id,control_id" })
  if (error) fail("Writing verified_controls", error)
}

if (check) {
  const changed = lastCheck ? stable(lastCheck.facts) !== stable(check.facts) : false
  if (!lastCheck || changed) {
    const { error } = await supabase.from("verified_checks").insert({
      record_id: recordId,
      control_id: "email_auth",
      source: "dns",
      facts: check.facts,
      raw_hash: check.rawHash,
      changed,
    })
    if (error) fail("Writing verified_checks", error)
    console.log(changed ? "Lookup facts changed since the last check: a check row was added." : "First lookup recorded.")
  } else console.log("Lookup facts match the last check: no new check row.")
}

console.log(`${existing ? "Updated" : "Created"} the record. Public page: /verify/${RECORD.slug}`)
