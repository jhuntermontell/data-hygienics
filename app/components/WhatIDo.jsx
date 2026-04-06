"use client"
import { motion } from "framer-motion"
import { Wrench, Lightbulb, Code2 } from "lucide-react"

const services = [
  {
    icon: Wrench,
    title: "Free Tools for Small Business",
    description:
      "No-fluff tools that solve real problems — free, practical, and built for how small businesses actually work.",
    highlighted: false,
  },
  {
    icon: Lightbulb,
    title: "Consulting & Strategy",
    description:
      "Clear-eyed advice on where AI fits (and where it doesn't) for your business. No hype, just honest guidance.",
    highlighted: true,
  },
  {
    icon: Code2,
    title: "Custom Software & Automation",
    description:
      "When off-the-shelf doesn't cut it, I build systems tailored to your workflows — saving time and scaling with you.",
    highlighted: false,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function WhatIDo() {
  return (
    <section id="services" className="py-32 bg-[#080808]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-lime-400 text-xs font-semibold tracking-widest uppercase">
            What I Do
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            Three ways I<br />can help.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-3 gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={item}
                className={`relative rounded-2xl p-8 border transition-all duration-300 group cursor-default hover:-translate-y-1 ${
                  service.highlighted
                    ? "bg-lime-400/[0.04] border-lime-400/20 hover:border-lime-400/40 hover:bg-lime-400/[0.07]"
                    : "bg-white/[0.02] border-zinc-800 hover:border-zinc-600 hover:bg-white/[0.04]"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    service.highlighted ? "bg-lime-400/15" : "bg-zinc-800"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      service.highlighted ? "text-lime-400" : "text-zinc-400"
                    }`}
                  />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                  {service.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {service.description}
                </p>

                {service.highlighted && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-semibold text-lime-400 tracking-widest uppercase bg-lime-400/10 px-2.5 py-1 rounded-full border border-lime-400/20">
                      Popular
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
