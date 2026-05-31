import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  ErrorCodes,
  errorResponse,
  successResponse,
  validationError,
} from "@/lib/api-response";

function getFinalCoursePrice(course: {
  price: number;
  discountPercent: number | null;
}) {
  if (!course.discountPercent) return course.price;
  return Math.max(0, Math.round(course.price * (1 - course.discountPercent / 100)));
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return errorResponse("برای ثبت‌نام ابتدا وارد حساب خود شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const body = await req.json();
    const courseId = typeof body.courseId === "string" ? body.courseId : "";

    if (!courseId) {
      return validationError({ courseId: "شناسه دوره الزامی است" });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        subject: true,
        price: true,
        discountPercent: true,
        published: true,
        status: true,
      },
    });

    if (!course || !course.published || course.status === "ARCHIVED") {
      return validationError(
        { courseId: "دوره رایگان قابل ثبت‌نام نیست" },
        "دوره یافت نشد یا قابل ثبت‌نام نیست"
      );
    }

    if (getFinalCoursePrice(course) !== 0) {
      return validationError(
        { courseId: "این دوره رایگان نیست" },
        "این دوره نیاز به پرداخت دارد"
      );
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { lastAccessAt: new Date() },
      create: { userId, courseId },
      include: {
        course: {
          select: { id: true, subject: true, img: true },
        },
      },
    });

    return successResponse(enrollment, "دوره رایگان به فهرست شما اضافه شد");
  } catch (error) {
    console.error("[POST /api/courses/free-enroll] error:", error);
    return errorResponse("خطا در ثبت‌نام دوره رایگان", ErrorCodes.DATABASE_ERROR);
  }
}
