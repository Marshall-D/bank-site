export const BENEFICIARY_FIELD_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  bankNameMin: 2,
  bankNameMax: 100,
  accountNumberMin: 4,
  accountNumberMax: 34,
  routingNumberMin: 8,
  routingNumberMax: 11,
  swiftOrIbanMin: 8,
  swiftOrIbanMax: 34,
} as const

export const UNSAFE_TEXT_PATTERN = /<[^>]*>|javascript:|data:text\/html|on\w+\s*=/i

/** Account holder name: letters with spaces, hyphens, apostrophes, periods */
export const BENEFICIARY_NAME_PATTERN = /^[A-Za-z][A-Za-z .'\-]{0,98}[A-Za-z.]$|^[A-Za-z]{2}$/

/** Bank name: letters/numbers with spaces, &, hyphen, apostrophe, period */
export const BENEFICIARY_BANK_NAME_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9 &.'\-]{0,98}[A-Za-z0-9.]$|^[A-Za-z0-9]{2}$/

/** Account number: digits only */
export const BENEFICIARY_ACCOUNT_NUMBER_PATTERN = /^\d+$/

/** Routing number: digits only */
export const BENEFICIARY_ROUTING_NUMBER_PATTERN = /^\d+$/

/** SWIFT BIC or IBAN: letters and digits only */
export const BENEFICIARY_SWIFT_OR_IBAN_PATTERN = /^[A-Za-z0-9]+$/
