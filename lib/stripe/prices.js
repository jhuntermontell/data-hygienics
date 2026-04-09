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

export const PRICE_TO_PLAN = {
  [PRICES.starter]: 'starter',
  [PRICES.professional]: 'professional',
  [PRICES.msp]: 'msp',
}

export const ONE_TIME_PRICES = new Set([
  PRICES.assessmentBundle,
  PRICES.policyBundle,
  PRICES.individualPolicy,
])
