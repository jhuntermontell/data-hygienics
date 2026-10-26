# Membership implementation plan

Architect role, 2026-10-26. Built from `membership-pitch.md`, `membership-pricing.md` and `membership-ux.md`, and from the code they touch. Target: a membership that works end to end in Stripe **test mode** on this branch, with the owner's live keys as the only step left for launch. Assumes the copy and structure changes now in flight (periods off headings, Threat Check rename, Digital Sovereignty into the Library menu, the route graphic) have landed first.

## 1. Product model

**One membership, two doors, two prices.** The salesperson's "one price" and the analyst's "one home price, one business price" are reconciled this way: one product name (Data Hygienics Membership), one pitch, one account, and a door chosen at checkout that sets the price and the grants. The pricing page shows both doors side by side; the homepage band shows the home price with "Business from $39" beneath it.

| Door | Monthly | Annual | Founding annual (first 90 days, then retired) | Covers |
|---|---|---|---|---|
| Home | $8 | $69 | $59 | everyone at the address, both paths |
| Business | $39 | $390 | $349 | one organization up to 50 people, both paths |
| Documentation Pack | $299 one-time (unchanged) | | | the kit in writing; see conversion below |

**How the door is stored: two plan values, `member_home` and `member_business`.** No new column. Reasons: `getPlanAccess` switches on the plan string, the webhook maps price to plan through one table, promo codes carry a plan string, and the dashboard labels are keyed by plan. Two values slot into every one of those without touching their shape. A `tier` column would need a schema change plus a second lookup at every call site. Schema change is one line: extend the `subscriptions_plan_check` constraint. Never rename existing values; `protection`, `agency`, `starter`, `professional`, `msp` stay honored.

**Founding rate: separate Stripe prices, sunset in code.** Two extra prices (`foundingHomeYearly`, `foundingBusinessYearly`) and one constant, `FOUNDING_UNTIL = "2027-01-25"` (90 days from a 2026-10-27 launch; adjust at launch). Before that date the pricing page shows the founding annual price in place of the list annual price and labels it "Founding rate, locked for life"; after it, the slots stay configured (renewals keep billing at the founding price, which is how "locked for life" works in Stripe without a coupon) but `getNewCheckoutPriceIds()` drops them and the checkout route refuses new sessions for them. No coupon codes, no countdown, nothing to administer.

**Documentation Pack conversion: manual for now.** The analyst's simpler rule (the Pack converts to the first year of Business membership at no charge) is honored by a 100%-off-12-months coupon the owner creates once in the Stripe dashboard (name `PACK_TO_MEMBER`, restricted to the business prices) and applies by hand when a Pack buyer emails. The pricing page says exactly that: "Bought the Pack? Email us and your first year of Business membership is on us." The "member price on the Pack" line from the pitch is not wired and is left out (pitch checklist item 8).

**Ongoing Protection retires from sale.** Its prices stay in `PRICES` and `LEGACY`-style handling so the webhook and the billing portal keep working for anyone who holds it, but it leaves `getNewCheckoutPriceIds()` and the pricing page. Business membership is its replacement at a lower price; nobody could buy it, so nothing is grandfathered.

## 2. Entitlement

Add two cases to `accessFromPlan` in `lib/stripe/access.js`:

- `member_home`: `canAccessAssistant = true`. Nothing else. The saved Path is account-based already (`path_profiles`), so "your Path on every device" needs no flag; membership is what makes the account worth having.
- `member_business`: identical to `protection` today: `canTakeAssessment`, `canDownloadReports`, `canAccessPolicies`, `canAccessIRPlan`, `canAccessNewsFeed`, `canAccessQuarterlyReview`, `canAccessAssistant`, all true.

`adminAccess()` and `emptyAccess()` are unchanged. `isLegacyPlan()` is unchanged (membership is current, not legacy). `PLAN_LABELS` in the dashboard gain the two values ("Membership (Home)", "Membership (Business)"); `PLAN_FEATURES` likewise.

**Assistant cap: raise `MONTHLY_TOKEN_CAP` from 250,000 to 600,000.** Keep `CONTEXT_TOKEN_BUDGET` at 12,000 and `DAILY_MESSAGE_CAP` at 40. Why raise rather than shrink context: the harness showed retrieval actually sends 1,300 to 7,000 tokens of sources per question, so a typical exchange is 9,000 to 12,000 tokens, not 20,000; 600,000 is roughly 50 ordinary questions a month and 30 worst-case ones. Cost ceiling per member per month at the cap: about 550,000 input tokens of which most are cache reads at $0.20 per million plus fresh input at $2 per million, call it $0.35, plus 30 answers at 600 output tokens at $10 per million, $0.18: about $0.55, against the analyst's $1.64 all-in floor at 1,000 members and an $8 price. A member who hits 600,000 tokens is the power user we want. Update the meter copy and the pricing FAQ ("about fifty questions a month" is the honest phrasing; never promise unlimited).

`lib/assistant/auth.js` `NOT_MEMBER_MESSAGE` changes to "Ask Data Hygienics is for members. See /pricing."

## 3. Stripe

### Products and prices to create (test mode)

`scripts/stripe-setup-test.mjs`, run with `node scripts/stripe-setup-test.mjs` from the repo root. It reads `STRIPE_SECRET_KEY` from `.env.local` (refuse to run unless the key starts with `sk_test_`), uses the `stripe` package already in dependencies, and is idempotent through Stripe **lookup keys** on prices and a `dh_key` metadata field on products: list by `lookup_keys` first, create only what is missing, never duplicate. It prints a ready-to-paste `PRICES` block.

| Product (name, `metadata.dh_key`) | Price lookup key | Amount | Interval | Price metadata |
|---|---|---|---|---|
| Data Hygienics Membership (Home), `member_home` | `dh_member_home_monthly` | $8.00 | month | `door=home`, `plan=member_home` |
| | `dh_member_home_yearly` | $69.00 | year | `door=home`, `plan=member_home` |
| | `dh_founding_home_yearly` | $59.00 | year | `door=home`, `plan=member_home`, `founding=true` |
| Data Hygienics Membership (Business), `member_business` | `dh_member_business_monthly` | $39.00 | month | `door=business`, `plan=member_business` |
| | `dh_member_business_yearly` | $390.00 | year | `door=business`, `plan=member_business` |
| | `dh_founding_business_yearly` | $349.00 | year | `door=business`, `plan=member_business`, `founding=true` |
| Documentation Pack, `docs_pack` | `dh_docs_pack` | $299.00 | one-time | `purchase_type=docs_pack` |

Product statement descriptor: "DATA HYGIENICS". Tax behavior: leave default (the owner decides tax settings in the dashboard). Do not create Ongoing Protection products; do not touch the legacy test products.

### `lib/stripe/prices.js`

`PRICES` and `LIVE_PRICES` gain slots: `memberHomeMonthly`, `memberHomeYearly`, `memberBusinessMonthly`, `memberBusinessYearly`, `foundingHomeYearly`, `foundingBusinessYearly`. `docsPack`, `protectionMonthly`, `protectionYearly` stay. Add `export const FOUNDING_UNTIL = "2027-01-25"` and `export function foundingOpen(now = new Date())`.

Accessors to update, each with the new slots:
- `getActivePriceToPlan()`: the six membership slots map to `member_home` or `member_business`; protection stays mapped to `protection`.
- `getSubscriptionPriceIds()`: add the six (portal and renewals must recognize them, founding ones forever).
- `getNewCheckoutPriceIds()`: `docsPack`, the four list membership prices, and the two founding prices **only while `foundingOpen()`**; remove `protectionMonthly` and `protectionYearly` from this list.
- `isAnnualPriceId()`: true for `memberHomeYearly`, `memberBusinessYearly`, both founding, and `protectionYearly`.
- New `doorForPriceId(priceId)` returning `"home" | "business" | null` from the slots, used by the checkout route for the success URL and by the pricing page.
- The live-mode guard checks every `LIVE_PRICES` slot, including the new ones; the duplicate-ID check needs no change.

### Webhook

`planForPriceId` already reads `getActivePriceToPlan()`; with the map updated, `checkout.session.completed` and `customer.subscription.updated` store `member_home` or `member_business` with no code change in the webhook itself. The dev on this stream verifies that by reading the two handlers, and adds `door` from `subscription.metadata.door` to nothing (not stored; plan encodes it).

### Checkout route

`app/api/stripe/create-checkout-session/route.js`:
- Accept the new price IDs through the existing allow-list (no change needed once `getNewCheckoutPriceIds` is updated), and reject founding prices after `FOUNDING_UNTIL` with "That rate has ended" (400).
- Success URL by door: `member_home` prices return to `${origin}/path/home?joined=1`; business and Pack return to `${origin}/tools/cyber-audit/dashboard?welcome=true` as today. Cancel URL becomes `${origin}/pricing?canceled=1`.
- Add `door` to `session.metadata` and to `subscription_data.metadata` (whitelisted from `doorForPriceId`, never from the client body).

### Migration

`supabase/migrations/20261027_membership_plans.sql`: drop and re-add `subscriptions_plan_check` with `('free', 'starter', 'professional', 'msp', 'protection', 'agency', 'member_home', 'member_business')`, idempotent, in the style of `20260411_pricing_restructure.sql`. No other DDL.

## 4. UI

Copy is verbatim from the pitch (section 3) with `{PRICE}` resolved from the pricing report; all headings without a trailing period; nothing on Threat Check verdict pages.

**`lib/content/membership.js`** (pure data, created by the lead before streams start so every stream imports the same thing): `MEMBERSHIP = { name, cta: "Become a member", ctaShort: "Join", headline, subhead, proofs: [5], guarantee, exit, free: [...], homepage: { eyebrow, headline, body, cta, secondary }, reveal: { headline, body, save, join }, ask: { headline, body, example }, pricing: { h1, line, home: { title, who, includes[] }, business: {...}, pack: {...}, freeAlways: [...], faq: [...] }, prices: { home: { monthly: 8, yearly: 69, founding: 59 }, business: { monthly: 39, yearly: 390, founding: 349 }, pack: 299 } }`. Formatting helpers live in the components, not here. No statistics.

**Homepage** (`app/page.js`): order becomes FrontDoor, WhyItMatters, OurPromise, **MembershipBand**, HowThePathWorks, AudienceSplit. `app/components/MembershipBand.jsx` is a server component on navy per the UX spec section 3: eyebrow "Membership", headline "Someone to ask, when a message doesn't feel right", the homepage body, four proofs (Ask, Path everywhere, independent by rule, free stays free), guarantee line, and the price card: "$8 / month", "or $69 a year", under it "Business from $39 a month", three checks, button "Join for $8" to `/pricing?door=home`, secondary "See what's free" to `/pricing#free`. A small client island (`JoinLink.jsx`, shared by every surface) wraps the button to fire `join_started { surface, door }`, and a `JoinViewed` island fires `join_viewed { surface }` once when the band enters the viewport (IntersectionObserver, no motion).

**Navbar**: `NAV.members = { href: "/pricing", label: "Members" }` in `lib/site.js`; rendered as a quiet text link between "Sign in" and "Map your path" for signed-out visitors, and as "My path" to `/path/home` for signed-in users whose plan is `member_home` (the navbar already knows the user; it reads the cached subscription through `getSubscription`), otherwise unchanged. Mobile drawer: first item under the Threat Check door.

**Pricing page** (`app/pricing/page.js`, rebuilt, still a client component for checkout): H1 "Keep your digital life in order, with someone to ask", the subhead, then two door cards (Home, Business) per the UX wireframe, each with monthly price large, "or $69 a year" line (replaced by "Founding rate: $59 a year, locked for life" while `foundingOpen()`), the includes list, and a "Join Home" / "Join Business" button. `?door=home|business` focuses that card (ring and scroll). Beneath: the guarantee line, the Documentation Pack card (one-time $299, "Buy the Pack", the conversion sentence), the "What's free, always" block (`id="free"`), the five objections as an FAQ, the promo code input, and the existing legacy-plan banner. Ongoing Protection and the monthly/annual toggle are removed; annual is a line under each monthly price, with its own smaller "Join yearly" text button so both prices are purchasable. Signed-out visitors who press Join get the inline `JoinSheet` (email, magic link, `next=/pricing?door=…&checkout=1`); on return with `checkout=1` and a session, the page starts checkout for that door's monthly price automatically. `?canceled=1` shows "No charge was made". Checkout errors render inline as today.

**Path reveal** (`app/components/path/PathView.jsx`): replace the body of `SaveCard` with the `JoinCard` from the UX spec section 2(b): path not saved shows "Keep this path, and get someone to ask", the save-first body, "Save my path (free)" to `/path/save?for=<audience>` and "Become a member ($8 a month)" to `/pricing?door=<audience>`; path saved shows only "You're saved. Members also get Ask: answers from our research for the moments a step raises a question, or a message does. $8 a month. Learn more"; member (plan starts with `member_`) shows the existing "Saved to your account" line only. A "Not now" text control stores `joinDismissedAt` in the local record (a new optional key; never renamed) and hides the member half for 30 days. The component fires `join_viewed { surface: "reveal" }` once.

**Member nudge** (`app/components/path/StepCard.jsx` `DoneRitual`): after the third handled step on this device (`record.progress` count), one line under "Now true": "Three down. Members get someone to ask when the next one raises a question. Join" linking to `/pricing?door=<audience>`; fires once (`nudgedAt` in the local record), never for members, never within 24 hours of `joinDismissedAt`. The UX spec's monthly-note wording is replaced with the Ask wording because the note is not sold yet (pitch rule).

**Joined return** (`app/components/path/PathExperience.jsx`): `?joined=1` with a signed-in member renders a calm banner above the path, "You're a member. Here's your path", or above the chips when no path exists; dismissed by any click, no persistence needed.

**Ask non-member state** (`app/components/assistant/AskChat.jsx` `NotMember`): the locked panel from the UX spec section 2(e): headline "Ask Data Hygienics is for members", one line, the example question, "Join for $8" to `/pricing?door=home`, "Something urgent? Threat Check" to `/check`, the privacy line kept beneath. Fires `join_viewed { surface: "ask" }`.

**Dashboard** (`app/tools/cyber-audit/dashboard/page.js`): `PLAN_LABELS` and `PLAN_FEATURES` for the two member plans; the welcome banner works unchanged for `member_business`; the Ask row shows the usage meter numbers from `/api/assistant/usage` for members; the account area gains "Manage billing" (existing portal call), "Export my path" and "Delete my data" links to the Path's existing export and delete, and the assistant privacy sentence: "Questions you ask the assistant are processed by Anthropic to produce the answer and are not stored by us."

**Events** (`lib/analytics.js`, lead pre-work): `EVENTS.joinViewed = "join_viewed"`, `EVENTS.joinStarted = "join_started"`. CLAUDE.md's "exactly four events" line becomes six, with the reason written down (the membership funnel).

## 5. Workstreams

Three developers, one tree, disjoint files. Developers run `npm run lint` and `npm run validate` only; the lead builds. The lead does pre-work first.

### Lead pre-work (before any stream)
1. `lib/content/membership.js` with the shape in section 4 and the pitch copy filled in.
2. `lib/analytics.js`: the two new events.
3. Commit both so every stream imports something that exists.

### Stream 1: commerce and entitlement
Goal: the membership exists in Stripe test mode, maps to plans, grants access, and the assistant cap is raised.
- Create: `scripts/stripe-setup-test.mjs`, `supabase/migrations/20261027_membership_plans.sql`.
- Modify: `lib/stripe/prices.js` (slots, `FOUNDING_UNTIL`, `foundingOpen`, `doorForPriceId`, accessors), `lib/stripe/access.js` (two cases), `app/api/stripe/create-checkout-session/route.js` (founding sunset, success URL by door, `door` metadata), `app/api/stripe/webhook/route.js` (read-through verification; comment only unless a change is needed), `lib/assistant/limits.js` (cap 600,000), `lib/assistant/auth.js` (message).
- Must not touch: anything under `app/components`, `app/pricing`, `app/page.js`, `lib/site.js`, `app/tools/cyber-audit/dashboard`, CLAUDE.md.
- Acceptance: running the script twice creates seven prices once and prints the same IDs; `PRICES` filled with them; `node -e` import of prices.js shows `getNewCheckoutPriceIds()` returning the five list prices plus two founding prices and no protection prices; `getActivePriceToPlan()` maps each membership price to the right plan; `getPlanAccess("member_home","active")` has only `canAccessAssistant` true and `getPlanAccess("member_business","active")` matches `protection`; the migration is idempotent by inspection; lint and validate pass.

### Stream 2: homepage, navbar, pricing page
Goal: the band, the Members link, and the rebuilt pricing page with working checkout buttons.
- Create: `app/components/MembershipBand.jsx`, `app/components/membership/JoinLink.jsx`, `app/components/membership/JoinViewed.jsx`, `app/components/membership/JoinSheet.jsx`.
- Modify: `app/page.js`, `lib/site.js` (`NAV.members`), `app/components/Navbar.jsx`, `app/pricing/page.js`.
- Must not touch: `lib/stripe/*`, API routes, anything under `app/components/path`, `app/components/assistant`, the dashboard, `lib/content/membership.js` (read only), CLAUDE.md.
- Note: the pricing page reads price IDs from `getActivePrices()` and `foundingOpen()` from `lib/stripe/prices.js`, which stream 1 is editing; import the names agreed above and, until stream 1 lands, the page renders with placeholder IDs and buttons disabled ("Checkout opens soon") through the existing `isConfiguredPriceId` guard.
- Acceptance: homepage order as specified and the band renders without JS except the two islands; "Members" in the navbar signed out; `/pricing` shows two doors, the Pack, the free block and the FAQ, no Ongoing Protection, no toggle; `?door=business` focuses the Business card; `?canceled=1` shows the line; headings carry no trailing period; phone width has no horizontal overflow; lint passes.

### Stream 3: Path, Ask, dashboard
Goal: the join moments after value, and the member's own screens.
- Modify: `app/components/path/PathView.jsx` (JoinCard in place of SaveCard's body), `app/components/path/StepCard.jsx` (MemberNudge in DoneRitual), `app/components/path/PathExperience.jsx` (joined banner, plan awareness), `lib/hooks/usePathRecord.js` only if a plan lookup is needed there (prefer reading the cached subscription in PathExperience through `getSubscription`), `app/components/assistant/AskChat.jsx` (NotMember), `app/tools/cyber-audit/dashboard/page.js` (labels, features, Ask meter, account row with the privacy sentence).
- Must not touch: `app/pricing`, `app/page.js`, `lib/site.js`, Navbar, `lib/stripe/*`, API routes, CLAUDE.md.
- Acceptance: `/path/home` with a fresh path shows the JoinCard with the free save first; after save, the member half only; "Not now" hides it for 30 days (local record key `joinDismissedAt`); the nudge appears once after the third done and not for members; `/tools/ask` signed-in non-member shows the locked panel with the example question; dashboard labels for `member_home` and `member_business` render; no stored keys renamed; lint and validate pass.

### Lead integration
1. `npm run lint`, `npm run validate`, `npm run build`.
2. Apply `20261027_membership_plans.sql` and `20261027_assistant_usage.sql` in the Supabase SQL editor (owner, or lead with the owner's go-ahead).
3. Test-mode checkout walk-through against the dev server: sign in with a magic link, press Join Home monthly, pay with `4242 4242 4242 4242`, any future expiry, any CVC. The Stripe CLI is not installed here; either install it (`brew install stripe/stripe-cli/stripe`, then `stripe listen --forward-to localhost:3000/api/stripe/webhook` and put the printed signing secret in `.env.local` as `STRIPE_WEBHOOK_SECRET` for the session) or run the walk-through on the Vercel preview with a test-mode dashboard webhook endpoint pointed at `<preview>/api/stripe/webhook`. Confirm: the subscriptions row reads `member_home`, `/path/home?joined=1` shows the banner, `/tools/ask` answers, the dashboard shows "Manage billing", and cancellation through the portal flips the row.
4. Repeat for Business monthly, and once for a founding annual price.
5. CLAUDE.md: the membership under Business tools and entitlement (plan values, `FOUNDING_UNTIL`, the setup script, the six events, the assistant cap).
6. Browser check at desktop and phone width: band, pricing, JoinCard, locked Ask panel.

## 6. Go-live checklist and open decisions

Owner, in order:
1. Apply both Supabase migrations in production.
2. Create the live catalog: put the live key in `.env.local` as `STRIPE_LIVE_SECRET_KEY` and run `node scripts/stripe-setup.mjs --live` (requires typing the word LIVE; also covers steps 3, 5 and 6 below, except setting `STRIPE_WEBHOOK_SECRET` and making the portal configuration the account default, which the API cannot do), copy the IDs into `LIVE_PRICES`, set `STRIPE_MODE=live` and the live keys in Vercel, set `FOUNDING_UNTIL` to launch day plus 90.
3. Register the live webhook endpoint for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` and set `STRIPE_WEBHOOK_SECRET`.
4. Privacy page: the sentence about questions to Ask being processed by Anthropic and not stored by us, plus the membership billing data line.
5. Billing portal configured in the Stripe dashboard with cancellation enabled (two clicks) and the portal link verified from the dashboard.
6. Create the `PACK_TO_MEMBER` coupon (100% off, 12 months, business prices only).
7. Submit privacy and terms URLs in Stripe.

Open decisions:
- Whether home members should get a dedicated `/account` page now (this plan puts the account row on the Path page and the dashboard; a page is M3).
- The founding window length and whether to show the founding price on the homepage band (this plan shows list prices on the band, founding on the pricing page, so the band never needs a date).
- Whether `member_business` should keep `canAccessNewsFeed` (the news feed is a Haiku 4.5 route scheduled by cron; it ships as part of the grants because Ongoing Protection had it, but the roadmap replaces it with the monthly note).
- Promo codes: the `promo_codes.plan` default is `professional`; new codes for members should use `member_home` or `member_business`, which the constraint change does not affect (promo plan values are free text) but the owner should know.
