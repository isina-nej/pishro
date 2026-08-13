"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Play,
  Star,
  Clock,
  Users,
  BookOpen,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import type { Course } from "@prisma/client";
import { useCartStore } from "@/stores/cart-store";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import BookmarkButton from "@/components/bookmarks/bookmarkButton";
import {
  enrollFreeCourse,
  isFreeCourse,
  redirectToLoginForFreeCourse,
} from "@/lib/free-course-enrollment";

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailsModal = ({
  course,
  isOpen,
  onClose,
}: CourseDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<"درباره" | "نقدها">("درباره");
  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);
  const { data: session } = useSession();

  if (!course) return null;

  const isInCart = items.some((item) => item.id === course.id);
  const freeCourse = isFreeCourse(course);

  const handleAddToCart = async () => {
    if (freeCourse) {
      if (!session?.user) {
        redirectToLoginForFreeCourse(course.id);
        return;
      }

      try {
        await enrollFreeCourse(course.id);
        toast.success(`«${course.subject}» به فهرست دوره‌های شما اضافه شد`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "خطا در ثبت‌نام دوره رایگان");
      }
      return;
    }

    if (isInCart) {
      toast.success("این دوره قبلاً به سبد خرید اضافه شده است");
      return;
    }
    addToCart(course as unknown as Parameters<typeof addToCart>[0]);
    toast.success(`«${course.subject}» به سبد خرید اضافه شد 🛒`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.subject,
          text: course.description ?? undefined,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-gradient-to-b from-card to-card text-foreground"
          >
            {/* Header with Image */}
            <div className="relative h-80 w-full overflow-hidden">
              {course.img && (
                <Image
                  src={course.img}
                  alt={course.subject}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-card dark:bg-cardBg p-2 backdrop-blur hover:bg-card"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card dark:bg-cardBg p-4 backdrop-blur hover:bg-card"
              >
                <Play className="h-8 w-8 fill-white" />
              </motion.button>

              {/* Course Title and Rating */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-4xl font-bold">{course.subject}</h1>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-premium" />
                    <span className="text-lg font-semibold">
                      {course.rating?.toFixed(1) || "0"}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">IMDB</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-b border-border/10 px-6 py-4">
              <div className="flex flex-wrap gap-3">
                <BookmarkButton
                  type="course"
                  itemId={course.id}
                  showLabel
                  className="rounded-lg border-border/40"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg bg-card px-4 py-2 font-medium text-mySecondary transition hover:bg-muted dark:bg-cardBg/10 dark:hover:bg-cardBg/20"
                >
                  <Share2 className="h-5 w-5" />
                  اشتراک‌گذاری
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition ${
                    isInCart
                      ? "bg-accent text-primary-foreground cursor-not-allowed"
                      : "bg-mySecondary text-foreground hover:shadow-lg"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {freeCourse ? "ثبت‌نام رایگان" : isInCart ? "در سبد خرید" : "خرید این دوره"}
                </motion.button>
              </div>
            </div>

            {/* Course Info Grid */}
            <div className="border-b border-border/10 px-6 py-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-card dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-muted-foreground">مدت</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <Clock className="h-4 w-4" />
                    {course.time}
                  </div>
                </div>

                <div className="rounded-lg bg-card dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-muted-foreground">سطح</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <BarChart3 className="h-4 w-4" />
                    {course.level || "نامشخص"}
                  </div>
                </div>

                <div className="rounded-lg bg-card dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-muted-foreground">دانشجویان</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-4 w-4" />
                    {course.students || 0}
                  </div>
                </div>

                <div className="rounded-lg bg-card dark:bg-cardBg p-3 backdrop-blur">
                  <div className="text-sm text-muted-foreground">ویدیوها</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                    <BookOpen className="h-4 w-4" />
                    {course.videosCount || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border/10 px-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("درباره")}
                  className={`border-b-2 py-4 font-medium transition ${
                    activeTab === "درباره"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  درباره
                </button>
                <button
                  onClick={() => setActiveTab("نقدها")}
                  className={`border-b-2 py-4 font-medium transition ${
                    activeTab === "نقدها"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  نقدها
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "درباره" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold">درباره این دوره</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">مدرس</div>
                      <div className="mt-1 font-semibold">{course.instructor || "نامشخص"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">زبان</div>
                      <div className="mt-1 font-semibold">
                        {course.language === "FA" ? "فارسی" : "انگلیسی"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">قیمت</div>
                      <div className="mt-1 font-semibold">
                        {freeCourse ? "رایگان" : `${course.price?.toLocaleString("fa-IR")} تومان`}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "نقدها" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-muted-foreground"
                >
                  <p>نقدی برای این دوره ثبت نشده است.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
