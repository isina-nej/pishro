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
    <div className="mb-12 bg-gradient-to-br from-primary via-primary to-primary/50/30/50 rounded-2xl border border-primary p-8 shadow-lg shadow-blue-100/20 dark:shadow-none">
      {/* Header Section */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-primary pb-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">
            خلاصه مقاله
          </h2>
          <p className="text-sm text-muted-foreground">
            اطلاعات کلی و مرجع محتوا
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {readingTime}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              دقیقه خواندن
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {wordCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
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
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              دسته‌بندی
            </div>
            <span className="inline-block px-4 py-2 bg-primary/40 text-primary text-sm font-medium rounded-full border border-primary">
              {article.category || 'عمومی'}
            </span>
          </div>

          {/* Date */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              تاریخ انتشار
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Status */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              وضعیت
            </div>
            <div className="flex gap-2">
              {article.published && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/40 text-primary text-xs font-medium rounded-full border border-primary">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                  منتشر شده
                </span>
              )}
            </div>
          </div>

          {/* Engagement */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              میانگین وقت مطالعه
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              حدود {readingTime} تا {Math.ceil(readingTime * 1.2)} دقیقه
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents - if there are headings */}
      {headings.length > 1 && (
        <div className="bg-card/70/70 rounded-xl p-4 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
            فهرست مطالب
          </h3>
          
          <ul className="space-y-2 text-right">
            {headings.slice(0, 8).map((heading, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground transition-colors hover:text-primary dark:hover:text-primary"
                style={{ paddingRight: `${(heading.level - 2) * 1}rem` }}
              >
                <span className="inline-block mr-2 text-muted-foreground">
                  {'▸'}
                </span>
                {heading.text}
              </li>
            ))}
            {headings.length > 8 && (
              <li className="text-xs text-muted-foreground italic pt-2">
                و {headings.length - 8} بخش دیگر...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Article Excerpt */}
      {article.excerpt && (
        <div className="mt-6 pt-6 border-t border-primary">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
            خلاصه کوتاه
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed text-right italic">
            &quot;{article.excerpt}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
