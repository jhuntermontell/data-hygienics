// Social card for one verdict (lib/og.js): the message type as a question,
// and the verdict's if-then line instead of a summary. No figures on the
// card. A missing or draft verdict gets the checker's own card.
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"
import { getVerdictBySlug } from "@/lib/verdicts"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = "Is this real? A two-minute answer from Data Hygienics"

export default async function Image({ params }) {
  const { slug } = await params
  const entry = getVerdictBySlug(slug)
  if (!entry) {
    return ogImage({
      eyebrow: "Is this real?",
      title: "Something just happened?",
      line: "A calm, two-minute answer: what to do, who to tell, and one rule to keep.",
      tone: "home",
    })
  }
  const audience = entry.audience || []
  const business = entry.pathChip?.audience === "business" || (audience.length > 0 && audience.every((a) => a === "business"))
  return ogImage({
    eyebrow: "Is this real?",
    title: `${entry.chip}?`,
    line: entry.sayThis,
    tone: business ? "business" : "home",
  })
}
