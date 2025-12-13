import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.homeLanding.findFirst();
  console.log('Home landing via Prisma:', home ? home.heroTitle : 'not found');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
