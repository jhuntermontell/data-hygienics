"use client"

import { motion } from "framer-motion"

export default function MultipleChoice({ options, value, onChange }) {
  return (
    <div className="grid gap-2.5">
      {options.map((option) => (
        <motion.button
          key={option.label}
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(option.label)}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
            value === option.label
              ? "bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#0F172A]"
              : "bg-white border border-[#E2E8F0] text-[#475569] hover:shadow-sm hover:border-[#94A3B8]"
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  )
}
