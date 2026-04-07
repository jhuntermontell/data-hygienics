"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/supabase/auth-context"
import { useSubscription } from "@/lib/hooks/useSubscription"
import { createClient } from "@/lib/supabase/client"
import { POLICIES } from "@/lib/policies"
import UpgradeModal from "@/app/tools/cyber-audit/components/UpgradeModal"
import {
  FileText,
  ArrowRight,
  Lock,
  Check,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react"

export default function PolicyHubPage() {
  const { user } = useAuth()
  const { access, hasPurchase } = useSubscription()
  const [completedSlugs, setCompletedSlugs] = useState(new Set())
  const [showUpgrade, setShowUpgrade] = useState(false)

  const isPaid = access.canAccessPolicies || hasPurchase("policy_bundle")

  useEffect(() => {
    if (!user) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("generated_policies")
        .select("policy_type")
        .eq("user_id", user.id)
      if (data) {
        setCompletedSlugs(new Set(data.map((p) => p.policy_type)))
      }
    }
    load()
  }, [user])

  const completedCount = POLICIES.filter((p) => completedSlugs.has(p.slug)).length

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#1D4ED8]" />
            <span className="text-[#1D4ED8] text-xs font-medium tracking-wide">
              Policy Library
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            Cybersecurity Policy Library
          </h1>
          <p className="text-[#475569] text-base max-w-2xl">
            The 9 policies your cyber insurance provider wants to see. Generated in minutes,
            customized for your organization.
          </p>
        </motion.div>

        {/* Bundle CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-white rounded-xl border border-[#1D4ED8]/20 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#1D4ED8]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Complete Insurance Package
              </h2>
              <p className="text-[#475569] text-sm">
                All 9 policies, $49 one-time or included in your subscription.
              </p>
            </div>
          </div>
          <Button onClick={() => isPaid ? null : setShowUpgrade(true)}>
            <span className="flex items-center gap-2">
              {isPaid ? "Start with the bundle" : "Unlock all policies"}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </motion.div>

        {/* Progress */}
        {user && completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-[#475569]">
              <Check className="w-4 h-4 text-[#059669]" />
              You have completed {completedCount} of 9 insurance-required policies
            </div>
            <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#059669] rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 9) * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Policy Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {POLICIES.map((policy, i) => {
            const isCompleted = completedSlugs.has(policy.slug)
            const isAccessible = policy.free || isPaid

            return (
              <motion.div
                key={policy.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#1D4ED8]" />
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="text-[10px] font-medium text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    )}
                    {policy.free ? (
                      <span className="text-[10px] font-medium text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    ) : !isPaid ? (
                      <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                    ) : null}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-[#0F172A] mb-1.5">{policy.name}</h3>
                <p className="text-xs text-[#475569] leading-relaxed mb-4 flex-1">{policy.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~{policy.estimatedMinutes} min
                  </span>
                  {isAccessible ? (
                    <Link
                      href={user ? `/tools/policies/${policy.slug}` : "/tools/cyber-audit/register"}
                      className="text-[#1D4ED8] text-xs font-semibold hover:text-[#1E40AF] transition-colors flex items-center gap-1"
                    >
                      {isCompleted ? "Edit" : "Start"} <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setShowUpgrade(true)}
                      className="text-[#94A3B8] text-xs font-semibold hover:text-[#1D4ED8] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Unlock <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature="All Policies" showOneTime="policies" />}
      <Footer />
    </div>
  )
}
