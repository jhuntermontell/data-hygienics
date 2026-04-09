"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, LayoutDashboard, FileText, ShieldCheck, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { clearSubscriptionCache } from "@/lib/stripe/subscription"

const toolLinks = [
  { href: "/tools/cyber-audit", label: "Cyber Audit" },
  { href: "/tools/policies", label: "Policy Library" },
  { href: "/vendors", label: "Vendor Scorecards" },
  { href: "/controls", label: "Controls Library" },
  { href: "/threats", label: "Threat Library" },
]

const comingSoon = [
  "Incident Response Planner",
]

export default function Navbar() {
  const supabase = createClient()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)
  const toolsRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setReady(true)
      if (s?.user) loadProfile(s.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setReady(true)
      if (s?.user) loadProfile(s.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle()
    setProfile(data)
    // If no name exists, show the name modal
    if (!data?.full_name) {
      setShowNameModal(true)
    }
  }

  async function saveFirstName() {
    if (!nameInput.trim() || !session?.user) return
    setSavingName(true)
    await supabase.from("profiles").upsert({
      id: session.user.id,
      full_name: nameInput.trim(),
    }, { onConflict: "id" })
    setProfile({ full_name: nameInput.trim() })
    setShowNameModal(false)
    setSavingName(false)
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSignOut = async () => {
    setUserOpen(false)
    setMobileOpen(false)
    clearSubscriptionCache()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const user = session?.user
  let firstName = null
  if (profile?.full_name) firstName = profile.full_name.split(" ")[0]
  else if (user?.user_metadata?.full_name) firstName = user.user_metadata.full_name.split(" ")[0]

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
          scrolled ? "shadow-[0_1px_3px_0_rgb(0_0_0/0.06)] border-b border-[#E2E8F0]" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Data Hygienics" className="h-8 w-auto" />
          </Link>

          {/* Desktop center nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 text-[#475569] hover:text-[#0F172A] text-sm font-medium transition-colors duration-150 cursor-pointer"
              >
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full mt-2 left-0 w-56 rounded-lg bg-white border border-[#E2E8F0] shadow-lg overflow-hidden"
                  >
                    {toolLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => setToolsOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t border-[#F1F5F9] px-4 py-2">
                      <p className="text-[10px] text-[#94A3B8] font-medium tracking-wider mb-1">Coming soon</p>
                      {comingSoon.map((name) => (
                        <p key={name} className="text-xs text-[#94A3B8] py-0.5">{name}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="text-[#475569] hover:text-[#0F172A] text-sm font-medium transition-colors duration-150">
              About
            </Link>
          </div>

          {/* Desktop right: auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {!ready ? (
              <div className="w-20 h-9" />
            ) : user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-1.5 text-[#475569] hover:text-[#0F172A] text-sm font-medium transition-colors duration-150 cursor-pointer px-3 py-2 rounded-lg hover:bg-[#F8FAFC]"
                >
                  Hi, {firstName || "there"}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${userOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full mt-2 right-0 w-52 rounded-lg bg-white border border-[#E2E8F0] shadow-lg overflow-hidden"
                    >
                      <Link href="/tools/cyber-audit/dashboard" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/tools/cyber-audit/results" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors">
                        <FileText className="w-4 h-4" /> My Assessments
                      </Link>
                      <Link href="/tools/policies" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors">
                        <ShieldCheck className="w-4 h-4" /> My Policies
                      </Link>
                      <div className="border-t border-[#F1F5F9]" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/tools/cyber-audit/login"
                  className="text-[#475569] hover:text-[#0F172A] text-sm font-medium px-4 py-2 transition-colors duration-150">
                  Sign in
                </Link>
                <Link href="/tools/cyber-audit"
                  className="inline-flex items-center bg-[#1D4ED8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1E40AF] transition-colors duration-150 shadow-sm">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#475569] hover:text-[#0F172A] transition-colors p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white border-b border-[#E2E8F0]"
            >
              <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3">
                <p className="text-[#94A3B8] text-xs font-medium tracking-wider">Tools</p>
                {toolLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="text-[#475569] hover:text-[#0F172A] text-base font-medium py-1 transition-colors">
                    {link.label}
                  </Link>
                ))}
                <Link href="/about" onClick={() => setMobileOpen(false)}
                  className="text-[#475569] hover:text-[#0F172A] text-base font-medium py-1 transition-colors">
                  About
                </Link>
                {user ? (
                  <div className="border-t border-[#F1F5F9] mt-2 pt-3">
                    <p className="text-[#0F172A] text-sm font-medium mb-2">Hi, {firstName || "there"}</p>
                    <Link href="/tools/cyber-audit/dashboard" onClick={() => setMobileOpen(false)} className="block text-[#475569] text-sm py-1.5">Dashboard</Link>
                    <Link href="/tools/cyber-audit/results" onClick={() => setMobileOpen(false)} className="block text-[#475569] text-sm py-1.5">My Assessments</Link>
                    <Link href="/tools/policies" onClick={() => setMobileOpen(false)} className="block text-[#475569] text-sm py-1.5">My Policies</Link>
                    <button onClick={handleSignOut} className="text-[#DC2626] text-sm py-1.5 cursor-pointer">Sign out</button>
                  </div>
                ) : (
                  <div className="flex gap-3 mt-3">
                    <Link href="/tools/cyber-audit/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center border border-[#E2E8F0] text-[#475569] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                      Sign in
                    </Link>
                    <Link href="/tools/cyber-audit" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1E40AF] transition-colors">
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Name modal */}
      <AnimatePresence>
        {showNameModal && user && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowNameModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-8"
            >
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">What should we call you?</h3>
              <p className="text-sm text-[#475569] mb-5">Just your first name is fine.</p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="First name"
                autoFocus
                className="w-full h-11 rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] mb-4"
                onKeyDown={(e) => e.key === "Enter" && saveFirstName()}
              />
              <button
                onClick={saveFirstName}
                disabled={!nameInput.trim() || savingName}
                className="w-full bg-[#1D4ED8] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#1E40AF] transition-colors disabled:opacity-50"
              >
                {savingName ? "Saving..." : "Save"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
