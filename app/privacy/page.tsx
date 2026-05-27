import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | DriveEasy',
  description: 'Privacy Policy for DriveEasy car rental service. Learn how we handle and protect your personal data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect personal information that you provide directly to us, including but not limited to your name, email address, phone number, driver&apos;s license details, and payment information when you register for an account or make a booking.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Process your car rental bookings and payments</li>
            <li>Verify your identity and driving eligibility</li>
            <li>Send you administrative messages, confirmations, and security alerts</li>
            <li>Provide customer support and respond to your requests</li>
            <li>Improve our platform and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information. Payment processing is handled by secure third-party providers (like Stripe), and we do not store your full credit card details on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            We may use third-party services for analytics, payment processing, and email delivery. These services may collect information sent by your browser as part of a web page request, such as cookies or your IP address.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@driveeasy.com" className="text-primary hover:underline">privacy@driveeasy.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
