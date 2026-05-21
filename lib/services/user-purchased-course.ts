import { prisma } from "@/lib/prisma";

const lessonSelect = {
  id: true,
  title: true,
  description: true,
  durationSeconds: true,
  duration: true,
  thumbnail: true,
  order: true,
  chapterId: true,
} as const;

export type PurchasedLessonSummary = {
  id: string;
  title: string;
  description: string | null;
  durationSeconds: number | null;
  duration: string | null;
  thumbnail: string | null;
  order: number;
  chapterId: string | null;
};

export type PurchasedChapterSummary = {
  id: string;
  title: string;
  position: number;
  lessons: PurchasedLessonSummary[];
};

export type PurchasedCourseDetail = {
  id: string;
  subject: string;
  description: string | null;
  instructor: string | null;
  img: string | null;
  hasChapters: boolean;
  chapters: PurchasedChapterSummary[];
  lessons: PurchasedLessonSummary[];
};

export async function userHasEnrollment(
  userId: string,
  courseId: string
): Promise<boolean> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true },
  });
  return !!enrollment;
}

export async function getPurchasedCourseForUser(
  userId: string,
  courseId: string
): Promise<PurchasedCourseDetail | null> {
  const enrolled = await userHasEnrollment(userId, courseId);
  if (!enrolled) return null;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      subject: true,
      description: true,
      instructor: true,
      img: true,
      hasChapters: true,
      chapters: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            where: { published: true },
            orderBy: { order: "asc" },
            select: lessonSelect,
          },
        },
      },
      lessons: {
        where: { published: true, chapterId: null },
        orderBy: { order: "asc" },
        select: lessonSelect,
      },
    },
  });

  if (!course) return null;

  return {
    id: course.id,
    subject: course.subject,
    description: course.description,
    instructor: course.instructor,
    img: course.img,
    hasChapters: course.hasChapters,
    chapters: course.chapters,
    lessons: course.lessons,
  };
}
