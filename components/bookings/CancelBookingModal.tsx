'use client';

import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CancelBookingModalProps {
  bookingId: string;
  carName: string;
  startDate: string;
  totalCost: number;
  onCancel: (bookingId: string, reason?: string) => Promise<void>;
  onClose: () => void;
}

export default function CancelBookingModal({ 
  bookingId, 
  carName, 
  startDate, 
  totalCost, 
  onCancel, 
  onClose 
}: CancelBookingModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      await onCancel(bookingId, reason || undefined);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate refund info for display
  const start = new Date(startDate);
  const now = new Date();
  const hoursBeforeStart = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  let refundPercent = 0;
  if (hoursBeforeStart > 24) {
    refundPercent = 100;
  } else if (hoursBeforeStart >= 6) {
    refundPercent = 50;
  }
  
  const refundAmount = (totalCost * refundPercent / 100).toFixed(0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cancel Booking</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">Cancellation Policy</p>
              <ul className="space-y-1 text-xs">
                <li>• &gt;24 hours before start: 100% refund</li>
                <li>• 6–24 hours before start: 50% refund</li>
                <li>• &lt;6 hours before start: No refund</li>
              </ul>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Car: <strong>{carName}</strong></p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Refund: ₹{refundAmount} ({refundPercent}%)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Reason for cancellation (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let us know why you're cancelling..."
              className="input resize-none"
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={handleCancel} 
              disabled={isSubmitting} 
              isLoading={isSubmitting}
              variant="danger"
            >
              Cancel Booking
            </Button>
            <Button onClick={onClose} variant="secondary">Keep Booking</Button>
          </div>
        </div>
      </div>
    </div>
  );
}