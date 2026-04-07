"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"

const toolLinks = [
  { href: "/tools/cyber-audit", label: "Cyber Audit" },
  { href: "/controls", label: "Controls Library" },
]

const comingSoon = [
  "Vendor Risk Scorecard",
  "Password Audit Tool",
  "Incident Response Planner",
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    if (!toolsOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setToolsOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [toolsOpen])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.svg" alt="Data Hygienics" className="h-9 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Tools dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              Tools
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
                >
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setToolsOpen(false)}
                      className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-zinc-800 px-4 py-2">
                    <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-1">Coming soon</p>
                    {comingSoon.map((name) => (
                      <p key={name} className="text-xs text-zinc-600 py-1">{name}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/pricing"
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-200"
          >
            Pricing
          </Link>
        </div>

        {/* Desktop CTA */}
        <Link
          href="/tools/cyber-audit/dashboard"
          className="hidden md:inline-flex items-center border border-blue-500 text-blue-400 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-500/10 transition-all duration-200 hover:-translate-y-0.5"
        >
          Sign In
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.06]"
          >
            <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4">
              <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wider">Tools</p>
              {toolLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-300 hover:text-white text-base font-medium py-1 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-zinc-300 hover:text-white text-base font-medium py-1 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/tools/cyber-audit/dashboard"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center border border-blue-500 text-blue-400 text-sm font-bold px-5 py-3 rounded-xl hover:bg-blue-500/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
