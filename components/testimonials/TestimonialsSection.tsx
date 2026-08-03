"use client";

import React from "react";
import MarqueeTrack from "./MarqueeTrack";
import { TestimonialData } from "./TestimonialCard";

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
    <section className="relative w-full py-20 lg:py-32 bg-gradient-to-b from-card via-card to-card overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-premium/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-muted-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Container with Fade Effect */}
        <div className="relative w-full">
          {/* Left Fade Mask */}
          <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 bg-gradient-to-r from-card via-card/80 to-transparent z-20 pointer-events-none" />

          {/* Right Fade Mask */}
          <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 bg-gradient-to-l from-card via-card/80 to-transparent z-20 pointer-events-none" />

          {/* Scrollable Track */}
          <div className="w-full overflow-hidden">
            <MarqueeTrack testimonials={testimonials} speed={speed} />
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium/20 to-transparent" />
      </div>
    </section>
  );
};

export default TestimonialsSection;
