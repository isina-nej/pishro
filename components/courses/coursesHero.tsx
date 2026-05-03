"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";
import Image from "next/image";

interface CoursesHeroProps {
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalCategories: number;
    avgRating: number;
  };
}

export const CoursesHero = ({ stats }: CoursesHeroProps) => {
  return (
    <section className="relative overflow-hidden pb-32 pt-36 text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/courses/landing.jpg"
          alt="courses-background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90" />
      </div>

      {/* Floating Elements for depth */}
      <div className="absolute -left-10 top-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="container-xl relative z-10 flex flex-col gap-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-slate-100">
            دوره‌های آموزشی پیشرو
          </span>
          <h1 className="text-4xl font-extrabold !leading-tight md:text-5xl">
            مجموعه کامل دوره‌های تخصصی سرمایه‌ گذاری و بازارهای مالی
          </h1>
          <p className="text-base text-slate-200 md:text-lg">
            از صفر تا صد آموزش‌های کاربردی و حرفه‌ای در زمینه سرمایه‌ گذاری،
            تحلیل بازار و مدیریت مالی که توسط اساتید مجرب پیشرو تهیه شده‌اند.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "دوره آموزشی",
              value: stats.totalCourses,
              icon: <GraduationCap className="h-5 w-5" />,
            },
            {
              label: "دانشجوی فعال",
              value: stats.totalStudents,
              icon: <Users className="h-5 w-5" />,
            },
            {
              label: "دسته‌بندی",
              value: stats.totalCategories,
              icon: <BookOpen className="h-5 w-5" />,
            },
            {
              label: "میانگین رضایت",
              value: stats.avgRating.toFixed(1),
              icon: <TrendingUp className="h-5 w-5" />,
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{item.value}</span>
                <span className="text-sm text-slate-200">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
