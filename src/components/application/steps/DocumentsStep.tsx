import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ID_DOCUMENT_TYPE_OPTIONS,
  PROOF_OF_ADDRESS_TYPE_OPTIONS,
} from '@/lib/application/constants'
import type { LocalDocumentFile, LocalDocumentsState } from '@/lib/application/localDocuments'
import type { ApplicationFormState } from '@/lib/application/types'
import { DocumentUploadField } from '../DocumentUploadField'
import { FormField } from '../FormField'

type DocumentsStepProps = {
  form: ApplicationFormState
  localDocuments: LocalDocumentsState
  errors: Record<string, string>
  onChange: (updates: Partial<ApplicationFormState>) => void
  onDocumentSelect: (slot: LocalDocumentFile['slot'], file: File) => void
  onDocumentRemove: (slot: LocalDocumentFile['slot']) => void
}

export function DocumentsStep({
  form,
  localDocuments,
  errors,
  onChange,
  onDocumentSelect,
  onDocumentRemove,
}: DocumentsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Government ID</h3>
        <div className="space-y-4">
          <FormField
            label="ID type"
            htmlFor="idDocumentType"
            error={errors.idDocumentType}
          >
            <Select
              value={form.idDocumentType}
              onValueChange={(value) =>
                onChange({ idDocumentType: value as ApplicationFormState['idDocumentType'] })
              }
            >
              <SelectTrigger id="idDocumentType" className="w-full">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {ID_DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="ID number"
            htmlFor="idDocumentNumber"
            error={errors.idDocumentNumber}
          >
            <Input
              id="idDocumentNumber"
              value={form.idDocumentNumber}
              onChange={(e) => onChange({ idDocumentNumber: e.target.value })}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Issuing country"
              htmlFor="idIssuingCountry"
              error={errors.idIssuingCountry}
            >
              <Input
                id="idIssuingCountry"
                value={form.idIssuingCountry}
                onChange={(e) => onChange({ idIssuingCountry: e.target.value })}
              />
            </FormField>
            <FormField
              label="Expiry date"
              htmlFor="idExpiryDate"
              error={errors.idExpiryDate}
            >
              <Input
                id="idExpiryDate"
                type="date"
                value={form.idExpiryDate}
                onChange={(e) => onChange({ idExpiryDate: e.target.value })}
              />
            </FormField>
          </div>

          <DocumentUploadField
            id="idFrontFile"
            label="ID front image"
            hint="Upload a clear photo of the front of your ID."
            required
            value={localDocuments.idFront}
            error={errors.idFrontFile}
            onSelect={(file) => onDocumentSelect('idFront', file)}
            onRemove={() => onDocumentRemove('idFront')}
          />

          <DocumentUploadField
            id="idBackFile"
            label="ID back image (optional)"
            hint="Required for national ID or driver's license if applicable."
            value={localDocuments.idBack}
            error={errors.idBackFile}
            onSelect={(file) => onDocumentSelect('idBack', file)}
            onRemove={() => onDocumentRemove('idBack')}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Proof of address</h3>
        <div className="space-y-4">
          <FormField
            label="Document type"
            htmlFor="proofOfAddressType"
            error={errors.proofOfAddressType}
          >
            <Select
              value={form.proofOfAddressType}
              onValueChange={(value) =>
                onChange({
                  proofOfAddressType: value as ApplicationFormState['proofOfAddressType'],
                })
              }
            >
              <SelectTrigger id="proofOfAddressType" className="w-full">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {PROOF_OF_ADDRESS_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Issue date (optional)" htmlFor="proofOfAddressIssueDate">
            <Input
              id="proofOfAddressIssueDate"
              type="date"
              value={form.proofOfAddressIssueDate}
              onChange={(e) => onChange({ proofOfAddressIssueDate: e.target.value })}
            />
          </FormField>

          <DocumentUploadField
            id="proofOfAddressFile"
            label="Proof of address image"
            hint="Utility bill, bank statement, or lease agreement dated within the last 3 months."
            required
            value={localDocuments.proofOfAddress}
            error={errors.proofOfAddressFile}
            onSelect={(file) => onDocumentSelect('proofOfAddress', file)}
            onRemove={() => onDocumentRemove('proofOfAddress')}
          />
        </div>
      </div>
    </div>
  )
}
