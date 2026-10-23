import { BookMarked } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import SourceList from "@/app/components/SourceList"
import GlossaryList from "@/app/components/GlossaryList"
import { libraryMetadata, orderCitations } from "@/app/components/libraryHelpers"
import { definedTermSetSchema, breadcrumbSchema } from "@/lib/schema"
import { glossary, getTermBySlug } from "@/lib/glossary"
import { getThreatBySlug } from "@/lib/threats"
import { getGuideBySlug } from "@/lib/guides"
import { getExplainerBySlug } from "@/lib/sovereignty"
import { glossaryHref, hrefFor, stripCitations } from "@/lib/content"

const TITLE = "AI and Security Glossary | Data Hygienics"
const DESCRIPTION =
  "Plain-English definitions of the AI and security terms you keep running into, from prompt injection to passkeys, and why each one matters to you."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: "/glossary" })

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : []
}

function paragraphs(value) {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : typeof value === "string" ? [value] : []
}

// Resolve seeAlso slugs to links, dropping drafts and missing entries so
// nothing points at a 404.
function seeAlsoLinks(term) {
  const seeAlso = term.seeAlso || {}
  const pick = (slugs, getter, toLink) => list(slugs).map(getter).filter(Boolean).map(toLink)
  return [
    ...pick(seeAlso.glossary, getTermBySlug, (t) => ({ href: glossaryHref(t.slug), label: t.term, type: "term" })).filter(
      (link) => link.href !== glossaryHref(term.slug)
    ),
    ...pick(seeAlso.threats, getThreatBySlug, (e) => ({ href: hrefFor(e), label: e.title, type: "threat" })),
    ...pick(seeAlso.guides, getGuideBySlug, (e) => ({ href: hrefFor(e), label: e.title, type: "guide" })),
    ...pick(seeAlso.explainers, getExplainerBySlug, (e) => ({ href: hrefFor(e), label: e.title, type: "explainer" })),
  ]
}

export default function GlossaryPage() {
  // Plain data for the client list, in lib/glossary's A-Z order.
  const entries = glossary.map((term) => ({
    term: term.term,
    slug: term.slug,
    aliases: list(term.aliases),
    shortDef: term.shortDef || "",
    longDef: paragraphs(term.longDef),
    whyItMatters: paragraphs(term.whyItMatters),
    links: seeAlsoLinks(term),
  }))

  // Number citations in render order: shortDef, longDef, whyItMatters.
  const { ids, number } = orderCitations(
    entries.flatMap((e) => [e.shortDef, ...e.longDef, ...e.whyItMatters]),
    glossary.flatMap((term) => list(term.sourceIds))
  )

  const schemas = [
    definedTermSetSchema(glossary.map((term) => ({ ...term, shortDef: stripCitations(term.shortDef) }))),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Glossary", path: "/glossary" },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <header className="mb-6">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#1D4ED8] mb-3">
              <BookMarked className="w-4 h-4" aria-hidden="true" />
              Glossary
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-[1.08] tracking-tight text-balance mb-5">
              AI and security terms, decoded
            </h1>
            <p className="text-[#475569] text-lg leading-relaxed">
              The words you keep running into, in plain English: what each one means, and why it matters to your
              home or your business.
            </p>
          </header>

          <GlossaryList entries={entries} number={number} />

          <SourceList ids={ids} />
        </main>
        <Footer />
      </div>
    </>
  )
}
