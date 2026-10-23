import { TriangleAlert, CircleAlert, Radar, Sparkles, Target, Bot } from "lucide-react"
import { SEVERITY_LABELS, AI_ROLE_LABELS } from "@/lib/content"

// Severity and AI-role chips for threat entries. Each carries an icon and
// text, so color is never the only signal.

const SEVERITY = {
  high: { icon: TriangleAlert, className: "bg-[#FEF2F2] text-[#B91C1C] border-[#DC2626]/25" },
  medium: { icon: CircleAlert, className: "bg-[#FFFBEB] text-[#B45309] border-[#D97706]/25" },
  emerging: { icon: Radar, className: "bg-[#F5F3FF] text-[#6D28D9] border-[#7C3AED]/25" },
}

const AI_ROLE = {
  "ai-enabled": Sparkles,
  "ai-targeted": Target,
  "ai-native": Bot,
}

export const SEVERITY_HELP = {
  high: "Common now and costly when it lands.",
  medium: "Real and documented, with smaller or narrower losses.",
  emerging: "Early days: documented cases, but limited data so far.",
}

export const AI_ROLE_HELP = {
  "ai-enabled": "An old trick made cheaper, faster, or more convincing with AI.",
  "ai-targeted": "The AI tools you use are the way in.",
  "ai-native": "A threat that only exists because of AI.",
}

const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
}

export function SeverityChip({ severity, size = "sm" }) {
  const style = SEVERITY[severity]
  if (!style) return null
  const Icon = style.icon
  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${SIZES[size]} ${style.className}`}>
      <Icon className={size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} aria-hidden="true" />
      <span className="sr-only">Severity: </span>
      {SEVERITY_LABELS[severity]}
    </span>
  )
}

export function AiRoleChip({ aiRole, size = "sm" }) {
  const Icon = AI_ROLE[aiRole]
  if (!Icon) return null
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] ${SIZES[size]}`}
    >
      <Icon className={size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} aria-hidden="true" />
      <span className="sr-only">AI&apos;s role: </span>
      {AI_ROLE_LABELS[aiRole]}
    </span>
  )
}
