/**
 * Seed Users
 * Creates user records with Persian names and data
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

const USER_COUNT = 50;

/**
 * Seed users into the database
 */
export async function seedUsers() {
  console.log('🌱 Starting to seed users...');

  try {
    let created = 0;
    let updated = 0;

    // Create admin user
    const adminPhone = '09123456789';
    const adminPassword = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.user.upsert({
      where: { phone: adminPhone },
      update: {},
      create: {
        phone: adminPhone,
        passwordHash: adminPassword,
        phoneVerified: true,
        role: UserRole.ADMIN,
        firstName: 'مدیر',
        lastName: 'سیستم',
        email: 'admin@pishro.com',
        avatarUrl: generator.generateAvatarUrl(0)
      }
    });

    if (admin.createdAt.getTime() === admin.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
    console.log(`  ✓ Admin user created`);

    // Create regular users
    for (let i = 0; i < USER_COUNT; i++) {
      const phone = generator.generatePhone();
      const password = await bcrypt.hash('User@123', 10);
      const { firstName, lastName } = generator.generateFullName();

      const user = await prisma.user.upsert({
        where: { phone },
        update: {},
        create: {
          phone,
          passwordHash: password,
          phoneVerified: generator.choice([true, true, true, false]),
          role: UserRole.USER,
          firstName,
          lastName,
          email: generator.randomInt(0, 10) > 7 ? undefined : `user${i}@example.com`,
          nationalCode: generator.randomInt(0, 10) > 5 ? generator.generateNationalCode() : undefined,
          birthDate: generator.randomInt(0, 10) > 6 ? generator.generatePastDate(365 * 40) : undefined,
          avatarUrl: generator.generateAvatarUrl(i + 1),
          cardNumber: generator.randomInt(0, 10) > 7 ? generator.generateCardNumber() : undefined,
          shebaNumber: generator.randomInt(0, 10) > 7 ? generator.generateShebaNumber() : undefined,
          accountOwner: generator.randomInt(0, 10) > 7 ? `${firstName} ${lastName}` : undefined
        }
      });

      if (user.createdAt.getTime() === user.updatedAt.getTime()) {
        created++;
      } else {
        updated++;
      }

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1}/${USER_COUNT} users...`);
      }
    }

    console.log(`\n✅ Users seeded successfully!`);
    console.log(`   📝 Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   📊 Total: ${created + updated}`);

    return { created, updated, total: created + updated };
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

// Run directly if called as main module
if (require.main === module) {
  seedUsers()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
