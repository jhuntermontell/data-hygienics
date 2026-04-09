"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Store, Mail, Check } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

export default function VendorReviewsPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            {...fadeUp}
            className="inline-flex items-center gap-2 bg-[#F0FDFA] text-[#0F766E] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide"
          >
            Coming Q3 2026
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="w-14 h-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-6"
          >
            <Store className="w-7 h-7 text-[#1D4ED8]" />
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-5"
          >
            Is your software actually secure?
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="text-[#475569] text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Plain-English security reviews of the tools your business already uses. No sponsorships. No affiliate links.
          </motion.p>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="text-[#475569] text-base leading-[1.8] mb-10 max-w-xl mx-auto"
          >
            We&apos;re building detailed security reviews for the most common tools used by small businesses: Microsoft 365, Google Workspace, QuickBooks, Dropbox, Zoom, Slack, and more. Each review covers what security features the product offers, what&apos;s turned on by default, and the settings most businesses get wrong.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.25 }}
            className="max-w-md mx-auto"
          >
            {submitted ? (
              <div className="flex items-center justify-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] px-5 py-4 rounded-lg text-sm font-medium">
                <Check className="w-4 h-4" />
                Thanks. We&apos;ll let you know when it launches.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full h-12 rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-[#1D4ED8] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#1E40AF] transition-all shadow-sm"
                >
                  Notify me
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
