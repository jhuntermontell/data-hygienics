"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, User, Mail, Building2 } from "lucide-react"

const QUICK_LEAD_KEY = "dh_quick_lead"

export default function QuickLeadCapturePage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !companyName.trim() || !email.trim()) return
    setSubmitting(true)
    const lead = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      startedAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem(QUICK_LEAD_KEY, JSON.stringify(lead))
    } catch {}
    router.push("/tools/cyber-audit/quick/assessment")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Quick assessment indicator banner */}
      <div className="pt-16">
        <div className="bg-[#1D4ED8]">
          <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-semibold tracking-wide uppercase">
              Quick Security Check &nbsp;&middot;&nbsp; 12 Questions
            </span>
          </div>
        </div>
      </div>

      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-[1.15] mb-4">
              See where your business stands in 5 minutes
            </h1>
            <p className="text-[#475569] text-base leading-relaxed">
              Answer 12 questions. Get your cybersecurity score. No sales pitch, no jargon, no strings attached.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companyName">Company name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Corp"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                <span className="flex items-center justify-center gap-2">
                  Start My Assessment
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </form>
          </div>

          <p className="text-[#94A3B8] text-xs text-center mt-5 leading-relaxed px-4">
            Your privacy matters to us. We will never email you unless you ask us to. Your information is used only to personalize your results.
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
