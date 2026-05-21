const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
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
    
    console.log('Admin Users Found:', adminUsers.length);
    console.log(JSON.stringify(adminUsers, null, 2));
  } catch (error) {
    console.error('Error querying admins:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
