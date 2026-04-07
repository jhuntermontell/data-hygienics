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
  Path,
  Circle,
} from "@react-pdf/renderer"
import { RECOMMENDATIONS } from "@/lib/cyber-audit/recommendations"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoText: {
    marginLeft: 8,
  },
  logoTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
  },
  logoSubtitle: {
    fontSize: 10,
    color: "#64748b",
  },
  header: {
    borderBottom: "2px solid #3b82f6",
    paddingBottom: 16,
    marginBottom: 24,
  },
  companyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 4,
    marginTop: 12,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
    marginBottom: 8,
  },
  meta: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.6,
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },
  scoreNumber: {
    fontSize: 48,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
    marginRight: 16,
  },
  gradeText: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  gradeLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottom: "1px solid #f1f5f9",
  },
  sectionName: {
    fontSize: 10,
    color: "#334155",
    flex: 1,
  },
  barTrack: {
    width: 120,
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  sectionScore: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    width: 35,
    textAlign: "right",
  },
  gapItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 6,
  },
  gapItemMedium: {
    backgroundColor: "#fefce8",
    border: "1px solid #fde68a",
  },
  gapItemLow: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  gapTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  gapSection: {
    fontSize: 8,
    color: "#666",
    marginBottom: 4,
  },
  gapAction: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.4,
  },
  gapMapping: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 3,
  },
  effortBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
  },
  insuranceWarning: {
    backgroundColor: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 9,
    color: "#9a3412",
    lineHeight: 1.5,
  },
  remediationBox: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 4,
    padding: 8,
    marginTop: 6,
  },
  remediationTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#166534",
    marginBottom: 3,
  },
  remediationStep: {
    fontSize: 8,
    color: "#15803d",
    lineHeight: 1.5,
  },
})

function getBarColor(pct) {
  if (pct >= 80) return "#34d399"
  if (pct >= 60) return "#facc15"
  return "#f87171"
}

function getEffortEstimate(rec) {
  if (!rec) return "Medium"
  const priority = rec.priority || "medium"
  if (priority === "high") return "High"
  if (priority === "low") return "Low"
  return "Medium"
}

function LogoSvg() {
  return (
    <Svg viewBox="0 0 40 40" width={28} height={28}>
      <Path
        d="M20 4L6 10v10c0 9.55 5.97 18.48 14 21 8.03-2.52 14-11.45 14-21V10L20 4z"
        fill="#3b82f6"
        opacity={0.15}
        stroke="#3b82f6"
        strokeWidth={1.5}
      />
      <Path
        d="M14 20l4 4 8-8"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={14} cy={14} r={1} fill="#3b82f6" opacity={0.4} />
      <Circle cx={20} cy={12} r={1} fill="#3b82f6" opacity={0.4} />
      <Circle cx={26} cy={14} r={1} fill="#3b82f6" opacity={0.4} />
    </Svg>
  )
}

function ReportDocument({
  score,
  grade,
  label,
  sectionScores,
  gaps,
  fullName,
  companyName,
  email,
  date,
  industry,
  employeeCount,
  hasInsurance,
  reportType,
}) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedGaps = [...gaps].sort((a, b) => {
    const recA = RECOMMENDATIONS[a.questionKey]
    const recB = RECOMMENDATIONS[b.questionKey]
    return (priorityOrder[recA?.priority] ?? 3) - (priorityOrder[recB?.priority] ?? 3)
  })

  const isInsurance = reportType === "insurance"
  const titleText = isInsurance
    ? "Cybersecurity Assessment Report"
    : "Internal Remediation Report"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <LogoSvg />
            <View style={styles.logoText}>
              <Text style={styles.logoTitle}>Data Hygienics</Text>
              <Text style={styles.logoSubtitle}>Cybersecurity Platform</Text>
            </View>
          </View>
          {companyName && (
            <Text style={styles.companyName}>{companyName}</Text>
          )}
          <Text style={styles.reportTitle}>{titleText}</Text>
          <Text style={styles.meta}>
            {fullName || email} | {formattedDate}
          </Text>
          {industry && (
            <Text style={styles.meta}>
              Industry: {industry}
              {employeeCount ? ` | Employees: ${employeeCount}` : ""}
              {hasInsurance ? ` | Cyber Insurance: ${hasInsurance}` : ""}
            </Text>
          )}
        </View>

        {hasInsurance === "No" && (
          <View style={styles.insuranceWarning}>
            <Text style={[styles.warningText, { fontFamily: "Helvetica-Bold" }]}>
              No Cyber Insurance Detected
            </Text>
            <Text style={styles.warningText}>
              This report can be used to support your cyber insurance application. We strongly recommend obtaining coverage to protect your business from breach costs.
            </Text>
          </View>
        )}

        <View style={styles.scoreBox}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <View>
            <Text style={styles.gradeText}>Grade: {grade}</Text>
            <Text style={styles.gradeLabel}>{label}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Section Breakdown</Text>
        {sectionScores.map((s) => (
          <View key={s.key} style={styles.sectionRow}>
            <Text style={styles.sectionName}>{s.title}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${s.percentage}%`,
                    backgroundColor: getBarColor(s.percentage),
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.sectionScore, { color: getBarColor(s.percentage) }]}
            >
              {s.percentage}%
            </Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          {isInsurance ? "Identified Gaps" : "Identified Gaps & Remediation Plan"}
        </Text>
        {sortedGaps.map((gap) => {
          const rec = RECOMMENDATIONS[gap.questionKey]
          const effort = getEffortEstimate(rec)
          return (
            <View
              key={gap.questionKey}
              style={[
                styles.gapItem,
                rec?.priority === "medium" && styles.gapItemMedium,
                rec?.priority === "low" && styles.gapItemLow,
              ]}
              wrap={false}
            >
              <Text style={styles.gapTitle}>
                [{(rec?.priority || "medium").toUpperCase()}] {rec?.title || gap.questionText}
              </Text>
              <Text style={styles.gapSection}>
                {gap.section}
                {gap.nistFunction ? ` | NIST: ${gap.nistFunction}` : ""}
                {gap.cisControl ? ` | CIS: ${gap.cisControl}` : ""}
              </Text>

              {!isInsurance && (
                <>
                  <View style={styles.remediationBox}>
                    <Text style={styles.remediationTitle}>Remediation Steps</Text>
                    <Text style={styles.remediationStep}>
                      {rec?.action || "Review and address this security gap. Consult with your IT team or a security professional to implement appropriate controls."}
                    </Text>
                  </View>
                  <Text style={styles.effortBadge}>
                    Estimated Effort: {effort}
                  </Text>
                </>
              )}
            </View>
          )
        })}

        <Text style={styles.footer}>
          Generated by Data Hygienics Cyber Audit Tool | datahygienics.com
        </Text>
      </Page>
    </Document>
  )
}

export default function PdfReport({ reportType = "insurance", onClose, ...props }) {
  useEffect(() => {
    async function generate() {
      const blob = await pdf(
        <ReportDocument {...props} reportType={reportType} />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const prefix = reportType === "insurance" ? "insurance-report" : "remediation-report"
      a.download = `${prefix}-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onClose?.()
    }
    generate()
  }, [])

  return null
}
