import Link from "next/link"
import { ArrowLeft, ArrowRight, ListOrdered, Megaphone, MessageSquareQuote, Route, Info, ChartColumn, ExternalLink } from "lucide-react"
import { Paragraphs, SectionHeading, FaqSection } from "@/app/components/ArticleParts"
import AuthorByline from "@/app/components/AuthorByline"
import CitedText from "@/app/components/CitedText"
import SourceList from "@/app/components/SourceList"
import RelatedContent from "@/app/components/RelatedContent"
import { knownCitations } from "@/app/components/libraryHelpers"
import ShareCard, { PathChipLink } from "./ShareCard"
import { citationOrder, formatDate, formatMonth } from "@/lib/content"
import { resolveRelated } from "@/lib/library"
import { getSource } from "@/lib/sources"
import FoldRule from "@/app/components/brand/FoldRule"

// One verdict page (/check/<slug>), in the order the marketing plan sets:
// the verdict, the next two minutes, who to tell, say this, the share card,
// the Path chip; then, below the fold, why, the figures, questions and
// sources. Nothing above "Why this works" carries a figure (the validator
// enforces it). Every section is a direct child of .verdict-article so the
// print stylesheet can print the share card alone.

const TONES = {
  home: {
    accent: "text-[#0F766E]",
    border: "border-[#0F8F83]/35",
    soft: "bg-[#F0FDFA]",
    number: "bg-[#0F766E]",
    chip: "bg-[#0F766E] hover:bg-[#115E59] focus-visible:outline-[#0F766E]",
  },
  business: {
    accent: "text-[#1D4ED8]",
    border: "border-[#1D4ED8]/30",
    soft: "bg-[#EFF6FF]",
    number: "bg-[#1D4ED8]",
    chip: "bg-[#1D4ED8] hover:bg-[#1E40AF] focus-visible:outline-[#1D4ED8]",
  },
}

const PATH_COPY = {
  home: "Your free Clear Path starts from this and puts the rest of your digital life in order, one small step at a time. No account needed.",
  business: "Your free Clear Path puts your business's security in order, one small step at a time. No account needed.",
}

function verdictTone(entry) {
  const audience = entry?.audience || []
  return entry?.pathChip?.audience === "business" || (audience.length && audience.every((a) => a === "business")) ? "business" : "home"
}

export default function VerdictArticle({ entry, url }) {
  const { ids, number } = knownCitations(citationOrder(entry))
  const related = resolveRelated(entry)
  const tone = verdictTone(entry)
  const t = TONES[tone]
  const steps = (entry.nextTwoMinutes || []).filter((s) => typeof s === "string" && s.trim())
  const tell = (entry.whoToTell || []).filter((item) => item?.label)
  const stats = (entry.stats || []).filter((s) => s?.figure)
  const chip = entry.pathChip
  const chipHref = chip ? `/path/${chip.audience}?start=${encodeURIComponent(chip.start)}` : null

  return (
    <article className="verdict-article">
      <header className="mb-6">
        <Link
          href="/check"
          className="readout inline-flex items-center gap-1.5 text-[#475569] hover:text-[#0F172A] motion-safe:transition-colors mb-7"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Threat Check: all checks
        </Link>
        <FoldRule draw className="mb-6" />
        <p className="readout text-day-readout mb-4">
          Verdict · {tone === "business" ? "At work" : "At home"} · Reviewed {formatMonth(entry.lastReviewed)} · {ids.length} {ids.length === 1 ? "source" : "sources"}
        </p>
        <h1 className="font-display font-semibold text-[2.25rem] sm:text-[3rem] md:text-[3.25rem] text-[#0F172A] leading-[1.04] tracking-[-0.03em] text-balance">
          {entry.title}
        </h1>
      </header>

      <section aria-label="The verdict" className="border-t-2 border-[#0F172A] pt-6">
        <p className="text-[1.25rem] sm:text-[1.375rem] font-medium text-[#0F172A] leading-normal text-pretty">{entry.verdict}</p>
      </section>

      {steps.length ? (
        <section aria-labelledby="next-two-minutes" className="mt-10">
          <SectionHeading id="next-two-minutes" icon={ListOrdered} iconClassName={t.accent}>
            The next two minutes
          </SectionHeading>
          <ol className="list-none p-0 m-0 border-t border-[#E2E8F0]">
            {steps.map((step, i) => (
              <li key={i} className="grid grid-cols-[2.75rem_1fr] gap-x-2 py-4 border-b border-[#E2E8F0]">
                <span className={`readout pt-1 ${t.accent}`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[#0F172A] text-base sm:text-[17px] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {tell.length ? (
        <section aria-labelledby="who-to-tell" className="mt-10">
          <SectionHeading id="who-to-tell" icon={Megaphone} iconClassName={t.accent}>
            Who to tell
          </SectionHeading>
          <ul className="border-t border-[#E2E8F0] divide-y divide-[#E2E8F0] border-b list-none p-0 m-0">
            {tell.map((item, i) => (
              <li key={i} className="py-4">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-2"
                  >
                    {item.label}
                    {item.href.startsWith("http") ? <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> : null}
                  </a>
                ) : (
                  <span className="font-semibold text-[#0F172A]">{item.label}</span>
                )}
                {item.detail ? <p className="text-[#475569] text-[15px] leading-relaxed mt-1">{item.detail}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.sayThis ? (
        <section aria-labelledby="say-this" className="mt-10">
          <SectionHeading id="say-this" icon={MessageSquareQuote} iconClassName={t.accent}>
            Say this
          </SectionHeading>
          <blockquote className="border-l-[3px] border-[#0F8F83] bg-[#F8FAFC] px-5 py-5 sm:px-7 m-0">
            <p className="font-display font-semibold text-[1.25rem] sm:text-[1.5rem] tracking-[-0.01em] text-[#0F172A] leading-snug">&ldquo;{entry.sayThis}&rdquo;</p>
            <p className="mt-2 text-sm text-[#475569]">One line to repeat, so the whole household (or team) answers the same way.</p>
          </blockquote>
        </section>
      ) : null}

      <ShareCard title={entry.title} chip={entry.chip} sayThis={entry.sayThis} url={url} tone={tone} />

      {chip && chipHref ? (
        <section aria-labelledby="path-chip" className="mt-12 border border-[#E2E8F0] bg-white p-5 sm:p-7">
          <p className="readout-label text-day-readout mb-2">The step that stops the next one</p>
          <h2 id="path-chip" className="flex items-center gap-2.5 font-display font-semibold text-[1.5rem] sm:text-[1.75rem] text-[#0F172A] tracking-[-0.02em]">
            <Route className={`w-5 h-5 shrink-0 ${t.accent}`} aria-hidden="true" />
            Make sure it can&apos;t happen again
          </h2>
          <p className="text-[#475569] text-[15px] leading-relaxed mt-2 mb-5">{PATH_COPY[chip.audience] || PATH_COPY.home}</p>
          <PathChipLink
            href={chipHref}
            audience={chip.audience}
            value={chip.start}
            from={`verdict:${entry.slug}`}
            className={`inline-flex items-center gap-2 text-white text-[15px] font-semibold px-6 h-12 motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.chip}`}
          >
            {chip.label}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </PathChipLink>
        </section>
      ) : null}

      <section aria-labelledby="why-this-works" className="mt-14 pt-10 border-t border-[#E2E8F0]">
        <SectionHeading id="why-this-works" icon={Info} description="The figures behind the verdict, each with a dated source.">
          Why this works
        </SectionHeading>
        <Paragraphs value={entry.why} number={number} />
      </section>

      {stats.length ? (
        <section aria-labelledby="by-the-numbers" className="mt-10">
          <SectionHeading id="by-the-numbers" icon={ChartColumn}>
            By the numbers
          </SectionHeading>
          <ul className="grid gap-4 sm:grid-cols-2 list-none p-0">
            {stats.map((stat, i) => {
              const source = getSource(stat.sourceId)
              return (
                <li key={i} className="flex flex-col border-t-2 border-[#0F172A] pt-4">
                  <p className="font-display text-[2.25rem] font-semibold text-[#0F172A] tracking-[-0.03em] leading-tight break-words">
                    {stat.figure}
                    {stat.sourceId ? (
                      <span className="text-base font-normal">
                        <CitedText text={`[^${stat.sourceId}]`} number={number} />
                      </span>
                    ) : null}
                  </p>
                  {stat.text ? <p className="text-[#475569] text-[15px] leading-relaxed mt-2">{stat.text}</p> : null}
                  {source ? (
                    <p className="readout mt-auto pt-3 text-day-readout break-words">
                      {source.publisher}
                      {stat.locator ? <>, {stat.locator}</> : null}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <FaqSection faqs={entry.faqs} />
      <RelatedContent related={related} />
      <SourceList ids={ids} />

      <footer className="mt-10 pt-6 border-t border-[#E2E8F0]">
        <p className="readout text-day-readout mb-1">
          Reviewed {formatMonth(entry.lastReviewed)}
          {entry.datePublished ? (
            <>
              {" "}
              &middot; Published <time dateTime={entry.datePublished}>{formatDate(entry.datePublished)}</time>
            </>
          ) : null}
        </p>
        <AuthorByline lastReviewed={formatMonth(entry.lastReviewed)} />
      </footer>
    </article>
  )
}
