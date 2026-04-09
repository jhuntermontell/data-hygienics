"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import HeroScoreGauge from "./HeroScoreGauge"

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center lg:items-center min-h-screen">
        {/* Left column: text */}
        <div className="w-full lg:w-1/2 lg:pr-12 flex flex-col justify-center py-12 lg:py-0">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-block text-[#0F766E] text-[13px] font-semibold tracking-[0.08em] mb-6"
          >
            Cybersecurity Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] tracking-tight text-[#0F172A] mb-6"
          >
            Cybersecurity tools for the people actually running the business.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="text-[#475569] text-xl leading-[1.55] max-w-[520px] mb-5"
          >
            Whether you&apos;re a CFO, office manager, or firm partner, if cybersecurity landed in your lap, this platform was built for you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[#475569] text-base leading-[1.7] max-w-[520px] mb-8"
          >
            We don&apos;t sell security products. We don&apos;t take referral fees. Our only job is to give you an honest picture of where you stand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-5"
          >
            <Link
              href="/tools/cyber-audit"
              className="inline-flex items-center bg-[#1D4ED8] text-white font-semibold text-sm px-7 py-3 rounded-lg hover:bg-[#1E40AF] transition-all duration-150 shadow-sm"
            >
              Start the Free Assessment
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center bg-white border border-[#1D4ED8] text-[#1D4ED8] font-semibold text-sm px-7 py-3 rounded-lg hover:bg-[#EFF6FF] transition-all duration-150"
            >
              How It Works
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="text-[#94A3B8] text-[13px]"
          >
            No credit card required &nbsp;&middot;&nbsp; Results in under 20 minutes
          </motion.p>
        </div>

        {/* Right column: score gauge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full lg:w-1/2 h-[400px] sm:h-[480px] lg:h-[600px] flex items-center justify-center"
        >
          <HeroScoreGauge />
        </motion.div>
      </div>
    </section>
  )
}
