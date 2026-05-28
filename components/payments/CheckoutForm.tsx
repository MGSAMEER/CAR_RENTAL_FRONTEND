'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface CheckoutFormProps {
  onSuccess: (intentId: string) => void;
  onCancel: () => void;
  paymentIntentId: string;
}

export default function CheckoutForm({
  onSuccess,
  onCancel,
  paymentIntentId,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/bookings',
        },
        redirect: 'if_required', // For SPA experience without redirecting if possible
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsLoading(false);
      } else {
        // Payment confirmed successfully - paymentIntent status should be processing or succeeded
        if (
          paymentIntent?.status === 'succeeded' ||
          paymentIntent?.status === 'processing'
        ) {
          toast.success('Payment processing...');
          // Pass the confirmed payment intent ID to proceed with booking
          onSuccess(paymentIntent?.id || paymentIntentId);
        } else {
          setErrorMessage(`Payment status: ${paymentIntent?.status}`);
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'An unexpected error occurred during payment'
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {errorMessage}
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="block mt-2 underline hover:opacity-70 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          isLoading={isLoading}
          variant="primary"
          fullWidth
        >
          {isLoading ? 'Processing Payment' : 'Pay Now'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          variant="secondary"
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
