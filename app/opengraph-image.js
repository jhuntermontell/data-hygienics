// The site card (lib/og.js): the default social image for any page that
// doesn't set its own.
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"
import { SITE_OG_CARD } from "@/app/components/libraryHelpers"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = "Data Hygienics: live securely alongside AI"

export default function Image() {
  return ogImage(SITE_OG_CARD)
}
