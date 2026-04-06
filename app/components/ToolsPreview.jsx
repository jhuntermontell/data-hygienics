"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Sparkles, FileText, Database, Shield } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const tools = [
  {
    icon: Shield,
    name: "Cyber Security Audit",
    description: "Assess your business security posture and get a prioritized action plan.",
    gradient: "from-green-500/10 via-green-500/[0.03] to-transparent",
    iconColor: "text-green-400/50",
    href: "/tools/cyber-audit",
  },
  {
    icon: Sparkles,
    name: "AI Review Responder",
    description: "Turn customer reviews into professional, on-brand replies in seconds.",
    gradient: "from-blue-500/10 via-blue-500/[0.03] to-transparent",
    iconColor: "text-blue-400/50",
  },
  {
    icon: FileText,
    name: "Proposal Generator",
    description: "Describe your offer and get a clean, client-ready proposal.",
    gradient: "from-violet-500/10 via-violet-500/[0.03] to-transparent",
    iconColor: "text-violet-400/50",
  },
  {
    icon: Database,
    name: "Data Cleanup Tool",
    description: "Upload a messy spreadsheet and get it back clean and structured.",
    gradient: "from-cyan-500/10 via-cyan-500/[0.03] to-transparent",
    iconColor: "text-cyan-400/50",
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
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="tools" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
            Tools Hub
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            Tools for the Modern
            <br />
            Small Business.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-500 text-base max-w-xl mb-16"
        >
          Free. Practical. Built for people who are running a business, not a
          tech team.
        </motion.p>

        {/* Tool cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {tools.map((tool) => {
            const Icon = tool.icon
            const Wrapper = tool.href ? Link : "div"
            const wrapperProps = tool.href ? { href: tool.href } : {}

            return (
              <motion.div
                key={tool.name}
                variants={item}
                className="relative rounded-2xl border border-zinc-800 overflow-hidden group"
              >
                <Wrapper {...wrapperProps} className={tool.href ? "block" : undefined}>
                  {/* Gradient preview area */}
                  <div
                    className={`h-44 bg-gradient-to-br ${tool.gradient} flex items-center justify-center border-b border-zinc-800`}
                  >
                    <Icon className={`w-10 h-10 ${tool.iconColor}`} />
                  </div>

                  <div className="p-6 bg-[#0d0d0d]">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-base font-bold text-white leading-tight">
                        {tool.name}
                      </h3>
                      {tool.href ? (
                        <span className="inline-flex items-center gap-1.5 ml-3 shrink-0 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                          Try It
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 ml-3 shrink-0 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                          <Lock className="w-2.5 h-2.5" />
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </Wrapper>

                {/* Hover tint */}
                <div className="absolute inset-0 bg-blue-500/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Email capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto text-center"
        >
          <p className="text-zinc-500 text-sm mb-4 font-medium">
            Get notified when tools launch
          </p>
          {submitted ? (
            <p className="text-blue-400 font-semibold py-2">
              ✓ {/* TODO: Add your name */} You&apos;re on the list! We&apos;ll be in touch.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="whitespace-nowrap">
                Notify Me
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
