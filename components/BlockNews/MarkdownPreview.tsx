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
  // Custom components for markdown rendering
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-8 mt-10 text-right">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-7 mt-9 text-right">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6 mt-8 text-right">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-5 mt-7 text-right">
        {children}
      </h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-4 mt-6 text-right">
        {children}
      </h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-4 mt-5 text-right">
        {children}
      </h6>
    ),
    p: ({ children }: any) => (
      <p className="text-base md:text-lg leading-[1.85] mb-6 text-right text-slate-800 dark:text-slate-200">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-10 border-r-4 rtl:border-r-0 rtl:border-l-4 border-slate-400/90 bg-slate-50 dark:bg-slate-950/70 p-6 rounded-3xl text-right italic text-slate-700 dark:text-slate-200 shadow-sm">
        {children}
      </blockquote>
    ),
    ul: ({ children }: any) => (
      <ul className="my-8 text-right text-slate-800 dark:text-slate-200 space-y-3 list-disc list-inside mr-6">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="my-8 text-right text-slate-800 dark:text-slate-200 space-y-3 list-decimal list-inside mr-6">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    code: ({ inline, className, children }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'plaintext';

      if (inline) {
        return (
          <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-sm text-slate-800 dark:text-slate-200">
            {children}
          </code>
        );
      }

      return (
        <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 text-xs font-mono text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            {language}
          </div>
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            className="!m-0 !rounded-b-3xl !bg-slate-950"
            showLineNumbers
            wrapLines
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    },
    img: ({ src, alt, title }: any) => (
      <div className="my-12 flex justify-center px-4">
        <figure className="w-full max-w-4xl text-center">
          <div className="overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-500 ease-out hover:scale-[1.01]">
            <Image
              src={src}
              alt={alt || 'تصویر مقاله'}
              width={1200}
              height={675}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px"
              className="w-full h-auto object-cover"
              loading="lazy"
              unoptimized
            />
          </div>
          {(title || alt) && (
            <figcaption className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic">
              {title || alt}
            </figcaption>
          )}
        </figure>
      </div>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {children}
      </a>
    ),
    hr: () => (
      <hr className="my-12 border-t border-slate-300 dark:border-slate-700" />
    ),
    table: ({ children }: any) => (
      <div className="my-8 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 dark:bg-slate-900">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
        {children}
      </tbody>
    ),
    tr: ({ children }: any) => (
      <tr>
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 text-right text-sm text-slate-700 dark:text-slate-300">
        {children}
      </td>
    ),
  };
  
  return (
    <article className={`max-w-none ${className}`}>
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
