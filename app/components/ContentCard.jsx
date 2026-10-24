import Link from "next/link"
import { ArrowRight } from "lucide-react"
import AudienceBadge from "./AudienceBadge"
import { KIND_LABELS, hrefFor, stripCitations } from "@/lib/content"

// Card for any library entry (threat, industry brief, guide, explainer).
export default function ContentCard({ entry, headingLevel = "h3" }) {
  const Heading = headingLevel
  const summary = stripCitations(entry.shortAnswer || entry.tldr || entry.whatItIs || "")

  return (
    <Link
      href={hrefFor(entry)}
      className="group flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#1D4ED8]/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#64748B]">
          {KIND_LABELS[entry.kind] || "Article"}
        </span>
        {(entry.audience || []).map((a) => (
          <AudienceBadge key={a} audience={a} />
        ))}
      </div>
      <Heading className="text-[#0F172A] font-bold text-base leading-snug mb-2 group-hover:text-[#1D4ED8] transition-colors">
        {entry.title}
      </Heading>
      <p className="text-[#475569] text-sm leading-relaxed line-clamp-3 mb-4">{summary}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8]">
        Read
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </span>
    </Link>
  )
}
