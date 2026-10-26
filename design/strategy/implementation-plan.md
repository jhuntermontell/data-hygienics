# Implementation plan

Written 2026-10-26 by the architect role, after reading `design/roadmap.md`, the four reports in `design/strategy/`, and the code they touch. The Path stays the core product and the front door stays as built (commit 3c243ba). The checker is the door into the house.

## 1. Site map v2

| Route | Purpose | Index | Status |
|---|---|---|---|
| `/` | Front door: headline, chips, promise, how the Path works, three doors | yes | built |
| `/check` | "Is this real?" One question, a grid of verdict chips grouped Home and Business | yes | M1 |
| `/check/<slug>` | One verdict page per message type, with share card and Path chip | yes | M1 |
| `/path/home`, `/path/business` | The personal Path (quiz, path, progress); `?start=` pre-picks the first answer and now shows the first step at once | noindex | built, M1 changes |
| `/path/save` | Magic-link save | noindex | built |
| `/steps/<id>` | One public page per Path step, the four tellings, links, "start your path" | yes | M1 |
| `/cards/<slug>` | Printable artifacts (safe-word card, card by the phone, one-page AI rule, "we never change payment details by email" notice) | yes | M2 |
| `/household`, `/business`, `/digital-sovereignty` | Browse layer hubs | yes | built, M2 trims first screen |
| `/threats`, `/guides`, `/digital-sovereignty/<slug>`, `/toolkit`, `/glossary`, `/controls` | Library | yes (controls stays indexable but leaves the nav in M2) | built |
| `/tools/*`, `/pricing` | Business tools | mixed | built; subscription tier hidden in M2 |
| `/about`, `/how-it-works`, `/contact`, `/privacy`, `/terms` | Company | yes | built; About gets a named author in M2 |
| `/.well-known/security.txt`, `/llms.txt`, `/sources` | Trust and crawler surfaces | n/a | M1 (security.txt), M2 (llms.txt, sources) |

Navigation gains one door in M1: "Something just happened?" linking to `/check`, visually distinct from the rest of the bar (the LifeBuoy icon, teal). The roadmap's five-item nav is M2, after the checker has traffic to justify the reshuffle.

Member account and monthly note: the save-my-path account (Supabase magic link, `path_profiles`) already is the member account. M1 does not name it. M3 adds the monthly note; the account becomes the address the note goes to. No new table in M1.

How the pieces fit: search or a shared card lands on `/check/<slug>` or `/steps/<id>`; every verdict and step ends with one chip into `/path/<audience>?start=<value>`; the Path shows the first step immediately; the done ritual nudges a save; the save is the membership.

## 2. Content model

### Verdicts: a new content kind

Pure-data modules at `lib/content/verdicts/<slug>.js`, one per verdict, registered in a new aggregator `lib/verdicts.js` (`ALL_VERDICTS`, `verdicts = ALL_VERDICTS.filter(isVisible)`, `getVerdictBySlug`, `getVerdictsForAudience`). Sources in a new group `lib/content/sources/verdicts.js`, registered in `lib/sources.js`.

```js
export default {
  kind: "verdict",
  slug: "toll-text",
  title: "A text says I owe a toll",            // as people type it; page H1
  chip: "A text about an unpaid toll",           // the /check grid label
  metaTitle: "...", metaDescription: "...",
  audience: ["home"], pillars: ["threats"],
  tldr: "Almost always a scam. Toll agencies don't text for payment.",   // two sentences, no statistics, no markers
  verdict: "...",            // same two sentences as tldr; the first block on the page (kept separate so tldr can later be shorter)
  nextTwoMinutes: ["...", "...", "..."],        // 3 to 4 items, no statistics
  whoToTell: [{ label: "Your bank's fraud line", detail: "...", href: null }, { label: "ReportFraud.ftc.gov", href: "https://reportfraud.ftc.gov/" }],
  sayThis: "If a text asks me to pay a toll, I delete it and check my account in the agency's own app.",   // the if-then line, also printed on the card
  pathChip: { audience: "home", start: "money", label: "Make sure it can't happen again" },
  why: ["...[^src]", "..."],                     // below the fold; markers required on every statistic
  stats: [{ figure: "40%", text: "...", sourceId: "ftc-imposter-trends-2026", locator: "..." }],   // same shape as WHAT_CHANGED
  faqs: [...], related: { threats: [...], guides: [...] },
  datePublished: "2026-10-27", lastReviewed: "2026-10", status: "published",
  sourceIds: [...],
}
```

Rules the validator enforces for `kind: "verdict"` (added to `BY_KIND`, `SHARED` unchanged): required fields `chip, verdict, nextTwoMinutes, whoToTell, sayThis, pathChip, why`; `tldr`, `verdict`, `nextTwoMinutes`, `whoToTell`, `sayThis` may contain no statistic (the existing `uncitedStats` check runs on them and reports an error, not a warning, because these sit above the fold); `why` and `stats` follow the threat rules (every statistic marked, every `sourceId` resolves, published entries need two tier 1-2 sources); `pathChip.audience` must be a quiz audience and `pathChip.start` an option of that quiz's first question; `whoToTell[].href` must be an official domain (`.gov`, or null); the banned-word and "SI" checks run on everything. `CITATION_FIELD_ORDER.verdict = ["tldr", "why", "stats"]` in `lib/content.js`, and `hrefFor` gains `case "verdict": return \`/check/${entry.slug}\``.

No detection language anywhere in a verdict: the validator adds `/\b(detect|spot the fake|tell if it's fake)\b/i` to `BANNED` as a warning for verdicts.

### Steps: public pages from existing data

`/steps/<id>` renders the step found by id across both audiences (`AUDIENCE_PATHS.home.steps` then `business`). Step ids are stored keys and are currently unique across audiences; the validator gains a cross-audience uniqueness error so this stays true. A step's public page shows: title; `after` (new optional field, one present-tense sentence, "what is true after"); `why`; the cadence label; `do` items (items with a `when` clause render with an "if you ..." prefix built from the quiz option label, so nothing is hidden); `sayThis`; `check`; then `simple`, `detail`, `story` as headed sections (all four tellings on one page, for search and for readers); `newcomer`; resolved links; and one chip into `/path/<audience>?start=<first domain>`.

New optional step fields, added never renamed: `after` (string), `sayThis` (string). The "set once or ongoing" label derives from the existing `type` (`setup`, `conversation`, `decision` are "Set once"; `habit`, `rehearsal` are "Ongoing"), with an optional `cadence: "once" | "ongoing"` override. No step data must change for the label to appear. The validator checks `after` and `sayThis` are strings with no statistics, and `cadence` is in the enum.

### End states on stages

`stage.milestone` already is the end-state sentence. The Path renders it as the stage lead ("After this stage: ...") above the summary, always, and keeps the completed treatment. The Long View end states in `long-view.js` stay as they are (they cut across stages). No schema change.

### Artifacts (M2)

`lib/content/cards.js`: `{ slug, title, howToUse, stepId, lines: [...], size: "half" | "card" }`. Rendered at `/cards/<slug>` with a print stylesheet and the same OG card as verdicts. M1 ships the print stylesheet and share block on verdict pages, so every verdict already prints as a half-page card; the dedicated artifact pages reuse that component.

## 3. Cross-cutting

**Open Graph cards.** A shared JSX card at `app/components/og/OgCard.jsx` (brand mark, eyebrow, title, one line, the site name; 1200 by 630) and a factory `lib/og.js` exporting `ogImage({ eyebrow, title, line })` that returns an `ImageResponse` from `next/og`. Per-route `opengraph-image.js` files call it: `app/check/[slug]`, `app/steps/[id]`, `app/guides/[slug]`, `app/threats/[slug]`, `app/digital-sovereignty/[slug]`, and the three hubs. `libraryMetadata` keeps setting `openGraph.images`, but points at the route's own image (`${path}/opengraph-image`) when one exists; the root `og-image.png` stays the fallback. Verdict share cards carry the `sayThis` line instead of the title line.

**Analytics.** `@vercel/analytics` with `<Analytics />` in `app/layout.js`, and a five-line wrapper `lib/analytics.js` exporting `track(name, props)` that no-ops when the package is unavailable. Exactly four events: `chip_clicked { audience, value, from }`, `path_completed { audience }`, `step_done { audience, id, status }`, `path_saved { audience }`. Web Analytics must also be switched on in the Vercel dashboard (owner action; the package alone sends nothing until then).

**security.txt and headers.** `public/.well-known/security.txt` (Contact, Expires one year out, Preferred-Languages, Canonical). `next.config.mjs` gains `headers()` for every route: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (except `/tools/policies/*` if the PDF preview is framed; check), `Permissions-Policy` denying camera, microphone and geolocation. A content security policy is M2: inline JSON-LD, Stripe and Supabase need an audited allowlist and a nonce, and a wrong CSP breaks checkout.

**Structured data.** Verdict pages: `Article` plus `FAQPage` (existing helpers). Step pages: `HowTo` from the `do` list plus `Article`. `organizationSchema` gains `sameAs` once the LinkedIn and Facebook pages exist (M2).

## 4. Milestone 1

Four developers, one working tree, one session. No two streams touch the same file. Developers run `npm run lint` and `npm run validate`; the lead runs `npm run build` once at the end, then the integration step below. Nothing in a stream may depend on a build.

### Lead pre-work (before any stream starts, about 30 minutes)

1. `npm install @vercel/analytics`.
2. Create `lib/analytics.js` (`track` wrapper, no-op without `window`).
3. Create `lib/og.js` and `app/components/og/OgCard.jsx` with a working `ImageResponse`, verified by one throwaway route that is deleted afterwards.
4. Confirm the four files above are committed before streams begin, so every stream imports something that exists.

### Stream A: the checker and six verdicts

Goal: `/check` and six sourced verdict pages with share cards, and the navbar door.

Create: `lib/content/verdicts/toll-text.js`, `bank-fraud-call.js`, `family-voice-call.js`, `clicked-a-link.js`, `package-text.js`, `vendor-new-bank-details.js`; `lib/content/sources/verdicts.js`; `lib/verdicts.js`; `app/check/page.js`; `app/check/[slug]/page.js`; `app/check/[slug]/opengraph-image.js`; `app/components/check/CheckGrid.jsx`, `VerdictArticle.jsx`, `ShareCard.jsx` (client: copy link, native share where available, print; the "Send this to someone you look out for" control with a pre-written calm message).

Modify: `lib/sources.js` (register the group), `lib/content.js` (`CITATION_FIELD_ORDER.verdict`, `hrefFor`, `KIND_LABELS`), `scripts/validate-content.mjs` (verdict kind rules above, step `after`/`sayThis`/`cadence` checks and cross-audience id uniqueness on behalf of streams B and D), `lib/site.js` (`NAV.door`), `app/components/Navbar.jsx` (render the door on desktop and mobile), `app/globals.css` (print rules for `.share-card`).

Must not touch: `lib/content/path/*`, `app/components/path/*`, `app/components/FrontDoor.jsx`, `app/layout.js`, `next.config.mjs`, `app/sitemap.js`, any `app/guides`, `app/threats`, `app/steps` file.

Content rules: verdict copy follows the marketing plan's page structure (section 4 there) and the learning template (end state first, threat named once, action, if-then, no figures above the fold). Sources must be found and opened, with `published` and `accessed` dates recorded; favor FTC consumer alerts and Data Spotlights, FBI IC3 2025 (already registered as `fbi-ic3-2025`), FCC, CISA, USPS, IRS, and the FTC's "what to do if you were scammed" page. Where a report's figure cannot be verified at a URL, leave it out; a verdict with no statistics is still valid.

Acceptance: `npm run validate` reports 0 errors with 6 new published verdict entries; `/check` lists them grouped Home and Business; each verdict page renders the verdict first, then the next two minutes, who to tell, say this, the share card, the Path chip, then why and sources; the navbar door appears on every page; `/check/toll-text/opengraph-image` returns a PNG.

### Stream B: the Path moves

Goal: first click pays, stages lead with their end state, cadence label and if-then line on steps, endowed progress, done ritual, and the four analytics events.

Create: `app/components/path/FirstStep.jsx` (the provisional first step shown when `?start=` is present and no path is complete: build a path with `withDefaults` plus the start answer, pick `thisWeek(...)[0]`, render it read-only with "Make it fit, about two minutes" that scrolls to the quiz and "Skip the questions" that completes the quiz with defaults).

Modify: `app/components/path/PathExperience.jsx` (mount `FirstStep`; `track("path_completed")`), `PathView.jsx` (stage lead from `milestone`; endowed progress count in the reveal as a badge; done ritual sentence after a mark: "Now true: {after}" when the step has `after`, else the stage milestone), `StepCard.jsx` (cadence label from `type` or `cadence`; render `sayThis` as "Say this:"; `track("step_done")`), `SavePath.jsx` (`track("path_saved")`), `app/components/FrontDoor.jsx` (`track("chip_clicked", { from: "front-door" })`), `lib/content/path/home.js` and `business.js` (add `after` and `sayThis` to the foundation stages and to every step a verdict's chip can land on first: at least `f-email-key`, `f-safe-word`, `f-password-manager`, `f-updates`, `f-phone-backup`, `f-credit-freeze`, `money-bank-callback`, `money-alerts`, `sign-in-recovery`, `b-admin-mfa`, `b-payment-callback`, `b-ai-rule`, `b-backups-cloud`, `b-ir-plan`; no stored key changes).

Must not touch: `lib/path.js` (if ordering needs a change, write it down for M2), `scripts/validate-content.mjs`, `lib/site.js`, the navbar, `app/layout.js`, anything under `app/check`, `app/steps`.

Acceptance: `/path/home?start=money` shows the bank-callback step before any question; completing the quiz replaces it with the real path and the first step is marked if it was done; every stage shows its lead sentence; every step shows "Set once" or "Ongoing" with minutes; the 14 steps show "Say this"; `npm run validate` passes with no new warnings about statistics; the four `track` calls fire (verified in the browser console with the no-op wrapper logging in development).

### Stream C: cards, headers, analytics mount

Goal: per-page Open Graph images for the library and hubs, analytics mounted, security.txt and headers.

Create: `public/.well-known/security.txt`; `app/guides/[slug]/opengraph-image.js`, `app/threats/[slug]/opengraph-image.js`, `app/digital-sovereignty/[slug]/opengraph-image.js`, `app/household/opengraph-image.js`, `app/business/opengraph-image.js`, `app/digital-sovereignty/opengraph-image.js`, `app/opengraph-image.js`.

Modify: `app/layout.js` (`<Analytics />`), `app/components/libraryHelpers.js` (`libraryMetadata` takes an optional `image` path and the entry helpers pass the route image), `next.config.mjs` (`headers()`), `lib/schema.js` (leave `sameAs` as a documented empty array for M2).

Must not touch: `lib/site.js`, the navbar, anything under `app/check`, `app/steps`, `app/components/path`, `lib/content/*`, the validator.

Acceptance: each listed route returns a 1200 by 630 PNG at `/opengraph-image`; `curl -I` on any page shows the five headers; `/.well-known/security.txt` serves as text; `npm run lint` passes.

### Stream D: step pages

Goal: `/steps/<id>` for all 132 steps.

Create: `app/steps/[id]/page.js` (static params from both audiences; `generateMetadata` with title as the action and the `after` or `why` sentence as description; `HowTo` and `Article` schema; noindex nothing), `app/steps/[id]/opengraph-image.js`, `app/steps/page.js` (an index grouped by audience and stage, indexable, modest), `app/components/steps/StepArticle.jsx` (server component, the layout in section 2), `lib/steps.js` (`getStepById`, `getStepAudience`, `allStepParams`, reading `AUDIENCE_PATHS` and `resolvePathLinks`).

Modify: nothing shared. `app/components/path/StepCard.jsx` is stream B's; StepArticle does not import it.

Must not touch: `lib/content/path/*`, `lib/path.js`, `app/components/path/*`, the validator, `lib/site.js`, the navbar, `app/sitemap.js`.

Acceptance: `/steps/f-safe-word` and `/steps/b-payment-callback` render all four tellings, the cadence label, links resolved to real pages, and a chip into the right Path; `/steps` lists every step; `npm run lint` passes.

### Lead integration (after all four land)

1. `npm run validate`, `npm run lint`, `npm run build`.
2. `app/sitemap.js`: add `/check`, every published verdict, `/steps` and every step page (priority 0.8 for verdicts, 0.7 for steps).
3. `CLAUDE.md`: site map (checker, step pages, the door), content system (verdict kind, new step fields), the four analytics events.
4. Browser check at desktop and phone width: front door chip to first step; a verdict page's share card prints; the door is in the navbar.
5. Owner actions listed in section 6.

### Cut from milestone 1, and why

- Artifact pages (`/cards`): the verdict print block gives wave 0 a printable per verdict; the safe-word card and card-by-the-phone pages come first in M2 with the same component.
- The IRS verdict and the remaining business verdicts: the hard date is January 5; M2 ships them in November with tax-season sources.
- `sayThis` on all 132 steps: 14 now, the rest in M2 as a content pass with the learning template.
- Nav reduction to five items and inline glossary definitions: a reshuffle while traffic is zero teaches nothing; do it with the hub trim in M2.
- Content security policy: needs an allowlist audit against Stripe and Supabase; a wrong one breaks checkout.
- Member account naming and the monthly note: M3, after the note's content exists twice.
- `llms.txt` and `/sources`: M2, two small pages.

## 5. Milestones 2 and 3

**M2 (November to December).** Depends on M1 and thirty days of analytics.
- Artifact pages at `/cards` (safe word, card by the phone, one-page AI rule, payment-details notice) with print and OG. Depends on the share-card component from stream A.
- Verdicts 7 to 11: IRS call (by January 5), gift-card demand, "someone pasted client data into a chatbot", "my boss texted asking for gift cards", "do I have to report this breach". Same model, no new code.
- `sayThis` and `after` on every step; the business industry stages trimmed to four deep tracks with the government-contractor stage pointing outward.
- Hubs: first screen cut to three items; the sourced "what changed" facts (`lib/content/home.js`) move into the threat sections; Controls leaves the nav; nav to five items; glossary terms as inline definitions (a `Term` component reading `lib/glossary.js`).
- Trust surfaces: `/about` with a named author, photo and why; bylines on verdicts and guides; `llms.txt`; `/sources` index; corrections policy and content changelog page; `Organization.sameAs`.
- Content security policy with nonce, after an allowlist audit.
- Pricing: hide Ongoing Protection; remove legacy plan mentions from public copy; decide the AI policy account wall.
- Owner: Search Console and Bing verified, Facebook page created, Vercel Web Analytics switched on.

**M3 (Q1 2027).** Depends on M2 and on the owner's decisions on the member name and email provider.
- The monthly note: a `notes` content kind (dated, sourced, "what changed and whether your path changed"), a `/notes` archive, and sending through a transactional email provider provisioned via the Vercel Marketplace, to members who opted in on `path_profiles` (new nullable column `note_opt_in`, migration under `supabase/migrations/`).
- Member account named; progress "at a glance" card; two-person steps flagged with a script.
- The five learning hypotheses as two-arm tests using Vercel Flags, one at a time, step-done as the outcome.
- Business tools and the Path on one account and one "where you stand".
- The original study (small-business AI use survey), published as a sourced entry.

## 6. Risks and open decisions

**Risks.**
- `next/og` under `output: "standalone"` needs its font and runtime assets bundled; the lead pre-work proves it on one route before four streams depend on it. Fallback: static PNGs generated by `scripts/generate-icons.mjs`-style tooling.
- Verdict sources: a verdict with an unverifiable figure must drop the figure, not keep it. The validator cannot check truth, only markers; stream A's reviewer reads every source URL.
- Step ids are now public URLs. Renaming one breaks saved paths and links; the uniqueness check and the "never rename" rule in CLAUDE.md are the only guards.
- Concurrent `next build` runs corrupt `.next`; hence developers never build.
- `X-Frame-Options: DENY` may break any page the business tools frame (PDF previews); stream C checks `app/tools/policies` before applying it globally.
- Facebook caches OG cards; the owner uses the Sharing Debugger after launch.

**Open decisions for the owner** (from the marketing plan, plus two from this plan).
1. The checker's name: "Is this real?" at `/check` is assumed; the route name is cheap to change before launch, expensive after.
2. The AI Acceptable Use Policy account wall: recommended free to read and print.
3. The named face on `/about` and bylines: recommended the founder.
4. The member account's name: deferred to M3.
5. Instagram in the first quarter: cross-post only.
6. Step pages at `/steps/<id>` (flat, this plan) rather than `/steps/<audience>/<id>`: flat is shorter and ids are unique; say now if you want the audience in the URL.
7. Figures on verdict pages at all: this plan keeps them below the fold with sources, because they are the citation trail AI search engines reward; the alternative is none on verdicts and all on the linked threat page.
