"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/client"
import { getPolicyBySlug, FREE_POLICY_SLUGS } from "@/lib/policies"
import { getSubscription } from "@/lib/stripe/subscription"
import { STARTER_POLICY_LIMIT } from "@/lib/stripe/access"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import UpgradeModal from "@/app/tools/cyber-audit/components/UpgradeModal"
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
  Info,
  X,
  Lock,
} from "lucide-react"

const PolicyPdf = dynamic(() => import("./PolicyPdf"), { ssr: false })

const STEPS = ["Company Info", "Customize Sections", "Review", "Download"]

const TIER_TOOLTIP = `Simplified: Shorter, plain-English language. Good for very small teams or organizations just getting started with formal policies.

Standard: The recommended baseline. Matches what most cyber insurance underwriters expect to see. Appropriate for most small and mid-sized businesses.

Comprehensive: Enterprise-grade language with detailed procedures and accountability structures. Best for regulated industries or organizations with dedicated compliance staff.`

export default function PolicyWizardPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [step, setStep] = useState(0)
  const [sectionIdx, setSectionIdx] = useState(0)
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
  const [showTooltip, setShowTooltip] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [dateError, setDateError] = useState("")
  const [accessBlocked, setAccessBlocked] = useState(false)
  // True when the subscription fetch failed at load time. We render a
  // retry screen instead of the wizard so paid policy content is never
  // exposed to a user whose entitlement has not been positively verified.
  const [entitlementUnknown, setEntitlementUnknown] = useState(false)
  // True when a client-side Supabase lookup used during the Starter
  // entitlement check errored. Treated the same as entitlementUnknown:
  // show the retry screen instead of rendering the wizard.
  const [entitlementCheckFailed, setEntitlementCheckFailed] = useState(false)
  const [refreshingEntitlement, setRefreshingEntitlement] = useState(false)
  // Synchronous guard so rapid clicks on "Finalize & Generate" don't fire
  // two save requests before setSaving takes effect.
  const saveInFlightRef = useRef(false)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }
      setUser(session.user)

      const meta = getPolicyBySlug(slug)
      if (!meta) {
        router.push("/tools/policies")
        return
      }
      setPolicyMeta(meta)

      // Entitlement check: does this user actually have access to this
      // specific policy? We defer to the same logic the hub uses, so
      // bundle / individual / Starter limit / Professional all work.
      const subData = await getSubscription(session.user.id)

      if (subData.entitlementUnknown) {
        // Fetch failed. Do NOT render paid policy content as a fallback.
        // Show a retry screen instead. The user can click Try Again to
        // re-run getSubscription with skipCache.
        setEntitlementUnknown(true)
        setLoading(false)
        return
      }

      const plan = subData.plan || "free"
      // Merged access: covers Ongoing Protection / Agency / Documentation
      // Pack / legacy Professional / legacy MSP / legacy Policy Bundle in
      // a single boolean. Starter's 2-policy cap is evaluated separately
      // below since it is the only remaining per-slug entitlement.
      const hasFullLibrary = subData.access.canAccessPolicies
      const isStarter = plan === "starter"
      const isFreePolicy = FREE_POLICY_SLUGS.includes(slug)
      const hasIndividual = (subData.purchases || []).some(
        (p) =>
          p.purchase_type === "individual_policy" &&
          p.metadata?.policy_slug === slug
      )

      let canAccess = false
      if (isFreePolicy) {
        canAccess = true
      } else if (hasFullLibrary || hasIndividual) {
        canAccess = true
      } else if (isStarter) {
        // Editing an existing policy is always allowed; a new policy is
        // allowed only if the user is under their 2-policy quota. Only
        // non-free policies count toward the Starter limit (matches the
        // server save route).
        const { data: existingRow, error: existingError } = await supabase
          .from("generated_policies")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("policy_type", slug)
          .maybeSingle()

        if (existingError) {
          console.error(
            "Policy entitlement check failed (existing lookup):",
            existingError
          )
          setEntitlementCheckFailed(true)
          setLoading(false)
          return
        }

        if (existingRow) {
          canAccess = true
        } else {
          let countQuery = supabase
            .from("generated_policies")
            .select("*", { count: "exact", head: true })
            .eq("user_id", session.user.id)
          if (FREE_POLICY_SLUGS.length > 0) {
            countQuery = countQuery.not(
              "policy_type",
              "in",
              `(${FREE_POLICY_SLUGS.map((s) => `"${s}"`).join(",")})`
            )
          }
          const { count, error: countError } = await countQuery
          if (countError) {
            console.error(
              "Policy entitlement check failed (count):",
              countError
            )
            setEntitlementCheckFailed(true)
            setLoading(false)
            return
          }
          if ((count || 0) < STARTER_POLICY_LIMIT) {
            canAccess = true
          }
        }
      }

      if (!canAccess) {
        setAccessBlocked(true)
        setLoading(false)
        return
      }

      try {
        const mod = await import(`@/lib/policies/${slug}`)
        const data = mod.POLICY_DATA
        setPolicyData(data)
        const defaults = {}
        data.sections.forEach((section) => {
          // Default to "standard" option
          const standardOpt = section.options.find((o) => o.id === "standard" || o.label === "Standard")
          const defaultOpt = standardOpt || section.options.find((o) => o.default) || section.options[0]
          defaults[section.id] = defaultOpt.id
        })
        setSelections(defaults)
      } catch {
        router.push("/tools/policies")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).maybeSingle()
      setProfile(profileData)
      if (profileData) {
        setCompanyInfo((prev) => ({
          ...prev,
          companyName: profileData.company_name || prev.companyName,
          ownerName: profileData.full_name || prev.ownerName,
        }))
      }

      const { data: assessments } = await supabase
        .from("assessments").select("industry")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false }).limit(1)
      if (assessments?.[0]?.industry) {
        setCompanyInfo((prev) => ({ ...prev, industry: assessments[0].industry }))
      }

      // Hydrate from existing generated policy so editing doesn't wipe
      // previous selections. The wizard's default state is overwritten
      // with whatever was last saved.
      const { data: existingPolicy } = await supabase
        .from("generated_policies")
        .select("policy_data")
        .eq("user_id", session.user.id)
        .eq("policy_type", slug)
        .maybeSingle()
      if (existingPolicy?.policy_data) {
        const saved = existingPolicy.policy_data
        if (saved.companyInfo) {
          setCompanyInfo((prev) => ({ ...prev, ...saved.companyInfo }))
        }
        if (saved.selections && typeof saved.selections === "object") {
          setSelections((prev) => ({ ...prev, ...saved.selections }))
        }
      }

      setLoading(false)
    }
    init()
  }, [slug, router])

  const handleSave = async () => {
    if (saveInFlightRef.current) return
    saveInFlightRef.current = true
    setSaving(true)
    setSaveError(null)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const res = await fetch("/api/policies/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          policySlug: slug,
          policyData: selections,
          companyInfo,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (res.status === 403) {
          setSaveError(
            body.error ||
              "You do not have access to save this policy. Please upgrade your plan."
          )
        } else if (res.status === 500) {
          setSaveError(
            body.error ||
              "Could not verify your access. Please try again in a moment."
          )
        } else {
          setSaveError(body.error || "Could not save policy. Please try again.")
        }
        return
      }
      setShowPdf(true)
    } catch (err) {
      console.error("Policy save error:", err)
      setSaveError("Could not save policy. Please try again.")
    } finally {
      setSaving(false)
      saveInFlightRef.current = false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    )
  }

  async function retryEntitlement() {
    setRefreshingEntitlement(true)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }
      // Clear any cached subscription so the retry does a fresh network
      // read for both the subscription fetch and the Starter count.
      const subData = await getSubscription(session.user.id, { skipCache: true })
      if (subData.entitlementUnknown) {
        // Still can't reach Supabase; keep the retry screen.
        setRefreshingEntitlement(false)
        return
      }
      // Fetch succeeded. Clear both flags and re-run init by reloading,
      // simpler than re-implementing the full init flow and still fast
      // because getSubscription is now cached.
      setEntitlementUnknown(false)
      setEntitlementCheckFailed(false)
      window.location.reload()
    } catch {
      setRefreshingEntitlement(false)
    }
  }

  if (entitlementUnknown || entitlementCheckFailed) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
            Unable to verify your subscription
          </h1>
          <p className="text-[#475569] mb-6 max-w-md mx-auto">
            We could not check your access to this policy. This is usually temporary.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={retryEntitlement} disabled={refreshingEntitlement}>
              {refreshingEntitlement ? "Checking..." : "Try Again"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/tools/policies")}>
              Back to Policy Library
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (accessBlocked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <Lock className="w-12 h-12 text-[#1D4ED8] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
            This policy requires an upgrade
          </h1>
          <p className="text-[#475569] mb-6 max-w-md mx-auto">
            You don&apos;t currently have access to this policy. The
            Documentation Pack ($299, one-time) unlocks all 9 policies along
            with the full assessment and incident response plan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push("/tools/policies")}>Back to Policy Library</Button>
            <Button variant="outline" onClick={() => router.push("/pricing")}>
              View Plans
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!policyData || !policyMeta) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    )
  }

  const totalSections = policyData.sections.length
  const currentSection = policyData.sections[sectionIdx]

  const assembledSections = policyData.sections.map((section) => {
    const selectedOpt = section.options.find((o) => o.id === selections[section.id]) || section.options[0]
    return {
      title: section.title,
      text: selectedOpt.text.replace(/\[COMPANY_NAME\]/g, companyInfo.companyName || "[Your Company Name]"),
    }
  })

  function isEffectiveDateValid() {
    if (!companyInfo.effectiveDate) return false
    const d = new Date(companyInfo.effectiveDate)
    return !Number.isNaN(d.getTime())
  }

  function handleNext() {
    if (step === 0) {
      // Block progression out of the company info step until the
      // effective date is a real date. The existing <input type="date">
      // normally prevents bad values, but a manually cleared or
      // malformed field would otherwise crash the PDF date formatter.
      if (!isEffectiveDateValid()) {
        setDateError("Please enter a valid effective date before continuing.")
        return
      }
      if (!companyInfo.companyName || !companyInfo.companyName.trim()) {
        setDateError("Please enter your company name before continuing.")
        return
      }
      setDateError("")
      setStep(1)
      setSectionIdx(0)
    } else if (step === 1) {
      if (sectionIdx < totalSections - 1) {
        setSectionIdx(sectionIdx + 1)
      } else {
        setStep(2)
      }
    }
  }

  function handleBack() {
    if (step === 1 && sectionIdx > 0) {
      setSectionIdx(sectionIdx - 1)
    } else if (step === 1 && sectionIdx === 0) {
      setStep(0)
    } else if (step > 0) {
      setStep(step - 1)
      if (step === 2) setSectionIdx(totalSections - 1)
    }
  }

  // Overall progress for the progress bar
  const totalSteps = 1 + totalSections + 1 + 1 // company + sections + review + download
  let currentProgress = 0
  if (step === 0) currentProgress = 0
  else if (step === 1) currentProgress = 1 + sectionIdx
  else if (step === 2) currentProgress = 1 + totalSections
  else currentProgress = totalSteps

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push("/tools/policies")}
            className="flex items-center gap-1.5 text-[#475569] text-sm hover:text-[#0F172A] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Policy Library
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A]">{policyMeta.name}</h1>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#94A3B8]">
              {step === 0 && "Company Info"}
              {step === 1 && `Section ${sectionIdx + 1} of ${totalSections}`}
              {step === 2 && "Review"}
              {step === 3 && "Download"}
            </span>
            <span className="text-xs text-[#94A3B8]">
              {Math.round((currentProgress / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1D4ED8] rounded-full transition-all duration-300"
              style={{ width: `${(currentProgress / totalSteps) * 100}%` }}
            />
          </div>
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

          {/* Step 1: One section per page */}
          {step === 1 && currentSection && (
            <motion.div
              key={`section-${sectionIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Section {sectionIdx + 1} of {totalSections}: {currentSection.title}
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="w-7 h-7 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] hover:text-[#475569] transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#E2E8F0] shadow-lg p-5 z-20">
                      <button
                        onClick={() => setShowTooltip(false)}
                        className="absolute top-3 right-3 text-[#94A3B8] hover:text-[#475569]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line">{TIER_TOOLTIP}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {currentSection.options.map((opt) => {
                  const isSelected = selections[currentSection.id] === opt.id
                  const displayText = opt.text.replace(/\[COMPANY_NAME\]/g, companyInfo.companyName || "Your Company")

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelections({ ...selections, [currentSection.id]: opt.id })}
                      className={`w-full text-left rounded-xl border transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "border-[#1D4ED8] bg-[#EFF6FF]/40 border-l-4"
                          : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm font-semibold ${isSelected ? "text-[#1D4ED8]" : "text-[#0F172A]"}`}>
                            {opt.label}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-[#475569] leading-relaxed whitespace-pre-line">
                          {displayText}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
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

        {/* Inline error messages */}
        {(dateError || saveError) && (
          <div className="mt-4 rounded-xl border border-[#DC2626]/40 bg-[#FEF2F2] px-4 py-3">
            <p className="text-sm text-[#B91C1C]">{saveError || dateError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </span>
          </Button>

          {step < 2 && (
            <Button
              onClick={handleNext}
              disabled={
                step === 0 &&
                (!companyInfo.companyName || !isEffectiveDateValid())
              }
            >
              <span className="flex items-center gap-2">
                {step === 1 && sectionIdx < totalSections - 1 ? "Continue" : "Next"} <ArrowRight className="w-4 h-4" />
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
          onError={() => {
            setShowPdf(false)
            setSaveError(
              "Policy document could not be generated. Please try again."
            )
          }}
        />
      )}

      <Footer />
    </div>
  )
}
