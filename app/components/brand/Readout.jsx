// A monospaced readout for metadata that proves rigor: reviewed dates, source
// counts, the custody line. Uppercase by style, so write it in sentence case.
// Night readouts are #94A3B8 on navy (6.96:1); day readouts are #64748B on
// white (4.76:1).
const TONES = { night: "text-night-readout", day: "text-day-readout" }

export default function Readout({ as: Tag = "p", tone = "day", label = false, className = "", children, ...props }) {
  return (
    <Tag className={`${label ? "readout-label" : "readout"} ${TONES[tone] || TONES.day} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
