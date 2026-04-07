"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Building2,
  FileText,
} from "lucide-react"

const functionColors = {
  Identify: "bg-violet-50 text-violet-700 border-violet-200",
  Protect: "bg-[#EFF6FF] text-[#1D4ED8] border-blue-200",
  Detect: "bg-amber-50 text-amber-700 border-amber-200",
  Respond: "bg-orange-50 text-orange-700 border-orange-200",
  Recover: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const industryLabels = {
  healthcare: "Healthcare (HIPAA)",
  legal: "Legal (ABA Guidelines)",
  financial: "Financial Services (GLBA/PCI-DSS)",
  retail: "Retail / E-commerce (PCI-DSS)",
  government: "Government / Defense (CMMC 2.0)",
}

export default function ControlDetailClient({ control }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/controls"
            className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Controls
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#1D4ED8]" />
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
              Security Control
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] leading-tight tracking-tight mb-4">
            {control.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                functionColors[control.nistFunction]
              }`}
            >
              NIST {control.nistFunction}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
              {control.nistCategory}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
              CIS Control {control.cisControl}: {control.cisControlName}
            </span>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[#0F172A] mb-4">
            What This Control Means
          </h2>
          <div className="text-[#475569] text-sm leading-relaxed space-y-4">
            {control.explanation.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Insurance relevance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-8 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#1D4ED8]" />
            <h2 className="text-lg font-bold text-[#0F172A]">
              Why Insurers Care
            </h2>
          </div>
          <div className="text-[#475569] text-sm leading-relaxed space-y-4">
            {control.insuranceRelevance.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Industry notes */}
        {control.industryNotes && Object.keys(control.industryNotes).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-[#475569]" />
              <h2 className="text-lg font-bold text-[#0F172A]">
                Industry-Specific Notes
              </h2>
            </div>
            <div className="space-y-4">
              {Object.entries(control.industryNotes).map(([key, note]) => (
                <div key={key}>
                  <h3 className="text-xs font-semibold text-[#0F172A] mb-1">
                    {industryLabels[key] || key}
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Implementation steps */}
        {control.implementationSteps?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">
              Implementation Steps
            </h2>
            <div className="space-y-3">
              {control.implementationSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EFF6FF] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  </div>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-center pt-6"
        >
          <p className="text-[#475569] text-sm mb-4">
            Want to know how your organization measures up on this control?
          </p>
          <Link
            href="/tools/cyber-audit"
            className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1E40AF] transition-colors"
          >
            Take the free assessment →
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
