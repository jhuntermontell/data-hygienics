"use client"
import { motion } from "framer-motion"
import { Shield, FileText, BookOpen, Sparkles, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    icon: Shield,
    name: "Cyber Audit",
    description: "Assess your security posture and get a scored report with actionable gaps.",
    href: "/tools/cyber-audit",
    active: true,
    badge: "Try It",
    badgeColor: "bg-[#EFF6FF] text-[#1D4ED8]",
  },
  {
    icon: FileText,
    name: "Policy Library",
    description: "Generate the 9 cybersecurity policies your insurance provider wants to see.",
    href: "/tools/policies",
    active: true,
    badge: "New",
    badgeColor: "bg-[#F0FDFA] text-[#0F766E]",
  },
  {
    icon: BookOpen,
    name: "Controls Library",
    description: "Plain-English explanations of every cybersecurity control. No account required.",
    href: "/controls",
    active: true,
    badge: "Free",
    badgeColor: "bg-[#ECFDF5] text-[#059669]",
  },
  {
    icon: Sparkles,
    name: "More Tools Coming",
    description: "Vendor Risk Scorecard, Incident Response Planner, and Score Tracking Dashboard.",
    active: false,
    badge: "Soon",
    badgeColor: "bg-[#F1F5F9] text-[#94A3B8]",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function ToolsPreview() {
  return (
    <section id="tools" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-[#1D4ED8] text-xs font-medium tracking-wide">
            Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-2 leading-tight tracking-tight">
            Security tools built for your business
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#475569] text-base max-w-xl mb-14"
        >
          Professional-grade cybersecurity tools, built for the people actually running the business.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {tools.map((tool) => {
            const Icon = tool.icon
            const isActive = tool.active
            const Wrapper = tool.href ? Link : "div"
            const wrapperProps = tool.href ? { href: tool.href } : {}

            return (
              <motion.div
                key={tool.name}
                variants={item}
                className={`bg-white rounded-xl border overflow-hidden group transition-all duration-200 ${
                  isActive ? "border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-0.5" : "border-[#F1F5F9] opacity-70"
                }`}
              >
                <Wrapper {...wrapperProps} className={tool.href ? "block" : undefined}>
                  <div className="h-36 bg-[#F8FAFC] flex items-center justify-center border-b border-[#F1F5F9]">
                    <Icon className={`w-8 h-8 ${isActive ? "text-[#1D4ED8]" : "text-[#94A3B8]"}`} />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-[#0F172A] font-semibold text-sm">{tool.name}</h3>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${tool.badgeColor} flex items-center gap-1`}>
                        {!isActive && <Clock className="w-2.5 h-2.5" />}
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-[#475569] text-xs leading-relaxed">{tool.description}</p>
                  </div>
                </Wrapper>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
