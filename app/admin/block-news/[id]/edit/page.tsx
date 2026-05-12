/**
 * Edit News Page
 * 
 * Page: /admin/block-news/[id]/edit
 * Edit block-based news article and manage blocks
 */

'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Save, Send, Archive } from 'lucide-react';
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

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'پیش‌نویس',
  PUBLISHED: 'منتشر',
  ARCHIVED: 'آرشیو',
};

export default function EditBlockNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

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
    categoryId: news?.categoryId || '',
  });

  React.useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        description: news.description || '',
        categoryId: news.categoryId || '',
      });
    }
  }, [news]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMetadata = async () => {
    try {
      await updateNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId || undefined,
      });
    } catch (error) {
      console.error('خطا در ذخیره:', error);
    }
  };

  const handlePublish = async () => {
    try {
      await changeStatusMutation.mutateAsync('PUBLISHED');
    } catch (error) {
      console.error('خطا در انتشار:', error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">ویرایش خبر</h1>
            <p className="text-sm text-muted-foreground">{news.title}</p>
          </div>
        </div>
        <Badge variant="outline">{STATUS_LABELS[news.status]}</Badge>
      </div>

      {/* Status Alert */}
      {news.status === 'DRAFT' && (
        <Alert>
          <AlertDescription>
            این خبر در حال پیش‌نویس است. برای انتشار، بر روی دکمه "انتشار" کلیک کنید.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="metadata" className="w-full">
        <TabsList>
          <TabsTrigger value="metadata">اطلاعات</TabsTrigger>
          <TabsTrigger value="blocks">بلاک‌ها ({blocks?.length || 0})</TabsTrigger>
        </TabsList>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4">
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
              <label className="text-sm font-medium">دسته‌بندی</label>
              <Input
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                placeholder="شناسه دسته‌بندی"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
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
                <Save className="h-4 w-4 mr-2" />
                {updateNewsMutation.isPending ? 'درحال ذخیره...' : 'ذخیره'}
              </Button>
            </div>
          </Card>

          {/* Status Actions */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">وضعیت خبر</h3>
            <div className="flex gap-2">
              {news.status !== 'PUBLISHED' && (
                <Button
                  onClick={handlePublish}
                  disabled={changeStatusMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  انتشار
                </Button>
              )}
              {news.status !== 'ARCHIVED' && (
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  disabled={changeStatusMutation.isPending}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  آرشیو
                </Button>
              )}
            </div>
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
                await updateBlockMutation.mutateAsync(content);
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
