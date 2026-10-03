import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  getCourses,
  COURSES_PAGE_SIZE,
  buildCourseSearchParams,
  type CourseListParams,
} from "@/lib/services/course-service";
import type { Course } from "@/lib/types/db";
import type { PaginatedData } from "@/lib/api-response";

// ===========================
// Query Keys
// ===========================
export const courseKeys = {
  all: ["courses"] as const,
  list: () => [...courseKeys.all, "list"] as const,
  infinite: (params?: Omit<CourseListParams, "page">) =>
    [...courseKeys.all, "infinite", params] as const,
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
    queryFn: () => getCourses(),
    staleTime: 10 * 60 * 1000, // 10 دقیقه fresh - دوره‌ها کمتر تغییر می‌کنند
    gcTime: 30 * 60 * 1000, // 30 دقیقه در cache
    retry: 2, // دوبار retry در صورت خطا
    // refetch در background برای داده‌های fresh
    refetchOnMount: false,
  });
}

// ponytail: key swallows only defined values so typing a search term doesn't nuke loaded pages
const infiniteKeyParams = (params?: Omit<CourseListParams, "page">) =>
  params ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) : params;

/**
 * Hook infinite-scroll برای صفحه عمومی دوره‌ها
 * هر صفحه COURSES_PAGE_SIZE دوره بارگذاری می‌کند؛ با اسکرول ادامه می‌دهد.
 */
export function useCoursesInfinite(params?: Omit<CourseListParams, "page">) {
  const stable = JSON.stringify(infiniteKeyParams(params) ?? null);
  return useInfiniteQuery<PaginatedData<Course>>({
    queryKey: courseKeys.infinite(JSON.parse(stable)),
    queryFn: async ({ pageParam = 1 }) => {
      const qs = buildCourseSearchParams({
        ...(JSON.parse(stable) as Omit<CourseListParams, "page">),
        page: pageParam as number,
        limit: COURSES_PAGE_SIZE,
      });
      const { data } = await axios.get<{ status: string; data: PaginatedData<Course> }>(
        `/api/courses?${qs.toString()}`
      );
      if (data.status === "success") return data.data as PaginatedData<Course>;
      throw new Error("Failed to fetch courses");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
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
