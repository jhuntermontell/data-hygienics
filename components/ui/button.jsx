import { cn } from "@/lib/utils"

const variantClasses = {
  default:
    "bg-blue-500 text-white hover:bg-blue-400 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]",
  outline:
    "border border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:-translate-y-0.5",
  ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800/60",
  secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
}

const sizeClasses = {
  default: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-xs",
  lg: "h-14 px-8 text-base",
  icon: "h-10 w-10",
}

export function Button({ className, variant = "default", size = "default", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
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
