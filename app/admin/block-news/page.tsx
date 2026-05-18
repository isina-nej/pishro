/**
 * Admin Dashboard - Block News List Page
 * 
 * Page: /admin/block-news
 * Lists all block-based news articles with manage options
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2, Eye, Send, Search, Filter, Newspaper, Archive, Clock, User } from 'lucide-react';
import { useBlockNewsList, useDeleteBlockNews, useChangeBlockNewsStatus } from '@/lib/hooks/use-block-news';

export const dynamic = 'force-dynamic';

const DRAFT = 'DRAFT';
const PUBLISHED = 'PUBLISHED';
const ARCHIVED = 'ARCHIVED';

const STATUS_LABELS: Record<string, string> = {
  [DRAFT]: 'پیش‌نویس',
  [PUBLISHED]: 'منتشر',
  [ARCHIVED]: 'آرشیو',
};

const STATUS_COLORS: Record<string, string> = {
  [DRAFT]: 'bg-yellow-100 text-yellow-800',
  [PUBLISHED]: 'bg-green-100 dark:bg-green-950 text-green-800',
  [ARCHIVED]: 'bg-gray-100 dark:bg-cardBg text-gray-800 dark:text-textPrimary',
};

export default function BlockNewsListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useBlockNewsList(page, limit, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const deleteNewsMutation = useDeleteBlockNews();
  const changeStatusMutation = useChangeBlockNewsStatus('');

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
      // Note: Need to create separate hook per id for this to work properly
      // For now, showing the pattern
      await changeStatusMutation.mutateAsync(status);
    } catch (error) {
      console.error('خطا در تغییر وضعیت:', error);
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-l from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-900/50">
        <div className="flex items-center justify-between flex-row-reverse">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-3 justify-end">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">خبرهای بلاک‌بر</h1>
                <p className="text-muted-foreground mt-1 text-lg">مدیریت کامل محتوای خبری</p>
              </div>
              <Newspaper className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <Link href="/admin/block-news/create">
            <Button className="bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all h-12 px-6 text-base">
              <Plus className="h-5 w-5 ml-2" />
              خبر جدید
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-right">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-lg">فیلترها و جستجو</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-row-reverse">
            <div className="md:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 bg-gray-50 dark:bg-gray-900 border-2">
                  <SelectValue placeholder="تمام وضعیت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">تمام وضعیت‌ها</SelectItem>
                  <SelectItem value={DRAFT}>📝 پیش‌نویس</SelectItem>
                  <SelectItem value={PUBLISHED}>✓ منتشر</SelectItem>
                  <SelectItem value={ARCHIVED}>📦 آرشیو</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-7">
              <div className="relative">
                <Input
                  placeholder="جستجو برای عنوان یا slug خبر..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-11 pr-11 bg-gray-50 dark:bg-gray-900 border-2"
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="md:col-span-2">
              <Button 
                onClick={handleSearch} 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
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
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-muted-foreground">درحال بارگیری اخبار...</p>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-8 text-center border-red-200 bg-red-50 dark:bg-red-950/20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.items.map((news) => (
                <Card key={news.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md hover:border-blue-200 dark:hover:border-blue-900">
                  {/* Card Header with Status */}
                  <div className="p-6 bg-gradient-to-l from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-blue-100 dark:border-blue-900/50">
                    <div className="flex items-start justify-between flex-row-reverse gap-3 mb-3">
                      <Badge className={`${STATUS_COLORS[news.status]} text-xs font-semibold px-3 py-1`}>
                        {STATUS_LABELS[news.status]}
                      </Badge>
                      <div className="text-right flex-1">
                        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Meta Information */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-right">
                        <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {news.author.firstName} {news.author.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-right">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {new Date(news.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-right">
                        <Newspaper className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="font-medium">
                          {news.blockCount} بلاک
                        </span>
                      </div>
                    </div>

                    {/* Slug Preview */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-muted-foreground truncate font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
                        {news.slug}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2 flex-row-reverse">
                    <Link href={`/admin/block-news/${news.id}/edit`}>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit2 className="h-4 w-4 ml-1" />
                        ویرایش
                      </Button>
                    </Link>
                    {news.status === DRAFT && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangeStatus(news.id, PUBLISHED)}
                        className="border-green-200 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20"
                      >
                        <Send className="h-4 w-4 ml-1" />
                        منتشر
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNews(news.id)}
                      disabled={deleteNewsMutation.isPending}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination && (
              <Card className="mt-8 p-6 border-0 shadow-lg">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="text-sm text-muted-foreground">
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
                      className="px-4"
                    >
                      قبلی
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= (data.pagination?.totalPages || 1) || isLoading}
                      className="px-4"
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
}
