import type {
  ACCOUNT_TYPE_OPTIONS,
  ID_DOCUMENT_TYPE_OPTIONS,
  PROOF_OF_ADDRESS_TYPE_OPTIONS,
  SOURCE_OF_FUNDS_TYPE_OPTIONS,
  INITIAL_DEPOSIT_METHOD_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
} from './constants'

export type AccountType = (typeof ACCOUNT_TYPE_OPTIONS)[number]['value']
export type IdDocumentType = (typeof ID_DOCUMENT_TYPE_OPTIONS)[number]['value']
export type ProofOfAddressType = (typeof PROOF_OF_ADDRESS_TYPE_OPTIONS)[number]['value']
export type SourceOfFundsType = (typeof SOURCE_OF_FUNDS_TYPE_OPTIONS)[number]['value']
export type InitialDepositMethod = (typeof INITIAL_DEPOSIT_METHOD_OPTIONS)[number]['value']
export type EmploymentStatus = (typeof EMPLOYMENT_STATUS_OPTIONS)[number]['value']

export type AddressFormState = {
  line1: string
  line2: string
  cityOrIsland: string
  postalCode: string
  country: string
}

export type ApplicationFormState = {
  accountType: AccountType | ''
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  countryOfResidence: string
  taxResidenceCountry: string
  email: string
  mobilePhone: string
  secondaryPhone: string
  residentialAddress: AddressFormState
  sameAsResidentialMailing: boolean
  mailingAddress: AddressFormState
  idDocumentType: IdDocumentType | ''
  idDocumentNumber: string
  idIssuingCountry: string
  idExpiryDate: string
  proofOfAddressType: ProofOfAddressType | ''
  proofOfAddressIssueDate: string
  sourceOfFundsType: SourceOfFundsType | ''
  sourceOfFundsDescription: string
  sourceOfFundsMonthlyEstimate: string
  initialDepositAmount: string
  initialDepositCurrency: string
  initialDepositMethod: InitialDepositMethod | ''
  employmentStatus: EmploymentStatus | ''
  employerName: string
  jobTitle: string
  purposeOfAccount: string
  preferredBranch: string
  pepDeclaration: boolean
  termsAccepted: boolean
  privacyAccepted: boolean
  amlAccepted: boolean
  dataProcessingAccepted: boolean
  marketingConsent: boolean
}

export type CreateApplicationPayload = {
  accountType: AccountType
  applicantType: 'individual'
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  nationality: string
  countryOfResidence: string
  taxResidenceCountry: string
  email: string
  mobilePhone: string
  secondaryPhone?: string
  residentialAddress: {
    line1: string
    line2?: string
    cityOrIsland: string
    postalCode?: string
    country: string
  }
  mailingAddress?: {
    line1: string
    line2?: string
    cityOrIsland: string
    postalCode?: string
    country: string
  }
  idDocument: {
    type: IdDocumentType
    number: string
    issuingCountry: string
    expiryDate: string
    frontFileId: string
    backFileId?: string
  }
  proofOfAddressDocument: {
    type: ProofOfAddressType
    fileId: string
    issueDate?: string
  }
  sourceOfFunds: {
    sourceType: SourceOfFundsType
    description?: string
    monthlyEstimate?: number
    currency?: string
  }
  initialDeposit: {
    amount: number
    currency: string
    method: InitialDepositMethod
  }
  employment?: {
    status: EmploymentStatus
    employerName?: string
    jobTitle?: string
  }
  pepDeclaration?: boolean
  purposeOfAccount?: string
  preferredBranch?: string
  consents: {
    termsAccepted: boolean
    privacyAccepted: boolean
    amlAccepted: boolean
    dataProcessingAccepted: boolean
    marketingConsent?: boolean
  }
}

export type CreateApplicationResponse = {
  applicationId: string
  applicationReference: string
  status: string
}

export type ApplicationStatusResponse = {
  applicationReference: string
  status: string
  nextStep: string
  submittedAt: string | null
  needMoreInfoNotes?: string
}

export type ApiFieldError = {
  field: string
  message: string
}

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
  errors?: ApiFieldError[]
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
