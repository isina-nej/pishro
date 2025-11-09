import axios from "axios";
import type { Course } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiSuccessResponse } from "@/lib/api-response";

export async function getCourses(): Promise<Course[]> {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        : "http://localhost:3000";
    const { data } = await axios.get<ApiSuccessResponse<Course[]>>(`${baseUrl}/api/courses`, {
      headers: { "Cache-Control": "no-cache" },
    });

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch courses");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

export async function getCoursesByPrisma() {
  return prisma.course.findMany({
    where: { published: true },
    include: {
      category: {
        select: {
          id: true,
          slug: true,
          title: true,
          color: true,
          icon: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single course by its slug and category slug
 * Used for SSR/ISR in course detail pages
 */
export async function getCourseBySlug(
  categorySlug: string,
  courseSlug: string
) {
  try {
    const course = await prisma.course.findFirst({
      where: {
        slug: courseSlug,
        published: true,
        category: {
          slug: categorySlug,
          published: true,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
            color: true,
            icon: true,
          },
        },
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true,
            color: true,
            icon: true,
          },
        },
        comments: {
          where: {
            published: true,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            comments: true,
          },
        },
      },
    });

    return course;
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    return null;
  }
}

/**
 * Get all course slugs with their category slugs for static generation
 * Used in generateStaticParams for ISR
 */
export async function getAllCourseSlugs() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        slug: {
          not: {
            equals: null,
          },
        },
        category: {
          isNot: null,
        },
      },
      select: {
        slug: true,
        category: {
          select: {
            slug: true,
            published: true,
          },
        },
      },
    });

    return courses
      .filter((course) => course.slug && course.category?.slug && course.category?.published)
      .map((course) => ({
        categorySlug: course.category!.slug,
        courseSlug: course.slug!,
      }));
  } catch (error) {
    console.error("Error fetching course slugs:", error);
    return [];
  }
}
