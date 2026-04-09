"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import AuthorByline from "@/app/components/AuthorByline"
import TLDR from "@/app/components/TLDR"
import { ArrowLeft, AlertTriangle, HelpCircle, BookOpen, ArrowRight } from "lucide-react"

const industryColors = {
  Healthcare: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20",
  Legal: "bg-[#EFF6FF] text-[#1D4ED8] border-blue-200",
  "Financial Services": "bg-[#ECFDF5] text-[#059669] border-[#059669]/20",
}

export default function ThreatDetailClient({ threat }) {
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
            href="/threats"
            className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Threats
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            <span className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase">
              Industry Threat Guide
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] leading-tight tracking-tight mb-4">
            {threat.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                industryColors[threat.industry] ||
                "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"
              }`}
            >
              {threat.industry}
            </span>
          </div>
        </motion.div>

        {/* Author byline */}
        <AuthorByline showFull={true} lastReviewed={threat.lastReviewed} />

        {/* TL;DR */}
        <TLDR summary={threat.tldr} />

        {/* Main content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm threat-content"
          dangerouslySetInnerHTML={{ __html: threat.content }}
        />

        {/* FAQ Section */}
        {threat.faqs?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[#475569]" />
              <h2 className="text-lg font-bold text-[#0F172A]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-6">
              {threat.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sources */}
        {threat.sources?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#475569]" />
              <h2 className="text-lg font-bold text-[#0F172A]">Sources</h2>
            </div>
            <ul className="space-y-2">
              {threat.sources.map((source, i) => (
                <li
                  key={i}
                  className="text-[#475569] text-sm leading-relaxed"
                >
                  {source}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-center pt-6"
        >
          <p className="text-[#475569] text-sm mb-4">
            Want to see how your organization measures up against these threats?
          </p>
          <Link
            href={threat.ctaLink}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1E40AF] transition-colors"
          >
            {threat.ctaText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
