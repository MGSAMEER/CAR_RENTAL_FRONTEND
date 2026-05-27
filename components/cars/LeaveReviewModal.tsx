'use client';

import { useState } from 'react';
import { carsApi } from '@/lib/services';
import StarRating from '../ui/StarRating';
import { X, MessageSquare, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeaveReviewModal({ carId, carName, onClose, onSuccess }: { carId: string, carName: string, onClose: () => void, onSuccess: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await carsApi.addReview(carId, { rating, comment });
      toast.success('Review submitted! Thank you.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary-600" /> Review {carName}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">How was your experience?</label>
            <div className="flex justify-center">
              <StarRating rating={rating} max={5} size={32} onChange={setRating} readOnly={false} />
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this car..."
              className="input resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Save size={16} /> {saving ? 'Submitting...' : 'Submit Review'}
            </button>
            <button onClick={onClose} disabled={saving} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
