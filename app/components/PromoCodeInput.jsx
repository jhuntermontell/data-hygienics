"use client"

import { useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { clearSubscriptionCache } from "@/lib/stripe/subscription"

const PLAN_LABELS = {
  free: "Free",
  starter: "Starter",
  professional: "Professional",
  msp: "MSP / Advisor",
}

/**
 * Reusable promo code redemption input.
 *
 * Props:
 *   isAuthenticated: boolean — controls signed-out messaging
 *   loginHref: string — where to send unauthenticated users
 *   onSuccess: () => void — optional callback after successful redemption
 */
export default function PromoCodeInput({
  isAuthenticated,
  loginHref = "/tools/cyber-audit/login",
  onSuccess,
}) {
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null) // { ok, plan } | { error }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim() || submitting) return

    if (!isAuthenticated) {
      setResult({ error: "auth" })
      return
    }

    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch("/api/promo/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        clearSubscriptionCache()
        setResult({ ok: true, plan: data.plan })
        if (onSuccess) onSuccess(data.plan)
      } else {
        setResult({ error: data.error || "invalid" })
      }
    } catch {
      setResult({ error: "server_error" })
    } finally {
      setSubmitting(false)
    }
  }

  if (result?.ok) {
    return (
      <div className="rounded-lg border border-[#0F766E]/30 bg-[#F0FDFA] p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#0F766E] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0F172A]">
              Code applied. You now have full access to the{" "}
              {PLAN_LABELS[result.plan] || result.plan} tier.
            </p>
            <Link
              href="/tools/cyber-audit/dashboard"
              className="inline-block mt-2 text-xs font-semibold text-[#0F766E] hover:text-[#0B5C56]"
            >
              Go to dashboard →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-[#94A3B8] mb-2">Have an access code?</p>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          disabled={submitting}
          className="flex-1 min-w-0 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting || !code.trim()}
          className="rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
        </button>
      </form>
      {result?.error === "auth" && (
        <p className="text-xs text-[#475569] mt-2">
          Please{" "}
          <Link href={loginHref} className="text-[#1D4ED8] font-semibold hover:underline">
            sign in or create an account
          </Link>{" "}
          first, then apply your code.
        </p>
      )}
      {result?.error && result.error !== "auth" && (
        <p className="text-xs text-[#B91C1C] mt-2">
          That code is not valid or has expired.
        </p>
      )}
    </div>
  )
}
