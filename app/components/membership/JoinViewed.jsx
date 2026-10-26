"use client"
import { useEffect, useRef } from "react"
import { EVENTS, track } from "@/lib/analytics"

// Renders a zero-height sentinel and fires join_viewed { surface } once, the
// first time the sentinel's parent element enters the viewport. Place it
// inside the element that carries the ask, as a direct child of a block (not
// grid or flex with a gap, where it would take a slot). No visible output.
export default function JoinViewed({ surface }) {
  const ref = useRef(null)

  useEffect(() => {
    const sentinel = ref.current
    if (!sentinel || typeof IntersectionObserver === "undefined") return
    const target = sentinel.parentElement || sentinel
    let fired = false
    const observer = new IntersectionObserver((entries) => {
      if (fired || !entries.some((entry) => entry.isIntersecting)) return
      fired = true
      track(EVENTS.joinViewed, { surface })
      observer.disconnect()
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [surface])

  return <span ref={ref} aria-hidden="true" className="block h-0 w-0 overflow-hidden" />
}
