import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getCurrentUser,
  getEnrolledCourses,
  getUserTransactions,
  getUserOrders,
  updateEnrollmentProgress,
  updatePersonalInfo,
  updateAvatar,
  updatePayInfo,
  uploadAvatarImage,
  type UserData,
  type EnrolledCourse,
  type Transaction,
  type UserOrder,
} from "@/lib/services/user-service";
import { ApiSuccessResponse, PaginatedData } from "@/lib/api-response";

// ===========================
// Query Keys - برای مدیریت cache
// ===========================
export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  enrolledCourses: (page: number, limit: number) =>
    [...userKeys.all, "enrolled-courses", { page, limit }] as const,
  transactions: (page: number, limit: number, type?: string, status?: string) =>
    [...userKeys.all, "transactions", { page, limit, type, status }] as const,
  orders: (page: number, limit: number, status?: string) =>
    [...userKeys.all, "orders", { page, limit, status }] as const,
};

// ===========================
// Queries - برای GET کردن داده‌ها
// ===========================

/**
 * Hook برای دریافت اطلاعات کاربر فعلی
 * با caching خودکار و refetch هوشمند
 */
export function useCurrentUser() {
  return useQuery<ApiSuccessResponse<UserData>>({
    queryKey: userKeys.me(),
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 دقیقه fresh
    gcTime: 10 * 60 * 1000, // 10 دقیقه در cache
    retry: 1,
  });
}

/**
 * Hook برای دریافت دوره‌های ثبت‌نام شده
 * با pagination و caching
 */
export function useEnrolledCourses(page: number = 1, limit: number = 10) {
  return useQuery<ApiSuccessResponse<PaginatedData<EnrolledCourse>>>({
    queryKey: userKeys.enrolledCourses(page, limit),
    queryFn: () => getEnrolledCourses(page, limit),
    staleTime: 3 * 60 * 1000, // 3 دقیقه fresh
    placeholderData: (previousData) => previousData, // نگه داشتن داده قبلی موقع تغییر صفحه
  });
}

/**
 * Hook برای دریافت تراکنش‌های کاربر
 * با filter و pagination
 */
export function useUserTransactions(
  page: number = 1,
  limit: number = 20,
  type?: string,
  status?: string
) {
  return useQuery<ApiSuccessResponse<PaginatedData<Transaction>>>({
    queryKey: userKeys.transactions(page, limit, type, status),
    queryFn: () => getUserTransactions(page, limit, type, status),
    staleTime: 2 * 60 * 1000, // 2 دقیقه fresh
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook برای دریافت سفارشات کاربر
 * با filter و pagination
 */
export function useUserOrders(
  page: number = 1,
  limit: number = 10,
  status?: string
) {
  return useQuery<ApiSuccessResponse<PaginatedData<UserOrder>>>({
    queryKey: userKeys.orders(page, limit, status),
    queryFn: () => getUserOrders(page, limit, status),
    staleTime: 2 * 60 * 1000, // 2 دقیقه fresh
    placeholderData: (previousData) => previousData,
  });
}

// ===========================
// Mutations - برای تغییر داده‌ها
// ===========================

/**
 * Hook برای به‌روزرسانی پیشرفت دوره
 * با invalidation خودکار cache
 */
export function useUpdateEnrollmentProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      progress,
      completed,
    }: {
      enrollmentId: string;
      progress: number;
      completed?: boolean;
    }) => updateEnrollmentProgress(enrollmentId, progress, completed),
    onSuccess: () => {
      // Invalidate کردن تمام query های مربوط به enrolled courses
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("پیشرفت دوره با موفقیت به‌روز شد");
    },
    onError: (error: unknown) => {
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "خطا در به‌روزرسانی پیشرفت دوره");
    },
  });
}

/**
 * Hook برای به‌روزرسانی اطلاعات شخصی
 * با optimistic update برای UX بهتر
 */
export function useUpdatePersonalInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePersonalInfo,
    // Optimistic update - به‌روزرسانی فوری UI قبل از دریافت پاسخ سرور
    onMutate: async (newData) => {
      // لغو کردن query های در حال اجرا
      await queryClient.cancelQueries({ queryKey: userKeys.me() });

      // گرفتن داده قبلی برای rollback در صورت خطا
      const previousUser = queryClient.getQueryData<
        ApiSuccessResponse<UserData>
      >(userKeys.me());

      // به‌روزرسانی فوری cache
      if (previousUser) {
        queryClient.setQueryData<ApiSuccessResponse<UserData>>(userKeys.me(), {
          ...previousUser,
          data: {
            ...previousUser.data,
            ...newData,
            birthDate:
              newData.birthDate instanceof Date
                ? newData.birthDate.toISOString()
                : previousUser.data.birthDate,
          },
        });
      }

      return { previousUser };
    },
    onSuccess: () => {
      toast.success("اطلاعات شخصی با موفقیت به‌روز شد");
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    onError: (error: unknown, _newData, context) => {
      // برگرداندن داده قبلی در صورت خطا
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.me(), context.previousUser);
      }
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "خطا در به‌روزرسانی اطلاعات شخصی");
    },
  });
}

/**
 * Hook برای به‌روزرسانی آواتار
 */
export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      toast.success("تصویر پروفایل با موفقیت به‌روز شد");
    },
    onError: (error: unknown) => {
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "خطا در به‌روزرسانی تصویر پروفایل");
    },
  });
}

/**
 * Hook برای به‌روزرسانی اطلاعات پرداخت
 */
export function useUpdatePayInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePayInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      toast.success("اطلاعات پرداخت با موفقیت به‌روز شد");
    },
    onError: (error: unknown) => {
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "خطا در به‌روزرسانی اطلاعات پرداخت");
    },
  });
}

/**
 * Hook برای آپلود تصویر پروفایل
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatarImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      toast.success("تصویر پروفایل با موفقیت آپلود شد");
    },
    onError: (error: unknown) => {
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "خطا در آپلود تصویر پروفایل");
    },
  });
}
