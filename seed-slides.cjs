const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://admin:admin123456@localhost:27017/pishro?authSource=admin', { useUnifiedTopology: true });

(async () => {
  try {
    await client.connect();
    const db = client.db('pishro');
    
    // Create HomeSlide collection with sample data
    console.log('Creating HomeSlide collection with sample slides...');
    const homeSlideResult = await db.collection('HomeSlide').insertMany([
      {
        order: 1,
        title: 'شروع یادگیری',
        description: 'شروع کنید و با بهترین دوره‌های ما یاد بگیرید',
        imageUrl: '/images/slide-1.jpg',
        buttonText: 'شروع کنید',
        buttonLink: '/courses',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        order: 2,
        title: 'سرمایه‌گذاری هوشمند',
        description: 'راهنمایی از متخصصین برای سرمایه‌گذاری بهتر',
        imageUrl: '/images/slide-2.jpg',
        buttonText: 'بیشتر بدانید',
        buttonLink: '/business-consulting',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        order: 3,
        title: 'بازار سهام',
        description: 'آموزش کامل بورس و بازار سرمایه',
        imageUrl: '/images/slide-3.jpg',
        buttonText: 'آموزش ببینید',
        buttonLink: '/courses',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    console.log('✓ HomeSlide created:', homeSlideResult.insertedCount, 'documents');
    
    // Create HomeMiniSlider collection with sample data
    console.log('Creating HomeMiniSlider collection with sample sliders...');
    const miniSliderResult = await db.collection('HomeMiniSlider').insertMany([
      {
        row: 1,
        order: 1,
        imageUrl: '/images/mini-slide-1.jpg',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        row: 1,
        order: 2,
        imageUrl: '/images/mini-slide-2.jpg',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        row: 1,
        order: 3,
        imageUrl: '/images/mini-slide-3.jpg',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        row: 2,
        order: 1,
        imageUrl: '/images/mini-slide-4.jpg',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        row: 2,
        order: 2,
        imageUrl: '/images/mini-slide-5.jpg',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        row: 2,
        order: 3,
        imageUrl: '/images/mini-slide-6.jpg',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    console.log('✓ HomeMiniSlider created:', miniSliderResult.insertedCount, 'documents');
    console.log('✓ All slide collections initialized!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
})();
