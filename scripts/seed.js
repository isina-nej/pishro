const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/pishro';

async function seed() {
  const client = new MongoClient(MONGODB_URL, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db('pishro');

    // Create collections
    const collections = [
      'User',
      'Category',
      'Course',
      'Lesson',
      'Comment',
      'Order',
      'Investment',
      'News'
    ];

    for (const collection of collections) {
      try {
        await db.createCollection(collection);
        console.log(`✓ Collection ${collection} created`);
      } catch (e) {
        console.log(`✓ Collection ${collection} already exists`);
      }
    }

    // Seed default user
    const usersCollection = db.collection('User');
    const existingAdmin = await usersCollection.findOne({ phone: '+989100000000' });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123456', 10);
      const result = await usersCollection.insertOne({
        phone: '+989100000000',
        passwordHash,
        phoneVerified: true,
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@pishro.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✓ Admin user created:', result.insertedId);
    } else {
      console.log('✓ Admin user already exists');
    }

    // Seed test user
    const testUserExists = await usersCollection.findOne({ phone: '+989100000001' });
    if (!testUserExists) {
      const passwordHash = await bcrypt.hash('test123456', 10);
      const result = await usersCollection.insertOne({
        phone: '+989100000001',
        passwordHash,
        phoneVerified: true,
        role: 'USER',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@pishro.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✓ Test user created:', result.insertedId);
    } else {
      console.log('✓ Test user already exists');
    }

    // Seed categories
    const categoriesCollection = db.collection('Category');
    const categories = [
      { name: 'بورس', slug: 'stock-market', description: 'آموزش بورس و سهام' },
      { name: 'کریپتو', slug: 'cryptocurrency', description: 'آموزش کریپتوکارنسی' },
      { name: 'سرمایه‌گذاری', slug: 'investment', description: 'راهنمای سرمایه‌گذاری' },
    ];

    for (const cat of categories) {
      const exists = await categoriesCollection.findOne({ slug: cat.slug });
      if (!exists) {
        const result = await categoriesCollection.insertOne({
          ...cat,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✓ Category created: ${cat.name}`);
      }
    }

    console.log('\n✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
