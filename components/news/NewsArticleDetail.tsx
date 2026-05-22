"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import MarkdownPreview from '@/components/BlockNews/MarkdownPreview';
import ArticlePreviewCard from '@/components/news/ArticlePreviewCard';
import type { NewsArticle } from "@prisma/client";
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

function renderProseMirrorMarks(text: string, marks?: Array<{ type: string; attrs?: Record<string, any> }>): React.ReactNode {
  if (!marks?.length) return text;

  return marks.reduce<React.ReactNode>((child, mark) => {
    switch (mark.type) {
      case 'bold':
        return <strong>{child}</strong>;
      case 'italic':
        return <em>{child}</em>;
      case 'code':
        return <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-sm">{child}</code>;
      case 'link':
        return (
          <a
            href={mark.attrs?.href || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
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

function renderProseMirrorNode(node: any, key: string): React.ReactNode {
  if (!node) return null;

  if (node.type === 'text') {
    return <React.Fragment key={key}>{renderProseMirrorMarks(node.text, node.marks)}</React.Fragment>;
  }

  const renderChildren = (children?: any[]) =>
    (children || []).map((child, index) => renderProseMirrorNode(child, `${key}-${index}`));

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="text-base md:text-lg leading-relaxed mb-6 text-right text-slate-800 dark:text-slate-200">
          {renderChildren(node.content)}
        </p>
      );
    case 'heading': {
      const level = node.attrs?.level || 1;
      const headingClasses = [
        'text-right tracking-tight text-slate-900 dark:text-slate-100',
        level === 1 && 'text-4xl md:text-5xl mb-8 mt-10',
        level === 2 && 'text-3xl md:text-4xl mb-7 mt-9',
        level === 3 && 'text-2xl md:text-3xl mb-6 mt-8',
        level === 4 && 'text-xl md:text-2xl mb-5 mt-7',
        level === 5 && 'text-lg md:text-xl mb-4 mt-6',
        level === 6 && 'text-base md:text-lg mb-4 mt-5',
      ].filter(Boolean).join(' ');
      const HeadingTag = `h${level}` as any;
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
          className="my-10 border-r-4 rtl:border-r-0 rtl:border-l-4 border-slate-400/90 bg-slate-50 dark:bg-slate-950/70 p-6 rounded-3xl text-right italic text-slate-700 dark:text-slate-200 shadow-sm"
        >
          {renderChildren(node.content)}
        </blockquote>
      );
    case 'bulletList':
      return (
        <ul key={key} className="my-8 text-right text-slate-800 dark:text-slate-200 space-y-3 list-disc list-inside mr-6">
          {renderChildren(node.content)}
        </ul>
      );
    case 'orderedList':
      return (
        <ol key={key} className="my-8 text-right text-slate-800 dark:text-slate-200 space-y-3 list-decimal list-inside mr-6">
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
        <pre key={key} className="my-8 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 shadow-sm">
          <code>{node.content?.[0]?.text || ''}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} className="my-12 border-t border-slate-300 dark:border-slate-700" />;
    case 'hardBreak':
      return <br key={key} />;
    case 'image': {
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || 'تصویر مقاله';
      const title = node.attrs?.title || alt;
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
              <figcaption className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic">
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
    return parsed.content?.map((node: any, index: number) => renderProseMirrorNode(node, `pm-${index}`));
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

  return (
    <>
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-950 mb-8 h-1 w-full overflow-hidden rounded-b-full shadow-sm">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              ← بازگشت به اخبار
            </Link>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {article.category}
            </span>
            {formattedDate && <span className="text-sm text-slate-500 dark:text-slate-400">{formattedDate}</span>}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="max-w-3xl text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-8">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>

      {article.coverImage && (
        <div className="mb-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <ArticlePreviewCard article={article} />

      <article className="mx-auto max-w-4xl">
        {/* Content Wrapper with Magazine-style Styling */}
        <div className="rounded-[2rem] border border-slate-200/60 bg-gradient-to-b from-white/95 to-slate-50/95 p-8 md:p-12 shadow-[0_40px_90px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:from-slate-950/95 dark:to-slate-900/95">
          
          {/* Auto-detect and render content based on type */}
          {article.contentType === 'MARKDOWN' ? (
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
            <div className="space-y-6 text-right text-base md:text-lg leading-[1.85] text-slate-800 dark:text-slate-200">
              {renderProseMirrorContent(article.content)}
            </div>
          ) : (
            /* Raw HTML content */
            <div
              className="space-y-6 text-right text-base md:text-lg leading-[1.85] text-slate-800 dark:text-slate-200 [&_p]:text-slate-800 [&_p]:dark:text-slate-200 [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:dark:text-slate-100 [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-slate-100 [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:dark:text-slate-100 [&_strong]:font-bold [&_em]:italic [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_blockquote]:border-r-4 [&_blockquote]:rtl:border-r-0 [&_blockquote]:rtl:border-l-4 [&_blockquote]:border-slate-400/90 [&_blockquote]:bg-slate-50 [&_blockquote]:dark:bg-slate-950/70 [&_blockquote]:p-6 [&_blockquote]:rounded-3xl [&_blockquote]:italic [&_blockquote]:text-slate-700 [&_blockquote]:dark:text-slate-200 [&_blockquote]:shadow-sm [&_ul]:space-y-3 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mr-6 [&_ol]:space-y-3 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mr-6 [&_li]:leading-relaxed [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}
        </div>

        {/* Article Meta Footer */}
        <div className="mt-12 border-t border-slate-200/60 pt-8 dark:border-slate-800/60">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              {article.author && (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span>نوشتار: {article.author}</span>
                </span>
              )}
              {article.publishedAt && (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <time dateTime={new Date(article.publishedAt).toISOString()}>
                    {format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: faIR })}
                  </time>
                </span>
              )}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-500">
              ~{Math.ceil(article.content.split(/\s+/).length / 200)} دقیقه مطالعه
            </div>
          </div>
        </div>
      </article>
      </div>
    </>
  );
}
