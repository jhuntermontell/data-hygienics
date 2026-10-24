import { splitCitations } from "@/lib/content"

// Renders a prose string with [^source-id] markers as numbered superscript
// links into the page's SourceList. `number` comes from citationOrder().
export default function CitedText({ text, number = {} }) {
  return splitCitations(text).map((segment, i) => {
    if (segment.type === "text") return <span key={i}>{segment.value}</span>
    const n = number[segment.id]
    if (!n) return null
    return (
      <sup key={i} className="cite">
        <a href={`#src-${segment.id}`} aria-label={`Source ${n}`}>
          {n}
        </a>
      </sup>
    )
  })
}
