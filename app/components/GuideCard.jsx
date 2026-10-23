import Link from "next/link"
import { ArrowRight, Clock, Gauge, ListOrdered } from "lucide-react"
import AudienceBadge from "./AudienceBadge"
import { hrefFor, stripCitations } from "@/lib/content"

const DIFFICULTY_LABELS = { easy: "Easy", moderate: "Moderate" }

// Guides index card: audience, title, summary, and the effort it takes.
export default function GuideCard({ entry, headingLevel = "h3" }) {
  const Heading = headingLevel
  const summary = stripCitations(entry.tldr || entry.why || "")
  const stepCount = (entry.steps || []).length

  return (
    <Link
      href={hrefFor(entry)}
      className="group flex flex-col h-full rounded-xl border border-[#E2E8F0] bg-white p-5 hover:border-[#1D4ED8]/40 hover:shadow-sm motion-safe:transition-all"
    >
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {(entry.audience || []).map((a) => (
          <AudienceBadge key={a} audience={a} />
        ))}
      </div>
      <Heading className="text-[#0F172A] font-bold text-lg leading-snug mb-2 group-hover:text-[#1D4ED8] motion-safe:transition-colors">
        {entry.title}
      </Heading>
      <p className="text-[#475569] text-sm leading-relaxed line-clamp-3 mb-4">{summary}</p>
      <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-[#475569]">
        {entry.timeToComplete ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
            <span className="sr-only">Time to complete: </span>
            {entry.timeToComplete}
          </span>
        ) : null}
        {DIFFICULTY_LABELS[entry.difficulty] ? (
          <span className="inline-flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
            <span className="sr-only">Difficulty: </span>
            {DIFFICULTY_LABELS[entry.difficulty]}
          </span>
        ) : null}
        {stepCount > 0 ? (
          <span className="inline-flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
            {stepCount} {stepCount === 1 ? "step" : "steps"}
          </span>
        ) : null}
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8]">
          Start
          <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
