"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Clock, Users, Video, ShoppingCart, Heart, ThumbsUp, ThumbsDown, Bookmark, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RatingStars from "@/components/utils/RatingStars";
import type { Course } from "@/lib/types/db";

type CourseWithCategory = Course & {
  category?: {
    id: string;
    slug: string;
    title: string;
    color?: string | null;
    icon?: string | null;
  } | null;
};

interface Props {
  course: CourseWithCategory;
  trigger: React.ReactNode;
}

export default function CourseDetailModal({ course, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  const [liked, setLiked] = useState<"LIKE" | "DISLIKE" | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const finalPrice = course.discountPercent
    ? Math.round(course.price * (1 - course.discountPercent / 100))
    : course.price;

  const courseLink =
    course.slug && course.category?.slug
      ? `/courses/${course.category.slug}/${course.slug}`
      : "/courses";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, type: "LIKE" }),
      });
      if (response.ok) {
        setLiked(liked === "LIKE" ? null : "LIKE");
      }
    } catch (error) {
      console.error("Error liking course:", error);
    }
    setIsLoading(false);
  };

  const handleDislike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, type: "DISLIKE" }),
      });
      if (response.ok) {
        setLiked(liked === "DISLIKE" ? null : "DISLIKE");
      }
    } catch (error) {
      console.error("Error disliking course:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (response.ok) {
        setSaved(!saved);
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
    setIsLoading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.subject,
          text: course.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: Copy to clipboard
      const shareUrl = `${window.location.origin}/courses/${course.slug || ''}`;
      const shareText = `${course.subject}\n${course.description}\n${shareUrl}`;
      try {
        await navigator.clipboard.writeText(shareText);
        alert("لینک کپی شد!");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full sm:w-[95vw] max-h-screen sm:max-h-[90vh] overflow-y-auto p-0 bg-gray-950 rounded-none sm:rounded-lg flex flex-col">
        {/* Header with Video Player */}
        <div className="relative w-full h-64 sm:h-80 bg-black flex items-center justify-center overflow-hidden flex-shrink-0 group">
          {/* Video or Image */}
          {course.introVideoUrl ? (
            <video
              src={course.introVideoUrl}
              poster={course.img || undefined}
              className="w-full h-full object-cover"
              controls={false}
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline={true}
            />
          ) : course.img ? (
            <Image
              src={course.img}
              alt={course.subject}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-mySecondary to-myPrimary flex items-center justify-center">
              <span className="text-6xl">🎓</span>
            </div>
          )}

          {/* Title Overlay - Bottom of Video */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-8 pb-4 px-4 sm:px-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white line-clamp-2">
              {course.subject}
            </h1>
            {course.category && (
              <span className="inline-block mt-2 bg-mySecondary/40 text-mySecondary px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                {course.category.title}
              </span>
            )}
          </div>

          {/* Frosted Glass Action Buttons Overlay - Top Right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isLoading}
              title="پسندیدم"
              className={`p-2 sm:p-2.5 rounded-lg font-medium transition flex items-center justify-center ${
                liked === "LIKE"
                  ? "bg-blue-600 text-white"
                  : "text-white hover:bg-white dark:bg-cardBg dark:bg-cardBg/20"
              }`}
            >
              <ThumbsUp size={18} />
            </button>

            {/* Dislike Button */}
            <button
              onClick={handleDislike}
              disabled={isLoading}
              title="نپسندیدم"
              className={`p-2 sm:p-2.5 rounded-lg font-medium transition flex items-center justify-center ${
                liked === "DISLIKE"
                  ? "bg-red-600 text-white"
                  : "text-white hover:bg-white dark:bg-cardBg dark:bg-cardBg/20"
              }`}
            >
              <ThumbsDown size={18} />
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isLoading}
              title="ذخیره"
              className={`p-2 sm:p-2.5 rounded-lg font-medium transition flex items-center justify-center ${
                saved
                  ? "bg-purple-600 text-white"
                  : "text-white hover:bg-white dark:bg-cardBg dark:bg-cardBg/20"
              }`}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              title="اشتراک"
              className="p-2 sm:p-2.5 rounded-lg font-medium text-white hover:bg-white dark:bg-cardBg transition flex items-center justify-center"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Discount Badge */}
          {course.discountPercent && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {course.discountPercent}% تخفیف
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          {/* Description & Rating */}
          <div className="mb-4 sm:mb-6">
            {course.rating && (
              <div className="flex items-center gap-2 mb-3">
                <RatingStars rating={course.rating} />
                <span className="text-xs sm:text-sm text-gray-400 dark:text-textSecondary">
                  ({course.rating.toFixed(1)})
                </span>
              </div>
            )}

            {course.description && (
              <p className="text-gray-400 dark:text-textSecondary text-sm sm:text-base">{course.description}</p>
            )}
          </div>

          {/* Course Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-800">
            {course.time && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock size={18} className="text-mySecondary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-textSecondary">مدت دوره</p>
                  <p className="font-bold text-sm sm:text-base text-white truncate">{course.time}</p>
                </div>
              </div>
            )}
            {course.students && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Users size={18} className="text-mySecondary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-textSecondary">دانشجویان</p>
                  <p className="font-bold text-sm sm:text-base text-white truncate">
                    {course.students.toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>
            )}
            {course.videosCount && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Video size={18} className="text-mySecondary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-textSecondary">تعداد ویدیو</p>
                  <p className="font-bold text-sm sm:text-base text-white">{course.videosCount}</p>
                </div>
              </div>
            )}
            {course.instructor && (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-2xl flex-shrink-0">👨‍🏫</span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-textSecondary">مدرس</p>
                  <p className="font-bold text-xs sm:text-sm text-white truncate">{course.instructor}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6 sm:mb-8">
            <div className="flex gap-3 sm:gap-4 border-b border-gray-800 mb-4 sm:mb-6 overflow-x-auto">
              {["about", "lessons", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-bold border-b-2 transition text-sm sm:text-base whitespace-nowrap ${
                    activeTab === tab
                      ? "border-mySecondary text-mySecondary"
                      : "border-transparent text-gray-400 dark:text-textSecondary hover:text-gray-300"
                  }`}
                >
                  {tab === "about" && "درباره"}
                  {tab === "lessons" && "درس‌ها"}
                  {tab === "reviews" && "نظرات"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[150px] sm:min-h-[200px]">
              {activeTab === "about" && (
                <div className="space-y-3 sm:space-y-4">
                  {course.description && (
                    <div>
                      <h3 className="font-bold text-base sm:text-lg mb-2 text-white">توضیحات</h3>
                      <p className="text-gray-400 dark:text-textSecondary leading-relaxed text-sm sm:text-base">
                        {course.description}
                      </p>
                    </div>
                  )}

                  {course.learningGoals && course.learningGoals.length > 0 && (
                    <div>
                      <h3 className="font-bold text-base sm:text-lg mb-2 text-white">اهداف یادگیری</h3>
                      <ul className="space-y-2">
                        {course.learningGoals.map((goal, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-mySecondary mt-1 flex-shrink-0">✓</span>
                            <span className="text-gray-400 dark:text-textSecondary text-sm sm:text-base">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "lessons" && (
                <div className="space-y-2">
                  <p className="text-gray-400 dark:text-textSecondary text-sm sm:text-base">
                    این دوره دارای {course.videosCount} درس است.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-textSecondary">
                    برای مشاهده درس‌ها صفحه کامل دوره را باز کنید.
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {course.rating && (
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-3xl sm:text-4xl font-bold text-white">
                          {course.rating.toFixed(1)}
                        </div>
                        <RatingStars rating={course.rating} />
                      </div>
                    </div>
                  )}
                  <p className="text-gray-400 dark:text-textSecondary text-xs sm:text-sm">
                    برای مشاهده تمام نظرات کاربران صفحه کامل دوره را باز کنید.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Price & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-800">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-mySecondary">
                  {formatPrice(finalPrice)}
                </span>
                {course.discountPercent && (
                  <span className="text-base sm:text-lg text-gray-600 dark:text-textSecondary line-through">
                    {formatPrice(course.price)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-lg transition flex-shrink-0 ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-400 dark:text-textSecondary hover:bg-gray-700 hover:text-gray-300"
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            <Link
              href={courseLink}
              className="flex-1 flex items-center justify-center gap-2 bg-mySecondary text-white px-4 sm:px-6 py-3 rounded-lg font-bold hover:opacity-90 transition text-sm sm:text-base"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              <span>مشاهده کامل</span>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
