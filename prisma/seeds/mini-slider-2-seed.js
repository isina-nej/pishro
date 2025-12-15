import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const miniSlider2Images = [
  {
    imageUrl: "/images/home/landing-slider/p07.jpg",
    row: 2,
    order: 1,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p08.jpg",
    row: 2,
    order: 2,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p09.jpg",
    row: 2,
    order: 3,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p10.jpg",
    row: 2,
    order: 4,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p11.jpg",
    row: 2,
    order: 5,
    published: true,
  },
  {
    imageUrl: "/images/home/landing-slider/p12.jpg",
    row: 2,
    order: 6,
    published: true,
  },
];

export async function seedMiniSlider2() {
  console.log("🌱 Starting HomeMiniSlider (Row 2) seeding...");

  try {
    // --------------------------------------------------
    // Delete existing mini slider 2 items (row 2)
    // --------------------------------------------------
    const deleted = await prisma.homeMiniSlider.deleteMany({
      where: { row: 2 },
    });
    console.log(`🗑️ Deleted ${deleted.count} existing mini slider 2 items`);

    // --------------------------------------------------
    // Insert all mini slider 2 images at once
    // --------------------------------------------------
    const created = await prisma.homeMiniSlider.createMany({
      data: miniSlider2Images,
    });

    console.log(
      `✅ Successfully seeded ${created.count} mini slider 2 images (Row 2)`
    );
  } catch (error) {
    console.error("❌ Error seeding mini slider 2:", error);
    throw error;
  }
}

async function main() {
  await seedMiniSlider2();
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
