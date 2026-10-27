import Link from "next/link"
import { Wrench, BookMarked, ShieldCheck, ArrowRight } from "lucide-react"
import ContentCard from "./ContentCard"
import { SectionHeading } from "./ArticleParts"
import { glossaryHref, controlHref } from "@/lib/content"

// Renders resolveRelated() output: library entries as cards, then tools,
// glossary terms and controls as compact link lists. resolveRelated already
// drops drafts and missing slugs, so every link here resolves.
export default function RelatedContent({ related, title = "Keep going" }) {
  if (!related) return null
  const entries = [...(related.threats || []), ...(related.guides || []), ...(related.explainers || [])]
  const groups = [
    {
      key: "toolkit",
      title: "Tools we'd use",
      icon: Wrench,
      links: (related.toolkit || []).map((tool) => ({ href: `/toolkit#tool-${tool.slug}`, label: tool.name })),
    },
    {
      key: "glossary",
      title: "Terms to know",
      icon: BookMarked,
      links: (related.glossary || []).map((term) => ({ href: glossaryHref(term.slug), label: term.term })),
    },
    {
      key: "controls",
      title: "Controls behind the advice",
      icon: ShieldCheck,
      links: (related.controls || []).map((control) => ({ href: controlHref(control.slug), label: control.name })),
    },
  ].filter((group) => group.links.length > 0)

  if (!entries.length && !groups.length) return null

  return (
    <section aria-labelledby="related-heading" className="mt-14">
      <SectionHeading id="related-heading">{title}</SectionHeading>

      {entries.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {entries.map((entry) => (
            <li key={`${entry.kind}-${entry.slug}`}>
              <ContentCard entry={entry} headingLevel="h3" />
            </li>
          ))}
        </ul>
      ) : null}

      {groups.length > 0 ? (
        <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${entries.length ? "mt-4" : ""}`}>
          {groups.map(({ key, title: groupTitle, icon: Icon, links }) => (
            <div key={key} className="border border-[#E2E8F0] bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-display font-semibold text-[#0F172A] mb-3">
                <Icon className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                {groupTitle}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-start gap-1 text-sm font-medium text-[#1D4ED8] hover:text-[#1E40AF]"
                    >
                      <span className="underline decoration-[#1D4ED8]/30 underline-offset-2 group-hover:decoration-current">
                        {link.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 mt-[0.3em] shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
