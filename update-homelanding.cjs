const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://admin:admin123456@localhost:27017/pishro?authSource=admin', { useUnifiedTopology: true });

(async () => {
  try {
    await client.connect();
    const db = client.db('pishro');
    
    const result = await db.collection('HomeLanding').updateOne(
      {},
      {
        $set: {
          heroVideoUrl: null,
          mainHeroTitle: 'خوش‌آمدید به پیشرو سرمایه',
          mainHeroSubtitle: 'یادگیری و سرمایه‌گذاری هوشمند'
        }
      }
    );
    console.log('✓ HomeLanding updated:', result.modifiedCount, 'documents');
  } finally {
    await client.close();
  }
})();
