import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AddressFormState, ApplicationFormState } from '@/lib/application/types'
import { FormField } from '../FormField'

type AddressStepProps = {
  form: ApplicationFormState
  errors: Record<string, string>
  onChange: (updates: Partial<ApplicationFormState>) => void
  onResidentialAddressChange: (updates: Partial<AddressFormState>) => void
  onMailingAddressChange: (updates: Partial<AddressFormState>) => void
}

function AddressFields({
  prefix,
  address,
  errors,
  onChange,
}: {
  prefix: 'residentialAddress' | 'mailingAddress'
  address: AddressFormState
  errors: Record<string, string>
  onChange: (updates: Partial<AddressFormState>) => void
}) {
  return (
    <div className="space-y-4">
      <FormField
        label="Address line 1"
        htmlFor={`${prefix}.line1`}
        error={errors[`${prefix}.line1`]}
      >
        <Input
          id={`${prefix}.line1`}
          value={address.line1}
          onChange={(e) => onChange({ line1: e.target.value })}
        />
      </FormField>
      <FormField label="Address line 2 (optional)" htmlFor={`${prefix}.line2`}>
        <Input
          id={`${prefix}.line2`}
          value={address.line2}
          onChange={(e) => onChange({ line2: e.target.value })}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="City or island"
          htmlFor={`${prefix}.cityOrIsland`}
          error={errors[`${prefix}.cityOrIsland`]}
        >
          <Input
            id={`${prefix}.cityOrIsland`}
            value={address.cityOrIsland}
            onChange={(e) => onChange({ cityOrIsland: e.target.value })}
          />
        </FormField>
        <FormField label="Postal code (optional)" htmlFor={`${prefix}.postalCode`}>
          <Input
            id={`${prefix}.postalCode`}
            value={address.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
          />
        </FormField>
      </div>
      <FormField
        label="Country"
        htmlFor={`${prefix}.country`}
        error={errors[`${prefix}.country`]}
      >
        <Input
          id={`${prefix}.country`}
          value={address.country}
          onChange={(e) => onChange({ country: e.target.value })}
        />
      </FormField>
    </div>
  )
}

export function AddressStep({
  form,
  errors,
  onChange,
  onResidentialAddressChange,
  onMailingAddressChange,
}: AddressStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Country of residence"
          htmlFor="countryOfResidence"
          error={errors.countryOfResidence}
        >
          <Input
            id="countryOfResidence"
            value={form.countryOfResidence}
            onChange={(e) => onChange({ countryOfResidence: e.target.value })}
          />
        </FormField>
        <FormField
          label="Tax residence country"
          htmlFor="taxResidenceCountry"
          error={errors.taxResidenceCountry}
        >
          <Input
            id="taxResidenceCountry"
            value={form.taxResidenceCountry}
            onChange={(e) => onChange({ taxResidenceCountry: e.target.value })}
          />
        </FormField>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Residential address</h3>
        <AddressFields
          prefix="residentialAddress"
          address={form.residentialAddress}
          errors={errors}
          onChange={onResidentialAddressChange}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="sameAsResidentialMailing"
          checked={form.sameAsResidentialMailing}
          onCheckedChange={(checked) =>
            onChange({ sameAsResidentialMailing: checked === true })
          }
        />
        <Label htmlFor="sameAsResidentialMailing" className="font-normal">
          Mailing address is the same as residential address
        </Label>
      </div>

      {!form.sameAsResidentialMailing && (
        <div>
          <h3 className="mb-4 text-lg font-medium">Mailing address</h3>
          <AddressFields
            prefix="mailingAddress"
            address={form.mailingAddress}
            errors={errors}
            onChange={onMailingAddressChange}
          />
        </div>
      )}
    </div>
  )
}
