export type MobileScrollerContentType = "IMAGE" | "PAGE";

export type MobileScrollerStep = {
  id: string | number;
  title: string;
  text: string;
  /** IMAGE (default) shows img; PAGE embeds pageUrl in an iframe */
  contentType?: MobileScrollerContentType;
  img?: string; // تصویر داخل موبایل
  pageUrl?: string; // مسیر/آدرس صفحه داخل موبایل
  imgCover?: string; // تصویر قاب موبایل
  gradient: string;
  link?: string; // لینک دکمه اطلاعات بیشتر
};

export const mobileScrollerSteps: MobileScrollerStep[] = [
  {
    id: 1,
    title: "قدم اول",
    text: "با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.",
    contentType: "IMAGE",
    img: "/images/home/mobile-scroll/in-mobile-1.svg",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-primary/30 via-primary/20 to-transparent",
  },
  {
    id: 2,
    title: "قدم دوم",
    text: "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس بازارهای نوین.",
    contentType: "IMAGE",
    img: "/images/home/mobile-scroll/mobile2.svg",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-primary/30 via-mySecondary-400/20 to-transparent",
  },
  {
    id: 3,
    title: "قدم سوم",
    text: "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
    contentType: "IMAGE",
    img: "/images/home/mobile-scroll/in-mobile-1.svg",
    imgCover: "/images/home/mobile-scroll/mobile.webp",
    gradient: "from-premium/30 via-premium/20 to-transparent",
  },
];
