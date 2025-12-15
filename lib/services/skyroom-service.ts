import { prisma } from "@/lib/prisma";
import type { SkyRoomClass } from "@prisma/client";

/**
 * دریافت لینک همایش منتشر شده
 */
export async function getSkyRoomMeetingLink() {
  try {
    const skyroom = await prisma.skyRoomClass.findFirst({
      where: {
        published: true,
      },
      select: {
        meetingLink: true,
      },
    });

    return skyroom?.meetingLink || null;
  } catch (error) {
    console.error("Error fetching skyroom meeting link:", error);
    return null;
  }
}

/**
 * دریافت یک لینک همایش خاص (برای ادمین)
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

/**
 * دریافت تمام لینک‌های همایش (برای ادمین)
 */
export async function getAllSkyRoomClassesForAdmin() {
  try {
    const classes = await prisma.skyRoomClass.findMany({
      orderBy: { createdAt: "desc" },
    });

    return classes;
  } catch (error) {
    console.error("Error fetching skyroom classes for admin:", error);
    return [];
  }
}

/**
 * ایجاد لینک همایش جدید (برای ادمین)
 */
export async function createSkyRoomClass(data: {
  meetingLink: string;
  published?: boolean;
}) {
  try {
    const skyRoomClass = await prisma.skyRoomClass.create({
      data: {
        meetingLink: data.meetingLink,
        published: data.published ?? true,
      },
    });

    return skyRoomClass;
  } catch (error) {
    console.error("Error creating skyroom class:", error);
    throw error;
  }
}

/**
 * به‌روزرسانی لینک همایش (برای ادمین)
 */
export async function updateSkyRoomClass(
  classId: string,
  data: Partial<Omit<SkyRoomClass, "id" | "createdAt" | "updatedAt">>
) {
  try {
    const skyRoomClass = await prisma.skyRoomClass.update({
      where: { id: classId },
      data,
    });

    return skyRoomClass;
  } catch (error) {
    console.error("Error updating skyroom class:", error);
    throw error;
  }
}

/**
 * حذف لینک همایش (برای ادمین)
 */
export async function deleteSkyRoomClass(classId: string) {
  try {
    await prisma.skyRoomClass.delete({
      where: { id: classId },
    });
  } catch (error) {
    console.error("Error deleting skyroom class:", error);
    throw error;
  }
}
