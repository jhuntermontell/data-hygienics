import Link from "next/link"
import { ArrowRight, Bot, KeyRound, LockKeyhole, PhoneOff } from "lucide-react"
import { getToolsByCategory } from "@/lib/toolkit"

// Homepage teaser for the Toolkit: a few categories, each linking to its
// section on /toolkit (#cat-<slug>). getToolsByCategory() only returns
// categories with visible tools, so every anchor exists on the page.

const TEASER = [
  { slug: "password-manager", icon: LockKeyhole },
  { slug: "passkeys-authenticator", icon: KeyRound },
  { slug: "call-screening", icon: PhoneOff },
  { slug: "private-ai", icon: Bot },
]

export default function ToolkitTeaser() {
  const visible = getToolsByCategory()
  const categories = TEASER.map((item) => {
    const category = visible.find((c) => c.slug === item.slug)
    return category ? { ...category, icon: item.icon } : null
  }).filter(Boolean)

  if (!categories.length) return null

  const columns = categories.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"

  return (
    <section aria-labelledby="toolkit-teaser-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#1D4ED8]">The Toolkit</p>
            <h2 id="toolkit-teaser-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
              Tools we&apos;d actually use
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[#475569]">
              Picked for households and small teams, with the catches spelled out. No referral fees, no affiliate
              links, and nobody paid to be listed.
            </p>
          </div>
          <Link
            href="/toolkit"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] shrink-0"
          >
            Full toolkit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        <ul className={`mt-10 grid gap-5 list-none p-0 ${columns}`}>
          {categories.map((category) => {
            const Icon = category.icon
            const names = category.tools.slice(0, 3).map((t) => t.name)
            return (
              <li key={category.slug}>
                <Link
                  href={`/toolkit#cat-${category.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:border-[#1D4ED8]/40 hover:shadow-md transition-all"
                >
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#F0FDFA] text-[#0F172A] flex items-center justify-center">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold leading-snug text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
                    {category.name}
                  </h3>
                  {category.why ? (
                    <p className="mt-2 text-sm leading-relaxed text-[#475569] flex-1">{category.why}</p>
                  ) : null}
                  {names.length ? (
                    <p className="mt-4 text-xs font-medium text-[#64748B]">
                      Includes {names.join(", ")}
                      {category.tools.length > names.length ? " and more" : ""}
                    </p>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
