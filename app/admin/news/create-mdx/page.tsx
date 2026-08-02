'use client';

/**
 * News Article Creation Page with MDXEditor
 * Create new articles with professional markdown editor
 * Location: app/admin/news/create-mdx/page.tsx
 */

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MDXNewsEditor } from '@/components/news/MDXNewsEditor';

/** Imperative handle MDXNewsEditor exposes via its ref */
interface EditorHandle {
  getMarkdown: () => Promise<string>;
  setMarkdown: (markdown: string) => void;
  focus: () => void;
}
import toast from 'react-hot-toast';

interface CreateArticleData {
  title: string;
  content: string;
  category?: string;
  description?: string;
  featured?: boolean;
  draft: boolean;
}

export default function CreateNewsWithMDXPage() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  // Track content
  const editorContentRef = useRef<string>('');
  const editorRef = useRef<EditorHandle | null>(null);
  const lastSavedRef = useRef<CreateArticleData>({
    title: '',
    content: '',
    draft: true,
  });

  // Handle content changes
  const handleContentChange = useCallback((content: string) => {
    editorContentRef.current = content;
    setHasUnsavedChanges(true);
  }, []);

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) {
      toast.error('لطفا عنوان را وارد کنید');
      return;
    }

    setIsSaving(true);

    try {
      const data: CreateArticleData = {
        title: title.trim(),
        content: editorContentRef.current,
        category: category || undefined,
        description: description.trim() || undefined,
        featured,
        draft: true,
      };

      let response;

      if (articleId) {
        // Update existing draft
        response = await fetch(`/api/news/${articleId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create new draft
        response = await fetch('/api/news/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'خطا در ذخیره');
      }

      const result = await response.json();

      if (!articleId) {
        setArticleId(result.id);
      }

      lastSavedRef.current = data;
      setHasUnsavedChanges(false);
      toast.success('پیش‌نویس ذخیره شد');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در ذخیره';
      toast.error(message);
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [title, category, description, featured, articleId]);

  // Publish article
  const handlePublish = useCallback(async () => {
    if (!title.trim()) {
      toast.error('لطفا عنوان را وارد کنید');
      return;
    }

    if (!editorContentRef.current.trim()) {
      toast.error('لطفا محتوا را وارد کنید');
      return;
    }

    if (!confirm('آیا مطمئن هستید که می‌خواهید این مقاله را منتشر کنید؟')) {
      return;
    }

    setIsPublishing(true);

    try {
      const data: CreateArticleData = {
        title: title.trim(),
        content: editorContentRef.current,
        category: category || undefined,
        description: description.trim() || undefined,
        featured,
        draft: false,
      };

      let response;

      if (articleId) {
        // Update and publish
        response = await fetch(`/api/news/${articleId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            publishedAt: new Date().toISOString(),
          }),
        });
      } else {
        // Create and publish
        response = await fetch('/api/news/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            publishedAt: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'خطا در انتشار');
      }

      await response.json();
      toast.success('مقاله منتشر شد');

      // Redirect to news management or detail page
      setTimeout(() => {
        router.push('/admin/news');
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در انتشار';
      toast.error(message);
      console.error('Publish error:', error);
    } finally {
      setIsPublishing(false);
    }
  }, [title, category, description, featured, articleId, router]);

  // Handle back
  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      if (
        !confirm(
          'تغییرات ذخیره نشده دارید. آیا می‌خواهید صفحه را ترک کنید؟'
        )
      ) {
        return;
      }
    }
    router.back();
  }, [hasUnsavedChanges, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                ایجاد مقاله جدید
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                از MDXEditor برای نوشتن محتوای غنی استفاده کنید
              </p>
            </div>
            <button
              onClick={handleBack}
              className="px-6 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
            >
              ← بازگشت
            </button>
          </div>

          {/* Unsaved changes indicator */}
          {hasUnsavedChanges && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-2">
              <span className="text-yellow-700 dark:text-yellow-300">⚠️</span>
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                تغییرات ذخیره نشده دارید
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-6">
              <MDXNewsEditor
                ref={editorRef}
                initialTitle={title}
                initialContent={editorContentRef.current}
                onContentChange={handleContentChange}
                onTitleChange={setTitle}
                articleId={articleId || undefined}
                placeholder="محتوا را اینجا بنویسید..."
                autoSaveEnabled={false}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Category */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                دسته‌بندی
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">انتخاب دسته‌بندی</option>
                <option value="عمومی">عمومی</option>
                <option value="فناوری">فناوری</option>
                <option value="کسب‌وکار">کسب‌وکار</option>
                <option value="آموزش">آموزش</option>
              </select>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                خلاصه
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="خلاصه‌ی مقاله..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Featured */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700"
                />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  مقاله ویژه
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 space-y-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-slate-500 hover:bg-slate-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition"
              >
                {isSaving ? 'درحال ذخیره...' : 'ذخیره پیش‌نویس'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || !title.trim()}
                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg font-medium transition"
              >
                {isPublishing ? 'درحال انتشار...' : 'انتشار'}
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 نکات
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• عنوان الزامی است</li>
                <li>• محتوا می‌تواند Markdown باشد</li>
                <li>• تصاویر را می‌توانید کشیده و رها کنید</li>
                <li>• پیش‌نویس خودکار ذخیره نمی‌شود</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
