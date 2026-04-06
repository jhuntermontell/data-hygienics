"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function ProgressBar({ currentStep, completedSections, sections, onNavigate }) {
  const totalSections = sections.length

  return (
    <div className="w-full mb-10">
      {/* Mobile: simple bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
          <span>
            Section {currentStep + 1} of {totalSections}
          </span>
          <span className="text-white font-medium">
            {sections[currentStep]?.title}
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
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
                      ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-400"
                      : isCurrent
                      ? "bg-blue-500/20 border-2 border-blue-500 text-blue-400"
                      : isPast
                      ? "bg-zinc-700 text-zinc-400 cursor-pointer hover:bg-zinc-600"
                      : "bg-zinc-800 text-zinc-600 cursor-default"
                  }`}
                >
                  {isComplete ? <Check className="w-3 h-3" /> : i + 1}
                </button>
                <span
                  className={`text-[9px] mt-1.5 text-center leading-tight max-w-16 ${
                    isCurrent
                      ? "text-blue-400 font-semibold"
                      : "text-zinc-600"
                  }`}
                >
                  {section.title}
                </span>
              </div>
              {i < totalSections - 1 && (
                <div
                  className={`h-px w-full min-w-2 -mt-5 ${
                    i < currentStep ? "bg-blue-500/40" : "bg-zinc-800"
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
