import { cn } from "@/lib/utils"

const variantClasses = {
  default:
    "bg-[#1D4ED8] text-white hover:bg-[#1E40AF] shadow-sm",
  outline:
    "border border-[#1D4ED8] text-[#1D4ED8] bg-white hover:bg-[#EFF6FF]",
  ghost: "text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]",
  secondary: "bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F1F5F9]",
}

const sizeClasses = {
  default: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-xs",
  lg: "h-14 px-8 text-base",
  icon: "h-10 w-10",
}

export function Button({ className, variant = "default", size = "default", asChild, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
