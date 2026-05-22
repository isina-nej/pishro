/**
 * Complete Example: Article Editor with all MDXEditor features
 * Location: app/admin/news/create-mdx-example/page.tsx
 * 
 * This is a comprehensive example showing:
 * - MDXEditor integration
 * - Auto-save functionality
 * - Error handling
 * - State management
 * - File organization
 * - Best practices
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MDXNewsEditor } from '@/components/news/MDXNewsEditor';
import { useMDXEditor } from '@/lib/hooks/useMDXEditor';
import toast from 'react-hot-toast';
import Link from 'next/link';

/**
 * Example ArticleEditor component
 * Shows best practices for using MDXEditor
 */
export default function ArticleEditorExample() {
  const router = useRouter();

  // Using the custom hook for state management
  const {
    title,
    content,
    isDirty,
    isSaving,
    isPublishing,
    saveStatus,
    lastSavedAt,
    lastError,
    setTitle,
    setContent,
    saveDraft,
    publish,
    reset,
  } = useMDXEditor({
    initialTitle: 'مثال: نوشتن مقاله جدید',
    initialContent: `# مرحبا با MDXEditor

این یک مثال کامل از نحوه استفاده از MDXEditor است.

## بخش اول

می‌توانید از تمامی ویژگی‌های Markdown استفاده کنید:

- **پررنگ**
- *کج*
- \`کد\`
- [لینک](https://example.com)

## بخش دوم

حتی می‌توانید کد را نمایش دهید:

\`\`\`javascript
function greet(name) {
  return \`سلام \${name}\`;
}
\`\`\`

---

## تصاویر

![توضیح تصویر](https://via.placeholder.com/600x400)

**تصویر را می‌توانید بکشید و رها کنید!**
`,
    onSuccess: (article) => {
      console.log('مقاله ذخیره شد:', article);
    },
    onError: (error) => {
      console.error('خطا:', error);
    },
  });

  // Cleanup
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Handle save
  const handleSave = async () => {
    const result = await saveDraft();
    if (result) {
      setTimeout(() => {
        router.push('/admin/news');
      }, 2000);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    if (
      !confirm(
        'آیا مطمئن هستید که می‌خواهید این مقاله را منتشر کنید؟'
      )
    ) {
      return;
    }

    const result = await publish();
    if (result) {
      setTimeout(() => {
        router.push('/admin/news');
      }, 2000);
    }
  };

  // Handle back
  const handleBack = () => {
    if (isDirty) {
      if (
        !confirm(
          'تغییرات ذخیره نشده دارید. آیا می‌خواهید صفحه را ترک کنید؟'
        )
      ) {
        return;
      }
    }
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                ویرایشگر مقالات
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                مثال کامل استفاده از MDXEditor برای اخبار و مقالات
              </p>
            </div>
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition text-slate-900 dark:text-slate-100 font-medium"
            >
              ← بازگشت
            </button>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4 flex-wrap">
            {isDirty && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <span className="text-yellow-700 dark:text-yellow-300">⚠️</span>
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  تغییرات ذخیره نشده
                </span>
              </div>
            )}

            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                <span className="animate-spin">🔄</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  درحال ذخیره...
                </span>
              </div>
            )}

            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                <span>✓</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  ذخیره شد
                </span>
              </div>
            )}

            {lastError && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <span>✗</span>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {lastError.message}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden">
              {/* Title input */}
              <div className="border-b border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-800">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  عنوان مقاله
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان را اینجا بنویسید..."
                  className="w-full px-4 py-3 text-2xl font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Editor */}
              <div className="p-6">
                <MDXNewsEditor
                  initialTitle={title}
                  initialContent={content}
                  onContentChange={setContent}
                  placeholder="محتوا را اینجا بنویسید..."
                  autoSaveEnabled={false}
                />
              </div>
            </div>

            {/* Info box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 نکات
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• از Markdown برای قالب‌بندی استفاده کنید</li>
                <li>• تصاویر را بکشید و رها کنید</li>
                <li>• هنگام نوشتن تغییرات خودکار شناسایی می‌شود</li>
                <li>• از دکمه‌های زیر برای ذخیره یا انتشار استفاده کنید</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Character count */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
                📊 آمار
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">کاراکتر:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {content.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">خط:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {content.split('\n').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">کلمه:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {content.split(/\s+/).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 space-y-3">
              <button
                onClick={handleSave}
                disabled={isSaving || isPublishing}
                className="w-full px-4 py-3 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition"
              >
                {isSaving ? 'درحال ذخیره...' : '💾 ذخیره پیش‌نویس'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || isSaving || !title.trim()}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition"
              >
                {isPublishing ? 'درحال انتشار...' : '🚀 انتشار'}
              </button>
              <button
                onClick={reset}
                className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold rounded-lg transition"
              >
                🔄 بازنشانی
              </button>
            </div>

            {/* Last saved info */}
            {lastSavedAt && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-300">
                  آخرین ذخیره:
                  <br />
                  <time className="font-mono text-xs">
                    {lastSavedAt.toLocaleTimeString('fa-IR')}
                  </time>
                </p>
              </div>
            )}

            {/* Links */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
                منابع
              </p>
              <Link
                href="https://www.markdownguide.org/"
                target="_blank"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                → راهنمای Markdown
              </Link>
              <Link
                href="/admin/news"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                → مدیریت مقالات
              </Link>
              <Link
                href="./docs/MDXEDITOR_GUIDE.md"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                → راهنمای کامل
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
