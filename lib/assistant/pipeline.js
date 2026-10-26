// One pipeline for the route and the eval harness: retrieve, build the
// messages, and shape the request for a given model. The route streams the
// request; the harness sends it non-streaming. Everything else is identical.
//
// Relative imports only: scripts/assistant-eval.mjs loads this in plain Node.
import { retrieve } from "./retrieve.js"
import { SYSTEM_PROMPT, buildMessages, sanitizeHistory } from "./prompt.js"
import { CONTEXT_TOKEN_BUDGET, EFFORT, FALLBACK_BETA, MAX_OUTPUT_TOKENS, MODEL } from "./limits.js"

// The previous user question helps retrieval on follow-ups.
function lastUserText(history) {
  const users = sanitizeHistory(history).filter((m) => m.role === "user")
  return users.length ? users[users.length - 1].content : ""
}

export function prepare({ history = [], question }) {
  const chunks = retrieve(question, { budgetTokens: CONTEXT_TOKEN_BUDGET, context: lastUserText(history) })
  const messages = buildMessages({ history, question, chunks })
  const sources = chunks.map((c) => ({ title: c.title, url: c.url }))
  return { chunks, messages, sources }
}

// Request body for client.beta.messages.{stream,create}. Sonnet 5.5 gets the
// server-side refusal fallback ("default" routes by refusal category; scam
// questions can trip the cyber classifier). Haiku 5.5 has no server-side
// fallback, so it gets neither field. No `thinking` parameter: both models
// run adaptive thinking by default, kept short by low effort.
export function requestParams(messages, model = MODEL) {
  const params = {
    model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages,
    output_config: { effort: EFFORT },
  }
  if (model.startsWith("claude-sonnet-5-5")) {
    params.betas = [FALLBACK_BETA]
    params.fallbacks = "default"
  }
  return params
}

// Total usage across attempts. With a fallback, usage.iterations lists each
// attempt (the declined one included); top-level usage covers only the last.
export function sumUsage(usage) {
  const fields = ["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"]
  const total = Object.fromEntries(fields.map((f) => [f, 0]))
  const parts = Array.isArray(usage?.iterations) && usage.iterations.length ? usage.iterations : [usage || {}]
  for (const part of parts) for (const f of fields) total[f] += Number(part?.[f]) || 0
  return total
}

// Input as the caps count it: uncached input plus cache reads and writes.
export const billedInput = (u) => u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens

export function answerText(message) {
  return (message?.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
}

// Sources the answer actually linked to, in order of first link. When the
// answer links none (a "we don't know yet" answer, say), the top three
// retrieved pages come back as the nearest pages instead.
export function citedSources(text, sources) {
  const cited = []
  for (const match of String(text).matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = match[1].replace(/^https:\/\/datahygienics\.com/, "").replace(/(.)\/$/, "$1")
    const hit = sources.find((s) => s.url === href)
    if (hit && !cited.includes(hit)) cited.push(hit)
  }
  return cited.length ? { sources: cited, nearest: false } : { sources: sources.slice(0, 3), nearest: true }
}
