'use client'

import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { CustomerAccountSummary } from '@/lib/auth/types'
import { formatDepositAmount } from '@/lib/customer/initialDeposit'

type InitialDepositPendingBannerProps = {
  account: CustomerAccountSummary
  onViewPaymentDetails: () => void
}

export function InitialDepositPendingBanner({
  account,
  onViewPaymentDetails,
}: InitialDepositPendingBannerProps) {
  const amountDue = formatDepositAmount(account)

  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-medium text-foreground">Initial deposit pending</p>
            <p className="text-sm text-muted-foreground">
              {amountDue
                ? `Please pay your opening deposit of ${amountDue}. `
                : 'Please pay your opening deposit. '}
              Transfers are unavailable until we confirm receipt.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={onViewPaymentDetails}>
          View payment details
        </Button>
      </div>
    </div>
  )
}
