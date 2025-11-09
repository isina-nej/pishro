/**
 * Seed FAQs
 * Creates FAQ records with Persian content
 */

import { PrismaClient, FAQCategory } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const FAQ_COUNT = 40;

export async function seedFAQs() {
  console.log('🌱 Starting to seed FAQs...');

  try {
    const categories = await prisma.category.findMany();

    let created = 0;

    for (let i = 0; i < FAQ_COUNT; i++) {
      const category = generator.randomInt(0, 10) > 6 ? generator.choice(categories) : null;

      const faq = await prisma.fAQ.create({
        data: {
          question: generator.generateFAQQuestion(),
          answer: generator.generateFAQAnswer(),
          categoryId: category?.id,
          faqCategory: generator.choice([FAQCategory.GENERAL, FAQCategory.PAYMENT, FAQCategory.COURSES, FAQCategory.TECHNICAL]),
          order: i,
          published: generator.choice([true, true, true, false]),
          featured: generator.randomInt(0, 10) > 7,
          views: generator.randomInt(0, 1000),
          helpful: generator.randomInt(0, 200),
          notHelpful: generator.randomInt(0, 50)
        }
      });

      created++;

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1}/${FAQ_COUNT} FAQs...`);
      }
    }

    console.log(`\n✅ FAQs seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    throw error;
  }
}

if (require.main === module) {
  seedFAQs()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
