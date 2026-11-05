// Record plus facts in, control states out. Pure.
//
//   evaluate({ record, facts, now })
//
// record  the stored Verified record: { controls: { [controlId]: { state, tier,
//         proofType, passedAt, validUntil, facts } } }, the shape of
//         `verified_controls` (spec section 5). `facts` there is the control's
//         facts at that evaluation. May be empty for a new record.
// facts   the latest facts object (the shape documented in rules.js)
// now     a Date or a day string; defaults to today
//
// Returns { baselineVersion, evaluatedAt, controls, events }:
//   controls  one line per control, in baseline order:
//             { id, state, tier, proofType, proofs, passedAt, validUntil, reason }
//   events    drift events (lib/verified/drift.js), for owner alerts
// There is no composite number: no score, grade, percentage or count of
// passed lines. The MFA tier is the only number, and only on its own line.
//
// States (spec section 1):
//   not_applicable  the rule says so, and the control allows it
//   passed          the rule holds and its proof is still within validity
//   expired         the rule holds, but a proof it rests on has run out
//   drifted         the last state was passed (or drifted), the rule no longer
//                   holds, and a live check shows the change
//   open            anything else: no proof, refused proof, or the rule fails
import { BASELINE_VERSION, CONTROLS } from "./baseline.js"
import { RULES } from "./rules.js"
import { detectDrift, LIVE } from "./drift.js"
import { toDay } from "./dates.js"

export function evaluate({ record = {}, facts = {}, now = new Date(), insurerAnswers = [] } = {}) {
  const today = toDay(now)
  const prior = record?.controls || {}
  const previous = {}
  for (const [id, line] of Object.entries(prior)) if (line?.state === "passed" && line.facts) previous[id] = line.facts
  const events = detectDrift({ previous, current: facts, insurerAnswers, now: today })

  const controls = CONTROLS.map((control) => {
    const id = control.id
    const r = RULES[control.rule](facts, { now: today })
    const before = prior[id]
    const line = (state, fields = {}) => ({
      id,
      state,
      tier: id === "mfa" ? (r.tier ?? 0) : null,
      proofType: null,
      proofs: [],
      passedAt: null,
      validUntil: null,
      reason: null,
      ...fields,
    })

    if (r.notApplicable) {
      if (control.notApplicableAllowed) return line("not_applicable", { reason: r.reason })
      return line("open", { reason: "This control applies to every business." })
    }
    if (facts?.[id]?.notApplicable && !control.notApplicableAllowed && !r.ok)
      return line("open", { reason: `Not applicable is not accepted for this control. ${r.reason}` })

    if (r.ok) {
      const stale = r.validUntil && today > r.validUntil
      return line(stale ? "expired" : "passed", {
        proofType: r.proofType,
        proofs: r.proofs,
        passedAt: r.passedAt,
        validUntil: r.validUntil,
        reason: stale ? `Needs fresh proof: a proof this line rests on ran out on ${r.validUntil}.` : r.reason,
      })
    }

    const live = control.drift ? LIVE[id]?.live(facts) : null
    const mine = events.filter((e) => e.controlId === id && e.kind === "check")
    const wasPassed = before?.state === "passed" && mine.length
    const stillDrifted = before?.state === "drifted" && live
    if (control.drift && (wasPassed || stillDrifted)) {
      return line("drifted", {
        proofType: before.proofType ?? null,
        proofs: before.proofs ?? [],
        passedAt: before.passedAt ?? null,
        validUntil: before.validUntil ?? null,
        reason: mine.length ? mine.map((e) => e.sentence).join(" ") : r.reason,
      })
    }
    return line("open", { reason: r.reason })
  })

  return { baselineVersion: BASELINE_VERSION, evaluatedAt: today, controls, events }
}

// The stored shape for one control after an evaluation: the line plus the
// facts it was evaluated on, ready for `verified_controls`.
export function toRecord(result, facts) {
  return {
    baselineVersion: result.baselineVersion,
    evaluatedAt: result.evaluatedAt,
    controls: Object.fromEntries(result.controls.map((c) => [c.id, { ...c, facts: facts?.[c.id] ?? null }])),
  }
}
