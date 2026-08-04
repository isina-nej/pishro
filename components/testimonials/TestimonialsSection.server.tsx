// @/components/testimonials/TestimonialsSection.server.tsx

import React from "react";
import TestimonialsSectionClient from "./TestimonialsSection.client";
import { TestimonialData } from "./TestimonialCard";
import { FALLBACK_TESTIMONIALS } from "./fallbackTestimonials";
import { getComments } from "@/lib/services/comment-service";

interface TestimonialsSectionServerProps {
  title?: string;
  subtitle?: string;
  speed?: number;
  limit?: number;
}

function mapComments(
  comments: Awaited<ReturnType<typeof getComments>>
): TestimonialData[] {
  return comments.map((comment) => ({
    id: comment.id,
    name: comment.userName || "کاربر ناشناس",
    role: comment.userRole || "کاربر",
    avatar: comment.userAvatar || "/images/default-avatar.png",
    content: comment.text || "",
    rating: Math.min(5, Math.max(1, Math.floor((comment.rating || 5) / 2))),
    company: comment.userCompany || undefined,
  }));
}

/**
 * Server Component that fetches testimonials from database
 * and passes them to client component for rendering.
 * Always renders the section — uses fallbacks if DB is empty
 * (e.g. after seed purge without re-seeding comments).
 */
const TestimonialsSectionServer = async ({
  title = "نظرات و تجربیات کاربران",
  subtitle = "بهترین‌های بازار چرا ما را انتخاب می‌کنند",
  speed = 50,
  limit = 15,
}: TestimonialsSectionServerProps) => {
  let testimonials: TestimonialData[] = [];

  try {
    const featured = await getComments({
      published: true,
      verified: true,
      featured: true,
      limit,
    });
    testimonials = mapComments(featured);

    if (testimonials.length === 0) {
      const published = await getComments({
        published: true,
        limit,
      });
      testimonials = mapComments(published);
    }
  } catch (error) {
    console.error("Error fetching testimonials:", error);
  }

  if (testimonials.length === 0) {
    testimonials = FALLBACK_TESTIMONIALS;
  }

  return (
    <TestimonialsSectionClient
      testimonials={testimonials}
      title={title}
      subtitle={subtitle}
      speed={speed}
    />
  );
};

export default TestimonialsSectionServer;
