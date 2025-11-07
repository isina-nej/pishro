// @/components/home/homeContent.tsx
import LandingOverlay from "./landingOverlay";
import MobileScrollSection from "./mobileScrollSection";
import CalculatorSection from "./calculatorSection";
import Courses from "@/components/utils/CoursesSec.server";
import CommentsSlider from "@/components/utils/CommentsSlider";
import NewsClub from "./newsClub";
import { Suspense } from "react";
import { getTestimonials } from "@/lib/services/testimonial-service";

const HomePageContent = async () => {
  // دریافت testimonials از دیتابیس
  const testimonials = await getTestimonials({
    published: true,
    limit: 10, // محدود کردن به 10 نظر برتر
  });

  // Transform testimonials for CommentsSlider
  const comments = testimonials.map((t) => ({
    id: t.id,
    userName: t.userName,
    userAvatar: t.userAvatar || "/images/default-avatar.png",
    userRole: t.userRole || "کاربر",
    rating: t.rating,
    content: t.content,
    date: t.createdAt.toISOString(),
    verified: t.verified,
    likes: t.likes,
  }));

  return (
    <div className="w-full">
      <LandingOverlay />
      <MobileScrollSection />
      <CalculatorSection />
      <Courses />
      {comments.length > 0 && (
        <Suspense
          fallback={<div className="h-64 animate-pulse bg-white my-8" />}
        >
          <CommentsSlider
            comments={comments}
            title="نظرات دوره آموزان"
          />
        </Suspense>
      )}
      <NewsClub />
    </div>
  );
};

export default HomePageContent;
