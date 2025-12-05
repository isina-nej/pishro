export type MobileScrollerStep = {
  id: number;
  text: string;
  img: string; // تصویر داخل موبایل (مثل in-mobile-1.svg)
  imgCover?: string; // تصویر پس‌زمینه موبایل
  gradient: string;
  link?: string; // لینک دکمه اطلاعات بیشتر
};

export const mobileScrollerSteps: MobileScrollerStep[] = [
  {
    id: 1,
    text: "با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.",
    img: "/images/home/mobile-scroll/in-mobile-1.png",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-blue-400/30 via-indigo-400/20 to-transparent",
  },
  {
    id: 2,
    text: "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس و بازارهای نوین.",
    img: "/images/home/mobile-scroll/in-mobile-2.png",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-blue-400/30 via-mySecondary-400/20 to-transparent",
  },
  {
    id: 3,
    text: "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
    img: "/images/home/mobile-scroll/in-mobile-3.png",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-amber-400/30 via-orange-400/20 to-transparent",
  },
];
