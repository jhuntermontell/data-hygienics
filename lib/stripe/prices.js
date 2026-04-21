// ============================================================================
// STRIPE PRICE ID REGISTRY
// ============================================================================
//
// This file is the single source of truth for every Stripe price ID the app
// recognizes. It is split into three concerns:
//
//   1. PRICES           — test-mode price IDs (current active catalog)
//   2. LIVE_PRICES      — live-mode price IDs (placeholders until launch)
//   3. LEGACY_PRICES    — grandfathered test-mode price IDs from the old
//                          Starter / Professional / MSP / Assessment Bundle /
//                          Policy Bundle / Individual Policy catalog. These
//                          are still honored for existing subscribers so their
//                          checkouts and renewals keep working, but they are
//                          NOT exposed anywhere in the new pricing UI.
//
// BEFORE GOING LIVE:
// 1. Create the new product catalog in Stripe live mode dashboard:
//      - Documentation Pack          ($299 one-time)
//      - Ongoing Protection Monthly  ($49/month recurring)
//      - Ongoing Protection Annual   ($468/year recurring)
//      - Agency Plan                 ($29/month recurring, billed per unit)
// 2. Copy the live price IDs into LIVE_PRICES below.
// 3. Set STRIPE_MODE=live in Vercel environment variables.
// 4. Set STRIPE_SECRET_KEY / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY / STRIPE_WEBHOOK_SECRET
//    to the live keys in Vercel.
// 5. Verify /privacy and /terms pages are live.
// 6. Submit privacy policy and terms URLs in Stripe dashboard.
//
// BEFORE TESTING THE NEW CATALOG IN TEST MODE:
//   Replace the REPLACE_WITH_TEST_PRICE_ID placeholders in PRICES below with
//   the Stripe test-mode price IDs you created for the new catalog. Until
//   then, the checkout session route will reject every new-catalog price and
//   return "Invalid price", which is the intended fail-closed behavior.
// ============================================================================

// ---------- New catalog (test mode) ----------
export const PRICES = {
  docsPack: 'REPLACE_WITH_TEST_PRICE_ID', // $299 one-time
  protectionMonthly: 'REPLACE_WITH_TEST_PRICE_ID', // $49/month recurring
  protectionYearly: 'REPLACE_WITH_TEST_PRICE_ID', // $468/year recurring
  agency: 'REPLACE_WITH_TEST_PRICE_ID', // $29/month recurring, per-unit
}

// ---------- New catalog (live mode) ----------
export const LIVE_PRICES = {
  docsPack: 'REPLACE_WITH_LIVE_PRICE_ID',
  protectionMonthly: 'REPLACE_WITH_LIVE_PRICE_ID',
  protectionYearly: 'REPLACE_WITH_LIVE_PRICE_ID',
  agency: 'REPLACE_WITH_LIVE_PRICE_ID',
}

// ---------- Legacy catalog (grandfathered — test mode) ----------
//
// These price IDs are preserved so that existing subscribers under the old
// Starter / Professional / MSP plans and existing one-time Assessment /
// Policy / Individual Policy buyers can renew, see their plan correctly, and
// continue using features they already paid for. New signups NEVER see these
// in the pricing UI. The webhook and purchase-type mapper still recognize
// them so Stripe events for grandfathered customers continue to update our
// database correctly.
export const LEGACY_PRICES = {
  starter: 'price_1TJefF0Nd7M2kiXmXDcie4WO',
  professional: 'price_1TJeh40Nd7M2kiXmobGWYTaD',
  msp: 'price_1TJeii0Nd7M2kiXmRG3RtcxR',
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
// Only guards the new catalog (LIVE_PRICES). Legacy live prices are
// grandfather-only and their absence is not fatal.
if (process.env.STRIPE_MODE === 'live') {
  const livePriceValues = Object.values(LIVE_PRICES)
  const hasPlaceholders = livePriceValues.some(
    (p) =>
      typeof p !== 'string' ||
      p === '' ||
      p.startsWith('REPLACE_') ||
      p.startsWith('price_REPLACE')
  )
  if (hasPlaceholders) {
    throw new Error(
      'FATAL: STRIPE_MODE is "live" but LIVE_PRICES in lib/stripe/prices.js ' +
        'still contains placeholder values. Replace every placeholder with a ' +
        'real Stripe live price ID before going live.'
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
// table. Handles BOTH the new catalog (protection monthly/annual map to
// "protection", agency maps to "agency") and the legacy catalog (starter /
// professional / msp preserved verbatim for grandfathered users).
//
// Any placeholder entry is excluded from the returned map so an unconfigured
// slot cannot collide with a real slot under the same key. The webhook's
// planForPriceId(priceId) fallback will then return 'free' for a placeholder,
// which is the safe default.
export function getActivePriceToPlan() {
  const prices = getActivePrices()
  const legacy = getLegacyPrices()
  const pairs = [
    // New catalog
    [prices.protectionMonthly, 'protection'],
    [prices.protectionYearly, 'protection'],
    [prices.agency, 'agency'],
    // Legacy catalog (grandfathered)
    [legacy.starter, 'starter'],
    [legacy.professional, 'professional'],
    [legacy.msp, 'msp'],
  ]
  const map = {}
  for (const [id, plan] of pairs) {
    if (isConfiguredPriceId(id)) map[id] = plan
  }
  return map
}

// Single source of truth for valid subscription price IDs. Includes both the
// new catalog and the legacy catalog so grandfathered customers can update
// billing details through Stripe without hitting "Invalid price".
// Placeholders are filtered out so an unconfigured new-catalog slot never
// sneaks into the allowed set.
export function getSubscriptionPriceIds() {
  const p = getActivePrices()
  const legacy = getLegacyPrices()
  return [
    p.protectionMonthly,
    p.protectionYearly,
    p.agency,
    legacy.starter,
    legacy.professional,
    legacy.msp,
  ].filter(isConfiguredPriceId)
}

// Subset the pricing UI is allowed to start NEW checkouts for. Legacy IDs
// are deliberately excluded so a stray button somewhere cannot resurrect
// the old catalog for new signups. Placeholders are also filtered out so
// an unconfigured deployment returns an empty allow-list rather than
// accepting the literal placeholder string.
export function getNewCheckoutPriceIds() {
  const p = getActivePrices()
  return [
    p.docsPack,
    p.protectionMonthly,
    p.protectionYearly,
    p.agency,
  ].filter(isConfiguredPriceId)
}

// Single source of truth for valid one-time price IDs. Again includes both
// the new docs pack and the legacy bundles. Placeholders filtered out.
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

// Is this priceId one of the new-catalog SKUs the /pricing UI is allowed
// to start a checkout for? Used by the checkout route as the primary
// allow-list for new signups.
export function isNewCheckoutPriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return false
  return getNewCheckoutPriceIds().includes(priceId)
}

// Which new-catalog priceIds require a per-unit quantity at checkout time.
// Currently only the agency plan; extend this set if more per-seat SKUs land.
export function isPerSeatPriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return false
  const p = getActivePrices()
  return priceId === p.agency
}

// Which new-catalog priceIds are billed annually. Used by the pricing page to
// label the annual toggle and by the dashboard to show the correct renewal
// cadence.
export function isAnnualPriceId(priceId) {
  if (!isConfiguredPriceId(priceId)) return false
  const p = getActivePrices()
  return priceId === p.protectionYearly
}

// Map a one-time price ID to its purchase_type column value. Uses the active
// env so live and test mode both work without substring matching. Recognizes
// the new Documentation Pack AND every legacy one-time SKU so existing
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
  const labeled = [
    ['PRICES.docsPack', active.docsPack],
    ['PRICES.protectionMonthly', active.protectionMonthly],
    ['PRICES.protectionYearly', active.protectionYearly],
    ['PRICES.agency', active.agency],
    ['LEGACY_PRICES.starter', legacy.starter],
    ['LEGACY_PRICES.professional', legacy.professional],
    ['LEGACY_PRICES.msp', legacy.msp],
    ['LEGACY_PRICES.assessmentBundle', legacy.assessmentBundle],
    ['LEGACY_PRICES.policyBundle', legacy.policyBundle],
    ['LEGACY_PRICES.individualPolicy', legacy.individualPolicy],
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
