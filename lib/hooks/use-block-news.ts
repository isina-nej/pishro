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
  ContentBlockResponse,
  CreateNewsRequest,
  UpdateNewsRequest,
  ContentBlockCreateRequest,
  ContentBlockUpdateRequest,
  ReorderBlocksRequest,
} from '@/lib/types/block-news';

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

      const response = await api.get<NewsListResponse>(`/admin/block-news?${params.toString()}`);
      return response.data;
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
      const response = await api.get<NewsDetailResponse>(`/admin/block-news/${id}`);
      return response.data;
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
      const response = await api.post<NewsDetailResponse>('/admin/block-news', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate list to refresh
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
      const response = await api.patch<NewsDetailResponse>(`/admin/block-news/${id}`, data);
      return response.data;
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
      await api.delete(`/admin/block-news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.lists() });
    },
  });
}

/**
 * PATCH /api/admin/block-news/[id]/status - Change news status
 */
export function useChangeBlockNewsStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'PUBLISHED' | 'ARCHIVED') => {
      const response = await api.patch<NewsDetailResponse>(
        `/admin/block-news/${id}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.lists() });
    },
  });
}

/**
 * GET /api/admin/block-news/[id]/blocks - Get all blocks for article
 */
export function useBlockNewsBlocks(newsId: string) {
  return useQuery({
    queryKey: blockNewsKeys.blocks(newsId),
    queryFn: async () => {
      const response = await api.get<ContentBlockResponse[]>(
        `/admin/block-news/${newsId}/blocks`
      );
      return response.data;
    },
    enabled: !!newsId,
  });
}

/**
 * POST /api/admin/block-news/[id]/blocks - Add new content block
 */
export function useAddBlockNewsBlock(newsId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ContentBlockCreateRequest) => {
      const response = await api.post<ContentBlockResponse>(
        `/admin/block-news/${newsId}/blocks`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.blocks(newsId) });
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.detail(newsId) });
    },
  });
}

/**
 * PATCH /api/admin/block-news/[id]/blocks/[blockId] - Update block content
 */
export function useUpdateBlockNewsBlock(newsId: string, blockId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ContentBlockUpdateRequest & { blockId?: string }) => {
      const actualBlockId = blockId || data.blockId || '';
      const response = await api.patch<ContentBlockResponse>(
        `/admin/block-news/${newsId}/blocks/${actualBlockId}`,
        { content: data.content }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.blocks(newsId) });
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.detail(newsId) });
    },
  });
}

/**
 * DELETE /api/admin/block-news/[id]/blocks/[blockId] - Delete content block
 */
export function useDeleteBlockNewsBlock(newsId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blockId: string) => {
      await api.delete(`/admin/block-news/${newsId}/blocks/${blockId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.blocks(newsId) });
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.detail(newsId) });
    },
  });
}

/**
 * PATCH /api/admin/block-news/[id]/blocks/reorder - Reorder blocks
 */
export function useReorderBlockNewsBlocks(newsId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ReorderBlocksRequest) => {
      const response = await api.patch<ContentBlockResponse[]>(
        `/admin/block-news/${newsId}/blocks/reorder`,
        request
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.blocks(newsId) });
      queryClient.invalidateQueries({ queryKey: blockNewsKeys.detail(newsId) });
    },
  });
}
