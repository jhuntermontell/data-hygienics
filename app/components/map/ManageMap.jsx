"use client"

import { useRef, useState } from "react"
import { Download, Printer, Trash2, Upload } from "lucide-react"
import { parseImport, serialize } from "@/lib/map/storage"
import { BTN_QUIET } from "./helpers"

// Keep your own copy. Everything here happens in the browser: the file is
// written and read on this device, and printing goes to your printer.
export default function ManageMap({ record, update, importRecord, reset }) {
  const fileRef = useRef(null)
  const [status, setStatus] = useState(null) // { tone: "ok" | "error", text }
  const hasItems = (record.items || []).length > 0

  const stamp = () => update((r) => ({ ...r, exportedAt: new Date().toISOString() }))

  const saveCopy = () => {
    const stamped = stamp()
    try {
      const blob = new Blob([serialize(stamped)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "home-map.json"
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setStatus({ tone: "ok", text: "Saved as home-map.json in your downloads. Keep it with your other papers." })
    } catch {
      setStatus({ tone: "error", text: "This browser wouldn't save the file. Try Print instead." })
    }
  }

  const loadCopy = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    let text = ""
    try {
      text = await file.text()
    } catch {
      setStatus({ tone: "error", text: "We couldn't open that file. Choose the home-map.json you saved." })
      return
    }
    const { record: incoming, error } = parseImport(text)
    if (error || !incoming) {
      setStatus({ tone: "error", text: error || "This file isn't a home map we can read." })
      return
    }
    if (hasItems && !window.confirm("Replace the map on this device with the one in this file?")) return
    importRecord(incoming)
    setStatus({ tone: "ok", text: `Loaded ${incoming.items.length} ${incoming.items.length === 1 ? "item" : "items"} from your file.` })
  }

  const print = () => {
    stamp()
    // Let the page re-render without the "only in this browser" finding first.
    setTimeout(() => window.print(), 60)
  }

  const remove = () => {
    if (!window.confirm("Delete the home map from this browser? Files you saved and pages you printed stay yours.")) return
    reset()
    setStatus({ tone: "ok", text: "Deleted from this browser." })
  }

  return (
    <section aria-labelledby="manage-map-title" id="manage-map" className="scroll-mt-24 print:hidden">
      <h2 id="manage-map-title" className="text-base font-display font-semibold text-[#0F172A]">
        Keep your own copy
      </h2>
      <div className="mt-2 flex flex-wrap gap-1">
        <button type="button" onClick={saveCopy} disabled={!hasItems} className={`${BTN_QUIET} disabled:opacity-50`}>
          <Download className="w-4 h-4" aria-hidden="true" />
          Save a copy
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={BTN_QUIET}>
          <Upload className="w-4 h-4" aria-hidden="true" />
          Load a copy
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" onChange={loadCopy} className="sr-only" tabIndex={-1} aria-hidden="true" />
        <button type="button" onClick={print} disabled={!hasItems} className={`${BTN_QUIET} disabled:opacity-50`}>
          <Printer className="w-4 h-4" aria-hidden="true" />
          Print
        </button>
        <button type="button" onClick={remove} disabled={!hasItems} className={`${BTN_QUIET} hover:text-[#B91C1C] disabled:opacity-50`}>
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          Delete from this device
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
        A saved copy is a file on your device, a printout is paper for your records, and the map itself stays in this browser
        until you delete it. None of them is sent to us.
      </p>
      {status ? (
        <p role="status" className={`mt-2 text-sm font-semibold ${status.tone === "error" ? "text-[#B91C1C]" : "text-[#0F766E]"}`}>
          {status.text}
        </p>
      ) : null}
    </section>
  )
}
