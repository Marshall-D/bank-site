'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { ApplicationDocumentCard } from '@/components/admin/ApplicationDocumentCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAdminApplicationById } from '@/lib/admin/applications/api'
import {
  formatAccountType,
  formatAddress,
  formatCurrencyAmount,
  formatEmploymentStatus,
  formatIdDocumentType,
  formatInitialDepositMethod,
  formatProofOfAddressType,
  formatSourceOfFundsType,
} from '@/lib/admin/applications/formatters'
import type { AdminApplicationDetail } from '@/lib/admin/applications/types'
import { getAdminAuthErrorMessage } from '@/lib/admin/errors'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { formatDate, formatDateLong } from '@/lib/utils'

function DetailField({
  label,
  value,
  mono = false,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={mono ? 'font-mono text-sm break-all' : 'text-sm'}>{value}</p>
    </div>
  )
}

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'submitted' || status === 'pending_review') return 'default'
  if (status === 'need_more_info') return 'secondary'
  if (status === 'rejected') return 'destructive'
  return 'outline'
}

export default function AdminApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const { token, logout } = useAdminAuth()
  const [item, setItem] = useState<AdminApplicationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const applicationId = params?.id

  const loadApplication = useCallback(async () => {
    if (!token || !applicationId) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchAdminApplicationById(token, applicationId)
      setItem(result)
    } catch (err) {
      const message = getAdminAuthErrorMessage(err)
      if (
        message.toLowerCase().includes('authentication') ||
        message.toLowerCase().includes('invalid credentials')
      ) {
        logout()
        return
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [applicationId, logout, token])

  useEffect(() => {
    loadApplication()
  }, [loadApplication])

  if (isLoading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">Loading application...</p>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/applications">Back to applications</Link>
        </Button>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Application not found.</p>
        <Button asChild variant="outline">
          <Link href="/admin/applications">Back to applications</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{item.applicationReference}</h1>
            <Badge variant={statusBadgeVariant(item.status)}>
              {APPLICATION_STATUS_LABELS[item.status] || item.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {item.applicantName} · Submitted{' '}
            {item.submittedAt ? formatDateLong(new Date(item.submittedAt)) : '—'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/applications">Back to applications</Link>
          </Button>
          <Button disabled title="Available in ticket 010">
            Approve
          </Button>
          <Button disabled variant="destructive" title="Available in ticket 010">
            Reject
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Applicant</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Full name" value={item.applicantName} />
            <DetailField
              label="Date of birth"
              value={item.dateOfBirth ? formatDate(new Date(item.dateOfBirth)) : '—'}
            />
            <DetailField label="Nationality" value={item.nationality} />
            <DetailField label="Country of residence" value={item.countryOfResidence} />
            <DetailField label="Tax residence" value={item.taxResidenceCountry} />
            <DetailField label="Email" value={item.email} />
            <DetailField label="Mobile phone" value={item.mobilePhone} />
            <DetailField label="Secondary phone" value={item.secondaryPhone || '—'} />
            {item.preferredName && (
              <DetailField label="Preferred name" value={item.preferredName} />
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Account type" value={formatAccountType(item.accountType)} />
            <DetailField label="Applicant type" value={item.applicantType} />
            <DetailField label="Purpose" value={item.purposeOfAccount || '—'} />
            <DetailField label="Preferred branch" value={item.preferredBranch || '—'} />
            <DetailField label="PEP declaration" value={item.pepDeclaration ? 'Yes' : 'No'} />
            <DetailField
              label="Expected monthly deposit"
              value={formatCurrencyAmount(item.expectedMonthlyDeposit, 'USD')}
            />
            <DetailField
              label="Expected monthly withdrawal"
              value={formatCurrencyAmount(item.expectedMonthlyWithdrawal, 'USD')}
            />
            <DetailField label="Referral code" value={item.referralCode || '—'} />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Residential</p>
              <p className="text-sm">{formatAddress(item.residentialAddress)}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Mailing</p>
              <p className="text-sm">{formatAddress(item.mailingAddress)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Financial profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailField
              label="Source of funds"
              value={
                item.sourceOfFunds
                  ? formatSourceOfFundsType(item.sourceOfFunds.sourceType)
                  : '—'
              }
            />
            <DetailField
              label="Monthly estimate"
              value={formatCurrencyAmount(
                item.sourceOfFunds?.monthlyEstimate,
                item.sourceOfFunds?.currency
              )}
            />
            <DetailField
              label="Source description"
              value={item.sourceOfFunds?.description || '—'}
            />
            <DetailField
              label="Initial deposit"
              value={
                item.initialDeposit
                  ? `${formatCurrencyAmount(item.initialDeposit.amount, item.initialDeposit.currency)} (${formatInitialDepositMethod(item.initialDeposit.method)})`
                  : '—'
              }
            />
            <DetailField
              label="Employment status"
              value={formatEmploymentStatus(item.employment?.status)}
            />
            <DetailField label="Employer" value={item.employment?.employerName || '—'} />
            <DetailField label="Job title" value={item.employment?.jobTitle || '—'} />
            <DetailField label="Occupation" value={item.employment?.occupation || '—'} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Identity document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.idDocument ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField
                    label="Type"
                    value={formatIdDocumentType(item.idDocument.type)}
                  />
                  <DetailField label="Number" value={item.idDocument.number} mono />
                  <DetailField label="Issuing country" value={item.idDocument.issuingCountry} />
                  <DetailField
                    label="Expiry date"
                    value={
                      item.idDocument.expiryDate
                        ? formatDate(new Date(item.idDocument.expiryDate))
                        : '—'
                    }
                  />
                </div>
                <ApplicationDocumentCard document={item.idDocument.front} />
                {item.idDocument.back && (
                  <ApplicationDocumentCard document={item.idDocument.back} />
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No identity document on file.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Proof of address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.proofOfAddressDocument ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField
                    label="Type"
                    value={formatProofOfAddressType(item.proofOfAddressDocument.type)}
                  />
                  <DetailField
                    label="Issue date"
                    value={
                      item.proofOfAddressDocument.issueDate
                        ? formatDate(new Date(item.proofOfAddressDocument.issueDate))
                        : '—'
                    }
                  />
                </div>
                <ApplicationDocumentCard document={item.proofOfAddressDocument.file} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No proof of address on file.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Consents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {item.consents ? (
              (
                [
                  { label: 'Terms accepted', accepted: item.consents.termsAccepted },
                  { label: 'Privacy accepted', accepted: item.consents.privacyAccepted },
                  { label: 'AML accepted', accepted: item.consents.amlAccepted },
                  {
                    label: 'Data processing accepted',
                    accepted: item.consents.dataProcessingAccepted,
                  },
                  { label: 'Marketing consent', accepted: item.consents.marketingConsent },
                ] as const
              ).map(({ label, accepted }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <Badge variant={accepted ? 'default' : 'outline'}>
                    {accepted ? 'Yes' : 'No'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No consent records.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Review</CardTitle>
            <CardDescription>Internal review metadata</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <DetailField label="Review notes" value={item.reviewNotes || '—'} />
            <DetailField
              label="Reviewed by"
              value={
                item.reviewedBy?.name
                  ? `${item.reviewedBy.name} (${item.reviewedBy.email})`
                  : '—'
              }
            />
            <DetailField
              label="Reviewed at"
              value={item.reviewedAt ? formatDateLong(new Date(item.reviewedAt)) : '—'}
            />
            <DetailField label="Applicant notes" value={item.notes || '—'} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Status history</CardTitle>
        </CardHeader>
        <CardContent>
          {item.statusHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No status changes recorded.</p>
          ) : (
            <div className="space-y-4">
              {item.statusHistory.map((entry, index) => (
                <div
                  key={`${entry.changedAt}-${entry.to}-${index}`}
                  className="flex flex-col gap-1 border-l-2 border-border pl-4"
                >
                  <p className="text-sm font-medium">
                    {APPLICATION_STATUS_LABELS[entry.from] || entry.from} →{' '}
                    {APPLICATION_STATUS_LABELS[entry.to] || entry.to}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateLong(new Date(entry.changedAt))} · {entry.changedBy}
                  </p>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
