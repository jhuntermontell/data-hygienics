import PathIcon from "./path/PathIcon"
import RouteGraphic from "./RouteGraphic"
import FoldRule from "./brand/FoldRule"
import Readout from "./brand/Readout"
import NamedCard from "./brand/NamedCard"
import { longViewYear } from "@/lib/horizons"
import { verdicts } from "@/lib/verdicts"
import { allStepParams } from "@/lib/steps"

// How Clear Path works, in three steps, then the tools as one system: each
// one feeds the Path or reads from it. A day surface between the navy hero
// and the navy losses band.
const HOW = [
  {
    icon: "HeartHandshake",
    title: "Name what you'd hate to lose",
    detail: "What you'd hate to lose, who you look out for, what's connected and how much time you have. About two minutes.",
  },
  {
    icon: "ListChecks",
    title: "We cut what doesn't fit",
    detail: "Everything we publish, filtered to your home or business and put in the order that protects the most first.",
  },
  {
    icon: "Sprout",
    title: "Take the next step",
    detail: "A few steps this week, told the way you like to learn: just the steps, simply, in detail, or as a story.",
  },
]

export default function HowThePathWorks() {
  const year = longViewYear()
  const stepCount = allStepParams().length

  const SYSTEM = [
    {
      name: "Threat Check",
      imperative: "Check it before you act",
      href: "/check",
      body: "One verdict per message type, each ending in the Path step that stops the next one.",
      readout: `${verdicts.length} verdicts · Free`,
    },
    {
      name: "Clear Path",
      imperative: "Know the next step",
      href: "/#start",
      body: "Everything we publish, cut to your home or business and put in order.",
      readout: `${stepCount} steps · Free`,
    },
    {
      name: "Ask",
      imperative: "Get the answer, with the source",
      href: "/tools/ask",
      body: "Answers only from our published research, citing the page. When we don't know yet, it says so.",
      readout: "Members",
    },
    {
      name: "Cyber Audit",
      imperative: "Find the gaps. Close them",
      href: "/tools/cyber-audit",
      body: "For businesses: a plain-English audit, including how your team uses AI, with the fixes in order.",
      readout: "Free Quick Check · Business members",
    },
  ]

  return (
    <section aria-labelledby="how-title" className="bg-white text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <FoldRule />
        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Readout label>Clear Path</Readout>
            <h2 id="how-title" className="mt-3 font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-balance">
              Not a checklist, a route
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-[#475569]">
              A checklist is the same flat list for everyone. Your path is ordered by what you said matters, sequenced so
              each step makes the next one easier, and sized to the time you actually have. Every step carries a horizon:
              now, next and the Long View through {year}, which is a direction, never a deadline.
            </p>
            <RouteGraphic className="mt-8 block w-full h-auto max-h-[200px] lg:max-w-[420px]" />
          </div>
          <ol className="lg:col-span-6 lg:col-start-7 grid gap-0 list-none p-0 m-0 border-t border-[#E2E8F0]">
            {HOW.map((item, i) => (
              <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-x-4 py-6 border-b border-[#E2E8F0]">
                <span className="readout pt-1 text-[#0F766E]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="flex items-center gap-2.5 font-display font-semibold text-[1.3125rem] leading-tight tracking-[-0.01em]">
                    <PathIcon name={item.icon} className="w-5 h-5 text-[#0F766E]" />
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#475569]">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 sm:mt-24">
          <h2 className="font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-balance">
            One Path. Every tool feeds it
          </h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 list-none p-0 m-0">
            {SYSTEM.map((tool) => (
              <li key={tool.name}>
                <NamedCard tone="day" name={tool.name} imperative={tool.imperative} href={tool.href} readout={tool.readout}>
                  {tool.body}
                </NamedCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
