"use client"
import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Parallax background */}
      <motion.div
        style={{ y: bgY, opacity: bgOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 900,
            height: 700,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-60%",
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.14) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            bottom: "-5%",
            right: "-5%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)",
          }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2.5 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border border-blue-500/20">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            The unbiased cybersecurity platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-[80px] font-black leading-[0.92] tracking-[-0.03em] text-white mb-8"
        >
          You didn&apos;t ask to be
          <br />
          <span className="text-blue-400">the tech person.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          The unbiased cybersecurity platform for small businesses, nonprofits,
          and the reluctant tech leaders who run them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="/tools/cyber-audit"
            className="inline-flex items-center bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-blue-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(59,130,246,0.35)]"
          >
            Start Your Free Assessment
          </Link>
          <Link
            href="/controls"
            className="inline-flex items-center border border-zinc-700 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-zinc-900 hover:border-zinc-500 transition-all duration-200 hover:-translate-y-0.5"
          >
            Browse the Controls Library
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-700"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent"
        />
      </motion.div>
    </section>
  )
}
