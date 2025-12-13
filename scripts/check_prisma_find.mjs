import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
try {
  const books = await prisma.digitalBook.findMany({ where: {}, take: 200, orderBy: { createdAt: 'desc' } });
  console.log('count', books.length);
  const found = books.filter(b => b.title && b.title.includes('TEST BOOK AUTO')).map(b => ({ id: b.id, slug: b.slug, title: b.title }));
  console.log('found', found);
} catch (e) {
  console.error('error', e);
} finally {
  await prisma.$disconnect();
}
