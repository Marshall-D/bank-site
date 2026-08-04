import type { CustomerAccountSummary } from '@/lib/auth/types'
import { BRAND_BANK_DETAILS } from '@/lib/brand'
import type { ReceiveMoneyDetail } from '@/lib/customer/receiveMoneyDetails'
import { buildReceiveMoneyDetails } from '@/lib/customer/receiveMoneyDetails'

export function isInitialDepositPending(account?: CustomerAccountSummary | null) {
  return account?.initialDeposit?.status === 'pending'
}

export function hasPendingInitialDeposit(accounts: CustomerAccountSummary[]) {
  return accounts.some((account) => isInitialDepositPending(account))
}

export function formatDepositAmount(account: CustomerAccountSummary) {
  const amount = account.initialDeposit?.amount
  const currency = account.initialDeposit?.currency || account.currency || 'USD'
  if (amount == null) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function buildInitialDepositPaymentDetails(
  account: CustomerAccountSummary,
  accountHolderName: string,
  paymentReference?: string | null
): ReceiveMoneyDetail[] {
  const base = buildReceiveMoneyDetails(account, accountHolderName)
  const amountLabel = formatDepositAmount(account)
  const extras: ReceiveMoneyDetail[] = []

  if (amountLabel) {
    extras.push({
      key: 'amountDue',
      label: 'Amount due',
      value: amountLabel,
    })
  }

  extras.push({
    key: 'paymentReference',
    label: 'Payment reference',
    value: paymentReference || account.accountNumber || account.accountNumberMasked,
  })

  extras.push({
    key: 'instructions',
    label: 'Instructions',
    value: `Transfer the amount due to ${BRAND_BANK_DETAILS.bankName} and include the payment reference so we can match your deposit.`,
  })

  return [...extras, ...base]
}
