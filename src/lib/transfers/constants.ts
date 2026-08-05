export const TRANSFER_LIMITS = {
  minAmount: 0.01,
  maxPerTransfer: 5_000_000,
  maxDailyTotal: 5_000_000,
  descriptionMax: 200,
} as const

export const BRCB_ACCOUNT_NUMBER_LENGTH = 12

export const OUTSIDE_JURISDICTION_MESSAGE =
  'This transfer cannot be completed because the recipient is outside our country of jurisdiction or region.'
