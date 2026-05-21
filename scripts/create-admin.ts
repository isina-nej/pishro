/**
 * Create Admin User
 * Creates a new admin user with custom credentials
 * 
 * Usage: npx ts-node scripts/create-admin.ts <email> <password> <name>
 * Example: npx ts-node scripts/create-admin.ts admin@test.com MyPassword123! "Admin Name"
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('❌ Missing arguments!');
    console.log('Usage: npx ts-node scripts/create-admin.ts <email> <password> <name>');
    console.log('Example: npx ts-node scripts/create-admin.ts admin@test.com MyPassword123! "Admin Name"');
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log(`❌ Admin with email "${email}" already exists!`);
      process.exit(1);
    }

    // Validate password
    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters!');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await prisma.adminUser.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name}`);
    console.log(`   Role: ADMIN`);
    console.log(`   ID: ${admin.id}`);
    console.log(`\n⚠️  Remember: Save the password securely!`);

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
