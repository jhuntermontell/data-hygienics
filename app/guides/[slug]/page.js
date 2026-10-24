import { notFound } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import GuideArticle from "@/app/components/GuideArticle"
import { entryMetadata, entryDescription } from "@/app/components/libraryHelpers"
import { articleSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import { guides, getGuideBySlug } from "@/lib/guides"
import { hrefFor, stripCitations } from "@/lib/content"

export const dynamicParams = false

export function generateStaticParams() {
  return guides.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const entry = getGuideBySlug(slug)
  if (!entry) return {}
  return entryMetadata(entry)
}

function plain(value) {
  return (Array.isArray(value) ? value : [value]).filter((v) => typeof v === "string").map(stripCitations).join(" ")
}

export default async function GuidePage({ params }) {
  const { slug } = await params
  const entry = getGuideBySlug(slug)
  if (!entry) notFound()

  const path = hrefFor(entry)
  const description = entryDescription(entry)
  const steps = (entry.steps || []).filter((s) => s?.title || s?.detail)
  const faqs = (entry.faqs || []).filter((f) => f?.question && f?.answer)

  const schemas = [
    steps.length
      ? howToSchema({
          name: entry.title,
          description,
          steps: steps.map((s) => ({
            name: plain(s.title) || plain(s.detail).slice(0, 80),
            text: [plain(s.detail), s.verify ? `How you know it worked: ${plain(s.verify)}` : ""].filter(Boolean).join(" "),
          })),
        })
      : null,
    articleSchema({
      title: entry.title,
      description,
      slug: path,
      lastReviewed: entry.lastReviewed ? `${entry.lastReviewed}-01` : entry.datePublished,
      datePublished: entry.datePublished,
    }),
    faqs.length
      ? faqSchema(faqs.map((f) => ({ question: stripCitations(f.question), answer: stripCitations(f.answer) })))
      : null,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: entry.title, path },
    ]),
  ].filter(Boolean)

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <GuideArticle entry={entry} />
        </main>
        <Footer />
      </div>
    </>
  )
}
