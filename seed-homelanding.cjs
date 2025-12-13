// This is a legacy CommonJS script that's not used in the main app
// It can be safely ignored for TypeScript/ESLint checks
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017/pishro');

(async () => {
  try {
    await client.connect();
    const db = client.db('pishro');

    const homeLandingCollection = db.collection('HomeLanding');
    const existing = await homeLandingCollection.findOne({});

    if (!existing) {
      const result = await homeLandingCollection.insertOne({
        mainHeroTitle: 'خوش‌آمدید به پیشرو',
        mainHeroSubtitle: 'یادگیری و سرمایه‌گذاری هوشمند',
        mainHeroCta1Text: 'شروع کنید',
        mainHeroCta1Link: '/',
        heroTitle: 'پیشرو - پلتفرم یادگیری و سرمایه‌گذاری',
        heroSubtitle: 'آموزش تخصصی در حوزه سرمایه‌گذاری و بازار سهام',
        heroDescription: 'با بهترین متخصصان بیاموزید و سرمایه‌گذاری کنید',
        heroVideoUrl: '/videos/hero.mp4',
        heroCta1Text: 'شروع دوره',
        heroCta1Link: '/courses',
        overlayTexts: ['تجربه نو در آموزش', 'معلومات قابل اعتماد', 'متخصصین حوزه'],
        statsData: [
          { label: 'دانشجوی موفق', value: 3000, suffix: '+' },
          { label: 'دوره‌های فعال', value: 50, suffix: '+' },
          { label: 'معلم متخصص', value: 20, suffix: '+' }
        ],
        whyUsTitle: 'چرا ما؟',
        whyUsDescription: 'بهترین انتخاب برای یادگیری و سرمایه‌گذاری',
        featuredCoursesTitle: 'دوره‌های برتر',
        featuredCoursesDescription: 'محبوب‌ترین دوره‌ها را انتخاب کنید',
        testimonialTitle: 'نظرات دانشجویان',
        testimonialDescription: 'تجربیات واقعی از دانشجویان ما',
        ctaTitle: 'آماده‌اید شروع کنید؟',
        ctaDescription: 'امروز به‌ما بپیوندید و یادگیری شروع کنید',
        ctaButtonText: 'ثبت‌نام',
        ctaButtonLink: '/auth/register',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✓ HomeLanding created:', result.insertedId);
    } else {
      console.log('✓ HomeLanding already exists');
    }
  } finally {
    await client.close();
  }
})();
