"use client"
import Link from "next/link"
import { EVENTS, track } from "@/lib/analytics"

// A Join link shared by every membership surface. It is an ordinary Link
// (works without JS) that records join_started { surface, door } on click,
// before the pricing page or checkout takes over.
export default function JoinLink({ href, surface, door = "home", onClick, children, ...rest }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        track(EVENTS.joinStarted, { surface, door })
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
