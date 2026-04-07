import { cn } from "@/lib/utils"

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium text-[#0F172A] mb-1.5 block", className)}
      {...props}
    />
  )
}
