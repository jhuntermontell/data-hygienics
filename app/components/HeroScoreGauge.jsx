"use client"

import { useEffect, useState, useRef, useCallback } from "react"

const SCORE = 84
const GRADE = "B+"
const TOTAL_ARC_DEG = 270
const START_ANGLE = 135 // 7 o'clock in degrees (0 = 3 o'clock)
const RADIUS = 140
const TRACK_STROKE = 4
const ARC_STROKE = 10
const CENTER = 180

const METRICS = [
  { label: "Identity", pass: true },
  { label: "Backup", pass: true },
  { label: "Email", pass: false },
]

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

export default function HeroScoreGauge() {
  const [progress, setProgress] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  const [showGrade, setShowGrade] = useState(false)
  const [showMetrics, setShowMetrics] = useState([false, false, false])
  const [reducedMotion, setReducedMotion] = useState(false)
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)

  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp
    const elapsed = timestamp - startTimeRef.current
    const duration = 1800
    const t = Math.min(elapsed / duration, 1)
    // cubic-bezier(0.4, 0, 0.2, 1) approximation
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2

    setProgress(eased * (SCORE / 100))
    setDisplayScore(Math.round(eased * SCORE))

    if (t < 1) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      // Grade fades in at 1800ms
      setShowGrade(true)
      // Metrics fade in at 2200ms, 2400ms, 2600ms
      setTimeout(() => setShowMetrics([true, false, false]), 400)
      setTimeout(() => setShowMetrics([true, true, false]), 600)
      setTimeout(() => setShowMetrics([true, true, true]), 800)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) {
      setReducedMotion(true)
      setProgress(SCORE / 100)
      setDisplayScore(SCORE)
      setShowGrade(true)
      setShowMetrics([true, true, true])
      return
    }

    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate)
    }, 300)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  const filledDeg = TOTAL_ARC_DEG * progress
  const trackPath = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, START_ANGLE + TOTAL_ARC_DEG)
  const arcPath = filledDeg > 0.5
    ? describeArc(CENTER, CENTER, RADIUS, START_ANGLE, START_ANGLE + filledDeg)
    : ""

  // Tick mark positions at 12, 3, 6, 9 o'clock
  const tickAngles = [0, 90, 180, 270]
  const outerR = 164

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        className="bg-white border border-[#E2E8F0] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 sm:p-12 flex flex-col items-center"
        aria-label={`Cybersecurity score: ${SCORE} out of 100, grade ${GRADE}`}
        role="img"
      >
        {/* Gauge */}
        <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]">
          <svg
            viewBox="0 0 360 360"
            className="w-full h-full"
            fill="none"
          >
            {/* Outer frame circle */}
            <circle cx={CENTER} cy={CENTER} r={outerR} stroke="#E2E8F0" strokeWidth="1" fill="none" />

            {/* Tick marks */}
            {tickAngles.map((angle) => {
              const pos = polarToCartesian(CENTER, CENTER, outerR, angle)
              return (
                <circle key={angle} cx={pos.x} cy={pos.y} r="2" fill="#CBD5E1" />
              )
            })}

            {/* Track */}
            <path
              d={trackPath}
              stroke="#E2E8F0"
              strokeWidth={TRACK_STROKE}
              strokeLinecap="round"
              fill="none"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
            </defs>

            {/* Score arc */}
            {arcPath && (
              <path
                d={arcPath}
                stroke="url(#scoreGrad)"
                strokeWidth={ARC_STROKE}
                strokeLinecap="round"
                fill="none"
                className={reducedMotion ? "" : "gauge-pulse"}
              />
            )}
          </svg>

          {/* Center text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] sm:text-xs text-[#94A3B8] tracking-[0.1em] font-medium mb-1">
              YOUR SCORE
            </span>
            <span className="text-[56px] sm:text-[72px] font-extrabold text-[#0F172A] leading-none">
              {displayScore}
            </span>
            <span className="text-[13px] sm:text-sm text-[#94A3B8] mt-1">
              out of 100
            </span>

            {/* Grade badge */}
            <div
              className={`mt-3 bg-[#EFF6FF] text-[#1D4ED8] text-base sm:text-lg font-bold px-4 py-1 rounded-full transition-opacity duration-300 ${
                showGrade ? "opacity-100" : "opacity-0"
              }`}
            >
              {GRADE}
            </div>
          </div>
        </div>

        {/* Metric pills */}
        <div className="flex items-center gap-2 mt-6">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all duration-300 ${
                m.pass
                  ? "bg-[#ECFDF5] text-[#059669]"
                  : "bg-[#FFFBEB] text-[#D97706]"
              } ${showMetrics[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            >
              <span>{m.pass ? "✓" : "⚠"}</span>
              {m.label}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gaugePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.92; }
        }
        .gauge-pulse {
          animation: gaugePulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
