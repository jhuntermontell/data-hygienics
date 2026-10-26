# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Data Hygienics** is the independent field guide to living and working securely alongside AI, for households and small businesses. We research what people need to know about securing their digital life, then educate and direct them: creative, to the point, every number sourced.

- **Home** (`/household`): households, families, parents, adult children helping older relatives, remote workers on personal devices.
- **Business** (`/business`): owner-operators and whoever "got handed IT" at 1-50 person organizations. The paid business tools live here.
- **Digital Sovereignty** (`/digital-sovereignty`): a cross-cutting pillar about owning your data, identity, and choices in an AI-mediated world. Strictly non-partisan.

Independence is the brand: we sell no security products other than our own business tools, take no referral fees, use no affiliate links, and accept no sponsorships.

## Commands

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Build for production (runs validate first via prebuild)
npm run start     # Run production build
npm run lint      # ESLint (flat config; next lint no longer exists in Next 16)
npm run validate  # Validate research content: sources, citations, links, tone
```

There are no tests. Run `npm run validate` after any content change and `npm run build` before pushing; a content error fails the build. To review draft content locally, run `NEXT_PUBLIC_SHOW_DRAFTS=1 npm run dev`.

## Stack

Next.js 16 App Router, React 19, JavaScript (no TypeScript), Tailwind CSS v4, framer-motion, lucide-react, @react-pdf/renderer, Supabase (auth + data), Stripe (checkout + webhooks). `proxy.js` is the middleware; it guards the `PROTECTED_ROUTES` prefixes under `/tools/*`.

**Styling**: light theme. Tokens live in `app/globals.css` `:root` (primary `#1D4ED8` for Business, teal `#0F766E` for Home, text `#0F172A` / `#475569` / `#94A3B8`, surface `#F8FAFC`, border `#E2E8F0`). Tailwind utility classes inline in JSX. `public/output.css` is a stale compiled artifact.

**Brand** (Continuous Fold, `design/brand-book/`): navy `#0F172A` = Judgment, cobalt `#1D4ED8` = Clarity, Action Teal `#0F8F83` = Action, Field White `#F8FAFC`. Brand teal is about 4:1 on white, so use it for fills, icons and large type only; body-size teal text and white-on-teal buttons stay `#0F766E`. Never retype the wordmark: use `/logo.svg` (the outlined lockup), `app/components/BrandMark.jsx` for the inline mark, and `app/components/pdf/BrandLockupPdf.jsx` in PDFs. Mark geometry lives in `lib/brand/mark.js`; `node scripts/generate-icons.mjs` regenerates favicons, app icons, the OG image, `public/brand/*` and `lib/brand/wordmark.js` from the masters.

**Navbar**: `app/components/Navbar.jsx` is fixed-position and must be imported and rendered at the top of each page. There is no global layout that includes it. Navigation and footer links come from `lib/site.js` (`NAV`, `FOOTER_COLUMNS`). The primary bar is For Home and For Business; Digital Sovereignty heads the Library menu.

**Contact form** submits to Formspree via `fetch`.

## Site map

- `/` homepage, the Clear Path front door: "What would you hate to lose?" chips (`#start`, `app/components/FrontDoor.jsx`), then the reported-losses section (the FBI IC3 chart from `LOSSES_BY_YEAR` in `lib/content/home.js`, `app/components/WhyItMatters.jsx`), our promise, how the Path works, and the three doors. Hubs `/household`, `/business`, `/digital-sovereignty`
- Threat Check (secondary line "Is this real?"): `/check` (the grid of verdict chips) and `/check/[slug]` (one verdict per message type, with a share card and a Path chip). The navbar door `NAV.door` points here on every page.
- Clear Path: `/path/home` and `/path/business` (personal paths, noindex; `?start=<option>` pre-picks the first answer and shows a provisional first step before any question, `app/components/path/FirstStep.jsx`)
- Step pages: `/steps` and `/steps/[id]`, one indexable public page per Path step across both audiences (`lib/steps.js`, `app/components/steps/StepArticle.jsx`). Step ids are public URLs now: never rename one.
- Research library: `/threats`, `/threats/[slug]`, `/guides`, `/guides/[slug]`, `/digital-sovereignty/[slug]` (explainers), `/toolkit`, `/glossary`, `/controls`, `/controls/[slug]`
- Business tools: `/tools`, `/tools/cyber-audit/*`, `/tools/policies/*`, `/tools/ir-plan/*`, `/pricing`
- Company: `/about`, `/how-it-works` ("How we work"), `/contact`, `/privacy`, `/terms`
- Retired URLs 301 in `next.config.mjs` (`/vendors*`, `/vendor-reviews`, `/tools/vendor-scorecard*` to `/toolkit`; `/threats/legal` to `/threats`; `/why-data-hygienics` to `/how-it-works`; `/start` and `/path` to `/`).

## Content system

All research content is pure-data JS modules under `lib/content/` (import-free so `scripts/validate-content.mjs` can load them in Node):

- `lib/content/threats/<slug>.js`, `guides/<slug>.js`, `explainers/<slug>.js`, `verdicts/<slug>.js`: one entry per file, `export default { kind, ... }`
- `lib/content/toolkit.js`, `glossary.js`, `sovereignty.js` (PRINCIPLES), `home.js` (WHAT_CHANGED)
- `lib/content/sources/<group>.js`: source records `{ id, label, publisher, url, published, type, tier, accessed, notes }`

Aggregators own registration and expose getters: `lib/threats.js`, `lib/guides.js`, `lib/sovereignty.js`, `lib/verdicts.js`, `lib/toolkit.js`, `lib/glossary.js`, `lib/sources.js`, plus `lib/library.js` (latest, related resolution, hub content). **Adding an entry means creating the file and importing it in its aggregator.** Helpers live in `lib/content.js`.

Rules:
- Prose fields are plain text. Cite inline with `[^source-id]` right after the claim; `citationOrder()` numbers sources by first appearance in the order given by `CITATION_FIELD_ORDER`, so article renderers must lay fields out in that order.
- Every statistic carries a marker, every cited id is listed in `sourceIds`, and published entries need at least two tier 1-2 sources (government, standards, regulation, or methodology-backed reports). Record `published` and `accessed` dates on every source.
- Entries have `status: "draft" | "published"`; only published entries render in production and appear in the sitemap.
- Toolkit URLs are clean vendor URLs. Never add affiliate or tracking parameters (the validator rejects them).
- Industry briefs (`kind: "industry-brief"`, healthcare and financial) keep hand-authored HTML in `content`; markers inside that HTML are converted by `htmlWithCitations()`.
- Verdicts (`kind: "verdict"`, the Threat Check, rendered at `/check/<slug>`): `tldr`, `verdict`, `nextTwoMinutes`, `whoToTell` and `sayThis` sit above the fold and may carry no statistic or marker at all (the validator errors); figures live only in `why` and `stats` with sources. `whoToTell[].href` must be an official `.gov` address or null, `pathChip.start` must be an option of that quiz's first question, and detection wording ("detect", "spot the fake") is rejected.

## Clear Path

The personal, ordered path for a home or business. Free, and local-first: answers and progress live in the browser (`lib/path/storage.js`, `lib/hooks/usePathRecord.js`) and sync to Supabase `path_profiles` only for signed-in users (`supabase/migrations/20261023_path_profiles.sql`; the Path keeps working locally if the table is missing).

- Content is pure data in `lib/content/path/`: `quiz.js` (questions; option values are stored keys), `home.js` and `business.js` (stages and steps; step ids are stored keys), `long-view.js` (end states, "What we cut", routines). Logic is in `lib/path.js` (inclusion via `when`/`unless`, stage and step ordering, "this week", "Where you stand"); `lib/path-links.js` resolves step link keys like `guide:slug` on the server.
- Steps are written once and told four ways (`do`, `simple`, `detail`, `story`); knowledge level adds `newcomer` or shows "go further". Steps carry no citations, so they carry no statistics; link to the sourced library entry instead. The validator checks links, quiz keys, enums and tone.
- Steps may carry optional `after` (one present-tense sentence of what is true afterwards), `sayThis` (an if-then line to say aloud) and `cadence: "once" | "ongoing"`; the "Set once" or "Ongoing" label otherwise derives from `type`. Add fields, never rename keys.
- Horizons (`lib/horizons.js`): `now`, `next`, `future` ("Long View", always five years out, never hard-coded). The glossary tags every term with one. Horizons are directions, never deadlines: no dates or countdowns on steps.
- Progress is counts per outcome (Hard to break into, Hard to fool, Quick to recover, In your control). No composite score or grade; the Cyber Audit does grading.
- Analytics (`lib/analytics.js`, Vercel Web Analytics): exactly six events, `chip_clicked`, `path_completed`, `step_done`, `path_saved`, and the membership funnel pair `join_viewed`, `join_started`. Do not add events without a reason written down.

## Voice and terminology

- Plain English, second person, active voice, short paragraphs. Creative headlines, literal instructions. Translate acronyms on first use.
- Titles, headings, eyebrows, card titles, button and nav labels never end with a period (internal periods stay; question and exclamation marks stay). Body copy keeps its periods. The validator warns on content titles that end with one.
- No fear-mongering ("lurking", "unprecedented", "rapidly evolving landscape", "guarantee", countdowns). Numbers only with a named, dated source.
- **"AI" is the public term.** "SI" (superintelligence) appears only in the glossary, the stance explainer `/digital-sovereignty/ai-or-si-what-we-call-it`, the Digital Sovereignty hub's GlossaryTeaser that defines it, `SITE.terms` in `lib/site.js`, and when quoting US federal notices (Executive Order 14434 of Sept 29, 2026 directs federal agencies to say "Super Intelligence"; translate it for readers on first use). If the stance changes, change those places, not copy site-wide.
- Say "IT provider" or "outside IT company", never "MSP", in user-facing copy.

## Business tools and entitlement

- `lib/stripe/access.js` `getPlanAccess(plan, status, purchases, isAdmin)` is the single source of truth for feature flags. `profiles.is_admin` short-circuits to full access.
- Current catalog: Data Hygienics Membership (plans `member_home` and `member_business`, monthly or annual, plus founding annual prices that sunset for new checkouts at `FOUNDING_UNTIL` in `lib/stripe/prices.js` while existing subscriptions keep their rate) and the Documentation Pack (one-time). Pitch copy and prices live in `lib/content/membership.js`; test-mode products and prices are created idempotently by `node scripts/stripe-setup-test.mjs` (refuses live keys). Ongoing Protection (`protection`) is retired from sale but still mapped and honored. Grandfathered plans `starter`, `professional`, `msp`, and `agency` keep their entitlements and render with "(Legacy)" labels; they are never offered for sale. `lib/stripe/prices.js` placeholders fail closed (checkout rejects them).
- The Cyber Audit appends a shared "AI Use and Data Handling" section (`lib/questions/shared/ai-use.js`) to every industry bank; unanswered sections marked `introduced` don't count against older assessments. The legal track is retired: it can't be chosen for new assessments, but `lib/questions/retired/legal.js` is a frozen copy that stored Legal assessments keep loading so their gaps, remediation, and grade stay accurate. Don't edit or extend it.
- The AI Acceptable Use Policy is free and featured first in the Policy Library. The IR Planner includes AI scenarios (`deepfake_wire`, `ai_data_leak`) and incident types (`deepfake_fraud`, `ai_data_exposure`).
- Don't rename stored keys (e.g. IR builder `is_msp`, remediation `mspQuestion`); saved plans and assessments depend on them.

### Membership surfaces

Joining appears once per page and never inside a Threat Check verdict, a step's do-list, the first-step card or the quiz, and never as a popup or countdown. Surfaces: the navbar "Members" link (`NAV.members`), `app/components/MembershipBand.jsx` on the homepage, the `JoinCard` in the Path reveal (free save first, membership second; "Not now" stores `answers.joinDismissedAt` for 30 days), the `MemberNudge` after the third completed step (`answers.nudgedAt`, once per device), the pricing page (`app/pricing/PricingPage.jsx`, two doors, the Pack, "what's free, always", the FAQ), and Ask's locked state. The join sheet returns through `/auth/callback?next=/pricing?door=…&checkout=1` (allowed in `lib/utils/safe-redirect.js`). Home members return from checkout to `/path/home?joined=1`.

### Member assistant

"Ask Data Hygienics" (`/tools/ask`, `app/components/assistant/AskChat.jsx`, `app/api/assistant`) answers members' questions from the published library only, gated by `canAccessAssistant` (both membership plans, every grandfathered paid plan and the Documentation Pack). Silo: our published research only, cite the page, "We don't know yet" when it's silent, cybersecurity and digital hygiene only, no outside statistics or vendor pitches, never ask for passwords, codes or account numbers. Logic lives in `lib/assistant/` (relative imports only, so the harness runs in plain Node): `corpus.js` (documents and chunks), `retrieve.js` (BM25), `prompt.js` (frozen `SYSTEM_PROMPT`, cached), `pipeline.js` (shared request shape: `claude-sonnet-5-5`, effort low, `fallbacks: "default"`), `limits.js` (model, caps, prices), `usage.js`. Caps (question length, 40 messages a day, 600,000 tokens a month, about fifty questions) live in `limits.js`; usage is counted per member per month in `assistant_usage` (`supabase/migrations/20261027_assistant_usage.sql`), and a missing table fails closed with a 503. Compare models with `node scripts/assistant-eval.mjs` (`--dry` for retrieval only, `--only sonnet|haiku`); reports land in `output/assistant-eval/`.

## Removed in the 2026-10 pivot (do not reintroduce)

The Agency/MSP plan and its multi-client and branded-report features; the legal industry track; insurance carrier mapping (carrier readiness, proof pack, "insurance-ready" messaging); vendor security scorecards. Generic insurer context ("insurers often ask about this", the `cyber-insurance` control, IR plan insurance contacts) is fine.

## Environment

The news feed route `app/api/news/refresh` is triggered externally with `CRON_SECRET` and uses `ANTHROPIC_API_KEY`. Supabase and Stripe keys come from Vercel environment variables (`vercel env pull`).
