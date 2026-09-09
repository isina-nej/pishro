"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";
import Image from "next/image";
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import { DynamicIcon } from "@/components/site/DynamicIcon";

interface CoursesHeroProps {
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalCategories: number;
    avgRating: number;
  };
}

export const CoursesHero = ({ stats }: CoursesHeroProps) => {
  const copy = usePublicCopy("courses");

  return (
    <section className="relative overflow-hidden pb-32 pt-36 text-foreground">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={copy("hero.image", "/images/courses/landing.jpg")}
          alt="courses-background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
      </div>

      <div className="container-xl relative z-10 flex flex-col items-center gap-10 text-center">
        <div className="mx-auto max-w-3xl space-y-6 rounded-[2rem] border border-white/20 bg-black/40 p-7 shadow-2xl shadow-black/30 sm:p-9">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-sm font-medium text-white">
            {copy("hero.badge", "دوره‌های آموزشی پیشرو")}
          </span>
          <h1 className="text-center text-4xl font-extrabold !leading-tight text-white md:text-5xl">
            {copy("hero.title", "مجموعه کامل دوره‌های تخصصی سرمایه‌ گذاری و بازارهای مالی")}
          </h1>
          <p className="mx-auto max-w-2xl text-center text-base text-white/80 md:text-lg leading-relaxed">
            {copy(
              "hero.description",
              "از صفر تا صد آموزش‌های کاربردی و حرفه‌ای در زمینه سرمایه‌ گذاری، تحلیل بازار و مدیریت مالی که توسط اساتید مجرب پیشرو تهیه شده‌اند."
            )}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: copy("hero.stat1", "دوره آموزشی"),
              value: stats.totalCourses,
              icon: (
                <DynamicIcon
                  name={copy("hero.stat1Icon", "GraduationCap")}
                  fallback={GraduationCap}
                  className="h-5 w-5"
                />
              ),
            },
            {
              label: copy("hero.stat2", "دانشجوی فعال"),
              value: stats.totalStudents,
              icon: (
                <DynamicIcon
                  name={copy("hero.stat2Icon", "Users")}
                  fallback={Users}
                  className="h-5 w-5"
                />
              ),
            },
            {
              label: copy("hero.stat3", "دسته‌بندی"),
              value: stats.totalCategories,
              icon: (
                <DynamicIcon
                  name={copy("hero.stat3Icon", "BookOpen")}
                  fallback={BookOpen}
                  className="h-5 w-5"
                />
              ),
            },
            {
              label: copy("hero.stat4", "میانگین رضایت"),
              value: stats.avgRating.toFixed(1),
              icon: (
                <DynamicIcon
                  name={copy("hero.stat4Icon", "TrendingUp")}
                  fallback={TrendingUp}
                  className="h-5 w-5"
                />
              ),
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 rounded-3xl border border-white/20 bg-black/40 px-5 py-4 text-white shadow-xl shadow-black/25 transition hover:-translate-y-1 hover:bg-black/50"
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
