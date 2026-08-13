"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Share2,
  BarChart3,
  Target,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RatingStars from "@/components/utils/RatingStars";
import BookmarkButton from "@/components/bookmarks/bookmarkButton";
import { useCartStore } from "@/stores/cart-store";
import toast from "react-hot-toast";
import type { Course } from "@/lib/types/db";
import { useSession } from "next-auth/react";
import {
  enrollFreeCourse,
  isFreeCourse,
  redirectToLoginForFreeCourse,
} from "@/lib/free-course-enrollment";

type CourseData = Course | (Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
});

type CourseWithCategory = CourseData & {
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

const OLIVE = "#6B7F3C";

const CHIP_ICONS = [BarChart3, Target, TrendingUp, Lightbulb, BookOpen, Sparkles];

function formatToman(price: number) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(price));
}

export default function CourseDetailModal({ course, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);
  const { data: session } = useSession();

  const finalPrice = course.discountPercent
    ? Math.round(course.price * (1 - course.discountPercent / 100))
    : course.price;
  const freeCourse = isFreeCourse(course);
  const isInCart = items.some((item) => item.id === course.id);

  const categoryChips = [
    ...(course.category?.title ? [course.category.title] : []),
    ...((course.learningGoals as string[] | undefined) ?? []).slice(0, 3),
  ].slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.subject,
          text: course.description ?? undefined,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${course.subject}\n${window.location.origin}/courses/${course.slug || ""}`
        );
        toast.success("لینک کپی شد");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

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
        toast.error(
          error instanceof Error ? error.message : "خطا در ثبت‌نام دوره رایگان"
        );
      }
      return;
    }

    if (isInCart) {
      toast.success("این دوره قبلاً به سبد خرید اضافه شده است");
      return;
    }
    addToCart(course);
    toast.success(`«${course.subject}» به سبد خرید اضافه شد 🛒`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-screen w-full max-w-3xl flex-col overflow-hidden rounded-none border-border/40 bg-[#0C0F0D] p-0 text-foreground sm:max-h-[88vh] sm:w-[92vw] sm:rounded-[1.75rem]">
        {/* Hero */}
        <div className="relative h-72 flex-shrink-0 overflow-hidden sm:h-80">
          {course.introVideoUrl ? (
            <video
              src={course.introVideoUrl}
              poster={course.img || undefined}
              className="h-full w-full object-cover"
              controls={false}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : course.img ? (
            <Image
              src={course.img}
              alt={course.subject}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a2218] to-[#0C0F0D]">
              <span className="text-6xl">🎓</span>
            </div>
          )}

          {/* Soft vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

          {/* Top actions on image */}
          <div className="absolute start-4 top-4 z-10 flex items-center gap-2 sm:start-5 sm:top-5">
            {course.discountPercent ? (
              <span className="rounded-full bg-[#6B7F3C] px-3 py-1 text-xs font-bold text-white">
                {course.discountPercent}٪ تخفیف
              </span>
            ) : null}
          </div>

          <div className="absolute end-4 top-4 z-10 flex items-center gap-2 sm:end-5 sm:top-5">
            <BookmarkButton
              type="course"
              itemId={course.id}
              className="size-10 border-white/20 bg-white/12 text-white backdrop-blur-xl hover:text-white data-[active]:bg-[#6B7F3C]/90 [[aria-pressed=true]]:border-[#6B7F3C]/50 [[aria-pressed=true]]:bg-[#6B7F3C]/90 [[aria-pressed=true]]:text-white"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleShare}
              title="اشتراک"
              className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-xl"
            >
              <Share2 size={17} strokeWidth={1.75} />
            </motion.button>
          </div>

          {/* Bottom hero content */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-16 sm:px-6 sm:pb-5">
            <h1 className="max-w-[90%] text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {course.subject}
            </h1>
            {course.description ? (
              <p className="mt-1.5 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/70">
                {course.description}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Categories — clearer, spaced, animated (جای قبلی سبد) */}
              {categoryChips.length > 0 ? (
                <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2.5 sm:gap-x-4">
                  {categoryChips.map((label, idx) => {
                    const Icon = CHIP_ICONS[idx % CHIP_ICONS.length];
                    return (
                      <motion.div
                        key={`${label}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.08 * idx,
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -3, scale: 1.04 }}
                        className="flex min-w-[4.5rem] flex-col items-center gap-1.5"
                      >
                        <span
                          className="flex size-11 items-center justify-center rounded-2xl border border-white/20 bg-white/12 text-white shadow-lg backdrop-blur-xl"
                          style={{ boxShadow: `0 0 0 1px ${OLIVE}33` }}
                        >
                          <Icon size={18} strokeWidth={1.6} color="#C5D49A" />
                        </span>
                        <span className="max-w-[5.5rem] text-center text-[10px] font-medium leading-snug text-white/85 sm:text-[11px]">
                          {label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div />
              )}

              {/* Glass cart + price — سمت دیگر تصویر */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!freeCourse && isInCart}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/25 bg-white/15 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-transform sm:w-auto"
              >
                <ShoppingCart size={18} strokeWidth={1.75} />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-medium text-white/70">
                    {freeCourse
                      ? "ثبت‌نام رایگان"
                      : isInCart
                        ? "به سبد اضافه شد"
                        : "افزودن به سبد"}
                  </span>
                  <span className="text-base font-bold tracking-tight">
                    {freeCourse ? "رایگان" : `${formatToman(finalPrice)} تومان`}
                  </span>
                </span>
                {course.discountPercent && !freeCourse ? (
                  <span className="text-xs text-white/45 line-through">
                    {formatToman(course.price)}
                  </span>
                ) : null}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {course.rating ? (
            <div className="mb-4 flex items-center gap-2">
              <RatingStars rating={course.rating} />
              <span className="text-xs text-muted-foreground">
                ({course.rating.toFixed(1)})
              </span>
            </div>
          ) : null}

          {/* Tabs */}
          <div className="mb-5 flex gap-1 rounded-full bg-white/[0.04] p-1">
            {(
              [
                ["about", "درباره"],
                ["lessons", "درس‌ها"],
                ["reviews", "نظرات"],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-transform duration-300 ${
                  activeTab === tab
                    ? "bg-[#6B7F3C] text-white shadow-sm"
                    : "text-white/55 hover:scale-[1.02] hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="min-h-[140px]">
            {activeTab === "about" && (
              <div className="space-y-4">
                {course.description ? (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-white/90">
                      توضیحات
                    </h3>
                    <p className="text-sm leading-7 text-white/60">
                      {course.description}
                    </p>
                  </div>
                ) : null}

                {course.learningGoals && course.learningGoals.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-white/90">
                      اهداف یادگیری
                    </h3>
                    <ul className="space-y-2">
                      {course.learningGoals.map((goal, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-white/60"
                        >
                          <span className="mt-1 text-[#6B7F3C]">✓</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            {activeTab === "lessons" && (
              <p className="text-sm leading-7 text-white/60">
                این دوره دارای {course.videosCount ?? "چند"} درس است. برای مشاهده
                کامل درس‌ها صفحه دوره را باز کنید.
              </p>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-3">
                {course.rating ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-semibold text-white">
                      {course.rating.toFixed(1)}
                    </span>
                    <RatingStars rating={course.rating} />
                  </div>
                ) : null}
                <p className="text-sm text-white/55">
                  برای مشاهده تمام نظرات، صفحه کامل دوره را باز کنید.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
