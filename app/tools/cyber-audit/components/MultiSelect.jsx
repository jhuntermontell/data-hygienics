"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function MultiSelect({ options, value, onChange }) {
  // value is a JSON string array like '["Email","VPN"]' or an array
  const selected = Array.isArray(value)
    ? value
    : value
    ? JSON.parse(value)
    : []

  const toggle = (label) => {
    // "None" is exclusive - deselect everything else
    if (label === "None") {
      onChange(JSON.stringify(["None"]))
      return
    }

    let next = selected.includes(label)
      ? selected.filter((s) => s !== label)
      : [...selected.filter((s) => s !== "None"), label]

    // "All Systems" / "All of the above" is exclusive - deselect others
    const allOption = options.find(
      (o) =>
        o.label.startsWith("All ") ||
        o.label === "All of the above"
    )
    if (allOption && label === allOption.label) {
      next = [allOption.label]
    } else if (allOption && next.includes(allOption.label)) {
      next = next.filter((s) => s !== allOption.label)
    }

    onChange(JSON.stringify(next))
  }

  return (
    <div className="grid gap-2.5">
      <p className="text-[#475569] text-xs mb-0.5">Select all that apply</p>
      {options.map((option) => {
        const isSelected = selected.includes(option.label)
        return (
          <motion.button
            key={option.label}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(option.label)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-3 ${
              isSelected
                ? "bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#0F172A]"
                : "bg-white border border-[#E2E8F0] text-[#475569] hover:shadow-sm hover:border-[#94A3B8]"
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all ${
                isSelected
                  ? "bg-[#1D4ED8] text-white"
                  : "border border-[#E2E8F0] bg-white"
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
            </div>
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}
