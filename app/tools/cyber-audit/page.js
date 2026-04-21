"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Clock,
  Zap,
  ArrowRight,
  Check,
  X,
} from "lucide-react"

const comparison = [
  { feature: "Questions", quick: "12", comprehensive: "60 to 80, industry-specific" },
  { feature: "Score and grade", quick: "yes", comprehensive: "yes" },
  { feature: "Gap identification", quick: "Top 3 visible", comprehensive: "All gaps visible" },
  { feature: "I don't know discovery guides", quick: "yes", comprehensive: "yes" },
  { feature: "Remediation plan", quick: "no", comprehensive: "Yes, prioritized" },
  { feature: "Product-specific drill-downs", quick: "no", comprehensive: "yes" },
  { feature: "Insurance carrier mapping", quick: "no", comprehensive: "yes" },
  { feature: "PDF reports", quick: "no", comprehensive: "Yes (insurance + remediation)" },
  { feature: "Score tracking over time", quick: "no", comprehensive: "yes" },
  { feature: "Industry-specific frameworks", quick: "no", comprehensive: "HIPAA, PCI, CMMC, GLBA, and more" },
]

function CheckOrText({ value }) {
  if (value === "yes") return <Check className="w-4 h-4 text-[#059669] mx-auto" />
  if (value === "no") return <X className="w-4 h-4 text-[#CBD5E1] mx-auto" />
  return <span className="text-[#475569] text-xs">{value}</span>
}

export default function CyberAuditLanding() {
  const supabase = createClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
  }, [])

  const comprehensiveHref = isLoggedIn
    ? "/tools/cyber-audit/assessment"
    : "/tools/cyber-audit/login"

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-blue-200 rounded-full px-4 py-1.5 mb-8"
          >
            <Shield className="w-4 h-4 text-[#1D4ED8]" />
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-wide uppercase">
              Cybersecurity Assessments
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-[1.1] tracking-tight mb-5"
          >
            Know where you stand.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#475569] text-lg max-w-xl mx-auto leading-relaxed"
          >
            Pick the assessment that fits where you are today. Start free in 5 minutes, or go deep with a comprehensive audit built for your industry.
          </motion.p>
        </div>
      </section>

      {/* Two paths */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Quick Assessment card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#0F766E] uppercase tracking-wide">
                Free, 5 minutes
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">Quick Security Check</h2>
            <p className="text-[#475569] text-sm leading-relaxed mb-6 flex-1">
              Answer 12 questions and see where your business stands. No account required to start. Get your score, gaps, and specific next steps.
            </p>
            <Link href="/tools/cyber-audit/quick">
              <Button className="w-full">
                <span className="flex items-center justify-center gap-2">
                  Start Quick Assessment
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
            <p className="text-[#94A3B8] text-xs text-center mt-3">
              No credit card required. 
            </p>
          </motion.div>

          {/* Comprehensive card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-[#1D4ED8]/20 bg-white shadow-md p-8 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#1D4ED8]" />
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#1D4ED8] uppercase tracking-wide">
                Subscription, 20 to 30 minutes
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">Comprehensive Cyber Audit</h2>
            <p className="text-[#475569] text-sm leading-relaxed mb-6 flex-1">
              A deep-dive assessment tailored to your industry with product-specific questions, configuration checks, insurance carrier mapping, and a prioritized remediation plan.
            </p>
            <Link href={comprehensiveHref}>
              <Button className="w-full">
                <span className="flex items-center justify-center gap-2">
                  Start Comprehensive Audit
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
            <p className="text-[#94A3B8] text-xs text-center mt-3">
              Unlocked by the Documentation Pack or Ongoing Protection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-6 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
              Compare
            </span>
            <h2 className="text-3xl font-bold text-[#0F172A] mt-2 tracking-tight">
              What each assessment includes
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-[#E2E8F0] overflow-hidden bg-white"
          >
            {/* Column headers */}
            <div className="grid grid-cols-[1.5fr_1fr_1.2fr] bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <div className="p-4 text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">
                Feature
              </div>
              <div className="p-4 text-center text-[#1D4ED8] text-xs font-semibold uppercase tracking-wider border-l border-[#E2E8F0]">
                Quick
              </div>
              <div className="p-4 text-center text-[#1D4ED8] text-xs font-semibold uppercase tracking-wider border-l border-[#E2E8F0]">
                Comprehensive
              </div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[1.5fr_1fr_1.2fr] ${i !== comparison.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}
              >
                <div className="p-4 text-[#0F172A] text-sm font-medium">{row.feature}</div>
                <div className="p-4 flex items-center justify-center border-l border-[#F1F5F9]">
                  <CheckOrText value={row.quick} />
                </div>
                <div className="p-4 flex items-center justify-center border-l border-[#F1F5F9] text-center">
                  <CheckOrText value={row.comprehensive} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
