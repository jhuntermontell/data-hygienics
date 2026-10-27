"use client"
import { useEffect, useState } from "react"

// Loads /search-index.json once per page load and shares it between the menu
// and the search sheet. The file is static; nothing about the visitor or
// their query is sent with the request.
let pending = null

function load() {
  if (!pending) {
    pending = fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`index ${r.status}`))))
      .catch((error) => {
        pending = null
        throw error
      })
  }
  return pending
}

export function useSearchIndex(enabled) {
  const [state, setState] = useState({ index: null, error: false })
  useEffect(() => {
    if (!enabled || state.index) return
    let live = true
    load()
      .then((index) => live && setState({ index, error: false }))
      .catch(() => live && setState({ index: null, error: true }))
    return () => {
      live = false
    }
  }, [enabled, state.index])
  return state
}
