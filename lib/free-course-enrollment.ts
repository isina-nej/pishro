export type CourseLikeForFreeEnrollment = {
  id: string;
  subject: string;
  price: number;
  discountPercent?: number | null;
};

export function getFinalCoursePrice(course: {
  price: number;
  discountPercent?: number | null;
}) {
  if (!course.discountPercent) return course.price;
  return Math.max(0, Math.round(course.price * (1 - course.discountPercent / 100)));
}

export function isFreeCourse(course: {
  price: number;
  discountPercent?: number | null;
}) {
  return getFinalCoursePrice(course) === 0;
}

export async function enrollFreeCourse(courseId: string) {
  const response = await fetch("/api/courses/free-enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || "ثبت‌نام دوره رایگان انجام نشد");
  }

  return payload;
}

export function redirectToLoginForFreeCourse(courseId: string) {
  const callbackUrl = "/profile/courses";
  const params = new URLSearchParams({
    freeCourseId: courseId,
    callbackUrl,
  });

  window.location.href = `/login?${params.toString()}`;
}

export async function completeFreeEnrollmentFromLoginUrl() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("freeCourseId");
  const callbackUrl = params.get("callbackUrl") || "/profile/courses";

  if (!courseId) return null;

  await enrollFreeCourse(courseId);

  return { courseId, callbackUrl };
}
