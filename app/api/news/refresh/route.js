import { createClient } from "@supabase/supabase-js"
import { timingSafeEqual } from "crypto"

// Industries we refresh on each cron tick.
const INDUSTRIES = [
  "Healthcare",
  "Legal",
  "Financial Services",
  "Retail / E-commerce",
  "Government / Defense Contractor",
  "Nonprofit / Church / Parish",
]

// How many items we try to source for each industry. The Claude call is
// asked for this many; anything fewer that survives URL validation is
// still persisted (partial refreshes are better than an empty feed).
const ITEMS_PER_INDUSTRY = 5

function buildPrompt(industry) {
  return `You are a cybersecurity news analyst for small and mid-sized ${industry} organizations.

Use the web_search tool to find ${ITEMS_PER_INDUSTRY} real, recent (published within the last 30 days) cybersecurity news stories that are directly relevant to ${industry}. Prefer stories from reputable sources: KrebsOnSecurity, BleepingComputer, The Record, DarkReading, CISA advisories, HHS OCR, industry trade press, or major newswires (Reuters, AP, WSJ).

For each story, return a JSON object with:
- "title": the actual headline from the article (under 120 characters, no editorializing)
- "summary": a 2-3 sentence plain-language summary of what happened and why it matters to ${industry} organizations
- "url": the canonical https URL to the original article on the publisher's site

Requirements:
- Every story MUST be a real story you found via web_search with a real, working URL.
- Do NOT invent or paraphrase headlines from memory. If web_search fails, return fewer items — never fabricate.
- Do NOT include URLs to paywalled archive pages, Google AMP, tracker redirects, or social media posts. Link to the publisher's canonical article.
- URLs must start with https://.

Return ONLY a valid JSON array of objects. No markdown, no code fences, no commentary before or after the JSON.`
}

// Pull a JSON array out of Claude's response. We accept either a clean
// array or one wrapped in a code fence, since the model occasionally
// slips a fence in despite the prompt. Throws on anything else.
function extractJsonArray(text) {
  if (!text) throw new Error("Empty model response")
  const trimmed = text.trim()
  // Strip ```json ... ``` or ``` ... ``` fences if present.
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  const raw = fenced ? fenced[1] : trimmed
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error("Model did not return an array")
  return parsed
}

// Accept only well-formed https URLs. Anything else — http://, javascript:,
// relative paths, missing host — gets dropped. We do not follow redirects
// or hit the network: this is structural validation only.
function isValidHttpsUrl(value) {
  if (typeof value !== "string" || value.length === 0) return false
  let parsed
  try {
    parsed = new URL(value)
  } catch {
    return false
  }
  if (parsed.protocol !== "https:") return false
  if (!parsed.hostname || !parsed.hostname.includes(".")) return false
  return true
}

// Bounded HEAD-request probe to confirm a URL actually resolves. Structural
// validation catches garbage strings but does not catch hallucinated URLs
// that happen to be syntactically correct. Accepts 2xx (ok), 405 (server
// rejected HEAD but the path clearly exists), and 403 (paywalled content
// is still real content). Everything else — including network timeouts,
// DNS failures, 404, and 5xx — is treated as unreachable. The timeout
// keeps a dead host from stalling the entire refresh cycle.
async function isUrlReachable(url, timeoutMs = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    })
    return res.ok || res.status === 405 || res.status === 403
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

// Timing-safe constant-time compare. timingSafeEqual throws on length
// mismatch, so we short-circuit on that first — which is itself a
// timing leak on length, but the secret length is not sensitive here
// (it's a deployment-time constant from CRON_SECRET).
function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false
  if (a.length === 0 || b.length === 0) return false
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

// Take the raw model output and shape it into rows ready for insert. Any
// row missing a title, summary, or passing https URL is dropped silently —
// we'd rather show fewer items than link users to a hallucinated URL.
// NOTE: this is structural-only. Reachability is checked in a second pass
// (verifyReachable) because network probes should not run inside a
// synchronous map().
function normalizeItems(raw, industry) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const title = typeof item.title === "string" ? item.title.trim() : ""
      const summary = typeof item.summary === "string" ? item.summary.trim() : ""
      const url = typeof item.url === "string" ? item.url.trim() : ""
      if (!title || !summary || !isValidHttpsUrl(url)) return null
      return {
        industry,
        title: title.slice(0, 240),
        summary: summary.slice(0, 1200),
        url,
      }
    })
    .filter(Boolean)
}

// Second-pass filter: probe each candidate URL with a bounded HEAD request
// and drop anything that does not resolve. Catches hallucinated URLs that
// are syntactically valid but point to nothing real. Runs concurrently
// across the candidate list so a dead host does not stall the probe queue.
async function verifyReachable(items) {
  const probes = await Promise.all(
    items.map(async (item) => {
      const ok = await isUrlReachable(item.url)
      if (!ok) {
        console.warn(`news refresh: URL unreachable, dropping: ${item.url}`)
      }
      return ok ? item : null
    })
  )
  return probes.filter(Boolean)
}

async function fetchNewsForIndustry(industry) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set")

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      // web_search lets Claude fetch real articles instead of hallucinating
      // plausible-sounding but fabricated headlines. max_uses is a hard
      // cap on how many searches a single request can make.
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
      messages: [{ role: "user", content: buildPrompt(industry) }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  // The response may contain tool_use blocks (from web_search) interleaved
  // with text blocks. We want the LAST text block, which is the model's
  // final answer after it has finished searching.
  const textBlocks = (data.content || []).filter((b) => b.type === "text")
  const finalText = textBlocks.length > 0 ? textBlocks[textBlocks.length - 1].text : ""
  const parsed = extractJsonArray(finalText)
  const structurallyValid = normalizeItems(parsed, industry)
  // Probe each URL. Drops fabricated URLs that parse cleanly but resolve
  // to nothing. Without this, a hallucinated https://thewallstreet-journal.com/
  // would sail straight into the cache.
  return verifyReachable(structurallyValid)
}

export async function GET(request) {
  // Require CRON_SECRET to be configured. If it is missing we fail closed —
  // a public refresh endpoint would let anyone burn our Anthropic budget
  // and rewrite the news cache. Previously the code treated a missing
  // CRON_SECRET as "allow everything", which was the exact opposite of
  // what you want when the env var is unset during a bad deploy.
  const expected = process.env.CRON_SECRET
  if (!expected) {
    return Response.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    )
  }

  // Prefer the Authorization: Bearer header (what Vercel Cron sends) over
  // a `?secret=` query param. Query strings show up in server logs and
  // referrer headers; the header does not. We still accept the legacy
  // query param so manually triggered runs keep working. Both are
  // compared against CRON_SECRET with timingSafeEqual via safeCompare.
  const authHeader = request.headers.get("authorization") || ""
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : ""
  const { searchParams } = new URL(request.url)
  const queryParam = searchParams.get("secret") || ""
  const authorized =
    (bearer.length > 0 && safeCompare(bearer, expected)) ||
    (queryParam.length > 0 && safeCompare(queryParam, expected))
  if (!authorized) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // News writes MUST use the service role key. The anon key is bound by
  // RLS and would silently drop rows under our current policies, so an
  // anon-key fallback would produce a half-populated cache with no
  // error. Fail loudly instead.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceRoleKey) {
    return Response.json(
      { error: "Supabase service role credentials not configured" },
      { status: 500 }
    )
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey
  )

  const results = {}
  const errors = {}

  for (const industry of INDUSTRIES) {
    try {
      const rows = await fetchNewsForIndustry(industry)

      if (rows.length === 0) {
        // Do NOT delete the existing cache in this case. If Claude came
        // back with zero valid rows — search failed, model hallucinated
        // broken URLs, parse failed — we'd rather users see stale items
        // than nothing at all.
        throw new Error("No valid news items returned from model")
      }

      // Insert new items before deleting old ones. This is NOT atomic.
      // Supabase has no transactions over the REST client, so:
      //   - Concurrent refreshes can interleave and produce duplicates.
      //   - If the delete step fails, old + new rows coexist until the
      //     next successful refresh (the dashboard sorts by created_at
      //     desc and limits the render, so this is tolerable).
      //   - Between insert and delete, a reader sees old + new together.
      // What this ordering DOES guarantee is the one thing that matters
      // for production: if Anthropic returns junk and the insert fails,
      // the cache is not wiped. The prior "delete then insert" ordering
      // emptied the feed every time the model misbehaved. If true atomic
      // replace is ever required, wrap this in a Postgres RPC/transaction.
      //
      // Steps:
      //   1. snapshot the ids of existing rows for this industry
      //   2. insert the fresh rows
      //   3. delete the snapshotted old rows by id
      const { data: existing, error: snapshotError } = await supabase
        .from("news_cache")
        .select("id")
        .eq("industry", industry)
      if (snapshotError) throw snapshotError

      const { error: insertError } = await supabase
        .from("news_cache")
        .insert(rows)
      if (insertError) throw insertError

      if (existing && existing.length > 0) {
        const oldIds = existing.map((r) => r.id)
        const { error: deleteError } = await supabase
          .from("news_cache")
          .delete()
          .in("id", oldIds)
        if (deleteError) {
          // Not fatal: the fresh rows are already live. Log and continue
          // so the rest of the industries still refresh.
          console.error(
            `news refresh: failed to purge old ${industry} rows`,
            deleteError
          )
        }
      }

      results[industry] = rows.length
    } catch (err) {
      errors[industry] = err.message
    }
  }

  // If every industry failed, return 500 so Vercel Cron surfaces the
  // failure in its alerting instead of quietly marking the job green.
  const anySuccess = Object.keys(results).length > 0
  const status = anySuccess ? 200 : 500

  return Response.json(
    {
      ok: anySuccess,
      refreshed: results,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}
