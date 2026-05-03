import {
  getSkyRoomMeetingLink as getMeetingLinkMySQL,
  getSkyRoomClassById as getClassByIdMySQL,
  getAllSkyRoomClassesForAdmin as getAllClassesForAdminMySQL,
} from "./skyroom-mysql";
import type { SkyRoomClass } from "@/types/prisma";

/**
 * دریافت لینک همایش منتشر شده
 */
export async function getSkyRoomMeetingLink() {
  return await getMeetingLinkMySQL();
}

/**
 * دریافت یک لینک همایش خاص (برای ادمین)
 */
export async function getSkyRoomClassById(classId: string) {
  return await getClassByIdMySQL(classId);
}

/**
 * دریافت تمام لینک‌های همایش (برای ادمین)
 */
export async function getAllSkyRoomClassesForAdmin() {
  return await getAllClassesForAdminMySQL();
}
