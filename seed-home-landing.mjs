import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedHomeLanding() {
  try {
    console.log('🌱 Seeding HomeLanding...');

    // Check if HomeLanding already exists
    const existing = await prisma.homeLanding.findFirst();

    if (existing) {
      console.log('✓ HomeLanding already exists, skipping...');
      return;
    }

    // Create HomeLanding
    const homeLanding = await prisma.homeLanding.create({
      data: {
        title: 'پیشرو سرمایه',
        mainHeroTitle: 'خوش‌آمدید به پیشرو سرمایه',
        mainHeroSubtitle: 'یادگیری و سرمایه‌گذاری هوشمند',
        metaDescription: 'آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری. از آموزش اصولی تا مشاوره حرفه‌ای',
        metaKeywords: ['بورس', 'سرمایه‌گذاری', 'آموزش', 'مالی'],
        published: true,
        order: 1,
      },
    });

    console.log('✓ HomeLanding created:', homeLanding.id);
  } catch (error: any) {
    console.error('✗ Error seeding HomeLanding:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedHomeLanding();
