# Membership UX spec

Written 2026-10-26 by the UI/UX role. Builds on the live homepage (front door, "What changed" band, promise, how the Path works, three doors), the Path (quiz, reveal, stages, step cards, save by magic link), Threat Check, the member assistant at `/tools/ask`, and the pricing page. The salesperson fills the copy slots marked `{…}`; the market analyst sets `{PRICE}`. Headings never end in a period. No fear vocabulary anywhere in this surface.

Design principle: **value first, one ask per screen.** The chips stay the first action on the homepage. Membership is pitched only after someone has seen a path, a verdict or a page of research, and never inside a Threat Check verdict, where a person may be mid-incident.

## 1. The join journey

| Visitor state | Where they are | What they see about membership | The one ask |
|---|---|---|---|
| Anonymous, first visit | Homepage | Nothing above the fold. A `MembershipBand` after the promise; a quiet "Members" link in the navbar | Pick a chip |
| Path built (not saved) | `/path/<audience>` reveal | `JoinCard` under the Reveal: save the path, get the monthly note, and the upgrade line | Save my path |
| Three steps done | Step card done ritual | A one-line `MemberNudge` once, after the third "done" | Keep it going as a member |
| Path saved, signed in free | Path, dashboard | The upgrade line only, with the price | Become a member |
| Anonymous, from search or a share | `/check/<slug>`, `/steps/<id>`, `/guides/<slug>` | Verdict pages: none. Step and guide pages: the standard footer band only | Start the Path |
| Reading pricing | `/pricing` | One membership, a Home door and a Business door, Documentation Pack beneath | Join |
| Non-member on `/tools/ask` | Assistant page | The locked state with three concrete things membership unlocks | Join |
| Member | Dashboard, Path, Ask | "Where you stand," the assistant with its meter, the note archive | None (a settings link) |

Rules that hold everywhere: a visitor is never shown the price before they have seen a path, a verdict or an article. The ask never stacks: if `JoinCard` is on screen, `MemberNudge` does not fire. Threat Check pages carry no membership surface at all; their only chip is "Start my path from here".

## 2. Placements

### (a) Homepage

Order stays: FrontDoor, WhyItMatters, OurPromise, **MembershipBand (new)**, HowThePathWorks, AudienceSplit. The band sits after the promise because the promise is the proof and the band is the ask. The chips remain the first action.

Navbar: add a quiet text link "Members" between "Sign in" and "Map your path" on desktop (`NAV.members = { href: "/pricing", label: "Members" }`), and as the first item in the mobile drawer under the Threat Check door. Signed-in members see "My path" in its place, pointing at the dashboard.

```
┌──────────────────────────────────────────────────────────────────┐
│ navy band                                                         │
│  {MEMBERSHIP}                       ┌─────────────────────────┐   │
│  {Headline, 2 lines max}            │ {PRICE} / month          │   │
│  {One paragraph, 3 sentences}       │ or {ANNUAL} / year       │   │
│                                     │ ✓ {proof 1}              │   │
│  ○ {proof 1}  ○ {proof 2}           │ ✓ {proof 2}              │   │
│  ○ {proof 3}  ○ {proof 4}           │ ✓ {proof 3}              │   │
│                                     │ [ Join for {PRICE} ]      │   │
│  {Guarantee line}                   │ {guarantee short}        │   │
│                                     └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

Component `app/components/MembershipBand.jsx` (server component). Copy slots: `name`, `headline`, `lead`, `proofs[4]`, `guarantee`, `cta`, `price.monthly`, `price.annual`, `price.note`. Copy lives in `lib/content/membership.js` (pure data, no statistics without a source) so the salesperson's text is one file.

### (b) Path reveal

Mounts in `app/components/path/PathView.jsx` directly under the `Reveal` block (the mirror sentence and the endowed-progress badge), above the stages. Component `JoinCard`.

```
┌────────────────────────────────────────────────────────────┐
│ ☑ Your path is on this device.                              │
│ Save it to keep it, and get {NOTE_NAME} on the first of the │
│ month: what changed, and whether your path changed.         │
│ [ Save my path ]   Just email, no password                  │
│ ─────────────────────────────────────────────────────────── │
│ Members also get {proof 1}, {proof 2} and {proof 3}.        │
│ {PRICE} a month. Learn more →                                │
└────────────────────────────────────────────────────────────┘
```

States: path not saved shows the full card; path saved shows only the second half ("You're saved. Members also get…"); member shows nothing. The "Save my path" button opens the existing `SavePath` flow (magic link). The "Learn more" link goes to `/pricing#home` or `/pricing#business` by audience.

### (c) Step done ritual

In `StepCard`'s `DoneRitual`, after the third step marked done or checked on this device (count from `record.progress`), append one line under "Now true": "{Three down. Members get the monthly note so the next ones find you.} Join →". Component `MemberNudge`, fires once per device (flag in the local path record, `nudgedAt`), never while `JoinCard` is visible (it is further up the page; use a 24-hour rule: if `JoinCard` was dismissed or saved in the last day, skip). No modal, no toast.

### (d) Pricing page

Rebuilt around one membership with two doors. Server-rendered copy from `lib/content/membership.js`; the client part is the existing checkout logic.

```
H1  {MEMBERSHIP}
    {One-line promise}

┌─────────── Home ───────────┐  ┌───────── Business ──────────┐
│ For a household             │  │ For a team up to 50          │
│ {PRICE_HOME} / month        │  │ {PRICE_BUSINESS} / month     │
│ ✓ saved path + progress     │  │ ✓ everything in Home         │
│ ✓ monthly note              │  │ ✓ Cyber Audit, full          │
│ ✓ Ask Data Hygienics        │  │ ✓ nine policies, IR planner  │
│ ✓ printable cards           │  │ ✓ quarterly reassessment     │
│ [ Join Home ]               │  │ [ Join Business ]            │
└─────────────────────────────┘  └──────────────────────────────┘
   {Guarantee line, centered}

Documentation Pack, one-time {DOCS_PRICE}: get it in writing without a membership. [ Buy ]

What's free, always: the Path, Threat Check, the library, the AI policy.
FAQ: cancel any time · what the note is · what Ask does and doesn't · data stays yours
```

If the analyst sets one price for both doors, the two cards keep their lists but share the price line. Annual pricing shows as one line under the monthly price ("or {ANNUAL} a year"), not a toggle, unless the analyst recommends annual-first; a toggle is the fallback and is the existing component.

Legacy plans: never shown; the current-plan banner for grandfathered users stays as it is.

### (e) Ask assistant, non-member state

Replace the current link-to-pricing paragraph in `AskChat` with a locked panel: the chat frame rendered but disabled behind a card:

```
┌─────────────────────────────────────────────┐
│ ◌ Ask Data Hygienics is for members          │
│ Answers come only from our research, with   │
│ the page they came from. Try: "My bank      │
│ texted about a transfer. Real?"             │
│ [ Join for {PRICE} ]   Something urgent? Threat Check → │
└─────────────────────────────────────────────┘
```

One example question is the proof. The privacy line ("We never ask for passwords, codes or account numbers; don't paste them here") stays visible under the locked panel.

### (f) Member account and dashboard

The Cyber Audit dashboard becomes the member home for business members; home members get `/path/home` plus a small account strip. Both show, in this order: "Where you stand" (counts per outcome, no score), "This week" (two or three steps), Ask with its meter ("12 of 40 today · 31,000 of 250,000 this month"), the note archive (`/notes`, empty state: "The first note goes out on the first of {month}"), and an account row (email, plan, "Manage billing", "Export my path", "Delete my data"). Business members also see their tools grid beneath. The privacy line about the assistant sits in the account row: "Questions you ask the assistant are processed by Anthropic to produce the answer and are not stored by us."

## 3. The membership band

Surface: navy `#0F172A` on the homepage (it follows the white promise and precedes the grey "how it works"), so the band reads as the second navy moment after "What changed". On white surfaces (pricing, dashboard) the same card uses `bg-white border border-[#E2E8F0]` with navy text.

Hierarchy, desktop (`lg:grid-cols-[1.1fr_0.9fr]`, `max-w-6xl`, `px-4 sm:px-6`, `py-16 sm:py-24`, `gap-12`):
- Eyebrow: `{MEMBERSHIP}` in `text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8]`.
- Headline: `text-3xl sm:text-4xl font-bold tracking-tight text-balance`, white. Two lines maximum, no trailing period.
- Lead: `text-[17px] leading-relaxed text-[#CBD5E1]`, three sentences.
- Proof points: a 2x2 list, each a 20px icon from lucide in `#5EEAD4` and one short line in white. Never more than four.
- Guarantee line: `text-sm text-[#94A3B8]`, under the proofs.
- Price card (right column): `rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8`. Price in `text-4xl font-bold tabular-nums` white with `/ month` in `text-base text-[#94A3B8]`; annual as one line beneath in `text-sm text-[#CBD5E1]`. Three checks (`Check` icon, `#5EEAD4`) restating the top three proofs. Button: white, navy text, `rounded-xl px-5 py-3 text-[15px] font-semibold`, full width of the card, label `Join for {PRICE}`; focus ring `outline-white`. Under the button, one line `text-xs text-[#94A3B8]`: the cancel-any-time line.
- A single secondary text link under the card: "See what's free" to `/pricing#free`.

Phone (below `lg`): single column, price card first after the headline and lead, proofs beneath it, 16px gutters, button full width, no horizontal scroll. Type steps down one size (headline `text-3xl`, price `text-3xl`).

The band carries no statistics. If the salesperson's copy wants a number, it must come from a registered source with a marker, rendered the way WhyItMatters renders its source line.

## 4. Checkout and after

1. "Join" on any surface goes to `/pricing?door=home|business` with the matching card focused, or straight to checkout when the door is already known and the visitor is signed in.
2. Not signed in: a `JoinSheet` (inline panel, not a modal) asks for an email and sends the existing magic link with `next=/pricing?door=…&checkout=1`. Copy: "One email, no password. We use it to sign you in and send the note."
3. Signed in: the existing `handleCheckout` creates the Stripe Checkout session for the membership price. Checkout stays on Stripe.
4. Return URL: `/tools/cyber-audit/dashboard?success=1` for business, `/path/home?joined=1` for home. The return page shows a calm banner: "You're a member. Here's your path." For a home member with no path yet, the banner points at the chips.
5. First member screen: the path with the `JoinCard` gone, the Ask link in the navbar ("Ask"), the note sign-up already on (the email they signed in with) with a one-line "You'll get {NOTE_NAME} on the first of the month. Change this in your account."
6. Entitlement: the webhook maps the membership prices to a plan value; the dashboard reads it through `getPlanAccess`. Home membership is a new plan value; business membership replaces Ongoing Protection and keeps its grants.
7. Failure: a canceled checkout returns to `/pricing?canceled=1` with "No charge was made" and the cards still there.

## 5. Accessibility, motion, states

- Static by default. No entrance animation on any membership surface. If a band animates elsewhere, `useReducedMotion` zeroes it.
- Every button has a visible focus ring; the price card is a `section` with `aria-labelledby` the headline; the proofs are a `ul`.
- Contrast: white and `#CBD5E1` on navy pass; `#94A3B8` on navy is for eyebrow and notes only, never body copy.
- `JoinCard` has a close control ("Not now") that stores a dismissal date locally and hides it for 30 days; the save button is the primary, the dismissal is text.
- Loading: the checkout button shows "Opening checkout…" with the existing spinner and disables; the sheet's magic-link button shows "Sending…" then "Check your email".
- Empty: the note archive's empty state above; the dashboard with no path shows the chips.
- Error: checkout failures render inline under the button in the existing error style, never a toast; the message names what to do ("Try again, or email us").

## 6. Measure

Existing: `chip_clicked`, `path_completed`, `step_done`, `path_saved`. Add two:
- `join_viewed { surface: "band" | "reveal" | "nudge" | "pricing" | "ask" }`, fired once per surface per page view when the ask enters the viewport.
- `join_started { surface, door: "home" | "business" }`, fired when a Join button is pressed, before the sheet or checkout.

The funnel to read monthly: chip_clicked, path_completed, join_viewed (reveal), path_saved, join_started, and Stripe's completed checkouts by door.
