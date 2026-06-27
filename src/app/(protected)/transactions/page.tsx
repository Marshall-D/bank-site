'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react'

import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getDefaultExportDateRange } from '@/lib/exports/dateRange'
import { fetchTransactions } from '@/lib/transactions/api'
import {
  isIncomingTransaction,
  transactionAmountClass,
  transactionAmountPrefix,
  transactionIconClass,
} from '@/lib/transactions/display'
import type { TransactionListItem } from '@/lib/transactions/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const defaultDates = getDefaultExportDateRange()

export default function TransactionsPage() {
  const { accounts, token } = useCustomerAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterAccount, setFilterAccount] = useState<string>('all')
  const [filterFrom, setFilterFrom] = useState(defaultDates.from)
  const [filterTo, setFilterTo] = useState(defaultDates.to)
  const [items, setItems] = useState<TransactionListItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadTransactions = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const result = await fetchTransactions(token, {
        page: 1,
        limit: 100,
        sort: '-createdAt',
        accountId: filterAccount === 'all' ? undefined : filterAccount,
        type: filterType,
        search: searchTerm.trim() || undefined,
        from: filterFrom ? `${filterFrom}T00:00:00.000Z` : undefined,
        to: filterTo ? `${filterTo}T23:59:59.999Z` : undefined,
      })
      setItems(result.items)
      setTotal(result.pagination.total)
    } catch {
      setItems([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [filterAccount, filterFrom, filterTo, filterType, searchTerm, token])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadTransactions()
    }, searchTerm ? 300 : 0)

    return () => window.clearTimeout(timeout)
  }, [loadTransactions, searchTerm])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View and manage your transactions</p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm">
                Type
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Income</SelectItem>
                  <SelectItem value="debit">Expenses</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account" className="text-sm">
                Account
              </Label>
              <Select value={filterAccount} onValueChange={setFilterAccount}>
                <SelectTrigger id="account">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from" className="text-sm">
                From
              </Label>
              <Input
                id="from"
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm">
                To
              </Label>
              <Input
                id="to"
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const dates = getDefaultExportDateRange()
                  setSearchTerm('')
                  setFilterType('all')
                  setFilterAccount('all')
                  setFilterFrom(dates.from)
                  setFilterTo(dates.to)
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Showing {items.length} of {total} transaction{total === 1 ? '' : 's'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Loading transactions...</p>
          ) : items.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((txn) => (
                      <tr
                        key={txn.id}
                        className="border-b border-border transition-colors hover:bg-muted/50"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium">{txn.description}</p>
                            <p className="text-xs text-muted-foreground">{txn.reference}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">{formatDate(new Date(txn.date))}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`rounded p-1.5 ${transactionIconClass(txn)}`}>
                              {isIncomingTransaction(txn) ? (
                                <ArrowDownLeft
                                  className={`h-4 w-4 ${
                                    txn.type === 'credit' ? 'text-green-600' : 'text-blue-600'
                                  }`}
                                />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <span className="text-sm capitalize">{txn.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className={`text-sm font-semibold ${transactionAmountClass(txn)}`}>
                            {transactionAmountPrefix(txn)}
                            {formatCurrency(txn.amount, txn.currency)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`inline-block rounded px-2 py-1 text-xs font-semibold capitalize ${
                              txn.status === 'completed'
                                ? 'bg-green-500/10 text-green-700'
                                : txn.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-700'
                                  : 'bg-red-500/10 text-red-700'
                            }`}
                          >
                            {txn.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {items.map((txn) => (
                  <div
                    key={txn.id}
                    className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 ${transactionIconClass(txn)}`}>
                          {isIncomingTransaction(txn) ? (
                            <ArrowDownLeft
                              className={`h-4 w-4 ${
                                txn.type === 'credit' ? 'text-green-600' : 'text-blue-600'
                              }`}
                            />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(new Date(txn.date))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${transactionAmountClass(txn)}`}>
                          {transactionAmountPrefix(txn)}
                          {formatCurrency(txn.amount, txn.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{txn.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
