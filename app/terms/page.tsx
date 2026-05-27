import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | DriveEasy',
  description: 'Terms and Conditions for using DriveEasy car rental services.',
};

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Terms & Conditions</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the DriveEasy platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">2. Eligibility</h2>
          <p>
            To rent a vehicle through DriveEasy, you must:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Be at least 21 years of age (age requirements may vary by vehicle type).</li>
            <li>Possess a valid, unexpired driver&apos;s license.</li>
            <li>Provide a valid credit card in your name for payment and security deposit.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">3. Booking and Payment</h2>
          <p>
            All bookings are subject to vehicle availability. Payment is required at the time of booking. By providing a payment method, you authorize DriveEasy to charge all applicable fees, including rental costs, insurance, and potential damages or late fees.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">4. Vehicle Use Rules</h2>
          <p>
            When renting a DriveEasy vehicle, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Use the vehicle for illegal purposes or off-road driving.</li>
            <li>Allow unauthorized drivers to operate the vehicle.</li>
            <li>Smoke or transport pets in the vehicle unless explicitly permitted.</li>
            <li>Drive while under the influence of alcohol or drugs.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            DriveEasy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>
      </div>
    </div>
  );
}
