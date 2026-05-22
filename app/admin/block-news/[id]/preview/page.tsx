/**
 * Admin News Preview Page
 * 
 * Page: /admin/block-news/[id]/preview
 * Preview news article exactly as users will see it
 * Shows the article in full public view regardless of published status
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import NewsArticleDetail from '@/components/news/NewsArticleDetail';

export const dynamic = 'force-dynamic';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId?: string;
  author?: string;
  published: boolean;
  draft: boolean;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
}

export default function NewsPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Get article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`/api/news/${articleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setError('خبر یافت نشد');
          return;
        }

        const data = await response.json();
        const newsArticle = data.data || data;
        setArticle(newsArticle);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('خطا در بارگذاری خبر');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">درحال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">خطا</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'خبر یافت نشد'}</p>
          <Button 
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            بازگشت
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Admin Control Bar */}
      <div className="sticky top-0 z-50 bg-blue-600 dark:bg-blue-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">پیش‌نمایش خبر</span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              article.draft
                ? 'bg-yellow-500/30 text-yellow-100'
                : article.published
                ? 'bg-green-500/30 text-green-100'
                : 'bg-orange-500/30 text-orange-100'
            }`}>
              {article.draft ? '📝 پیش‌نویس' : article.published ? '✓ منتشرشده' : '📦 بایگانی شده'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            بازگشت
          </Button>
        </div>
      </div>

      {/* Public Article View - Centered */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <NewsArticleDetail article={article} />
        </div>
      </div>
    </div>
  );
}
