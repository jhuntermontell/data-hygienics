"use client"

import { motion } from "framer-motion"

export default function SectionBreakdown({ sectionScores }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Section Breakdown</h3>
      {sectionScores.map((section, i) => (
        <motion.div
          key={section.key}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-zinc-300 font-medium">
              {section.title}
            </span>
            <span
              className={`text-sm font-bold ${
                section.percentage >= 80
                  ? "text-emerald-400"
                  : section.percentage >= 60
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {section.percentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                section.percentage >= 80
                  ? "bg-emerald-500"
                  : section.percentage >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${section.percentage}%` }}
              transition={{
                duration: 0.8,
                delay: 0.2 + 0.1 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
