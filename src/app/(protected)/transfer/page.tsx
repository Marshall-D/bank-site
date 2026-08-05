'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Plus, Trash2 } from 'lucide-react'

import { AddBeneficiaryDialog } from '@/components/customer/AddBeneficiaryDialog'
import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { InitialDepositPaymentModal } from '@/components/customer/InitialDepositPaymentModal'
import { InitialDepositPendingBanner } from '@/components/customer/InitialDepositPendingBanner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import type { CustomerAccountSummary } from '@/lib/auth/types'
import { fetchBeneficiaries, deleteBeneficiary } from '@/lib/beneficiaries/api'
import type { Beneficiary } from '@/lib/beneficiaries/types'
import { getCustomerAuthErrorMessage } from '@/lib/auth/errors'
import { BRAND_SHORT } from '@/lib/brand'
import {
  resolveBrcbAccount,
  submitExternalTransfer,
  submitInternalTransfer,
  submitSameBankTransfer,
} from '@/lib/transfers/api'
import {
  BRCB_ACCOUNT_NUMBER_LENGTH,
  OUTSIDE_JURISDICTION_MESSAGE,
  TRANSFER_LIMITS,
} from '@/lib/transfers/constants'
import { getTransferErrorMessage } from '@/lib/transfers/errors'
import type { ResolvedBrcbAccount } from '@/lib/transfers/types'
import { isInitialDepositPending } from '@/lib/customer/initialDeposit'
import { formatCurrency } from '@/lib/utils'

type TransferStep = 'source' | 'destination' | 'amount' | 'review' | 'success'
type DestinationType = 'internal' | 'same_bank' | 'external'

const PROCESSING_DELAY_MS = 2200

function formatAccountType(accountType: string) {
  return accountType
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function TransferPage() {
  const { accounts, token, refreshSession, user, application } = useCustomerAuth()
  const hasMultipleAccounts = accounts.length > 1
  const hasOnlyOneAccount = accounts.length === 1
  const pendingDepositAccount = accounts.find((account) => isInitialDepositPending(account))
  const transfersLocked = Boolean(pendingDepositAccount)
  const [initialDepositOpen, setInitialDepositOpen] = useState(false)

  const [step, setStep] = useState<TransferStep>('source')
  const [formData, setFormData] = useState({
    sourceAccount: '',
    destinationType: 'internal' as DestinationType,
    destinationAccount: '',
    beneficiary: '',
    brcbAccountNumber: '',
    amount: '',
    description: '',
  })
  const [resolvedBrcb, setResolvedBrcb] = useState<ResolvedBrcbAccount | null>(null)
  const [resolveError, setResolveError] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [beneficiaryError, setBeneficiaryError] = useState<string | null>(null)
  const [externalError, setExternalError] = useState<string | null>(null)
  const [successReference, setSuccessReference] = useState<string | null>(null)
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [beneficiariesLoading, setBeneficiariesLoading] = useState(false)
  const [addBeneficiaryOpen, setAddBeneficiaryOpen] = useState(false)
  const [deletingBeneficiaryIds, setDeletingBeneficiaryIds] = useState<Set<string>>(
    () => new Set()
  )

  const sourceAccount = accounts.find((acc) => acc.id === formData.sourceAccount)
  const destinationAccount = accounts.find((acc) => acc.id === formData.destinationAccount)
  const selectedBeneficiary = beneficiaries.find((ben) => ben.id === formData.beneficiary)

  const destinationLabel = useMemo(() => {
    if (formData.destinationType === 'internal') {
      return destinationAccount?.displayName || '—'
    }
    if (formData.destinationType === 'same_bank') {
      if (!resolvedBrcb) return '—'
      return `${resolvedBrcb.accountHolderName} (${resolvedBrcb.accountNumberMasked})`
    }
    return selectedBeneficiary?.name || '—'
  }, [destinationAccount, formData.destinationType, resolvedBrcb, selectedBeneficiary])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function loadBeneficiaries() {
      setBeneficiariesLoading(true)
      try {
        const items = await fetchBeneficiaries(token!)
        if (!cancelled) setBeneficiaries(items)
      } catch {
        if (!cancelled) setBeneficiaries([])
      } finally {
        if (!cancelled) setBeneficiariesLoading(false)
      }
    }

    loadBeneficiaries()

    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (step === 'destination' && hasOnlyOneAccount && formData.destinationType === 'internal') {
      setFormData((prev) => ({
        ...prev,
        destinationType: 'same_bank',
        destinationAccount: '',
      }))
    }
  }, [hasOnlyOneAccount, step, formData.destinationType])

  const canProceed = () => {
    if (step === 'source') return !!formData.sourceAccount
    if (step === 'destination') {
      if (formData.destinationType === 'internal') {
        return hasMultipleAccounts && !!formData.destinationAccount
      }
      if (formData.destinationType === 'same_bank') {
        return Boolean(resolvedBrcb)
      }
      return !!formData.beneficiary
    }
    if (step === 'amount') {
      const amount = parseFloat(formData.amount)
      return (
        !!formData.amount &&
        amount >= TRANSFER_LIMITS.minAmount &&
        amount <= TRANSFER_LIMITS.maxPerTransfer &&
        (!sourceAccount || amount <= sourceAccount.balance)
      )
    }
    return true
  }

  const handleNextStep = () => {
    const steps: TransferStep[] = ['source', 'destination', 'amount', 'review', 'success']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handlePrevStep = () => {
    const steps: TransferStep[] = ['source', 'destination', 'amount', 'review', 'success']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const resetForm = () => {
    setStep('source')
    setFormData({
      sourceAccount: '',
      destinationType: 'internal',
      destinationAccount: '',
      beneficiary: '',
      brcbAccountNumber: '',
      amount: '',
      description: '',
    })
    setResolvedBrcb(null)
    setResolveError(null)
    setSuccessReference(null)
    setSubmitError(null)
    setBeneficiaryError(null)
    setExternalError(null)
  }

  const handleResolveBrcbAccount = async () => {
    if (!token) return
    const accountNumber = formData.brcbAccountNumber.trim()
    if (!/^\d{12}$/.test(accountNumber)) {
      setResolveError(`Enter a ${BRCB_ACCOUNT_NUMBER_LENGTH}-digit ${BRAND_SHORT} account number`)
      setResolvedBrcb(null)
      return
    }

    setIsResolving(true)
    setResolveError(null)
    try {
      const account = await resolveBrcbAccount(token, accountNumber)
      setResolvedBrcb(account)
    } catch (error) {
      setResolvedBrcb(null)
      setResolveError(getTransferErrorMessage(error))
    } finally {
      setIsResolving(false)
    }
  }

  const handleDeleteBeneficiary = async (beneficiaryId: string) => {
    if (!token) return
    if (deletingBeneficiaryIds.has(beneficiaryId)) return

    setDeletingBeneficiaryIds((prev) => new Set(prev).add(beneficiaryId))
    setBeneficiaryError(null)

    try {
      await deleteBeneficiary(token, beneficiaryId)
      setBeneficiaries((prev) => prev.filter((ben) => ben.id !== beneficiaryId))
      setFormData((prev) =>
        prev.beneficiary === beneficiaryId ? { ...prev, beneficiary: '' } : prev
      )
    } catch (error) {
      setBeneficiaryError(getCustomerAuthErrorMessage(error) || 'Could not delete beneficiary')
    } finally {
      setDeletingBeneficiaryIds((prev) => {
        const next = new Set(prev)
        next.delete(beneficiaryId)
        return next
      })
    }
  }

  const confirmTransfer = async () => {
    if (!token || !sourceAccount) return
    if (isInitialDepositPending(sourceAccount)) {
      setSubmitError('Transfers are unavailable until your initial deposit is confirmed')
      setShowConfirmation(false)
      return
    }

    const amount = parseFloat(formData.amount)
    setShowConfirmation(false)
    setSubmitError(null)
    setExternalError(null)

    if (formData.destinationType === 'internal') {
      if (!destinationAccount) return

      setIsSubmitting(true)
      setIsProcessingTransfer(true)
      try {
        const result = await submitInternalTransfer(token, {
          fromAccountId: sourceAccount.id,
          toAccountId: destinationAccount.id,
          amount,
          description: formData.description.trim() || undefined,
        })
        await refreshSession()
        setSuccessReference(result.reference)
        setStep('success')
      } catch (error) {
        setSubmitError(getTransferErrorMessage(error))
        setStep('review')
      } finally {
        setIsProcessingTransfer(false)
        setIsSubmitting(false)
      }
      return
    }

    if (formData.destinationType === 'same_bank') {
      if (!resolvedBrcb) return

      setIsSubmitting(true)
      setIsProcessingTransfer(true)
      try {
        const result = await submitSameBankTransfer(token, {
          fromAccountId: sourceAccount.id,
          toAccountNumber: formData.brcbAccountNumber.trim(),
          amount,
          description: formData.description.trim() || undefined,
        })
        await refreshSession()
        setSuccessReference(result.reference)
        setStep('success')
      } catch (error) {
        setSubmitError(getTransferErrorMessage(error))
        setStep('review')
      } finally {
        setIsProcessingTransfer(false)
        setIsSubmitting(false)
      }
      return
    }

    if (!selectedBeneficiary) return

    setIsSubmitting(true)
    setIsProcessingTransfer(true)
    await new Promise((resolve) => window.setTimeout(resolve, PROCESSING_DELAY_MS))

    try {
      await submitExternalTransfer(token, {
        fromAccountId: sourceAccount.id,
        beneficiaryName: selectedBeneficiary.name,
        beneficiaryBank: selectedBeneficiary.bankName,
        beneficiaryAccountNumber: selectedBeneficiary.accountNumber,
        amount,
        description: formData.description.trim() || undefined,
      })
    } catch (error) {
      setExternalError(getTransferErrorMessage(error) || OUTSIDE_JURISDICTION_MESSAGE)
      setStep('review')
    } finally {
      setIsProcessingTransfer(false)
      setIsSubmitting(false)
    }
  }

  const renderAccountOption = (account: CustomerAccountSummary, selected: boolean, onSelect: () => void) => (
    <button
      key={account.id}
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
        selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{account.displayName}</p>
          <p className="text-sm text-muted-foreground">
            {formatAccountType(account.accountType)} · {account.accountNumberMasked}
          </p>
        </div>
        <p className="font-bold">{formatCurrency(account.balance, account.currency)}</p>
      </div>
    </button>
  )

  if (step === 'success') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Transfer Complete</h1>
          <p className="text-muted-foreground">Your transfer has been processed</p>
        </div>

        <Card className="max-w-2xl border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-500/10 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Transfer Successful!</h2>
            <p className="mb-6 text-muted-foreground">
              {formatCurrency(parseFloat(formData.amount), sourceAccount?.currency)} has been transferred
            </p>

            <div className="my-6 space-y-4 border-y border-border py-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">From</span>
                <span className="font-medium">{sourceAccount?.displayName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium">{destinationLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-sm">{successReference}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={resetForm}>
                Make Another Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Transfer Funds</h1>
          <p className="text-muted-foreground">Send money to your accounts or beneficiaries</p>
        </div>
        <Card className="max-w-2xl border-border">
          <CardContent className="py-10 text-center text-muted-foreground">
            No accounts are linked to your profile yet.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (transfersLocked && pendingDepositAccount) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Transfer Funds</h1>
          <p className="text-muted-foreground">Send money to your accounts or beneficiaries</p>
        </div>
        <InitialDepositPendingBanner
          account={pendingDepositAccount}
          onViewPaymentDetails={() => setInitialDepositOpen(true)}
        />
        <Card className="max-w-2xl border-border">
          <CardContent className="space-y-4 py-8">
            <p className="text-sm text-muted-foreground">
              Transfers are blocked until your opening deposit is confirmed by the bank.
            </p>
            <Button type="button" onClick={() => setInitialDepositOpen(true)}>
              View payment details
            </Button>
          </CardContent>
        </Card>
        <InitialDepositPaymentModal
          open={initialDepositOpen}
          onOpenChange={setInitialDepositOpen}
          account={pendingDepositAccount}
          accountHolderName={user?.name || 'Account holder'}
          paymentReference={application?.applicationReference}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Transfer Funds</h1>
        <p className="text-muted-foreground">Send money to your accounts or beneficiaries</p>
      </div>

      <div className="flex max-w-2xl items-center justify-between">
        {['source', 'destination', 'amount', 'review'].map((s, index, arr) => (
          <div key={s} className="flex flex-1 items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors ${
                step === s
                  ? 'bg-primary text-primary-foreground'
                  : arr.indexOf(step) > index
                    ? 'bg-green-500/10 text-green-600'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
            {index < arr.length - 1 && (
              <div
                className={`mx-2 h-1 flex-1 rounded-full ${
                  arr.indexOf(step) > index ? 'bg-green-500/10' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="max-w-2xl border-border">
        <CardHeader>
          <CardTitle>
            {step === 'source' && 'Select Source Account'}
            {step === 'destination' && 'Select Destination'}
            {step === 'amount' && 'Enter Amount'}
            {step === 'review' && 'Review Transfer'}
          </CardTitle>
          <CardDescription>
            {step === 'source' && 'Choose which account to transfer from'}
            {step === 'destination' && 'Select where to send the money'}
            {step === 'amount' && 'How much would you like to transfer?'}
            {step === 'review' && 'Confirm your transfer details'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'source' &&
            accounts.map((account) =>
              renderAccountOption(account, formData.sourceAccount === account.id, () =>
                setFormData({ ...formData, sourceAccount: account.id })
              )
            )}

          {step === 'destination' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  disabled={!hasMultipleAccounts}
                  onClick={() => {
                    setBeneficiaryError(null)
                    setResolveError(null)
                    setResolvedBrcb(null)
                    setFormData({
                      ...formData,
                      destinationType: 'internal',
                      destinationAccount: '',
                      beneficiary: '',
                      brcbAccountNumber: '',
                    })
                  }}
                  className={`rounded-lg border-2 p-4 font-medium transition-colors ${
                    formData.destinationType === 'internal'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } ${!hasMultipleAccounts ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  My Accounts
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBeneficiaryError(null)
                    setResolveError(null)
                    setResolvedBrcb(null)
                    setFormData({
                      ...formData,
                      destinationType: 'same_bank',
                      destinationAccount: '',
                      beneficiary: '',
                      brcbAccountNumber: '',
                    })
                  }}
                  className={`rounded-lg border-2 p-4 font-medium transition-colors ${
                    formData.destinationType === 'same_bank'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {BRAND_SHORT} customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBeneficiaryError(null)
                    setResolveError(null)
                    setResolvedBrcb(null)
                    setFormData({
                      ...formData,
                      destinationType: 'external',
                      destinationAccount: '',
                      beneficiary: '',
                      brcbAccountNumber: '',
                    })
                  }}
                  className={`rounded-lg border-2 p-4 font-medium transition-colors ${
                    formData.destinationType === 'external'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  Other banks
                </button>
              </div>

              {formData.destinationType === 'internal' ? (
                hasMultipleAccounts ? (
                  <div className="space-y-2">
                    {accounts
                      .filter((acc) => acc.id !== formData.sourceAccount)
                      .map((account) =>
                        renderAccountOption(
                          account,
                          formData.destinationAccount === account.id,
                          () => setFormData({ ...formData, destinationAccount: account.id })
                        )
                      )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                    Internal transfers are unavailable because you only have one account. Send to
                    another {BRAND_SHORT} customer or an other-bank beneficiary instead.
                  </div>
                )
              ) : formData.destinationType === 'same_bank' ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Instant transfers to another {BRAND_SHORT} account. Enter their 12-digit account
                    number to confirm the recipient.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="brcbAccountNumber">Account number</Label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        id="brcbAccountNumber"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="e.g. 202605880115"
                        value={formData.brcbAccountNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, BRCB_ACCOUNT_NUMBER_LENGTH)
                          setResolvedBrcb(null)
                          setResolveError(null)
                          setFormData({ ...formData, brcbAccountNumber: digits })
                        }}
                        maxLength={BRCB_ACCOUNT_NUMBER_LENGTH}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void handleResolveBrcbAccount()}
                        disabled={isResolving || !token || formData.brcbAccountNumber.length !== BRCB_ACCOUNT_NUMBER_LENGTH}
                      >
                        {isResolving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Looking up...
                          </>
                        ) : (
                          'Look up'
                        )}
                      </Button>
                    </div>
                  </div>

                  {resolveError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      {resolveError}
                    </div>
                  )}

                  {resolvedBrcb && (
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground">Recipient confirmed</p>
                      <p className="font-semibold">{resolvedBrcb.accountHolderName}</p>
                      <p className="text-sm text-muted-foreground">
                        {resolvedBrcb.displayName} · {resolvedBrcb.accountNumberMasked} ·{' '}
                        {resolvedBrcb.currency}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Your saved beneficiaries</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAddBeneficiaryOpen(true)}
                      disabled={!token}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add beneficiary
                    </Button>
                  </div>

                  {beneficiaryError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      {beneficiaryError}
                    </div>
                  )}

                  {beneficiariesLoading ? (
                    <p className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                      Loading beneficiaries...
                    </p>
                  ) : beneficiaries.length === 0 ? (
                    <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                      You have not added any beneficiaries yet. Click &quot;Add beneficiary&quot; to
                      save someone you want to send money to.
                    </div>
                  ) : (
                    beneficiaries.map((ben) => (
                      <div
                        key={ben.id}
                        className={`flex items-stretch gap-2 rounded-lg border-2 transition-colors ${
                          formData.beneficiary === ben.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, beneficiary: ben.id })}
                          className="min-w-0 flex-1 p-4 text-left"
                        >
                          <p className="font-semibold">{ben.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {ben.bankName} · {ben.accountNumberMasked}
                          </p>
                        </button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="m-2 shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label={`Delete ${ben.name}`}
                          disabled={deletingBeneficiaryIds.has(ben.id) || !token}
                          onClick={(e) => {
                            e.stopPropagation()
                            void handleDeleteBeneficiary(ben.id)
                          }}
                        >
                          {deletingBeneficiaryIds.has(ben.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {step === 'amount' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="pl-8"
                    step="0.01"
                    min={TRANSFER_LIMITS.minAmount}
                    max={TRANSFER_LIMITS.maxPerTransfer}
                  />
                </div>
                {sourceAccount && parseFloat(formData.amount) > sourceAccount.balance && (
                  <p className="text-sm text-destructive">Amount exceeds available balance</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a note for this transfer..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={TRANSFER_LIMITS.descriptionMax}
                  className="field-sizing-fixed resize-y"
                  rows={3}
                />
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="mb-1 text-sm text-muted-foreground">Transfer Limits</p>
                <p className="text-sm font-medium">
                  Daily: {formatCurrency(TRANSFER_LIMITS.maxDailyTotal)} · Per transaction:{' '}
                  {formatCurrency(TRANSFER_LIMITS.maxPerTransfer)}
                </p>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              {submitError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {submitError}
                </div>
              )}

              <div className="space-y-4 rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-medium">{sourceAccount?.displayName}</span>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-medium">{destinationLabel}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(parseFloat(formData.amount) || 0, sourceAccount?.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {formData.description && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Note</p>
                  <p className="text-sm">{formData.description}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-6">
            {step !== 'source' && (
              <Button variant="outline" onClick={handlePrevStep} className="flex-1" disabled={isSubmitting}>
                Back
              </Button>
            )}
            {step !== 'review' && (
              <Button onClick={handleNextStep} disabled={!canProceed() || isSubmitting} className="flex-1">
                Continue
              </Button>
            )}
            {step === 'review' && (
              <Button onClick={() => setShowConfirmation(true)} disabled={isSubmitting} className="flex-1">
                Confirm Transfer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              Please confirm this transfer of{' '}
              {formatCurrency(parseFloat(formData.amount) || 0, sourceAccount?.currency)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">From: {sourceAccount?.displayName}</p>
              <p className="text-sm text-muted-foreground">To: {destinationLabel}</p>
              <p className="text-sm font-bold">
                Amount: {formatCurrency(parseFloat(formData.amount) || 0, sourceAccount?.currency)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting || isProcessingTransfer}
            >
              Cancel
            </Button>
            <Button onClick={confirmTransfer} disabled={isSubmitting || isProcessingTransfer}>
              {isSubmitting || isProcessingTransfer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProcessingTransfer}>
        <DialogContent className="border-border sm:max-w-md" showCloseButton={false}>
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div>
              <p className="text-lg font-semibold">Processing your transfer</p>
              <p className="text-sm text-muted-foreground">
                Please wait while we complete your transfer...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!externalError} onOpenChange={(open) => !open && setExternalError(null)}>
        <DialogContent className="border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Transfer could not be completed
            </DialogTitle>
            <DialogDescription>{externalError}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setExternalError(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {token && (
        <AddBeneficiaryDialog
          open={addBeneficiaryOpen}
          onOpenChange={setAddBeneficiaryOpen}
          token={token}
          onCreated={(beneficiary) => {
            setBeneficiaries((prev) => [beneficiary, ...prev])
            setFormData((prev) => ({ ...prev, beneficiary: beneficiary.id }))
          }}
        />
      )}
    </div>
  )
}