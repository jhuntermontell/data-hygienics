"use client"
import { motion } from "framer-motion"
import { Shield, ClipboardList, KeyRound, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    icon: Shield,
    name: "Cyber Security Audit",
    description: "Assess your security posture and get a scored report with actionable gaps.",
    gradient: "from-blue-500/10 via-blue-500/[0.03] to-transparent",
    iconColor: "text-blue-400/50",
    href: "/tools/cyber-audit",
    active: true,
  },
  {
    icon: ClipboardList,
    name: "Vendor Risk Scorecard",
    description: "Rate your vendors and third-party tools on security posture.",
    gradient: "from-violet-500/10 via-violet-500/[0.03] to-transparent",
    iconColor: "text-violet-400/50",
  },
  {
    icon: KeyRound,
    name: "Password Audit Tool",
    description: "Check your password policy strength against current best practices.",
    gradient: "from-cyan-500/10 via-cyan-500/[0.03] to-transparent",
    iconColor: "text-cyan-400/50",
  },
  {
    icon: AlertTriangle,
    name: "Incident Response Planner",
    description: "Build a step-by-step incident response plan tailored to your organization.",
    gradient: "from-orange-500/10 via-orange-500/[0.03] to-transparent",
    iconColor: "text-orange-400/50",
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

export default function ToolsPreview() {
  return (
    <section id="tools" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
            Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            Security tools that
            <br />
            speak plain English.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-500 text-base max-w-xl mb-16"
        >
          Built for people running a business, not a security operations center.
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
                className={`relative rounded-2xl border overflow-hidden group ${
                  isActive ? "border-zinc-800" : "border-zinc-800/50 opacity-70"
                }`}
              >
                <Wrapper {...wrapperProps} className={tool.href ? "block" : undefined}>
                  <div
                    className={`h-44 bg-gradient-to-br ${tool.gradient} flex items-center justify-center border-b border-zinc-800`}
                  >
                    <Icon className={`w-10 h-10 ${tool.iconColor}`} />
                  </div>
                  <div className="p-5 bg-[#0d0d0d]">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-sm">
                        {tool.name}
                      </h3>
                      {!isActive && (
                        <span className="text-[9px] font-semibold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> SOON
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      {tool.description}
                    </p>
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
