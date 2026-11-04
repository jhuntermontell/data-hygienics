// Turns what a person types into a bare, public domain name, or explains why
// it can't be checked. Pure: no imports, so it runs in the browser, in the
// API route and in scripts/email-check.mjs alike.
//
// Accepts "you@example.com", "https://www.example.com/contact", "example.com."
// and similar, and returns "example.com" (or "www.example.com": we check the
// name given, after stripping the address and URL parts around it).

export const MAX_DOMAIN_LENGTH = 253
export const MAX_INPUT_LENGTH = 512

// Names that never resolve on the public internet, or that point back at the
// asker's own network. Matched against the last label (or the last two).
const RESERVED_SUFFIXES = [
  "localhost",
  "local",
  "localdomain",
  "internal",
  "intranet",
  "private",
  "corp",
  "home",
  "lan",
  "test",
  "example",
  "invalid",
  "onion",
  "arpa",
  "home.arpa",
]

const RESERVED_NAMES = ["example.com", "example.net", "example.org"]

const LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/
const TLD = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/
const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/

// Returns { ok: true, domain } or { ok: false, reason }, where reason is one
// of the keys in DOMAIN_ERRORS.
export function normalizeDomain(input) {
  if (typeof input !== "string") return { ok: false, reason: "empty" }
  if (input.length > MAX_INPUT_LENGTH) return { ok: false, reason: "too_long" }

  let value = input.trim().toLowerCase()
  if (!value) return { ok: false, reason: "empty" }

  value = value.replace(/^mailto:/, "")
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
  // Anything after the host: a path, a query or a fragment.
  value = value.split(/[/?#]/)[0]
  // An email address, or credentials in a URL: keep what follows the last @.
  if (value.includes("@")) value = value.slice(value.lastIndexOf("@") + 1)

  if (value.includes("[") || (value.match(/:/g) || []).length > 1) {
    return { ok: false, reason: "ip" }
  }
  // A port.
  value = value.replace(/:\d*$/, "")
  value = value.replace(/\.+$/, "")
  if (!value) return { ok: false, reason: "empty" }
  if (IPV4.test(value)) return { ok: false, reason: "ip" }

  // Internationalised names become their xn-- form, the way DNS stores them.
  if (/[^\x00-\x7f]/.test(value)) {
    try {
      value = new URL(`http://${value}`).hostname
    } catch {
      return { ok: false, reason: "invalid" }
    }
  }

  if (value.length > MAX_DOMAIN_LENGTH) return { ok: false, reason: "too_long" }

  const labels = value.split(".")
  if (labels.length < 2) return { ok: false, reason: "no_suffix" }
  if (!labels.every((label) => LABEL.test(label))) return { ok: false, reason: "invalid" }
  if (!TLD.test(labels[labels.length - 1])) return { ok: false, reason: "invalid" }

  const lastTwo = labels.slice(-2).join(".")
  if (
    RESERVED_SUFFIXES.includes(labels[labels.length - 1]) ||
    RESERVED_SUFFIXES.includes(lastTwo) ||
    RESERVED_NAMES.includes(lastTwo)
  ) {
    return { ok: false, reason: "reserved" }
  }

  return { ok: true, domain: value }
}

// A DKIM selector is one or more DNS labels. People sometimes paste the whole
// name ("selector1._domainkey.example.com") or the header tag ("s=google");
// both are trimmed to the selector itself. Empty input is fine: the selector
// is optional.
export function normalizeSelector(input) {
  if (input == null) return { ok: true, selector: null }
  if (typeof input !== "string" || input.length > MAX_INPUT_LENGTH) return { ok: false, reason: "selector" }

  let value = input.trim().toLowerCase()
  if (!value) return { ok: true, selector: null }
  value = value.replace(/^s=/, "").replace(/;$/, "")
  const marker = value.indexOf("._domainkey")
  if (marker !== -1) value = value.slice(0, marker)
  value = value.replace(/\.+$/, "")

  if (value.length > 63) return { ok: false, reason: "selector" }
  const labels = value.split(".")
  if (!labels.every((label) => LABEL.test(label))) return { ok: false, reason: "selector" }
  return { ok: true, selector: value }
}

// Plain-English reasons, shown under the form.
export const DOMAIN_ERRORS = {
  empty: "Type a domain, such as yourbusiness.com.",
  too_long: "That's longer than any domain name can be. Type just the part after the @ in your email address.",
  ip: "That looks like an IP address. This check needs a domain name, such as yourbusiness.com.",
  no_suffix: "Add the ending, such as .com or .org, so we know which domain to check.",
  invalid: "That doesn't look like a domain name. Type just the part after the @ in your email address.",
  reserved: "That name only works inside a private network or is reserved for examples, so public DNS has nothing to check.",
  selector: "A DKIM selector is a short name like google or selector1. Leave the box empty if you don't know it.",
}
