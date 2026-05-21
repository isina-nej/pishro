import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Get all users with their IDs
    console.log('\n========== ALL USERS ==========');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log(`Total users: ${allUsers.length}\n`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Name: ${user.firstName || ''} ${user.lastName || ''}`.trim());
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });
    
    // Check for specific user
    console.log('========== CHECKING FOR SPECIFIC USER ==========');
    const targetId = 'cmpaq27su0000cz0m1itn2a2o';
    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneVerified: true,
        createdAt: true
      }
    });
    
    if (user) {
      console.log(`\n✓ User with ID "${targetId}" FOUND:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Name: ${user.firstName || ''} ${user.lastName || ''}`.trim());
      console.log(`   Role: ${user.role}`);
      console.log(`   Phone Verified: ${user.phoneVerified}`);
      console.log(`   Created: ${user.createdAt}`);
    } else {
      console.log(`\n✗ User with ID "${targetId}" NOT FOUND`);
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
