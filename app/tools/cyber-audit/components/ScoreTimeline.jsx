"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react"

/**
 * Minimal SVG line chart for a user's score history.
 * No external charting dep - small footprint, on-brand styling.
 */
export default function ScoreTimeline({ assessments }) {
  const completed = (assessments || []).filter((a) => a.status === "completed" && a.score != null)
  const sorted = [...completed].sort(
    (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
  )

  if (sorted.length === 0) return null

  if (sorted.length === 1) {
    const only = sorted[0]
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">Your Score Over Time</h2>
        <p className="text-[#94A3B8] text-xs mb-5">
          Retake the comprehensive assessment after making improvements to track your progress.
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-[#0F172A]">{only.score}</span>
          <span className="text-[#94A3B8] text-sm">
            as of{" "}
            {new Date(only.completed_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    )
  }

  // Chart dimensions
  const W = 560
  const H = 180
  const PAD_L = 36
  const PAD_R = 16
  const PAD_T = 20
  const PAD_B = 30
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B

  const minScore = 0
  const maxScore = 100
  const n = sorted.length

  const xFor = (i) => PAD_L + (i * innerW) / Math.max(n - 1, 1)
  const yFor = (s) => PAD_T + innerH * (1 - (s - minScore) / (maxScore - minScore))

  const points = sorted.map((a, i) => ({
    x: xFor(i),
    y: yFor(a.score),
    score: a.score,
    date: new Date(a.completed_at),
    type: a.assessment_type || "comprehensive",
  }))

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")

  // Delta between first and last
  const firstScore = sorted[0].score
  const latestScore = sorted[sorted.length - 1].score
  const delta = latestScore - firstScore

  const DeltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
  const deltaColor = delta > 0 ? "#059669" : delta < 0 ? "#DC2626" : "#64748B"

  // Most recent improvement context
  const latest = sorted[sorted.length - 1]
  const previous = sorted[sorted.length - 2]
  const recentDelta = latest.score - previous.score

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6"
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Your Score Over Time</h2>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            {sorted.length} assessments tracked
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: deltaColor }}>
          <DeltaIcon className="w-4 h-4" />
          {delta > 0 && "+"}
          {delta} since first assessment
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Gridlines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text
                x={PAD_L - 6}
                y={yFor(tick) + 3}
                fontSize="9"
                fill="#94A3B8"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Points + labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#1D4ED8" stroke="white" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y - 10}
                fontSize="10"
                fontWeight="700"
                fill="#0F172A"
                textAnchor="middle"
              >
                {p.score}
              </text>
              <text
                x={p.x}
                y={H - 10}
                fontSize="9"
                fill="#94A3B8"
                textAnchor="middle"
              >
                {p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {sorted.length >= 2 && (
        <div className="mt-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3">
          <p className="text-[#475569] text-xs leading-relaxed">
            Since your last assessment:{" "}
            <span className="font-semibold" style={{ color: recentDelta >= 0 ? "#059669" : "#DC2626" }}>
              {recentDelta >= 0 ? "+" : ""}
              {recentDelta} points
            </span>
            {recentDelta > 0 && ". Keep going - document what changed so you can do more of it."}
            {recentDelta === 0 && ". No change. Revisit the remediation plan to find your next win."}
            {recentDelta < 0 && ". Something regressed. Compare gaps between the two assessments to find the cause."}
          </p>
        </div>
      )}

      <div className="mt-4">
        <Link href="/tools/cyber-audit/assessment">
          <Button size="sm" variant="outline">
            <span className="flex items-center gap-2">
              Retake Assessment
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
