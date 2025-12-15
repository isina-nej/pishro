/**
 * React Query hooks for comments data
 * Client-side data fetching with caching and revalidation
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ApiSuccessResponse } from "@/lib/api-response";

/**
 * Comment data type matching API response
 */
export interface Comment {
  id: string;
  userId: string | null;
  userName: string | null;
  userAvatar: string | null;
  userRole: string | null;
  userCompany: string | null;
  rating: number | null;
  text: string;
  published: boolean;
  verified: boolean;
  featured: boolean;
  likes: string[];
  dislikes: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

/**
 * Options for fetching comments
 */
export interface CommentsOptions {
  categoryId?: string;
  courseId?: string;
  userId?: string;
  published?: boolean;
  verified?: boolean;
  featured?: boolean;
  limit?: number;
}

/**
 * Query keys for React Query cache management
 */
export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (filters: CommentsOptions) => [...commentKeys.lists(), { filters }] as const,
};

/**
 * Fetch comments with optional filters
 * @param options - Filter options for comments
 */
export function useComments(options: CommentsOptions & { enabled?: boolean } = {}) {
  const { enabled = true, ...filters } = options;

  return useQuery({
    queryKey: commentKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.courseId) params.append("courseId", filters.courseId);
      if (filters.userId) params.append("userId", filters.userId);
      if (filters.published !== undefined) params.append("published", String(filters.published));
      if (filters.verified !== undefined) params.append("verified", String(filters.verified));
      if (filters.featured !== undefined) params.append("featured", String(filters.featured));
      if (filters.limit) params.append("limit", String(filters.limit));

      const response = await axios.get<ApiSuccessResponse<Comment[]>>(
        `/api/comments?${params.toString()}`
      );

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "خطا در دریافت نظرات");
      }

      return response.data.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch featured/verified comments for homepage
 * @param limit - Maximum number of comments to fetch
 */
export function useFeaturedComments(limit: number = 10) {
  return useComments({
    published: true,
    verified: true,
    featured: true,
    limit,
  });
}

/**
 * Fetch comments for a specific category
 * @param categoryId - Category ID
 * @param limit - Maximum number of comments
 */
export function useCategoryComments(categoryId: string, limit: number = 10) {
  return useComments({
    categoryId,
    published: true,
    verified: true,
    limit,
    enabled: !!categoryId,
  });
}

/**
 * Fetch comments for a specific course
 * @param courseId - Course ID
 * @param limit - Maximum number of comments
 */
export function useCourseComments(courseId: string, limit: number = 20) {
  return useComments({
    courseId,
    published: true,
    limit,
    enabled: !!courseId,
  });
}

/**
 * Mutation to like a comment
 * @param commentId - Comment ID
 */
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await axios.post<ApiSuccessResponse<unknown>>(
        `/api/comments/${commentId}/like`
      );

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "خطا در ثبت لایک");
      }

      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all comment queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}

/**
 * Mutation to dislike a comment
 * @param commentId - Comment ID
 */
export function useDislikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await axios.post<ApiSuccessResponse<unknown>>(
        `/api/comments/${commentId}/dislike`
      );

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "خطا در ثبت دیسلایک");
      }

      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all comment queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}

/**
 * Hook to prefetch comments data
 * Useful for link hover prefetching
 */
export function usePrefetchComments() {
  const queryClient = useQueryClient();

  return (options: CommentsOptions = {}) => {
    queryClient.prefetchQuery({
      queryKey: commentKeys.list(options),
      queryFn: async () => {
        const params = new URLSearchParams();

        if (options.categoryId) params.append("categoryId", options.categoryId);
        if (options.courseId) params.append("courseId", options.courseId);
        if (options.userId) params.append("userId", options.userId);
        if (options.published !== undefined) params.append("published", String(options.published));
        if (options.verified !== undefined) params.append("verified", String(options.verified));
        if (options.featured !== undefined) params.append("featured", String(options.featured));
        if (options.limit) params.append("limit", String(options.limit));

        const response = await axios.get<ApiSuccessResponse<Comment[]>>(
          `/api/comments?${params.toString()}`
        );

        return response.data.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}
