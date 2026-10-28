// The fold rule: a hairline that opens with a short teal segment ending in a
// 30-degree notch, the angle of the mark's faces. Decorative, so it is hidden
// from assistive tech. `draw` animates the segment once on entry unless the
// visitor prefers reduced motion (styles in app/globals.css).
export default function FoldRule({ tone = "day", draw = false, className = "" }) {
  return <hr aria-hidden="true" data-tone={tone} data-draw={draw ? "" : undefined} className={`fold-rule ${className}`} />
}
