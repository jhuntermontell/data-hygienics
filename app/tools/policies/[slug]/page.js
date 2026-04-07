"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { getPolicyBySlug } from "@/lib/policies"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Download,
  Building2,
  User,
  Calendar,
} from "lucide-react"

const PolicyPdf = dynamic(() => import("./PolicyPdf"), { ssr: false })

const STEPS = ["Company Info", "Customize Sections", "Review", "Download"]

export default function PolicyWizardPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [step, setStep] = useState(0)
  const [policyData, setPolicyData] = useState(null)
  const [policyMeta, setPolicyMeta] = useState(null)
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    industry: "",
    ownerName: "",
    ownerTitle: "",
    effectiveDate: new Date().toISOString().slice(0, 10),
    reviewFrequency: "Annual",
  })
  const [selections, setSelections] = useState({})
  const [showPdf, setShowPdf] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/tools/cyber-audit/login")
      return
    }

    const meta = getPolicyBySlug(slug)
    if (!meta) {
      router.push("/tools/policies")
      return
    }
    setPolicyMeta(meta)

    // Dynamic import of policy content
    import(`@/lib/policies/${slug}`)
      .then((mod) => {
        const data = mod.POLICY_DATA
        setPolicyData(data)
        // Set defaults
        const defaults = {}
        data.sections.forEach((section) => {
          const defaultOpt = section.options.find((o) => o.default) || section.options[0]
          defaults[section.id] = defaultOpt.id
        })
        setSelections(defaults)
      })
      .catch(() => {
        router.push("/tools/policies")
      })

    // Pre-fill from profile
    if (profile) {
      setCompanyInfo((prev) => ({
        ...prev,
        companyName: profile.company_name || prev.companyName,
        ownerName: profile.full_name || prev.ownerName,
      }))
    }

    // Load last assessment industry
    async function loadIndustry() {
      const supabase = createClient()
      const { data } = await supabase
        .from("assessments")
        .select("industry")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
      if (data?.[0]?.industry) {
        setCompanyInfo((prev) => ({ ...prev, industry: data[0].industry }))
      }
    }
    loadIndustry()
    setLoading(false)
  }, [slug, user, profile, router])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("generated_policies").upsert(
      {
        user_id: user.id,
        policy_type: slug,
        company_name: companyInfo.companyName,
        policy_data: { companyInfo, selections },
      },
      { onConflict: "user_id,policy_type" }
    )
    setSaving(false)
    setShowPdf(true)
  }

  if (loading || !policyData || !policyMeta) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    )
  }

  const assembledSections = policyData.sections.map((section) => {
    const selectedOpt = section.options.find((o) => o.id === selections[section.id]) || section.options[0]
    return {
      title: section.title,
      text: selectedOpt.text.replace(/\[COMPANY_NAME\]/g, companyInfo.companyName || "[Your Company Name]"),
    }
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/tools/policies")}
            className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Policy Library
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A]">{policyMeta.name}</h1>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i < step
                      ? "bg-[#1D4ED8] text-white"
                      : i === step
                      ? "bg-white border-2 border-[#1D4ED8] text-[#1D4ED8]"
                      : "bg-[#F1F5F9] text-[#94A3B8]"
                  }`}
                >
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1.5 text-center ${i === step ? "text-[#1D4ED8] font-medium" : "text-[#94A3B8]"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 -mt-4 ${i < step ? "bg-[#1D4ED8]/40" : "bg-[#E2E8F0]"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Company Info */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Company Information</h2>
              <div className="grid gap-5">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input id="companyName" value={companyInfo.companyName}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                      placeholder="Acme Corp" className="pl-10" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Policy Owner Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <Input id="ownerName" value={companyInfo.ownerName}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, ownerName: e.target.value })}
                        placeholder="Jane Smith" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ownerTitle">Title</Label>
                    <Input id="ownerTitle" value={companyInfo.ownerTitle}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, ownerTitle: e.target.value })}
                      placeholder="CFO" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <Input id="effectiveDate" type="date" value={companyInfo.effectiveDate}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, effectiveDate: e.target.value })}
                        className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reviewFreq">Review Frequency</Label>
                    <select id="reviewFreq" value={companyInfo.reviewFrequency}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, reviewFrequency: e.target.value })}
                      className="flex h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]">
                      <option>Annual</option>
                      <option>Quarterly</option>
                      <option>As needed</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Section Customization */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {policyData.sections.map((section, si) => (
                <div key={section.id} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-1">
                    Section {si + 1}: {section.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mb-4">Choose the version that best fits your organization</p>
                  <div className="grid gap-2.5">
                    {section.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelections({ ...selections, [section.id]: opt.id })}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                          selections[section.id] === opt.id
                            ? "bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#0F172A]"
                            : "bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8] hover:shadow-sm"
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                        <p className="text-xs mt-1 text-[#94A3B8] line-clamp-2">
                          {opt.text.slice(0, 150).replace(/\[COMPANY_NAME\]/g, companyInfo.companyName || "Your Company")}...
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm"
            >
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">{policyMeta.name}</h2>
              <p className="text-sm text-[#94A3B8] mb-8">
                {companyInfo.companyName} | Effective: {companyInfo.effectiveDate} | Review: {companyInfo.reviewFrequency}
              </p>
              <div className="space-y-8">
                {assembledSections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-[#1D4ED8] mb-2">
                      {i + 1}. {section.title}
                    </h3>
                    <div className="text-sm text-[#475569] leading-[1.8] whitespace-pre-line">
                      {section.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* Signature block */}
              <div className="mt-10 pt-8 border-t border-[#E2E8F0]">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Approval</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Policy Owner</p>
                    <div className="border-b border-[#0F172A] pb-1 text-sm text-[#0F172A]">
                      {companyInfo.ownerName || "________________"}
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1">{companyInfo.ownerTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Date Approved</p>
                    <div className="border-b border-[#0F172A] pb-1 text-sm text-[#0F172A]">
                      {companyInfo.effectiveDate}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Next Review Date</p>
                    <div className="border-b border-[#0F172A] pb-1 text-sm text-[#94A3B8]">
                      {companyInfo.reviewFrequency === "Annual"
                        ? new Date(new Date(companyInfo.effectiveDate).setFullYear(new Date(companyInfo.effectiveDate).getFullYear() + 1)).toISOString().slice(0, 10)
                        : companyInfo.reviewFrequency === "Quarterly"
                        ? new Date(new Date(companyInfo.effectiveDate).setMonth(new Date(companyInfo.effectiveDate).getMonth() + 3)).toISOString().slice(0, 10)
                        : "As needed"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Download */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8 text-[#059669]" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">Policy Ready</h2>
              <p className="text-[#475569] text-sm mb-8 max-w-md mx-auto">
                Your {policyMeta.name} has been generated and saved.
                Download it as a branded PDF document.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowPdf(true)}>
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download PDF
                  </span>
                </Button>
                <Button variant="outline" onClick={() => router.push("/tools/policies")}>
                  Back to Library
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </span>
          </Button>

          {step < 2 && (
            <Button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !companyInfo.companyName}>
              <span className="flex items-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleSave} disabled={saving}>
              <span className="flex items-center gap-2">
                {saving ? "Saving..." : "Finalize & Generate"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          )}
        </div>
      </div>

      {showPdf && (
        <PolicyPdf
          policyName={policyMeta.name}
          companyName={companyInfo.companyName}
          ownerName={companyInfo.ownerName}
          ownerTitle={companyInfo.ownerTitle}
          effectiveDate={companyInfo.effectiveDate}
          reviewFrequency={companyInfo.reviewFrequency}
          sections={assembledSections}
          onClose={() => setShowPdf(false)}
        />
      )}

      <Footer />
    </div>
  )
}
