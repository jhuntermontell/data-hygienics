// The site search index, built from published entries only (the getters
// already drop drafts) and served as one static file at /search-index.json.
// The browser downloads it once and matches queries locally, so a query
// never leaves the visitor's device (design/brand-book/personality.md,
// section 10). Keep entries small: title, one-line summary, link, dates.
import { verdicts } from "../verdicts.js"
import { threats } from "../threats.js"
import { guides } from "../guides.js"
import { explainers } from "../sovereignty.js"
import { glossary } from "../glossary.js"
import { CONTROLS } from "../controls.js"
import { allStepParams, getStepById, getStepAudience, stepHref, stepSummary, AUDIENCE_LABELS } from "../steps.js"
import { controlHref, glossaryHref, hrefFor, stripCitations } from "../content.js"

const MAX_SUMMARY = 140

function oneLine(text) {
  const clean = stripCitations(String(text || "")).replace(/\s+/g, " ").trim()
  const first = clean.match(/^.+?[.!?](\s|$)/)?.[0]?.trim() || clean
  return first.length > MAX_SUMMARY ? `${first.slice(0, MAX_SUMMARY - 3).trimEnd()}...` : first
}

// Compact rows: [kind, title, summary, href, reviewed (YYYY-MM or ""), keywords]
function row(kind, title, summary, href, reviewed, keywords = "") {
  return [kind, title, oneLine(summary), href, reviewed || "", keywords]
}

export function buildSearchIndex() {
  const items = [
    ...verdicts.map((v) => row("Verdict", v.title, v.verdict || v.tldr, hrefFor(v), v.lastReviewed, v.chip || "")),
    ...allStepParams().map(({ id }) => {
      const step = getStepById(id)
      const audience = AUDIENCE_LABELS[getStepAudience(id)] || ""
      return row("Step", step.title, stepSummary(step), stepHref(step), "", `${audience} path`)
    }),
    ...guides.map((g) => row("Guide", g.title, g.tldr || g.metaDescription, hrefFor(g), g.lastReviewed)),
    ...threats.map((t) => row("Threat", t.title, t.tldr || t.metaDescription, hrefFor(t), t.lastReviewed)),
    ...explainers.map((e) => row("Explainer", e.title, e.shortAnswer || e.tldr, hrefFor(e), e.lastReviewed, e.question || "")),
    ...glossary.map((g) => row("Glossary", g.term, g.shortDef, glossaryHref(g.slug), g.lastReviewed, (g.aliases || []).join(" "))),
    ...CONTROLS.map((c) => row("Control", c.name, c.explanation, controlHref(c.slug), c.lastReviewed)),
  ]

  // The two newest published entries, for the menu's "new" strip.
  const latest = [...verdicts, ...threats, ...guides, ...explainers]
    .sort((a, b) => (b.datePublished || "").localeCompare(a.datePublished || "") || a.title.localeCompare(b.title))
    .slice(0, 2)
    .map((e) => ({ kind: e.kind === "industry-brief" ? "threat" : e.kind, title: e.title, href: hrefFor(e), published: e.datePublished || "" }))

  const counts = {
    verdicts: verdicts.length,
    guides: guides.length,
    threats: threats.length,
    steps: allStepParams().length,
  }

  return { version: 1, counts, latest, items }
}
