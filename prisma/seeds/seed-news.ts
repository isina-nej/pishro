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
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR || join(process.cwd(), "uploads");
    const dir = join(uploadBaseDir, subfolder);
    mkdirSync(dir, { recursive: true });
    
    const filePath = join(dir, fileName);
    const ext = fileName.split(".").pop()?.toLowerCase();

    const jpegData = Buffer.from([
      255,216,255,224,0,16,74,70,73,70,0,1,1,0,0,1,0,1,0,0,255,219,0,67,0,8,6,6,7,6,5,8,7,7,7,9,9,8,10,12,20,13,12,11,11,12,25,18,19,15,20,29,26,31,30,29,26,28,28,32,36,46,39,32,34,44,35,28,28,40,55,41,44,48,49,52,52,52,31,39,57,61,56,50,60,46,51,52,50,255,219,0,67,1,8,9,9,12,11,12,24,13,13,24,50,33,28,33,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,255,192,0,17,8,0,1,0,1,3,1,34,0,2,17,1,3,17,1,255,196,0,31,0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,255,196,0,181,16,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125,1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250,255,196,0,31,1,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,255,196,0,181,17,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119,0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250,255,218,0,12,3,1,0,2,17,3,17,0,63,0,199,162,138,43,245,83,243,83,255,217
    ]);

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
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0xE0, 0x7F, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const fileBuffer = ext === "jpg" || ext === "jpeg" ? jpegData : pngData;
    writeFileSync(filePath, fileBuffer);
  } catch (error) {
    // Silent fail for non-critical seed image creation
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

      try {
        const _article = await prisma.newsArticle.upsert({
          where: { slug },
          update: {
            title,
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
            featured: generator.randomInt(0, 10) > 7,
            readingTime: generator.choice([3, 5, 7, 10, 15]),
            likes: generator.randomInt(0, 500),
          },
          create: {
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
            featured: generator.randomInt(0, 10) > 7,
            readingTime: generator.choice([3, 5, 7, 10, 15]),
            likes: generator.randomInt(0, 500),
          },
        });

        created++;
      } catch (error: any) {
        // Skip on constraint violation
        continue;
      }

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
