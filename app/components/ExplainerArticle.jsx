import Link from "next/link"
import { CircleHelp, House, Briefcase, CircleCheck, Compass, ArrowRight, BookOpen } from "lucide-react"
import ArticleHeader from "./ArticleHeader"
import { TldrBlock, Paragraphs, SectionHeading, FaqSection, asParagraphs } from "./ArticleParts"
import AudienceBadge from "./AudienceBadge"
import CitedText from "./CitedText"
import SourceList from "./SourceList"
import RelatedContent from "./RelatedContent"
import { knownCitations } from "./libraryHelpers"
import { citationOrder, formatMonth } from "@/lib/content"
import { resolveRelated } from "@/lib/library"
import { getGuideBySlug } from "@/lib/guides"

const ACTION_GROUPS = {
  home: { title: "At home", icon: House },
  business: { title: "At work", icon: Briefcase },
}

const CONFIDENCE = {
  high: { label: "High", bars: 3 },
  medium: { label: "Medium", bars: 2 },
  low: { label: "Low", bars: 1 },
}

// Renders a Digital Sovereignty explainer in CITATION_FIELD_ORDER: tldr,
// shortAnswer, sections, actions, stance; then FAQs, related and sources.
export default function ExplainerArticle({ entry }) {
  const { ids, number } = knownCitations(citationOrder(entry))
  const related = resolveRelated(entry)
  const sections = (entry.sections || []).filter((s) => s?.heading || asParagraphs(s?.paragraphs).length)
  // Keep the authored key order: citationOrder walks actions the same way.
  const actionGroups = Object.entries(entry.actions || {})
    .filter(([key, list]) => ACTION_GROUPS[key] && Array.isArray(list) && list.length > 0)
    .map(([key, list]) => [
      key,
      list
        .map((a) => (typeof a === "string" ? { guideSlug: a } : a))
        .filter((a) => a && (a.label || a.detail || (a.guideSlug && getGuideBySlug(a.guideSlug)))),
    ])
    .filter(([, list]) => list.length > 0)
  const stance = entry.stance && asParagraphs(entry.stance.position).length ? entry.stance : null
  const actionCount = actionGroups.reduce((total, [, list]) => total + list.length, 0)
  const actionScope = actionGroups.map(([key]) => ACTION_GROUPS[key].title.toLowerCase()).join(" and ")

  return (
    <article>
      <ArticleHeader
        backHref="/digital-sovereignty"
        backLabel="Digital Sovereignty"
        eyebrow={entry.question}
        eyebrowIcon={CircleHelp}
        eyebrowVariant="question"
        eyebrowClassName="text-[#0F766E]"
        title={entry.title}
        chips={
          <>
            <span className="inline-flex items-center readout-label text-[#64748B] mr-1">
              Explainer
            </span>
            {(entry.audience || []).map((a) => (
              <AudienceBadge key={a} audience={a} />
            ))}
          </>
        }
        datePublished={entry.datePublished}
        lastReviewed={entry.lastReviewed}
      />

      <TldrBlock text={entry.tldr} number={number} />

      {actionCount > 0 ? (
        <nav aria-label="Jump to what you can do" className="-mt-2 mb-10">
          <a
            href="#what-you-can-do"
            className="flex sm:inline-flex sm:min-w-[20rem] items-center gap-3 border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#334155] hover:border-[#0F172A] motion-safe:transition-colors"
          >
            <CircleCheck className="w-5 h-5 shrink-0 text-[#047857]" aria-hidden="true" />
            <span>
              What you can do
              <span className="block text-xs font-normal text-[#047857]">
                {actionCount} {actionCount === 1 ? "step" : "steps"}, {actionScope}
              </span>
            </span>
            <ArrowRight className="w-4 h-4 ml-auto shrink-0" aria-hidden="true" />
          </a>
        </nav>
      ) : null}

      {asParagraphs(entry.shortAnswer).length > 0 ? (
        <section aria-labelledby="short-answer" className="mt-8 border border-[#0F766E]/20 bg-[#F0FDFA] p-5 sm:p-7">
          <h2 id="short-answer" className="text-xs font-display font-semibold tracking-[0.12em] uppercase text-[#0F766E] mb-2">
            The short answer
          </h2>
          <Paragraphs
            value={entry.shortAnswer}
            number={number}
            className="text-[#134E4A] text-lg sm:text-xl leading-relaxed font-medium mb-3 last:mb-0"
          />
        </section>
      ) : null}

      {sections.map((section, i) => (
        <section key={i} aria-labelledby={`section-${i + 1}`} className="mt-12">
          <SectionHeading id={`section-${i + 1}`}>
            <CitedText text={section.heading} number={number} />
          </SectionHeading>
          <Paragraphs value={section.paragraphs} number={number} />
        </section>
      ))}

      {actionGroups.length > 0 ? (
        <section id="what-you-can-do" aria-labelledby="what-you-can-do-heading" className="mt-12 scroll-mt-28">
          <SectionHeading id="what-you-can-do-heading" icon={CircleCheck} iconClassName="text-[#047857]">
            What you can do
          </SectionHeading>
          <div className={`grid gap-4 ${actionGroups.length > 1 ? "md:grid-cols-2" : ""}`}>
            {actionGroups.map(([key, list]) => {
              const { title, icon: Icon } = ACTION_GROUPS[key]
              return (
                <div key={key} className="border border-[#E2E8F0] bg-white p-5 sm:p-6">
                  <h3 className="flex items-center gap-2 text-base font-display font-semibold text-[#0F172A] mb-4">
                    <Icon className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                    {title}
                  </h3>
                  <ul className="space-y-4">
                    {list.map((action, j) => {
                      const guide = action.guideSlug ? getGuideBySlug(action.guideSlug) : null
                      if (!action.label && !action.detail && !guide) return null
                      return (
                        <li key={j} className="flex gap-3">
                          <CircleCheck className="w-5 h-5 shrink-0 text-[#0F766E] mt-0.5" aria-hidden="true" />
                          <div className="min-w-0">
                            {action.label ? (
                              <p className="font-semibold text-[#0F172A] leading-snug">
                                <CitedText text={action.label} number={number} />
                              </p>
                            ) : null}
                            <Paragraphs
                              value={action.detail}
                              number={number}
                              className="text-[#475569] text-[15px] leading-relaxed mt-1"
                            />
                            {guide ? (
                              <Link
                                href={`/guides/${guide.slug}`}
                                className="mt-2 inline-flex items-start gap-1.5 text-sm font-medium text-[#1D4ED8] hover:text-[#1E40AF]"
                              >
                                <BookOpen className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                                <span>
                                  <span className="text-[#475569] font-normal">Guide: </span>
                                  {guide.title}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0" aria-hidden="true" />
                              </Link>
                            ) : null}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {stance ? <StanceCard stance={stance} number={number} /> : null}

      <FaqSection faqs={entry.faqs} />
      <RelatedContent related={related} />
      <SourceList ids={ids} />
    </article>
  )
}

function StanceCard({ stance, number }) {
  const confidence = CONFIDENCE[stance.confidence]
  return (
    <section
      aria-labelledby="where-we-stand"
      className="mt-12 border-2 border-[#1D4ED8]/15 bg-white p-5 sm:p-8"
    >
      <p className="flex items-center gap-2 readout-label text-[#1D4ED8] mb-2">
        <Compass className="w-4 h-4" aria-hidden="true" />
        Our stance
      </p>
      <h2 id="where-we-stand" className="text-xl sm:text-2xl font-display font-semibold text-[#0F172A] tracking-[-0.02em] leading-snug mb-3">
        Where we stand
      </h2>
      <Paragraphs
        value={stance.position}
        number={number}
        className="text-[#0F172A] text-lg leading-relaxed mb-3 last:mb-0"
      />

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 border-t border-[#F1F5F9] pt-5">
        {confidence ? (
          <div>
            <dt className="readout-label text-[#64748B] mb-1">Confidence</dt>
            <dd className="flex items-center gap-2 font-semibold text-[#0F172A]">
              <span className="flex items-end gap-0.5" aria-hidden="true">
                {[1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className={`w-1.5 ${bar <= confidence.bars ? "bg-[#1D4ED8]" : "bg-[#E2E8F0]"}`}
                    style={{ height: `${6 + bar * 4}px` }}
                  />
                ))}
              </span>
              {confidence.label}
            </dd>
          </div>
        ) : null}
        {stance.lastRevisited ? (
          <div>
            <dt className="readout-label text-[#64748B] mb-1">Last revisited</dt>
            <dd className="font-semibold text-[#0F172A]">
              <time dateTime={stance.lastRevisited}>{formatMonth(stance.lastRevisited)}</time>
            </dd>
          </div>
        ) : null}
        {asParagraphs(stance.revisitWhen).length > 0 ? (
          <div className="sm:col-span-2">
            <dt className="readout-label text-[#64748B] mb-1">
              We&apos;ll revisit this when
            </dt>
            <dd>
              <Paragraphs
                value={stance.revisitWhen}
                number={number}
                className="text-[#334155] text-[15px] leading-relaxed mb-2 last:mb-0"
              />
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  )
}
