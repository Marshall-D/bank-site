export type TransactionListItem = {
  id: string
  accountId: string
  type: 'debit' | 'credit' | 'transfer'
  amount: number
  currency: string
  description: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  balanceAfter: number | null
  reference: string
  recipientName: string | null
  transferKind: string | null
  direction: string | null
  failureReason: string | null
}

export type ListTransactionsParams = {
  page?: number
  limit?: number
  accountId?: string
  type?: string
  search?: string
  sort?: string
}

export type PaginatedTransactionsResponse = {
  items: TransactionListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
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
