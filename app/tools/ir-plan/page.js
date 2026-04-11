"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getSubscription } from "@/lib/stripe/subscription"
import { INCIDENT_TYPES } from "@/lib/ir-plan/playbooks"
import UpgradeModal from "@/app/tools/cyber-audit/components/UpgradeModal"
import {
  LifeBuoy,
  Users,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Lock,
  Mail,
  Fish,
  Smartphone,
  Phone,
  Briefcase,
  Building2,
  ClipboardList,
  Play,
  History,
  Download,
  FileText,
  Edit3,
  Check,
} from "lucide-react"

const ICON_MAP = { Lock, Mail, ShieldAlert, Fish, Smartphone }

export default function IrPlanHubPage() {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState(null)
  const [exercises, setExercises] = useState([])
  const [incidents, setIncidents] = useState([])
  const [activeIncidents, setActiveIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }
      setUser(session.user)

      const [planRes, exRes, activeRes, historyRes, subData] = await Promise.all([
        supabase.from("ir_plans").select("*").eq("user_id", session.user.id).maybeSingle(),
        supabase
          .from("ir_exercises")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        // Dedicated query for active incidents so they never get hidden
        // behind a paginated history list.
        supabase
          .from("ir_incidents")
          .select("id, incident_type, severity, started_at, status, action_log")
          .eq("user_id", session.user.id)
          .eq("status", "active")
          .order("started_at", { ascending: false })
          .limit(3),
        // History query: everything that is not currently active
        supabase
          .from("ir_incidents")
          .select("*")
          .eq("user_id", session.user.id)
          .neq("status", "active")
          .order("created_at", { ascending: false })
          .limit(10),
        getSubscription(session.user.id),
      ])

      setPlan(planRes.data || null)
      setExercises(exRes.data || [])
      setIncidents(historyRes.data || [])
      setActiveIncidents(activeRes.data || [])
      // IR plan builder is gated behind paid plan, similar to policies
      setIsPaid(subData.access.canAccessPolicies || subData.plan === "starter")
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0F766E]/30 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    )
  }

  // No saved plan yet: introduction page
  if (!plan) {
    return <IntroductionView user={user} isPaid={isPaid} onUpgrade={() => setShowUpgrade(true)} showUpgrade={showUpgrade} setShowUpgrade={setShowUpgrade} />
  }

  // Has a saved plan: dashboard
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <LifeBuoy className="w-5 h-5 text-[#0F766E]" />
            <span className="text-[#0F766E] text-xs font-medium tracking-wide">
              Incident Response
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-2">
                {plan.company_name} Response Plan
              </h1>
              <p className="text-[#475569] text-sm">
                Last updated {plan.updated_at ? new Date(plan.updated_at).toLocaleDateString() : "recently"}
                {plan.last_tested_at && (
                  <> &nbsp;|&nbsp; Last tested {new Date(plan.last_tested_at).toLocaleDateString()}</>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/tools/ir-plan/view"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#0E7490] px-4 py-2 rounded-lg border border-[#0F766E]/20 bg-white hover:bg-[#F0FDFA] transition-colors"
              >
                <FileText className="w-4 h-4" /> View full plan
              </Link>
              <Link
                href="/tools/ir-plan/builder"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit team
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Resume active incidents */}
        {activeIncidents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] font-semibold text-[#B91C1C] uppercase tracking-wider mb-3">
              Active Incident{activeIncidents.length === 1 ? "" : "s"}
            </h3>
            <div className="space-y-3">
              {activeIncidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border-2 border-[#DC2626] bg-[#FEF2F2] p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#B91C1C] mb-0.5">
                          Active
                        </p>
                        <p className="text-base font-bold text-[#0F172A] capitalize">
                          {(incident.incident_type || "").replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-[#475569] mt-0.5">
                          Started{" "}
                          {new Date(
                            incident.started_at || incident.created_at
                          ).toLocaleString()}
                          {Array.isArray(incident.action_log) && (
                            <>
                              {" "}
                              &middot; {incident.action_log.length} action
                              {incident.action_log.length === 1 ? "" : "s"} logged
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/tools/ir-plan/incident/${incident.incident_type}?resume=${incident.id}`}
                      className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#B91C1C] shrink-0 min-h-[44px]"
                    >
                      <Play className="w-4 h-4" /> Resume
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Response team */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-12"
        >
          <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">
            Your Response Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ContactCard icon={Briefcase} label="Incident Commander" contact={plan.incident_commander} />
            <ContactCard icon={Users} label="IT Contact" contact={plan.it_contact} />
            <ContactCard icon={ClipboardList} label="Communications Lead" contact={plan.communications_lead} />
            {plan.legal_counsel?.name && (
              <ContactCard icon={Building2} label="Legal Counsel" contact={plan.legal_counsel} />
            )}
            {plan.insurance_info?.carrier && (
              <InsuranceCard insurance={plan.insurance_info} />
            )}
          </div>
        </motion.section>

        {/* Playbooks */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
            Incident Playbooks
          </h2>
          <p className="text-sm text-[#475569] mb-5">
            Activate one of these to begin a guided, timestamped response.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {INCIDENT_TYPES.map((it) => {
              const Icon = ICON_MAP[it.icon] || ShieldAlert
              return (
                <div
                  key={it.key}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        it.severity === "critical"
                          ? "bg-[#FEE2E2] text-[#B91C1C]"
                          : it.severity === "high"
                          ? "bg-[#FFEDD5] text-[#C2410C]"
                          : "bg-[#FEF3C7] text-[#92400E]"
                      }`}
                    >
                      {it.severity}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-1.5">{it.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed mb-4 flex-1">
                    {it.description}
                  </p>
                  <Link
                    href={`/tools/ir-plan/incident/${it.key}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#DC2626] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#B91C1C] transition-colors"
                  >
                    <Play className="w-4 h-4" /> Activate
                  </Link>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider">
              History and Testing
            </h2>
            <Link
              href="/tools/ir-plan/exercise"
              className="text-xs font-semibold text-[#0F766E] hover:text-[#0E7490] flex items-center gap-1"
            >
              Run a tabletop exercise <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-[#475569]" />
                <h3 className="text-sm font-semibold text-[#0F172A]">Tabletop exercises</h3>
              </div>
              {exercises.length === 0 ? (
                <p className="text-xs text-[#94A3B8]">
                  No exercises yet. Tabletop exercises let you rehearse your plan in a low-risk way and produce documentation insurance brokers recognize.
                </p>
              ) : (
                <ul className="space-y-2">
                  {exercises.map((ex) => (
                    <li key={ex.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#0F172A] capitalize">
                          {ex.scenario_type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[#94A3B8]"> &middot; {new Date(ex.created_at).toLocaleDateString()}</span>
                      </div>
                      {ex.score !== null && (
                        <span className="text-[#0F766E] font-semibold">{ex.score}%</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-[#475569]" />
                <h3 className="text-sm font-semibold text-[#0F172A]">Past incidents</h3>
              </div>
              {incidents.length === 0 ? (
                <p className="text-xs text-[#94A3B8]">
                  No incidents logged. We hope it stays that way.
                </p>
              ) : (
                <ul className="space-y-2">
                  {incidents.map((inc) => (
                    <li key={inc.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#0F172A] capitalize">
                          {inc.incident_type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[#94A3B8]">
                          {" "}
                          &middot; {new Date(inc.started_at || inc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`font-semibold ${
                          inc.status === "active" ? "text-[#DC2626]" : "text-[#0F766E]"
                        }`}
                      >
                        {inc.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/tools/ir-plan/view?download=full"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#0F172A] px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors"
            >
              <Download className="w-4 h-4" /> Download printable version
            </Link>
            <Link
              href="/tools/ir-plan/view?download=cards"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#0F172A] px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors"
            >
              <Download className="w-4 h-4" /> Print quick-reference cards
            </Link>
          </div>
        </motion.section>
      </div>
      <Footer />
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          feature="Incident Response Plan"
          showOneTime="policies"
        />
      )}
    </div>
  )
}

function ContactCard({ icon: Icon, label, contact }) {
  if (!contact) contact = {}
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#0F766E]" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold text-[#0F172A]">{contact.name || "Not set"}</p>
      {contact.title && <p className="text-xs text-[#475569]">{contact.title}</p>}
      {contact.phone && (
        <p className="text-xs text-[#475569] mt-1.5 flex items-center gap-1">
          <Phone className="w-3 h-3" /> {contact.phone}
        </p>
      )}
    </div>
  )
}

function InsuranceCard({ insurance }) {
  return (
    <div className="bg-white rounded-xl border border-[#0F766E]/20 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="w-4 h-4 text-[#0F766E]" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
          Cyber Insurance
        </span>
      </div>
      <p className="text-sm font-bold text-[#0F172A]">{insurance.carrier}</p>
      {insurance.policy_number && (
        <p className="text-xs text-[#475569]">Policy: {insurance.policy_number}</p>
      )}
      {insurance.claims_phone && (
        <p className="text-xs text-[#0F766E] font-semibold mt-1.5 flex items-center gap-1">
          <Phone className="w-3 h-3" /> {insurance.claims_phone}
        </p>
      )}
    </div>
  )
}

function IntroductionView({ user, isPaid, onUpgrade, showUpgrade, setShowUpgrade }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <LifeBuoy className="w-5 h-5 text-[#0F766E]" />
            <span className="text-[#0F766E] text-xs font-medium tracking-wide">
              Incident Response Plan Builder
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4">
            Build your incident response plan
          </h1>
          <p className="text-[#475569] text-lg max-w-2xl leading-relaxed">
            A personalized, step-by-step guide for the moments when everything goes wrong. Built around your team, your systems, and your insurance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <FeatureCard
            icon={Users}
            title="Personalized to your team"
            body="Every step references your actual contacts, phone numbers, and procedures. No generic templates."
          />
          <FeatureCard
            icon={Sparkles}
            title="Usable during a real incident"
            body="Step-by-step guided workflows with real-time action logging. Built for the moment of crisis, not the filing cabinet."
          />
          <FeatureCard
            icon={ShieldAlert}
            title="Insurance-ready documentation"
            body="Timestamped incident logs and tabletop exercise reports that satisfy carrier requirements."
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-1">Ready when you are</h2>
            <p className="text-sm text-[#475569]">About 10 to 15 minutes to complete</p>
          </div>
          {user ? (
            isPaid ? (
              <Link
                href="/tools/ir-plan/builder"
                className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#0E7490] transition-colors shadow-sm"
              >
                Start Building Your Plan <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Button onClick={onUpgrade} className="bg-[#0F766E] hover:bg-[#0E7490]">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Unlock IR Plan Builder
                </span>
              </Button>
            )
          ) : (
            <Link
              href="/tools/cyber-audit/login"
              className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#0E7490] transition-colors shadow-sm"
            >
              Sign in to start <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="mt-10 text-xs text-[#94A3B8] flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-[#0F766E]" />
          Once your plan is saved, Active Incident Mode is always available, even during a subscription gap.
        </div>
      </div>
      <Footer />
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          feature="Incident Response Plan"
          showOneTime="policies"
        />
      )}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-[#F0FDFA] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-[#0F766E]" />
      </div>
      <h3 className="text-base font-bold text-[#0F172A] mb-2">{title}</h3>
      <p className="text-sm text-[#475569] leading-relaxed">{body}</p>
    </div>
  )
}
