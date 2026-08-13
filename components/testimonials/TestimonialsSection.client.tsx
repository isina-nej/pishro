"use client";

import React from "react";
import MarqueeTrack from "./MarqueeTrack";
import { TestimonialData } from "./TestimonialCard";

const COMMENTS_BG = "/images/home/comments-bg.webp";

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
  // Section must stay on the page even if the list is temporarily empty
  const items = testimonials.length > 0 ? testimonials : [];

  return (
    <section
      id="home-comments"
      className="relative isolate w-full overflow-hidden py-20 lg:py-32"
      aria-label={title}
    >
      {/* Fixed photo background — stays put while the section scrolls */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-[length:88%_auto] sm:bg-[length:75%_auto] md:bg-cover md:bg-center lg:supports-[background-attachment:fixed]:bg-fixed"
          style={{ backgroundImage: `url('${COMMENTS_BG}')` }}
        />
        {/* Readability wash over the photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--home-bg,#F7F5F0)]/78 via-[var(--home-bg,#F7F5F0)]/62 to-[var(--home-bg,#F7F5F0)]/80 dark:from-black/70 dark:via-black/55 dark:to-black/75" />
        <div className="absolute inset-0 bg-[var(--home-deep,#0B3D2E)]/10 dark:bg-transparent" />
      </div>

      <div className="relative z-10">
        <div className="mb-16 px-4 text-center">
          <span className="mb-4 inline-flex rounded-full border border-primary/25 bg-card/75 px-4 py-2 text-[11px] font-bold text-primary backdrop-blur-xl">
            اعتماد ساخته‌شده با تجربه
          </span>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-foreground drop-shadow-sm lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="relative flex min-h-96 w-full items-stretch py-2">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-24 bg-gradient-to-r from-[var(--home-bg,#F7F5F0)]/90 via-[var(--home-bg,#F7F5F0)]/40 to-transparent dark:from-black/70 dark:via-black/30 lg:w-40" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-24 bg-gradient-to-l from-[var(--home-bg,#F7F5F0)]/90 via-[var(--home-bg,#F7F5F0)]/40 to-transparent dark:from-black/70 dark:via-black/30 lg:w-40" />

          <div className="w-full overflow-x-hidden overflow-y-visible">
            {items.length > 0 ? (
              <MarqueeTrack testimonials={items} speed={speed} />
            ) : (
              <p className="px-4 text-center text-sm text-muted-foreground">
                به‌زودی نظرات کاربران اینجا نمایش داده می‌شود.
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium/25 to-transparent" />
      </div>
    </section>
  );
};

export default TestimonialsSectionClient;
