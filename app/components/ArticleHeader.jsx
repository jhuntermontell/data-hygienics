import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AuthorByline from "./AuthorByline"
import { formatDate, formatMonth } from "@/lib/content"

// Header for library articles: back link, eyebrow, the page's only H1,
// chips, and the byline with published and last-reviewed dates.
export default function ArticleHeader({
  backHref,
  backLabel,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  eyebrowVariant = "label",
  eyebrowClassName = "text-[#1D4ED8]",
  title,
  chips,
  datePublished,
  lastReviewed,
  showFullByline = false,
}) {
  const eyebrowStyle =
    eyebrowVariant === "question"
      ? "text-base sm:text-lg font-semibold italic"
      : "text-xs font-semibold tracking-[0.12em] uppercase"

  return (
    <header className="mb-2">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#0F172A] motion-safe:transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}

      {eyebrow ? (
        <p className={`flex items-start gap-2 mb-3 ${eyebrowStyle} ${eyebrowClassName}`}>
          {EyebrowIcon ? <EyebrowIcon className="w-4 h-4 mt-[0.2em] shrink-0" aria-hidden="true" /> : null}
          <span>{eyebrow}</span>
        </p>
      ) : null}

      <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-[#0F172A] leading-[1.1] tracking-tight text-balance mb-5">
        {title}
      </h1>

      {chips ? <div className="flex flex-wrap items-center gap-2 mb-4">{chips}</div> : null}

      {datePublished ? (
        <p className="text-sm text-[#64748B] mb-0">
          Published <time dateTime={datePublished}>{formatDate(datePublished)}</time>
        </p>
      ) : null}
      <AuthorByline showFull={showFullByline} lastReviewed={formatMonth(lastReviewed)} />
    </header>
  )
}
