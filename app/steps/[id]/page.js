import { notFound } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import StepArticle from "@/app/components/steps/StepArticle"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { articleSchema, breadcrumbSchema, howToSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"
import { allStepParams, doItems, getStepAudience, getStepById, stepHref, stepMetaDescription } from "@/lib/steps"

export const dynamicParams = false

export function generateStaticParams() {
  return allStepParams()
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const step = getStepById(id)
  if (!step) return {}
  const path = stepHref(step)
  const title = `${step.title} | ${SITE.name}`
  const meta = libraryMetadata({ title, description: stepMetaDescription(step), path, type: "article" })
  // Point shares at this step's own card (opengraph-image.js beside this file).
  const image = { url: `${path}/opengraph-image`, width: 1200, height: 630, alt: step.title }
  return {
    ...meta,
    openGraph: { ...meta.openGraph, images: [image] },
    twitter: { ...meta.twitter, images: [image.url] },
  }
}

// The schema step name is the item's first sentence; the text is all of it.
function firstSentence(text) {
  const match = text.match(/^.+?[.!?](?=\s|$)/)
  const sentence = (match ? match[0] : text).trim()
  return sentence.length > 110 ? `${sentence.slice(0, 107).trimEnd()}...` : sentence
}

export default async function StepPage({ params }) {
  const { id } = await params
  const step = getStepById(id)
  const audience = getStepAudience(id)
  if (!step || !audience) notFound()

  const path = stepHref(step)
  const description = stepMetaDescription(step)
  const items = doItems(step, audience).map((item) => {
    const text = item.condition ? `${item.condition}: ${item.text}` : item.text
    return { name: firstSentence(text), text }
  })
  if (step.check) items.push({ name: "Check it worked", text: step.check })

  const schemas = [
    {
      ...howToSchema({ name: step.title, description, steps: items }),
      ...(step.minutes ? { totalTime: `PT${step.minutes}M` } : {}),
    },
    articleSchema({ title: step.title, description, slug: path }),
    breadcrumbSchema([
      { name: SITE.name, path: "/" },
      { name: "Steps", path: "/steps" },
      { name: step.title, path },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <StepArticle step={step} audience={audience} />
        </main>
        <Footer />
      </div>
    </>
  )
}
