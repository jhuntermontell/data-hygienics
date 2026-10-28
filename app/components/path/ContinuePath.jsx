"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { loadLocal } from "@/lib/path/storage"

// "Continue your path" for visitors with a path saved in this browser.
// Renders nothing until mounted (the server can't see localStorage).
export default function ContinuePath({ className = "" }) {
  const [saved, setSaved] = useState([])

  useEffect(() => {
    setSaved(["home", "business"].filter((audience) => loadLocal(audience)?.answers?.completedAt))
  }, [])

  if (!saved.length) return null
  return (
    <div className={`flex flex-wrap items-center gap-3 border border-[#0F8F83]/30 bg-[#F0FDFA] px-4 py-3 ${className}`}>
      <p className="text-sm font-semibold text-[#134E4A]">Welcome back. Your path is saved on this device.</p>
      <div className="flex flex-wrap gap-2">
        {saved.map((audience) => (
          <Link
            key={audience}
            href={`/path/${audience}`}
            className="inline-flex items-center gap-1.5 bg-[#0F766E] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#115E59]"
          >
            {audience === "home" ? "Continue my home path" : "Continue my business path"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  )
}
