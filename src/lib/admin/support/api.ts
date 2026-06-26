import { API_BASE_URL } from '@/lib/api'
import { AdminAuthError } from '@/lib/admin/errors'
import { authHeaders } from '@/lib/admin/api'

export type SupportMessageListItem = {
  id: string
  ticketId: string
  name: string
  email: string
  subject: string
  status: string
  createdAt: string
}

export type SupportMessageDetail = SupportMessageListItem & {
  message: string
  source: string
  updatedAt: string
}

export type ListSupportMessagesParams = {
  page?: number
  limit?: number
  status?: string
  email?: string
  sort?: string
}

export type PaginatedSupportMessagesResponse = {
  items: SupportMessageListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type ApiErrorResponse = {
  success: false
  message: string
  code: string
}

type ApiSuccessResponse<T> = {
  success: true
  data: T
}

function buildSearchParams(params: ListSupportMessagesParams): URLSearchParams {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.status) searchParams.set('status', params.status)
  if (params.email) searchParams.set('email', params.email.trim().toLowerCase())
  if (params.sort) searchParams.set('sort', params.sort)

  return searchParams
}

export async function fetchAdminSupportMessages(
  token: string,
  params: ListSupportMessagesParams = {}
): Promise<PaginatedSupportMessagesResponse> {
  const searchParams = buildSearchParams(params)
  const query = searchParams.toString()
  const url = `${API_BASE_URL}/api/v1/admin/support/messages${query ? `?${query}` : ''}`

  const response = await fetch(url, {
    headers: authHeaders(token),
    cache: 'no-store',
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<PaginatedSupportMessagesResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function fetchAdminSupportMessageById(
  token: string,
  id: string
): Promise<SupportMessageDetail> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/support/messages/${id}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  })

  const data = (await response.json()) as ApiSuccessResponse<SupportMessageDetail> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function updateAdminSupportMessageStatus(
  token: string,
  id: string,
  status: string
): Promise<SupportMessageDetail> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/support/messages/${id}`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  const data = (await response.json()) as ApiSuccessResponse<SupportMessageDetail> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}
