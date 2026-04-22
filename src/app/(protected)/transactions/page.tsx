'use client'

import { useState } from 'react'
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
import { ArrowUpRight, ArrowDownLeft, Download, Search, Filter } from 'lucide-react'
import { transactions, accounts } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterAccount, setFilterAccount] = useState<string>('all')

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || txn.type === filterType
    const matchesAccount = filterAccount === 'all' || txn.accountId === filterAccount

    return matchesSearch && matchesType && matchesAccount
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transactions</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
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

            {/* Account Filter */}
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
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('all')
                  setFilterAccount('all')
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {filteredTransactions.length > 0 ? (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-sm">{txn.description}</p>
                            <p className="text-xs text-muted-foreground">{txn.reference}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {formatDate(txn.date)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded ${
                                txn.type === 'credit' || txn.type === 'transfer'
                                  ? 'bg-green-500/10'
                                  : 'bg-red-500/10'
                              }`}
                            >
                              {txn.type === 'credit' || txn.type === 'transfer' ? (
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
                        <td className="py-4 px-4 text-right">
                          <p
                            className={`font-semibold text-sm ${
                              txn.type === 'credit' || txn.type === 'transfer'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {txn.type === 'credit' || txn.type === 'transfer' ? '+' : '-'}
                            {formatCurrency(txn.amount)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          txn.type === 'credit' || txn.type === 'transfer'
                            ? 'bg-green-500/10'
                            : 'bg-red-500/10'
                        }`}
                      >
                        {txn.type === 'credit' || txn.type === 'transfer' ? (
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
                        <p className="font-medium text-sm">{txn.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold text-sm ${
                          txn.type === 'credit' || txn.type === 'transfer'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {txn.type === 'credit' || txn.type === 'transfer' ? '+' : '-'}
                        {formatCurrency(txn.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {txn.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
