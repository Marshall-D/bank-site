import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalDocument, LegalSection } from '@/components/legal/LegalDocument'
import { BRAND_EMAILS, BRAND_NAME, BRAND_SHORT } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND_SHORT}`,
  description: `How ${BRAND_NAME} collects, uses, and protects your personal information.`,
}

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument title="Privacy Policy" lastUpdated="20 January 2026">
      <LegalSection title="1. Introduction">
        <p>
          {BRAND_NAME} (&quot;{BRAND_SHORT}&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
          disclose, store, and safeguard personal information when you visit our website, apply for an
          account, use online banking, or otherwise interact with our services across the Caribbean
          region.
        </p>
        <p>
          By using our services, you acknowledge that you have read this Privacy Policy. Where
          required by law, we will obtain your consent before processing your personal information
          for specific purposes.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>We may collect the following categories of personal information:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Identity and contact data</strong> — name, date of
            birth, nationality, address, email address, and phone numbers.
          </li>
          <li>
            <strong className="text-foreground">Financial data</strong> — account numbers, transaction
            history, source of funds, employment information, and tax residency details required for
            account opening and regulatory compliance.
          </li>
          <li>
            <strong className="text-foreground">Technical data</strong> — IP address, browser type,
            device identifiers, session logs, and usage data collected when you access our website or
            mobile applications.
          </li>
          <li>
            <strong className="text-foreground">Communications</strong> — records of correspondence
            with our support team, complaints, and application status enquiries.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Process account applications and verify your identity.</li>
          <li>Provide banking products, payment services, and customer support.</li>
          <li>Detect, prevent, and investigate fraud, money laundering, and other financial crime.</li>
          <li>Comply with legal and regulatory obligations applicable in the jurisdictions where we operate.</li>
          <li>Improve our website, applications, and security controls.</li>
          <li>
            Send service-related notices, including changes to terms, security alerts, and application
            status updates. Marketing communications are sent only where you have opted in.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Legal bases for processing">
        <p>
          Depending on your location and the nature of the processing, we rely on one or more of the
          following legal bases: performance of a contract (providing banking services you request),
          compliance with legal obligations, legitimate interests (such as fraud prevention and service
          improvement), and your consent where required.
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing and disclosure">
        <p>
          We do not sell your personal information. We may share information with trusted third
          parties only where necessary, including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Payment networks, correspondent banks, and clearing systems to execute transactions.</li>
          <li>Identity verification and fraud prevention service providers.</li>
          <li>Cloud hosting and technology vendors bound by confidentiality and data protection obligations.</li>
          <li>Regulators, law enforcement, and courts when required by applicable law.</li>
          <li>Professional advisers such as auditors and legal counsel under duty of confidentiality.</li>
        </ul>
        <p>
          Where personal information is transferred outside your country of residence, we implement
          appropriate safeguards consistent with applicable data protection requirements.
        </p>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <p>
          We retain personal information for as long as necessary to provide services, meet regulatory
          record-keeping requirements, resolve disputes, and enforce our agreements. Retention periods
          vary by data type and may extend beyond the closure of your account where law requires.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We apply administrative, technical, and physical safeguards to protect personal information,
          including encryption in transit, access controls, monitoring, and staff training. No method of
          transmission or storage is completely secure; you are responsible for keeping your login
          credentials confidential and notifying us promptly of any suspected unauthorised access.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Subject to applicable law, you may have the right to access, correct, delete, or restrict
          processing of your personal information, to object to certain processing, to withdraw
          consent, and to receive a copy of your data in a portable format. To exercise these rights,
          contact us using the details below. We may need to verify your identity before responding.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          Our services are not directed to individuals under 18 years of age. We do not knowingly
          collect personal information from minors. If you believe we have collected information from a
          minor, please contact us so we can take appropriate action.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be posted on this
          page with an updated effective date. Continued use of our services after changes take effect
          constitutes acceptance of the revised policy where permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact us">
        <p>
          For privacy-related questions or requests, contact our Data Protection team at{' '}
          <a href={`mailto:${BRAND_EMAILS.privacy}`} className="text-primary hover:underline">
            {BRAND_EMAILS.privacy}
          </a>{' '}
          or write to {BRAND_NAME}, Privacy Office, P.O. Box 1200, Bridgetown, Barbados. You may also
          reach our support team through our{' '}
          <Link href="/support" className="text-primary hover:underline">
            support page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
