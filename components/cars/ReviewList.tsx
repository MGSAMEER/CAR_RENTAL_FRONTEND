'use client';

import { useEffect, useState } from 'react';
import { carsApi } from '@/lib/services';
import type { Review } from '@/lib/types';
import StarRating from '../ui/StarRating';
import { format } from 'date-fns';
import { User, MessageSquare } from 'lucide-react';

export default function ReviewList({ carId }: { carId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carsApi.getReviews(carId)
      .then((res) => setReviews(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [carId]);

  if (loading) {
    return <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm animate-pulse">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 mt-6">
        <MessageSquare size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-slate-700 dark:text-slate-300 font-medium">No reviews yet</h3>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Be the first to review this car after booking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {reviews.map((review) => (
        <div key={review.id} className="pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold">
                {review.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
              </div>
              <div>
                 <p className="font-semibold text-slate-900 dark:text-white text-sm">{review.user?.name || 'Anonymous'}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{format(new Date(review.createdAt), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            <StarRating rating={review.rating} size={14} />
          </div>
          {review.comment && (
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2 pl-13">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
