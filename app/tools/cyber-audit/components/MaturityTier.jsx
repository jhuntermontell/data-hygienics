"use client"

import { motion } from "framer-motion"

const tiers = [
  { label: "Not in place", weight: 0.0, color: "border-red-500 bg-red-500/15 text-red-400" },
  { label: "Partially in place", weight: 0.33, color: "border-yellow-500 bg-yellow-500/15 text-yellow-400" },
  { label: "Fully in place", weight: 0.67, color: "border-blue-500 bg-blue-500/15 text-blue-400" },
  { label: "Documented & tested", weight: 1.0, color: "border-emerald-500 bg-emerald-500/15 text-emerald-400" },
]

export default function MaturityTier({ value, onChange }) {
  return (
    <div className="grid gap-2.5">
      {tiers.map((tier) => {
        const isSelected = value === tier.label
        return (
          <motion.button
            key={tier.label}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(tier.label)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              isSelected
                ? `${tier.color} border-2`
                : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= tiers.indexOf(tier) && isSelected
                        ? tier.color.includes("red")
                          ? "bg-red-400"
                          : tier.color.includes("yellow")
                          ? "bg-yellow-400"
                          : tier.color.includes("blue")
                          ? "bg-blue-400"
                          : "bg-emerald-400"
                        : "bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
              {tier.label}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
