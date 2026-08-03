import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      "آموزش اصولی مدیریت سرمایه و کنترل ریسک برای حفظ و رشد پایدار پورتفولیو سرمایه‌ گذاری",
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
      "شناخت عوامل بنیادی تأثیرگذار بر بازارهای مالی و تصمیم‌گیری آگاهانه در سرمایه‌ گذاری",
    imageUrl: "/images/home/landing-slider/p05.webp",
    order: 5,
    published: true,
  },
];

export async function seedHomeSlides() {
  console.log("🌱 Starting HomeSlide seeding...");

  try {
    // --------------------------------------------------
    // Delete existing slides (clean reset)
    // --------------------------------------------------
    const deleted = await prisma.homeSlide.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.count} existing slides`);

    // --------------------------------------------------
    // Insert all slides at once
    // --------------------------------------------------
    const created = await prisma.homeSlide.createMany({
      data: homeSlides,
    });

    console.log(`✅ Successfully seeded ${created.count} home slides`);
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
