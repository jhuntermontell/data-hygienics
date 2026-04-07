"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { motion } from "framer-motion"
import Link from "next/link"

const tiers = [
  {
    name: "One-Time Report",
    price: "$49",
    period: "",
    popular: false,
    features: [
      "Single industry assessment",
      "Insurance-ready PDF report",
      "Internal remediation report",
      "Valid for 12 months",
    ],
    bestFor: "First-time users, one-time compliance needs",
    cta: "Get Your Report",
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    popular: true,
    features: [
      "Unlimited assessments",
      "All industry questionnaires",
      "Both report types",
      "Industry cybersecurity news feed",
      "Score tracking over time",
      "Priority access to new tools",
    ],
    bestFor: "Growing businesses, annual reassessment",
    cta: "Start Free Trial",
  },
  {
    name: "MSP / Advisor",
    price: "$99",
    period: "/month",
    popular: false,
    features: [
      "Everything in Professional",
      "Run assessments for multiple clients",
      "Client management dashboard",
      "Branded reports (coming soon)",
      "Bulk pricing available",
    ],
    bestFor: "IT providers, CFOs managing vendors, insurance brokers",
    cta: "Contact Sales",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Start with a free assessment. Upgrade when you need your reports.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  tier.popular
                    ? "border-blue-500 bg-[#0d0d0d] scale-[1.03] shadow-lg shadow-blue-500/10 z-10"
                    : "border-zinc-800 bg-[#0d0d0d]"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    Popular
                  </span>
                )}

                <h2 className="text-xl font-semibold mb-4">{tier.name}</h2>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-zinc-400 text-base">{tier.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-zinc-300 text-sm">
                      <svg
                        className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-zinc-500 mb-5">
                  Best for: {tier.bestFor}
                </p>

                <Link
                  href="/tools/cyber-audit"
                  className={`block text-center rounded-xl py-3 px-4 font-medium text-sm transition-colors ${
                    tier.popular
                      ? "bg-blue-500 hover:bg-blue-400 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Callout Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-24 text-center"
          >
            <blockquote className="text-2xl sm:text-3xl font-semibold text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              &ldquo;Used by reluctant tech leaders to hold their MSPs accountable.&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
