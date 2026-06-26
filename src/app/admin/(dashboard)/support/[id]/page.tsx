'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  fetchAdminSupportMessageById,
  updateAdminSupportMessageStatus,
  type SupportMessageDetail,
} from '@/lib/admin/support/api'
import { getAdminAuthErrorMessage } from '@/lib/admin/errors'
import { SUPPORT_SOURCE_LABELS, SUPPORT_STATUS_LABELS } from '@/lib/support/constants'
import { formatDateLong } from '@/lib/utils'

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' {
  if (status === 'new') return 'default'
  if (status === 'in_progress') return 'secondary'
  return 'outline'
}

export default function AdminSupportDetailPage() {
  const params = useParams<{ id: string }>()
  const { token, logout } = useAdminAuth()
  const [item, setItem] = useState<SupportMessageDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messageId = params?.id

  const loadMessage = useCallback(async () => {
    if (!token || !messageId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchAdminSupportMessageById(token, messageId)
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
  }, [logout, messageId, token])

  useEffect(() => {
    loadMessage()
  }, [loadMessage])

  const handleStatusChange = async (status: string) => {
    if (!token || !messageId) return

    setIsUpdating(true)
    setError(null)

    try {
      const updated = await updateAdminSupportMessageStatus(token, messageId, status)
      setItem(updated)
    } catch (err) {
      setError(getAdminAuthErrorMessage(err))
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Loading message...</p>
  }

  if (error && !item) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/support">Back to inbox</Link>
        </Button>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Message not found.</p>
        <Button asChild variant="outline">
          <Link href="/admin/support">Back to inbox</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{item.ticketId}</h1>
            <Badge variant={statusBadgeVariant(item.status)}>
              {SUPPORT_STATUS_LABELS[item.status] || item.status}
            </Badge>
            <Badge variant={item.source === 'password_reset' ? 'secondary' : 'outline'}>
              {SUPPORT_SOURCE_LABELS[item.source] || item.source}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {item.name} · {item.email} · Received {formatDateLong(new Date(item.createdAt))}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/support">Back to inbox</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>{item.subject}</CardTitle>
          <div className="w-44">
            <Select
              value={item.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{item.message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
