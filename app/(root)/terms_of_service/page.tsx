import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg after:content-[''] after:w-16 after:h-1 after:bg-yellow-400 after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
        Terms of Service
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mt-4">1. Acceptance of Terms</h2>
        <p>
          By using our Site, you agree to these Terms and our Privacy Policy,
          which is incorporated into these Terms by reference. We may modify
          these Terms at any time, and such modifications will be effective
          immediately upon posting on the Site. Your continued use of the Site
          following any changes signifies your acceptance of the modified Terms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">2. User Accounts</h2>
        <p>
          To access certain features of our Site, you may need to create an
          account. You agree to provide accurate, current, and complete
          information and to update your information as necessary to keep it
          accurate, current, and complete. You are responsible for maintaining
          the confidentiality of your account information and for all activities
          that occur under your account.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">3. Use of the Site</h2>
        <p>
          You agree to use the Site only for lawful purposes and in accordance
          with these Terms. You may not use the Site:
        </p>
        <ul className="list-disc ml-5">
          <li>
            In any way that violates any applicable local, state, national, or
            international law or regulation.
          </li>
          <li>
            To exploit, harm, or attempt to exploit or harm minors in any way.
          </li>
          <li>
            To transmit or procure the sending of any advertising or promotional
            material without our prior written consent.
          </li>
          <li>
            To impersonate or attempt to impersonate dessysattic.com, a
            dessysattic.com employee, another user, or any other person or
            entity.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          4. Intellectual Property
        </h2>
        <p>
          All content on the Site, including text, graphics, logos, images, and
          software, is the property of DSY or its licensors and is protected by
          copyright, trademark, and other intellectual property laws.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          5. Product Information and Availability
        </h2>
        <p>
          We make every effort to display accurate product information. However,
          we do not guarantee that all product descriptions or other content on
          the Site are accurate, complete, reliable, or error-free.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">6. Orders and Payment</h2>
        <p>
          By placing an order, you agree to pay the full price for the items
          ordered plus any applicable taxes and shipping fees. All payments are
          processed through our third-party payment processor. We reserve the
          right to refuse or cancel any order for any reason, including but not
          limited to product availability or suspected fraud.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">7. Changes to Terms</h2>
        <p>
          We reserve the right to update these Terms at any time. The updated
          version will be effective as of the date of posting unless stated
          otherwise. Your continued use of the Site following any changes to the
          Terms indicates your acceptance of the updated Terms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          8. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, DSY shall not be liable for
          any indirect, incidental, or consequential damages arising out of or
          related to your use of the Site.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">9. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Benin City, Edo State, Nigeria, without regard to its conflict
          of law provisions.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mt-4">10. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account and access
          to the Site at our sole discretion, without notice, for any reason,
          including but not limited to violation of these Terms.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
