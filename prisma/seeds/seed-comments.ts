/**
 * Seed Comments
 * Creates comment/testimonial records
 */

import { PrismaClient, UserRoleType } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const COMMENT_COUNT = 100;

export async function seedComments() {
  console.log('🌱 Starting to seed comments...');

  try {
    const users = await prisma.user.findMany();
    const courses = await prisma.course.findMany();
    const categories = await prisma.category.findMany();

    if (users.length === 0 || courses.length === 0) {
      console.log('⚠️  Please seed users and courses first!');
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;

    for (let i = 0; i < COMMENT_COUNT; i++) {
      // Determine if comment is from user or guest testimonial
      const hasUser = generator.randomInt(0, 10) > 3;
      const user = hasUser ? generator.choice(users) : null;

      const commentData: any = {
        text: generator.generateCommentText(),
        rating: generator.randomInt(7, 11),
        published: generator.choice([true, true, true, false]),
        verified: generator.choice([true, true, false]),
        featured: generator.randomInt(0, 10) > 8,
        views: generator.randomInt(0, 500),
        likes: [],
        dislikes: []
      };

      if (user) {
        commentData.userId = user.id;
      } else {
        // Guest testimonial
        const { firstName, lastName } = generator.generateFullName();
        commentData.userName = `${firstName} ${lastName}`;
        commentData.userAvatar = generator.generateAvatarUrl(i);
        commentData.userRole = generator.choice([UserRoleType.STUDENT, UserRoleType.PROFESSIONAL_TRADER, UserRoleType.INVESTOR]);
        commentData.userCompany = generator.choice(['کارگزاری آگاه', 'شرکت سرمایه‌گذاری پیشرو', 'بانک ملی', undefined]);
      }

      // Attach to course or category
      if (generator.randomInt(0, 10) > 3 && courses.length > 0) {
        commentData.courseId = generator.choice(courses).id;
      } else if (categories.length > 0) {
        commentData.categoryId = generator.choice(categories).id;
      }

      await prisma.comment.create({ data: commentData });
      created++;

      if ((i + 1) % 20 === 0) {
        console.log(`  ✓ Created ${i + 1}/${COMMENT_COUNT} comments...`);
      }
    }

    console.log(`\n✅ Comments seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error('❌ Error seeding comments:', error);
    throw error;
  }
}

if (require.main === module) {
  seedComments()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
