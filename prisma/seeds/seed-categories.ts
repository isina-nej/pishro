/**
 * Seed Categories
 * Creates category records with Persian content and SEO metadata
 */

import { PrismaClient } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

// Define categories with full metadata
const CATEGORIES_DATA = [
  {
    slug: 'stock-market',
    title: 'بورس و سهام',
    description: 'آموزش جامع بورس، تحلیل سهام و استراتژی‌های سرمایه‌گذاری در بازار سرمایه',
    icon: '📈',
    color: '#3B82F6',
    coverImage: 'https://picsum.photos/seed/cat-stock/1200/400',
    metaTitle: 'آموزش بورس و سهام - راهنمای کامل سرمایه‌گذاری',
    metaDescription: 'یادگیری تحلیل تکنیکال و بنیادی، استراتژی‌های نوسان‌گیری و سرمایه‌گذاری بلندمدت در بورس',
    metaKeywords: ['بورس', 'سهام', 'تحلیل تکنیکال', 'سرمایه‌گذاری'],
    heroTitle: 'استاد بازار بورس شوید',
    heroSubtitle: 'از صفر تا صد سرمایه‌گذاری حرفه‌ای',
    heroDescription: 'با آموزش‌های گام به گام، تحلیل‌های دقیق و استراتژی‌های عملی، مسیر موفقیت در بورس را هموار کنید.',
    heroImage: 'https://picsum.photos/seed/hero-stock/1920/1080',
    heroCta1Text: 'شروع یادگیری',
    heroCta1Link: '/courses?category=stock-market',
    heroCta2Text: 'مشاهده دوره‌ها',
    heroCta2Link: '/courses',
    aboutTitle1: 'چرا یادگیری بورس؟',
    aboutTitle2: 'فرصتی برای آینده مالی بهتر',
    aboutDescription: 'بازار بورس یکی از بهترین راه‌های کسب درآمد پایدار و رشد سرمایه است. با آموزش اصولی و تمرین مداوم، می‌توانید به یک سرمایه‌گذار موفق تبدیل شوید.',
    aboutImage: 'https://picsum.photos/seed/about-stock/800/600',
    aboutCta1Text: 'دوره‌های رایگان',
    aboutCta1Link: '/courses?free=true',
    aboutCta2Text: 'مشاوره رایگان',
    aboutCta2Link: '/contact',
    statsBoxes: JSON.stringify([
      { text: 'دوره آموزشی', number: '50+', icon: '📚' },
      { text: 'دانشجو فعال', number: '10K+', icon: '👨‍🎓' },
      { text: 'ساعت ویدیو', number: '500+', icon: '🎥' },
      { text: 'رضایت کاربران', number: '95%', icon: '⭐' }
    ]),
    enableUserLevelSection: true,
    published: true,
    featured: true,
    order: 1
  },
  {
    slug: 'cryptocurrency',
    title: 'ارز دیجیتال',
    description: 'آموزش کامل ارزهای دیجیتال، بلاکچین، بیت‌کوین و استراتژی‌های ترید کریپتو',
    icon: '₿',
    color: '#F59E0B',
    coverImage: 'https://picsum.photos/seed/cat-crypto/1200/400',
    metaTitle: 'آموزش ارز دیجیتال و کریپتوکارنسی - از مبتدی تا حرفه‌ای',
    metaDescription: 'یادگیری خرید، فروش و معامله ارزهای دیجیتال، بلاکچین و تکنولوژی رمزارزها',
    metaKeywords: ['ارز دیجیتال', 'بیت‌کوین', 'اتریوم', 'بلاکچین', 'کریپتو'],
    heroTitle: 'دنیای ارزهای دیجیتال',
    heroSubtitle: 'سرمایه‌گذاری در آینده',
    heroDescription: 'با آموزش تخصصی کریپتوکارنسی، وارد دنیای هیجان‌انگیز ارزهای دیجیتال شوید و در انقلاب مالی نوین شرکت کنید.',
    heroImage: 'https://picsum.photos/seed/hero-crypto/1920/1080',
    heroCta1Text: 'شروع رایگان',
    heroCta1Link: '/courses?category=cryptocurrency',
    heroCta2Text: 'بیشتر بدانید',
    heroCta2Link: '/about',
    aboutTitle1: 'آینده مالی جهان',
    aboutTitle2: 'انقلاب دیجیتال پول',
    aboutDescription: 'ارزهای دیجیتال در حال تغییر چهره اقتصاد جهانی هستند. با یادگیری این تکنولوژی، می‌توانید از فرصت‌های بی‌نظیر سرمایه‌گذاری بهره‌مند شوید.',
    aboutImage: 'https://picsum.photos/seed/about-crypto/800/600',
    aboutCta1Text: 'راهنمای مبتدیان',
    aboutCta1Link: '/guide/crypto-basics',
    aboutCta2Text: 'دوره‌های پیشرفته',
    aboutCta2Link: '/courses?level=advanced',
    statsBoxes: JSON.stringify([
      { text: 'ارز دیجیتال', number: '100+', icon: '💎' },
      { text: 'معامله‌گر', number: '5K+', icon: '📊' },
      { text: 'دوره تخصصی', number: '30+', icon: '🎓' },
      { text: 'موفقیت', number: '92%', icon: '🚀' }
    ]),
    enableUserLevelSection: true,
    published: true,
    featured: true,
    order: 2
  },
  {
    slug: 'forex',
    title: 'فارکس',
    description: 'آموزش معامله در بازار فارکس، جفت ارزها و استراتژی‌های معاملاتی',
    icon: '💱',
    color: '#10B981',
    coverImage: 'https://picsum.photos/seed/cat-forex/1200/400',
    metaTitle: 'آموزش فارکس - معامله‌گری در بازار ارز',
    metaDescription: 'یادگیری تحلیل و معامله در بازار جهانی ارز (Forex) با استراتژی‌های حرفه‌ای',
    metaKeywords: ['فارکس', 'معامله ارز', 'تحلیل فارکس', 'استراتژی فارکس'],
    heroTitle: 'معامله‌گری در بزرگترین بازار مالی',
    heroSubtitle: 'بازار جهانی ارز',
    heroDescription: 'فارکس بزرگترین و نقدشونده‌ترین بازار مالی جهان است. با آموزش تخصصی، مهارت‌های لازم برای موفقیت را کسب کنید.',
    heroImage: 'https://picsum.photos/seed/hero-forex/1920/1080',
    heroCta1Text: 'شروع آموزش',
    heroCta1Link: '/courses?category=forex',
    heroCta2Text: 'حساب دمو',
    heroCta2Link: '/demo',
    aboutTitle1: 'بازار 24 ساعته',
    aboutTitle2: 'فرصت‌های بی‌پایان',
    aboutDescription: 'با حجم معاملات روزانه بیش از 6 تریلیون دلار، فارکس فرصت‌های فراوانی برای معامله‌گران فراهم می‌کند.',
    aboutImage: 'https://picsum.photos/seed/about-forex/800/600',
    aboutCta1Text: 'آموزش رایگان',
    aboutCta1Link: '/courses?free=true&category=forex',
    aboutCta2Text: 'استراتژی‌ها',
    aboutCta2Link: '/strategies',
    statsBoxes: JSON.stringify([
      { text: 'جفت ارز', number: '50+', icon: '💵' },
      { text: 'تریدر', number: '3K+', icon: '👤' },
      { text: 'استراتژی', number: '20+', icon: '📈' },
      { text: 'نرخ موفقیت', number: '88%', icon: '✅' }
    ]),
    enableUserLevelSection: true,
    published: true,
    featured: true,
    order: 3
  },
  {
    slug: 'technical-analysis',
    title: 'تحلیل تکنیکال',
    description: 'آموزش کامل تحلیل تکنیکال، اندیکاتورها، الگوهای قیمت و نمودارها',
    icon: '📊',
    color: '#8B5CF6',
    coverImage: 'https://picsum.photos/seed/cat-technical/1200/400',
    metaTitle: 'آموزش تحلیل تکنیکال - راهنمای جامع',
    metaDescription: 'یادگیری تحلیل نمودار، اندیکاتورها، الگوهای کندلی و استراتژی‌های تحلیل تکنیکال',
    metaKeywords: ['تحلیل تکنیکال', 'اندیکاتور', 'کندل استیک', 'نمودار'],
    heroTitle: 'هنر پیش‌بینی بازار',
    heroSubtitle: 'تحلیل تکنیکال حرفه‌ای',
    heroDescription: 'با تسلط بر تحلیل تکنیکال، می‌توانید روند بازار را پیش‌بینی کرده و تصمیمات معاملاتی بهتری بگیرید.',
    heroImage: 'https://picsum.photos/seed/hero-technical/1920/1080',
    heroCta1Text: 'آموزش ببینید',
    heroCta1Link: '/courses?category=technical-analysis',
    heroCta2Text: 'کتاب‌خانه',
    heroCta2Link: '/library',
    aboutTitle1: 'علم تحلیل قیمت',
    aboutTitle2: 'ابزارهای معامله‌گری',
    aboutDescription: 'تحلیل تکنیکال مهم‌ترین ابزار هر معامله‌گر است. الگوها، اندیکاتورها و سطوح حمایت و مقاومت را بشناسید.',
    aboutImage: 'https://picsum.photos/seed/about-technical/800/600',
    aboutCta1Text: 'دوره مبتدی',
    aboutCta1Link: '/courses?level=beginner',
    aboutCta2Text: 'دوره پیشرفته',
    aboutCta2Link: '/courses?level=advanced',
    statsBoxes: JSON.stringify([
      { text: 'الگوی قیمت', number: '100+', icon: '📉' },
      { text: 'اندیکاتور', number: '50+', icon: '📊' },
      { text: 'استراتژی', number: '30+', icon: '🎯' },
      { text: 'دقت تحلیل', number: '90%', icon: '🎯' }
    ]),
    enableUserLevelSection: true,
    published: true,
    featured: false,
    order: 4
  },
  {
    slug: 'fundamental-analysis',
    title: 'تحلیل بنیادی',
    description: 'آموزش تحلیل بنیادی شرکت‌ها، صورت‌های مالی و ارزش‌گذاری سهام',
    icon: '📑',
    color: '#EF4444',
    coverImage: 'https://picsum.photos/seed/cat-fundamental/1200/400',
    metaTitle: 'آموزش تحلیل بنیادی - ارزش‌گذاری سهام',
    metaDescription: 'یادگیری تحلیل صورت‌های مالی، نسبت‌های مالی و ارزیابی ارزش ذاتی سهام',
    metaKeywords: ['تحلیل بنیادی', 'صورت مالی', 'ارزش‌گذاری', 'نسبت‌های مالی'],
    heroTitle: 'سرمایه‌گذاری هوشمندانه',
    heroSubtitle: 'تحلیل بنیادی و ارزش‌گذاری',
    heroDescription: 'با تحلیل بنیادی، ارزش واقعی شرکت‌ها را بشناسید و سرمایه‌گذاری‌های بلندمدت و سودآور انجام دهید.',
    heroImage: 'https://picsum.photos/seed/hero-fundamental/1920/1080',
    heroCta1Text: 'شروع کنید',
    heroCta1Link: '/courses?category=fundamental-analysis',
    heroCta2Text: 'مقالات',
    heroCta2Link: '/news',
    aboutTitle1: 'ارزش واقعی',
    aboutTitle2: 'سرمایه‌گذاری علمی',
    aboutDescription: 'تحلیل بنیادی به شما کمک می‌کند تا شرکت‌های ارزشمند را شناسایی کرده و سرمایه‌گذاری‌های بلندمدت موفق داشته باشید.',
    aboutImage: 'https://picsum.photos/seed/about-fundamental/800/600',
    aboutCta1Text: 'آموزش صفر تا صد',
    aboutCta1Link: '/courses/fundamental-basics',
    aboutCta2Text: 'ابزارها',
    aboutCta2Link: '/tools',
    statsBoxes: JSON.stringify([
      { text: 'نسبت مالی', number: '40+', icon: '🔢' },
      { text: 'شرکت تحلیل شده', number: '200+', icon: '🏢' },
      { text: 'گزارش مالی', number: '500+', icon: '📊' },
      { text: 'دقت', number: '93%', icon: '✔️' }
    ]),
    enableUserLevelSection: true,
    published: true,
    featured: false,
    order: 5
  },
  {
    slug: 'risk-management',
    title: 'مدیریت ریسک',
    description: 'آموزش اصول مدیریت ریسک، حد ضرر، حد سود و مدیریت سرمایه',
    icon: '🛡️',
    color: '#06B6D4',
    coverImage: 'https://picsum.photos/seed/cat-risk/1200/400',
    metaTitle: 'آموزش مدیریت ریسک - حفاظت از سرمایه',
    metaDescription: 'یادگیری اصول مدیریت ریسک، تعیین حد ضرر و سود، و استراتژی‌های کنترل ریسک',
    metaKeywords: ['مدیریت ریسک', 'حد ضرر', 'مدیریت سرمایه', 'کنترل ریسک'],
    heroTitle: 'حفاظت از سرمایه شما',
    heroSubtitle: 'مدیریت حرفه‌ای ریسک',
    heroDescription: 'بدون مدیریت ریسک، هیچ استراتژی معاملاتی موفق نخواهد بود. یاد بگیرید چگونه سرمایه خود را محافظت کنید.',
    heroImage: 'https://picsum.photos/seed/hero-risk/1920/1080',
    heroCta1Text: 'یادگیری',
    heroCta1Link: '/courses?category=risk-management',
    heroCta2Text: 'ماشین حساب ریسک',
    heroCta2Link: '/tools/risk-calculator',
    aboutTitle1: 'اولویت اول',
    aboutTitle2: 'محافظت از سرمایه',
    aboutDescription: 'مدیریت صحیح ریسک می‌تواند تفاوت بین موفقیت و شکست در بازارهای مالی باشد. این مهارت را فرا بگیرید.',
    aboutImage: 'https://picsum.photos/seed/about-risk/800/600',
    aboutCta1Text: 'دوره پایه',
    aboutCta1Link: '/courses/risk-basics',
    aboutCta2Text: 'دوره پیشرفته',
    aboutCta2Link: '/courses/advanced-risk',
    statsBoxes: JSON.stringify([
      { text: 'استراتژی', number: '15+', icon: '🎯' },
      { text: 'کاربر موفق', number: '8K+', icon: '👥' },
      { text: 'ابزار', number: '10+', icon: '🛠️' },
      { text: 'کاهش ضرر', number: '70%', icon: '📉' }
    ]),
    enableUserLevelSection: false,
    published: true,
    featured: false,
    order: 6
  },
  {
    slug: 'trading-psychology',
    title: 'روانشناسی معامله‌گری',
    description: 'آموزش کنترل احساسات، مدیریت استرس و روانشناسی بازارهای مالی',
    icon: '🧠',
    color: '#EC4899',
    coverImage: 'https://picsum.photos/seed/cat-psychology/1200/400',
    metaTitle: 'روانشناسی معامله‌گری - کنترل احساسات در بازار',
    metaDescription: 'یادگیری کنترل ترس و طمع، مدیریت استرس معاملاتی و تقویت ذهنیت موفق',
    metaKeywords: ['روانشناسی معامله‌گری', 'کنترل احساسات', 'استرس', 'ذهنیت'],
    heroTitle: 'قدرت ذهن',
    heroSubtitle: 'روانشناسی موفقیت در بازار',
    heroDescription: '80% موفقیت در معامله‌گری مربوط به روانشناسی است. یاد بگیرید چگونه ذهن خود را کنترل کنید.',
    heroImage: 'https://picsum.photos/seed/hero-psychology/1920/1080',
    heroCta1Text: 'شروع آموزش',
    heroCta1Link: '/courses?category=trading-psychology',
    heroCta2Text: 'تست روانشناسی',
    heroCta2Link: '/tools/psychology-test',
    aboutTitle1: 'عامل اصلی موفقیت',
    aboutTitle2: 'کنترل ذهن و احساسات',
    aboutDescription: 'بسیاری از معامله‌گران با وجود دانش فنی، به دلیل ضعف روانی شکست می‌خورند. این مهارت حیاتی را فرا بگیرید.',
    aboutImage: 'https://picsum.photos/seed/about-psychology/800/600',
    aboutCta1Text: 'دوره کامل',
    aboutCta1Link: '/courses/psychology-complete',
    aboutCta2Text: 'کتاب توصیه‌شده',
    aboutCta2Link: '/library?tag=psychology',
    statsBoxes: JSON.stringify([
      { text: 'تکنیک روانی', number: '25+', icon: '🧘' },
      { text: 'معامله‌گر', number: '6K+', icon: '👨‍💼' },
      { text: 'موفقیت', number: '85%', icon: '🏆' },
      { text: 'کنترل استرس', number: '90%', icon: '😌' }
    ]),
    enableUserLevelSection: false,
    published: true,
    featured: false,
    order: 7
  },
  {
    slug: 'investment',
    title: 'سرمایه‌گذاری',
    description: 'آموزش سرمایه‌گذاری بلندمدت، تنوع‌بخشی و استراتژی‌های سرمایه‌گذاری',
    icon: '💰',
    color: '#84CC16',
    coverImage: 'https://picsum.photos/seed/cat-investment/1200/400',
    metaTitle: 'آموزش سرمایه‌گذاری - از مبتدی تا حرفه‌ای',
    metaDescription: 'یادگیری اصول سرمایه‌گذاری هوشمند، مدیریت سبد و استراتژی‌های بلندمدت',
    metaKeywords: ['سرمایه‌گذاری', 'سبد سرمایه', 'تنوع‌بخشی', 'سود پایدار'],
    heroTitle: 'سرمایه‌گذاری هوشمند',
    heroSubtitle: 'رشد پایدار سرمایه',
    heroDescription: 'با یادگیری اصول سرمایه‌گذاری، می‌توانید ثروت خود را به صورت پایدار و بلندمدت رشد دهید.',
    heroImage: 'https://picsum.photos/seed/hero-investment/1920/1080',
    heroCta1Text: 'شروع یادگیری',
    heroCta1Link: '/courses?category=investment',
    heroCta2Text: 'مشاوره سرمایه‌گذاری',
    heroCta2Link: '/consultation',
    aboutTitle1: 'آزادی مالی',
    aboutTitle2: 'سرمایه‌گذاری علمی',
    aboutDescription: 'سرمایه‌گذاری صحیح نیازمند دانش، صبر و برنامه‌ریزی است. با استراتژی‌های مناسب، به اهداف مالی خود برسید.',
    aboutImage: 'https://picsum.photos/seed/about-investment/800/600',
    aboutCta1Text: 'راهنمای مبتدیان',
    aboutCta1Link: '/guide/investment-basics',
    aboutCta2Text: 'استراتژی‌های پیشرفته',
    aboutCta2Link: '/strategies/advanced',
    statsBoxes: JSON.stringify([
      { text: 'سبد نمونه', number: '20+', icon: '💼' },
      { text: 'سرمایه‌گذار', number: '12K+', icon: '👥' },
      { text: 'بازدهی متوسط', number: '35%', icon: '📈' },
      { text: 'رضایت', number: '96%', icon: '⭐' }
    ]),
    enableUserLevelSection: true,
    published: true,
    featured: false,
    order: 8
  }
];

/**
 * Seed categories into the database
 * Uses upsert to ensure idempotency
 */
export async function seedCategories() {
  console.log('🌱 Starting to seed categories...');

  try {
    let created = 0;
    let updated = 0;

    for (const categoryData of CATEGORIES_DATA) {
      const result = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
      } else {
        updated++;
      }

      console.log(`  ✓ Category: ${categoryData.title} (${categoryData.slug})`);
    }

    console.log(`\n✅ Categories seeded successfully!`);
    console.log(`   📝 Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   📊 Total: ${CATEGORIES_DATA.length}`);

    return { created, updated, total: CATEGORIES_DATA.length };
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

// Run directly if called as main module
if (require.main === module) {
  seedCategories()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
