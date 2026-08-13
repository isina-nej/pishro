"use client";

import React from "react";
import MarqueeTrack from "./MarqueeTrack";
import { TestimonialData } from "./TestimonialCard";

const COMMENTS_BG = "/images/home/comments-bg.webp";

// Sample testimonials data
const sampleTestimonials: TestimonialData[] = [
  {
    id: "1",
    name: "سارا محمدی",
    role: "مدیر سرمایه‌گذاری",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    content:
      "این دوره کاملاً متغیر‌کننده بود. استراتژی‌های یادگرفته‌شده مستقیماً به سود‌های واقعی تبدیل شدند.",
    rating: 5,
    company: "سرمایه‌ای پیشرو",
  },
  {
    id: "2",
    name: "علی رضایی",
    role: "تاجر کریپتو",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    content:
      "کالیتی آموزش بسیار بالا است. مربیان حقیقاً می‌دانند درباره موضوع و تجربه‌شان قابل‌اعتماد است.",
    rating: 5,
    company: "تریدینگ پلاس",
  },
  {
    id: "3",
    name: "فاطمه احسانی",
    role: "تحلیلگر بازار",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    content:
      "بهترین سرمایه‌گذاری که برای توسعه مهارت‌های خود کردم. نتایج فوری و قابل‌توجه.",
    rating: 5,
    company: "آنالیتیکس‌اپ",
  },
  {
    id: "4",
    name: "محمد کریمی",
    role: "مشاور مالی",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    content:
      "محتوای جامع و ساختار‌یافته. هر بخش به خوبی طراحی شده و عملی است.",
    rating: 5,
    company: "ویلث‌من‌جمنت‌اپ",
  },
  {
    id: "5",
    name: "نیلا شاهی",
    role: "کارآفرین",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    content:
      "توانایی‌های جدید کسب کردم که موقعیت کسب‌وکار مرا به‌طور قابل‌توجهی بهبود داد.",
    rating: 5,
    company: "استارتاپ ایکس",
  },
  {
    id: "6",
    name: "احمد علیزاده",
    role: "معامله‌گر",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    content:
      "کمیونیتی حمایتی و منابع بسیار خوب. همیشه کسی هست که کمک کند.",
    rating: 5,
    company: "ترید‌گروپ",
  },
];

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialData[];
  speed?: number;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title = "نظرات کاربران",
  subtitle = "ببینید چه کسانی از ما رضایت دارند",
  testimonials = sampleTestimonials,
  speed = 60,
}) => {
  return (
    <section
      id="home-comments"
      className="relative isolate w-full overflow-hidden py-20 lg:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat supports-[background-attachment:fixed]:bg-fixed"
          style={{ backgroundImage: `url('${COMMENTS_BG}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--home-bg,#F7F5F0)]/78 via-[var(--home-bg,#F7F5F0)]/62 to-[var(--home-bg,#F7F5F0)]/80 dark:from-black/70 dark:via-black/55 dark:to-black/75" />
      </div>

      <div className="relative z-10">
        <div className="mb-16 px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-32 bg-gradient-to-r from-[var(--home-bg,#F7F5F0)]/90 to-transparent lg:w-48 dark:from-black/70" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-32 bg-gradient-to-l from-[var(--home-bg,#F7F5F0)]/90 to-transparent lg:w-48 dark:from-black/70" />

          <div className="w-full overflow-hidden">
            <MarqueeTrack testimonials={testimonials} speed={speed} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
