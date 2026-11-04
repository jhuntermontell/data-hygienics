"use client"

// Everything on the map, grouped the way the categories are, with the
// controls to walk through, edit or remove each item. The list prints; the
// controls don't.
import { useState } from "react"
import { ListChecks, Pencil, Trash2 } from "lucide-react"
import { getCategory } from "@/lib/map"
import CategorySelect from "./CategorySelect"
import {
  BTN_PRIMARY,
  BTN_QUIET,
  FIELD,
  categoryLabel,
  displayName,
  forbiddenMessage,
  iconFor,
  itemsByGroup,
  marksByItem,
  matchFor,
  needsWalkThrough,
} from "./helpers"

const SMALL_BTN =
  "inline-flex min-h-11 items-center gap-1.5 px-2.5 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"

function Editor({ item, onSave, onCancel }) {
  const [category, setCategory] = useState(item.category)
  const [brand, setBrand] = useState(item.brand || "")
  const [model, setModel] = useState(item.model || "")
  const [label, setLabel] = useState(item.label || "")
  const [error, setError] = useState(null)
  const isAccount = item.kind === "account"

  const save = (event) => {
    event.preventDefault()
    const b = isAccount ? "" : brand.trim()
    const m = isAccount ? "" : model.trim()
    const l = label.trim()
    const problem = forbiddenMessage(l, b, m)
    if (problem) return setError(problem)
    const same = category === item.category && b === item.brand && m === item.model
    const catalogId = same ? item.catalogId : matchFor(category, b, m)?.entry.id || null
    const kind = getCategory(category)?.kind || item.kind
    onSave({
      category,
      kind,
      brand: b,
      model: m,
      label: l,
      catalogId,
      hardwareVersion: same ? item.hardwareVersion : "",
      source: same ? item.source : item.source === "catalog" ? "typed" : item.source,
    })
  }

  return (
    <form onSubmit={save} className="mt-3 space-y-3 border border-[#E2E8F0] bg-[#F8FAFC] p-3 print:hidden" noValidate>
      <div>
        <label htmlFor={`edit-cat-${item.id}`} className="block text-xs font-semibold text-[#475569] mb-1">
          What it is
        </label>
        <CategorySelect id={`edit-cat-${item.id}`} kind={isAccount ? "account" : "device"} allowUnknown={!isAccount} value={category} onChange={setCategory} />
      </div>
      {!isAccount ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`edit-brand-${item.id}`} className="block text-xs font-semibold text-[#475569] mb-1">
              Brand
            </label>
            <input id={`edit-brand-${item.id}`} type="text" value={brand} maxLength={60} onChange={(e) => setBrand(e.target.value)} className={FIELD} />
          </div>
          <div>
            <label htmlFor={`edit-model-${item.id}`} className="block text-xs font-semibold text-[#475569] mb-1">
              Model
            </label>
            <input id={`edit-model-${item.id}`} type="text" value={model} maxLength={80} onChange={(e) => setModel(e.target.value)} className={FIELD} />
          </div>
        </div>
      ) : null}
      <div>
        <label htmlFor={`edit-label-${item.id}`} className="block text-xs font-semibold text-[#475569] mb-1">
          Name
        </label>
        <input id={`edit-label-${item.id}`} type="text" value={label} maxLength={60} onChange={(e) => setLabel(e.target.value)} className={FIELD} />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BTN_PRIMARY}>
          Save
        </button>
        <button type="button" onClick={onCancel} className={BTN_QUIET}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ItemList({ items, findings, onWalk, onSave, onRemove }) {
  const [editingId, setEditingId] = useState(null)
  const byId = Object.fromEntries(items.map((i) => [i.id, i]))
  const marks = marksByItem(findings)
  const groups = itemsByGroup(items)

  return (
    <section aria-labelledby="map-items-title">
      <h2 id="map-items-title" className="text-xl font-display font-semibold tracking-[-0.01em] text-[#0F172A]">
        On your map
      </h2>
      <div className="mt-4 space-y-6">
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="readout-label text-day-readout">{group.label}</h3>
            <ul className="mt-2 divide-y divide-[#E2E8F0] border border-[#E2E8F0] bg-white list-none p-0 m-0">
              {group.items.map((item) => {
                const Icon = iconFor(item)
                const owner = item.controlledBy ? byId[item.controlledBy] : null
                const mark = marks[item.id]
                return (
                  <li key={item.id} className="p-3 sm:p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <Icon className="mt-0.5 w-5 h-5 shrink-0 text-[#0F766E]" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-[15px] font-semibold text-[#0F172A]">
                            <span className="truncate">{displayName(item)}</span>
                            {mark === "weak" ? (
                              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#B45309]" role="img" aria-label="Weak point" />
                            ) : mark === "watch" ? (
                              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[#B45309] bg-white" role="img" aria-label="Worth a look" />
                            ) : null}
                          </p>
                          <p className="text-sm text-[#475569]">
                            {categoryLabel(item.category)}
                            {item.label && (item.brand || item.model) ? ` · ${[item.brand, item.model].filter(Boolean).join(" ")}` : ""}
                          </p>
                          {item.kind !== "account" ? (
                            <p className="text-sm text-[#64748B]">{owner ? `Controlled by ${displayName(owner)}` : "No account linked yet"}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 print:hidden sm:shrink-0">
                        {needsWalkThrough(item) ? (
                          <button type="button" onClick={() => onWalk(item.id)} className={`${SMALL_BTN} text-[#0F766E]`}>
                            <ListChecks className="w-4 h-4" aria-hidden="true" />
                            Walk through
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                          aria-expanded={editingId === item.id}
                          className={SMALL_BTN}
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Remove ${displayName(item)} from the map?`)) onRemove(item.id)
                          }}
                          className={`${SMALL_BTN} hover:text-[#B91C1C]`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                          Remove
                        </button>
                      </div>
                    </div>
                    {editingId === item.id ? (
                      <Editor
                        item={item}
                        onCancel={() => setEditingId(null)}
                        onSave={(patch) => {
                          onSave(item.id, patch)
                          setEditingId(null)
                        }}
                      />
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
