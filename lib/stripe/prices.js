export const PRICES = {
  starter: 'price_1TJefF0Nd7M2kiXmXDcie4WO',
  professional: 'price_1TJeh40Nd7M2kiXmobGWYTaD',
  msp: 'price_1TJeii0Nd7M2kiXmRG3RtcxR',
  assessmentBundle: 'price_1TJelN0Nd7M2kiXmSvLqPfuR',
  policyBundle: 'price_1TJemd0Nd7M2kiXmuLtq1zm3',
  individualPolicy: 'price_1TJenL0Nd7M2kiXmJkjE0gZ3',
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
