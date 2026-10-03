import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getNews, getNewsById, getNewsStats, NEWS_PAGE_SIZE, buildNewsSearchParams, type NewsListParams, type NewsStats } from "@/lib/services/news-service";
import type { NewsArticle } from "@/lib/types/db";
import { PaginatedData } from "@/lib/api-response";
import axios from "axios";

// ===========================
// Query Keys
// ===========================
export const newsKeys = {
  all: ["news"] as const,
  list: (params?: NewsListParams) => [...newsKeys.all, "list", params] as const,
  infinite: (params?: Omit<NewsListParams, "page">) => [...newsKeys.all, "infinite", params] as const,
  stats: () => [...newsKeys.all, "stats"] as const,
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
    // The service is typed against Prisma's NewsArticle, but the API returns
    // JSON columns already parsed, which is what lib/types/db models.
    queryFn: () =>
      getNews(params) as unknown as Promise<PaginatedData<NewsArticle>>,
    staleTime: 5 * 60 * 1000, // 5 دقیقه fresh - اخبار ممکن است بیشتر به‌روز شوند
    gcTime: 30 * 60 * 1000, // 30 دقیقه در cache
    retry: 2, // دوبار retry در صورت خطا
    refetchOnMount: false,
  });
}

/**
 * Hook infinite-scroll برای صفحه عمومی اخبار
 * هر صفحه NEWS_PAGE_SIZE مقاله بارگذاری می‌کند و کاربر با «بارگذاری بیشتر» ادامه می‌دهد.
 */
// ponytail: key swallows only defined values so typing a search term doesn't nuke loaded pages
const infiniteKeyParams = (params?: Omit<NewsListParams, "page">) =>
  params ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) : params;

export function useNewsInfinite(params?: Omit<NewsListParams, "page">) {
  const stable = JSON.stringify(infiniteKeyParams(params) ?? null);
  return useInfiniteQuery<PaginatedData<NewsArticle>>({
    queryKey: newsKeys.infinite(JSON.parse(stable)),
    queryFn: async ({ pageParam = 1 }) => {
      const qs = buildNewsSearchParams({ ...(JSON.parse(stable) as Omit<NewsListParams, "page">), page: pageParam as number, limit: NEWS_PAGE_SIZE });
      const { data } = await axios.get<{ status: string; data: PaginatedData<NewsArticle> }>(
        `/api/news?${qs.toString()}`
      );
      if (data.status === "success") return data.data as PaginatedData<NewsArticle>;
      throw new Error("Failed to fetch news");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnMount: false,
  });
}

/**
 * Hook برای آمار کلی اخبار (تعداد واقعی از سرور)
 */
export function useNewsStats() {
  return useQuery<NewsStats>({
    queryKey: newsKeys.stats(),
    queryFn: () => getNewsStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnMount: false,
  });
}

/**
 * Hook برای دریافت یک خبر خاص
 */
export function useNewsDetail(id: string, enabled: boolean = true) {
  return useQuery<NewsArticle>({
    queryKey: newsKeys.detail(id),
    queryFn: () => getNewsById(id) as unknown as Promise<NewsArticle>,
    staleTime: 10 * 60 * 1000, // 10 دقیقه fresh
    gcTime: 30 * 60 * 1000,
    enabled: !!id && enabled, // فقط اگر id وجود داشته باشد
  });
}
