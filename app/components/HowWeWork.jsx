import Link from "next/link"
import { ArrowRight, Link2 } from "lucide-react"
import ValueProps from "./ValueProps"

// Homepage section: the independence promise and the sourcing rule, with a
// link to the full method on /how-it-works.
export default function HowWeWork() {
  return (
    <section aria-labelledby="how-we-work-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#1D4ED8]">How we work</p>
            <h2 id="how-we-work-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
              Advice with no strings attached
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[#475569]">
              We research first, then tell you what to do. Our own business tools are the only thing we sell. We
              take no referral fees, use no affiliate links and accept no sponsors.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6">
              <span className="shrink-0 w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center">
                <Link2 className="w-5 h-5 text-[#0F766E]" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-[#0F172A]">Every number has a source.</p>
                <p className="mt-1 text-sm leading-relaxed text-[#475569]">
                  If a sentence has a statistic, it links to a named, dated source. If we can&apos;t find one we
                  trust, we say &ldquo;we don&apos;t know yet.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ValueProps />
        </div>

        <Link
          href="/how-it-works"
          className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
        >
          How we research and stay independent
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
