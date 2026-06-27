import { API_BASE_URL } from '@/lib/api'
import { CustomerAuthError } from '@/lib/auth/errors'

import { downloadBlob, getFilenameFromContentDisposition } from './download'
import type { ApiErrorResponse, ExportTransactionsParams } from './types'

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

function buildSearchParams(params: ExportTransactionsParams): URLSearchParams {
  const searchParams = new URLSearchParams()
  searchParams.set('format', 'csv')

  if (params.accountId) searchParams.set('accountId', params.accountId)
  if (params.type && params.type !== 'all') searchParams.set('type', params.type)
  if (params.search) searchParams.set('search', params.search.trim())
  if (params.from) searchParams.set('from', params.from)
  if (params.to) searchParams.set('to', params.to)

  return searchParams
}

export async function downloadTransactionsCsv(
  token: string,
  params: ExportTransactionsParams = {}
): Promise<void> {
  const query = buildSearchParams(params).toString()
  const response = await fetch(`${API_BASE_URL}/api/v1/transactions/export?${query}`, {
    headers: authHeaders(token),
  })

  if (!response.ok) {
    let message = 'Failed to export transactions'
    try {
      const data = (await response.json()) as ApiErrorResponse
      message = data.message || message
    } catch {
      // ignore parse errors
    }
    throw new CustomerAuthError({ success: false, message, code: 'EXPORT_FAILED' })
  }

  const blob = await response.blob()
  const filename =
    getFilenameFromContentDisposition(response.headers.get('Content-Disposition')) ||
    `brcb-transactions-${new Date().toISOString().slice(0, 10)}.csv`

  downloadBlob(blob, filename)
}
