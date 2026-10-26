import Link from "next/link"
import { ArrowRight } from "lucide-react"
import BrandMark from "./BrandMark"

// Four plain promises, stacked with dividers beside the brand mark.
// Copy rules: no statistics here; these are commitments, not claims.
const PROMISES = [
  {
    title: "Independent",
    detail:
      "Our own business tools are the only thing we sell, and we label them wherever they appear. We take no referral fees, use no affiliate links and accept no sponsors.",
  },
  {
    title: "Every number has a source",
    detail:
      "If a sentence has a statistic, it links to a named, dated source, and we favor government and standards bodies. When we don't know yet, we say so.",
  },
  {
    title: "Yours stays yours",
    detail:
      "Your path lives in your browser. Save it to a free account only if you want it on another device, and export or delete it any time. We never ask for passwords, account numbers or anything you'd have to type from a card.",
  },
  {
    title: "Free to use",
    detail: "The Path, the guides and the threat library are free, with no account needed.",
  },
]

export default function OurPromise() {
  return (
    <section
      aria-labelledby="promise-heading"
      className="px-4 sm:px-6 py-16 sm:py-24 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F0FDFA]"
    >
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div className="hidden lg:flex justify-center">
          <div className="w-80 h-80 rounded-[2.5rem] bg-white shadow-sm flex items-center justify-center">
            <BrandMark className="w-40 h-40" title="Data Hygienics" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#1D4ED8]">Our promise</p>
          <h2 id="promise-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            The Data Hygienics promise
          </h2>
          <ul className="mt-8 list-none p-0">
            {PROMISES.map((promise) => (
              <li key={promise.title} className="border-t border-[#E2E8F0] py-5">
                <h3 className="text-lg font-bold text-[#0F172A]">{promise.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#475569]">{promise.detail}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/how-it-works"
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
          >
            How we research and stay independent
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
