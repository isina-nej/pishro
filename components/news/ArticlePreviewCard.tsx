'use client';

import React from 'react';
import type { NewsArticle } from '@prisma/client';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale/fa-IR';
import { 
  calculateReadingTime, 
  countWords, 
  extractPlainText,
  extractHeadings 
} from '@/lib/utils/article-utils';

interface ArticlePreviewCardProps {
  article: NewsArticle;
}

export default function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  // Extract plain text from content
  const plainText = extractPlainText(article.content);
  
  // Calculate metrics
  const wordCount = countWords(plainText);
  const readingTime = calculateReadingTime(plainText);
  const headings = extractHeadings(article.content);
  
  // Format date
  const formattedDate = article.publishedAt
    ? format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: faIR })
    : article.createdAt
    ? format(new Date(article.createdAt), 'dd MMMM yyyy', { locale: faIR })
    : '';

  return (
    <div className="mb-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-slate-900/50 dark:via-blue-900/30 dark:to-slate-900/50 rounded-2xl border border-blue-100 dark:border-slate-800 p-8 shadow-lg shadow-blue-100/20 dark:shadow-none">
      {/* Header Section */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-blue-200 dark:border-slate-700 pb-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
            خلاصه مقاله
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            اطلاعات کلی و مرجع محتوا
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {readingTime}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              دقیقه خواندن
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {wordCount}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              کلمه
            </div>
          </div>
        </div>
      </div>

      {/* Article Details */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Category */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              دسته‌بندی
            </div>
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800">
              {article.category || 'عمومی'}
            </span>
          </div>

          {/* Date */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              تاریخ انتشار
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Status */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              وضعیت
            </div>
            <div className="flex gap-2">
              {article.published && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full border border-green-200 dark:border-green-800">
                  <span className="inline-block w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                  منتشر شده
                </span>
              )}
            </div>
          </div>

          {/* Engagement */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              میانگین وقت مطالعه
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              حدود {readingTime} تا {Math.ceil(readingTime * 1.2)} دقیقه
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents - if there are headings */}
      {headings.length > 1 && (
        <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
            فهرست مطالب
          </h3>
          
          <ul className="space-y-2 text-right">
            {headings.slice(0, 8).map((heading, index) => (
              <li
                key={index}
                className="text-sm text-slate-700 dark:text-slate-300 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                style={{ paddingRight: `${(heading.level - 2) * 1}rem` }}
              >
                <span className="inline-block mr-2 text-slate-400 dark:text-slate-500">
                  {'▸'}
                </span>
                {heading.text}
              </li>
            ))}
            {headings.length > 8 && (
              <li className="text-xs text-slate-500 dark:text-slate-400 italic pt-2">
                و {headings.length - 8} بخش دیگر...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Article Excerpt */}
      {article.excerpt && (
        <div className="mt-6 pt-6 border-t border-blue-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>
            خلاصه کوتاه
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-right italic">
            "{article.excerpt}"
          </p>
        </div>
      )}
    </div>
  );
}
