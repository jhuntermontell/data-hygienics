import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import AudienceBadge from "./AudienceBadge"
import { AI_ROLE_LABELS, SEVERITY_LABELS, hrefFor, stripCitations } from "@/lib/content"

// Compact cards for featured threats. Rendered inside the homepage Hero (a
// client component), so it receives trimmed, serializable items built on the
// server with toSpotlightItem() rather than whole threat entries.

const SEVERITY_STYLES = {
  high: "bg-[#FFFBEB] text-[#B45309] border-[#F59E0B]/30",
  medium: "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]",
  emerging: "bg-[#F5F3FF] text-[#6D28D9] border-[#8B5CF6]/25",
}

export function toSpotlightItem(threat) {
  return {
    kind: threat.kind,
    slug: threat.slug,
    title: threat.title,
    href: hrefFor(threat),
    severity: threat.severity || null,
    aiRole: threat.aiRole || null,
    audience: threat.audience || [],
    summary: stripCitations(threat.tldr || threat.whatItIs || ""),
  }
}

export default function ThreatSpotlight({ threats = [], headingId = "spotlight-heading" }) {
  if (!threats.length) return null

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 id={headingId} className="text-xs font-semibold tracking-[0.1em] uppercase text-[#64748B]">
          Threats to know now
        </h2>
        <Link
          href="/threats"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
        >
          Threat Library
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      </div>
      <ul className="space-y-3 list-none p-0">
        {threats.map((threat) => (
          <li key={threat.slug}>
            <Link
              href={threat.href}
              className="group block bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] hover:border-[#1D4ED8]/40 hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {threat.severity && SEVERITY_LABELS[threat.severity] ? (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${SEVERITY_STYLES[threat.severity] || SEVERITY_STYLES.medium}`}
                  >
                    {SEVERITY_LABELS[threat.severity]}
                  </span>
                ) : null}
                {threat.aiRole && AI_ROLE_LABELS[threat.aiRole] ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#64748B]">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    {AI_ROLE_LABELS[threat.aiRole]}
                  </span>
                ) : null}
              </div>
              <h3 className="text-[15px] sm:text-base font-bold leading-snug text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
                {threat.title}
              </h3>
              {threat.summary ? (
                <p className="mt-1.5 text-sm leading-relaxed text-[#475569] line-clamp-2">{threat.summary}</p>
              ) : null}
              {threat.audience.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {threat.audience.map((a) => (
                    <AudienceBadge key={a} audience={a} />
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
