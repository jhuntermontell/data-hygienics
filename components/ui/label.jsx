import { cn } from "@/lib/utils"

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium text-zinc-400 mb-1.5 block", className)}
      {...props}
    />
  )
}
