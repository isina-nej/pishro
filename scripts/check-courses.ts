import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkCourses() {
  try {
    // Get all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        subject: true,
        img: true,
        description: true,
      },
      take: 10,
    });

    console.log("\n=== COURSES CHECK ===\n");
    console.log(`Total courses checked: ${courses.length}\n`);

    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.subject}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Image URL: ${course.img || "❌ NO IMAGE"}`);
      console.log(`   Description: ${course.description || "No description"}`);
      console.log("");
    });

    // Statistics
    const coursesWithImages = courses.filter((c) => c.img);
    const coursesWithoutImages = courses.filter((c) => !c.img);

    console.log("📊 STATISTICS:");
    console.log(`   With images: ${coursesWithImages.length}/${courses.length}`);
    console.log(`   Without images: ${coursesWithoutImages.length}/${courses.length}`);

    if (coursesWithoutImages.length > 0) {
      console.log(
        "\n⚠️  Courses WITHOUT images:",
        coursesWithoutImages.map((c) => c.subject)
      );
    }
  } catch (error) {
    console.error("❌ Error checking courses:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourses();
