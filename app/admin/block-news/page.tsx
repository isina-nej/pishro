/**
 * Admin Dashboard - Block News List Page
 *
 * Page: /admin/block-news
 * Lists all block-based news articles with manage options
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2, Send, Search, Filter, Newspaper, Clock, Archive } from 'lucide-react';
import { useBlockNewsList, useDeleteBlockNews, useChangeBlockNewsStatus } from '@/lib/hooks/use-block-news';
import { AdminLoadingState } from '@/components/admin/AdminPageShell';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export const dynamic = 'force-dynamic';

export default function BlockNewsListPage() {
  const { user, isLoading: isLoadingUser } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useBlockNewsList(page, limit, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const deleteNewsMutation = useDeleteBlockNews();
  const changeStatusMutation = useChangeBlockNewsStatus();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearchTerm(searchInput);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('آیا از حذف این خبر اطمینان دارید؟')) return;
    try {
      await deleteNewsMutation.mutateAsync(id);
    } catch (error) {
      console.error('خطا در حذف:', error);
    }
  };

  const handleChangeStatus = async (id: string, status: 'PUBLISHED' | 'ARCHIVED') => {
    try {
      await changeStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('خطا در تغییر وضعیت:', error);
    }
  };

  if (isLoadingUser) {
    return <AdminLoadingState />;
  }

  if (!user) return null;

  const content = (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-l from-primary/10 to-primary/5 p-6 md:p-8">
        <div className="flex items-center justify-between flex-row-reverse gap-2 sm:gap-4 flex-wrap">
          <div className="space-y-2 text-right flex-1">
            <div className="flex items-center gap-2 sm:gap-3 justify-end flex-wrap">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground">خبرهای بلاک‌بر</h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-lg">مدیریت کامل محتوای خبری</p>
              </div>
              <Newspaper className="w-8 h-8 md:w-10 md:h-10 text-primary flex-shrink-0" />
            </div>
          </div>
          <Link href="/admin/block-news/create">
            <Button className="shadow-lg hover:shadow-xl transition-all h-10 md:h-12 px-4 md:px-6 text-sm md:text-base whitespace-nowrap">
              <Plus className="h-4 md:h-5 w-4 md:w-5 ml-2" />
              <span className="hidden sm:inline">خبر جدید</span>
              <span className="sm:hidden">جدید</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-4 md:p-6 border-0 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-right">
            <Filter className="w-5 h-5 text-primary flex-shrink-0" />
            <h2 className="font-semibold text-lg">فیلترها و جستجو</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            <div className="w-full">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 md:h-11 text-sm md:text-base w-full">
                  <SelectValue placeholder="تمام وضعیت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">تمام وضعیت‌ها</SelectItem>
                  <SelectItem value="DRAFT">📝 پیش‌نویس</SelectItem>
                  <SelectItem value="PUBLISHED">✓ منتشرشده</SelectItem>
                  <SelectItem value="ARCHIVED">📦 بایگانی شده</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <div className="relative h-full">
                <Input
                  placeholder="جستجو برای عنوان یا slug..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-10 md:h-11 pr-11 text-sm md:text-base w-full"
                />
                <Search className="absolute right-3 top-2.5 md:top-3 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="w-full">
              <Button
                onClick={handleSearch}
                className="w-full h-10 md:h-11 shadow-md text-sm md:text-base"
              >
                جستجو
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* News Grid */}
      <div>
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="animate-spin inline-block">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">درحال بارگیری اخبار...</p>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-8 text-center border-destructive/30 bg-destructive/10">
            <p className="text-destructive font-semibold">خطایی رخ داده است</p>
          </Card>
        ) : !data?.items || data.items.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">هیچ خبری یافت نشد</p>
            <p className="text-sm text-muted-foreground mt-2">بیایید یک خبر جدید بسازیم!</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
              {data.items.map((news) => (
                <Card key={news.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md hover:ring-1 hover:ring-primary/30 flex flex-col">
                  {/* Card Header with Status */}
                  <div className="p-4 md:p-6 bg-muted/50 border-b border-border">
                    <div className="flex items-start justify-between flex-row-reverse gap-3 mb-3">
                      {(() => {
                        // خبر منتشرشده با تاریخ انتشار در آینده = تایم‌دار (هنوز در سایت دیده نمی‌شود)
                        const isScheduled =
                          news.published &&
                          !!news.publishedAt &&
                          new Date(news.publishedAt).getTime() > Date.now();
                        return (
                          <Badge
                            variant={news.draft ? 'secondary' : isScheduled ? 'secondary' : news.published ? 'success' : 'outline'}
                            className="flex-shrink-0"
                          >
                            {news.draft
                              ? '📝 پیش‌نویس'
                              : isScheduled
                                ? '🕒 زمان‌بندی‌شده'
                                : news.published
                                  ? '✓ منتشرشده'
                                  : '📦 بایگانی شده'}
                          </Badge>
                        );
                      })()}
                      <div className="text-right flex-1 min-w-0">
                        <Link href={`/admin/block-news/${news.id}/preview`}>
                          <h3 className="font-bold text-base md:text-lg line-clamp-2 group-hover:text-primary transition-colors cursor-pointer hover:underline">
                            {news.title}
                          </h3>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 md:p-6 space-y-4 flex-1 flex flex-col">
                    {/* Meta Information */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 text-sm text-right">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {new Date(news.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                    </div>

                    {/* Slug Preview */}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground truncate font-mono bg-muted p-2 rounded">
                        {news.slug}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="px-4 md:px-6 py-3 md:py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-2 flex-row-reverse flex-wrap">
                    <Link href={`/admin/block-news/${news.id}/edit`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs md:text-sm h-8 md:h-9"
                      >
                        <Edit2 className="h-3 md:h-4 w-3 md:w-4 ml-1" />
                        ویرایش
                      </Button>
                    </Link>
                    {news.published ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangeStatus(news.id, 'ARCHIVED')}
                        disabled={changeStatusMutation.isPending}
                        className="text-xs md:text-sm h-8 md:h-9"
                      >
                        <Archive className="h-3 md:h-4 w-3 md:w-4 ml-1" />
                        بایگانی
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangeStatus(news.id, 'PUBLISHED')}
                        disabled={changeStatusMutation.isPending}
                        className="border-success/30 text-success hover:bg-success/10 text-xs md:text-sm h-8 md:h-9"
                      >
                        <Send className="h-3 md:h-4 w-3 md:w-4 ml-1" />
                        منتشر
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNews(news.id)}
                      disabled={deleteNewsMutation.isPending}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs md:text-sm h-8 md:h-9"
                    >
                      <Trash2 className="h-3 md:h-4 w-3 md:w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination && (
              <Card className="mt-6 md:mt-8 p-4 md:p-6 border-0 shadow-lg">
                <div className="flex items-center justify-between flex-row-reverse flex-wrap gap-4">
                  <div className="text-xs md:text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{data.pagination.total}</span>
                    <span> خبر • </span>
                    <span>صفحه {data.pagination.page} از {data.pagination.totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1 || isLoading}
                      className="px-3 md:px-4 text-xs md:text-sm h-8 md:h-9"
                    >
                      قبلی
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= (data.pagination?.totalPages || 1) || isLoading}
                      className="px-3 md:px-4 text-xs md:text-sm h-8 md:h-9"
                    >
                      بعدی
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );

  return content;
}
