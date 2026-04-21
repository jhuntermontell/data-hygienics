import { notFound } from "next/navigation"
import { threats, getThreatBySlug } from "@/lib/threats"
import ThreatDetailClient from "./ThreatDetailClient"
import SchemaScript from "@/app/components/SchemaScript"
import { articleSchema, faqSchema } from "@/lib/schema"

export function generateStaticParams() {
  return threats.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const threat = getThreatBySlug(slug)
  if (!threat) return {}

  return {
    title: threat.metaTitle,
    description: threat.metaDescription,
    alternates: {
      canonical: `https://datahygienics.com/threats/${slug}`,
    },
  }
}

export default async function ThreatDetailPage({ params }) {
  const { slug } = await params
  const threat = getThreatBySlug(slug)

  if (!threat) {
    notFound()
  }

  // Per-threat review date stored as YYYY-MM; expand to ISO date (day 01
  // of the review month) for schema.org dateModified.
  const reviewDate = `${threat.lastReviewed}-01`

  const schemas = [
    articleSchema({
      title: threat.title,
      description: threat.metaDescription,
      slug: `/threats/${slug}`,
      lastReviewed: reviewDate,
      datePublished: threat.datePublished,
    }),
    faqSchema(threat.faqs),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <ThreatDetailClient threat={threat} />
    </>
  )
}
