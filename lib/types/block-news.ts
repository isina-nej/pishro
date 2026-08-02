/**
 * Type Definitions for News Article API Responses
 */

/**
 * API Response Types
 */

export interface NewsDetailResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  draft?: boolean;
  categoryId: string | null;
  category: string;
  relatedCategory: {
    id: string;
    title: string;
    slug: string;
  } | null;
  author: string | null;
  tags: { id: string; title: string; slug: string }[];
  featured: boolean;
  readingTime: number | null;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface NewsListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  draft?: boolean;
  category: string;
  relatedCategory: {
    id: string;
    title: string;
  } | null;
  author: string | null;
  featured: boolean;
  likes: number;
  views: number;
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

export interface CreateNewsRequest {
  title: string;
  excerpt?: string;
  description?: string;  // Old naming - will be converted to excerpt
  content?: string;
  coverImage?: string;
  thumbnail?: string;   // Old naming - will be converted to coverImage
  categoryId?: string;
  author?: string;
  publishedAt?: string;
}

export interface UpdateNewsRequest {
  title?: string;
  slug?: string;
  excerpt?: string;
  description?: string;  // Old naming - will be converted to excerpt
  content?: string;
  categoryId?: string | null;
  coverImage?: string;
  thumbnail?: string;   // Old naming - will be converted to coverImage
  author?: string;
  publishedAt?: string | null;
}

export interface ReorderBlocksRequest {
  blocks: Array<{
    blockId: string;
    sortOrder: number;
  }>;
}
