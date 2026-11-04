// Parsers for the three email authentication records. Pure functions over
// strings: no DNS, no imports. scripts/email-check.mjs runs them against
// fixtures, and Verified will reuse them for its public DNS checks.
//
// SPF follows RFC 7208, DMARC follows RFC 7489 and DKIM key records follow
// RFC 6376 section 3.6.1. We read what a record says; we never decide that a
// domain is "protected".

const SPF_PREFIX = /^v=spf1(?:\s|$)/i

// SPF mechanisms and modifiers that cost a DNS lookup when a receiver
// evaluates the record (RFC 7208 section 4.6.4). The limit is 10.
const LOOKUP_TERMS = new Set(["include", "a", "mx", "ptr", "exists", "redirect"])
export const SPF_LOOKUP_LIMIT = 10

// A TXT answer from DNS is an array of records, and each record is an array of
// strings of up to 255 characters. Receivers join a record's strings with no
// separator.
export function joinTxt(answer) {
  if (!Array.isArray(answer)) return []
  return answer.map((chunks) => (Array.isArray(chunks) ? chunks.join("") : String(chunks)))
}

export function pickSpfRecords(txtRecords) {
  return txtRecords.filter((record) => SPF_PREFIX.test(record.trim()))
}

export function pickDmarcRecords(txtRecords) {
  return txtRecords.filter((record) => /^v\s*=\s*dmarc1/i.test(record.trim()))
}

// ── SPF ──────────────────────────────────────────────────────────────────

const SPF_MECHANISM = /^([+\-~?]?)(all|include|a|mx|ptr|ip4|ip6|exists)(?:([:/])(.*))?$/i
const SPF_MODIFIER = /^([a-z][a-z0-9_.-]*)=(.*)$/i

const QUALIFIERS = { "+": "pass", "-": "fail", "~": "softfail", "?": "neutral" }

export function parseSpf(record) {
  const text = String(record || "").trim()
  const result = {
    valid: SPF_PREFIX.test(text),
    all: null, // "fail", "softfail", "neutral" or "pass": what the record says about everyone else
    redirect: null,
    includes: [],
    lookups: 0,
    terms: [],
    problems: [],
  }
  if (!result.valid) {
    result.problems.push("not_spf")
    return result
  }

  const terms = text.split(/\s+/).slice(1).filter(Boolean)
  for (const term of terms) {
    const modifier = term.match(SPF_MODIFIER)
    const mechanism = modifier ? null : term.match(SPF_MECHANISM)
    if (mechanism) {
      const [, qualifier, nameRaw, , value] = mechanism
      const name = nameRaw.toLowerCase()
      result.terms.push({ kind: "mechanism", qualifier: QUALIFIERS[qualifier || "+"], name, value: value || null })
      if (LOOKUP_TERMS.has(name)) result.lookups += 1
      if (name === "include" && value) result.includes.push(value.toLowerCase())
      if (name === "ptr") addOnce(result.problems, "ptr")
      if (name === "all") {
        if (result.all) addOnce(result.problems, "syntax")
        result.all = QUALIFIERS[qualifier || "+"]
      }
    } else if (modifier) {
      const name = modifier[1].toLowerCase()
      result.terms.push({ kind: "modifier", name, value: modifier[2] })
      if (name === "redirect") {
        if (result.redirect) addOnce(result.problems, "syntax")
        result.redirect = modifier[2].toLowerCase()
        result.lookups += 1
      }
    } else {
      addOnce(result.problems, "syntax")
      result.terms.push({ kind: "unknown", name: term, value: null })
    }
  }

  // "redirect" is ignored when the record also has an "all".
  if (result.all && result.redirect) result.redirect = null
  if (result.all === "pass") addOnce(result.problems, "pass_all")
  if (!result.all && !result.redirect) addOnce(result.problems, "no_all")
  if (result.lookups > SPF_LOOKUP_LIMIT) addOnce(result.problems, "too_many_lookups")
  return result
}

// Reads every TXT record at the domain apex and returns what SPF sees there.
// More than one SPF record is a permanent error for receivers (RFC 7208
// section 4.5), so we report it rather than pick one.
export function readSpf(txtRecords) {
  const records = pickSpfRecords(txtRecords)
  if (records.length === 0) return { status: "not_found", records: [], parsed: null, problems: [] }
  if (records.length > 1) {
    return { status: "found", records, parsed: null, problems: ["multiple_records"] }
  }
  const parsed = parseSpf(records[0])
  return { status: "found", records, parsed, problems: parsed.problems }
}

// ── DMARC ────────────────────────────────────────────────────────────────

const POLICIES = new Set(["none", "quarantine", "reject"])

function parseTags(text) {
  const tags = {}
  const order = []
  for (const part of text.split(";")) {
    const index = part.indexOf("=")
    if (index === -1) continue
    const name = part.slice(0, index).trim().toLowerCase()
    if (!name) continue
    const value = part.slice(index + 1).trim()
    order.push(name)
    if (!(name in tags)) tags[name] = value
  }
  return { tags, order }
}

// "mailto:reports@example.com!10m" becomes "reports@example.com".
function parseUris(value) {
  if (!value) return []
  return value
    .split(",")
    .map((uri) => uri.trim().replace(/![0-9]+[kmgt]?$/i, ""))
    .filter(Boolean)
    .map((uri) => uri.replace(/^mailto:/i, ""))
}

export function parseDmarc(record) {
  const text = String(record || "").trim()
  const { tags, order } = parseTags(text)
  const result = {
    valid: false,
    policy: null,
    subdomainPolicy: null,
    pct: 100,
    rua: parseUris(tags.rua),
    ruf: parseUris(tags.ruf),
    adkim: (tags.adkim || "r").toLowerCase() === "s" ? "strict" : "relaxed",
    aspf: (tags.aspf || "r").toLowerCase() === "s" ? "strict" : "relaxed",
    tags,
    problems: [],
  }

  if (order[0] !== "v" || !/^dmarc1$/i.test(tags.v || "")) {
    result.problems.push("not_first_v")
    return result
  }

  const policy = (tags.p || "").toLowerCase()
  if (!tags.p) result.problems.push("missing_policy")
  else if (!POLICIES.has(policy)) result.problems.push("invalid_policy")
  else result.policy = policy

  const sp = (tags.sp || "").toLowerCase()
  if (tags.sp && POLICIES.has(sp)) result.subdomainPolicy = sp
  else if (tags.sp) result.problems.push("invalid_subdomain_policy")

  if (tags.pct !== undefined) {
    const pct = Number(tags.pct)
    if (/^\d{1,3}$/.test(tags.pct) && pct >= 0 && pct <= 100) result.pct = pct
    else result.problems.push("invalid_pct")
  }

  // RFC 7489 section 6.6.3: a record with a bad or missing p= still counts as
  // p=none when it names a report address. Without one, receivers ignore it.
  if (!result.policy && result.rua.length > 0) {
    result.policy = "none"
    result.policyAssumed = true
  }
  result.valid = Boolean(result.policy)
  return result
}

// Reads the TXT records at _dmarc.<domain>. More than one DMARC record means
// receivers apply none of them (RFC 7489 section 6.6.3).
export function readDmarc(txtRecords) {
  const records = pickDmarcRecords(txtRecords)
  if (records.length === 0) return { status: "not_found", records: [], parsed: null, problems: [] }
  if (records.length > 1) return { status: "found", records, parsed: null, problems: ["multiple_records"] }
  const parsed = parseDmarc(records[0])
  return { status: "found", records, parsed, problems: parsed.problems }
}

// ── DKIM ─────────────────────────────────────────────────────────────────

// Wildcard DNS can answer any name with a TXT record, so a record only counts
// as a DKIM key when it carries a p= tag.
export function looksLikeDkim(record) {
  const { tags } = parseTags(String(record || ""))
  return "p" in tags && (!tags.v || /^dkim1$/i.test(tags.v))
}

// Approximate RSA key size from the length of the published key. Exact
// decoding needs crypto; the nearest standard size is enough to say "1024-bit"
// or "2048-bit".
function approximateRsaBits(base64) {
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, "")
  if (!clean) return null
  const padding = (clean.match(/=+$/) || [""])[0].length
  const bytes = Math.floor((clean.length * 3) / 4) - padding
  const estimate = (bytes - 38) * 8
  const sizes = [512, 1024, 2048, 3072, 4096]
  return sizes.reduce((best, size) => (Math.abs(size - estimate) < Math.abs(best - estimate) ? size : best), sizes[0])
}

export function parseDkim(record) {
  const { tags } = parseTags(String(record || ""))
  const key = (tags.p || "").replace(/\s+/g, "")
  const keyType = (tags.k || "rsa").toLowerCase()
  const result = {
    valid: looksLikeDkim(record),
    keyType,
    revoked: "p" in tags && key === "",
    keyBits: null,
    testing: (tags.t || "").toLowerCase().split(":").map((flag) => flag.trim()).includes("y"),
    problems: [],
  }
  if (!result.valid) {
    result.problems.push("not_dkim")
    return result
  }
  if (result.revoked) result.problems.push("revoked")
  else if (keyType === "rsa") {
    result.keyBits = approximateRsaBits(key)
    if (result.keyBits && result.keyBits < 2048) result.problems.push("short_key")
  }
  return result
}

export function readDkim(txtRecords) {
  const records = txtRecords.filter(looksLikeDkim)
  if (records.length === 0) return { status: "not_found", records: [], parsed: null, problems: [] }
  const parsed = parseDkim(records[0])
  return { status: "found", records, parsed, problems: parsed.problems }
}

function addOnce(list, item) {
  if (!list.includes(item)) list.push(item)
}
