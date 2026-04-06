"use client"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    title: "Project Title One",
    description:
      "A short description of what this project does and the problem it solves. Fill in with your real work.",
    tags: ["Next.js", "TypeScript", "OpenAI"],
    gradient: "from-lime-400/20 via-emerald-500/5 to-transparent",
  },
  {
    title: "Project Title Two",
    description:
      "A short description of what this project does and the problem it solves. Fill in with your real work.",
    tags: ["React", "Node.js", "PostgreSQL"],
    gradient: "from-blue-500/20 via-indigo-500/5 to-transparent",
  },
  {
    title: "Project Title Three",
    description:
      "A short description of what this project does and the problem it solves. Fill in with your real work.",
    tags: ["Python", "Automation", "AWS"],
    gradient: "from-violet-500/20 via-purple-500/5 to-transparent",
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
          <span className="text-lime-400 text-xs font-semibold tracking-widest uppercase">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            Things I&apos;ve built.
          </h2>
        </motion.div>

        {/* Project grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-5"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={item}
              className="rounded-2xl border border-zinc-800 overflow-hidden group hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Gradient image area */}
              <div
                className={`h-48 bg-gradient-to-br ${project.gradient} border-b border-zinc-800 relative`}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-[#0d0d0d]">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-lime-400 transition-colors duration-200 leading-tight">
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
      </div>
    </section>
  )
}
