"use client";

import { motion } from "framer-motion";
import { Newspaper, Star, Eye, TrendingUp } from "lucide-react";
import Image from "next/image";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import { DynamicIcon } from "@/components/site/DynamicIcon";

interface NewsHeroProps {
  stats: {
    totalNews: number;
    featured: number;
    thisMonth: number;
    avgViews: number;
  };
}

export const NewsHero = ({ stats }: NewsHeroProps) => {
  const copy = usePublicCopy("news");

  const statsData = [
    {
      label: copy("hero.stat1", "خبر منتشر شده"),
      value: "totalNews",
      iconName: copy("hero.stat1Icon", "FileText"),
      fallback: Newspaper,
    },
    {
      label: copy("hero.stat2", "اخبار ویژه"),
      value: "featured",
      iconName: copy("hero.stat2Icon", "Star"),
      fallback: Star,
    },
    {
      label: copy("hero.stat3", "انتشار این ماه"),
      value: "thisMonth",
      iconName: copy("hero.stat3Icon", "TrendingUp"),
      fallback: TrendingUp,
    },
    {
      label: copy("hero.stat4", "میانگین بازدید"),
      value: "avgViews",
      iconName: copy("hero.stat4Icon", "Eye"),
      fallback: Eye,
    },
  ];

  const getStatValue = (key: string) => {
    const value = stats[key as keyof typeof stats];
    return Number.isFinite(value) ? value : 0;
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-24 text-foreground sm:pb-24 sm:pt-28">
      <div className="absolute inset-0">
        <Image
          src={copy("hero.image", "/images/news/header.jpg")}
          alt="news-background"
          fill
          className="object-cover"
          priority
        />
        {/* Hero scrim: strong enough that white text stays readable on bright
            covers in light mode; fades into page background at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-background" />
      </div>

      <div className="container-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 max-w-2xl space-y-3 rounded-3xl border border-white/20 bg-black/55 p-5 text-white shadow-xl backdrop-blur-xl sm:mb-8 sm:p-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-medium text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {copy("hero.badge", "اخبار و رویدادهای پیشرو")}
          </span>

          <h1
            className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}
          >
            {copy("hero.title", "به‌روزترین مقالات")}
            <br />
            {copy("hero.titleSecond", "دنیای سرمایه‌گذاری")}
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {copy(
              "hero.description",
              "تازه‌ترین اخبار و تحلیل‌های بازار سرمایه — اسکرول کنید و ادامه مطالب را ببینید."
            )}
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
              className="rounded-2xl border border-white/20 bg-black/55 px-3.5 py-3 text-white shadow-lg backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className="text-lg font-bold tracking-tight sm:text-xl"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                >
                  {getStatValue(item.value).toLocaleString("fa-IR")}
                </span>
                <span className="rounded-lg bg-white/15 p-1.5 text-white">
                  <DynamicIcon name={item.iconName} fallback={item.fallback} className="h-4 w-4" />
                </span>
              </div>
              <span className="text-[11px] font-medium text-white/85">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
