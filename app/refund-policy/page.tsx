import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | DriveEasy',
  description: 'Understand our refund and cancellation policies for car rental bookings.',
};

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Refund & Cancellation Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">1. Cancellation by Customer</h2>
          <p>
            We understand that plans can change. Our cancellation policy is designed to be fair to both our customers and our platform:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>More than 48 hours before pickup:</strong> Full refund, minus any non-refundable payment processing fees.</li>
            <li><strong>24 to 48 hours before pickup:</strong> 50% refund of the total booking cost.</li>
            <li><strong>Less than 24 hours before pickup:</strong> No refund will be issued.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">2. No-Shows</h2>
          <p>
            If you fail to pick up the vehicle at the scheduled time without prior notice (a &quot;no-show&quot;), your booking will be cancelled and you will not be eligible for a refund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">3. Cancellation by DriveEasy</h2>
          <p>
            In the rare event that DriveEasy must cancel your booking due to unforeseen circumstances (e.g., vehicle breakdown, safety concerns), you will receive a full 100% refund, and we will do our best to assist you in finding an alternative vehicle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">4. Early Returns</h2>
          <p>
            If you return the vehicle earlier than your scheduled drop-off time, no refunds will be issued for the unused days or hours.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4">5. Refund Processing Time</h2>
          <p>
            Approved refunds will be processed to your original method of payment. Please allow 5-10 business days for the funds to appear in your account, depending on your bank&apos;s processing times.
          </p>
        </section>
      </div>
    </div>
  );
}
