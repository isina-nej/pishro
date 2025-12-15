import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/services/course-service";
import type { Course } from "@prisma/client";

// ===========================
// Query Keys
// ===========================
export const courseKeys = {
  all: ["courses"] as const,
  list: () => [...courseKeys.all, "list"] as const,
  detail: (id: string) => [...courseKeys.all, "detail", id] as const,
};

// ===========================
// Queries
// ===========================

/**
 * Hook برای دریافت لیست تمام دوره‌ها
 * با caching بلند مدت چون دوره‌ها زیاد تغییر نمی‌کنند
 */
export function useCourses() {
  return useQuery<Course[]>({
    queryKey: courseKeys.list(),
    queryFn: getCourses,
    staleTime: 10 * 60 * 1000, // 10 دقیقه fresh - دوره‌ها کمتر تغییر می‌کنند
    gcTime: 30 * 60 * 1000, // 30 دقیقه در cache
    retry: 2, // دوبار retry در صورت خطا
    // refetch در background برای داده‌های fresh
    refetchOnMount: false,
  });
}

/**
 * Hook برای دریافت یک دوره خاص
 * از cache لیست استفاده می‌کند اگر موجود باشد
 */
export function useCourse(courseId: string) {
  return useQuery<Course | undefined>({
    queryKey: courseKeys.detail(courseId),
    queryFn: async () => {
      const courses = await getCourses();
      return courses.find((course) => course.id === courseId);
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!courseId, // فقط اگر courseId وجود داشته باشد
  });
}
