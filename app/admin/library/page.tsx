'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2, Plus } from 'lucide-react';
import { AdminLoadingState, AdminEmptyState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { DataTable } from '@/components/admin/data-table/DataTable';
import DataTableToolbar from '@/components/admin/data-table/DataTableToolbar';
import { BulkActionBar } from '@/components/admin/data-table/BulkActionBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

interface DigitalBook {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  rating: number;
  views: number;
  downloads: number;
  isFeatured: boolean;
  bookStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  'همه',
  'بورس و سهام',
  'ارز دیجیتال',
  'سرمایه‌ گذاری',
  'کسب و کار',
  'اقتصاد',
  'تحلیل تکنیکال',
  'مدیریت مالی',
];

const STATUS_BADGE: Record<DigitalBook['bookStatus'], { label: string; variant: 'secondary' | 'success' | 'outline' }> = {
  DRAFT: { label: 'پیشنویس', variant: 'secondary' },
  PUBLISHED: { label: 'منتشر شده', variant: 'success' },
  ARCHIVED: { label: 'آرشیو شده', variant: 'outline' },
};

export default function LibraryManagementPage() {
  const { user, isLoading: isLoadingUser } = useAdminAuth();
  const [books, setBooks] = useState<DigitalBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('همه');
  const [filterStatus, setFilterStatus] = useState<string>('همه');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  // این صفحه با state محلی کار می‌کند نه React Query، پس به‌جای invalidate
  // مستقیم loadBooks را دوباره صدا می‌زنیم.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Load books
  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/api/admin/books?limit=100');

      if (data.status === 'success') {
        setBooks(data.data?.items || []);
      } else {
        setError('خطا در دریافت کتاب‌ها');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
      console.error('Error loading books:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`آیا می‌خواهید کتاب "${title}" را حذف کنید؟`)) {
      return;
    }

    try {
      setDeleting(id);
      const response = await api.delete(`/api/library/${id}`);

      if (response.status >= 200 && response.status < 300) {
        setBooks(books.filter((b) => b.id !== id));
        alert('کتاب با موفقیت حذف شد');
      } else {
        alert(response.data?.message || 'خطا در حذف کتاب');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطایی در حذف کتاب رخ داد');
      console.error('Error deleting book:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (bookId: string) => {
    try {
      setActionLoading(bookId);
      const response = await api.post(`/api/library/${bookId}/publish`);

      if (response.status < 200 || response.status >= 300) {
        throw new Error('خطا در منتشر کردن کتاب');
      }

      const data = response.data;
      setBooks(books.map((book) => (book.id === bookId ? data.data : book)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (bookId: string) => {
    try {
      setActionLoading(bookId);
      const response = await api.post(`/api/library/${bookId}/archive`);

      if (response.status < 200 || response.status >= 300) {
        throw new Error('خطا در آرشیو کردن کتاب');
      }

      const data = response.data;
      setBooks(books.map((book) => (book.id === bookId ? data.data : book)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (bookId: string) => {
    try {
      setActionLoading(bookId);
      const response = await api.post(`/api/library/${bookId}/restore`);

      if (response.status < 200 || response.status >= 300) {
        throw new Error('خطا در بیرون آوردن کتاب از آرشیو');
      }

      const data = response.data;
      setBooks(books.map((book) => (book.id === bookId ? data.data : book)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'همه' || book.category === filterCategory;

      const matchesStatus = filterStatus === 'همه' || book.bookStatus === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [books, searchTerm, filterCategory, filterStatus]);

  const columns: ColumnDef<DigitalBook>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'عنوان',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.isFeatured && (
              <Badge variant="premium" className="text-[10px]">
                منتخب
              </Badge>
            )}
            <span className="line-clamp-2 font-medium text-foreground">{row.original.title}</span>
          </div>
        ),
      },
      {
        accessorKey: 'author',
        header: 'نویسنده',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.author}</span>,
      },
      {
        accessorKey: 'category',
        header: 'دسته‌بندی',
        cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
      },
      {
        accessorKey: 'rating',
        header: 'امتیاز',
        cell: ({ row }) => (
          <span>
            <span className="font-medium">{row.original.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">/10</span>
          </span>
        ),
      },
      {
        accessorKey: 'views',
        header: 'بازدید',
        cell: ({ row }) => row.original.views.toLocaleString('fa-IR'),
      },
      {
        accessorKey: 'downloads',
        header: 'دانلود',
        cell: ({ row }) => row.original.downloads.toLocaleString('fa-IR'),
      },
      {
        accessorKey: 'bookStatus',
        header: 'وضعیت',
        cell: ({ row }) => {
          const status = STATUS_BADGE[row.original.bookStatus];
          return <Badge variant={status.variant}>{status.label}</Badge>;
        },
      },
      {
        id: 'actions',
        header: 'عملیات',
        cell: ({ row }) => {
          const book = row.original;
          const isBusy = actionLoading === book.id;
          return (
            <div className="flex flex-wrap items-center gap-1.5">
              {book.bookStatus === 'DRAFT' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePublish(book.id)}
                  disabled={isBusy}
                  className="h-7 px-2 text-xs text-success"
                >
                  {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'منتشر'}
                </Button>
              )}
              {book.bookStatus === 'PUBLISHED' && (
                <>
                  <Link href={`/admin/library/${book.id}`}>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      ویرایش
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(book.id)}
                    disabled={isBusy}
                    className="h-7 px-2 text-xs"
                  >
                    {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'آرشیو'}
                  </Button>
                </>
              )}
              {book.bookStatus === 'ARCHIVED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(book.id)}
                  disabled={isBusy}
                  className="h-7 px-2 text-xs"
                >
                  {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'بیرون آوردن'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(book.id, book.title)}
                disabled={deleting === book.id}
                className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {deleting === book.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'حذف'}
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionLoading, deleting, books]
  );

  if (isLoadingUser) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return null;
  }

  const content = (
    <AdminPageShell
      title="مدیریت کتابخانه دیجیتالی"
      description={`تعداد کتاب‌ها: ${books.length.toLocaleString('fa-IR')}`}
      actions={
        <Button asChild>
          <Link href="/admin/library/create">
            <Plus className="h-4 w-4" />
            کتاب جدید
          </Link>
        </Button>
      }
    >
      <Card className="space-y-4 p-4">
        <DataTableToolbar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="جستجو در عنوان یا نویسنده..."
          filters={
            <>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9 w-full sm:w-48">
                  <SelectValue placeholder="دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 w-full sm:w-40">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="DRAFT">پیشنویس</SelectItem>
                  <SelectItem value="PUBLISHED">منتشر شده</SelectItem>
                  <SelectItem value="ARCHIVED">آرشیو شده</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
      </Card>

      {error && (
        <Card className="border-destructive/30 bg-destructive/10 p-4 text-destructive">{error}</Card>
      )}

      {isLoading ? (
        <AdminLoadingState label="در حال بارگذاری..." />
      ) : filteredBooks.length === 0 ? (
        <AdminEmptyState
          title="کتابی یافت نشد"
          action={
            <Button asChild>
              <Link href="/admin/library/create">
                <Plus className="h-4 w-4" />
                ایجاد کتاب اول
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredBooks}
            enableSelection
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
          />
          <BulkActionBar
            entity="book"
            entityLabel="کتاب"
            selectedIds={selectedIds}
            onClear={() => setSelectedIds([])}
            onDone={loadBooks}
          />
        </>
      )}
    </AdminPageShell>
  );

  return content;
}
