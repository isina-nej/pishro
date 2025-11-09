/**
 * Seed Enrollments
 * Creates enrollment records (users enrolled in courses)
 */

import { PrismaClient } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const ENROLLMENT_PERCENTAGE = 0.3; // 30% of users enrolled in courses

export async function seedEnrollments() {
  console.log('🌱 Starting to seed enrollments...');

  try {
    const users = await prisma.user.findMany();
    const courses = await prisma.course.findMany({ where: { published: true } });

    if (users.length === 0 || courses.length === 0) {
      console.log('⚠️  Please seed users and courses first!');
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;

    for (const user of users) {
      // Each user enrolls in 1-5 courses
      const numEnrollments = generator.randomInt(1, 6);

      for (let i = 0; i < numEnrollments && i < courses.length; i++) {
        const course = courses[(users.indexOf(user) + i) % courses.length];

        try {
          const enrollment = await prisma.enrollment.create({
            data: {
              userId: user.id,
              courseId: course.id,
              enrolledAt: generator.generatePastDate(180),
              progress: generator.randomInt(0, 101),
              completedAt: generator.randomInt(0, 10) > 6 ? generator.generatePastDate(30) : null,
              lastAccessAt: generator.randomInt(0, 10) > 3 ? generator.generatePastDate(7) : null
            }
          });
          created++;
        } catch (error) {
          // Skip if enrollment already exists (unique constraint)
          continue;
        }
      }

      if (created % 20 === 0) {
        console.log(`  ✓ Created ${created} enrollments...`);
      }
    }

    console.log(`\n✅ Enrollments seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error('❌ Error seeding enrollments:', error);
    throw error;
  }
}

if (require.main === module) {
  seedEnrollments()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
