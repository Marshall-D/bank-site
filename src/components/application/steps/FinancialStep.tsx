import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  BRANCH_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  INITIAL_DEPOSIT_METHOD_OPTIONS,
  SOURCE_OF_FUNDS_TYPE_OPTIONS,
} from '@/lib/application/constants'
import type { ApplicationFormState } from '@/lib/application/types'
import { FormField } from '../FormField'

type FinancialStepProps = {
  form: ApplicationFormState
  errors: Record<string, string>
  onChange: (updates: Partial<ApplicationFormState>) => void
}

export function FinancialStep({ form, errors, onChange }: FinancialStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Source of funds</h3>
        <div className="space-y-4">
          <FormField
            label="Source type"
            htmlFor="sourceOfFundsType"
            error={errors.sourceOfFundsType}
          >
            <Select
              value={form.sourceOfFundsType}
              onValueChange={(value) =>
                onChange({
                  sourceOfFundsType: value as ApplicationFormState['sourceOfFundsType'],
                })
              }
            >
              <SelectTrigger id="sourceOfFundsType" className="w-full">
                <SelectValue placeholder="Select source of funds" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OF_FUNDS_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Description (optional)" htmlFor="sourceOfFundsDescription">
            <Input
              id="sourceOfFundsDescription"
              value={form.sourceOfFundsDescription}
              onChange={(e) => onChange({ sourceOfFundsDescription: e.target.value })}
            />
          </FormField>

          <FormField
            label="Estimated monthly amount (optional)"
            htmlFor="sourceOfFundsMonthlyEstimate"
          >
            <Input
              id="sourceOfFundsMonthlyEstimate"
              type="number"
              min="0"
              value={form.sourceOfFundsMonthlyEstimate}
              onChange={(e) => onChange({ sourceOfFundsMonthlyEstimate: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Initial deposit</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Amount"
            htmlFor="initialDepositAmount"
            error={errors.initialDepositAmount}
          >
            <Input
              id="initialDepositAmount"
              type="number"
              min="0"
              value={form.initialDepositAmount}
              onChange={(e) => onChange({ initialDepositAmount: e.target.value })}
            />
          </FormField>
          <FormField
            label="Currency"
            htmlFor="initialDepositCurrency"
            error={errors.initialDepositCurrency}
          >
            <Input
              id="initialDepositCurrency"
              value={form.initialDepositCurrency}
              onChange={(e) => onChange({ initialDepositCurrency: e.target.value })}
            />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField
            label="Deposit method"
            htmlFor="initialDepositMethod"
            error={errors.initialDepositMethod}
          >
            <Select
              value={form.initialDepositMethod}
              onValueChange={(value) =>
                onChange({
                  initialDepositMethod: value as ApplicationFormState['initialDepositMethod'],
                })
              }
            >
              <SelectTrigger id="initialDepositMethod" className="w-full">
                <SelectValue placeholder="Select deposit method" />
              </SelectTrigger>
              <SelectContent>
                {INITIAL_DEPOSIT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Employment (optional)</h3>
        <div className="space-y-4">
          <FormField label="Employment status" htmlFor="employmentStatus">
            <Select
              value={form.employmentStatus}
              onValueChange={(value) =>
                onChange({
                  employmentStatus: value as ApplicationFormState['employmentStatus'],
                })
              }
            >
              <SelectTrigger id="employmentStatus" className="w-full">
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Employer name" htmlFor="employerName">
              <Input
                id="employerName"
                value={form.employerName}
                onChange={(e) => onChange({ employerName: e.target.value })}
              />
            </FormField>
            <FormField label="Job title" htmlFor="jobTitle">
              <Input
                id="jobTitle"
                value={form.jobTitle}
                onChange={(e) => onChange({ jobTitle: e.target.value })}
              />
            </FormField>
          </div>
        </div>
      </div>

      <FormField label="Purpose of account (optional)" htmlFor="purposeOfAccount">
        <Input
          id="purposeOfAccount"
          value={form.purposeOfAccount}
          onChange={(e) => onChange({ purposeOfAccount: e.target.value })}
          placeholder="Salary, savings, business operations..."
        />
      </FormField>

      <FormField label="Preferred branch (optional)" htmlFor="preferredBranch">
        <Select
          value={form.preferredBranch}
          onValueChange={(value) => onChange({ preferredBranch: value })}
        >
          <SelectTrigger id="preferredBranch" className="w-full">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {BRANCH_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="pepDeclaration"
          checked={form.pepDeclaration}
          onCheckedChange={(checked) => onChange({ pepDeclaration: checked === true })}
        />
        <Label htmlFor="pepDeclaration" className="font-normal text-sm leading-relaxed">
          I am a politically exposed person (PEP) or related to one
        </Label>
      </div>
    </div>
  )
}
