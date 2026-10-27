"use client"
import { useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import PathIcon from "./PathIcon"
import { matchesWhen } from "@/lib/path"

// Screen-by-screen quiz. Questions come from lib/content/path/quiz.js:
//   { id, title, helper, type: "single" | "multi" | "rank", max, optional, options, when }
// `when` shows a question only if earlier answers match, e.g.
// { priorities: ["kids"] } (the answer is, or includes, one of the values).
// "rank" is a multi-select where the order you pick is the priority order,
// shown as numbered badges. Each screen is a fieldset with a legend, inputs
// are real radios and checkboxes, and focus moves to the new heading on each
// step so keyboard and screen reader users keep their place.

const ACCENTS = {
  home: { ring: "focus-within:ring-[#0F766E]", on: "border-[#0F766E] bg-[#F0FDFA]", badge: "bg-[#0F766E]", button: "bg-[#0F766E] hover:bg-[#115E59]", bar: "bg-[#0F8F83]" },
  business: { ring: "focus-within:ring-[#1D4ED8]", on: "border-[#1D4ED8] bg-[#EFF6FF]", badge: "bg-[#1D4ED8]", button: "bg-[#1D4ED8] hover:bg-[#1E40AF]", bar: "bg-[#1D4ED8]" },
}

// A real radio or checkbox, visually hidden, inside a card-style label.
function Option({ option, name, type, on, rank, disabled, onToggle, styles }) {
  return (
    <label
      className={`relative flex items-start gap-3 border-2 bg-white px-4 py-3.5 cursor-pointer transition-colors ring-offset-2 focus-within:ring-2 ${styles.ring} ${
 on ? styles.on : "border-[#E2E8F0] hover:border-[#CBD5E1]"
 } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type={type}
        name={name}
        value={option.value}
        checked={on}
        disabled={disabled}
        onChange={onToggle}
        className="sr-only"
      />
      {option.icon ? (
        <span
          aria-hidden="true"
          className={`mt-0.5 shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
            on ? `${styles.badge} text-white` : "bg-[#F1F5F9] text-[#334155]"
          }`}
        >
          <PathIcon name={option.icon} className="w-[18px] h-[18px]" />
        </span>
      ) : null}
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-semibold text-[#0F172A]">
          {option.label}
          {rank ? <span className="sr-only">, priority {rank}</span> : null}
        </span>
        {option.description ? <span className="mt-0.5 block text-sm leading-snug text-[#475569]">{option.description}</span> : null}
      </span>
      <span
        aria-hidden="true"
        className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          on ? `${styles.badge} text-white` : "border-2 border-[#CBD5E1]"
        }`}
      >
        {rank || (on ? <Check className="w-3.5 h-3.5" /> : null)}
      </span>
    </label>
  )
}

function visible(questions, answers) {
  return questions.filter((q) => matchesWhen(q.when, answers))
}

// Continue needs an answer; optional questions offer Skip instead.
function isAnswered(q, value) {
  if (q.type === "single") return Boolean(value)
  return Array.isArray(value) && value.length > 0
}

// Consecutive options that share a `group` render under one label.
function groupOptions(options) {
  const groups = []
  for (const option of options) {
    const tail = groups[groups.length - 1]
    if (tail && tail.group === (option.group || null)) tail.options.push(option)
    else groups.push({ group: option.group || null, options: [option] })
  }
  return groups
}

export default function QuizRunner({ questions, answers, onChange, onComplete, onExit, accent = "home", intro }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const headingRef = useRef(null)
  const focusNext = useRef(false)
  const steps = visible(questions, answers)
  const q = steps[Math.min(index, steps.length - 1)]
  const value = answers[q.id]
  const styles = ACCENTS[accent]
  const last = index >= steps.length - 1

  // With AnimatePresence mode="wait" the next screen mounts only after the
  // old one exits, so focus moves from the new heading's ref callback, not
  // from an effect (which would still see the old heading).
  const focusHeading = (el) => {
    headingRef.current = el
    if (el && focusNext.current) {
      focusNext.current = false
      el.focus()
    }
  }
  const go = (delta) => {
    focusNext.current = true
    setIndex((i) => i + delta)
  }

  const setValue = (next) => onChange({ ...answers, [q.id]: next })

  const toggle = (optionValue) => {
    if (q.type === "single") {
      setValue(optionValue)
      return
    }
    const current = Array.isArray(value) ? value : []
    const exclusive = new Set(q.options.filter((o) => o.exclusive).map((o) => o.value))
    if (current.includes(optionValue)) setValue(current.filter((v) => v !== optionValue))
    else if (exclusive.has(optionValue)) setValue([optionValue])
    else if (!q.max || current.length < q.max) setValue([...current.filter((v) => !exclusive.has(v)), optionValue])
  }

  // onComplete gets the final answers: a Skip on the last question has
  // only just removed its answer, so the parent's copy is one render behind.
  const advance = (latest) => (last ? onComplete(latest) : go(1))
  const next = () => {
    if (isAnswered(q, value)) advance(answers)
  }
  const skip = () => {
    const { [q.id]: _skipped, ...rest } = answers
    onChange(rest)
    advance(rest)
  }
  const back = () => (index === 0 ? onExit?.() : go(-1))

  const selected = q.type === "single" ? (value ? [value] : []) : Array.isArray(value) ? value : []
  const full = q.max && q.type !== "single" && selected.length >= q.max
  const progress = Math.round(((index + 1) / steps.length) * 100)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 text-xs font-semibold text-[#64748B]">
        <span>
          Question {index + 1} of {steps.length}
        </span>
        {intro ? <span className="truncate">{intro}</span> : null}
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden" aria-hidden="true">
        <motion.div
          className={`h-full rounded-full ${styles.bar}`}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.form
          key={q.id}
          initial={reduce ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onSubmit={(e) => {
            e.preventDefault()
            next()
          }}
          className="mt-8"
        >
          <fieldset>
            <legend className="w-full">
              <h2
                ref={focusHeading}
                tabIndex={-1}
                className="text-2xl sm:text-3xl font-display font-semibold tracking-[-0.02em] text-[#0F172A] text-balance focus:outline-none"
              >
                {q.title}
              </h2>
              {q.helper ? <span className="mt-2 block text-[15px] leading-relaxed text-[#475569]">{q.helper}</span> : null}
              {q.max && q.type !== "single" ? (
                <span className="mt-2 block text-xs font-semibold text-[#64748B]" aria-live="polite">
                  {selected.length} of {q.max} picked{q.type === "rank" ? ", in order of importance" : ""}
                </span>
              ) : null}
            </legend>

            {q.why ? (
              <details className="mt-3 group">
                <summary className="inline-flex items-center gap-1 text-xs font-semibold text-[#475569] cursor-pointer hover:text-[#0F172A] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]">
                  Why we ask
                </summary>
                <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                  {q.why} Your answers stay on this device unless you save your path.
                </p>
              </details>
            ) : null}

            {groupOptions(q.options).map(({ group, options }) => (
              <div key={group || "all"} className="mt-6">
                {group ? (
                  <p className="mb-2 readout-label text-[#64748B]">{group}</p>
                ) : null}
                <div className={`grid gap-3 ${q.options.length > 5 ? "sm:grid-cols-2" : ""}`}>
                  {options.map((option) => {
                    const on = selected.includes(option.value)
                    return (
                      <Option
                        key={option.value}
                        option={option}
                        name={q.id}
                        type={q.type === "single" ? "radio" : "checkbox"}
                        on={on}
                        rank={q.type === "rank" && on ? selected.indexOf(option.value) + 1 : null}
                        disabled={!on && full}
                        onToggle={() => toggle(option.value)}
                        styles={styles}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {index === 0 ? "Change path" : "Back"}
            </button>
            <span className="flex items-center gap-2">
              {q.optional ? (
                <button
                  type="button"
                  onClick={skip}
                  className="px-3 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                >
                  Skip
                </button>
              ) : null}
              <button
                type="submit"
                disabled={!isAnswered(q, value)}
                className={`inline-flex items-center gap-2 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A] ${styles.button}`}
              >
                {last ? "Show my path" : "Continue"}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </span>
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  )
}
