// Turns a checkDomain() result into plain English: one readout per record,
// each with a state, the raw record, what it means and what to do next. Pure:
// no imports, so the page can call it in the browser.
//
// Language rules: say what the record says and when we read it. Never say a
// domain is protected or safe, never grade it, and never call DKIM missing.

export const STATE_LABELS = {
  found: "Found",
  not_found: "Not found",
  could_not_check: "Could not check",
}

// Where "what to do next" points: our published step and control, never a
// vendor.
export const LINKS = {
  step: { href: "/steps/b-domain-email-auth", label: "Lock your domain and stop others sending email as you" },
  control: { href: "/controls/email-authentication", label: "Email authentication, explained" },
}

const RETRY = "Try the check again in a minute. If it keeps failing, your DNS provider may be having trouble."

function plural(count, one, many) {
  return count === 1 ? one : many
}

// ── SPF ──────────────────────────────────────────────────────────────────

const SPF_ALL = {
  fail: "Your SPF record lists the servers allowed to send mail as you and tells receivers to fail mail from any other server.",
  softfail: "Your SPF record lists the servers allowed to send mail as you and asks receivers to treat mail from any other server as suspect, without failing it outright.",
  neutral: "Your SPF record lists some servers, then says nothing either way about mail from any other server (?all), so it gives receivers little to act on.",
  pass: "Your SPF record ends in +all, which allows every server on the internet to send mail as you and cancels out the servers it lists.",
}

function explainSpf(spf, domain) {
  const raw = (spf.records || []).map((value) => ({ name: domain, value }))
  const base = { key: "spf", name: "SPF", fullName: "Sender Policy Framework", state: spf.status, raw, details: [] }

  if (spf.status === "could_not_check") {
    return { ...base, meaning: "DNS didn't answer in time, so we can't say whether your domain publishes an SPF record.", next: { text: RETRY } }
  }
  if (spf.status === "not_found") {
    return {
      ...base,
      meaning: "Your domain doesn't publish an SPF record, so receiving mail servers have no list of the servers allowed to send mail as you.",
      next: { text: "Ask whoever runs your email to publish one SPF record that names every service that sends mail as you.", link: LINKS.step },
    }
  }
  if (spf.problems.includes("multiple_records")) {
    return {
      ...base,
      meaning: `Your domain publishes ${spf.records.length} SPF records. Receivers treat more than one as an error and ignore all of them.`,
      next: { text: "Merge them into a single SPF record that names every service that sends mail as you, then delete the extras.", link: LINKS.step },
    }
  }

  const parsed = spf.parsed
  let meaning
  if (parsed.all) meaning = SPF_ALL[parsed.all]
  else if (parsed.redirect) meaning = `Your SPF record hands the decision to the SPF record at ${parsed.redirect}.`
  else meaning = "Your SPF record lists some servers but doesn't say what to do with mail from any other server, so receivers treat that mail as neutral."

  const details = []
  if (parsed.includes.length > 0) {
    details.push(`It names ${plural(parsed.includes.length, "this service", "these services")}: ${parsed.includes.join(", ")}.`)
  }
  if (parsed.problems.includes("too_many_lookups")) {
    details.push(`It needs ${parsed.lookups} DNS lookups before counting the services it names, and SPF allows 10. Receivers stop at the limit and treat the record as an error.`)
  } else if (parsed.lookups > 0) {
    details.push(`It uses ${parsed.lookups} of the 10 DNS lookups SPF allows, before counting any inside the services it names.`)
  }
  if (parsed.problems.includes("ptr")) details.push("It uses the ptr mechanism, which the SPF standard asks senders not to use.")
  if (parsed.problems.includes("syntax")) details.push("Part of the record doesn't follow SPF syntax, and receivers may reject the whole record because of it.")

  let next
  if (parsed.all === "pass" || parsed.all === "neutral" || parsed.problems.includes("no_all")) {
    next = { text: "End the record with ~all or -all so receivers know mail from any other server isn't yours.", link: LINKS.step }
  } else if (parsed.problems.includes("too_many_lookups") || parsed.problems.includes("syntax")) {
    next = { text: "Ask whoever runs your email to fix the record so receivers can read it.", link: LINKS.step }
  } else {
    next = {
      text: "Update this record whenever you add or drop a service that sends mail as you. SPF checks the hidden sender address, not the From line people see, so read the DMARC result too.",
      link: LINKS.step,
    }
  }
  return { ...base, meaning, details, next }
}

// ── DMARC ────────────────────────────────────────────────────────────────

const DMARC_POLICY = {
  none: "Your DMARC record is in monitoring mode (p=none). Receivers send reports but still deliver mail that fails the checks, including mail faked to look like it came from you.",
  quarantine: "Your DMARC record asks receivers to send mail that fails the checks to spam or quarantine (p=quarantine).",
  reject: "Your DMARC record asks receivers to refuse mail that fails the checks (p=reject), the strictest setting DMARC has.",
}

function explainDmarc(dmarc, domain) {
  const raw = (dmarc.records || []).map((value) => ({ name: `_dmarc.${dmarc.foundAt || domain}`, value }))
  const base = { key: "dmarc", name: "DMARC", fullName: "Domain-based Message Authentication, Reporting and Conformance", state: dmarc.status, raw, details: [] }

  if (dmarc.status === "could_not_check") {
    return { ...base, meaning: "DNS didn't answer in time, so we can't say whether your domain publishes a DMARC record.", next: { text: RETRY } }
  }
  if (dmarc.status === "not_found") {
    return {
      ...base,
      meaning: `Your domain doesn't publish a DMARC record at _dmarc.${domain}, so receivers get no instruction about mail that uses your domain in the From line and fails the checks.`,
      next: {
        text: "Publish a DMARC record with p=none and a report address, read the reports for a few weeks, then move to p=quarantine and later p=reject.",
        link: LINKS.control,
      },
    }
  }

  const details = []
  if (dmarc.inherited) {
    details.push(`There's no record at _dmarc.${domain}, so receivers use the one published for ${dmarc.foundAt}.`)
  }

  if (dmarc.problems.includes("multiple_records")) {
    return {
      ...base,
      details,
      meaning: `Your domain publishes ${dmarc.records.length} DMARC records. Receivers apply none of them when there's more than one.`,
      next: { text: "Keep one DMARC record and delete the others.", link: LINKS.control },
    }
  }

  const parsed = dmarc.parsed
  if (!parsed.valid) {
    return {
      ...base,
      details,
      meaning: "Your domain publishes a DMARC record, but it doesn't follow the format, so receivers ignore it. A DMARC record must start with v=DMARC1 and include a policy such as p=none.",
      next: { text: "Rewrite the record so it starts with v=DMARC1; p=none; and names a report address with rua=.", link: LINKS.control },
    }
  }

  // A subdomain that inherits its parent's record gets the sp= policy if
  // there is one.
  const policy = dmarc.inherited && parsed.subdomainPolicy ? parsed.subdomainPolicy : parsed.policy
  let meaning = DMARC_POLICY[policy]
  if (parsed.policyAssumed) {
    meaning = "Your DMARC record has no valid policy, so receivers treat it as monitoring mode (p=none) and still deliver mail that fails the checks."
  }

  if (policy !== "none" && parsed.pct < 100) {
    details.push(`It applies that to ${parsed.pct} percent of failing mail (pct=${parsed.pct}). Receivers handle the rest one step more gently.`)
  }
  if (!dmarc.inherited && parsed.subdomainPolicy && parsed.subdomainPolicy !== parsed.policy) {
    details.push(`Subdomains get a different policy: sp=${parsed.subdomainPolicy}.`)
  }
  if (parsed.rua.length > 0) {
    details.push(`Reports go to ${parsed.rua.join(", ")}.`)
  } else {
    details.push("It names no report address (rua=), so nobody receives reports of who sends mail using your domain.")
  }
  if (parsed.problems.includes("invalid_pct")) details.push("The pct= value isn't a whole number from 0 to 100, so receivers apply the policy to all failing mail.")

  let next
  if (parsed.rua.length === 0) {
    next = { text: "Add a report address with rua=mailto: so you can see who sends mail using your domain before you tighten the policy.", link: LINKS.control }
  } else if (policy === "none") {
    next = { text: "Read the reports, make sure every service that sends mail as you passes, then move to p=quarantine and later p=reject.", link: LINKS.control }
  } else if (policy === "quarantine" || parsed.pct < 100) {
    next = { text: "When the reports show your real mail passing, move to p=reject at 100 percent.", link: LINKS.control }
  } else {
    next = { text: "Keep reading the reports, so a new service that sends mail as you gets set up before its mail is refused.", link: LINKS.control }
  }
  return { ...base, meaning, details, next }
}

// ── DKIM ─────────────────────────────────────────────────────────────────

const FIND_SELECTOR =
  "Open a message you sent from this domain, show its full headers, find the line that starts DKIM-Signature, and copy the value after s=. Type it in the selector box and check again."

function explainDkim(dkim, mx, domain) {
  const raw = dkim.keys.map((key) => ({ name: `${key.selector}._domainkey.${domain}`, value: key.record }))
  const base = { key: "dkim", name: "DKIM", fullName: "DomainKeys Identified Mail", state: dkim.status, raw, details: [] }

  if (dkim.status === "found") {
    const names = dkim.keys.map((key) => (key.service ? `${key.selector} (${key.service})` : key.selector))
    const details = dkim.keys.map((key) => {
      if (key.parsed.revoked) return `The key at ${key.selector} is empty, which means it has been retired.`
      const size = key.parsed.keyBits ? `${key.parsed.keyBits}-bit ` : ""
      const type = key.parsed.keyType === "rsa" ? "RSA" : key.parsed.keyType
      let line = `${key.selector}: a ${size}${type} key.`
      if (key.parsed.problems.includes("short_key")) line += " Most sending services now offer 2048-bit keys, so ask yours to switch."
      if (key.parsed.testing) line += " It's marked as testing (t=y), so some receivers don't act on it."
      return line
    })
    if (dkim.typedSelector && dkim.typedFound === false) {
      details.unshift(`We found no key at the selector you typed, ${dkim.typedSelector}. Check its spelling against the s= value in a message you sent.`)
    }
    return {
      ...base,
      meaning: `We found a DKIM key at ${plural(names.length, "the selector", "the selectors")} ${names.join(", ")}. Receivers use it to check that mail signed with it came from you and wasn't changed on the way.`,
      details,
      next: {
        text: "Make sure every service that sends mail as you signs with its own key. To check another service, type its selector and check again.",
        link: LINKS.step,
      },
    }
  }

  if (dkim.reason === "lookup_failed") {
    return { ...base, meaning: "DNS didn't answer in time, so we couldn't look for DKIM keys.", next: { text: RETRY } }
  }
  if (dkim.reason === "typed_selector_empty") {
    return {
      ...base,
      meaning: `We found no DKIM key at the selector ${dkim.typedSelector}, or at the common selectors we tried. That doesn't tell us whether your mail is signed: the selector may be spelled differently, or belong to another service.`,
      next: { text: FIND_SELECTOR },
    }
  }

  const provider = mx?.provider?.name
  return {
    ...base,
    meaning: `We couldn't check DKIM without the selector your sending service uses, the name it publishes its key under. None of the ${dkim.tried.length} common selectors we tried answered, which doesn't mean DKIM is off.${provider ? ` Your mail goes to ${provider}, so start with the selector it gave you when DKIM was set up.` : ""}`,
    next: { text: FIND_SELECTOR },
  }
}

// ── Mail servers ─────────────────────────────────────────────────────────

function explainMx(mx, domain) {
  if (mx.status === "could_not_check") return "DNS didn't answer in time when we asked where this domain's mail goes."
  if (mx.nullMx) {
    return `${domain} says it accepts no email (a null MX record). If it never sends email either, an SPF record of v=spf1 -all and a DMARC record with p=reject tell receivers to refuse mail that claims to come from it.`
  }
  if (mx.status === "not_found") {
    return `${domain} publishes no mail servers (MX records), so it doesn't receive email. If it never sends email either, an SPF record of v=spf1 -all and a DMARC record with p=reject tell receivers to refuse mail that claims to come from it.`
  }
  if (mx.provider) return `Mail for ${domain} goes to ${mx.provider.name}.`
  return `Mail for ${domain} goes to ${mx.hosts.length} ${plural(mx.hosts.length, "server", "servers")}, starting with ${mx.hosts[0].exchange}.`
}

export function explain(result) {
  if (!result.exists) {
    return {
      domain: result.domain,
      checkedAt: result.checkedAt,
      exists: false,
      mail: `We couldn't find ${result.domain} in public DNS. Check the spelling, or try the part after the @ in your email address.`,
      records: [],
    }
  }
  return {
    domain: result.domain,
    checkedAt: result.checkedAt,
    exists: true,
    mail: explainMx(result.mx, result.domain),
    records: [explainSpf(result.spf, result.domain), explainDmarc(result.dmarc, result.domain), explainDkim(result.dkim, result.mx, result.domain)],
  }
}

// "Checked on November 4, 2026 at 21:40 UTC"
export function formatCheckedAt(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date)
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(date)
  return `Checked on ${day} at ${time} UTC`
}
