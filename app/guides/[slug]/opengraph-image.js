// Social card for one guide (lib/og.js). A missing or draft entry gets the
// site card instead of an error.
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"
import { entryOgCard } from "@/app/components/libraryHelpers"
import { getGuideBySlug } from "@/lib/guides"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = "A Data Hygienics guide"

export default async function Image({ params }) {
  const { slug } = await params
  return ogImage(entryOgCard(getGuideBySlug(slug)))
}
