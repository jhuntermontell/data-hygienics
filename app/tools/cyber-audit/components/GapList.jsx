"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { RECOMMENDATIONS } from "@/lib/cyber-audit/recommendations"
import { AlertTriangle, AlertCircle, Info, ExternalLink, Lock } from "lucide-react"

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    color: "text-[#DC2626]",
    bg: "bg-[#FEF2F2]",
    border: "border-[#DC2626]/20",
    label: "High Priority",
  },
  medium: {
    icon: AlertCircle,
    color: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
    border: "border-[#D97706]/20",
    label: "Medium Priority",
  },
  low: {
    icon: Info,
    color: "text-[#475569]",
    bg: "bg-[#F8FAFC]",
    border: "border-[#E2E8F0]",
    label: "Low Priority",
  },
}

export default function GapList({ gaps, isPaid = true }) {
  const FREE_LIMIT = 3
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
      <h3 className="text-lg font-bold text-[#0F172A] mb-4">
        Identified Gaps ({gaps.length})
      </h3>
      <div className="space-y-3">
        {sorted.map((gap, i) => {
          const rec = RECOMMENDATIONS[gap.questionKey]
          const config = rec
            ? priorityConfig[rec.priority] || priorityConfig.low
            : priorityConfig.low
          const Icon = config.icon
          const isBlurred = !isPaid && i >= FREE_LIMIT

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
              className={`rounded-2xl border border-[#E2E8F0] bg-white p-5 ${isBlurred ? "relative overflow-hidden" : ""}`}
            >
              {isBlurred && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/60 z-10 flex items-center justify-center rounded-2xl">
                  <div className="flex items-center gap-2 text-[#475569] text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Upgrade to view</span>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">
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
                    <span className="text-[#94A3B8] text-xs">{gap.section}</span>
                    {gap.nistFunction && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#EFF6FF]">
                        NIST CSF 2.0 {gap.nistFunction}
                      </span>
                    )}
                    {gap.cisControl && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#F0FDFA] text-[#0F766E] border border-[#F0FDFA]">
                        CIS {gap.cisControl}
                      </span>
                    )}
                  </div>

                  <p className="text-[#475569] text-sm leading-relaxed">
                    {rec?.action || "Review and address this security gap."}
                  </p>

                  {gap.controlSlug && (
                    <Link
                      href={`/controls/${gap.controlSlug}`}
                      className="inline-flex items-center gap-1 text-[#1D4ED8] text-xs font-semibold mt-2 hover:text-[#1D4ED8]/80 transition-colors"
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
