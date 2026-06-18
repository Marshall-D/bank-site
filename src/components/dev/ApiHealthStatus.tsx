'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { API_BASE_URL, fetchHealth, type HealthResponse } from '@/lib/api'

type CheckState = 'loading' | 'ok' | 'error'

export function ApiHealthStatus() {
  const [state, setState] = useState<CheckState>('loading')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchHealth()
      .then((data) => {
        if (cancelled) return
        setHealth(data)
        setState('ok')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Connection failed')
        setState('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className="border-b border-border bg-muted/40 px-4 py-2 text-sm"
      role="status"
      aria-live="polite"
    >
      <div className="container mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        <span className="font-medium text-muted-foreground">API connectivity:</span>

        {state === 'loading' && (
          <Badge variant="outline" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Checking backend...
          </Badge>
        )}

        {state === 'ok' && health && (
          <>
            <Badge variant="default">Connected</Badge>
            <span className="text-muted-foreground">
              {health.service} · database {health.database}
            </span>
          </>
        )}

        {state === 'error' && (
          <>
            <Badge variant="destructive">Unreachable</Badge>
            <span className="text-muted-foreground">{error}</span>
          </>
        )}

        <span className="ml-auto text-xs text-muted-foreground">{API_BASE_URL}/health</span>
      </div>
    </div>
  )
}
