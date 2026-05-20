import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

try {
  // Hash password
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  
  // Create admin user
  const admin = await prisma.adminUser.create({
    data: {
      email: 'sina@pishro.com',
      phone: '09123456789',
      name: 'سینا',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    }
  });
  
  console.log('✓ Admin user created successfully!');
  console.log(`ID: ${admin.id}`);
  console.log(`Email: ${admin.email}`);
  console.log(`Phone: ${admin.phone}`);
  console.log(`Name: ${admin.name}`);
  
} catch (error) {
  if (error.code === 'P2002') {
    console.log('✗ Admin user already exists with this email or phone');
    
    // Get existing user
    const existing = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: 'sina@pishro.com' },
          { phone: '09123456789' }
        ]
      }
    });
    console.log('Existing user:', existing);
  } else {
    console.error('Error:', error.message);
  }
} finally {
  await prisma.$disconnect();
}
