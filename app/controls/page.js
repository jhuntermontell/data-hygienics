"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Input } from "@/components/ui/input"
import { CONTROLS } from "@/lib/controls"
import { Search, Shield, ArrowRight, Info } from "lucide-react"

const NIST_FUNCTIONS = ["Identify", "Protect", "Detect", "Respond", "Recover"]

const functionColors = {
  Identify: "bg-violet-50 text-violet-700 border-violet-200",
  Protect: "bg-[#EFF6FF] text-[#1D4ED8] border-blue-200",
  Detect: "bg-amber-50 text-amber-700 border-amber-200",
  Respond: "bg-orange-50 text-orange-700 border-orange-200",
  Recover: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const explainers = [
  {
    title: "What is a cybersecurity control?",
    body: "A cybersecurity control is any practice, process, or technology that reduces your risk of a breach. Think of controls as the locks, alarms, and habits that protect your business. Some are technical (like requiring strong passwords). Some are procedural (like having an incident response plan). Together, they form your security posture.",
  },
  {
    title: "What is NIST CSF?",
    body: "The NIST Cybersecurity Framework is a set of best practices developed by the U.S. National Institute of Standards and Technology. It organizes security into five functions: Identify, Protect, Detect, Respond, and Recover. It\u2019s the most widely recognized framework in the U.S. and is what most cyber insurance underwriters reference when evaluating your coverage.",
  },
  {
    title: "What is CIS Controls?",
    body: "The CIS Controls (formerly CIS Top 18) are a prioritized list of actions developed by the Center for Internet Security. They\u2019re more prescriptive than NIST \u2014 they tell you not just what to do but in what order. CIS Control 1 (know what devices you have) comes before CIS Control 6 (manage user access) because you can\u2019t secure what you haven\u2019t inventoried.",
  },
]

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
              Free Resource
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight mb-4">
            The Cybersecurity
            <br />
            Controls Library
          </h1>
          <p className="text-[#475569] text-base max-w-xl">
            Every security control explained in plain English: what it is, why it matters, and what insurance providers look for.
          </p>
        </motion.div>

        {/* Explainer boxes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {explainers.map((e) => (
            <div key={e.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <h3 className="text-sm font-semibold text-[#0F172A]">{e.title}</h3>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">{e.body}</p>
            </div>
          ))}
        </motion.div>

        {/* Free forever banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-[#059669]/20 bg-[#ECFDF5] p-5 mb-8"
        >
          <p className="text-[#059669] text-sm font-medium text-center">
            Feel free to explore. Every control, every explanation, every industry note is free. No account required.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
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
                onClick={() => setFilterFunction(filterFunction === fn ? null : fn)}
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
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${functionColors[control.nistFunction]}`}>
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
