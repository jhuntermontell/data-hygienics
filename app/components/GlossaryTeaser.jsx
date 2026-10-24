import Link from "next/link"
import { ArrowRight, BookA } from "lucide-react"
import { glossary } from "@/lib/glossary"
import { getExplainerBySlug } from "@/lib/sovereignty"
import { glossaryHref, hrefFor, stripCitations } from "@/lib/content"

// Homepage teaser: the glossary's AI entry and its superintelligence entry
// side by side, linking to the stance explainer. The terms themselves come
// from the glossary data (the only place outside the stance piece and
// SITE.terms where the longer term may appear). Hides if either is missing.

const STANCE_SLUG = "ai-or-si-what-we-call-it"

function findTerm(slugs, aliases = []) {
  for (const slug of slugs) {
    const hit = glossary.find((t) => t.slug === slug)
    if (hit) return hit
  }
  return glossary.find((t) => (t.aliases || []).some((a) => aliases.includes(a)))
}

export default function GlossaryTeaser() {
  const ai = findTerm(["artificial-intelligence", "ai"], ["AI"])
  const frontier = findTerm(["superintelligence", "si", "superintelligence-si"], ["SI", "ASI"])
  if (!ai || !frontier || ai.slug === frontier.slug) return null

  const stance = getExplainerBySlug(STANCE_SLUG)
  const terms = [ai, frontier]

  return (
    <section aria-labelledby="glossary-teaser-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#0F766E]">Words matter</p>
          <h2 id="glossary-teaser-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            The words we use, and why
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-[#475569]">
            We say AI because that&apos;s the word most people use. Some labs now talk about something bigger.
            Here are both terms in plain English, and where we stand.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 list-none p-0">
          {terms.map((term, i) => (
            <li key={term.slug}>
              <article className="relative h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${
                    i === 0 ? "bg-[#1D4ED8]" : "bg-[#0F766E]"
                  }`}
                />
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#64748B]">
                  <BookA className="w-3.5 h-3.5" aria-hidden="true" />
                  Glossary
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A]">{term.term}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">{stripCitations(term.shortDef)}</p>
                <Link
                  href={glossaryHref(term.slug)}
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                >
                  Full definition
                  <span className="sr-only"> of {term.term}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          {stance ? (
            <Link
              href={hrefFor(stance)}
              className="inline-flex items-center justify-center gap-1.5 bg-[#0F172A] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#1E293B] transition-colors"
            >
              Read our stance: {stance.title}
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          ) : null}
          <Link
            href="/glossary"
            className="text-sm font-semibold text-[#0F172A] hover:text-[#1D4ED8] underline underline-offset-4 decoration-[#CBD5E1]"
          >
            Browse the glossary
          </Link>
        </div>
      </div>
    </section>
  )
}
