"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { createClient } from "@/lib/supabase/client"
import {
  INCIDENT_TYPES,
  PLAYBOOKS,
  buildPlanContext,
  interpolateStep,
} from "@/lib/ir-plan/playbooks"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Edit3,
  LifeBuoy,
  Lock,
  Mail,
  ShieldAlert,
  Fish,
  Smartphone,
  Phone,
  Printer,
} from "lucide-react"

const IrPlanPdf = dynamic(
  () => import("@/app/tools/ir-plan/components/IrPlanPdf"),
  { ssr: false }
)

const ICON_MAP = { Lock, Mail, ShieldAlert, Fish, Smartphone }

export default function IrPlanViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0F766E]/30 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    }>
      <IrPlanViewInner />
    </Suspense>
  )
}

function IrPlanViewInner() {
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [pdfMode, setPdfMode] = useState(null) // "full" | "cards" | null

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }
      const { data } = await supabase
        .from("ir_plans")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle()
      setPlan(data || null)
      setLoading(false)

      // Auto-trigger PDF download from query string
      const dl = searchParams.get("download")
      if (dl === "full" || dl === "cards") {
        setPdfMode(dl)
      }
    }
    load()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0F766E]/30 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <p className="text-[#475569] mb-4">You haven't built a plan yet.</p>
          <Link
            href="/tools/ir-plan/builder"
            className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Build your plan
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const ctx = buildPlanContext(plan)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <Link
          href="/tools/ir-plan"
          className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incident Response
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <LifeBuoy className="w-5 h-5 text-[#0F766E]" />
            <span className="text-[#0F766E] text-xs font-medium tracking-wide">
              Incident Response Plan
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-2">
            {plan.company_name}
          </h1>
          <p className="text-sm text-[#475569]">
            Last updated {new Date(plan.updated_at || plan.created_at).toLocaleDateString()}
            {plan.last_tested_at && (
              <> &nbsp;|&nbsp; Last tested {new Date(plan.last_tested_at).toLocaleDateString()}</>
            )}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Link
              href="/tools/ir-plan/builder"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit plan
            </Link>
            <button
              onClick={() => setPdfMode("full")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#0E7490] px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={() => setPdfMode("cards")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] bg-white border border-[#0F766E]/30 hover:bg-[#F0FDFA] px-4 py-2 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" /> Print quick-reference cards
            </button>
          </div>
        </motion.div>

        {/* Response team grid */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">
            Response Team
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TeamCard label="Incident Commander" contact={plan.incident_commander} />
            <TeamCard label="IT Contact" contact={plan.it_contact} />
            <TeamCard label="Communications Lead" contact={plan.communications_lead} />
            {plan.legal_counsel?.name && (
              <TeamCard label="Legal Counsel" contact={plan.legal_counsel} />
            )}
          </div>
          {plan.insurance_info?.carrier && (
            <div className="mt-4 bg-white rounded-xl border border-[#0F766E]/20 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                Cyber Insurance
              </p>
              <p className="text-base font-bold text-[#0F172A]">{plan.insurance_info.carrier}</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-2 text-xs text-[#475569]">
                {plan.insurance_info.policy_number && (
                  <div>
                    <span className="text-[#94A3B8]">Policy:</span> {plan.insurance_info.policy_number}
                  </div>
                )}
                {plan.insurance_info.claims_phone && (
                  <div className="flex items-center gap-1 text-[#0F766E] font-semibold">
                    <Phone className="w-3 h-3" /> {plan.insurance_info.claims_phone}
                  </div>
                )}
                {plan.insurance_info.broker_name && (
                  <div>
                    <span className="text-[#94A3B8]">Broker:</span> {plan.insurance_info.broker_name}
                  </div>
                )}
              </div>
            </div>
          )}
          {Array.isArray(plan.additional_contacts) && plan.additional_contacts.length > 0 && (
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {plan.additional_contacts.map((c, i) => (
                <TeamCard key={i} label={c.role || "Additional Contact"} contact={c} />
              ))}
            </div>
          )}
        </section>

        {/* Playbooks */}
        <section>
          <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">
            Playbooks
          </h2>
          <div className="space-y-3">
            {INCIDENT_TYPES.map((it) => {
              const Icon = ICON_MAP[it.icon] || ShieldAlert
              const isOpen = !!expanded[it.key]
              const playbook = PLAYBOOKS[it.key]
              return (
                <div
                  key={it.key}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded((p) => ({ ...p, [it.key]: !p[it.key] }))}
                    className="w-full text-left p-5 hover:bg-[#F8FAFC] transition-colors flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-[#0F172A]">{it.title}</h3>
                      <p className="text-xs text-[#475569] mt-0.5">{it.description}</p>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#F1F5F9] p-6 space-y-6">
                      {playbook.phases.map((phase, pi) => (
                        <div key={pi}>
                          <h4 className="text-sm font-bold text-[#0F766E] mb-1">
                            {phase.title}
                          </h4>
                          <p className="text-xs text-[#94A3B8] italic mb-3">{phase.subtitle}</p>
                          <ol className="space-y-3">
                            {phase.steps.map((rawStep, si) => {
                              const step = interpolateStep(rawStep, ctx)
                              return (
                                <li key={step.id} className="flex gap-3">
                                  <div className="shrink-0 w-6 h-6 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs font-bold flex items-center justify-center mt-0.5">
                                    {si + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p
                                      className={`text-sm leading-relaxed ${
                                        step.critical
                                          ? "font-bold text-[#0F172A]"
                                          : "text-[#0F172A]"
                                      }`}
                                    >
                                      {step.action}
                                    </p>
                                    <p className="text-xs text-[#475569] mt-1.5 italic leading-relaxed">
                                      {step.why}
                                    </p>
                                    {step.script && (
                                      <div className="mt-2 rounded-lg border-l-4 border-[#0F766E] bg-[#F0FDFA] p-3">
                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#0F766E] mb-1">
                                          What to say
                                        </p>
                                        <p className="text-xs text-[#0F172A] leading-relaxed">
                                          {step.script}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </li>
                              )
                            })}
                          </ol>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
      <Footer />
      {pdfMode && (
        <IrPlanPdf
          mode={pdfMode}
          plan={plan}
          onClose={() => setPdfMode(null)}
        />
      )}
    </div>
  )
}

function TeamCard({ label, contact }) {
  if (!contact) return null
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
        {label}
      </p>
      <p className="text-base font-bold text-[#0F172A]">{contact.name || "Not set"}</p>
      {contact.title && <p className="text-xs text-[#475569]">{contact.title}</p>}
      <div className="mt-2 space-y-0.5">
        {contact.phone && (
          <p className="text-xs text-[#475569] flex items-center gap-1">
            <Phone className="w-3 h-3" /> {contact.phone}
          </p>
        )}
        {contact.after_hours_phone && (
          <p className="text-xs text-[#475569] flex items-center gap-1">
            <Phone className="w-3 h-3" /> {contact.after_hours_phone} (after hours)
          </p>
        )}
        {contact.email && <p className="text-xs text-[#475569]">{contact.email}</p>}
      </div>
    </div>
  )
}
