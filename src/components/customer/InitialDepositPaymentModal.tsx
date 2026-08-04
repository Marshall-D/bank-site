'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CustomerAccountSummary } from '@/lib/auth/types'
import { formatReceiveMoneyDetailsForCopy } from '@/lib/customer/receiveMoneyDetails'
import {
  buildInitialDepositPaymentDetails,
  formatDepositAmount,
} from '@/lib/customer/initialDeposit'

type InitialDepositPaymentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: CustomerAccountSummary | null
  accountHolderName: string
  paymentReference?: string | null
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value)
}

export function InitialDepositPaymentModal({
  open,
  onOpenChange,
  account,
  accountHolderName,
  paymentReference,
}: InitialDepositPaymentModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const details = account
    ? buildInitialDepositPaymentDetails(account, accountHolderName, paymentReference)
    : []
  const amountDue = account ? formatDepositAmount(account) : null

  const handleCopy = async (key: string, value: string) => {
    await copyText(value)
    setCopiedAll(false)
    setCopiedKey(key)
    window.setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleCopyAll = async () => {
    if (!details.length) return
    await copyText(formatReceiveMoneyDetailsForCopy(details))
    setCopiedKey(null)
    setCopiedAll(true)
    window.setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Initial deposit payment details</DialogTitle>
          <DialogDescription>
            Your account is open, but transfers stay locked until we confirm your opening deposit
            {amountDue ? ` of ${amountDue}` : ''}. Use these bank details to pay, then wait for
            confirmation.
          </DialogDescription>
        </DialogHeader>

        {!account ? (
          <p className="text-sm text-muted-foreground">No account is available yet.</p>
        ) : (
          <div className="space-y-3">
            {details.map((detail) => (
              <div
                key={detail.key}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="break-words text-sm font-medium">{detail.value}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleCopy(detail.key, detail.value)}
                  aria-label={`Copy ${detail.label}`}
                >
                  {copiedKey === detail.key ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCopyAll} disabled={!details.length}>
            {copiedAll ? 'Copied' : 'Copy all details'}
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
