import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Inserting home landing data...");

  const homeLanding = await prisma.homeLanding.upsert({
    where: { id: "home-landing-1" },
    update: {},
    create: {
      id: "home-landing-1",
      // Main Hero
      mainHeroTitle: "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
      mainHeroSubtitle: "آموزش تخصصی بورس و بازارهای مالی",
      mainHeroCta1Text: "شروع مسیر موفقیت",
      mainHeroCta1Link: "/business-consulting",

      // Hero Section
      heroTitle: "پیشرو سرمایه",
      heroSubtitle: "بزرگترین مؤسسه سرمایه‌ گذاری در ایران",
      heroDescription: "از آموزش اصولی تا مشاوره حرفه‌ای در بازارهای مالی",
      heroVideoUrl: "/videos/aboutUs.webm",
      heroCta1Text: "مشاهده دوره‌ها",
      heroCta1Link: "/courses",

      // Overlay Texts
      overlayTexts: [
        "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
        "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.",
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
      whyUsDescription: "مزایای آموزش و سرمایه‌ گذاری با پیشرو",
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
          text: "راهنمایی حرفه‌ای در مسیر سرمایه‌ گذاری",
          btnLabel: "درخواست مشاوره",
          btnHref: "/business-consulting",
          imagePath: "/images/home/why-us-2.jpg",
        },
        {
          label: "سبدهای سرمایه‌ گذاری",
          title: "سبدهای متنوع",
          text: "سبدهای مختلف برای انواع سرمایه‌ گذاری",
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
      calculatorTitle: "محاسبه سود سرمایه‌ گذاری",
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
      calculatorInPersonPhone: "۰۹۱۱۵۸۲۹۷۲۱",
      calculatorOnlineTelegram: "@InvestmentSupport",
      calculatorOnlineTelegramLink: "https://t.me/amirhossein_v2",
    },
  });

  console.log("✅ Home landing data inserted successfully!");
  console.log(homeLanding);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
