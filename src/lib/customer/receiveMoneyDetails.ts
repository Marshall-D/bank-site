import { BRAND_BANK_DETAILS } from '@/lib/brand'
import type { CustomerAccountSummary } from '@/lib/auth/types'

export type ReceiveMoneyDetail = {
  key: string
  label: string
  value: string
}

function formatAccountType(accountType: string) {
  return accountType
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function buildReceiveMoneyDetails(
  account: CustomerAccountSummary,
  accountHolderName: string
): ReceiveMoneyDetail[] {
  return [
    { key: 'bankName', label: 'Bank name', value: BRAND_BANK_DETAILS.bankName },
    { key: 'accountHolder', label: 'Account name', value: accountHolderName },
    { key: 'accountNumber', label: 'Account number', value: account.accountNumber || account.accountNumberMasked },
    { key: 'accountType', label: 'Account type', value: formatAccountType(account.accountType) },
    { key: 'currency', label: 'Currency', value: account.currency },
    { key: 'routingNumber', label: 'Routing number (ABA)', value: BRAND_BANK_DETAILS.routingNumber },
    { key: 'swiftCode', label: 'SWIFT / BIC', value: BRAND_BANK_DETAILS.swiftCode },
    { key: 'bankAddress', label: 'Bank address', value: BRAND_BANK_DETAILS.bankAddress },
  ]
}

export function formatReceiveMoneyDetailsForCopy(details: ReceiveMoneyDetail[]) {
  return details.map((detail) => `${detail.label}: ${detail.value}`).join('\n')
}
