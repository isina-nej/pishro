// @/prisma/seeds/landing-seed.ts

import { PrismaClient } from '@prisma/client';
import { homeAlbumSlides, homeMiniSliderRows } from '../../lib/data/home-album';

const prisma = new PrismaClient();

export async function seedLandingPages() {
  console.log('🌱 Seeding landing pages...');

  await prisma.certificate.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.resumeItem.deleteMany({});
  await prisma.aboutPage.deleteMany({});
  await prisma.businessConsulting.deleteMany({});
  await prisma.investmentTag.deleteMany({});
  await prisma.investmentPlan.deleteMany({});
  await prisma.investmentPlans.deleteMany({});
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

  const aboutPage = await prisma.aboutPage.create({
    data: {
      heroTitle: 'آکادمی مالی پیشرو سرمایه',
      heroSubtitle: 'با تجربه‌ای بیش از ۵ سال در زمینه آموزش و مشاوره بازارهای مالی',
      heroDescription: 'همراه شما در مسیر موفقیت و ثروت‌آفرینی هستیم',
      heroBadgeText: 'پیشرو در آموزش و سرمایه‌ گذاری',
      heroStats: [
        { label: 'دانشجوی موفق', value: 3000, icon: 'LuUsers' },
        { label: 'دوره تخصصی', value: 100, icon: 'LuAward' },
        { label: 'رضایت کاربران', value: 95, icon: 'LuTarget' },
      ],
      resumeTitle: 'درباره پیشرو',
      resumeSubtitle: 'مسیر ما در خدمت به شما',
      teamTitle: 'تیم ما',
      teamSubtitle: 'بانیان و مدیران آکادمی مالی پیشرو',
      certificatesTitle: 'افتخارات و تقدیرنامه‌ها',
      certificatesSubtitle: 'دستاوردهای ما در مسیر خدمت‌رسانی',
      newsTitle: 'اخبار پیشرو',
      newsSubtitle: 'آخرین اخبار و رویدادهای آکادمی',
      ctaTitle: 'آماده شروع هستید؟',
      ctaDescription: 'همین امروز به جمع هزاران دانشجوی موفق پیشرو بپیوندید',
      ctaButtonText: 'شروع کنید',
      ctaButtonLink: '/courses',
      metaTitle: 'درباره ما - آکادمی مالی پیشرو سرمایه',
      metaDescription: 'آشنایی با تیم، تاریخچه و ماموریت آکادمی مالی پیشرو سرمایه',
      metaKeywords: ['درباره پیشرو', 'تیم پیشرو', 'آکادمی مالی'],
      published: true,
    },
  });

  await prisma.resumeItem.createMany({
    data: [
      { aboutPageId: aboutPage.id, icon: 'LuClock', title: 'تاریخچه', description: 'آکادمی مالی پیشرو سرمایه از سال ۱۴۰۰ فعالیت خود را با هدف ارتقاء سواد مالی جامعه آغاز کرد.', color: 'from-blue-500 to-purple-500', bgColor: 'bg-blue-50', order: 1, published: true },
      { aboutPageId: aboutPage.id, icon: 'LuTarget', title: 'ماموریت', description: 'ارائه آموزش‌های تخصصی و مشاوره‌های حرفه‌ای بازارهای مالی با تأکید بر کیفیت و کاربردی بودن محتوا.', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', order: 2, published: true },
      { aboutPageId: aboutPage.id, icon: 'LuEye', title: 'چشم‌انداز', description: 'تبدیل شدن به معتبرترین مرجع آموزشی و مشاوره‌ای بازارهای مالی در ایران و منطقه.', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50', order: 3, published: true },
      { aboutPageId: aboutPage.id, icon: 'LuHeart', title: 'ارزش‌ها', description: 'صداقت، شفافیت، تعهد به کیفیت، نوآوری و توجه به نیازهای دانشجویان اصول بنیادین ما هستند.', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', order: 4, published: true },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      { aboutPageId: aboutPage.id, name: 'طاهره جهانی', role: 'دکترای اقتصاد (گرایش اقتصاد سنجی)', image: '/images/about/about.jpg', education: 'دکترای اقتصاد', description: 'کارشناس، تحلیلگر و مدرس بازارهای مالی و مدیرعامل آکادمی مالی پیشرو سرمایه.', specialties: ['تحلیل بازار', 'معامله‌گری', 'آموزش اقتصاد'], order: 1, published: true },
      { aboutPageId: aboutPage.id, name: 'سید عنایت الله مومنی', role: 'دکترای مدیریت آموزشی', image: '/images/about/about3.jpg', education: 'دکترای مدیریت آموزشی', description: 'مدرس دانشگاه و متخصص بانکداری، مدیریت، شبکه‌سازی و مشاوره کسب‌وکار.', specialties: ['مدیریت', 'بانکداری', 'مشاوره کسب و کار'], order: 2, published: true },
    ],
  });

  await prisma.businessConsulting.create({
    data: {
      title: 'مشاوره کسب وکار پیشرو',
      description: 'در بخش مشاوره کسب‌وکار همراه شماییم تا مسیر رشد و توسعه را هموار کنیم. راهکارهای ما بر پایه تجربه، تحلیل داده‌محور و شناخت فضای کسب‌وکار امروز شکل گرفته‌اند.',
      image: '/images/investment-consulting/landing.jpg',
      phoneNumber: '۰۹۱۱۵۸۲۹۷۲۱',
      telegramId: '@InvestmentSupport',
      telegramLink: 'https://t.me/amirhossein_v2',
      coursesLink: '/courses',
      inPersonTitle: 'مشاوره حضوری',
      inPersonDescription: 'برای رزرو مشاوره حضوری با ما تماس بگیرید',
      onlineTitle: 'مشاوره آنلاین',
      onlineDescription: 'برای دریافت مشاوره آنلاین از طریق تلگرام پیام دهید',
      coursesTitle: 'دوره‌های آموزشی',
      coursesDescription: 'برای مشاهده دوره‌های ما کلیک کنید',
      metaTitle: 'مشاوره کسب و کار - پیشرو',
      metaDescription: 'مشاوره تخصصی کسب و کار و سرمایه‌ گذاری با تیم پیشرو',
      metaKeywords: ['مشاوره', 'کسب و کار', 'سرمایه‌ گذاری'],
      published: true,
    },
  });

  const investmentPlans = await prisma.investmentPlans.create({
    data: {
      title: 'سبد های سرمایه گذاری پیشرو',
      description: 'هر سبد سرمایه‌ گذاری با تکیه بر تحلیل‌های کمّی، مدیریت ریسک و ارزیابی جامع بازار تدوین می‌شود تا مسیر باثبات‌تری برای رشد سرمایه فراهم کند.',
      image: '/images/investment-plans/landing.jpg',
      plansIntroCards: [
        { title: 'مدیریت سرمایه', description: 'تقسیم سرمایه، ریسک به ریوارد و جلوگیری از ضررهای بزرگ' },
        { title: 'تحلیل بنیادی', description: 'بررسی صورت‌های مالی و تحلیل ارزش ذاتی' },
        { title: 'استراتژی ورود و خروج', description: 'تعیین نقاط مناسب خرید و فروش' },
      ],
      minAmount: 10,
      maxAmount: 10000,
      amountStep: 10,
      metaTitle: 'سبدهای سرمایه‌ گذاری - پیشرو',
      metaDescription: 'سبدهای سرمایه‌ گذاری شخصی‌سازی شده برای بورس و ارز دیجیتال',
      metaKeywords: ['سبد سرمایه‌ گذاری', 'پورتفولیو', 'تنوع سرمایه'],
      published: true,
    },
  });

  await prisma.investmentPlan.createMany({
    data: [
      { investmentPlansId: investmentPlans.id, label: 'ارز دیجیتال', icon: 'Bitcoin', description: 'سبد اختصاصی ارزهای دیجیتال', order: 1, published: true },
      { investmentPlansId: investmentPlans.id, label: 'بورس', icon: 'LineChart', description: 'سبد سهام بورس تهران', order: 2, published: true },
      { investmentPlansId: investmentPlans.id, label: 'ترکیبی', icon: 'PieChart', description: 'ترکیب بورس و کریپتو', order: 3, published: true },
    ],
  });

  await prisma.investmentTag.createMany({
    data: ['تحلیل تکنیکال', 'تحلیل بنیادی', 'بورس تهران', 'ارز دیجیتال', 'فارکس', 'سهام بلندمدت', 'صندوق‌های سرمایه‌ گذاری', 'اوراق قرضه', 'مدیریت ریسک', 'تنوع سبد سرمایه‌ گذاری'].map((title, index) => ({ investmentPlansId: investmentPlans.id, title, order: index + 1, published: true })),
  });

  const created = 1 + 3 + homeAlbumSlides.length + 12 + 1 + 4 + 2 + 1 + 1 + 3 + 10;
  console.log(`✅ Home landing created: ${homeLanding.id}`);
  console.log(`✅ Inserted ${homeAlbumSlides.length} home slides and 12 mini slider images`);
  console.log('✅ About, business consulting, and investment plans pages created');
  return { created, updated: 0, total: created };
}
