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
import {
  buildReceiveMoneyDetails,
  formatReceiveMoneyDetailsForCopy,
} from '@/lib/customer/receiveMoneyDetails'

type ReceiveMoneyModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: CustomerAccountSummary | null
  accountHolderName: string
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value)
}

export function ReceiveMoneyModal({
  open,
  onOpenChange,
  account,
  accountHolderName,
}: ReceiveMoneyModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const details = account ? buildReceiveMoneyDetails(account, accountHolderName) : []

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
          <DialogTitle>Receive money</DialogTitle>
          <DialogDescription>
            Share these details with anyone sending money to your account.
          </DialogDescription>
        </DialogHeader>

        {!account ? (
          <p className="text-sm text-muted-foreground">
            No account is available yet. Once your account is active, your deposit details will
            appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {details.map((detail) => (
              <div
                key={detail.key}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="break-all text-sm font-medium">{detail.value}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleCopy(detail.key, detail.value)}
                  aria-label={`Copy ${detail.label}`}
                >
                  {copiedKey === detail.key ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button" onClick={handleCopyAll} disabled={!account}>
            {copiedAll ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy all details
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
