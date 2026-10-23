import { Suspense } from "react"
import { notFound } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import PathExperience from "@/app/components/path/PathExperience"
import { AUDIENCE_PATHS } from "@/lib/path"
import { resolvePathLinks } from "@/lib/path-links"
import { SITE } from "@/lib/site"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(AUDIENCE_PATHS).map((audience) => ({ audience }))
}

const META = {
  home: {
    title: "Clear Path for Home: Your Security Steps, in Order | Data Hygienics",
    description:
      "Tell us what you'd hate to lose, who's at home and what's connected. Get your security steps in order, sized to your week. No account needed.",
  },
  business: {
    title: "Clear Path for Business: Start With Your Industry | Data Hygienics",
    description:
      "Tell us your industry, team and tools. Get the steps that protect a small business, in order, including your team's AI use. Free, no account needed.",
  },
}

// Personal paths live in the visitor's browser, so these pages are a shell:
// the quiz and path render client-side. Kept out of search results; /path
// is the indexable entry.
export async function generateMetadata({ params }) {
  const { audience } = await params
  const meta = META[audience]
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${SITE.url}/path/${audience}` },
    robots: { index: false, follow: true },
  }
}

export default async function AudiencePathPage({ params }) {
  const { audience } = await params
  const config = AUDIENCE_PATHS[audience]
  if (!config) notFound()
  const links = resolvePathLinks(config.steps)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
          <Suspense fallback={null}>
            <PathExperience audience={audience} links={links} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
