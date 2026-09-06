// @/components/testimonials/TestimonialsSection.server.tsx

import React from "react";
import TestimonialsSectionClient from "./TestimonialsSection.client";
import { TestimonialData } from "./TestimonialCard";
import { getComments } from "@/lib/services/comment-service";

interface TestimonialsSectionServerProps {
  title?: string;
  subtitle?: string;
  speed?: number;
  limit?: number;
}

function starsFromRating(rating?: number | null) {
  const value = rating ?? 5;
  // Legacy seeds used 1–10; admin UI stores 1–5
  const normalized = value > 5 ? Math.floor(value / 2) : value;
  return Math.min(5, Math.max(1, normalized));
}

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "دانشجو",
  PROFESSIONAL_TRADER: "معامله‌گر حرفه‌ای",
  INVESTOR: "سرمایه‌گذار",
};

function mapComments(
  comments: Awaited<ReturnType<typeof getComments>>
): TestimonialData[] {
  return comments.map((comment) => ({
    id: comment.id,
    name: comment.userName || "کاربر ناشناس",
    role: ROLE_LABELS[comment.userRole ?? ""] || comment.userCompany || "کاربر",
    avatar: comment.userAvatar || "/images/home/comments-prf/1.jpg",
    content: comment.text || "",
    rating: starsFromRating(comment.rating),
    company: comment.userCompany || undefined,
  }));
}

/**
 * Fetches featured (then published) comments for the home marquee.
 * No fake/seed fallbacks — empty list shows an empty-state UI.
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
