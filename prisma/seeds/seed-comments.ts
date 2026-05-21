/**
 * Seed Comments
 * Creates comment/testimonial records for landing page
 */

import { PrismaClient, UserRoleType, Prisma } from "@prisma/client";
import { PersianDataGenerator } from "./persian-data-generator";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const COMMENT_COUNT = 100;
const FEATURED_COUNT = 13; // For landing page slider

export async function seedComments() {
  console.log("🌱 Starting to seed comments...");

  try {
    let created = 0;
    let featured = 0;

    for (let i = 0; i < COMMENT_COUNT; i++) {
      // Determine if this should be featured (for landing page)
      const isFeatured = i < FEATURED_COUNT;

      // Use Prisma.CommentCreateInput type for type safety
      const commentData: Prisma.CommentCreateInput = {
        text: generator.generateCommentText(),
        rating: generator.randomInt(7, 11),
        published: true, // Always publish for landing page
        verified: isFeatured ? true : generator.choice([true, false]), // Featured must be verified
        featured: isFeatured, // Mark as featured for landing page display
        views: generator.randomInt(isFeatured ? 100 : 0, isFeatured ? 500 : 200),
        likes: [],
        dislikes: [],
      };

      // Guest testimonials only (NOT linked to courses)
      const { firstName, lastName } = generator.generateFullName();
      commentData.userName = `${firstName} ${lastName}`;
      commentData.userAvatar = generator.generateAvatarUrl(i);
      commentData.userRole = generator.choice([
        UserRoleType.STUDENT,
        UserRoleType.PROFESSIONAL_TRADER,
        UserRoleType.INVESTOR,
      ]);
      commentData.userCompany = generator.choice([
        "کارگزاری آگاه",
        "شرکت سرمایه‌ گذاری پیشرو",
        "بانک ملی",
        undefined,
      ]);

      // NO course or category attachment - comments are for landing page only
      await prisma.comment.create({ data: commentData });
      created++;

      if (isFeatured) featured++;

      if ((i + 1) % 20 === 0) {
        console.log(`  ✓ Created ${i + 1}/${COMMENT_COUNT} comments...`);
      }
    }

    console.log(`\n✅ Comments seeded successfully!`);
    console.log(`   📝 Total Created: ${created}`);
    console.log(`   ⭐ Featured for Landing: ${featured}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error("❌ Error seeding comments:", error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedComments()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
