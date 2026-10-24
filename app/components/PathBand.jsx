import Link from "next/link"
import { ArrowRight, Briefcase } from "lucide-react"
import PathIcon from "./path/PathIcon"
import { HOME_QUIZ } from "@/lib/content/path/quiz"

// Homepage band for Clear Path: the first quiz question, inline. Picking a
// chip starts the Home quiz with that answer already chosen; "My business"
// starts the Business flow. StartThisWeek stays as the unpersonalized list.
const CHIPS = ["memories", "money", "accounts", "people", "privacy"]

export default function PathBand() {
  const first = HOME_QUIZ[0]
  const chips = CHIPS.map((value) => first.options.find((o) => o.value === value)).filter(Boolean)

  return (
    <section aria-labelledby="path-band-title" className="px-4 sm:px-6 py-14 sm:py-20 bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">Clear Path</p>
          <h2 id="path-band-title" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Start with what you&apos;d hate to lose.
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#CBD5E1]">
            Answer a few questions and get your steps in order, fitted to your home or business and the time you
            have. About two minutes. No account, and your answers stay on this device.
          </p>
          <Link
            href="/path"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[15px] font-semibold text-[#0F172A] hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Map my path
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-6">
          <p className="text-sm font-semibold">{first.title}</p>
          <p className="mt-1 text-sm text-[#94A3B8]">Pick one to start. You can add two more.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 list-none p-0 m-0">
            {chips.map((o) => (
              <li key={o.value}>
                <Link
                  href={`/path/home?start=${o.value}`}
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[15px] font-semibold hover:border-[#0F8F83] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <PathIcon name={o.icon} className="w-5 h-5 text-[#5EEAD4]" />
                  {o.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/path/business"
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[15px] font-semibold hover:border-[#93C5FD] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Briefcase className="w-5 h-5 text-[#93C5FD]" aria-hidden="true" />
                My business
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
