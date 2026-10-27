import { ListChecks, Clock, Gauge, ListOrdered, CircleCheck, Lightbulb, Info } from "lucide-react"
import ArticleHeader from "./ArticleHeader"
import { TldrBlock, Paragraphs, SectionHeading, FaqSection, MetaChip, asParagraphs } from "./ArticleParts"
import AudienceBadge from "./AudienceBadge"
import CitedText from "./CitedText"
import SourceList from "./SourceList"
import RelatedContent from "./RelatedContent"
import { knownCitations } from "./libraryHelpers"
import { citationOrder } from "@/lib/content"
import { resolveRelated } from "@/lib/library"

const DIFFICULTY_LABELS = { easy: "Easy", moderate: "Moderate" }

// Renders a hygiene guide in CITATION_FIELD_ORDER: tldr, why, steps
// (title, detail, verify), limits; then FAQs, related and sources.
export default function GuideArticle({ entry }) {
  const { ids, number } = knownCitations(citationOrder(entry))
  const related = resolveRelated(entry)
  const steps = (entry.steps || []).filter((step) => step?.title || step?.detail)
  const limits = asParagraphs(entry.limits)

  return (
    <article>
      <ArticleHeader
        backHref="/guides"
        backLabel="All guides"
        eyebrow="Guide"
        eyebrowIcon={ListChecks}
        eyebrowClassName="text-[#047857]"
        title={entry.title}
        chips={
          <>
            {(entry.audience || []).map((a) => (
              <AudienceBadge key={a} audience={a} />
            ))}
            {entry.timeToComplete ? (
              <MetaChip icon={Clock} srLabel="Time to complete">
                {entry.timeToComplete}
              </MetaChip>
            ) : null}
            {DIFFICULTY_LABELS[entry.difficulty] ? (
              <MetaChip icon={Gauge} srLabel="Difficulty">
                {DIFFICULTY_LABELS[entry.difficulty]}
              </MetaChip>
            ) : null}
            {steps.length > 0 ? (
              <MetaChip icon={ListOrdered}>
                {steps.length} {steps.length === 1 ? "step" : "steps"}
              </MetaChip>
            ) : null}
          </>
        }
        datePublished={entry.datePublished}
        lastReviewed={entry.lastReviewed}
      />

      <TldrBlock text={entry.tldr} number={number} />

      {asParagraphs(entry.why).length > 0 ? (
        <section aria-labelledby="why-it-matters" className="mt-10">
          <SectionHeading id="why-it-matters" icon={Lightbulb}>
            Why it&apos;s worth doing
          </SectionHeading>
          <Paragraphs value={entry.why} number={number} />
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section aria-labelledby="steps-heading" className="mt-12">
          <SectionHeading id="steps-heading" icon={ListOrdered} description="Each step ends with a quick check so you know it worked.">
            Step by step
          </SectionHeading>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} id={`step-${i + 1}`} className="border border-[#E2E8F0] bg-white p-5 sm:p-6">
                <div className="flex gap-3 sm:gap-4">
                  <span
                    className="shrink-0 w-9 h-9 rounded-full bg-[#0F172A] text-white text-sm font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    {step.title ? (
                      <h3 className="text-lg font-display font-semibold text-[#0F172A] leading-snug mb-2">
                        <span className="sr-only">Step {i + 1}: </span>
                        <CitedText text={step.title} number={number} />
                      </h3>
                    ) : null}
                    <Paragraphs
                      value={step.detail}
                      number={number}
                      className="text-[#334155] text-[15px] sm:text-base leading-relaxed mb-3 last:mb-0"
                    />
                    {asParagraphs(step.verify).length > 0 ? (
                      <div className="mt-4 flex gap-3 border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <CircleCheck className="w-5 h-5 shrink-0 text-[#047857] mt-0.5" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="readout-label text-[#047857] mb-1">
                            How you know it worked
                          </p>
                          <Paragraphs
                            value={step.verify}
                            number={number}
                            className="text-[#334155] text-[15px] leading-relaxed mb-2 last:mb-0"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {limits.length > 0 ? (
        <section aria-labelledby="limits-heading" className="mt-12">
          <SectionHeading id="limits-heading" icon={Info} description="No single habit covers everything. Here is where this one stops.">
            What this won&apos;t do
          </SectionHeading>
          <ul className="border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6 space-y-3">
            {limits.map((limit, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#334155]">
                <span className="mt-[0.6em] w-1.5 h-1.5 shrink-0 rounded-full bg-[#94A3B8]" aria-hidden="true" />
                <span className="min-w-0">
                  <CitedText text={limit} number={number} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <FaqSection faqs={entry.faqs} />
      <RelatedContent related={related} />
      <SourceList ids={ids} />
    </article>
  )
}
