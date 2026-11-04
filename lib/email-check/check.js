// Runs the email spoofing check for one domain: MX, SPF, DMARC and DKIM.
// Server-only. Returns plain data that explain.js turns into words, so the
// public page and Verified's evidence record can read the same result.
//
// Every record ends in one of three states: "found", "not_found" or
// "could_not_check". DKIM never ends in "not_found": without the sending
// service's selector, an empty answer proves nothing.
import { createResolver, lookupMx, lookupTxt, LOOKUP_TIMEOUT_MS } from "./lookup.js"
import { joinTxt, readSpf, readDmarc, readDkim } from "./parse.js"
import { COMMON_SELECTORS, serviceForSelector } from "./selectors.js"

// When a subdomain has no DMARC record, receivers fall back to the parent
// domain's record. We walk up at most this many levels.
const MAX_DMARC_WALK = 4

const MAIL_PROVIDERS = [
  { pattern: /(^|\.)(google\.com|googlemail\.com)$/, name: "Google Workspace", selector: "google" },
  { pattern: /\.mail\.protection\.outlook\.com$/, name: "Microsoft 365", selector: "selector1" },
  { pattern: /(^|\.)messagingengine\.com$/, name: "Fastmail", selector: "fm1" },
  { pattern: /(^|\.)protonmail\.ch$/, name: "Proton Mail", selector: "protonmail" },
  { pattern: /(^|\.)zoho\.(com|eu|in)$/, name: "Zoho Mail", selector: null },
]

function mailProvider(hosts) {
  for (const { exchange } of hosts) {
    const host = String(exchange || "").toLowerCase().replace(/\.$/, "")
    const match = MAIL_PROVIDERS.find(({ pattern }) => pattern.test(host))
    if (match) return { name: match.name, selector: match.selector }
  }
  return null
}

function readMx(answer) {
  if (answer.status === "ok" && answer.records.length > 0) {
    const hosts = answer.records
      .map(({ exchange, priority }) => ({ exchange, priority }))
      .sort((a, b) => a.priority - b.priority)
    // A single MX of "." (RFC 7505) says the domain accepts no mail.
    const nullMx = hosts.length === 1 && (hosts[0].exchange === "" || hosts[0].exchange === ".")
    return { status: nullMx ? "not_found" : "found", hosts, nullMx, provider: mailProvider(hosts) }
  }
  if (answer.status === "error") return { status: "could_not_check", hosts: [], nullMx: false, provider: null }
  return { status: "not_found", hosts: [], nullMx: false, provider: null }
}

function txtState(answer, read) {
  if (answer.status === "ok") return read(joinTxt(answer.records))
  if (answer.status === "error") return { status: "could_not_check", records: [], parsed: null, problems: [] }
  return read([])
}

async function lookupDmarc(resolver, domain, first, timeoutMs) {
  const at = (name, answer) => ({ ...txtState(answer, readDmarc), foundAt: name, inherited: name !== domain })
  let result = at(domain, first)
  if (result.status !== "not_found") return result

  const labels = domain.split(".")
  for (let i = 1; i <= MAX_DMARC_WALK && labels.length - i >= 2; i += 1) {
    const parent = labels.slice(i).join(".")
    const answer = await lookupTxt(resolver, `_dmarc.${parent}`, timeoutMs)
    const next = at(parent, answer)
    if (next.status === "found") return next
    if (next.status === "could_not_check") return { ...result, status: "could_not_check" }
  }
  return result
}

function readDkimAnswers(answers, typedSelector) {
  const keys = []
  let failed = 0
  for (const { selector, answer } of answers) {
    if (answer.status === "error") {
      failed += 1
      continue
    }
    if (answer.status !== "ok") continue
    const read = readDkim(joinTxt(answer.records))
    if (read.status === "found") {
      keys.push({ selector, service: serviceForSelector(selector), record: read.records[0], parsed: read.parsed, problems: read.problems })
    }
  }

  const tried = answers.map(({ selector }) => selector)
  if (keys.length > 0) {
    const typedFound = typedSelector ? keys.some((key) => key.selector === typedSelector) : null
    return { status: "found", keys, tried, typedSelector, typedFound }
  }

  const typedAnswer = typedSelector ? answers.find(({ selector }) => selector === typedSelector)?.answer : null
  let reason = "no_selector"
  if (typedAnswer && typedAnswer.status !== "error") reason = "typed_selector_empty"
  else if (failed === answers.length) reason = "lookup_failed"
  return { status: "could_not_check", reason, keys, tried, typedSelector }
}

export async function checkDomain(domain, { selector = null, timeoutMs = LOOKUP_TIMEOUT_MS, now = () => new Date() } = {}) {
  const resolver = createResolver({ timeoutMs })
  const selectors = [...new Set([selector, ...COMMON_SELECTORS.map((entry) => entry.selector)].filter(Boolean))]

  try {
    const [mxAnswer, apexAnswer, dmarcAnswer, dkimAnswers] = await Promise.all([
      lookupMx(resolver, domain, timeoutMs),
      lookupTxt(resolver, domain, timeoutMs),
      lookupTxt(resolver, `_dmarc.${domain}`, timeoutMs),
      Promise.all(
        selectors.map(async (name) => ({ selector: name, answer: await lookupTxt(resolver, `${name}._domainkey.${domain}`, timeoutMs) }))
      ),
    ])

    // NXDOMAIN on both the MX and TXT queries means the name isn't in DNS.
    const exists = !(mxAnswer.status === "nxdomain" && apexAnswer.status === "nxdomain")
    const dmarc = exists ? await lookupDmarc(resolver, domain, dmarcAnswer, timeoutMs) : txtState(dmarcAnswer, readDmarc)

    return {
      domain,
      checkedAt: now().toISOString(),
      exists,
      mx: readMx(mxAnswer),
      spf: txtState(apexAnswer, readSpf),
      dmarc,
      dkim: readDkimAnswers(dkimAnswers, selector),
    }
  } finally {
    resolver.cancel()
  }
}
