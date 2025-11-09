// app/components/utils/CoursesSec.server.tsx
import CoursesGridClient from "./CoursesGrid.client";
import { getCoursesByPrisma } from "@/lib/services/course-service";
import { Course } from "@prisma/client";

export default async function CoursesSec() {
  try {
    const courses: Course[] = await getCoursesByPrisma(); // fetch server-side
    return <CoursesGridClient courses={courses} />;
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return empty courses array if database is not available (e.g., during build)
    return <CoursesGridClient courses={[]} />;
  }
}
