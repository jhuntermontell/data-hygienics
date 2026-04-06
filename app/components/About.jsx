"use client"
import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="about" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-zinc-700">
                <div className="w-28 h-28 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-zinc-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Your photo here</span>
              </div>
            </div>
            {/* Decorative accent blocks */}
            <div className="absolute -bottom-5 -right-5 w-40 h-40 rounded-2xl bg-lime-400/[0.06] border border-lime-400/10 -z-10" />
            <div className="absolute -top-5 -left-5 w-24 h-24 rounded-2xl bg-zinc-800/40 border border-zinc-700/20 -z-10" />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-lime-400 text-xs font-semibold tracking-widest uppercase">
              Who&apos;s Behind This
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-6 leading-tight tracking-tight">
              Hi, I&apos;m
              <br />
              [Your Name].
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-5">
              I&apos;m a technologist who keeps up with everything so you don&apos;t have
              to. I build tools and strategies that help small businesses move
              with the times — practically and affordably.
            </p>
            <p className="text-zinc-500 leading-relaxed mb-8">
              No corporate fluff. No overpriced retainers. Just someone who
              genuinely loves technology and wants to see small businesses use
              it well.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center text-lime-400 text-sm font-semibold hover:text-lime-300 transition-colors group"
            >
              Let&apos;s work together
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
