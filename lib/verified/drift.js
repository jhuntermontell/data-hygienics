// Drift: a live check that now contradicts a control's last pass, or an
// answer the owner gave an insurer. Pure: facts in, events out.
//
//   detectDrift({ previous, current, insurerAnswers, now })
//
// previous  the facts each control last passed on: { [controlId]: facts[controlId] },
//           holding only controls whose last state was `passed`
// current   the latest facts object (the shape in rules.js)
// insurerAnswers  [{ carrier, questionId, controlId, answer: "yes" | "no", answeredAt }]
//           reserved for the carrier pack; drift compares "yes" answers with
//           the latest live check
//
// Returns [{ controlId, kind: "check" | "insurer", source, key, sentence, at }].
// Only controls with a `drift` source in baseline.js can drift: the tenant
// check (`api`) or the lookup (`dns`). A previous pass on weaker proof (an
// attestation before a tenant was connected) is contradicted by the first
// live check that disagrees with it. Sentences go to the owner, never to a
// public page.
import { CONTROLS, CONTROLS_BY_ID } from "./baseline.js"
import { RULES, MAX_GLOBAL_ADMINS, emailDomainProblems, filterGap } from "./rules.js"
import { toDay } from "./dates.js"

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`
const ev = (key, sentence) => ({ key, sentence })
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// For each drifting control: where its live facts live, and the changes that
// contradict a pass. `c` is the current live facts, `p` the live facts at the
// last pass (null when that pass rested on other proof). Conditions that the
// rule forbids are reported whenever they show in `c`; changes that only
// lower a tier need `p` to show the earlier state.
export const LIVE = {
  mfa: {
    live: (f) => f?.mfa?.api,
    events(c, p) {
      const out = []
      const enforced = (v) => v.securityDefaults === true || (v.mfaAllUsers === true && v.mfaAllAdmins === true && v.exemptUsers === 0)
      if (!enforced(c)) {
        if (p?.securityDefaults === true) out.push(ev("security_defaults", "Security Defaults was turned off, and no other policy enforces MFA for everyone."))
        else if (c.exemptUsers > 0) out.push(ev("exemption", `An exemption from MFA was added. ${plural(c.exemptUsers, "account is", "accounts are")} now exempt.`))
        else if (c.mfaAllUsers !== true) out.push(ev("all_users", "MFA is no longer enforced for every user."))
        else out.push(ev("all_admins", "MFA is no longer enforced for every admin account."))
      }
      if (p?.phishingResistantAllUsers === true && c.phishingResistantAllUsers !== true)
        out.push(ev("strength", "The phishing-resistant sign-in policy no longer covers every user."))
      return out
    },
  },
  admin_accounts: {
    live: (f) => f?.admin_accounts?.api,
    events(c) {
      const admins = Array.isArray(c.admins) ? c.admins : []
      const out = []
      if (admins.length > MAX_GLOBAL_ADMINS) out.push(ev("count", `An admin account was added. There are now ${admins.length} global admins.`))
      if (admins.some((a) => a.shared === true)) out.push(ev("shared", "An admin account is now shared by more than one person."))
      if (admins.some((a) => a.breakGlass !== true && !(a.dedicated === true && a.mailbox === false)))
        out.push(ev("everyday", "An admin account now holds a mailbox or is used for everyday work."))
      return out
    },
  },
  legacy_signin: {
    live: (f) => f?.legacy_signin?.api,
    events(c, p) {
      if (c.securityDefaults === true) return []
      if (c.legacyBlocked !== true)
        return [p?.securityDefaults === true ? ev("security_defaults", "Security Defaults was turned off, and old sign-in methods are no longer blocked.") : ev("blocked", "Old sign-in methods are no longer blocked tenant-wide.")]
      if (c.exceptions > 0) return [ev("exception", `An exception now lets ${plural(c.exceptions, "account", "accounts")} use old sign-in.`)]
      return []
    },
  },
  email_auth: {
    live: (f) => f?.email_auth?.dns,
    events(c) {
      const domains = Array.isArray(c.domains) ? c.domains : []
      return domains.flatMap((d) => emailDomainProblems(d).map((x) => ev(`${d.domain || "domain"}:${x.key}`, cap(x.sentence))))
    },
  },
  email_protection: {
    live: (f) => f?.email_protection?.api,
    events(c, p) {
      const gap = filterGap(c)
      if (!gap) return []
      if (p?.outsideFilter === true && c.outsideFilter !== true)
        return [ev("outside_filter", "Mail no longer arrives through the outside filter, and the tenant's own filtering does not cover every mailbox.")]
      // A pass that rested on the outside filter's document already knew the
      // tenant's own gap.
      if (p && filterGap(p) === gap) return []
      return [ev("filter", gap)]
    },
  },
  access_lifecycle: {
    live: (f) => f?.access_lifecycle?.api,
    events(c) {
      const out = []
      if (c.markedForRemovalStillEnabled > 0)
        out.push(ev("marked", `${plural(c.markedForRemovalStillEnabled, "account", "accounts")} the last access review marked for removal ${c.markedForRemovalStillEnabled === 1 ? "is" : "are"} still enabled.`))
      if (c.lateDisables > 0) out.push(ev("late", "An account for someone who left stayed enabled more than one business day."))
      return out
    },
  },
  training: {
    live: (f) => f?.access_lifecycle?.api,
    events(c) {
      return c.newAccountsUntrained > 0 ? [ev("untrained", `${plural(c.newAccountsUntrained, "new account has", "new accounts have")} gone 30 days without a training completion.`)] : []
    },
  },
  connected_apps: {
    live: (f) => f?.connected_apps?.api,
    events(c) {
      const out = []
      if (c.consentRestricted !== true) out.push(ev("consent", "Users can now approve new apps without an admin."))
      if (c.unreviewedApps > 0) out.push(ev("grant", "A new app was granted access to mail or files and is not on the reviewed list."))
      return out
    },
  },
  external_exposure: {
    live: (f) => f?.external_exposure?.dns,
    events(c) {
      const out = []
      if (c.openPorts > 0) out.push(ev("ports", "A remote desktop, file share, database or VNC port now answers on your address."))
      if (c.https !== true || c.certValid !== true) out.push(ev("https", "The website no longer serves HTTPS with a valid certificate."))
      if (c.registrarLock !== true) out.push(ev("registrar_lock", "The registrar lock was turned off."))
      if (c.proven !== true) out.push(ev("proven", "A domain or address is no longer proven to be yours."))
      return out
    },
  },
}

export function detectDrift({ previous = {}, current = {}, insurerAnswers = [], now } = {}) {
  const events = []
  for (const control of CONTROLS) {
    if (!control.drift || !previous?.[control.id]) continue
    const spec = LIVE[control.id]
    const c = spec?.live(current)
    if (!c) continue
    const p = spec.live(previous) || null
    for (const e of spec.events(c, p)) events.push({ controlId: control.id, kind: "check", source: control.drift, ...e, at: toDay(c.asOf) })
  }
  for (const a of insurerAnswers || []) {
    const control = CONTROLS_BY_ID[a?.controlId]
    if (!control?.drift || !(a.answer === "yes" || a.answer === true)) continue
    const c = LIVE[control.id]?.live(current)
    if (!c) continue
    const r = RULES[control.rule](current, { now })
    if (r.ok || r.notApplicable) continue
    const when = toDay(a.answeredAt)
    events.push({
      controlId: control.id,
      kind: "insurer",
      source: control.drift,
      key: `insurer:${a.carrier}:${a.questionId}`,
      sentence: `You told ${a.carrier} yes to question ${a.questionId}${when ? ` on ${when}` : ""}, and the latest check does not hold: ${r.reason}`,
      at: toDay(c.asOf),
    })
  }
  return events
}
