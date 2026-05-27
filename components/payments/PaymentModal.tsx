'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentsApi, bookingsApi } from '@/lib/services';
import toast from 'react-hot-toast';
import { X, CreditCard } from 'lucide-react';
import { getStripePublishableKey } from '@/lib/env';

// Initialize Stripe outside of component to avoid recreating it
const stripePublishableKey = getStripePublishableKey();
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : Promise.resolve(null);

function CheckoutForm({ onSuccess, onCancel, paymentIntentId }: { onSuccess: (intentId: string) => void, onCancel: () => void, paymentIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/bookings',
      },
      redirect: 'if_required' // For SPA experience without redirecting if possible
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
      setIsLoading(false);
    } else {
      // Payment confirmed successfully - paymentIntent status should be processing or succeeded
      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        toast.success('Payment processing...');
        // Pass the confirmed payment intent ID to proceed with booking
        onSuccess(paymentIntent?.id || paymentIntentId);
      } else {
        toast.error(`Payment status: ${paymentIntent?.status}`);
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={isLoading || !stripe || !elements} className="btn-primary flex-1">
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
}

interface PaymentModalProps {
  carId: string;
  startDate: string;
  endDate: string;
  onClose: () => void;
  onSuccess: (intentId: string) => void;
}

export default function PaymentModal({ 
  carId, startDate, endDate, onClose, onSuccess 
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);

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
            const conflicts = selectedDates.filter(d => bookedDates.includes(d));
            if (conflicts.length > 0) {
              toast.error(`These dates are already booked: ${conflicts.slice(0, 3).join(', ')}${conflicts.length > 3 ? '...' : ''}`);
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

  // Only render Elements when we have a valid clientSecret
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard size={20} className="text-primary-600" /> Complete Payment
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500">
              <X size={18} />
            </button>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Preparing secure payment gateway...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return null; // Payment initialization failed, handled by onClose above
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={20} className="text-primary-600" /> Complete Payment
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: { theme: 'stripe' } 
            }}
          >
            <CheckoutForm onSuccess={onSuccess} onCancel={onClose} paymentIntentId={paymentIntentId} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
