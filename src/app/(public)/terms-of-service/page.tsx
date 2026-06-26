import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalDocument, LegalSection } from '@/components/legal/LegalDocument'
import { BRAND_EMAILS, BRAND_NAME, BRAND_SHORT } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Terms of Service | ${BRAND_SHORT}`,
  description: `Terms and conditions governing use of ${BRAND_NAME} banking services and website.`,
}

export default function TermsOfServicePage() {
  return (
    <LegalDocument title="Terms of Service" lastUpdated="20 January 2026">
      <LegalSection title="1. Agreement to terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website,
          mobile applications, and banking services offered by {BRAND_NAME} (&quot;{BRAND_SHORT}&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By opening an account, submitting an
          application, or using our services, you agree to be bound by these Terms, our{' '}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          , and any product-specific agreements disclosed at account opening.
        </p>
        <p>
          If you do not agree to these Terms, you must not use our services. We may decline or
          terminate access where permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 18 years old and legally capable of entering into binding contracts in
          your jurisdiction. Business accounts must be opened by an authorised representative with
          authority to bind the entity. You represent that all information you provide is accurate,
          complete, and current.
        </p>
      </LegalSection>

      <LegalSection title="3. Account opening and KYC">
        <p>
          Account applications are subject to identity verification, credit checks, sanctions
          screening, and regulatory approval. We may request additional documents or information at any
          time. Approval is not guaranteed. We reserve the right to refuse or close accounts where
          required by law, risk policy, or suspicious activity concerns.
        </p>
      </LegalSection>

      <LegalSection title="4. Use of services">
        <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use accounts for money laundering, terrorist financing, fraud, or other illegal activity.</li>
          <li>Provide false, misleading, or incomplete information.</li>
          <li>Attempt to gain unauthorised access to our systems or other customers&apos; accounts.</li>
          <li>Interfere with the proper functioning of our website or applications.</li>
          <li>Use our services in violation of applicable sanctions, export controls, or banking regulations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Online banking and security">
        <p>
          You are responsible for safeguarding your login credentials, devices, and authentication
          factors. You must notify us immediately if you suspect unauthorised access or a security
          breach. We are not liable for losses resulting from your failure to protect credentials,
          except where applicable law provides otherwise.
        </p>
        <p>
          We may suspend or restrict access to protect you, other customers, or the integrity of our
          systems, including during maintenance or security incidents.
        </p>
      </LegalSection>

      <LegalSection title="6. Fees, interest, and transactions">
        <p>
          Applicable fees, interest rates, limits, and cut-off times are disclosed in product
          schedules, account agreements, and on our website. You authorise us to debit your account
          for fees, charges, and transactions you initiate or approve. We are not responsible for
          delays caused by intermediary banks, payment networks, or circumstances beyond our
          reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="7. Deposits and insurance">
        <p>
          Deposit products may be subject to applicable deposit protection schemes where available in
          your jurisdiction. Coverage limits and eligibility are determined by the relevant scheme
          rules, not by {BRAND_SHORT}. Details are provided in your account documentation.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual property">
        <p>
          All content, trademarks, logos, software, and materials on our platforms are owned by or
          licensed to {BRAND_SHORT}. You receive a limited, non-exclusive, revocable licence to access
          and use our services for personal or authorised business banking. You may not copy, modify,
          distribute, or reverse engineer our materials except as permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          To the fullest extent permitted by law, {BRAND_SHORT} and its directors, officers,
          employees, and agents are not liable for indirect, incidental, special, consequential, or
          punitive damages arising from your use of our services. Our aggregate liability for direct
          damages is limited to the greater of fees paid by you in the twelve months preceding the
          claim or one hundred United States dollars (USD 100), except where liability cannot be
          excluded under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="10. Indemnification">
        <p>
          You agree to indemnify and hold harmless {BRAND_SHORT} against claims, losses, and expenses
          arising from your breach of these Terms, misuse of our services, or violation of applicable
          law, except to the extent caused by our gross negligence or wilful misconduct.
        </p>
      </LegalSection>

      <LegalSection title="11. Suspension and termination">
        <p>
          You may close your account in accordance with our account closure procedures. We may suspend
          or terminate access or close accounts with notice where required by law, or immediately where
          necessary for security, regulatory compliance, or material breach of these Terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law and disputes">
        <p>
          These Terms are governed by the laws of Barbados, without regard to conflict-of-law
          principles, except where mandatory consumer protection laws in your country of residence
          apply. Disputes shall be subject to the exclusive jurisdiction of the courts of Barbados,
          unless applicable law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to these Terms">
        <p>
          We may amend these Terms from time to time. Material changes will be communicated through
          our website, email, or in-app notice as required by law. Continued use after the effective
          date constitutes acceptance where permitted.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
        <p>
          Questions about these Terms may be directed to{' '}
          <a href={`mailto:${BRAND_EMAILS.legal}`} className="text-primary hover:underline">
            {BRAND_EMAILS.legal}
          </a>{' '}
          or through our{' '}
          <Link href="/support" className="text-primary hover:underline">
            support page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
