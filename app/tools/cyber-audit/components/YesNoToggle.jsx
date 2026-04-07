"use client"

import { motion } from "framer-motion"

export default function YesNoToggle({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {["yes", "no"].map((option) => (
        <motion.button
          key={option}
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(option)}
          className={`flex-1 h-11 rounded-xl font-bold text-sm capitalize transition-all duration-200 cursor-pointer ${
            value === option
              ? option === "yes"
                ? "bg-[#1D4ED8] text-white shadow-[0_4px_20px_rgba(29,78,216,0.2)]"
                : "bg-[#475569] text-white"
              : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#94A3B8]"
          }`}
        >
          {option}
        </motion.button>
      ))}
    </div>
  )
}
