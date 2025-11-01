export type BookFormat = "جلد سخت" | "جلد نرم" | "الکترونیکی" | "صوتی";

export type BookCategory =
  | "رمان"
  | "توسعه فردی"
  | "کسب و کار"
  | "علمی تخیلی"
  | "روانشناسی"
  | "تاریخی"
  | "فلسفه"
  | "ادبیات کلاسیک";

export interface LibraryBook {
  id: string;
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
    id: "future-atlas",
    title: "اطلس آینده‌های محتمل",
    author: "آرزو کاویانی",
    year: 2025,
    rating: 9.1,
    votes: 1824,
    popularity: 9650,
    category: "علمی تخیلی",
    formats: ["الکترونیکی", "جلد سخت"],
    status: "جدید",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=720&q=80",
    description:
      "روایتی الهام‌بخش از شهری که آینده را مهندسی می‌کند و با علوم شناختی مرزهای انسان بودن را بازتعریف می‌نماید.",
    tags: ["آینده‌پژوهی", "فناوری", "هوش مصنوعی"],
    readingTime: "12 ساعت",
    isFeatured: true,
  },
  {
    id: "habit-alchemy",
    title: "کیمیاگری عادت‌های کوچک",
    author: "آیدا رضوی",
    year: 2024,
    rating: 8.7,
    votes: 2341,
    popularity: 8120,
    category: "توسعه فردی",
    formats: ["جلد نرم", "الکترونیکی"],
    status: "پرفروش",
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=720&q=80",
    description:
      "کتابی عمل‌گرایانه درباره ساختن عادت‌های پایدار با تکیه بر علوم رفتاری و مثال‌های بومی از فضای کسب‌وکار ایران.",
    tags: ["عادت", "موفقیت", "برنامه‌ریزی"],
    readingTime: "8 ساعت",
    isFeatured: true,
  },
  {
    id: "quantum-tea",
    title: "چایخانه کوانتومی",
    author: "پرهام گودرزی",
    year: 2023,
    rating: 8.9,
    votes: 1540,
    popularity: 7560,
    category: "فلسفه",
    formats: ["جلد سخت"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=720&q=80",
    description:
      "گفت‌وگوی خیالی یک فیزیکدان و یک فیلسوف درباره معنا، تصادف و مسئولیت در جهانی که ذراتش نیز داستان می‌گویند.",
    tags: ["فلسفه علم", "گفت‌وگو", "تفکر نقاد"],
    readingTime: "9 ساعت",
  },
  {
    id: "startup-saffron",
    title: "استارتاپ زعفران",
    author: "مانی مختاری",
    year: 2022,
    rating: 8.2,
    votes: 1985,
    popularity: 6890,
    category: "کسب و کار",
    formats: ["جلد نرم", "الکترونیکی"],
    status: "پرفروش",
    cover:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
    description:
      "داستان تیمی جوان که با ترکیب فناوری و کشاورزی هوشمند، زنجیره ارزش زعفران ایران را متحول می‌کند.",
    tags: ["کارآفرینی", "کشاورزی هوشمند", "مدیریت"],
    readingTime: "7 ساعت",
    isFeatured: true,
  },
  {
    id: "echoes-of-isfahan",
    title: "بازتاب اصفهان",
    author: "ساتین رستگار",
    year: 2021,
    rating: 8.5,
    votes: 1260,
    popularity: 5420,
    category: "ادبیات کلاسیک",
    formats: ["جلد سخت", "صوتی"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
    description:
      "بازآفرینی داستانی از روزهای شکوه نصف جهان با تمرکز بر ظرافت‌های معماری و زندگی هنرمندان میدان نقش‌جهان.",
    tags: ["اصفهان", "هنر", "تاریخ"],
    readingTime: "14 ساعت",
  },
  {
    id: "desert-psychology",
    title: "روانشناسی کویر",
    author: "مینا طباطبایی",
    year: 2025,
    rating: 9.3,
    votes: 2980,
    popularity: 10020,
    category: "روانشناسی",
    formats: ["الکترونیکی", "صوتی"],
    status: "جدید",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=720&q=80",
    description:
      "سفرنامه‌ای درونی در دل دشت لوت که به خودشناسی، تاب‌آوری و معناجویی در دنیای پرشتاب امروز می‌پردازد.",
    tags: ["تاب‌آوری", "خودشناسی", "طبیعت‌درمانی"],
    readingTime: "6 ساعت",
    isFeatured: true,
  },
  {
    id: "tehran-archive",
    title: "آرشیو پنهان تهران",
    author: "سپهر نادری",
    year: 2020,
    rating: 8.0,
    votes: 980,
    popularity: 4210,
    category: "تاریخی",
    formats: ["جلد سخت"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=720&q=80",
    description:
      "بازخوانی اسناد کمتر دیده‌شده دوران قاجار با تمرکز بر شکل‌گیری نخستین نهادهای مدرن در ایران.",
    tags: ["تهران", "قاجار", "مدرنیته"],
    readingTime: "11 ساعت",
  },
  {
    id: "mindful-product",
    title: "محصول مینیمال",
    author: "سارا تهرانی",
    year: 2023,
    rating: 8.4,
    votes: 1630,
    popularity: 6120,
    category: "کسب و کار",
    formats: ["الکترونیکی", "جلد نرم"],
    status: "پرفروش",
    cover:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=720&q=80",
    description:
      "راهنمایی برای ساخت محصولاتی ساده، انسانی و سودآور با تمرکز بر تجربه کاربری و داده‌محوری.",
    tags: ["طراحی محصول", "استارتاپ", "UX"],
    readingTime: "5 ساعت",
  },
  {
    id: "gardens-of-persia",
    title: "باغ‌های پنهان پارس",
    author: "نگار فرهمند",
    year: 2022,
    rating: 8.8,
    votes: 1475,
    popularity: 5780,
    category: "تاریخی",
    formats: ["جلد سخت", "صوتی"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=720&q=80",
    description:
      "کاوشی تصویری و روایی در باغ‌های ایرانی و نسبت آن‌ها با فلسفه زندگی، آب و معماری در سرزمین‌های کویری.",
    tags: ["معماری", "طبیعت", "زیبایی‌شناسی"],
    readingTime: "10 ساعت",
  },
  {
    id: "sigma-notes",
    title: "یادداشت‌های سیگما",
    author: "مانی رستمی",
    year: 2024,
    rating: 9.0,
    votes: 2120,
    popularity: 8340,
    category: "علمی تخیلی",
    formats: ["الکترونیکی", "صوتی"],
    status: "جدید",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=720&q=80",
    description:
      "گزارش محرمانه‌ای از یک مامور که در فضای متاورس به دنبال کشف منشأ آگاهی مصنوعی است.",
    tags: ["متاورس", "آگاهی", "سایبرپانک"],
    readingTime: "9 ساعت",
    isFeatured: true,
  },
  {
    id: "letters-to-hafez",
    title: "نامه‌هایی به حافظ",
    author: "لیلا سادات موسوی",
    year: 2021,
    rating: 8.1,
    votes: 880,
    popularity: 4320,
    category: "ادبیات کلاسیک",
    formats: ["جلد نرم", "صوتی"],
    status: "ویژه",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=720&q=80",
    description:
      "نامه‌هایی از شاعران معاصر به حافظ شیرازی که در آن از جهان امروز، عشق و دغدغه انسان ایرانی روایت می‌شود.",
    tags: ["شعر", "ادبیات", "نامه‌نگاری"],
    readingTime: "4 ساعت",
  },
  {
    id: "neuron-city",
    title: "شهر نورون‌ها",
    author: "دکتر فرشاد سلیمانی",
    year: 2025,
    rating: 9.4,
    votes: 3025,
    popularity: 11040,
    category: "روانشناسی",
    formats: ["الکترونیکی", "جلد سخت"],
    status: "جدید",
    cover:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=720&q=80",
    description:
      "بررسی کاربردی علوم اعصاب در طراحی زندگی، یادگیری عمیق و افزایش تمرکز برای نسل دیجیتال.",
    tags: ["علوم اعصاب", "تمرکز", "بهره‌وری"],
    readingTime: "11 ساعت",
    isFeatured: true,
  },
];

export const curatedCollections = [
  {
    id: "mind-lab",
    title: "آزمایشگاه ذهن خلاق",
    description: "ترکیبی از عادت‌سازی، علوم اعصاب و روایت برای ساختن عصر جدید ذهن آگاه.",
    accent: "from-sky-500/80 via-violet-500/80 to-indigo-600/80",
  },
  {
    id: "startup-playbook",
    title: "دفترچه راهنمای استارتاپ ایرانی",
    description: "داستان و استراتژی تیم‌هایی که صنایع سنتی را با فناوری بازآفرینی کردند.",
    accent: "from-amber-500/80 via-orange-500/80 to-red-500/80",
  },
  {
    id: "timeless-letters",
    title: "نامه‌هایی برای تمام فصل‌ها",
    description: "گزیده‌ای از ادبیات کلاسیک و معاصر برای لحظه‌های آرامش و الهام.",
    accent: "from-emerald-500/80 via-teal-500/80 to-cyan-500/80",
  },
];

