"use client"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Lime orb — top left */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 800,
            height: 800,
            top: "-10%",
            left: "-20%",
            background:
              "radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 65%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Blue orb — bottom right */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600,
            height: 600,
            bottom: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)",
          }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-16">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2.5 bg-lime-400/10 text-lime-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border border-lime-400/15">
            <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
            AI tools for the real economy
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-[96px] font-black leading-[0.88] tracking-[-0.03em] text-white mb-8"
        >
          Your business,
          <br />
          <span className="text-lime-400">AI-ready.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Practical tools, real strategy, and custom software — everything small
          businesses need to step into the AI era without the noise.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#tools"
            className="inline-flex items-center bg-lime-400 text-black font-bold text-base px-8 py-4 rounded-xl hover:bg-lime-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(163,230,53,0.25)]"
          >
            Explore the Tools
          </a>
          <a
            href="#contact"
            className="inline-flex items-center border border-zinc-700 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-zinc-900 hover:border-zinc-500 transition-all duration-200 hover:-translate-y-0.5"
          >
            Work With Me →
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="flex flex-wrap justify-center gap-12 mt-24 pt-10 border-t border-white/[0.05]"
        >
          {[
            { value: "3+", label: "Free Tools" },
            { value: "AI-native", label: "Approach" },
            { value: "Zero", label: "Corporate fluff" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-zinc-600 font-semibold tracking-widest uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-700"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent"
        />
      </motion.div>
    </section>
  )
}
