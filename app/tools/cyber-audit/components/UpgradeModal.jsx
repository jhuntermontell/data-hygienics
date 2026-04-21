"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, X, Check, Loader2, FileText, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getActivePrices } from "@/lib/stripe/prices"
import PromoCodeInput from "@/app/components/PromoCodeInput"

const PRICES = getActivePrices()

// The upgrade modal surfaces the two conversion paths: one-time
// Documentation Pack or Ongoing Protection subscription. Agency Plan is
// intentionally not shown here because agency signups go through the full
// pricing page (seat selection, billing details, etc) rather than a modal.
const upgradeOptions = [
  {
    key: "docs_pack",
    label: "Documentation Pack",
    price: "$299",
    priceLabel: "one-time",
    desc: "Everything you need for your next insurance application.",
    icon: FileText,
    priceId: PRICES.docsPack,
    mode: "payment",
    popular: true,
    bullets: [
      "Full comprehensive assessment",
      "All 9 customized policies",
      "Incident Response Plan",
    ],
  },
  {
    key: "protection_monthly",
    label: "Ongoing Protection",
    price: "$49",
    priceLabel: "/month",
    desc: "Stay ready for renewal season, every season.",
    icon: ShieldCheck,
    priceId: PRICES.protectionMonthly,
    mode: "subscription",
    bullets: [
      "Everything in the Documentation Pack",
      "Quarterly reassessments",
      "Policy update workflow",
    ],
  },
]

export default function UpgradeModal({ onClose, feature = "Full Report" }) {
  const [selected, setSelected] = useState("docs_pack")
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState("")

  const selectedOption = upgradeOptions.find((o) => o.key === selected)

  async function handleContinue() {
    if (!selectedOption) return
    setCheckingOut(true)
    setError("")
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: selectedOption.priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error || "Could not start checkout. Please try again.")
      setCheckingOut(false)
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Could not reach Stripe. Please try again.")
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
        className="relative w-full max-w-lg rounded-xl border border-[#E2E8F0] bg-white shadow-xl p-8 max-h-[90vh] overflow-y-auto"
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
            Choose how you want to use Data Hygienics.
          </p>
        </div>

        <div className="space-y-3 mb-5">
          {upgradeOptions.map((opt) => {
            const Icon = opt.icon
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
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#1D4ED8]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#0F172A]">
                          {opt.label}
                        </span>
                        {opt.popular && (
                          <span className="text-[10px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed mb-2">
                        {opt.desc}
                      </p>
                      <ul className="space-y-0.5">
                        {opt.bullets.map((b) => (
                          <li
                            key={b}
                            className="text-[11px] text-[#475569] flex items-center gap-1.5"
                          >
                            <Check className="w-3 h-3 text-[#0F766E] shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-[#0F172A]">
                        {opt.price}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        {opt.priceLabel}
                      </span>
                    </div>
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

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-[#DC2626]/20 bg-[#FEF2F2] px-3 py-2 text-xs text-[#DC2626]"
          >
            {error}
          </div>
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
          ) : selectedOption ? (
            `Continue with ${selectedOption.label}`
          ) : (
            "Select a plan"
          )}
        </Button>

        <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
          <PromoCodeInput
            isAuthenticated={true}
            onSuccess={() => {
              // Reload so the gated feature re-evaluates the new access level
              setTimeout(() => window.location.reload(), 1200)
            }}
          />
        </div>

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
