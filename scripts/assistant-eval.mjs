#!/usr/bin/env node
// Eval harness for Ask Data Hygienics (the member assistant).
//
//   node scripts/assistant-eval.mjs                 Sonnet 5.5 and Haiku 5.5, full run
//   node scripts/assistant-eval.mjs --dry           retrieval only, no API calls
//   node scripts/assistant-eval.mjs --only sonnet   one model (sonnet | haiku)
//
// Runs every question in scripts/assistant-eval-questions.json through the
// same pipeline the route uses (lib/assistant: retrieval, system prompt,
// caps, request shape), non-streaming, and writes
// output/assistant-eval/<ISO timestamp>.md with both answers side by side,
// latency, tokens, cost (lib/assistant/limits.js PRICES) and automated flags.
// Reads ANTHROPIC_API_KEY from the environment or .env.local. A full run
// costs a few cents.
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import Anthropic from "@anthropic-ai/sdk"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href)

const { prepare, requestParams, sumUsage, answerText } = await load("lib/assistant/pipeline.js")
const { costFor, estimateTokens } = await load("lib/assistant/limits.js")
const { tools } = await load("lib/toolkit.js")

const MODELS = { sonnet: "claude-sonnet-5-5", haiku: "claude-haiku-5-5" }

// ── Args and env ────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const dry = args.includes("--dry")
const onlyIndex = args.indexOf("--only")
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : null
if (only && !MODELS[only]) {
  console.error(`--only takes sonnet or haiku, not "${only}"`)
  process.exit(1)
}
const runModels = only ? [only] : ["sonnet", "haiku"]

function loadEnvLocal() {
  const file = path.join(root, ".env.local")
  if (!existsSync(file)) return
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const match = raw.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2")
  }
}

const questions = JSON.parse(readFileSync(path.join(root, "scripts/assistant-eval-questions.json"), "utf8"))

// ── Dry run: retrieval only ─────────────────────────────────────────────
if (dry) {
  for (const q of questions) {
    const { chunks } = prepare({ question: q.question })
    const words = chunks.reduce((s, c) => s + c.words, 0)
    console.log(`\n${q.id} (${q.category})\n  ${q.question}\n  ${chunks.length} sources, ~${estimateTokens(words)} tokens`)
    for (const c of chunks.slice(0, 6)) {
      console.log(`  ${c.score.toFixed(2).padStart(6)}  ${c.kind.padEnd(14)} ${c.url}  | ${c.title}`)
    }
  }
  process.exit(0)
}

loadEnvLocal()
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is not set (environment or .env.local).")
  process.exit(1)
}
const client = new Anthropic()

// ── Flags ───────────────────────────────────────────────────────────────
const VENDORS = [
  ...new Set([
    ...tools.flatMap((t) => [t.name, ...(t.alternatives || []).map((a) => a.name)]),
    "Apple", "Google", "Microsoft", "Amazon", "Meta", "Facebook", "Instagram", "WhatsApp", "TikTok",
    "Snapchat", "ChatGPT", "OpenAI", "Claude", "Anthropic", "Gemini", "Copilot", "Norton", "McAfee",
    "Avast", "AVG", "Kaspersky", "Bitdefender", "Malwarebytes", "ESET", "Aura", "LifeLock",
    "NordVPN", "ExpressVPN", "Surfshark", "1Password", "LastPass", "Dashlane", "Keeper", "Bitwarden",
    "Proton", "Authy", "Duo", "Okta", "YubiKey", "Yubico", "Zelle", "Venmo", "PayPal", "Cash App",
    "Western Union", "Ring", "Nest", "Arlo", "Wyze", "Verizon", "AT&T", "T-Mobile", "Comcast", "Zoom",
    "Slack", "Telegram", "Dropbox", "Backblaze", "Carbonite", "IDrive", "CrowdStrike", "SentinelOne",
    "Sophos", "Webroot", "Trend Micro", "Microsoft Defender", "Tesla", "FordPass", "MyQ", "E-ZPass",
  ]),
].filter((name) => name && !/^your /i.test(name))

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const LINK = /\[[^\]]*\]\(([^)\s]+)\)/g

function linkedUrls(text) {
  return [...text.matchAll(LINK)].map((m) => m[1].replace(/^https:\/\/datahygienics\.com/, ""))
}

// Digits in a domain name (ic3.gov) aren't figures; a link in parentheses
// right after a sentence's full stop still cites that sentence.
function uncitedDigitSentences(text) {
  const offenders = []
  for (const rawLine of text.split("\n")) {
    const line = rawLine
      .replace(/^\s*(\d+[.)]|[-*•])\s+/, "")
      .replace(/\b[\w-]+(\.[\w-]+)*\.(gov|com|org|net|us)\b/gi, "domain")
    const sentences = []
    for (const s of line.split(/(?<=[.!?])\s+/)) {
      if (sentences.length && /^\(\[/.test(s)) sentences[sentences.length - 1] += ` ${s}`
      else sentences.push(s)
    }
    for (const sentence of sentences) {
      const hasLink = /\]\([^)]+\)/.test(sentence)
      const visible = sentence.replace(/\]\([^)]+\)/g, "]")
      if (/\d/.test(visible) && !hasLink) offenders.push(sentence.trim())
    }
  }
  return offenders
}

function unknownVendors(text, chunks) {
  const corpusText = chunks.map((c) => `${c.title}\n${c.text}`).join("\n").toLowerCase()
  return VENDORS.filter((name) => {
    const re = new RegExp(`(^|[^A-Za-z0-9])${escapeRe(name)}($|[^A-Za-z0-9])`)
    return re.test(text) && !corpusText.includes(name.toLowerCase())
  })
}

const DECLINE = /(can(no|'|’)t help|only (help|answer)|outside (what|of what|our)|not something (we|i) (cover|can)|stick to|focus(ed)? on|isn'?t something|don'?t cover|can(no|'|’)t answer|not able to help|here to help with)/i
const RECIPE = /\b(flour|baking soda|oven|teaspoon|tablespoon|mashed banana|bake for)\b/i
const DONT_KNOW = /\b(don'?t|don’t|do not) know yet\b/i

function flagsFor(q, text, chunks) {
  const sourceUrls = new Set(chunks.map((c) => c.url))
  const cited = linkedUrls(text).filter((u) => sourceUrls.has(u))
  const digits = uncitedDigitSentences(text)
  const vendors = unknownVendors(text, chunks)
  return {
    cites: q.offTopic ? null : cited.length > 0,
    citedCount: new Set(cited).size,
    noUncitedDigits: digits.length === 0,
    digitOffenders: digits,
    noUnknownVendors: vendors.length === 0,
    vendors,
    offTopicDeclined: q.offTopic ? DECLINE.test(text) && !RECIPE.test(text) : null,
    dontKnowYet: q.outOfCorpus ? DONT_KNOW.test(text) : null,
  }
}

// ── Run ─────────────────────────────────────────────────────────────────
async function runOne(modelKey, q, messages) {
  const model = MODELS[modelKey]
  const started = Date.now()
  try {
    const message = await client.beta.messages.create(requestParams(messages, model))
    const latencyMs = Date.now() - started
    const usage = sumUsage(message.usage)
    const fellBack = (message.usage?.iterations || []).some((it) => it.type === "fallback_message")
    const text =
      message.stop_reason === "refusal"
        ? `[refusal: ${message.stop_details?.category ?? "no category"}]`
        : answerText(message)
    return { model, latencyMs, usage, cost: costFor(model, usage), stop: message.stop_reason, servedBy: message.model, fellBack, text }
  } catch (err) {
    const latencyMs = Date.now() - started
    const detail = err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : String(err?.message || err)
    return { model, latencyMs, usage: sumUsage({}), cost: 0, stop: "error", servedBy: model, fellBack: false, text: `[error: ${detail}]`, error: true }
  }
}

const results = []
for (const q of questions) {
  const { chunks, messages } = prepare({ question: q.question })
  process.stdout.write(`${q.id} ... `)
  const runs = await Promise.all(runModels.map((key) => runOne(key, q, messages)))
  const row = { q, chunks, runs: {} }
  runModels.forEach((key, i) => {
    row.runs[key] = { ...runs[i], flags: runs[i].error ? null : flagsFor(q, runs[i].text, chunks) }
  })
  results.push(row)
  console.log(runModels.map((k) => `${k} ${(row.runs[k].latencyMs / 1000).toFixed(1)}s $${row.runs[k].cost.toFixed(4)}`).join(", "))
}

// ── Report ──────────────────────────────────────────────────────────────
const yes = (v) => (v === null || v === undefined ? "n/a" : v ? "yes" : "**NO**")
const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const cell = (s) => escapeHtml(s).replace(/\n/g, "<br>")

const stamp = new Date().toISOString()
const lines = []
lines.push(`# Ask Data Hygienics eval, ${stamp}`)
lines.push("")
lines.push(`Models: ${runModels.map((k) => MODELS[k]).join(", ")}. Same retrieval, system prompt, caps and request shape as /api/assistant (non-streaming here). Effort low, max_tokens 1024. Sonnet runs with fallbacks: "default"; Haiku has no server-side fallback.`)
lines.push("")
lines.push("Flags: **cites** links at least one retrieved source; **digits** every sentence with a digit also carries a link (list numbers excluded); **vendors** no product or company name that isn't in the retrieved sources; **declined** off-topic question declined; **don't know yet** out-of-corpus question answered with \"we don't know yet\".")
lines.push("")

for (const { q, chunks, runs } of results) {
  lines.push(`## ${q.id}: ${q.category}`)
  lines.push("")
  lines.push(`> ${q.question}`)
  lines.push("")
  lines.push(`Retrieved ${chunks.length} sources (~${estimateTokens(chunks.reduce((s, c) => s + c.words, 0))} tokens): ${chunks.slice(0, 5).map((c) => `\`${c.url}\``).join(", ")}${chunks.length > 5 ? ", ..." : ""}`)
  lines.push("")
  lines.push("| Model | Latency | Input | Output | Cache read | Cache write | Cost | Stop | Cites | Digits | Vendors | Declined | Don't know yet |")
  lines.push("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
  for (const key of runModels) {
    const r = runs[key]
    const f = r.flags || {}
    lines.push(
      `| ${r.model}${r.fellBack ? ` (fell back to ${r.servedBy})` : ""} | ${(r.latencyMs / 1000).toFixed(1)}s | ${r.usage.input_tokens} | ${r.usage.output_tokens} | ${r.usage.cache_read_input_tokens} | ${r.usage.cache_creation_input_tokens} | $${r.cost.toFixed(4)} | ${r.stop} | ${yes(f.cites)}${f.citedCount ? ` (${f.citedCount})` : ""} | ${yes(f.noUncitedDigits)} | ${yes(f.noUnknownVendors)}${f.vendors?.length ? ` (${f.vendors.join(", ")})` : ""} | ${yes(f.offTopicDeclined)} | ${yes(f.dontKnowYet)} |`
    )
  }
  lines.push("")
  for (const key of runModels) {
    const offenders = runs[key].flags?.digitOffenders || []
    if (offenders.length) lines.push(`Uncited digits (${key}): ${offenders.map((s) => `"${s.slice(0, 140)}"`).join("; ")}`, "")
  }
  lines.push("<table><tr>" + runModels.map((k) => `<th>${MODELS[k]}</th>`).join("") + "</tr><tr>")
  lines.push(runModels.map((k) => `<td valign="top">${cell(runs[k].text)}</td>`).join(""))
  lines.push("</tr></table>")
  lines.push("")
}

lines.push("## Totals")
lines.push("")
lines.push("| Model | Total cost | Mean cost / question | Mean latency | Input | Output | Cache read | Cites | Digits | Vendors | Declined | Don't know yet | Refusals | Errors |")
lines.push("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
const totals = {}
for (const key of runModels) {
  const rs = results.map((r) => r.runs[key])
  const count = (field) => {
    const applicable = rs.filter((r) => r.flags && r.flags[field] !== null && r.flags[field] !== undefined)
    return `${applicable.filter((r) => r.flags[field]).length}/${applicable.length}`
  }
  const sum = (fn) => rs.reduce((s, r) => s + fn(r), 0)
  const t = {
    cost: sum((r) => r.cost),
    latency: sum((r) => r.latencyMs) / rs.length,
    input: sum((r) => r.usage.input_tokens),
    output: sum((r) => r.usage.output_tokens),
    cacheRead: sum((r) => r.usage.cache_read_input_tokens),
  }
  totals[key] = t
  lines.push(
    `| ${MODELS[key]} | $${t.cost.toFixed(4)} | $${(t.cost / rs.length).toFixed(4)} | ${(t.latency / 1000).toFixed(1)}s | ${t.input} | ${t.output} | ${t.cacheRead} | ${count("cites")} | ${count("noUncitedDigits")} | ${count("noUnknownVendors")} | ${count("offTopicDeclined")} | ${count("dontKnowYet")} | ${rs.filter((r) => r.stop === "refusal").length} | ${rs.filter((r) => r.error).length} |`
  )
}
lines.push("")

const outDir = path.join(root, "output", "assistant-eval")
mkdirSync(outDir, { recursive: true })
const outFile = path.join(outDir, `${stamp.replace(/:/g, "-")}.md`)
writeFileSync(outFile, lines.join("\n"))
console.log(`\nWrote ${path.relative(root, outFile)}`)
for (const key of runModels) {
  console.log(`${MODELS[key]}: $${totals[key].cost.toFixed(4)} total, ${(totals[key].latency / 1000).toFixed(1)}s mean latency`)
}
