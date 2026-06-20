'use client'

import { Suspense } from 'react'
import ApplicationStatusPage from './ApplicationStatusPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ApplicationStatusPage />
    </Suspense>
  )
}
