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
    <div className="flex-shrink-0 w-96 px-4 h-48">
      <div className="home-glass-card flex h-full flex-col justify-between rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? "text-premium fill-amber-400"
                  : "text-muted-foreground fill-slate-600"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>

        {/* Review Text */}
        <p className="mb-6 line-clamp-4 flex-grow text-sm leading-relaxed text-[#405c6b]">
          «{testimonial.content}»
        </p>

        {/* User Info */}
        <div className="flex items-center gap-3 border-t border-[#214254]/10 pt-4/10">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-premium/20">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-[#112b3a]">
              {testimonial.name}
            </p>
            <p className="truncate text-xs text-[#637987]">
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
