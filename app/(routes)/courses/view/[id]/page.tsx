import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import PurchasedCourseContent from "@/components/course/purchasedCourseContent";
import { getPurchasedCourseForUser } from "@/lib/services/user-purchased-course";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Purchased course player — /courses/view/[id]
 * (Static "view" segment avoids conflict with /courses/[categorySlug].)
 */
export default async function PurchasedCoursePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id: courseId } = await params;
  const course = await getPurchasedCourseForUser(session.user.id, courseId);

  if (!course) {
    notFound();
  }

  return <PurchasedCourseContent course={course} />;
}
