"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getSubscription } from "@/lib/stripe/subscription"
import { POLICIES, FREE_POLICY_SLUGS } from "@/lib/policies"
import { STARTER_POLICY_LIMIT, isLegacyPlan } from "@/lib/stripe/access"
import UpgradeModal from "@/app/tools/cyber-audit/components/UpgradeModal"
import {
  FileText,
  ArrowRight,
  Lock,
  Check,
  Clock,
  Sparkles,
} from "lucide-react"

export default function PolicyHubPage() {
  const [user, setUser] = useState(null)
  const [completedSlugs, setCompletedSlugs] = useState(new Set())
  const [showUpgrade, setShowUpgrade] = useState(false)
  // Full subscription + purchases snapshot so we can compute per-slug
  // entitlement (new docs_pack purchase, legacy policy bundle, legacy
  // individual purchases, legacy Starter policy cap, or Professional / MSP).
  const [plan, setPlan] = useState("free")
  const [canAccessFullLibrary, setCanAccessFullLibrary] = useState(false)
  const [individualPurchaseSlugs, setIndividualPurchaseSlugs] = useState(new Set())

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUser(session.user)

      const [{ data }, subData] = await Promise.all([
        supabase
          .from("generated_policies")
          .select("policy_type")
          .eq("user_id", session.user.id),
        getSubscription(session.user.id),
      ])
      if (data) setCompletedSlugs(new Set(data.map((p) => p.policy_type)))

      setPlan(subData.plan || "free")
      // access.canAccessPolicies is now the single merged flag that
      // accounts for Ongoing Protection / Agency subscriptions, legacy
      // Professional / MSP subscriptions, Documentation Pack purchase,
      // and legacy Policy Bundle purchase. Starter's policy cap is
      // handled separately below.
      setCanAccessFullLibrary(subData.access.canAccessPolicies)

      // Extract the slugs the user has individually purchased (legacy
      // $49 per-policy SKU; grandfathered for existing buyers).
      const individualSlugs = new Set()
      for (const p of subData.purchases || []) {
        if (p.purchase_type === "individual_policy" && p.metadata?.policy_slug) {
          individualSlugs.add(p.metadata.policy_slug)
        }
      }
      setIndividualPurchaseSlugs(individualSlugs)
    }
    load()
  }, [])

  const completedCount = POLICIES.filter((p) => completedSlugs.has(p.slug)).length

  // Legacy Starter subscribers get 2 paid policies. No new signup ever
  // lands in this branch — Starter is grandfathered.
  const isStarter = plan === "starter"
  const nonFreeCompletedSlugs = Array.from(completedSlugs).filter(
    (slug) => !FREE_POLICY_SLUGS.includes(slug)
  )
  const starterUsedCount = nonFreeCompletedSlugs.length
  const starterSlotsLeft = Math.max(0, STARTER_POLICY_LIMIT - starterUsedCount)

  function canAccessPolicy(slug) {
    if (FREE_POLICY_SLUGS.includes(slug)) return true
    if (canAccessFullLibrary) return true
    if (individualPurchaseSlugs.has(slug)) return true
    if (isStarter) {
      // Editing an existing policy never counts against the limit; new
      // policies are gated on remaining slots.
      if (completedSlugs.has(slug)) return true
      if (starterSlotsLeft > 0) return true
    }
    return false
  }

  function handleLockedClick() {
    if (!user) {
      window.location.href = "/tools/cyber-audit/register"
      return
    }
    setShowUpgrade(true)
  }

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
                {canAccessFullLibrary
                  ? "All 9 policies unlocked"
                  : "Unlock all 9 policies"}
              </h2>
              <p className="text-[#475569] text-sm">
                {canAccessFullLibrary
                  ? "You have access to the full library. Generate any policy below."
                  : "The Documentation Pack ($299, one-time) includes all 9 customized policies plus the full assessment and incident response plan."}
              </p>
            </div>
          </div>
          {!canAccessFullLibrary && (
            <Button onClick={() => setShowUpgrade(true)}>
              <span className="flex items-center gap-2">
                Unlock all policies
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          )}
        </motion.div>

        {/* Legacy Starter tier usage indicator */}
        {isStarter && (
          <div className="mb-6 rounded-xl border border-[#1D4ED8]/20 bg-[#EFF6FF] px-5 py-3 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <p className="text-sm text-[#0F172A]">
              <span className="font-semibold">
                {starterUsedCount} of {STARTER_POLICY_LIMIT} paid policies used
              </span>
              {starterSlotsLeft > 0 ? (
                <span className="text-[#475569]">
                  {" "}
                  &middot; Choose your next policy or upgrade to the Documentation Pack for all 9.
                </span>
              ) : (
                <span className="text-[#475569]">
                  {" "}
                  &middot; You can still edit your existing policies. The Documentation Pack unlocks the rest.
                </span>
              )}
            </p>
          </div>
        )}

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
            const isFree = FREE_POLICY_SLUGS.includes(policy.slug)
            const isAccessible = canAccessPolicy(policy.slug)
            const hasIndividual = individualPurchaseSlugs.has(policy.slug)

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
                    {isFree ? (
                      <span className="text-[10px] font-medium text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    ) : hasIndividual ? (
                      <span className="text-[10px] font-medium text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded-full">
                        Purchased
                      </span>
                    ) : !isAccessible ? (
                      <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                    ) : null}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-[#0F172A] mb-1.5">{policy.name}</h3>
                <p className="text-xs text-[#475569] leading-relaxed mb-4 flex-1">{policy.description}</p>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#94A3B8] flex items-center gap-1 shrink-0">
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
                      onClick={handleLockedClick}
                      className="text-[#1D4ED8] text-xs font-semibold hover:text-[#1E40AF] transition-colors flex items-center gap-1 cursor-pointer"
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

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature="All Policies" />}
      <Footer />
    </div>
  )
}
