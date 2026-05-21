/**
 * Seed Admin Users
 * Creates admin users for the admin panel
 */

import { PrismaClient, AdminRole, AdminStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed admin users
 */
export async function seedAdminUsers() {
  console.log('👑 Starting to seed admin users...');

  try {
    // Create main admin user
    const adminPhone = '09123456789';
    const adminPassword = 'Admin@123';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.adminUser.upsert({
      where: { email: 'sina@pishro.com' },
      update: {
        passwordHash: adminPasswordHash,
        phone: adminPhone,
      },
      create: {
        email: 'sina@pishro.com',
        phone: adminPhone,
        name: 'سینا',
        passwordHash: adminPasswordHash,
        role: AdminRole.ADMIN,
        status: AdminStatus.ACTIVE,
      }
    });

    console.log(`  ✓ Admin user created/updated:`);
    console.log(`     Email: ${admin.email}`);
    console.log(`     Phone: ${admin.phone}`);
    console.log(`     Name: ${admin.name}`);
    console.log(`     Role: ${admin.role}`);
    console.log(`     Password: ${adminPassword}`);

    return {
      created: 1,
      updated: 0,
      total: 1,
    };
  } catch (error) {
    console.error('  ❌ Error seeding admin users:', error);
    throw error;
  }
}
