import { BENEFICIARY_FIELD_LIMITS, UNSAFE_TEXT_PATTERN } from './constants'
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

  if (!name) {
    errors.name = 'Name is required'
  } else if (name.length > BENEFICIARY_FIELD_LIMITS.nameMax) {
    errors.name = `Name must be at most ${BENEFICIARY_FIELD_LIMITS.nameMax} characters`
  } else if (hasUnsafeText(name)) {
    errors.name = 'Name contains disallowed content'
  }

  if (!bankName) {
    errors.bankName = 'Bank name is required'
  } else if (bankName.length > BENEFICIARY_FIELD_LIMITS.bankNameMax) {
    errors.bankName = `Bank name must be at most ${BENEFICIARY_FIELD_LIMITS.bankNameMax} characters`
  } else if (hasUnsafeText(bankName)) {
    errors.bankName = 'Bank name contains disallowed content'
  }

  if (!accountNumber) {
    errors.accountNumber = 'Account number is required'
  } else if (accountNumber.length < BENEFICIARY_FIELD_LIMITS.accountNumberMin) {
    errors.accountNumber = `Account number must be at least ${BENEFICIARY_FIELD_LIMITS.accountNumberMin} characters`
  } else if (accountNumber.length > BENEFICIARY_FIELD_LIMITS.accountNumberMax) {
    errors.accountNumber = `Account number must be at most ${BENEFICIARY_FIELD_LIMITS.accountNumberMax} characters`
  }

  return errors
}
