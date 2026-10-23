import Link from "next/link"
import { ArrowRight, Ban, Bot, Briefcase, CalendarClock, House, Landmark, Newspaper, Scale, ScrollText } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import BusinessToolsStrip from "@/app/components/BusinessToolsStrip"
import { breadcrumbSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"

const title = "How We Research and Stay Independent | Data Hygienics"
const description =
  "How Data Hygienics works: where our numbers come from, how we date and review them, what we sell, and what we never do. AI crawlers welcome."

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/how-it-works` },
}

const SOURCE_TIERS = [
  {
    tier: "Tier 1",
    icon: Landmark,
    title: "Government, regulators and standards bodies",
    text: "Agencies such as the FBI's Internet Crime Complaint Center, the FTC and CISA, standards bodies such as NIST and OWASP, and the text of laws themselves. Any headline number needs a source from this tier or the next.",
  },
  {
    tier: "Tier 2",
    icon: ScrollText,
    title: "Research with a published method",
    text: "Annual reports that explain how they gathered their data, peer-reviewed studies, and AI companies' own threat reports. When a company reports on a problem it also sells a fix for, we note that interest.",
  },
  {
    tier: "Tier 3",
    icon: Newspaper,
    title: "Reputable journalism",
    text: "Used for documented incidents and context, pointing back to the primary source where one exists. Never the only support for a statistic.",
  },
]

const NEVER = [
  "Marketing posts with no method behind the numbers",
  "AI-generated summaries, content farms and social media posts",
  "Wikipedia as a source (we use it to find the primary one)",
  "Our own earlier articles as proof of anything",
]

const INDEPENDENCE = [
  {
    title: "We sell only our own tools.",
    text: "The only things we sell are our own business tools, and we label them clearly wherever they appear.",
  },
  {
    title: "No referral fees, no affiliate links.",
    text: "Links to products are clean, with no tracking codes. We earn nothing when you click or buy.",
  },
  {
    title: "No sponsorships.",
    text: "Nobody pays to appear in the Toolkit, the Threat Library or anywhere else.",
  },
  {
    title: "Recommendations only where they help.",
    text: "We recommend specific products only in the Toolkit, in step-by-step guides, and where a fix depends on one product's setting. We explain why each one made the cut.",
  },
]

function SectionHeading({ id, eyebrow, children }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#0F766E]">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
        {children}
      </h2>
    </div>
  )
}

export default function HowWeWorkPage() {
  return (
    <>
      <SchemaScript
        schema={breadcrumbSchema([
          { name: "Data Hygienics", path: "/" },
          { name: "How we work", path: "/how-it-works" },
        ])}
      />
      <Navbar />
      <main className="bg-white text-[#0F172A]">
        {/* Header */}
        <section aria-labelledby="how-title" className="relative overflow-hidden px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] rounded-full bg-gradient-to-r from-[#1D4ED8]/10 to-[#0F8F83]/10 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#64748B]">Method and independence</p>
            <h1 id="how-title" className="mt-4 text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-6xl font-bold tracking-tight">
              How we work
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-[#475569]">
              We read the reports so you don&apos;t have to, then tell you what to do. Here&apos;s where our numbers
              come from, what we sell, and what we never do.
            </p>
          </div>
        </section>

        {/* The problem */}
        <section aria-labelledby="problem-heading" className="px-4 sm:px-6 py-16 sm:py-20 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto">
            <SectionHeading id="problem-heading" eyebrow="The problem">
              Too much noise, too many incentives
            </SectionHeading>
            <div className="mt-6 space-y-5 text-[#475569] text-lg leading-relaxed">
              <p>
                AI arrived in your inbox, your phone and your team&apos;s browser tabs faster than the advice did. Most
                of what you&apos;ll find is hype, alarm or a sales pitch.
              </p>
              <p>
                The hype says AI will handle everything. The alarm says nothing is safe. The sales pitch says the fix
                is whatever is being sold.
              </p>
              <p>
                Plenty of the people giving security advice also profit from what they recommend. Most of them do good
                work, but you deserve a second opinion from someone with no stake in your answer.
              </p>
            </div>
          </div>
        </section>

        {/* How we research */}
        <section aria-labelledby="research-heading" className="px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <SectionHeading id="research-heading" eyebrow="How we research">
                Every number has a source
              </SectionHeading>
              <div className="mt-6 space-y-5 text-[#475569] text-lg leading-relaxed">
                <p>
                  Every entry starts with a question a household or small business actually has. We go to the most
                  authoritative source that answers it, read it, and record exactly where each figure lives.
                </p>
                <p>
                  If a sentence contains a statistic, it carries a numbered link to a named, dated source. When sources
                  disagree, we use the more conservative figure. When nobody knows yet, we say so.
                </p>
              </div>
            </div>

            <h3 className="mt-12 text-xl font-bold text-[#0F172A]">Which sources count</h3>
            <ol className="mt-5 grid gap-5 md:grid-cols-3 list-none p-0">
              {SOURCE_TIERS.map((tier) => {
                const Icon = tier.icon
                return (
                  <li key={tier.tier} className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold tracking-[0.08em] uppercase text-[#64748B]">{tier.tier}</span>
                    </div>
                    <h4 className="mt-4 font-bold text-[#0F172A] leading-snug">{tier.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#475569]">{tier.text}</p>
                  </li>
                )
              })}
            </ol>

            <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <p className="flex items-center gap-2 font-bold text-[#0F172A]">
                <Ban className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                What we don&apos;t count as a source
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 list-none p-0 text-sm text-[#475569]">
                {NEVER.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-2 w-1 h-1 rounded-full bg-[#94A3B8] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="flex gap-4">
                <span className="shrink-0 w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center">
                  <CalendarClock className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Everything is dated</h3>
                  <p className="mt-2 text-[#475569] leading-relaxed">
                    Each entry shows when we published it and when we last reviewed it. Each source shows when it was
                    published and when we checked it. We use the newest edition of a report we can verify, and when the
                    best available figure is older, we say so in the sentence.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center">
                  <Scale className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Reviewed, not set and forgotten</h3>
                  <p className="mt-2 text-[#475569] leading-relaxed">
                    When a new edition of a report we cite comes out, we update the figure or flag it as older. Our
                    stance pieces name the event that would change our minds, and we revisit them when it happens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Independence */}
        <section aria-labelledby="independence-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-[#0F172A] text-white">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#99F6E4]">Independence</p>
              <h2 id="independence-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                Independence, in writing
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#CBD5E1]">
                Advice is only as good as the incentives behind it. Here are ours.
              </p>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 list-none p-0">
              {INDEPENDENCE.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">{item.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-3xl text-[#CBD5E1] leading-relaxed">
              How we pay the bills: our business tools, the Cyber Audit, Policy Library and Incident Response Planner.
              Everything we publish is free to read.
            </p>
          </div>
        </section>

        {/* What the business tools do */}
        <BusinessToolsStrip />

        {/* AI crawlers welcome */}
        <section aria-labelledby="crawlers-heading" className="px-4 sm:px-6 py-16 sm:py-20 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#1D4ED8]" aria-hidden="true" />
              </span>
              <SectionHeading id="crawlers-heading" eyebrow="AI crawlers welcome">
                Yes, AI can read this site
              </SectionHeading>
            </div>
            <div className="mt-6 space-y-5 text-[#475569] text-lg leading-relaxed">
              <p>
                Our{" "}
                <a href="/robots.txt" className="font-semibold text-[#1D4ED8] underline underline-offset-2">
                  robots.txt
                </a>{" "}
                lets AI crawlers, including GPTBot, ClaudeBot and PerplexityBot, read every page. If someone asks an
                assistant how to spot a cloned voice, we&apos;d rather it learned from sourced, dated guidance than
                from a guess.
              </p>
              <p>
                Our research pages carry structured data and a numbered source list, so an assistant can cite us accurately.
                If one ever gets us wrong,{" "}
                <Link href="/contact" className="font-semibold text-[#1D4ED8] underline underline-offset-2">
                  tell us
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section aria-labelledby="how-cta-heading" className="px-4 sm:px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="how-cta-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
              You deserve a straight answer.
            </h2>
            <p className="mt-3 text-lg text-[#475569]">Pick a door. Everything we publish is free to read.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/household"
                className="group inline-flex items-center justify-center gap-2 bg-[#0F766E] text-white font-semibold text-sm px-7 py-3.5 rounded-lg hover:bg-[#115E59] transition-colors shadow-sm"
              >
                <House className="w-4 h-4" aria-hidden="true" />
                For my home
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                href="/business"
                className="group inline-flex items-center justify-center gap-2 bg-[#1D4ED8] text-white font-semibold text-sm px-7 py-3.5 rounded-lg hover:bg-[#1E40AF] transition-colors shadow-sm"
              >
                <Briefcase className="w-4 h-4" aria-hidden="true" />
                For my business
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
