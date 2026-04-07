"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Input } from "@/components/ui/input"
import { CONTROLS } from "@/lib/controls"
import { Search, Shield, ArrowRight } from "lucide-react"

const NIST_FUNCTIONS = ["Identify", "Protect", "Detect", "Respond", "Recover"]

const functionColors = {
  Identify: "bg-violet-50 text-violet-700 border-violet-200",
  Protect: "bg-[#EFF6FF] text-[#1D4ED8] border-blue-200",
  Detect: "bg-amber-50 text-amber-700 border-amber-200",
  Respond: "bg-orange-50 text-orange-700 border-orange-200",
  Recover: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function ControlsIndexPage() {
  const [search, setSearch] = useState("")
  const [filterFunction, setFilterFunction] = useState(null)

  const filtered = useMemo(() => {
    let results = CONTROLS
    if (filterFunction) {
      results = results.filter((c) => c.nistFunction === filterFunction)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nistFunction.toLowerCase().includes(q) ||
          c.nistCategory.toLowerCase().includes(q) ||
          c.cisControlName.toLowerCase().includes(q) ||
          String(c.cisControl).includes(q)
      )
    }
    return results
  }, [search, filterFunction])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#1D4ED8]" />
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
              Security Controls
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight mb-4">
            Security Control
            <br />
            Reference Guide
          </h1>
          <p className="text-[#475569] text-base max-w-xl">
            Plain English explanations of cybersecurity controls, mapped to NIST
            CSF and CIS frameworks. Understand what each control means and why
            insurers care about it.
          </p>
        </motion.div>

        {/* Free forever banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-[#059669]/20 bg-[#ECFDF5] p-5 mb-8"
        >
          <p className="text-[#059669] text-sm font-medium text-center">
            Free forever. No account required. Because everyone deserves to understand their security.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search controls by name, framework, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterFunction(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !filterFunction
                  ? "bg-[#1D4ED8] text-white"
                  : "bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#0F172A]"
              }`}
            >
              All
            </button>
            {NIST_FUNCTIONS.map((fn) => (
              <button
                key={fn}
                onClick={() =>
                  setFilterFunction(filterFunction === fn ? null : fn)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterFunction === fn
                    ? "bg-[#1D4ED8] text-white"
                    : "bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#0F172A]"
                }`}
              >
                {fn}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-[#94A3B8] text-xs mb-4">
          {filtered.length} control{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Controls grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          key={`${search}-${filterFunction}`}
          className="grid md:grid-cols-2 gap-4"
        >
          {filtered.map((control) => (
            <motion.div key={control.slug} variants={item}>
              <Link
                href={`/controls/${control.slug}`}
                className="block rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors leading-snug flex-1">
                    {control.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D4ED8] transition-colors shrink-0 mt-0.5 ml-2" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      functionColors[control.nistFunction]
                    }`}
                  >
                    {control.nistFunction}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                    {control.nistCategory}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                    CIS {control.cisControl}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#475569]">No controls match your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
