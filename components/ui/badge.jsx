import { cn } from "@/lib/utils"

const variantClasses = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  accent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  outline: "bg-transparent text-zinc-500 border-zinc-700",
}

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
