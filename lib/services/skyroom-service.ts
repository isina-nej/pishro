import {
  getSkyRoomMeetingLink as getMeetingLinkMySQL,
  getSkyRoomClassById as getClassByIdMySQL,
  getAllSkyRoomClassesForAdmin as getAllClassesForAdminMySQL,
  createSkyRoomClass as createClassMySQL,
  updateSkyRoomClass as updateClassMySQL,
  deleteSkyRoomClass as deleteClassMySQL,
} from "./skyroom-mysql";
import type { SkyRoomClass } from "@prisma/client";

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

/**
 * ایجاد یک لینک همایش جدید
 */
export async function createSkyRoomClass(data: {
  meetingLink: string;
  published: boolean;
}) {
  return await createClassMySQL(data);
}

/**
 * بروزرسانی یک لینک همایش
 */
export async function updateSkyRoomClass(
  classId: string,
  data: Partial<{ meetingLink: string; published: boolean }>
) {
  return await updateClassMySQL(classId, data);
}

/**
 * حذف یک لینک همایش
 */
export async function deleteSkyRoomClass(classId: string) {
  return await deleteClassMySQL(classId);
}
