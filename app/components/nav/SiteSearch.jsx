"use client"
import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { NAV } from "@/lib/site"
import { formatMonth } from "@/lib/content"
import { useSearchIndex } from "@/lib/hooks/useSearchIndex"
import { fallbackVerdicts, search } from "@/lib/search/match"
import FoldRule from "../brand/FoldRule"
import Readout from "../brand/Readout"
import Overlay from "./Overlay"

function Hit({ row, onClose }) {
  const [, title, summary, href, reviewed] = row
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className="group grid gap-x-6 gap-y-1 sm:grid-cols-[1fr_auto] py-3.5 border-b border-night-line rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
      >
        <span className="font-display font-semibold text-[1.1875rem] leading-snug tracking-[-0.01em] group-hover:text-night-accent">{title}</span>
        {reviewed ? (
          <Readout as="span" tone="night" className="sm:row-start-1 sm:col-start-2">
            Reviewed {formatMonth(reviewed)}
          </Readout>
        ) : null}
        {summary ? <span className="text-[0.9375rem] leading-snug text-night-ink-2 sm:col-start-1">{summary}</span> : null}
      </Link>
    </li>
  )
}

function Group({ heading, rows, onClose }) {
  return (
    <section className="mt-8" aria-label={heading}>
      <FoldRule tone="night" />
      <Readout as="h3" tone="night" label className="mt-3.5 mb-1">
        {heading}
      </Readout>
      <ul className="list-none m-0 p-0">
        {rows.map((row) => (
          <Hit key={row[3]} row={row} onClose={onClose} />
        ))}
      </ul>
    </section>
  )
}

export default function SiteSearch({ open, onClose }) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState("")
  const { index, error } = useSearchIndex(open)
  const groups = useMemo(() => (index ? search(index, query) : []), [index, query])
  const suggestions = useMemo(
    () => (index?.items || []).filter((row) => row[0] === "Verdict" && row[5]).slice(0, 4).map((row) => row[5]),
    [index]
  )
  const searching = query.trim().length > 0

  return (
    <Overlay id="site-search" label="Search" open={open} onClose={onClose} initialFocus={inputRef}>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="pt-8">
        <label htmlFor="site-search-input" className="sr-only">
          Search the library
        </label>
        <div className="flex items-center border border-[#64748B] focus-within:border-[#0F8F83] focus-within:shadow-[0_0_0_1px_#0F8F83]">
          <input
            ref={inputRef}
            id="site-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck="false"
            placeholder="What happened, or what do you want to set up?"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-white placeholder:text-night-readout font-display font-medium text-[1.25rem] sm:text-[1.75rem] leading-tight px-4 sm:px-5 py-4 [&::-webkit-search-cancel-button]:hidden"
          />
          {searching ? (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="px-4 sm:px-5 text-sm font-medium text-night-ink-2 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      {suggestions.length ? (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2.5">
          <Readout as="span" tone="night" label>
            Try
          </Readout>
          {suggestions.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => {
                setQuery(text)
                inputRef.current?.focus()
              }}
              className="text-[0.9375rem] text-white underline underline-offset-4 decoration-night-line-2 hover:decoration-white text-left cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
            >
              {text}
            </button>
          ))}
        </div>
      ) : null}

      <Readout tone="night" className="mt-4">
        Searched on your device. Nothing sent.
      </Readout>

      <div aria-live="polite" className="pb-16">
        {error ? (
          <p className="mt-10 text-night-ink-2">
            Search couldn&apos;t load just now. The Threat Check and the whole library are in the menu.
          </p>
        ) : !index && searching ? (
          <Readout tone="night" className="mt-10">
            Loading the library
          </Readout>
        ) : searching && !groups.length ? (
          <div className="mt-10">
            <p className="font-display font-semibold text-[2rem] sm:text-[3rem] leading-[1.05] tracking-[-0.02em]">Nothing by that name yet</p>
            <p className="mt-3 text-[1.0625rem] text-night-ink-2">
              If something just happened, start with the{" "}
              <Link href={NAV.door.href} onClick={onClose} className="text-white underline underline-offset-4">
                Threat Check
              </Link>
              .
            </p>
            <Group heading="The closest verdicts" rows={fallbackVerdicts(index)} onClose={onClose} />
          </div>
        ) : (
          groups.map((g) => <Group key={g.kind} heading={g.heading} rows={g.items} onClose={onClose} />)
        )}
        {searching && groups.length ? (
          <Link
            href={NAV.door.href}
            onClick={onClose}
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4 decoration-night-line-2 hover:decoration-white"
          >
            Not here? Start with the Threat Check
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </Overlay>
  )
}
