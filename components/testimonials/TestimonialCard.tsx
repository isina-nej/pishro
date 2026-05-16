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
    <div className="flex-shrink-0 w-96 px-4 h-80">
      <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-600 fill-slate-600"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>

        {/* Review Text */}
        <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow line-clamp-4">
          "{testimonial.content}"
        </p>

        {/* User Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-400/20">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-100 font-semibold text-sm truncate">
              {testimonial.name}
            </p>
            <p className="text-slate-400 text-xs truncate">
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
