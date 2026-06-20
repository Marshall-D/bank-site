'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchAdminApplications } from '@/lib/admin/applications/api'
import {
  ADMIN_ACCOUNT_TYPE_FILTER_OPTIONS,
  ADMIN_APPLICATION_SORT_OPTIONS,
  ADMIN_APPLICATION_STATUS_FILTER_OPTIONS,
} from '@/lib/admin/applications/constants'
import type { AdminApplicationListItem, ListApplicationsParams } from '@/lib/admin/applications/types'
import { getAdminAuthErrorMessage } from '@/lib/admin/errors'
import { ACCOUNT_TYPE_OPTIONS } from '@/lib/application/constants'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { formatDate } from '@/lib/utils'

const ACCOUNT_TYPE_LABELS = Object.fromEntries(
  ACCOUNT_TYPE_OPTIONS.map(({ value, label }) => [value, label])
)

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'submitted' || status === 'pending_review') return 'default'
  if (status === 'need_more_info') return 'secondary'
  if (status === 'rejected') return 'destructive'
  return 'outline'
}

function parseFiltersFromSearchParams(searchParams: URLSearchParams): ListApplicationsParams {
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '20')

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 20,
    status: searchParams.get('status') || undefined,
    accountType: searchParams.get('accountType') || undefined,
    email: searchParams.get('email') || undefined,
    submittedFrom: searchParams.get('submittedFrom') || undefined,
    submittedTo: searchParams.get('submittedTo') || undefined,
    sort: searchParams.get('sort') || '-submittedAt',
  }
}

function filtersToSearchParams(filters: ListApplicationsParams): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  if (filters.limit && filters.limit !== 20) params.set('limit', String(filters.limit))
  if (filters.status) params.set('status', filters.status)
  if (filters.accountType) params.set('accountType', filters.accountType)
  if (filters.email) params.set('email', filters.email)
  if (filters.submittedFrom) params.set('submittedFrom', filters.submittedFrom)
  if (filters.submittedTo) params.set('submittedTo', filters.submittedTo)
  if (filters.sort && filters.sort !== '-submittedAt') params.set('sort', filters.sort)

  return params
}

export default function AdminApplicationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, logout } = useAdminAuth()

  const activeFilters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams]
  )

  const [formFilters, setFormFilters] = useState({
    status: activeFilters.status || 'all',
    accountType: activeFilters.accountType || 'all',
    email: activeFilters.email || '',
    submittedFrom: activeFilters.submittedFrom || '',
    submittedTo: activeFilters.submittedTo || '',
    sort: activeFilters.sort || '-submittedAt',
  })

  const [items, setItems] = useState<AdminApplicationListItem[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormFilters({
      status: activeFilters.status || 'all',
      accountType: activeFilters.accountType || 'all',
      email: activeFilters.email || '',
      submittedFrom: activeFilters.submittedFrom || '',
      submittedTo: activeFilters.submittedTo || '',
      sort: activeFilters.sort || '-submittedAt',
    })
  }, [activeFilters])

  const loadApplications = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchAdminApplications(token, activeFilters)
      setItems(result.items)
      setPagination(result.pagination)
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
  }, [token, activeFilters, logout])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  const applyFilters = () => {
    const nextFilters: ListApplicationsParams = {
      page: 1,
      limit: activeFilters.limit,
      sort: formFilters.sort,
    }

    if (formFilters.status !== 'all') nextFilters.status = formFilters.status
    if (formFilters.accountType !== 'all') nextFilters.accountType = formFilters.accountType
    if (formFilters.email.trim().length >= 3) nextFilters.email = formFilters.email.trim()
    if (formFilters.submittedFrom) nextFilters.submittedFrom = formFilters.submittedFrom
    if (formFilters.submittedTo) nextFilters.submittedTo = formFilters.submittedTo

    const params = filtersToSearchParams(nextFilters)
    router.push(`/admin/applications${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const clearFilters = () => {
    router.push('/admin/applications')
  }

  const goToPage = (page: number) => {
    const params = filtersToSearchParams({ ...activeFilters, page })
    router.push(`/admin/applications?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">
            Review submitted account applications
          </p>
        </div>
        <Button variant="outline" onClick={loadApplications} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter by status, account type, email, or submission date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formFilters.status}
                onValueChange={(value) => setFormFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_APPLICATION_STATUS_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account type</Label>
              <Select
                value={formFilters.accountType}
                onValueChange={(value) => setFormFilters((prev) => ({ ...prev, accountType: value }))}
              >
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="All account types" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_ACCOUNT_TYPE_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort</Label>
              <Select
                value={formFilters.sort}
                onValueChange={(value) => setFormFilters((prev) => ({ ...prev, sort: value }))}
              >
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_APPLICATION_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email contains</Label>
              <Input
                id="email"
                placeholder="Min. 3 characters"
                value={formFilters.email}
                onChange={(e) => setFormFilters((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="submittedFrom">Submitted from</Label>
              <Input
                id="submittedFrom"
                type="date"
                value={formFilters.submittedFrom}
                onChange={(e) => setFormFilters((prev) => ({ ...prev, submittedFrom: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="submittedTo">Submitted to</Label>
              <Input
                id="submittedTo"
                type="date"
                value={formFilters.submittedTo}
                onChange={(e) => setFormFilters((prev) => ({ ...prev, submittedTo: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={applyFilters}>
              <Search className="mr-2 h-4 w-4" />
              Apply filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Application queue</CardTitle>
            <CardDescription>
              {pagination.total} application{pagination.total === 1 ? '' : 's'} found
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading applications...</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No applications match your filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.applicationReference}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{item.nationality}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        {ACCOUNT_TYPE_LABELS[item.accountType] || item.accountType}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(item.status)}>
                          {APPLICATION_STATUS_LABELS[item.status] || item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.submittedAt ? formatDate(new Date(item.submittedAt)) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/applications/${item.id}`}>Review</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1 || isLoading}
                  onClick={() => goToPage(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  onClick={() => goToPage(pagination.page + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
