"use client"

// One item at a time: what it is (when we couldn't tell), its category's few
// questions as chips, and for a device, which account controls it. A section
// that scrolls into view, not a modal: nothing traps focus on a phone.
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { ArrowRight, Check, Plus, X } from "lucide-react"
import { getCategory, newItem } from "@/lib/map"
import CategorySelect from "./CategorySelect"
import { BTN_PRIMARY, BTN_QUIET, BTN_SECONDARY, FIELD, categoryLabel, chipClass, displayName, forbiddenMessage } from "./helpers"

function ChipGroup({ id, legend, options, value, onPick }) {
  return (
    <fieldset>
      <legend id={id} className="text-[15px] font-semibold text-[#0F172A]">
        {legend}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onPick(o.value)} className={chipClass(value === o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function AddAccount({ onCreate, onCancel }) {
  const [category, setCategory] = useState("google")
  const [label, setLabel] = useState("")
  const [error, setError] = useState(null)
  const create = () => {
    const problem = forbiddenMessage(label)
    if (problem) return setError(problem)
    onCreate(category, label.trim())
  }
  return (
    <div className="mt-3 border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4">
      <label htmlFor="walk-new-account" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
        Which account?
      </label>
      <CategorySelect id="walk-new-account" kind="account" value={category} onChange={setCategory} />
      <label htmlFor="walk-new-account-label" className="mt-3 block text-sm font-semibold text-[#0F172A] mb-1.5">
        Name it <span className="font-normal text-[#64748B]">(optional)</span>
      </label>
      <input
        id="walk-new-account-label"
        type="text"
        value={label}
        maxLength={60}
        autoComplete="off"
        onChange={(e) => setLabel(e.target.value)}
        placeholder="For example, Family Amazon account"
        className={FIELD}
      />
      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={create} className={BTN_SECONDARY}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add and link it
        </button>
        <button type="button" onClick={onCancel} className={BTN_QUIET}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function WalkThrough({ item, accounts, onPatch, onAddItems, onNext, hasNext, onClose }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const headingRef = useRef(null)
  const [adding, setAdding] = useState(false)
  const category = getCategory(item.category)
  const questions = category?.questions || []
  const isDevice = item.kind !== "account"

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
    headingRef.current?.focus({ preventScroll: true })
    // Re-run only when a different item opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  const answer = (qid, value) => onPatch(item.id, (it) => ({ ...it, answers: { ...it.answers, [qid]: value } }))

  const setCategory = (value) => {
    const next = getCategory(value)
    onPatch(item.id, (it) => ({
      ...it,
      category: value,
      kind: next?.kind || "device",
      controlledBy: next?.kind === "account" ? null : it.controlledBy,
    }))
  }

  const linkTo = (accountId) =>
    onPatch(item.id, (it) => {
      const answers = { ...it.answers }
      if (accountId) delete answers.account
      else answers.account = "none"
      return { ...it, controlledBy: accountId, answers }
    })

  const createAccount = (cat, label) => {
    const account = newItem({ kind: "account", category: cat, label, source: "typed" })
    onAddItems([account])
    linkTo(account.id)
    setAdding(false)
  }

  const noneChosen = !item.controlledBy && item.answers?.account === "none"

  return (
    <section ref={ref} aria-labelledby="walk-title" className="scroll-mt-24 border-2 border-[#0F766E] bg-white p-4 sm:p-6 print:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="readout-label text-[#0F766E]">Walk through</p>
          <h2 id="walk-title" ref={headingRef} tabIndex={-1} className="mt-1 text-xl font-display font-semibold tracking-[-0.01em] text-[#0F172A] focus:outline-none">
            {displayName(item)}
          </h2>
          <p className="mt-0.5 text-sm text-[#475569]">{categoryLabel(item.category)}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close the walk-through" className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]">
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {!category ? (
          <div>
            <label htmlFor="walk-category" className="block text-[15px] font-semibold text-[#0F172A] mb-2">
              What is it?
            </label>
            <CategorySelect id="walk-category" kind="device" allowUnknown value={item.category} onChange={setCategory} />
          </div>
        ) : null}

        {questions.map((q) => (
          <ChipGroup key={q.id} id={`walk-q-${q.id}`} legend={q.text} options={q.options} value={item.answers?.[q.id]} onPick={(v) => answer(q.id, v)} />
        ))}

        {isDevice && category ? (
          <fieldset>
            <legend className="text-[15px] font-semibold text-[#0F172A]">Which account controls it?</legend>
            <p className="mt-0.5 text-sm text-[#64748B]">The account its app signs in with, or the one you set it up under.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {accounts.map((a) => (
                <button key={a.id} type="button" aria-pressed={item.controlledBy === a.id} onClick={() => linkTo(a.id)} className={chipClass(item.controlledBy === a.id)}>
                  {displayName(a)}
                </button>
              ))}
              <button type="button" aria-pressed={noneChosen} onClick={() => linkTo(null)} className={chipClass(noneChosen)}>
                None / not sure
              </button>
              {!adding ? (
                <button type="button" onClick={() => setAdding(true)} className={`${chipClass(false)} inline-flex items-center gap-1.5`}>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add an account
                </button>
              ) : null}
            </div>
            {adding ? <AddAccount onCreate={createAccount} onCancel={() => setAdding(false)} /> : null}
          </fieldset>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {hasNext ? (
          <button type="button" onClick={onNext} className={BTN_PRIMARY}>
            Next
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="button" onClick={onClose} className={BTN_PRIMARY}>
            <Check className="w-4 h-4" aria-hidden="true" />
            Done
          </button>
        )}
        {hasNext ? (
          <button type="button" onClick={onClose} className={BTN_QUIET}>
            Stop for now
          </button>
        ) : null}
      </div>
    </section>
  )
}
