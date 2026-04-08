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
            We build tools for 
            <br />
            business leaders, not tech departments.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-[#475569] text-lg leading-[1.7] max-w-[480px] mb-8"
          >
            Whether you&apos;re a CFO, office manager, or firm partner, 
            This platform was built for you.
            We don&apos;t take referral fees.
            Our only job is to give you 
            an honest picture of where you stand.
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
              href="/why-data-hygienics"
              className="inline-flex items-center border border-[#E2E8F0] text-[#475569] font-semibold text-sm px-7 py-3 rounded-lg hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all duration-150"
            >
              Learn More
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
