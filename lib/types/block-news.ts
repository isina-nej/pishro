/**
 * Type Definitions for Block-Based News API Responses
 */

import type { News, ContentBlock } from '@/lib/types/db';

/**
 * API Response Types
 */

export interface NewsDetailResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId: string | null;
  category: {
    id: string;
    title: string;
    slug: string;
  } | null;
  authorId: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string;
  };
  contentBlocks: ContentBlockResponse[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface NewsListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category: {
    id: string;
    title: string;
  } | null;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  blockCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface NewsListResponse {
  items: NewsListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContentBlockResponse {
  id: string;
  newsId: string;
  type: 'TEXT' | 'HEADING' | 'IMAGE' | 'GALLERY' | 'QUOTE' | 'LIST';
  content: Record<string, unknown>;
  sortOrder: number;
}

export interface CreateNewsRequest {
  title: string;
  description?: string;
  categoryId?: string;
}

export interface UpdateNewsRequest {
  title?: string;
  slug?: string;
  description?: string;
  categoryId?: string | null;
  thumbnail?: string;
}

export interface ContentBlockCreateRequest {
  type: 'TEXT' | 'HEADING' | 'IMAGE' | 'GALLERY' | 'QUOTE' | 'LIST';
  content: Record<string, unknown>;
}

export interface ContentBlockUpdateRequest {
  content: Record<string, unknown>;
}

export interface ReorderBlocksRequest {
  blocks: Array<{
    blockId: string;
    sortOrder: number;
  }>;
}
