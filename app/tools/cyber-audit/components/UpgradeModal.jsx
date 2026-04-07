"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PRICES } from "@/lib/stripe/prices"

const subscriptionOptions = [
  {
    key: "starter",
    label: "Starter",
    price: "$49/mo",
    desc: "For individuals",
    priceId: PRICES.starter,
    mode: "subscription",
  },
  {
    key: "professional",
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
    key: "reports",
    label: "One-time Assessment Bundle",
    price: "$149",
    priceId: PRICES.assessmentBundle,
    mode: "payment",
  },
  policies: {
    key: "policies",
    label: "All 9 Policies — One-time",
    price: "$199",
    priceId: PRICES.policyBundle,
    mode: "payment",
  },
}

export default function UpgradeModal({ onClose, feature = "Full Report", showOneTime = "reports" }) {
  const [selected, setSelected] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const oneTime = oneTimeOptions[showOneTime]
  const allOptions = [
    ...subscriptionOptions,
    ...(oneTime ? [oneTime] : []),
  ]

  const selectedOption = allOptions.find((o) => o.key === selected)

  async function handleContinue() {
    if (!selectedOption) return
    setCheckingOut(true)
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: selectedOption.priceId,
          mode: selectedOption.mode,
          successUrl: `${window.location.origin}/tools/cyber-audit/dashboard?welcome=true`,
          cancelUrl: window.location.href,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setCheckingOut(false)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setCheckingOut(false)
    }
  }

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
          {subscriptionOptions.map((opt) => {
            const isSelected = selected === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                disabled={checkingOut}
                className={`w-full text-left rounded-lg border p-4 transition-all ${
                  isSelected
                    ? "border-[#1D4ED8] bg-[#EFF6FF]/60 ring-1 ring-[#1D4ED8]/30"
                    : opt.popular
                    ? "border-[#1D4ED8]/30 hover:border-[#1D4ED8]/60"
                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
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
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#0F172A]">{opt.price}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {oneTime && (
          <button
            onClick={() => setSelected(oneTime.key)}
            disabled={checkingOut}
            className={`w-full text-left rounded-lg border border-dashed p-4 transition-all mb-5 ${
              selected === oneTime.key
                ? "border-[#1D4ED8] bg-[#EFF6FF]/60 ring-1 ring-[#1D4ED8]/30"
                : "border-[#E2E8F0] hover:border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-[#0F172A]">{oneTime.label}</span>
                <p className="text-xs text-[#475569]">Pay once, keep forever</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#0F172A]">{oneTime.price}</span>
                {selected === oneTime.key && (
                  <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </button>
        )}

        <Button
          onClick={handleContinue}
          disabled={!selected || checkingOut}
          className="w-full"
        >
          {checkingOut ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting to checkout...
            </span>
          ) : selected ? (
            `Continue with ${selectedOption?.label}`
          ) : (
            "Select a plan"
          )}
        </Button>

        <button
          onClick={onClose}
          className="w-full text-center text-sm text-[#94A3B8] hover:text-[#475569] transition-colors py-3 mt-1"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  )
}
