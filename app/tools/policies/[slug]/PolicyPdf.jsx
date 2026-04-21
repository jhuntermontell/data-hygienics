"use client"

import { useEffect } from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Svg,
  Rect,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0F172A",
    lineHeight: 1.6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: "2px solid #1D4ED8",
  },
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1D4ED8",
  },
  logoSub: {
    fontSize: 8,
    color: "#475569",
  },
  companyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    textAlign: "right",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  meta: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1D4ED8",
    marginTop: 20,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.7,
    marginBottom: 8,
  },
  signatureBlock: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: "1px solid #E2E8F0",
  },
  signatureTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 16,
  },
  signatureRow: {
    flexDirection: "row",
    gap: 40,
  },
  signatureField: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#94A3B8",
    marginBottom: 4,
  },
  signatureLine: {
    borderBottom: "1px solid #0F172A",
    paddingBottom: 4,
    fontSize: 10,
    color: "#0F172A",
    minHeight: 16,
  },
  signatureCaption: {
    fontSize: 8,
    color: "#94A3B8",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 48,
    right: 48,
    borderTop: "1px solid #E2E8F0",
    paddingTop: 8,
    fontSize: 7,
    color: "#94A3B8",
    textAlign: "center",
  },
})

function LogoMark() {
  return (
    <Svg viewBox="0 0 32 32" width={22} height={22}>
      <Rect x={2} y={4} width={16} height={16} rx={4.5} ry={4.5} fill="#1D4ED8" fillOpacity={0.2} />
      <Rect x={10} y={12} width={16} height={16} rx={4.5} ry={4.5} fill="#1D4ED8" fillOpacity={0.45} />
      <Rect x={6} y={8} width={16} height={16} rx={4.5} ry={4.5} fill="none" stroke="#1D4ED8" strokeWidth={1.8} />
    </Svg>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return "Date not set"
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return "Date not set"
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function PolicyDocument({ policyName, companyName, ownerName, ownerTitle, effectiveDate, reviewFrequency, sections }) {
  const formattedDate = formatDate(effectiveDate)

  // Compute next review only when we have a parseable base date. Otherwise
  // fall back to "As needed" so the PDF never renders "Invalid Date".
  const baseDate = effectiveDate ? new Date(effectiveDate) : null
  const baseOk = baseDate && !Number.isNaN(baseDate.getTime())
  let nextReview = null
  if (baseOk) {
    if (reviewFrequency === "Annual") {
      nextReview = new Date(baseDate)
      nextReview.setFullYear(nextReview.getFullYear() + 1)
    } else if (reviewFrequency === "Quarterly") {
      nextReview = new Date(baseDate)
      nextReview.setMonth(nextReview.getMonth() + 3)
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.logoArea}>
            <LogoMark />
            <View>
              <Text style={styles.logoText}>Data Hygienics</Text>
              <Text style={styles.logoSub}>Cybersecurity Platform</Text>
            </View>
          </View>
          <Text style={styles.companyName}>{companyName}</Text>
        </View>

        <Text style={styles.title}>{policyName}</Text>
        <Text style={styles.meta}>
          Effective: {formattedDate} | Review: {reviewFrequency} | Owner: {ownerName}{ownerTitle ? `, ${ownerTitle}` : ""}
        </Text>

        {sections.map((section, i) => (
          <View key={i}>
            <Text style={styles.sectionHeading}>{i + 1}. {section.title}</Text>
            {section.text.split("\n\n").map((para, pi) => (
              <Text key={pi} style={styles.sectionText}>{para}</Text>
            ))}
          </View>
        ))}

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureTitle}>Approval</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Policy Owner</Text>
              <Text style={styles.signatureLine}>{ownerName || ""}</Text>
              <Text style={styles.signatureCaption}>{ownerTitle || ""}</Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Date Approved</Text>
              <Text style={styles.signatureLine}>{formattedDate}</Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Next Review</Text>
              <Text style={styles.signatureLine}>
                {nextReview
                  ? nextReview.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "As needed"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>
    </Document>
  )
}

export default function PolicyPdf({ onClose, onError, ...props }) {
  useEffect(() => {
    let cancelled = false
    async function generate() {
      try {
        const blob = await pdf(<PolicyDocument {...props} />).toBlob()
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const safeName = (props.policyName || "policy")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
        a.download = `${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        onClose?.()
      } catch (err) {
        console.error("Policy PDF generation failed:", err)
        if (!cancelled) {
          onError?.(err)
        }
      }
    }
    generate()
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
