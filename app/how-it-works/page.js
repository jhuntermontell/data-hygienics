import Link from "next/link"
import { ArrowRight, Briefcase, House } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import CitedText from "@/app/components/CitedText"
import SourceList from "@/app/components/SourceList"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"
import Statement from "@/app/components/brand/Statement"
import { MANIFESTO } from "@/lib/content/manifesto"
import { citationOrder, formatMonth } from "@/lib/content"
import { breadcrumbSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"

const title = "How We Research and Stay Independent | Data Hygienics"
const description =
  "How Data Hygienics works, in three parts: procedure beats detection, independence is the product, and your home stays yours. Plus where our numbers come from."

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/how-it-works` },
}

// The manifesto (design/brand-book/personality.md, decision 6): three
// numbered parts, each opening on a night band and reading on a day column,
// then the method, the note for AI crawlers and the numbered sources. Copy
// and citations live in lib/content/manifesto.js and are validated like the
// library.
const COLUMN = "max-w-[42rem]"

function Rules({ rules }) {
  return (
    <ul className="mt-8 list-none p-0 m-0 border-t border-[#E2E8F0]">
      {rules.map((rule) => (
        <li key={rule.title} className="py-5 border-b border-[#E2E8F0]">
          <h3 className="font-display font-semibold text-[1.1875rem] leading-snug tracking-[-0.01em] text-[#0F172A]">{rule.title}</h3>
          <p className="mt-1.5 text-[1rem] leading-relaxed text-[#475569]">{rule.detail}</p>
        </li>
      ))}
    </ul>
  )
}

// "3 sources" or "Our rules": how this part is backed.
function sourcesIn(part) {
  const ids = new Set()
  for (const text of part.paragraphs || []) for (const m of text.matchAll(/\[\^([a-z0-9-]+)\]/g)) ids.add(m[1])
  return ids.size ? `${ids.size} source${ids.size === 1 ? "" : "s"} cited` : "Our rules, in writing"
}

export default function HowWeWorkPage() {
  const { ids, number } = citationOrder(MANIFESTO)
  const parts = MANIFESTO.parts
  const total = parts.length

  return (
    <>
      <SchemaScript
        schema={breadcrumbSchema([
          { name: "Data Hygienics", path: "/" },
          { name: "How we work", path: "/how-it-works" },
        ])}
      />
      <Navbar surface="night" />
      <main className="bg-white text-[#0F172A]">
        {/* Opening: the title and the three parts */}
        <section aria-labelledby="how-title" className="bg-night text-night-ink px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto">
            <FoldRule tone="night" draw />
            <Readout tone="night" label className="mt-7">
              Method and independence · {total} parts · Reviewed {formatMonth(MANIFESTO.lastReviewed)}
            </Readout>
            <Statement id="how-title" className="mt-5">
              {MANIFESTO.title}
            </Statement>
            <p className="mt-7 max-w-2xl text-lg sm:text-[1.3125rem] leading-normal text-night-ink-2 text-pretty">{MANIFESTO.line}</p>
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6 list-none p-0 m-0">
              {parts.map((part, i) => (
                <li key={part.id}>
                  <a href={`#${part.id}`} className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]">
                    <FoldRule tone="night" />
                    <Readout as="span" tone="night" className="mt-4 block">
                      Part {i + 1} of {total}
                    </Readout>
                    <span className="mt-2 block font-display font-semibold text-[1.5rem] leading-tight tracking-[-0.015em] group-hover:text-night-accent transition-colors">
                      {part.title}
                    </span>
                    <span className="mt-2 block text-[0.9375rem] leading-relaxed text-night-ink-2">{part.lede}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The three parts */}
        {parts.map((part, i) => (
          <section key={part.id} id={part.id} aria-labelledby={`${part.id}-title`} className="scroll-mt-16">
            <div className="bg-night text-night-ink px-4 sm:px-6 py-14 sm:py-20 border-t border-night-line">
              <div className="max-w-7xl mx-auto">
                <Readout tone="night">
                  Part {i + 1} of {total}
                </Readout>
                <h2
                  id={`${part.id}-title`}
                  className="mt-4 max-w-4xl font-display font-semibold text-[2.25rem] sm:text-[3.25rem] lg:text-[4rem] leading-[1.02] tracking-[-0.03em] text-balance"
                >
                  {part.title}
                </h2>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-14 sm:py-20">
              <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 lg:gap-6">
                <div className={`${COLUMN} lg:col-span-7`}>
                  <p className="font-display font-medium text-[1.375rem] sm:text-[1.625rem] leading-[1.3] tracking-[-0.01em] text-[#0F172A]">
                    {part.lede}
                  </p>
                  {part.rules && part.id === "independence" ? <Rules rules={part.rules} /> : null}
                  <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.7] text-[#334155]">
                    {(part.paragraphs || []).map((text) => (
                      <p key={text.slice(0, 40)}>
                        <CitedText text={text} number={number} />
                      </p>
                    ))}
                  </div>
                  {part.rules && part.id !== "independence" ? <Rules rules={part.rules} /> : null}
                </div>
                <aside aria-hidden="true" className="hidden lg:block lg:col-start-10 lg:col-span-3">
                  <div className="sticky top-24">
                    <FoldRule />
                    <Readout className="mt-4">Part {i + 1} of {total}</Readout>
                    <Readout className="mt-1">{part.title}</Readout>
                    <Readout className="mt-1">{sourcesIn(part)}</Readout>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        ))}

        {/* The method */}
        <section aria-labelledby="method-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto">
            <FoldRule />
            <Readout label className="mt-7">
              The method
            </Readout>
            <h2 id="method-heading" className="mt-3 font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em]">
              {MANIFESTO.method.title}
            </h2>
            <p className={`mt-5 ${COLUMN} text-[1.0625rem] leading-relaxed text-[#475569]`}>{MANIFESTO.method.intro}</p>

            <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 list-none p-0 m-0">
              {MANIFESTO.method.tiers.map((tier) => (
                <li key={tier.tier}>
                  <FoldRule />
                  <Readout as="span" className="mt-4 block">
                    {tier.tier}
                  </Readout>
                  <h3 className="mt-2 font-display font-semibold text-[1.25rem] leading-tight tracking-[-0.01em]">{tier.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#475569]">{tier.detail}</p>
                </li>
              ))}
            </ol>

            <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-6">
              <div>
                <h3 className="font-display font-semibold text-[1.25rem] tracking-[-0.01em]">What we don&apos;t count as a source</h3>
                <ul className="mt-4 list-none p-0 m-0 border-t border-[#E2E8F0]">
                  {MANIFESTO.method.never.map((item) => (
                    <li key={item} className="py-3 border-b border-[#E2E8F0] text-[0.9375rem] text-[#475569]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display font-semibold text-[1.25rem] tracking-[-0.01em]">Dated and reviewed</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#475569]">{MANIFESTO.method.dated}</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI crawlers, then the sources */}
        <section aria-labelledby="crawlers-heading" className="px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto">
            <div className={COLUMN}>
              <FoldRule />
              <h2 id="crawlers-heading" className="mt-7 font-display font-semibold text-[1.75rem] leading-tight tracking-[-0.02em]">
                {MANIFESTO.crawlers.title}
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-[#475569]">{MANIFESTO.crawlers.detail}</p>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <a href="/robots.txt" className="text-[#1D4ED8] underline underline-offset-4">
                  Read our robots.txt
                </a>
                <Link href="/contact" className="text-[#1D4ED8] underline underline-offset-4">
                  Tell us we got something wrong
                </Link>
              </p>
              <SourceList ids={ids} />
            </div>
          </div>
        </section>

        {/* Close */}
        <section aria-labelledby="how-cta-heading" className="px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto">
            <FoldRule />
            <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 id="how-cta-heading" className="font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em]">
                  You deserve a straight answer
                </h2>
                <p className="mt-3 text-[1.0625rem] text-[#475569]">Pick a door. Everything we publish is free to read.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/household"
                  className="group inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#0F766E] text-white text-[15px] font-semibold hover:bg-[#115E59] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
                >
                  <House className="w-4 h-4" aria-hidden="true" />
                  For my home
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
                <Link
                  href="/business"
                  className="group inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#1D4ED8] text-white text-[15px] font-semibold hover:bg-[#1E40AF] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
                >
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                  For my business
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
