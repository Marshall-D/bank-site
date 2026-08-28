'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, MessageSquareText } from 'lucide-react'

import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  fetchTransferMessages,
  updateTransferMessage,
} from '@/lib/admin/transfer-messages/api'
import type { TransferMessage } from '@/lib/admin/transfer-messages/types'
import { AdminAuthError } from '@/lib/admin/errors'

export default function AdminTransferMessagesPage() {
  const { token } = useAdminAuth()
  const [items, setItems] = useState<TransferMessage[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [successKey, setSuccessKey] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const messages = await fetchTransferMessages(token)
      setItems(messages)
      setDrafts(Object.fromEntries(messages.map((item) => [item.key, item.message])))
    } catch (err) {
      setError(err instanceof AdminAuthError ? err.message : 'Failed to load transfer messages')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  const handleSave = async (key: string) => {
    if (!token) return
    setSavingKey(key)
    setSuccessKey(null)
    setError(null)
    try {
      const updated = await updateTransferMessage(token, key, drafts[key] || '')
      setItems((prev) => prev.map((item) => (item.key === key ? updated : item)))
      setDrafts((prev) => ({ ...prev, [key]: updated.message }))
      setSuccessKey(key)
    } catch (err) {
      setError(err instanceof AdminAuthError ? err.message : 'Failed to save message')
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Transfer messages</h1>
          <p className="text-muted-foreground">
            Edit customer-facing external transfer block messages. Changes apply immediately without
            redeploying.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to settings
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading transfer messages...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <Card key={item.key} className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquareText className="h-5 w-5" />
                  {item.label}
                </CardTitle>
                <CardDescription>
                  API code: <span className="font-mono">{item.code}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`message-${item.key}`}>Customer message</Label>
                  <Textarea
                    id={`message-${item.key}`}
                    value={drafts[item.key] || ''}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [item.key]: e.target.value }))
                    }
                    rows={4}
                    maxLength={500}
                    disabled={savingKey === item.key}
                  />
                  <p className="text-xs text-muted-foreground">
                    Last updated {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => void handleSave(item.key)}
                    disabled={
                      savingKey === item.key ||
                      (drafts[item.key] || '').trim() === item.message
                    }
                  >
                    {savingKey === item.key ? 'Saving...' : 'Save message'}
                  </Button>
                  {successKey === item.key && (
                    <span className="text-sm text-green-600">Saved</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
