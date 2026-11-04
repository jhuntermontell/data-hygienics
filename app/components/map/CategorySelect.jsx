import { FIELD, groupedCategories } from "./helpers"

// A category <select> grouped by CATEGORY_GROUPS. `kind` limits it to
// devices or accounts; `allowUnknown` adds "Not sure yet".
export default function CategorySelect({ id, value, onChange, kind, allowUnknown = false, className = "" }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD} ${className}`}>
      {allowUnknown ? <option value="unknown">Not sure yet</option> : null}
      {groupedCategories(kind).map((g) => (
        <optgroup key={g.id} label={g.label}>
          {g.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
