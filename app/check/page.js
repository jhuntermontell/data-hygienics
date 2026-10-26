import Link from "next/link"
import { LifeBuoy, ArrowRight } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import CheckGrid from "@/app/components/check/CheckGrid"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema"
import { verdicts } from "@/lib/verdicts"
import { hrefFor } from "@/lib/content"

const TITLE = "Threat Check: is that text, call or email real? | Data Hygienics"
const DESCRIPTION =
  "Threat Check: got a text, call or email that doesn't feel right? Pick what happened and get a calm, two-minute answer: what to do, who to tell, and one rule to keep."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: "/check" })

export default function CheckPage() {
  const schemas = [
    collectionPageSchema({
      name: "Threat Check",
      description: DESCRIPTION,
      path: "/check",
      items: verdicts.map((entry) => ({ name: entry.title, path: hrefFor(entry) })),
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Threat Check", path: "/check" },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <header className="max-w-3xl mb-10">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#0F766E] mb-3">
              <LifeBuoy className="w-4 h-4" aria-hidden="true" />
              Is this real?
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-[1.08] tracking-tight text-balance mb-5">
              Threat Check
            </h1>
            <p className="text-[#334155] text-lg sm:text-xl font-semibold leading-snug">What just happened?</p>
            <p className="text-[#475569] text-base sm:text-lg leading-relaxed mt-2">
              Pick the closest match. Each answer tells you what&apos;s true, what to do in the next two minutes, and
              who to tell. You never have to judge whether a message looks real.
            </p>
          </header>

          <CheckGrid verdicts={verdicts} />

          <section aria-labelledby="not-listed" className="mt-12 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-7">
            <h2 id="not-listed" className="text-lg font-bold text-[#0F172A] mb-2">
              Not on the list?
            </h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              One rule covers most of them: don&apos;t use the link or number in the message. Reach the person or
              company on a number, app or website you already have. If money has already gone, call your bank first,
              then tell the Federal Trade Commission at{" "}
              <a
                href="https://reportfraud.ftc.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-2"
              >
                ReportFraud.ftc.gov
              </a>
              .
            </p>
            <Link
              href="/threats"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
            >
              Browse the Threat Library
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
