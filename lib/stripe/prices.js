// ============================================================================
// STRIPE PRICE ID REGISTRY
// ============================================================================
//
// This file is the single source of truth for every Stripe price ID the app
// recognizes. It is split into three concerns:
//
//   1. PRICES           — test-mode price IDs (current catalog)
//   2. LIVE_PRICES      — live-mode price IDs (placeholders until launch)
//   3. LEGACY_PRICES    — grandfathered test-mode price IDs from the old
//                          Starter / Professional / MSP / Agency / Assessment
//                          Bundle / Policy Bundle / Individual Policy catalog.
//                          These are still honored for existing subscribers so
//                          their renewals keep working and the webhook maps
//                          them to the right plan, but they are NOT exposed
//                          anywhere in the pricing UI and the checkout route
//                          never starts a new session for them.
//
// THE CURRENT CATALOG (design/strategy/membership-implementation.md):
//   - Data Hygienics Membership, two doors. The door is stored as the plan
//     value: Home prices map to "member_home", Business prices to
//     "member_business".
//       Home      $8/month, $69/year, founding $59/year
//       Business  $39/month, $390/year, founding $349/year
//   - Founding annual prices are sold only while foundingOpen() (before
//     FOUNDING_UNTIL). After that they leave getNewCheckoutPriceIds() but stay
//     recognized everywhere else, so founding members keep renewing at the
//     founding price ("locked for life" without a coupon).
//   - Documentation Pack, $299 one-time.
//   - Ongoing Protection ($49/month, $468/year) is RETIRED FROM SALE. Its
//     slots stay so the webhook and billing portal keep working for anyone
//     holding it, but it is not in getNewCheckoutPriceIds(). It was never
//     created in test or live mode, so its slots are placeholders.
//
// TEST MODE: `node scripts/stripe-setup.mjs` creates the seven current
// prices (idempotent, by lookup key) and prints the block pasted into PRICES.
//
// BEFORE GOING LIVE:
// 1. Put the live secret key in .env.local as STRIPE_LIVE_SECRET_KEY and run
//    `node scripts/stripe-setup.mjs --live` (asks you to type LIVE). It
//    creates the same seven prices with the same lookup keys and metadata,
//    the PACK_TO_MEMBER coupon, a billing portal configuration and the
//    production webhook endpoint (signing secret written to
//    .stripe-live-webhook-secret). It never creates Ongoing Protection or the
//    retired Agency Plan.
// 2. Paste the LIVE_PRICES block it prints below.
// 3. Set FOUNDING_UNTIL to launch day plus 90 days.
// 4. Set STRIPE_SECRET_KEY / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY / STRIPE_WEBHOOK_SECRET
//    to the live values in Vercel (Production).
// 5. Then set STRIPE_MODE=live in Vercel (Production) and redeploy.
// 6. Verify /privacy and /terms pages are live.
// 7. Make the Stripe account's default customer portal match the script's
//    configuration if the script says it is not the default (the API cannot
//    set the default).
// 8. Submit privacy policy and terms URLs in the Stripe dashboard (public
//    business details).
//
// Any slot still holding a REPLACE_WITH_... placeholder is filtered out of
// every accessor, so the checkout route rejects it ("not configured"), which
// is the intended fail-closed behavior.
// ============================================================================

// ---------- Current catalog (test mode) ----------
// Membership and Documentation Pack IDs come from scripts/stripe-setup.mjs.
export const PRICES = {
  docsPack: 'price_1UUvLK0Nd7M2kiXm2hBIMJQ3', // $299 one-time
  memberHomeMonthly: 'price_1UUvLI0Nd7M2kiXmIovNhkSf', // $8/month
  memberHomeYearly: 'price_1UUvLI0Nd7M2kiXmp0MDPKZh', // $69/year
  memberBusinessMonthly: 'price_1UUvLJ0Nd7M2kiXmpYVUrPLI', // $39/month
  memberBusinessYearly: 'price_1UUvLJ0Nd7M2kiXmEFcp3oCX', // $390/year
  foundingHomeYearly: 'price_1UUvLI0Nd7M2kiXmDaRKGg4p', // $59/year, founding rate
  foundingBusinessYearly: 'price_1UUvLJ0Nd7M2kiXmWxbpcO7g', // $349/year, founding rate
  // Ongoing Protection: retired from sale, honored if ever held.
  protectionMonthly: 'REPLACE_WITH_TEST_PRICE_ID', // $49/month recurring
  protectionYearly: 'REPLACE_WITH_TEST_PRICE_ID', // $468/year recurring
}

// ---------- Current catalog (live mode) ----------
// Paste from `node scripts/stripe-setup.mjs --live`.
export const LIVE_PRICES = {
  docsPack: 'REPLACE_WITH_LIVE_PRICE_ID',
  memberHomeMonthly: 'REPLACE_WITH_LIVE_PRICE_ID',
  memberHomeYearly: 'REPLACE_WITH_LIVE_PRICE_ID',
  memberBusinessMonthly: 'REPLACE_WITH_LIVE_PRICE_ID',
  memberBusinessYearly: 'REPLACE_WITH_LIVE_PRICE_ID',
  foundingHomeYearly: 'REPLACE_WITH_LIVE_PRICE_ID',
  foundingBusinessYearly: 'REPLACE_WITH_LIVE_PRICE_ID',
  // Ongoing Protection was never sold in live mode, so these may stay
  // placeholders (see LIVE_OPTIONAL_SLOTS below).
  protectionMonthly: 'REPLACE_WITH_LIVE_PRICE_ID',
  protectionYearly: 'REPLACE_WITH_LIVE_PRICE_ID',
}

// ---------- Founding rate ----------
//
// The founding annual prices are sold before this date (UTC) and not from it
// on: 90 days from a 2026-10-27 launch. Adjust at launch. Nothing else to
// administer: no coupon, no countdown. Existing founding subscriptions keep
// renewing at their price because the slots stay in getSubscriptionPriceIds()
// and getActivePriceToPlan().
export const FOUNDING_UNTIL = '2027-01-25'

// True while new founding-rate checkouts are allowed. `now` may be a Date,
// a timestamp or a date string; defaults to the current time.
export function foundingOpen(now = new Date()) {
  const t = now instanceof Date ? now.getTime() : new Date(now).getTime()
  if (Number.isNaN(t)) return false
  return t < Date.parse(`${FOUNDING_UNTIL}T00:00:00Z`)
}

// ---------- Legacy catalog (grandfathered — test mode) ----------
//
// These price IDs are preserved so that existing subscribers under the old
// Starter / Professional / MSP / Agency plans and existing one-time Assessment /
// Policy / Individual Policy buyers can renew, see their plan correctly, and
// continue using features they already paid for. New signups NEVER see these
// in the pricing UI. The webhook and purchase-type mapper still recognize
// them so Stripe events for grandfathered customers continue to update our
// database correctly.
//
// `agency` is the retired Agency Plan. It never had a configured price ID
// (the slot was a placeholder in the old new-catalog table), so it stays a
// placeholder here. If a real ID is ever filled in, the webhook maps it to
// plan "agency" through getActivePriceToPlan(), but it is still never
// purchasable: the checkout route only accepts getNewCheckoutPriceIds().
export const LEGACY_PRICES = {
  starter: 'price_1TJefF0Nd7M2kiXmXDcie4WO',
  professional: 'price_1TJeh40Nd7M2kiXmobGWYTaD',
  msp: 'price_1TJeii0Nd7M2kiXmRG3RtcxR',
  agency: 'REPLACE_WITH_TEST_PRICE_ID',
  assessmentBundle: 'price_1TJelN0Nd7M2kiXmSvLqPfuR',
  policyBundle: 'price_1TJemd0Nd7M2kiXmuLtq1zm3',
  individualPolicy: 'price_1TJenL0Nd7M2kiXmJkjE0gZ3',
}

// ---------- Legacy catalog (grandfathered — live mode) ----------
//
// Populate this when the live-mode legacy products are migrated or mirrored.
// Until then, legacy subscribers only exist in test mode so the placeholder
// tokens are acceptable. The live-mode guard below intentionally does NOT
// check LEGACY_LIVE_PRICES because grandfathering is best-effort.
export const LEGACY_LIVE_PRICES = {
  starter: 'REPLACE_WITH_LIVE_PRICE_ID',
  professional: 'REPLACE_WITH_LIVE_PRICE_ID',
  msp: 'REPLACE_WITH_LIVE_PRICE_ID',
  agency: 'REPLACE_WITH_LIVE_PRICE_ID',
  assessmentBundle: 'REPLACE_WITH_LIVE_PRICE_ID',
  policyBundle: 'REPLACE_WITH_LIVE_PRICE_ID',
  individualPolicy: 'REPLACE_WITH_LIVE_PRICE_ID',
}

// ============================================================================
// Module-load guard for live mode
// ============================================================================
//
// If STRIPE_MODE=live is explicitly set, refuse to start with placeholder
// LIVE_PRICES values. This crashes the running server immediately rather than
// silently accepting fake price IDs that would let any priceId pass validation.
//
// Scoped narrowly to STRIPE_MODE=live (not NODE_ENV=production) so a
// production-style Vercel deployment running test Stripe keys is unaffected.
// The signal "we are using real money" is STRIPE_MODE=live, not NODE_ENV.
//
// Guards every slot of the current catalog (LIVE_PRICES), including the
// membership and founding slots, except LIVE_OPTIONAL_SLOTS: Ongoing
// Protection is retired from sale and was never created in live mode, so its
// live slots may stay placeholders (accessors filter placeholders out).
// Legacy live prices are grandfather-only and their absence is not fatal.
const LIVE_OPTIONAL_SLOTS = ['protectionMonthly', 'protectionYearly']

if (process.env.STRIPE_MODE === 'live') {
  const missing = Object.entries(LIVE_PRICES)
    .filter(([slot]) => !LIVE_OPTIONAL_SLOTS.includes(slot))
    .filter(
      ([, p]) =>
        typeof p !== 'string' ||
        p === '' ||
        p.startsWith('REPLACE_') ||
        p.startsWith('price_REPLACE')
    )
    .map(([slot]) => slot)
  if (missing.length > 0) {
    throw new Error(
      'FATAL: STRIPE_MODE is "live" but LIVE_PRICES in lib/stripe/prices.js ' +
        `still contains placeholder values (${missing.join(', ')}). Replace every ` +
        'placeholder with a real Stripe live price ID before going live.'
    )
  }
}

// ============================================================================
// Accessors
// ============================================================================

// ----------------------------------------------------------------------------
// isConfiguredPriceId: returns true only for a non-empty string that does
// NOT look like an unfilled placeholder.
//
// All the price-list accessors below funnel their values through this
// predicate, which gives the checkout validator, the plan mapper, and the
// purchase-type mapper a single gate. Previously every new-catalog slot
// held the literal string "REPLACE_WITH_TEST_PRICE_ID" and that string
// passed validation, which meant a crafted checkout body could produce an
// ambiguously-mapped subscription (the placeholder hashed to whichever
// object key was assigned last). Filtering placeholders here closes that
// hole structurally — no call site has to remember to re-check.
// ----------------------------------------------------------------------------
export function isConfiguredPriceId(priceId) {
  if (typeof priceId !== 'string') return false
  if (priceId.length === 0) return false
  if (priceId.startsWith('REPLACE_')) return false
  if (priceId.startsWith('price_REPLACE')) return false
  // Accept real Stripe price IDs (`price_...`) and any other non-empty
  // non-placeholder string that a test runner might hand us.
  return true
}

export function getActivePrices() {
  return process.env.STRIPE_MODE === 'live' ? LIVE_PRICES : PRICES
}

export function getLegacyPrices() {
  return process.env.STRIPE_MODE === 'live' ? LEGACY_LIVE_PRICES : LEGACY_PRICES
}

// Map a price ID to the canonical plan value stored in the `subscriptions`
// table. Handles the current catalog (every Home membership price, founding
// included, maps to "member_home"; every Business one to "member_business";
// retired Ongoing Protection to "protection") and the legacy catalog
// (starter / professional / msp / agency preserved verbatim for
// grandfathered users).
//
// Any placeholder entry is excluded from the returned map so an unconfigured
// slot cannot collide with a real slot under the same key. The webhook's
// planForPriceId(priceId) fallback will then return 'free' for a placeholder,
// which is the safe default.
export function getActivePriceToPlan() {
  const prices = getActivePrices()
  const legacy = getLegacyPrices()
  const pairs = [
    // Membership: the door is the plan value
    [prices.memberHomeMonthly, 'member_home'],
    [prices.memberHomeYearly, 'member_home'],
    [prices.foundingHomeYearly, 'member_home'],
    [prices.memberBusinessMonthly, 'member_business'],
    [prices.memberBusinessYearly, 'member_business'],
    [prices.foundingBusinessYearly, 'member_business'],
    // Ongoing Protection (retired from sale, still honored)
    [prices.protectionMonthly, 'protection'],
    [prices.protectionYearly, 'protection'],
    // Legacy catalog (grandfathered)
    [legacy.starter, 'starter'],
    [legacy.professional, 'professional'],
    [legacy.msp, 'msp'],
    [legacy.agency, 'agency'],
  ]
  const map = {}
  for (const [id, plan] of pairs) {
    if (isConfiguredPriceId(id)) map[id] = plan
  }
  return map
}

// Single source of truth for valid subscription price IDs. Includes the
// current catalog (founding prices forever, so founding members keep
// renewing), retired Ongoing Protection and the legacy catalog so existing
// customers can update billing details through Stripe without hitting
// "Invalid price".
// Placeholders are filtered out so an unconfigured current-catalog slot never
// sneaks into the allowed set.
export function getSubscriptionPriceIds() {
  const p = getActivePrices()
  const legacy = getLegacyPrices()
  return [
    p.memberHomeMonthly,
    p.memberHomeYearly,
    p.foundingHomeYearly,
    p.memberBusinessMonthly,
    p.memberBusinessYearly,
    p.foundingBusinessYearly,
    p.protectionMonthly,
    p.protectionYearly,
    legacy.starter,
    legacy.professional,
    legacy.msp,
    legacy.agency,
  ].filter(isConfiguredPriceId)
}

// Subset the pricing UI is allowed to start NEW checkouts for: the
// Documentation Pack, the four list membership prices, and the two founding
// prices only while foundingOpen(now). Legacy IDs and retired Ongoing
// Protection are deliberately excluded so a stray button somewhere cannot
// resurrect them for new signups. Placeholders are also filtered out so an
// unconfigured deployment returns an empty allow-list rather than accepting
// the literal placeholder string.
export function getNewCheckoutPriceIds(now = new Date()) {
  const p = getActivePrices()
  return [
    p.docsPack,
    p.memberHomeMonthly,
    p.memberHomeYearly,
    p.memberBusinessMonthly,
    p.memberBusinessYearly,
    ...(foundingOpen(now) ? [p.foundingHomeYearly, p.foundingBusinessYearly] : []),
  ].filter(isConfiguredPriceId)
}

// Is this one of the founding-rate prices? True regardless of the date; the
// checkout route pairs it with foundingOpen() to say "That rate has ended".
export function isFoundingPriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return false
  const p = getActivePrices()
  return priceId === p.foundingHomeYearly || priceId === p.foundingBusinessYearly
}

// Which membership door a price belongs to: "home", "business" or null (the
// Documentation Pack, retired Ongoing Protection, legacy and unknown IDs).
// The checkout route uses it for the success URL and session metadata; the
// pricing page can use it to label buttons. Never derived from client input.
export function doorForPriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return null
  const p = getActivePrices()
  if (
    priceId === p.memberHomeMonthly ||
    priceId === p.memberHomeYearly ||
    priceId === p.foundingHomeYearly
  )
    return 'home'
  if (
    priceId === p.memberBusinessMonthly ||
    priceId === p.memberBusinessYearly ||
    priceId === p.foundingBusinessYearly
  )
    return 'business'
  return null
}

// Single source of truth for valid one-time price IDs. Again includes both
// the current Documentation Pack and the legacy bundles. Placeholders filtered out.
export function getOneTimePriceIds() {
  const p = getActivePrices()
  const legacy = getLegacyPrices()
  return [
    p.docsPack,
    legacy.assessmentBundle,
    legacy.policyBundle,
    legacy.individualPolicy,
  ].filter(isConfiguredPriceId)
}

export function isSubscriptionPriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return false
  return getSubscriptionPriceIds().includes(priceId)
}

export function isOneTimePriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return false
  return getOneTimePriceIds().includes(priceId)
}

// Is this priceId one of the current-catalog SKUs the /pricing UI is allowed
// to start a checkout for (right now: founding prices only while
// foundingOpen())? Used by the checkout route as the primary allow-list for
// new signups.
export function isNewCheckoutPriceId(priceId, now = new Date()) {
  if (!isConfiguredPriceId(priceId)) return false
  return getNewCheckoutPriceIds(now).includes(priceId)
}

// Which current-catalog priceIds are billed annually (both list yearly
// membership prices, both founding prices, and retired Protection yearly).
// Used by the pricing page and the dashboard to show the renewal cadence.
export function isAnnualPriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return false
  const p = getActivePrices()
  return (
    priceId === p.memberHomeYearly ||
    priceId === p.memberBusinessYearly ||
    priceId === p.foundingHomeYearly ||
    priceId === p.foundingBusinessYearly ||
    priceId === p.protectionYearly
  )
}

// Map a one-time price ID to its purchase_type column value. Uses the active
// env so live and test mode both work without substring matching. Recognizes
// the current Documentation Pack AND every legacy one-time SKU so existing
// customers who replay an old checkout still get the right purchase row.
// Placeholder priceIds return 'unknown' rather than collapsing onto the
// first match, so an unconfigured deployment cannot accidentally grant
// docs_pack entitlement to a checkout replay.
export function getPurchaseTypeForPrice(priceId) {
  if (!isConfiguredPriceId(priceId)) return 'unknown'
  const prices = getActivePrices()
  const legacy = getLegacyPrices()
  if (isConfiguredPriceId(prices.docsPack) && priceId === prices.docsPack)
    return 'docs_pack'
  if (
    isConfiguredPriceId(legacy.assessmentBundle) &&
    priceId === legacy.assessmentBundle
  )
    return 'assessment_bundle'
  if (
    isConfiguredPriceId(legacy.policyBundle) &&
    priceId === legacy.policyBundle
  )
    return 'policy_bundle'
  if (
    isConfiguredPriceId(legacy.individualPolicy) &&
    priceId === legacy.individualPolicy
  )
    return 'individual_policy'
  return 'unknown'
}

// ============================================================================
// Module-load duplicate-ID sanity check
// ============================================================================
//
// If two slots in the active price tables hold the same CONFIGURED id (not
// two placeholders), the ordering of getActivePriceToPlan() / the checkout
// helpers becomes load-bearing in a dangerous way. Warn loudly on boot so
// a copy-paste typo in prices.js surfaces at deploy time, not at checkout
// time. This check runs once when the module is first imported.
;(function warnOnDuplicateConfiguredPrices() {
  const active = getActivePrices()
  const legacy = getLegacyPrices()
  // Labels are derived from the table keys so a newly added slot is
  // checked automatically.
  const labeled = [
    ...Object.entries(active).map(([key, id]) => [`PRICES.${key}`, id]),
    ...Object.entries(legacy).map(([key, id]) => [`LEGACY_PRICES.${key}`, id]),
  ].filter(([, id]) => isConfiguredPriceId(id))

  const seen = new Map()
  for (const [label, id] of labeled) {
    if (seen.has(id)) {
      console.warn(
        `[prices.js] Duplicate configured Stripe price ID: "${id}" appears as both "${seen.get(id)}" and "${label}". ` +
          'The last definition in getActivePriceToPlan() wins at runtime — fix this in lib/stripe/prices.js before the collision matters.'
      )
    } else {
      seen.set(id, label)
    }
  }
})()
