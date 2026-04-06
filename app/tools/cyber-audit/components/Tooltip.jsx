"use client"

import { useState, useRef, useEffect } from "react"
import { Info } from "lucide-react"
import Link from "next/link"

export default function Tooltip({ tooltip }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Handle string tooltip (backward compat) or object tooltip
  const isString = typeof tooltip === "string"
  const explanation = isString ? tooltip : tooltip.explanation
  const insurerNote = isString ? null : tooltip.insurerNote
  const controlSlug = isString ? null : tooltip.controlSlug

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <span className="relative inline-block ml-1.5" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-blue-500/60 hover:text-blue-400 transition-colors cursor-pointer align-middle"
        aria-label="More info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 rounded-xl bg-zinc-900 border border-zinc-700 shadow-xl z-50 overflow-hidden">
          <div className="p-4 space-y-3">
            <p className="text-zinc-300 text-xs leading-relaxed">
              {explanation}
            </p>
            {insurerNote && (
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-2.5">
                <p className="text-blue-300/80 text-[11px] leading-relaxed">
                  <span className="font-semibold text-blue-400">Why insurers care: </span>
                  {insurerNote}
                </p>
              </div>
            )}
            {controlSlug && (
              <Link
                href={`/controls/${controlSlug}`}
                className="inline-flex items-center text-blue-400 text-[11px] font-semibold hover:text-blue-300 transition-colors"
                onClick={() => setOpen(false)}
              >
                Learn more →
              </Link>
            )}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700 rotate-45 -mt-1" />
        </div>
      )}
    </span>
  )
}
