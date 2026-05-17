'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading: isCoursesLoading } = useAdminCoursesList(page, 20, { search });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    // Check authentication
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Fetch current user
        const response = await fetch('/api/admin/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('admin_access_token');
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const content = (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-textPrimary">مدیریت دوره‌ها</h1>
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

      {isCoursesLoading ? (
        <p className="text-center py-8">در حال بارگذاری...</p>
      ) : (
        <div className="bg-white dark:bg-cardBg rounded-lg shadow overflow-hidden">
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
        </div>
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
          <span className="py-2 px-4 text-gray-700 dark:text-textSecondary">
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

  return <AdminSidebar user={user} currentPage="courses">{content}</AdminSidebar>;
}