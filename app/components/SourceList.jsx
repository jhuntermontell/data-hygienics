import { getSource } from "@/lib/sources"
import { formatDate } from "@/lib/content"

const TYPE_LABELS = {
  government: "Government",
  standards: "Standards body",
  regulation: "Law or regulation",
  "incident-report": "Incident report",
  research: "Research",
  "vendor-doc": "Vendor documentation",
  journalism: "Journalism",
}

// Numbered source list. `ids` is the ordered list from citationOrder() so
// the numbers match the superscripts in the article body.
export default function SourceList({ ids = [], title = "Sources" }) {
  const sources = ids.map((id) => getSource(id)).filter(Boolean)
  if (!sources.length) return null

  return (
    <section aria-labelledby="sources-heading" className="mt-14 pt-8 border-t border-[#E2E8F0]">
      <h2 id="sources-heading" className="text-lg font-display font-semibold text-[#0F172A] mb-1">
        {title}
      </h2>
      <p className="text-[#64748B] text-sm mb-5">
        Every figure on this page links to where it came from. We favor government, standards, and
        methodology-backed sources, and we take no money from anyone we cite.
      </p>
      <ol className="space-y-3 list-none p-0">
        {sources.map((source, i) => (
          <li key={source.id} id={`src-${source.id}`} className="flex gap-3 text-sm scroll-mt-28">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="min-w-0 break-words">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-2"
              >
                {source.label}
              </a>
              <span className="text-[#475569]">
                {" "}
                &middot; {source.publisher}
                {source.published ? <> &middot; {formatDate(source.published)}</> : null}
              </span>
              <div className="text-[#94A3B8] text-xs mt-0.5">
                {TYPE_LABELS[source.type] || "Source"}
                {source.accessed ? <> &middot; accessed {formatDate(source.accessed)}</> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
