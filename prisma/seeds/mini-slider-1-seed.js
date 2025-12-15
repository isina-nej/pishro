import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const miniSlider1Images = [
  {
    imageUrl: "/images/home/landing-slider/p01.webp",
    row: 1,
    order: 1,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p02.webp",
    row: 1,
    order: 2,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p03.webp",
    row: 1,
    order: 3,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p04.webp",
    row: 1,
    order: 4,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p05.jpg",
    row: 1,
    order: 5,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p06.jpg",
    row: 1,
    order: 6,
    published: true,
  },
];

export async function seedMiniSlider1() {
  console.log("🌱 Starting HomeMiniSlider (Row 1) seeding...");

  try {
    // --------------------------------------------------
    // Delete existing mini slider 1 items (row 1)
    // --------------------------------------------------
    const deleted = await prisma.homeMiniSlider.deleteMany({
      where: { row: 1 },
    });
    console.log(`🗑️ Deleted ${deleted.count} existing mini slider 1 items`);

    // --------------------------------------------------
    // Insert all mini slider 1 images at once
    // --------------------------------------------------
    const created = await prisma.homeMiniSlider.createMany({
      data: miniSlider1Images,
    });

    console.log(
      `✅ Successfully seeded ${created.count} mini slider 1 images (Row 1)`
    );
  } catch (error) {
    console.error("❌ Error seeding mini slider 1:", error);
    throw error;
  }
}

async function main() {
  await seedMiniSlider1();
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
