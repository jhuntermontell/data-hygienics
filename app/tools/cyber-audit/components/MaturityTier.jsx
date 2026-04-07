"use client"

import { motion } from "framer-motion"

const tiers = [
  { label: "Not in place", weight: 0.0, color: "border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]" },
  { label: "Partially in place", weight: 0.33, color: "border-[#D97706] bg-[#FFFBEB] text-[#D97706]" },
  { label: "Fully in place", weight: 0.67, color: "border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]" },
  { label: "Documented & tested", weight: 1.0, color: "border-[#059669] bg-[#ECFDF5] text-[#059669]" },
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
                : "bg-white border border-[#E2E8F0] text-[#475569] hover:shadow-sm hover:border-[#94A3B8]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= tiers.indexOf(tier) && isSelected
                        ? tier.color.includes("DC2626")
                          ? "bg-[#DC2626]"
                          : tier.color.includes("D97706")
                          ? "bg-[#D97706]"
                          : tier.color.includes("1D4ED8")
                          ? "bg-[#1D4ED8]"
                          : "bg-[#059669]"
                        : "bg-[#E2E8F0]"
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
