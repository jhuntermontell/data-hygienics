"use client"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Briefcase, ClipboardCheck, FileText, LifeBuoy } from "lucide-react"
import HeroScoreGauge from "./HeroScoreGauge"

// The paid business tools, presented as a strip: on the homepage and
// /how-it-works as three cards, on /business beside the sample score gauge.
const TOOLS = [
  {
    key: "audit",
    icon: ClipboardCheck,
    name: "Cyber Audit",
    badge: "Free Quick Check",
    text: "Score your security in plain English, including how your team uses AI tools and what goes into them.",
    href: "/tools/cyber-audit",
    cta: "Start the Cyber Audit",
  },
  {
    key: "policies",
    icon: FileText,
    name: "Policy Library",
    badge: "AI policy free",
    text: "Nine plain-English security policies, customized to your organization. Start with the AI Acceptable Use Policy, which is free with a free account.",
    href: "/tools/policies",
    cta: "Browse policies",
    extra: { href: "/tools/policies/ai-acceptable-use-policy", label: "Get the free AI policy (free account required)" },
  },
  {
    key: "ir",
    icon: LifeBuoy,
    name: "Incident Response Planner",
    badge: null,
    text: "Build and rehearse a plan for when it goes wrong, including deepfake payment requests and client data pasted into a chatbot.",
    href: "/tools/ir-plan",
    cta: "Build your plan",
  },
]

function ToolCard({ tool, compact }) {
  const Icon = tool.icon
  return (
    <div
      className={`relative flex h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#1D4ED8]/40 hover:shadow-md transition-all ${
        compact ? "flex-col sm:flex-row gap-4 p-5" : "flex-col p-6"
      }`}
    >
      <span className="shrink-0 w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <div className={`flex flex-col flex-1 min-w-0 ${compact ? "" : "mt-5"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold text-[#0F172A]">{tool.name}</h3>
          {tool.badge ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/20">
              {tool.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-[#475569] flex-1">{tool.text}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href={tool.href}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
          >
            {tool.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
          {tool.extra ? (
            <Link
              href={tool.extra.href}
              className="text-sm font-semibold text-[#0F766E] hover:text-[#115E59] underline decoration-[#0F766E]/30 underline-offset-4"
            >
              {tool.extra.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function BusinessToolsStrip({ withGauge = false, className = "bg-white" }) {
  const reduce = useReducedMotion()
  // Same initial state on server and client; reduced motion just makes the
  // reveal instant (returning no props would leave the SSR opacity in place).
  const reveal = (i) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  })

  const header = (
    <div className="max-w-2xl">
      <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border bg-white text-[#1D4ED8] border-[#1D4ED8]/25">
        <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
        For Business
      </span>
      <h2 id="business-tools-heading" className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
        When you&apos;re ready to put it in writing
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-[#475569]">
        Three tools for the owner, office manager or whoever got handed IT. They&apos;re the only thing we
        sell, and the AI Acceptable Use Policy is free with a free account.
      </p>
    </div>
  )

  const footer = (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
      <Link
        href="/pricing"
        className="inline-flex items-center justify-center gap-1.5 bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-[#1E40AF] transition-colors"
      >
        See pricing
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
      <Link href="/tools" className="text-sm font-semibold text-[#0F172A] hover:text-[#1D4ED8] underline underline-offset-4 decoration-[#CBD5E1]">
        All business tools
      </Link>
    </div>
  )

  if (withGauge) {
    return (
      <section aria-labelledby="business-tools-heading" className={`px-4 sm:px-6 py-16 sm:py-24 ${className}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
          <div className="lg:col-span-7 lg:order-2">
            {header}
            <ul className="mt-8 space-y-4 list-none p-0">
              {TOOLS.map((tool, i) => (
                <motion.li key={tool.key} {...reveal(i)}>
                  <ToolCard tool={tool} compact />
                </motion.li>
              ))}
            </ul>
            {footer}
          </div>
          <figure className="lg:col-span-5 lg:order-1 m-0">
            <HeroScoreGauge />
            <figcaption className="text-center text-xs text-[#64748B]">
              A sample score. Yours comes from your own answers.
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="business-tools-heading" className={`px-4 sm:px-6 py-16 sm:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto rounded-3xl border border-[#E2E8F0] bg-gradient-to-b from-[#EFF6FF]/60 via-[#F8FAFC] to-white p-5 sm:p-10 lg:p-12">
        {header}
        <ul className="mt-10 grid gap-5 md:grid-cols-3 list-none p-0">
          {TOOLS.map((tool, i) => (
            <motion.li key={tool.key} {...reveal(i)} className="h-full">
              <ToolCard tool={tool} />
            </motion.li>
          ))}
        </ul>
        {footer}
      </div>
    </section>
  )
}
