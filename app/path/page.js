import Link from "next/link"
import { ArrowRight, Briefcase, House, Lock, Scissors, Telescope } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import BrandMark from "@/app/components/BrandMark"
import ContinuePath from "@/app/components/path/ContinuePath"
import PathIcon from "@/app/components/path/PathIcon"
import { breadcrumbSchema } from "@/lib/schema"
import { HORIZONS, HORIZON_ORDER, HORIZON_STYLES, longViewYear } from "@/lib/horizons"
import { QUIZZES } from "@/lib/path"
import { SITE } from "@/lib/site"

const title = "Clear Path: Your Security Steps, in Order | Data Hygienics"
const description =
  "Start with what you'd hate to lose. Answer a few questions and get your home or business security steps in order, sized to your week. Free, no account needed."

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/path` },
  openGraph: { title, description, url: `${SITE.url}/path` },
}

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

export default function PathLandingPage() {
  const year = longViewYear()
  const homeFirst = QUIZZES.home[0]
  const businessFirst = QUIZZES.business[0]

  return (
    <>
      <SchemaScript
        schema={breadcrumbSchema([
          { name: "Data Hygienics", path: "/" },
          { name: "Clear Path", path: "/path" },
        ])}
      />
      <Navbar />
      <main className="bg-white text-[#0F172A]">
        <section aria-labelledby="path-title" className="relative overflow-hidden bg-[#0F172A] text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 w-[30rem] h-[30rem] rounded-full bg-white/5" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-20 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">Clear Path</p>
              <h1 id="path-title" className="mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl font-bold tracking-tight text-balance">
                Start with what you&apos;d hate to lose.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#CBD5E1]">
                Answer a few questions and get your steps in order, fitted to your home or business and the time you
                have. No account, and your answers stay on this device.
              </p>
              <ContinuePath className="mt-6" />
            </div>
            <div className="hidden lg:flex w-56 h-56 rounded-[2.5rem] bg-white items-center justify-center">
              <BrandMark className="w-36 h-36" title="Data Hygienics" />
            </div>
          </div>
        </section>

        <section aria-label="Choose your path" className="px-4 sm:px-6 -mt-2 pt-12 pb-16">
          <ul className="max-w-6xl mx-auto grid gap-5 md:grid-cols-2 list-none p-0">
            <li className="flex flex-col rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 sm:p-8">
              <span className="w-12 h-12 rounded-xl bg-[#0F8F83] text-white flex items-center justify-center">
                <House className="w-6 h-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">Clear Path for Home</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
                For families, parents, remote workers and anyone looking out for an older relative.
              </p>
              <p className="mt-5 text-sm font-semibold text-[#0F172A]">{homeFirst.title} Pick one to start:</p>
              <ul className="mt-3 flex flex-wrap gap-2 list-none p-0">
                {homeFirst.options.map((o) => (
                  <li key={o.value}>
                    <Link
                      href={`/path/home?start=${o.value}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm font-medium text-[#0F172A] hover:border-[#0F8F83] hover:bg-[#F0FDFA]"
                    >
                      <PathIcon name={o.icon} className="w-4 h-4 text-[#0F766E]" />
                      {o.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/path/home"
                className="mt-6 self-start inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#115E59]"
              >
                Map my home path
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <p className="mt-2 text-xs text-[#64748B]">About two minutes. Nothing to sign up for.</p>
            </li>
            <li className="flex flex-col rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 sm:p-8">
              <span className="w-12 h-12 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center">
                <Briefcase className="w-6 h-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">Clear Path for Business</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
                For owner-operators and whoever got handed IT at a team of up to 50.
              </p>
              <p className="mt-5 text-sm font-semibold text-[#0F172A]">Start with your industry:</p>
              <ul className="mt-3 flex flex-wrap gap-2 list-none p-0">
                {businessFirst.options.map((o) => (
                  <li key={o.value}>
                    <Link
                      href={`/path/business?start=${o.value}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm font-medium text-[#0F172A] hover:border-[#1D4ED8] hover:bg-[#EFF6FF]"
                    >
                      <PathIcon name={o.icon} className="w-4 h-4 text-[#1D4ED8]" />
                      {o.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/path/business"
                className="mt-6 self-start inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#1E40AF]"
              >
                Map my business path
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <p className="mt-2 text-xs text-[#64748B]">Free. About three minutes.</p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="how-title" className="px-4 sm:px-6 py-16 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto">
            <h2 id="how-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
              Not a checklist. A route.
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#475569]">
              A checklist is the same flat list for everyone. Your path is ordered by what you said matters, sequenced
              so each step makes the next one easier, and sized to the time you actually have.
            </p>
            <ol className="mt-8 grid gap-4 md:grid-cols-3 list-none p-0">
              {HOW.map((item, i) => (
                <li key={item.title} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <PathIcon name={item.icon} className="w-5 h-5 text-[#0F766E]" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#475569]">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="horizons-title" className="px-4 sm:px-6 py-16">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#0F172A]">
                <Telescope className="w-4 h-4" aria-hidden="true" />
                The Long View
              </p>
              <h2 id="horizons-title" className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-balance">
                We start from {year} and work back to today.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">
                Every step carries a horizon. Today&apos;s steps stop the scams that are everywhere right now. The
                same steps, chosen well, keep working as AI agents start paying bills, voices and video get easier to
                fake, and passwords give way to passkeys. {year} isn&apos;t a deadline. It&apos;s a direction.
              </p>
              <Link
                href="/glossary"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
              >
                Learn the words for what&apos;s coming
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <ol className="grid gap-3 list-none p-0">
              {HORIZON_ORDER.map((key) => {
                const h = HORIZONS[key]
                return (
                  <li key={key} className="flex gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4">
                    <span aria-hidden="true" className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${HORIZON_STYLES[key].solid}`}>
                      {h.verb}
                    </span>
                    <span>
                      <span className="block font-bold">
                        {h.label} <span className="font-normal text-[#64748B]">· {key === "future" ? `through ${year}` : h.window.toLowerCase()}</span>
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-[#475569]">{h.description}</span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        <section aria-labelledby="promise-title" className="px-4 sm:px-6 pb-20">
          <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
              <h2 id="promise-title" className="flex items-center gap-2 text-lg font-bold">
                <Lock className="w-5 h-5 text-[#0F766E]" aria-hidden="true" />
                Your path stays yours
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
                Your answers live in this browser. Save them to a free account only if you want them on another
                device, and export or delete them any time. We never ask for passwords, account numbers or anything
                you&apos;d have to type from a card.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Scissors className="w-5 h-5 text-[#0F172A]" aria-hidden="true" />
                No product placement
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
                We take no referral fees, no affiliate money and no sponsorships. When a step names a tool, it&apos;s
                one we&apos;d use, and there&apos;s a free option beside it.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
