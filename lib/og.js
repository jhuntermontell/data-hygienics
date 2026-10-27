// Open Graph image factory. Every per-route opengraph-image.js calls
// ogImage({ eyebrow, title, line }) and gets a 1200x630 PNG on the night
// surface (design/brand-book/personality.md), with the white mark and the
// outlined wordmark, so shared links look the same everywhere. Rendering is
// satori (next/og): a flexbox subset of CSS, so the mark and wordmark go in
// as SVG data URIs built from the same geometry as BrandMark and the PDFs.
// The wordmark is drawn from its outlines (lib/brand/wordmark.js), never
// retyped.
import { ImageResponse } from "next/og"
import OgCard from "@/app/components/og/OgCard"
import { MARK } from "@/lib/brand/mark"
import { WORDMARK } from "@/lib/brand/wordmark"

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

const dataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

// The one-color white mark, for dark backgrounds (brand book): the ring with
// the clear center and the clean cut removed.
function whiteMarkSvg() {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK.viewBox}">` +
    `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">` +
    `<rect width="400" height="400" fill="black"/><path d="${MARK.ring}" fill="white"/>` +
    `<path d="${MARK.core}" fill="black"/><path d="${MARK.cut}" fill="black"/></mask></defs>` +
    `<rect width="400" height="400" fill="#FFFFFF" mask="url(#m)"/></svg>`
  )
}

function whiteWordmarkSvg() {
  const glyphs = WORDMARK.glyphs
    .map((g) => `<path d="${g.d}" fill="#FFFFFF" transform="translate(${g.x} ${g.y}) scale(${g.scale} ${-g.scale})"/>`)
    .join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORDMARK.width} ${WORDMARK.height}">${glyphs}</svg>`
}

export const MARK_WHITE_URI = dataUri(whiteMarkSvg())
export const WORDMARK_WHITE_URI = dataUri(whiteWordmarkSvg())
export const WORDMARK_RATIO = WORDMARK.width / WORDMARK.height

export function ogImage({ eyebrow, title, line, tone = "home" }) {
  return new ImageResponse(
    <OgCard eyebrow={eyebrow} title={title} line={line} tone={tone} mark={MARK_WHITE_URI} wordmark={WORDMARK_WHITE_URI} wordmarkRatio={WORDMARK_RATIO} />,
    OG_SIZE
  )
}
