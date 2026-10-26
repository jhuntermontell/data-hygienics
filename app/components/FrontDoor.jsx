"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, House } from "lucide-react"
import ContinuePath from "./path/ContinuePath"
import PathIcon from "./path/PathIcon"
import { BUSINESS_QUIZ, HOME_QUIZ } from "@/lib/content/path/quiz"
import { loadLocal } from "@/lib/path/storage"
import { SITE } from "@/lib/site"

// The headline's last phrase gets the cobalt-to-teal treatment: cobalt is
// Business, teal is Home, and the brand sits across both.
const HIGHLIGHT = "in order."

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
    active: "bg-[#0F766E] text-white shadow-sm",
    chip: "hover:border-[#0F8F83] hover:bg-[#F0FDFA] focus-visible:outline-[#0F766E]",
    chipIcon: "text-[#0F766E]",
    link: "text-[#0F766E] hover:text-[#115E59]",
  },
  {
    key: "business",
    label: "For my business",
    icon: Briefcase,
    question: BUSINESS_QUIZ[0],
    helper: "Pick one to start. We bring in your industry's rules and the scams aimed at it.",
    active: "bg-[#1D4ED8] text-white shadow-sm",
    chip: "hover:border-[#1D4ED8] hover:bg-[#EFF6FF] focus-visible:outline-[#1D4ED8]",
    chipIcon: "text-[#1D4ED8]",
    link: "text-[#1D4ED8] hover:text-[#1E40AF]",
  },
]

function Headline() {
  const headline = SITE.headline
  const at = headline.lastIndexOf(HIGHLIGHT)
  if (at <= 0) return headline
  return (
    <>
      {headline.slice(0, at)}
      <span className="bg-gradient-to-r from-[#1D4ED8] to-[#0F8F83] bg-clip-text text-transparent">
        {headline.slice(at)}
      </span>
    </>
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
    <section aria-labelledby="front-door-title" className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#0F8F83]/10 blur-3xl" />
        <div className="absolute -top-24 -right-48 w-[36rem] h-[36rem] rounded-full bg-[#1D4ED8]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle,#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_65%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            id="front-door-title"
            className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem] font-bold tracking-[-0.03em] text-[#0F172A] text-balance"
          >
            <Headline />
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-[#475569] text-balance">
            Independent, plain-English security for homes and small businesses living alongside AI.
          </p>
        </div>

        <ContinuePath className="mt-8 max-w-4xl mx-auto justify-center" />

        <div
          id="start"
          className="mt-8 max-w-4xl mx-auto scroll-mt-28 rounded-2xl border border-[#E2E8F0] bg-white/80 backdrop-blur-sm shadow-sm px-4 py-5 sm:p-8"
        >
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="Who is this path for?"
              className="inline-flex rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1"
            >
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
                    className={`inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full px-3 sm:px-5 py-2 text-sm sm:text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A] ${
                      selected ? tab.active : "text-[#475569] hover:text-[#0F172A]"
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
              className="mt-6 text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] text-balance">
                {tab.question.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{tab.helper}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-2.5 list-none p-0">
                {tab.question.options.map((o) => (
                  <li key={o.value}>
                    <Link
                      href={`/path/${tab.key}?start=${o.value}`}
                      className={`inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[15px] font-semibold text-[#0F172A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${tab.chip}`}
                    >
                      <PathIcon name={o.icon} className={`w-4 h-4 shrink-0 ${tab.chipIcon}`} />
                      {o.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-7 pt-5 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-sm text-[#64748B]">
            <p>Free. About two minutes. No account, and your answers stay on this device.</p>
            <Link
              href={`/path/${current.key}`}
              className={`group inline-flex items-center gap-1 font-semibold ${current.link}`}
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
