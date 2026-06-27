import { fetchAdminApplications } from './api'

export type ApplicationStatusCounts = {
  pending: number
  approved: number
  rejected: number
}

const PENDING_STATUSES = ['submitted', 'pending_review', 'need_more_info'] as const
const APPROVED_STATUSES = ['approved', 'credentials_pending', 'active'] as const

async function sumTotalsByStatus(token: string, statuses: readonly string[]): Promise<number> {
  const responses = await Promise.all(
    statuses.map((status) => fetchAdminApplications(token, { status, limit: 1, page: 1 }))
  )

  return responses.reduce((sum, response) => sum + response.pagination.total, 0)
}

export async function fetchApplicationStatusCounts(token: string): Promise<ApplicationStatusCounts> {
  const [pending, approved, rejectedRes] = await Promise.all([
    sumTotalsByStatus(token, PENDING_STATUSES),
    sumTotalsByStatus(token, APPROVED_STATUSES),
    fetchAdminApplications(token, { status: 'rejected', limit: 1, page: 1 }),
  ])

  return {
    pending,
    approved,
    rejected: rejectedRes.pagination.total,
  }
}
