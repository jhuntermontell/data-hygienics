"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { emptyRecord, loadLocal, loadRemote, mergeRecords, saveLocal, saveRemote, clearLocal } from "@/lib/path/storage"

// One Path record (answers + progress) for an audience, local-first.
// `sync` reports where it lives right now:
//   "device"  saved in this browser only (signed out, or storage blocked)
//   "account" also saved to the signed-in account
//   "saving"  an account save is in flight
//   "offline" signed in, but the account copy couldn't be reached
//
// A browser copy tied to an account (record.userId) is only used when that
// same account is signed in, so a shared computer never shows or uploads
// one person's path into another's account. A device-only copy is claimed
// by whoever signs in next: that's the "save my path" flow.
export function usePathRecord(audience) {
  const [record, setRecord] = useState(() => emptyRecord(audience))
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)
  const [sync, setSync] = useState("device")
  const userRef = useRef(null)
  const saveTimer = useRef(null)
  const pending = useRef(null)
  const recordRef = useRef(record)

  useEffect(() => {
    recordRef.current = record
  }, [record])

  useEffect(() => {
    let cancelled = false
    const supabase = getSupabaseBrowserClient()
    const stored = loadLocal(audience)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return
      const u = session?.user || null
      userRef.current = u
      setUser(u)
      const local = stored && (!stored.userId || stored.userId === u?.id) ? stored : null

      if (!u) {
        if (local) setRecord(local)
        setReady(true)
        return
      }

      const { record: remote, error } = await loadRemote(supabase, u.id, audience)
      if (cancelled) return
      if (error) {
        // Couldn't read the account copy: work from this device and never
        // overwrite the account with a guess.
        if (local) setRecord(local)
        setSync("offline")
        setReady(true)
        return
      }

      const merged = mergeRecords(local, remote)
      if (!merged) {
        if (stored?.userId && stored.userId !== u.id) clearLocal(audience)
        setSync("account")
        setReady(true)
        return
      }
      const owned = { ...merged, userId: u.id }
      setRecord(owned)
      saveLocal(owned)
      setReady(true)
      // Push the merged copy up (a device-only path on first sign-in, or
      // marks made here while offline).
      const ok = await saveRemote(supabase, u.id, owned).catch(() => false)
      if (!cancelled) setSync(ok ? "account" : "offline")
    })

    return () => {
      cancelled = true
      // Flush a save that's still waiting rather than dropping it.
      clearTimeout(saveTimer.current)
      if (pending.current && userRef.current) {
        saveRemote(supabase, userRef.current.id, pending.current).catch(() => {})
        pending.current = null
      }
    }
  }, [audience])

  const persist = useCallback((next) => {
    const u = userRef.current
    const stamped = u ? { ...next, userId: u.id } : next
    saveLocal(stamped)
    if (!u) return
    setSync("saving")
    pending.current = stamped
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const toSave = pending.current
      pending.current = null
      if (!toSave) return
      const ok = await saveRemote(getSupabaseBrowserClient(), u.id, toSave).catch(() => false)
      setSync(ok ? "account" : "offline")
    }, 600)
  }, [])

  // Updaters read the latest record from a ref so the save runs once, outside
  // React's (possibly repeated) state updater.
  const update = useCallback(
    (fn) => {
      const next = { ...fn(recordRef.current), audience, updatedAt: new Date().toISOString() }
      recordRef.current = next
      setRecord(next)
      persist(next)
    },
    [audience, persist]
  )

  // Start over. resetAt makes older marks on other devices drop out when
  // they merge, so nothing stale comes back.
  const reset = useCallback(() => {
    const now = new Date().toISOString()
    const next = { ...emptyRecord(audience), updatedAt: now, resetAt: now }
    recordRef.current = next
    setRecord(next)
    persist(next)
  }, [audience, persist])

  return { record, ready, user, sync, update, reset }
}
