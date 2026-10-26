import { notFound } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import VerdictArticle from "@/app/components/check/VerdictArticle"
import { libraryMetadata, entryTitle, entryDescription } from "@/app/components/libraryHelpers"
import { articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"
import { verdicts, getVerdictBySlug } from "@/lib/verdicts"
import { hrefFor, stripCitations } from "@/lib/content"
import { SITE } from "@/lib/site"

export const dynamicParams = false

export function generateStaticParams() {
  return verdicts.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const entry = getVerdictBySlug(slug)
  if (!entry) return {}
  const path = hrefFor(entry)
  // The route's own opengraph-image.js carries the verdict's share card.
  return libraryMetadata({
    title: entryTitle(entry),
    description: entryDescription(entry),
    path,
    image: `${path}/opengraph-image`,
    type: "article",
    publishedTime: entry.datePublished,
    modifiedTime: entry.lastReviewed ? `${entry.lastReviewed}-01` : undefined,
  })
}

export default async function VerdictPage({ params }) {
  const { slug } = await params
  const entry = getVerdictBySlug(slug)
  if (!entry) notFound()

  const path = hrefFor(entry)
  const faqs = (entry.faqs || []).filter((f) => f?.question && f?.answer)
  const schemas = [
    articleSchema({
      title: entry.title,
      description: entryDescription(entry),
      slug: path,
      lastReviewed: entry.lastReviewed ? `${entry.lastReviewed}-01` : entry.datePublished,
      datePublished: entry.datePublished,
    }),
    faqs.length
      ? faqSchema(faqs.map((f) => ({ question: stripCitations(f.question), answer: stripCitations(f.answer) })))
      : null,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Is this real?", path: "/check" },
      { name: entry.title, path },
    ]),
  ].filter(Boolean)

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <VerdictArticle entry={entry} url={`${SITE.url}${path}`} />
        </main>
        <Footer />
      </div>
    </>
  )
}
