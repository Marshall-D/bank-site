export type ExportTransactionsParams = {
  accountId?: string
  type?: string
  search?: string
  from?: string
  to?: string
}

export type StatementPeriod = {
  period: string
  label: string
  transactionCount: number
  periodStart: string
  periodEnd: string
}

export type StatementAccountSummary = {
  id: string
  displayName: string
  accountNumberMasked: string
  currency: string
}

export type ListStatementsResponse = {
  account: StatementAccountSummary
  items: StatementPeriod[]
}

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
