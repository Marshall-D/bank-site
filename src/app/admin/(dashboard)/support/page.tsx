'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'

import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  fetchAdminSupportMessages,
  type SupportMessageListItem,
} from '@/lib/admin/support/api'
import { getAdminAuthErrorMessage } from '@/lib/admin/errors'
import { SUPPORT_STATUS_LABELS, SUPPORT_SOURCE_LABELS } from '@/lib/support/constants'
import { formatDate } from '@/lib/utils'

type StatusFilter = 'all' | 'new' | 'in_progress' | 'resolved'
type SourceFilter = 'all' | 'public_support_form' | 'password_reset'

function sourceBadgeVariant(source: string): 'default' | 'secondary' | 'outline' {
  if (source === 'password_reset') return 'secondary'
  return 'outline'
}

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' {
  if (status === 'new') return 'default'
  if (status === 'in_progress') return 'secondary'
  return 'outline'
}

export default function AdminSupportPage() {
  const { token, logout } = useAdminAuth()
  const [items, setItems] = useState<SupportMessageListItem[]>([])
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all')
  const [filterSource, setFilterSource] = useState<SourceFilter>('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchAdminSupportMessages(token, {
        page: 1,
        limit: 50,
        sort: '-createdAt',
        status: filterStatus === 'all' ? undefined : filterStatus,
        source: filterSource === 'all' ? undefined : filterSource,
      })
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
  }, [filterSource, filterStatus, logout, token])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Support inbox</h1>
          <p className="text-muted-foreground">Messages submitted from the public support form</p>
        </div>
        <Button variant="outline" onClick={loadMessages} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as StatusFilter)}
              >
                <SelectTrigger id="support-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select
                value={filterSource}
                onValueChange={(value) => setFilterSource(value as SourceFilter)}
              >
                <SelectTrigger id="support-source">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="public_support_form">Support form</SelectItem>
                  <SelectItem value="password_reset">Password reset</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            {pagination.total} message{pagination.total === 1 ? '' : 's'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading messages...</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No messages found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.ticketId}</TableCell>
                      <TableCell>
                        <Badge variant={sourceBadgeVariant(item.source)}>
                          {SUPPORT_SOURCE_LABELS[item.source] || item.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate">{item.subject}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(item.status)}>
                          {SUPPORT_STATUS_LABELS[item.status] || item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(new Date(item.createdAt))}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/support/${item.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
