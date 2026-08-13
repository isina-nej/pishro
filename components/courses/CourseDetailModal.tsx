"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
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
import CourseActionIcons from "@/components/courses/CourseActionIcons";
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

/** شیشه شفاف با شکست نور — متن با سایه دوتایی در لایت و دارک خوانا می‌ماند */
const glassPriceClass =
  "course-glass-price relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/55 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_36px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl backdrop-saturate-150 transition-transform sm:w-auto " +
  "bg-[linear-gradient(135deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.12)_28%,rgba(255,255,255,0.06)_48%,rgba(255,255,255,0.22)_72%,rgba(255,255,255,0.1)_100%)] " +
  "[text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_0_10px_rgba(0,0,0,0.35),0_0_1px_rgba(0,0,0,0.9)] " +
  "dark:border-white/40 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.06)_35%,rgba(255,255,255,0.14)_55%,rgba(255,255,255,0.05)_100%)]";

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
      <DialogContent className="flex max-h-screen w-full max-w-3xl flex-col overflow-hidden rounded-none border-border/40 bg-[#0C1410] p-0 text-foreground sm:max-h-[88vh] sm:w-[92vw] sm:rounded-[1.75rem] dark:bg-[#080E0A]">
        {/* Hero — فقط تصویر، بدون تیتر/توضیح/آیکن روی عکس */}
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

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25" />

          <div className="absolute start-4 top-4 z-10 flex items-center gap-2 sm:start-5 sm:top-5">
            {course.discountPercent ? (
              <span className="rounded-full bg-[#6B7F3C] px-3 py-1 text-xs font-bold text-white">
                {course.discountPercent}٪ تخفیف
              </span>
            ) : null}
          </div>

          {/* پایین تصویر: دسته‌ها + قیمت شیشه‌ای */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-12 sm:px-6 sm:pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
                          className="flex size-11 items-center justify-center rounded-2xl border border-white/35 bg-white/15 text-white shadow-lg backdrop-blur-xl"
                          style={{ boxShadow: `0 0 0 1px ${OLIVE}33` }}
                        >
                          <Icon size={18} strokeWidth={1.6} color="#C5D49A" />
                        </span>
                        <span className="max-w-[5.5rem] text-center text-[10px] font-medium leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] sm:text-[11px]">
                          {label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div />
              )}

              <motion.button
                type="button"
                data-sound="cart"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!freeCourse && isInCart}
                className={glassPriceClass}
              >
                {/* شکست نور متحرک */}
                <span
                  aria-hidden
                  className="course-glass-shine pointer-events-none absolute inset-y-[-40%] start-[-35%] w-[42%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),rgba(255,255,255,0.08),transparent)] opacity-80 mix-blend-screen"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_12%_0%,rgba(255,255,255,0.45),transparent_45%),radial-gradient(90%_70%_at_88%_100%,rgba(180,220,255,0.18),transparent_50%)]"
                />
                <ShoppingCart size={18} strokeWidth={1.75} className="relative z-[1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />
                <span className="relative z-[1] flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-medium text-white/95">
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
                  <span className="relative z-[1] text-xs text-white/70 line-through [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
                    {formatToman(course.price)}
                  </span>
                ) : null}
              </motion.button>
            </div>
          </div>
        </div>

        {/* آیکن اشتراک و بوکمارک — زیر تصویر */}
        <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-[#0C1410]/95 px-5 py-3 sm:px-7 dark:bg-[#080E0A]">
          <CourseActionIcons
            courseId={course.id}
            subject={course.subject}
            description={course.description}
            slug={course.slug}
            tone="on-media"
          />
          <h2 className="max-w-[70%] truncate text-end text-sm font-semibold text-white/90 sm:text-base">
            {course.subject}
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#0C1410] px-5 py-5 sm:px-7 sm:py-6 dark:bg-[#080E0A]">
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
