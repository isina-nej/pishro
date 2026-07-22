// @/prisma/seeds/landing-seed.ts

import { PrismaClient } from '@prisma/client';
import { homeAlbumSlides, homeMiniSliderRows } from '../../lib/data/home-album';

const prisma = new PrismaClient();

export async function seedLandingPages() {
  console.log('🌱 Seeding landing pages...');

  await prisma.homeLanding.deleteMany({});
  await prisma.mobileScrollerStep.deleteMany({});
  await prisma.homeSlide.deleteMany({});
  await prisma.homeMiniSlider.deleteMany({});

  const homeLanding = await prisma.homeLanding.create({
    data: {
      mainHeroTitle: 'پیشرو در مسیر سرمایه‌ گذاری هوشمند',
      mainHeroSubtitle: 'آموزش تخصصی بورس و بازارهای مالی',
      mainHeroCta1Text: 'شروع مسیر موفقیت',
      mainHeroCta1Link: '/business-consulting',
      heroTitle: 'پیشرو سرمایه',
      heroSubtitle: 'بزرگترین مؤسسه سرمایه‌ گذاری در ایران',
      heroDescription: 'از آموزش اصولی تا مشاوره حرفه‌ای در بازارهای مالی',
      heroVideoUrl: '/videos/aboutUs.webm',
      heroCta1Text: 'مشاهده دوره‌ها',
      heroCta1Link: '/courses',
      overlayTexts: [
        'پیشرو در مسیر سرمایه‌ گذاری هوشمند',
        'ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.',
        'از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.',
        'پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.',
      ],
      statsData: [
        { label: 'دانشجوی موفق', value: 3000, suffix: '+' },
        { label: 'دوره تخصصی', value: 100, suffix: '+' },
        { label: 'رضایت کاربران', value: 95, suffix: '%' },
        { label: 'سال تجربه', value: 5, suffix: '+' },
      ],
      whyUsTitle: 'چرا پیشرو؟',
      whyUsDescription: 'مزایای آموزش و سرمایه‌ گذاری با پیشرو',
      newsClubTitle: 'باشگاه خبری پیشرو',
      newsClubDescription: 'با عضویت در باشگاه خبری پیشرو، از تازه‌ترین مقالات آموزشی، نکات تخصصی و تحلیل‌های روز دنیای دیجیتال باخبر شوید.',
      calculatorTitle: 'محاسبه سود سرمایه‌ گذاری',
      calculatorDescription: 'سود خود را پیش‌بینی کنید',
      calculatorRateLow: 0.07,
      calculatorRateMedium: 0.08,
      calculatorRateHigh: 0.11,
      calculatorPortfolioLowDesc: 'تضمین اصل سرمایه و سود بازدهی ثابت',
      calculatorPortfolioMediumDesc: 'تضمین اصل سرمایه و سود بازدهی ثابت',
      calculatorPortfolioHighDesc: 'تضمین اصل سرمایه با بازدهی بین ۵ تا ۵۰ درصد',
      calculatorAmountSteps: [1000000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000, 200000000, 300000000, 500000000, 1000000000, 2000000000, 3000000000, 5000000000],
      calculatorDurationSteps: [1, 3, 6, 9, 12],
      calculatorInPersonPhone: '۰۹۱۱۵۸۲۹۷۲۱',
      calculatorOnlineTelegram: '@InvestmentSupport',
      calculatorOnlineTelegramLink: 'https://t.me/amirhossein_v2',
      metaTitle: 'پیشرو | بزرگترین مؤسسه سرمایه‌ گذاری در ایران',
      metaDescription: 'آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری. از آموزش اصولی تا مشاوره حرفه‌ای',
      metaKeywords: ['آموزش بورس', 'سرمایه‌ گذاری', 'بازار مالی', 'مشاوره سرمایه‌ گذاری'],
      published: true,
      order: 0,
    },
  });

  await prisma.mobileScrollerStep.createMany({
    data: [
      { stepNumber: 1, title: 'قدم اول', description: 'با مشاوره‌های تخصصی و آموزش‌های کاربردی، اولین قدم مطمئن در بازار سرمایه را بردارید.', imageUrl: '/images/home/mobile-scroll/in-mobile-1.svg', coverImageUrl: '/images/home/mobile-scroll/mobile.webp', gradient: 'from-blue-400/30 via-indigo-400/20 to-transparent', order: 1, published: true },
      { stepNumber: 2, title: 'قدم دوم', description: 'دسترسی به تحلیل‌های روزانه و فرصت‌های طلایی در بورس و بازارهای نوین.', imageUrl: '/images/home/mobile-scroll/in-mobile-1.svg', coverImageUrl: '/images/home/mobile-scroll/mobile.webp', gradient: 'from-blue-400/30 via-mySecondary-400/20 to-transparent', order: 2, published: true },
      { stepNumber: 3, title: 'قدم سوم', description: 'با استراتژی‌های پیشرفته و ابزارهای مدرن، سبد سرمایه خود را حرفه‌ای مدیریت کنید.', imageUrl: '/images/home/mobile-scroll/in-mobile-1.svg', coverImageUrl: '/images/home/mobile-scroll/mobile.webp', gradient: 'from-amber-400/30 via-orange-400/20 to-transparent', order: 3, published: true },
    ],
  });

  await prisma.homeSlide.createMany({ data: homeAlbumSlides });
  await prisma.homeMiniSlider.createMany({
    data: [
      ...homeMiniSliderRows[1].map((imageUrl, index) => ({ imageUrl, row: 1, order: index + 1, published: true })),
      ...homeMiniSliderRows[2].map((imageUrl, index) => ({ imageUrl, row: 2, order: index + 1, published: true })),
    ],
  });

  console.log(`✅ Home landing created: ${homeLanding.id}`);
  console.log(`✅ Inserted ${homeAlbumSlides.length} home slides and 12 mini slider images`);
  return { created: 5, updated: 0, total: 5 };
}
