"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function ProgressBar({ currentStep, completedSections, sections, onNavigate }) {
  const totalSections = sections.length

  return (
    <div className="w-full mb-10">
      {/* Mobile: simple bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-xs text-[#475569] mb-2">
          <span>
            Section {currentStep + 1} of {totalSections}
          </span>
          <span className="text-[#0F172A] font-medium">
            {sections[currentStep]?.title}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#1D4ED8] rounded-full"
            initial={false}
            animate={{
              width: `${((currentStep + 1) / totalSections) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Desktop: step indicators - scrollable if many sections */}
      <div className="hidden md:flex items-center gap-1 overflow-x-auto pb-2">
        {sections.map((section, i) => {
          const isComplete = completedSections.has(i)
          const isCurrent = i === currentStep
          const isPast = i < currentStep

          return (
            <div key={section.id || section.key} className="flex items-center gap-1 shrink-0" style={{ flex: `1 1 ${100 / totalSections}%` }}>
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => (isComplete || isPast) && onNavigate?.(i)}
                  disabled={!isComplete && !isPast}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    isComplete
                      ? "bg-[#1D4ED8] text-white cursor-pointer hover:bg-[#1D4ED8]/90"
                      : isCurrent
                      ? "bg-white border-2 border-[#1D4ED8] text-[#1D4ED8]"
                      : isPast
                      ? "bg-[#F1F5F9] text-[#475569] cursor-pointer hover:bg-[#E2E8F0]"
                      : "bg-[#F1F5F9] text-[#94A3B8] cursor-default"
                  }`}
                >
                  {isComplete ? <Check className="w-3 h-3" /> : i + 1}
                </button>
                <span
                  className={`text-[9px] mt-1.5 text-center leading-tight max-w-16 ${
                    isCurrent
                      ? "text-[#1D4ED8] font-semibold"
                      : "text-[#94A3B8]"
                  }`}
                >
                  {section.title}
                </span>
              </div>
              {i < totalSections - 1 && (
                <div
                  className={`h-px w-full min-w-2 -mt-5 ${
                    i < currentStep ? "bg-[#1D4ED8]/40" : "bg-[#E2E8F0]"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
