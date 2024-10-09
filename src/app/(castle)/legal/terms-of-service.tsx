// app/terms-of-service/page.tsx

export const metadata = {
  title: 'Terms of Service - Lyovson.com',
  description: 'The terms of service governing the use of Lyovson.com.',
};

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p>Effective Date: October 2024</p>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Lyovson.com (“Website,” “we,” “our,” or “us”),
          you agree to comply with and be bound by these Terms of Service
          (“Terms”). If you do not agree with any of these terms, you must not
          use the Website.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
        <p>
          You must be at least 13 years old to use Lyovson.com. By using the
          Website, you confirm that you meet this age requirement and that you
          are legally able to enter into these Terms.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
        <p>
          To access certain features on Lyovson.com, you may need to create an
          account. You agree to provide accurate, current, and complete
          information during the registration process. You are responsible for
          safeguarding your account credentials and for all activity that occurs
          under your account.
        </p>
        <ul className="list-disc ml-5">
          <li>
            <strong>Account Security:</strong> You must notify us immediately if
            you suspect any unauthorized use of your account.
          </li>
          <li>
            <strong>Termination:</strong> We reserve the right to terminate your
            account if you violate these Terms or engage in any prohibited
            activities.
          </li>
        </ul>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">4. Acceptable Use</h2>
        <p>
          By using Lyovson.com, you agree to adhere to the following acceptable
          use policies:
        </p>
        <ul className="list-disc ml-5">
          <li>
            You must not use the Website for any illegal or unauthorized
            purpose.
          </li>
          <li>
            You must not violate any local, national, or international law.
          </li>
          <li>
            You must not upload or share any content that is harmful, abusive,
            defamatory, or harassing.
          </li>
          <li>
            You must not engage in spamming, phishing, or any other fraudulent
            or deceptive practices.
          </li>
          <li>
            You must not interfere with or disrupt the operation of the Website
            or its services.
          </li>
        </ul>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Content Ownership and Intellectual Property
        </h2>
        <p>
          - <strong>User Content:</strong> By posting content on Lyovson.com,
          you grant us a non-exclusive, royalty-free, worldwide license to use,
          distribute, and display such content as part of providing the
          Website’s services. - <strong>Our Content:</strong> All content on the
          Website, including text, graphics, logos, and software, is owned by or
          licensed to Lyovson.com and is protected by copyright and other
          intellectual property laws. You may not copy, distribute, or create
          derivative works from any of our content without our express written
          consent.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">6. Privacy</h2>
        <p>
          Your use of Lyovson.com is also governed by our Privacy Policy, which
          can be found{' '}
          <a href="/privacy-policy" className="text-blue-500 underline">
            here
          </a>
          . The Privacy Policy explains how we collect, use, and protect your
          personal data.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to
          Lyovson.com at any time, without notice, if we determine that you have
          violated these Terms or engaged in any activities that could harm the
          Website or its users.
        </p>
        <p>
          You may also terminate your account at any time by contacting us at{' '}
          <a
            href="mailto:support@lyovson.com"
            className="text-blue-500 underline"
          >
            support@lyovson.com
          </a>
          .
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">8. Disclaimers</h2>
        <p>
          The Website and its services are provided “as is” without any
          warranties, either express or implied. We do not warrant that the
          Website will be error-free, uninterrupted, or secure.
        </p>
        <p>
          To the fullest extent permitted by law, we disclaim all liability for
          any damages arising from your use of Lyovson.com, including direct,
          indirect, incidental, or consequential damages.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">9. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Lyovson.com, its owners,
          affiliates, and employees from any claims, losses, damages, or
          expenses (including legal fees) arising from your use of the Website
          or your violation of these Terms.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">
          10. Modifications to Terms
        </h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify
          you of any significant changes by updating the “Effective Date” at the
          top of this page. It is your responsibility to review these Terms
          periodically. Your continued use of the Website after changes have
          been posted constitutes your acceptance of the revised Terms.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of [Your Jurisdiction], without regard to its conflict of law
          principles. Any disputes arising from or related to these Terms or
          your use of the Website will be subject to the exclusive jurisdiction
          of the courts in [Your Jurisdiction].
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us at:
        </p>
        <p>
          Email:{' '}
          <a
            href="mailto:support@lyovson.com"
            className="text-blue-500 underline"
          >
            support@lyovson.com
          </a>
        </p>
        <p>Mailing Address: Lyovson.com, [Your Company Address]</p>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
