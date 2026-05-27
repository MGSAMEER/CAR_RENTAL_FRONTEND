'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

export default function StarRating({ rating, max = 5, size = 16, onChange, readOnly = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(starValue)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-all`}
          >
            <Star
              size={size}
              className={starValue <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        );
      })}
    </div>
  );
}
