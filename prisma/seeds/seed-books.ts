/**
 * Seed Digital Books
 * Creates digital book records with Persian content
 */

import { PrismaClient } from "@prisma/client";
import { PersianDataGenerator } from "./persian-data-generator";
import { fileURLToPath } from "url";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const BOOK_COUNT = 25;

/**
 * Create a valid PNG image (300x400px book cover)
 */
function createBookCover(fileName: string, subfolder: string): void {
  try {
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR || join(process.cwd(), "uploads");
    const dir = join(uploadBaseDir, subfolder);
    mkdirSync(dir, { recursive: true });
    
    const filePath = join(dir, fileName);
    
    // 300x400 PNG book cover (with gradient colors)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x01, 0x2C, 0x00, 0x00, 0x01, 0x90,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x3E, 0x0B, 0x9D,
      0xA4, 0x00, 0x00, 0x03, 0x00, 0x49, 0x44, 0x41,
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

/**
 * Create a minimal valid PDF
 */
function createPDF(fileName: string, subfolder: string): void {
  try {
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR || join(process.cwd(), "uploads");
    const dir = join(uploadBaseDir, subfolder);
    mkdirSync(dir, { recursive: true });
    
    const filePath = join(dir, fileName);
    const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(Book Content) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000241 00000 n
0000000335 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
431
%%EOF`;
    writeFileSync(filePath, pdf);
  } catch (error) {
    // Silent fail
  }
}

/**
 * Create a minimal MP3 audio file
 */
function createAudioFile(fileName: string, subfolder: string): void {
  try {
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR || join(process.cwd(), "uploads");
    const dir = join(uploadBaseDir, subfolder);
    mkdirSync(dir, { recursive: true });
    
    const filePath = join(dir, fileName);
    
    // Minimal MP3 frame
    const mp3Data = Buffer.concat([
      Buffer.from([0xFF, 0xFB, 0x90, 0x00]),
      Buffer.alloc(256, 0)
    ]);
    writeFileSync(filePath, mp3Data);
  } catch (error) {
    // Silent fail
  }
}

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

      const coverFileName = `cover_${Date.now()}_${slug}.jpg`;
      const pdfFileName = `book_${Date.now()}_${slug}.pdf`;
      const audioFileName = `audio_${Date.now()}_${slug}.mp3`;
      
      const coverPath = `/api/uploads/books/covers/${coverFileName}`;
      const pdfPath = `/api/uploads/books/pdfs/${pdfFileName}`;
      const audioPath = `/api/uploads/books/audio/${audioFileName}`
      
      // Create actual files on disk
      try {
        createBookCover(coverFileName, "books/covers");
        createPDF(pdfFileName, "books/pdfs");
        if (generator.randomInt(0, 10) > 6) {
          createAudioFile(audioFileName, "books/audio");
        }
      } catch (_) {
        // Non-critical
      }

      try {
        const _book = await prisma.digitalBook.upsert({
          where: { slug },
          update: {
            title,
            author: `${firstName} ${lastName}`,
            description: generator.generateParagraphs(3),
            cover: coverPath,
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
            fileUrl: pdfPath,
            audioUrl:
              generator.randomInt(0, 10) > 6
                ? audioPath
                : null,
          },
          create: {
            title,
            slug,
            author: `${firstName} ${lastName}`,
            description: generator.generateParagraphs(3),
            cover: coverPath,
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
            fileUrl: pdfPath,
            audioUrl:
              generator.randomInt(0, 10) > 6
                ? audioPath
                : null,
          },
        });

        created++;
      } catch (error: any) {
        // Skip on constraint violation
        continue;
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
