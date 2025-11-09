export type BookFormat = "جلد سخت" | "جلد نرم" | "الکترونیکی" | "صوتی";

export type BookCategory =
  | "بورس و سهام"
  | "ارز دیجیتال"
  | "سرمایه‌گذاری"
  | "کسب و کار"
  | "اقتصاد"
  | "تحلیل تکنیکال"
  | "مدیریت مالی";

export interface LibraryBook {
  id: string;
  slug: string;
  title: string;
  author: string;
  year: number;
  rating: number;
  votes: number;
  popularity: number;
  category: BookCategory;
  formats: BookFormat[];
  status: "جدید" | "پرفروش" | "ویژه";
  cover: string;
  description: string;
  tags: string[];
  readingTime: string;
  isFeatured?: boolean;
}

export const libraryBooks: LibraryBook[] = [
  {
    id: "crypto-mindset",
    slug: "crypto-mindset",
    title: "ذهن میلیونر کریپتو",
    author: "آرمان صفوی",
    year: 2025,
    rating: 9.2,
    votes: 2780,
    popularity: 11230,
    category: "ارز دیجیتال",
    formats: ["الکترونیکی", "صوتی"],
    status: "جدید",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=720&q=80",
    description:
      "نحوه‌ی تفکر و تصمیم‌گیری معامله‌گران بزرگ بازار رمزارز و روش ساخت ذهن مقاوم در برابر نوسانات شدید.",
    tags: ["کریپتو", "احساسات بازار", "بیت‌کوین"],
    readingTime: "9 ساعت",
    isFeatured: true,
  },
  {
    id: "smart-investor-iran",
    slug: "smart-investor-iran",
    title: "سرمایه‌گذار هوشمند ایرانی",
    author: "فرهاد رضایی",
    year: 2024,
    rating: 9.0,
    votes: 3150,
    popularity: 10120,
    category: "سرمایه‌گذاری",
    formats: ["جلد نرم", "الکترونیکی"],
    status: "پرفروش",
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=720&q=80",
    description:
      "اقتباسی از تفکرات بنجامین گراهام با مثال‌های واقعی از بورس و بازار ایران؛ روشی علمی برای کاهش ریسک و افزایش سود.",
    tags: ["بورس", "تحلیل بنیادی", "مدیریت ریسک"],
    readingTime: "11 ساعت",
    isFeatured: true,
  },
  {
    id: "trading-psychology",
    slug: "trading-psychology",
    title: "روانشناسی معامله‌گری",
    author: "سحر فاضلی",
    year: 2023,
    rating: 8.8,
    votes: 1840,
    popularity: 8720,
    category: "مدیریت مالی",
    formats: ["صوتی", "الکترونیکی"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=720&q=80",
    description:
      "تحلیل رفتار ذهنی تریدرها در شرایط استرس بازار و روش‌های کنترل احساسات هنگام خرید و فروش.",
    tags: ["احساسات", "معامله‌گری", "روانشناسی بازار"],
    readingTime: "6 ساعت",
  },
  {
    id: "bitcoin-history",
    slug: "bitcoin-history",
    title: "داستان بیت‌کوین",
    author: "پرهام نادری",
    year: 2022,
    rating: 8.7,
    votes: 1450,
    popularity: 7680,
    category: "ارز دیجیتال",
    formats: ["جلد سخت", "صوتی"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
    description:
      "روایت جذاب پیدایش بیت‌کوین، خالق ناشناس آن و تحول اقتصاد جهانی با ظهور پول غیرمتمرکز.",
    tags: ["بیت‌کوین", "فناوری بلاکچین", "تاریخ پول"],
    readingTime: "10 ساعت",
  },
  {
    id: "financial-freedom",
    slug: "financial-freedom",
    title: "آزادی مالی در ایران",
    author: "نیلوفر احمدی",
    year: 2025,
    rating: 9.4,
    votes: 2980,
    popularity: 11900,
    category: "کسب و کار",
    formats: ["الکترونیکی", "جلد نرم"],
    status: "جدید",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=720&q=80",
    description:
      "گام‌به‌گام تا رسیدن به استقلال مالی در ایران با تمرکز بر درآمد غیرفعال و سرمایه‌گذاری‌های هوشمند.",
    tags: ["آزادی مالی", "درآمد غیرفعال", "پولسازی"],
    readingTime: "8 ساعت",
    isFeatured: true,
  },
  {
    id: "market-cycles",
    slug: "market-cycles",
    title: "چرخه‌های بازار",
    author: "دکتر کوروش صادقی",
    year: 2024,
    rating: 8.9,
    votes: 1920,
    popularity: 9020,
    category: "اقتصاد",
    formats: ["جلد سخت"],
    status: "پرفروش",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=720&q=80",
    description:
      "تحلیل جامع رفتار بازار در دوره‌های رونق و رکود با نگاهی به بورس، طلا، ارز و کریپتو.",
    tags: ["چرخه اقتصادی", "تحلیل بازار", "پیش‌بینی روند"],
    readingTime: "12 ساعت",
  },
  {
    id: "technical-analysis-pro",
    slug: "technical-analysis-pro",
    title: "تحلیل تکنیکال پیشرفته",
    author: "محمدحسین مرادی",
    year: 2023,
    rating: 9.1,
    votes: 2230,
    popularity: 9820,
    category: "تحلیل تکنیکال",
    formats: ["الکترونیکی", "جلد نرم"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=720&q=80",
    description:
      "آموزش عمیق پرایس‌اکشن، الگوهای کندلی و واگرایی‌ها برای حرفه‌ای‌ها.",
    tags: ["پرایس اکشن", "کندل‌استیک", "نمودار"],
    readingTime: "14 ساعت",
    isFeatured: true,
  },
  {
    id: "gold-vs-bitcoin",
    slug: "gold-vs-bitcoin",
    title: "طلا یا بیت‌کوین؟",
    author: "علیرضا نیک‌نژاد",
    year: 2022,
    rating: 8.5,
    votes: 1300,
    popularity: 7450,
    category: "اقتصاد",
    formats: ["جلد نرم", "صوتی"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
    description: "مقایسه تحلیلی بین طلا و بیت‌کوین به عنوان ذخیره ارزش قرن ۲۱.",
    tags: ["طلا", "بیت‌کوین", "اقتصاد جهانی"],
    readingTime: "7 ساعت",
  },
  {
    id: "startup-capital",
    slug: "startup-capital",
    title: "سرمایه‌گذاری جسورانه",
    author: "شقایق کاظمی",
    year: 2021,
    rating: 8.3,
    votes: 1020,
    popularity: 6320,
    category: "کسب و کار",
    formats: ["الکترونیکی", "جلد سخت"],
    status: "پرفروش",
    cover:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=720&q=80",
    description:
      "چگونه سرمایه‌گذاران خطرپذیر استارتاپ‌های آینده‌ساز را انتخاب می‌کنند و سودهای چندبرابری می‌سازند.",
    tags: ["VC", "استارتاپ", "توسعه کسب‌وکار"],
    readingTime: "9 ساعت",
  },
];

export const curatedCollections = [
  {
    id: "crypto-basics",
    title: "ورود هوشمند به کریپتو",
    description:
      "آشنایی کامل با مفاهیم رمزارز، بلاکچین و سرمایه‌گذاری ایمن در کریپتو.",
    accent: "from-cyan-500/80 via-blue-500/80 to-indigo-600/80",
  },
  {
    id: "stock-secrets",
    title: "رازهای بازار سهام",
    description:
      "مجموعه‌ای از کتاب‌ها برای درک عمیق رفتار بورس، ارزش‌گذاری سهام و استراتژی‌های موفق.",
    accent: "from-amber-500/80 via-orange-500/80 to-red-500/80",
  },
  {
    id: "financial-mindset",
    title: "ذهن ثروت‌ساز",
    description:
      "کتاب‌هایی برای تغییر نگرش مالی، کنترل احساسات در سرمایه‌گذاری و ساخت درآمد پایدار.",
    accent: "from-emerald-500/80 via-teal-500/80 to-cyan-500/80",
  },
];
