// GET /api/user/courses/:courseId — purchased course detail for enrolled user.
import { auth } from "@/auth";
import {
  getPurchasedCourseForUser,
  userHasEnrollment,
} from "@/lib/services/user-purchased-course";
import {
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

interface UserCourseRouteProps {
  params: Promise<{ courseId: string }>;
}

export async function GET(_req: Request, { params }: UserCourseRouteProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { courseId } = await params;
    if (!courseId) {
      return notFoundResponse("Course", "دوره یافت نشد");
    }

    const enrolled = await userHasEnrollment(session.user.id, courseId);
    if (!enrolled) {
      return forbiddenResponse("شما در این دوره ثبت‌نام نکرده‌اید");
    }

    const course = await getPurchasedCourseForUser(session.user.id, courseId);
    if (!course) {
      return notFoundResponse("Course", "دوره یافت نشد");
    }

    return successResponse(course, "جزئیات دوره با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/user/courses/[courseId]] error:", error);
    return errorResponse(
      "خطایی در دریافت جزئیات دوره رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
