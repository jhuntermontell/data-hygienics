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
export function usePathRecord(audience) {
  const [record, setRecord] = useState(() => emptyRecord(audience))
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)
  const [sync, setSync] = useState("device")
  const userRef = useRef(null)
  const saveTimer = useRef(null)

  useEffect(() => {
    let cancelled = false
    const supabase = getSupabaseBrowserClient()
    const local = loadLocal(audience)
    if (local) setRecord(local)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return
      const u = session?.user || null
      userRef.current = u
      setUser(u)
      if (!u) {
        setReady(true)
        return
      }
      const remote = await loadRemote(supabase, u.id, audience).catch(() => null)
      if (cancelled) return
      const merged = mergeRecords(local, remote)
      if (merged) {
        setRecord(merged)
        saveLocal(merged)
        // Push a device-only Path up to the account on first sign-in.
        const ok = await saveRemote(supabase, u.id, merged).catch(() => false)
        if (!cancelled) setSync(ok ? "account" : "offline")
      } else {
        setSync("account")
      }
      setReady(true)
    })

    return () => {
      cancelled = true
      clearTimeout(saveTimer.current)
    }
  }, [audience])

  const persist = useCallback((next) => {
    saveLocal(next)
    const u = userRef.current
    if (!u) return
    setSync("saving")
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const ok = await saveRemote(getSupabaseBrowserClient(), u.id, next).catch(() => false)
      setSync(ok ? "account" : "offline")
    }, 600)
  }, [])

  // Updaters read the latest record from a ref so the save runs once, outside
  // React's (possibly repeated) state updater.
  const recordRef = useRef(record)
  useEffect(() => {
    recordRef.current = record
  }, [record])
  const update = useCallback(
    (fn) => {
      const next = { ...fn(recordRef.current), audience, updatedAt: new Date().toISOString() }
      recordRef.current = next
      setRecord(next)
      persist(next)
    },
    [audience, persist]
  )

  // Start over on this device. The account copy is overwritten on the next
  // save, so nothing stale comes back.
  const reset = useCallback(() => {
    clearLocal(audience)
    const next = { ...emptyRecord(audience), updatedAt: new Date().toISOString() }
    setRecord(next)
    persist(next)
  }, [audience, persist])

  return { record, ready, user, sync, update, reset }
}
