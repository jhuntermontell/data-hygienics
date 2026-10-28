import Link from "next/link"
import { ArrowRight, ListChecks } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"
import { cadenceFor, stepHref, stepsByStage } from "@/lib/steps"

const TITLE = `Every Clear Path Step, for Home and Business | ${SITE.name}`
const DESCRIPTION =
  "Every step in the Clear Path, grouped by stage: what to do, how to check it worked, and why it matters. Read any step, or start your own path."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: "/steps" })

const ACCENT = {
  home: { text: "text-[#0F766E]", rule: "border-[#0F8F83]/40" },
  business: { text: "text-[#1D4ED8]", rule: "border-[#1D4ED8]/40" },
}

export default function StepsIndexPage() {
  const groups = stepsByStage()
  const schemas = [
    collectionPageSchema({
      name: "Clear Path steps",
      description: DESCRIPTION,
      path: "/steps",
      items: groups.flatMap((g) => g.stages.flatMap((stage) => stage.steps.map((s) => ({ name: s.title, path: stepHref(s) })))),
    }),
    breadcrumbSchema([
      { name: SITE.name, path: "/" },
      { name: "Steps", path: "/steps" },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <header className="max-w-3xl mb-10">
            <p className="flex items-center gap-2 readout-label text-[#0F766E] mb-3">
              <ListChecks className="w-4 h-4" aria-hidden="true" />
              Clear Path steps
            </p>
            <h1 className="font-display font-semibold text-[2.5rem] sm:text-[3.25rem] md:text-[3.5rem] text-[#0F172A] leading-[1.04] tracking-[-0.03em] text-balance mb-5">
              Every step, in the order we&apos;d take them
            </h1>
            <p className="text-[#475569] text-lg leading-relaxed">
              These are the steps behind the Clear Path, grouped by stage. Each one says what to do, how to check it
              worked and why it matters. Your own path puts them in order for your home or business and sizes them to your
              week.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/path/home"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115E59]"
              >
                Start a path for home
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/path/business"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF]"
              >
                Start a path for business
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </header>

          {groups.map((group) => {
            const accent = ACCENT[group.audience] || ACCENT.home
            const headingId = `steps-${group.audience}`
            return (
              <section key={group.audience} aria-labelledby={headingId} className="mt-12">
                <h2 id={headingId} className={`text-2xl sm:text-3xl font-display font-semibold tracking-[-0.02em] pb-3 border-b-2 ${accent.rule} text-[#0F172A]`}>
                  For {group.label === "Home" ? "home" : "business"}
                </h2>
                {group.stages.map((stage) => (
                  <div key={stage.id} className="mt-8">
                    <h3 className={`text-lg font-display font-semibold ${accent.text}`}>{stage.title}</h3>
                    {stage.summary ? <p className="mt-1 text-sm leading-relaxed text-[#475569] max-w-3xl">{stage.summary}</p> : null}
                    <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2 list-none p-0 m-0">
                      {stage.steps.map((step) => {
                        const cadence = cadenceFor(step)
                        return (
                          <li key={step.id} className="min-w-0">
                            <Link
                              href={stepHref(step)}
                              className="group flex flex-col px-2 py-2 -mx-2 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                            >
                              <span className="text-[15px] font-semibold leading-snug text-[#0F172A] group-hover:text-[#1D4ED8]">
                                {step.title}
                              </span>
                              <span className="text-xs text-[#64748B]">
                                {cadence ? `${cadence.label} · ` : ""}About {step.minutes || 0} min
                              </span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </section>
            )
          })}
        </main>
        <Footer />
      </div>
    </>
  )
}
