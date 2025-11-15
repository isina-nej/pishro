import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Seed data for HomeSlide model (ImageZoomSliderSection)
 * Uses images from /public/images/home/landing-slider
 */
const homeSlides = [
  {
    title: "تحلیل تکنیکال حرفه‌ای",
    description:
      "یادگیری اصول و تکنیک‌های پیشرفته تحلیل تکنیکال برای معامله‌گری موفق در بازارهای مالی",
    imageUrl: "/images/home/landing-slider/p03.webp",
    order: 1,
    published: true,
  },
  {
    title: "مدیریت ریسک و سرمایه",
    description:
      "آموزش اصولی مدیریت سرمایه و کنترل ریسک برای حفظ و رشد پایدار پورتفولیو سرمایه‌گذاری",
    imageUrl: "/images/home/landing-slider/p02.webp",
    order: 2,
    published: true,
  },
  {
    title: "استراتژی‌های معاملاتی",
    description:
      "آشنایی با استراتژی‌های معاملاتی موفق و کاربردی برای بازارهای ارز دیجیتال و بورس",
    imageUrl: "/images/home/landing-slider/p01.webp",
    order: 3,
    published: true,
  },
  {
    title: "روانشناسی معامله‌گری",
    description:
      "تسلط بر احساسات و تصمیم‌گیری‌های هوشمندانه در بازارهای پرنوسان مالی",
    imageUrl: "/images/home/landing-slider/p04.webp",
    order: 4,
    published: true,
  },
  {
    title: "تحلیل بنیادی بازارها",
    description:
      "شناخت عوامل بنیادی تأثیرگذار بر بازارهای مالی و تصمیم‌گیری آگاهانه در سرمایه‌گذاری",
    imageUrl: "/images/home/landing-slider/p05.jpg",
    order: 5,
    published: true,
  },
];

async function seedHomeSlides() {
  console.log("🌱 Starting HomeSlide seeding...");

  try {
    // Clear existing slides
    const deleted = await prisma.homeSlide.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.count} existing slides`);

    // Insert new slides
    const result = await prisma.homeSlide.createMany({
      data: homeSlides,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully seeded ${result.count} home slides`);
    console.log("📊 Seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding home slides:", error);
    throw error;
  }
}

async function main() {
  await seedHomeSlides();
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = { seedHomeSlides };
