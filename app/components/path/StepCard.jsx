"use client"
import { useId, useState } from "react"
import Link from "next/link"
import { Check, ChevronDown, Clock, Copy, CornerDownRight, Mail, RotateCcw, ShieldCheck, Users } from "lucide-react"
import { HORIZONS, HORIZON_STYLES } from "@/lib/horizons"
import { STATUS, matchesWhen, minutesFor } from "@/lib/path"

// One Clear Path step. Written once (lib/content/path/*), told four ways:
//   do      numbered actions and a check (always present)
//   simple  an everyday comparison, then the actions
//   detail  how it works, tradeoffs and limits, then the actions
//   story   a short scene that ends calmly, then the actions
// A missing telling falls back (story -> simple -> do, detail -> do) and the
// tab shows what's actually on screen. Knowledge level adds a reassurance
// box for newcomers and "go further" for experts.
//
// The card follows the brand's three faces: Why now (navy, Judgment), your
// status (cobalt, Clarity), Do it (teal, Action). Status is always a label,
// never color alone.

export const VIEWS = [
  { key: "do", label: "Steps" },
  { key: "simple", label: "Simply" },
  { key: "detail", label: "In detail" },
  { key: "story", label: "As a story" },
]

const FALLBACK = { do: [], simple: ["do"], detail: ["do"], story: ["simple", "do"] }

function resolveView(step, view) {
  if (view === "do" || step[view]) return view
  return FALLBACK[view].find((v) => v === "do" || step[v]) || "do"
}

const TYPE_LABELS = {
  setup: "Set up once",
  habit: "Habit",
  conversation: "A conversation",
  rehearsal: "Practice run",
  decision: "A decision",
}

function StatusChip({ mark }) {
  const status = STATUS[mark?.status]
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1D4ED8]/25 bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-semibold text-[#1D4ED8]">
        Not started
      </span>
    )
  }
  const styles = {
    said: "border-[#1D4ED8]/25 bg-white text-[#1D4ED8] border-dashed",
    done: "border-[#0F8F83]/30 bg-[#F0FDFA] text-[#0F766E]",
    checked: "border-[#0F8F83] bg-[#0F766E] text-white",
    skipped: "border-[#CBD5E1] border-dashed bg-white text-[#475569]",
    declined: "border-[#0F172A]/30 bg-white text-[#0F172A]",
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[mark.status]}`}>
      {mark.status === "checked" ? <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> : null}
      {mark.status === "done" ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : null}
      {status.label}
    </span>
  )
}

function Actions({ step, mark, onMark }) {
  const button =
    "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
  if (mark && mark.status !== "skipped") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {mark.status !== "checked" && mark.status !== "declined" ? (
          <button type="button" onClick={() => onMark(step.id, "checked")} className={`${button} bg-[#0F766E] text-white hover:bg-[#115E59]`}>
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            I checked it works
          </button>
        ) : null}
        <button type="button" onClick={() => onMark(step.id, null)} className={`${button} text-[#475569] hover:bg-[#F1F5F9]`}>
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Undo
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => onMark(step.id, "done")} className={`${button} bg-[#0F766E] text-white hover:bg-[#115E59]`}>
        <Check className="w-4 h-4" aria-hidden="true" />
        Done
      </button>
      <button type="button" onClick={() => onMark(step.id, "checked")} className={`${button} border border-[#0F8F83]/40 text-[#0F766E] hover:bg-[#F0FDFA]`}>
        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        Done and checked
      </button>
      {mark?.status !== "skipped" ? (
        <button type="button" onClick={() => onMark(step.id, "skipped")} className={`${button} text-[#475569] hover:bg-[#F1F5F9]`}>
          Skip for now
        </button>
      ) : null}
      <button type="button" onClick={() => onMark(step.id, "declined")} className={`${button} text-[#475569] hover:bg-[#F1F5F9]`}>
        Not for us
      </button>
    </div>
  )
}

// Requests are written for either platform; name the one they actually use.
function forPlatform(text, answers = {}) {
  const stack = Array.isArray(answers.stack) ? answers.stack : []
  const m365 = stack.includes("m365")
  const google = stack.includes("google")
  if (m365 === google) return text
  return text.replace(/Microsoft 365 \(or Google Workspace\)/g, m365 ? "Microsoft 365" : "Google Workspace")
}

function Handoff({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  const mailto = `mailto:?subject=${encodeURIComponent("Security request")}&body=${encodeURIComponent(text)}`
  return (
    <div className="rounded-xl border border-[#1D4ED8]/20 bg-[#EFF6FF] p-4">
      <p className="text-sm font-semibold text-[#0F172A]">Not your job to know how. Send this to your IT provider.</p>
      <blockquote className="mt-2 border-l-2 border-[#1D4ED8]/40 pl-3 text-sm leading-relaxed text-[#1E3A8A]">{text}</blockquote>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#1D4ED8]/30 px-3 py-1.5 text-sm font-semibold text-[#1D4ED8] hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <Copy className="w-4 h-4" aria-hidden="true" />
          {copied ? "Copied" : "Copy the request"}
        </button>
        <a
          href={mailto}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1D4ED8] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <Mail className="w-4 h-4" aria-hidden="true" />
          Open in my email
        </a>
      </div>
      <p className="mt-2 text-xs text-[#475569]">
        {/\[[a-z ]+\]/i.test(text) ? "Fill in the parts in [brackets] first. " : ""}
        You send it from your own email. We never send anything for you.
      </p>
    </div>
  )
}

// Actions can carry a `when` (e.g. Microsoft 365 vs Google Workspace
// settings); only the ones that match the answers are shown and numbered.
function DoList({ step, answers }) {
  const items = (Array.isArray(step.do) ? step.do : []).filter((item) => typeof item === "string" || matchesWhen(item.when, answers))
  return (
    <ol className="space-y-2 list-none p-0 m-0">
      {items.map((item, i) => {
        const text = typeof item === "string" ? item : item.text
        return (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#334155]">
            <span aria-hidden="true" className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#0F8F83]/10 text-[#0F766E] text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="min-w-0">{text}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default function StepCard({
  step,
  mark,
  view,
  knowledge,
  answers,
  links = {},
  onMark,
  open,
  onToggle,
  highlighted,
  dimmed,
  bestAfter = [],
  onOpenStep,
}) {
  const id = useId()
  const [localView, setLocalView] = useState(null)
  const chosen = resolveView(step, localView || view)
  const horizon = HORIZONS[step.horizon] || HORIZONS.now
  const handled = STATUS[mark?.status]?.handled
  const provider = answers?.it === "provider" && step.handoff
  const stepLinks = (step.links || []).map((key) => links[key]).filter(Boolean)

  return (
    <article
      aria-labelledby={`${id}-title`}
      className={`step-card relative rounded-2xl border bg-white transition-[opacity,box-shadow,border-color] ${
        highlighted ? "border-[#0F172A] shadow-[0_0_0_3px_rgb(15_23_42/0.08)]" : "border-[#E2E8F0]"
      } ${dimmed ? "opacity-45" : ""}`}
    >
      {/* The signature clean cut: the upper-right corner fills teal when done. */}
      <span
        aria-hidden="true"
        className={`step-cut absolute top-0 right-0 w-7 h-7 rounded-tr-2xl ${handled ? "bg-[#0F8F83]" : "bg-[#F1F5F9]"}`}
      />
      <h3 id={`${id}-title`} className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={onToggle}
          className="w-full text-left flex items-start gap-3 p-4 sm:p-5 pr-10 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <span
            aria-hidden="true"
            className={`mt-1 shrink-0 w-3 h-3 rounded-full border-2 ${
              handled ? "bg-[#0F8F83] border-[#0F8F83]" : mark?.status === "skipped" ? "border-dashed border-[#94A3B8]" : "border-[#94A3B8]"
            }`}
          />
          <span className="flex-1 min-w-0">
            <span className={`block text-[17px] font-semibold leading-snug ${handled ? "text-[#475569]" : "text-[#0F172A]"}`}>
              {step.title}
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#64748B] font-medium">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                About {minutesFor(step, answers)} min{answers?.it === "provider" && step.handoff ? " to hand off" : ""}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold ${HORIZON_STYLES[horizon.key].chip}`}>
                <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${HORIZON_STYLES[horizon.key].dot}`} />
                {horizon.label}
              </span>
              {step.type && TYPE_LABELS[step.type] ? <span>{TYPE_LABELS[step.type]}</span> : null}
              <StatusChip mark={mark} />
            </span>
          </span>
          <ChevronDown
            className={`mt-1 shrink-0 w-5 h-5 text-[#64748B] transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div id={`${id}-body`} hidden={!open} className="px-4 sm:px-5 pb-5">
        <div className="border-t border-[#F1F5F9] pt-4 space-y-4">
          <p className="text-[15px] leading-relaxed text-[#0F172A]">
            <span className="font-semibold">Why now: </span>
            {step.why}
          </p>

          {bestAfter.length ? (
            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#0F172A]">Best after: </span>
              {bestAfter.map((b, i) => (
                <span key={b.id}>
                  {i ? ", " : ""}
                  <button
                    type="button"
                    onClick={() => onOpenStep?.(b.id)}
                    className="font-semibold text-[#1D4ED8] underline underline-offset-2 hover:text-[#1E40AF]"
                  >
                    {b.title}
                  </button>
                </span>
              ))}
            </p>
          ) : null}

          {knowledge === "new" && step.newcomer ? (
            <p className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-sm leading-relaxed text-[#334155]">
              <span className="font-semibold text-[#0F172A]">If this is new to you: </span>
              {step.newcomer}
            </p>
          ) : null}

          <div>
            <div role="group" aria-label="How to show this step" className="inline-flex flex-wrap gap-1 rounded-xl bg-[#F1F5F9] p-1">
              {VIEWS.map((v) => {
                const shown = resolveView(step, v.key) === v.key
                if (!shown) return null
                const on = chosen === v.key
                return (
                  <button
                    key={v.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setLocalView(v.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1D4ED8] ${
                      on ? "bg-white text-[#0F172A] shadow-sm" : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    {v.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 space-y-4">
              {chosen === "simple" ? <p className="text-[15px] leading-relaxed text-[#334155]">{step.simple}</p> : null}
              {chosen === "story" ? (
                <div className="rounded-xl bg-[#0F172A] text-[#E2E8F0] p-4 space-y-3 text-[15px] leading-relaxed">
                  {step.story.split(/\n\n+/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : null}
              {chosen === "detail" ? (
                <div className="space-y-2 text-[15px] leading-relaxed text-[#334155]">
                  {[].concat(step.detail).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : null}

              {provider ? (
                <Handoff text={forPlatform(step.handoff, answers)} />
              ) : (
                <div>
                  <p className="text-xs font-bold tracking-[0.08em] uppercase text-[#0F766E] mb-2">Do it</p>
                  <DoList step={step} answers={answers || {}} />
                </div>
              )}
            </div>
          </div>

          {step.check ? (
            <p className="flex gap-2 rounded-xl border border-[#0F8F83]/25 bg-[#F0FDFA] p-3 text-sm leading-relaxed text-[#134E4A]">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
              <span>
                <span className="font-semibold">Check it worked: </span>
                {step.check}
              </span>
            </p>
          ) : null}

          {knowledge === "expert" && step.expert ? (
            <p className="text-sm leading-relaxed text-[#334155]">
              <span className="font-semibold text-[#0F172A]">Go further: </span>
              {step.expert}
            </p>
          ) : null}

          {step.involves ? (
            <p className="flex items-center gap-2 text-sm text-[#475569]">
              <Users className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
              {step.involves}
            </p>
          ) : null}

          {step.thread ? (
            <p className="flex gap-2 text-sm text-[#475569]">
              <CornerDownRight className="w-4 h-4 mt-0.5 shrink-0 text-[#0F172A]" aria-hidden="true" />
              <span>
                <span className="font-semibold text-[#0F172A]">Points toward the Long View: </span>
                {step.thread}
              </span>
            </p>
          ) : null}

          {stepLinks.length ? (
            <div>
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#64748B] mb-2">Read more</p>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {stepLinks.map((link) => (
                  <li key={link.href} className="min-w-0">
                    <Link
                      href={link.href}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-sm font-medium text-[#1D4ED8] hover:border-[#1D4ED8]/40"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">{link.type}</span>
                      <span className="min-w-0 break-words">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="pt-1">
            <Actions step={step} mark={mark} onMark={onMark} />
          </div>
        </div>
      </div>
    </article>
  )
}
