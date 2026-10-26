// Open Graph image factory. Every per-route opengraph-image.js calls
// ogImage({ eyebrow, title, line }) and gets a 1200x630 PNG with the brand
// mark, so shared links look the same everywhere. Rendering is satori
// (next/og): a flexbox subset of CSS, no masks, so the mark goes in as an
// SVG data URI built from the same geometry as BrandMark.
import { ImageResponse } from "next/og"
import OgCard from "@/app/components/og/OgCard"
import { BRAND_COLORS, MARK } from "@/lib/brand/mark"

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

function markSvg() {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK.viewBox}">` +
    `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">` +
    `<rect width="400" height="400" fill="black"/><path d="${MARK.ring}" fill="white"/>` +
    `<path d="${MARK.core}" fill="black"/><path d="${MARK.cut}" fill="black"/></mask></defs>` +
    `<g mask="url(#m)"><path d="${MARK.faces.teal}" fill="${BRAND_COLORS.teal}"/>` +
    `<path d="${MARK.faces.cobalt}" fill="${BRAND_COLORS.cobalt}"/>` +
    `<path d="${MARK.faces.navy}" fill="${BRAND_COLORS.navy}"/></g></svg>`
  )
}

export const MARK_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(markSvg())}`

export function ogImage({ eyebrow, title, line, tone = "home" }) {
  return new ImageResponse(<OgCard eyebrow={eyebrow} title={title} line={line} tone={tone} mark={MARK_DATA_URI} />, OG_SIZE)
}
