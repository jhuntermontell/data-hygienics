"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { emptyMap } from "@/lib/map"
import { clearLocal, loadLocal, saveLocal } from "@/lib/map/storage"

// One home map for an audience, in this browser only. The local-only sibling
// of usePathRecord: there is no remote copy, no merge and no user id in the
// record, ever (the custody rule in design/strategy/five-year-value-roadmap.md).
//
// `user` only tells the page whether the result (counts and a date, see
// lib/map/sync.js) can be saved to an account. The session is read from the
// browser; nothing about the map is sent to learn it.
//
// Every change is saved to this browser straight away. Each change also
// re-runs the check, so `checkedAt` is stamped whenever the map has items.
export function useMapRecord(audience) {
  const [record, setRecord] = useState(() => emptyMap(audience))
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)
  const recordRef = useRef(record)

  useEffect(() => {
    const stored = loadLocal(audience)
    const initial = stored || emptyMap(audience)
    recordRef.current = initial
    // Loading from browser storage has to wait for the client; this is the
    // one-time read of an external store on mount.
    setRecord(initial)
    setReady(true)

    let cancelled = false
    try {
      getSupabaseBrowserClient()
        .auth.getSession()
        .then(({ data }) => {
          if (!cancelled) setUser(data?.session?.user || null)
        })
        .catch(() => {})
    } catch {
      // No Supabase in this environment: the map works the same signed out.
    }
    return () => {
      cancelled = true
    }
  }, [audience])

  const commit = useCallback((next) => {
    // Never let an account id ride along in the record.
    const { userId, ...clean } = next
    recordRef.current = clean
    setRecord(clean)
    saveLocal(clean)
    return clean
  }, [])

  // fn(current record) -> next record. Returns the saved record so a caller
  // (Save a copy) can use the stamped copy at once.
  const update = useCallback(
    (fn) => {
      const at = new Date().toISOString()
      const changed = fn(recordRef.current)
      const next = {
        ...changed,
        audience,
        updatedAt: at,
        checkedAt: changed.items?.length ? at : changed.checkedAt || null,
      }
      return commit(next)
    },
    [audience, commit]
  )

  // Delete from this device: the browser copy goes; saved files and paper
  // are the member's own.
  const reset = useCallback(() => {
    clearLocal(audience)
    const next = emptyMap(audience)
    recordRef.current = next
    setRecord(next)
    return next
  }, [audience])

  // A saved file read back through parseImport: replaces this browser's map.
  const importRecord = useCallback(
    (incoming) => {
      if (!incoming || incoming.audience !== audience) return null
      return commit({ ...emptyMap(audience), ...incoming, audience, updatedAt: new Date().toISOString() })
    },
    [audience, commit]
  )

  return { record, ready, user, update, reset, importRecord }
}
