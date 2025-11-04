// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const coursesData = [
  /* your provided coursesData translated to proper fields */
];

async function main() {
  for (const c of coursesData) {
    await prisma.course.upsert({
      where: { subject_price: { subject: c.subject, price: c.price } }, // if you add a unique composite
      update: {},
      create: {
        subject: c.subject,
        price: c.price,
        img: c.img,
        rating: c.rating,
        description: c.description,
        discountPercent: c.discountPercent,
        time: c.time,
        students: c.students,
        videosCount: c.videosCount,
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
