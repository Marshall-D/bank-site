import { API_BASE_URL } from '@/lib/api'
import { CustomerAuthError } from '@/lib/auth/errors'

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ListTransactionsParams,
  PaginatedTransactionsResponse,
} from './types'

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

function buildSearchParams(params: ListTransactionsParams): URLSearchParams {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.accountId) searchParams.set('accountId', params.accountId)
  if (params.type) searchParams.set('type', params.type)
  if (params.search) searchParams.set('search', params.search.trim())
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.from) searchParams.set('from', params.from)
  if (params.to) searchParams.set('to', params.to)

  return searchParams
}

export async function fetchTransactions(
  token: string,
  params: ListTransactionsParams = {}
): Promise<PaginatedTransactionsResponse> {
  const searchParams = buildSearchParams(params)
  const query = searchParams.toString()
  const url = `${API_BASE_URL}/api/v1/transactions${query ? `?${query}` : ''}`

  const response = await fetch(url, {
    headers: authHeaders(token),
    cache: 'no-store',
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<PaginatedTransactionsResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}
