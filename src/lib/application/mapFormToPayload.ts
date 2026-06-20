import type { ApplicationFormState, CreateApplicationPayload } from './types'
import type { LocalDocumentsState } from './localDocuments'
import { sanitizeFilenameForId } from './localDocuments'

function cleanAddress(address: ApplicationFormState['residentialAddress']) {
  return {
    line1: address.line1.trim(),
    ...(address.line2.trim() ? { line2: address.line2.trim() } : {}),
    cityOrIsland: address.cityOrIsland.trim(),
    ...(address.postalCode.trim() ? { postalCode: address.postalCode.trim() } : {}),
    country: address.country.trim(),
  }
}

function buildPlaceholderFileId(
  prefix: string,
  email: string,
  filename?: string
) {
  const slug = email.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 24)
  const filePart = filename ? `_${sanitizeFilenameForId(filename)}` : ''
  return `placeholder_${prefix}_${slug}${filePart}_${Date.now()}`
}

export function mapFormToPayload(
  form: ApplicationFormState,
  localDocuments?: LocalDocumentsState
): CreateApplicationPayload {
  const monthlyEstimate = form.sourceOfFundsMonthlyEstimate.trim()
    ? Number(form.sourceOfFundsMonthlyEstimate)
    : undefined

  const payload: CreateApplicationPayload = {
    accountType: form.accountType as CreateApplicationPayload['accountType'],
    applicantType: 'individual',
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    dateOfBirth: form.dateOfBirth,
    nationality: form.nationality.trim(),
    countryOfResidence: form.countryOfResidence.trim(),
    taxResidenceCountry: form.taxResidenceCountry.trim(),
    email: form.email.trim().toLowerCase(),
    mobilePhone: form.mobilePhone.trim(),
    residentialAddress: cleanAddress(form.residentialAddress),
    idDocument: {
      type: form.idDocumentType as CreateApplicationPayload['idDocument']['type'],
      number: form.idDocumentNumber.trim(),
      issuingCountry: form.idIssuingCountry.trim(),
      expiryDate: form.idExpiryDate,
      frontFileId: buildPlaceholderFileId(
        'id_front',
        form.email,
        localDocuments?.idFront?.name
      ),
    },
    proofOfAddressDocument: {
      type: form.proofOfAddressType as CreateApplicationPayload['proofOfAddressDocument']['type'],
      fileId: buildPlaceholderFileId(
        'proof_of_address',
        form.email,
        localDocuments?.proofOfAddress?.name
      ),
      ...(form.proofOfAddressIssueDate
        ? { issueDate: form.proofOfAddressIssueDate }
        : {}),
    },
    sourceOfFunds: {
      sourceType: form.sourceOfFundsType as CreateApplicationPayload['sourceOfFunds']['sourceType'],
      ...(form.sourceOfFundsDescription.trim()
        ? { description: form.sourceOfFundsDescription.trim() }
        : {}),
      ...(monthlyEstimate !== undefined ? { monthlyEstimate, currency: 'USD' } : {}),
    },
    initialDeposit: {
      amount: Number(form.initialDepositAmount),
      currency: form.initialDepositCurrency.trim().toUpperCase(),
      method: form.initialDepositMethod as CreateApplicationPayload['initialDeposit']['method'],
    },
    consents: {
      termsAccepted: form.termsAccepted,
      privacyAccepted: form.privacyAccepted,
      amlAccepted: form.amlAccepted,
      dataProcessingAccepted: form.dataProcessingAccepted,
      marketingConsent: form.marketingConsent,
    },
  }

  if (form.middleName.trim()) {
    payload.middleName = form.middleName.trim()
  }

  if (form.secondaryPhone.trim()) {
    payload.secondaryPhone = form.secondaryPhone.trim()
  }

  if (!form.sameAsResidentialMailing) {
    payload.mailingAddress = cleanAddress(form.mailingAddress)
  }

  if (form.employmentStatus) {
    payload.employment = {
      status: form.employmentStatus as NonNullable<CreateApplicationPayload['employment']>['status'],
      ...(form.employerName.trim() ? { employerName: form.employerName.trim() } : {}),
      ...(form.jobTitle.trim() ? { jobTitle: form.jobTitle.trim() } : {}),
    }
  }

  if (form.purposeOfAccount.trim()) {
    payload.purposeOfAccount = form.purposeOfAccount.trim()
  }

  if (form.preferredBranch.trim()) {
    payload.preferredBranch = form.preferredBranch.trim()
  }

  if (form.pepDeclaration) {
    payload.pepDeclaration = true
  }

  if (localDocuments?.idBack) {
    payload.idDocument.backFileId = buildPlaceholderFileId(
      'id_back',
      form.email,
      localDocuments.idBack.name
    )
  }

  return payload
}
