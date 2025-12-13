import { PrismaClient } from '@prisma/client';
// import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

async function seedAllData() {
  try {
    console.log('🌱 Comprehensive Database Seeding...\n');

    // ============ STEP 1: CATEGORIES ============
    console.log('1️⃣  Creating Categories...');
    const categories = [
      { slug: 'courses', title: 'دوره‌های آموزشی', description: 'دوره‌های جامع آموزش' },
      { slug: 'news', title: 'اخبار', description: 'آخرین اخبار بازار' },
      { slug: 'investment', title: 'سرمایه‌گذاری', description: 'راهنمای سرمایه‌گذاری' },
    ];

    for (const cat of categories) {
      try {
        const exists = await prisma.category.findFirst({
          where: { slug: cat.slug }
        });
        
        if (!exists) {
          await prisma.category.create({
            data: {
              ...cat,
              icon: '/icons/default.svg',
              published: true,
              order: 1,
            }
          });
        }
      } catch (e) {
        console.log(`   ℹ️  ${cat.title}: ${e.message}`);
      }
    }
    console.log('   ✓ Categories ready\n');

    // ============ STEP 2: HOMELANDDING ============
    console.log('2️⃣  Creating HomeLanding...');
    try {
      const homeCount = await prisma.homeLanding.count();
      if (homeCount === 0) {
        await prisma.homeLanding.create({
          data: {
            title: 'پیشرو سرمایه',
            mainHeroTitle: 'خوش‌آمدید به پیشرو سرمایه',
            mainHeroSubtitle: 'یادگیری و سرمایه‌گذاری هوشمند',
            metaDescription: 'آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری',
            metaKeywords: ['بورس', 'سرمایه‌گذاری', 'آموزش'],
            published: true,
            order: 1,
          }
        });
        console.log('   ✓ HomeLanding created\n');
      } else {
        console.log('   ✓ HomeLanding already exists\n');
      }
    } catch (e) {
      console.log(`   ℹ️  HomeLanding: ${e.message}\n`);
    }

    // ============ STEP 3: ABOUTPAGE ============
    console.log('3️⃣  Creating AboutPage...');
    try {
      const aboutCount = await prisma.aboutPage.count();
      if (aboutCount === 0) {
        await prisma.aboutPage.create({
          data: {
            title: 'درباره پیشرو سرمایه',
            subtitle: 'ما اینجا برای کمک به شما هستیم',
            description: 'پیشرو سرمایه یک پلتفرم آموزشی و سرمایه‌گذاری است',
            metaTitle: 'درباره ما | پیشرو',
            metaDescription: 'درباره پیشرو سرمایه و تیم آن',
            metaKeywords: ['درباره', 'پیشرو', 'تیم'],
            published: true,
            order: 1,
          }
        });
        console.log('   ✓ AboutPage created\n');
      } else {
        console.log('   ✓ AboutPage already exists\n');
      }
    } catch (e) {
      console.log(`   ℹ️  AboutPage: ${e.message}\n`);
    }

    // ============ STEP 4: INVESTMENTPLANS ============
    console.log('4️⃣  Creating InvestmentPlans...');
    try {
      const investmentCount = await prisma.investmentPlans.count();
      if (investmentCount === 0) {
        await prisma.investmentPlans.create({
          data: {
            title: 'سبدهای سرمایه‌گذاری',
            description: 'انتخاب سبد سرمایه‌گذاری مناسب برای هدف‌های مالی شما',
            metaTitle: 'سبدهای سرمایه‌گذاری | پیشرو',
            metaDescription: 'سبدهای سرمایه‌گذاری پیشرو',
            metaKeywords: ['سرمایه‌گذاری', 'سبد', 'پلن'],
            minAmount: 1000000,
            maxReturn: 25,
            published: true,
            order: 1,
          }
        });
        console.log('   ✓ InvestmentPlans created\n');
      } else {
        console.log('   ✓ InvestmentPlans already exists\n');
      }
    } catch (e) {
      console.log(`   ℹ️  InvestmentPlans: ${e.message}\n`);
    }

    // ============ STEP 5: BUSINESSCONSULTING ============
    console.log('5️⃣  Creating BusinessConsulting...');
    try {
      const busConsCount = await prisma.businessConsulting.count();
      if (busConsCount === 0) {
        await prisma.businessConsulting.create({
          data: {
            title: 'مشاوره کسب و کار',
            subtitle: 'مشاوره حرفه‌ای برای توسعه کسب‌و‌کار',
            description: 'خدمات مشاوره‌ای در زمینه کسب‌و‌کار و سرمایه‌گذاری',
            metaTitle: 'مشاوره کسب و کار | پیشرو',
            metaDescription: 'خدمات مشاوره کسب‌و‌کار',
            metaKeywords: ['مشاوره', 'کسب‌و‌کار'],
            published: true,
            order: 1,
          }
        });
        console.log('   ✓ BusinessConsulting created\n');
      } else {
        console.log('   ✓ BusinessConsulting already exists\n');
      }
    } catch (e) {
      console.log(`   ℹ️  BusinessConsulting: ${e.message}\n`);
    }

    console.log('✅ All essential data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   - Categories: Ready');
    console.log('   - HomeLanding: Ready');
    console.log('   - AboutPage: Ready');
    console.log('   - InvestmentPlans: Ready');
    console.log('   - BusinessConsulting: Ready\n');
    
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAllData();
