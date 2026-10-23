import Link from "next/link"
import { ListChecks, CircleCheck } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import AudienceFilter from "@/app/components/AudienceFilter"
import GuideCard from "@/app/components/GuideCard"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema"
import { guides } from "@/lib/guides"
import { hrefFor } from "@/lib/content"

const TITLE = "Digital Hygiene Guides | Data Hygienics"
const DESCRIPTION =
  "Step-by-step security habits for the AI era, in plain English, for households and small businesses. Each step ends with a check so you know it worked."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: "/guides" })

export default function GuidesIndexPage() {
  const schemas = [
    collectionPageSchema({
      name: "Guides",
      description: DESCRIPTION,
      path: "/guides",
      items: guides.map((entry) => ({ name: entry.title, path: hrefFor(entry) })),
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <header className="max-w-3xl mb-10">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#047857] mb-3">
              <ListChecks className="w-4 h-4" aria-hidden="true" />
              Guides
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-[1.08] tracking-tight text-balance mb-5">
              Step-by-step hygiene, in plain English
            </h1>
            <p className="text-[#475569] text-lg leading-relaxed">
              Small habits that stop the scams and slip-ups AI makes easier. Pick one, set aside the time it says,
              and work through it.
            </p>
            <p className="mt-4 inline-flex items-start gap-2 text-sm text-[#065F46]">
              <CircleCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#047857]" aria-hidden="true" />
              Every step ends with &ldquo;How you know it worked,&rdquo; so you&apos;re never left guessing.
            </p>
          </header>

          <section aria-labelledby="all-guides-heading">
            <h2 id="all-guides-heading" className="sr-only">
              All guides
            </h2>
            {guides.length > 0 ? (
              <AudienceFilter
                nouns={["guide", "guides"]}
                label="Show guides for"
                emptyMessage="No guides for this audience yet. Try All."
                items={guides.map((entry) => ({
                  key: entry.slug,
                  audience: entry.audience || [],
                  node: <GuideCard entry={entry} headingLevel="h3" />,
                }))}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-[#475569]">
                The first guides are in final review. Meanwhile, the{" "}
                <Link href="/threats" className="font-semibold text-[#1D4ED8] underline underline-offset-2">
                  Threat Library
                </Link>{" "}
                lists what stops each threat.
              </p>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
