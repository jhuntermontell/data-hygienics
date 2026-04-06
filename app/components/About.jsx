"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Cpu, Database, Code2, GitBranch, Briefcase } from "lucide-react"

const skills = [
  { icon: Cpu, label: "AI & Automation" },
  { icon: Database, label: "Data Strategy" },
  { icon: Code2, label: "Full-Stack Dev" },
  { icon: GitBranch, label: "Systems Thinking" },
  { icon: Briefcase, label: "Small Business" },
]

export default function About() {
  return (
    <section id="about" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-blue-500/20 shadow-[0_0_80px_rgba(59,130,246,0.08)]">
              <Image
                src="/images/founder.jpg"
                alt="Hunter, founder of Data Hygienics"
                width={600}
                height={761}
                className="w-full h-full object-cover"
                priority
              />
              {/* Subtle blue overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-950/30 to-transparent pointer-events-none" />
            </div>
            {/* Decorative accent blocks */}
            <div className="absolute -bottom-5 -right-5 w-40 h-40 rounded-2xl bg-blue-500/[0.05] border border-blue-500/10 -z-10" />
            <div className="absolute -top-5 -left-5 w-24 h-24 rounded-2xl bg-zinc-800/40 border border-zinc-700/20 -z-10" />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
              Who&apos;s Behind This
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-6 leading-tight tracking-tight">
              Hi, I&apos;m
              <br />
              Hunter.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-4">
              I&apos;m a technologist who keeps up with everything so you don&apos;t have
              to. I don&apos;t claim to be the world&apos;s best engineer or data
              scientist. I claim to know enough about all of it to build things
              that actually work for your business.
            </p>
            <p className="text-zinc-500 leading-relaxed mb-10">
              Data Hygienics exists to give small businesses access to the kind
              of tools and thinking that used to be reserved for enterprises.
            </p>

            {/* Skills icons */}
            <div className="flex flex-wrap gap-3">
              {skills.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3.5 py-2 text-xs font-medium text-zinc-400 hover:border-blue-500/30 hover:text-zinc-200 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
