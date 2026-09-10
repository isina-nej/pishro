"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import MarkdownPreview from '@/components/BlockNews/MarkdownPreview';
import BookmarkButton from '@/components/bookmarks/bookmarkButton';
import { usePublicCopy } from "@/components/site/PublicContentProvider";
import type { NewsArticle } from "@prisma/client";
import type { ProseMirrorNode, ProseMirrorMark } from "@/lib/utils/article-utils";
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale/fa-IR';
import Link from "next/link";
import { renderWithAnimatedEmoji } from "@/lib/admin/animated-emoji-render";

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
        return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{child}</code>;
      case 'link':
        return (
          <a
            href={String(mark.attrs?.href ?? '#')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
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
        <p key={key} className="mb-6 text-right text-[1.05rem] leading-9 text-foreground/90">
          {renderChildren(node.content)}
        </p>
      );
    case 'heading': {
      const level = Math.min(Math.max(Number(node.attrs?.level) || 2, 1), 6);
      const HeadingTag = `h${level}` as `h${1|2|3|4|5|6}`;
      const headingClasses = [
        'text-right font-bold tracking-tight text-foreground',
        level === 1 && 'mb-6 mt-12 text-3xl',
        level === 2 && 'mb-4 mt-12 border-t border-border pt-8 text-2xl',
        level === 3 && 'mb-3 mt-10 text-xl',
        level > 3 && 'mb-3 mt-8 text-lg',
      ].filter(Boolean).join(' ');
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
          className="my-8 border-s-2 border-primary ps-5 text-right italic leading-8 text-muted-foreground"
        >
          {renderChildren(node.content)}
        </blockquote>
      );
    case 'bulletList':
      return (
        <ul key={key} className="my-6 list-disc space-y-2.5 ps-5 text-right text-foreground/90">
          {renderChildren(node.content)}
        </ul>
      );
    case 'orderedList':
      return (
        <ol key={key} className="my-6 list-decimal space-y-2.5 ps-5 text-right text-foreground/90">
          {renderChildren(node.content)}
        </ol>
      );
    case 'listItem':
      return (
        <li key={key} className="leading-8">
          {renderChildren(node.content)}
        </li>
      );
    case 'codeBlock':
      return (
        <pre key={key} className="my-8 overflow-x-auto rounded-xl border border-border bg-muted/50 p-4 text-sm leading-7">
          <code>{node.content?.[0]?.text || ''}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} className="my-10 border-border" />;
    case 'hardBreak':
      return <br key={key} />;
    case 'image': {
      const src = String(node.attrs?.src ?? '');
      const alt = String(node.attrs?.alt ?? 'تصویر مقاله');
      const title = String(node.attrs?.title ?? alt);
      if (!src) return null;
      return (
        <figure key={key} className="my-10">
          <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
          {title && (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {title}
            </figcaption>
          )}
        </figure>
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
  const hasComplexTags = /<\s*(div|section|article|figure|img|table|thead|tbody|tr|td|th|ul|ol|li|pre|blockquote|h[1-6]|header|footer|nav|aside)\b/i.test(content);
  if (hasComplexTags) {
    return false;
  }

  const plainText = extractTextFromHtml(content);
  return looksLikeMarkdown(plainText);
}

export default function NewsArticleDetail({ article }: NewsArticleDetailProps) {
  const [progress, setProgress] = useState(0);
  const copy = usePublicCopy("article");
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  // پارالاکس هیرو: با اسکرول، عکس آرام پایین می‌لغزد، کمی زوم می‌شود و محو می‌گردد
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroImgScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const heroFade = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const scrimFade = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

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

  const contentToDisplay = article.contentHtml || article.content || '';
  const dateSource = article.publishedAt ?? article.createdAt;
  const scrollStyle = reduceMotion ? undefined : { y: heroImgY, scale: heroImgScale };

  return (
    <>
      <div className="sticky top-0 z-40 h-0.5 w-full bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* کاور عریض تمام‌عرض */}
      {article.coverImage && (
        <motion.div
          ref={heroRef}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative h-[44svh] min-h-[320px] w-full overflow-hidden bg-muted sm:h-[54svh] lg:h-[60svh] lg:max-h-[620px]"
        >
          <motion.div style={scrollStyle} className="absolute inset-0 will-change-transform">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
          {/* اسکریم برای خوانایی و گذار نرم به پس‌زمینه صفحه */}
          <motion.div
            style={reduceMotion ? undefined : { opacity: scrimFade }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-background"
            aria-hidden
          />
          <motion.div
            style={reduceMotion ? undefined : { opacity: heroFade }}
            className="absolute inset-x-0 bottom-5 flex justify-center sm:bottom-7"
            aria-hidden
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md">
              <motion.span
                animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="block text-sm leading-none"
              >
                ↓
              </motion.span>
            </span>
          </motion.div>
        </motion.div>
      )}

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center justify-between gap-3 pt-6"
        >
          <Link
            href="/news"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span> {copy("news.back", "بازگشت به مقالات")}
          </Link>
          <BookmarkButton type="news" itemId={article.id} />
        </motion.div>

        {/* تیتر زیر عکس */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mt-8"
        >
          <h1 className="text-right text-3xl font-extrabold leading-[1.7] text-foreground sm:text-4xl">
            {renderWithAnimatedEmoji(article.title)}
          </h1>

          {article.excerpt && (
            <p className="mt-4 text-right text-lg leading-9 text-muted-foreground">
              {renderWithAnimatedEmoji(article.excerpt)}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
            {article.author && <span className="font-medium text-foreground/80">{copy("news.writtenBy", "نوشتار توسط:")} {article.author}</span>}
            {article.author && formattedDate && (
              <span aria-hidden className="h-4 w-px bg-border" />
            )}
            {formattedDate && dateSource && (
              <time dateTime={new Date(dateSource).toISOString()}>
                {formattedDate}
              </time>
            )}
          </div>
        </motion.header>

        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-72px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          {article.contentHtml ? (
            <div
              className="text-right text-[1.05rem] leading-9 text-foreground/90
              [&_p]:mb-6
              [&_h1]:mb-6 [&_h1]:mt-12 [&_h1]:text-3xl [&_h1]:font-bold
              [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-bold
              [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-bold
              [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:ps-5
              [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:ps-5
              [&_li]:leading-8
              [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline
              [&_blockquote]:my-8 [&_blockquote]:border-s-2 [&_blockquote]:border-primary [&_blockquote]:ps-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
              [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl
              [&_figure]:my-10
              [&_hr]:my-10 [&_hr]:border-border
              [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
              [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-3 [&_th]:text-right [&_th]:font-semibold
              [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-right
              [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4"
              dangerouslySetInnerHTML={{ __html: contentToDisplay }}
            />
          ) : article.contentType === 'MARKDOWN' ? (
            <MarkdownPreview
              content={article.content}
              className="prose-magazine"
            />
          ) : isRawMarkdownHtml(article.content) ? (
            <MarkdownPreview
              content={extractTextFromHtml(article.content)}
              className="prose-magazine"
            />
          ) : isProseMirrorDoc(article.content) ? (
            <div className="text-right text-[1.05rem] leading-9 text-foreground/90">
              {renderProseMirrorContent(article.content)}
            </div>
          ) : (
            <div
              className="text-right text-[1.05rem] leading-9 text-foreground/90
              [&_p]:mb-6
              [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-bold
              [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:ps-5
              [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:ps-5
              [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline
              [&_blockquote]:my-8 [&_blockquote]:border-s-2 [&_blockquote]:border-primary [&_blockquote]:ps-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
              [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl
              [&_figure]:my-10
              [&_hr]:my-10 [&_hr]:border-border"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}
        </motion.article>

        <footer className="mb-16 mt-12 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {article.author && <span className="font-medium text-foreground/80">{article.author}</span>}
            {article.author && formattedDate && (
              <span aria-hidden className="h-4 w-px bg-border" />
            )}
            {formattedDate && dateSource && (
              <time dateTime={new Date(dateSource).toISOString()}>
                {formattedDate}
              </time>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}
