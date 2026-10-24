import Link from "next/link"
import { ArrowRight, Briefcase, CalendarCheck, House, KeyRound } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import { breadcrumbSchema } from "@/lib/schema"
import { AUDIENCES, SITE } from "@/lib/site"
import { getGuideBySlug } from "@/lib/guides"
import { hrefFor } from "@/lib/content"

const title = "Get Started: Home or Business | Data Hygienics"
const description =
  "Pick your starting point: guidance for your household and family, or for your small business and team. Independent, researched and free to read."

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/start` },
  openGraph: { title, description, url: `${SITE.url}/start` },
}

const CHOICES = [
  {
    key: "home",
    href: "/path/home",
    label: "For my home",
    cta: "Map my home path",
    icon: House,
    description: AUDIENCES.home.description,
    detail: "Scams that use cloned voices, chatbot privacy, and keeping the family's accounts safe.",
    today: {
      text: "Agree on a family safe word tonight, and a rule to hang up and call back before anyone sends money.",
      guideSlug: "family-safe-word-and-callback-rule",
    },
    styles: {
      card: "hover:border-[#0F766E] focus-visible:outline-[#0F766E]",
      icon: "bg-[#0F766E] text-white",
      cta: "text-[#0F766E]",
      bar: "bg-[#0F766E]",
      today: "border-[#0F766E]/20 bg-[#F0FDFA]",
      todayIcon: "text-[#0F766E]",
    },
  },
  {
    key: "business",
    href: "/path/business",
    label: "For my business",
    cta: "Map my business path",
    icon: Briefcase,
    description: AUDIENCES.business.description,
    detail: "Deepfake payment fraud, your team's AI use, and getting your rules and plans in writing.",
    today: {
      text: "Tell whoever pays the bills to confirm any new or changed bank details by calling a number you already have.",
      guideSlug: "two-channel-verification-for-payments",
    },
    styles: {
      card: "hover:border-[#1D4ED8] focus-visible:outline-[#1D4ED8]",
      icon: "bg-[#1D4ED8] text-white",
      cta: "text-[#1D4ED8]",
      bar: "bg-[#1D4ED8]",
      today: "border-[#1D4ED8]/20 bg-[#EFF6FF]",
      todayIcon: "text-[#1D4ED8]",
    },
  },
]

export default function StartPage() {
  return (
    <>
      <SchemaScript
        schema={breadcrumbSchema([
          { name: "Data Hygienics", path: "/" },
          { name: "Get started", path: "/start" },
        ])}
      />
      <Navbar />
      <main className="relative overflow-hidden bg-white text-[#0F172A]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#0F8F83]/10 blur-3xl" />
          <div className="absolute -top-32 -right-40 w-[30rem] h-[30rem] rounded-full bg-[#1D4ED8]/10 blur-3xl" />
        </div>

        <section aria-labelledby="start-title" className="relative px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#64748B]">Get started</p>
              <h1
                id="start-title"
                className="mt-4 text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
              >
                Who are you protecting?
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-lg leading-relaxed text-[#475569]">
                Pick one and we&apos;ll build your path: the steps that matter for you, in order. About two minutes.
                It stays on this device unless you save it.
              </p>
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-2 list-none p-0">
              {CHOICES.map((choice) => {
                const Icon = choice.icon
                // Drafts drop the guide link, never the advice.
                const todayGuide = getGuideBySlug(choice.today.guideSlug)
                return (
                  <li key={choice.key} className="flex flex-col gap-3">
                    <Link
                      href={choice.href}
                      className={`group relative flex flex-col flex-1 overflow-hidden rounded-2xl border-2 border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-4 ${choice.styles.card}`}
                    >
                      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 ${choice.styles.bar}`} />
                      <span className={`w-12 h-12 rounded-xl flex items-center justify-center ${choice.styles.icon}`}>
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </span>
                      <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight">{choice.label}</h2>
                      <span className="mt-3 text-[15px] leading-relaxed text-[#475569]">{choice.description}</span>
                      <span className="mt-2 text-[15px] leading-relaxed text-[#475569] flex-1">{choice.detail}</span>
                      <span className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${choice.styles.cta}`}>
                        {choice.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </span>
                    </Link>
                    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${choice.styles.today}`}>
                      <CalendarCheck className={`w-4 h-4 mt-0.5 shrink-0 ${choice.styles.todayIcon}`} aria-hidden="true" />
                      <p className="text-sm leading-relaxed text-[#334155]">
                        <span className="font-semibold text-[#0F172A]">Do this today: </span>
                        {choice.today.text}
                        {todayGuide ? (
                          <>
                            {" "}
                            <Link
                              href={hrefFor(todayGuide)}
                              className={`font-semibold underline underline-offset-2 ${choice.styles.cta}`}
                            >
                              How to do it
                              <span className="sr-only">: {todayGuide.title}</span>
                            </Link>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#0F172A]" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-[#475569]">
                  <span className="block font-semibold text-[#0F172A]">Thinking bigger than one device?</span>
                  Digital sovereignty is about owning your data, identity and choices, at home and at work.
                </p>
              </div>
              <Link
                href="/digital-sovereignty"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] hover:text-[#1D4ED8] shrink-0"
              >
                What is digital sovereignty?
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-8 text-center text-sm text-[#64748B]">
              Rather browse first?{" "}
              <Link href={AUDIENCES.home.href} className="font-semibold text-[#0F766E] hover:text-[#115E59]">
                For Home
              </Link>{" "}
              ·{" "}
              <Link href={AUDIENCES.business.href} className="font-semibold text-[#1D4ED8] hover:text-[#1E40AF]">
                For Business
              </Link>
            </p>

            <p className="mt-3 text-center text-sm text-[#64748B]">
              Already use our business tools?{" "}
              <Link href="/tools/cyber-audit/login" className="font-semibold text-[#1D4ED8] hover:text-[#1E40AF]">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
