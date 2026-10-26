import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"
import { getStepAudience, getStepById, stepSummary } from "@/lib/steps"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = "A Clear Path step from Data Hygienics"

export default async function Image({ params }) {
  const { id } = await params
  const step = getStepById(id)
  return ogImage({
    eyebrow: "Clear Path step",
    title: step?.title || "Clear Path",
    line: step ? stepSummary(step) : "Your security steps, in order.",
    tone: getStepAudience(id) || "home",
  })
}
