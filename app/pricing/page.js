"use client"

import { useState, useEffect } from "react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { PRICES } from "@/lib/stripe/prices"
import { createClient } from "@/lib/supabase/client"
import { getSubscription } from "@/lib/stripe/subscription"
import { useRouter } from "next/navigation"

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
    bestFor: "Individuals and small businesses getting started",
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
    bestFor: "Growing businesses, annual reassessment",
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
    bestFor: "IT providers, advisors, and insurance brokers",
    cta: "Subscribe",
  },
]

const oneTimePurchases = [
  {
    name: "Assessment Bundle",
    price: "$149",
    priceId: PRICES.assessmentBundle,
    desc: "Full assessment with both PDF reports — insurance-ready and remediation. Keep forever.",
  },
  {
    name: "Policy Bundle",
    price: "$199",
    priceId: PRICES.policyBundle,
    desc: "All 9 insurance-required cybersecurity policies, customized for your organization.",
  },
  {
    name: "Individual Policy",
    price: "$49",
    priceId: PRICES.individualPolicy,
    desc: "Pick any single policy from our library. Customize and download as PDF.",
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [checkingOut, setCheckingOut] = useState(null)
  const [session, setSession] = useState(null)
  const [hasActiveSub, setHasActiveSub] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) {
        const sub = await getSubscription(s.user.id)
        setHasActiveSub(sub.subscription?.status === "active" && sub.plan !== "free")
      }
    })
  }, [])

  async function handleCheckout(priceId, mode) {
    if (!session) {
      router.push("/tools/cyber-audit/register")
      return
    }

    // If user already has an active subscription, send to billing portal
    if (hasActiveSub && mode === "subscription") {
      setCheckingOut(priceId)
      try {
        const res = await fetch("/api/stripe/create-portal-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
          return
        }
      } catch (err) {
        console.error("Portal error:", err)
      } finally {
        setCheckingOut(null)
      }
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
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error("Checkout error:", err)
    } finally {
      setCheckingOut(null)
    }
  }

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

          {/* Subscription Tiers */}
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

                <button
                  onClick={() => handleCheckout(tier.priceId, tier.mode)}
                  disabled={!!checkingOut}
                  className={`block text-center rounded-lg py-3 px-4 font-semibold text-sm transition-all duration-150 ${
                    tier.popular
                      ? "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-sm"
                      : "bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
                  } ${checkingOut === tier.priceId ? "opacity-70" : ""}`}
                >
                  {checkingOut === tier.priceId ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                    </span>
                  ) : hasActiveSub ? (
                    "Manage Plan"
                  ) : (
                    tier.cta
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {/* One-time Purchases */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-[#0F172A] text-center mb-2">
              Prefer to pay once?
            </h2>
            <p className="text-[#475569] text-sm text-center mb-8">
              No subscription required. Pay once and keep your purchase forever.
            </p>

            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {oneTimePurchases.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col"
                >
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{item.name}</h3>
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
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                      </span>
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

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
