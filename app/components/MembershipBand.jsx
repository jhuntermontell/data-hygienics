import Link from "next/link"
import { ArrowRight, Check, Gift, MessageCircleQuestion, MonitorSmartphone, Scale } from "lucide-react"
import { MEMBERSHIP } from "@/lib/content/membership"
import JoinLink from "./membership/JoinLink"
import JoinViewed from "./membership/JoinViewed"
import FoldRule from "./brand/FoldRule"
import Readout from "./brand/Readout"

// Homepage membership band: the ask that follows the promise. Navy surface,
// copy on the left (eyebrow, headline, body, four proofs, the guarantee
// line) and the price card on the right. On a phone the card comes straight
// after the headline and body, with the proofs beneath it. Server component;
// the only client JS is the two islands (JoinViewed fires join_viewed once,
// JoinLink fires join_started on click). No motion, no statistics.

const SURFACE = "homepage"
const PROOF_KEYS = ["ask", "path", "independent", "free"]
const PROOF_ICONS = { ask: MessageCircleQuestion, path: MonitorSmartphone, independent: Scale, free: Gift }

const usd = (n) => `$${n.toLocaleString("en-US")}`

export default function MembershipBand() {
  const { homepage, prices } = MEMBERSHIP
  const proofs = PROOF_KEYS.map((key) => MEMBERSHIP.proofs.find((p) => p.key === key)).filter(Boolean)
  const join = `${MEMBERSHIP.ctaShort} for ${usd(prices.home.monthly)}`

  return (
    <section aria-labelledby="membership-heading" className="bg-night text-white">
      <JoinViewed surface={SURFACE} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">
        <FoldRule tone="night" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-7 pb-20 sm:pb-28 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-12 lg:gap-y-10 lg:items-start">
        <div className="lg:col-start-1 lg:row-start-1">
          <Readout tone="night" label>{homepage.eyebrow}</Readout>
          <h2 id="membership-heading" className="mt-3 font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-white text-balance">
            {homepage.headline}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#CBD5E1]">{homepage.body}</p>
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div
            role="group"
            aria-label={`${MEMBERSHIP.name}, ${usd(prices.home.monthly)} a month`}
            className="border border-night-line-2 bg-night-raised p-6 sm:p-8"
          >
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.03em] tabular-nums text-white">{usd(prices.home.monthly)}</span>
              <span className="text-base text-[#94A3B8]">/ month</span>
            </p>
            <p className="mt-1 text-sm text-[#CBD5E1]">or {usd(prices.home.yearly)} a year</p>
            <p className="mt-1 text-sm text-[#CBD5E1]">Business from {usd(prices.business.monthly)} a month</p>
            <ul className="mt-6 space-y-3 list-none p-0">
              {homepage.checks.map((check) => (
                <li key={check} className="flex items-start gap-2.5 text-[15px] text-white">
                  <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
                  {check}
                </li>
              ))}
            </ul>
            <JoinLink
              href="/pricing?door=home"
              surface={SURFACE}
              door="home"
              className="mt-7 flex w-full items-center justify-center gap-2 bg-white px-5 h-12 text-[15px] font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
            >
              {join}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </JoinLink>
          </div>
          <Link
            href="/pricing#free"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#5EEAD4] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
          >
            {homepage.secondary}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 list-none p-0">
            {proofs.map((proof) => {
              const Icon = PROOF_ICONS[proof.key]
              return (
                <li key={proof.key} className="flex items-start gap-3 text-[15px] leading-snug text-white">
                  <Icon className="w-5 h-5 mt-0.5 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
                  {proof.title}
                </li>
              )
            })}
          </ul>
          <p className="mt-6 text-sm text-night-readout">{MEMBERSHIP.exit}</p>
        </div>
      </div>
    </section>
  )
}
