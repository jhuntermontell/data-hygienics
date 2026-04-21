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
import {
  INCIDENT_TYPES,
  PLAYBOOKS,
  buildPlanContext,
  interpolateStep,
} from "@/lib/ir-plan/playbooks"

const MAX_COMPANY_NAME = 100
const MAX_NOTE = 2000
const MAX_LOG_ACTION = 500

function truncate(text, max) {
  if (typeof text !== "string") return text
  if (text.length <= max) return text
  return text.slice(0, max - 3) + "..."
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0F172A",
    lineHeight: 1.5,
  },
  cardPage: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#0F172A",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: "2px solid #0F766E",
  },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoText: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0F766E" },
  logoSub: { fontSize: 8, color: "#475569" },
  companyName: { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "right" },

  // Cover
  coverWrap: {
    marginTop: 80,
    padding: 28,
    borderRadius: 6,
    borderTop: "4px solid #0F766E",
    backgroundColor: "#F8FAFC",
  },
  coverEyebrow: { fontSize: 9, color: "#0F766E", fontFamily: "Helvetica-Bold", marginBottom: 8 },
  coverCompany: { fontSize: 28, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  coverTitle: { fontSize: 16, color: "#475569", marginBottom: 18 },
  coverMeta: { fontSize: 10, color: "#64748B", marginBottom: 4 },

  // Sections
  h1: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 6, marginTop: 12 },
  h2: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#0F766E", marginTop: 14, marginBottom: 4 },
  h3: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 3 },
  body: { fontSize: 10, color: "#475569", marginBottom: 6, lineHeight: 1.55 },
  italic: { fontSize: 9, color: "#64748B", marginBottom: 4, fontStyle: "italic", lineHeight: 1.5 },

  // Team grid
  teamGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  teamCard: {
    width: "48%",
    marginRight: "2%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    border: "1px solid #E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  teamLabel: {
    fontSize: 7,
    color: "#94A3B8",
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    letterSpacing: 0.4,
  },
  teamName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  teamDetail: { fontSize: 9, color: "#475569", marginBottom: 1 },

  // Steps
  step: { flexDirection: "row", marginBottom: 6, marginTop: 4 },
  stepNum: {
    width: 16,
    fontSize: 9,
    color: "#0F766E",
    fontFamily: "Helvetica-Bold",
  },
  stepBody: { flex: 1 },
  stepAction: { fontSize: 10, marginBottom: 2 },
  stepWhy: { fontSize: 8, color: "#64748B", fontStyle: "italic" },
  stepCritical: { fontSize: 7, color: "#B91C1C", fontFamily: "Helvetica-Bold", marginBottom: 2 },

  // Card mode
  cardHeader: {
    backgroundColor: "#0F766E",
    color: "#FFFFFF",
    padding: 14,
    marginBottom: 12,
    borderRadius: 4,
  },
  cardCompany: { fontSize: 10, color: "#A7F3D0" },
  cardTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#FFFFFF", marginTop: 4 },
  cardSubtitle: { fontSize: 10, color: "#A7F3D0", marginTop: 2 },
  cardPhone: {
    backgroundColor: "#FEF2F2",
    border: "1.5px solid #DC2626",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  cardPhoneLabel: {
    fontSize: 8,
    color: "#B91C1C",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  cardPhoneNumber: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginTop: 2,
  },
  cardStep: {
    flexDirection: "row",
    marginBottom: 10,
    paddingLeft: 4,
  },
  cardStepNum: {
    width: 22,
    height: 22,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    backgroundColor: "#0F766E",
    borderRadius: 11,
    textAlign: "center",
    paddingTop: 4,
    marginRight: 8,
  },
  cardStepText: { flex: 1, fontSize: 11, lineHeight: 1.5 },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: "1px solid #E2E8F0",
    paddingTop: 6,
    fontSize: 7,
    color: "#94A3B8",
    textAlign: "center",
  },
  pageBreak: { marginBottom: 0 },
  draftWatermarkWrap: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  draftWatermarkText: {
    fontSize: 9,
    color: "#DC2626",
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#FEF2F2",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    letterSpacing: 1,
  },
})

/**
 * Fixed-position draft watermark that renders on every page of the document,
 * including overflow pages, thanks to react-pdf's `fixed` prop on a View.
 */
function DraftWatermark() {
  return (
    <View fixed style={styles.draftWatermarkWrap}>
      <Text style={styles.draftWatermarkText}>DRAFT - NOT SAVED TO SERVER</Text>
    </View>
  )
}

function LogoMark() {
  return (
    <Svg viewBox="0 0 32 32" width={20} height={20}>
      <Rect x={2} y={4} width={16} height={16} rx={4.5} ry={4.5} fill="#0F766E" fillOpacity={0.2} />
      <Rect x={10} y={12} width={16} height={16} rx={4.5} ry={4.5} fill="#0F766E" fillOpacity={0.45} />
      <Rect x={6} y={8} width={16} height={16} rx={4.5} ry={4.5} fill="none" stroke="#0F766E" strokeWidth={1.8} />
    </Svg>
  )
}

function PageHeader({ companyName }) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.logoArea}>
        <LogoMark />
        <View>
          <Text style={styles.logoText}>Data Hygienics</Text>
          <Text style={styles.logoSub}>Incident Response Plan</Text>
        </View>
      </View>
      <Text style={styles.companyName}>{truncate(companyName, MAX_COMPANY_NAME)}</Text>
    </View>
  )
}

function FullPlanDocument({ plan }) {
  const ctx = buildPlanContext(plan)
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={styles.page}>
        <PageHeader companyName={plan.company_name} />
        <View style={styles.coverWrap}>
          <Text style={styles.coverEyebrow}>INCIDENT RESPONSE PLAN</Text>
          <Text style={styles.coverCompany}>{truncate(plan.company_name, MAX_COMPANY_NAME)}</Text>
          <Text style={styles.coverTitle}>Built for the moments when everything goes wrong</Text>
          <Text style={styles.coverMeta}>Generated: {date}</Text>
          {plan.industry && <Text style={styles.coverMeta}>Industry: {plan.industry}</Text>}
          {plan.last_tested_at && (
            <Text style={styles.coverMeta}>
              Last tested: {new Date(plan.last_tested_at).toLocaleDateString()}
            </Text>
          )}
        </View>
        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>

      {/* Team page */}
      <Page size="A4" style={styles.page}>
        <PageHeader companyName={plan.company_name} />
        <Text style={styles.h1}>Response Team</Text>
        <Text style={styles.body}>
          During an incident, these are the people who lead, decide, and execute. Anyone named here should know their role before something goes wrong.
        </Text>
        <View style={styles.teamGrid}>
          <TeamCardPdf label="Incident Commander" contact={plan.incident_commander} />
          <TeamCardPdf label="IT Contact" contact={plan.it_contact} />
          <TeamCardPdf label="Communications Lead" contact={plan.communications_lead} />
          {plan.legal_counsel?.name && (
            <TeamCardPdf label="Legal Counsel" contact={plan.legal_counsel} />
          )}
        </View>

        {plan.insurance_info?.carrier && (
          <View>
            <Text style={styles.h2}>Cyber Insurance</Text>
            <View style={[styles.teamCard, { width: "100%" }]}>
              <Text style={styles.teamLabel}>CARRIER</Text>
              <Text style={styles.teamName}>{plan.insurance_info.carrier}</Text>
              {plan.insurance_info.policy_number && (
                <Text style={styles.teamDetail}>Policy: {plan.insurance_info.policy_number}</Text>
              )}
              {plan.insurance_info.claims_phone && (
                <Text style={styles.teamDetail}>Claims: {plan.insurance_info.claims_phone}</Text>
              )}
              {plan.insurance_info.broker_name && (
                <Text style={styles.teamDetail}>Broker: {plan.insurance_info.broker_name}</Text>
              )}
              {plan.insurance_info.broker_phone && (
                <Text style={styles.teamDetail}>Broker phone: {plan.insurance_info.broker_phone}</Text>
              )}
            </View>
          </View>
        )}

        {Array.isArray(plan.additional_contacts) && plan.additional_contacts.length > 0 && (
          <View>
            <Text style={styles.h2}>Additional Contacts</Text>
            <View style={styles.teamGrid}>
              {plan.additional_contacts.map((c, i) => (
                <TeamCardPdf key={i} label={c.role || "Additional Contact"} contact={c} />
              ))}
            </View>
          </View>
        )}
        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>

      {/* Playbooks - one section per type */}
      {INCIDENT_TYPES.map((it) => {
        const playbook = PLAYBOOKS[it.key]
        return (
          <Page key={it.key} size="A4" style={styles.page}>
            <PageHeader companyName={plan.company_name} />
            <Text style={styles.h1}>{it.title}</Text>
            <Text style={styles.body}>{it.description}</Text>
            {playbook.phases.map((phase, pi) => (
              <View key={pi}>
                <Text style={styles.h2}>{phase.title}</Text>
                <Text style={styles.italic}>{phase.subtitle}</Text>
                {phase.steps.map((rawStep, si) => {
                  const step = interpolateStep(rawStep, ctx)
                  return (
                    <View key={step.id} style={styles.step}>
                      <Text style={styles.stepNum}>{si + 1}.</Text>
                      <View style={styles.stepBody}>
                        {step.critical && <Text style={styles.stepCritical}>CRITICAL</Text>}
                        <Text style={styles.stepAction}>{step.action}</Text>
                        <Text style={styles.stepWhy}>Why: {step.why}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            ))}
            <Text style={styles.footer}>
              Generated by Data Hygienics | datahygienics.com | Confidential
            </Text>
          </Page>
        )
      })}

      {/* Quick reference phone list */}
      <Page size="A4" style={styles.page}>
        <PageHeader companyName={plan.company_name} />
        <Text style={styles.h1}>Quick Reference</Text>
        <Text style={styles.body}>
          The numbers your incident commander needs in the first 15 minutes.
        </Text>
        <View style={{ marginTop: 12 }}>
          <PhoneLine label="Incident Commander" name={plan.incident_commander?.name} phone={plan.incident_commander?.phone} />
          <PhoneLine label="IT Contact" name={plan.it_contact?.name} phone={plan.it_contact?.phone} />
          <PhoneLine label="IT (after hours)" name={plan.it_contact?.name} phone={plan.it_contact?.after_hours_phone} />
          <PhoneLine label="Communications Lead" name={plan.communications_lead?.name} phone={plan.communications_lead?.phone} />
          {plan.legal_counsel?.name && (
            <PhoneLine label="Legal Counsel" name={plan.legal_counsel?.name} phone={plan.legal_counsel?.phone} />
          )}
          {plan.insurance_info?.claims_phone && (
            <PhoneLine label="Insurance Claims" name={plan.insurance_info?.carrier} phone={plan.insurance_info?.claims_phone} />
          )}
          <PhoneLine label="FBI IC3" name="ic3.gov" phone="" />
        </View>
        <Text style={[styles.italic, { marginTop: 24 }]}>
          This plan was created with Data Hygienics (datahygienics.com) and should be reviewed annually.
        </Text>
        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>
    </Document>
  )
}

function PhoneLine({ label, name, phone }) {
  return (
    <View style={{ flexDirection: "row", borderBottom: "1px solid #E2E8F0", paddingVertical: 8 }}>
      <Text style={{ width: 130, fontSize: 9, color: "#64748B", fontFamily: "Helvetica-Bold" }}>
        {label}
      </Text>
      <Text style={{ flex: 1, fontSize: 10 }}>{name || ""}</Text>
      <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0F766E" }}>
        {phone || "-"}
      </Text>
    </View>
  )
}

function TeamCardPdf({ label, contact }) {
  if (!contact) return null
  return (
    <View style={styles.teamCard}>
      <Text style={styles.teamLabel}>{(label || "").toUpperCase()}</Text>
      <Text style={styles.teamName}>{contact.name || "Not set"}</Text>
      {contact.title && <Text style={styles.teamDetail}>{contact.title}</Text>}
      {contact.phone && <Text style={styles.teamDetail}>Phone: {contact.phone}</Text>}
      {contact.after_hours_phone && (
        <Text style={styles.teamDetail}>After hours: {contact.after_hours_phone}</Text>
      )}
      {contact.email && <Text style={styles.teamDetail}>{contact.email}</Text>}
    </View>
  )
}

function CardsDocument({ plan }) {
  const ctx = buildPlanContext(plan)
  return (
    <Document>
      {INCIDENT_TYPES.map((it) => {
        const playbook = PLAYBOOKS[it.key]
        const firstPhase = playbook.phases[0]
        const criticalPhone =
          plan.insurance_info?.claims_phone ||
          plan.it_contact?.phone ||
          plan.incident_commander?.phone ||
          ""
        const phoneLabel =
          plan.insurance_info?.claims_phone
            ? `INSURANCE CLAIMS: ${plan.insurance_info.carrier || ""}`
            : plan.it_contact?.phone
            ? "IT CONTACT"
            : "INCIDENT COMMANDER"
        return (
          <Page key={it.key} size="A4" style={styles.cardPage}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCompany}>{plan.company_name}</Text>
              <Text style={styles.cardTitle}>{it.title}</Text>
              <Text style={styles.cardSubtitle}>Quick reference card | {firstPhase.title}</Text>
            </View>
            {criticalPhone && (
              <View style={styles.cardPhone}>
                <Text style={styles.cardPhoneLabel}>FIRST CALL: {phoneLabel}</Text>
                <Text style={styles.cardPhoneNumber}>{criticalPhone}</Text>
              </View>
            )}
            <View>
              {firstPhase.steps.map((rawStep, si) => {
                const step = interpolateStep(rawStep, ctx)
                return (
                  <View key={step.id} style={styles.cardStep} wrap={false}>
                    <Text style={styles.cardStepNum}>{si + 1}</Text>
                    <Text style={styles.cardStepText}>{step.action}</Text>
                  </View>
                )
              })}
            </View>
            <Text style={styles.footer}>
              Print and laminate. Keep accessible. Data Hygienics | datahygienics.com
            </Text>
          </Page>
        )
      })}
    </Document>
  )
}

export function IncidentReportDocument({ plan, incident, draft }) {
  const date = new Date(incident.started_at || incident.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const log = Array.isArray(incident.action_log) ? incident.action_log : []
  const incidentLabel = (incident.incident_type || "").replace(/_/g, " ")
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {draft && <DraftWatermark />}
        <PageHeader companyName={plan?.company_name || "Organization"} />
        <View style={styles.coverWrap}>
          <Text style={styles.coverEyebrow}>INCIDENT REPORT</Text>
          <Text style={styles.coverCompany}>{(incidentLabel || "").toUpperCase()}</Text>
          <Text style={styles.coverTitle}>{date}</Text>
          <Text style={styles.coverMeta}>Status: {incident.status}</Text>
          {incident.severity && <Text style={styles.coverMeta}>Severity: {incident.severity}</Text>}
        </View>
        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        {draft && <DraftWatermark />}
        <PageHeader companyName={plan?.company_name || "Organization"} />
        <Text style={styles.h1}>Action Timeline</Text>
        <Text style={styles.body}>
          A timestamped log of every action taken during this incident. This record was generated automatically and is suitable for insurance, legal, and regulatory review.
        </Text>
        {log.length === 0 ? (
          <Text style={styles.italic}>No actions were logged.</Text>
        ) : (
          log.map((entry, i) => (
            <View key={i} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #E2E8F0" }}>
              <Text style={{ fontSize: 8, color: "#0F766E", fontFamily: "Helvetica-Bold" }}>
                {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}
              </Text>
              <Text style={styles.stepAction}>
                {truncate(entry.action || entry.note || "", MAX_LOG_ACTION)}
              </Text>
              {entry.note && entry.action && (
                <Text style={styles.stepWhy}>Note: {truncate(entry.note, MAX_NOTE)}</Text>
              )}
            </View>
          ))
        )}

        {incident.summary && (
          <View>
            <Text style={styles.h2}>Summary</Text>
            <Text style={styles.body}>{truncate(incident.summary, MAX_NOTE)}</Text>
          </View>
        )}
        {incident.lessons_learned && (
          <View>
            <Text style={styles.h2}>Lessons Learned</Text>
            <Text style={styles.body}>{truncate(incident.lessons_learned, MAX_NOTE)}</Text>
          </View>
        )}
        {incident.plan_updates_needed && (
          <View>
            <Text style={styles.h2}>Plan Updates Needed</Text>
            <Text style={styles.body}>{truncate(incident.plan_updates_needed, MAX_NOTE)}</Text>
          </View>
        )}
        <Text style={[styles.italic, { marginTop: 16 }]}>
          This report was generated using the Data Hygienics incident response system.
        </Text>
        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>
    </Document>
  )
}

export function ExerciseSummaryDocument({ plan, exercise }) {
  const date = new Date(exercise.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const decisions = Array.isArray(exercise.decisions) ? exercise.decisions : []
  const scenarioLabel = (exercise.scenario_type || "").replace(/_/g, " ")
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PageHeader companyName={plan?.company_name || "Organization"} />
        <View style={styles.coverWrap}>
          <Text style={styles.coverEyebrow}>TABLETOP EXERCISE SUMMARY</Text>
          <Text style={styles.coverCompany}>{(scenarioLabel || "").toUpperCase()}</Text>
          <Text style={styles.coverTitle}>{date}</Text>
          {exercise.score !== null && exercise.score !== undefined && (
            <Text style={styles.coverMeta}>Score: {exercise.score}%</Text>
          )}
        </View>
        <Text style={[styles.body, { marginTop: 20 }]}>
          {plan?.company_name || "This organization"} conducted a tabletop exercise on {date} covering {scenarioLabel}. This demonstrates proactive incident preparedness.
        </Text>
        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <PageHeader companyName={plan?.company_name || "Organization"} />
        <Text style={styles.h1}>Decisions and Feedback</Text>
        {decisions.length === 0 ? (
          <Text style={styles.italic}>No decisions were recorded.</Text>
        ) : (
          decisions.map((d, i) => (
            <View key={i} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #E2E8F0" }}>
              <Text style={styles.h3}>Stage {i + 1}: {truncate(d.question || "", MAX_NOTE)}</Text>
              <Text style={styles.body}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Your choice: </Text>
                {truncate(d.chosenText || "", MAX_NOTE)}
              </Text>
              <Text style={styles.italic}>{truncate(d.feedback || "", MAX_NOTE)}</Text>
            </View>
          ))
        )}
        <Text style={styles.footer}>
          Generated by Data Hygienics | datahygienics.com | Confidential
        </Text>
      </Page>
    </Document>
  )
}

export default function IrPlanPdf({ mode, plan, incident, exercise, draft, onClose }) {
  useEffect(() => {
    let cancelled = false
    async function generate() {
      let doc, filename
      if (mode === "cards") {
        doc = <CardsDocument plan={plan} />
        filename = `${slug(plan.company_name)}-quick-reference-cards.pdf`
      } else if (mode === "incident") {
        doc = <IncidentReportDocument plan={plan} incident={incident} draft={draft} />
        filename = `${draft ? "DRAFT-" : ""}${slug(plan?.company_name || "incident")}-incident-report-${new Date().toISOString().slice(0, 10)}.pdf`
      } else if (mode === "exercise") {
        doc = <ExerciseSummaryDocument plan={plan} exercise={exercise} />
        filename = `${slug(plan?.company_name || "tabletop")}-tabletop-${new Date().toISOString().slice(0, 10)}.pdf`
      } else {
        doc = <FullPlanDocument plan={plan} />
        filename = `${slug(plan.company_name)}-incident-response-plan.pdf`
      }
      const blob = await pdf(doc).toBlob()
      if (cancelled) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onClose?.()
    }
    generate()
    return () => {
      cancelled = true
    }
  }, [])
  return null
}

function slug(s) {
  return (s || "plan").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}
