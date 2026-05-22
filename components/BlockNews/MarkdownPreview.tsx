/**
 * M2 Markdown Preview Component
 * 
 * Renders Markdown with professional magazine-style styling
 */

'use client';

import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { ReactNode } from 'react';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  // Custom components for markdown rendering with magazine-style typography
  const markdownComponents = {
    // Headings with professional spacing and typography
    h1: ({ children }: any) => (
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-10 mt-14 text-right leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-8 mt-12 text-right leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-7 mt-10 text-right leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-6 mt-8 text-right">
        {children}
      </h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-5 mt-7 text-right">
        {children}
      </h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-4 mt-6 text-right">
        {children}
      </h6>
    ),
    
    // Paragraphs with optimal reading experience
    p: ({ children }: any) => (
      <p className="text-base md:text-lg leading-[1.95] letter-spacing-[0.3px] mb-8 text-right text-slate-700/95 dark:text-slate-300/95 font-normal">
        {children}
      </p>
    ),
    
    // Blockquotes with professional styling
    blockquote: ({ children }: any) => (
      <blockquote className="my-12 border-r-4 rtl:border-r-0 rtl:border-l-4 border-blue-500/60 bg-gradient-to-l from-blue-50/60 to-transparent dark:from-blue-950/30 dark:to-transparent px-8 py-6 rounded-2xl text-right italic text-slate-700/95 dark:text-slate-200/95 shadow-sm">
        {children}
      </blockquote>
    ),
    
    // Lists with proper spacing
    ul: ({ children }: any) => (
      <ul className="my-10 text-right text-slate-700/95 dark:text-slate-300/95 space-y-4 list-disc list-inside mr-4 md:mr-6">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="my-10 text-right text-slate-700/95 dark:text-slate-300/95 space-y-4 list-decimal list-inside mr-4 md:mr-6">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-[1.85] text-base md:text-lg">
        {children}
      </li>
    ),
    
    // Code with syntax highlighting
    code: ({ inline, className, children }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'plaintext';

      if (inline) {
        return (
          <code className="bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-md font-mono text-sm text-slate-800 dark:text-slate-200 whitespace-nowrap">
            {children}
          </code>
        );
      }

      return (
        <div className="my-10 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="bg-slate-100 dark:bg-slate-950 px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            {language}
          </div>
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            className="!m-0 !rounded-b-2xl !bg-slate-950 !text-sm"
            showLineNumbers
            wrapLines
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    },
    
    // Images with professional styling and hover effects
    img: ({ src, alt, title }: any) => (
      <figure className="my-14 flex justify-center px-2 md:px-0">
        <div className="w-full max-w-5xl">
          <div className="group overflow-hidden rounded-[1.75rem] shadow-[0_20px_60px_rgba(15,23,42,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out hover:shadow-[0_30px_80px_rgba(15,23,42,0.25)] dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <Image
              src={src}
              alt={alt || 'تصویر مقاله'}
              width={1200}
              height={675}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1100px"
              className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              loading="lazy"
              unoptimized
              priority={false}
            />
          </div>
          {(title || alt) && (
            <figcaption className="mt-5 text-center text-sm md:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {title || alt}
            </figcaption>
          )}
        </div>
      </figure>
    ),
    
    // Links with professional styling
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline underline-offset-2 transition-colors duration-200 font-medium"
      >
        {children}
      </a>
    ),
    
    // Horizontal rule
    hr: () => (
      <hr className="my-14 border-none h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
    ),
    
    // Tables with professional styling
    table: ({ children }: any) => (
      <div className="my-10 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50/80 dark:bg-slate-900/50">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950/30">
        {children}
      </tbody>
    ),
    tr: ({ children }: any) => (
      <tr>
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-6 py-4 text-right text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-6 py-4 text-right text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </td>
    ),
  };
  
  return (
    <article className={`prose-magazine max-w-none text-right ${className}`}>
      <ReactMarkdown 
        components={markdownComponents}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
