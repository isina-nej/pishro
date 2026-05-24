'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Plus, Search, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
  createdAt: string;
  updatedAt: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

export default function LibraryManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [books, setBooks] = useState<DigitalBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('همه');

  const categories = [
    'همه',
    'بورس و سهام',
    'ارز دیجیتال',
    'سرمایه‌ گذاری',
    'کسب و کار',
    'اقتصاد',
    'تحلیل تکنیکال',
    'مدیریت مالی',
  ];

  // Get current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch('/api/admin/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          localStorage.removeItem('admin_access_token');
          router.push('/admin/login');
          return;
        }

        const userData = await response.json();
        setUser(userData.user);
        setIsLoadingUser(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/admin/login');
      }
    };

    fetchCurrentUser();
  }, [router]);

  // Load books
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/library?limit=100');
      const data = await response.json();

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
      const response = await fetch(`/api/library/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBooks(books.filter((b) => b.id !== id));
        alert('کتاب با موفقیت حذف شد');
      } else {
        const data = await response.json();
        alert(data.message || 'خطا در حذف کتاب');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطایی در حذف کتاب رخ داد');
      console.error('Error deleting book:', err);
    } finally {
      setDeleting(null);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'همه' || book.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              مدیریت کتابخانه دیجیتالی
            </h1>
            <Link
              href="/admin/library/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              کتاب جدید
            </Link>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            تعداد کتاب‌ها: <span className="font-bold text-slate-900 dark:text-white">{books.length}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 md:p-6 mb-6 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو در عنوان یا نویسنده..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              دسته‌بندی:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-slate-600 dark:text-slate-400">در حال بارگذاری...</p>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">کتابی یافت نشد</p>
            <Link
              href="/admin/library/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              ایجاد کتاب اول
            </Link>
          </div>
        ) : (
          /* Books Table */
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                      عنوان
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                      نویسنده
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                      دسته‌بندی
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      امتیاز
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      بازدید
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      دانلود
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {book.isFeatured && (
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded font-medium">
                              منتخب
                            </span>
                          )}
                          <div className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                            {book.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {book.author}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full font-medium">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-medium">{book.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-500">/10</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-300">
                        {book.views.toLocaleString('fa-IR')}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-300">
                        {book.downloads.toLocaleString('fa-IR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/library/${book.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-sm transition"
                          >
                            <Edit2 className="w-4 h-4" />
                            ویرایش
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id, book.title)}
                            disabled={deleting === book.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded text-sm transition disabled:opacity-50"
                          >
                            {deleting === book.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <AdminSidebar user={user} currentPage="library">{content}</AdminSidebar>;
}
