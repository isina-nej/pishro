/**
 * Seed Courses
 * Creates course records with Persian content
 */

import { PrismaClient, CourseLevel, CourseStatus, Language } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const COURSE_COUNT = 40;

export async function seedCourses() {
  console.log('🌱 Starting to seed courses...');

  try {
    // Get categories and tags to relate to courses
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();

    if (categories.length === 0 || tags.length === 0) {
      console.log('⚠️  Please seed categories and tags first!');
      return { created: 0, updated: 0, total: 0 };
    }

    let created = 0;
    let updated = 0;

    for (let i = 0; i < COURSE_COUNT; i++) {
      const subject = generator.generateCourseSubject();
      const slug = generator.generateSlug(subject, i);
      const category = generator.choice(categories);
      const selectedTags = generator.choice([2, 3, 4, 5]);
      const courseTags = tags.slice(i % tags.length, (i % tags.length) + selectedTags);

      const course = await prisma.course.upsert({
        where: { slug },
        update: {},
        create: {
          subject,
          slug,
          price: generator.generatePrice(200000, 3000000),
          img: `https://picsum.photos/seed/course-${i}/800/600`,
          rating: generator.generateRating(),
          description: generator.generateParagraphs(2),
          discountPercent: generator.generateDiscount(),
          time: generator.choice(['2 ساعت', '5 ساعت', '10 ساعت', '15 ساعت', '20 ساعت', '30 ساعت']),
          students: generator.randomInt(50, 2000),
          videosCount: generator.randomInt(10, 80),
          categoryId: category.id,
          tagIds: courseTags.map(t => t.id),
          level: generator.choice([CourseLevel.BEGINNER, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED]),
          language: Language.FA,
          prerequisites: generator.randomInt(0, 10) > 6 ? [
            'آشنایی با مفاهیم پایه',
            'داشتن کامپیوتر یا گوشی هوشمند',
            'اینترنت پایدار'
          ] : [],
          learningGoals: [
            generator.choice(['تسلط بر تحلیل تکنیکال', 'شناخت بازار', 'مدیریت ریسک', 'استراتژی معاملاتی']),
            generator.choice(['کسب درآمد', 'سرمایه‌گذاری موفق', 'معامله‌گری حرفه‌ای']),
            generator.choice(['یادگیری ابزارها', 'تحلیل نمودار', 'شناسایی الگوها'])
          ],
          instructor: generator.generateFullName().firstName + ' ' + generator.generateFullName().lastName,
          status: generator.choice([CourseStatus.ACTIVE, CourseStatus.ACTIVE, CourseStatus.ACTIVE, CourseStatus.COMING_SOON]),
          published: generator.choice([true, true, true, false]),
          featured: generator.randomInt(0, 10) > 7,
          views: generator.randomInt(0, 5000)
        }
      });

      if (course.createdAt.getTime() === course.updatedAt.getTime()) {
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
    console.error('❌ Error seeding courses:', error);
    throw error;
  }
}

if (require.main === module) {
  seedCourses()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
