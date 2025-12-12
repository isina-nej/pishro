const { MongoClient } = require('mongodb');

async function seed() {
  const client = new MongoClient('mongodb://admin:admin123456@localhost:27017/pishro?authSource=admin');
  
  try {
    await client.connect();
    const db = client.db('pishro');
    
    // Get categories
    const crypto = await db.collection('Category').findOne({ slug: 'cryptocurrency' });
    const stock = await db.collection('Category').findOne({ slug: 'stock-market' });
    const metaverse = await db.collection('Category').findOne({ slug: 'metaverse' });
    const nft = await db.collection('Category').findOne({ slug: 'nft' });
    const airdrop = await db.collection('Category').findOne({ slug: 'airdrop' });
    
    const courses = [
      {
        title: 'مبانی بیتکوین',
        slug: 'bitcoin-basics',
        categoryId: crypto._id,
        description: 'آموزش اصول بیتکوین و کار با آن',
        level: 'BEGINNER',
        price: 500000,
        instructor: 'متخصص ارزهای دیجیتال',
        duration: 10,
        published: true,
      },
      {
        title: 'معاملات بورسی',
        slug: 'stock-trading',
        categoryId: stock._id,
        description: 'یادگیری معاملات بورسی برای مبتدیان',
        level: 'INTERMEDIATE',
        price: 750000,
        instructor: 'تحلیلگر بورس',
        duration: 15,
        published: true,
      },
      {
        title: 'ورود به متاورس',
        slug: 'metaverse-intro',
        categoryId: metaverse._id,
        description: 'درآمدی بر دنیای متاورس',
        level: 'BEGINNER',
        price: 400000,
        instructor: 'متخصص تکنولوژی',
        duration: 8,
        published: true,
      },
      {
        title: 'NFT و هنرهای دیجیتال',
        slug: 'nft-digital-art',
        categoryId: nft._id,
        description: 'آموزش ایجاد و فروش NFT',
        level: 'INTERMEDIATE',
        price: 600000,
        instructor: 'هنرمند دیجیتال',
        duration: 12,
        published: true,
      },
      {
        title: 'کسب درآمد از ایردراپ',
        slug: 'airdrop-earnings',
        categoryId: airdrop._id,
        description: 'راهنمای عملی برای کسب درآمد از ایردراپ‌ها',
        level: 'BEGINNER',
        price: 300000,
        instructor: 'معامله‌گر ارزهای دیجیتال',
        duration: 6,
        published: true,
      }
    ];

    for (const course of courses) {
      const existing = await db.collection('Course').findOne({ slug: course.slug });
      if (!existing) {
        await db.collection('Course').insertOne({
          ...course,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✓ Course created: ${course.title}`);
      } else {
        console.log(`- Course exists: ${course.title}`);
      }
    }
    
  } finally {
    await client.close();
  }
}

seed();
