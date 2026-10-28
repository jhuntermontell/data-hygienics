"use client"
import { MotionConfig } from "framer-motion"

// Auth comes from Supabase session directly; subscription data is fetched on
// demand with localStorage caching. MotionConfig makes every framer-motion
// animation on the site honor the visitor's reduced-motion setting
// (design/brand-book/personality.md, section 9).
export function Providers({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
