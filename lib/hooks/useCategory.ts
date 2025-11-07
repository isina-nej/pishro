/**
 * React Query hooks for category data
 * Client-side data fetching with caching and revalidation
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Category data type matching API response
 */
export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  color: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  content?: PageContent[];
  tags?: Tag[];
  faqs?: FAQ[];
  testimonials?: Testimonial[];
  courses?: Course[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PageContent {
  id: string;
  type: string;
  content: unknown;
  published: boolean;
  order: number;
}

export interface Tag {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  usageCount: number;
  clicks: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  faqCategory: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  views: number;
  helpful: number;
  notHelpful: number;
}

export interface Testimonial {
  id: string;
  userName: string;
  userAvatar: string | null;
  userRole: string | null;
  userCompany: string | null;
  rating: number;
  content: string;
  published: boolean;
  verified: boolean;
  featured: boolean;
  likes: number;
  views: number;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
  discountPrice: number | null;
  level: string;
  duration: number | null;
  published: boolean;
  featured: boolean;
}

/**
 * Query keys for React Query cache management
 */
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (slug: string, include?: string) =>
    [...categoryKeys.details(), slug, { include }] as const,
  tags: (slug: string) => [...categoryKeys.all, slug, "tags"] as const,
  faqs: (slug: string) => [...categoryKeys.all, slug, "faqs"] as const,
  courses: (slug: string, filters?: object) =>
    [...categoryKeys.all, slug, "courses", { filters }] as const,
};

/**
 * Fetch category by slug with optional includes
 * @param slug - Category slug
 * @param options - Query options (include, limit, page, level)
 */
export function useCategory(
  slug: string,
  options: {
    include?: string[];
    limit?: number;
    page?: number;
    level?: string;
    enabled?: boolean;
  } = {}
) {
  const { include, limit, page, level, enabled = true } = options;

  return useQuery({
    queryKey: categoryKeys.detail(slug, include?.join(",") || "all"),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (include?.length) {
        params.append("include", include.join(","));
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      if (page) {
        params.append("page", page.toString());
      }
      if (level) {
        params.append("level", level);
      }

      const response = await axios.get<ApiResponse<Category>>(
        `/api/categories/${slug}?${params.toString()}`
      );

      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch category");
      }

      return response.data.data!;
    },
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Fetch category tags
 * @param slug - Category slug
 * @param limit - Maximum number of tags
 */
export function useCategoryTags(slug: string, limit: number = 20) {
  return useQuery({
    queryKey: categoryKeys.tags(slug),
    queryFn: async () => {
      const response = await axios.get<ApiResponse<{ tags: Tag[] }>>(
        `/api/categories/${slug}?include=tags&limit=${limit}`
      );

      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch tags");
      }

      return response.data.data?.tags || [];
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch category FAQs
 * @param slug - Category slug
 * @param limit - Maximum number of FAQs
 */
export function useCategoryFAQs(slug: string, limit: number = 10) {
  return useQuery({
    queryKey: categoryKeys.faqs(slug),
    queryFn: async () => {
      const response = await axios.get<ApiResponse<{ faqs: FAQ[] }>>(
        `/api/categories/${slug}?include=faqs&limit=${limit}`
      );

      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch FAQs");
      }

      return response.data.data?.faqs || [];
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Fetch category courses with pagination
 * @param slug - Category slug
 * @param options - Filter and pagination options
 */
export function useCategoryCourses(
  slug: string,
  options: {
    page?: number;
    limit?: number;
    level?: string;
  } = {}
) {
  const { page = 1, limit = 12, level } = options;

  return useQuery({
    queryKey: categoryKeys.courses(slug, { page, limit, level }),
    queryFn: async () => {
      const params = new URLSearchParams({
        include: "courses",
        page: page.toString(),
        limit: limit.toString(),
      });

      if (level) {
        params.append("level", level);
      }

      const response = await axios.get<
        ApiResponse<{
          courses: Course[];
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        }>
      >(`/api/categories/${slug}?${params.toString()}`);

      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch courses");
      }

      return response.data.data!;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

/**
 * Mutation to trigger manual revalidation (admin only)
 * @param path - Path or array of paths to revalidate
 */
export function useRevalidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      path?: string | string[];
      tag?: string | string[];
      type?: "path" | "tag";
    }) => {
      const response = await axios.post<ApiResponse<unknown>>("/api/admin/revalidate", data);

      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to revalidate cache");
      }

      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all category queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

/**
 * Mutation to track tag clicks (analytics)
 * @param tagId - Tag ID
 */
export function useTrackTagClick() {
  return useMutation({
    mutationFn: async (tagId: string) => {
      const response = await axios.post("/api/analytics/tag-click", {
        tagId,
      });
      return response.data;
    },
    // No need to invalidate queries for analytics
  });
}

/**
 * Mutation to track FAQ views (analytics)
 * @param faqId - FAQ ID
 */
export function useTrackFAQView() {
  return useMutation({
    mutationFn: async (faqId: string) => {
      const response = await axios.post("/api/analytics/faq-view", {
        faqId,
      });
      return response.data;
    },
  });
}

/**
 * Hook to prefetch category data
 * Useful for link hover prefetching
 */
export function usePrefetchCategory() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: categoryKeys.detail(slug, "all"),
      queryFn: async () => {
        const response = await axios.get<ApiResponse<Category>>(
          `/api/categories/${slug}?include=all`
        );
        return response.data.data!;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}
