"use client"

import { useEffect, useState } from "react"
import { House, Briefcase, LayoutGrid, Check } from "lucide-react"

const OPTIONS = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "home", label: "Home", icon: House },
  { key: "business", label: "Business", icon: Briefcase },
]

function plural(count, [one, many]) {
  return `${count} ${count === 1 ? one : many}`
}

// Home / Business / All toggle buttons. The pressed chip is filled and
// shows a check mark, so state never rests on color alone.
export function AudienceChips({ value, onChange, counts, nouns = ["entry", "entries"], label = "Filter by audience" }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {OPTIONS.map(({ key, label: text, icon: Icon }) => {
        const active = value === key
        const ChipIcon = active ? Check : Icon
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            aria-label={counts ? `${text}, ${plural(counts[key], nouns)}` : undefined}
            onClick={() => onChange(key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-3.5 sm:py-2 text-sm font-semibold motion-safe:transition-colors ${
              active
                ? "bg-[#0F172A] text-white border-[#0F172A]"
                : "bg-white text-[#334155] border-[#CBD5E1] hover:border-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <ChipIcon className="w-4 h-4" aria-hidden="true" />
            {text}
            {counts ? (
              <span
                className={`ml-0.5 rounded-full px-1.5 text-xs font-semibold ${
                  active ? "bg-white/15 text-white" : "bg-[#F1F5F9] text-[#475569]"
                }`}
              >
                {counts[key]}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function countByAudience(items) {
  return {
    all: items.length,
    home: items.filter((item) => item.audience?.includes("home")).length,
    business: items.filter((item) => item.audience?.includes("business")).length,
  }
}

// Filterable card grid. `items` is [{ key, audience: [...], node }] where
// `node` is a server-rendered card. ?for=home or ?for=business preselects a
// filter so hubs can deep-link.
export default function AudienceFilter({
  items = [],
  nouns = ["entry", "entries"],
  label = "Filter by audience",
  param = "for",
  listClassName = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  emptyMessage = "Nothing here yet for this audience.",
}) {
  const [audience, setAudience] = useState("all")
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    try {
      const value = new URLSearchParams(window.location.search).get(param)
      if (value === "home" || value === "business") setAudience(value)
    } catch {
      // No URL access (unusual); keep "all".
    }
  }, [param])

  function choose(key) {
    setAudience(key)
    setTouched(true)
    try {
      const url = new URL(window.location.href)
      if (key === "all") url.searchParams.delete(param)
      else url.searchParams.set(param, key)
      window.history.replaceState(window.history.state, "", url)
    } catch {
      // Filtering still works without the URL update.
    }
  }

  const counts = countByAudience(items)
  const visible = audience === "all" ? items : items.filter((item) => item.audience?.includes(audience))
  const status =
    audience === "all"
      ? `Showing all ${plural(visible.length, nouns)}`
      : `Showing ${plural(visible.length, nouns)} for ${audience === "home" ? "Home" : "Business"}`

  return (
    <div>
      <div className="mb-5">
        <AudienceChips value={audience} onChange={choose} counts={counts} nouns={nouns} label={label} />
      </div>
      <p className="sr-only" aria-live="polite">
        {touched ? status : ""}
      </p>
      {visible.length > 0 ? (
        <ul className={listClassName}>
          {visible.map((item) => (
            <li key={item.key} className="min-w-0">
              {item.node}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-sm text-[#475569]">
          {emptyMessage}
        </p>
      )}
    </div>
  )
}
