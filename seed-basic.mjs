#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBasicData() {
  try {
    console.log('🌱 Seeding basic data...\n');

    // 1. Create HomeLanding
    console.log('1️⃣  Creating HomeLanding...');
    const existingHome = await prisma.homeLanding.findFirst();
    if (!existingHome) {
      await prisma.homeLanding.create({
        data: {
          title: 'پیشرو سرمایه',
          mainHeroTitle: 'خوش‌آمدید به پیشرو سرمایه',
          mainHeroSubtitle: 'یادگیری و سرمایه‌گذاری هوشمند',
          metaDescription: 'آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری',
          metaKeywords: ['بورس', 'سرمایه‌گذاری', 'آموزش'],
          published: true,
          order: 1,
        },
      });
      console.log('   ✓ HomeLanding created\n');
    } else {
      console.log('   ✓ HomeLanding already exists\n');
    }

    // 2. Create basic Categories (without upsert to avoid transactions)
    console.log('2️⃣  Creating Categories...');
    const categories = [
      { slug: 'courses', title: 'دوره‌های آموزشی', description: 'دوره‌های جامع آموزش' },
      { slug: 'news', title: 'اخبار', description: 'آخرین اخبار بازار' },
      { slug: 'investment', title: 'سرمایه‌گذاری', description: 'راهنمای سرمایه‌گذاری' },
    ];

    for (const cat of categories) {
      const exists = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (!exists) {
        await prisma.category.create({
          data: {
            slug: cat.slug,
            title: cat.title,
            description: cat.description,
            icon: '/icons/default.svg',
            published: true,
            order: 1,
          },
        });
      }
    }
    console.log('   ✓ Categories created/verified\n');

    // 3. Create a test user
    console.log('3️⃣  Creating test user...');
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@pishro.com' },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: 'test@pishro.com',
          name: 'تست',
          phone: '09123456789',
          password: 'hashed_password',
          role: 'USER',
          emailVerified: new Date(),
        },
      });
      console.log('   ✓ Test user created\n');
    } else {
      console.log('   ✓ Test user already exists\n');
    }

    console.log('✅ Seeding complete!\n');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedBasicData();
