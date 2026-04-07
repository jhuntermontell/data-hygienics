"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Building2, Zap } from "lucide-react"

const props = [
  {
    icon: ShieldCheck,
    title: "No vendor bias. Ever.",
    text: "We don't sell security products. We don't take referral fees. Our only job is to tell you the truth about where you stand.",
  },
  {
    icon: Building2,
    title: "Built for real businesses.",
    text: "Not enterprise. Not Fortune 500. Built for the law firm with 12 employees, the medical practice with no IT department, the church protecting donor data.",
  },
  {
    icon: Zap,
    title: "From assessment to action in minutes.",
    text: "Take the assessment, get your score, download your report. No sales calls. No waiting. No upsells.",
  },
]

export default function ValueProps() {
  return (
    <section className="py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {props.map((prop, i) => {
            const Icon = prop.icon
            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{prop.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{prop.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
