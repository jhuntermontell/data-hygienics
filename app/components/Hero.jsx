"use client"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Briefcase, Check, House } from "lucide-react"
import ThreatSpotlight from "./ThreatSpotlight"
import { SITE } from "@/lib/site"

const EASE = [0.22, 1, 0.36, 1]

// The tagline's last phrase gets the blue-to-teal treatment: blue is
// Business, teal is Home, and the brand sits across both.
const HIGHLIGHT = "alongside AI."

const PROMISES = ["Only our own business tools for sale", "No referral fees", "No affiliate links"]

function Tagline() {
  const tagline = SITE.tagline
  const at = tagline.lastIndexOf(HIGHLIGHT)
  if (at <= 0) return tagline
  return (
    <>
      {tagline.slice(0, at)}
      <span className="bg-gradient-to-r from-[#1D4ED8] to-[#0F766E] bg-clip-text text-transparent">
        {tagline.slice(at)}
      </span>
    </>
  )
}

// `threats` are trimmed spotlight items from toSpotlightItem(), built on the
// server in app/page.js.
export default function Hero({ threats = [] }) {
  const reduce = useReducedMotion()
  // Same initial/animate on server and client (the server can't know the
  // motion preference); reduced motion just makes the transition instant.
  const rise = (delay) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.5, delay, ease: EASE },
  })
  const hasSpotlight = threats.length > 0

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#0F766E]/10 blur-3xl" />
        <div className="absolute -top-24 -right-48 w-[36rem] h-[36rem] rounded-full bg-[#1D4ED8]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle,#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_65%)]" />
      </div>

      <div
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 grid grid-cols-1 gap-12 items-center ${
          hasSpotlight ? "lg:grid-cols-12 lg:gap-16" : ""
        }`}
      >
        <div className={hasSpotlight ? "lg:col-span-7" : "max-w-3xl"}>
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold tracking-[0.06em] uppercase text-[#334155]"
          >
            <span
              className="w-2 h-2 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#0F766E]"
              aria-hidden="true"
            />
            {SITE.kicker}
          </motion.p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem] font-bold tracking-[-0.03em] text-[#0F172A] text-balance"
          >
            <Tagline />
          </h1>

          <motion.p
            {...rise(0.1)}
            className="mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-[#475569]"
          >
            Independent, researched guidance for households and small businesses: what AI changed about
            scams and privacy, the habits that stop them, and the tools worth trusting.
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/household"
              className="group inline-flex items-center justify-between gap-4 rounded-xl bg-[#0F766E] px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#115E59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] transition-colors sm:min-w-[15rem]"
            >
              <span className="inline-flex items-center gap-3">
                <House className="w-5 h-5" aria-hidden="true" />
                For my home
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/business"
              className="group inline-flex items-center justify-between gap-4 rounded-xl bg-[#1D4ED8] px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#1E40AF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] transition-colors sm:min-w-[15rem]"
            >
              <span className="inline-flex items-center gap-3">
                <Briefcase className="w-5 h-5" aria-hidden="true" />
                For my business
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div {...rise(0.24)} className="mt-6">
            <Link
              href="/digital-sovereignty"
              className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#0F172A] underline decoration-[#0F766E]/40 decoration-2 underline-offset-4 hover:decoration-[#0F766E]"
            >
              What is digital sovereignty?
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.ul
            {...rise(0.3)}
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#64748B] list-none p-0"
          >
            {PROMISES.map((promise) => (
              <li key={promise} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                {promise}
              </li>
            ))}
          </motion.ul>
        </div>

        {hasSpotlight ? (
          <motion.div {...rise(0.2)} className="lg:col-span-5">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 backdrop-blur-sm p-4 sm:p-6 shadow-[0_8px_30px_rgb(15_23_42/0.06)]">
              <ThreatSpotlight threats={threats} />
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
