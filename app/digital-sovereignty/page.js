import Link from "next/link"
import { ArrowRight, Briefcase, House, Scale } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import HubPage, { EntryGrid, HubSection, ToolGrid } from "@/app/components/hub/HubPage"
import { HUBS, hubMetadata } from "@/lib/hubs"
import { PRINCIPLES, explainers } from "@/lib/sovereignty"
import { getGuideBySlug } from "@/lib/guides"
import { getToolsBySlugs } from "@/lib/library"
import { formatMonth, hrefFor, stripCitations } from "@/lib/content"

const hub = HUBS.sovereignty
const STANCE_SLUG = "ai-or-si-what-we-call-it"
const ACTION_LIMIT = 5

const CONFIDENCE_LABELS = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
}

export const metadata = hubMetadata(hub)

// Gather "what to do" steps for one audience across the explainers, in
// explainer order, dropping duplicates and links to unpublished guides.
function collectActions(list, audience) {
  const seen = new Set()
  const actions = []
  for (const entry of list) {
    for (const raw of entry.actions?.[audience] || []) {
      const item = typeof raw === "string" ? { guideSlug: raw } : raw || {}
      const guide = item.guideSlug ? getGuideBySlug(item.guideSlug) : null
      const label = item.label || guide?.title
      if (!label || seen.has(label)) continue
      seen.add(label)
      actions.push({
        label,
        detail: stripCitations(item.detail || ""),
        guide: guide ? { title: guide.title, href: hrefFor(guide) } : null,
      })
    }
  }
  return actions.slice(0, ACTION_LIMIT)
}

function ActionColumn({ title, icon: Icon, actions, tone }) {
  if (!actions.length) return null
  const styles =
    tone === "home"
      ? { wrap: "bg-[#F0FDFA] text-[#0F766E]", bullet: "bg-[#0F766E]", link: "text-[#0F766E] hover:text-[#115E59]" }
      : { wrap: "bg-[#EFF6FF] text-[#1D4ED8]", bullet: "bg-[#1D4ED8]", link: "text-[#1D4ED8] hover:text-[#1E40AF]" }
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.wrap}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>
        <h3 className="text-xl font-bold text-[#0F172A]">{title}</h3>
      </div>
      <ul className="mt-6 space-y-5 list-none p-0">
        {actions.map((action) => (
          <li key={action.label} className="flex gap-3">
            <span aria-hidden="true" className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${styles.bullet}`} />
            <div className="min-w-0">
              <p className="font-semibold text-[#0F172A]">{action.label}</p>
              {action.detail ? <p className="mt-1 text-sm leading-relaxed text-[#475569]">{action.detail}</p> : null}
              {action.guide ? (
                <Link
                  href={action.guide.href}
                  className={`group mt-2 inline-flex items-center gap-1 text-sm font-semibold ${styles.link}`}
                >
                  Guide: {action.guide.title}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DigitalSovereigntyPage() {
  const principles = Array.isArray(PRINCIPLES) ? PRINCIPLES.filter((p) => p?.title) : []
  const stance = explainers.find((e) => e.slug === STANCE_SLUG)
  const otherExplainers = explainers.filter((e) => e.slug !== STANCE_SLUG)
  const homeActions = collectActions(explainers, "home")
  const businessActions = collectActions(explainers, "business")
  const featuredTools = getToolsBySlugs(hub.featuredTools)
  const sections = hub.sections

  return (
    <>
      <Navbar />
      <HubPage hub={hub} schemaItems={explainers}>
        {principles.length > 0 ? (
          <HubSection id="principles" title={sections.principles.title} intro={sections.principles.intro}>
            <ol className="grid gap-4 sm:grid-cols-2 list-none p-0">
              {principles.map((principle, i) => (
                <li
                  key={principle.title}
                  className="flex gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm font-bold tabular-nums bg-gradient-to-br from-[#1D4ED8] to-[#0F8F83] bg-clip-text text-transparent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#0F172A] leading-snug">{principle.title}</h3>
                    {principle.detail ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        {stripCitations(principle.detail)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </HubSection>
        ) : null}

        {otherExplainers.length > 0 ? (
          <HubSection
            id="explainers"
            title={sections.explainers.title}
            intro={sections.explainers.intro}
            className="bg-[#F8FAFC] border-t border-[#F1F5F9]"
          >
            <EntryGrid entries={otherExplainers} />
          </HubSection>
        ) : null}

        {homeActions.length > 0 || businessActions.length > 0 ? (
          <HubSection
            id="actions"
            title={sections.actions.title}
            intro={sections.actions.intro}
            className="bg-white border-t border-[#F1F5F9]"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <ActionColumn title={sections.actions.home} icon={House} actions={homeActions} tone="home" />
              <ActionColumn
                title={sections.actions.business}
                icon={Briefcase}
                actions={businessActions}
                tone="business"
              />
            </div>
          </HubSection>
        ) : null}

        {featuredTools.length > 0 ? (
          <HubSection
            id="hub-tools"
            title={sections.tools.title}
            intro={sections.tools.intro}
            link={{ href: "/toolkit", label: "Full toolkit" }}
            className="bg-[#F8FAFC] border-t border-[#F1F5F9]"
          >
            <ToolGrid tools={featuredTools} />
          </HubSection>
        ) : null}

        {stance ? (
          <HubSection
            id="stance"
            title={sections.stance.title}
            intro={sections.stance.intro}
            className="bg-white border-t border-[#F1F5F9]"
          >
            <article className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white p-6 sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#1D4ED8]/40 to-[#0F8F83]/40 blur-3xl"
              />
              <div className="relative max-w-3xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-[#99F6E4]">
                  <Scale className="w-4 h-4" aria-hidden="true" />
                  Our stance
                </p>
                <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">{stance.title}</h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#CBD5E1]">
                  {stripCitations(stance.stance?.position || stance.shortAnswer || stance.tldr || "")}
                </p>
                {stance.stance ? (
                  <dl className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
                    {CONFIDENCE_LABELS[stance.stance.confidence] ? (
                      <div>
                        <dt className="text-[#94A3B8]">Confidence</dt>
                        <dd className="mt-0.5 font-semibold">{CONFIDENCE_LABELS[stance.stance.confidence]}</dd>
                      </div>
                    ) : null}
                    {stance.stance.lastRevisited ? (
                      <div>
                        <dt className="text-[#94A3B8]">Last revisited</dt>
                        <dd className="mt-0.5 font-semibold">{formatMonth(stance.stance.lastRevisited)}</dd>
                      </div>
                    ) : null}
                    {stance.stance.revisitWhen ? (
                      <div className="sm:col-span-3">
                        <dt className="text-[#94A3B8]">We&apos;ll revisit it when</dt>
                        <dd className="mt-0.5 text-[#E2E8F0]">{stripCitations(stance.stance.revisitWhen)}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
                <Link
                  href={hrefFor(stance)}
                  className="mt-8 inline-flex items-center gap-1.5 bg-white text-[#0F172A] text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                >
                  Read the full stance
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </HubSection>
        ) : null}
      </HubPage>
      <Footer />
    </>
  )
}
