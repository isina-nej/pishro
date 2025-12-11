const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient('mongodb://admin:admin123456@localhost:27017/pishro?authSource=admin', { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('pishro');
    const users = await db.collection('User').find({}).project({phone:1,role:1,firstName:1,email:1}).toArray();
    console.log('=== Seeded Users ===');
    console.log(JSON.stringify(users, null, 2));
    
    const categories = await db.collection('Category').find({}).project({name:1,slug:1}).toArray();
    console.log('\n=== Categories ===');
    console.log(JSON.stringify(categories, null, 2));
  } finally {
    await client.close();
  }
})();
