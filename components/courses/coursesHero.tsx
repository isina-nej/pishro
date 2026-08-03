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
    <section className="relative overflow-hidden pb-32 pt-36 text-foreground">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/courses/landing.jpg"
          alt="courses-background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-card/90 via-card/70 to-card/90" />
      </div>

      {/* Floating Elements for depth */}
      <div className="absolute -left-10 top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="container-xl relative z-10 flex flex-col gap-10">
        <div className="max-w-3xl space-y-6 rounded-[2rem] border border-border/15 bg-[#091a28]/45 p-7 shadow-2xl backdrop-blur-2xl sm:p-9">
          <span className="inline-flex items-center rounded-full border border-border/25 bg-card/10 px-4 py-1 text-sm font-medium text-primary-foreground shadow-sm backdrop-blur">
            دوره‌های آموزشی پیشرو
          </span>
          <h1 className="text-4xl font-extrabold !leading-tight md:text-5xl">
            مجموعه کامل دوره‌های تخصصی سرمایه‌ گذاری و بازارهای مالی
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
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
              className="flex items-center gap-3 rounded-3xl border border-border/15 bg-[#091a28]/45 px-5 py-4 text-primary-foreground shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-card/15"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card/15 text-primary-foreground">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{item.value}</span>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
