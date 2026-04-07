"use client"

import { motion } from "framer-motion"

const frequencyColors = {
  1.0: "bg-[#ECFDF5] border-[#059669] text-[#059669]",
  0.8: "bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8]",
  0.6: "bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8]",
  0.4: "bg-[#FFFBEB] border-[#D97706] text-[#D97706]",
  0.2: "bg-[#FFFBEB] border-[#D97706] text-[#D97706]",
  0.0: "bg-[#FEF2F2] border-[#DC2626] text-[#DC2626]",
}

function getColorClass(weight) {
  if (weight >= 0.8) return frequencyColors[1.0]
  if (weight >= 0.6) return frequencyColors[0.6]
  if (weight >= 0.4) return frequencyColors[0.4]
  if (weight >= 0.2) return frequencyColors[0.2]
  return frequencyColors[0.0]
}

export default function FrequencySelect({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
      {options.map((option) => {
        const isSelected = value === option.label
        return (
          <motion.button
            key={option.label}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(option.label)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-center ${
              isSelected
                ? `${getColorClass(option.weight)} border-2`
                : "bg-white border border-[#E2E8F0] text-[#475569] hover:shadow-sm hover:border-[#94A3B8]"
            }`}
          >
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}
