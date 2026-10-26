import Link from "next/link"
import { ArrowRight, House, Briefcase } from "lucide-react"

// The /check grid: one chip per verdict, in the reader's words, grouped
// Home and Business. Chips are plain links to indexable verdict pages.
const GROUPS = [
  {
    key: "home",
    label: "At home",
    icon: House,
    heading: "text-[#0F766E]",
    chip: "hover:border-[#0F8F83] hover:bg-[#F0FDFA] focus-visible:outline-[#0F766E]",
    arrow: "text-[#0F766E]",
  },
  {
    key: "business",
    label: "At work",
    icon: Briefcase,
    heading: "text-[#1D4ED8]",
    chip: "hover:border-[#1D4ED8] hover:bg-[#EFF6FF] focus-visible:outline-[#1D4ED8]",
    arrow: "text-[#1D4ED8]",
  },
]

export default function CheckGrid({ verdicts = [] }) {
  return (
    <div className="space-y-10">
      {GROUPS.map((group) => {
        const items = verdicts.filter((v) => v.audience?.includes(group.key))
        if (!items.length) return null
        const Icon = group.icon
        const headingId = `check-${group.key}`
        return (
          <section key={group.key} aria-labelledby={headingId}>
            <h2 id={headingId} className={`flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase mb-4 ${group.heading}`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
              {group.label}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 list-none p-0">
              {items.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/check/${v.slug}`}
                    className={`group flex h-full items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 text-base font-semibold text-[#0F172A] leading-snug motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${group.chip}`}
                  >
                    <span>{v.chip}</span>
                    <ArrowRight className={`w-4 h-4 shrink-0 ${group.arrow} motion-safe:transition-transform group-hover:translate-x-0.5`} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
