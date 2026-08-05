/**
 * React Query Hooks for Block-Based News
 * 
 * Handles data fetching, caching, and mutations for news articles
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  NewsListResponse,
  NewsDetailResponse,
  CreateNewsRequest,
  UpdateNewsRequest,
} from '@/lib/types/block-news';

/** JSend-style envelope the block-news endpoints wrap their payload in */
interface BlockNewsEnvelope<T> {
  status?: string;
  message?: string;
  data?: T;
}

/**
 * Query key factory for consistent key naming
 */
export const blockNewsKeys = {
  all: ['blockNews'],
  lists: () => [...blockNewsKeys.all, 'list'],
  list: (filters?: { page?: number; limit?: number; status?: string; search?: string }) =>
    [...blockNewsKeys.lists(), filters],
  details: () => [...blockNewsKeys.all, 'detail'],
  detail: (id: string) => [...blockNewsKeys.details(), id],
  blocks: (id: string) => [...blockNewsKeys.all, 'blocks', id],
  block: (id: string, blockId: string) => [...blockNewsKeys.all, 'blocks', id, blockId],
};

/**
 * GET /api/admin/block-news - List news with pagination and filters
 */
export function useBlockNewsList(
  page: number = 1,
  limit: number = 20,
  filters?: { status?: string; categoryId?: string; search?: string }
) {
  return useQuery({
    queryKey: blockNewsKeys.list({ page, limit, ...filters }),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (filters?.status) params.set('status', filters.status);
      if (filters?.categoryId) params.set('categoryId', filters.categoryId);
      if (filters?.search) params.set('search', filters.search);

      const response =
        await api.get<BlockNewsEnvelope<NewsListResponse> | NewsListResponse>(
          `/api/admin/block-news?${params.toString()}`
        );
      const data = response.data;

      // Extract the actual data from the API response wrapper
      if (data && 'data' in data && data.data && 'items' in data.data && 'pagination' in data.data) {
        return data.data;
      }

      // Fallback: if it already has items/pagination structure
      if (data && 'items' in data && 'pagination' in data) {
        return data;
      }
      
      throw new Error('Invalid API response structure - missing pagination data');
    },
  });
}

/**
 * GET /api/admin/block-news/[id] - Fetch single news article
 */
export function useBlockNews(id: string) {
  return useQuery({
    queryKey: blockNewsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<{ status: string; data: NewsDetailResponse; message?: string }>(`/api/admin/block-news/${id}`);
      const data = response.data;
      
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
      }
      
      return data as unknown as NewsDetailResponse;
    },
    enabled: !!id,
  });
}

/**
 * POST /api/admin/block-news - Create new news article
 */
export function useCreateBlockNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNewsRequest) => {
      try {
        console.log('[useCreateBlockNews] Sending request with data:', data);
        const response = await api.post<
          BlockNewsEnvelope<NewsDetailResponse> | NewsDetailResponse | string
        >('/api/admin/block-news', data);
        const responseData = response.data;
        console.log('[useCreateBlockNews] Response data:', responseData);

        if (typeof responseData === 'string') {
          console.error('[useCreateBlockNews] ERROR: Response is HTML string, not JSON');
          throw new Error(`API Error: Received HTML instead of JSON. Status: ${response.status}`);
        }

        if (responseData && 'data' in responseData && responseData.data && 'id' in responseData.data) {
          console.log('[useCreateBlockNews] Extracted from nested data.data:', responseData.data);
          return responseData.data;
        }

        // Fallback: return the response as-is if it already has an id
        if (responseData && 'id' in responseData) {
          console.log('[useCreateBlockNews] Extracted from flat response:', responseData);
          return responseData;
        }
        
        console.log('[useCreateBlockNews] ERROR: Could not extract news from response');
        throw new Error('Invalid API response structure - missing news data');
      } catch (error) {
        console.error('[useCreateBlockNews] Caught error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.lists() });
    },
  });
}

/**
 * PATCH /api/admin/block-news/[id] - Update news metadata
 */
export function useUpdateBlockNews(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNewsRequest) => {
      const response = await api.patch<{ status: string; data: NewsDetailResponse; message?: string }>(`/api/admin/block-news/${id}`, data);
      const respData = response.data;
      
      if (respData && typeof respData === 'object' && 'data' in respData) {
        return respData.data;
      }
      
      return respData as unknown as NewsDetailResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.lists() });
    },
  });
}

/**
 * DELETE /api/admin/block-news/[id] - Delete news article
 */
export function useDeleteBlockNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/block-news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.lists() });
    },
  });
}

/**
 * PATCH /api/admin/block-news/[id]/status - Change news status
 */
export function useChangeBlockNewsStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; status: 'PUBLISHED' | 'ARCHIVED' }) => {
      const response = await api.patch<{ status: string; data: NewsDetailResponse; message?: string }>(
        `/api/admin/block-news/${params.id}/status`,
        { status: params.status }
      );
      const respData = response.data;
      
      if (respData && typeof respData === 'object' && 'data' in respData) {
        return respData.data;
      }
      
      return respData as unknown as NewsDetailResponse;
    },
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: blockNewsKeys.detail(data.id) });
      }
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.lists() });
    },
  });
}
