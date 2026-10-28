"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Briefcase, House } from "lucide-react"
import ContinuePath from "./path/ContinuePath"
import PathIcon from "./path/PathIcon"
import { BUSINESS_QUIZ, HOME_QUIZ } from "@/lib/content/path/quiz"
import { loadLocal } from "@/lib/path/storage"
import { EVENTS, track } from "@/lib/analytics"
import { SITE } from "@/lib/site"
import FoldRule from "./brand/FoldRule"
import Readout from "./brand/Readout"
import Statement from "./brand/Statement"

const HIGHLIGHT = "in order"

// The front door: one headline, one line of what we are, one action. The
// action is the first Clear Path question, so picking what matters is the
// first step of the path itself (/path/<audience>?start=<value>).
const TABS = [
  {
    key: "home",
    label: "For my home",
    icon: House,
    question: HOME_QUIZ[0],
    helper: "Pick one to start. You can change it and add two more on the next screen.",
  },
  {
    key: "business",
    label: "For my business",
    icon: Briefcase,
    question: BUSINESS_QUIZ[0],
    helper: "Pick one to start. We bring in your industry's rules and the scams aimed at it.",
  },
]

// The headline's last phrase carries the night accent (#5EEAD4, 12.07:1 on
// navy). The rest of the headline is white.
function Headline() {
  const headline = SITE.headline
  const at = headline.lastIndexOf(HIGHLIGHT)
  if (at <= 0) return headline
  return (
    <>
      {headline.slice(0, at)}
      <span className="text-night-accent">{headline.slice(at)}</span>
    </>
  )
}

// The card by the phone, drawn as the paper object it is: our "hardware".
// It illustrates the safe-word and callback step and links to it.
function PhoneCard() {
  return (
    <figure className="m-0">
      <Link
        href="/steps/f-safe-word"
        className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]"
      >
        <div className="bg-[#F8FAFC] text-[#0F172A] px-6 pt-6 pb-5 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] [clip-path:polygon(0_0,calc(100%-34px)_0,100%_58px,100%_100%,0_100%)]">
          <Readout as="p" label>The card by the phone</Readout>
          <p className="mt-3.5 font-display font-semibold text-[1.4375rem] sm:text-[1.5625rem] leading-[1.15] tracking-[-0.015em]">
            Hang up. Call back on a number you already have.
          </p>
          <p className="mt-3 text-[0.9375rem] leading-normal text-[#475569]">If anyone calls about money, a code or an emergency.</p>
          <dl className="mt-4 border-t border-[#E2E8F0] text-sm">
            {[
              ["Our bank", "Back of the card"],
              ["Family", "Saved in your phone"],
              ["Our safe word", "Never on this card"],
            ].map(([term, detail]) => (
              <div key={term} className="flex justify-between gap-3 py-2 border-b border-[#E2E8F0]">
                <dt>{term}</dt>
                <dd className="m-0 font-readout text-[0.78rem] tracking-[0.04em] text-day-readout">{detail}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <Image src="/logo.svg" alt="" width={919} height={220} unoptimized className="h-5 w-auto" />
            <Readout as="span" label>Put it where the phone is</Readout>
          </div>
        </div>
        <figcaption className="mt-3.5">
          <Readout as="span" tone="night" className="group-hover:text-white transition-colors">
            Step · Agree on a family safe word and the callback rule
          </Readout>
        </figcaption>
      </Link>
    </figure>
  )
}

// No entrance animation here: the chips are the whole point of the page, so
// they render in the server HTML and never wait on JavaScript.
export default function FrontDoor() {
  const [active, setActive] = useState("home")
  const tabRefs = useRef({})

  // Someone who finished a business path (and no home path) on this device
  // lands on the business tab. localStorage is client-only, so read it after
  // mount; the server always renders Home.
  useEffect(() => {
    const home = loadLocal("home")?.answers?.completedAt
    const business = loadLocal("business")?.answers?.completedAt
    if (business && !home) setActive("business")
  }, [])

  function onTabKeyDown(event) {
    const keys = TABS.map((t) => t.key)
    const i = keys.indexOf(active)
    let next = null
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = keys[(i + 1) % keys.length]
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = keys[(i - 1 + keys.length) % keys.length]
    else if (event.key === "Home") next = keys[0]
    else if (event.key === "End") next = keys[keys.length - 1]
    if (!next) return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const current = TABS.find((t) => t.key === active) || TABS[0]

  return (
    <section aria-labelledby="front-door-title" className="bg-night text-night-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6 lg:items-end">
          <div className="lg:col-span-8">
            <FoldRule tone="night" draw />
            <Statement id="front-door-title" className="mt-7">
              <Headline />
            </Statement>
            <p className="mt-7 max-w-[34ch] text-lg sm:text-[1.3125rem] leading-normal text-night-ink-2 text-pretty">
              Security for homes and businesses of 1&nbsp;to&nbsp;50, in the order that protects the most.
            </p>
            <Readout tone="night" className="mt-5">
              No sponsors · No referral fees · Every number sourced
            </Readout>
          </div>
          <div className="lg:col-span-4 max-w-sm w-full">
            <PhoneCard />
          </div>
        </div>

        <ContinuePath className="mt-12" />

        <div id="start" className="mt-16 sm:mt-20 scroll-mt-24">
          <FoldRule tone="night" />
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {TABS.map((tab) => (
              <h2
                key={tab.key}
                hidden={tab.key !== active}
                className="font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-balance"
              >
                {tab.question.title}
              </h2>
            ))}
            <div role="tablist" aria-label="Who is this path for?" className="inline-flex self-start sm:self-auto border border-night-line-2">
              {TABS.map((tab) => {
                const selected = tab.key === active
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    ref={(el) => {
                      tabRefs.current[tab.key] = el
                    }}
                    type="button"
                    role="tab"
                    id={`front-door-tab-${tab.key}`}
                    aria-selected={selected}
                    aria-controls={`front-door-panel-${tab.key}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(tab.key)}
                    onKeyDown={onTabKeyDown}
                    className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83] ${
                      selected ? "bg-white text-[#0F172A]" : "text-night-ink-2 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {TABS.map((tab) => (
            <div
              key={tab.key}
              role="tabpanel"
              id={`front-door-panel-${tab.key}`}
              aria-labelledby={`front-door-tab-${tab.key}`}
              hidden={tab.key !== active}
              className="mt-6"
            >
              <p className="mb-5 text-[0.9375rem] text-night-ink-2">{tab.helper}</p>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 list-none m-0 p-0 border-t border-l border-night-line-2">
                {tab.question.options.map((o) => (
                  <li key={o.value} className="border-r border-b border-night-line-2">
                    <Link
                      href={`/path/${tab.key}?start=${o.value}`}
                      onClick={() => track(EVENTS.chipClicked, { audience: tab.key, value: o.value, from: "front-door" })}
                      className="group flex h-full items-center gap-3 px-5 py-5 text-[1.0625rem] font-medium hover:bg-night-raised transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0F8F83]"
                    >
                      <PathIcon name={o.icon} className="w-[18px] h-[18px] shrink-0 text-night-accent" />
                      <span className="flex-1">{o.label}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-night-readout group-hover:text-night-accent group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-x-6 gap-y-3">
            <Readout tone="night">About two minutes · No account · Your answers stay on this device</Readout>
            <Link
              href={`/path/${current.key}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4 decoration-night-line-2 hover:decoration-white"
            >
              Or start from the first question
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
