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
              ? "bg-blue-500/15 border-2 border-blue-500 text-white"
              : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  )
}
