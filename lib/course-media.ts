import crypto from "crypto";
import {
  deleteFileFromStorage,
  getRelativePathFromUrl,
  isTempStoragePath,
  promoteTempFileToStorage,
} from "@/lib/services/storage-adapter";

export function buildCourseThumbnailPath(courseId: string, fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
  return `courses/${courseId}/thumbnail_${Date.now()}.${ext}`;
}

export function buildCourseTrailerPath(courseId: string, fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "mp4";
  return `courses/${courseId}/trailer_${Date.now()}.${ext}`;
}

export function buildLessonThumbnailPath(
  courseId: string,
  lessonId: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
  return `courses/${courseId}/lessons/${lessonId}/thumb_${Date.now()}.${ext}`;
}

export function buildLessonVideoPath(
  courseId: string,
  lessonId: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "mp4";
  return `courses/${courseId}/lessons/${lessonId}/video_${crypto.randomBytes(4).toString("hex")}.${ext}`;
}

export async function commitTempMediaPath(
  tempPath: string | null | undefined,
  permanentRelativePath: string
): Promise<string> {
  if (!tempPath) {
    throw new Error("مسیر فایل موقت نامعتبر است");
  }
  const relative = tempPath.includes("://")
    ? getRelativePathFromUrl(tempPath)
    : tempPath;
  if (!isTempStoragePath(relative)) {
    return tempPath;
  }
  return promoteTempFileToStorage(relative, permanentRelativePath);
}

export async function safeDeleteStoragePath(
  storedValue: string | null | undefined
): Promise<void> {
  if (!storedValue) return;
  try {
    const relative = storedValue.includes("://")
      ? getRelativePathFromUrl(storedValue)
      : storedValue;
    await deleteFileFromStorage(relative);
  } catch (error) {
    console.error("[course-media] delete failed:", storedValue, error);
  }
}

export async function replaceStorageFile(
  oldPath: string | null | undefined,
  tempPath: string | null | undefined,
  permanentRelativePath: string
): Promise<string> {
  const newUrl = await commitTempMediaPath(tempPath, permanentRelativePath);
  if (oldPath && oldPath !== newUrl) {
    await safeDeleteStoragePath(oldPath);
  }
  return newUrl;
}
