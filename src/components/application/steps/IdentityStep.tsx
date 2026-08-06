'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ACCOUNT_TYPE_OPTIONS } from '@/lib/application/constants'
import {
  requestApplicationEmailOtp,
  verifyApplicationEmailOtp,
} from '@/lib/application/api'
import { getApplicationErrorMessage } from '@/lib/application/errors'
import type { ApplicationFormState } from '@/lib/application/types'
import { FormField } from '../FormField'

type IdentityStepProps = {
  form: ApplicationFormState
  errors: Record<string, string>
  onChange: (updates: Partial<ApplicationFormState>) => void
}

export function IdentityStep({ form, errors, onChange }: IdentityStepProps) {
  const [otpCode, setOtpCode] = useState('')
  const [otpBusy, setOtpBusy] = useState(false)
  const [otpMessage, setOtpMessage] = useState<string | null>(null)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  const emailVerified = Boolean(form.emailVerificationToken)
  const resendSeconds =
    resendAvailableAt != null ? Math.max(0, Math.ceil((resendAvailableAt - now) / 1000)) : 0

  useEffect(() => {
    if (resendSeconds <= 0) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [resendSeconds])

  const handleEmailChange = (value: string) => {
    onChange({ email: value, emailVerificationToken: '' })
    setOtpCode('')
    setOtpMessage(null)
    setOtpError(null)
  }

  const handleSendCode = async () => {
    setOtpBusy(true)
    setOtpError(null)
    setOtpMessage(null)
    try {
      const result = await requestApplicationEmailOtp(form.email)
      setResendAvailableAt(new Date(result.resendAvailableAt).getTime())
      setOtpMessage('We sent a 6-digit code to your email.')
    } catch (error) {
      setOtpError(getApplicationErrorMessage(error))
    } finally {
      setOtpBusy(false)
    }
  }

  const handleVerifyCode = async () => {
    setOtpBusy(true)
    setOtpError(null)
    try {
      const result = await verifyApplicationEmailOtp(form.email, otpCode)
      onChange({ emailVerificationToken: result.emailVerificationToken })
      setOtpMessage('Email verified.')
    } catch (error) {
      setOtpError(getApplicationErrorMessage(error))
    } finally {
      setOtpBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <FormField label="Account type" htmlFor="accountType" error={errors.accountType}>
        <Select
          value={form.accountType}
          onValueChange={(value) =>
            onChange({ accountType: value as ApplicationFormState['accountType'] })
          }
        >
          <SelectTrigger id="accountType" className="w-full">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" htmlFor="firstName" error={errors.firstName}>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </FormField>
        <FormField label="Last name" htmlFor="lastName" error={errors.lastName}>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </FormField>
      </div>

      <FormField label="Middle name (optional)" htmlFor="middleName">
        <Input
          id="middleName"
          value={form.middleName}
          onChange={(e) => onChange({ middleName: e.target.value })}
        />
      </FormField>

      <FormField label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth}>
        <Input
          id="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => onChange({ dateOfBirth: e.target.value })}
        />
      </FormField>

      <FormField label="Nationality" htmlFor="nationality" error={errors.nationality}>
        <Input
          id="nationality"
          value={form.nationality}
          onChange={(e) => onChange({ nationality: e.target.value })}
        />
      </FormField>

      <FormField label="Email address" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={emailVerified}
        />
      </FormField>

      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Verify your email before continuing. We will send a one-time code.
        </p>
        {!emailVerified ? (
          <>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleSendCode}
                disabled={otpBusy || !form.email.trim() || resendSeconds > 0}
              >
                {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'Send code'}
              </Button>
            </div>
            <FormField label="Verification code" htmlFor="emailOtp" error={errors.emailVerificationToken}>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="emailOtp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={otpBusy || otpCode.length !== 6}
                >
                  Verify
                </Button>
              </div>
            </FormField>
          </>
        ) : (
          <p className="text-sm font-medium text-primary">Email verified</p>
        )}
        {otpMessage && !otpError && (
          <p className="text-sm text-muted-foreground">{otpMessage}</p>
        )}
        {otpError && (
          <p className="text-sm text-destructive" role="alert">
            {otpError}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Mobile phone" htmlFor="mobilePhone" error={errors.mobilePhone}>
          <Input
            id="mobilePhone"
            value={form.mobilePhone}
            onChange={(e) => onChange({ mobilePhone: e.target.value })}
            placeholder="+16491234567"
          />
        </FormField>
        <FormField label="Secondary phone (optional)" htmlFor="secondaryPhone">
          <Input
            id="secondaryPhone"
            value={form.secondaryPhone}
            onChange={(e) => onChange({ secondaryPhone: e.target.value })}
          />
        </FormField>
      </div>
    </div>
  )
}
