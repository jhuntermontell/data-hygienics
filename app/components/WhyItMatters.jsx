import Link from "next/link"
import { ArrowRight, LifeBuoy } from "lucide-react"
import { LOSSES_BY_YEAR } from "@/lib/content/home"
import { getSource } from "@/lib/sources"
import { SITE } from "@/lib/site"

// Homepage "What changed" band: calm copy on the left, the FBI's reported
// losses by year on the right. The chart shows only what was reported (no
// projection), starts at zero, and labels the first point directly; the hero
// figure labels the last. Points whose source doesn't resolve are dropped,
// and the band hides if fewer than two remain. Server component, no client JS.

const W = 640
const H = 360
const PAD = { left: 48, right: 40, top: 20, bottom: 56 }
const BASELINE = H - PAD.bottom
const SURFACE = "#0F172A"
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const billions = (value) => `$${value.toFixed(1)} billion`
const pct = (n, of) => `${((n / of) * 100).toFixed(3)}%`

function monthYear(published) {
  const [year, month] = String(published || "").split("-")
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year
}

function listOf(items) {
  if (items.length < 2) return items
  return items.flatMap((item, i) => (i === 0 ? [item] : [i === items.length - 1 ? " and " : ", ", item]))
}

export default function WhyItMatters() {
  const chart = LOSSES_BY_YEAR || {}
  const points = (chart.points || []).filter((p) => getSource(p.sourceId) && Number.isFinite(p.value))
  const heroSource = chart.hero && getSource(chart.hero.sourceId)
  if (points.length < 2 || !heroSource) return null

  // Reports in order of first appearance, for the source line.
  const reports = []
  for (const id of [...points.map((p) => p.sourceId), chart.hero.sourceId]) {
    if (!reports.some((r) => r.id === id)) {
      const source = getSource(id)
      reports.push({ id, source, year: source.label.match(/^\d{4}/)?.[0] || source.label })
    }
  }

  // Geometry: evenly spaced years, y from zero (never truncated).
  const max = Math.max(...points.map((p) => p.value)) * 1.1
  const plotW = W - PAD.left - PAD.right
  const plotH = BASELINE - PAD.top
  const coords = points.map((p, i) => ({
    ...p,
    x: PAD.left + (plotW * i) / (points.length - 1),
    y: BASELINE - (p.value / max) * plotH,
  }))
  const first = coords[0]
  const last = coords[coords.length - 1]
  const line = coords.map((c, i) => `${i ? "L" : "M"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ")
  const area = `${line} L${last.x.toFixed(1)},${BASELINE} L${first.x.toFixed(1)},${BASELINE} Z`
  const summary = `Losses reported to the FBI's IC3 rose from ${billions(first.value)} in ${first.year} to ${billions(last.value)} in ${last.year}.`

  return (
    <section aria-labelledby="why-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#94A3B8]">What changed</p>
          <h2 id="why-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            The scams changed. The defense didn&apos;t have to.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#CBD5E1]">
            People reported {chart.hero.figure} in losses to the FBI in 2025, about five times what they reported in
            2020. The biggest losses came from investment and payment scams, the kind that arrive as a message, a call or
            a login page that looks real.
            <sup className="ml-0.5 text-[11px] font-semibold">
              <a
                href={`#why-src-${chart.hero.sourceId}`}
                aria-label={`Source: ${heroSource.label}, pages 4, 6 and 8`}
                className="text-[#93C5FD] hover:text-white no-underline"
              >
                Source
              </a>
            </sup>
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#CBD5E1]">
            None of the fixes are new. A safe word. A callback on a number you already have. A passkey on your email. We
            put them in order for your home or your business, and we never sell you anything to get there.
          </p>
          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/#start"
              className="group inline-flex items-center gap-1.5 bg-white text-[#0F172A] text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              Start with what you&apos;d hate to lose
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href={SITE.door?.href || "/check"}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5EEAD4] hover:text-white"
            >
              <LifeBuoy className="w-4 h-4" aria-hidden="true" />
              Something just happened? Is this real?
            </Link>
          </div>
        </div>

        <figure className="min-w-0 m-0">
          <p className="text-5xl font-extrabold leading-none tracking-tight text-[#5EEAD4]">{chart.hero.figure}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#CBD5E1]">{chart.hero.text}</p>

          <div className="relative mt-6">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={summary}
              className="block w-full h-auto"
            >
              <defs>
                <linearGradient id="why-line" gradientUnits="userSpaceOnUse" x1={first.x} y1="0" x2={last.x} y2="0">
                  <stop offset="0" stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#5EEAD4" />
                </linearGradient>
                <linearGradient id="why-area" gradientUnits="userSpaceOnUse" x1={first.x} y1="0" x2={last.x} y2="0">
                  <stop offset="0" stopColor="#60A5FA" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#5EEAD4" stopOpacity="0.12" />
                </linearGradient>
              </defs>

              {coords.map((c) => (
                <line
                  key={`grid-${c.year}`}
                  x1={c.x}
                  x2={c.x}
                  y1={PAD.top}
                  y2={BASELINE}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <line
                x1={first.x}
                x2={last.x}
                y1={BASELINE}
                y2={BASELINE}
                stroke="rgba(255,255,255,0.24)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />

              <path d={area} fill="url(#why-area)" />
              <path
                d={line}
                fill="none"
                stroke="url(#why-line)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {coords.map((c) => (
                <g key={`pt-${c.year}`}>
                  <title>{`${c.year}: ${billions(c.value)}`}</title>
                  <circle cx={c.x} cy={c.y} r="12" fill="transparent" />
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="4"
                    fill="url(#why-line)"
                    stroke={SURFACE}
                    strokeWidth="4"
                    paintOrder="stroke"
                  />
                </g>
              ))}
            </svg>

            {/* Labels sit in HTML over the scaled SVG so they stay readable at phone width. */}
            <div aria-hidden="true">
              {coords.map((c) => (
                <span
                  key={`year-${c.year}`}
                  className="absolute -translate-x-1/2 text-xs sm:text-sm text-[#94A3B8] tabular-nums"
                  style={{ left: pct(c.x, W), top: pct(BASELINE + 12, H) }}
                >
                  {c.year}
                </span>
              ))}
              <span
                className="absolute -translate-x-[60%] text-sm font-semibold text-[#CBD5E1] tabular-nums"
                style={{ left: pct(first.x, W), top: pct(first.y + 14, H) }}
              >
                ${first.value.toFixed(1)}B
              </span>
            </div>
          </div>

          <div className="sr-only">
            {/* A div carries sr-only: a table ignores the 1px width and widens the page. */}
            <table>
            <caption>{chart.title}</caption>
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Losses reported</th>
              </tr>
            </thead>
            <tbody>
              {coords.map((c) => (
                <tr key={`row-${c.year}`}>
                  <th scope="row">{c.year}</th>
                  <td>{billions(c.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <figcaption className="mt-6 text-xs leading-relaxed text-[#94A3B8]">
            Source: FBI Internet Crime Complaint Center,{" "}
            {listOf(
              reports.map((r) => (
                <a
                  key={r.id}
                  id={`why-src-${r.id}`}
                  href={r.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={r.source.label}
                  className="underline underline-offset-2 hover:text-white scroll-mt-28"
                >
                  {r.year}
                </a>
              ))
            )}{" "}
            Internet Crime Reports (published {listOf(reports.map((r) => monthYear(r.source.published))).join("")}).
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
