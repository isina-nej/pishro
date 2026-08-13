"use client";

import { motion } from "framer-motion";
import { BookOpen, Bookmark, Clock, Star } from "lucide-react";
import Image from "next/image";

interface LibraryHeroProps {
  stats: {
    totalBooks: number;
    highlighted: number;
    newReleases: number;
    avgRating: number;
  };
}

export const LibraryHero = ({ stats }: LibraryHeroProps) => {
  return (
    <section className="relative overflow-hidden pb-32 pt-36 text-foreground">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/library/landing.jpg"
          alt="library-background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
      </div>

      <div className="container-xl relative z-10 flex flex-col gap-10">
        <div className="max-w-3xl space-y-6 rounded-[2rem] border border-white/20 bg-black/40 p-7 shadow-2xl shadow-black/30 sm:p-9">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-sm font-medium text-white">
            کتابخانه الهام‌بخش پیشرو
          </span>
          <h1 className="text-4xl font-extrabold !leading-tight text-white md:text-5xl">
            دنیای کتاب‌هایی که ذهنیت سرمایه‌گذاران آینده را می‌سازند
          </h1>
          <p className="text-base text-white/80 md:text-lg">
            مجموعه‌ای منتخب از کتاب‌های داستانی و تخصصی که با دقت توسط تیم
            محتوای پیشرو انتخاب شده‌اند تا شما را در مسیر رشد شخصی، حرفه‌ای و
            خلاقانه همراهی کنند.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "کتاب در دسترس",
              value: stats.totalBooks,
              icon: <BookOpen className="h-5 w-5" />,
            },
            {
              label: "منتخب تحریریه",
              value: stats.highlighted,
              icon: <Bookmark className="h-5 w-5" />,
            },
            {
              label: "انتشار سال جاری",
              value: stats.newReleases,
              icon: <Clock className="h-5 w-5" />,
            },
            {
              label: "میانگین امتیاز",
              value: Number(stats.avgRating || 0).toFixed(1),
              icon: <Star className="h-5 w-5" />,
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 rounded-2xl border border-white/20 bg-black/40 px-5 py-4 text-white shadow-lg shadow-black/20"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{item.value}</span>
                <span className="text-sm text-white/75">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
