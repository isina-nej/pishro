import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

// load .env DATABASE_URL if present
let url = 'mongodb://127.0.0.1:27017/pishro';
try {
  const env = readFileSync('./.env', 'utf8');
  env.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx);
    const val = line.slice(idx + 1).replace(/^"(.*)"$/, '$1');
    if (key === 'DATABASE_URL') url = val;
  });
} catch (e) {}

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  const dbName = client.db().databaseName || 'pishro';
  const db = client.db();
  const collection = db.collection('HomeLanding');

  const doc = {
    mainHeroTitle: 'پیشرو در مسیر سرمایه‌ گذاری هوشمند',
    mainHeroSubtitle: 'آموزش تخصصی بورس و بازارهای مالی',
    heroTitle: 'پیشرو سرمایه',
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const res = await collection.insertOne(doc);
  console.log('Inserted HomeLanding id:', res.insertedId.toString());

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
