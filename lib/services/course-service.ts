import type { Course } from "@/lib/types/db";
import { prisma } from "@/lib/prisma";
import { CourseStatus, Language, CourseLevel } from "@/lib/types/db";

export async function getCourses(): Promise<Course[]> {
  try {
    const courses = await prisma.course.findMany({
      include: {
        tags: { select: { tagId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return courses.map((course) => ({
      id: course.id,
      subject: course.subject,
      price: course.price,
      img: course.img,
      rating: course.rating,
      description: course.description,
      discountPercent: course.discountPercent,
      time: course.time,
      students: course.students,
      videosCount: course.videosCount,
      introVideoUrl: course.introVideoUrl,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      categoryId: course.categoryId,
      slug: course.slug,
      level: course.level as CourseLevel | null,
      language: course.language as Language,
      prerequisites: (course.prerequisites as string[]) ?? [],
      learningGoals: (course.learningGoals as string[]) ?? [],
      instructor: course.instructor,
      status: course.status as CourseStatus,
      published: course.published,
      featured: course.featured,
      views: course.views,
      tagIds: course.tags.map((t) => t.tagId),
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}
