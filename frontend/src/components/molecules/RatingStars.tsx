import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
}

export function RatingStars({ rating }: RatingStarsProps) {
  return (
    <div className="flex gap-1 text-amber-400">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;

        return (
          <Star
            key={`${rating}-${index}`}
            size={14}
            fill={filled ? 'currentColor' : 'none'}
          />
        );
      })}
    </div>
  );
}
