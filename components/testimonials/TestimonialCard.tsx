import Image from "next/image";
import React from "react";

export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  company?: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialData;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="h-auto w-96 flex-shrink-0 self-stretch px-4">
      <div className="home-glass-card flex h-full min-h-48 flex-col justify-between rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
        {/* Star Rating */}
        <div className="mb-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating
                  ? "fill-premium text-premium"
                  : "fill-muted-foreground/40 text-muted-foreground/40"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>

        {/* Review Text — full comment, no clamp */}
        <p className="mb-6 flex-grow whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          «{testimonial.content}»
        </p>

        {/* User Info */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-premium/20">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {testimonial.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {testimonial.role}
              {testimonial.company && ` • ${testimonial.company}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
