'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/admin/data-table/DataTable';
import DataTableToolbar from '@/components/admin/data-table/DataTableToolbar';
import { useAdminCoursesList } from '@/lib/hooks/useAdminCourses';
import { AdminEmptyState, AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export const dynamic = 'force-dynamic';

interface CourseRow {
  id: string;
  subject: string;
  price: number;
  likes: number;
  dislikes: number;
  hasChapters: boolean;
  published: boolean;
}

const columns: ColumnDef<CourseRow>[] = [
  {
    accessorKey: 'subject',
    header: 'عنوان',
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.subject}</span>,
  },
  {
    accessorKey: 'price',
    header: 'قیمت',
    cell: ({ row }) => `${row.original.price?.toLocaleString('fa-IR')} تومان`,
  },
  {
    accessorKey: 'likes',
    header: 'لایک',
    cell: ({ row }) => row.original.likes ?? 0,
  },
  {
    accessorKey: 'dislikes',
    header: 'دیسلایک',
    cell: ({ row }) => row.original.dislikes ?? 0,
  },
  {
    accessorKey: 'hasChapters',
    header: 'فصل‌ها',
    cell: ({ row }) => (
      <Badge variant={row.original.hasChapters ? 'secondary' : 'outline'}>
        {row.original.hasChapters ? 'دارد' : 'ندارد'}
      </Badge>
    ),
  },
  {
    accessorKey: 'published',
    header: 'انتشار',
    cell: ({ row }) => (
      <Badge variant={row.original.published ? 'default' : 'outline'}>
        {row.original.published ? 'منتشر شده' : 'پیش‌نویس'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'عملیات',
    cell: ({ row }) => (
      <Link href={`/admin/courses/${row.original.id}/edit`}>
        <Button variant="outline" size="sm" aria-label={`ویرایش ${row.original.subject}`}>
          ویرایش
        </Button>
      </Link>
    ),
  },
];

export default function AdminCoursesPage() {
  const { user, isLoading } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading: isCoursesLoading } = useAdminCoursesList(page, 20, { search });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return null;
  }

  const content = (
    <AdminPageShell
      title="مدیریت دوره‌ها"
      description="لیست دوره‌ها، وضعیت انتشار، فصل‌ها و عملیات ویرایش را از اینجا مدیریت کنید."
      actions={
        <Button asChild>
          <Link href="/admin/courses/create">
            <Plus className="h-4 w-4" />
            افزودن دوره جدید
          </Link>
        </Button>
      }
    >
      <Card className="p-4">
        <DataTableToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="جستجو در عنوان، توضیحات یا اسلاگ..."
        />
      </Card>

      {isCoursesLoading ? (
        <AdminLoadingState label="در حال دریافت دوره‌ها..." />
      ) : items.length === 0 ? (
        <AdminEmptyState
          title="دوره‌ای یافت نشد"
          description={search ? 'عبارت جستجو را تغییر دهید یا یک دوره جدید بسازید.' : 'هنوز دوره‌ای ثبت نشده است.'}
          action={
            <Button asChild>
              <Link href="/admin/courses/create">ایجاد اولین دوره</Link>
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={items} pagination={pagination} onPageChange={setPage} />
      )}
    </AdminPageShell>
  );

  return content;
}
