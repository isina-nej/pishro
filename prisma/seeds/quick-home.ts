import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.homeLanding.create({
    data: {
      mainHeroTitle: 'پیشرو در مسیر سرمایه‌ گذاری هوشمند',
      mainHeroSubtitle: 'آموزش تخصصی بورس و بازارهای مالی',
      heroTitle: 'پیشرو سرمایه',
      published: true,
    },
  });
  console.log('Home landing upserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
