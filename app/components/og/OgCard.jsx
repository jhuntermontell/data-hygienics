// The shared social card on the night surface: the white mark and outlined
// wordmark, a fold rule, the eyebrow as a readout, the title, one line, and
// the independence rule. Rendered by lib/og.js through satori, which supports
// flexbox only: every element with more than one child needs display: flex,
// and no Tailwind. Colors and contrast follow design/brand-book/personality.md:
// white 17.85:1 and #CBD5E1 12.02:1 on navy; teal only as a rule and mark.

const NAVY = "#0F172A"
const TEAL = "#0F8F83"
const LINE = "#334155"
const INK_2 = "#CBD5E1"
const READOUT = "#94A3B8"

// The small hexagon that marks Home, Business or the sovereignty pillar.
const TONES = {
  home: "#0F8F83",
  business: "#3B82F6",
  sovereignty: "#FFFFFF",
}

export default function OgCard({ eyebrow, title, line, tone = "home", mark, wordmark, wordmarkRatio = 5.15 }) {
  const marker = TONES[tone] || TONES.home
  const length = (title || "").length
  const titleSize = length > 70 ? 54 : length > 45 ? 62 : 72
  const wordmarkHeight = 34
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 72px 56px",
        background: NAVY,
        color: "#FFFFFF",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* satori renders plain img tags; next/image does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {mark ? <img src={mark} width={56} height={56} alt="" /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {wordmark ? <img src={wordmark} width={Math.round(wordmarkHeight * wordmarkRatio)} height={wordmarkHeight} alt="Data Hygienics" /> : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 4, background: TEAL }} />
          <div style={{ flex: 1, height: 1, background: LINE }} />
        </div>
        {eyebrow ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: READOUT, marginBottom: 20 }}>
            <div style={{ width: 14, height: 14, background: marker, transform: "rotate(30deg)" }} />
            <div>{eyebrow}</div>
          </div>
        ) : null}
        <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2 }}>{title}</div>
        {line ? <div style={{ marginTop: 22, fontSize: 30, lineHeight: 1.35, color: INK_2 }}>{line}</div> : null}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: READOUT }}>
        <div>datahygienics.com</div>
        <div>No sponsors · No referral fees</div>
      </div>
    </div>
  )
}
