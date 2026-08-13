"use client";

import React, { useState } from "react";
import TestimonialCard, { TestimonialData } from "./TestimonialCard";

interface MarqueeTrackProps {
  testimonials: TestimonialData[];
  speed?: number; // Duration in seconds for one full scroll
  pauseOnHover?: boolean;
}

const MarqueeTrack: React.FC<MarqueeTrackProps> = ({
  testimonials,
  speed = 100,
  pauseOnHover = true,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  // Need TRIPLE duplication for true seamless loop
  // When we reach end of 2nd set, 3rd set is identical to 1st - instant reset without visible jump
  const tripleTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Calculate card width including gap
  // Card: w-96 (384px) + px-4 (internal padding - 0) + gap-6 (24px) = 408px total per card
  const cardWidth = 408;
  const scrollDistance = testimonials.length * cardWidth;

  // CSS animation style - seamless loop with no pause
  // Animates smoothly from 0% to 100%, then resets instantly when it loops
  const animationStyle = `
    @keyframes scroll {
      0% {
        transform: translateX(calc(${scrollDistance * 2}px));
      }
      100% {
        transform: translateX(0);
      }
    }
    
    .marquee-track {
      animation: scroll ${speed}s linear infinite;
      animation-play-state: ${isPaused ? "paused" : "running"};
      will-change: transform;
    }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <div
        className="marquee-track flex items-stretch gap-6"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        {tripleTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${Math.floor(index / testimonials.length)}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </>
  );
};

export default MarqueeTrack;
