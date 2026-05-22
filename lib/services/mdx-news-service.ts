/**
 * MDXEditor specific news service utilities
 * Location: lib/services/mdx-news-service.ts
 * Extends existing news-service.ts with MDXEditor-specific features
 */

import axios from 'axios';
import type { NewsArticle } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';
import { validateMarkdown } from '@/lib/utils/mdx-editor-utils';

export interface CreateMDXNewsDTO {
  title: string;
  content: string; // Markdown content
  description?: string;
  category?: string;
  featured?: boolean;
  draft: boolean;
  publishedAt?: string;
  tags?: string[];
}

export interface UpdateMDXNewsDTO {
  title?: string;
  content?: string;
  description?: string;
  category?: string;
  featured?: boolean;
  draft?: boolean;
  published?: boolean;
  publishedAt?: string;
  tags?: string[];
}

export class MDXNewsService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  }

  /**
   * Create a new article with markdown content
   */
  async createArticle(data: CreateMDXNewsDTO): Promise<NewsArticle> {
    // Validate markdown
    const validation = validateMarkdown(data.content);
    if (!validation.valid) {
      throw new Error(validation.errors[0] || 'محتوای نامعتبر');
    }

    // Validate title
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('عنوان الزامی است');
    }

    try {
      const response = await axios.post<ApiResponse<NewsArticle>>(
        `${this.baseUrl}/api/news/create`,
        {
          ...data,
          content: data.content,
        }
      );

      if (response.data.status === 'success') {
        return response.data.data as NewsArticle;
      }

      throw new Error(response.data.message || 'خطا در ایجاد مقاله');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در ایجاد مقاله';
      throw new Error(message);
    }
  }

  /**
   * Update an article
   */
  async updateArticle(id: string, data: UpdateMDXNewsDTO): Promise<NewsArticle> {
    // Validate markdown if provided
    if (data.content) {
      const validation = validateMarkdown(data.content);
      if (!validation.valid) {
        throw new Error(validation.errors[0] || 'محتوای نامعتبر');
      }
    }

    try {
      const response = await axios.patch<ApiResponse<NewsArticle>>(
        `${this.baseUrl}/api/news/${id}`,
        data
      );

      if (response.data.status === 'success') {
        return response.data.data as NewsArticle;
      }

      throw new Error(response.data.message || 'خطا در ویرایش مقاله');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در ویرایش مقاله';
      throw new Error(message);
    }
  }

  /**
   * Save draft
   */
  async saveDraft(id: string | undefined, data: CreateMDXNewsDTO): Promise<NewsArticle> {
    const draftData = { ...data, draft: true };

    if (id) {
      return this.updateArticle(id, draftData);
    }

    return this.createArticle(draftData);
  }

  /**
   * Publish article
   */
  async publishArticle(id: string): Promise<NewsArticle> {
    return this.updateArticle(id, {
      draft: false,
      published: true,
      publishedAt: new Date().toISOString(),
    });
  }

  /**
   * Unpublish article
   */
  async unpublishArticle(id: string): Promise<NewsArticle> {
    return this.updateArticle(id, {
      published: false,
    });
  }

  /**
   * Get article by ID
   */
  async getArticle(id: string): Promise<NewsArticle> {
    try {
      const response = await axios.get<ApiResponse<NewsArticle>>(
        `${this.baseUrl}/api/news/${id}`
      );

      if (response.data.status === 'success') {
        return response.data.data as NewsArticle;
      }

      throw new Error('خطا در دریافت مقاله');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در دریافت مقاله';
      throw new Error(message);
    }
  }

  /**
   * Delete article
   */
  async deleteArticle(id: string): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse<void>>(
        `${this.baseUrl}/api/news/${id}`
      );

      if (response.data.status !== 'success') {
        throw new Error('خطا در حذف مقاله');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در حذف مقاله';
      throw new Error(message);
    }
  }

  /**
   * Get articles with filters
   */
  async getArticles(options?: {
    limit?: number;
    offset?: number;
    status?: 'all' | 'published' | 'draft';
    category?: string;
    featured?: boolean;
  }): Promise<{ articles: NewsArticle[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.status && options.status !== 'all') {
        params.append('status', options.status);
      }
      if (options?.category) params.append('category', options.category);
      if (options?.featured) params.append('featured', 'true');

      const url = `${this.baseUrl}/api/news?${params.toString()}`;
      const response = await axios.get<
        ApiResponse<{ articles: NewsArticle[]; total: number }>
      >(url);

      if (response.data.status === 'success') {
        return response.data.data;
      }

      throw new Error('خطا در دریافت لیست مقالات');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در دریافت لیست مقالات';
      throw new Error(message);
    }
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(limit = 5): Promise<NewsArticle[]> {
    const result = await this.getArticles({
      limit,
      status: 'published',
      featured: true,
    });
    return result.articles;
  }

  /**
   * Get latest articles
   */
  async getLatestArticles(limit = 10): Promise<NewsArticle[]> {
    const result = await this.getArticles({
      limit,
      status: 'published',
    });
    return result.articles;
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(category: string, limit = 10): Promise<NewsArticle[]> {
    const result = await this.getArticles({
      limit,
      status: 'published',
      category,
    });
    return result.articles;
  }
}

// Export singleton
export const mdxNewsService = new MDXNewsService();

// Export factory function for custom configuration
export function createMDXNewsService(baseUrl?: string): MDXNewsService {
  return new MDXNewsService(baseUrl);
}
