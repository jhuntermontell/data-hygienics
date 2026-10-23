"use client"
import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CloudUpload,
  Download,
  Flag,
  Printer,
  RefreshCw,
  Scissors,
  Telescope,
  Trash2,
  Users,
} from "lucide-react"
import StepCard, { VIEWS } from "./StepCard"
import { HORIZONS, HORIZON_ORDER, HORIZON_STYLES, longViewYear } from "@/lib/horizons"
import { INDUSTRIES, STATUS, minutesFor, stageProgress, thisWeek, whereYouStand } from "@/lib/path"

const HANDLED = (mark) => Boolean(STATUS[mark?.status]?.handled)

function joinList(items) {
  if (items.length <= 1) return items.join("")
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
}

// The reveal: a field of dots, one per step we publish, gets the brand's
// clean cut; what doesn't fit fades and the rest is the path. Reduced motion
// renders the end state directly.
function Reveal({ path, total, mirror, headStart }) {
  const reduce = useReducedMotion()
  const kept = new Set(path.steps.map((s) => s.id))
  const dots = path.allIds
  return (
    <section aria-labelledby="reveal-title" className="rounded-3xl bg-[#0F172A] text-white p-6 sm:p-8 overflow-hidden relative">
      <div aria-hidden="true" className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-white/5" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">Your path is ready</p>
          <h2 id="reveal-title" className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            {mirror}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#CBD5E1]">
            {path.steps.length} steps, in order. We set aside {total - path.steps.length}{" "}that don&apos;t fit
            {path.audience === "home" ? " a home like yours" : " a business like yours"}.
            {headStart > 0
              ? ` You're not starting from zero: you said ${headStart === 1 ? "one is" : `${headStart} are`} already in place.`
              : ""}
          </p>
        </div>
        <div className="grid grid-cols-10 gap-1.5 w-full max-w-[16rem] lg:w-64" role="img" aria-label={`${path.steps.length} of ${total} steps kept for your path`}>
          {dots.map((id, i) => {
            const keep = kept.has(id)
            return (
              <motion.span
                key={id}
                className={`block aspect-square rounded-full ${keep ? "bg-[#0F8F83]" : "bg-white/15"}`}
                initial={reduce ? false : { opacity: 0.9, scale: 1 }}
                animate={keep ? { opacity: 1, scale: 1 } : { opacity: 0.35, scale: 0.6 }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.4 + (i % 10) * 0.04 }}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ThisWeek({ picks, onStart, progress, answers }) {
  if (!picks.length) {
    return (
      <p className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-[15px] text-[#475569]">
        Nothing due this week. That&apos;s the point. Your monthly tidy keeps it that way.
      </p>
    )
  }
  return (
    <section aria-labelledby="this-week-title">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <h2 id="this-week-title" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#0F172A]">
          <CalendarCheck className="w-5 h-5 text-[#0F766E]" aria-hidden="true" />
          This week
        </h2>
        <p className="text-sm text-[#64748B]">
          {picks.length === 1 ? "One step this week. That's a real start." : "Start with these. The rest will keep."}
        </p>
      </div>
      <ol className={`mt-4 grid gap-3 list-none p-0 ${picks.length > 1 ? "md:grid-cols-3" : ""}`}>
        {picks.map((step, i) => (
          <li key={step.id} className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <p className="text-xs font-semibold text-[#0F766E]">Step {i + 1}</p>
            <p className="mt-1 text-[15px] font-semibold leading-snug text-[#0F172A] flex-1">{step.title}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                About {minutesFor(step, answers)} min
              </span>
              {step.involves ? (
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  With others
                </span>
              ) : null}
            </p>
            <button
              type="button"
              onClick={() => onStart(step.id)}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#115E59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A]"
            >
              {HANDLED(progress[step.id]) ? "Open" : "Start"}
              <span className="sr-only">: {step.title}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}

function HorizonStrip({ path, progress, filter, onFilter, year }) {
  return (
    <fieldset>
      <legend className="sr-only">Show steps by horizon</legend>
      <div className="grid grid-cols-3 gap-2">
        {HORIZON_ORDER.map((key) => {
          const h = HORIZONS[key]
          const steps = path.steps.filter((s) => (s.horizon || "now") === key)
          const done = steps.filter((s) => HANDLED(progress[s.id])).length
          const on = filter === key
          return (
            <label
              key={key}
              className={`relative cursor-pointer rounded-xl border-2 p-3 focus-within:ring-2 focus-within:ring-[#1D4ED8] focus-within:ring-offset-2 ${
                on ? "border-[#0F172A] bg-white" : "border-transparent bg-white/70 hover:bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => onFilter(on ? "all" : key)}
                className="sr-only"
              />
              <span className="flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                <span aria-hidden="true" className={`w-2 h-2 rounded-full ${HORIZON_STYLES[key].dot}`} />
                {h.label}
                <span className="hidden sm:inline font-medium text-[#64748B]">· {h.verb}</span>
              </span>
              <span className="mt-0.5 block text-xs text-[#64748B]">
                {key === "future" ? `Through ${year}` : h.window}
              </span>
              <span className="mt-2 flex flex-wrap gap-1" aria-hidden="true">
                {steps.map((s) => (
                  <span
                    key={s.id}
                    className={`w-2.5 h-2.5 rounded-full ${HANDLED(progress[s.id]) ? HORIZON_STYLES[key].dot : "border-2 border-[#CBD5E1]"}`}
                  />
                ))}
              </span>
              <span className="mt-1.5 block text-xs font-semibold text-[#334155]">
                {done} of {steps.length} done
                <span className="sr-only">{on ? ", showing only these" : ", select to show only these"}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function WhereYouStand({ rows, onOpen }) {
  return (
    <section aria-labelledby="stand-title" className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
      <h2 id="stand-title" className="text-base font-bold text-[#0F172A]">
        Where you stand
      </h2>
      <ul className="mt-4 space-y-4 list-none p-0 m-0">
        {rows.map((row) => (
          <li key={row.key}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-[#0F172A]">{row.label}</p>
              <p className="text-xs font-semibold text-[#1D4ED8]">
                {row.handled === 0 ? "Not started" : `${row.handled} of ${row.total}`}
              </p>
            </div>
            <div className="mt-1.5 flex gap-1" aria-hidden="true">
              {Array.from({ length: row.total }).map((_, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full ${i < row.handled ? "bg-[#1D4ED8]" : "bg-[#E2E8F0]"}`} />
              ))}
            </div>
            {row.next ? (
              <button
                type="button"
                onClick={() => onOpen(row.next.id)}
                className="mt-1.5 text-left text-xs font-semibold text-[#475569] hover:text-[#1D4ED8] underline-offset-2 hover:underline"
              >
                Next for this: {row.next.title}
              </button>
            ) : (
              <p className="mt-1.5 text-xs font-semibold text-[#0F766E]">Covered</p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-[#64748B]">
        This counts what you&apos;ve done. It isn&apos;t a safety rating.
      </p>
    </section>
  )
}

function LongViewPanel({ endStates, selected, onSelect, path, year }) {
  const stepsById = Object.fromEntries(path.steps.map((s) => [s.id, s]))
  const active = endStates.find((e) => e.id === selected)
  return (
    <section aria-labelledby="long-view-title" className="rounded-2xl bg-[#0F172A] text-white p-5 sm:p-6">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">
        <Telescope className="w-4 h-4" aria-hidden="true" />
        Start from {year}
      </p>
      <h2 id="long-view-title" className="mt-2 text-xl font-bold tracking-tight">
        Where this path leads
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
        {year} isn&apos;t a deadline. It&apos;s a direction. Pick an end state to see the steps that lead to it.
      </p>
      <ul className="mt-4 grid gap-2 list-none p-0 m-0">
        {endStates.map((e) => {
          const on = e.id === selected
          return (
            <li key={e.id}>
              <button
                type="button"
                aria-pressed={on}
                aria-controls="path-stages"
                onClick={() => onSelect(on ? null : e.id)}
                className={`w-full text-left rounded-xl border px-4 py-3 text-[15px] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  on ? "border-white bg-white text-[#0F172A] font-semibold" : "border-white/20 hover:border-white/50 text-white"
                }`}
              >
                {e.text}
              </button>
            </li>
          )
        })}
      </ul>
      {active ? (
        <div className="mt-4 rounded-xl bg-white/5 p-4" aria-live="polite">
          <p className="text-sm font-semibold">The steps that lead there, from today:</p>
          <ol className="mt-2 space-y-1 text-sm text-[#CBD5E1] list-decimal pl-5">
            {active.stepIds.filter((id) => stepsById[id]).map((id) => (
              <li key={id}>{stepsById[id].title}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  )
}

// The industry stage opens with what targets this industry most and the
// rules that may apply. Named rules only, no figures; "may apply" because
// thresholds and scope depend on the business.
function IndustryBrief({ industry }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <details className="rounded-xl border border-[#E2E8F0] bg-white p-4" open>
        <summary className="cursor-pointer text-sm font-semibold text-[#0F172A]">What targets {industry.label.toLowerCase()} most</summary>
        <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[#475569] list-disc pl-5">
          {industry.topThreats.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </details>
      <details className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-[#0F172A]">Rules that may apply to you</summary>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[#475569] list-disc pl-5">
          {industry.regulatoryHooks.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[#64748B]">Which rules apply depends on your size, data and contracts. This isn&apos;t legal advice.</p>
      </details>
    </div>
  )
}

function NoiseCards({ cards }) {
  if (!cards?.length) return null
  return (
    <section aria-labelledby="cut-title">
      <h2 id="cut-title" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#0F172A]">
        <Scissors className="w-5 h-5 text-[#0F172A]" aria-hidden="true" />
        What we cut
      </h2>
      <p className="mt-1 text-[15px] text-[#475569]">
        Things you&apos;ll hear about, and our honest take. We sell none of them.
      </p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2 list-none p-0 m-0">
        {cards.map((card) => (
          <li key={card.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#64748B]">You&apos;ll hear about</p>
            <p className="mt-1 text-[15px] font-semibold text-[#0F172A]">{card.hear}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#334155]">
              <span className="font-semibold text-[#0F172A]">Our take: </span>
              {card.take}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#334155]">
              <span className="font-semibold text-[#0F172A]">Worth it when: </span>
              {card.worthIt}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Routines({ routines }) {
  if (!routines?.length) return null
  return (
    <section aria-labelledby="routines-title" className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
      <h2 id="routines-title" className="flex items-center gap-2 text-base font-bold text-[#0F172A]">
        <RefreshCw className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
        Keep it tidy
      </h2>
      <ul className="mt-3 space-y-3 list-none p-0 m-0">
        {routines.map((r) => (
          <li key={r.id}>
            <p className="text-sm font-semibold text-[#0F172A]">
              {r.title} <span className="font-normal text-[#64748B]">· about {r.minutes} min</span>
            </p>
            <ul className="mt-1 space-y-0.5 text-sm text-[#475569] list-disc pl-5">
              {r.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {r.saves ? <p className="mt-1 text-xs text-[#64748B]">Saves you: {r.saves}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function SaveCard({ sync, user, audience }) {
  const next = `/path/${audience}`
  if (user) {
    const labels = {
      account: "Saved to your account. It's still yours: export or delete it any time.",
      saving: "Saving to your account...",
      offline: "Saved on this device. We couldn't reach your account just now; we'll try again on your next change.",
      device: "Saved on this device.",
    }
    return (
      <p className="flex items-start gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-4 text-sm text-[#475569]">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
        {labels[sync] || labels.device}
      </p>
    )
  }
  return (
    <div className="rounded-2xl border border-[#1D4ED8]/20 bg-[#EFF6FF] p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
        <CloudUpload className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
        Saved on this device
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[#334155]">
        Want it on your phone too? Save your path to a free account. Nothing leaves this device until you do.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/tools/cyber-audit/register?next=${encodeURIComponent(next)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF]"
        >
          Save my path
        </Link>
        <Link
          href={`/tools/cyber-audit/login?next=${encodeURIComponent(next)}`}
          className="inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold text-[#1D4ED8] hover:bg-white"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}

function Manage({ onEdit, onExport, onDelete }) {
  const button =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
  return (
    <div className="flex flex-wrap gap-1 print:hidden">
      <button type="button" onClick={onEdit} className={button}>
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        Change my answers
      </button>
      <button type="button" onClick={() => window.print()} className={button}>
        <Printer className="w-4 h-4" aria-hidden="true" />
        Print
      </button>
      <button type="button" onClick={onExport} className={button}>
        <Download className="w-4 h-4" aria-hidden="true" />
        Export
      </button>
      <button type="button" onClick={onDelete} className={`${button} hover:text-[#B91C1C]`}>
        <Trash2 className="w-4 h-4" aria-hidden="true" />
        Start over
      </button>
    </div>
  )
}

export default function PathView({
  path,
  progress,
  onMark,
  content,
  links,
  fresh,
  sync,
  user,
  onEdit,
  onExport,
  onDelete,
  view,
  onView,
}) {
  const year = longViewYear()
  const [openIds, setOpenIds] = useState(() => new Set())
  const [filter, setFilter] = useState("all")
  const [mode, setMode] = useState("today")
  const [endState, setEndState] = useState(null)
  const knowledge = path.answers.knowledge

  const picks = useMemo(() => thisWeek(path, progress), [path, progress])
  const stand = useMemo(() => whereYouStand(path, progress), [path, progress])
  // End states list the steps that lead to them; keep the ones on this path,
  // in path order, and drop end states with none.
  const position = Object.fromEntries(path.steps.map((s, i) => [s.id, i]))
  const endStates = (content.endStates || [])
    .map((e) => ({ ...e, stepIds: e.stepIds.filter((id) => id in position).sort((a, b) => position[a] - position[b]) }))
    .filter((e) => e.stepIds.length)
  const highlighted = new Set(mode === "future" && endState ? endStates.find((e) => e.id === endState)?.stepIds || [] : [])

  const openStep = (id) => {
    setFilter("all")
    setOpenIds((current) => new Set(current).add(id))
    requestAnimationFrame(() => {
      const el = document.getElementById(`step-${id}`)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
      el?.querySelector("button")?.focus({ preventScroll: true })
    })
  }
  const toggle = (id) =>
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const stepsById = Object.fromEntries(path.steps.map((s) => [s.id, s]))
  const industry = path.audience === "business" ? INDUSTRIES.find((i) => i.values.includes(path.answers.industry)) : null
  const mirror = content.mirror(path)
  const headStart = path.headStart.filter((id) => progress[id]?.status === "said").length

  return (
    <div className="space-y-8">
      {fresh ? <Reveal path={path} total={path.allIds.length} mirror={mirror} headStart={headStart} /> : null}

      <ThisWeek picks={picks} onStart={openStep} progress={progress} answers={path.answers} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div role="group" aria-label="Path view" className="inline-flex rounded-xl bg-[#E2E8F0]/70 p-1">
              {[
                { key: "today", label: "Start from today" },
                { key: "future", label: `Start from ${year}` },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={mode === m.key}
                  onClick={() => {
                    setMode(m.key)
                    setEndState(null)
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1D4ED8] ${
                    mode === m.key ? "bg-white text-[#0F172A] shadow-sm" : "text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-[#475569]">
              <span className="font-semibold text-[#0F172A]">Show steps</span>
              <select
                value={view}
                onChange={(e) => onView(e.target.value)}
                className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-2 text-sm text-[#0F172A] focus:border-[#1D4ED8]"
              >
                {VIEWS.map((v) => (
                  <option key={v.key} value={v.key}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {mode === "future" ? (
            <LongViewPanel endStates={endStates} selected={endState} onSelect={setEndState} path={path} year={year} />
          ) : null}

          <HorizonStrip path={path} progress={progress} filter={filter} onFilter={setFilter} year={year} />

          <ol id="path-stages" className="path-line relative space-y-10 list-none p-0 m-0">
            {path.stages.map((stage, si) => {
              const steps = stage.steps.filter((s) => filter === "all" || (s.horizon || "now") === filter)
              if (!steps.length) return null
              const { handled, total, complete } = stageProgress(stage, progress)
              return (
                <li key={stage.id} className="relative pl-12">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      complete ? "bg-[#0F8F83] text-white" : "bg-[#0F172A] text-white"
                    }`}
                  >
                    {complete ? <Flag className="w-4 h-4" /> : si + 1}
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
                      <span className="sr-only">Stage {si + 1}: </span>
                      {stage.title}
                    </h2>
                    <p className="text-sm font-semibold text-[#475569]">
                      {handled} of {total} done
                    </p>
                  </div>
                  {stage.summary ? <p className="mt-1 text-[15px] leading-relaxed text-[#475569]">{stage.summary}</p> : null}
                  {stage.id === "industry" && industry ? <IndustryBrief industry={industry} /> : null}
                  <ul className="mt-4 space-y-3 list-none p-0 m-0">
                    {steps.map((step) => (
                      <li key={step.id} id={`step-${step.id}`} className="scroll-mt-24">
                        <StepCard
                          step={step}
                          mark={progress[step.id]}
                          view={view}
                          knowledge={knowledge}
                          answers={path.answers}
                          links={links}
                          onMark={onMark}
                          open={openIds.has(step.id)}
                          onToggle={() => toggle(step.id)}
                          highlighted={highlighted.has(step.id)}
                          dimmed={highlighted.size > 0 && !highlighted.has(step.id)}
                          bestAfter={(step.requires || [])
                            .filter((r) => stepsById[r] && !HANDLED(progress[r]))
                            .map((r) => ({ id: r, title: stepsById[r].title }))}
                          onOpenStep={openStep}
                        />
                      </li>
                    ))}
                  </ul>
                  {complete && stage.milestone ? (
                    <p className="mt-3 rounded-xl border border-[#0F8F83]/30 bg-[#F0FDFA] p-4 text-sm leading-relaxed text-[#134E4A]">
                      <span className="font-semibold">What&apos;s different now: </span>
                      {stage.milestone}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ol>

          {path.setAside.length ? (
            <details className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[#0F172A]">
                See the {path.setAside.length} steps we set aside
              </summary>
              <p className="mt-2 text-sm text-[#475569]">
                These don&apos;t fit your answers. Change your answers to bring any of them back.
              </p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2 text-sm text-[#475569] list-disc pl-5">
                {path.setAside.map((s) => (
                  <li key={s.id}>{s.title}</li>
                ))}
              </ul>
            </details>
          ) : null}

          <NoiseCards cards={content.noise} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24" aria-label="Your progress and options">
          <SaveCard sync={sync} user={user} audience={path.audience} />
          <WhereYouStand rows={stand} onOpen={openStep} />
          <Routines routines={content.routines} />
          <Manage onEdit={onEdit} onExport={onExport} onDelete={onDelete} />
          {path.answers.knowledge ? (
            <p className="text-xs text-[#64748B]">
              Showing steps for someone who {joinList([{ new: "is new to this", basics: "knows the basics", expert: "wants the technical detail" }[path.answers.knowledge]].filter(Boolean))}.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
