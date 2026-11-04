// DNS lookups for the email check, with a hard time limit on each one.
// Server-only (node:dns). Each answer comes back as one of:
//   { status: "ok", records }   the name has records of this type
//   { status: "none" }          the name exists but has none of this type
//   { status: "nxdomain" }      the name doesn't exist in DNS
//   { status: "error", code }   DNS didn't answer in time, or failed
import { Resolver } from "node:dns/promises"

export const LOOKUP_TIMEOUT_MS = 5000

export function createResolver({ timeoutMs = LOOKUP_TIMEOUT_MS } = {}) {
  return new Resolver({ timeout: timeoutMs, tries: 1 })
}

function withTimeout(promise, timeoutMs) {
  let timer
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ status: "error", code: "ETIMEOUT" }), timeoutMs)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

function classify(error) {
  if (error?.code === "ENODATA") return { status: "none" }
  if (error?.code === "ENOTFOUND") return { status: "nxdomain" }
  return { status: "error", code: error?.code || "EUNKNOWN" }
}

export function lookupTxt(resolver, name, timeoutMs = LOOKUP_TIMEOUT_MS) {
  return withTimeout(
    resolver.resolveTxt(name).then((records) => ({ status: "ok", records }), classify),
    timeoutMs
  )
}

export function lookupMx(resolver, name, timeoutMs = LOOKUP_TIMEOUT_MS) {
  return withTimeout(
    resolver.resolveMx(name).then((records) => ({ status: "ok", records }), classify),
    timeoutMs
  )
}
