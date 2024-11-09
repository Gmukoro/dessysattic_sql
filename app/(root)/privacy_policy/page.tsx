import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg after:content-[''] after:w-16 after:h-1 after:bg-yellow-400 after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
        Privacy Policy
      </h1>

      <p>
        At DSY, we value your privacy and are committed to protecting your
        personal information. This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit our website,
        dessysattic.com ("DSY"). By using our Site, you consent to the practices
        described in this Privacy Policy.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          1. Information We Collect
        </h2>
        <p>We collect information about you in various ways:</p>
        <ul className="list-disc ml-5">
          <li>
            <strong>Personal Information:</strong> When you create an account,
            make a purchase, subscribe to our newsletter, or contact us, we may
            collect personal information such as your name, email address, phone
            number, shipping address, billing address, and payment information.
          </li>
          <li>
            <strong>Technical Information:</strong> We collect information about
            your device and usage of our Site, including IP address, browser
            type, operating system, pages visited, and the time and date of your
            visit.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong> We use cookies,
            web beacons, and similar technologies to enhance your experience on
            our Site, track usage patterns, and provide personalized content.
            You can manage your cookie preferences through your browser
            settings.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc ml-5">
          <li>
            <strong>To Process Transactions:</strong> We use your information to
            process and fulfill your orders, manage your account, and provide
            customer service.
          </li>
          <li>
            <strong>To Improve Our Site:</strong> We analyze usage patterns,
            improve our Site’s functionality, and develop new products or
            services.
          </li>
          <li>
            <strong>To Communicate with You:</strong> We send you updates,
            promotional materials, newsletters, and other information you may
            find relevant. You can opt out of marketing communications at any
            time.
          </li>
          <li>
            <strong>To Personalize Your Experience:</strong> We tailor content,
            recommendations, and advertisements based on your preferences and
            behavior.
          </li>
          <li>
            <strong>To Comply with Legal Obligations:</strong> We use your
            information to comply with applicable laws, regulations, or legal
            requests.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          3. Sharing Your Information
        </h2>
        <ul className="list-disc ml-5">
          <li>
            <strong>Service Providers:</strong> We may share your information
            with third-party vendors who perform services on our behalf, such as
            payment processors, shipping companies, and marketing agencies.
            These providers are contractually obligated to protect your
            information and use it only for the purposes for which it was
            disclosed.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with any merger,
            acquisition, or sale of assets, your information may be transferred
            to the acquiring entity.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your
            information if required by law or in response to valid legal
            requests, such as subpoenas or court orders.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">4. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal
          information from unauthorized access, disclosure, or destruction.
          However, no method of transmission over the internet or electronic
          storage is 100% secure. While we strive to protect your information,
          we cannot guarantee its absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">5. Your Choices</h2>
        <ul className="list-disc ml-5">
          <li>
            <strong>Access and Update Information:</strong> You can access and
            update your personal information through your account settings or by
            contacting us.
          </li>
          <li>
            <strong>Opt-Out:</strong> You can opt out of receiving marketing
            communications by following the unsubscribe instructions included in
            each communication or by contacting us directly.
          </li>
          <li>
            <strong>Cookies:</strong> You can manage your cookie preferences
            through your browser settings. Please note that disabling cookies
            may affect your experience on our Site.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">6. Children's Privacy</h2>
        <p>
          Our Site is not intended for individuals under the age of 13. We do
          not knowingly collect personal information from children under 13. If
          we become aware that we have collected personal information from a
          child under 13, we will take steps to delete such information.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">7. International Users</h2>
        <p>
          If you are accessing our Site from outside Nigeria, please be aware
          that your information may be transferred to and processed in Nigeria,
          where our servers are located and our central database is operated. By
          using our Site, you consent to the transfer and processing of your
          information in Nigeria.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          8. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date. We encourage
          you to review this Privacy Policy periodically to stay informed about
          how we are protecting your information.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">9. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our
          data practices, please contact us at:
        </p>
        <ul className="list-disc ml-5">
          <li>Email: Omoefeeweka6@gmail.com</li>
          <li>Phone: +2348108802289</li>
          <li>Address: Edo State, Benin City, Nigeria</li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
