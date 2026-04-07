"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Building2, Zap } from "lucide-react"

const props = [
  {
    icon: Building2,
    title: "Built for business leaders, not IT departments.",
    text: "Whether you're a CFO, office manager, or firm partner, if cybersecurity landed in your lap, this platform was built for you.",
  },
  {
    icon: ShieldCheck,
    title: "No vendor. No bias. No upsell.",
    text: "We don't sell security products. We don't take referral fees. Our only job is to give you an honest picture of where you stand.",
  },
  {
    icon: Zap,
    title: "From assessment to action in minutes.",
    text: "Take the assessment, see your score, download your report. Clear priorities. Real recommendations. No waiting.",
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
