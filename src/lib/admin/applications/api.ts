import { API_BASE_URL } from '@/lib/api'
import { AdminAuthError } from '@/lib/admin/errors'
import { authHeaders } from '@/lib/admin/api'
import type {
  AdminApplicationDetail,
  ApiErrorResponse,
  ApiSuccessResponse,
  ListApplicationsParams,
  PaginatedApplicationsResponse,
  ReviewApplicationPayload,
  ReviewApplicationResponse,
} from './types'

function buildSearchParams(params: ListApplicationsParams): URLSearchParams {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.status) searchParams.set('status', params.status)
  if (params.accountType) searchParams.set('accountType', params.accountType)
  if (params.email) searchParams.set('email', params.email.trim().toLowerCase())
  if (params.submittedFrom) searchParams.set('submittedFrom', params.submittedFrom)
  if (params.submittedTo) searchParams.set('submittedTo', params.submittedTo)
  if (params.sort) searchParams.set('sort', params.sort)

  return searchParams
}

export async function fetchAdminApplications(
  token: string,
  params: ListApplicationsParams = {}
): Promise<PaginatedApplicationsResponse> {
  const searchParams = buildSearchParams(params)
  const query = searchParams.toString()
  const url = `${API_BASE_URL}/api/v1/admin/applications${query ? `?${query}` : ''}`

  const response = await fetch(url, {
    headers: authHeaders(token),
    cache: 'no-store',
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<PaginatedApplicationsResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function fetchAdminApplicationById(
  token: string,
  id: string
): Promise<AdminApplicationDetail> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/applications/${id}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<AdminApplicationDetail>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function reviewAdminApplication(
  token: string,
  id: string,
  payload: ReviewApplicationPayload
): Promise<ReviewApplicationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/applications/${id}/review`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<ReviewApplicationResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}
