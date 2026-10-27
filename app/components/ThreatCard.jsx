import Link from "next/link"
import { ArrowRight } from "lucide-react"
import AudienceBadge from "./AudienceBadge"
import { SeverityChip, AiRoleChip } from "./ThreatMeta"
import { hrefFor, stripCitations } from "@/lib/content"

// Threat Library card: severity and AI-role chips up top, audience at the
// foot, so a reader can scan what it is and who it hits.
export default function ThreatCard({ entry, headingLevel = "h3" }) {
  const Heading = headingLevel
  const summary = stripCitations(entry.tldr || entry.whatItIs || "")

  return (
    <Link
      href={hrefFor(entry)}
      className="group flex flex-col h-full border border-[#E2E8F0] bg-white p-5 hover:border-[#1D4ED8]/40 hover:shadow-sm motion-safe:transition-all"
    >
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <SeverityChip severity={entry.severity} />
        <AiRoleChip aiRole={entry.aiRole} />
      </div>
      <Heading className="text-[#0F172A] font-bold text-lg leading-snug mb-2 group-hover:text-[#1D4ED8] motion-safe:transition-colors">
        {entry.title}
      </Heading>
      <p className="text-[#475569] text-sm leading-relaxed line-clamp-3 mb-4">{summary}</p>
      <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
        <span className="flex flex-wrap gap-1.5">
          {(entry.audience || []).map((a) => (
            <AudienceBadge key={a} audience={a} />
          ))}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8] shrink-0">
          Read
          <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
