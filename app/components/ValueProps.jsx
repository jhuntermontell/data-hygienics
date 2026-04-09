"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Building2, Zap } from "lucide-react"

const props = [
  {
    icon: ShieldCheck,
    title: "No vendor bias. Ever.",
    text: "We don't sell security products. We don't receive referral fees from vendors. Our job is to tell you the truth about where you stand.",
  },
  {
    icon: Building2,
    title: "Built for real businesses.",
    text: "Not enterprise. Not Fortune 500. Built for the law firm with 12 employees, the medical practice with no IT department, the nonprofit protecting donor data.",
  },
  {
    icon: Zap,
    title: "From assessment to action in minutes.",
    text: "Take the assessment, get your score, download your report. No sales calls. No waiting. No upsells.",
  },
]

export default function ValueProps() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {props.map((prop, i) => {
            const Icon = prop.icon
            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#1D4ED8]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">{prop.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{prop.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
