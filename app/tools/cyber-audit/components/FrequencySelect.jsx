"use client"

import { motion } from "framer-motion"

const frequencyColors = {
  1.0: "bg-emerald-500/15 border-emerald-500 text-emerald-400",
  0.8: "bg-blue-500/15 border-blue-500 text-blue-400",
  0.6: "bg-blue-500/15 border-blue-500 text-blue-400",
  0.4: "bg-yellow-500/15 border-yellow-500 text-yellow-400",
  0.2: "bg-orange-500/15 border-orange-500 text-orange-400",
  0.0: "bg-red-500/15 border-red-500 text-red-400",
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
                : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          >
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}
