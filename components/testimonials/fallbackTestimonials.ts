import type { TestimonialData } from "./TestimonialCard";

/** Shown when DB has no published/featured comments — section must stay visible */
export const FALLBACK_TESTIMONIALS: TestimonialData[] = [
  {
    id: "fallback-1",
    name: "آزاده بهرامی",
    role: "کاربر",
    avatar: "/images/home/real-comments/1.jpg",
    content:
      "خیلی خوشحالم ازینکه حدود ۲ سال پیش با این مجموعه خصوصا خانم دکتر عزیز آشنا شدم. کلاس‌های ایشون بسیار پربار و عالی بود. همچنین پشتیبانی ایشون بعد از اتمام کلاس بسیار انگیزه و اعتمادبه‌نفس به دوره‌آموزان میده.",
    rating: 5,
  },
  {
    id: "fallback-2",
    name: "محمدجواد نوری",
    role: "معامله‌گر",
    avatar: "/images/home/real-comments/2.jpg",
    content:
      "دوره عالی و کاملی بود. از مفاهیم پایه تا پیشرفته همه چیز به صورت کاملا عملی و کاربردی آموزش داده شد. الان توی بازار فعالیت دارم و از دانشی که کسب کردم استفاده می‌کنم.",
    rating: 5,
  },
  {
    id: "fallback-3",
    name: "امیرحسین محمدزاده",
    role: "کاربر",
    avatar: "/images/home/real-comments/3.jpg",
    content:
      "من قبل از شرکت در این دوره هیچ اطلاعاتی از بازار نداشتم. الان با اطمینان می‌تونم تحلیل کنم و معامله انجام بدم. واقعا ممنونم از تیم پیشرو.",
    rating: 5,
  },
  {
    id: "fallback-4",
    name: "امیرحسین نامدار",
    role: "کاربر",
    avatar: "/images/home/real-comments/4.jpg",
    content:
      "این دوره ترید واقعاً فوق‌العاده بود! از صفر شروع کردم و حالا با اطمینان ترید می‌کنم. تحلیل تکنیکال، مدیریت ریسک و روانشناسی معامله رو عالی یاد گرفتم.",
    rating: 5,
  },
  {
    id: "fallback-5",
    name: "سارا محمدی",
    role: "مدیر سرمایه‌گذاری",
    avatar: "/images/home/real-comments/5.jpg",
    content:
      "کیفیت آموزش بسیار بالا است. مربیان واقعاً به موضوع مسلط‌اند و تجربه‌شان قابل‌اعتماد است.",
    rating: 5,
  },
  {
    id: "fallback-6",
    name: "علی رضایی",
    role: "تحلیلگر بازار",
    avatar: "/images/home/real-comments/6.jpg",
    content:
      "بهترین سرمایه‌گذاری که برای توسعه مهارت‌های خود کردم. نتایج فوری و قابل‌توجه بود.",
    rating: 5,
  },
];
