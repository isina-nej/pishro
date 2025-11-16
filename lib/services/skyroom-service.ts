import { prisma } from "@/lib/prisma";

/**
 * دریافت تمام کلاس‌های اسکای‌روم منتشر شده
 */
export async function getAllSkyRoomClasses() {
  try {
    const classes = await prisma.skyRoomClass.findMany({
      where: {
        published: true,
      },
      orderBy: { order: "asc" },
    });

    return classes;
  } catch (error) {
    console.error("Error fetching skyroom classes:", error);
    return [];
  }
}

/**
 * دریافت یک کلاس اسکای‌روم خاص
 */
export async function getSkyRoomClassById(classId: string) {
  try {
    const skyRoomClass = await prisma.skyRoomClass.findUnique({
      where: { id: classId },
    });

    return skyRoomClass;
  } catch (error) {
    console.error("Error fetching skyroom class by ID:", error);
    return null;
  }
}
