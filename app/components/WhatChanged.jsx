import { WHAT_CHANGED } from "@/lib/content/home"
import { getSource } from "@/lib/sources"
import { stripCitations } from "@/lib/content"

// Homepage strip of short facts about what AI changed, each footnoted to a
// named, dated source listed underneath. Facts whose source doesn't resolve
// are dropped (every number needs a source); the strip hides when empty.

function sourceYear(source) {
  return typeof source.published === "string" ? source.published.slice(0, 4) : ""
}

export default function WhatChanged() {
  const facts = (Array.isArray(WHAT_CHANGED) ? WHAT_CHANGED : [])
    .map((fact) => ({ ...fact, source: getSource(fact.sourceId) }))
    .filter((fact) => fact.source && fact.figure && fact.text)

  if (!facts.length) return null

  // Number sources by first appearance; collect each source's locators.
  const notes = []
  const numberOf = {}
  for (const fact of facts) {
    if (!numberOf[fact.sourceId]) {
      notes.push({ id: fact.sourceId, source: fact.source, locators: [] })
      numberOf[fact.sourceId] = notes.length
    }
    const note = notes[numberOf[fact.sourceId] - 1]
    if (fact.locator && !note.locators.includes(fact.locator)) note.locators.push(fact.locator)
  }

  const columns =
    {
      1: "",
      2: "sm:grid-cols-2",
      3: "md:grid-cols-3",
      4: "sm:grid-cols-2 lg:grid-cols-4",
      6: "sm:grid-cols-2 lg:grid-cols-3",
    }[facts.length] ?? "sm:grid-cols-2 lg:grid-cols-4"

  return (
    <section aria-labelledby="what-changed-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#0F766E]">What changed</p>
          <h2 id="what-changed-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            What changed when AI moved in
          </h2>
          <p className="mt-3 text-[#475569] text-lg leading-relaxed">
            The short version, with a source for every number. No scare tactics, just the shift you&apos;re
            already living through.
          </p>
        </div>

        <ul className={`mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#E2E8F0] list-none p-0 ${columns}`}>
          {facts.map((fact) => {
            const n = numberOf[fact.sourceId]
            return (
              <li key={`${fact.sourceId}-${fact.figure}`} className="bg-white p-6 sm:p-7 flex flex-col">
                <p className="text-4xl sm:text-[2.75rem] font-extrabold leading-none tracking-tight bg-gradient-to-br from-[#1D4ED8] to-[#0F766E] bg-clip-text text-transparent break-words">
                  {fact.figure}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-[#334155]">
                  {stripCitations(fact.text)}
                  <sup className="ml-0.5 text-[11px] font-semibold">
                    <a
                      href={`#what-changed-src-${fact.sourceId}`}
                      aria-label={`Source ${n}: ${fact.source.label}`}
                      className="text-[#1D4ED8] hover:text-[#1E40AF] no-underline"
                    >
                      [{n}]
                    </a>
                  </sup>
                </p>
              </li>
            )
          })}
        </ul>

        <div className="mt-6">
          <h3 className="sr-only">Sources for these figures</h3>
          <ol className="space-y-1.5 list-none p-0 text-xs leading-relaxed text-[#64748B]">
            {notes.map(({ id, source, locators }, i) => (
              <li key={id} id={`what-changed-src-${id}`} className="flex gap-2 scroll-mt-28">
                <span className="shrink-0 font-semibold text-[#475569]">[{i + 1}]</span>
                <span className="min-w-0 break-words">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#334155] underline underline-offset-2 hover:text-[#1D4ED8]"
                  >
                    {source.label}
                  </a>
                  {source.publisher ? <>, {source.publisher}</> : null}
                  {sourceYear(source) ? <> ({sourceYear(source)})</> : null}
                  {locators.length ? <>. {locators.join("; ")}</> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
