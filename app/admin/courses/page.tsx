'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminCoursesList } from '@/lib/hooks/useAdminCourses';

export const dynamic = 'force-dynamic';

export default function AdminCoursesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAdminCoursesList(page, 20, { search });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div className="container-xl mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت دوره‌ها</h1>
        <Link href="/admin/courses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            افزودن دوره جدید
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="جستجو..."
          aria-label="جستجوی دوره"
        />
        <Button
          onClick={() => {
            setPage(1);
            setSearch(searchInput);
          }}
        >
          جستجو
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-8">در حال بارگذاری...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>قیمت</TableHead>
              <TableHead>لایک</TableHead>
              <TableHead>دیسلایک</TableHead>
              <TableHead>فصل‌ها</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.subject}</TableCell>
                <TableCell>{course.price?.toLocaleString('fa-IR')}</TableCell>
                <TableCell>{course.likes ?? 0}</TableCell>
                <TableCell>{course.dislikes ?? 0}</TableCell>
                <TableCell>{course.hasChapters ? 'بله' : 'خیر'}</TableCell>
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
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          <Button
            variant="outline"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            aria-label="صفحه قبل"
          >
            قبلی
          </Button>
          <span className="py-2">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            aria-label="صفحه بعد"
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}