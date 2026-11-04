"use client"

import Link from "next/link"
import { ArrowRight, Check, RotateCcw } from "lucide-react"
import { OUTCOMES } from "@/lib/map"
import { displayName, sortFindings } from "./helpers"

const BADGES = {
  weak: { label: "Weak point", className: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]" },
  watch: { label: "Worth a look", className: "bg-white text-[#92400E] border-[#B45309]" },
  ok: { label: "Fine", className: "bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]" },
}

function FindingCard({ finding, item, step, onMark }) {
  const badge = BADGES[finding.severity] || BADGES.watch
  const done = Boolean(finding.handledAt)
  return (
    <li className={`map-finding border bg-white p-4 sm:p-5 ${done ? "border-[#E2E8F0] opacity-75" : "border-[#E2E8F0]"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center border px-2 py-0.5 text-xs font-semibold ${badge.className}`}>{badge.label}</span>
        <span className="text-xs text-[#64748B]">{OUTCOMES[finding.outcome]?.label}</span>
        {done ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E]">
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            Done
          </span>
        ) : null}
      </div>
      <h3 className={`mt-2 text-base font-semibold leading-snug text-[#0F172A] ${done ? "line-through decoration-[#94A3B8]" : ""}`}>{finding.title}</h3>
      {item ? <p className="mt-0.5 text-sm text-[#475569]">{displayName(item)}</p> : null}
      <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{finding.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {step ? (
          <Link
            href={step.href}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#0F766E] underline underline-offset-2 hover:text-[#115E59]"
          >
            Do this: {step.title}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => onMark(finding.key, !done)}
          className="inline-flex min-h-11 items-center gap-1.5 border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] print:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
        >
          {done ? <RotateCcw className="w-4 h-4" aria-hidden="true" /> : <Check className="w-4 h-4" aria-hidden="true" />}
          {done ? "Undo" : "Mark done"}
        </button>
      </div>
    </li>
  )
}

// One card per finding, weak points first. Fine findings fold away under
// "What's fine". Each card links to the public step page that fixes it.
export default function Findings({ findings, items, steps, onMark }) {
  const byId = Object.fromEntries(items.map((i) => [i.id, i]))
  const sorted = sortFindings(findings)
  const open = sorted.filter((f) => f.severity !== "ok")
  const fine = sorted.filter((f) => f.severity === "ok")
  const card = (f) => <FindingCard key={f.key} finding={f} item={f.itemId ? byId[f.itemId] : null} step={steps?.[f.stepId]} onMark={onMark} />

  return (
    <section aria-labelledby="map-findings-title">
      <h2 id="map-findings-title" className="text-xl font-display font-semibold tracking-[-0.01em] text-[#0F172A]">
        What we found
      </h2>
      {open.length ? (
        <ul className="mt-4 space-y-3 list-none p-0 m-0">{open.map(card)}</ul>
      ) : (
        <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
          No weak points from what you&apos;ve told us so far. Walk through each item to check the rest.
        </p>
      )}
      {fine.length ? (
        <details className="mt-4 border border-[#E2E8F0] bg-white">
          <summary className="flex min-h-11 cursor-pointer items-center px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">
            What&apos;s fine ({fine.length})
          </summary>
          <ul className="space-y-3 list-none p-3 sm:p-4 m-0 border-t border-[#E2E8F0]">{fine.map(card)}</ul>
        </details>
      ) : null}
    </section>
  )
}
