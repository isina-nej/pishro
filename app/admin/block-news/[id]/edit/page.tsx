/**
 * Edit News Page
 * 
 * Page: /admin/block-news/[id]/edit
 * Edit an existing block-based news article
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, AlertCircle, FileText, Image as ImageIcon, Tag, Zap, Upload, X, Clock } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CKEditor5Wrapper from '@/components/admin/news/CKEditor5Wrapper';

export const dynamic = 'force-dynamic';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  categoryId?: string;
  status?: string;
}

export default function EditBlockNewsPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [article, setArticle] = useState<NewsArticle | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    thumbnail: '',
    categoryId: '',
    author: '',
    publishOption: 'manual',
    scheduledDate: '',
    scheduledTime: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [error, setError] = useState<string>('');

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

  // Get article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!user || !articleId) return;

      try {
        const token = localStorage.getItem('admin_access_token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`/api/news/${articleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setError('خبر یافت نشد');
          return;
        }

        const data = await response.json();
        const newsArticle = data.data || data;

        setArticle(newsArticle);
        setFormData({
          title: newsArticle.title || '',
          description: newsArticle.excerpt || '',
          content: newsArticle.content || '',
          thumbnail: newsArticle.coverImage || '',
          categoryId: newsArticle.categoryId || '',
          author: newsArticle.author || '',
          publishOption: newsArticle.published ? 'now' : 'draft',
          scheduledDate: '',
          scheduledTime: '',
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('خطا در بارگذاری خبر');
      } finally {
        setIsLoadingArticle(false);
      }
    };

    if (user) {
      fetchArticle();
    }
  }, [user, articleId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formDataForUpload.append('kind', 'thumbnail');

      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/uploads/temp', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataForUpload,
      });

      if (!response.ok) {
        let error: string;
        try {
          const errorData = await response.json();
          console.error('Server error response:', errorData);
          error = errorData.message || errorData.error || `Error: ${response.status} ${response.statusText}`;
        } catch {
          error = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(error);
      }

      const data = await response.json();
      let imageUrl = data.data.tempPath;
      if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }
      if (!imageUrl.startsWith('/api/uploads/')) {
        if (imageUrl.startsWith('/')) {
          imageUrl = '/api/uploads' + imageUrl;
        }
      }
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در آپلود فایل';
      console.error('Upload error:', errorMessage);
      setUploadError(errorMessage);
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
      setError('عنوان خبر الزامی است');
      return;
    }

    if (formData.publishOption === 'scheduled') {
      if (!formData.scheduledDate || !formData.scheduledTime) {
        setError('برای انتشار تایم دار، تاریخ و ساعت را مشخص کنید');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const publishedAtTime = formData.publishOption === 'scheduled'
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
        : undefined;

      const response = await fetch(`/api/news/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          content: formData.content || undefined,
          thumbnail: formData.thumbnail || undefined,
          categoryId: formData.categoryId || undefined,
          author: formData.author || undefined,
          publishedAt: publishedAtTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'خطا در به‌روزرسانی خبر');
      }

      router.push('/admin/block-news');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطایی رخ داده است';
      console.error('Update error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser || isLoadingArticle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user || !article) return null;

  const content = (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-row-reverse flex-wrap">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-4xl font-bold text-right">ویرایش خبر</h1>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Main Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Basic Information */}
          <Card className="p-4 md:p-8 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-bold">اطلاعات پایه‌ای</h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  عنوان خبر
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="عنوان جذاب و توصیفی برای خبر..."
                  disabled={isSubmitting}
                  className="h-10 md:h-11 text-sm md:text-base bg-gray-50 dark:bg-gray-900 border-2"
                />
                <p className="text-xs text-muted-foreground">این عنوان در لیست اخبار و صفحه اصلی نمایش داده می‌شود</p>
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="text-sm font-semibold">توضیح کوتاه (خلاصه)</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="یک خلاصه کوتاه برای جذب توجه خواننده..."
                  rows={3}
                  disabled={isSubmitting}
                  className="text-sm md:text-base bg-gray-50 dark:bg-gray-900 border-2 resize-none"
                />
                <p className="text-xs text-muted-foreground">حداکثر 200 کاراکتر برای بهترین نمایش</p>
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="text-sm font-semibold">محتوای کامل خبر</label>
                <CKEditor5Wrapper
                  initialContent={formData.content}
                  placeholder="محتوای خبر را بنویسید..."
                  onContentChange={(html) => {
                    setFormData((prev) => ({ ...prev, content: html }));
                  }}
                  disabled={isSubmitting}
                  rtl={true}
                  maxHeight="600px"
                />
                <p className="text-xs text-muted-foreground">از ابزارهای CKEditor 5 برای فرمت‌بندی متن استفاده کنید</p>
              </div>
            </div>
          </Card>

          {/* Cover Image */}
          <Card className="p-4 md:p-8 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-bold">تصویر شاخص (کاور)</h2>
            </div>

            <div className="space-y-4">
              {!formData.thumbnail ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    variant="outline"
                    className="w-full h-32 md:h-40 border-2 border-dashed flex flex-col items-center justify-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  >
                    <Upload className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />
                    <div className="text-center px-2">
                      <p className="font-semibold text-purple-600 text-sm md:text-base">{isUploadingImage ? 'درحال آپلود...' : 'انتخاب تصویر'}</p>
                      <p className="text-xs text-muted-foreground mt-1">یا اینجا رها کنید</p>
                    </div>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    فرمت‌های پشتیبانی‌شده: JPG, PNG, WebP (حداکثر 5MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden shadow-md ring-2 ring-purple-200 dark:ring-purple-900">
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isUploadingImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    variant="outline"
                    className="w-full text-sm md:text-base h-10 md:h-11"
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    تغییر تصویر
                  </Button>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Category */}
          <Card className="p-4 md:p-8 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-5 h-5 text-green-600 flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-bold">دسته‌بندی</h2>
            </div>

            <Input
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              placeholder="شناسه دسته‌بندی (اختیاری)"
              disabled={isSubmitting}
              className="h-10 md:h-11 text-sm md:text-base bg-gray-50 dark:bg-gray-900 border-2"
            />
            <p className="text-xs text-muted-foreground mt-3">می‌توانید بعدا تغییر دهید</p>
          </Card>

          {/* Author */}
          <Card className="p-4 md:p-8 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-bold">نویسنده</h2>
            </div>

            <Input
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="نام نویسنده (اختیاری)"
              disabled={isSubmitting}
              className="h-10 md:h-11 text-sm md:text-base bg-gray-50 dark:bg-gray-900 border-2"
            />
            <p className="text-xs text-muted-foreground mt-3">نام نویسنده خبر</p>
          </Card>

          {/* Scheduled Publish */}
          <Card className="p-4 md:p-8 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-bold">انتشار تایم دار</h2>
            </div>

            <div className="space-y-4">
              {/* Publish Option Toggle */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publishOption"
                    value="manual"
                    checked={formData.publishOption === 'manual'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">فوری</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publishOption"
                    value="scheduled"
                    checked={formData.publishOption === 'scheduled'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">تایم دار</span>
                </label>
              </div>

              {/* Scheduled Date and Time */}
              {formData.publishOption === 'scheduled' && (
                <div className="space-y-3 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
                  <div>
                    <label className="text-sm font-semibold block mb-2">تاریخ انتشار</label>
                    <Input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="h-10 md:h-11 text-sm md:text-base bg-white dark:bg-gray-900 border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-2">ساعت انتشار</label>
                    <Input
                      type="time"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="h-10 md:h-11 text-sm md:text-base bg-white dark:bg-gray-900 border-2"
                    />
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">خبر در تاریخ و ساعت مشخص شده به صورت خودکار منتشر خواهد شد</p>
                </div>
              )}

              {formData.publishOption === 'manual' && (
                <p className="text-xs text-muted-foreground p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  خبر فوری منتشر خواهد شد
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Action Buttons */}
          <Card className="p-4 md:p-6 border-0 shadow-lg bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <div className="space-y-2 md:space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.title.trim()}
                className="w-full h-10 md:h-12 bg-gradient-to-l from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg text-sm md:text-base font-semibold"
              >
                <Zap className="h-4 md:h-5 w-4 md:w-5 ml-2" />
                {isSubmitting ? 'درحال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full h-10 md:h-11 text-sm md:text-base border-2"
              >
                انصراف
              </Button>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-4 md:p-6 border-0 shadow-lg bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-600">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <Zap className="w-4 md:w-5 h-4 md:h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-xs md:text-sm mb-2">نکات مهم:</h3>
                  <ul className="text-xs text-foreground/80 space-y-1 md:space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>عنوان <span className="font-semibold">الزامی</span> است</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>تغییرات به فوری ذخیره می‌شوند</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return <AdminSidebar user={user} currentPage="block-news">{content}</AdminSidebar>;
}
