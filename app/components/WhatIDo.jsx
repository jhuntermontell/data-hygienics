"use client"
import { motion } from "framer-motion"
import { Wrench, Lightbulb, Code2 } from "lucide-react"

const services = [
  {
    icon: Wrench,
    title: "Free Tools",
    description:
      "Practical AI-powered tools built specifically for small business owners. No subscription, no setup, no nonsense.",
  },
  {
    icon: Lightbulb,
    title: "Consulting & Strategy",
    description:
      "Not sure where to start with AI or your data? I'll help you cut through the noise and build a real plan.",
    highlighted: true,
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Need something built? I scope, design, and ship software that solves actual problems.",
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
          <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            How I Can Help.
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
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 group hover:-translate-y-1 ${
                  service.highlighted
                    ? "border-blue-500/25 bg-blue-500/[0.04] hover:border-blue-500/45 hover:bg-blue-500/[0.07]"
                    : "border-zinc-800 bg-white/[0.02] hover:border-zinc-600 hover:bg-white/[0.04]"
                }`}
              >
                {/* Blue top accent bar */}
                <div
                  className={`h-[3px] w-full ${
                    service.highlighted
                      ? "bg-blue-500"
                      : "bg-gradient-to-r from-blue-500/50 to-transparent"
                  }`}
                />

                <div className="p-8">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                      service.highlighted ? "bg-blue-500/15" : "bg-zinc-800"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        service.highlighted ? "text-blue-400" : "text-zinc-400"
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
                    <div className="absolute top-5 right-4">
                      <span className="text-[10px] font-semibold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
