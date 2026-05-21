/**
 * Create Blog Post Page
 * 
 * Page: /admin/blog/create
 * Professional blog post creation with M2 Markdown editor
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, FileText, Image as ImageIcon, Tag, AlertCircle, Upload, X, Send } from 'lucide-react';
import { useCreateBlockNews } from '@/lib/hooks/use-block-news';
import MarkdownEditor from '@/components/BlockNews/MarkdownEditor';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

export default function CreateBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    thumbnail: '',
    categoryId: 'blog',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const createNewsMutation = useCreateBlockNews();

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

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/admin/login');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleImageUploadForEditor = async (file: File): Promise<string> => {
    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);
      formDataForUpload.append('kind', 'content');

      const response = await fetch('/api/admin/uploads/temp', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'خطا در آپلود فایل');
      }

      const data = await response.json();
      return data.data.tempPath;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'خطا در آپلود فایل');
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('فقط فایل‌های تصویری قابل آپلود هستند');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setIsUploadingImage(true);
    setUploadError('');

    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);
      formDataForUpload.append('kind', 'cover');

      const response = await fetch('/api/admin/uploads/temp', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'خطا در آپلود فایل');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, thumbnail: data.data.tempPath }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'خطا در آپلود فایل');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, thumbnail: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('عنوان بلاگ الزامی است');
      return;
    }

    if (!formData.content.trim()) {
      alert('محتوای بلاگ الزامی است');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        content: formData.content,
        thumbnail: formData.thumbnail || undefined,
        categoryId: formData.categoryId || 'blog',
      });

      router.push(`/admin/block-news/${result.id}/edit`);
    } catch (error) {
      console.error('خطا در ایجاد بلاگ:', error);
      alert('خطایی رخ داده است');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const content = (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-200/50 dark:border-blue-900/50">
        <div className="flex items-center gap-3 flex-row-reverse gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="text-right flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-purple-600">
              📝 بلاگ جدید
            </h1>
            <p className="text-muted-foreground text-sm mt-1">یک مقاله حرفه‌ای بنویسید</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Basic Info Section */}
        <Card className="p-6 md:p-8 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <h2 className="text-xl font-bold">اطلاعات پایه‌ای</h2>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <span className="text-red-500">*</span>
                عنوان بلاگ
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="یک عنوان جذاب و توصیفی..."
                disabled={isSubmitting}
                className="h-11 md:h-12 text-base bg-gray-50 dark:bg-gray-900 border-2"
              />
              <p className="text-xs text-muted-foreground">این عنوان در صفحه اصلی و شبکه‌های اجتماعی نمایش داده می‌شود</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">خلاصه مقاله</label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="یک خلاصه کوتاه (150 کاراکتر)..."
                disabled={isSubmitting}
                maxLength={150}
                className="h-11 md:h-12 text-base bg-gray-50 dark:bg-gray-900 border-2"
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/150 کاراکتر
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4" />
                دسته‌بندی
              </label>
              <Input
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                placeholder="blog"
                disabled={isSubmitting}
                className="h-11 md:h-12 text-base bg-gray-50 dark:bg-gray-900 border-2"
              />
            </div>
          </div>
        </Card>

        {/* Cover Image Section */}
        <Card className="p-6 md:p-8 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <h2 className="text-xl font-bold">تصویر شاخص</h2>
          </div>

          {formData.thumbnail ? (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden h-48 md:h-64 group">
                <img
                  src={formData.thumbnail}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Button
                    onClick={handleRemoveImage}
                    variant="destructive"
                    size="sm"
                    className="flex gap-2"
                  >
                    <X className="w-4 h-4" />
                    حذف تصویر
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">برای تغییر، تصویر جدید را آپلود کنید</p>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                disabled={isUploadingImage || isSubmitting}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage || isSubmitting}
                className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 md:p-12 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition disabled:opacity-50"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="font-semibold text-gray-700 dark:text-gray-300">تصویر را اینجا رها کنید</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">یا کلیک کنید برای انتخاب فایل</p>
                <p className="text-xs text-gray-500 mt-4">JPG، PNG، WebP | حداکثر 5MB</p>
              </button>
              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 dark:text-red-200 text-sm">{uploadError}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Content Editor Section */}
        <Card className="p-6 md:p-8 border-0 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">محتوای بلاگ</h2>
            <p className="text-sm text-muted-foreground">از Markdown برای فرمت‌بندی استفاده کنید</p>
          </div>
          
          <MarkdownEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="# عنوان اصلی&#10;&#10;محتوای خود را بنویسید...&#10;&#10;## زیرعنوان&#10;&#10;**توپرفایی**، *کج*، `کد`"
            onImageUpload={handleImageUploadForEditor}
            isLoading={isSubmitting}
          />
        </Card>

        {/* Submit Button */}
        <div className="flex gap-3 flex-row-reverse pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg flex-1 md:flex-none"
          >
            <Send className="w-5 h-5 ml-2" />
            {isSubmitting ? 'درحال ذخیره...' : 'انتشار و ویرایش'}
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            disabled={isSubmitting}
            className="flex-1 md:flex-none"
          >
            انصراف
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminSidebar user={user} currentPage="block-news">
      {content}
    </AdminSidebar>
  );
}
