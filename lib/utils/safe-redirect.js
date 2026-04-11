// Shared validator for post-auth redirect targets. Used by the login page,
// the register/profile-completion page, and the auth callback so all three
// agree on what counts as a safe internal destination.

const DEFAULT_NEXT = "/tools/cyber-audit/dashboard"

const ALLOWED_NEXT_PREFIXES = [
  "/tools/cyber-audit/dashboard",
  "/tools/cyber-audit/assessment",
  "/tools/cyber-audit/results",
  "/tools/policies",
  "/tools/ir-plan",
]

export function safeNext(raw) {
  if (!raw || typeof raw !== "string") return DEFAULT_NEXT
  if (!raw.startsWith("/")) return DEFAULT_NEXT
  if (raw.startsWith("//")) return DEFAULT_NEXT
  if (raw.startsWith("/\\")) return DEFAULT_NEXT
  if (raw.includes("://")) return DEFAULT_NEXT
  if (
    !ALLOWED_NEXT_PREFIXES.some(
      (p) => raw === p || raw.startsWith(p + "/") || raw.startsWith(p + "?")
    )
  ) {
    return DEFAULT_NEXT
  }
  return raw
}

export const DEFAULT_AUTH_REDIRECT = DEFAULT_NEXT
