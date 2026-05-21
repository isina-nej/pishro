/**
 * Seed Courses
 * Creates course records with Persian content
 */

import {
  PrismaClient,
  CourseLevel,
  CourseStatus,
  Language,
} from "@prisma/client";
import { PersianDataGenerator } from "./persian-data-generator";
import { fileURLToPath } from "url";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

/**
 * Create a valid PNG image (300x200px course thumbnail)
 */
function createCourseImage(fileName: string, subfolder: string): void {
  try {
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR || join(process.cwd(), "uploads");
    const dir = join(uploadBaseDir, subfolder);
    mkdirSync(dir, { recursive: true });
    
    const filePath = join(dir, fileName);
    
    // Valid PNG for course thumbnail
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x01, 0x2C, 0x00, 0x00, 0x00, 0xC8,
      0x08, 0x02, 0x00, 0x00, 0x00, 0xD7, 0x1F, 0x3C,
      0xA0, 0x00, 0x00, 0x02, 0x00, 0x49, 0x44, 0x41,
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
const generator = new PersianDataGenerator(12345);

const COURSE_COUNT = 40;

export async function seedCourses() {
  console.log("🌱 Starting to seed courses...");

  try {
    // Get categories and tags to relate to courses
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();

    if (categories.length === 0 || tags.length === 0) {
      console.log("⚠️  Please seed categories and tags first!");
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;
    let updated = 0;

    for (let i = 0; i < COURSE_COUNT; i++) {
      const subject = generator.generateCourseSubject();
      const slug = generator.generateSlug(subject, i);
      const category = generator.choice(categories);
      const selectedTags = generator.choice([2, 3, 4, 5]);
      const courseTags = tags.slice(
        i % tags.length,
        (i % tags.length) + selectedTags
      );

      const imgFileName = `course-${i}-${slug}.jpg`;
      const imgPath = `/api/uploads/courses/${imgFileName}`
      
      // Create course image file
      try {
        createCourseImage(imgFileName, "courses");
      } catch (_) {
        // Non-critical
      }

      const course = await prisma.course.upsert({
        where: { slug },
        update: {},
        create: {
          subject,
          slug,
          price: generator.generatePrice(200000, 3000000),
          img: imgPath,
          rating: generator.generateRating(),
          description: generator.generateParagraphs(2),
          discountPercent: generator.generateDiscount(),
          time: generator.choice([
            "2 ساعت",
            "5 ساعت",
            "10 ساعت",
            "15 ساعت",
            "20 ساعت",
            "30 ساعت",
          ]),
          students: generator.randomInt(50, 2000),
          videosCount: generator.randomInt(10, 80),
          categoryId: category.id,
          level: generator.choice([
            CourseLevel.BEGINNER,
            CourseLevel.INTERMEDIATE,
            CourseLevel.ADVANCED,
          ]),
          language: Language.FA,
          prerequisites:
            generator.randomInt(0, 10) > 6
              ? [
                  "آشنایی با مفاهیم پایه",
                  "داشتن کامپیوتر یا گوشی هوشمند",
                  "اینترنت پایدار",
                ]
              : [],
          learningGoals: [
            generator.choice([
              "تسلط بر تحلیل تکنیکال",
              "شناخت بازار",
              "مدیریت ریسک",
              "استراتژی معاملاتی",
            ]),
            generator.choice([
              "کسب درآمد",
              "سرمایه‌ گذاری موفق",
              "معامله‌گری حرفه‌ای",
            ]),
            generator.choice([
              "یادگیری ابزارها",
              "تحلیل نمودار",
              "شناسایی الگوها",
            ]),
          ],
          instructor:
            generator.generateFullName().firstName +
            " " +
            generator.generateFullName().lastName,
          status: generator.choice([
            CourseStatus.ACTIVE,
            CourseStatus.ACTIVE,
            CourseStatus.ACTIVE,
            CourseStatus.COMING_SOON,
          ]),
          published: generator.choice([true, true, true, false]),
          featured: generator.randomInt(0, 10) > 7,
          views: generator.randomInt(0, 5000),
        },
      });

      if ((course.createdAt?.getTime?.()) === (course.updatedAt?.getTime?.()) ) {
        created++;
      } else {
        updated++;
      }

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1}/${COURSE_COUNT} courses...`);
      }
    }

    console.log(`\n✅ Courses seeded successfully!`);
    console.log(`   📝 Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   📊 Total: ${created + updated}`);

    return { created, updated, total: created + updated };
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedCourses()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
