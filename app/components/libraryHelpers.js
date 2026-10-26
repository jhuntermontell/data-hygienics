// Small helpers shared by the research-library pages (threats, guides,
// explainers, toolkit, glossary). Rendering lives in the components; this
// file only shapes metadata and citation numbering.
import { SITE } from "@/lib/site"
import { hrefFor, splitCitations, stripCitations, KIND_LABELS } from "@/lib/content"
import { getSource } from "@/lib/sources"

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Data Hygienics",
}

// Kinds whose route has its own opengraph-image.js (guides, threats and
// industry briefs, explainers). Other entries share the site card.
const ROUTE_IMAGE_KINDS = new Set(["guide", "threat", "industry-brief", "explainer"])

// Page metadata with canonical, OpenGraph and Twitter set together, so a
// page never inherits the root layout's old card copy. Pass `image` (the
// route's own `${path}/opengraph-image`) when the route has one; otherwise
// the static site card is used.
export function libraryMetadata({ title, description, path, type = "website", publishedTime, modifiedTime, image }) {
  const url = `${SITE.url}${path}`
  const ogImage = image ? { ...OG_IMAGE, url: image, alt: title } : OG_IMAGE
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      siteName: SITE.name,
      title,
      description,
      url,
      type,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  }
}

export function entryTitle(entry) {
  return entry.metaTitle || `${entry.title} | ${SITE.name}`
}

export function entryDescription(entry) {
  if (entry.metaDescription) return entry.metaDescription
  const text = stripCitations(entry.tldr || entry.shortAnswer || "")
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text
}

export function entryMetadata(entry) {
  const path = hrefFor(entry)
  return libraryMetadata({
    title: entryTitle(entry),
    description: entryDescription(entry),
    path,
    image: ROUTE_IMAGE_KINDS.has(entry.kind) ? `${path}/opengraph-image` : undefined,
    type: "article",
    publishedTime: entry.datePublished,
    modifiedTime: entry.lastReviewed ? `${entry.lastReviewed}-01` : undefined,
  })
}

// Open Graph cards (lib/og.js). The site card is the fallback for a
// missing or draft entry, so an image route never throws.
export const SITE_OG_CARD = {
  eyebrow: SITE.kicker,
  title: SITE.tagline.replace(/\.$/, ""),
  line: "The independent field guide to living and working securely alongside AI, for households and small businesses.",
  tone: "home",
}

// One line for a card: citation markers stripped, cut at a word boundary
// near `max` characters.
export function ogLine(text, max = 110) {
  const plain = stripCitations(text || "")
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max - 3)
  const space = cut.lastIndexOf(" ")
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, "")}...`
}

// Card fields for a library entry. Explainers take the sovereignty tone;
// anything written for home (including both audiences) takes home.
export function entryOgCard(entry) {
  if (!entry) return SITE_OG_CARD
  const tone =
    entry.kind === "explainer" ? "sovereignty" : entry.audience?.includes("home") || !entry.audience?.length ? "home" : "business"
  return {
    eyebrow: KIND_LABELS[entry.kind] || SITE.kicker,
    title: entry.title,
    line: ogLine(entry.metaDescription || entry.shortAnswer || entry.tldr),
    tone,
  }
}

// Drop ids that don't resolve in the source registry and renumber, so the
// superscripts always match what SourceList actually prints. Takes and
// returns the { ids, number } shape from citationOrder().
export function knownCitations({ ids }) {
  const known = ids.filter((id) => getSource(id))
  const number = {}
  known.forEach((id, i) => {
    number[id] = i + 1
  })
  return { ids: known, number }
}

// Citation order for pages that aren't a single entry (toolkit, glossary):
// number markers by first appearance across `texts` (already in render
// order), then append any listed source ids never cited inline.
export function orderCitations(texts, sourceIds = []) {
  const ids = []
  const seen = new Set()
  const add = (id) => {
    if (seen.has(id)) return
    seen.add(id)
    ids.push(id)
  }
  texts.forEach((text) => {
    splitCitations(text).forEach((segment) => {
      if (segment.type === "cite") add(segment.id)
    })
  })
  sourceIds.forEach(add)
  return knownCitations({ ids })
}

export function sameAudience(a = [], b = []) {
  return a.length === b.length && a.every((x) => b.includes(x))
}
