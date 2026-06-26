export const BENEFICIARY_FIELD_LIMITS = {
  nameMax: 100,
  bankNameMax: 100,
  accountNumberMin: 4,
  accountNumberMax: 34,
} as const

export const UNSAFE_TEXT_PATTERN = /<[^>]*>|javascript:|data:text\/html|on\w+\s*=/i
