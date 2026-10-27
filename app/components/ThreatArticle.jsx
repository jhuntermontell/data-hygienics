import Link from "next/link"
import {
  ShieldAlert,
  Building2,
  ShieldCheck,
  LifeBuoy,
  CircleCheck,
  DoorOpen,
  BookOpen,
  Wrench,
  Briefcase,
  House,
  ArrowRight,
  ChartColumn,
  ScanEye,
  Info,
} from "lucide-react"
import ArticleHeader from "./ArticleHeader"
import { TldrBlock, Paragraphs, SectionHeading, FaqSection, asParagraphs } from "./ArticleParts"
import AudienceBadge from "./AudienceBadge"
import CitedText from "./CitedText"
import SourceList from "./SourceList"
import RelatedContent from "./RelatedContent"
import { SeverityChip, AiRoleChip } from "./ThreatMeta"
import { knownCitations, sameAudience } from "./libraryHelpers"
import { citationOrder, htmlWithCitations, controlHref } from "@/lib/content"
import { resolveRelated } from "@/lib/library"
import { getGuideBySlug } from "@/lib/guides"
import { getToolsByCategory } from "@/lib/toolkit"
import { getSource } from "@/lib/sources"
import { CONTROLS } from "@/lib/controls"

// Renders a Threat Library entry. kind "threat" lays its structured fields
// out in CITATION_FIELD_ORDER (tldr, whatItIs, stats, howItLooks,
// howItGetsIn, whatStopsIt, ifItHappens) so the superscript numbers rise in
// reading order and match the SourceList. kind "industry-brief" renders
// its hand-authored HTML.
export default function ThreatArticle({ entry }) {
  const { ids, number } = knownCitations(citationOrder(entry))
  const related = resolveRelated(entry)

  return (
    <article>
      {entry.kind === "industry-brief" ? (
        <IndustryBrief entry={entry} number={number} />
      ) : (
        <Threat entry={entry} number={number} />
      )}
      <FaqSection faqs={entry.faqs} />
      <RelatedContent related={related} />
      <SourceList ids={ids} />
    </article>
  )
}

const IR_INCIDENT_LABELS = {
  deepfake_fraud: "deepfake fraud",
  ai_data_exposure: "AI data exposure",
}

const AUDIENCE_ICONS = { home: House, business: Briefcase }

function ItemAudience({ audience, entryAudience }) {
  const list = (audience || []).filter((a) => a === "home" || a === "business")
  // Only label items that apply to part of this entry's audience.
  if (!list.length || sameAudience(list, entryAudience || [])) return null
  return (
    <span className="inline-flex flex-wrap gap-1.5 align-middle">
      {list.map((a) => (
        <AudienceBadge key={a} audience={a} />
      ))}
    </span>
  )
}

function Threat({ entry, number }) {
  const audience = entry.audience || []
  const stats = (entry.stats || []).filter((stat) => stat?.figure)
  const looks = (entry.howItLooks || []).filter((item) => item?.title || item?.scenario)
  const entryPoints = (entry.howItGetsIn || []).filter((point) => typeof point === "string" && point.trim())
  const stops = (entry.whatStopsIt || []).filter((item) => item?.title || item?.detail)
  const steps = (entry.ifItHappens || []).filter((item) => item?.step || item?.detail)
  const toolCategories = getToolsByCategory()
  // Only the incident types the IR Planner defines (see CONTRACT.md).
  const irLabel = Object.hasOwn(IR_INCIDENT_LABELS, entry.irIncidentType || "")
    ? IR_INCIDENT_LABELS[entry.irIncidentType]
    : null

  return (
    <>
      <ArticleHeader
        backHref="/threats"
        backLabel="Threat Library"
        eyebrow="AI-era threat"
        eyebrowIcon={ShieldAlert}
        eyebrowClassName="text-[#64748B]"
        title={entry.title}
        chips={
          <>
            <SeverityChip severity={entry.severity} size="md" />
            <AiRoleChip aiRole={entry.aiRole} size="md" />
            {audience.map((a) => (
              <AudienceBadge key={a} audience={a} />
            ))}
          </>
        }
        datePublished={entry.datePublished}
        lastReviewed={entry.lastReviewed}
      />

      <TldrBlock text={entry.tldr} number={number} />

      {stops.length > 0 || steps.length > 0 ? (
        <nav aria-label="What to do" className="flex flex-col sm:flex-row gap-3 -mt-2 mb-10">
          {stops.length > 0 ? (
            <a
              href="#what-stops-it"
              className="flex-1 inline-flex items-center gap-3 border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#334155] hover:border-[#0F172A] motion-safe:transition-colors"
            >
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#047857]" aria-hidden="true" />
              <span>
                Stop it before it starts
                <span className="block text-xs font-normal text-[#047857]">
                  {stops.length} {stops.length === 1 ? "defense" : "defenses"}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 ml-auto shrink-0" aria-hidden="true" />
            </a>
          ) : null}
          {steps.length > 0 ? (
            <a
              href="#if-it-happens"
              className="flex-1 inline-flex items-center gap-3 border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#475569] hover:border-[#0F172A] motion-safe:transition-colors"
            >
              <LifeBuoy className="w-5 h-5 shrink-0 text-[#0F766E]" aria-hidden="true" />
              <span>
                It already happened
                <span className="block text-xs font-normal text-[#475569]">
                  {steps.length} {steps.length === 1 ? "step" : "steps"}, in order
                </span>
              </span>
              <ArrowRight className="w-4 h-4 ml-auto shrink-0" aria-hidden="true" />
            </a>
          ) : null}
        </nav>
      ) : null}

      {asParagraphs(entry.whatItIs).length > 0 ? (
        <section aria-labelledby="what-it-is" className="mt-10">
          <SectionHeading id="what-it-is" icon={Info}>
            What it is
          </SectionHeading>
          <Paragraphs value={entry.whatItIs} number={number} />
        </section>
      ) : null}

      {stats.length > 0 ? (
        <section aria-labelledby="by-the-numbers" className="mt-12">
          <SectionHeading id="by-the-numbers" icon={ChartColumn}>
            By the numbers
          </SectionHeading>
          <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
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
                  {stat.context ? (
                    <p className="text-[#475569] text-[15px] leading-relaxed mt-2">
                      <CitedText text={stat.context} number={number} />
                    </p>
                  ) : null}
                  {source ? (
                    <p className="mt-auto pt-3 text-xs text-[#64748B] break-words">
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

      {looks.length > 0 ? (
        <section aria-labelledby="what-it-looks-like" className="mt-12">
          <SectionHeading
            id="what-it-looks-like"
            icon={ScanEye}
            description="How this plays out, based on documented cases."
          >
            What it looks like
          </SectionHeading>
          <div className="space-y-4">
            {looks.map((item, i) => {
              const Icon = AUDIENCE_ICONS[item.audience] || ScanEye
              const accent = item.audience === "home" ? "border-l-[#0F766E]" : "border-l-[#1D4ED8]"
              return (
                <div key={i} className={`border border-[#E2E8F0] border-l-4 ${accent} bg-white p-5 sm:p-6`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                    <span className="readout-label text-[#64748B]">
                      {item.audience === "home" ? "At home" : item.audience === "business" ? "At work" : "Scenario"}
                    </span>
                  </div>
                  {item.title ? (
                    <h3 className="text-lg font-display font-semibold text-[#0F172A] leading-snug mb-2">
                      <CitedText text={item.title} number={number} />
                    </h3>
                  ) : null}
                  <Paragraphs
                    value={item.scenario}
                    number={number}
                    className="text-[#334155] text-[15px] sm:text-base leading-relaxed mb-3 last:mb-0"
                  />
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {entryPoints.length > 0 ? (
        <section aria-labelledby="how-it-gets-in" className="mt-12">
          <SectionHeading id="how-it-gets-in" icon={DoorOpen}>
            How it gets in
          </SectionHeading>
          <ul className="grid gap-3 sm:grid-cols-2">
            {entryPoints.map((point, i) => (
              <li
                key={i}
                className="flex gap-3 border border-[#E2E8F0] bg-white p-4 text-[15px] leading-relaxed text-[#334155]"
              >
                <DoorOpen className="w-4 h-4 mt-1 shrink-0 text-[#94A3B8]" aria-hidden="true" />
                <span className="min-w-0">
                  <CitedText text={point} number={number} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stops.length > 0 ? (
        <section aria-labelledby="what-stops-it-heading" id="what-stops-it" className="mt-12">
          <SectionHeading
            id="what-stops-it-heading"
            icon={ShieldCheck}
            iconClassName="text-[#047857]"
            description="Prevention: the habits and settings that break this attack."
          >
            What stops it
          </SectionHeading>
          <ul className="border-t border-b border-[#E2E8F0] divide-y divide-[#E2E8F0]">
            {stops.map((item, i) => {
              const guide = item.guideSlug ? getGuideBySlug(item.guideSlug) : null
              const control = item.controlSlug ? CONTROLS.find((c) => c.slug === item.controlSlug) : null
              const category = item.toolkitCategory
                ? toolCategories.find((c) => c.slug === item.toolkitCategory)
                : null
              return (
                <li key={i} className="flex gap-3 sm:gap-4 p-5 sm:p-6">
                  <CircleCheck className="w-6 h-6 shrink-0 text-[#0F766E]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                      {item.title ? (
                        <h3 className="text-base sm:text-lg font-display font-semibold text-[#0F172A] leading-snug">
                          <CitedText text={item.title} number={number} />
                        </h3>
                      ) : null}
                      <ItemAudience audience={item.audience} entryAudience={entry.audience} />
                    </div>
                    <Paragraphs
                      value={item.detail}
                      number={number}
                      className="text-[#475569] text-[15px] leading-relaxed mb-2 last:mb-0"
                    />
                    {guide || control || category ? (
                      <ul className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-2 text-sm">
                        {guide ? (
                          <li>
                            <Link href={`/guides/${guide.slug}`} className="inline-flex items-start gap-1.5 font-medium text-[#1D4ED8] hover:text-[#1E40AF]">
                              <BookOpen className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                              <span>
                                <span className="text-[#475569] font-normal">Guide: </span>
                                {guide.title}
                              </span>
                            </Link>
                          </li>
                        ) : null}
                        {category ? (
                          <li>
                            <Link href={`/toolkit#cat-${category.slug}`} className="inline-flex items-start gap-1.5 font-medium text-[#1D4ED8] hover:text-[#1E40AF]">
                              <Wrench className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                              <span>
                                <span className="text-[#475569] font-normal">Tools: </span>
                                {category.name}
                              </span>
                            </Link>
                          </li>
                        ) : null}
                        {control ? (
                          <li>
                            <Link href={controlHref(control.slug)} className="inline-flex items-start gap-1.5 font-medium text-[#1D4ED8] hover:text-[#1E40AF]">
                              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                              <span>
                                <span className="text-[#475569] font-normal">Control: </span>
                                {control.name}
                              </span>
                            </Link>
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {steps.length > 0 || irLabel ? (
        <section
          aria-labelledby="if-it-happens-heading"
          id="if-it-happens"
          className="mt-12 border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-8"
        >
          <p className="flex items-center gap-2 readout-label text-[#0F766E] mb-2">
            <LifeBuoy className="w-4 h-4" aria-hidden="true" />
            Response, not prevention
          </p>
          <h2 id="if-it-happens-heading" className="text-xl sm:text-2xl font-display font-semibold text-[#0F172A] tracking-[-0.02em] leading-snug">
            If it already happened
          </h2>
          <p className="text-[#475569] text-sm mt-1.5 mb-6">
            Work through these in order. Moving quickly limits the damage, and there is no shame in reporting it.
          </p>

          {steps.length > 0 ? (
            <ol className="space-y-5">
              {steps.map((item, i) => (
                <li key={i} className="flex gap-3 sm:gap-4">
                  <span
                    className="shrink-0 w-8 h-8 rounded-full bg-[#0F172A] text-white text-sm font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                      {item.step ? (
                        <h3 className="text-base sm:text-lg font-display font-semibold text-[#0F172A] leading-snug">
                          <CitedText text={item.step} number={number} />
                        </h3>
                      ) : null}
                      <ItemAudience audience={item.audience} entryAudience={entry.audience} />
                    </div>
                    <Paragraphs
                      value={item.detail}
                      number={number}
                      className="text-[#475569] text-[15px] leading-relaxed mb-2 last:mb-0"
                    />
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          {irLabel ? (
            <div className="mt-6 flex gap-3 border border-[#1D4ED8]/20 bg-white p-4 sm:p-5">
              <Briefcase className="w-5 h-5 shrink-0 text-[#1D4ED8] mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold text-[#0F172A]">For businesses with an incident plan</p>
                <p className="text-sm text-[#475569] mt-1">
                  The Incident Response Planner has a step-by-step playbook for {irLabel} incidents, built around
                  your saved plan. Part of our paid business tools.
                </p>
                <Link
                  href={`/tools/ir-plan/incident/${entry.irIncidentType}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                >
                  Open the {irLabel} playbook
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  )
}

function IndustryBrief({ entry, number }) {
  const cta = typeof entry.ctaLink === "string" && entry.ctaLink.startsWith("/") && !entry.ctaLink.startsWith("//") ? entry.ctaLink : null

  return (
    <>
      <ArticleHeader
        backHref="/threats"
        backLabel="Threat Library"
        eyebrow="Industry brief"
        eyebrowIcon={Building2}
        title={entry.title}
        chips={
          <>
            {entry.industry ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-white text-[#334155]">
                <Building2 className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                {entry.industry}
              </span>
            ) : null}
            {(entry.audience || ["business"]).map((a) => (
              <AudienceBadge key={a} audience={a} />
            ))}
          </>
        }
        datePublished={entry.datePublished}
        lastReviewed={entry.lastReviewed}
        showFullByline
      />

      <TldrBlock text={entry.tldr} number={number} />

      {/*
        SECURITY NOTE: entry.content is hand-authored HTML stored in
        lib/content/threats/ and shipped as part of the source bundle. It is
        never user-supplied, never fetched from an external source, and never
        contains interpolated variables. htmlWithCitations only swaps
        [^source-id] markers (ids limited to [a-z0-9-]) for numbered <sup>
        links. If this content ever comes from a CMS, user submissions, or an
        LLM, it MUST be sanitized (isomorphic-dompurify) before rendering, or
        the page becomes an XSS vector.
      */}
      {entry.content ? (
        <div
          className="threat-content border border-[#E2E8F0] bg-white p-5 sm:p-8 mt-8"
          dangerouslySetInnerHTML={{ __html: htmlWithCitations(entry.content, number) }}
        />
      ) : null}

      {cta ? (
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 border border-[#1D4ED8]/20 bg-[#EFF6FF] p-5 sm:p-6">
          <p className="text-[#1E3A8A] text-sm sm:text-base flex-1">
            See how your organization measures up against these threats.
          </p>
          <Link
            href={cta}
            className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-5 py-3 font-bold text-sm hover:bg-[#1E40AF] motion-safe:transition-colors"
          >
            {entry.ctaText || "Start the free Quick Check"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </>
  )
}
