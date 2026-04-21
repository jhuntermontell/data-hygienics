"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { getSubscription } from "@/lib/stripe/subscription"
import { BUILDER_STEPS } from "@/lib/ir-plan/builder-questions"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LifeBuoy,
  Plus,
  X,
  Sparkles,
  Shield,
} from "lucide-react"

const COMPANY_KEYS = ["company_name", "industry", "employee_count"]

export default function IrPlanBuilderPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [isPaid, setIsPaid] = useState(true)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }
      setUser(session.user)

      const subData = await getSubscription(session.user.id)
      const paid = subData.access.canAccessIRPlan
      setIsPaid(paid)
      if (!paid) {
        setLoading(false)
        return
      }

      const { data: existing } = await supabase
        .from("ir_plans")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle()

      if (existing) {
        setFormData({
          company: {
            company_name: existing.company_name || "",
            industry: existing.industry || "",
            employee_count: existing.employee_count || "",
          },
          incident_commander: existing.incident_commander || {},
          it_contact: existing.it_contact || {},
          communications_lead: existing.communications_lead || {},
          legal_counsel: existing.legal_counsel || {},
          insurance_info: existing.insurance_info || {},
          critical_systems: {
            systems: existing.critical_systems || [],
            max_downtime: existing.recovery_priorities?.max_downtime || "",
          },
          additional_contacts: { contacts: existing.additional_contacts || [] },
        })
      } else {
        // initialize with empty values
        const init = {}
        BUILDER_STEPS.forEach((s) => {
          if (s.repeatable) init[s.key] = { contacts: [{}] }
          else init[s.key] = {}
        })
        setFormData(init)
      }
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0F766E]/30 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <Shield className="w-12 h-12 text-[#0F766E] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
            Incident Response Plan Builder
          </h1>
          <p className="text-[#475569] mb-6">
            The IR Plan Builder is unlocked by the Documentation Pack or Ongoing Protection.
          </p>
          <Button onClick={() => router.push("/pricing")} className="bg-[#0F766E] hover:bg-[#0E7490]">
            View Plans
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  if (done) {
    return <CompletionView />
  }

  const totalSteps = BUILDER_STEPS.length
  const currentStep = BUILDER_STEPS[stepIdx]
  const stepData = formData[currentStep.key] || {}

  function setStepValue(fieldKey, value) {
    setFormData((prev) => ({
      ...prev,
      [currentStep.key]: { ...(prev[currentStep.key] || {}), [fieldKey]: value },
    }))
  }

  function isFieldVisible(field, data) {
    if (!field.showIf) return true
    return data[field.showIf] === "yes" || data[field.showIf] === true
  }

  function isCurrentStepValid() {
    if (currentStep.optional) return true
    if (currentStep.repeatable) return true
    for (const field of currentStep.fields) {
      if (!field.required) continue
      if (!isFieldVisible(field, stepData)) continue
      const v = stepData[field.key]
      if (field.type === "multiselect") {
        if (!Array.isArray(v) || v.length === 0) return false
      } else if (v === undefined || v === null || v === "") {
        return false
      }
    }
    return true
  }

  async function handleNext() {
    if (stepIdx < totalSteps - 1) {
      setStepIdx(stepIdx + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // finalize
      await handleFinalize()
    }
  }

  function handleBack() {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function handleFinalize() {
    setSaving(true)
    setSaveError(null)
    const supabase = createClient()

    const company = formData.company || {}
    const additional = formData.additional_contacts?.contacts || []
    // Drop entries with no name and no phone. Reject incomplete entries
    // (one but not the other) so we never store half-formed contacts.
    const cleanedAdditional = []
    for (const c of additional) {
      if (!c) continue
      const hasName = !!(c.name && c.name.trim())
      const hasPhone = !!(c.phone && c.phone.trim())
      if (!hasName && !hasPhone) continue
      if (!hasName || !hasPhone) {
        setSaving(false)
        setSaveError(
          "One of your additional contacts is missing a name or phone number. Please complete it or remove it before saving."
        )
        return
      }
      cleanedAdditional.push(c)
    }
    const critical = formData.critical_systems || {}

    // user_id is set server-side from the authenticated session, not from this payload
    const planData = {
      company_name: company.company_name || "",
      industry: company.industry || null,
      employee_count: company.employee_count || null,
      incident_commander: formData.incident_commander || {},
      it_contact: formData.it_contact || {},
      communications_lead: formData.communications_lead || {},
      legal_counsel: formData.legal_counsel || {},
      insurance_info: formData.insurance_info || {},
      additional_contacts: cleanedAdditional,
      critical_systems: critical.systems || [],
      recovery_priorities: { max_downtime: critical.max_downtime || null },
      has_msp: formData.it_contact?.is_msp === "yes",
      msp_info: formData.it_contact?.is_msp === "yes" ? formData.it_contact : {},
      status: "complete",
    }

    let session
    try {
      const sessionRes = await supabase.auth.getSession()
      session = sessionRes.data.session
    } catch {
      session = null
    }
    if (!session) {
      setSaving(false)
      router.push("/tools/cyber-audit/login")
      return
    }

    let res
    try {
      res = await fetch("/api/ir-plan/save-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planData }),
      })
    } catch (err) {
      console.error("Network error saving plan:", err)
      setSaving(false)
      setSaveError("Your changes could not be saved. Please check your internet connection and try again.")
      return
    }

    setSaving(false)
    if (!res.ok) {
      if (res.status === 403) {
        setIsPaid(false)
        return
      }
      const result = await res.json().catch(() => ({}))
      console.error("Failed to save IR plan:", result.error || res.status)
      setSaveError(result.error || "Your changes could not be saved. Please try again.")
      return
    }
    setDone(true)
  }

  // For repeatable steps (additional_contacts), each contact is its own row
  const contacts = formData.additional_contacts?.contacts || [{}]

  function addContact() {
    setFormData((prev) => ({
      ...prev,
      additional_contacts: { contacts: [...(prev.additional_contacts?.contacts || []), {}] },
    }))
  }
  function removeContact(idx) {
    setFormData((prev) => ({
      ...prev,
      additional_contacts: {
        contacts: (prev.additional_contacts?.contacts || []).filter((_, i) => i !== idx),
      },
    }))
  }
  function updateContact(idx, key, val) {
    setFormData((prev) => {
      const list = [...(prev.additional_contacts?.contacts || [])]
      list[idx] = { ...(list[idx] || {}), [key]: val }
      return { ...prev, additional_contacts: { contacts: list } }
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F766E] text-white rounded-xl px-5 py-3 mb-6 flex items-center gap-2"
        >
          <LifeBuoy className="w-4 h-4" />
          <span className="text-sm font-semibold">Incident Response Plan Builder</span>
        </motion.div>

        <button
          onClick={() => router.push("/tools/ir-plan")}
          className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incident Response
        </button>

        {/* Progress bubbles */}
        <div className="mb-8">
          <div className="flex items-center gap-1 mb-2 overflow-x-auto">
            {BUILDER_STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`h-2 flex-1 min-w-[16px] rounded-full transition-colors ${
                  i < stepIdx ? "bg-[#0F766E]" : i === stepIdx ? "bg-[#0F766E]" : "bg-[#E2E8F0]"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>
              Step {stepIdx + 1} of {totalSteps}
            </span>
            <span>{Math.round(((stepIdx + 1) / totalSteps) * 100)}%</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-[#0F172A] mb-1.5">{currentStep.title}</h2>
            <p className="text-sm text-[#0F766E] font-semibold mb-3">{currentStep.subtitle}</p>
            <p className="text-sm text-[#475569] leading-relaxed mb-6">{currentStep.description}</p>

            {currentStep.repeatable ? (
              <div className="space-y-5">
                {contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="border border-[#E2E8F0] rounded-lg p-5 relative"
                  >
                    {contacts.length > 1 && (
                      <button
                        onClick={() => removeContact(idx)}
                        className="absolute top-3 right-3 text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid gap-4">
                      {currentStep.fields.map((field) => (
                        <FieldRenderer
                          key={field.key}
                          field={field}
                          value={contact[field.key]}
                          onChange={(v) => updateContact(idx, field.key, v)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={addContact}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#0E7490]"
                >
                  <Plus className="w-4 h-4" /> Add another contact
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {currentStep.fields.map((field) => {
                  if (!isFieldVisible(field, stepData)) return null
                  return (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={stepData[field.key]}
                      onChange={(v) => setStepValue(field.key, v)}
                    />
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="ghost" onClick={handleBack} disabled={stepIdx === 0}>
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </span>
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepValid() || saving}
            className="bg-[#0F766E] hover:bg-[#0E7490]"
          >
            <span className="flex items-center gap-2">
              {saving
                ? "Saving..."
                : stepIdx === totalSteps - 1
                ? "Finish & Save Plan"
                : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>

        {saveError && (
          <div className="mt-4 rounded-xl border border-[#DC2626]/40 bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {saveError}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

function FieldRenderer({ field, value, onChange }) {
  if (field.type === "yesno") {
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="flex gap-2 mt-1.5">
          {["yes", "no"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold capitalize transition-all ${
                value === opt
                  ? "border-[#0F766E] bg-[#F0FDFA] text-[#0F766E]"
                  : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#94A3B8]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (field.type === "select") {
    return (
      <div>
        <Label>{field.label}</Label>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] mt-1"
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : []
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          {field.options.map((opt) => {
            const isOn = selected.includes(opt.key)
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  const next = isOn
                    ? selected.filter((k) => k !== opt.key)
                    : [...selected, opt.key]
                  onChange(next)
                }}
                className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all ${
                  isOn
                    ? "border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] font-semibold"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#94A3B8]"
                }`}
              >
                {isOn && <Check className="w-3 h-3 inline mr-1.5" />}
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (field.type === "checkbox") {
    return (
      <div>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`flex items-start gap-3 w-full text-left p-4 rounded-lg border transition-all ${
            value
              ? "border-[#0F766E] bg-[#F0FDFA]"
              : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
          }`}
        >
          <div
            className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center mt-0.5 ${
              value ? "bg-[#0F766E] border-[#0F766E]" : "border-[#94A3B8]"
            }`}
          >
            {value && <Check className="w-3 h-3 text-white" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">{field.label}</p>
            {field.hint && <p className="text-xs text-[#475569] mt-1 leading-relaxed">{field.hint}</p>}
          </div>
        </button>
      </div>
    )
  }

  // text, tel, email, date
  return (
    <div>
      <Label htmlFor={field.key}>
        {field.label}
        {!field.required && <span className="text-[#94A3B8] font-normal ml-1.5">(optional)</span>}
      </Label>
      <Input
        id={field.key}
        type={field.type || "text"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="mt-1"
      />
      {field.hint && (
        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{field.hint}</p>
      )}
    </div>
  )
}

function CompletionView() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-10 shadow-sm text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#F0FDFA] flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-[#0F766E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
            Your incident response plan is ready.
          </h1>
          <p className="text-[#475569] text-base mb-8 max-w-lg mx-auto">
            Every playbook now references your team by name and includes the phone numbers your incident commander needs in a crisis.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/tools/ir-plan/view"
              className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0E7490] transition-colors"
            >
              View your plan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools/ir-plan/exercise"
              className="inline-flex items-center gap-2 bg-white text-[#0F766E] text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#0F766E]/30 hover:bg-[#F0FDFA] transition-colors"
            >
              Run a tabletop exercise
            </Link>
            <Link
              href="/tools/ir-plan/view?download=full"
              className="inline-flex items-center gap-2 text-[#475569] text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
            >
              Download printable version
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
