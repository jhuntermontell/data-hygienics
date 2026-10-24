"use client"

import { useEffect, useRef, useState } from "react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { motion } from "framer-motion"
import {
  Check,
  Loader2,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { getActivePrices } from "@/lib/stripe/prices"
import { createClient } from "@/lib/supabase/client"
import {
  getSubscription,
  clearSubscriptionCache,
} from "@/lib/stripe/subscription"
import { isSubscriptionPaid } from "@/lib/stripe/entitlement"
import { isLegacyPlan } from "@/lib/stripe/access"
import { useRouter } from "next/navigation"
import PromoCodeInput from "@/app/components/PromoCodeInput"

const PRICES = getActivePrices()

// ---- Pricing constants (single source of truth for display strings) ----
const DOCS_PACK_PRICE = "$299"
const PROTECTION_MONTHLY_PRICE = "$49"
const PROTECTION_ANNUAL_PRICE = "$468"
const PROTECTION_ANNUAL_EFFECTIVE = "$39"

// Display names for grandfathered plans in the current-plan banner. These
// plans are still honored but never sold.
const LEGACY_PLAN_LABELS = {
  starter: "Starter",
  professional: "Professional",
  msp: "IT Provider / Advisor (Legacy)",
  agency: "Agency Plan (Legacy)",
}

// Documentation Pack is the hero offer: a one-time purchase that gets a small
// business's AI-era security in writing in one go: assessment, policies
// (including an AI Acceptable Use Policy), and a response plan.
const docsPack = {
  key: "docs_pack",
  name: "Documentation Pack",
  price: DOCS_PACK_PRICE,
  priceLabel: "one-time",
  priceId: PRICES.docsPack,
  mode: "payment",
  tagline:
    "Everything a small business needs to get its AI-era security in writing.",
  features: [
    "Comprehensive Cyber Audit (full assessment)",
    "All nine security policies, including the AI Acceptable Use Policy (also free on its own)",
    "Incident Response Plan",
    "Remediation priority plan",
  ],
  cta: "Buy Documentation Pack",
}

// Subscription tiers shown beneath the hero.
function protectionTier(billingInterval) {
  const isAnnual = billingInterval === "annual"
  return {
    key: "protection",
    name: "Ongoing Protection",
    price: isAnnual ? PROTECTION_ANNUAL_PRICE : PROTECTION_MONTHLY_PRICE,
    priceLabel: isAnnual ? "/year" : "/month",
    caption: isAnnual
      ? `Works out to ${PROTECTION_ANNUAL_EFFECTIVE}/month. Save 20%.`
      : "Cancel anytime.",
    priceId: isAnnual ? PRICES.protectionYearly : PRICES.protectionMonthly,
    mode: "subscription",
    tagline: "Keep your security current as AI tools and scams change.",
    features: [
      "Everything in the Documentation Pack",
      "Quarterly reassessment with new AI-era questions",
      "Policy updates when the threat picture changes",
      "Policy review and update workflow",
    ],
    cta: "Start Ongoing Protection",
  }
}

export default function PricingPage() {
  const router = useRouter()
  const [billing, setBilling] = useState("monthly") // 'monthly' | 'annual'
  const [checkingOut, setCheckingOut] = useState(null)
  const [session, setSession] = useState(null)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [checkoutError, setCheckoutError] = useState("")
  // Synchronous in-flight guard. Shared across every checkout path so a
  // user cannot double-submit by rapidly clicking two different tiers.
  const checkoutInFlightRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) {
        const sub = await getSubscription(s.user.id)
        if (isSubscriptionPaid(sub.subscription) || sub.isPromo) {
          setCurrentPlan(sub.plan)
        }
      }
    })
  }, [])

  const protection = protectionTier(billing)

  async function handleCheckout({ priceId, mode, key }) {
    if (!session) {
      router.push("/tools/cyber-audit/register")
      return
    }
    if (checkoutInFlightRef.current) return
    checkoutInFlightRef.current = true
    setCheckoutError("")
    setCheckingOut(key)

    // Legacy subscribers hitting the billing portal — same path as before
    // when they want to manage an existing subscription.
    const isStartingSubscription = mode === "subscription"
    const hasActiveSubscription =
      currentPlan &&
      currentPlan !== "free" &&
      isStartingSubscription

    let willRedirect = false
    try {
      if (hasActiveSubscription) {
        const res = await fetch("/api/stripe/create-portal-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const data = await res.json()
        if (data.url) {
          willRedirect = true
          window.location.href = data.url
          return
        }
        setCheckoutError(
          data.error || "Could not open the billing portal. Please try again."
        )
        return
      }

      const payload = { priceId }

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.url) {
        clearSubscriptionCache()
        willRedirect = true
        window.location.href = data.url
        return
      }
      setCheckoutError(
        data.error || "Could not start checkout. Please try again."
      )
    } catch (err) {
      console.error("Checkout error:", err)
      setCheckoutError(
        "Could not reach Stripe. Check your connection and try again."
      )
    } finally {
      if (!willRedirect) {
        checkoutInFlightRef.current = false
        setCheckingOut(null)
      }
    }
  }

  const onLegacyPlan = currentPlan && isLegacyPlan(currentPlan)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] mb-4">
              Simple pricing for small business security in the AI era.
            </h1>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              Buy the kit once, or subscribe to keep it current as AI changes
              how scams and attacks work. These business tools are the only
              thing we sell: no referral fees, no affiliate links.
            </p>
          </motion.div>

          {/* Grandfathered-plan banner */}
          {onLegacyPlan && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-2xl mb-10 rounded-xl border border-[#0F766E]/20 bg-[#F0FDFA] px-5 py-4 text-center"
            >
              <p className="text-sm text-[#0F766E]">
                <span className="font-semibold">
                  You are on a legacy plan:{" "}
                  {LEGACY_PLAN_LABELS[currentPlan] || currentPlan}.
                </span>{" "}
                Keep using it for as long as you like — nothing below affects
                your existing subscription or billing.
              </p>
            </motion.div>
          )}

          {/* ---- Hero: Documentation Pack ---- */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-xl border-2 border-[#1D4ED8] bg-white shadow-lg overflow-hidden mb-16"
          >
            <div className="absolute -top-px left-6 right-6 h-0.5 bg-gradient-to-r from-[#1D4ED8] via-[#0F766E] to-[#1D4ED8]" />

            <div className="p-10 sm:p-12 grid md:grid-cols-[1.15fr_1fr] gap-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-xs font-semibold px-3 py-1 mb-5 tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> One-time purchase
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">
                  {docsPack.name}
                </h2>
                <p className="text-[#475569] text-base mb-6 leading-relaxed">
                  {docsPack.tagline}
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-bold text-[#0F172A]">
                    {docsPack.price}
                  </span>
                  <span className="text-[#94A3B8] text-lg">
                    {docsPack.priceLabel}
                  </span>
                </div>

                <button
                  onClick={() =>
                    handleCheckout({
                      priceId: docsPack.priceId,
                      mode: docsPack.mode,
                      key: docsPack.key,
                    })
                  }
                  disabled={!!checkingOut}
                  className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold px-8 py-3.5 rounded-lg shadow-sm transition-all text-sm w-full sm:w-auto disabled:opacity-70"
                >
                  {checkingOut === docsPack.key ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                    </>
                  ) : (
                    <>
                      {docsPack.cta}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[#94A3B8] text-xs mt-3">
                  Pay once. Keep the documents forever. No subscription required.
                </p>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-7">
                <h3 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-4">
                  What is included
                </h3>
                <ul className="space-y-3">
                  {docsPack.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-[#0F172A] leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#1D4ED8]" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* ---- Subscription tier section ---- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-3">
              Want to stay current all year?
            </h2>
            <p className="text-[#475569] text-base max-w-xl mx-auto">
              AI tools and the scams built on them keep changing. Subscribe to
              reassess every quarter with new AI-era questions and keep your
              policies up to date.
            </p>
          </motion.div>

          {/* Billing cadence toggle */}
          <div className="flex justify-center mb-10">
            <div
              role="tablist"
              aria-label="Billing cadence"
              className="inline-flex items-center bg-white border border-[#E2E8F0] rounded-lg p-1 shadow-sm"
            >
              <button
                role="tab"
                aria-selected={billing === "monthly"}
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                  billing === "monthly"
                    ? "bg-[#1D4ED8] text-white shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                Monthly
              </button>
              <button
                role="tab"
                aria-selected={billing === "annual"}
                onClick={() => setBilling("annual")}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  billing === "annual"
                    ? "bg-[#1D4ED8] text-white shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                Annual
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    billing === "annual"
                      ? "bg-white text-[#1D4ED8]"
                      : "bg-[#ECFDF5] text-[#059669]"
                  }`}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 items-start mb-10 max-w-md mx-auto">
            {/* Ongoing Protection card */}
            <SubscriptionCard
              tier={protection}
              icon={ShieldCheck}
              accentColor="#1D4ED8"
              highlight
              onCheckout={handleCheckout}
              checkingOut={checkingOut}
            />
          </div>

          {/* Error surface */}
          {checkoutError && (
            <div
              role="alert"
              className="mt-4 max-w-md mx-auto rounded-lg border border-[#DC2626]/20 bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626] text-center"
            >
              {checkoutError}
            </div>
          )}

          {/* Promo code */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-12 max-w-md mx-auto"
          >
            <PromoCodeInput isAuthenticated={!!session} />
          </motion.div>

          {/* Free-tier footnote */}
          <p className="text-center mt-10 text-[#94A3B8] text-sm">
            Not ready yet?{" "}
            <a
              href="/tools/cyber-audit"
              className="text-[#1D4ED8] font-semibold hover:text-[#1E40AF]"
            >
              Start with the free Quick Check
            </a>
            .
          </p>

          {/* Closing line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <p className="text-xl sm:text-2xl font-semibold text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Built for the small businesses, practices, and nonprofits
              learning to work securely alongside AI.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Subscription card — Ongoing Protection
// ---------------------------------------------------------------------------
function SubscriptionCard({
  tier,
  icon: Icon,
  accentColor,
  highlight,
  onCheckout,
  checkingOut,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl border p-8 flex flex-col shadow-sm ${
        highlight ? "border-[#1D4ED8]/30" : "border-[#E2E8F0]"
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
        <h3 className="text-lg font-semibold text-[#0F172A]">{tier.name}</h3>
      </div>

      <p className="text-[#475569] text-sm leading-relaxed mb-5">
        {tier.tagline}
      </p>

      <div className="mb-1">
        <span className="text-4xl font-bold text-[#0F172A]">{tier.price}</span>
        <span className="text-[#94A3B8] text-base ml-1">{tier.priceLabel}</span>
      </div>
      {tier.caption && (
        <p className="text-xs text-[#94A3B8] mb-6">{tier.caption}</p>
      )}

      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[#475569] text-sm leading-relaxed"
          >
            <Check className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          onCheckout({
            priceId: tier.priceId,
            mode: tier.mode,
            key: tier.key,
          })
        }
        disabled={!!checkingOut}
        className="block text-center rounded-lg py-3 px-4 font-semibold text-sm transition-all bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-sm disabled:opacity-70"
      >
        {checkingOut === tier.key ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
          </span>
        ) : (
          tier.cta
        )}
      </button>
    </motion.div>
  )
}
