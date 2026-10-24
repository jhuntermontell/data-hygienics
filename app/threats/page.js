import Link from "next/link"
import { ShieldAlert, Building2, ArrowRight, Info, BookOpenCheck } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import AudienceFilter from "@/app/components/AudienceFilter"
import AudienceBadge from "@/app/components/AudienceBadge"
import ThreatCard from "@/app/components/ThreatCard"
import { SeverityChip, AiRoleChip, SEVERITY_HELP, AI_ROLE_HELP } from "@/app/components/ThreatMeta"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema"
import { getAiThreats, getIndustryBriefs } from "@/lib/threats"
import { hrefFor } from "@/lib/content"

const TITLE = "AI-Era Threat Library | Data Hygienics"
const DESCRIPTION =
  "Plain-English briefs on the AI-era scams and attacks hitting homes and small businesses: what they look like, what stops them, what to do next."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: "/threats" })

export default function ThreatsIndexPage() {
  const aiThreats = getAiThreats()
  const briefs = getIndustryBriefs()

  const schemas = [
    collectionPageSchema({
      name: "Threat Library",
      description: DESCRIPTION,
      path: "/threats",
      items: [...aiThreats, ...briefs].map((entry) => ({ name: entry.title, path: hrefFor(entry) })),
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Threat Library", path: "/threats" },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <header className="max-w-3xl mb-12">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#B91C1C] mb-3">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              Threat Library
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-[1.08] tracking-tight text-balance mb-5">
              What&apos;s actually hitting homes and small businesses
            </h1>
            <p className="text-[#475569] text-lg leading-relaxed">
              One page per threat: what it is, what it looks like at home and at work, what stops it, and what to
              do if it already happened. Every figure links to the source it came from.
            </p>
          </header>

          <section aria-labelledby="ai-threats-heading">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
              <div className="max-w-2xl">
                <h2 id="ai-threats-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                  AI-era threats
                </h2>
                <p className="text-[#475569] mt-1.5">
                  Scams and attacks that AI made cheaper, faster, or possible in the first place.
                </p>
              </div>
            </div>

            <details className="group mb-6 rounded-xl border border-[#E2E8F0] bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-[#334155] [&::-webkit-details-marker]:hidden">
                <Info className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                How to read the labels
                <span className="ml-auto text-xs font-medium text-[#64748B] group-open:hidden" aria-hidden="true">Show</span>
                <span className="ml-auto text-xs font-medium text-[#64748B] hidden group-open:inline" aria-hidden="true">Hide</span>
              </summary>
              <div className="grid gap-6 border-t border-[#F1F5F9] px-4 py-4 md:grid-cols-2">
                <dl className="space-y-3">
                  {Object.keys(SEVERITY_HELP).map((key) => (
                    <div key={key} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                      <dt className="shrink-0 sm:w-40">
                        <SeverityChip severity={key} />
                      </dt>
                      <dd className="text-sm text-[#475569]">{SEVERITY_HELP[key]}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="space-y-3">
                  {Object.keys(AI_ROLE_HELP).map((key) => (
                    <div key={key} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                      <dt className="shrink-0 sm:w-40">
                        <AiRoleChip aiRole={key} />
                      </dt>
                      <dd className="text-sm text-[#475569]">{AI_ROLE_HELP[key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </details>

            {aiThreats.length > 0 ? (
              <AudienceFilter
                nouns={["threat", "threats"]}
                label="Show threats for"
                emptyMessage="No threats in the library for this audience yet. Try All."
                items={aiThreats.map((entry) => ({
                  key: entry.slug,
                  audience: entry.audience || [],
                  node: <ThreatCard entry={entry} headingLevel="h3" />,
                }))}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-[#475569]">
                We&apos;re finishing the research on the first entries. In the meantime, the{" "}
                <Link href="/guides" className="font-semibold text-[#1D4ED8] underline underline-offset-2">
                  guides
                </Link>{" "}
                have habits you can start today.
              </p>
            )}
          </section>

          {briefs.length > 0 ? (
            <section aria-labelledby="industry-briefs-heading" className="mt-16">
              <div className="max-w-2xl mb-6">
                <h2 id="industry-briefs-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                  Industry briefs
                </h2>
                <p className="text-[#475569] mt-1.5">
                  Longer reads on the threats that hit specific kinds of small organizations hardest.
                </p>
              </div>
              <ul className="grid gap-4 md:grid-cols-2">
                {briefs.map((brief) => (
                  <li key={brief.slug} className="min-w-0">
                    <Link
                      href={hrefFor(brief)}
                      className="group flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 sm:p-6 hover:border-[#1D4ED8]/40 hover:shadow-sm motion-safe:transition-all"
                    >
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]">
                          <Building2 className="w-3 h-3" aria-hidden="true" />
                          Industry brief
                        </span>
                        {(brief.audience || ["business"]).map((a) => (
                          <AudienceBadge key={a} audience={a} />
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] leading-snug mb-2 group-hover:text-[#1D4ED8] motion-safe:transition-colors">
                        {brief.industry || brief.title}
                      </h3>
                      <p className="text-sm text-[#475569] leading-relaxed mb-4">
                        {brief.industryDescription || brief.metaDescription}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8]">
                        Read the brief
                        <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <aside className="mt-16 flex flex-col sm:flex-row gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
            <BookOpenCheck className="w-6 h-6 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">How we build these</h2>
              <p className="text-sm text-[#475569] mt-1 leading-relaxed">
                We read the government reports, standards, and incident write-ups first, then write in plain English.
                Each entry shows when we last reviewed it. We take no money from anyone we cite or recommend.{" "}
                <Link href="/how-it-works" className="font-semibold text-[#1D4ED8] underline underline-offset-2">
                  How we work
                </Link>
              </p>
            </div>
          </aside>
        </main>
        <Footer />
      </div>
    </>
  )
}
