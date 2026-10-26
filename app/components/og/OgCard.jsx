// The shared social card: mark, eyebrow, title, one line, site name.
// Rendered by lib/og.js through satori, which supports flexbox only: every
// element with more than one child needs display: flex, and no Tailwind.
import { BRAND_COLORS } from "@/lib/brand/mark"

const TONES = {
  home: BRAND_COLORS.teal,
  business: BRAND_COLORS.cobalt,
  sovereignty: BRAND_COLORS.navy,
}

export default function OgCard({ eyebrow, title, line, tone = "home", mark }) {
  const accent = TONES[tone] || TONES.home
  const long = (title || "").length > 60
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #F0FDFA 100%)",
        color: BRAND_COLORS.navy,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* satori renders plain img tags; next/image does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {mark ? <img src={mark} width={64} height={64} alt="" /> : null}
        <div style={{ fontSize: 30, fontWeight: 700 }}>Data Hygienics</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {eyebrow ? (
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: accent }}>
            {eyebrow}
          </div>
        ) : null}
        <div style={{ fontSize: long ? 56 : 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
        {line ? <div style={{ fontSize: 30, lineHeight: 1.35, color: "#475569" }}>{line}</div> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#475569" }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: accent }} />
        <div>datahygienics.com</div>
      </div>
    </div>
  )
}
