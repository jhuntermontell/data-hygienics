// Retrieval for the member assistant: BM25 over the corpus chunks, no vector
// database. Title matches count extra, and "Is this real?" verdicts and Path
// steps get a small boost because they are the most actionable pages.
//
// retrieve(query, { budgetTokens, context }) returns the best chunks, one per
// page (deduplicated by url), until the token budget is reached (estimated
// as words x 1.3). `context` is optional earlier conversation text, weighted
// at half so a follow-up like "what about for my mom?" still finds the topic.
//
// Relative imports only: scripts/assistant-eval.mjs loads this in plain Node.
import { getChunks } from "./corpus.js"
import { CONTEXT_TOKEN_BUDGET, estimateTokens } from "./limits.js"

const K1 = 1.2
const B = 0.5
const TITLE_WEIGHT = 2
const CONTEXT_WEIGHT = 0.5
const KIND_BOOST = { verdict: 1.3, step: 1.15 }
// Chunks scoring under this share of the best match are noise, not sources.
const MIN_RELATIVE_SCORE = 0.2
const MAX_SOURCES = 14

const STOP_WORDS = new Set(
  (
    "a about above after again against all am an and any are as at be because been before being below between both " +
    "but by can could did do does doing down during each few for from further had has have having he her here hers " +
    "him his how i if in into is it its itself just me more most my myself no nor not now of off on once only or " +
    "other our ours out over own same she should so some such than that the their theirs them then there these they " +
    "this those through to too under until up very was we were what when where which while who whom why will with " +
    "would you your yours yourself yourselves im ive id dont doesnt didnt isnt wasnt cant wont also get got one " +
    "really thing things way want need know like lot please thanks hi hello claiming claimed someone somebody something says said saying okay ok maybe"
  ).split(" ")
)

// A few everyday words people type that the research spells differently.
const SYNONYMS = {
  "2fa": ["mfa", "multi-factor", "authentication"],
  "two-factor": ["mfa", "multi-factor"],
  otp: ["code"],
  hacked: ["compromised", "takeover"],
  scammer: ["scam"],
  fraudster: ["scam", "fraud"],
  wire: ["payment", "transfer"],
  mom: ["parent", "older", "relative"],
  dad: ["parent", "older", "relative"],
  grandma: ["grandparent", "older", "relative"],
  grandpa: ["grandparent", "older", "relative"],
  chatgpt: ["chatbot", "ai"],
  chatbot: ["ai"],
  deepfake: ["voice", "clone"],
  employees: ["staff", "team"],
  employee: ["staff", "team"],
  antivirus: ["malware", "updates"],
  died: ["death", "legacy"],
  passed: ["death", "legacy"],
  deceased: ["death", "legacy"],
  wipe: ["erase", "reset"],
}

function stem(word) {
  if (word.length > 5 && word.endsWith("ies")) return `${word.slice(0, -3)}y`
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3)
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1)
  return word
}

export function tokenize(text) {
  if (typeof text !== "string") return []
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9-]+/)
    .flatMap((w) => (w.includes("-") ? [w, ...w.split("-")] : [w]))
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
    .map(stem)
}

function queryTerms(text, weight) {
  const terms = new Map()
  const add = (term, w) => terms.set(term, Math.max(terms.get(term) || 0, w))
  for (const raw of tokenize(text)) {
    add(raw, weight)
    for (const syn of SYNONYMS[raw] || []) for (const t of tokenize(syn)) add(t, weight * 0.6)
  }
  return terms
}

let index = null

function buildIndex() {
  const chunks = getChunks()
  const docs = chunks.map((chunk) => {
    const body = tokenize(chunk.text)
    const title = tokenize(chunk.title)
    const tf = new Map()
    const titleTf = new Map()
    for (const t of body) tf.set(t, (tf.get(t) || 0) + 1)
    for (const t of title) titleTf.set(t, 1) // a title says a word once: no extra credit for repeats
    return { chunk, tf, titleTf, len: body.length, titleLen: title.length }
  })
  const df = new Map()
  for (const d of docs) {
    for (const t of new Set([...d.tf.keys(), ...d.titleTf.keys()])) df.set(t, (df.get(t) || 0) + 1)
  }
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(docs.length, 1)
  const avgTitleLen = docs.reduce((s, d) => s + d.titleLen, 0) / Math.max(docs.length, 1)
  index = { docs, df, n: docs.length, avgLen, avgTitleLen }
  return index
}

function bm25(tf, len, avg, idf) {
  if (!tf) return 0
  return (idf * tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * len) / (avg || 1)))
}

// Scores every chunk; exported for the harness's --dry output.
export function scoreChunks(query, { context = "" } = {}) {
  const idx = index || buildIndex()
  const terms = queryTerms(query, 1)
  for (const [t, w] of queryTerms(context, CONTEXT_WEIGHT)) if (!terms.has(t)) terms.set(t, w)
  if (!terms.size) return []

  const scored = []
  for (const d of idx.docs) {
    let score = 0
    for (const [term, weight] of terms) {
      const df = idx.df.get(term)
      if (!df) continue
      const idf = Math.log(1 + (idx.n - df + 0.5) / (df + 0.5))
      score += weight * bm25(d.tf.get(term), d.len, idx.avgLen, idf)
      score += weight * TITLE_WEIGHT * bm25(d.titleTf.get(term), d.titleLen, idx.avgTitleLen, idf)
    }
    if (score > 0) scored.push({ chunk: d.chunk, score: score * (KIND_BOOST[d.chunk.kind] || 1) })
  }
  return scored.sort((a, b) => b.score - a.score)
}

export function retrieve(query, { budgetTokens = CONTEXT_TOKEN_BUDGET, context = "" } = {}) {
  const scored = scoreChunks(query, { context })
  if (!scored.length) return []
  const floor = scored[0].score * MIN_RELATIVE_SCORE
  const picked = []
  const seen = new Set()
  let used = 0
  for (const { chunk, score } of scored) {
    if (score < floor || picked.length >= MAX_SOURCES) break
    if (seen.has(chunk.url)) continue
    const cost = estimateTokens(chunk.words)
    if (used + cost > budgetTokens) {
      if (picked.length) break
      continue
    }
    seen.add(chunk.url)
    used += cost
    picked.push({ ...chunk, score })
  }
  return picked
}
