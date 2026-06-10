'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type DashboardNavContextValue = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const DashboardNavContext = createContext<DashboardNavContextValue | null>(null)

export function DashboardNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DashboardNavContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen((open) => !open),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </DashboardNavContext.Provider>
  )
}

export function useDashboardNav() {
  const context = useContext(DashboardNavContext)
  if (!context) {
    throw new Error('useDashboardNav must be used within DashboardNavProvider')
  }
  return context
}
