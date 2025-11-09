/**
 * Seed Newsletter Subscribers
 * Creates newsletter subscriber records
 */

import { PrismaClient } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const SUBSCRIBER_COUNT = 100;

export async function seedNewsletter() {
  console.log('🌱 Starting to seed newsletter subscribers...');

  try {
    let created = 0;

    for (let i = 0; i < SUBSCRIBER_COUNT; i++) {
      const phone = generator.generatePhone();

      try {
        await prisma.newsletterSubscriber.create({
          data: {
            phone,
            createdAt: generator.generatePastDate(365)
          }
        });
        created++;
      } catch (error) {
        // Skip if phone already exists
        continue;
      }

      if ((i + 1) % 20 === 0) {
        console.log(`  ✓ Created ${created} newsletter subscribers...`);
      }
    }

    console.log(`\n✅ Newsletter subscribers seeded successfully!`);
    console.log(`   📝 Created: ${created}`);

    return { created, updated: 0, total: created };
  } catch (error) {
    console.error('❌ Error seeding newsletter subscribers:', error);
    throw error;
  }
}

if (require.main === module) {
  seedNewsletter()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
