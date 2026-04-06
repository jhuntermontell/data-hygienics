"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { RECOMMENDATIONS } from "@/lib/cyber-audit/recommendations"
import { AlertTriangle, AlertCircle, Info, ExternalLink } from "lucide-react"

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "High Priority",
  },
  medium: {
    icon: AlertCircle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    label: "Medium Priority",
  },
  low: {
    icon: Info,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    label: "Low Priority",
  },
}

export default function GapList({ gaps }) {
  if (gaps.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-emerald-400 font-semibold">
          No critical gaps found. Great work!
        </p>
      </div>
    )
  }

  // Sort by priority: high first
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...gaps].sort((a, b) => {
    const recA = RECOMMENDATIONS[a.questionKey]
    const recB = RECOMMENDATIONS[b.questionKey]
    return (
      (priorityOrder[recA?.priority] ?? 3) -
      (priorityOrder[recB?.priority] ?? 3)
    )
  })

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">
        Identified Gaps ({gaps.length})
      </h3>
      <div className="space-y-3">
        {sorted.map((gap, i) => {
          const rec = RECOMMENDATIONS[gap.questionKey]
          const config = rec
            ? priorityConfig[rec.priority] || priorityConfig.low
            : priorityConfig.low
          const Icon = config.icon

          return (
            <motion.div
              key={gap.questionKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.05 * Math.min(i, 10),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-bold text-white">
                      {rec?.title || gap.questionText}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Framework mappings */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-zinc-600 text-xs">{gap.section}</span>
                    {gap.nistFunction && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400/70 border border-blue-500/10">
                        NIST {gap.nistFunction}
                      </span>
                    )}
                    {gap.cisControl && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                        CIS {gap.cisControl}
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {rec?.action || "Review and address this security gap."}
                  </p>

                  {gap.controlSlug && (
                    <Link
                      href={`/controls/${gap.controlSlug}`}
                      className="inline-flex items-center gap-1 text-blue-400 text-xs font-semibold mt-2 hover:text-blue-300 transition-colors"
                    >
                      Learn more
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
