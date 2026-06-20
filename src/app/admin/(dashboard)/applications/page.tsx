import { Suspense } from 'react'
import AdminApplicationsPage from './AdminApplicationsPage'

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading applications...
        </p>
      }
    >
      <AdminApplicationsPage />
    </Suspense>
  )
}
