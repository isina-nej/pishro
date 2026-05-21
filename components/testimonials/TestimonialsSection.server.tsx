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

/**
 * Server Component that fetches testimonials from database
 * and passes them to client component for rendering
 */
const TestimonialsSectionServer = async ({
  title = "نظرات و تجربیات کاربران",
  subtitle = "بهترین‌های بازار چرا ما را انتخاب می‌کنند",
  speed = 50,
  limit = 15,
}: TestimonialsSectionServerProps) => {
  try {
    // Fetch featured comments from database
    const comments = await getComments({
      published: true,
      verified: true,
      featured: true,
      limit,
    });

    // Transform comments to TestimonialData format
    const testimonials: TestimonialData[] = comments.map((comment) => ({
      id: comment.id,
      name: comment.userName || "کاربر ناشناس",
      role: comment.userRole || "کاربر",
      avatar: comment.userAvatar || "/images/default-avatar.png",
      content: comment.text || "",
      rating: Math.min(5, Math.max(1, Math.floor((comment.rating || 5) / 2))), // Convert to 1-5 scale
      company: comment.userCompany || undefined,
    }));

    // Return client component with data
    return (
      <TestimonialsSectionClient
        testimonials={testimonials}
        title={title}
        subtitle={subtitle}
        speed={speed}
      />
    );
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    // Fallback to empty state
    return (
      <TestimonialsSectionClient
        testimonials={[]}
        title={title}
        subtitle={subtitle}
        speed={speed}
      />
    );
  }
};

export default TestimonialsSectionServer;
