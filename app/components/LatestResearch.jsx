import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ContentCard from "./ContentCard"
import { STANCE_EXPLAINER_SLUG, getLatest } from "@/lib/library"

// Newest threats, guides and explainers by datePublished. Hides itself
// when nothing is published yet. The AI-or-SI stance piece stays on
// /digital-sovereignty (and the glossary teaser links it), so it's left out.
export default function LatestResearch({ limit = 6 }) {
  const entries = getLatest(limit, { exclude: [STANCE_EXPLAINER_SLUG] })
  if (!entries.length) return null

  return (
    <section aria-labelledby="latest-research-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#0F766E]">Fresh from the library</p>
            <h2 id="latest-research-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
              Latest research
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[#475569]">
              Threats, guides and explainers, newest first. Each one is dated, sourced and ends with what to do.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 shrink-0">
            <Link
              href="/threats"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
            >
              Threat Library
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/guides"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
            >
              All guides
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
          {entries.map((entry) => (
            <li key={`${entry.kind}-${entry.slug}`}>
              <ContentCard entry={entry} headingLevel="h3" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
