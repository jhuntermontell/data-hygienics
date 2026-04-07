"use client"

import { useState, useRef, useEffect } from "react"
import { Info } from "lucide-react"
import { resolveControlSlug } from "@/lib/cyber-audit/control-slugs"

export default function Tooltip({ tooltip }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Handle string tooltip (backward compat) or object tooltip
  const isString = typeof tooltip === "string"
  const explanation = isString ? tooltip : tooltip.explanation
  const insurerNote = isString ? null : tooltip.insurerNote
  const controlSlug = isString ? null : resolveControlSlug(tooltip.controlSlug)

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
        className="text-[#1D4ED8]/60 hover:text-[#1D4ED8] transition-colors cursor-pointer align-middle"
        aria-label="More info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 rounded-xl bg-white border border-[#E2E8F0] shadow-lg z-50 overflow-hidden">
          <div className="p-4 space-y-3">
            <p className="text-[#475569] text-xs leading-relaxed">
              {explanation}
            </p>
            {insurerNote && (
              <div className="bg-[#EFF6FF] border border-[#EFF6FF] rounded-lg p-2.5">
                <p className="text-[#1D4ED8]/80 text-[11px] leading-relaxed">
                  <span className="font-semibold text-[#1D4ED8]">Why insurers care: </span>
                  {insurerNote}
                </p>
              </div>
            )}
            {controlSlug && (
              <a
                href={`/controls/${controlSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#1D4ED8] text-[11px] font-semibold hover:text-[#1D4ED8]/80 transition-colors"
                onClick={() => setOpen(false)}
              >
                Learn more →
              </a>
            )}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white border-r border-b border-[#E2E8F0] rotate-45 -mt-1" />
        </div>
      )}
    </span>
  )
}
