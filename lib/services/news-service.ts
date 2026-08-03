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
}

export async function getNews(
  params?: NewsListParams
): Promise<PaginatedData<NewsArticle>> {
  try {
    const baseUrl = getInternalBaseUrl();

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.category) queryParams.set("category", params.category);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.published !== undefined)
      queryParams.set("published", params.published.toString());

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
