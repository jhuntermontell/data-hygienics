import { Children } from "react"
import Link from "next/link"
import { ArrowRight, BookA, Briefcase, ExternalLink, House, KeyRound, LifeBuoy, Route } from "lucide-react"
import ContentCard from "@/app/components/ContentCard"
import SchemaScript from "@/app/components/SchemaScript"
import { hrefFor, stripCitations } from "@/lib/content"
import { getThreatBySlug } from "@/lib/threats"
import { getGuideBySlug } from "@/lib/guides"
import { getExplainerBySlug } from "@/lib/sovereignty"
import { TOOLKIT_CATEGORIES } from "@/lib/toolkit"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"

// Shared layout for the three hubs (/household, /business,
// /digital-sovereignty). Copy comes from lib/hubs.js; entries come from
// lib/library.js getHubContent(), with the tools list taken from the hub's
// hand-picked `featuredTools`. Every list hides itself when empty, since
// drafts are filtered out in production.
//
// Section order: header with "Start here", threats, industry briefs,
// guides, hub-specific children, toolkit, explainers, glossary band.

// Full class strings so Tailwind can see them. The hub head is a night
// surface; each audience keeps its mark color for the small hexagon and the
// day-surface links below the head.
const ACCENTS = {
  home: { icon: House, mark: "bg-[#0F8F83]", link: "text-[#0F766E] hover:text-[#115E59]" },
  business: { icon: Briefcase, mark: "bg-[#1D4ED8]", link: "text-[#1D4ED8] hover:text-[#1E40AF]" },
  sovereignty: { icon: KeyRound, mark: "bg-white", link: "text-[#1D4ED8] hover:text-[#1E40AF]" },
}

const HEX = "[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"

const ENTRY_GETTERS = {
  threat: getThreatBySlug,
  "industry-brief": getThreatBySlug,
  guide: getGuideBySlug,
  explainer: getExplainerBySlug,
}

const COST_LABELS = { free: "Free", freemium: "Free tier", paid: "Paid" }

// Drop "Start here" items whose entry is missing or still a draft.
export function resolveStartHere(items = []) {
  return items
    .map((item) => {
      if (item.href) return item
      const entry = ENTRY_GETTERS[item.kind]?.(item.slug)
      return entry ? { ...item, href: hrefFor(entry) } : null
    })
    .filter(Boolean)
}

export function HubSection({ id, title, intro, link, children, className = "bg-white" }) {
  return (
    <section aria-labelledby={`${id}-heading`} className={`px-4 sm:px-6 py-16 sm:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <FoldRule />
        <div className="mt-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <h2 id={`${id}-heading`} className="font-display font-semibold text-[1.75rem] sm:text-[2.25rem] leading-[1.1] tracking-[-0.02em] text-[#0F172A] text-balance">
              {title}
            </h2>
            {intro ? <p className="mt-3 text-[1.0625rem] text-[#475569] leading-relaxed">{intro}</p> : null}
          </div>
          {link ? (
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] shrink-0"
            >
              {link.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  )
}

export function EntryGrid({ entries }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
      {entries.map((entry) => (
        <li key={`${entry.kind}-${entry.slug}`}>
          <ContentCard entry={entry} headingLevel="h3" />
        </li>
      ))}
    </ul>
  )
}

export function ToolGrid({ tools }) {
  const columns = tools.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"
  return (
    <ul className={`grid gap-5 list-none p-0 ${columns}`}>
      {tools.map((tool) => (
        <li key={tool.slug}>
          <ToolCard tool={tool} />
        </li>
      ))}
    </ul>
  )
}

// "If it already happened" box: official reporting channels, in order.
// Copy comes from the hub's `alreadyHappened` block in lib/hubs.js.
export function AlreadyHappened({ box }) {
  const steps = box?.steps || []
  if (!steps.length) return null
  return (
    <section
      id="already-happened"
      aria-labelledby="hub-already-happened-heading"
      className="px-4 sm:px-6 py-16 sm:py-24 bg-[#F8FAFC] border-y border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto">
        <FoldRule />
        <div className="mt-7 max-w-3xl">
          <Readout label className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
            Official channels, in order
          </Readout>
          <h2
            id="hub-already-happened-heading"
            className="mt-3 font-display font-semibold text-[1.75rem] sm:text-[2.25rem] leading-[1.1] tracking-[-0.02em] text-[#0F172A] text-balance"
          >
            {box.title}
          </h2>
          {box.intro ? <p className="mt-3 text-[1.0625rem] leading-relaxed text-[#475569]">{box.intro}</p> : null}
        </div>
        <ol className="mt-10 grid sm:grid-cols-2 list-none p-0 m-0 border-t border-[#E2E8F0]">
          {steps.map((step, i) => {
            const external = step.href?.startsWith("http")
            return (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-3 py-6 border-b border-[#E2E8F0] sm:odd:pr-8 sm:even:pl-8 sm:even:border-l">
                <span aria-hidden="true" className="readout pt-1 text-[#0F766E]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-[1.1875rem] leading-snug tracking-[-0.01em] text-[#0F172A]">{step.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#475569]">{step.detail}</p>
                  {step.href ? (
                    <a
                      href={step.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-4 hover:decoration-current"
                    >
                      {step.linkLabel || step.href}
                      {external ? (
                        <>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </>
                      ) : null}
                    </a>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export function ToolCard({ tool }) {
  const category = TOOLKIT_CATEGORIES?.find((c) => c.slug === tool.category)
  return (
    <Link
      href={hrefFor(tool)}
      className="group flex flex-col h-full bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#1D4ED8]/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-bold text-[#0F172A] leading-snug group-hover:text-[#1D4ED8] transition-colors">
          {tool.name}
        </h3>
        {COST_LABELS[tool.cost] ? (
          <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
            {COST_LABELS[tool.cost]}
          </span>
        ) : null}
      </div>
      {category ? <p className="text-xs font-medium text-[#64748B] mb-2">{category.name}</p> : null}
      <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">{stripCitations(tool.whatItsFor)}</p>
      <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8]">
        See it in the toolkit
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </span>
    </Link>
  )
}

function HubHeader({ hub }) {
  const accent = ACCENTS[hub.accent] || ACCENTS.business
  const startHere = resolveStartHere(hub.startHere)

  return (
    <section aria-labelledby="hub-title" className="bg-night text-night-ink px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto">
        <FoldRule tone="night" draw />
        <Readout tone="night" label className="mt-7 flex items-center gap-2">
          <span aria-hidden="true" className={`w-2 h-2 ${HEX} ${accent.mark}`} />
          {hub.eyebrow}
        </Readout>
        <h1
          id="hub-title"
          className="mt-4 max-w-4xl font-display font-semibold text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] leading-[1.02] tracking-[-0.03em] text-balance"
        >
          {hub.title}
        </h1>
        <div className="mt-6 max-w-2xl space-y-3 text-lg sm:text-[1.1875rem] leading-relaxed text-night-ink-2">
          {hub.promise.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {hub.note ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-night-readout">{hub.note}</p> : null}

        {hub.clearPath ? (
          <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href={hub.clearPath.href}
              className="group inline-flex items-center justify-center gap-2 h-12 px-6 bg-white text-[#0F172A] text-[15px] font-semibold hover:bg-[#F1F5F9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
            >
              <Route className="w-5 h-5" aria-hidden="true" />
              {hub.clearPath.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <p className="text-sm text-night-ink-2">{hub.clearPath.line}</p>
          </div>
        ) : null}

        {startHere.length > 0 ? (
          <div className="mt-14 sm:mt-16">
            <Readout as="h2" tone="night" label className="mb-5">
              Start here
            </Readout>
            <ol className={`grid gap-10 lg:gap-6 list-none p-0 m-0 ${startHere.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {startHere.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]"
                  >
                    <FoldRule tone="night" />
                    <span aria-hidden="true" className="readout mt-4 block text-night-readout">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block font-display font-semibold text-[1.3125rem] leading-tight tracking-[-0.01em] group-hover:text-night-accent transition-colors">
                      {item.label}
                    </span>
                    <span className="mt-2 block text-[0.9375rem] leading-relaxed text-night-ink-2">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function GlossaryBand() {
  return (
    <section aria-labelledby="hub-glossary-heading" className="px-4 sm:px-6 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-start gap-4">
          <span className="shrink-0 w-10 h-10 bg-white border border-[#E2E8F0] flex items-center justify-center">
            <BookA className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
          </span>
          <div>
            <h2 id="hub-glossary-heading" className="font-display font-semibold text-[1.25rem] tracking-[-0.01em] text-[#0F172A]">
              New to the jargon?
            </h2>
            <p className="text-sm text-[#475569] mt-1">
              Every AI and security term on this site, decoded in a sentence or two.
            </p>
          </div>
        </div>
        <Link
          href="/glossary"
          className="inline-flex items-center justify-center gap-1.5 bg-white border border-[#0F172A] text-[#0F172A] text-sm font-semibold px-5 h-11 hover:bg-[#F1F5F9] transition-colors"
        >
          Open the glossary
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export default function HubPage({ hub, content = {}, schemaItems, children }) {
  const threats = content.threats || []
  const briefs = content.briefs || []
  const guides = content.guides || []
  const tools = content.tools || []
  const explainers = content.explainers || []
  const sections = hub.sections || {}

  const listed = schemaItems || [...threats, ...briefs, ...guides, ...explainers]
  const schemas = [
    collectionPageSchema({
      name: hub.name,
      description: hub.metaDescription,
      path: hub.path,
      items: listed.map((entry) => ({ name: entry.title, path: hrefFor(entry) })),
    }),
    breadcrumbSchema([
      { name: "Data Hygienics", path: "/" },
      { name: hub.eyebrow, path: hub.path },
    ]),
  ]

  // Children.toArray drops null sections, so a hub whose extras all hid
  // itself still counts as empty.
  const hasExtras = Children.toArray(children).length > 0
  const isEmpty =
    !threats.length && !briefs.length && !guides.length && !tools.length && !explainers.length && !hasExtras

  return (
    <main className="bg-white text-[#0F172A]">
      <SchemaScript schema={schemas} />
      <HubHeader hub={hub} />

      {threats.length > 0 && sections.threats ? (
        <HubSection
          id="hub-threats"
          title={sections.threats.title}
          intro={sections.threats.intro}
          link={{ href: "/threats", label: "Threat Library" }}
        >
          <EntryGrid entries={threats.slice(0, 6)} />
        </HubSection>
      ) : null}

      {briefs.length > 0 && sections.briefs ? (
        <HubSection
          id="hub-briefs"
          title={sections.briefs.title}
          intro={sections.briefs.intro}
          className="bg-white border-t border-[#F1F5F9]"
        >
          <EntryGrid entries={briefs} />
        </HubSection>
      ) : null}

      {guides.length > 0 && sections.guides ? (
        <HubSection
          id="hub-guides"
          title={sections.guides.title}
          intro={sections.guides.intro}
          link={{ href: "/guides", label: "All guides" }}
          className="bg-[#F8FAFC]"
        >
          <EntryGrid entries={guides.slice(0, 6)} />
        </HubSection>
      ) : null}

      {children}

      {tools.length > 0 && sections.tools ? (
        <HubSection
          id="hub-tools"
          title={sections.tools.title}
          intro={sections.tools.intro}
          link={{ href: "/toolkit", label: "Full toolkit" }}
          className="bg-white border-t border-[#F1F5F9]"
        >
          <ToolGrid tools={tools.slice(0, 6)} />
        </HubSection>
      ) : null}

      {explainers.length > 0 && sections.explainers ? (
        <HubSection
          id="hub-explainers"
          title={sections.explainers.title}
          intro={sections.explainers.intro}
          link={{ href: "/digital-sovereignty", label: "Digital Sovereignty" }}
          className="bg-white border-t border-[#F1F5F9]"
        >
          <EntryGrid entries={explainers.slice(0, 3)} />
        </HubSection>
      ) : null}

      {isEmpty ? (
        <section className="px-4 sm:px-6 py-14">
          <p className="max-w-6xl mx-auto text-[#475569]">
            New research for this section is on its way. In the meantime, the{" "}
            <Link href="/threats" className="font-semibold text-[#1D4ED8] underline underline-offset-2">
              Threat Library
            </Link>{" "}
            and the{" "}
            <Link href="/glossary" className="font-semibold text-[#1D4ED8] underline underline-offset-2">
              glossary
            </Link>{" "}
            are open.
          </p>
        </section>
      ) : null}

      <GlossaryBand />
    </main>
  )
}
