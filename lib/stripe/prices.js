// TODO: Before going live:
// 1. Create matching products in Stripe live mode dashboard
// 2. Copy live price IDs into LIVE_PRICES below
// 3. Set STRIPE_MODE=live in Vercel environment variables
// 4. Set STRIPE_SECRET_KEY to live sk_live_ key in Vercel
// 5. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to live pk_live_ key
// 6. Set STRIPE_WEBHOOK_SECRET to live webhook whsec_ key
// 7. Verify /privacy and /terms pages are live
// 8. Submit privacy policy and terms URLs in Stripe dashboard

export const PRICES = {
  starter: 'price_1TJefF0Nd7M2kiXmXDcie4WO',
  professional: 'price_1TJeh40Nd7M2kiXmobGWYTaD',
  msp: 'price_1TJeii0Nd7M2kiXmRG3RtcxR',
  assessmentBundle: 'price_1TJelN0Nd7M2kiXmSvLqPfuR',
  policyBundle: 'price_1TJemd0Nd7M2kiXmuLtq1zm3',
  individualPolicy: 'price_1TJenL0Nd7M2kiXmJkjE0gZ3',
}

export const LIVE_PRICES = {
  starter: 'REPLACE_WITH_LIVE_PRICE_ID',
  professional: 'REPLACE_WITH_LIVE_PRICE_ID',
  msp: 'REPLACE_WITH_LIVE_PRICE_ID',
  assessmentBundle: 'REPLACE_WITH_LIVE_PRICE_ID',
  policyBundle: 'REPLACE_WITH_LIVE_PRICE_ID',
  individualPolicy: 'REPLACE_WITH_LIVE_PRICE_ID',
}

// Module-load guard: if STRIPE_MODE=live is explicitly set, refuse to start
// with placeholder LIVE_PRICES values. This crashes the running server
// immediately rather than silently accepting fake price IDs that would let
// any priceId pass validation.
//
// Scoped narrowly to STRIPE_MODE=live (not NODE_ENV=production) so that a
// production-style Vercel deployment running test Stripe keys is unaffected.
// The signal "we are using real money" is STRIPE_MODE=live, not NODE_ENV.
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

export function getActivePrices() {
  return process.env.STRIPE_MODE === 'live' ? LIVE_PRICES : PRICES
}

export function getActivePriceToPlan() {
  const prices = getActivePrices()
  return {
    [prices.starter]: 'starter',
    [prices.professional]: 'professional',
    [prices.msp]: 'msp',
  }
}

// Single source of truth for valid subscription price IDs in the active env.
export function getSubscriptionPriceIds() {
  const p = getActivePrices()
  return [p.starter, p.professional, p.msp]
}

// Single source of truth for valid one-time price IDs in the active env.
export function getOneTimePriceIds() {
  const p = getActivePrices()
  return [p.assessmentBundle, p.policyBundle, p.individualPolicy]
}

export function isSubscriptionPriceId(priceId) {
  return getSubscriptionPriceIds().includes(priceId)
}

export function isOneTimePriceId(priceId) {
  return getOneTimePriceIds().includes(priceId)
}

// Map a one-time price ID to its purchase_type column value. Uses the
// active env so live and test mode both work without substring matching.
export function getPurchaseTypeForPrice(priceId) {
  const prices = getActivePrices()
  if (priceId === prices.assessmentBundle) return 'assessment_bundle'
  if (priceId === prices.policyBundle) return 'policy_bundle'
  if (priceId === prices.individualPolicy) return 'individual_policy'
  return 'unknown'
}
