/**
 * CommentsSlider Component
 *
 * A responsive, auto-playing Swiper-based carousel component for displaying
 * user comments and testimonials on the landing/home page.
 *
 * Features:
 * - Autoplay: Automatically advances slides every 4 seconds
 * - Infinite Loop: Seamlessly loops back to the first slide
 * - Responsive: 1 slide on mobile (< 640px), 2 on tablet (640-1024px), 3 on desktop (> 1024px)
 * - Navigation: Previous/Next buttons with arrow icons for manual navigation
 * - Pagination: Clickable dots at the bottom to jump to any slide
 * - Accessibility: Full keyboard navigation support and ARIA labels
 * - Theming: Supports light/dark mode with Tailwind CSS
 * - Touch Friendly: Swipe support on mobile devices
 *
 * Usage:
 * ```tsx
 * import CommentsSlider from "@/components/utils/CommentsSlider";
 *
 * const comments = [
 *   {
 *     id: "1",
 *     userName: "علی احمدی",
 *     userAvatar: "/images/avatar.jpg",
 *     userRole: "دانشجو",
 *     rating: 5,
 *     content: "دوره خیلی عالی بود!",
 *     date: "2024-01-15",
 *     verified: true,
 *     likes: 42,
 *   },
 * ];
 *
 * <CommentsSlider comments={comments} title="نظرات دوره آموزان" />
 * ```
 *
 * Props:
 * - comments: Comment[] - Array of comment objects to display
 * - title: string - Optional title for the slider (default: "نظرات دوره آموزان")
 *
 * Data Persistence:
 * Comments are seeded from the database and marked as featured=true to ensure
 * they persist through seed operations and appear on the landing page.
 */

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import Image from "next/image";
import { useState, useRef } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import RatingStars from "./RatingStars";
import LikeDislike from "./LikeDislike";
import { formatDate } from "@/lib/utils";

/**
 * Comment data structure for the slider
 * All fields are required for proper rendering
 */
type Comment = {
  id: string; // Unique comment identifier
  userName: string; // Name of the commenter
  userAvatar: string; // Avatar image URL
  userRole: string; // Role of the user (e.g., "دانشجو", "تاجر")
  rating: number; // Star rating (0-5)
  content: string; // Comment text content
  date: string; // ISO date string of comment creation
  verified: boolean; // Whether the comment is verified
  likes: number; // Number of likes on the comment
};

/**
 * Props for the CommentsSlider component
 */
interface CommentSliderProps {
  comments: Comment[]; // Array of comments to display in the slider
  title?: string; // Optional title for the slider section
}

const CommentsSlider = ({
  comments,
  title = "نظرات دوره آموزان",
}: CommentSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <section
      className="container-xl flex items-center justify-center mt-20 sm:mt-24 md:mt-28 lg:mt-32"
      aria-label="نظرات کاربران"
    >
      <div className="relative w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center">
          {title}
        </h2>

        <div className="relative">
          {/* Swiper carousel with all required features */}
          <Swiper
            ref={swiperRef}
            id="comments-slider"
            // Core modules
            modules={[Autoplay, Pagination, Navigation, A11y]}
            // Layout
            className="!px-2"
            centeredSlides={true}
            slidesPerView={3}
            spaceBetween={0}
            // Autoplay: 4000ms (4 seconds) as per specification
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            // Infinite loop: after last slide, go back to first
            loop={true}
            // Pagination dots at the bottom
            pagination={{
              clickable: true,
              el: ".custom-pagination-opinion",
            }}
            // Navigation arrows (prev/next buttons)
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            // Responsive breakpoints:
            // - Mobile (< 640px): 1 slide
            // - Tablet (640-1024px): 2 slides
            // - Desktop (> 1024px): 3 slides
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {comments.map((comment, idx) => {
              const isActive = idx === activeIndex;
              return (
                <SwiperSlide
                  key={comment.id}
                  className={`px-1.5 sm:px-2.5 py-4 sm:py-6 !overflow-visible transition-transform duration-500 ease-in-out ${
                    isActive
                      ? "!scale-105 sm:!scale-110 z-10"
                      : "!scale-95 sm:!scale-90 opacity-90"
                  }`}
                >
                  <div className="bg-white dark:bg-cardBg rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-borderColor py-5 md:py-8 px-3 md:px-5 flex flex-col items-center justify-between text-center h-[220px] sm:h-[230px] md:h-[255px]">
                    <p className="text-[#8E8E8E] text-right text-[11px] sm:text-xs leading-5 font-bold mb-2 md:mb-4">
                      {comment.content}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center justify-start w-full">
                        <Image
                          src={comment.userAvatar}
                          alt={comment.userName}
                          width={48}
                          height={48}
                          className="rounded-full ml-2"
                        />
                        <div>
                          <p className="font-bold text-[#353535] text-xs sm:text-base">
                            {comment.userRole}
                          </p>
                          <p className="text-[11px] sm:text-xs font-bold text-[#8e8e8e]">
                            {formatDate(comment.date)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <RatingStars rating={comment.rating || 3} />
                        <LikeDislike likes={comment.likes} />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}

            <div className="custom-pagination-opinion h-3 flex justify-center gap-0.5 sm:gap-1.5 mt-4 md:mt-6"></div>
          </Swiper>
        </div>

        {/* پیکان‌ها */}
        <button
          className="swiper-button-prev absolute top-0 lg:top-12 right-0 sm:right-4 md:right-8 hidden sm:flex items-center justify-center z-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          aria-label="اسلاید قبلی"
        >
          <div className="relative w-[80px] sm:w-[120px] md:w-[180px] h-[45px] sm:h-[65px] md:h-[100px]">
            <Image
              src={"/icons/circle-arrow-left.svg"}
              alt="پیکان چپ"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 768px) 120px, 180px"
            />
          </div>
        </button>
        <button
          className="swiper-button-next absolute -bottom-2 sm:-bottom-6 md:-bottom-10 left-0 sm:left-4 md:left-8 hidden sm:flex items-center justify-center z-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          aria-label="اسلاید بعدی"
        >
          <div className="relative w-[80px] sm:w-[120px] md:w-[180px] h-[45px] sm:h-[65px] md:h-[100px]">
            <Image
              src={"/icons/circle-arrow-right.svg"}
              alt="پیکان راست"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 768px) 120px, 180px"
            />
          </div>
        </button>
      </div>
    </section>
  );
};

export default CommentsSlider;
