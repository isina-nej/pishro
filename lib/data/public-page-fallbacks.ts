import type { BusinessConsulting, InvestmentPlan, InvestmentPlans, InvestmentTag } from '@prisma/client';
import type { AboutPageData } from '@/types/about-us';

export const businessConsultingFallback: BusinessConsulting = {
  id: 'business-consulting-fallback',
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
  createdAt: null,
  updatedAt: null,
};

const fallbackInvestmentPlans: InvestmentPlans = {
  id: 'investment-plans-fallback',
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
  createdAt: null,
  updatedAt: null,
};

const fallbackPlans: InvestmentPlan[] = [
  { id: 'fallback-crypto', investmentPlansId: fallbackInvestmentPlans.id, label: 'ارز دیجیتال', icon: 'Bitcoin', description: 'سبد اختصاصی ارزهای دیجیتال', order: 1, published: true, createdAt: null, updatedAt: null },
  { id: 'fallback-stock', investmentPlansId: fallbackInvestmentPlans.id, label: 'بورس', icon: 'LineChart', description: 'سبد سهام بورس تهران', order: 2, published: true, createdAt: null, updatedAt: null },
  { id: 'fallback-mixed', investmentPlansId: fallbackInvestmentPlans.id, label: 'ترکیبی', icon: 'PieChart', description: 'ترکیب بورس و کریپتو', order: 3, published: true, createdAt: null, updatedAt: null },
];

const fallbackTags: InvestmentTag[] = ['تحلیل تکنیکال', 'تحلیل بنیادی', 'بورس تهران', 'ارز دیجیتال', 'فارکس', 'مدیریت ریسک'].map((title, index) => ({
  id: `fallback-tag-${index}`,
  investmentPlansId: fallbackInvestmentPlans.id,
  title,
  color: null,
  icon: null,
  order: index + 1,
  published: true,
  createdAt: null,
  updatedAt: null,
}));

export const investmentPlansFallback = { ...fallbackInvestmentPlans, plans: fallbackPlans, tags: fallbackTags };

export const aboutPageFallback: AboutPageData = {
  heroTitle: 'آکادمی مالی پیشرو سرمایه',
  heroSubtitle: 'با تجربه‌ای بیش از ۵ سال در آموزش و مشاوره بازارهای مالی',
  heroDescription: 'همراه شما در مسیر موفقیت و ثروت‌آفرینی هستیم',
  heroBadgeText: 'پیشرو در آموزش و سرمایه‌ گذاری',
  heroStats: [
    { label: 'دانشجوی موفق', value: 3000, icon: 'LuUsers' },
    { label: 'دوره تخصصی', value: 100, icon: 'LuAward' },
    { label: 'رضایت کاربران', value: 95, icon: 'LuTarget' },
  ],
  resumeItems: [
    { id: 'history', icon: 'LuClock', title: 'تاریخچه', description: 'آکادمی مالی پیشرو سرمایه از سال ۱۴۰۰ با هدف ارتقاء سواد مالی جامعه فعالیت خود را آغاز کرد.', color: 'from-blue-500 to-purple-500', bgColor: 'bg-blue-50', order: 1 },
    { id: 'mission', icon: 'LuTarget', title: 'ماموریت', description: 'ارائه آموزش تخصصی و مشاوره حرفه‌ای با تأکید بر کیفیت و کاربردی بودن محتوا.', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', order: 2 },
    { id: 'vision', icon: 'LuEye', title: 'چشم‌انداز', description: 'تبدیل شدن به معتبرترین مرجع آموزشی و مشاوره‌ای بازارهای مالی در ایران.', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50', order: 3 },
    { id: 'values', icon: 'LuHeart', title: 'ارزش‌ها', description: 'صداقت، شفافیت، تعهد به کیفیت و توجه به نیازهای دانشجویان.', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', order: 4 },
  ],
  teamMembers: [
    { id: 'tahereh-jahani', name: 'طاهره جهانی', role: 'دکترای اقتصاد', image: '/images/about/about.jpg', education: 'دکترای اقتصاد', description: 'تحلیلگر و مدرس بازارهای مالی و مدیرعامل آکادمی پیشرو.', specialties: ['تحلیل بازار', 'معامله‌گری', 'آموزش اقتصاد'], order: 1 },
    { id: 'enayat-momeni', name: 'سید عنایت الله مومنی', role: 'دکترای مدیریت آموزشی', image: '/images/about/about3.jpg', education: 'دکترای مدیریت آموزشی', description: 'مدرس دانشگاه و متخصص بانکداری و مشاوره کسب‌وکار.', specialties: ['مدیریت', 'بانکداری', 'مشاوره کسب و کار'], order: 2 },
  ],
  certificates: [],
  news: [],
  ctaTitle: 'آماده شروع هستید؟',
  ctaDescription: 'همین امروز به جمع دانشجویان پیشرو بپیوندید',
  ctaButtonText: 'شروع کنید',
  ctaButtonLink: '/courses',
};
