/**
 * Edit News Page
 * 
 * Page: /admin/block-news/[id]/edit
 * Edit block-based news article and manage blocks
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Save, Send, Archive, Calendar, Clock, AlertCircle, Upload, X } from 'lucide-react';
import {
  useBlockNews,
  useUpdateBlockNews,
  useChangeBlockNewsStatus,
} from '@/lib/hooks/use-block-news';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

export default function EditBlockNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const { data: news, isLoading: isLoadingNews, error: newsError } = useBlockNews(newsId);

  const updateNewsMutation = useUpdateBlockNews(newsId);
  const changeStatusMutation = useChangeBlockNewsStatus();

  const [formData, setFormData] = useState({
    title: news?.title || '',
    description: news?.excerpt || '',
    thumbnail: news?.coverImage || '',
    categoryId: news?.categoryId || '',
    publishedAt: news?.publishedAt || '',
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

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

  React.useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        description: news.excerpt || '',
        thumbnail: news.coverImage || '',
        categoryId: news.categoryId || '',
        publishedAt: news.publishedAt ? new Date(news.publishedAt).toISOString().slice(0, 16) : '',
      });
    }
  }, [news]);

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

  const handleSaveMetadata = async () => {
    try {
      await updateNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail || undefined,
        categoryId: formData.categoryId || undefined,
      });
    } catch (error) {
      console.error('خطا در ذخیره:', error);
    }
  };

  const handlePublishNow = async () => {
    try {
      await updateNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail || undefined,
        categoryId: formData.categoryId || undefined,
      });
      await changeStatusMutation.mutateAsync({ id: newsId, status: 'PUBLISHED' });
    } catch (error) {
      console.error('خطا در انتشار:', error);
    }
  };

  const handlePublishScheduled = async () => {
    if (!formData.publishedAt) {
      alert('لطفا زمان انتشار را انتخاب کنید');
      return;
    }
    try {
      await updateNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail || undefined,
        categoryId: formData.categoryId || undefined,
      });
      alert(`خبر برای انتشار در ${new Date(formData.publishedAt).toLocaleString('fa-IR')} برنامه‌ریزی شد`);
    } catch (error) {
      console.error('خطا در برنامه‌ریزی:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await changeStatusMutation.mutateAsync({ id: newsId, status: 'ARCHIVED' });
    } catch (error) {
      console.error('خطا در آرشیو:', error);
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

  if (isLoadingNews) {
    return (
      <AdminSidebar user={user} currentPage="block-news">
        <div className="text-center py-12">درحال بارگیری...</div>
      </AdminSidebar>
    );
  }

  if (newsError || !news) {
    return (
      <AdminSidebar user={user} currentPage="block-news">
        <div className="text-center py-12">
          <p className="text-destructive">خطایی رخ داده است</p>
        </div>
      </AdminSidebar>
    );
  }

  const content = (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 border border-blue-200/50 dark:border-blue-900/50">
        <div className="flex items-start justify-between flex-row-reverse gap-3 md:gap-4">
          <div className="flex items-start gap-2 md:gap-3 flex-row-reverse flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            >
              <ArrowRight className="h-4 md:h-5 w-4 md:w-5" />
            </Button>
            <div className="text-right min-w-0">
              <h1 className="text-xl md:text-3xl font-bold">ویرایش خبر</h1>
              <p className="text-muted-foreground line-clamp-1 text-xs md:text-base">{news.title}</p>
            </div>
          </div>
          <Badge className={`text-white text-xs md:text-sm px-3 md:px-4 py-1 flex-shrink-0 ${
            news.published ? 'bg-gradient-to-l from-green-600 to-green-700' : 'bg-gradient-to-l from-yellow-600 to-yellow-700'
          }`}>
            {news.published ? '✅ منتشر' : '📝 پیش‌نویس'}
          </Badge>
        </div>
      </div>

      {/* Status Alert */}
      {!news.published && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
          <AlertCircle className="w-4 md:w-5 h-4 md:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-right text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-200">این خبر هنوز منتشر نشده است</p>
            <p className="text-xs md:text-sm text-amber-800 dark:text-amber-300 mt-1">برای انتشار، از دکمه‌های انتشار در پایین استفاده کنید</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="metadata" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-gray-100 dark:bg-gray-900 p-1 text-xs md:text-sm">
          <TabsTrigger value="metadata" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            📝 اطلاعات
          </TabsTrigger>
        </TabsList>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-3 md:space-y-4 text-right">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              <Card className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">عنوان خبر</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="عنوان خبر"
                    className="text-sm md:text-base h-10 md:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">توضیح کوتاه</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="توضیح کوتاهی برای نمایش در لیست"
                    rows={3}
                    className="text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">دسته‌بندی</label>
                  <Input
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    placeholder="شناسه دسته‌بندی"
                    className="text-sm md:text-base h-10 md:h-11"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 flex-row-reverse text-xs md:text-sm">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="text-xs md:text-sm h-9 md:h-10"
                  >
                    انصراف
                  </Button>
                  <Button
                    onClick={handleSaveMetadata}
                    disabled={updateNewsMutation.isPending}
                    className="text-xs md:text-sm h-9 md:h-10"
                  >
                    <Save className="h-3 md:h-4 w-3 md:w-4 ml-2" />
                    {updateNewsMutation.isPending ? 'درحال...' : 'ذخیره'}
                  </Button>
                </div>
              </Card>

              {/* Cover Image */}
              <Card className="p-4 md:p-6 space-y-3 md:space-y-4">
                <label className="text-xs md:text-sm font-medium">تصویر شاخص (کاور)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                
                {!formData.thumbnail ? (
                  <div>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      variant="outline"
                      className="w-full h-32 md:h-40 border-2 border-dashed flex flex-col items-center justify-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                    >
                      <Upload className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />
                      <div className="text-center px-2">
                        <p className="font-semibold text-purple-600 text-xs md:text-base">{isUploadingImage ? 'درحال آپلود...' : 'انتخاب تصویر'}</p>
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
                      className="w-full text-xs md:text-sm h-9 md:h-10"
                    >
                      <Upload className="w-3 md:w-4 h-3 md:h-4 ml-2" />
                      تغییر تصویر
                    </Button>
                  </div>
                )}

                {uploadError && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-2 md:p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 md:w-5 h-4 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Publishing Section Sidebar */}
            <div className="space-y-3 md:space-y-4">
              <Card className="p-4 md:p-6 space-y-3 md:space-y-4">
                <h3 className="font-semibold text-xs md:text-sm flex items-center gap-2 justify-end flex-row-reverse">
                  <Send className="h-4 w-4" />
                  وضعیت و انتشار
                </h3>
                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs md:text-sm">
                  <span>وضعیت فعلی:</span>
                  <Badge variant="outline">{news.published ? '✅ منتشر' : '📝 پیش‌نویس'}</Badge>
                </div>

                {/* Publish Now */}
                <div className="space-y-2 border-t pt-3">
                  <p className="text-xs md:text-sm font-medium">انتشار فوری</p>
                  <Button
                    onClick={handlePublishNow}
                    disabled={changeStatusMutation.isPending || updateNewsMutation.isPending || news.published}
                    className="w-full text-xs md:text-sm h-9 md:h-10"
                  >
                    <Send className="h-3 md:h-4 w-3 md:w-4 ml-2" />
                    الان
                  </Button>
                  <p className="text-xs text-muted-foreground">خبر بلافاصله منتشر می‌شود</p>
                </div>

                {/* Schedule for Later */}
                <div className="space-y-2 border-t pt-3">
                  <p className="text-xs md:text-sm font-medium">برنامه‌ریزی برای بعدا</p>
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <Calendar className="h-3 md:h-4 w-3 md:w-4 text-muted-foreground flex-shrink-0" />
                    <Input
                      type="datetime-local"
                      name="publishedAt"
                      value={formData.publishedAt}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="h-9 md:h-10 text-xs md:text-sm"
                    />
                  </div>
                  {formData.publishedAt && (
                    <div className="text-xs text-muted-foreground p-2 bg-blue-50 dark:bg-blue-950 rounded">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(formData.publishedAt).toLocaleString('fa-IR')}
                    </div>
                  )}
                  <Button
                    onClick={handlePublishScheduled}
                    disabled={changeStatusMutation.isPending || updateNewsMutation.isPending || news.published}
                    variant="outline"
                    className="w-full text-xs md:text-sm h-9 md:h-10"
                  >
                    <Clock className="h-3 md:h-4 w-3 md:w-4 ml-2" />
                    برنامه‌ریزی
                  </Button>
                </div>

                {/* Archive */}
                {!news.published && (
                  <div className="border-t pt-3">
                    <Button
                      variant="outline"
                      onClick={handleArchive}
                      disabled={changeStatusMutation.isPending}
                      className="w-full text-destructive text-xs md:text-sm h-9 md:h-10"
                    >
                      <Archive className="h-3 md:h-4 w-3 md:w-4 ml-2" />
                      آرشیو
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return <AdminSidebar user={user} currentPage="block-news">{content}</AdminSidebar>;
}



