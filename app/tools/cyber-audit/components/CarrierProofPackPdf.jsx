"use client"

import { useEffect } from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer"

// ============================================================================
// Carrier Proof Pack PDF
// ============================================================================
//
// React-PDF document that renders the structured proofPackData output from
// lib/carriers/engine.js::generateProofPackData into a broker-ready PDF.
//
// Pattern mirrors the existing PdfReport component: dynamically imported
// from the results page so @react-pdf/renderer never loads on the server,
// the wrapper kicks off pdf().toBlob() in an effect, triggers a download,
// and calls onClose when done.
//
// Page layout:
//
//   Page 1 - Cover + executive summary + denial risk flags
//   Page 2 - Control-by-control breakdown grouped by category
//   Page 3 - Evidence collection guide (priority-sorted)
//   Page 4 - Remediation priorities + legal disclaimer
//
// Style choices deliberately match the existing PdfReport for visual
// consistency (Helvetica, #3b82f6 primary accent for document rules so the
// PDF feels part of the same family - even though the dashboard uses the
// teal #0F766E, the document is generated for a broker audience that also
// sees the other Data Hygienics PDFs).
// ============================================================================

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    lineHeight: 1.4,
  },
  header: {
    borderBottom: "2px solid #0F766E",
    paddingBottom: 16,
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  logoTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0F766E",
  },
  logoSubtitle: {
    fontSize: 9,
    color: "#64748b",
    marginLeft: 6,
  },
  reportKicker: {
    fontSize: 9,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 10,
  },
  businessName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginTop: 4,
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 13,
    color: "#0F766E",
    marginBottom: 10,
  },
  metaRow: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 16,
    marginBottom: 14,
  },
  scoreNumber: {
    fontSize: 42,
    fontFamily: "Helvetica-Bold",
    marginRight: 16,
  },
  scoreOutOf: {
    fontSize: 9,
    color: "#94a3b8",
  },
  readinessLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 9,
    color: "#475569",
    marginTop: 4,
    lineHeight: 1.5,
  },
  statRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  statCell: {
    flex: 1,
    paddingRight: 8,
  },
  statNumber: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  // Denial risk flag styling
  flagBox: {
    backgroundColor: "#FEF2F2",
    borderLeft: "3px solid #DC2626",
    padding: 10,
    marginBottom: 8,
  },
  flagSeverity: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  flagMessage: {
    fontSize: 10,
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  flagRemediation: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },
  // Control rows
  controlRow: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "0.5px solid #e2e8f0",
  },
  controlCategoryLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  controlQuestion: {
    fontSize: 10,
    color: "#0f172a",
    marginBottom: 4,
  },
  controlAnswer: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },
  controlStatus: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  // Evidence row
  evidenceRow: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: "0.5px solid #f1f5f9",
  },
  evidenceArtifact: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  evidenceFormat: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
  },
  evidenceWhere: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },
  // Disclaimer
  disclaimerBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: 10,
    marginTop: 12,
  },
  disclaimerTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  disclaimerBody: {
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: "0.5px solid #e2e8f0",
    paddingTop: 8,
  },
})

// Mirrors CONTROL_CATEGORY_LABELS in the dashboard component. PDF rendering
// runs in the browser but is a separate bundle, so we can't share the
// constant without re-importing the whole dashboard module - easier to
// duplicate this short lookup.
const CATEGORY_LABELS = {
  mfa: "Multi-Factor Authentication",
  edr: "Endpoint Detection & Response",
  backups: "Backups",
  incident_response: "Incident Response",
  patching: "Patch Management",
  logging_monitoring: "Logging & Monitoring",
  security_awareness: "Security Awareness",
  privileged_access: "Privileged Access",
  email_security: "Email Security",
  encryption: "Encryption",
  vendor_risk: "Vendor Risk",
  network_segmentation: "Network Segmentation",
}

// Color lookup for readiness band and status labels.
const READINESS_COLORS = {
  ready: "#0F766E",
  gaps_exist: "#D97706",
  likely_denial: "#DC2626",
}

const STATUS_COLORS = {
  pass: "#0F766E",
  partial: "#D97706",
  fail: "#DC2626",
  not_assessed: "#475569",
}

const STATUS_LABELS = {
  pass: "PASS",
  partial: "PARTIAL",
  fail: "FAIL",
  not_assessed: "NEEDS INPUT",
}

// ----------------------------------------------------------------------------
// Document
// ----------------------------------------------------------------------------

function CarrierProofPackDocument({ proofPackData }) {
  const { cover, summary, denialRiskFlags, controlsByCategory, evidenceChecklist, remediationPriorities, disclaimer } = proofPackData

  return (
    <Document>
      {/* Page 1: cover + summary + denial flags */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoTitle}>DATA HYGIENICS</Text>
            <Text style={styles.logoSubtitle}>Carrier Proof Pack</Text>
          </View>
          <Text style={styles.reportKicker}>Insurance Readiness Report</Text>
          <Text style={styles.businessName}>{cover.businessName}</Text>
          <Text style={styles.reportTitle}>
            {cover.carrierName} Readiness
          </Text>
          <Text style={styles.metaRow}>
            Generated: {cover.generatedOn}
            {cover.industry ? `  |  Industry: ${cover.industry}` : ""}
          </Text>
          {cover.formName ? (
            <Text style={styles.metaRow}>
              Form: {cover.formName}
            </Text>
          ) : null}
          {cover.formVersion ? (
            <Text style={styles.metaRow}>Version: {cover.formVersion}</Text>
          ) : null}
          {cover.contactName ? (
            <Text style={styles.metaRow}>Contact: {cover.contactName}{cover.contactEmail ? ` (${cover.contactEmail})` : ""}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.scoreBox}>
            <Text
              style={[
                styles.scoreNumber,
                { color: READINESS_COLORS[summary.overallReadiness] || "#0f172a" },
              ]}
            >
              {summary.readinessScore}
            </Text>
            <View>
              <Text style={styles.scoreOutOf}>out of 100</Text>
              <Text
                style={[
                  styles.readinessLabel,
                  { color: READINESS_COLORS[summary.overallReadiness] || "#0f172a" },
                ]}
              >
                {summary.overallReadiness.replace("_", " ")}
              </Text>
            </View>
          </View>
          <Text style={styles.summaryText}>{summary.headline}</Text>
          <View style={styles.statRow}>
            <View style={styles.statCell}>
              <Text style={[styles.statNumber, { color: "#0F766E" }]}>{summary.passCount}</Text>
              <Text style={styles.statLabel}>Pass</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statNumber, { color: "#D97706" }]}>{summary.partialCount}</Text>
              <Text style={styles.statLabel}>Partial</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statNumber, { color: "#DC2626" }]}>{summary.failCount}</Text>
              <Text style={styles.statLabel}>Fail</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statNumber, { color: "#475569" }]}>{summary.notAssessedCount}</Text>
              <Text style={styles.statLabel}>Needs Input</Text>
            </View>
          </View>
        </View>

        {denialRiskFlags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Denial Risk Flags ({denialRiskFlags.length})
            </Text>
            {denialRiskFlags.map((flag, i) => (
              // No wrap={false}: flag messages are variable-length prose
              // plus a remediation paragraph. Truncating content on a
              // broker-facing document is worse than a natural page break.
              <View key={i} style={styles.flagBox}>
                <Text style={styles.flagSeverity}>
                  {flag.severity} · {CATEGORY_LABELS[flag.controlCategory] || flag.controlCategory}
                </Text>
                <Text style={styles.flagMessage}>{flag.message}</Text>
                {flag.remediation ? (
                  <Text style={styles.flagRemediation}>
                    Action: {flag.remediation}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          Data Hygienics Carrier Proof Pack  |  Page 1  |  datahygienics.com
        </Text>
      </Page>

      {/* Page 2: control-by-control breakdown */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>
          Control-by-Control Breakdown
        </Text>
        <Text style={styles.summaryText}>
          Each control below is a question on the {cover.carrierName} application
          form, translated from your assessment answers. Review each translated
          answer with your broker before submitting.
        </Text>
        <View style={{ marginTop: 12 }}>
          {Object.entries(controlsByCategory).map(([category, controls]) => (
            // No wrap={false}: each category can contain multiple long
            // question/answer/recommendation blocks. Forcing the whole
            // group onto one page would truncate at the page boundary.
            <View key={category} style={{ marginBottom: 10 }}>
              <Text style={styles.controlCategoryLabel}>
                {CATEGORY_LABELS[category] || category}
              </Text>
              {controls.map((control) => (
                <View key={control.carrierQuestionId} style={styles.controlRow}>
                  <Text style={styles.controlQuestion}>
                    Q: {control.carrierQuestionText}
                  </Text>
                  <Text style={styles.controlAnswer}>
                    A: {control.userAnswerText}
                  </Text>
                  <Text
                    style={[
                      styles.controlStatus,
                      { color: STATUS_COLORS[control.status] || "#475569" },
                    ]}
                  >
                    {STATUS_LABELS[control.status]} · {control.denialRiskLevel} risk
                  </Text>
                  {control.recommendation ? (
                    <Text style={[styles.controlAnswer, { marginTop: 3 }]}>
                      Recommendation: {control.recommendation}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.footer}>
          Data Hygienics Carrier Proof Pack  |  Page 2  |  datahygienics.com
        </Text>
      </Page>

      {/* Page 3: evidence collection guide */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Evidence Collection Guide</Text>
        <Text style={styles.summaryText}>
          Underwriters increasingly ask for documentary proof of the controls
          you attest to. Collect the artifacts below (sorted by priority) and
          include them with your application submission.
        </Text>
        <View style={{ marginTop: 14 }}>
          {evidenceChecklist.map((item) => (
            // No wrap={false}: whereToFind instructions are multi-sentence
            // and routinely exceed a single page break boundary. Allow
            // them to flow onto the next page rather than cut off.
            <View key={item.evidenceItemId} style={styles.evidenceRow}>
              <Text
                style={[
                  styles.controlCategoryLabel,
                  { color: STATUS_COLORS[item.priority === "critical" || item.priority === "high" ? "fail" : "partial"] },
                ]}
              >
                {item.priority.toUpperCase()} · {CATEGORY_LABELS[item.controlCategory] || item.controlCategory}
              </Text>
              <Text style={styles.evidenceArtifact}>{item.artifactName}</Text>
              <Text style={styles.evidenceFormat}>{item.format}</Text>
              <Text style={styles.evidenceWhere}>{item.whereToFind}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer}>
          Data Hygienics Carrier Proof Pack  |  Page 3  |  datahygienics.com
        </Text>
      </Page>

      {/* Page 4: remediation priorities + disclaimer */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Remediation Priorities</Text>
        <Text style={styles.summaryText}>
          Controls ordered by impact on your ability to bind coverage. Address
          failures from the top down. Remediate critical flags before
          submission.
        </Text>
        <View style={{ marginTop: 14 }}>
          {remediationPriorities.length === 0 ? (
            <Text style={styles.summaryText}>
              No remediation items. Your assessment passed every carrier
              question with a mapped answer.
            </Text>
          ) : (
            remediationPriorities.map((item, i) => (
              // No wrap={false}: remediation entries include a full
              // recommendation paragraph that can easily exceed a page
              // boundary. Keep natural flow rather than force single-page.
              <View key={i} style={styles.controlRow}>
                <Text
                  style={[
                    styles.controlStatus,
                    { color: STATUS_COLORS[item.status] || "#475569", marginBottom: 3 },
                  ]}
                >
                  {i + 1}. {item.status.toUpperCase()} · {item.denialRiskLevel} risk · {CATEGORY_LABELS[item.controlCategory] || item.controlCategory}
                </Text>
                <Text style={styles.controlQuestion}>
                  {item.carrierQuestionText}
                </Text>
                <Text style={styles.controlAnswer}>
                  {item.recommendation}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          <Text style={styles.disclaimerBody}>{disclaimer}</Text>
        </View>

        <Text style={styles.footer}>
          Data Hygienics Carrier Proof Pack  |  Page 4  |  datahygienics.com
        </Text>
      </Page>
    </Document>
  )
}

// ----------------------------------------------------------------------------
// Wrapper component. Kicks off PDF generation in an effect, triggers a
// download, calls onClose. Returns null - nothing to render in the DOM.
// ----------------------------------------------------------------------------

export default function CarrierProofPackPdf({ proofPackData, onClose, onError }) {
  useEffect(() => {
    let cancelled = false
    async function generate() {
      try {
        const blob = await pdf(
          <CarrierProofPackDocument proofPackData={proofPackData} />
        ).toBlob()
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const carrierSlug = (proofPackData?.cover?.carrierName || "carrier")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
        a.download = `${carrierSlug}-proof-pack-${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        onClose?.()
      } catch (err) {
        console.error("Carrier proof pack PDF generation failed:", err)
        if (!cancelled) {
          onError?.(err)
          onClose?.()
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
