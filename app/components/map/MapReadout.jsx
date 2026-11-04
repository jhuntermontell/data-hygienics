import Readout from "@/app/components/brand/Readout"

// Where the home stands, per outcome: open findings counted by severity,
// handled ones apart. The frame is PathView's WhereYouStand; the rows are
// counts, never a total, a percentage or a grade.
function countsLine(row) {
  const parts = []
  if (row.weak) parts.push(`${row.weak} weak`)
  if (row.watch) parts.push(`${row.watch} to watch`)
  if (row.ok) parts.push(`${row.ok} fine`)
  return parts.length ? parts.join(" · ") : row.handled ? "Nothing open" : "Nothing checked yet"
}

function Dots({ row }) {
  const dots = [
    ...Array.from({ length: row.weak }, () => "weak"),
    ...Array.from({ length: row.watch }, () => "watch"),
    ...Array.from({ length: row.ok }, () => "ok"),
  ]
  if (!dots.length) return null
  return (
    <div className="mt-2 flex flex-wrap gap-1.5" aria-hidden="true">
      {dots.map((kind, i) => (
        <span
          key={i}
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            kind === "weak" ? "bg-[#B45309]" : kind === "watch" ? "border-2 border-[#B45309] bg-white" : "bg-[#0F8F83]"
          }`}
        />
      ))}
    </div>
  )
}

function checkedDate(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default function MapReadout({ rows, checkedAt }) {
  const date = checkedDate(checkedAt)
  return (
    <section aria-labelledby="map-stand-title" className="border border-[#E2E8F0] bg-white p-5">
      <h2 id="map-stand-title" className="text-base font-display font-semibold text-[#0F172A]">
        Where your home stands
      </h2>
      <ul className="mt-4 space-y-4 list-none p-0 m-0">
        {rows.map((row) => (
          <li key={row.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-[#0F172A]">{row.label}</p>
              <Readout as="p" className="m-0">
                {countsLine(row)}
              </Readout>
            </div>
            <Dots row={row} />
            {row.handled ? <p className="mt-1.5 text-xs font-semibold text-[#0F766E]">{row.handled} handled</p> : null}
          </li>
        ))}
      </ul>
      {date ? (
        <Readout as="p" className="mt-4">
          Checked {date}
        </Readout>
      ) : null}
      <p className="mt-3 text-xs leading-relaxed text-[#64748B]">This counts what we found. It isn&apos;t a safety rating.</p>
    </section>
  )
}
