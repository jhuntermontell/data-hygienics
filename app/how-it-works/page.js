"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import {
  ActiveToolCard,
  ComingSoonCard,
  activeTools,
  comingSoonTools,
} from "@/app/components/ToolsPreview"
import { createClient } from "@/lib/supabase/client"
import { getActivePrices } from "@/lib/stripe/prices"
import { Check, Loader2 } from "lucide-react"

const PRICES = getActivePrices()

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

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

export default function HowItWorksPage() {
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
          cancelUrl: `${window.location.origin}/how-it-works`,
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

      {/* Page header */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-6">
            Why we built this
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-[#475569] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            The security industry has a conflict of interest problem. We&apos;re the fix.
          </motion.p>
        </div>
      </section>

      {/* Section 1: The Problem */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-8">
            A story you might recognize
          </motion.h2>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="space-y-5 text-[#475569] text-base leading-[1.8]"
          >
            <p>
              You&apos;re running a business. You&apos;re good at it. Then one day, someone asks about your cybersecurity posture, and you realize you don&apos;t know the answer.
            </p>
            <p>
              Maybe it&apos;s your insurance broker asking questions you&apos;ve never heard before. Maybe it&apos;s a client sending you a security questionnaire. Maybe it&apos;s the news about another breach at a company your size.
            </p>
            <p>
              So you call your IT provider. Of course, they recommend a list of products - and some of them cost a lot money. You&apos;re not sure which ones you actually need, and you don&apos;t have the vocabulary to push back. You&apos;re trusting someone whose revenue depends on what they recommend.
            </p>
            <p>
              That&apos;s not a criticism of IT providers, because most of them are doing good work. But the incentive structure creates a gap: the person making the recommendations profits from the recommendations. The person paying for them can&apos;t evaluate whether they&apos;re necessary.
            </p>
            <p>
              That gap is where bad decisions happen. Where businesses overpay for tools they don&apos;t need and underpay for protections they do.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Our Answer */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-8">
            We built the platform we wished existed.
          </motion.h2>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="space-y-5 text-[#475569] text-base leading-[1.8]"
          >
            <p>
              Data Hygienics is an independent cybersecurity platform. We don&apos;t sell security products. We don&apos;t receive referral fees from vendors. We don&apos;t have a services arm looking to win your IT contract.
            </p>
            <p>
              What we do: we give small businesses, nonprofits, law firms, medical practices, and the people who run them an honest, plain-English picture of where they stand and exactly what to do about it.
            </p>
            <p>
              No upsell. No alarm bells designed to scare you into buying something. Just clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3: How the Tools Work */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-12 text-center">
            What you get
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activeTools.map((tool) => (
              <ActiveToolCard key={tool.name} tool={tool} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 4: What's Coming */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-12 text-center">
            What we&apos;re building next
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {comingSoonTools.map((tool) => (
              <ComingSoonCard key={tool.name} tool={tool} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 5: Pricing Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-4">
              Transparent pricing. No surprises.
            </h2>
            <p className="text-[#475569] text-base max-w-2xl mx-auto">
              A cybersecurity consultant charges $150 to $300 per hour. We charge a fraction of that for better output.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
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
        </div>
      </section>

      {/* Section 6: Closing CTA */}
      <section className="py-20 px-6 bg-[#1D4ED8]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            You deserve a straight answer.
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-blue-100 text-base mb-8"
          >
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
