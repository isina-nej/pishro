// app/components/utils/CoursesSec.server.tsx
import CoursesGridClient from "./CoursesGrid.client";
import { prisma } from "@/lib/prisma";

export default async function CoursesSec() {
  try {
    // Fetch only 6 courses for home page
    const courses = await prisma.course.findMany({
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
      take: 6,
    });
    return <CoursesGridClient courses={courses} />;
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return empty courses array if database is not available (e.g., during build)
    return <CoursesGridClient courses={[]} />;
  }
}
