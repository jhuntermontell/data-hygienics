import { Home, Briefcase } from "lucide-react"
import { AUDIENCE_LABELS } from "@/lib/content"

const STYLES = {
  home: "bg-[#F0FDFA] text-[#0F766E] border-[#0F766E]/20",
  business: "bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/20",
}

const ICONS = { home: Home, business: Briefcase }

export default function AudienceBadge({ audience }) {
  const Icon = ICONS[audience]
  if (!Icon) return null
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STYLES[audience]}`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {AUDIENCE_LABELS[audience]}
    </span>
  )
}
