'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchApplicationStatus } from '@/lib/application/api'
import {
  ApplicationApiError,
  getApplicationErrorMessage,
} from '@/lib/application/errors'
import {
  APPLICATION_NEXT_STEP_LABELS,
  APPLICATION_STATUS_LABELS,
} from '@/lib/application/statusLabels'
import type { ApplicationStatusResponse } from '@/lib/application/types'
import { BRAND_NAME } from '@/lib/brand'

export default function ApplicationStatusPage() {
  const searchParams = useSearchParams()
  const [reference, setReference] = useState(searchParams.get('ref') ?? '')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<ApplicationStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const status = await fetchApplicationStatus(reference, email)
      setResult(status)
    } catch (err) {
      if (err instanceof ApplicationApiError && err.code === 'APPLICATION_NOT_FOUND') {
        setError('No application found for that reference and email. Please check your details.')
      } else {
        setError(getApplicationErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-muted px-4 py-12">
      <div className="mx-auto max-w-lg">
        <Logo size="lg" className="mb-8 max-w-[min(100%,54rem)]" />
        <Card className="border-border">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Check application status</CardTitle>
            <CardDescription>
              Enter the reference and email you used when applying to {BRAND_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Application reference</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="APP-2026-XXXXXX"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Checking status...' : 'Check status'}
              </Button>
            </form>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-semibold">{result.applicationReference}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">
                    {APPLICATION_STATUS_LABELS[result.status] ?? result.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next step</p>
                  <p className="text-sm">
                    {APPLICATION_NEXT_STEP_LABELS[result.nextStep] ?? result.nextStep}
                  </p>
                </div>
                {result.needMoreInfoNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes from reviewer</p>
                    <p className="text-sm">{result.needMoreInfoNotes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Apply for an account</Link>
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">Return to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
