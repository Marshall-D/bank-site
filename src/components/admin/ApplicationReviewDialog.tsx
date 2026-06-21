'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ReviewAction } from '@/lib/admin/applications/types'

const ACTION_COPY: Record<
  ReviewAction,
  { title: string; description: string; confirmLabel: string; notesLabel: string; notesRequired: boolean }
> = {
  approve: {
    title: 'Approve application',
    description:
      'This will approve the application, create a customer account, and issue an activation invite.',
    confirmLabel: 'Approve application',
    notesLabel: 'Internal note (optional)',
    notesRequired: false,
  },
  reject: {
    title: 'Reject application',
    description: 'Provide a reason for rejection. This will be stored for internal review records.',
    confirmLabel: 'Reject application',
    notesLabel: 'Rejection reason',
    notesRequired: true,
  },
  request_more_info: {
    title: 'Request more information',
    description:
      'The applicant will see these notes when checking their application status.',
    confirmLabel: 'Request information',
    notesLabel: 'Notes for applicant',
    notesRequired: true,
  },
}

export function ApplicationReviewDialog({
  action,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: {
  action: ReviewAction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (notes: string) => Promise<void>
  isLoading: boolean
}) {
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setNotes('')
      setError(null)
    }
  }, [open, action])

  if (!action) return null

  const copy = ACTION_COPY[action]

  const handleConfirm = async () => {
    const trimmed = notes.trim()
    if (copy.notesRequired && trimmed.length < 10) {
      setError('Please enter at least 10 characters.')
      return
    }

    setError(null)
    await onConfirm(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="review-notes">{copy.notesLabel}</Label>
          <Textarea
            id="review-notes"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value)
              setError(null)
            }}
            rows={4}
            disabled={isLoading}
            placeholder={
              copy.notesRequired
                ? 'Enter at least 10 characters...'
                : 'Optional internal note...'
            }
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={action === 'reject' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : copy.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
