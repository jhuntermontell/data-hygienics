import Link from "next/link"
import { ArrowRight } from "lucide-react"
import FoldRule from "./brand/FoldRule"
import Readout from "./brand/Readout"

// Four plain promises on a day surface, each under a fold rule. The
// headline is a claim the four rules beneath it back.
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
    title: "Free means free",
    detail: "The Path, the guides and the threat library are free, with no account needed.",
  },
]

export default function OurPromise() {
  return (
    <section aria-labelledby="promise-heading" className="bg-[#F8FAFC] text-[#0F172A] border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <Readout label>Our promise</Readout>
          <h2 id="promise-heading" className="mt-3 font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em]">
            Four rules we don&apos;t break
          </h2>
        </div>
        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
          {PROMISES.map((promise, i) => (
            <li key={promise.title}>
              <FoldRule />
              <span className="readout mt-4 block text-[#0F766E]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display font-semibold text-[1.3125rem] leading-tight tracking-[-0.01em]">{promise.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#475569]">{promise.detail}</p>
            </li>
          ))}
        </ol>
        <Link
          href="/how-it-works"
          className="group mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#1D4ED8]/30 hover:decoration-[#1D4ED8]"
        >
          How we research and stay independent
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
