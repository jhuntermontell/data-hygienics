import { notFound } from "next/navigation"
import { CONTROLS } from "@/lib/controls"
import ControlDetailClient from "./ControlDetailClient"
import SchemaScript from "@/app/components/SchemaScript"
import { articleSchema, faqSchema, howToSchema } from "@/lib/schema"

export async function generateStaticParams() {
  return CONTROLS.map((control) => ({
    slug: control.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const control = CONTROLS.find((c) => c.slug === slug)
  if (!control) return {}

  const description = `${control.name} explained in plain English for small business. Mapped to NIST CSF 2.0 ${control.nistCategory} and CIS Control ${control.cisControl}. Free resource from Data Hygienics.`

  return {
    title: `${control.name} for Small Business | Data Hygienics`,
    description: description.slice(0, 160),
    alternates: {
      canonical: `https://datahygienics.com/controls/${slug}`,
    },
  }
}

export default async function ControlDetailPage({ params }) {
  const { slug } = await params
  const control = CONTROLS.find((c) => c.slug === slug)

  if (!control) {
    notFound()
  }

  const tldr = `${control.name} is a security control mapped to NIST CSF 2.0 ${control.nistCategory} and CIS Control ${control.cisControl} (${control.cisControlName}). It helps small businesses reduce breach risk and meet cyber insurance requirements.`

  const faqs = [
    {
      question: `What is ${control.name}?`,
      answer: control.explanation.split("\n\n")[0],
    },
    {
      question: `Why do cyber insurance providers care about ${control.name}?`,
      answer: control.insuranceRelevance.split("\n\n")[0],
    },
    {
      question: `How do I implement ${control.name} in my small business?`,
      answer: control.implementationSteps
        ? control.implementationSteps.join(" Then, ") + "."
        : `Start by reviewing your current ${control.name.toLowerCase()} practices against the NIST CSF 2.0 and CIS Controls v8 frameworks, then create a written policy and train your team.`,
    },
  ]

  // Per-control review date. Stored on the control in YYYY-MM format so
  // each control can be updated independently. We expand to an ISO date
  // for the article schema (day = 01 of the review month) and pass the
  // raw YYYY-MM string through to the client for the AuthorByline.
  const reviewMonth = control.lastReviewed || "2026-04"
  const reviewDate = `${reviewMonth}-01`
  const reviewDisplay = new Date(reviewDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  const schemas = [
    articleSchema({
      title: `${control.name} for Small Business`,
      description: tldr,
      slug: `/controls/${slug}`,
      lastReviewed: reviewDate,
      datePublished: "2025-06-01",
    }),
    faqSchema(faqs),
  ]

  if (control.implementationSteps?.length > 0) {
    schemas.push(
      howToSchema({
        name: `How to implement ${control.name}`,
        description: `Step-by-step guide to implementing ${control.name} in a small business environment.`,
        steps: control.implementationSteps.map((step, i) => ({
          name: `Step ${i + 1}`,
          text: step,
        })),
      })
    )
  }

  return (
    <>
      <SchemaScript schema={schemas} />
      <ControlDetailClient
        control={control}
        tldr={tldr}
        faqs={faqs}
        reviewDisplay={reviewDisplay}
      />
    </>
  )
}
