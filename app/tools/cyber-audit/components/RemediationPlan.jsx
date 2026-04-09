"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Search,
  Clock,
  DollarSign,
  ShieldAlert,
} from "lucide-react"

const priorityStyles = {
  critical: {
    bg: "bg-[#DC2626]",
    text: "text-white",
    label: "Critical",
  },
  high: {
    bg: "bg-[#EA580C]",
    text: "text-white",
    label: "High",
  },
  medium: {
    bg: "bg-[#CA8A04]",
    text: "text-white",
    label: "Medium",
  },
  low: {
    bg: "bg-[#64748B]",
    text: "text-white",
    label: "Low",
  },
}

export default function RemediationPlan({ plan }) {
  const [expanded, setExpanded] = useState({})

  if (!plan || plan.length === 0) return null

  return (
    <div className="space-y-3">
      {plan.map((item, i) => {
        const isOpen = !!expanded[item.questionKey]
        const priority = priorityStyles[item.remediation.priority] || priorityStyles.medium
        const isDiscovery = item.isDiscovery

        return (
          <motion.div
            key={item.questionKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.04 }}
            className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden"
          >
            {/* Header - always visible */}
            <button
              type="button"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [item.questionKey]: !prev[item.questionKey] }))
              }
              className="w-full text-left p-5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full ${priority.bg} ${priority.text} tracking-wide uppercase`}
                  >
                    {priority.label}
                  </span>
                  {isDiscovery && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#64748B]">
                      <HelpCircle className="w-3 h-3" />
                      Discovery
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1 leading-snug">
                    {item.section}
                  </h4>
                  <p className="text-[#475569] text-xs leading-relaxed mb-2.5">
                    {item.questionText}
                  </p>
                  <p className="text-[#64748B] text-xs leading-relaxed mb-3 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#CA8A04] shrink-0 mt-0.5" />
                    <span>{item.remediation.insuranceImpact}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.remediation.estimatedEffort}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {item.remediation.estimatedCost}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </div>
              </div>
            </button>

            {/* Body - expanded */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-[#F1F5F9]"
                >
                  <div className="p-5 space-y-5">
                    {isDiscovery && (
                      <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
                        <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                          Before we can recommend a fix
                        </p>
                        <p className="text-[#475569] text-sm leading-relaxed">
                          You need to find out where you stand. Here is how.
                        </p>
                      </div>
                    )}

                    {/* Steps - primary for non-discovery, secondary for discovery */}
                    {!isDiscovery && (
                      <div>
                        <p className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider mb-3">
                          Step by step
                        </p>
                        <ol className="space-y-4">
                          {item.remediation.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3">
                              <div className="shrink-0 w-6 h-6 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold flex items-center justify-center mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[#0F172A] mb-1">
                                  {step.title}
                                </p>
                                <p className="text-[#475569] text-xs leading-relaxed mb-2.5">
                                  {step.detail}
                                </p>
                                {step.verifyStep && (
                                  <div className="rounded-lg bg-[#F0FDF4] border border-[#0F766E]/20 px-3 py-2 flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-[#065F46] leading-relaxed">
                                      <span className="font-semibold">Verify:</span> {step.verifyStep}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Discovery guide - primary for discovery, secondary otherwise */}
                    <div
                      className={`rounded-xl ${isDiscovery ? "bg-[#EFF6FF] border border-[#1D4ED8]/15" : "bg-[#F8FAFC] border border-[#E2E8F0]"} p-4`}
                    >
                      <p className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Search className="w-3 h-3" />
                        Check it yourself
                      </p>
                      <p className="text-[#475569] text-xs leading-relaxed">
                        {item.remediation.discoveryGuide}
                      </p>
                    </div>

                    {/* MSP question */}
                    <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
                      <p className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                        Ask your IT provider
                      </p>
                      <p className="text-[#475569] text-xs leading-relaxed italic">
                        {item.remediation.mspQuestion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
