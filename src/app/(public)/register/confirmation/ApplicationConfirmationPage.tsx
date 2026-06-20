'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BRAND_NAME } from '@/lib/brand'

export default function ApplicationConfirmationPage() {
  const searchParams = useSearchParams()
  const applicationReference = searchParams.get('ref')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-muted px-4 py-12">
      <div className="mx-auto max-w-lg">
        <Logo size="lg" className="mb-8 max-w-[min(100%,54rem)]" />
        <Card className="border-border">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application received</CardTitle>
            <CardDescription>
              Thank you for applying to {BRAND_NAME}. Your application is now under review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {applicationReference && (
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-center">
                <p className="text-sm text-muted-foreground">Application reference</p>
                <p className="mt-1 text-lg font-semibold tracking-wide">{applicationReference}</p>
              </div>
            )}

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>What happens next:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Our team will review your identity and compliance information</li>
                <li>You will be contacted if additional documents are needed</li>
                <li>Once approved, you will receive instructions to set up online banking</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button className="w-full" asChild>
                <Link
                  href={
                    applicationReference
                      ? `/application/status?ref=${encodeURIComponent(applicationReference)}`
                      : '/application/status'
                  }
                >
                  Check application status
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Return to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
