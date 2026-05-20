import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({
    where: { id: 'cmpaq27su0000cz0m1itn2a2o' }
  });
  
  console.log('User found:', user);
  
  const allAdmins = await prisma.user.findMany({
    where: { role: 'ADMIN' }
  });
  
  console.log('\nAll ADMIN users:');
  allAdmins.forEach(u => {
    console.log(`- ID: ${u.id}, Phone: ${u.phone}, Name: ${u.firstName} ${u.lastName}`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await prisma.$disconnect();
}
