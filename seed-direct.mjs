import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb://admin:admin123456@127.0.0.1:27017/pishro?authSource=admin';

async function seed() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    console.log('🌱 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('pishro');
    
    // 1️⃣ Categories
    console.log('\n1️⃣  Creating Categories...');
    const categoriesCollection = db.collection('Category');
    
    const categories = [
      { name: 'دوره‌های آموزشی', slug: 'courses', description: 'دوره‌های آموزشی آنلاین' },
      { name: 'اخبار', slug: 'news', description: 'آخرین اخبار و به‌روزرسانی‌ها' },
      { name: 'سرمایه‌گذاری', slug: 'investment', description: 'پلان‌های سرمایه‌گذاری' }
    ];
    
    for (const cat of categories) {
      const exists = await categoriesCollection.findOne({ slug: cat.slug });
      if (!exists) {
        await categoriesCollection.insertOne({
          ...cat,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`   ✓ ${cat.name}`);
      }
    }
    
    // 2️⃣ HomeLanding
    console.log('\n2️⃣  Creating HomeLanding...');
    const homeLandingCollection = db.collection('HomeLanding');
    const existingHome = await homeLandingCollection.findOne({});
    
    if (!existingHome) {
      await homeLandingCollection.insertOne({
        _id: 'main',
        title: 'خوش‌آمدید به پیشرو',
        subtitle: 'بهترین پلتفرم برای یادگیری و سرمایه‌گذاری',
        description: 'پیشرو یک پلتفرم جامع برای آموزش و سرمایه‌گذاری است',
        features: [
          { id: '1', title: 'کورس‌های منظم', description: 'دسترسی به صدها کورس آموزشی' },
          { id: '2', title: 'مشاوره کسب‌وکار', description: 'دریافت مشاوره از متخصصان' },
          { id: '3', title: 'برنامه‌های سرمایه‌گذاری', description: 'فرصت‌های سرمایه‌گذاری متنوع' }
        ],
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✓ HomeLanding created');
    } else {
      console.log('   ℹ️  HomeLanding already exists');
    }
    
    // 3️⃣ AboutPage
    console.log('\n3️⃣  Creating AboutPage...');
    const aboutPageCollection = db.collection('AboutPage');
    const existingAbout = await aboutPageCollection.findOne({});
    
    if (!existingAbout) {
      await aboutPageCollection.insertOne({
        _id: 'main',
        title: 'درباره ما',
        subtitle: 'کسب‌وکار پایدار و توسعه‌پذیر',
        content: 'پیشرو با هدف ارائه بهترین خدمات در زمینه آموزش و سرمایه‌گذاری تاسیس شده است.',
        mission: 'ارائه مشاوره و آموزش‌های باکیفیت',
        vision: 'رهبری بازار در صنعت آموزش و مالی',
        values: ['حرفه‌ایی', 'شفافیت', 'نوآوری', 'مسئولیت‌پذیری'],
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✓ AboutPage created');
    } else {
      console.log('   ℹ️  AboutPage already exists');
    }
    
    // 4️⃣ InvestmentPlans
    console.log('\n4️⃣  Creating InvestmentPlans...');
    const investmentPlansCollection = db.collection('InvestmentPlans');
    const existingPlans = await investmentPlansCollection.countDocuments({});
    
    if (existingPlans === 0) {
      const plans = [
        {
          name: 'طرح ستاره',
          description: 'طرح پایه‌ای برای سرمایه‌گذاران جدید',
          minAmount: 100000,
          maxAmount: 1000000,
          returnRate: 15,
          duration: 12,
          features: ['بازگشت سالانه ۱۵ درصد', 'پشتیبانی مستمر', 'گزارش‌های ماهانه']
        },
        {
          name: 'طرح الماس',
          description: 'طرح حرفه‌ای برای سرمایه‌گذاران باتجربه',
          minAmount: 5000000,
          maxAmount: 50000000,
          returnRate: 20,
          duration: 24,
          features: ['بازگشت سالانه ۲۰ درصد', 'مشاور شخصی', 'اجتماعات فصلی']
        }
      ];
      
      for (const plan of plans) {
        await investmentPlansCollection.insertOne({
          ...plan,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log(`   ✓ ${plans.length} investment plans created`);
    } else {
      console.log(`   ℹ️  ${existingPlans} investment plans already exist`);
    }
    
    // 5️⃣ BusinessConsulting
    console.log('\n5️⃣  Creating BusinessConsulting...');
    const businessConsultingCollection = db.collection('BusinessConsulting');
    const existingConsulting = await businessConsultingCollection.findOne({});
    
    if (!existingConsulting) {
      await businessConsultingCollection.insertOne({
        _id: 'main',
        title: 'مشاوره کسب‌وکار',
        subtitle: 'راهنمایی برای رشد کسب‌وکار شما',
        description: 'خدمات مشاوره تخصصی برای شروع و توسعه کسب‌وکار',
        services: [
          { title: 'تحلیل بازار', description: 'بررسی جامع فرصت‌های بازار' },
          { title: 'طرح تجاری', description: 'تهیه طرح تفصیلی کسب‌وکار' },
          { title: 'مالی‌ریزی', description: 'برنامه‌ریزی مالی و بودجه' },
          { title: 'بازاریابی', description: 'استراتژی‌های بازاریابی مؤثر' }
        ],
        published: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('   ✓ BusinessConsulting created');
    } else {
      console.log('   ℹ️  BusinessConsulting already exists');
    }
    
    console.log('\n✅ All essential data seeded successfully!');
    console.log('📊 Summary:');
    console.log('   - Categories: ✓');
    console.log('   - HomeLanding: ✓');
    console.log('   - AboutPage: ✓');
    console.log('   - InvestmentPlans: ✓');
    console.log('   - BusinessConsulting: ✓');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  } finally {
    await client.close();
  }
}

seed();
