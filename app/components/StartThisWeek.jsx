import Link from "next/link"
import { ArrowRight, BookOpen, CreditCard, KeyRound, MessageSquareLock } from "lucide-react"
import { getGuideBySlug } from "@/lib/guides"
import { hrefFor } from "@/lib/content"

// Homepage strip: three literal actions for this week, each backed by a
// guide, plus the two baseline guides. Guide links resolve through
// getGuideBySlug, so a draft guide drops its link (never a 404) while the
// action itself still shows.

const ACTIONS = [
  {
    key: "safe-word",
    icon: MessageSquareLock,
    title: "Agree on a family safe word",
    detail:
      "Pick a word only your household knows, and agree that anyone calling for money in a hurry has to say it. If they can't, hang up and call back on a number you already have.",
    guideSlug: "family-safe-word-and-callback-rule",
  },
  {
    key: "email",
    icon: KeyRound,
    title: "Add a passkey or MFA to your email",
    detail:
      "In your email account's security settings, add a passkey or turn on multi-factor authentication (MFA). Your email can reset every other password, so lock it first.",
    guideSlug: "digital-hygiene-at-home",
  },
  {
    key: "payments",
    icon: CreditCard,
    title: "Check payment requests on a second channel",
    detail:
      "Before you pay a new invoice or change anyone's bank details, call the person on a number you already have. Never use the phone number or link in the request itself.",
    guideSlug: "two-channel-verification-for-payments",
  },
]

const BASELINE_GUIDES = [
  { slug: "digital-hygiene-at-home", label: "For your household" },
  { slug: "digital-hygiene-for-your-business", label: "For your business" },
]

export default function StartThisWeek() {
  const actions = ACTIONS.map((action) => ({ ...action, guide: getGuideBySlug(action.guideSlug) || null }))
  const baseline = BASELINE_GUIDES.map((item) => ({ ...item, guide: getGuideBySlug(item.slug) })).filter(
    (item) => item.guide
  )

  return (
    <section aria-labelledby="start-this-week-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#0F766E]">Three habits, one week</p>
          <h2 id="start-this-week-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Start this week
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-[#475569]">
            Three small habits that make the most common AI-era scams much harder to pull off. None of them needs
            technical skill.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-3 list-none p-0">
          {actions.map((action, i) => {
            const Icon = action.icon
            return (
              <li
                key={action.key}
                className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#0F766E] text-white text-sm font-bold flex items-center justify-center"
                  >
                    {i + 1}
                  </span>
                  <Icon className="w-5 h-5 text-[#64748B]" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-bold leading-snug text-[#0F172A]">{action.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#475569] flex-1">{action.detail}</p>
                {action.guide ? (
                  <Link
                    href={hrefFor(action.guide)}
                    className="group mt-5 inline-flex items-start gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                  >
                    <BookOpen className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="font-normal text-[#475569]">Guide: </span>
                      {action.guide.title}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ol>

        {baseline.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <p className="text-sm leading-relaxed text-[#475569] lg:max-w-sm">
              <span className="block font-semibold text-[#0F172A]">Want the whole baseline?</span>
              The core habits in the order to tackle them, one guide for home and one for work.
            </p>
            <ul className="flex flex-col sm:flex-row gap-3 list-none p-0 lg:ml-auto">
              {baseline.map(({ slug, label, guide }) => (
                <li key={slug}>
                  <Link
                    href={hrefFor(guide)}
                    className="group flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 hover:border-[#1D4ED8]/40 transition-colors"
                  >
                    <span>
                      <span className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#64748B]">
                        {label}
                      </span>
                      <span className="block text-sm font-semibold text-[#0F172A] group-hover:text-[#1D4ED8]">
                        {guide.title}
                      </span>
                    </span>
                    <ArrowRight
                      className="w-4 h-4 ml-auto shrink-0 text-[#1D4ED8] group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
