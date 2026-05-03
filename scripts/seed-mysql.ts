/**
 * MySQL Database Seed Script
 * Seeds the database with initial data
 */

import * as db from '../lib/db';

interface SeedResult {
  table: string;
  count: number;
  status: 'success' | 'error';
  message?: string;
}

const results: SeedResult[] = [];

async function seedDatabase() {
  console.log('🌱 Starting MySQL database seed...\n');

  try {
    // 1. Seed Categories
    await seedCategories();

    // 2. Seed Tags
    await seedTags();

    // 3. Seed Courses
    await seedCourses();

    // 4. Seed Users
    await seedUsers();

    // 5. Seed FAQ
    await seedFAQ();

    // Print summary
    console.log('\n📊 Seed Summary:');
    console.log('=====================================');
    results.forEach(result => {
      const status = result.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${result.table}: ${result.count} records`);
      if (result.message) console.log(`   └─ ${result.message}`);
    });

    console.log('\n✨ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.closePool();
  }
}

async function seedCategories() {
  console.log('📂 Seeding categories...');
  try {
    const categories = [
      {
        slug: 'cryptocurrency',
        title: 'ارزهای دیجیتال',
        description: 'آموزش جامع ارزهای دیجیتال و بلاک‌چین'
      },
      {
        slug: 'airdrop',
        title: 'ایردراپ',
        description: 'یادگیری روش‌های کسب توکن‌های رایگان'
      },
      {
        slug: 'nft',
        title: 'NFT',
        description: 'آموزش NFT و دنیای هنر دیجیتال'
      },
      {
        slug: 'metaverse',
        title: 'متاورس',
        description: 'سفری به دنیای متاورس و امکانات آن'
      },
      {
        slug: 'stock',
        title: 'بورس',
        description: 'آموزش کامل معاملات و تحلیل بورس'
      }
    ];

    let count = 0;
    for (const cat of categories) {
      try {
        await db.execute(
          `INSERT INTO Category (id, slug, title, description) 
           VALUES (UUID(), ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=?, description=?`,
          [cat.slug, cat.title, cat.description, cat.title, cat.description]
        );
        count++;
      } catch (e) {
        console.log(`  ⚠️  Category "${cat.title}" already exists`);
      }
    }

    results.push({
      table: 'Category',
      count,
      status: 'success',
      message: `${count}/${categories.length} inserted/updated`
    });
  } catch (error) {
    results.push({
      table: 'Category',
      count: 0,
      status: 'error',
      message: String(error)
    });
  }
}

async function seedTags() {
  console.log('🏷️  Seeding tags...');
  try {
    const tags = [
      { title: 'تحلیل تکنیکال' },
      { title: 'تحلیل بنیادی' },
      { title: 'بورس تهران' },
      { title: 'ارز دیجیتال' },
      { title: 'فارکس' },
      { title: 'سهام بلندمدت' },
      { title: 'صندوق‌های سرمایه‌گذاری' },
      { title: 'اوراق قرضه' },
      { title: 'مدیریت ریسک' },
      { title: 'تنوع سبد سرمایه‌گذاری' }
    ];

    let count = 0;
    for (const tag of tags) {
      try {
        await db.execute(
          `INSERT INTO Tag (id, title) VALUES (UUID(), ?)
           ON DUPLICATE KEY UPDATE title=?`,
          [tag.title, tag.title]
        );
        count++;
      } catch (e) {
        console.log(`  ⚠️  Tag "${tag.title}" already exists`);
      }
    }

    results.push({
      table: 'Tag',
      count,
      status: 'success',
      message: `${count}/${tags.length} inserted/updated`
    });
  } catch (error) {
    results.push({
      table: 'Tag',
      count: 0,
      status: 'error',
      message: String(error)
    });
  }
}

async function seedCourses() {
  console.log('📚 Seeding courses...');
  try {
    // First get category IDs
    const categoryResult = await db.execute(
      `SELECT id, slug FROM Category LIMIT 5`
    );
    const categories: Array<{id: string, slug: string}> = categoryResult as any;
    
    if (categories.length === 0) {
      throw new Error('No categories found. Please seed categories first.');
    }

    const courses = [
      {
        subject: 'آموزش کامل بورس برای مبتدیان',
        price: 299000,
        description: 'دوره جامع برای یادگیری بورس از صفر تا صد',
        discountPercent: 20,
        time: '12 ساعت',
        students: 1250,
        videosCount: 45,
        instructor: 'علی محمدی',
        slug: 'stock-beginner',
        categorySlug: 'stock',
        level: 'BEGINNER'
      },
      {
        subject: 'ارزهای دیجیتال و بلاک‌چین پیشرفته',
        price: 399000,
        description: 'دوره پیشرفته برای سرمایه‌گذاران حرفه‌ای',
        discountPercent: 15,
        time: '20 ساعت',
        students: 850,
        videosCount: 60,
        instructor: 'فرزاد احمدی',
        slug: 'crypto-advanced',
        categorySlug: 'cryptocurrency',
        level: 'ADVANCED'
      },
      {
        subject: 'تحلیل تکنیکال بورس',
        price: 349000,
        description: 'آموزش تحلیل تکنیکال و الگوهای قیمتی',
        discountPercent: 10,
        time: '16 ساعت',
        students: 980,
        videosCount: 52,
        instructor: 'مریم رضایی',
        slug: 'technical-analysis',
        categorySlug: 'stock',
        level: 'INTERMEDIATE'
      },
      {
        subject: 'NFT و توکن‌های دیجیتال',
        price: 279000,
        description: 'دوره کامل درباره NFT و هنر دیجیتال',
        discountPercent: 25,
        time: '10 ساعت',
        students: 650,
        videosCount: 35,
        instructor: 'سارا کریمی',
        slug: 'nft-tokens',
        categorySlug: 'nft',
        level: 'BEGINNER'
      },
      {
        subject: 'ایردراپ و کسب توکن رایگان',
        price: 199000,
        description: 'روش‌های محافظت‌شده برای کسب توکن‌های رایگان',
        discountPercent: 30,
        time: '8 ساعت',
        students: 2100,
        videosCount: 28,
        instructor: 'حسن پور',
        slug: 'airdrop-guide',
        categorySlug: 'airdrop',
        level: 'BEGINNER'
      }
    ];

    let count = 0;
    for (const course of courses) {
      try {
        const category = categories.find(c => c.slug === course.categorySlug);
        const categoryId = category?.id || categories[0].id;

        await db.execute(
          `INSERT INTO Course (id, subject, price, description, discountPercent, time, students, videosCount, instructor, slug, categoryId, level, published, status) 
           VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, 'ACTIVE')
           ON DUPLICATE KEY UPDATE subject=?, price=?, description=?, students=?`,
          [
            course.subject,
            course.price,
            course.description,
            course.discountPercent,
            course.time,
            course.students,
            course.videosCount,
            course.instructor,
            course.slug,
            categoryId,
            course.level,
            course.subject,
            course.price,
            course.description,
            course.students
          ]
        );
        count++;
      } catch (e) {
        console.log(`  ⚠️  Course "${course.subject}" error:`, (e as any).message);
      }
    }

    results.push({
      table: 'Course',
      count,
      status: 'success',
      message: `${count}/${courses.length} inserted/updated`
    });
  } catch (error) {
    results.push({
      table: 'Course',
      count: 0,
      status: 'error',
      message: String(error)
    });
  }
}

async function seedUsers() {
  console.log('👥 Seeding test users...');
  try {
    const users = [
      {
        phone: '09123456789',
        role: 'ADMIN',
        name: 'مدیر سیستم'
      },
      {
        phone: '09987654321',
        role: 'USER',
        name: 'کاربر تست'
      }
    ];

    let count = 0;
    for (const user of users) {
      try {
        await db.execute(
          `INSERT INTO User (id, phone, role, phoneVerified) 
           VALUES (UUID(), ?, ?, true)
           ON DUPLICATE KEY UPDATE role=?`,
          [user.phone, user.role, user.role]
        );
        count++;
      } catch (e) {
        console.log(`  ⚠️  User "${user.phone}" already exists`);
      }
    }

    results.push({
      table: 'User',
      count,
      status: 'success',
      message: `${count}/${users.length} inserted/updated`
    });
  } catch (error) {
    results.push({
      table: 'User',
      count: 0,
      status: 'error',
      message: String(error)
    });
  }
}

async function seedFAQ() {
  console.log('❓ Seeding FAQ...');
  try {
    const faqs = [
      {
        question: 'بورس چیست؟',
        answer: 'بورس مکانی برای خرید و فروش سهام و اوراق بهادار است.'
      },
      {
        question: 'ارزهای دیجیتال امن هستند؟',
        answer: 'امنیت بستگی به نحوه محافظت از کلیدهای خصوصی دارد.'
      },
      {
        question: 'چگونه سرمایه‌گذاری شروع کنم؟',
        answer: 'ابتدا دانش اساسی کسب کنید سپس با مبالغ کم شروع کنید.'
      }
    ];

    let count = 0;
    for (const faq of faqs) {
      try {
        await db.execute(
          `INSERT INTO FAQ (id, question, answer) 
           VALUES (UUID(), ?, ?)
           ON DUPLICATE KEY UPDATE answer=?`,
          [faq.question, faq.answer, faq.answer]
        );
        count++;
      } catch (e) {
        console.log(`  ⚠️  FAQ "${faq.question}" already exists`);
      }
    }

    results.push({
      table: 'FAQ',
      count,
      status: 'success',
      message: `${count}/${faqs.length} inserted/updated`
    });
  } catch (error) {
    results.push({
      table: 'FAQ',
      count: 0,
      status: 'error',
      message: String(error)
    });
  }
}

// Run the seed
seedDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
