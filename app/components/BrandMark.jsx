import { useId } from "react"
import { BRAND_COLORS, MARK } from "@/lib/brand/mark"

// Inline Continuous Fold mark. Use it where the mark needs to sit in markup
// (no extra request, crisp at any size); use /logo.svg for the lockup.
// `variant` is "color" (light backgrounds), "white" (navy backgrounds) or
// "navy" (one-color). `micro` switches to the purpose-drawn 16-24 px cut.
// The geometry and colors are fixed by the brand book: don't restyle them.
export default function BrandMark({ variant = "color", micro = false, title, className = "w-10 h-10" }) {
  const id = useId().replace(/:/g, "")
  const mask = `dh-mark-${id}`
  const mono = variant === "white" ? "#FFFFFF" : BRAND_COLORS.navy

  return (
    <svg
      viewBox={MARK.viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
          <rect width="400" height="400" fill="black" />
          <path d={MARK.ring} fill="white" />
          <path d={MARK.core} fill="black" />
          <path d={micro ? MARK.microCut : MARK.cut} fill="black" />
        </mask>
      </defs>
      {variant === "color" ? (
        <g mask={`url(#${mask})`}>
          <path d={MARK.faces.teal} fill={BRAND_COLORS.teal} />
          <path d={MARK.faces.cobalt} fill={BRAND_COLORS.cobalt} />
          <path d={MARK.faces.navy} fill={BRAND_COLORS.navy} />
        </g>
      ) : (
        <rect width="400" height="400" fill={mono} mask={`url(#${mask})`} />
      )}
    </svg>
  )
}
