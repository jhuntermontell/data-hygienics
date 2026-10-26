// Ask Data Hygienics: model, caps and prices in one place.
//
// The route (app/api/assistant) enforces the caps; the usage meter
// (app/api/assistant/usage) reports them; the eval harness
// (scripts/assistant-eval.mjs) prices runs with PRICES. Relative imports only
// in lib/assistant/* so the harness can load these files in plain Node.

// The owner chose Sonnet for the member assistant.
export const MODEL = "claude-sonnet-5-5"

// Chat workload: low effort keeps thinking short (thinking counts toward
// max_tokens), and answers are meant to be short anyway.
export const EFFORT = "low"
export const MAX_OUTPUT_TOKENS = 1024

// Retrieved research per question, estimated as words x 1.3.
export const CONTEXT_TOKEN_BUDGET = 12000

// How many earlier messages (user + assistant) travel with each question.
export const HISTORY_TURNS = 6

// Per question, and per earlier assistant message we accept back.
export const MAX_QUESTION_CHARS = 1500
export const MAX_HISTORY_MESSAGE_CHARS = 4000

// Per member. Tokens are input (including cache reads and writes) plus
// output, per calendar month in UTC. Messages reset at midnight UTC.
//
// The monthly cap is 600,000 (raised from 250,000 for the membership).
// Raised rather than shrinking CONTEXT_TOKEN_BUDGET: the eval harness showed
// retrieval sends 1,300 to 7,000 tokens of sources per question, so a typical
// exchange is 9,000 to 12,000 tokens, not 20,000. 600,000 is roughly fifty
// ordinary questions a month, or thirty worst-case ones. Cost ceiling for a
// member at the cap: about 550,000 input tokens, mostly cache reads at $0.20
// per million plus fresh input at $2 per million (call it $0.35), plus thirty
// answers of about 600 output tokens at $10 per million ($0.18): about $0.55
// a month, well under the $8 Home price. A member who reaches the cap is the
// power user we want. Copy says "about fifty questions a month"; never
// "unlimited".
export const MONTHLY_TOKEN_CAP = 600000
export const DAILY_MESSAGE_CAP = 40

// Server-side refusal fallback for Sonnet 5.5 (Claude API only). The
// "default" form routes by refusal category; Haiku 5.5 has no server-side
// fallback, so the harness sends neither field there.
export const FALLBACK_BETA = "server-side-fallback-2026-07-01"

// US dollars per million tokens, for the harness. Cache reads bill at a
// tenth of input and 5-minute cache writes at 1.25x input.
export const PRICES = {
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
}

export function costFor(model, usage) {
  const p = PRICES[model]
  if (!p || !usage) return 0
  const perToken = (rate) => rate / 1_000_000
  return (
    (usage.input_tokens || 0) * perToken(p.input) +
    (usage.output_tokens || 0) * perToken(p.output) +
    (usage.cache_read_input_tokens || 0) * perToken(p.cacheRead) +
    (usage.cache_creation_input_tokens || 0) * perToken(p.cacheWrite)
  )
}

export const estimateTokens = (words) => Math.ceil(words * 1.3)
