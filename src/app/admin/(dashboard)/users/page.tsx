'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, Clock, Search, XCircle } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Badge } from '@/components/ui/badge'
import { fetchAdminApplications } from '@/lib/admin/applications/api'
import type { AdminApplicationListItem } from '@/lib/admin/applications/types'
import { getAdminAuthErrorMessage } from '@/lib/admin/errors'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { formatDate } from '@/lib/utils'

type QueueFilter = 'all' | 'submitted' | 'pending_review' | 'approved' | 'rejected'

export default function AdminUsersPage() {
  const { token, logout } = useAdminAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<QueueFilter>('all')
  const [items, setItems] = useState<AdminApplicationListItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  const loadCounts = useCallback(async () => {
    if (!token) return
    const [submittedRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
      fetchAdminApplications(token, { status: 'submitted', limit: 1, page: 1 }),
      fetchAdminApplications(token, { status: 'pending_review', limit: 1, page: 1 }),
      fetchAdminApplications(token, { status: 'approved', limit: 1, page: 1 }),
      fetchAdminApplications(token, { status: 'rejected', limit: 1, page: 1 }),
    ])

    setCounts({
      pending: submittedRes.pagination.total + pendingRes.pagination.total,
      approved: approvedRes.pagination.total,
      rejected: rejectedRes.pagination.total,
    })
  }, [token])

  const loadQueue = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        page: 1,
        limit: 50,
        sort: '-submittedAt',
        status: filterStatus === 'all' ? undefined : filterStatus,
      }
      const response = await fetchAdminApplications(token, params)
      setItems(response.items)
      setTotalCount(response.pagination.total)
      await loadCounts()
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
  }, [filterStatus, loadCounts, logout, token])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return items
    const needle = searchTerm.trim().toLowerCase()
    return items.filter((user) => {
      return (
        user.applicantName.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.applicationReference.toLowerCase().includes(needle)
      )
    })
  }, [items, searchTerm])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Review application queue and KYC statuses</p>
        </div>
        <Button variant="outline" onClick={loadQueue} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Clock, label: 'Pending Reviews', value: counts.pending.toLocaleString(), tone: 'amber' },
          { icon: CheckCircle2, label: 'Approved', value: counts.approved.toLocaleString(), tone: 'green' },
          { icon: XCircle, label: 'Rejected', value: counts.rejected.toLocaleString(), tone: 'red' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      stat.tone === 'green'
                        ? 'bg-green-500/10'
                        : stat.tone === 'red'
                          ? 'bg-red-500/10'
                          : 'bg-amber-500/10'
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        stat.tone === 'green'
                          ? 'text-green-600'
                          : stat.tone === 'red'
                            ? 'text-red-600'
                            : 'text-amber-600'
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">
                Application Status
              </Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as QueueFilter)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="pending_review">Under review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>KYC Reviews</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {totalCount} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-0">
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading applications...</p>
            ) : filteredUsers.length > 0 ? (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Reference</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Submitted</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">{user.applicantName}</td>
                        <td className="py-4 px-4 text-xs font-mono">{user.applicationReference}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="py-4 px-4 text-sm">
                          {user.submittedAt ? formatDate(new Date(user.submittedAt)) : '—'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge>{APPLICATION_STATUS_LABELS[user.status] || user.status}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button size="sm" asChild>
                            <Link href={`/admin/applications/${user.id}`}>Review</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}

            <div className="md:hidden space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{user.applicantName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        {user.applicationReference}
                      </p>
                    </div>
                    <Badge>{APPLICATION_STATUS_LABELS[user.status] || user.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{user.nationality}</span>
                    <span>{user.submittedAt ? formatDate(new Date(user.submittedAt)) : '—'}</span>
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/admin/applications/${user.id}`}>Review KYC</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
