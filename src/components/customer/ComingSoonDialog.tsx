'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ComingSoonDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName: string
}

export function ComingSoonDialog({ open, onOpenChange, featureName }: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{featureName}</DialogTitle>
          <DialogDescription>
            This feature is coming soon. We&apos;re working on it and will make it available in a
            future update.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
