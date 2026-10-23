"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Search, X, Lightbulb } from "lucide-react"
import CitedText from "./CitedText"
import { Paragraphs, asParagraphs } from "./ArticleParts"
import { stripCitations } from "@/lib/content"
import { HORIZONS, HORIZON_ORDER, HORIZON_STYLES } from "@/lib/horizons"

const HORIZON_FILTERS = [{ key: "all", label: "All terms" }, ...HORIZON_ORDER.map((key) => HORIZONS[key])]

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const LINK_TYPES = {
  term: "Term",
  threat: "Threat",
  guide: "Guide",
  explainer: "Explainer",
}

function normalize(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
}

function letterFor(term) {
  const first = normalize(term).trim().charAt(0).toUpperCase()
  return LETTERS.includes(first) ? first : "#"
}

function letterId(letter) {
  return letter === "#" ? "letter-other" : `letter-${letter.toLowerCase()}`
}

// A-Z glossary with search over term, aliases and short definition, and a
// horizon filter (lib/horizons.js). `entries` arrive sorted A-Z
// (lib/glossary) with seeAlso already resolved into { href, label, type }
// links; `number` is the page's citation map.
export default function GlossaryList({ entries = [], number = {} }) {
  const [query, setQuery] = useState("")
  const [horizon, setHorizon] = useState("all")
  const [pendingTarget, setPendingTarget] = useState(null)
  const inputRef = useRef(null)

  // An in-page jump (#term-...) to a term the search or filter is hiding
  // clears both, then scrolls once the term is back in the DOM.
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1)
      if (!id.startsWith("term-") || document.getElementById(id)) return
      setQuery("")
      setHorizon("all")
      setPendingTarget(id)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const index = useMemo(
    () =>
      entries.map((entry) => ({
        entry,
        haystack: normalize([entry.term, ...(entry.aliases || []), stripCitations(entry.shortDef)].join(" ")),
      })),
    [entries]
  )

  const q = normalize(query).trim()
  const matches = (q ? index.filter((item) => item.haystack.includes(q)).map((item) => item.entry) : entries).filter(
    (entry) => horizon === "all" || entry.horizon === horizon
  )
  const filtering = Boolean(q) || horizon !== "all"

  const groups = []
  for (const entry of matches) {
    const letter = letterFor(entry.term)
    const last = groups[groups.length - 1]
    if (last && last.letter === letter) last.entries.push(entry)
    else groups.push({ letter, entries: [entry] })
  }
  const present = new Set(groups.map((g) => g.letter))

  // After clearing a search to follow an in-page link, scroll once the
  // target term is back in the DOM.
  useEffect(() => {
    if (!pendingTarget) return
    const el = document.getElementById(pendingTarget)
    if (el) {
      el.scrollIntoView({ block: "start" })
      el.focus({ preventScroll: true })
      window.history.replaceState(window.history.state, "", `#${pendingTarget}`)
    }
    setPendingTarget(null)
  }, [pendingTarget])

  function followTerm(event, href) {
    if (!filtering || !href.startsWith("/glossary#")) return
    event.preventDefault()
    setQuery("")
    setHorizon("all")
    setPendingTarget(href.split("#")[1])
  }

  if (!entries.length) {
    return (
      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-[#475569]">
        The first definitions are in review. Check back soon.
      </p>
    )
  }

  return (
    <div>
      <div className="md:sticky md:top-16 z-10 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-[#F8FAFC]/95 md:backdrop-blur border-b border-[#E2E8F0] sm:border-0">
        <label htmlFor="glossary-search" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
          Search the glossary
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" aria-hidden="true" />
          <input
            ref={inputRef}
            id="glossary-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “deepfake” or “passkey”"
            autoComplete="off"
            spellCheck="false"
            aria-describedby="glossary-search-status"
            className="w-full h-12 rounded-xl border border-[#CBD5E1] bg-white pl-10 pr-11 text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1D4ED8] [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>
        <p id="glossary-search-status" className="sr-only" aria-live="polite">
          {filtering ? `${matches.length} ${matches.length === 1 ? "term" : "terms"} shown` : ""}
        </p>

        <fieldset className="mt-3">
          <legend className="sr-only">Show terms by horizon</legend>
          <div className="flex flex-wrap gap-1.5">
            {HORIZON_FILTERS.map((option) => {
              const on = horizon === option.key
              return (
                <label
                  key={option.key}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold cursor-pointer focus-within:ring-2 focus-within:ring-[#1D4ED8] focus-within:ring-offset-1 ${
                    on ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
                  }`}
                >
                  <input
                    type="radio"
                    name="glossary-horizon"
                    value={option.key}
                    checked={on}
                    onChange={() => setHorizon(option.key)}
                    className="sr-only"
                  />
                  {HORIZON_STYLES[option.key] ? (
                    <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${on ? "bg-white" : HORIZON_STYLES[option.key].dot}`} />
                  ) : null}
                  {option.label}
                </label>
              )
            })}
          </div>
        </fieldset>

        <nav aria-label="Jump to letter" className="mt-3">
          <ul className="flex flex-wrap gap-1">
            {[...(present.has("#") ? ["#"] : []), ...LETTERS].map((letter) =>
              present.has(letter) ? (
                <li key={letter}>
                  <a
                    href={`#${letterId(letter)}`}
                    aria-label={letter === "#" ? "Numbers and symbols" : undefined}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold text-[#1D4ED8] bg-white border border-[#E2E8F0] hover:border-[#1D4ED8]/50"
                  >
                    {letter}
                  </a>
                </li>
              ) : (
                <li key={letter} aria-hidden="true">
                  <span className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold text-[#CBD5E1]">
                    {letter}
                  </span>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {q && matches.length > 0 ? (
        <p className="mt-6 text-sm text-[#475569]" aria-hidden="true">
          {matches.length} {matches.length === 1 ? "term matches" : "terms match"} &ldquo;{query.trim()}&rdquo;
        </p>
      ) : null}

      {matches.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-[#475569]">
          <p>
            {q ? <>No terms match &ldquo;{query.trim()}&rdquo;{horizon !== "all" ? ` in ${HORIZONS[horizon].label}` : ""}. Try a shorter word, or </> : "No terms here yet. "}
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setHorizon("all")
              }}
              className="font-semibold text-[#1D4ED8] underline underline-offset-2"
            >
              browse A to Z
            </button>
            .
          </p>
        </div>
      ) : null}

      {groups.map((group) => (
        <section key={group.letter} aria-labelledby={letterId(group.letter)} className="mt-10">
          <h2
            id={letterId(group.letter)}
            className="text-3xl font-black text-[#64748B] tracking-tight mb-4"
          >
            {group.letter === "#" ? (
              <>
                <span aria-hidden="true">#</span>
                <span className="sr-only">Numbers and symbols</span>
              </>
            ) : (
              group.letter
            )}
          </h2>
          <div className="space-y-4">
            {group.entries.map((entry) => (
              <TermCard key={entry.slug} entry={entry} number={number} onFollowTerm={followTerm} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function TermCard({ entry, number, onFollowTerm }) {
  const aliases = (entry.aliases || []).filter(Boolean)
  const links = entry.links || []

  return (
    <article
      id={`term-${entry.slug}`}
      tabIndex={-1}
      className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 target:border-[#1D4ED8]/50 target:ring-2 target:ring-[#1D4ED8]/15"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
        <h3 className="text-xl font-bold text-[#0F172A] leading-snug">{entry.term}</h3>
        {HORIZONS[entry.horizon] ? (
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${HORIZON_STYLES[entry.horizon].chip}`}
          >
            <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${HORIZON_STYLES[entry.horizon].dot}`} />
            <span className="sr-only">Horizon: </span>
            {HORIZONS[entry.horizon].label}
          </span>
        ) : null}
      </div>
      {aliases.length > 0 ? (
        <p className="text-sm text-[#64748B] mt-0.5">Also called: {aliases.join(", ")}</p>
      ) : null}

      {entry.shortDef ? (
        <p className="mt-3 text-[#0F172A] text-[17px] font-medium leading-relaxed">
          <CitedText text={entry.shortDef} number={number} />
        </p>
      ) : null}

      <div className="mt-3">
        <Paragraphs
          value={entry.longDef}
          number={number}
          className="text-[#475569] text-[15px] leading-relaxed mb-3 last:mb-0"
        />
      </div>

      {asParagraphs(entry.whyItMatters).length > 0 ? (
        <div className="mt-4 flex gap-3 rounded-xl bg-[#EFF6FF] p-4">
          <Lightbulb className="w-5 h-5 shrink-0 text-[#1D4ED8] mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-[#1D4ED8] mb-1">Why it matters to you</p>
            <Paragraphs
              value={entry.whyItMatters}
              number={number}
              className="text-[#1E3A8A] text-[15px] leading-relaxed mb-2 last:mb-0"
            />
          </div>
        </div>
      ) : null}

      {links.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#64748B] mb-2">See also</p>
          <ul className="flex flex-wrap gap-2">
            {links.map((link) => (
              <li key={link.href} className="min-w-0">
                <Link
                  href={link.href}
                  onClick={(event) => onFollowTerm(event, link.href)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-sm font-medium text-[#1D4ED8] hover:border-[#1D4ED8]/40"
                >
                  {link.type !== "term" ? (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
                      {LINK_TYPES[link.type]}
                    </span>
                  ) : null}
                  <span className="min-w-0 break-words">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}
