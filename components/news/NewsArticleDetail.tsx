"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import MarkdownPreview from '@/components/BlockNews/MarkdownPreview';
import ArticlePreviewCard from '@/components/news/ArticlePreviewCard';
import BookmarkButton from '@/components/bookmarks/bookmarkButton';
import type { NewsArticle } from "@prisma/client";
import type { ProseMirrorNode, ProseMirrorMark } from "@/lib/utils/article-utils";
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale/fa-IR';
import Link from "next/link";

interface NewsArticleDetailProps {
  article: NewsArticle;
}

function isProseMirrorDoc(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return parsed && parsed.type === 'doc' && Array.isArray(parsed.content);
  } catch {
    return false;
  }
}

function renderProseMirrorMarks(text: string, marks?: ProseMirrorMark[]): React.ReactNode {
  if (!marks?.length) return text;

  return marks.reduce<React.ReactNode>((child, mark) => {
    switch (mark.type) {
      case 'bold':
        return <strong>{child}</strong>;
      case 'italic':
        return <em>{child}</em>;
      case 'code':
        return <code className="bg-muted px-2 py-1 rounded font-mono text-sm">{child}</code>;
      case 'link':
        return (
          <a
            href={String(mark.attrs?.href ?? '#')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {child}
          </a>
        );
      case 'underline':
        return <span className="underline">{child}</span>;
      case 'strike':
        return <del>{child}</del>;
      default:
        return child;
    }
  }, text);
}

function renderProseMirrorNode(node: ProseMirrorNode | undefined, key: string): React.ReactNode {
  if (!node) return null;

  if (node.type === 'text') {
    return <React.Fragment key={key}>{renderProseMirrorMarks(node.text ?? "", node.marks)}</React.Fragment>;
  }

  const renderChildren = (children?: ProseMirrorNode[]) =>
    (children || []).map((child, index) => renderProseMirrorNode(child, `${key}-${index}`));

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="text-base md:text-lg leading-relaxed mb-6 text-right text-foreground">
          {renderChildren(node.content)}
        </p>
      );
    case 'heading': {
      const level = node.attrs?.level || 1;
      const headingClasses = [
        'text-right tracking-tight text-foreground',
        level === 1 && 'text-4xl md:text-5xl mb-8 mt-10',
        level === 2 && 'text-3xl md:text-4xl mb-7 mt-9',
        level === 3 && 'text-2xl md:text-3xl mb-6 mt-8',
        level === 4 && 'text-xl md:text-2xl mb-5 mt-7',
        level === 5 && 'text-lg md:text-xl mb-4 mt-6',
        level === 6 && 'text-base md:text-lg mb-4 mt-5',
      ].filter(Boolean).join(' ');
      const HeadingTag = `h${Math.min(Math.max(Number(level) || 1, 1), 6)}` as `h${1|2|3|4|5|6}`;
      return (
        <HeadingTag key={key} className={headingClasses}>
          {renderChildren(node.content)}
        </HeadingTag>
      );
    }
    case 'blockquote':
      return (
        <blockquote
          key={key}
          className="my-10 border-r-4 rtl:border-r-0 rtl:border-l-4 border-border/90 bg-muted/70 p-6 rounded-3xl text-right italic text-muted-foreground shadow-sm"
        >
          {renderChildren(node.content)}
        </blockquote>
      );
    case 'bulletList':
      return (
        <ul key={key} className="my-8 text-right text-foreground space-y-3 list-disc list-inside mr-6">
          {renderChildren(node.content)}
        </ul>
      );
    case 'orderedList':
      return (
        <ol key={key} className="my-8 text-right text-foreground space-y-3 list-decimal list-inside mr-6">
          {renderChildren(node.content)}
        </ol>
      );
    case 'listItem':
      return (
        <li key={key} className="leading-relaxed">
          {renderChildren(node.content)}
        </li>
      );
    case 'codeBlock':
      return (
        <pre key={key} className="my-8 overflow-x-auto rounded-3xl border border-border bg-card p-4 text-sm text-primary-foreground shadow-sm">
          <code>{node.content?.[0]?.text || ''}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} className="my-12 border-t border-border" />;
    case 'hardBreak':
      return <br key={key} />;
    case 'image': {
      const src = String(node.attrs?.src ?? '');
      const alt = String(node.attrs?.alt ?? 'تصویر مقاله');
      const title = String(node.attrs?.title ?? alt);
      return (
        <div key={key} className="my-12 flex justify-center px-4">
          <figure className="w-full max-w-4xl text-center">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-500 ease-out hover:scale-[1.01]">
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={675}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px"
                className="w-full h-auto object-cover"
                loading="lazy"
                unoptimized
              />
            </div>
            {title && (
              <figcaption className="mt-4 text-sm text-muted-foreground italic">
                {title}
              </figcaption>
            )}
          </figure>
        </div>
      );
    }
    default:
      return <React.Fragment key={key}>{renderChildren(node.content)}</React.Fragment>;
  }
}

function renderProseMirrorContent(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || parsed.type !== 'doc') return null;
    return parsed.content?.map((node: ProseMirrorNode, index: number) => renderProseMirrorNode(node, `pm-${index}`));
  } catch {
    return null;
  }
}

function extractTextFromHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function looksLikeMarkdown(text: string) {
  return /(^|\n)\s*(#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+|```|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))/m.test(text);
}

function isRawMarkdownHtml(content: string) {
  // If content is simple paragraph-wrapped HTML but contains Markdown symbols, treat it as raw Markdown input.
  const hasComplexTags = /<\s*(div|section|article|figure|img|table|thead|tbody|tr|td|th|ul|ol|li|pre|blockquote|h[1-6]|header|footer|nav|aside)\b/i.test(content);
  if (hasComplexTags) {
    return false;
  }

  const plainText = extractTextFromHtml(content);
  return looksLikeMarkdown(plainText);
}

export default function NewsArticleDetail({ article }: NewsArticleDetailProps) {
  const [progress, setProgress] = useState(0);

  const formattedDate = article.publishedAt
    ? format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: faIR })
    : article.createdAt
    ? format(new Date(article.createdAt), 'd MMMM yyyy', { locale: faIR })
    : '';

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const value = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(value);
    };

    calculateProgress();
    window.addEventListener('scroll', calculateProgress, { passive: true });
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  // Determine which content to display
  const contentToDisplay = article.contentHtml || article.content || '';
  const readingTime = Math.ceil(article.content.split(/\s+/).length / 200);
  const articleTags = Array.isArray(article.tags)
    ? article.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return (
    <>
      {/* Enhanced Sticky Progress Bar */}
      <div className="sticky top-0 z-40 h-1.5 w-full overflow-hidden bg-card shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary shadow-lg shadow-cyan-500/50 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="w-full bg-card">
        {/* Hero Section with Image */}
        {article.coverImage && (
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            
            {/* Header Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                {/* Category and Date */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/20 border border-primary/40 backdrop-blur-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-semibold text-primary">{article.category}</span>
                  </span>
                  {formattedDate && (
                    <span className="text-sm text-muted-foreground">{formattedDate}</span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
                  {article.title}
                </h1>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="max-w-2xl text-base sm:text-lg text-foreground leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-3 text-sm">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50/50 bg-muted/50 text-muted-foreground hover:bg-muted dark:hover:bg-card transition-all duration-200"
            >
              <span>←</span>
              <span>بازگشت</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{readingTime} دقیقه مطالعه</span>
            <BookmarkButton type="news" itemId={article.id} showLabel className="ms-auto" />
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-border/50/50 mb-12">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {article.author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-foreground font-bold text-xs">
                    {article.author.charAt(0)}
                  </div>
                  <span>{article.author}</span>
                </div>
              )}
              {article.views !== undefined && (
                <div className="flex items-center gap-2">
                  <span>👁</span>
                  <span>{article.views.toLocaleString('fa-IR')} بازدید</span>
                </div>
              )}
            </div>
            {articleTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {articleTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

        <article className="mx-auto">
        {/* Content Wrapper with Magazine-style Styling */}
        <div className="rounded-3xl border border-border/50/50 bg-gradient-to-br from-card via-muted to-card/50/30/50 p-8 sm:p-10 md:p-12 shadow-xl dark:shadow-2xl dark:shadow-slate-900/50 mb-12">
          {/* Auto-detect and render content based on type */}
          {article.contentHtml ? (
            /* Pre-rendered HTML from markdown (RECOMMENDED) - Fastest load time */
            <div
              className="prose prose-lg max-w-none space-y-6 text-right text-base md:text-lg leading-[1.9] text-foreground 
              [&_p]:text-foreground [&_p]: [&_p]:mb-7
              [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-black [&_h1]:text-foreground [&_h1]: [&_h1]:mb-8 [&_h1]:mt-12 
              [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]: [&_h2]:mb-7 [&_h2]:mt-10 [&_h2]:pt-6 [&_h2]:border-t [&_h2]:border-border [&_h2]:
              [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]: [&_h3]:mb-6 [&_h3]:mt-9
              [&_h4]:text-xl [&_h4]:md:text-2xl [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]: [&_h4]:mb-5 [&_h4]:mt-8
              [&_strong]:font-bold [&_strong]:text-foreground [&_strong]:
              [&_em]:italic [&_em]:text-muted-foreground [&_em]:
              [&_code]:bg-card [&_code]: [&_code]:text-primary-foreground [&_code]:px-2.5 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
              [&_pre]:bg-card [&_pre]:text-primary-foreground [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:shadow-lg [&_pre]:border [&_pre]:border-border
              [&_blockquote]:border-r-4 [&_blockquote]:rtl:border-r-0 [&_blockquote]:rtl:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-gradient-to-r [&_blockquote]:from-primary/50 [&_blockquote]:to-primary/50 [&_blockquote]:/10 [&_blockquote]:/10 [&_blockquote]:p-6 [&_blockquote]:rounded-2xl [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]: [&_blockquote]:shadow-sm [&_blockquote]:my-10
              [&_ul]:space-y-3 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mr-2 [&_ul]:my-8 [&_ul]:text-foreground [&_ul]:
              [&_ol]:space-y-3 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mr-2 [&_ol]:my-8 [&_ol]:text-foreground [&_ol]:
              [&_li]:leading-relaxed [&_li]:text-muted-foreground [&_li]:
              [&_a]:text-primary [&_a]: [&_a]:font-medium [&_a]:hover:underline [&_a]:transition
              [&_hr]:my-12 [&_hr]:border-border [&_hr]:
              [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:text-sm
              [&_th]:bg-muted [&_th]: [&_th]:p-3 [&_th]:text-right [&_th]:font-semibold [&_th]:border [&_th]:border-border [&_th]:
              [&_td]:p-3 [&_td]:border [&_td]:border-border [&_td]:"
              dangerouslySetInnerHTML={{ __html: contentToDisplay }}
            />
          ) : article.contentType === 'MARKDOWN' ? (
            /* Native Markdown - Best for automatic formatting */
            <MarkdownPreview
              content={article.content}
              className="prose-magazine"
            />
          ) : isRawMarkdownHtml(article.content) ? (
            /* HTML-wrapped Markdown - Extract and render */
            <MarkdownPreview
              content={extractTextFromHtml(article.content)}
              className="prose-magazine"
            />
          ) : isProseMirrorDoc(article.content) ? (
            /* ProseMirror JSON format */
            <div className="space-y-6 text-right text-base md:text-lg leading-[1.85] text-foreground">
              {renderProseMirrorContent(article.content)}
            </div>
          ) : (
            /* Raw HTML content */
            <div
              className="space-y-6 text-right text-base md:text-lg leading-[1.85] text-foreground [&_p]:text-foreground [&_p]: [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-black [&_h1]:text-foreground [&_h1]: [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]: [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]: [&_strong]:font-bold [&_em]:italic [&_code]:bg-muted [&_code]: [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_blockquote]:border-r-4 [&_blockquote]:rtl:border-r-0 [&_blockquote]:rtl:border-l-4 [&_blockquote]:border-border/90 [&_blockquote]:bg-muted [&_blockquote]:/70 [&_blockquote]:p-6 [&_blockquote]:rounded-3xl [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]: [&_blockquote]:shadow-sm [&_ul]:space-y-3 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mr-6 [&_ol]:space-y-3 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mr-6 [&_li]:leading-relaxed [&_a]:text-primary [&_a]: [&_a]:hover:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}
        </div>

        {/* Article Meta Footer */}
        <div className="border-t border-border/50/50 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm text-muted-foreground">
            <div className="flex flex-col gap-2">
              {article.author && (
                <p className="text-muted-foreground font-medium">
                  <span className="text-muted-foreground">نوشتار توسط:</span> {article.author}
                </p>
              )}
              {article.publishedAt && (
                <time dateTime={new Date(article.publishedAt).toISOString()} className="text-muted-foreground">
                  {format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: faIR })}
                </time>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <span>~{readingTime} دقیقه مطالعه</span>
              {article.views !== undefined && (
                <span>{article.views.toLocaleString('fa-IR')} بازدید</span>
              )}
            </div>
          </div>
        </div>
      </article>
      </div>
      </div>

      {/* Related Articles Section */}
      <ArticlePreviewCard article={article} />
    </>
  );
}
