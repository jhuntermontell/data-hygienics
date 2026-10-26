import Link from "next/link"
import { ArrowRight, ChevronRight, Clock, CornerDownRight, MessageSquareQuote, ShieldCheck, Users } from "lucide-react"
import { HORIZONS, HORIZON_STYLES } from "@/lib/horizons"
import {
  AUDIENCE_LABELS,
  cadenceFor,
  doItems,
  getStage,
  prerequisites,
  startLink,
  stepAudienceNotes,
  stepHref,
  stepLinks,
} from "@/lib/steps"

// One Clear Path step as a public page (/steps/<id>). Server component.
// All four tellings on one page, as headed sections, `do` first; anything
// the Path would show only for some answers is shown with an "If you ..."
// line so nothing is hidden. Optional fields (after, sayThis, cadence,
// story, newcomer, handoff) render when present and leave no gap when not.

const ACCENT = {
  home: { text: "text-[#0F766E]", chip: "border-[#0F8F83]/30 bg-[#F0FDFA] text-[#0F766E]", button: "bg-[#0F766E] hover:bg-[#115E59]" },
  business: { text: "text-[#1D4ED8]", chip: "border-[#1D4ED8]/25 bg-[#EFF6FF] text-[#1D4ED8]", button: "bg-[#1D4ED8] hover:bg-[#1E40AF]" },
}

function paragraphs(value) {
  return []
    .concat(value || [])
    .flatMap((p) => (typeof p === "string" ? p.split(/\n\n+/) : []))
    .map((p) => p.trim())
    .filter(Boolean)
}

function Section({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function StepArticle({ step, audience }) {
  const accent = ACCENT[audience] || ACCENT.home
  const stage = getStage(audience, step.stage)
  const cadence = cadenceFor(step)
  const horizon = HORIZONS[step.horizon] || null
  const items = doItems(step, audience)
  const notes = stepAudienceNotes(step, audience)
  const before = prerequisites(step)
  const links = stepLinks(step)
  const start = startLink(step, audience)
  const simple = paragraphs(step.simple)
  const detail = paragraphs(step.detail)
  const story = paragraphs(step.story)

  return (
    <article>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-[#475569] list-none p-0 m-0">
          <li>
            <Link href="/" className="hover:text-[#0F172A]">
              Data Hygienics
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          </li>
          <li>
            <Link href="/steps" className="hover:text-[#0F172A]">
              Steps
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          </li>
          <li aria-current="page" className="min-w-0 text-[#0F172A] font-medium line-clamp-1">
            {step.title}
          </li>
        </ol>
      </nav>

      <header>
        <p className={`text-xs font-semibold tracking-[0.12em] uppercase mb-3 ${accent.text}`}>
          Clear Path step · {AUDIENCE_LABELS[audience] || audience}
          {stage ? ` · ${stage.title}` : ""}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-[#0F172A] leading-[1.1] tracking-tight text-balance mb-5">
          {step.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#475569] font-medium mb-6">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" aria-hidden="true" />
            {cadence ? <span className="font-semibold text-[#0F172A]">{cadence.label}</span> : null}
            {cadence ? <span aria-hidden="true">·</span> : null}
            <span>About {step.minutes || 0} min</span>
          </span>
          {horizon ? (
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${HORIZON_STYLES[horizon.key].chip}`}>
              <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${HORIZON_STYLES[horizon.key].dot}`} />
              {horizon.label}
            </span>
          ) : null}
          {step.involves ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4" aria-hidden="true" />
              {step.involves}
            </span>
          ) : null}
        </div>

        {step.after ? (
          <p className="tldr-block text-lg sm:text-xl leading-relaxed text-[#0F172A] font-semibold mb-4">{step.after}</p>
        ) : null}
        <p className={`text-[17px] leading-relaxed text-[#334155] ${step.after ? "" : "tldr-block"}`}>
          <span className="font-semibold text-[#0F172A]">Why it matters: </span>
          {step.why}
        </p>

        {notes.length || before.length ? (
          <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2 text-sm leading-relaxed text-[#475569]">
            {notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
            {before.length ? (
              <p>
                <span className="font-semibold text-[#0F172A]">Best after: </span>
                {before.map((b, i) => (
                  <span key={b.id}>
                    {i ? ", " : ""}
                    <Link href={stepHref(b)} className="font-semibold text-[#1D4ED8] underline underline-offset-2 hover:text-[#1E40AF]">
                      {b.title}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        ) : null}
      </header>

      <Section id="do-it" title="Do it">
        <ol className="space-y-3 list-none p-0 m-0">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-[#334155]">
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-[#0F8F83]/10 text-[#0F766E] text-sm font-bold flex items-center justify-center"
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                {item.condition ? <span className="font-semibold text-[#0F172A]">{item.condition}: </span> : null}
                {item.text}
              </span>
            </li>
          ))}
        </ol>

        {step.sayThis ? (
          <div className="mt-6 flex gap-3 rounded-xl border border-[#0F172A]/15 bg-white p-4">
            <MessageSquareQuote className="w-5 h-5 mt-0.5 shrink-0 text-[#0F172A]" aria-hidden="true" />
            <p className="text-[16px] leading-relaxed text-[#0F172A]">
              <span className="font-semibold">Say this: </span>
              {step.sayThis}
            </p>
          </div>
        ) : null}

        {step.check ? (
          <p className="mt-6 flex gap-2 rounded-xl border border-[#0F8F83]/25 bg-[#F0FDFA] p-4 text-[15px] leading-relaxed text-[#134E4A]">
            <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
            <span>
              <span className="font-semibold">Check it worked: </span>
              {step.check}
            </span>
          </p>
        ) : null}

        {step.handoff ? (
          <div className="mt-6 rounded-xl border border-[#1D4ED8]/20 bg-[#EFF6FF] p-4">
            <p className="text-sm font-semibold text-[#0F172A]">If an outside IT company handles your IT, send them this:</p>
            <blockquote className="mt-2 border-l-2 border-[#1D4ED8]/40 pl-3 text-sm leading-relaxed text-[#1E3A8A]">
              {step.handoff}
            </blockquote>
          </div>
        ) : null}
      </Section>

      {simple.length ? (
        <Section id="simply" title="Simply put">
          <div className="space-y-3 text-[16px] leading-relaxed text-[#334155]">
            {simple.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>
      ) : null}

      {detail.length ? (
        <Section id="in-detail" title="In detail">
          <div className="space-y-3 text-[16px] leading-relaxed text-[#334155]">
            {detail.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>
      ) : null}

      {story.length ? (
        <Section id="as-a-story" title="As a story">
          <div className="rounded-2xl bg-[#0F172A] text-[#E2E8F0] p-5 sm:p-6 space-y-3 text-[16px] leading-relaxed">
            {story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>
      ) : null}

      {step.newcomer ? (
        <p className="mt-10 rounded-xl bg-white border border-[#E2E8F0] p-4 text-[15px] leading-relaxed text-[#334155]">
          <span className="font-semibold text-[#0F172A]">If this is new to you: </span>
          {step.newcomer}
        </p>
      ) : null}

      {step.thread ? (
        <p className="mt-6 flex gap-2 text-[15px] leading-relaxed text-[#475569]">
          <CornerDownRight className="w-4 h-4 mt-1 shrink-0 text-[#0F172A]" aria-hidden="true" />
          <span>
            <span className="font-semibold text-[#0F172A]">Points toward the Long View: </span>
            {step.thread}
          </span>
        </p>
      ) : null}

      {links.length ? (
        <Section id="read-more" title="Read more">
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {links.map((link) => (
              <li key={link.href} className="min-w-0">
                <Link
                  href={link.href}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm font-medium text-[#1D4ED8] hover:border-[#1D4ED8]/40"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">{link.type}</span>
                  <span className="min-w-0 break-words">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <aside aria-label="Start your path" className="mt-12 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
        <p className="text-[15px] leading-relaxed text-[#334155] mb-4">
          This is one step of the Clear Path for {audience === "business" ? "Business" : "Home"}: your steps in order, sized to
          your week. Free, and no account needed.
        </p>
        <Link
          href={start.href}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${accent.button}`}
        >
          {start.label ? `Start your path with “${start.label}”` : "Start your path"}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </aside>
    </article>
  )
}
