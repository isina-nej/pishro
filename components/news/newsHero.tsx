"use client";

import { motion } from "framer-motion";
import { Newspaper, Star, Eye, TrendingUp } from "lucide-react";
import Image from "next/image";

interface NewsHeroProps {
  stats: {
    totalNews: number;
    featured: number;
    thisMonth: number;
    avgViews: number;
  };
}

const statsData = [
  {
    label: "خبر منتشر شده",
    value: "totalNews",
    icon: <Newspaper className="h-4 w-4" />,
  },
  {
    label: "اخبار ویژه",
    value: "featured",
    icon: <Star className="h-4 w-4" />,
  },
  {
    label: "انتشار این ماه",
    value: "thisMonth",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    label: "میانگین بازدید",
    value: "avgViews",
    icon: <Eye className="h-4 w-4" />,
  },
];

export const NewsHero = ({ stats }: NewsHeroProps) => {
  const getStatValue = (key: string) => {
    const value = stats[key as keyof typeof stats];
    return Number.isFinite(value) ? value : 0;
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-24 text-foreground sm:pb-24 sm:pt-28">
      <div className="absolute inset-0">
        <Image
          src="/images/news/header.jpg"
          alt="news-background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-background" />
      </div>

      <div className="container-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 max-w-2xl space-y-3 rounded-3xl border border-white/15 bg-black/35 p-5 text-white shadow-xl backdrop-blur-xl sm:mb-8 sm:p-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            اخبار و رویدادهای پیشرو
          </span>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            به‌روزترین مقالات
            <br />
            دنیای سرمایه‌گذاری
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            تازه‌ترین اخبار و تحلیل‌های بازار سرمایه — اسکرول کنید و ادامه مطالب را ببینید.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
        >
          {statsData.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/15 bg-black/35 px-3.5 py-3 text-white backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-lg font-bold tracking-tight sm:text-xl">
                  {getStatValue(item.value).toLocaleString("fa-IR")}
                </span>
                <span className="rounded-lg bg-white/10 p-1.5 text-white/90">
                  {item.icon}
                </span>
              </div>
              <span className="text-[11px] font-medium text-white/70">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
