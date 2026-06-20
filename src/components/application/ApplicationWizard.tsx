'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApplicationProgress } from '@/components/application/ApplicationProgress'
import { AddressStep } from '@/components/application/steps/AddressStep'
import { DocumentsStep } from '@/components/application/steps/DocumentsStep'
import { FinancialStep } from '@/components/application/steps/FinancialStep'
import { IdentityStep } from '@/components/application/steps/IdentityStep'
import { ReviewStep } from '@/components/application/steps/ReviewStep'
import { createApplication } from '@/lib/application/api'
import { defaultApplicationFormState } from '@/lib/application/defaultFormState'
import {
  ApplicationApiError,
  getApplicationErrorMessage,
} from '@/lib/application/errors'
import {
  createLocalDocumentFile,
  emptyLocalDocumentsState,
  revokeAllLocalDocumentPreviews,
  revokeLocalDocumentPreview,
  validateDocumentFile,
  validateLocalDocuments,
  type LocalDocumentFile,
  type LocalDocumentsState,
} from '@/lib/application/localDocuments'
import { mapFormToPayload } from '@/lib/application/mapFormToPayload'
import type { AddressFormState, ApplicationFormState } from '@/lib/application/types'
import {
  addressStepSchema,
  documentsStepSchema,
  financialStepSchema,
  formatZodErrors,
  identityStepSchema,
  mapApiFieldErrors,
  reviewStepSchema,
} from '@/lib/application/validation'
import { BRAND_NAME } from '@/lib/brand'

const TOTAL_STEPS = 5

export function ApplicationWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<ApplicationFormState>(defaultApplicationFormState)
  const [localDocuments, setLocalDocuments] =
    useState<LocalDocumentsState>(emptyLocalDocumentsState)
  const localDocumentsRef = useRef(localDocuments)
  localDocumentsRef.current = localDocuments
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    return () => revokeAllLocalDocumentPreviews(localDocumentsRef.current)
  }, [])

  const updateForm = (updates: Partial<ApplicationFormState>) => {
    setForm((prev) => ({ ...prev, ...updates }))
    setFieldErrors({})
    setSubmitError(null)
  }

  const updateResidentialAddress = (updates: Partial<AddressFormState>) => {
    setForm((prev) => ({
      ...prev,
      residentialAddress: { ...prev.residentialAddress, ...updates },
    }))
    setFieldErrors({})
  }

  const updateMailingAddress = (updates: Partial<AddressFormState>) => {
    setForm((prev) => ({
      ...prev,
      mailingAddress: { ...prev.mailingAddress, ...updates },
    }))
    setFieldErrors({})
  }

  const handleDocumentSelect = (slot: LocalDocumentFile['slot'], file: File) => {
    const validationError = validateDocumentFile(file)
    if (validationError) {
      const errorKey =
        slot === 'idFront'
          ? 'idFrontFile'
          : slot === 'idBack'
            ? 'idBackFile'
            : 'proofOfAddressFile'
      setFieldErrors((prev) => ({ ...prev, [errorKey]: validationError }))
      return
    }

    setLocalDocuments((prev) => {
      const existing = prev[slot]
      revokeLocalDocumentPreview(existing)
      return {
        ...prev,
        [slot]: createLocalDocumentFile(slot, file),
      }
    })

    setFieldErrors((prev) => {
      const next = { ...prev }
      const errorKey =
        slot === 'idFront'
          ? 'idFrontFile'
          : slot === 'idBack'
            ? 'idBackFile'
            : 'proofOfAddressFile'
      delete next[errorKey]
      return next
    })
    setSubmitError(null)
  }

  const handleDocumentRemove = (slot: LocalDocumentFile['slot']) => {
    setLocalDocuments((prev) => {
      revokeLocalDocumentPreview(prev[slot])
      return { ...prev, [slot]: null }
    })
  }

  const validateCurrentStep = () => {
    if (step === 1) {
      return identityStepSchema.safeParse(form)
    }
    if (step === 2) {
      return addressStepSchema.safeParse(form)
    }
    if (step === 3) {
      return documentsStepSchema.safeParse(form)
    }
    if (step === 4) {
      return financialStepSchema.safeParse(form)
    }
    return reviewStepSchema.safeParse(form)
  }

  const handleNext = () => {
    const result = validateCurrentStep()
    if (!result.success) {
      setFieldErrors(formatZodErrors(result.error))
      return
    }

    if (step === 3) {
      const documentErrors = validateLocalDocuments(localDocuments)
      if (Object.keys(documentErrors).length > 0) {
        setFieldErrors(documentErrors)
        return
      }
    }

    setFieldErrors({})
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  const handleBack = () => {
    setFieldErrors({})
    setSubmitError(null)
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    const result = reviewStepSchema.safeParse(form)
    if (!result.success) {
      setFieldErrors(formatZodErrors(result.error))
      return
    }

    const documentErrors = validateLocalDocuments(localDocuments)
    if (Object.keys(documentErrors).length > 0) {
      setFieldErrors(documentErrors)
      setSubmitError('Please go back and upload the required document images.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setFieldErrors({})

    try {
      const payload = mapFormToPayload(form, localDocuments)
      const response = await createApplication(payload)
      router.push(
        `/register/confirmation?ref=${encodeURIComponent(response.applicationReference)}`
      )
    } catch (error) {
      if (error instanceof ApplicationApiError && error.errors?.length) {
        setFieldErrors(mapApiFieldErrors(error.errors))
      }
      setSubmitError(getApplicationErrorMessage(error))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-muted px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Logo size="lg" className="mb-8 max-w-[min(100%,54rem)]" />
        <Card className="border-border">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Open an account</CardTitle>
            <CardDescription>
              Complete your {BRAND_NAME} application. Your account will be reviewed before
              online banking access is granted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationProgress currentStep={step} />

            {step === 1 && (
              <IdentityStep form={form} errors={fieldErrors} onChange={updateForm} />
            )}
            {step === 2 && (
              <AddressStep
                form={form}
                errors={fieldErrors}
                onChange={updateForm}
                onResidentialAddressChange={updateResidentialAddress}
                onMailingAddressChange={updateMailingAddress}
              />
            )}
            {step === 3 && (
              <DocumentsStep
                form={form}
                localDocuments={localDocuments}
                errors={fieldErrors}
                onChange={updateForm}
                onDocumentSelect={handleDocumentSelect}
                onDocumentRemove={handleDocumentRemove}
              />
            )}
            {step === 4 && (
              <FinancialStep form={form} errors={fieldErrors} onChange={updateForm} />
            )}
            {step === 5 && (
              <ReviewStep
                form={form}
                localDocuments={localDocuments}
                errors={fieldErrors}
                onChange={updateForm}
              />
            )}

            {submitError && (
              <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </Button>
              ) : (
                <Button type="button" variant="outline" asChild>
                  <Link href="/login">Back to sign in</Link>
                </Button>
              )}

              {step < TOTAL_STEPS ? (
                <Button type="button" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting application...' : 'Submit application'}
                </Button>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have online banking access?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
