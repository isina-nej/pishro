const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db();
    const categoriesCollection = db.collection('Category');
    const aboutPageCollection = db.collection('AboutPage');
    const businessConsultingCollection = db.collection('BusinessConsulting');
    const investmentPlansCollection = db.collection('InvestmentPlans');
    
    // ===== CATEGORIES =====
    const categories = [
      {
        title: 'کریپتوکارنسی',
        slug: 'cryptocurrency',
        description: 'یادگیری کامل درباره کریپتوکارنسی و بلاک چین',
        coverImage: '/images/cryptocurrency.jpg',
        heroTitle: 'کریپتوکارنسی و دنیای دیجیتال',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'مشاوره کسب و کار',
        slug: 'business-consulting',
        description: 'مشاوره تخصصی برای رشد و توسعه کسب و کار',
        coverImage: '/images/business-consulting/landing.jpg',
        heroTitle: 'مشاوره کسب و کار',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'درباره ما',
        slug: 'about-us',
        description: 'درباره تیم و ماموریت پیشرو',
        coverImage: '/images/about-us.jpg',
        heroTitle: 'درباره پیشرو',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'سفارش های سرمایه گذاری',
        slug: 'investment-plans',
        description: 'طرح های سرمایه گذاری برای رشد ثروت شما',
        coverImage: '/images/investment-plans/landing.jpg',
        heroTitle: 'سفارش های سرمایه گذاری',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // ===== BUSINESS CONSULTING DATA =====
    const businessConsultingData = {
      title: 'مشاوره کسب و کار',
      description: 'راهنمایی تخصصی برای راه‌اندازی و توسعه کسب‌وکار شما',
      image: '/images/business-consulting/landing.jpg',
      phoneNumber: '+98-21-XXXXX',
      telegramLink: 'https://t.me/pishro',
      metaTitle: 'مشاوره کسب و کار | پیشرو',
      metaDescription: 'دریافت مشاوره تخصصی کسب و کار و راه‌اندازی استارتاپ',
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ===== ABOUT PAGE DATA =====
    const aboutPageData = {
      title: 'درباره ما',
      description: 'درباره تیم و ماموریت مؤسسه پیشرو',
      image: '/images/about-us.jpg',
      headerTitle: 'درباره مؤسسه پیشرو',
      headerDescription: 'تاریخچه و مسیر رشد پیشرو',
      metaTitle: 'درباره ما | پیشرو',
      metaDescription: 'آشنایی با تیم و ماموریت مؤسسه پیشرو',
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ===== INVESTMENT PLANS DATA =====
    const investmentPlansData = {
      title: 'سفارش های سرمایه گذاری',
      description: 'سفارش‌های سرمایه‌گذاری متناسب با سطح ریسک و هدف شما',
      image: '/images/investment-plans/landing.jpg',
      plansIntroCards: [],
      minAmount: 10,
      maxAmount: 10000,
      amountStep: 10,
      metaTitle: 'سفارش های سرمایه گذاری | پیشرو',
      metaDescription: 'طرح های سرمایه گذاری برای رشد ثروت شما',
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('\n✓ Processing Categories...\n');
    let created = 0;
    let updated = 0;

    for (const cat of categories) {
      try {
        const result = await categoriesCollection.updateOne(
          { slug: cat.slug },
          { $set: cat },
          { upsert: true }
        );
        
        if (result.upsertedId) {
          console.log('[✓] Created: ' + cat.slug);
          created++;
        } else {
          console.log('[✓] Updated: ' + cat.slug);
          updated++;
        }
      } catch (err) {
        console.error('[✗] Error with ' + cat.slug + ': ' + err.message);
      }
    }
    
    console.log('\n✓ Processing Business Consulting...\n');
    try {
      await businessConsultingCollection.updateOne(
        { title: 'مشاوره کسب و کار' },
        { $set: businessConsultingData },
        { upsert: true }
      );
      console.log('[✓] Business Consulting: Ready');
    } catch (err) {
      console.error('[✗] Business Consulting Error: ' + err.message);
    }

    console.log('\n✓ Processing About Page...\n');
    try {
      await aboutPageCollection.updateOne(
        { title: 'درباره ما' },
        { $set: aboutPageData },
        { upsert: true }
      );
      console.log('[✓] About Page: Ready');
    } catch (err) {
      console.error('[✗] About Page Error: ' + err.message);
    }

    console.log('\n✓ Processing Investment Plans...\n');
    try {
      await investmentPlansCollection.updateOne(
        { title: 'سفارش های سرمایه گذاری' },
        { $set: investmentPlansData },
        { upsert: true }
      );
      console.log('[✓] Investment Plans: Ready');
    } catch (err) {
      console.error('[✗] Investment Plans Error: ' + err.message);
    }

    console.log('\n--- Summary ---');
    console.log('Created: ' + created);
    console.log('Updated: ' + updated);
    console.log('\n✓ All data ready!');
    
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
