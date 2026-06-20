import {
  ACCOUNT_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  ID_DOCUMENT_TYPE_OPTIONS,
  INITIAL_DEPOSIT_METHOD_OPTIONS,
  PROOF_OF_ADDRESS_TYPE_OPTIONS,
  SOURCE_OF_FUNDS_TYPE_OPTIONS,
} from '@/lib/application/constants'
import type { Address } from './types'

function labelFromOptions(
  value: string | null | undefined,
  options: ReadonlyArray<{ value: string; label: string }>
) {
  if (!value) return '—'
  return options.find((option) => option.value === value)?.label ?? value
}

export function formatAccountType(value: string) {
  return labelFromOptions(value, ACCOUNT_TYPE_OPTIONS)
}

export function formatIdDocumentType(value: string) {
  return labelFromOptions(value, ID_DOCUMENT_TYPE_OPTIONS)
}

export function formatProofOfAddressType(value: string) {
  return labelFromOptions(value, PROOF_OF_ADDRESS_TYPE_OPTIONS)
}

export function formatSourceOfFundsType(value: string) {
  return labelFromOptions(value, SOURCE_OF_FUNDS_TYPE_OPTIONS)
}

export function formatInitialDepositMethod(value: string) {
  return labelFromOptions(value, INITIAL_DEPOSIT_METHOD_OPTIONS)
}

export function formatEmploymentStatus(value: string | null | undefined) {
  return labelFromOptions(value, EMPLOYMENT_STATUS_OPTIONS)
}

export function formatAddress(address: Address | null | undefined) {
  if (!address) return '—'

  const lines = [
    address.line1,
    address.line2,
    [address.cityOrIsland, address.postalCode].filter(Boolean).join(' '),
    address.country,
  ].filter(Boolean)

  return lines.join(', ')
}

export function formatCurrencyAmount(amount: number | null | undefined, currency?: string | null) {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}
