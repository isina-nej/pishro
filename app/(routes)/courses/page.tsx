import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import CoursesPageContent from "@/components/courses/coursesPageContent";

export const metadata: Metadata = {
  title: "همه دوره‌ها | پیشرو",
  description: "مشاهده همه دوره‌های آموزشی پیشرو در یک صفحه",
};

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

async function getCoursesGroupedByCategory() {
  try {
    // Fetch all published categories with their courses
    const categories = await prisma.category.findMany({
      where: {
        published: true,
        courses: {
          some: {
            published: true,
          },
        },
      },
      include: {
        courses: {
          where: {
            published: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return [];
  }
}

export default async function AllCoursesPage() {
  const categoriesWithCourses = await getCoursesGroupedByCategory();

  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myPrimary" />
          </div>
        }
      >
        <CoursesPageContent categoriesWithCourses={categoriesWithCourses} />
      </Suspense>
    </main>
  );
}
