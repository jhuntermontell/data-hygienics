"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, X, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PRICES } from "@/lib/stripe/prices"

const options = [
  {
    label: "Starter",
    price: "$49/mo",
    desc: "For individuals",
    priceId: PRICES.starter,
    mode: "subscription",
  },
  {
    label: "Professional",
    price: "$149/mo",
    desc: "Most popular",
    popular: true,
    priceId: PRICES.professional,
    mode: "subscription",
  },
]

const oneTimeOptions = {
  reports: {
    label: "One-time Assessment Bundle",
    price: "$149",
    priceId: PRICES.assessmentBundle,
  },
  policies: {
    label: "All 9 Policies — One-time",
    price: "$199",
    priceId: PRICES.policyBundle,
  },
}

export default function UpgradeModal({ onClose, feature = "Full Report", showOneTime = "reports" }) {
  const [checkingOut, setCheckingOut] = useState(null)

  async function handleCheckout(priceId, mode) {
    setCheckingOut(priceId)
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          mode,
          successUrl: `${window.location.origin}/tools/cyber-audit/dashboard?welcome=true`,
          cancelUrl: window.location.href,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setCheckingOut(null)
    }
  }

  const oneTime = oneTimeOptions[showOneTime]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white shadow-xl p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#475569] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EFF6FF] mb-4">
            <Lock className="w-7 h-7 text-[#1D4ED8]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1">
            Unlock {feature}
          </h2>
          <p className="text-[#475569] text-sm">
            Choose a plan that works for you
          </p>
        </div>

        <div className="space-y-3 mb-4">
          {options.map((opt) => (
            <button
              key={opt.priceId}
              onClick={() => handleCheckout(opt.priceId, opt.mode)}
              disabled={!!checkingOut}
              className={`w-full text-left rounded-lg border p-4 transition-all ${
                opt.popular
                  ? "border-[#1D4ED8] bg-[#EFF6FF]/50"
                  : "border-[#E2E8F0] hover:border-[#CBD5E1]"
              } ${checkingOut === opt.priceId ? "opacity-70" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0F172A]">{opt.label}</span>
                    {opt.popular && (
                      <span className="text-[10px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#475569]">{opt.desc}</span>
                </div>
                <span className="text-lg font-bold text-[#0F172A]">{opt.price}</span>
              </div>
            </button>
          ))}
        </div>

        {oneTime && (
          <button
            onClick={() => handleCheckout(oneTime.priceId, "payment")}
            disabled={!!checkingOut}
            className={`w-full text-left rounded-lg border border-dashed border-[#E2E8F0] hover:border-[#CBD5E1] p-4 transition-all mb-4 ${
              checkingOut === oneTime.priceId ? "opacity-70" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-[#0F172A]">{oneTime.label}</span>
                <p className="text-xs text-[#475569]">Pay once, keep forever</p>
              </div>
              <span className="text-lg font-bold text-[#0F172A]">{oneTime.price}</span>
            </div>
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full text-center text-sm text-[#94A3B8] hover:text-[#475569] transition-colors py-2"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  )
}
