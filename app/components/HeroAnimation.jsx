"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const SATELLITES = [
  { label: "Identity", color: "#1D4ED8", radius: 140, speed: 0.0003, offset: 0, eccentricity: 0.15 },
  { label: "Data", color: "#0F766E", radius: 170, speed: 0.00025, offset: Math.PI * 0.25, eccentricity: 0.1 },
  { label: "Network", color: "#1D4ED8", radius: 200, speed: 0.0002, offset: Math.PI * 0.5, eccentricity: 0.18 },
  { label: "Devices", color: "#0F766E", radius: 155, speed: 0.00035, offset: Math.PI * 0.75, eccentricity: 0.12 },
  { label: "Email", color: "#1D4ED8", radius: 185, speed: 0.00028, offset: Math.PI, eccentricity: 0.14 },
  { label: "Backup", color: "#0F766E", radius: 130, speed: 0.00032, offset: Math.PI * 1.25, eccentricity: 0.16 },
  { label: "Incident Response", color: "#1D4ED8", radius: 210, speed: 0.00018, offset: Math.PI * 1.5, eccentricity: 0.1 },
  { label: "Compliance", color: "#0F766E", radius: 165, speed: 0.00022, offset: Math.PI * 1.75, eccentricity: 0.13 },
]

const PARTICLE_COUNT = 12
const CENTER_SIZE = 20
const SAT_SIZE = 6
const SAT_HOVER_SIZE = 8

export default function HeroAnimation() {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    time: 0,
    particles: [],
    pulses: [],
    rings: [],
    hoverSat: -1,
    hoverCenter: false,
    mouseX: -1,
    mouseY: -1,
    width: 0,
    height: 0,
    scale: 1,
    running: true,
    reducedMotion: false,
  })
  const rafRef = useRef(null)
  const [, forceRender] = useState(0)

  const initParticles = useCallback((w, h) => {
    const particles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      })
    }
    return particles
  }, [])

  const getSatPosition = useCallback((sat, time, cx, cy, scale) => {
    const angle = sat.offset + time * sat.speed
    const r = sat.radius * scale
    const rx = r
    const ry = r * (1 - sat.eccentricity)
    return {
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const s = stateRef.current

    s.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      s.width = rect.width
      s.height = rect.height
      s.scale = Math.min(rect.width, rect.height) / 500
      if (s.particles.length === 0) {
        s.particles = initParticles(rect.width, rect.height)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    const handleVisibility = () => {
      s.running = document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", handleVisibility)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      s.mouseX = e.clientX - rect.left
      s.mouseY = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      s.mouseX = -1
      s.mouseY = -1
      s.hoverSat = -1
      s.hoverCenter = false
      canvas.style.cursor = "default"
    }
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // Pulse timer
    let lastPulse = 0
    let lastRing = 0

    function draw(timestamp) {
      if (!s.running && !s.reducedMotion) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const dt = s.reducedMotion ? 0 : 16
      s.time += dt

      const w = s.width
      const h = s.height
      const cx = w / 2
      const cy = h / 2
      const sc = s.scale

      ctx.clearRect(0, 0, w, h)

      // Clean white background
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(0, 0, w, h)

      // Subtle grid pattern
      ctx.strokeStyle = "rgba(226, 232, 240, 0.3)"
      ctx.lineWidth = 0.5
      const gridSize = 40 * sc
      for (let x = (cx % gridSize); x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = (cy % gridSize); y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Satellite positions
      const satPositions = SATELLITES.map((sat) => getSatPosition(sat, s.time, cx, cy, sc))

      // Hit testing for hover
      s.hoverSat = -1
      s.hoverCenter = false
      if (s.mouseX >= 0) {
        const cdx = s.mouseX - cx
        const cdy = s.mouseY - cy
        if (Math.sqrt(cdx * cdx + cdy * cdy) < CENTER_SIZE * sc + 4) {
          s.hoverCenter = true
        }
        satPositions.forEach((pos, i) => {
          const dx = s.mouseX - pos.x
          const dy = s.mouseY - pos.y
          if (Math.sqrt(dx * dx + dy * dy) < SAT_HOVER_SIZE * sc + 6) {
            s.hoverSat = i
          }
        })
      }
      canvas.style.cursor = s.hoverSat >= 0 || s.hoverCenter ? "pointer" : "default"

      // Connecting lines
      satPositions.forEach((pos, i) => {
        let lineAlpha = 0.15
        if (s.hoverCenter) lineAlpha = 0.4
        else if (s.hoverSat === i) lineAlpha = 0.4
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(pos.x, pos.y)
        ctx.strokeStyle = `rgba(29, 78, 216, ${lineAlpha})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Data pulses
      if (!s.reducedMotion) {
        if (s.time - lastPulse > 2000 + Math.random() * 3000) {
          const idx = Math.floor(Math.random() * SATELLITES.length)
          s.pulses.push({ born: s.time, satIdx: idx, duration: 1200 })
          lastPulse = s.time
        }
        if (s.hoverCenter && s.pulses.length < SATELLITES.length) {
          SATELLITES.forEach((_, i) => {
            if (!s.pulses.some((p) => p.satIdx === i)) {
              s.pulses.push({ born: s.time, satIdx: i, duration: 800 })
            }
          })
        }
        s.pulses = s.pulses.filter((p) => {
          const age = s.time - p.born
          const t = age / p.duration
          if (t > 1) return false
          const pos = satPositions[p.satIdx]
          const px = cx + (pos.x - cx) * t
          const py = cy + (pos.y - cy) * t
          const alpha = t < 0.8 ? 0.8 : (1 - t) * 4
          ctx.beginPath()
          ctx.arc(px, py, 2 * sc, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(29, 78, 216, ${alpha})`
          ctx.fill()
          return true
        })
      }

      // Floating particles
      if (!s.reducedMotion) {
        s.particles.forEach((p) => {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = w
          if (p.x > w) p.x = 0
          if (p.y < 0) p.y = h
          if (p.y > h) p.y = 0
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(148, 163, 184, 0.4)"
          ctx.fill()
        })
      }

      // Center node
      const cs = CENTER_SIZE * sc
      const cr = cs * 0.3
      ctx.beginPath()
      roundedRect(ctx, cx - cs, cy - cs, cs * 2, cs * 2, cr)
      ctx.fillStyle = "#1D4ED8"
      ctx.fill()

      // Satellite nodes + labels
      satPositions.forEach((pos, i) => {
        const sat = SATELLITES[i]
        const isHovered = s.hoverSat === i
        const size = (isHovered ? SAT_HOVER_SIZE : SAT_SIZE) * sc

        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
        ctx.fillStyle = sat.color
        if (isHovered) {
          ctx.shadowColor = sat.color
          ctx.shadowBlur = 8 * sc
        }
        ctx.fill()
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0

        // Label
        const labelAlpha = isHovered ? 1 : 0.7
        const labelColor = isHovered ? "#0F172A" : "#475569"
        ctx.font = `500 ${Math.round(11 * sc)}px Inter, system-ui, sans-serif`
        ctx.fillStyle = labelColor
        ctx.globalAlpha = labelAlpha
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(sat.label, pos.x, pos.y + size + 6 * sc)
        ctx.globalAlpha = 1
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", handleVisibility)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [initParticles, getSatPosition])

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
