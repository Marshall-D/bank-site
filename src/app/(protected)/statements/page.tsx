'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'

import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { downloadStatementPdf, fetchStatementPeriods } from '@/lib/exports/statements'
import type { StatementPeriod } from '@/lib/exports/types'
import { getCustomerAuthErrorMessage } from '@/lib/auth/errors'

export default function StatementsPage() {
  const { accounts, token } = useCustomerAuth()
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [periods, setPeriods] = useState<StatementPeriod[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadingPeriod, setDownloadingPeriod] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedAccountId && accounts[0]) {
      setSelectedAccountId(accounts[0].id)
    }
  }, [accounts, selectedAccountId])

  const loadPeriods = useCallback(async () => {
    if (!token || !selectedAccountId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchStatementPeriods(token, selectedAccountId)
      setPeriods(result.items)
    } catch (err) {
      setPeriods([])
      setError(getCustomerAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [selectedAccountId, token])

  useEffect(() => {
    void loadPeriods()
  }, [loadPeriods])

  const handleDownload = async (period: string) => {
    if (!token || !selectedAccountId) return

    setDownloadingPeriod(period)
    setError(null)

    try {
      await downloadStatementPdf(token, selectedAccountId, period)
    } catch (err) {
      setError(getCustomerAuthErrorMessage(err))
    } finally {
      setDownloadingPeriod(null)
    }
  }

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Statements</h1>
        <p className="text-muted-foreground">
          Download monthly account statements with opening and closing balances
        </p>
      </div>

      {accounts.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-10 text-center text-muted-foreground">
            No accounts are linked to your profile yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Select account</CardTitle>
              <CardDescription>Statements are generated per calendar month (UTC)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.displayName} ({account.accountNumberMasked})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Available statements</CardTitle>
              <CardDescription>
                {selectedAccount
                  ? `${selectedAccount.displayName} · ${selectedAccount.currency}`
                  : 'Choose an account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {isLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading statements...</p>
              ) : periods.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
                  <FileText className="h-10 w-10 opacity-50" />
                  <p>No statements are available for this account yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {periods.map((item) => (
                    <div
                      key={item.period}
                      className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.transactionCount} completed transaction
                          {item.transactionCount === 1 ? '' : 's'}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(item.period)}
                        disabled={downloadingPeriod === item.period}
                      >
                        {downloadingPeriod === item.period ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Preparing...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
