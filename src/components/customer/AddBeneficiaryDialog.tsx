'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBeneficiary } from '@/lib/beneficiaries/api'
import { BENEFICIARY_FIELD_LIMITS } from '@/lib/beneficiaries/constants'
import type { Beneficiary } from '@/lib/beneficiaries/types'
import { validateBeneficiaryForm } from '@/lib/beneficiaries/validation'
import { getCustomerAuthErrorMessage } from '@/lib/auth/errors'

const emptyForm = {
  name: '',
  bankName: '',
  accountNumber: '',
}

type AddBeneficiaryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  token: string
  onCreated: (beneficiary: Beneficiary) => void
}

export function AddBeneficiaryDialog({
  open,
  onOpenChange,
  token,
  onCreated,
}: AddBeneficiaryDialogProps) {
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateBeneficiaryForm(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const beneficiary = await createBeneficiary(token, form)
      onCreated(beneficiary)
      setForm(emptyForm)
      onOpenChange(false)
    } catch (error) {
      setSubmitError(getCustomerAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setForm(emptyForm)
          setFieldErrors({})
          setSubmitError(null)
        }
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add beneficiary</DialogTitle>
          <DialogDescription>
            Save someone you send money to. You can use them when making external transfers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="beneficiary-name">Full name</Label>
            <Input
              id="beneficiary-name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              maxLength={BENEFICIARY_FIELD_LIMITS.nameMax}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiary-bank">Bank name</Label>
            <Input
              id="beneficiary-bank"
              value={form.bankName}
              onChange={(e) => updateField('bankName', e.target.value)}
              maxLength={BENEFICIARY_FIELD_LIMITS.bankNameMax}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.bankName && (
              <p className="text-sm text-destructive">{fieldErrors.bankName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiary-account">Account number</Label>
            <Input
              id="beneficiary-account"
              value={form.accountNumber}
              onChange={(e) => updateField('accountNumber', e.target.value)}
              maxLength={BENEFICIARY_FIELD_LIMITS.accountNumberMax}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.accountNumber && (
              <p className="text-sm text-destructive">{fieldErrors.accountNumber}</p>
            )}
          </div>

          {submitError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save beneficiary'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
