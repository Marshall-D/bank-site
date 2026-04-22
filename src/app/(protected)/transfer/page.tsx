'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { accounts, beneficiaries } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

type TransferStep = 'source' | 'destination' | 'amount' | 'review' | 'success'

export default function TransferPage() {
  const [step, setStep] = useState<TransferStep>('source')
  const [formData, setFormData] = useState({
    sourceAccount: '',
    destinationType: 'internal', // 'internal' or 'external'
    destinationAccount: '',
    beneficiary: '',
    amount: '',
    description: '',
    scheduleDate: '',
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  const sourceAccount = accounts.find((acc) => acc.id === formData.sourceAccount)
  const destAccount =
    formData.destinationType === 'internal'
      ? accounts.find((acc) => acc.id === formData.destinationAccount)
      : beneficiaries.find((b) => b.id === formData.beneficiary)

  const canProceed = () => {
    if (step === 'source') return !!formData.sourceAccount
    if (step === 'destination') return formData.destinationType === 'internal' ? !!formData.destinationAccount : !!formData.beneficiary
    if (step === 'amount') return !!formData.amount && parseFloat(formData.amount) > 0
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

  const handleSubmitTransfer = () => {
    setShowConfirmation(true)
  }

  const confirmTransfer = () => {
    setShowConfirmation(false)
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transfer Complete</h1>
          <p className="text-muted-foreground">Your transfer has been processed</p>
        </div>

        <Card className="max-w-2xl border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/10 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Transfer Successful!</h2>
            <p className="text-muted-foreground mb-6">
              {formatCurrency(parseFloat(formData.amount))} has been transferred
            </p>

            <div className="space-y-4 py-6 border-y border-border my-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">From</span>
                <span className="font-medium">{sourceAccount?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium">
                  {formData.destinationType === 'internal'
                    ? destAccount?.name
                    : (destAccount as any)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-sm">TXN-240421-001</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <a href="/dashboard">Back to Dashboard</a>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('source')
                  setFormData({
                    sourceAccount: '',
                    destinationType: 'internal',
                    destinationAccount: '',
                    beneficiary: '',
                    amount: '',
                    description: '',
                    scheduleDate: '',
                  })
                }}
              >
                Make Another Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Transfer Funds</h1>
        <p className="text-muted-foreground">Send money to your accounts or beneficiaries</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl">
        {['source', 'destination', 'amount', 'review'].map((s, index, arr) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
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
                className={`flex-1 h-1 mx-2 rounded-full ${
                  arr.indexOf(step) > index ? 'bg-green-500/10' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
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
          {/* Step: Source Account */}
          {step === 'source' && (
            <div className="space-y-4">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setFormData({ ...formData, sourceAccount: account.id })}
                  className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                    formData.sourceAccount === account.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.number}</p>
                    </div>
                    <p className="font-bold">{formatCurrency(account.balance)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step: Destination */}
          {step === 'destination' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, destinationType: 'internal' })}
                  className={`p-4 border-2 rounded-lg font-medium transition-colors ${
                    formData.destinationType === 'internal'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  My Accounts
                </button>
                <button
                  onClick={() => setFormData({ ...formData, destinationType: 'external' })}
                  className={`p-4 border-2 rounded-lg font-medium transition-colors ${
                    formData.destinationType === 'external'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  Beneficiaries
                </button>
              </div>

              {formData.destinationType === 'internal' ? (
                <div className="space-y-2">
                  {accounts
                    .filter((acc) => acc.id !== formData.sourceAccount)
                    .map((account) => (
                      <button
                        key={account.id}
                        onClick={() => setFormData({ ...formData, destinationAccount: account.id })}
                        className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                          formData.destinationAccount === account.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{account.number}</p>
                          </div>
                          <p className="font-bold">{formatCurrency(account.balance)}</p>
                        </div>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {beneficiaries.map((ben) => (
                    <button
                      key={ben.id}
                      onClick={() => setFormData({ ...formData, beneficiary: ben.id })}
                      className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
                        formData.beneficiary === ben.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <p className="font-semibold">{ben.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ben.bankName} • {ben.accountNumber.slice(-4)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step: Amount */}
          {step === 'amount' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
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
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a note for this transfer..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Transfer Limits</p>
                <p className="text-sm font-medium">
                  Daily: {formatCurrency(10000)} • Per transaction: {formatCurrency(50000)}
                </p>
              </div>
            </div>
          )}

          {/* Step: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-medium">{sourceAccount?.name}</span>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-medium">
                    {formData.destinationType === 'internal'
                      ? destAccount?.name
                      : (destAccount as any)?.name}
                  </span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(parseFloat(formData.amount) || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {formData.description && (
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Note</p>
                  <p className="text-sm">{formData.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            {step !== 'source' && (
              <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                Back
              </Button>
            )}
            {step !== 'review' && (
              <Button
                onClick={handleNextStep}
                disabled={!canProceed()}
                className="flex-1"
              >
                Continue
              </Button>
            )}
            {step === 'review' && (
              <Button
                onClick={handleSubmitTransfer}
                className="flex-1"
              >
                Confirm Transfer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              Please confirm this transfer of {formatCurrency(parseFloat(formData.amount) || 0)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">From: {sourceAccount?.name}</p>
              <p className="text-sm text-muted-foreground">
                To:{' '}
                {formData.destinationType === 'internal'
                  ? destAccount?.name
                  : (destAccount as any)?.name}
              </p>
              <p className="text-sm font-bold">
                Amount: {formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={confirmTransfer}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
