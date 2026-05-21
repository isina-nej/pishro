import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/**
 * MySQL: unique (courseId, position) on Chapter — two-phase update inside transaction.
 */
export async function reorderChapters(
  courseId: string,
  orderedIds: string[]
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.chapter.update({
        where: { id: orderedIds[i] },
        data: { position: -(i + 1) },
      });
    }
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.chapter.update({
        where: { id: orderedIds[i] },
        data: { position: i + 1 },
      });
    }
  });
}

/**
 * Application-level position uniqueness per (courseId, chapterId|null).
 */
export async function reorderLessons(
  courseId: string,
  orderedIds: string[]
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const lessons = await tx.lesson.findMany({
      where: { id: { in: orderedIds }, courseId },
      select: { id: true, chapterId: true },
    });

    if (lessons.length !== orderedIds.length) {
      throw new Error("INVALID_LESSON_IDS");
    }

    const byChapter = new Map<string | null, string[]>();
    for (const id of orderedIds) {
      const lesson = lessons.find((l) => l.id === id)!;
      const key = lesson.chapterId ?? null;
      if (!byChapter.has(key)) byChapter.set(key, []);
      byChapter.get(key)!.push(id);
    }

    for (const [, ids] of byChapter) {
      for (let i = 0; i < ids.length; i++) {
        await tx.lesson.update({
          where: { id: ids[i] },
          data: { order: -(i + 1) },
        });
      }
      for (let i = 0; i < ids.length; i++) {
        await tx.lesson.update({
          where: { id: ids[i] },
          data: { order: i + 1 },
        });
      }
    }
  });
}

export function getReorderConflictResponse(error: unknown): boolean {
  return isUniqueConstraintError(error) || error instanceof Error;
}
