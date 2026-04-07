"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { motion } from "framer-motion"
import Link from "next/link"
import { Check } from "lucide-react"

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
    bestFor: "IT providers, advisors, and insurance brokers serving multiple clients",
    cta: "Contact Sales",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-[#475569] text-lg max-w-xl mx-auto">
              Start with a free assessment. Upgrade when you need your reports.
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
                  tier.popular
                    ? "border-[#1D4ED8] border-t-4 shadow-md"
                    : "border-[#E2E8F0]"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1D4ED8] text-white text-xs font-medium px-3 py-1 rounded-full tracking-wide">
                    Popular
                  </span>
                )}

                <h2 className="text-lg font-semibold text-[#0F172A] mb-4">{tier.name}</h2>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#0F172A]">{tier.price}</span>
                  {tier.period && (
                    <span className="text-[#94A3B8] text-base">{tier.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[#475569] text-sm">
                      <Check className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-[#94A3B8] mb-5">
                  Best for: {tier.bestFor}
                </p>

                <Link
                  href="/tools/cyber-audit"
                  className={`block text-center rounded-lg py-3 px-4 font-semibold text-sm transition-all duration-150 ${
                    tier.popular
                      ? "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-sm"
                      : "bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20 text-center"
          >
            <blockquote className="text-xl sm:text-2xl font-semibold text-[#475569] max-w-2xl mx-auto leading-relaxed">
              &ldquo;Trusted by small businesses, law firms, medical practices, and nonprofits who deserve the same security clarity as the Fortune 500.&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
