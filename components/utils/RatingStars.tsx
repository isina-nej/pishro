import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number; // 0 to 5, can be decimal (e.g., 3.5)
}

const RatingStars = ({ rating }: RatingStarsProps) => {
  return (
    <div className="flex gap-0 ltr">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        const isFull = starValue <= Math.floor(rating); // full star
        const isHalf = !isFull && starValue - rating <= 0.5; // half star

        return (
          <div key={i} className="relative w-4 h-4">
            {/* empty star (gray background) */}
            <Star
              className="absolute inset-0 text-gray-200 fill-gray-200"
              size={16}
            />

            {isFull && (
              // full star
              <Star
                className="absolute inset-0 text-yellow-400 fill-yellow-400"
                size={16}
              />
            )}

            {isHalf && (
              // half star (mask right side)
              <Star
                className="absolute inset-0 text-yellow-400 fill-yellow-400"
                size={16}
                style={{ clipPath: "inset(0 50% 0 0)" }} // show only left half
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RatingStars;
