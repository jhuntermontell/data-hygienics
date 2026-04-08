"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { createClient } from "@/lib/supabase/client"
import { PRICES } from "@/lib/stripe/prices"
import {
  Shield,
  FileText,
  BookOpen,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react"

const problems = [
  {
    title: "The incentives are misaligned",
    body: "Most of the people offering cybersecurity advice are also selling cybersecurity products. When your IT provider recommends a solution, ask yourself: are they recommending it because you need it, or because it carries a margin? We're not saying they're wrong. We're saying the incentive structure makes it hard to know.",
  },
  {
    title: "The jargon is a barrier by design",
    body: "SIEM. EDR. Zero Trust. MFA fatigue. The language of cybersecurity was developed by engineers for engineers. When you don't understand what's being recommended, you can't evaluate whether you need it. That information gap costs real businesses real money every year.",
  },
  {
    title: "Need vs. want vs. fluff",
    body: "Every business has cybersecurity needs. Some are legal requirements. Some are genuine risk reducers. Some are nice-to-haves. And some are solutions looking for problems. Knowing which is which, without someone trying to sell you something, is nearly impossible. Until now.",
  },
]

const toolCards = [
  {
    icon: Shield,
    name: "Cyber Audit",
    badge: "Active",
    desc: "Take a 20-minute assessment tailored to your industry. Get a scored report your insurance broker will actually recognize, plus a plain-English remediation guide your team can act on.",
    cta: "Start Free Assessment",
    href: "/tools/cyber-audit",
  },
  {
    icon: FileText,
    name: "Policy Library",
    badge: "Active",
    desc: "The 9 cybersecurity policies your insurance provider wants to see. Built from NIST and SANS frameworks. Customized to your company. Downloaded as a branded PDF in minutes.",
    cta: "Explore Policies",
    href: "/tools/policies",
  },
  {
    icon: BookOpen,
    name: "Controls Library",
    badge: "Free",
    desc: "A plain-English library of every major cybersecurity control: what it means, why it matters, and how it applies to your industry. Free forever. No account required.",
    cta: "Browse Controls",
    href: "/controls",
  },
  {
    icon: Sparkles,
    name: "More Tools",
    badge: "Coming Soon",
    desc: "Vendor Risk Scorecard. Password Audit Tool. Incident Response Planner. We're building the toolkit small business deserves.",
    cta: null,
    href: null,
  },
]

const tiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    popular: false,
    priceId: PRICES.starter,
    mode: "subscription",
    features: [
      "Full cybersecurity assessment",
      "Insurance-ready PDF report",
      "Internal remediation report",
      "Industry news feed",
      "2 customizable policies",
    ],
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    popular: true,
    priceId: PRICES.professional,
    mode: "subscription",
    features: [
      "Everything in Starter",
      "Unlimited assessments",
      "All 9 insurance-ready policies",
      "Score tracking over time",
      "Priority access to new tools",
    ],
    cta: "Subscribe",
  },
  {
    name: "MSP / Advisor",
    price: "$399",
    period: "/month",
    popular: false,
    priceId: PRICES.msp,
    mode: "subscription",
    features: [
      "Everything in Professional",
      "Run assessments for up to 10 clients",
      "Client management dashboard",
      "Branded reports (coming soon)",
      "Bulk pricing available",
    ],
    cta: "Subscribe",
  },
]

const oneTimePurchases = [
  { name: "Assessment Bundle", price: "$149", priceId: PRICES.assessmentBundle, desc: "Full assessment with both PDF reports. Keep forever." },
  { name: "Policy Bundle", price: "$199", priceId: PRICES.policyBundle, desc: "All 9 insurance-required cybersecurity policies." },
  { name: "Individual Policy", price: "$49", priceId: PRICES.individualPolicy, desc: "Pick any single policy. Customize and download." },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

export default function WhyPage() {
  const [checkingOut, setCheckingOut] = useState(null)

  async function handleCheckout(priceId, mode) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = "/tools/cyber-audit/register"
      return
    }
    setCheckingOut(priceId)
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          mode,
          successUrl: `${window.location.origin}/tools/cyber-audit/dashboard?welcome=true`,
          cancelUrl: `${window.location.origin}/why-data-hygienics`,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error("Checkout error:", err)
    } finally {
      setCheckingOut(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Section 1: Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-6">
            The cybersecurity industry wasn&apos;t built for you.
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="text-[#475569] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            It was built for enterprises with dedicated IT departments, six-figure budgets, and full-time security staff. If that&apos;s not you (and for most small businesses it isn&apos;t), you&apos;ve been navigating a world that wasn&apos;t designed with you in mind.
          </motion.p>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section className="py-20 px-6 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-white tracking-tight text-center mb-14">
            Here&apos;s what nobody tells you.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#1E293B] rounded-xl p-7 border border-[#334155]"
              >
                <h3 className="text-white font-semibold text-base mb-3">{p.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Our Answer */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-6">
            We built the platform we wished existed.
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="space-y-5 text-[#475569] text-base leading-[1.8]">
            <p>
              Data Hygienics is an independent cybersecurity platform. We don&apos;t sell security products. We don&apos;t receive referral fees from vendors. We don&apos;t have a services arm looking to win your IT contract.
            </p>
            <p>
              What we do: we give small businesses, nonprofits, law firms, medical practices, and the people who run them an honest, plain-English picture of where they stand, and exactly what to do about it.
            </p>
            <p>
              No upsell. No alarm bells designed to scare you into buying something. Just clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 4: The Tools */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight text-center mb-14">
            What we&apos;ve built for you.
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {toolCards.map((tool, i) => {
              const Icon = tool.icon
              const isSoon = tool.badge === "Coming Soon"
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`bg-white rounded-xl border border-[#E2E8F0] p-7 shadow-sm ${isSoon ? "opacity-70" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSoon ? "bg-[#F1F5F9]" : "bg-[#EFF6FF]"}`}>
                      <Icon className={`w-5 h-5 ${isSoon ? "text-[#94A3B8]" : "text-[#1D4ED8]"}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[#0F172A]">{tool.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSoon ? "bg-[#F1F5F9] text-[#94A3B8]" : tool.badge === "Free" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#EFF6FF] text-[#1D4ED8]"
                      }`}>
                        {tool.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#475569] text-sm leading-relaxed mb-4">{tool.desc}</p>
                  {tool.cta && tool.href && (
                    <Link href={tool.href} className="text-[#1D4ED8] text-sm font-semibold hover:text-[#1E40AF] transition-colors flex items-center gap-1">
                      {tool.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
              Transparent pricing. No surprises.
            </h2>
            <p className="text-[#475569] text-base max-w-xl mx-auto">
              We believe you should know exactly what you&apos;re paying for before you pay for it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-start mb-14">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative bg-white rounded-xl border p-8 flex flex-col shadow-sm ${
                  tier.popular ? "border-[#1D4ED8] border-t-4 shadow-md" : "border-[#E2E8F0]"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1D4ED8] text-white text-xs font-medium px-3 py-1 rounded-full">Popular</span>
                )}
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#0F172A]">{tier.price}</span>
                  <span className="text-[#94A3B8] text-base">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[#475569] text-sm">
                      <Check className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(tier.priceId, tier.mode)}
                  disabled={!!checkingOut}
                  className={`block text-center rounded-lg py-3 px-4 font-semibold text-sm transition-all ${
                    tier.popular
                      ? "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-sm"
                      : "bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
                  } ${checkingOut === tier.priceId ? "opacity-70" : ""}`}
                >
                  {checkingOut === tier.priceId ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</span>
                  ) : tier.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mb-6">
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">Prefer to pay once?</h3>
            <p className="text-[#475569] text-sm">No subscription required.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {oneTimePurchases.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col"
              >
                <h4 className="text-sm font-semibold text-[#0F172A] mb-1">{item.name}</h4>
                <p className="text-2xl font-bold text-[#0F172A] mb-3">{item.price}</p>
                <p className="text-xs text-[#475569] leading-relaxed mb-5 flex-1">{item.desc}</p>
                <button
                  onClick={() => handleCheckout(item.priceId, "payment")}
                  disabled={!!checkingOut}
                  className={`w-full text-center rounded-lg py-2.5 px-4 font-semibold text-sm border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] transition-all ${
                    checkingOut === item.priceId ? "opacity-70" : ""
                  }`}
                >
                  {checkingOut === item.priceId ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</span>
                  ) : "Buy Now"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Closing CTA */}
      <section className="py-20 px-6 bg-[#1D4ED8]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            You deserve a straight answer.
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="text-blue-100 text-base mb-8">
            Start with the free assessment. No credit card. No sales call. No jargon. Just clarity.
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <Link
              href="/tools/cyber-audit"
              className="inline-flex items-center bg-white text-[#1D4ED8] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
            >
              Start the Free Assessment
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
