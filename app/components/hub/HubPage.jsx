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

// Shared layout for the three hubs (/household, /business,
// /digital-sovereignty). Copy comes from lib/hubs.js; entries come from
// lib/library.js getHubContent(), with the tools list taken from the hub's
// hand-picked `featuredTools`. Every list hides itself when empty, since
// drafts are filtered out in production.
//
// Section order: header with "Start here", threats, industry briefs,
// guides, hub-specific children, toolkit, explainers, glossary band.

// Full class strings so Tailwind can see them.
const ACCENTS = {
  home: {
    icon: House,
    band: "from-[#F0FDFA] via-[#F8FAFC] to-white",
    pill: "bg-white text-[#0F766E] border-[#0F766E]/25",
    number: "bg-[#0F766E] text-white",
    title: "group-hover:text-[#0F766E]",
    cardHover: "hover:border-[#0F766E]/40",
    glow: "bg-[#0F766E]/10",
    cta: "bg-[#0F766E] hover:bg-[#115E59]",
  },
  business: {
    icon: Briefcase,
    band: "from-[#EFF6FF] via-[#F8FAFC] to-white",
    pill: "bg-white text-[#1D4ED8] border-[#1D4ED8]/25",
    number: "bg-[#1D4ED8] text-white",
    title: "group-hover:text-[#1D4ED8]",
    cardHover: "hover:border-[#1D4ED8]/40",
    glow: "bg-[#1D4ED8]/10",
    cta: "bg-[#1D4ED8] hover:bg-[#1E40AF]",
  },
  sovereignty: {
    icon: KeyRound,
    band: "from-[#EFF6FF] via-[#F0FDFA] to-white",
    pill: "bg-white text-[#0F172A] border-[#0F172A]/15",
    number: "bg-gradient-to-br from-[#1D4ED8] to-[#0F8F83] text-white",
    title: "group-hover:text-[#1D4ED8]",
    cardHover: "hover:border-[#1D4ED8]/40",
    glow: "bg-[#0F766E]/10",
    cta: "bg-[#0F172A] hover:bg-[#1E293B]",
  },
}

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
    <section aria-labelledby={`${id}-heading`} className={`px-4 sm:px-6 py-14 sm:py-20 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <h2 id={`${id}-heading`} className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              {title}
            </h2>
            {intro ? <p className="mt-2 text-[#475569] leading-relaxed">{intro}</p> : null}
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
      className="px-4 sm:px-6 py-14 sm:py-20 bg-white border-t border-[#F1F5F9]"
    >
      <div className="max-w-6xl mx-auto rounded-2xl border border-[#D97706]/35 bg-[#FFFBEB] p-6 sm:p-10">
        <div className="flex items-start gap-4 max-w-3xl">
          <span className="shrink-0 w-11 h-11 rounded-xl bg-white border border-[#D97706]/30 flex items-center justify-center">
            <LifeBuoy className="w-5 h-5 text-[#B45309]" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="hub-already-happened-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]"
            >
              {box.title}
            </h2>
            {box.intro ? <p className="mt-2 leading-relaxed text-[#78350F]">{box.intro}</p> : null}
          </div>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 list-none p-0">
          {steps.map((step, i) => {
            const external = step.href?.startsWith("http")
            return (
              <li key={step.title} className="flex gap-4 rounded-xl border border-[#FDE68A] bg-white p-5">
                <span
                  aria-hidden="true"
                  className="shrink-0 w-8 h-8 rounded-full bg-[#B45309] text-white text-sm font-bold flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold leading-snug text-[#0F172A]">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#475569]">{step.detail}</p>
                  {step.href ? (
                    <a
                      href={step.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#92400E] underline decoration-[#D97706]/40 underline-offset-4 hover:decoration-current"
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
  const Icon = accent.icon
  const startHere = resolveStartHere(hub.startHere)

  return (
    <section
      aria-labelledby="hub-title"
      className={`relative overflow-hidden bg-gradient-to-b ${accent.band} px-4 sm:px-6 pt-28 sm:pt-36 pb-14 sm:pb-20`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 right-[-6rem] w-[22rem] h-[22rem] rounded-full blur-3xl ${accent.glow}`}
      />
      <div className="relative max-w-6xl mx-auto">
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border ${accent.pill}`}
        >
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
          {hub.eyebrow}
        </span>
        <h1
          id="hub-title"
          className="mt-5 max-w-3xl text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#0F172A] text-balance"
        >
          {hub.title}
        </h1>
        <div className="mt-5 max-w-2xl space-y-3 text-lg leading-relaxed text-[#475569]">
          {hub.promise.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {hub.note ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B]">{hub.note}</p> : null}

        {hub.clearPath ? (
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href={hub.clearPath.href}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors ${accent.cta}`}
            >
              <Route className="w-5 h-5" aria-hidden="true" />
              {hub.clearPath.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <p className="text-sm text-[#475569]">{hub.clearPath.line}</p>
          </div>
        ) : null}

        {startHere.length > 0 ? (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-[#64748B] mb-4">Start here</h2>
            <ol className={`grid gap-4 list-none p-0 ${startHere.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {startHere.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex h-full gap-4 bg-white/90 backdrop-blur-sm border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${accent.cardHover}`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center ${accent.number}`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block font-semibold text-[#0F172A] leading-snug transition-colors ${accent.title}`}
                      >
                        {item.label}
                      </span>
                      <span className="block mt-1 text-sm leading-relaxed text-[#475569]">{item.description}</span>
                    </span>
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
      <div className="max-w-6xl mx-auto rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-start gap-4">
          <span className="shrink-0 w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center">
            <BookA className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
          </span>
          <div>
            <h2 id="hub-glossary-heading" className="text-lg font-bold text-[#0F172A]">
              New to the jargon?
            </h2>
            <p className="text-sm text-[#475569] mt-1">
              Every AI and security term on this site, decoded in a sentence or two.
            </p>
          </div>
        </div>
        <Link
          href="/glossary"
          className="inline-flex items-center justify-center gap-1.5 bg-white border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold px-5 py-2.5 rounded-lg hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8] transition-colors"
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
