const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const book = await prisma.digitalBook.create({
    data: {
      title: "TEST BOOK AUTO " + new Date().toISOString(),
      slug: "test-book-auto-" + Date.now(),
      author: "automation",
      description: "Inserted by automation for debugging",
      year: 2025,
      category: "debug",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  console.log("created", book.id || book._id || book.slug);
}

main()
  .catch(e=>{ console.error(e); process.exit(1); })
  .finally(()=> prisma.$disconnect());
