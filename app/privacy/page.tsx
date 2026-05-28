import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | DriveEasy',
  description: 'Privacy Policy for DriveEasy car rental service. Learn how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
        Last updated: May 28, 2026
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">1. Information We Collect</h2>
          <p>We collect the following information to provide our car rental services:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Account Information:</strong> Name, email address, and profile picture (via Google OAuth)</li>
            <li><strong>Booking Data:</strong> Car selection, rental dates, pickup location, and driver details</li>
            <li><strong>Payment Information:</strong> Processed securely through Razorpay; we do not store card details</li>
            <li><strong>Communication Data:</strong> Email address for booking confirmations and service updates</li>
            <li><strong>Technical Data:</strong> IP address, browser type, and usage analytics for service improvement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">2. How We Use Your Information</h2>
          <p>Your data is used exclusively for:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Processing and confirming your car rental reservations</li>
            <li>Verifying driver eligibility and license validity</li>
            <li>Sending booking confirmations, receipts, and administrative communications</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Analyzing service usage to improve user experience</li>
            <li>Complying with legal obligations and fraud prevention</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">3. Data Storage &amp; Security</h2>
          <p className="mb-3">
            <strong>Storage:</strong> All personal data is stored on secure servers in India, protected by industry-standard encryption. Payment card information is never stored on our servers.
          </p>
          <p>
            <strong>Security Measures:</strong> We implement SSL/TLS encryption, regular security audits, and access controls to protect your data. Passwords are hashed using bcrypt with 12 salt rounds.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">4. Third-Party Services</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Google OAuth</h3>
              <p>We use Google for authentication. When you sign in with Google, we receive your name, email, and profile picture. Google may collect additional information per their own privacy policy.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Razorpay (Payment Processing)</h3>
              <p>Payments are processed by Razorpay. We do not store your card details. Razorpay&apos;s privacy policy governs their data practices.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Analytics</h3>
              <p>We use analytics to understand service usage. Data is aggregated and anonymized where possible.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">5. Your Rights (GDPR &amp; CCPA)</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate personal information</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at <a href="mailto:privacy@driveeasy.com" className="text-primary-600 hover:underline">privacy@driveeasy.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">6. Cookies &amp; Tracking</h2>
          <p className="mb-3">We use cookies for:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Essential Cookies:</strong> Authentication and session management</li>
            <li><strong>Preference Cookies:</strong> Remembering theme and language settings</li>
            <li><strong>Analytics Cookies:</strong> Understanding service usage patterns</li>
          </ul>
          <p className="mt-3">
            You may disable cookies in your browser settings, though this may affect service functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">7. Data Retention</h2>
          <p>
            We retain personal data for the duration of your account plus 3 years after closure, or as required for legal compliance. Booking records are maintained for 7 years for tax purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">8. California Privacy Rights (CCPA)</h2>
          <p>
            California residents have the right to know what personal information we collect and the right to request deletion. We do not sell personal information. Contact us for CCPA-related requests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">9. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for individuals under 18. We do not knowingly collect data from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">10. Policy Changes</h2>
          <p>
            We may update this policy. Changes are posted with an updated &quot;Last updated&quot; date. Significant changes will be notified via email or in-app notifications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">11. Contact Us</h2>
          <p>
            Questions? Contact us at <a href="mailto:privacy@driveeasy.com" className="text-primary-600 hover:underline">privacy@driveeasy.com</a> or write to our Data Protection Officer at the address provided in our website footer.
          </p>
        </section>
      </div>
    </div>
  );
}