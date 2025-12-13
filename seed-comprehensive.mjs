import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/pishro?authSource=admin&directConnection=true';

async function seedAllData() {
  const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
  
  try {
    await client.connect();
    const db = client.db('pishro');
    
    console.log('🌱 Comprehensive Database Seeding...\n');

    // ============ STEP 1: CATEGORIES ============
    console.log('1️⃣  Creating Categories...');
    const categories = [
      { slug: 'courses', title: 'دوره‌های آموزشی', description: 'دوره‌های جامع آموزش', order: 1 },
      { slug: 'news', title: 'اخبار', description: 'آخرین اخبار بازار', order: 2 },
      { slug: 'investment', title: 'سرمایه‌گذاری', description: 'راهنمای سرمایه‌گذاری', order: 3 },
      { slug: 'cryptocurrency', title: 'کریپتوارز', description: 'آموزش کریپتوکارنسی', order: 4 },
      { slug: 'stock-market', title: 'بورس', description: 'آموزش بازار سهام', order: 5 },
    ];

    for (const cat of categories) {
      const exists = await db.collection('Category').findOne({ slug: cat.slug });
      if (!exists) {
        await db.collection('Category').insertOne({
          ...cat,
          icon: '/icons/default.svg',
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    console.log('   ✓ Categories ready\n');

    // ============ STEP 2: HOMELANDDATAING ============
    console.log('2️⃣  Creating HomeLanding...');
    const homeCount = await db.collection('HomeLanding').countDocuments();
    if (homeCount === 0) {
      await db.collection('HomeLanding').insertOne({
        title: 'پیشرو سرمایه',
        mainHeroTitle: 'خوش‌آمدید به پیشرو سرمایه',
        mainHeroSubtitle: 'یادگیری و سرمایه‌گذاری هوشمند',
        metaDescription: 'آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری',
        metaKeywords: ['بورس', 'سرمایه‌گذاری', 'آموزش'],
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ HomeLanding created\n');
    } else {
      console.log('   ✓ HomeLanding already exists\n');
    }

    // ============ STEP 3: ABOUTPAGE ============
    console.log('3️⃣  Creating AboutPage...');
    const aboutCount = await db.collection('AboutPage').countDocuments();
    if (aboutCount === 0) {
      await db.collection('AboutPage').insertOne({
        title: 'درباره پیشرو سرمایه',
        subtitle: 'ما اینجا برای کمک به شما هستیم',
        description: 'پیشرو سرمایه یک پلتفرم آموزشی و سرمایه‌گذاری است که به شما کمک می‌کند تا در دنیای مالی موفق شوید.',
        heroImage: '/images/about-hero.jpg',
        metaTitle: 'درباره ما | پیشرو',
        metaDescription: 'درباره پیشرو سرمایه و تیم آن',
        metaKeywords: ['درباره', 'پیشرو', 'تیم'],
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ AboutPage created\n');
    } else {
      console.log('   ✓ AboutPage already exists\n');
    }

    // ============ STEP 4: INVESTMENTPLANS ============
    console.log('4️⃣  Creating InvestmentPlans...');
    const investmentCount = await db.collection('InvestmentPlans').countDocuments();
    if (investmentCount === 0) {
      await db.collection('InvestmentPlans').insertOne({
        title: 'سبدهای سرمایه‌گذاری',
        description: 'انتخاب سبد سرمایه‌گذاری مناسب برای هدف‌های مالی شما',
        heroImage: '/images/investment-hero.jpg',
        metaTitle: 'سبدهای سرمایه‌گذاری | پیشرو',
        metaDescription: 'سبدهای سرمایه‌گذاری پیشرو',
        metaKeywords: ['سرمایه‌گذاری', 'سبد', 'پلن'],
        minAmount: 1000000,
        maxReturn: 25,
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ InvestmentPlans created\n');
    } else {
      console.log('   ✓ InvestmentPlans already exists\n');
    }

    // ============ STEP 5: BUSINESSCONSULTING ============
    console.log('5️⃣  Creating BusinessConsulting...');
    const busConsCount = await db.collection('BusinessConsulting').countDocuments();
    if (busConsCount === 0) {
      await db.collection('BusinessConsulting').insertOne({
        title: 'مشاوره کسب و کار',
        subtitle: 'مشاوره حرفه‌ای برای توسعه کسب‌و‌کار',
        description: 'خدمات مشاوره‌ای در زمینه کسب‌و‌کار و سرمایه‌گذاری',
        heroImage: '/images/consulting-hero.jpg',
        metaTitle: 'مشاوره کسب و کار | پیشرو',
        metaDescription: 'خدمات مشاوره کسب‌و‌کار و سرمایه‌گذاری',
        metaKeywords: ['مشاوره', 'کسب‌و‌کار'],
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ BusinessConsulting created\n');
    } else {
      console.log('   ✓ BusinessConsulting already exists\n');
    }

    // ============ STEP 6: FAQ ============
    console.log('6️⃣  Creating FAQ...');
    const faqCount = await db.collection('FAQ').countDocuments();
    if (faqCount === 0) {
      await db.collection('FAQ').insertOne({
        _id: new ObjectId(),
        categoryId: new ObjectId(),
        question: 'سوالات متداول',
        answer: 'پاسخ‌های سوالات متداول شما',
        order: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ FAQ created\n');
    } else {
      console.log('   ✓ FAQ already exists\n');
    }

    // ============ STEP 7: SKYROOMCLASSES ============
    console.log('7️⃣  Creating SkyroomClasses...');
    const skyroomCount = await db.collection('SkyroomClass').countDocuments();
    if (skyroomCount === 0) {
      await db.collection('SkyroomClass').insertOne({
        _id: new ObjectId(),
        title: 'کلاس‌های آموزشی',
        description: 'کلاس‌های آموزشی زنده',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        roomId: 'sample-room-id',
        instructorId: new ObjectId(),
        capacity: 100,
        enrolled: 0,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ SkyroomClasses created\n');
    } else {
      console.log('   ✓ SkyroomClasses already exists\n');
    }

    // ============ STEP 8: DIGITALBOOKSETTINGS ============
    console.log('8️⃣  Creating DigitalBook settings...');
    const bookCount = await db.collection('DigitalBook').countDocuments();
    if (bookCount === 0) {
      const cats = await db.collection('Category').find({}).toArray();
      const catId = cats.length > 0 ? cats[0]._id : new ObjectId();
      
      await db.collection('DigitalBook').insertOne({
        _id: new ObjectId(),
        categoryId: catId,
        title: 'کتاب نمونه',
        description: 'کتاب نمونه برای کتابخانه',
        author: 'نویسنده',
        coverImage: '/images/book-cover.jpg',
        pdfUrl: '/pdfs/sample.pdf',
        price: 0,
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ DigitalBook created\n');
    } else {
      console.log('   ✓ DigitalBook already exists\n');
    }

    console.log('✅ All essential data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   - Categories: Ready');
    console.log('   - HomeLanding: Ready');
    console.log('   - AboutPage: Ready');
    console.log('   - InvestmentPlans: Ready');
    console.log('   - BusinessConsulting: Ready');
    console.log('   - FAQ: Ready');
    console.log('   - SkyroomClasses: Ready');
    console.log('   - DigitalBook: Ready\n');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedAllData();
