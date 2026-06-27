import { API_BASE_URL } from '@/lib/api'
import { CustomerAuthError } from '@/lib/auth/errors'

import { downloadBlob, getFilenameFromContentDisposition } from './download'
import type { ApiErrorResponse, ApiSuccessResponse, ListStatementsResponse } from './types'

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function fetchStatementPeriods(
  token: string,
  accountId: string
): Promise<ListStatementsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/statements?accountId=${encodeURIComponent(accountId)}`,
    {
      headers: authHeaders(token),
      cache: 'no-store',
    }
  )

  const data = (await response.json()) as
    | ApiSuccessResponse<ListStatementsResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function downloadStatementPdf(
  token: string,
  accountId: string,
  period: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/statements/${accountId}/${period}/download`,
    {
      headers: authHeaders(token),
    }
  )

  if (!response.ok) {
    let message = 'Failed to download statement'
    try {
      const data = (await response.json()) as ApiErrorResponse
      message = data.message || message
    } catch {
      // ignore parse errors
    }
    throw new CustomerAuthError({ success: false, message, code: 'STATEMENT_DOWNLOAD_FAILED' })
  }

  const blob = await response.blob()
  const filename =
    getFilenameFromContentDisposition(response.headers.get('Content-Disposition')) ||
    `brcb-statement-${period}.pdf`

  downloadBlob(blob, filename)
}
