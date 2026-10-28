import { Wrench, BadgeCheck } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import SourceList from "@/app/components/SourceList"
import ToolkitList from "@/app/components/ToolkitList"
import { libraryMetadata, orderCitations } from "@/app/components/libraryHelpers"
import { collectionPageSchema, breadcrumbSchema } from "@/lib/schema"
import { getToolsByCategory } from "@/lib/toolkit"

const TITLE = "Toolkit: Security Tools We'd Actually Use | Data Hygienics"
const DESCRIPTION =
  "Password managers, passkeys, backups and more, chosen for households and small businesses. No affiliate links, no referral fees, no sponsorships."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: "/toolkit" })

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : []
}

// Plain data only: ToolkitList is a client component.
function toolForClient(tool) {
  return {
    slug: tool.slug,
    name: tool.name,
    audience: list(tool.audience),
    whatItsFor: tool.whatItsFor || "",
    whyWeLikeIt: tool.whyWeLikeIt || "",
    caveats: list(tool.caveats),
    cost: tool.cost || "",
    pricingNote: tool.pricingNote || "",
    pricingVerified: tool.pricingVerified || "",
    platforms: list(tool.platforms),
    privacyNotes: tool.privacyNotes || "",
    alternatives: list(tool.alternatives).map((a) => ({ name: a.name || "", note: a.note || "" })),
    url: tool.url || "",
  }
}

export default function ToolkitPage() {
  const categories = getToolsByCategory().map((category) => ({
    slug: category.slug,
    name: category.name,
    why: category.why || "",
    tools: category.tools.map(toolForClient),
  }))

  // Number citations in the order ToolkitList renders prose.
  const texts = categories.flatMap((category) => [
    category.why,
    ...category.tools.flatMap((tool) => [
      tool.whatItsFor,
      tool.whyWeLikeIt,
      ...tool.caveats,
      tool.pricingNote,
      tool.privacyNotes,
      ...tool.alternatives.map((a) => a.note),
    ]),
  ])
  const sourceIds = getToolsByCategory().flatMap((category) => category.tools.flatMap((tool) => list(tool.sourceIds)))
  const { ids, number } = orderCitations(texts, sourceIds)

  const schemas = [
    collectionPageSchema({
      name: "Toolkit: tools we'd actually use",
      description: DESCRIPTION,
      path: "/toolkit",
      items: categories.flatMap((category) =>
        category.tools.map((tool) => ({ name: tool.name, path: `/toolkit#tool-${tool.slug}` }))
      ),
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Toolkit", path: "/toolkit" },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <header className="max-w-3xl mb-8">
            <p className="flex items-center gap-2 readout-label text-[#1D4ED8] mb-3">
              <Wrench className="w-4 h-4" aria-hidden="true" />
              Toolkit
            </p>
            <h1 className="font-display font-semibold text-[2.5rem] sm:text-[3.25rem] md:text-[3.5rem] text-[#0F172A] leading-[1.04] tracking-[-0.03em] text-balance mb-5">
              Tools we&apos;d actually use
            </h1>
            <p className="text-[#475569] text-lg leading-relaxed">
              A short list, by job to be done. Each pick says what it&apos;s for, why we like it, what to watch out
              for, what it costs, and what it does with your data.
            </p>
          </header>

          <div role="note" className="mb-10 flex gap-3 sm:gap-4 border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6">
            <BadgeCheck className="w-6 h-6 shrink-0 text-[#047857]" aria-hidden="true" />
            <div>
              <p className="font-bold text-[#064E3B] leading-snug">
                No affiliate links. No referral fees. No sponsorships. We earn nothing when you pick a tool.
              </p>
              <p className="text-sm text-[#334155] mt-1.5 leading-relaxed">
                Links go straight to the vendor with nothing added. Prices change, so each card shows the date we
                last checked; confirm on the vendor&apos;s site before you buy.
              </p>
            </div>
          </div>

          <ToolkitList categories={categories} number={number} />

          <SourceList ids={ids} />
        </main>
        <Footer />
      </div>
    </>
  )
}
