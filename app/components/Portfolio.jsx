"use client"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    title: "Client Data Pipeline",
    description:
      "Built an automated data ingestion and cleaning pipeline for a mid-size retailer. Reduced manual data processing time by 80%.",
    tags: ["Python", "Airflow", "PostgreSQL"],
    accentColor: "from-blue-500/25 via-blue-500/5 to-transparent",
  },
  {
    title: "AI Customer Assistant",
    description:
      "Designed and deployed a GPT-powered assistant for a service business to handle FAQs and appointment requests.",
    tags: ["Next.js", "OpenAI", "Vercel"],
    accentColor: "from-violet-500/25 via-violet-500/5 to-transparent",
  },
  {
    title: "Business Intelligence Dashboard",
    description:
      "Created an internal analytics dashboard giving leadership real-time visibility into operations.",
    tags: ["React", "Tailwind", "Supabase"],
    accentColor: "from-cyan-500/25 via-cyan-500/5 to-transparent",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 bg-[#080808]">
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
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            Selected Work.
          </h2>
        </motion.div>

        {/* Project grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-5 mb-10"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={item}
              className="rounded-2xl border border-zinc-800 overflow-hidden group hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Colored top gradient area */}
              <div
                className={`h-48 bg-gradient-to-br ${project.accentColor} border-b border-zinc-800`}
              />

              {/* Content */}
              <div className="p-6 bg-[#0d0d0d]">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                  {project.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* More coming soon */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-zinc-600 text-sm"
        >
          More coming soon —{" "}
          <a href="#contact" className="text-blue-400/70 hover:text-blue-400 transition-colors">
            reach out to discuss your project
          </a>
        </motion.p>
      </div>
    </section>
  )
}
