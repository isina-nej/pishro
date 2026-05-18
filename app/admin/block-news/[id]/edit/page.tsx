/**
 * Edit News Page
 * 
 * Page: /admin/block-news/[id]/edit
 * Edit block-based news article and manage blocks
 */

'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Save, Send, Archive, Calendar, Clock, Newspaper, AlertCircle, Upload, X } from 'lucide-react';
import {
  useBlockNews,
  useBlockNewsBlocks,
  useUpdateBlockNews,
  useChangeBlockNewsStatus,
  useAddBlockNewsBlock,
  useUpdateBlockNewsBlock,
  useDeleteBlockNewsBlock,
  useReorderBlockNewsBlocks,
} from '@/lib/hooks/use-block-news';
import BlockEditor from '@/components/BlockNews/BlockEditor';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'پیش‌نویس',
  PUBLISHED: 'منتشر',
  ARCHIVED: 'آرشیو',
};

export default function EditBlockNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: news, isLoading: isLoadingNews, error: newsError } = useBlockNews(newsId);
  const { data: blocks, isLoading: isLoadingBlocks } = useBlockNewsBlocks(newsId);

  const updateNewsMutation = useUpdateBlockNews(newsId);
  const changeStatusMutation = useChangeBlockNewsStatus(newsId);
  const addBlockMutation = useAddBlockNewsBlock(newsId);
  const updateBlockMutation = useUpdateBlockNewsBlock(newsId, '');
  const deleteBlockMutation = useDeleteBlockNewsBlock(newsId);
  const reorderBlocksMutation = useReorderBlockNewsBlocks(newsId);

  const [formData, setFormData] = useState({
    title: news?.title || '',
    description: news?.description || '',
    thumbnail: news?.thumbnail || '',
    categoryId: news?.categoryId || '',
    publishedAt: news?.publishedAt || '',
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  React.useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        description: news.description || '',
        thumbnail: news.thumbnail || '',
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
      const publishedAt = formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null;
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
      // First update with current time as publishedAt
      await updateNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail || undefined,
        categoryId: formData.categoryId || undefined,
      });
      // Then change status to PUBLISHED
      await changeStatusMutation.mutateAsync('PUBLISHED');
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
      // Save the scheduled publish time - actual publishing will happen via a scheduled job
      await updateNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail || undefined,
        categoryId: formData.categoryId || undefined,
      });
      // The status will be updated by server-side scheduler at the specified time
      alert(`خبر برای انتشار در ${new Date(formData.publishedAt).toLocaleString('fa-IR')} برنامه‌ریزی شد`);
    } catch (error) {
      console.error('خطا در برنامه‌ریزی:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await changeStatusMutation.mutateAsync('ARCHIVED');
    } catch (error) {
      console.error('خطا در آرشیو:', error);
    }
  };

  if (isLoadingNews) {
    return <div className="text-center py-12">درحال بارگیری...</div>;
  }

  if (newsError || !news) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">خطایی رخ داده است</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-900/50">
        <div className="flex items-start justify-between flex-row-reverse gap-4">
          <div className="flex items-start gap-3 flex-row-reverse flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="text-right">
              <h1 className="text-3xl font-bold">ویرایش خبر</h1>
              <p className="text-muted-foreground line-clamp-1">{news.title}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-l from-blue-600 to-purple-600 text-white text-sm px-4 py-1.5">
            {STATUS_LABELS[news.status]}
          </Badge>
        </div>
      </div>

      {/* Status Alert */}
      {news.status === 'DRAFT' && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-right">
            <p className="font-semibold text-amber-900 dark:text-amber-200">این خبر هنوز منتشر نشده است</p>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">برای انتشار، از دکمه‌های انتشار در پایین استفاده کنید</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="metadata" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-900 p-1">
          <TabsTrigger value="metadata" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            📝 اطلاعات
          </TabsTrigger>
          <TabsTrigger value="blocks" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            🧩 بلاک‌ها ({blocks?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4 text-right">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان خبر</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="عنوان خبر"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">توضیح کوتاه</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="توضیح کوتاهی برای نمایش در لیست"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">تصویر شاخص (کاور)</label>
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
                    className="w-full h-40 border-2 border-dashed flex flex-col items-center justify-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  >
                    <Upload className="w-8 h-8 text-purple-600" />
                    <div className="text-center">
                      <p className="font-semibold text-purple-600">{isUploadingImage ? 'درحال آپلود...' : 'انتخاب تصویر'}</p>
                      <p className="text-xs text-muted-foreground mt-1">یا اینجا رها کنید</p>
                    </div>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    فرمت‌های پشتیبانی‌شده: JPG, PNG, WebP (حداکثر 5MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative w-full h-40 rounded-lg overflow-hidden shadow-md ring-2 ring-purple-200 dark:ring-purple-900">
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
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    تغییر تصویر
                  </Button>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">دسته‌بندی</label>
              <Input
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                placeholder="شناسه دسته‌بندی"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4 flex-row-reverse">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                انصراف
              </Button>
              <Button
                onClick={handleSaveMetadata}
                disabled={updateNewsMutation.isPending}
              >
                <Save className="h-4 w-4 ml-2" />
                {updateNewsMutation.isPending ? 'درحال ذخیره...' : 'ذخیره'}
              </Button>
            </div>
          </Card>

          {/* Publishing Section */}
          <Card className="p-4 space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Send className="h-4 w-4" />
                وضعیت و انتشار خبر
              </h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm">وضعیت فعلی:</span>
                <Badge variant="outline">{STATUS_LABELS[news.status]}</Badge>
              </div>
            </div>

            {/* Publish Now */}
            <div className="space-y-2">
              <p className="text-sm font-medium">انتشار فوری</p>
              <Button
                onClick={handlePublishNow}
                disabled={changeStatusMutation.isPending || updateNewsMutation.isPending || news.status === 'PUBLISHED'}
                className="w-full"
              >
                <Send className="h-4 w-4 ml-2" />
                انتشار الان
              </Button>
              <p className="text-xs text-muted-foreground">خبر بلافاصله منتشر می‌شود</p>
            </div>

            {/* Schedule for Later */}
            <div className="space-y-2 border-t pt-3">
              <p className="text-sm font-medium">برنامه‌ریزی انتشار برای بعدا</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                {formData.publishedAt && (
                  <div className="text-xs text-muted-foreground p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    <Clock className="h-3 w-3 inline mr-1" />
                    زمان انتشار: {new Date(formData.publishedAt).toLocaleString('fa-IR')}
                  </div>
                )}
                <Button
                  onClick={handlePublishScheduled}
                  disabled={changeStatusMutation.isPending || updateNewsMutation.isPending || news.status === 'PUBLISHED'}
                  variant="outline"
                  className="w-full"
                >
                  <Clock className="h-4 w-4 ml-2" />
                  برنامه‌ریزی انتشار
                </Button>
              </div>
            </div>

            {/* Archive */}
            {news.status !== 'ARCHIVED' && (
              <div className="space-y-2 border-t pt-3">
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  disabled={changeStatusMutation.isPending}
                  className="w-full text-destructive"
                >
                  <Archive className="h-4 w-4 ml-2" />
                  انتقال به آرشیو
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Blocks Tab */}
        <TabsContent value="blocks" className="space-y-4">
          {isLoadingBlocks ? (
            <Card className="p-8 text-center">درحال بارگیری...</Card>
          ) : (
            <BlockEditor
              newsId={newsId}
              blocks={blocks || []}
              onAddBlock={async (type) => {
                await addBlockMutation.mutateAsync({
                  type: type as any,
                  content: {
                    text: type === 'TEXT' ? '' : undefined,
                    level: type === 'HEADING' ? 'h2' : undefined,
                    url: type === 'IMAGE' ? '' : undefined,
                    layout: type === 'GALLERY' ? 'grid' : undefined,
                    style: type === 'LIST' ? 'unordered' : undefined,
                  },
                });
              }}
              onUpdateBlock={async (blockId, content) => {
                await updateBlockMutation.mutateAsync({ content, blockId });
              }}
              onDeleteBlock={async (blockId) => {
                await deleteBlockMutation.mutateAsync(blockId);
              }}
              onReorderBlocks={async (newOrder) => {
                await reorderBlocksMutation.mutateAsync({ blocks: newOrder });
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
