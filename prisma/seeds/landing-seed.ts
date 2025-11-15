// @/prisma/seeds/landing-seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedLandingPages() {
  console.log("🌱 Seeding landing pages...");

  // ==================== HOME LANDING ====================
  const homeLanding = await prisma.homeLanding.upsert({
    where: { id: "home-landing-1" },
    update: {},
    create: {
      id: "home-landing-1",
      // Main Hero
      mainHeroTitle: "پیشرو در مسیر سرمایه‌گذاری هوشمند",
      mainHeroSubtitle: "آموزش تخصصی بورس و بازارهای مالی",
      mainHeroCta1Text: "شروع مسیر موفقیت",
      mainHeroCta1Link: "/business-consulting",

      // Hero Section
      heroTitle: "پیشرو سرمایه",
      heroSubtitle: "بزرگترین مؤسسه سرمایه‌گذاری در ایران",
      heroDescription: "از آموزش اصولی تا مشاوره حرفه‌ای در بازارهای مالی",
      heroVideoUrl: "/videos/aboutUs.webm",
      heroCta1Text: "مشاهده دوره‌ها",
      heroCta1Link: "/courses",

      // Overlay Texts
      overlayTexts: [
        "پیشرو در مسیر سرمایه‌گذاری هوشمند",
        "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.",
        "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.",
        "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
      ],

      // Stats
      statsData: [
        { label: "دانشجوی موفق", value: 3000, suffix: "+" },
        { label: "دوره تخصصی", value: 100, suffix: "+" },
        { label: "رضایت کاربران", value: 95, suffix: "%" },
        { label: "سال تجربه", value: 5, suffix: "+" },
      ],

      // Why Us Section
      whyUsTitle: "چرا پیشرو؟",
      whyUsDescription: "مزایای آموزش و سرمایه‌گذاری با پیشرو",
      whyUsItems: [
        {
          label: "آموزش حرفه‌ای",
          title: "آموزش از صفر تا صد",
          text: "دوره‌های جامع و کاربردی برای تمام سطوح",
          btnLabel: "مشاهده دوره‌ها",
          btnHref: "/courses",
          imagePath: "/images/home/why-us-1.jpg",
        },
        {
          label: "مشاوره تخصصی",
          title: "مشاوره یک‌به‌یک",
          text: "راهنمایی حرفه‌ای در مسیر سرمایه‌گذاری",
          btnLabel: "درخواست مشاوره",
          btnHref: "/business-consulting",
          imagePath: "/images/home/why-us-2.jpg",
        },
        {
          label: "سبدهای سرمایه‌گذاری",
          title: "سبدهای متنوع",
          text: "سبدهای مختلف برای انواع سرمایه‌گذاری",
          btnLabel: "مشاهده سبدها",
          btnHref: "/investment-plans",
          imagePath: "/images/home/why-us-3.jpg",
        },
      ],

      // News Club
      newsClubTitle: "باشگاه خبری پیشرو",
      newsClubDescription:
        "با عضویت در باشگاه خبری پیشرو، از تازه‌ترین مقالات آموزشی، نکات تخصصی و تحلیل‌های روز دنیای دیجیتال باخبر شوید و همیشه یک گام جلوتر از رقبا بمانید. جدیدترین مطالب مستقیماً در تلفن همراه شما ارسال خواهد شد.",

      // Calculator Section
      calculatorTitle: "محاسبه سود سرمایه‌گذاری",
      calculatorDescription: "سود خود را پیش‌بینی کنید",
      calculatorRateLow: 0.07,
      calculatorRateMedium: 0.08,
      calculatorRateHigh: 0.11,
      calculatorPortfolioLowDesc: "تضمین اصل سرمایه و سود بازدهی ثابت",
      calculatorPortfolioMediumDesc: "تضمین اصل سرمایه و سود بازدهی ثابت",
      calculatorPortfolioHighDesc:
        "تضمین اصل سرمایه با بازدهی بین ۵ تا ۵۰ درصد",
      calculatorAmountSteps: [
        1000000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000,
        70000000, 80000000, 90000000, 100000000, 200000000, 300000000,
        500000000, 1000000000, 2000000000, 3000000000, 5000000000,
      ],
      calculatorDurationSteps: [1, 3, 6, 9, 12],
      calculatorInPersonPhone: "0912-123-4567",
      calculatorOnlineTelegram: "@InvestmentSupport",
      calculatorOnlineTelegramLink: "https://t.me/amirhossein_v2",

      // Meta
      metaTitle: "پیشرو | بزرگترین مؤسسه سرمایه‌گذاری در ایران",
      metaDescription:
        "آموزش تخصصی بورس، بازارهای مالی و سرمایه‌گذاری. از آموزش اصولی تا مشاوره حرفه‌ای",
      metaKeywords: [
        "آموزش بورس",
        "سرمایه‌گذاری",
        "بازار مالی",
        "مشاوره سرمایه‌گذاری",
      ],

      published: true,
      order: 0,
    },
  });

  console.log("✅ Home Landing created:", homeLanding.id);

  // ==================== MOBILE SCROLLER STEPS ====================
  const _step1 = await prisma.mobileScrollerStep.upsert({
    where: { id: "mobile-step-1" },
    update: {},
    create: {
      id: "mobile-step-1",
      stepNumber: 1,
      title: "قدم اول",
      description:
        "با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.",
      imageUrl: "/images/home/mobile-scroll/in-mobile-1.svg",
      coverImageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-blue-400/30 via-indigo-400/20 to-transparent",
      order: 1,
      published: true,
    },
  });

  const _step2 = await prisma.mobileScrollerStep.upsert({
    where: { id: "mobile-step-2" },
    update: {},
    create: {
      id: "mobile-step-2",
      stepNumber: 2,
      title: "قدم دوم",
      description:
        "دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس و بازارهای نوین.",
      imageUrl: "/images/home/mobile-scroll/in-mobile-1.svg",
      coverImageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-blue-400/30 via-mySecondary-400/20 to-transparent",
      order: 2,
      published: true,
    },
  });

  const _step3 = await prisma.mobileScrollerStep.upsert({
    where: { id: "mobile-step-3" },
    update: {},
    create: {
      id: "mobile-step-3",
      stepNumber: 3,
      title: "قدم سوم",
      description:
        "با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.",
      imageUrl: "/images/home/mobile-scroll/in-mobile-1.svg",
      coverImageUrl: "/images/home/mobile-scroll/mobile.webp",
      gradient: "from-amber-400/30 via-orange-400/20 to-transparent",
      order: 3,
      published: true,
    },
  });

  console.log("✅ Mobile Scroller Steps created");

  // ==================== ABOUT PAGE ====================
  const aboutPage = await prisma.aboutPage.upsert({
    where: { id: "about-page-1" },
    update: {},
    create: {
      id: "about-page-1",
      // Hero
      heroTitle: "آکادمی مالی پیشرو سرمایه",
      heroSubtitle: "پیشرو در آموزش و سرمایه‌گذاری",
      heroDescription:
        "با تجربه‌ای بیش از ۵ سال در زمینه آموزش و مشاوره بازارهای مالی، پیشرو سرمایه به عنوان یکی از معتبرترین مراکز آموزشی در حوزه سرمایه‌گذاری شناخته می‌شود.",
      heroBadgeText: "پیشرو در آموزش و سرمایه‌گذاری",
      heroStats: [
        { label: "دانشجوی موفق", value: 3000, icon: "LuUsers" },
        { label: "دوره تخصصی", value: 100, icon: "LuGraduationCap" },
        { label: "رضایت کاربران", value: 95, icon: "LuStar" },
      ],

      // Resume Section
      resumeTitle: "درباره ما",
      resumeSubtitle: "تاریخچه، ماموریت و چشم‌انداز پیشرو",

      // Team
      teamTitle: "تیم ما",
      teamSubtitle: "بانیان و مدیران پیشرو سرمایه",

      // Certificates
      certificatesTitle: "افتخارات و گواهینامه‌ها",
      certificatesSubtitle: "تقدیرنامه‌ها و مجوزهای دریافتی",

      // News
      newsTitle: "اخبار و مقالات",
      newsSubtitle: "جدیدترین مطالب منتشر شده",

      // CTA
      ctaTitle: "آماده‌اید برای شروع سفر سرمایه‌گذاری هوشمند؟",
      ctaDescription:
        "با پیوستن به جمع هزاران دانشجوی موفق ما، اولین قدم را برای دستیابی به استقلال مالی بردارید",
      ctaButtonText: "مشاهده دوره‌ها",
      ctaButtonLink: "/courses",

      // Meta
      metaTitle: "درباره ما | آکادمی مالی پیشرو سرمایه",
      metaDescription:
        "آشنایی با تیم، تاریخچه و ماموریت آکادمی مالی پیشرو سرمایه",
      metaKeywords: ["درباره پیشرو", "تیم پیشرو", "آکادمی مالی"],

      published: true,
    },
  });

  console.log("✅ About Page created:", aboutPage.id);

  // ==================== INVESTMENT CONSULTING ====================
  const businessConsulting = await prisma.businessConsulting.upsert({
    where: { id: "business-consulting-1" },
    update: {},
    create: {
      id: "business-consulting-1",
      title: "مشاوره کسب وکار پیشرو",
      description:
        "در بخش مشاوره کسب‌وکار، همراه شماییم تا در هر حرفه‌ای که دارید، با استفاده از دانش و تجربه‌مان، کسب‌وکارتان را به سطح بالاتری برسانید.",
      image: "/images/business-consulting/landing.jpg",

      // Contact Info
      phoneNumber: "0912-123-4567",
      telegramId: "@InvestmentSupport",
      telegramLink: "https://t.me/amirhossein_v2",
      coursesLink: "https://t.me/MyCoursesChannel",

      // Drawer Content
      inPersonTitle: "مشاوره حضوری",
      inPersonDescription: "برای رزرو مشاوره حضوری با ما تماس بگیرید:",
      onlineTitle: "مشاوره آنلاین",
      onlineDescription: "برای دریافت مشاوره آنلاین از طریق تلگرام پیام دهید:",
      coursesTitle: "دوره‌های آموزشی",
      coursesDescription: "برای مشاهده دوره‌های ما در تلگرام کلیک کنید:",

      // Meta
      metaTitle: "مشاوره سرمایه‌گذاری | پیشرو سرمایه",
      metaDescription:
        "دریافت مشاوره تخصصی در زمینه سرمایه‌گذاری و بازارهای مالی",
      metaKeywords: ["مشاوره سرمایه‌گذاری", "مشاوره بورس", "مشاوره مالی"],

      published: true,
    },
  });

  console.log("✅ Investment Consulting created:", businessConsulting.id);

  // ==================== INVESTMENT PLANS ====================
  const investmentPlans = await prisma.investmentPlans.upsert({
    where: { id: "investment-plans-1" },
    update: {},
    create: {
      id: "investment-plans-1",
      title: "سبد های سرمایه گذاری پیشرو",
      description:
        "هر سبد سرمایه‌گذاری با تکیه بر تحلیل‌های کمّی و کیفی دقیق طراحی شده و برای هر سطح ریسک و بازده، گزینه‌های متنوعی در اختیار شما قرار می‌گیرد.",
      image: "/images/investment-plans/landing.jpg",

      // Intro Cards
      plansIntroCards: [
        {
          title: "مدیریت سرمایه",
          description: "تقسیم سرمایه، ریسک به ریوارد و مدیریت حرفه‌ای پرتفو",
        },
        {
          title: "تحلیل بازار",
          description: "بررسی دقیق بازار و انتخاب بهترین گزینه‌ها",
        },
        {
          title: "ریسک مدیریت",
          description: "کاهش ریسک و افزایش بازدهی سرمایه‌گذاری",
        },
      ],

      // Slider Settings
      minAmount: 10,
      maxAmount: 10000,
      amountStep: 10,

      // Meta
      metaTitle: "سبدهای سرمایه‌گذاری | پیشرو سرمایه",
      metaDescription:
        "انتخاب سبد سرمایه‌گذاری مناسب با توجه به میزان ریسک و بازده مورد نظر",
      metaKeywords: [
        "سبد سرمایه‌گذاری",
        "پرتفوی سرمایه‌گذاری",
        "مدیریت سرمایه",
      ],

      published: true,
    },
  });

  console.log("✅ Investment Plans created:", investmentPlans.id);

  console.log("✅ All landing pages seeded successfully!");
}

// Run if called directly
if (require.main === module) {
  seedLandingPages()
    .catch((e) => {
      console.error("❌ Error seeding landing pages:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
