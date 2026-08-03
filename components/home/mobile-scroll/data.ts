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
    img: "/images/home/mobile-scroll/in-mobile-1.svg",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-primary/30 via-primary/20 to-transparent",
  },
  {
    id: 2,
    text: "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس بازارهای نوین.",
    img: "/images/home/mobile-scroll/mobile2.svg",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-primary/30 via-mySecondary-400/20 to-transparent",
  },
  {
    id: 3,
    text: "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
    img: "/images/home/mobile-scroll/in-mobile-1.svg",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-premium/30 via-premium/20 to-transparent",
  },
];
