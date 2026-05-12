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
import { Plus, Edit2, Trash2, Eye, Send } from 'lucide-react';
import { useBlockNewsList, useDeleteBlockNews, useChangeBlockNewsStatus } from '@/lib/hooks/use-block-news';

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
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useBlockNewsList(page, limit, {
    status: statusFilter || undefined,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">خبرهای بلاک‌بر</h1>
          <p className="text-muted-foreground mt-1">مدیریت خبرهای بلاک‌بر</p>
        </div>
        <Link href="/admin/block-news/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            خبر جدید
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="جستجو برای خبر..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="تمام وضعیت‌ها" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">تمام وضعیت‌ها</SelectItem>
              <SelectItem value={DRAFT}>پیش‌نویس</SelectItem>
              <SelectItem value={PUBLISHED}>منتشر</SelectItem>
              <SelectItem value={ARCHIVED}>آرشیو</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} variant="outline">
            جستجو
          </Button>
        </div>
      </Card>

      {/* News Table */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">درحال بارگیری...</div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">خطایی رخ داده است</div>
        ) : !data?.items || data.items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">هیچ خبری یافت نشد</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان</TableHead>
                    <TableHead>نویسنده</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>بلاک‌ها</TableHead>
                    <TableHead>تاریخ</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((news) => (
                    <TableRow key={news.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="truncate max-w-xs">{news.title}</p>
                          <p className="text-xs text-muted-foreground">{news.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {news.author.firstName} {news.author.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[news.status]}>
                          {STATUS_LABELS[news.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{news.blockCount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(news.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/admin/block-news/${news.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNews(news.id)}
                          disabled={deleteNewsMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        {news.status === DRAFT && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChangeStatus(news.id, PUBLISHED)}
                          >
                            <Send className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {data.pagination && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  صفحه {data.pagination.page} از {data.pagination.totalPages} (کل: {data.pagination.total})
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    قبلی
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= (data.pagination?.totalPages || 1) || isLoading}
                  >
                    بعدی
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
