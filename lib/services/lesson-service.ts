import { prisma } from "@/lib/prisma";
import type { Lesson } from "@prisma/client";
import {
  buildLessonThumbnailPath,
  buildLessonVideoPath,
  commitTempMediaPath,
  replaceStorageFile,
  safeDeleteStoragePath,
} from "@/lib/course-media";
import { deleteFileFromStorage, getRelativePathFromUrl } from "@/lib/services/storage-adapter";
import type { z } from "zod";
import type {
  LessonCreateSchema,
  LessonUpdateSchema,
} from "@/lib/schemas/course-management-schema";

type LessonCreateInput = z.infer<typeof LessonCreateSchema>;
type LessonUpdateInput = z.infer<typeof LessonUpdateSchema>;

async function nextLessonPosition(
  courseId: string,
  chapterId: string | null | undefined
): Promise<number> {
  const max = await prisma.lesson.aggregate({
    where: { courseId, chapterId: chapterId ?? null },
    _max: { order: true },
  });
  return (max._max.order ?? 0) + 1;
}

async function assertPositionAvailable(
  courseId: string,
  chapterId: string | null | undefined,
  position: number,
  excludeId?: string
): Promise<void> {
  const existing = await prisma.lesson.findFirst({
    where: {
      courseId,
      chapterId: chapterId ?? null,
      order: position,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
  if (existing) {
    throw new Error("POSITION_CONFLICT");
  }
}

export async function getLessonsByCourse(courseId: string) {
  try {
    return await prisma.lesson.findMany({
      where: { courseId, published: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching lessons by course:", error);
    return [];
  }
}

export async function getLessonById(lessonId: string) {
  try {
    return await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: { select: { id: true, subject: true, slug: true, hasChapters: true } },
        chapter: { select: { id: true, title: true } },
      },
    });
  } catch (error) {
    console.error("Error fetching lesson by ID:", error);
    return null;
  }
}

export async function incrementLessonViews(lessonId: string) {
  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Error incrementing lesson views:", error);
  }
}

export async function checkUserAccessToLesson(
  userId: string,
  lessonId: string
): Promise<boolean> {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { courseId: true },
    });
    if (!lesson) return false;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lesson.courseId },
      },
    });
    return !!enrollment;
  } catch (error) {
    console.error("Error checking user access to lesson:", error);
    return false;
  }
}

export async function createLessonForCourse(
  courseId: string,
  data: LessonCreateInput
) {
  const position =
    data.position ?? (await nextLessonPosition(courseId, data.chapterId ?? null));
  await assertPositionAvailable(courseId, data.chapterId ?? null, position);

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title: data.title,
      description: data.description,
      chapterId: data.chapterId ?? null,
      order: position,
      durationSeconds: data.durationSeconds,
      duration: String(data.durationSeconds),
      published: true,
    },
  });

  try {
    let thumbnail = data.thumbnailPath ?? null;
    let videoUrl = data.videoPath ?? null;

    if (data.thumbnailTempPath) {
      thumbnail = await commitTempMediaPath(
        data.thumbnailTempPath,
        buildLessonThumbnailPath(courseId, lesson.id, "thumb.jpg")
      );
    }
    if (data.videoTempPath) {
      videoUrl = await commitTempMediaPath(
        data.videoTempPath,
        buildLessonVideoPath(courseId, lesson.id, "video.mp4")
      );
    }

    if (thumbnail || videoUrl) {
      return await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          ...(thumbnail ? { thumbnail } : {}),
          ...(videoUrl ? { videoUrl } : {}),
        },
      });
    }
    return lesson;
  } catch (error) {
    console.error("[createLessonForCourse] media commit failed:", error);
    if (data.thumbnailTempPath) await safeDeleteStoragePath(data.thumbnailTempPath);
    if (data.videoTempPath) await safeDeleteStoragePath(data.videoTempPath);
    throw error;
  }
}

/** @deprecated use createLessonForCourse */
export async function createLesson(data: {
  courseId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  order?: number;
  chapterId?: string;
  published?: boolean;
  durationSeconds?: number;
  thumbnailTempPath?: string;
  videoTempPath?: string;
}) {
  return createLessonForCourse(data.courseId, {
    courseId: data.courseId,
    title: data.title,
    description: data.description,
    durationSeconds:
      data.durationSeconds ??
      (data.duration ? parseInt(data.duration, 10) : 1),
    chapterId: data.chapterId,
    position: data.order,
    videoPath: data.videoUrl,
    thumbnailPath: data.thumbnail,
    thumbnailTempPath: data.thumbnailTempPath,
    videoTempPath: data.videoTempPath,
  });
}

export async function updateLesson(lessonId: string, data: LessonUpdateInput) {
  const existing = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!existing) {
    throw new Error("LESSON_NOT_FOUND");
  }

  if (data.position !== undefined) {
    await assertPositionAvailable(
      existing.courseId,
      data.chapterId ?? existing.chapterId,
      data.position,
      lessonId
    );
  }

  const updateData: Partial<Lesson> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.chapterId !== undefined) updateData.chapterId = data.chapterId;
  if (data.position !== undefined) updateData.order = data.position;
  if (data.durationSeconds !== undefined) {
    updateData.durationSeconds = data.durationSeconds;
    updateData.duration = String(data.durationSeconds);
  }
  if (data.thumbnailPath !== undefined && !data.thumbnailTempPath) {
    updateData.thumbnail = data.thumbnailPath;
  }
  if (data.videoPath !== undefined && !data.videoTempPath) {
    updateData.videoUrl = data.videoPath;
  }

  try {
    if (data.thumbnailTempPath) {
      updateData.thumbnail = await replaceStorageFile(
        existing.thumbnail,
        data.thumbnailTempPath,
        buildLessonThumbnailPath(existing.courseId, lessonId, "thumb.jpg")
      );
    }
    if (data.videoTempPath) {
      updateData.videoUrl = await replaceStorageFile(
        existing.videoUrl,
        data.videoTempPath,
        buildLessonVideoPath(existing.courseId, lessonId, "video.mp4")
      );
    }
  } catch (error) {
    console.error("[updateLesson] media replace failed:", error);
    if (data.thumbnailTempPath) await safeDeleteStoragePath(data.thumbnailTempPath);
    if (data.videoTempPath) await safeDeleteStoragePath(data.videoTempPath);
    throw error;
  }

  return prisma.lesson.update({
    where: { id: lessonId },
    data: updateData,
  });
}

export async function deleteLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    throw new Error("LESSON_NOT_FOUND");
  }

  await prisma.lesson.delete({ where: { id: lessonId } });

  await safeDeleteStoragePath(lesson.thumbnail);
  await safeDeleteStoragePath(lesson.videoUrl);
}

export async function getAllLessons() {
  try {
    return await prisma.lesson.findMany({
      include: {
        course: { select: { id: true, subject: true, slug: true } },
      },
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
    });
  } catch (error) {
    console.error("Error fetching all lessons:", error);
    return [];
  }
}

export function resolveLessonVideoRelativePath(lesson: {
  videoUrl: string | null;
  video?: { originalPath: string | null } | null;
}): string | null {
  if (lesson.video?.originalPath) {
    return getRelativePathFromUrl(lesson.video.originalPath);
  }
  if (!lesson.videoUrl) return null;
  return getRelativePathFromUrl(lesson.videoUrl);
}
