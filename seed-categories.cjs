const { MongoClient } = require('mongodb');

async function seed() {
  const client = new MongoClient('mongodb://admin:admin123456@localhost:27017/pishro?authSource=admin');
  
  try {
    await client.connect();
    const db = client.db('pishro');
    
    // Create categories
    const categories = [
      {
        title: 'کریپتو',
        slug: 'cryptocurrency',
        description: 'آموزش جامع ارزهای دیجیتال',
        icon: '🪙',
        color: '#F59E0B',
        order: 1,
        published: true,
      },
      {
        title: 'بورس',
        slug: 'stock-market',
        description: 'آموزش سرمایه‌گذاری در بورس',
        icon: '📈',
        color: '#3B82F6',
        order: 2,
        published: true,
      },
      {
        title: 'متاورس',
        slug: 'metaverse',
        description: 'آموزش دنیای مجازی و متاورس',
        icon: '🌐',
        color: '#8B5CF6',
        order: 3,
        published: true,
      },
      {
        title: 'NFT',
        slug: 'nft',
        description: 'آموزش NFT و هنرهای دیجیتال',
        icon: '🎨',
        color: '#EC4899',
        order: 4,
        published: true,
      },
      {
        title: 'ایردراپ',
        slug: 'airdrop',
        description: 'آموزش ایردراپ و ارز های رایگان',
        icon: '🎁',
        color: '#10B981',
        order: 5,
        published: true,
      }
    ];

    for (const cat of categories) {
      const existing = await db.collection('Category').findOne({ slug: cat.slug });
      if (!existing) {
        await db.collection('Category').insertOne(cat);
        console.log(`✓ Category created: ${cat.title}`);
      } else {
        console.log(`- Category exists: ${cat.title}`);
      }
    }
    
  } finally {
    await client.close();
  }
}

seed();
