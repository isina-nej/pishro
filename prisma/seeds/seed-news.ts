/**
 * Seed News Articles
 * Creates news article records with Persian content
 */

import { PrismaClient } from "@prisma/client";
import { PersianDataGenerator } from "./persian-data-generator";
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const NEWS_COUNT = 30;

/**
 * Create a valid PNG image (1200x630px news header)
 */
function createNewsImage(fileName: string, subfolder: string): void {
  try {
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR || "/opt/pishro_uploads";
    const dir = join(uploadBaseDir, subfolder);
    mkdirSync(dir, { recursive: true });
    
    const filePath = join(dir, fileName);
    
    // Valid PNG for news article
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x04, 0xB0, 0x00, 0x00, 0x02, 0x76,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x45, 0x1A, 0xF7,
      0x1F, 0x00, 0x00, 0x03, 0x00, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0xED, 0xDD, 0xB1, 0x0D, 0x00,
      0x20, 0x08, 0x04, 0xB0, 0xB7, 0xFE, 0xFF, 0xFD,
      0xE5, 0x2C, 0x42, 0x10, 0xA2, 0x28, 0x0A, 0xF4,
      0xCE, 0x1E, 0x52, 0x48, 0x6B, 0xA4, 0x2E, 0x73,
      0x19, 0x4F, 0xA8, 0x0D, 0x2A, 0x28, 0x98, 0xCD,
      0x42, 0x4B, 0x59, 0x61, 0x97, 0x80, 0x8D, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0xE0, 0x7F, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    writeFileSync(filePath, pngData);
  } catch (error) {
    // Silent fail
  }
}

export async function seedNews() {
  console.log("🌱 Starting to seed news articles...");

  try {
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();

    if (categories.length === 0 || tags.length === 0) {
      console.log("⚠️  Please seed categories and tags first!");
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;

    for (let i = 0; i < NEWS_COUNT; i++) {
      const title = generator.generateNewsTitle();
      const slug = generator.generateSlug(title, i);
      const category = generator.choice(categories);
      const numTags = generator.randomInt(2, 6);
      const articleTags = tags.slice(
        i % tags.length,
        (i % tags.length) + numTags
      );
      const { firstName, lastName } = generator.generateFullName();

      const coverImageFileName = `news-${i}-${slug}.jpg`;
      const coverImagePath = `/api/uploads/news/${coverImageFileName}`
      
      // Create news image file
      try {
        createNewsImage(coverImageFileName, "news");
      } catch (_) {
        // Non-critical
      }

      const _article = await prisma.newsArticle.create({
        data: {
          title,
          slug,
          excerpt: generator.generateParagraph(),
          content: generator.generateParagraphs(5),
          coverImage: coverImagePath,
          author: `${firstName} ${lastName}`,
          category: category.title,
          tags: articleTags.map((t) => t.title),
          published: generator.choice([true, true, true, false]),
          publishedAt: generator.choice([true, true, false])
            ? generator.generatePastDate(180)
            : null,
          views: generator.randomInt(0, 10000),
          categoryId: category.id,
          tagIds: articleTags.map((t) => t.id),
          featured: generator.randomInt(0, 10) > 7,
          readingTime: generator.choice([3, 5, 7, 10, 15]),
          likes: generator.randomInt(0, 500),
        },
      });

      created++;

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1}/${NEWS_COUNT} news articles...`);
      }
    }

    console.log(`\n✅ News articles seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error("❌ Error seeding news:", error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedNews()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
