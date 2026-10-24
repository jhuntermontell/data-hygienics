// Small helpers shared by the research-library pages (threats, guides,
// explainers, toolkit, glossary). Rendering lives in the components; this
// file only shapes metadata and citation numbering.
import { SITE } from "@/lib/site"
import { hrefFor, splitCitations, stripCitations } from "@/lib/content"
import { getSource } from "@/lib/sources"

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Data Hygienics",
}

// Page metadata with canonical, OpenGraph and Twitter set together, so a
// page never inherits the root layout's old card copy.
export function libraryMetadata({ title, description, path, type = "website", publishedTime, modifiedTime }) {
  const url = `${SITE.url}${path}`
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
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
  return libraryMetadata({
    title: entryTitle(entry),
    description: entryDescription(entry),
    path: hrefFor(entry),
    type: "article",
    publishedTime: entry.datePublished,
    modifiedTime: entry.lastReviewed ? `${entry.lastReviewed}-01` : undefined,
  })
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
