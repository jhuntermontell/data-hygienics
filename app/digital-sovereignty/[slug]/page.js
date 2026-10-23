import { notFound } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import ExplainerArticle from "@/app/components/ExplainerArticle"
import { entryMetadata, entryDescription } from "@/app/components/libraryHelpers"
import { articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"
import { explainers, getExplainerBySlug } from "@/lib/sovereignty"
import { hrefFor, stripCitations } from "@/lib/content"

export const dynamicParams = false

export function generateStaticParams() {
  return explainers.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const entry = getExplainerBySlug(slug)
  if (!entry) return {}
  return entryMetadata(entry)
}

export default async function ExplainerPage({ params }) {
  const { slug } = await params
  const entry = getExplainerBySlug(slug)
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
      { name: "Digital Sovereignty", path: "/digital-sovereignty" },
      { name: entry.title, path },
    ]),
  ].filter(Boolean)

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="library-page max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <ExplainerArticle entry={entry} />
        </main>
        <Footer />
      </div>
    </>
  )
}
