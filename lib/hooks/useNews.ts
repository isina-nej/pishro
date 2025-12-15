import { useQuery } from "@tanstack/react-query";
import { getNews, getNewsById, NewsListParams } from "@/lib/services/news-service";
import type { NewsArticle } from "@prisma/client";
import { PaginatedData } from "@/lib/api-response";

// ===========================
// Query Keys
// ===========================
export const newsKeys = {
  all: ["news"] as const,
  list: (params?: NewsListParams) => [...newsKeys.all, "list", params] as const,
  detail: (id: string) => [...newsKeys.all, "detail", id] as const,
};

// ===========================
// Queries
// ===========================

/**
 * Hook برای دریافت لیست اخبار با فیلترینگ و صفحه‌بندی
 */
export function useNewsList(params?: NewsListParams) {
  return useQuery<PaginatedData<NewsArticle>>({
    queryKey: newsKeys.list(params),
    queryFn: () => getNews(params),
    staleTime: 5 * 60 * 1000, // 5 دقیقه fresh - اخبار ممکن است بیشتر به‌روز شوند
    gcTime: 30 * 60 * 1000, // 30 دقیقه در cache
    retry: 2, // دوبار retry در صورت خطا
    refetchOnMount: false,
  });
}

/**
 * Hook برای دریافت یک خبر خاص
 */
export function useNewsDetail(id: string, enabled: boolean = true) {
  return useQuery<NewsArticle>({
    queryKey: newsKeys.detail(id),
    queryFn: () => getNewsById(id),
    staleTime: 10 * 60 * 1000, // 10 دقیقه fresh
    gcTime: 30 * 60 * 1000,
    enabled: !!id && enabled, // فقط اگر id وجود داشته باشد
  });
}
