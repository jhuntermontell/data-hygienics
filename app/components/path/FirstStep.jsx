"use client"
import { useMemo, useState } from "react"
import { ArrowDown, ArrowRight, Check, ChevronDown, RotateCcw, ShieldCheck, Users } from "lucide-react"
import { AfterLine, DoList, DoneRitual, SayThis, StepTiming } from "./StepCard"
import { QUIZZES, STATUS, buildPath, minutesFor, thisWeek, withDefaults } from "@/lib/path"
import { EVENTS, track } from "@/lib/analytics"

// The first click pays: a visitor who arrives with ?start=<first answer>
// (a front-door or verdict chip) sees one step they can do now, before any
// question. The step comes from a provisional path built the same way the
// real one is: buildPath over withDefaults plus the start answer, so it is a
// step their finished path will contain.
//
// Which step: the quickest starter step for today, in path order, that
// serves what they picked (for Home, a step whose `domains` include the
// start value; for Business, whose first answer is the industry, a step in
// the industry stage). If none fits in FIRST_STEP_MAX_MINUTES, it falls back
// to thisWeek(...)[0], the path's own first pick.
//
// Marking it done writes to the same progress record the path uses, so the
// mark is there when the quiz finishes. PathExperience stops rendering this
// once the path is complete.

const FIRST_STEP_MAX_MINUTES = 30

const ACCENTS = {
  home: { button: "bg-[#0F766E] hover:bg-[#115E59]", bar: "bg-[#0F8F83]", link: "text-[#0F766E] hover:text-[#115E59]" },
  business: { button: "bg-[#1D4ED8] hover:bg-[#1E40AF]", bar: "bg-[#1D4ED8]", link: "text-[#1D4ED8] hover:text-[#1E40AF]" },
}

function provisionalPath(audience, start) {
  const first = QUIZZES[audience][0]
  const answers = withDefaults(audience, { [first.id]: first.type === "single" ? start : [start] })
  return buildPath(audience, answers)
}

function firstStepFor(path, start) {
  const serves = path.audience === "business" ? (s) => s.stage === "industry" : (s) => (s.domains || []).includes(start)
  let pick = null
  for (const s of path.steps) {
    if (!serves(s) || s.level !== "starter" || (s.horizon || "now") !== "now") continue
    if (!pick || minutesFor(s, path.answers) < minutesFor(pick, path.answers)) pick = s
  }
  if (pick && minutesFor(pick, path.answers) <= FIRST_STEP_MAX_MINUTES) return pick
  return thisWeek(path)[0] || null
}

export default function FirstStep({ audience, start, progress = {}, onMark, onFit, onSkip, collapsed }) {
  const { path, step } = useMemo(() => {
    const built = provisionalPath(audience, start)
    return { path: built, step: built ? firstStepFor(built, start) : null }
  }, [audience, start])
  const [expanded, setExpanded] = useState(false)
  if (!step) return null

  const styles = ACCENTS[audience] || ACCENTS.home
  const mark = progress[step.id]
  const handled = Boolean(STATUS[mark?.status]?.handled)
  const milestone = path.stages.find((s) => s.id === step.stage)?.milestone
  const ritual = !handled
    ? null
    : step.after
      ? { label: "Now true", text: step.after }
      : milestone
        ? { label: "One step closer to this", text: milestone }
        : null
  const done = () => {
    track(EVENTS.stepDone, { audience, id: step.id, status: "done" })
    onMark(step.id, "done")
  }
  const showBody = !collapsed || expanded

  const button =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"

  return (
    <section aria-labelledby="first-step-title" className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${styles.bar}`} />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#475569]">
              {handled ? "Your first step: done" : "Your first step, before any questions"}
            </p>
            <h2 id="first-step-title" className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] text-balance">
              {step.title}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#64748B]">
              <StepTiming step={step} answers={path.answers} />
              {step.involves ? (
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  {step.involves}
                </span>
              ) : null}
              {handled ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#0F8F83]/30 bg-[#F0FDFA] px-2.5 py-0.5 font-semibold text-[#0F766E]">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  Done
                </span>
              ) : null}
            </p>
          </div>
          {collapsed ? (
            <button
              type="button"
              aria-expanded={showBody}
              aria-controls="first-step-body"
              onClick={() => setExpanded((v) => !v)}
              className={`${button} shrink-0 text-[#475569] hover:bg-[#F1F5F9]`}
            >
              {showBody ? "Hide" : "Show"}
              <span className="sr-only"> the first step</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showBody ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div id="first-step-body" hidden={!showBody} className="mt-4 space-y-4">
          <AfterLine step={step} />
          <p className="text-[15px] leading-relaxed text-[#0F172A]">
            <span className="font-semibold">Why now: </span>
            {step.why}
          </p>
          <div>
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-[#0F766E] mb-2">Do it</p>
            <DoList step={step} answers={path.answers} />
          </div>
          <SayThis step={step} />
          {step.check ? (
            <p className="flex gap-2 rounded-xl border border-[#0F8F83]/25 bg-[#F0FDFA] p-3 text-sm leading-relaxed text-[#134E4A]">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
              <span>
                <span className="font-semibold">Check it worked: </span>
                {step.check}
              </span>
            </p>
          ) : null}
          <div>
            {handled ? (
              <button type="button" onClick={() => onMark(step.id, null)} className={`${button} text-[#475569] hover:bg-[#F1F5F9]`}>
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Undo
              </button>
            ) : (
              <button type="button" onClick={done} className={`${button} bg-[#0F766E] text-white hover:bg-[#115E59]`}>
                <Check className="w-4 h-4" aria-hidden="true" />
                I&apos;ve done this
              </button>
            )}
            <DoneRitual ritual={ritual} />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-[#F1F5F9]">
          <p className="text-sm leading-relaxed text-[#475569]">
            {handled ? "That's a real start. " : ""}
            This is one step from your path. A few questions put the rest in order for{" "}
            {audience === "business" ? "your business" : "your home"}.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {collapsed ? null : (
              <button type="button" onClick={onFit} className={`${button} text-white ${styles.button}`}>
                Make it fit, about two minutes
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <button type="button" onClick={onSkip} className={`${button} ${styles.link} hover:bg-[#F1F5F9]`}>
              Skip the questions
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-xs text-[#64748B]">
            Skipping uses sensible defaults. You can change your answers any time.
          </p>
        </div>
      </div>
    </section>
  )
}
