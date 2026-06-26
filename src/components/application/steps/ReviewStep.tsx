import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  ACCOUNT_TYPE_OPTIONS,
  ID_DOCUMENT_TYPE_OPTIONS,
  PROOF_OF_ADDRESS_TYPE_OPTIONS,
  SOURCE_OF_FUNDS_TYPE_OPTIONS,
} from '@/lib/application/constants'
import type { ApplicationFormState } from '@/lib/application/types'
import type { LocalDocumentsState } from '@/lib/application/localDocuments'
import { FieldError } from '../FormField'

type ReviewStepProps = {
  form: ApplicationFormState
  localDocuments: LocalDocumentsState
  errors: Record<string, string>
  onChange: (updates: Partial<ApplicationFormState>) => void
}

function labelFor(
  options: ReadonlyArray<{ readonly value: string; readonly label: string }>,
  value: string
) {
  return options.find((option) => option.value === value)?.label ?? value
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 sm:flex-row sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function documentSummary(name: string | undefined) {
  return name ?? ''
}

export function ReviewStep({ form, localDocuments, errors, onChange }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-2 text-lg font-medium">Application summary</h3>
        <SummaryRow
          label="Account type"
          value={labelFor(ACCOUNT_TYPE_OPTIONS, form.accountType)}
        />
        <SummaryRow label="Name" value={`${form.firstName} ${form.lastName}`.trim()} />
        <SummaryRow label="Email" value={form.email} />
        <SummaryRow label="Mobile phone" value={form.mobilePhone} />
        <SummaryRow label="Date of birth" value={form.dateOfBirth} />
        <SummaryRow
          label="Residential address"
          value={`${form.residentialAddress.line1}, ${form.residentialAddress.cityOrIsland}, ${form.residentialAddress.country}`}
        />
        <SummaryRow
          label="ID document"
          value={`${labelFor(ID_DOCUMENT_TYPE_OPTIONS, form.idDocumentType)} · ${form.idDocumentNumber}`}
        />
        <SummaryRow label="ID front image" value={documentSummary(localDocuments.idFront?.name)} />
        <SummaryRow label="ID back image" value={documentSummary(localDocuments.idBack?.name)} />
        <SummaryRow
          label="Proof of address"
          value={labelFor(PROOF_OF_ADDRESS_TYPE_OPTIONS, form.proofOfAddressType)}
        />
        <SummaryRow
          label="Proof of address image"
          value={documentSummary(localDocuments.proofOfAddress?.name)}
        />
        <SummaryRow
          label="Source of funds"
          value={labelFor(SOURCE_OF_FUNDS_TYPE_OPTIONS, form.sourceOfFundsType)}
        />
        <SummaryRow
          label="Initial deposit"
          value={`${form.initialDepositAmount} ${form.initialDepositCurrency}`}
        />
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="text-lg font-medium">Consents</h3>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="termsAccepted"
            checked={form.termsAccepted}
            onCheckedChange={(checked) => onChange({ termsAccepted: checked === true })}
          />
          <Label htmlFor="termsAccepted" className="font-normal text-sm leading-relaxed">
            I accept the{' '}
            <Link href="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </Label>
        </div>
        <FieldError message={errors.termsAccepted} />

        <div className="flex items-start space-x-2">
          <Checkbox
            id="privacyAccepted"
            checked={form.privacyAccepted}
            onCheckedChange={(checked) => onChange({ privacyAccepted: checked === true })}
          />
          <Label htmlFor="privacyAccepted" className="font-normal text-sm leading-relaxed">
            I accept the{' '}
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        <FieldError message={errors.privacyAccepted} />

        <div className="flex items-start space-x-2">
          <Checkbox
            id="amlAccepted"
            checked={form.amlAccepted}
            onCheckedChange={(checked) => onChange({ amlAccepted: checked === true })}
          />
          <Label htmlFor="amlAccepted" className="font-normal text-sm leading-relaxed">
            I confirm the AML declaration and source of funds information is accurate
          </Label>
        </div>
        <FieldError message={errors.amlAccepted} />

        <div className="flex items-start space-x-2">
          <Checkbox
            id="dataProcessingAccepted"
            checked={form.dataProcessingAccepted}
            onCheckedChange={(checked) =>
              onChange({ dataProcessingAccepted: checked === true })
            }
          />
          <Label
            htmlFor="dataProcessingAccepted"
            className="font-normal text-sm leading-relaxed"
          >
            I consent to processing of my personal data for account opening and compliance
          </Label>
        </div>
        <FieldError message={errors.dataProcessingAccepted} />

        <div className="flex items-start space-x-2">
          <Checkbox
            id="marketingConsent"
            checked={form.marketingConsent}
            onCheckedChange={(checked) => onChange({ marketingConsent: checked === true })}
          />
          <Label htmlFor="marketingConsent" className="font-normal text-sm leading-relaxed">
            I agree to receive marketing emails and SMS (optional)
          </Label>
        </div>
      </div>
    </div>
  )
}
