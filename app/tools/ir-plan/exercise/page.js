"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { createClient } from "@/lib/supabase/client"
import { getSubscription } from "@/lib/stripe/subscription"
import { INCIDENT_TYPES } from "@/lib/ir-plan/playbooks"
import { SCENARIOS } from "@/lib/ir-plan/scenarios"
import UpgradeModal from "@/app/tools/cyber-audit/components/UpgradeModal"
import {
  ArrowLeft,
  Clock,
  Lock,
  Mail,
  ShieldAlert,
  Fish,
  Smartphone,
  Sparkles,
  Play,
} from "lucide-react"

const ICON_MAP = { Lock, Mail, ShieldAlert, Fish, Smartphone }

export default function ExerciseSelectionPage() {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState(null)
  const [isPaid, setIsPaid] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }
      setUser(session.user)
      const [planRes, subData] = await Promise.all([
        supabase.from("ir_plans").select("*").eq("user_id", session.user.id).maybeSingle(),
        getSubscription(session.user.id),
      ])
      setPlan(planRes.data || null)
      setIsPaid(subData.access.canAccessIRPlan)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0F766E]/30 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <Link
          href="/tools/ir-plan"
          className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incident Response
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#0F766E]" />
            <span className="text-[#0F766E] text-xs font-medium tracking-wide">
              Tabletop Exercises
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            Rehearse your response
          </h1>
          <p className="text-[#475569] text-base max-w-2xl">
            A tabletop exercise walks you through a realistic scenario, decision by decision. You learn what works in your plan and what does not, in a low-risk environment your insurance broker will recognize.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {INCIDENT_TYPES.map((it) => {
            const Icon = ICON_MAP[it.icon] || ShieldAlert
            const scenario = SCENARIOS[it.key]
            if (!scenario) return null
            return (
              <motion.div
                key={it.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F0FDFA] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0F766E]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {scenario.estimatedMinutes} min
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1.5">{it.title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed mb-2 italic">
                  &ldquo;{scenario.title}&rdquo;
                </p>
                <p className="text-xs text-[#475569] leading-relaxed mb-4 flex-1">
                  {scenario.narrative_intro.slice(0, 150)}...
                </p>
                {plan && isPaid ? (
                  <Link
                    href={`/tools/ir-plan/exercise/${it.key}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#0E7490]"
                  >
                    <Play className="w-4 h-4" /> Start exercise
                  </Link>
                ) : !plan ? (
                  <Link
                    href="/tools/ir-plan/builder"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#0F766E] text-sm font-semibold px-4 py-2.5 rounded-lg border border-[#0F766E]/30"
                  >
                    Build your plan first
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#475569] text-sm font-semibold px-4 py-2.5 rounded-lg border border-[#E2E8F0]"
                  >
                    <Lock className="w-4 h-4" /> Unlock exercises
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
      <Footer />
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          feature="Tabletop Exercises"
        />
      )}
    </div>
  )
}
