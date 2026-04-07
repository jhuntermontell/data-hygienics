import { cn } from "@/lib/utils"

const variantClasses = {
  default: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
  accent: "bg-[#EFF6FF] text-[#1D4ED8] border-[#EFF6FF]",
  teal: "bg-[#F0FDFA] text-[#0F766E] border-[#F0FDFA]",
  success: "bg-[#ECFDF5] text-[#059669] border-[#ECFDF5]",
  warning: "bg-[#FFFBEB] text-[#D97706] border-[#FFFBEB]",
  danger: "bg-[#FEF2F2] text-[#DC2626] border-[#FEF2F2]",
  outline: "bg-transparent text-[#475569] border-[#E2E8F0]",
}

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
