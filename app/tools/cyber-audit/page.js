"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import {
  Shield,
  MessageSquareText,
  BarChart3,
  FileDown,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

const benefits = [
  {
    icon: MessageSquareText,
    title: "Plain English Questions",
    description:
      "No jargon, no technical background required. Every question is written for business owners, not engineers.",
  },
  {
    icon: BarChart3,
    title: "Instant Scored Report",
    description:
      "Get your overall score, letter grade, and section-by-section breakdown the moment you finish.",
  },
  {
    icon: FileDown,
    title: "Printable PDF for Insurance Forms",
    description:
      "Download a clean, branded report you can attach to cyber liability insurance applications.",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function CyberAuditLanding() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-blue-200 rounded-full px-4 py-1.5 mb-8">
              <Shield className="w-4 h-4 text-[#1D4ED8]" />
              <span className="text-[#1D4ED8] text-xs font-semibold tracking-wide uppercase">
                Free Cybersecurity Assessment
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl md:text-7xl font-black text-[#0F172A] leading-[1.05] tracking-tight mb-6"
          >
            Know Where
            <br />
            You Stand.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[#475569] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A free guided cybersecurity audit built for small businesses.
            Complete it in under 30 minutes and get a report you can actually
            use for insurance applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link href="/tools/cyber-audit/register">
              <Button size="lg">
                <span className="flex items-center gap-2">
                  Start Your Free Audit
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-3 leading-tight tracking-tight">
              Simple, Actionable, Useful.
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  variants={item}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-7 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-blue-200 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#1D4ED8]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-24 px-6 border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
              Your Report Includes
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-3 mb-10 leading-tight tracking-tight">
              Everything You Need
              <br />
              to Take Action.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {[
              "Overall security score with letter grade (A-F)",
              "Section-by-section breakdown across 8 security areas",
              "Prioritized list of gaps with plain English recommendations",
              "Downloadable PDF report for insurance and compliance",
              "Actionable next steps you can take today",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5" />
                <span className="text-[#475569] text-sm">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-[#E2E8F0]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4 leading-tight tracking-tight">
            Ready to Find Out?
          </h2>
          <p className="text-[#475569] mb-8">
            It takes less than 30 minutes and it is completely free. No credit card,
            no sales call, no catch.
          </p>
          <Link href="/tools/cyber-audit/register">
            <Button size="lg">
              <span className="flex items-center gap-2">
                Start Your Free Audit
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
