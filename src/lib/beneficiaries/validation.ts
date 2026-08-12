import {
  BENEFICIARY_ACCOUNT_NUMBER_PATTERN,
  BENEFICIARY_BANK_NAME_PATTERN,
  BENEFICIARY_FIELD_LIMITS,
  BENEFICIARY_NAME_PATTERN,
  BENEFICIARY_ROUTING_NUMBER_PATTERN,
  BENEFICIARY_SWIFT_OR_IBAN_PATTERN,
  UNSAFE_TEXT_PATTERN,
} from './constants'
import type { CreateBeneficiaryPayload } from './types'

export type BeneficiaryFormErrors = Partial<Record<keyof CreateBeneficiaryPayload, string>>

function hasUnsafeText(value: string) {
  return UNSAFE_TEXT_PATTERN.test(value)
}

export function validateBeneficiaryForm(values: CreateBeneficiaryPayload): BeneficiaryFormErrors {
  const errors: BeneficiaryFormErrors = {}
  const name = values.name.trim()
  const bankName = values.bankName.trim()
  const accountNumber = values.accountNumber.trim()
  const routingNumber = values.routingNumber.trim()
  const swiftOrIban = (values.swiftOrIban || '').trim()

  if (!name) {
    errors.name = 'Account name is required'
  } else if (name.length < BENEFICIARY_FIELD_LIMITS.nameMin) {
    errors.name = `Account name must be at least ${BENEFICIARY_FIELD_LIMITS.nameMin} characters`
  } else if (name.length > BENEFICIARY_FIELD_LIMITS.nameMax) {
    errors.name = `Account name must be at most ${BENEFICIARY_FIELD_LIMITS.nameMax} characters`
  } else if (!BENEFICIARY_NAME_PATTERN.test(name)) {
    errors.name =
      'Account name may only include letters, spaces, hyphens, apostrophes, and periods'
  } else if (hasUnsafeText(name)) {
    errors.name = 'Account name contains disallowed content'
  }

  if (!bankName) {
    errors.bankName = 'Bank name is required'
  } else if (bankName.length < BENEFICIARY_FIELD_LIMITS.bankNameMin) {
    errors.bankName = `Bank name must be at least ${BENEFICIARY_FIELD_LIMITS.bankNameMin} characters`
  } else if (bankName.length > BENEFICIARY_FIELD_LIMITS.bankNameMax) {
    errors.bankName = `Bank name must be at most ${BENEFICIARY_FIELD_LIMITS.bankNameMax} characters`
  } else if (!BENEFICIARY_BANK_NAME_PATTERN.test(bankName)) {
    errors.bankName =
      'Bank name may only include letters, numbers, spaces, &, hyphens, apostrophes, and periods'
  } else if (hasUnsafeText(bankName)) {
    errors.bankName = 'Bank name contains disallowed content'
  }

  if (!accountNumber) {
    errors.accountNumber = 'Account number is required'
  } else if (!BENEFICIARY_ACCOUNT_NUMBER_PATTERN.test(accountNumber)) {
    errors.accountNumber = 'Account number must contain digits only'
  } else if (accountNumber.length < BENEFICIARY_FIELD_LIMITS.accountNumberMin) {
    errors.accountNumber = `Account number must be at least ${BENEFICIARY_FIELD_LIMITS.accountNumberMin} digits`
  } else if (accountNumber.length > BENEFICIARY_FIELD_LIMITS.accountNumberMax) {
    errors.accountNumber = `Account number must be at most ${BENEFICIARY_FIELD_LIMITS.accountNumberMax} digits`
  }

  if (!routingNumber) {
    errors.routingNumber = 'Routing number is required'
  } else if (!BENEFICIARY_ROUTING_NUMBER_PATTERN.test(routingNumber)) {
    errors.routingNumber = 'Routing number must contain digits only'
  } else if (routingNumber.length < BENEFICIARY_FIELD_LIMITS.routingNumberMin) {
    errors.routingNumber = `Routing number must be at least ${BENEFICIARY_FIELD_LIMITS.routingNumberMin} digits`
  } else if (routingNumber.length > BENEFICIARY_FIELD_LIMITS.routingNumberMax) {
    errors.routingNumber = `Routing number must be at most ${BENEFICIARY_FIELD_LIMITS.routingNumberMax} digits`
  }

  if (swiftOrIban) {
    if (!BENEFICIARY_SWIFT_OR_IBAN_PATTERN.test(swiftOrIban)) {
      errors.swiftOrIban = 'SWIFT/IBAN may only include letters and numbers'
    } else if (swiftOrIban.length < BENEFICIARY_FIELD_LIMITS.swiftOrIbanMin) {
      errors.swiftOrIban = `SWIFT/IBAN must be at least ${BENEFICIARY_FIELD_LIMITS.swiftOrIbanMin} characters`
    } else if (swiftOrIban.length > BENEFICIARY_FIELD_LIMITS.swiftOrIbanMax) {
      errors.swiftOrIban = `SWIFT/IBAN must be at most ${BENEFICIARY_FIELD_LIMITS.swiftOrIbanMax} characters`
    }
  }

  return errors
}
