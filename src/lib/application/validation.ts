import { z } from 'zod'
import {
  ACCOUNT_TYPE_OPTIONS,
  ID_DOCUMENT_TYPE_OPTIONS,
  PROOF_OF_ADDRESS_TYPE_OPTIONS,
  SOURCE_OF_FUNDS_TYPE_OPTIONS,
  INITIAL_DEPOSIT_METHOD_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
} from './constants'

const accountTypes = ACCOUNT_TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]]
const idTypes = ID_DOCUMENT_TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]]
const proofTypes = PROOF_OF_ADDRESS_TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]]
const sourceTypes = SOURCE_OF_FUNDS_TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]]
const depositMethods = INITIAL_DEPOSIT_METHOD_OPTIONS.map((o) => o.value) as [string, ...string[]]
const employmentStatuses = EMPLOYMENT_STATUS_OPTIONS.map((o) => o.value) as [string, ...string[]]

const addressSchema = z.object({
  line1: z.string().trim().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  cityOrIsland: z.string().trim().min(1, 'City or island is required'),
  postalCode: z.string().optional(),
  country: z.string().trim().min(1, 'Country is required'),
})

function assertMinimumAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  if (age < 18) {
    return false
  }
  return true
}

export const identityStepSchema = z.object({
  accountType: z.enum(accountTypes, { message: 'Account type is required' }),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => assertMinimumAge(value), {
      message: 'You must be at least 18 years old',
    }),
  nationality: z.string().trim().min(1, 'Nationality is required'),
  email: z.string().trim().email('Please enter a valid email'),
  mobilePhone: z.string().trim().min(7, 'Mobile phone is required'),
})

export const addressStepSchema = z.object({
  countryOfResidence: z.string().trim().min(1, 'Country of residence is required'),
  taxResidenceCountry: z.string().trim().min(1, 'Tax residence country is required'),
  residentialAddress: addressSchema,
})

export const documentsStepSchema = z.object({
  idDocumentType: z.enum(idTypes, { message: 'ID document type is required' }),
  idDocumentNumber: z.string().trim().min(1, 'ID document number is required'),
  idIssuingCountry: z.string().trim().min(1, 'Issuing country is required'),
  idExpiryDate: z.string().min(1, 'ID expiry date is required'),
  proofOfAddressType: z.enum(proofTypes, { message: 'Proof of address type is required' }),
})

export const financialStepSchema = z.object({
  sourceOfFundsType: z.enum(sourceTypes, { message: 'Source of funds is required' }),
  initialDepositAmount: z
    .string()
    .min(1, 'Initial deposit amount is required')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'Initial deposit must be a valid amount',
    }),
  initialDepositCurrency: z.string().trim().min(1, 'Currency is required'),
  initialDepositMethod: z.enum(depositMethods, { message: 'Deposit method is required' }),
  employmentStatus: z.enum(employmentStatuses).optional().or(z.literal('')),
})

export const reviewStepSchema = z.object({
  termsAccepted: z.literal(true, { message: 'You must accept the terms of service' }),
  privacyAccepted: z.literal(true, { message: 'You must accept the privacy policy' }),
  amlAccepted: z.literal(true, { message: 'You must accept the AML declaration' }),
  dataProcessingAccepted: z.literal(true, {
    message: 'You must accept data processing',
  }),
})

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form'
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}

export function mapApiFieldErrors(errors: { field: string; message: string }[] = []) {
  const fieldErrors: Record<string, string> = {}
  for (const entry of errors) {
    fieldErrors[entry.field] = entry.message
  }
  return fieldErrors
}
