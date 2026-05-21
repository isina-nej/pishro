"use client";

import React from "react";
import MarqueeTrack from "./MarqueeTrack";
import { TestimonialData } from "./TestimonialCard";

interface TestimonialsSectionClientProps {
  title?: string;
  subtitle?: string;
  testimonials: TestimonialData[];
  speed?: number;
}

const TestimonialsSectionClient: React.FC<TestimonialsSectionClientProps> = ({
  title = "نظرات و تجربیات کاربران",
  subtitle = "بهترین‌های بازار چرا ما را انتخاب می‌کنند",
  testimonials = [],
  speed = 50,
}) => {
  // If no testimonials, show empty state
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-20 lg:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Container with Fade Effect */}
        <div className="relative w-full h-96 flex items-center">
          {/* Left Fade Mask */}
          <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

          {/* Right Fade Mask */}
          <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

          {/* Scrollable Track */}
          <div className="w-full overflow-hidden">
            <MarqueeTrack testimonials={testimonials} speed={speed} />
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>
    </section>
  );
};

export default TestimonialsSectionClient;
