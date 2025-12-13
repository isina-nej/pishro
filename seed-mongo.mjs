import { MongoClient } from 'mongodb';

// Prefer environment variable (MONGO_URL or DATABASE_URL) so we can run seeds
// against authenticated or remote Mongo instances without editing the file.
const MONGO_URL = process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/pishro';

async function seedDatabase() {
  const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
  
  try {
    await client.connect();
    const db = client.db('pishro');
    
    console.log('🌱 Seeding database with MongoDB native driver...\n');

    // 1. Create HomeLanding
    console.log('1️⃣  Creating HomeLanding...');
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

    // 2. Create Categories
    console.log('2️⃣  Creating Categories...');
    const categories = [
      { slug: 'courses', title: 'دوره‌های آموزشی', description: 'دوره‌های جامع آموزش', order: 1 },
      { slug: 'news', title: 'اخبار', description: 'آخرین اخبار بازار', order: 2 },
      { slug: 'investment', title: 'سرمایه‌گذاری', description: 'راهنمای سرمایه‌گذاری', order: 3 },
      { slug: 'about', title: 'درباره ما', description: 'صفحه درباره ما', order: 4 },
      { slug: 'faq', title: 'سوالات متداول', description: 'پرسش‌های متداول', order: 5 },
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
    console.log('   ✓ Categories created/verified\n');

    // 3. Create AboutPage data
    console.log('3️⃣  Creating AboutPage...');
    const aboutCount = await db.collection('AboutPage').countDocuments();
    if (aboutCount === 0) {
      await db.collection('AboutPage').insertOne({
        title: 'درباره پیشرو سرمایه',
        subtitle: 'ما اینجا برای کمک به شما هستیم',
        description: 'پیشرو سرمایه یک پلتفرم آموزشی و سرمایه‌گذاری است که به شما کمک می‌کند تا در دنیای مالی موفق شوید.',
        metaDescription: 'درباره پیشرو سرمایه',
        metaKeywords: ['درباره', 'پیشرو'],
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ AboutPage created\n');
    } else {
      console.log('   ✓ AboutPage already exists\n');
    }

    // 4. Create InvestmentPlans data
    console.log('4️⃣  Creating InvestmentPlans...');
    const investmentCount = await db.collection('InvestmentPlans').countDocuments();
    if (investmentCount === 0) {
      await db.collection('InvestmentPlans').insertOne({
        title: 'سبدهای سرمایه‌گذاری',
        description: 'انتخاب سبد سرمایه‌گذاری مناسب برای هدف‌های مالی شما',
        metaDescription: 'سبدهای سرمایه‌گذاری پیشرو',
        metaKeywords: ['سرمایه‌گذاری', 'سبد'],
        minAmount: 1000000,
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✓ InvestmentPlans created\n');
    } else {
      console.log('   ✓ InvestmentPlans already exists\n');
    }

    console.log('✅ Seeding complete!\n');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
