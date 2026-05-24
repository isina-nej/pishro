import { auth } from "@/auth";
import PurchasedCourseContent from "@/components/course/purchasedCourseContent";
import { getPurchasedCourseForUser } from "@/lib/services/user-purchased-course";
import { redirect } from "next/navigation";

interface PurchasedCoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function PurchasedCoursePage({
  params,
}: PurchasedCoursePageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { courseId } = await params;
  const course = await getPurchasedCourseForUser(session.user.id, courseId);

  if (!course) {
    redirect("/profile/courses");
  }

  return <PurchasedCourseContent course={course} />;
}
