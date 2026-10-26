// Social card for the sovereignty hub (lib/og.js), from the hub's own copy.
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"
import { ogLine } from "@/app/components/libraryHelpers"
import { getHub } from "@/lib/hubs"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = "Data Hygienics: Digital sovereignty"

export default function Image() {
  const hub = getHub("sovereignty")
  return ogImage({ eyebrow: hub.eyebrow, title: hub.title, line: ogLine(hub.promise?.[0] || hub.metaDescription), tone: "sovereignty" })
}
