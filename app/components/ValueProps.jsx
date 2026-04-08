"use client"
import { motion } from "framer-motion"
import { Zap, ShieldCheck, BookOpen } from "lucide-react"

const props = [
  {
    icon: Zap,
    title: "Clarity in 20 minutes",
    text: "Complete the assessment, get your score, understand your gaps. No waiting, no sales call, no consultant required.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance-ready in an afternoon",
    text: "Download the reports your broker needs and the policies your insurer wants to see, all in one session.",
  },
  {
    icon: BookOpen,
    title: "Grow your knowledge, not just your compliance",
    text: "Our free Controls Library explains every security concept in plain English. Because an informed business owner makes better decisions.",
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
