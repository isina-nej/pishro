import axios from "axios";
import type { Course } from "@/lib/types/db";
import { prisma } from "@/lib/prisma";
import { CourseStatus, Language, CourseLevel } from "@/lib/types/db";
import type { PaginatedData } from "@/lib/api-response";
import { getInternalBaseUrl } from "@/lib/get-base-url";

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

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  categoryId?: string;
  sort?: "جدیدترین" | "محبوب‌ترین" | "پرفروش‌ترین";
}

/** Page size for courses infinite scroll — matches server default. */
export const COURSES_PAGE_SIZE = 12;

export function buildCourseSearchParams(params?: CourseListParams): URLSearchParams {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", params.page.toString());
  if (params?.limit) qs.set("limit", params.limit.toString());
  if (params?.search) qs.set("search", params.search);
  if (params?.level) qs.set("level", params.level);
  if (params?.categoryId) qs.set("categoryId", params.categoryId);
  if (params?.sort) qs.set("sort", params.sort);
  return qs;
}

/** Flatten useInfiniteQuery pages into one list (append, never replace). */
export function flattenCoursePages(
  pages: PaginatedData<Course>[] | undefined
): Course[] {
  if (!pages) return [];
  return pages.flatMap((page) => page.items ?? []);
}

/** Total across the whole DB — identical on every page; read from last page. */
export function getCoursesTotal(
  pages: PaginatedData<Course>[] | undefined
): number {
  if (!pages || pages.length === 0) return 0;
  return pages[pages.length - 1].pagination.total ?? 0;
}

/** Server-side paginated fetch used by the public courses page. */
export async function getCoursesPage(
  params?: CourseListParams
): Promise<PaginatedData<Course>> {
  const qs = buildCourseSearchParams(params);
  const baseUrl = getInternalBaseUrl();
  const { data } = await axios.get<{ status: string; data: PaginatedData<Course> }>(
    `${baseUrl}/api/courses${qs.toString() ? `?${qs.toString()}` : ""}`
  );
  if (data.status === "success") return data.data as PaginatedData<Course>;
  throw new Error("Failed to fetch courses");
}
