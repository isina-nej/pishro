import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb://admin:admin123456@127.0.0.1:27017/pishro?authSource=admin';

async function cleanDb() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    console.log('🗑️  Clearing database...');
    await client.connect();
    const db = client.db('pishro');
    
    const collections = ['HomeLanding', 'AboutPage', 'BusinessConsulting', 'InvestmentPlans'];
    
    for (const col of collections) {
      const collection = db.collection(col);
      const result = await collection.deleteMany({});
      console.log(`   ✓ Deleted ${result.deletedCount} documents from ${col}`);
    }
    
    console.log('\n✅ Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

cleanDb();
