"use client"

import { useState } from "react"
import { Check, Users, LayoutGrid } from "lucide-react"

// A plain chooser over server-rendered panels, built on the AudienceChips
// pattern: pressed chips show a check mark, so state never rests on color
// alone. Every panel shows until a chip is pressed, so the page reads as a
// complete table without JavaScript. `options` is [{ key, label }] (plain
// text) and `items` is [{ key, node }] where `node` carries citations.
export default function TierChecker({ question, options = [], items = [] }) {
  const [selected, setSelected] = useState("all")
  const [touched, setTouched] = useState(false)

  function choose(key) {
    setSelected(key)
    setTouched(true)
  }

  const visible = selected === "all" ? items : items.filter((item) => item.key === selected)
  const chosen = options.find((o) => o.key === selected)
  const chips = [...options, { key: "all", label: "Show every band", all: true }]

  return (
    <div>
      {question ? <p className="font-display font-semibold text-[1.125rem] text-[#0F172A] mb-3">{question}</p> : null}
      <div role="group" aria-label={question || "Choose a band"} className="flex flex-wrap gap-2 mb-5">
        {chips.map(({ key, label, all }) => {
          const active = selected === key
          const ChipIcon = active ? Check : all ? LayoutGrid : Users
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => choose(key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-3.5 sm:py-2 text-sm font-semibold motion-safe:transition-colors ${
                active
                  ? "bg-[#0F172A] text-white border-[#0F172A]"
                  : "bg-white text-[#334155] border-[#CBD5E1] hover:border-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <ChipIcon className="w-4 h-4" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {touched ? (chosen ? `Showing the band for ${chosen.label}` : "Showing every band") : ""}
      </p>
      <ul className="space-y-3">
        {visible.map((item) => (
          <li key={item.key} className="min-w-0">
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  )
}
