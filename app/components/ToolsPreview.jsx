"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Sparkles, FileText, Database } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const tools = [
  {
    icon: Sparkles,
    name: "AI Review Responder",
    description:
      "Instantly generate thoughtful, on-brand responses to customer reviews — good and bad.",
    gradient: "from-lime-400/10 via-lime-400/[0.03] to-transparent",
    iconColor: "text-lime-400/40",
  },
  {
    icon: FileText,
    name: "Proposal Generator",
    description:
      "Answer a few questions. Get a polished, professional proposal in seconds.",
    gradient: "from-blue-500/10 via-blue-500/[0.03] to-transparent",
    iconColor: "text-blue-400/40",
  },
  {
    icon: Database,
    name: "Data Cleanup Tool",
    description:
      "Upload messy spreadsheets. Get clean, structured data back — no formulas required.",
    gradient: "from-purple-500/10 via-purple-500/[0.03] to-transparent",
    iconColor: "text-purple-400/40",
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
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-lime-400 text-xs font-semibold tracking-widest uppercase">
              Tools Hub
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
              Built to save you
              <br />
              hours every week.
            </h2>
          </div>
          <p className="text-zinc-600 text-sm max-w-xs md:text-right">
            Tools are launching soon. Join the list to get early access.
          </p>
        </motion.div>

        {/* Tool cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-3 gap-5 mb-16"
        >
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.name}
                variants={item}
                className="relative rounded-2xl border border-zinc-800 overflow-hidden group"
              >
                {/* Gradient preview area */}
                <div
                  className={`h-44 bg-gradient-to-br ${tool.gradient} flex items-center justify-center border-b border-zinc-800`}
                >
                  <Icon className={`w-10 h-10 ${tool.iconColor}`} />
                </div>

                {/* Card content */}
                <div className="p-6 bg-[#0d0d0d]">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-1.5 ml-3 shrink-0">
                      <Lock className="w-3 h-3 text-zinc-600" />
                      <span className="text-xs text-zinc-600 font-medium">
                        Coming soon
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Hover tint */}
                <div className="absolute inset-0 bg-lime-400/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Waitlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {submitted ? (
            <div className="text-center py-4">
              <p className="text-lime-400 font-semibold">
                ✓ You&apos;re on the list — we&apos;ll be in touch!
              </p>
            </div>
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
                Get Notified
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
