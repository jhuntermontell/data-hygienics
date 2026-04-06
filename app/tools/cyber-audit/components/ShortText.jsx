"use client"

import { Input } from "@/components/ui/input"

export default function ShortText({ value, onChange, placeholder }) {
  return (
    <Input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Type your answer..."}
    />
  )
}
