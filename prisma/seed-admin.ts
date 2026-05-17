/**
 * Seed Admin Users
 * Creates default admin user for initial setup
 * 
 * Usage: npx ts-node prisma/seed-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashAdminPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seedAdminUsers() {
  try {
    console.log('🌱 Seeding admin users...');

    // Check if default admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: 'admin@pishrosarmaye.com' },
    });

    if (existingAdmin) {
      console.log('✅ Default admin user already exists');
      return;
    }

    // Create default admin user
    const hashedPassword = await hashAdminPassword('Admin123!@#');

    const admin = await prisma.adminUser.create({
      data: {
        email: 'admin@pishrosarmaye.com',
        name: 'Admin User',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    console.log('✅ Default admin user created:');
    console.log(`   Email: admin@pishrosarmaye.com`);
    console.log(`   Password: Admin123!@#`);
    console.log(`   ⚠️  IMPORTANT: Change this password after first login!`);
    console.log(`\n   User ID: ${admin.id}`);

    // Create sample moderator user
    const hashedModPassword = await hashAdminPassword('Moderator123!@#');

    const moderator = await prisma.adminUser.create({
      data: {
        email: 'moderator@pishrosarmaye.com',
        name: 'Moderator User',
        passwordHash: hashedModPassword,
        role: 'MODERATOR',
        status: 'ACTIVE',
      },
    });

    console.log('\n✅ Sample moderator user created:');
    console.log(`   Email: moderator@pishrosarmaye.com`);
    console.log(`   Password: Moderator123!@#`);
    console.log(`   User ID: ${moderator.id}`);

    // Create sample viewer user
    const hashedViewerPassword = await hashAdminPassword('Viewer123!@#');

    const viewer = await prisma.adminUser.create({
      data: {
        email: 'viewer@pishrosarmaye.com',
        name: 'Viewer User',
        passwordHash: hashedViewerPassword,
        role: 'VIEWER',
        status: 'ACTIVE',
      },
    });

    console.log('\n✅ Sample viewer user created:');
    console.log(`   Email: viewer@pishrosarmaye.com`);
    console.log(`   Password: Viewer123!@#`);
    console.log(`   User ID: ${viewer.id}`);

    console.log('\n✨ Admin users seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminUsers();
