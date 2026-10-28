import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AuthorByline from "./AuthorByline"
import FoldRule from "./brand/FoldRule"
import { formatDate, formatMonth } from "@/lib/content"

// Header for library articles on the day surface: back link, a fold rule,
// the eyebrow as a readout label (or, for explainers, the question in the
// display face), the page's only H1 in the display face, chips, then the
// published date and byline as readouts.
export default function ArticleHeader({
  backHref,
  backLabel,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  eyebrowVariant = "label",
  eyebrowClassName = "text-[#64748B]",
  title,
  chips,
  datePublished,
  lastReviewed,
  showFullByline = false,
}) {
  const eyebrowStyle =
    eyebrowVariant === "question"
      ? "font-display font-medium text-[1.0625rem] sm:text-[1.1875rem] tracking-[-0.005em]"
      : "readout-label"

  return (
    <header className="mb-2">
      {backHref ? (
        <Link
          href={backHref}
          className="readout inline-flex items-center gap-1.5 text-[#475569] hover:text-[#0F172A] motion-safe:transition-colors mb-7"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}

      <FoldRule draw className="mb-6" />

      {eyebrow ? (
        <p className={`flex items-start gap-2 mb-4 ${eyebrowStyle} ${eyebrowClassName}`}>
          {EyebrowIcon ? <EyebrowIcon className="w-4 h-4 mt-[0.1em] shrink-0" aria-hidden="true" /> : null}
          <span>{eyebrow}</span>
        </p>
      ) : null}

      <h1 className="font-display font-semibold text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] text-[#0F172A] leading-[1.04] tracking-[-0.03em] text-balance mb-6">
        {title}
      </h1>

      {chips ? <div className="flex flex-wrap items-center gap-2 mb-5">{chips}</div> : null}

      {datePublished ? (
        <p className="readout text-day-readout mb-0">
          Published <time dateTime={datePublished}>{formatDate(datePublished)}</time>
        </p>
      ) : null}
      <AuthorByline showFull={showFullByline} lastReviewed={formatMonth(lastReviewed)} />
    </header>
  )
}
