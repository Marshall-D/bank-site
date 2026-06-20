export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'current_account', label: 'Current Account' },
  { value: 'savings_account', label: 'Savings Account' },
] as const

export const ID_DOCUMENT_TYPE_OPTIONS = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID' },
  { value: 'driver_license', label: "Driver's License" },
] as const

export const PROOF_OF_ADDRESS_TYPE_OPTIONS = [
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'lease_agreement', label: 'Lease Agreement' },
  { value: 'tax_assessment', label: 'Tax Assessment' },
  { value: 'other', label: 'Other' },
] as const

export const SOURCE_OF_FUNDS_TYPE_OPTIONS = [
  { value: 'salary', label: 'Salary' },
  { value: 'business_income', label: 'Business Income' },
  { value: 'investment', label: 'Investment' },
  { value: 'pension', label: 'Pension' },
  { value: 'inheritance', label: 'Inheritance' },
  { value: 'savings', label: 'Savings' },
  { value: 'other', label: 'Other' },
] as const

export const INITIAL_DEPOSIT_METHOD_OPTIONS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
] as const

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'self_employed', label: 'Self Employed' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
  { value: 'unemployed', label: 'Unemployed' },
] as const

export const BRANCH_OPTIONS = [
  { value: 'Providenciales', label: 'Providenciales' },
  { value: 'Grand Turk', label: 'Grand Turk' },
] as const

export const DEFAULT_COUNTRY = 'Turks and Caicos Islands'

export const APPLICATION_STEPS = [
  { id: 1, title: 'Identity' },
  { id: 2, title: 'Address' },
  { id: 3, title: 'Documents' },
  { id: 4, title: 'Financial' },
  { id: 5, title: 'Review' },
] as const
