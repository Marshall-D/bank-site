import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ACCOUNT_TYPE_OPTIONS } from '@/lib/application/constants'
import type { ApplicationFormState } from '@/lib/application/types'
import { FormField } from '../FormField'

type IdentityStepProps = {
  form: ApplicationFormState
  errors: Record<string, string>
  onChange: (updates: Partial<ApplicationFormState>) => void
}

export function IdentityStep({ form, errors, onChange }: IdentityStepProps) {
  return (
    <div className="space-y-4">
      <FormField label="Account type" htmlFor="accountType" error={errors.accountType}>
        <Select
          value={form.accountType}
          onValueChange={(value) =>
            onChange({ accountType: value as ApplicationFormState['accountType'] })
          }
        >
          <SelectTrigger id="accountType" className="w-full">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" htmlFor="firstName" error={errors.firstName}>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </FormField>
        <FormField label="Last name" htmlFor="lastName" error={errors.lastName}>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </FormField>
      </div>

      <FormField label="Middle name (optional)" htmlFor="middleName">
        <Input
          id="middleName"
          value={form.middleName}
          onChange={(e) => onChange({ middleName: e.target.value })}
        />
      </FormField>

      <FormField label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth}>
        <Input
          id="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => onChange({ dateOfBirth: e.target.value })}
        />
      </FormField>

      <FormField label="Nationality" htmlFor="nationality" error={errors.nationality}>
        <Input
          id="nationality"
          value={form.nationality}
          onChange={(e) => onChange({ nationality: e.target.value })}
        />
      </FormField>

      <FormField label="Email address" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Mobile phone" htmlFor="mobilePhone" error={errors.mobilePhone}>
          <Input
            id="mobilePhone"
            value={form.mobilePhone}
            onChange={(e) => onChange({ mobilePhone: e.target.value })}
            placeholder="+16491234567"
          />
        </FormField>
        <FormField label="Secondary phone (optional)" htmlFor="secondaryPhone">
          <Input
            id="secondaryPhone"
            value={form.secondaryPhone}
            onChange={(e) => onChange({ secondaryPhone: e.target.value })}
          />
        </FormField>
      </div>
    </div>
  )
}
