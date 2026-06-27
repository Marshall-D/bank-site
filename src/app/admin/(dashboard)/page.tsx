'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, FileCheck, RefreshCw, Users } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAdminApplications } from '@/lib/admin/applications/api'
import { fetchApplicationStatusCounts } from '@/lib/admin/applications/stats'
import type { AdminApplicationListItem } from '@/lib/admin/applications/types'
import { getAdminAuthErrorMessage } from '@/lib/admin/errors'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { formatDate } from '@/lib/utils'

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'submitted' || status === 'pending_review') return 'default'
  if (status === 'need_more_info') return 'secondary'
  if (status === 'rejected') return 'destructive'
  return 'outline'
}

type DashboardStats = {
  pendingReviews: number
  approvedApplications: number
  rejectedApplications: number
}

export default function AdminDashboardPage() {
  const { token, logout } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    pendingReviews: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  })
  const [pendingItems, setPendingItems] = useState<AdminApplicationListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const [pendingReviewRes, submittedRes, needMoreInfoRes, statusCounts] = await Promise.all([
        fetchAdminApplications(token, { status: 'pending_review', page: 1, limit: 5, sort: '-submittedAt' }),
        fetchAdminApplications(token, { status: 'submitted', page: 1, limit: 5, sort: '-submittedAt' }),
        fetchAdminApplications(token, { status: 'need_more_info', page: 1, limit: 5, sort: '-submittedAt' }),
        fetchApplicationStatusCounts(token),
      ])

      const pendingById = new Map<string, AdminApplicationListItem>()
      for (const item of [...submittedRes.items, ...pendingReviewRes.items, ...needMoreInfoRes.items]) {
        pendingById.set(item.id, item)
      }
      const mergedPending = [...pendingById.values()]
        .sort((a, b) => {
          const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
          const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
          return bTime - aTime
        })
        .slice(0, 5)

      setPendingItems(mergedPending)
      setStats({
        pendingReviews: statusCounts.pending,
        approvedApplications: statusCounts.approved,
        rejectedApplications: statusCounts.rejected,
      })
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
  }, [logout, token])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const statCards = useMemo(
    () => [
      {
        icon: Users,
        title: 'Approved Applications',
        value: stats.approvedApplications.toLocaleString(),
        helper: 'Approved, awaiting activation, and active',
      },
      {
        icon: FileCheck,
        title: 'Pending KYC',
        value: stats.pendingReviews.toLocaleString(),
        helper: 'Submitted, under review, or awaiting more info',
        highlight: true,
      },
      {
        icon: AlertCircle,
        title: 'Rejected Applications',
        value: stats.rejectedApplications.toLocaleString(),
        helper: 'Needs follow-up or resubmission',
      },
    ],
    [stats]
  )

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor application activity and review queue</p>
        </div>
        <Button variant="outline" onClick={loadDashboardData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={`border-border ${stat.highlight ? 'ring-2 ring-amber-400' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{isLoading ? '—' : stat.value}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{stat.helper}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.highlight ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                    <Icon className={`h-6 w-6 ${stat.highlight ? 'text-amber-600' : 'text-primary'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending KYC Reviews</CardTitle>
                <CardDescription>Applications awaiting verification</CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/admin/applications">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="py-6 text-sm text-muted-foreground">Loading applications...</p>
              ) : pendingItems.length === 0 ? (
                <p className="py-6 text-sm text-muted-foreground">No applications currently awaiting review.</p>
              ) : (
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{item.applicantName}</p>
                        <p className="text-sm text-muted-foreground">{item.email}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Submitted {item.submittedAt ? formatDate(new Date(item.submittedAt)) : '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={statusBadgeVariant(item.status)}>
                          {APPLICATION_STATUS_LABELS[item.status] || item.status}
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/applications/${item.id}`}>Review</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/applications">Manage Applications</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/users">Review Queue</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Admin API', status: 'Connected' },
                { name: 'Authentication', status: 'Connected' },
                { name: 'Application Queue', status: 'Connected' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <p className="text-sm">{service.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-xs text-muted-foreground">{service.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
