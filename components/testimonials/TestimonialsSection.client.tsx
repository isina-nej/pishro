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
    <section className="relative w-full overflow-hidden py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-premium/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-4">
          <span className="mb-4 inline-flex rounded-full border border-[#214254]/10 bg-card/55 px-4 py-2 text-[11px] font-bold text-[#214254] backdrop-blur-xl/10/5">اعتماد ساخته‌شده با تجربه</span>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-[#112b3a] lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#637987]">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Container with Fade Effect */}
        <div className="relative w-full h-96 flex items-center">
          {/* Left Fade Mask */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-32 bg-gradient-to-r from-[#edf5f7] via-[#edf5f7]/80 to-transparent dark:from-[#081722] dark:via-[#081722]/80 lg:w-48" />

          {/* Right Fade Mask */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-32 bg-gradient-to-l from-[#edf5f7] via-[#edf5f7]/80 to-transparent dark:from-[#081722] dark:via-[#081722]/80 lg:w-48" />

          {/* Scrollable Track */}
          <div className="w-full overflow-hidden">
            <MarqueeTrack testimonials={testimonials} speed={speed} />
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium/20 to-transparent" />
      </div>
    </section>
  );
};

export default TestimonialsSectionClient;
