'use client'

import { Suspense } from 'react'
import ApplicationConfirmationPage from './ApplicationConfirmationPage'

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ApplicationConfirmationPage />
    </Suspense>
  )
}
