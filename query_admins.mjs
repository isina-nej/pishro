import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        phone: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('\n=== Admin Users Found:', adminUsers.length, '===\n');
    console.log(JSON.stringify(adminUsers, null, 2));
  } catch (error) {
    console.error('Error querying admins:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
