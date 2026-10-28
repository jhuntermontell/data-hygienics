// Client-side matching over the static index from lib/search/build.js.
// Pure functions, no imports, so it runs in the browser and in Node.

export const KIND_ORDER = ["Verdict", "Step", "Guide", "Threat", "Explainer", "Glossary", "Control"]
export const KIND_HEADINGS = {
  Verdict: "Threat Check verdicts",
  Step: "Path steps",
  Guide: "Guides",
  Threat: "Threats",
  Explainer: "Digital Sovereignty",
  Glossary: "Glossary",
  Control: "Controls",
}

const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const STOP = new Set(["a", "an", "and", "the", "to", "of", "my", "i", "is", "it", "in", "on", "for", "me", "we", "our", "us", "or", "was", "what", "how", "do"])

export function tokenize(query) {
  return normalize(query).split(" ").filter((t) => t.length > 1 && !STOP.has(t))
}

// Light stemming so "called" finds "call" and "asking" finds "asked".
const stem = (w) => w.replace(/(ing|ed|es|s)$/, (m) => (w.length - m.length >= 3 ? "" : m))

// Two-word queries need both words; longer ones need most of them.
const needed = (n) => (n <= 2 ? n : Math.ceil(n * 0.6))

// Score one row: [kind, title, summary, href, reviewed, keywords].
function score(row, tokens, phrase) {
  const title = normalize(row[1])
  const keywords = normalize(row[5])
  const summary = normalize(row[2])
  const titleWords = title.split(" ")
  const titleStems = titleWords.map(stem)
  const keywordStems = keywords.split(" ").map(stem)
  const summaryStems = summary.split(" ").map(stem)
  let total = 0
  let matched = 0
  for (const t of tokens) {
    const ts = stem(t)
    let s = 0
    if (titleWords.some((w) => w === t) || titleStems.includes(ts)) s = 4
    else if (titleWords.some((w) => w.startsWith(t))) s = 3
    else if (title.includes(t)) s = 2
    else if (keywords.includes(t) || keywordStems.includes(ts)) s = 1.5
    else if (summary.includes(t) || summaryStems.includes(ts)) s = 1
    if (s) matched += 1
    total += s
  }
  if (!matched || matched < needed(tokens.length)) return 0
  if (phrase && title.includes(phrase)) total += 6
  return total + matched / tokens.length
}

// Returns [{ kind, heading, items }] in KIND_ORDER, each sorted by score.
export function search(index, query, { perKind = 5 } = {}) {
  const tokens = tokenize(query)
  if (!index?.items || !tokens.length) return []
  const phrase = normalize(query)
  const scored = index.items
    .map((row) => ({ row, s: score(row, tokens, phrase) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
  return KIND_ORDER.map((kind) => ({
    kind,
    heading: KIND_HEADINGS[kind],
    items: scored.filter((x) => x.row[0] === kind).slice(0, perKind).map((x) => x.row),
  })).filter((g) => g.items.length)
}

// When nothing matches: the verdicts, so an empty search is never a dead end.
export function fallbackVerdicts(index, limit = 3) {
  return (index?.items || []).filter((row) => row[0] === "Verdict").slice(0, limit)
}
