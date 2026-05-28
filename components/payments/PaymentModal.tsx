'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { paymentsApi, bookingsApi } from '@/lib/services';
import toast from 'react-hot-toast';
import { X, CreditCard, Loader } from 'lucide-react';
import { getStripePublishableKey } from '@/lib/env';
import CheckoutForm from './CheckoutForm';
import PaymentSuccessScreen from './PaymentSuccessScreen';

// Initialize Stripe outside of component to avoid recreating it
const stripePublishableKey = getStripePublishableKey();
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : Promise.resolve(null);

interface PaymentModalProps {
  carId: string;
  startDate: string;
  endDate: string;
  onClose: () => void;
  onSuccess: (intentId: string) => void;
  carName?: string;
  totalAmount?: number;
  currency?: string;
}

export default function PaymentModal({
  carId,
  startDate,
  endDate,
  onClose,
  onSuccess,
  carName,
  totalAmount,
  currency = 'USD',
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        if (!stripePublishableKey) {
          toast.error('Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.');
          onClose();
          return;
        }

        // ✅ VALIDATION: Check booked dates BEFORE creating payment intent
        try {
          const bookedDatesRes = await bookingsApi.getBookedDates(carId);
          const bookedDates = bookedDatesRes.data.data?.individualDates || [];

          if (bookedDates.length > 0) {
            // Check if selected dates conflict with booked dates
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Generate all dates in selected range
            const selectedDates: string[] = [];
            const current = new Date(start);
            while (current <= end) {
              selectedDates.push(current.toISOString().split('T')[0]);
              current.setDate(current.getDate() + 1);
            }

            // Find conflicts
            const conflicts = selectedDates.filter((d) => bookedDates.includes(d));
            if (conflicts.length > 0) {
              toast.error(
                `These dates are already booked: ${conflicts.slice(0, 3).join(', ')}${conflicts.length > 3 ? '...' : ''}`
              );
              onClose();
              return;
            }
          }
        } catch (err) {
          // If we can't fetch booked dates, still proceed (backend will catch conflicts)
          console.warn('Could not fetch booked dates:', err);
        }

        // Proceed with payment intent creation
        const res = await paymentsApi.createIntent({ carId, startDate, endDate });
        const { clientSecret: secret, paymentIntentId: intentId } = res.data.data || {};

        if (secret && intentId) {
          setClientSecret(secret);
          setPaymentIntentId(intentId);
        } else {
          toast.error('Failed to initialize payment - missing data');
          onClose();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to initialize payment');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [carId, startDate, endDate, onClose]);

  const handlePaymentSuccess = (intentId: string) => {
    setIsProcessing(true);
    setShowSuccess(true);
    // Keep processing state for a moment to show the success screen
    setTimeout(() => {
      onSuccess(intentId);
    }, 2000);
  };

  // Show success screen
  if (showSuccess) {
    return (
      <PaymentSuccessScreen
        transactionId={paymentIntentId}
        totalAmount={totalAmount}
        currency={currency}
        carName={carName}
        startDate={startDate}
        endDate={endDate}
        onViewBooking={() => onSuccess(paymentIntentId)}
        onClose={onClose}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" /> Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-gray-500"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Preparing secure payment gateway...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show payment form or full-screen loader during processing
  return (
    <>
      {/* Full-screen processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <Loader size={48} className="text-white animate-spin" />
            <p className="text-white text-lg font-semibold">Processing your payment...</p>
            <p className="text-white/70 text-sm">Please do not close this window</p>
          </div>
        </div>
      )}

      {/* Payment modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" /> Complete Payment
            </h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {!clientSecret ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Failed to load payment form
              </p>
            ) : (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: 'stripe' },
                }}
              >
                <CheckoutForm
                  onSuccess={handlePaymentSuccess}
                  onCancel={onClose}
                  paymentIntentId={paymentIntentId}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
