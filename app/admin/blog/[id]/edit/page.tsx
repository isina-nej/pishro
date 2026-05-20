/**
 * Edit Blog Post Page
 * 
 * Page: /admin/blog/[id]/edit
 * Edit blog post with M2 Markdown editor
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  Save,
  Send,
  Archive,
  Calendar,
  Clock,
  AlertCircle,
  Upload,
  X,
  Eye,
  FileText,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { useBlockNews, useUpdateBlockNews, useChangeBlockNewsStatus } from '@/lib/hooks/use-block-news';
import MarkdownEditor from '@/components/BlockNews/MarkdownEditor';
import MarkdownPreview from '@/components/BlockNews/MarkdownPreview';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
  excerpt: string;
  coverImage: string | null;
  content: string;
  categoryId: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const { data: news, isLoading: isLoadingNews, error: newsError } = useBlockNews(newsId);
  const updateNewsMutation = useUpdateBlockNews(newsId);
  const changeStatusMutation = useChangeBlockNewsStatus();

  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: '',
    excerpt: '',
    coverImage: null,
    content: '',
    categoryId: 'blog',
    publishedAt: null,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [scheduleDate, setScheduleDate] = useState('');

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

  // Initialize form with news data
  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        excerpt: news.excerpt,
        coverImage: news.coverImage,
        content: news.content,
        categoryId: news.categoryId || 'blog',
        published: news.published,
        publishedAt: news.publishedAt,
      });

      if (news.publishedAt) {
        setScheduleDate(news.publishedAt.split('T')[0]);
      }
    }
  }, [news]);

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
      setFormData((prev) => ({ ...prev, coverImage: data.data.tempPath }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'خطا در آپلود فایل');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      alert('عنوان الزامی است');
      return;
    }

    setIsSaving(true);
    try {
      await updateNewsMutation.mutateAsync({
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        coverImage: formData.coverImage || undefined,
        categoryId: formData.categoryId || 'blog',
        publishedAt: formData.publishedAt || null,
      });

      alert('تغییرات ذخیره شد');
    } catch (error) {
      console.error('خطا در ذخیره:', error);
      alert('خطایی رخ داده است');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishNow = async () => {
    try {
      await changeStatusMutation.mutateAsync({
        id: newsId,
        status: 'PUBLISHED'
      });
      
      setFormData((prev) => ({
        ...prev,
        published: true,
        publishedAt: new Date().toISOString()
      }));
      alert('بلاگ منتشر شد');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطایی رخ داده است');
    }
  };

  const handleSchedulePublish = async () => {
    if (!scheduleDate) {
      alert('تاریخ را انتخاب کنید');
      return;
    }

    try {
      const publishDate = new Date(scheduleDate);
      publishDate.setHours(12, 0, 0, 0);

      await updateNewsMutation.mutateAsync({
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        coverImage: formData.coverImage || undefined,
        categoryId: formData.categoryId || 'blog',
        publishedAt: publishDate.toISOString(),
      });

      setFormData((prev) => ({
        ...prev,
        publishedAt: publishDate.toISOString()
      }));
      alert('تاریخ انتشار ثبت شد');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطایی رخ داده است');
    }
  };

  const handleArchive = async () => {
    try {
      await changeStatusMutation.mutateAsync({
        id: newsId,
        status: 'ARCHIVED'
      });
      
      alert('بلاگ آرشیو شد');
      router.push('/admin/block-news');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطایی رخ داده است');
    }
  };

  if (isLoadingUser || isLoadingNews) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user || newsError) {
    return null;
  }

  const statusBadgeColor = formData.published ? 'bg-green-600' : 'bg-yellow-600';
  const statusLabel = formData.published ? '✅ منتشر' : '📝 پیش‌نویس';

  const content = (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-200/50 dark:border-blue-900/50">
        <div className="flex items-center gap-3 flex-row-reverse mb-4">
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
              ✏️ ویرایش بلاگ
            </h1>
            <p className="text-muted-foreground text-sm mt-1">تغییرات خود را اعمال کنید</p>
          </div>
          <Badge className={`${statusBadgeColor} text-white flex-shrink-0`}>
            {statusLabel}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
          <TabsTrigger value="content" className="flex gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">محتوا</span>
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex gap-2">
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">اطلاعات</span>
          </TabsTrigger>
          <TabsTrigger value="publish" className="flex gap-2">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">انتشار</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card className="p-6 md:p-8 border-0 shadow-lg">
            <h2 className="text-xl font-bold mb-6">محتوای بلاگ</h2>
            <MarkdownEditor
              value={formData.content || ''}
              onChange={handleContentChange}
              placeholder="محتوای خود را اینجا بنویسید..."
              onImageUpload={handleImageUploadForEditor}
              isLoading={isSaving}
            />
          </Card>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4">
          <Card className="p-6 md:p-8 border-0 shadow-lg space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <span className="text-red-500">*</span>
                عنوان بلاگ
              </label>
              <Input
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="عنوان..."
                disabled={isSaving}
                className="h-11 md:h-12 text-base bg-gray-50 dark:bg-gray-900 border-2"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">خلاصه مقاله</label>
              <Input
                name="excerpt"
                value={formData.excerpt || ''}
                onChange={handleInputChange}
                placeholder="خلاصه کوتاه..."
                disabled={isSaving}
                maxLength={150}
                className="h-11 md:h-12 text-base bg-gray-50 dark:bg-gray-900 border-2"
              />
              <p className="text-xs text-muted-foreground">
                {(formData.excerpt || '').length}/150
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">دسته‌بندی</label>
              <Input
                name="categoryId"
                value={formData.categoryId || 'blog'}
                onChange={handleInputChange}
                disabled={isSaving}
                className="h-11 md:h-12 text-base bg-gray-50 dark:bg-gray-900 border-2"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                تصویر شاخص
              </label>
              {formData.coverImage ? (
                <div className="relative rounded-lg overflow-hidden h-48 md:h-64 group">
                  <img
                    src={formData.coverImage}
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
                      حذف
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    disabled={isUploadingImage || isSaving}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage || isSaving}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-semibold">تصویر را اینجا رها کنید</p>
                  </button>
                </div>
              )}
              {uploadError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 dark:text-red-200 text-sm">{uploadError}</p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-5 h-5 ml-2" />
              {isSaving ? 'درحال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </Card>
        </TabsContent>

        {/* Publish Tab */}
        <TabsContent value="publish" className="space-y-4">
          <Card className="p-6 md:p-8 border-0 shadow-lg space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200 text-sm">ابتدا تغییرات را ذخیره کنید</p>
                <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">تمام تغییرات متادیتا و محتوا ابتدا باید ذخیره شوند</p>
              </div>
            </div>

            {/* Publish Now */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">انتشار فوری</h3>
              <p className="text-sm text-muted-foreground">بلاگ را همین الآن منتشر کن</p>
              <Button
                onClick={handlePublishNow}
                disabled={isSaving || changeStatusMutation.isPending}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Send className="w-5 h-5 ml-2" />
                {changeStatusMutation.isPending ? 'درحال انتشار...' : 'انتشار الآن'}
              </Button>
            </div>

            {/* Schedule Publish */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">برنامه‌ریزی انتشار</h3>
              <p className="text-sm text-muted-foreground">بلاگ را در یک تاریخ خاص منتشر کن</p>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                disabled={isSaving}
                className="h-11 md:h-12 text-base bg-gray-50 dark:bg-gray-900 border-2"
              />
              <Button
                onClick={handleSchedulePublish}
                disabled={isSaving}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="w-5 h-5 ml-2" />
                ثبت تاریخ انتشار
              </Button>
            </div>

            {/* Archive */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-lg">آرشیو</h3>
              <p className="text-sm text-muted-foreground">بلاگ را پنهان کن</p>
              <Button
                onClick={handleArchive}
                disabled={isSaving || changeStatusMutation.isPending}
                size="lg"
                variant="destructive"
                className="w-full"
              >
                <Archive className="w-5 h-5 ml-2" />
                آرشیو کردن
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <AdminSidebar user={user} currentPage="block-news">
      {content}
    </AdminSidebar>
  );
}
