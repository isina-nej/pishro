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

    const now = new Date();

    // Clear existing
    await db.collection('InvestmentTag').deleteMany({});
    await db.collection('InvestmentPlan').deleteMany({});
    await db.collection('InvestmentPlans').deleteMany({});

    // Create main InvestmentPlans document
    const investmentPlansResult = await db.collection('InvestmentPlans').insertOne({
        title: 'سبدهای سرمایه‌ گذاری پیشرو',
        description: 'با سبدهای سرمایه‌ گذاری متنوع و حرفه‌ای پیشرو، آینده مالی خود را بسازید',
        image: '/images/investment-plans/hero.jpg',
        plansIntroCards: [
            {
                title: 'مدیریت سرمایه',
                description: 'تقسیم سرمایه، ریسک به ریوارد و بررسی دقیق بازار'
            },
            {
                title: 'تنوع سرمایه‌گذاری',
                description: 'سبدهای ترکیبی از ارز دیجیتال، بورس و طلا'
            },
            {
                title: 'همراهی مستمر',
                description: 'پشتیبانی و مشاوره در تمام مراحل سرمایه‌گذاری'
            }
        ],
        minAmount: 10,
        maxAmount: 10000,
        amountStep: 10,
        metaTitle: 'سبدهای سرمایه‌ گذاری | پیشرو',
        metaDescription: 'آشنایی با سبدهای سرمایه‌ گذاری متنوع در ارز دیجیتال، بورس و ترکیبی',
        metaKeywords: ['سبد سرمایه‌گذاری', 'ارز دیجیتال', 'بورس', 'سرمایه‌گذاری'],
        published: true,
        createdAt: now,
        updatedAt: now,
    });

    const investmentPlansId = investmentPlansResult.insertedId;

    // Create Investment Plans
    const plans = [
        {
            label: 'ارز دیجیتال',
            icon: 'Bitcoin',
            description: 'سرمایه‌گذاری در ارزهای دیجیتال برتر',
            order: 1,
            published: true,
            investmentPlansId,
            createdAt: now,
            updatedAt: now,
        },
        {
            label: 'بورس',
            icon: 'LineChart',
            description: 'سرمایه‌گذاری در سهام و اوراق بهادار',
            order: 2,
            published: true,
            investmentPlansId,
            createdAt: now,
            updatedAt: now,
        },
        {
            label: 'ترکیبی',
            icon: 'PieChart',
            description: 'ترکیبی از ارز دیجیتال و بورس',
            order: 3,
            published: true,
            investmentPlansId,
            createdAt: now,
            updatedAt: now,
        },
    ];

    await db.collection('InvestmentPlan').insertMany(plans);

    // Create Investment Tags
    const tags = [
        {
            title: 'کم ریسک',
            color: 'green',
            icon: 'Shield',
            order: 1,
            published: true,
            investmentPlansId,
            createdAt: now,
            updatedAt: now,
        },
        {
            title: 'میان ریسک',
            color: 'yellow',
            icon: 'TrendingUp',
            order: 2,
            published: true,
            investmentPlansId,
            createdAt: now,
            updatedAt: now,
        },
        {
            title: 'پر ریسک',
            color: 'red',
            icon: 'Zap',
            order: 3,
            published: true,
            investmentPlansId,
            createdAt: now,
            updatedAt: now,
        },
    ];

    await db.collection('InvestmentTag').insertMany(tags);

    console.log('Investment plans seeded successfully!');
    console.log('InvestmentPlans ID:', investmentPlansId.toString());

    await client.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
