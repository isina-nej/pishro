'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminCoursesList } from '@/lib/hooks/useAdminCourses';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminEmptyState, AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export const dynamic = 'force-dynamic';

export default function AdminCoursesPage() {
  const { user, isLoading, logout } = useAdminAuth();
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
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجو در عنوان، توضیحات یا اسلاگ..."
            aria-label="جستجوی دوره"
            className="pr-9 text-right"
          />
        </div>
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
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-slate-50 dark:bg-slate-900/60">
                <TableHead>عنوان</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>لایک</TableHead>
                <TableHead>دیسلایک</TableHead>
                <TableHead>فصل‌ها</TableHead>
                <TableHead>انتشار</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((course) => (
                <TableRow key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                  <TableCell className="font-medium text-slate-950 dark:text-white">{course.subject}</TableCell>
                  <TableCell>{course.price?.toLocaleString('fa-IR')} تومان</TableCell>
                  <TableCell>{course.likes ?? 0}</TableCell>
                  <TableCell>{course.dislikes ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={course.hasChapters ? 'secondary' : 'outline'}>
                      {course.hasChapters ? 'دارد' : 'ندارد'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.published ? 'default' : 'outline'}>
                      {course.published ? 'منتشر شده' : 'پیش‌نویس'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={`ویرایش ${course.subject}`}
                      >
                        ویرایش
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center flex-row-reverse">
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            aria-label="صفحه بعد"
          >
            بعدی
          </Button>
          <span className="py-2 px-4 text-gray-700 dark:text-textSecondary">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            aria-label="صفحه قبل"
          >
            قبلی
          </Button>
        </div>
      )}
    </AdminPageShell>
  );

  return <AdminSidebar user={user} currentPage="courses" onLogout={logout}>{content}</AdminSidebar>;
}