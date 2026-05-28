'use client';

import { CheckCircle2, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PaymentSuccessScreenProps {
  transactionId: string;
  totalAmount?: number;
  currency?: string;
  carName?: string;
  startDate?: string;
  endDate?: string;
  onViewBooking: () => void;
  onClose: () => void;
}

export default function PaymentSuccessScreen({
  transactionId,
  totalAmount,
  currency = 'USD',
  carName,
  startDate,
  endDate,
  onViewBooking,
  onClose,
}: PaymentSuccessScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success content */}
        <div className="flex flex-col items-center px-6 pb-8 text-center space-y-6">
          {/* Checkmark animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl"></div>
            <CheckCircle2 size={64} className="text-green-500 relative animate-scale-in" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful! ✨
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your payment has been processed successfully.
            </p>
          </div>

          {/* Booking summary */}
          <div className="w-full bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-3 text-left">
            {carName && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Car</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {carName}
                </span>
              </div>
            )}

            {startDate && endDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Dates</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(startDate).toLocaleDateString()} -{' '}
                  {new Date(endDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {totalAmount !== undefined && (
              <div className="border-t border-gray-200 dark:border-slate-600 pt-3 flex justify-between text-sm font-semibold">
                <span className="text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-green-600 dark:text-green-400">
                  {currency} {totalAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-slate-600 pt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transaction ID
              </p>
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all mt-1">
                {transactionId}
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="w-full space-y-3 pt-4">
            <Button
              onClick={onViewBooking}
              variant="primary"
              fullWidth
            >
              View Your Booking
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              fullWidth
            >
              Continue Shopping
            </Button>
          </div>

          {/* Footer message */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
