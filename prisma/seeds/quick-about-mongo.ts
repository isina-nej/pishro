
import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

// Load .env and .env.local manually
const files = [".env", ".env.local"];

files.forEach(file => {
    const envPath = path.resolve(process.cwd(), file);
    if (existsSync(envPath)) {
        console.log(`Loading ${file}...`);
        const envConfig = readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length > 1) {
                const key = parts.shift()?.trim();
                const value = parts.join('=').trim();
                if (key && value && !key.startsWith("#")) {
                    const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
                    process.env[key] = cleanValue;
                }
            }
        });
    }
});

const url = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/pishro';
console.log('Using database URL:', url.replace(/:[^:]*@/, ':****@'));

async function main() {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db();
    const collection = db.collection('AboutPage');

    // Clear existing
    await collection.deleteMany({});

    const doc = {
        heroTitle: 'درباره پیشرو سرمایه',
        heroSubtitle: 'تیمی متشکل از متخصصین بازارهای مالی',
        heroDescription: 'ما اینجا هستیم تا مسیر سرمایه‌ گذاری شما را هموار کنیم.',
        heroBadgeText: 'با ما پیشرو باشید',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const res = await collection.insertOne(doc);
    console.log('Inserted AboutPage id:', res.insertedId.toString());

    await client.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
