'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAdminApplicationById } from '@/lib/admin/applications/api'
import type { AdminApplicationDetailResponse } from '@/lib/admin/applications/types'
import { getAdminAuthErrorMessage } from '@/lib/admin/errors'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { formatDate } from '@/lib/utils'

export default function AdminApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const { token, logout } = useAdminAuth()
  const [item, setItem] = useState<AdminApplicationDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const applicationId = params?.id

  const loadApplication = useCallback(async () => {
    if (!token || !applicationId) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchAdminApplicationById(token, applicationId)
      setItem(result)
    } catch (err) {
      const message = getAdminAuthErrorMessage(err)
      if (message.toLowerCase().includes('authentication') || message.toLowerCase().includes('invalid')) {
        logout()
        return
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [applicationId, logout, token])

  useEffect(() => {
    loadApplication()
  }, [loadApplication])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Application detail</h1>
          <p className="text-muted-foreground">
            Review applicant profile and submission metadata.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/applications">Back to applications</Link>
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading application...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : !item ? (
            <p className="text-sm text-muted-foreground">Application not found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Reference</p>
                <p className="font-mono text-sm">{item.applicationReference}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge>{APPLICATION_STATUS_LABELS[item.status] || item.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Applicant</p>
                <p className="font-medium">{item.applicantName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p>{item.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Type</p>
                <p>{item.accountType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nationality</p>
                <p>{item.nationality}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p>{item.submittedAt ? formatDate(new Date(item.submittedAt)) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reviewed</p>
                <p>{item.reviewedAt ? formatDate(new Date(item.reviewedAt)) : '—'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
