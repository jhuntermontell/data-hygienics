# lib/verified

The rules engine for Data Hygienics Verified, step 1 of the build order in `design/verified/baseline.md` section 8.

- `baseline.js`: baseline `2027.1` as data. The seventeen controls with the fields from spec section 1, plus `GROUPS`, `STATES`, `PROOF_TYPES` (with their public labels), `RETIRED`, the policy sets per industry overlay and the MFA minimum tier.
- `rules.js`: one predicate per control over a plain facts object. The facts each rule reads are documented in a comment above it. `pick` applies the proof rules: strongest first, `attested` only where a control allows it, and no weaker proof once a stronger method is available (a connected tenant, a generated record).
- `evaluate.js`: `evaluate({ record, facts, now })` returns one line per control with `state`, `tier` (MFA only), `proofType`, `passedAt`, `validUntil` and `reason`. No score, grade, percentage or count.
- `drift.js`: `detectDrift({ previous, current, insurerAnswers })` returns a plain-English event for each contradiction a live check finds, against the last passed facts or a "yes" the owner gave an insurer.
- `dates.js`: day arithmetic in UTC.

## Where the record lives (step 2)

- `supabase/migrations/20261105_verified.sql`: the tables of spec section 5 (`verified_records`, `verified_controls`, `verified_evidence`, `verified_checks`, `verified_connections`, `insurer_answers`), their row-level security, and the view `verified_public`, the only relation a public page reads. Applied by hand in the Supabase dashboard.
- `lib/verify/record.js`: reads the view for the verify page; `app/verify/[slug]/page.js` and `app/components/verify/VerifyRecord.jsx` render it. Labels come from `baseline.js`; the view carries ids.
- `scripts/verified-seed-own.mjs`: writes our own record (`/verify/data-hygienics`) from `scripts/verified-own-facts.mjs` plus a live DNS lookup, through `evaluate()`. `--dry` evaluates without a database.

## Rules for this folder

- Nothing here calls a network, a database or a model. Facts come in as plain objects; states go out as plain objects. Checks, uploads and the Hygienist's extraction live elsewhere and only produce facts.
- The rules alone decide a control's state. Nothing AI-shaped belongs here.
- Relative imports only, so plain Node runs it.
- Control ids, group ids, state ids, proof type ids, policy ids and `only` condition ids are stored keys. Never rename one. A control that changes meaning gets a new id, and the old one moves to `RETIRED` with a `retiredAt` date.
- Public copy (names, promises, tier text, labels) never says certified, compliant, secure, protected, safe, pass, grade or score.

## Checking it

```bash
node scripts/verified-check.mjs            # fixtures: every control in every state it can reach
node scripts/verified-check.mjs --verbose  # print every check, not only failures
npm run validate                           # includes the Verified section
```

The harness exits non-zero on any failure. The validator's Verified section keeps `VERIFIED_LEDGER`, an append-only list of every control id ever shipped; an id that leaves `CONTROLS` without a dated entry in `RETIRED` fails the build.
