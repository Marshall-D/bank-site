'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BRAND_NAME } from '@/lib/brand'
import { submitPasswordResetRequest } from '@/lib/support/api'
import {
  PASSWORD_RESET_REQUEST_MESSAGE,
  PASSWORD_RESET_REQUEST_SUBJECT,
  SUPPORT_FIELD_LIMITS,
} from '@/lib/support/constants'
import { getSupportErrorMessage } from '@/lib/support/errors'
import { validatePasswordResetForm } from '@/lib/support/passwordResetValidation'

const emptyForm = {
  email: '',
  website: '',
}

export default function ForgotPasswordPage() {
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setTicketId(null)

    const errors = validatePasswordResetForm(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const result = await submitPasswordResetRequest(form)
      setTicketId(result.ticketId)
      setForm(emptyForm)
    } catch (error) {
      setSubmitError(getSupportErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (ticketId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-light/10 via-background to-muted px-4 py-12">
        <Logo size="lg" className="mb-8 max-w-[min(100%,54rem)]" />
        <Card className="w-full max-w-md border-border">
          <CardContent className="pt-12">
            <div className="space-y-4 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Request received</h2>
              <p className="text-muted-foreground">
                Our support team will review your password reset request and follow up with you
                shortly.
              </p>
              <div className="space-y-2 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                <p>
                  Reference: <span className="font-semibold text-foreground">{ticketId}</span>
                </p>
                <p>Keep this reference handy if you need to contact us about your request.</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/login">Back to sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-light/10 via-background to-muted px-4 py-12">
      <Logo size="lg" className="mb-8 max-w-[min(100%,54rem)]" />
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your {BRAND_NAME} email and we&apos;ll send your request to our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="hidden"
            />

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                  setFieldErrors((prev) => {
                    const next = { ...prev }
                    delete next.email
                    return next
                  })
                  setSubmitError(null)
                }}
                maxLength={SUPPORT_FIELD_LIMITS.emailMax}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-message">Message to support</Label>
              <p className="text-xs text-muted-foreground">
                This message is sent automatically so our team knows you need a password reset.
              </p>
              <Input
                id="request-subject"
                value={PASSWORD_RESET_REQUEST_SUBJECT}
                readOnly
                disabled
                className="bg-muted"
              />
              <Textarea
                id="request-message"
                value={PASSWORD_RESET_REQUEST_MESSAGE}
                readOnly
                disabled
                rows={5}
                className="field-sizing-fixed resize-none bg-muted"
              />
            </div>

            {submitError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Sending request...' : 'Send reset request'}
            </Button>
          </form>

          <div className="mt-6">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
