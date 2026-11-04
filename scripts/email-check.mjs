// Harness for the email spoofing check (lib/email-check). Runs the parsers
// and the plain-English layer against fixture strings, with no network.
//
//   node scripts/email-check.mjs                 fixtures only
//   node scripts/email-check.mjs --live example.org [selector]
//                                                also run a real DNS check
//
// Exits 1 when any fixture fails.
import { normalizeDomain, normalizeSelector } from "../lib/email-check/domain.js"
import { readSpf, readDmarc, parseDkim, joinTxt } from "../lib/email-check/parse.js"
import { explain, formatCheckedAt } from "../lib/email-check/explain.js"
import { createRateLimiter } from "../lib/email-check/rate-limit.js"

let failures = 0
let passes = 0

function check(name, condition, detail) {
  if (condition) {
    passes += 1
    return
  }
  failures += 1
  console.error(`FAIL ${name}${detail === undefined ? "" : `\n     got: ${JSON.stringify(detail)}`}`)
}

// ── Fixtures ─────────────────────────────────────────────────────────────

const STRICT_DMARC = "v=DMARC1; p=reject; sp=reject; rua=mailto:dmarc@example.org!10m; adkim=s; aspf=s"
const MONITOR_DMARC = "v=DMARC1; p=none; rua=mailto:admin@example.org"
const PARTIAL_DMARC = "v=DMARC1; p=quarantine; pct=25; rua=mailto:a@example.org,mailto:b@example.org"
const NO_POLICY_DMARC = "v=DMARC1; rua=mailto:a@example.org"
const BROKEN_DMARC = "p=reject; v=DMARC1"
const GOOD_SPF = "v=spf1 include:_spf.google.com ~all"
const STRICT_SPF = "v=spf1 ip4:192.0.2.0/24 include:spf.protection.outlook.com -all"
const SECOND_SPF = "v=spf1 include:sendgrid.net ~all"
const PASS_ALL_SPF = "v=spf1 +all"
const HEAVY_SPF = `v=spf1 ${Array.from({ length: 11 }, (_, i) => `include:s${i}.example.net`).join(" ")} -all`
const OTHER_TXT = "google-site-verification=abc123"
// A real 2048-bit RSA public key (SubjectPublicKeyInfo, base64), split the way
// DNS returns long TXT records.
const KEY_2048 =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAub08JuSqfnHL00z4kwIbAHdtukZUeNgIFjpiC3+ZbHOaM+EPlepNoW3KLvZMIm9tNuU2oXPyrjyCaXATfMNFm3NE2w7eTkUqDNIpBrlWPewghsuGD0SXLP5FisHuXPjieeYUKC1R1BbXQ8pP9u3DUdV8hkPvvdUu4N8pPkbtGzhxi6Dqbd8XRNkL1gVrexm1mxlZwq2WYJRWJjvjU0j3Td8oNkvJKwg3e3XjYYPiZYq1t1zdsbhGfdRLgShj8VWHmmW8EW37xAH7cEX3pwQS1z0p8Hdg0fH6Pb1aYPTuKx5PYfPx7ArZrEbhB4C+6fQCmODKtTiMm6/eJNtMG1EnCwIDAQAB"
const KEY_1024 =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDwIRP/UC3SBsEmGqZ9ZJW3/DkMoGeLnQg1fWn7/zYtIxN2SnFCjxOCKG9v3b4jYfcTNh5ijSsq631uBItLa7od+v/RtdC2UzJ1lWT947qR+Rcac2gbto/NMqJ0fzfVjH4OuKhitdY9tf6mcwGjaNBcWToIMmPSPDdQPNUYckcQ2QIDAQAB"

// ── Domain input ─────────────────────────────────────────────────────────

const domainCases = [
  ["you@example.org", null, "reserved"],
  ["Owner@DataHygienics.com", "datahygienics.com", null],
  ["https://www.datahygienics.com/contact?x=1", "www.datahygienics.com", null],
  ["datahygienics.com.", "datahygienics.com", null],
  ["mailto:hello@acme-dental.co.uk", "acme-dental.co.uk", null],
  ["192.168.1.10", null, "ip"],
  ["[2001:db8::1]", null, "ip"],
  ["localhost", null, "no_suffix"],
  ["printer.local", null, "reserved"],
  ["router.home.arpa", null, "reserved"],
  ["intranet.corp", null, "reserved"],
  ["acme", null, "no_suffix"],
  ["-bad-.com", null, "invalid"],
  ["under_score.com", null, "invalid"],
  [`${Array.from({ length: 5 }, () => "a".repeat(60)).join(".")}.com`, null, "too_long"],
  ["bücher.de", "xn--bcher-kva.de", null],
  ["   ", null, "empty"],
]
for (const [input, domain, reason] of domainCases) {
  const result = normalizeDomain(input)
  if (domain) check(`domain "${input}"`, result.ok && result.domain === domain, result)
  else check(`domain "${input}" rejected as ${reason}`, !result.ok && result.reason === reason, result)
}

check("selector empty is fine", normalizeSelector("").ok && normalizeSelector("").selector === null)
check("selector from full name", normalizeSelector("selector1._domainkey.example.com").selector === "selector1")
check("selector from header tag", normalizeSelector("s=google;").selector === "google")
check("selector rejects junk", !normalizeSelector("bad selector!").ok)

// ── TXT joining ──────────────────────────────────────────────────────────

check("TXT chunks join without a separator", joinTxt([["v=spf1 include:a.example ", "-all"]])[0] === "v=spf1 include:a.example -all")

// ── SPF ──────────────────────────────────────────────────────────────────

{
  const spf = readSpf([OTHER_TXT, GOOD_SPF])
  check("SPF found among other TXT records", spf.status === "found" && spf.records.length === 1)
  check("SPF ~all reads as softfail", spf.parsed.all === "softfail", spf.parsed)
  check("SPF include listed", spf.parsed.includes[0] === "_spf.google.com")
  check("SPF counts one lookup", spf.parsed.lookups === 1, spf.parsed.lookups)
  check("SPF clean record has no problems", spf.problems.length === 0, spf.problems)
}
{
  const spf = readSpf([STRICT_SPF])
  check("SPF -all reads as fail", spf.parsed.all === "fail")
  check("SPF ip4 costs no lookup", spf.parsed.lookups === 1, spf.parsed.lookups)
}
{
  const spf = readSpf([GOOD_SPF, SECOND_SPF])
  check("malformed SPF: two records are reported", spf.status === "found" && spf.problems.includes("multiple_records"), spf)
  const words = explain(fakeResult({ spf })).records[0]
  check("malformed SPF: explained as an error", /2 SPF records/.test(words.meaning) && /ignore all of them/.test(words.meaning), words.meaning)
}
{
  const spf = readSpf([OTHER_TXT])
  check("missing SPF is not_found", spf.status === "not_found")
  const words = explain(fakeResult({ spf })).records[0]
  check("missing SPF: explained", /doesn't publish an SPF record/.test(words.meaning), words.meaning)
}
check("SPF +all flagged", readSpf([PASS_ALL_SPF]).problems.includes("pass_all"))
check("SPF over 10 lookups flagged", readSpf([HEAVY_SPF]).problems.includes("too_many_lookups"))
check("SPF without all or redirect flagged", readSpf(["v=spf1 mx"]).problems.includes("no_all"))
check("SPF redirect read", readSpf(["v=spf1 redirect=_spf.example.net"]).parsed.redirect === "_spf.example.net")
check("SPF junk term flagged", readSpf(["v=spf1 include:a.example bogus! ~all"]).problems.includes("syntax"))
check("v=spf10 is not SPF", readSpf(["v=spf10 -all"]).status === "not_found")

// ── DMARC ────────────────────────────────────────────────────────────────

{
  const dmarc = readDmarc([STRICT_DMARC])
  const parsed = dmarc.parsed
  check("strict DMARC: p=reject", parsed.valid && parsed.policy === "reject", parsed)
  check("strict DMARC: sp=reject", parsed.subdomainPolicy === "reject")
  check("strict DMARC: pct defaults to 100", parsed.pct === 100)
  check("strict DMARC: rua size suffix stripped", parsed.rua[0] === "dmarc@example.org", parsed.rua)
  check("strict DMARC: strict alignment", parsed.adkim === "strict" && parsed.aspf === "strict")
  const words = explain(fakeResult({ dmarc: { ...dmarc, foundAt: "example.net", inherited: false } })).records[1]
  check("strict DMARC: explained as refuse", /p=reject/.test(words.meaning) && /refuse/.test(words.meaning), words.meaning)
}
{
  const dmarc = readDmarc([MONITOR_DMARC])
  check("p=none DMARC: policy none", dmarc.parsed.policy === "none")
  const words = explain(fakeResult({ dmarc: { ...dmarc, foundAt: "example.net", inherited: false } })).records[1]
  check("p=none DMARC: explained as monitoring", /monitoring mode/.test(words.meaning), words.meaning)
  check("p=none DMARC: next step is to move toward quarantine", /p=quarantine/.test(words.next.text), words.next)
  check("p=none DMARC: links to the control", words.next.link?.href === "/controls/email-authentication")
}
{
  const parsed = readDmarc([PARTIAL_DMARC]).parsed
  check("pct=25 parsed", parsed.pct === 25 && parsed.policy === "quarantine")
  check("two rua addresses parsed", parsed.rua.length === 2, parsed.rua)
}
{
  const parsed = readDmarc([NO_POLICY_DMARC]).parsed
  check("DMARC without p= but with rua counts as none", parsed.valid && parsed.policy === "none" && parsed.policyAssumed)
}
check("record not starting with v=DMARC1 is ignored", readDmarc([BROKEN_DMARC]).status === "not_found")
check("DMARC with an unknown policy and no rua is invalid", !readDmarc(["v=DMARC1; p=block"]).parsed.valid)
check("DMARC without p= or rua is invalid", !readDmarc(["v=DMARC1; pct=50"]).parsed.valid)
check("two DMARC records reported", readDmarc([MONITOR_DMARC, STRICT_DMARC]).problems.includes("multiple_records"))
{
  const dmarc = readDmarc([])
  check("missing DMARC is not_found", dmarc.status === "not_found")
  const words = explain(fakeResult({ dmarc: { ...dmarc, foundAt: "example.net", inherited: false } })).records[1]
  check("missing DMARC: explained", /doesn't publish a DMARC record/.test(words.meaning), words.meaning)
}

// ── DKIM ─────────────────────────────────────────────────────────────────

{
  const parsed = parseDkim(`v=DKIM1; k=rsa; p=${KEY_2048}`)
  check("DKIM 2048-bit key sized", parsed.valid && parsed.keyBits === 2048, parsed)
  check("DKIM 1024-bit key flagged short", parseDkim(`v=DKIM1; p=${KEY_1024}`).problems.includes("short_key"))
  check("DKIM empty p= is revoked", parseDkim("v=DKIM1; p=").revoked)
  check("DKIM testing flag read", parseDkim(`v=DKIM1; t=y; p=${KEY_2048}`).testing)
  check("wildcard SPF at a selector is not DKIM", !parseDkim(GOOD_SPF).valid)
}
{
  const words = explain(fakeResult({ dkim: { status: "could_not_check", reason: "no_selector", keys: [], tried: ["google", "selector1"], typedSelector: null } })).records[2]
  check("DKIM without a selector: could not check", words.state === "could_not_check")
  check("DKIM without a selector: never called missing", /doesn't mean DKIM is off/.test(words.meaning) && !/missing/i.test(words.meaning), words.meaning)
  check("DKIM without a selector: explains how to find it", /s=/.test(words.next.text))
}

{
  const base = fakeResult({}).dkim
  const words = explain(fakeResult({ dkim: { ...base, typedSelector: "acme", typedFound: false } })).records[2]
  check("DKIM typed selector that didn't answer is mentioned", /no key at the selector you typed, acme/.test(words.details[0]), words.details)
}

// ── Whole result and wording ─────────────────────────────────────────────

{
  const words = explain(fakeResult({}))
  check("checked-on line", formatCheckedAt(words.checkedAt) === "Checked on November 4, 2026 at 21:40 UTC", formatCheckedAt(words.checkedAt))
  check("three readouts", words.records.length === 3)
  check("missing domain explained", /couldn't find/.test(explain({ ...fakeResult({}), exists: false }).mail))
}

const banned = /\b(protected|safe|secure|certified|compliant|pass(ed)?|grade|score)\b|\u2014/i
for (const sample of allExplanations()) {
  check(`wording stays factual: "${sample.slice(0, 60)}..."`, !banned.test(sample), sample.match(banned)?.[0])
}

// ── Rate limit ───────────────────────────────────────────────────────────

{
  const take = createRateLimiter({ limit: 3, windowMs: 1000 })
  const results = [0, 1, 2, 3].map((i) => take("203.0.113.5", 1000 + i))
  check("rate limit allows the first three", results.slice(0, 3).every((r) => r.allowed))
  check("rate limit stops the fourth", !results[3].allowed && results[3].retryAfterSeconds === 1, results[3])
  check("rate limit is per key", take("203.0.113.6", 1004).allowed)
  check("rate limit window slides", take("203.0.113.5", 2001).allowed)
}

// ── Helpers ──────────────────────────────────────────────────────────────

function fakeResult({ spf, dmarc, dkim }) {
  return {
    domain: "example.net",
    checkedAt: "2026-11-04T21:40:12.000Z",
    exists: true,
    mx: { status: "found", hosts: [{ exchange: "smtp.google.com", priority: 1 }], nullMx: false, provider: { name: "Google Workspace", selector: "google" } },
    spf: spf || readSpf([GOOD_SPF]),
    dmarc: dmarc || { ...readDmarc([MONITOR_DMARC]), foundAt: "example.net", inherited: false },
    dkim: dkim || {
      status: "found",
      keys: [{ selector: "google", service: "Google Workspace", record: `v=DKIM1; k=rsa; p=${KEY_2048}`, parsed: parseDkim(`v=DKIM1; k=rsa; p=${KEY_2048}`), problems: [] }],
      tried: ["google"],
      typedSelector: null,
    },
  }
}

function allExplanations() {
  const spfs = [[GOOD_SPF], [STRICT_SPF], [GOOD_SPF, SECOND_SPF], [], [PASS_ALL_SPF], [HEAVY_SPF], ["v=spf1 mx"], ["v=spf1 ?all"]]
  const dmarcs = [[STRICT_DMARC], [MONITOR_DMARC], [PARTIAL_DMARC], [NO_POLICY_DMARC], ["v=DMARC1; p=block"], [], ["v=DMARC1; p=quarantine"], [MONITOR_DMARC, STRICT_DMARC]]
  const dkims = [
    undefined,
    { status: "could_not_check", reason: "no_selector", keys: [], tried: ["google"], typedSelector: null },
    { status: "could_not_check", reason: "typed_selector_empty", keys: [], tried: ["acme"], typedSelector: "acme" },
    { status: "could_not_check", reason: "lookup_failed", keys: [], tried: ["google"], typedSelector: null },
  ]
  const out = []
  for (const spf of spfs) for (const dmarc of dmarcs) for (const dkim of dkims) {
    const words = explain(fakeResult({ spf: readSpf(spf), dmarc: { ...readDmarc(dmarc), foundAt: "example.net", inherited: false }, dkim }))
    out.push(words.mail)
    for (const record of words.records) out.push(record.meaning, record.next.text, ...record.details)
  }
  return [...new Set(out)]
}

// ── Live check (optional) ────────────────────────────────────────────────

const liveIndex = process.argv.indexOf("--live")
if (liveIndex !== -1) {
  const { checkDomain } = await import("../lib/email-check/check.js")
  const target = normalizeDomain(process.argv[liveIndex + 1] || "")
  if (!target.ok) {
    console.error(`Can't check that domain: ${target.reason}`)
    process.exit(1)
  }
  const selector = normalizeSelector(process.argv[liveIndex + 2] || "").selector
  const started = Date.now()
  const result = await checkDomain(target.domain, { selector })
  const words = explain(result)
  console.log(`\n${target.domain} (${Date.now() - started} ms)\n${formatCheckedAt(words.checkedAt)}\n${words.mail}`)
  for (const record of words.records) {
    console.log(`\n${record.name}: ${record.state}`)
    for (const { name, value } of record.raw) console.log(`  ${name}: ${value.length > 100 ? `${value.slice(0, 97)}...` : value}`)
    console.log(`  ${record.meaning}`)
    for (const detail of record.details) console.log(`  - ${detail}`)
    console.log(`  Next: ${record.next.text}${record.next.link ? ` (${record.next.link.href})` : ""}`)
  }
}

console.log(`\nemail-check: ${passes} passed, ${failures} failed`)
process.exit(failures ? 1 : 0)
