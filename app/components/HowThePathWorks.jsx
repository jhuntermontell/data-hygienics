import PathIcon from "./path/PathIcon"
import RouteGraphic from "./RouteGraphic"
import { longViewYear } from "@/lib/horizons"

// How Clear Path works, in three steps. Moved from the old /path landing
// when the homepage became the front door.
const HOW = [
  {
    icon: "HeartHandshake",
    title: "Tell us what matters",
    detail: "What you'd hate to lose, who you look out for, what's connected and how much time you have. About two minutes.",
  },
  {
    icon: "ListChecks",
    title: "We cut what doesn't fit",
    detail: "Everything we publish, filtered to your home or business and put in the order that protects the most first.",
  },
  {
    icon: "Sprout",
    title: "You take the next step",
    detail: "A few steps this week, told the way you like to learn: just the steps, simply, in detail, or as a story.",
  },
]

export default function HowThePathWorks() {
  const year = longViewYear()

  return (
    <section aria-labelledby="how-title" className="px-4 sm:px-6 py-16 sm:py-20 bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto">
        <h2 id="how-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          Not a checklist, a route
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#475569]">
          A checklist is the same flat list for everyone. Your path is ordered by what you said matters, sequenced so
          each step makes the next one easier, and sized to the time you actually have. Every step carries a horizon:
          now, next and the Long View through {year}, which is a direction, never a deadline.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <RouteGraphic className="block w-full h-auto max-h-[220px] lg:max-h-none lg:max-w-[480px] lg:mx-auto" />
          <ol className="grid gap-4 list-none p-0 m-0">
            {HOW.map((item, i) => (
              <li key={item.title} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="w-9 h-9 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-sm font-bold"
                  >
                    {i + 1}
                  </span>
                  <PathIcon name={item.icon} className="w-5 h-5 text-[#0F766E]" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-[#0F172A]">{item.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[#475569]">{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
