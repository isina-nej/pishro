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
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import NewsArticleDetail from '@/components/news/NewsArticleDetail';
import { api } from '@/lib/api-client';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import type { NewsArticle } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default function NewsPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const { user, isLoading: isAuthLoading } = useAdminAuth();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Get article data — api client attaches the admin Bearer token automatically
  useEffect(() => {
    const fetchArticle = async () => {
      if (!user) return;
      try {
        const { data } = await api.get(`/api/admin/block-news/${articleId}`);
        setArticle((data.data || data) as NewsArticle);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('خبر یافت نشد');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchArticle();
    }
  }, [articleId, user]);

  if (isAuthLoading || isLoading) {
    return (
      <AdminPageShell title="پیش‌نمایش خبر" description="نمایش خبر دقیقاً همان‌طور که کاربران می‌بینند">
        <AdminLoadingState label="درحال بارگذاری خبر..." />
      </AdminPageShell>
    );
  }

  if (!user) return null;

  if (error || !article) {
    return (
      <AdminPageShell title="پیش‌نمایش خبر" description="نمایش خبر دقیقاً همان‌طور که کاربران می‌بینند">
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-destructive">خطا</h1>
          <p className="text-muted-foreground">{error || 'خبر یافت نشد'}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowRight className="ml-2 size-4" />
            بازگشت
          </Button>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="پیش‌نمایش خبر"
      description="نمایش خبر دقیقاً همان‌طور که کاربران می‌بینند"
      actions={
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-1 text-xs font-bold ${
              article.draft
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : article.published
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
            }`}
          >
            {article.draft ? '📝 پیش‌نویس' : article.published ? '✓ منتشرشده' : '📦 بایگانی شده'}
          </span>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowRight className="ml-2 size-4" />
            بازگشت
          </Button>
        </div>
      }
    >
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <NewsArticleDetail article={article} />
        </div>
      </div>
    </AdminPageShell>
  );
}
