// lib/services/course.server.ts
// Server-side only course functions using Prisma
"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get all published courses with their categories
 * Used in pages/layouts for data fetching
 */
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
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                slug: true,
                title: true,
                color: true,
                icon: true,
              },
            },
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
      .filter(
        (course: any) =>
          course.slug && course.category?.slug && course.category?.published
      )
      .map((course: any) => ({
        categorySlug: course.category!.slug,
        courseSlug: course.slug!,
      }));
  } catch (error) {
    console.error("Error fetching course slugs:", error);
    return [];
  }
}
