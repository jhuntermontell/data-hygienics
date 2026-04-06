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
                ? "bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
                : "bg-zinc-700 text-white"
              : "bg-zinc-800/60 text-zinc-500 border border-zinc-700/50 hover:border-zinc-600"
          }`}
        >
          {option}
        </motion.button>
      ))}
    </div>
  )
}
