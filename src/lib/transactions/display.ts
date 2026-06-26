import type { TransactionListItem } from './types'

export function isIncomingTransaction(txn: TransactionListItem) {
  if (txn.type === 'credit') return true
  if (txn.type === 'transfer' && txn.direction === 'in') return true
  return false
}

export function transactionAmountPrefix(txn: TransactionListItem) {
  return isIncomingTransaction(txn) ? '+' : '-'
}

export function transactionAmountClass(txn: TransactionListItem) {
  if (txn.status === 'failed') return 'text-red-600'
  return isIncomingTransaction(txn) ? 'text-green-600' : 'text-red-600'
}

export function transactionIconClass(txn: TransactionListItem) {
  if (txn.status === 'failed') return 'bg-red-500/10'
  if (isIncomingTransaction(txn)) return 'bg-green-500/10'
  return 'bg-red-500/10'
}
