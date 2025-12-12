const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db();
    const categoriesCollection = db.collection('Category');
    
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

    console.log('\nProcessing categories...\n');
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
    
    console.log('\n--- Summary ---');
    console.log('Created: ' + created);
    console.log('Updated: ' + updated);
    console.log('\n✓ All categories ready!');
    
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
