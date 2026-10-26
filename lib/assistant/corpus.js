// The assistant's corpus: every published page of research, flattened into
// plain-text documents and split into chunks for retrieval.
//
// Document: { id, kind, title, url, text, audience }. Chunk: the same plus
// { chunkId, words }, so a chunk can stand alone as a numbered source.
// Citation markers are stripped (the assistant cites pages, not footnotes),
// and URLs come from hrefFor / stepHref / glossaryHref so a cited link always
// matches the live page. Built once per server process.
//
// Relative imports only: scripts/assistant-eval.mjs loads this in plain Node.
import { guides } from "../guides.js"
import { threats } from "../threats.js"
import { explainers, PRINCIPLES } from "../sovereignty.js"
import { verdicts } from "../verdicts.js"
import { allStepParams, getStepById, getStepAudience, stepHref, doItems } from "../steps.js"
import { glossary } from "../glossary.js"
import { tools, TOOLKIT_CATEGORIES } from "../toolkit.js"
import { stripCitations, hrefFor, glossaryHref } from "../content.js"

const BOTH = ["home", "business"]
const MAX_CHUNK_WORDS = 500
const MIN_CHUNK_WORDS = 300
const SPLIT_PARAGRAPH_WORDS = 450

const clean = (text) => stripCitations(typeof text === "string" ? text : "")
const wordCount = (text) => (text.match(/\S+/g) || []).length
const list = (value) => (Array.isArray(value) ? value : [])

// "Label: text", skipping empty text.
function line(label, text) {
  const value = clean(text)
  if (!value) return null
  return label ? `${label}: ${value}` : value
}

function faqLines(entry) {
  return list(entry.faqs).map((f) => line(`Q: ${clean(f.question)} A`, f.answer))
}

function statLines(entry) {
  return list(entry.stats).map((s) => line(`Figure: ${clean(s.figure)}`, s.context || s.text))
}

// Industry briefs keep hand-authored HTML; flatten it to lines of text.
function htmlToLines(html) {
  if (typeof html !== "string") return []
  const text = html
    .replace(/<\/(h[1-6]|p|li|tr|div|blockquote)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-")
  return text.split(/\n+/).map((l) => clean(l)).filter(Boolean)
}

function doc(entry, kind, url, lines, extra = {}) {
  return {
    id: `${kind}:${entry.slug || entry.id}`,
    kind,
    title: clean(entry.title || entry.term || entry.name),
    url,
    audience: Array.isArray(entry.audience) && entry.audience.length ? entry.audience : BOTH,
    text: lines.filter(Boolean).join("\n"),
    ...extra,
  }
}

function threatDoc(t) {
  if (t.kind === "industry-brief") {
    return doc(t, "industry-brief", hrefFor(t), [
      line("In short", t.tldr),
      ...htmlToLines(t.content),
      ...faqLines(t),
    ])
  }
  return doc(t, "threat", hrefFor(t), [
    line("In short", t.tldr),
    line("What it is", t.whatItIs),
    ...list(t.howItLooks).map((s) => line(`How it looks (${clean(s.title)})`, s.scenario)),
    ...list(t.howItGetsIn).map((s) => line("How it gets in", s)),
    ...list(t.whatStopsIt).map((s) => line(`What stops it: ${clean(s.title)}`, s.detail)),
    ...list(t.ifItHappens).map((s) => line(`If it happens: ${clean(s.step)}`, s.detail)),
    ...statLines(t),
    ...faqLines(t),
  ])
}

function guideDoc(g) {
  return doc(g, "guide", hrefFor(g), [
    line("In short", g.tldr),
    line("Why", g.why),
    ...list(g.steps).flatMap((s, i) => [
      line(`Step ${i + 1}`, s.title),
      ...list(s.detail).map((d) => clean(d)),
      line("How to check", s.verify),
    ]),
    ...list(g.limits).map((l) => line("Limits", l)),
    ...faqLines(g),
  ])
}

function explainerDoc(e) {
  const actions = e.actions && typeof e.actions === "object" ? e.actions : {}
  return doc(e, "explainer", hrefFor(e), [
    line("Question", e.question),
    line("Short answer", e.shortAnswer),
    line("In short", e.tldr),
    ...list(e.sections).flatMap((s) => [clean(s.heading), ...list(s.paragraphs).map((p) => clean(p))]),
    ...Object.entries(actions).flatMap(([audience, items]) =>
      list(items).map((a) => line(`What to do (${audience}): ${clean(a.label)}`, a.detail))
    ),
    line("Our stance", e.stance),
    ...faqLines(e),
  ])
}

function verdictDoc(v) {
  return doc(v, "verdict", hrefFor(v), [
    line("Verdict", v.verdict || v.tldr),
    ...list(v.nextTwoMinutes).map((s) => line("Next two minutes", s)),
    ...list(v.whoToTell).map((w) =>
      line(`Who to tell: ${clean(w.label)}${w.href ? ` (${w.href})` : ""}`, w.detail)
    ),
    line("Say this", v.sayThis),
    ...list(v.why).map((w) => line("Why", w)),
    ...statLines(v),
    ...faqLines(v),
  ])
}

function stepDoc(id) {
  const step = getStepById(id)
  const audience = getStepAudience(id)
  if (!step || !audience) return null
  return doc(step, "step", stepHref(step), [
    line("Why", step.why),
    line("After this", step.after),
    line("Say this", step.sayThis),
    ...doItems(step, audience).map((item) =>
      line("Do", item.condition ? `${item.text} (${item.condition}.)` : item.text)
    ),
    line("Check", step.check),
    line("In simple terms", step.simple),
    line("More detail", step.detail),
    line("Story", step.story),
  ], { audience: [audience] })
}

function glossaryDoc(t) {
  const aliases = list(t.aliases).join(", ")
  return doc(t, "glossary", glossaryHref(t.slug), [
    line("Also called", aliases),
    line("Definition", t.shortDef),
    clean(t.longDef),
    line("Why it matters", t.whyItMatters),
  ], { title: `${clean(t.term)} (glossary)` })
}

const CATEGORY_NAME = Object.fromEntries(TOOLKIT_CATEGORIES.map((c) => [c.slug, c.name]))

function toolDoc(t) {
  return doc(t, "tool", hrefFor(t), [
    line("Category", CATEGORY_NAME[t.category] || t.category),
    line("What it's for", t.whatItsFor),
    line("Why we like it", t.whyWeLikeIt),
    ...list(t.caveats).map((c) => line("Caveat", c)),
    line("Cost", [t.cost, clean(t.pricingNote)].filter(Boolean).join(". ")),
    line("Privacy", t.privacyNotes),
    ...list(t.alternatives).map((a) => line(`Alternative: ${clean(a.name)}`, a.note)),
  ], { title: `${clean(t.name)} (toolkit)` })
}

function principlesDoc() {
  return doc(
    { slug: "principles", title: "Our digital sovereignty principles" },
    "principle",
    "/digital-sovereignty",
    PRINCIPLES.map((p) => line(clean(p.title), p.detail))
  )
}

// Split one long paragraph into sentence groups under the paragraph limit.
function splitLong(paragraph) {
  if (wordCount(paragraph) <= SPLIT_PARAGRAPH_WORDS) return [paragraph]
  const sentences = paragraph.split(/(?<=[.!?])\s+/)
  const parts = []
  let current = []
  let words = 0
  for (const s of sentences) {
    const n = wordCount(s)
    if (words + n > SPLIT_PARAGRAPH_WORDS && current.length) {
      parts.push(current.join(" "))
      current = []
      words = 0
    }
    current.push(s)
    words += n
  }
  if (current.length) parts.push(current.join(" "))
  return parts
}

// Greedy packing into chunks of roughly 300 to 500 words. A short tail
// merges into the previous chunk rather than standing alone.
export function chunkDocument(document) {
  const paragraphs = document.text.split("\n").flatMap(splitLong).filter(Boolean)
  const groups = []
  let current = []
  let words = 0
  for (const p of paragraphs) {
    const n = wordCount(p)
    if (words + n > MAX_CHUNK_WORDS && current.length) {
      groups.push({ text: current.join("\n"), words })
      current = []
      words = 0
    }
    current.push(p)
    words += n
  }
  if (current.length) groups.push({ text: current.join("\n"), words })

  if (groups.length > 1) {
    const last = groups[groups.length - 1]
    const prev = groups[groups.length - 2]
    if (last.words < MIN_CHUNK_WORDS / 2 && prev.words + last.words <= MAX_CHUNK_WORDS + 100) {
      prev.text = `${prev.text}\n${last.text}`
      prev.words += last.words
      groups.pop()
    }
  }

  return groups.map((g, i) => ({
    ...document,
    chunkId: `${document.id}#${i + 1}`,
    text: g.text,
    words: g.words,
  }))
}

let cached = null

export function getDocuments() {
  if (cached) return cached.documents
  build()
  return cached.documents
}

export function getChunks() {
  if (cached) return cached.chunks
  build()
  return cached.chunks
}

function build() {
  const documents = [
    ...verdicts.map(verdictDoc),
    ...guides.map(guideDoc),
    ...threats.map(threatDoc),
    ...explainers.map(explainerDoc),
    principlesDoc(),
    ...allStepParams().map(({ id }) => stepDoc(id)),
    ...glossary.map(glossaryDoc),
    ...tools.map(toolDoc),
  ].filter((d) => d && d.text)
  const chunks = documents.flatMap(chunkDocument)
  cached = { documents, chunks }
}
