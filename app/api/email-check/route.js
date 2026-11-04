import { NextResponse } from "next/server"
import { normalizeDomain, normalizeSelector, DOMAIN_ERRORS } from "@/lib/email-check/domain"
import { checkDomain } from "@/lib/email-check/check"
import { createRateLimiter } from "@/lib/email-check/rate-limit"

// The free email spoofing check (/email-check). POST only, so the domain never
// sits in a URL, a server log line or a browser history entry. Nothing is
// stored and nothing is logged except unexpected errors, which carry no
// domain. No analytics event: CLAUDE.md caps the list.

const MAX_BODY_BYTES = 2048
const take = createRateLimiter()

const NO_STORE = { "Cache-Control": "no-store" }

function clientKey(request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "unknown"
}

function reply(body, status = 200, headers = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } })
}

export async function POST(request) {
  let body
  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) return reply({ error: "invalid", message: DOMAIN_ERRORS.too_long }, 400)
    body = JSON.parse(text || "{}")
  } catch {
    return reply({ error: "invalid", message: DOMAIN_ERRORS.invalid }, 400)
  }

  const domain = normalizeDomain(body?.domain)
  if (!domain.ok) return reply({ error: "domain", message: DOMAIN_ERRORS[domain.reason] }, 400)
  const selector = normalizeSelector(body?.selector)
  if (!selector.ok) return reply({ error: "selector", message: DOMAIN_ERRORS.selector }, 400)

  const limit = take(clientKey(request))
  if (!limit.allowed) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterSeconds / 60))
    return reply(
      {
        error: "rate_limited",
        message: `You've run a lot of checks in the last few minutes. Wait about ${minutes} ${minutes === 1 ? "minute" : "minutes"} and try again.`,
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    )
  }

  try {
    const result = await checkDomain(domain.domain, { selector: selector.selector })
    return reply({ result })
  } catch (error) {
    console.error("email-check failed:", error?.code || error?.message || error)
    return reply({ error: "failed", message: "The check didn't finish. Try again in a minute." }, 500)
  }
}
