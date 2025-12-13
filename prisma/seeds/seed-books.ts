/**
 * Seed Digital Books
 * Creates digital book records with Persian content
 */

import { PrismaClient } from "@prisma/client";
import { PersianDataGenerator } from "./persian-data-generator";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const BOOK_COUNT = 25;

export async function seedBooks() {
  console.log("🌱 Starting to seed digital books...");

  try {
    const tags = await prisma.tag.findMany();

    if (tags.length === 0) {
      console.log("⚠️  Please seed tags first!");
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;

    for (let i = 0; i < BOOK_COUNT; i++) {
      const title = generator.generateBookTitle();
      const slug = generator.generateSlug(title, i);
      const { firstName, lastName } = generator.generateFullName();
      const numTags = generator.randomInt(2, 5);
      const bookTags = tags.slice(i % tags.length, (i % tags.length) + numTags);

      try {
        const _book = await prisma.digitalBook.create({
          data: {
            title,
            slug,
            author: `${firstName} ${lastName}`,
            description: generator.generateParagraphs(3),
            cover: `https://picsum.photos/seed/book-${i}/600/900`,
            publisher: generator.choice([
              "انتشارات پیشرو",
              "نشر علم و دانش",
              "انتشارات بورس",
              "نشر سرمایه",
            ]),
            year: generator.randomInt(2018, 2026),
            pages: generator.randomInt(150, 500),
            isbn: `978-600-${generator.randomInt(
              1000,
              9999
            )}-${generator.randomInt(100, 999)}-${generator.randomInt(1, 9)}`,
            language: "فارسی",
            rating: generator.generateRating(),
            votes: generator.randomInt(50, 3000),
            views: generator.randomInt(100, 15000),
            downloads: generator.randomInt(50, 10000),
            category: generator.choice([
              "بورس و سهام",
              "ارز دیجیتال",
              "سرمایه‌ گذاری",
              "کسب و کار",
              "اقتصاد",
              "تحلیل تکنیکال",
              "مدیریت مالی",
            ]),
            formats: generator.choice([
              ["الکترونیکی"],
              ["الکترونیکی", "صوتی"],
              ["جلد نرم", "الکترونیکی"],
              ["جلد سخت", "الکترونیکی", "صوتی"],
            ]),
            status:
              generator.randomInt(0, 10) > 7
                ? ["جدید"]
                : generator.randomInt(0, 10) > 5
                  ? ["پرفروش"]
                  : [],
            tags: bookTags.map((t) => t.title),
            readingTime: `${generator.randomInt(5, 20)} ساعت`,
            isFeatured: generator.randomInt(0, 10) > 7,
            price:
              generator.randomInt(0, 10) > 5
                ? generator.generatePrice(50000, 300000)
                : null,
            fileUrl: `https://storage.pishro.com/books/${slug}.pdf`,
            audioUrl:
              generator.randomInt(0, 10) > 6
                ? `https://storage.pishro.com/audiobooks/${slug}.mp3`
                : null,
            tagIds: bookTags.map((t) => t.id),
          },
        });
        created++;
      } catch (error: any) {
        if (error.code === 'P2002') continue;
        console.error('Error creating digital book:', error);
      }

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1}/${BOOK_COUNT} books...`);
      }
    }

    console.log(`\n✅ Digital books seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error("❌ Error seeding books:", error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedBooks()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
