import { Svg, Defs, ClipPath, G, Path, View, Text, StyleSheet } from "@react-pdf/renderer"
import { BRAND_COLORS, MARK } from "@/lib/brand/mark"
import { WORDMARK } from "@/lib/brand/wordmark"

// The Continuous Fold lockup for @react-pdf documents. react-pdf has no SVG
// masks, so the faces are clipped to the ring and the clear center and clean
// cut are painted white; PDF pages are white, so the result matches the
// master artwork. The wordmark is drawn from its outlines, never retyped.

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  sub: { fontSize: 8, color: "#475569", marginTop: 2 },
})

export function BrandMarkPdf({ size = 22 }) {
  return (
    <Svg viewBox={MARK.viewBox} width={size} height={size}>
      <Defs>
        <ClipPath id="dh-ring">
          <Path d={MARK.ring} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#dh-ring)">
        <Path d={MARK.faces.teal} fill={BRAND_COLORS.teal} />
        <Path d={MARK.faces.cobalt} fill={BRAND_COLORS.cobalt} />
        <Path d={MARK.faces.navy} fill={BRAND_COLORS.navy} />
      </G>
      <Path d={MARK.core} fill="#FFFFFF" />
      <Path d={MARK.cut} fill="#FFFFFF" />
    </Svg>
  )
}

export function WordmarkPdf({ height = 12 }) {
  const width = (WORDMARK.width / WORDMARK.height) * height
  return (
    <Svg viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`} width={width} height={height}>
      {WORDMARK.glyphs.map((g, i) => (
        <Path key={i} d={g.d} fill={BRAND_COLORS.navy} transform={`translate(${g.x} ${g.y}) scale(${g.scale} ${-g.scale})`} />
      ))}
    </Svg>
  )
}

// Mark, wordmark and an optional document line ("Incident Response Plan").
export default function BrandLockupPdf({ subtitle, markSize = 24 }) {
  return (
    <View style={styles.row}>
      <BrandMarkPdf size={markSize} />
      <View style={{ marginLeft: markSize * 0.35 }}>
        <WordmarkPdf height={markSize * 0.62} />
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
    </View>
  )
}
