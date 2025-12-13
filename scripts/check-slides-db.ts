import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

// Load .env
const files = [".env", ".env.local"];
files.forEach(file => {
    const envPath = path.resolve(process.cwd(), file);
    if (existsSync(envPath)) {
        const envConfig = readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length > 1) {
                const key = parts.shift()?.trim();
                const value = parts.join('=').trim();
                if (key && value && !key.startsWith("#")) {
                    process.env[key] = value.replace(/^["'](.*)["']$/, '$1');
                }
            }
        });
    }
});

const url = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/pishro';

async function main() {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db();

    console.log('Connected to DB:', db.databaseName);

    const slides = await db.collection('HomeSlide').find({}).toArray();
    console.log(`Found ${slides.length} slides:`);
    slides.forEach(s => {
        console.log(`- ID: ${s._id}, Title: ${s.title}, Desc: ${s.description}, Subtitle: ${s.subtitle} (should be undefined)`);
    });

    await client.close();
}

main().catch(console.error);
