import { cn } from "@/lib/utils"

const variantClasses = {
  default: "bg-lime-400 text-black hover:bg-lime-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(163,230,53,0.2)]",
  outline: "border border-zinc-700 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-500 hover:-translate-y-0.5",
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
        "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
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
