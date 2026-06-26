export const TRANSFER_LIMITS = {
  minAmount: 0.01,
  maxPerTransfer: 50000,
  maxDailyTotal: 10000,
  descriptionMax: 200,
} as const

export const OUTSIDE_JURISDICTION_MESSAGE =
  'This transfer cannot be completed because the recipient is outside our country of jurisdiction or region.'
