// The home as a picture: accounts as hubs, the devices each one controls
// hanging off it, and devices not linked to an account in a tray. Pure SVG
// with no hooks or DOM APIs, so it renders on the server and prints. Two
// drawings, one for phones (a column) and one for wider screens (rows of at
// most five hubs), switched with Tailwind's sm breakpoint.
import { categoryLabel, displayName, iconFor, marksByItem, plural } from "./helpers"

const NAVY = "#0F172A"
const AMBER = "#B45309"
const LINE = "#94A3B8"
const BORDER = "#CBD5E1"
const TEAL_ICON = "#0F8F83"
const TEAL_TEXT = "#0F766E"
const SUB = "#64748B"

const trunc = (s, n) => {
  const t = String(s || "")
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t
}

function Mark({ kind, cx, cy, onNavy = false }) {
  if (kind === "weak") return <circle cx={cx} cy={cy} r={5.5} fill={AMBER} stroke={onNavy ? "#FFFFFF" : "none"} strokeWidth={onNavy ? 1.5 : 0} />
  if (kind === "watch") return <circle cx={cx} cy={cy} r={4.5} fill="#FFFFFF" stroke={AMBER} strokeWidth={2} />
  return null
}

function HubNode({ item, x, y, w, h, mark, nameChars, subChars }) {
  const Icon = iconFor(item)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={NAVY} />
      <Icon x={x + 12} y={y + h / 2 - 9} width={18} height={18} color={TEAL_ICON} strokeWidth={2} aria-hidden="true" />
      <text x={x + 38} y={y + h / 2 - 3} fontSize={13} fontWeight={600} fill="#FFFFFF">
        {trunc(displayName(item), nameChars)}
      </text>
      <text x={x + 38} y={y + h / 2 + 13} fontSize={11} fill="#CBD5E1">
        {trunc(item.label ? categoryLabel(item.category) : "Account", subChars)}
      </text>
      <Mark kind={mark} cx={x + w - 10} cy={y + 10} onNavy />
    </g>
  )
}

function DeviceNode({ item, x, y, w, h, mark, nameChars, subChars }) {
  const Icon = iconFor(item)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#FFFFFF" stroke={BORDER} strokeWidth={1} />
      <Icon x={x + 9} y={y + h / 2 - 8} width={16} height={16} color={TEAL_TEXT} strokeWidth={2} aria-hidden="true" />
      <text x={x + 31} y={y + h / 2 - 2} fontSize={12} fontWeight={600} fill={NAVY}>
        {trunc(displayName(item), nameChars)}
      </text>
      <text x={x + 31} y={y + h / 2 + 12} fontSize={10.5} fill={SUB}>
        {trunc(categoryLabel(item.category), subChars)}
      </text>
      <Mark kind={mark} cx={x + w - 9} cy={y + 9} />
    </g>
  )
}

// Wide drawing: hubs in rows of up to six columns, devices stacked under
// their hub on a spine, then the tray as a grid.
function WideDrawing({ hubs, childrenOf, tray, marks, label }) {
  const COL = 176
  const PER_ROW = 5
  // As wide as the widest row needs, drawn at its natural size (never scaled
  // up), so text stays legible with one hub or five.
  const W = Math.max(2 * COL, COL * Math.min(PER_ROW, Math.max(hubs.length, tray.length)))
  const HUB_H = 56
  const DEV_H = 44
  const DEV_GAP = 52
  const parts = []
  let y = 8

  for (let start = 0; start < hubs.length; start += PER_ROW) {
    const row = hubs.slice(start, start + PER_ROW)
    const offset = (W - row.length * COL) / 2
    const tallest = Math.max(0, ...row.map((h) => childrenOf(h.id).length))
    row.forEach((hub, i) => {
      const x = offset + i * COL + 8
      const kids = childrenOf(hub.id)
      parts.push(<HubNode key={hub.id} item={hub} x={x} y={y} w={COL - 16} h={HUB_H} mark={marks[hub.id]} nameChars={15} subChars={20} />)
      if (kids.length) {
        const spineX = x + 14
        const lastY = y + HUB_H + 16 + (kids.length - 1) * DEV_GAP + DEV_H / 2
        parts.push(<line key={`${hub.id}-spine`} x1={spineX} y1={y + HUB_H} x2={spineX} y2={lastY} stroke={LINE} strokeWidth={1.5} />)
        kids.forEach((kid, k) => {
          const ky = y + HUB_H + 16 + k * DEV_GAP
          parts.push(<line key={`${kid.id}-tick`} x1={spineX} y1={ky + DEV_H / 2} x2={x + 26} y2={ky + DEV_H / 2} stroke={LINE} strokeWidth={1.5} />)
          parts.push(<DeviceNode key={kid.id} item={kid} x={x + 26} y={ky} w={COL - 16 - 26} h={DEV_H} mark={marks[kid.id]} nameChars={14} subChars={18} />)
        })
      }
    })
    y += HUB_H + (tallest ? 16 + tallest * DEV_GAP : 0) + 24
  }

  if (tray.length) {
    if (hubs.length) {
      parts.push(<line key="tray-rule" x1={8} y1={y} x2={W - 8} y2={y} stroke="#E2E8F0" strokeWidth={1} />)
      y += 24
    }
    parts.push(
      <text key="tray-title" x={8} y={y + 4} fontSize={12} fontWeight={600} fill={SUB}>
        Not linked to an account yet
      </text>
    )
    y += 16
    tray.forEach((item, i) => {
      const x = (i % PER_ROW) * COL + 8
      const ty = y + Math.floor(i / PER_ROW) * DEV_GAP
      parts.push(<DeviceNode key={item.id} item={item} x={x} y={ty} w={COL - 16} h={DEV_H} mark={marks[item.id]} nameChars={17} subChars={21} />)
    })
    y += Math.ceil(tray.length / PER_ROW) * DEV_GAP
  }

  return (
    <svg viewBox={`0 0 ${W} ${y + 8}`} width="100%" style={{ maxWidth: W }} role="img" aria-label={label} className="hidden sm:block h-auto mx-auto">
      {parts}
    </svg>
  )
}

// Phone drawing: one hub per row, its devices beneath it.
function NarrowDrawing({ hubs, childrenOf, tray, marks, label }) {
  const W = 360
  const HUB_H = 52
  const DEV_H = 42
  const DEV_GAP = 50
  const parts = []
  let y = 8

  for (const hub of hubs) {
    const kids = childrenOf(hub.id)
    parts.push(<HubNode key={hub.id} item={hub} x={4} y={y} w={W - 8} h={HUB_H} mark={marks[hub.id]} nameChars={30} subChars={38} />)
    if (kids.length) {
      const spineX = 20
      const lastY = y + HUB_H + 12 + (kids.length - 1) * DEV_GAP + DEV_H / 2
      parts.push(<line key={`${hub.id}-spine`} x1={spineX} y1={y + HUB_H} x2={spineX} y2={lastY} stroke={LINE} strokeWidth={1.5} />)
      kids.forEach((kid, k) => {
        const ky = y + HUB_H + 12 + k * DEV_GAP
        parts.push(<line key={`${kid.id}-tick`} x1={spineX} y1={ky + DEV_H / 2} x2={36} y2={ky + DEV_H / 2} stroke={LINE} strokeWidth={1.5} />)
        parts.push(<DeviceNode key={kid.id} item={kid} x={36} y={ky} w={W - 40} h={DEV_H} mark={marks[kid.id]} nameChars={30} subChars={36} />)
      })
    }
    y += HUB_H + (kids.length ? 12 + kids.length * DEV_GAP : 0) + 18
  }

  if (tray.length) {
    if (hubs.length) y += 6
    parts.push(
      <text key="tray-title" x={4} y={y + 4} fontSize={12} fontWeight={600} fill={SUB}>
        Not linked to an account yet
      </text>
    )
    y += 16
    tray.forEach((item, i) => {
      parts.push(<DeviceNode key={item.id} item={item} x={4} y={y + i * DEV_GAP} w={W - 8} h={DEV_H} mark={marks[item.id]} nameChars={34} subChars={40} />)
    })
    y += tray.length * DEV_GAP
  }

  return (
    <svg viewBox={`0 0 ${W} ${y + 8}`} width="100%" style={{ maxWidth: W }} role="img" aria-label={label} className="sm:hidden h-auto mx-auto">
      {parts}
    </svg>
  )
}

export default function HomePicture({ items = [], findings = [] }) {
  const hubs = items.filter((i) => i.kind === "account")
  const devices = items.filter((i) => i.kind !== "account")
  const hubIds = new Set(hubs.map((h) => h.id))
  const childrenOf = (id) => devices.filter((d) => d.controlledBy === id)
  const tray = devices.filter((d) => !d.controlledBy || !hubIds.has(d.controlledBy))
  const marks = marksByItem(findings)
  const weakPoints = findings.filter((f) => f.severity === "weak" && !f.handledAt).length
  const label = `Your home map: ${plural(hubs.length, "account")}, ${plural(devices.length, "device")}, ${plural(weakPoints, "weak point")}`
  const markWord = (id) => (marks[id] === "weak" ? ", weak point" : marks[id] === "watch" ? ", worth a look" : "")

  return (
    <figure className="home-picture border border-[#E2E8F0] bg-white p-3 sm:p-5">
      <WideDrawing hubs={hubs} childrenOf={childrenOf} tray={tray} marks={marks} label={label} />
      <NarrowDrawing hubs={hubs} childrenOf={childrenOf} tray={tray} marks={marks} label={label} />
      <ul className="sr-only">
        {hubs.map((hub) => (
          <li key={hub.id}>
            {displayName(hub)} ({categoryLabel(hub.category)}){markWord(hub.id)}
            {childrenOf(hub.id).length ? (
              <ul>
                {childrenOf(hub.id).map((d) => (
                  <li key={d.id}>
                    {displayName(d)} ({categoryLabel(d.category)}){markWord(d.id)}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
        {tray.length ? (
          <li>
            Not linked to an account yet
            <ul>
              {tray.map((d) => (
                <li key={d.id}>
                  {displayName(d)} ({categoryLabel(d.category)}){markWord(d.id)}
                </li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#475569]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#B45309]" aria-hidden="true" />
          Weak point
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#B45309] bg-white" aria-hidden="true" />
          Worth a look
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-[#0F172A]" aria-hidden="true" />
          Account
        </span>
      </figcaption>
    </figure>
  )
}
