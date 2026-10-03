import axios from "axios";
import type { NewsArticle } from "@prisma/client";
import { ApiResponse, PaginatedData } from "@/lib/api-response";
import { getInternalBaseUrl } from "@/lib/get-base-url";

export interface NewsListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  published?: boolean;
  sort?: string;
  timeRange?: string;
}

export type NewsSortOption = "جدیدترین" | "پربازدیدترین" | "محبوب‌ترین";

/** Page size for infinite scroll — 12 cards = 4 rows × 3 cols on desktop. */
export const NEWS_PAGE_SIZE = 12;

export interface NewsStats {
  totalNews: number;
  featured: number;
  thisMonth: number;
  avgViews: number;
  categories: string[];
}

/** Build query string for GET /api/news — shared by getNews and infinite hook. */
export function buildNewsSearchParams(params?: NewsListParams): URLSearchParams {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.category) queryParams.set("category", params.category);
  if (params?.search) queryParams.set("search", params.search);
  if (params?.published !== undefined)
    queryParams.set("published", params.published.toString());
  if (params?.sort) queryParams.set("sort", params.sort);
  if (params?.timeRange) queryParams.set("timeRange", params.timeRange);
  return queryParams;
}

/** Flatten useInfiniteQuery pages into one list (append, never replace). */
export function flattenNewsPages(
  pages: PaginatedData<NewsArticle>[] | undefined
): NewsArticle[] {
  if (!pages) return [];
  return pages.flatMap((page) => page.items ?? []);
}

/** Total across the whole DB — identical on every page; read from last page. */
export function getNewsTotal(
  pages: PaginatedData<NewsArticle>[] | undefined
): number {
  if (!pages || pages.length === 0) return 0;
  return pages[pages.length - 1].pagination.total ?? 0;
}

export async function getNews(
  params?: NewsListParams
): Promise<PaginatedData<NewsArticle>> {
  try {
    const baseUrl = getInternalBaseUrl();

    const queryParams = buildNewsSearchParams(params);

    const url = `${baseUrl}/api/news${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const { data } = await axios.get<ApiResponse<PaginatedData<NewsArticle>>>(
      url
    );

    if (data.status === "success") {
      return data.data as PaginatedData<NewsArticle>;
    }

    throw new Error("Failed to fetch news");
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news");
  }
}

export async function getNewsStats(): Promise<NewsStats> {
  try {
    const baseUrl = getInternalBaseUrl();
    const { data } = await axios.get<ApiResponse<NewsStats>>(
      `${baseUrl}/api/news/stats`
    );
    if (data.status === "success") {
      return data.data as NewsStats;
    }
    throw new Error("Failed to fetch news stats");
  } catch (error) {
    console.error("Error fetching news stats:", error);
    throw new Error("Failed to fetch news stats");
  }
}

export async function getNewsById(id: string): Promise<NewsArticle> {
  try {
    const baseUrl = getInternalBaseUrl();

    const { data } = await axios.get<ApiResponse<NewsArticle>>(
      `${baseUrl}/api/news/${id}`
    );

    if (data.status === "success") {
      return data.data as NewsArticle;
    }

    throw new Error("Failed to fetch news article");
  } catch (error) {
    console.error("Error fetching news article:", error);
    throw new Error("Failed to fetch news article");
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const baseUrl = getInternalBaseUrl();

    const { data } = await axios.get<ApiResponse<NewsArticle>>(
      `${baseUrl}/api/news/${slug}`
    );

    if (data.status === "success") {
      return data.data as NewsArticle;
    }

    return null;
  } catch (error) {
    console.error("Error fetching news article by slug:", error);
    return null;
  }
}

export async function createNewsArticle(
  articleData: Partial<NewsArticle>
): Promise<NewsArticle> {
  try {
    const baseUrl = getInternalBaseUrl();

    const { data } = await axios.post<ApiResponse<NewsArticle>>(
      `${baseUrl}/api/news`,
      articleData
    );

    if (data.status === "success") {
      return data.data as NewsArticle;
    }

    throw new Error("Failed to create news article");
  } catch (error) {
    console.error("Error creating news article:", error);
    throw new Error("Failed to create news article");
  }
}
