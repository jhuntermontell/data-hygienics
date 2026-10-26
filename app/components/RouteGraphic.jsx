import { useId } from "react"

// The Clear Path drawn as a route: a start marker lower left, three waypoints
// that match the three "How it works" steps, a destination upper right.
// Static and server-rendered; nothing animates.
//
// Legibility: the viewBox is 360 units wide and the badge text is 14 units.
// The SVG keeps the viewBox aspect ratio, so at a 320px-wide render the text
// is 14 * 320 / 360 = 12.4px, and at 288px (a 320px phone minus 16px gutters)
// it is 11.2px. Callers cap the height (max-h) only where the box is wider
// than a phone, so the cap never shrinks it below that scale.
const VIEW_W = 360
const VIEW_H = 220

const START = { x: 30, y: 190 }
const END = { x: 330, y: 40 }

// Waypoints sit exactly on the joints between the curve segments below.
// `badge` is the badge centre, offset so it never touches the line.
const WAYPOINTS = [
  { x: 118, y: 166, badge: { x: 128, y: 191 } },
  { x: 152, y: 110, badge: { x: 124, y: 104 } },
  { x: 240, y: 98, badge: { x: 234, y: 69 } },
]

// Smooth (tangent-continuous) cubic segments: start, waypoints, destination.
const ROUTE = [
  `M ${START.x} ${START.y}`,
  "C 66 190, 84 176, 118 166",
  "C 152 156, 166 132, 152 110",
  "C 138 88, 196 64, 240 98",
  "C 268 120, 318 104, 330 40",
].join(" ")

// Faint, solid contour marks. Recessive by design.
const CONTOURS = [
  "M 214 30 C 250 6, 318 10, 346 34",
  "M 196 52 C 240 18, 330 22, 352 62",
  "M 8 128 C 40 110, 74 112, 92 132",
  "M 4 150 C 46 128, 92 132, 108 156",
  "M 214 182 C 246 162, 300 164, 340 190",
]

const BADGE = 22

export default function RouteGraphic({ className = "block w-full h-auto" }) {
  const id = useId().replace(/:/g, "")
  const grad = `dh-route-${id}`

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="A winding route with three waypoints: tell us what matters, we cut what doesn't fit, you take the next step."
      className={className}
    >
      <defs>
        <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1={START.x} y1={START.y} x2={END.x} y2={END.y}>
          <stop offset="0" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0F8F83" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        {CONTOURS.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      <path
        d={ROUTE}
        fill="none"
        stroke={`url(#${grad})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Start: a small open marker. */}
      <circle cx={START.x} cy={START.y} r="5" fill="#F8FAFC" stroke="#1D4ED8" strokeWidth="2" />

      {/* Destination: a ring around a solid centre. */}
      <circle cx={END.x} cy={END.y} r="9" fill="#F8FAFC" stroke="#0F8F83" strokeWidth="2" />
      <circle cx={END.x} cy={END.y} r="4" fill="#0F8F83" />

      {WAYPOINTS.map((w, i) => (
        <g key={i}>
          <circle cx={w.x} cy={w.y} r="5" fill={`url(#${grad})`} stroke="#F8FAFC" strokeWidth="2" />
          <rect
            x={w.badge.x - BADGE / 2}
            y={w.badge.y - BADGE / 2}
            width={BADGE}
            height={BADGE}
            rx="5"
            fill="#0F172A"
          />
          <text
            x={w.badge.x}
            y={w.badge.y}
            dy="0.35em"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#FFFFFF"
            fontFamily="inherit"
            aria-hidden="true"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  )
}
