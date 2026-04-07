"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, LayoutDashboard, FileText, ShieldCheck, LogOut } from "lucide-react"
import { useAuth } from "@/lib/supabase/auth-context"
import { createClient } from "@/lib/supabase/client"

const toolLinks = [
  { href: "/tools/cyber-audit", label: "Cyber Audit" },
  { href: "/tools/policies", label: "Policy Library" },
  { href: "/controls", label: "Controls Library" },
]

const comingSoon = [
  "Vendor Risk Scorecard",
  "Password Audit Tool",
  "Incident Response Planner",
]

function getFirstName(profile, user) {
  if (profile?.full_name) return profile.full_name.split(" ")[0]
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name.split(" ")[0]
  const email = user?.email || ""
  const local = email.split("@")[0] || ""
  const name = local.replace(/[._-]/g, " ").split(" ")[0]
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function Navbar() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const toolsRef = useRef(null)
  const userRef = useRef(null)

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
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const firstName = user ? getFirstName(profile, user) : null

  return (
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

          <Link href="/pricing" className="text-[#475569] hover:text-[#0F172A] text-sm font-medium transition-colors duration-150">
            Pricing
          </Link>
        </div>

        {/* Desktop right: auth-aware */}
        <div className="hidden md:flex items-center gap-3">
          {authLoading ? (
            <div className="w-20 h-9" />
          ) : user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-1.5 text-[#475569] hover:text-[#0F172A] text-sm font-medium transition-colors duration-150 cursor-pointer px-3 py-2 rounded-lg hover:bg-[#F8FAFC]"
              >
                Hi, {firstName}
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
                      <FileText className="w-4 h-4" /> My Reports
                    </Link>
                    <Link href="/controls" onClick={() => setUserOpen(false)}
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
              <Link href="/pricing" onClick={() => setMobileOpen(false)}
                className="text-[#475569] hover:text-[#0F172A] text-base font-medium py-1 transition-colors">
                Pricing
              </Link>
              {user ? (
                <>
                  <div className="border-t border-[#F1F5F9] mt-2 pt-3">
                    <p className="text-[#0F172A] text-sm font-medium mb-2">Hi, {firstName}</p>
                    <Link href="/tools/cyber-audit/dashboard" onClick={() => setMobileOpen(false)}
                      className="block text-[#475569] text-sm py-1.5">Dashboard</Link>
                    <Link href="/tools/cyber-audit/results" onClick={() => setMobileOpen(false)}
                      className="block text-[#475569] text-sm py-1.5">My Reports</Link>
                    <button onClick={() => { setMobileOpen(false); handleSignOut() }}
                      className="text-[#DC2626] text-sm py-1.5 cursor-pointer">Sign out</button>
                  </div>
                </>
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
  )
}
