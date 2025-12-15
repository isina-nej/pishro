import { useQuery } from "@tanstack/react-query";
import { getBooks, getBookById, BookListParams } from "@/lib/services/library-service";
import type { DigitalBook } from "@prisma/client";
import { PaginatedData } from "@/lib/api-response";

// ===========================
// Query Keys
// ===========================
export const bookKeys = {
  all: ["books"] as const,
  list: (params?: BookListParams) => [...bookKeys.all, "list", params] as const,
  detail: (id: string) => [...bookKeys.all, "detail", id] as const,
};

// ===========================
// Queries
// ===========================

/**
 * Hook برای دریافت لیست کتاب‌ها با فیلترینگ و صفحه‌بندی
 */
export function useBooksList(params?: BookListParams) {
  return useQuery<PaginatedData<DigitalBook>>({
    queryKey: bookKeys.list(params),
    queryFn: () => getBooks(params),
    staleTime: 10 * 60 * 1000, // 10 دقیقه fresh - کتاب‌ها کمتر تغییر می‌کنند
    gcTime: 30 * 60 * 1000, // 30 دقیقه در cache
    retry: 2, // دوبار retry در صورت خطا
    refetchOnMount: false,
  });
}

/**
 * Hook برای دریافت یک کتاب خاص
 */
export function useBookDetail(id: string, enabled: boolean = true) {
  return useQuery<DigitalBook>({
    queryKey: bookKeys.detail(id),
    queryFn: () => getBookById(id),
    staleTime: 10 * 60 * 1000, // 10 دقیقه fresh
    gcTime: 30 * 60 * 1000,
    enabled: !!id && enabled, // فقط اگر id وجود داشته باشد
  });
}
