/**
 * M2 Markdown Preview Component
 * 
 * Renders Markdown with professional magazine-style styling
 */

'use client';

import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
// @ts-expect-error -- no @types/react-syntax-highlighter; declare-module shim in types/
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-expect-error -- same package, no types
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { ReactNode } from 'react';
import type { Components } from 'react-markdown';

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
  const markdownComponents: Components = {
    h1: ({ children }) => (
      <h2 className="mb-4 mt-12 border-t border-border pt-8 text-right text-2xl font-bold text-foreground">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 border-t border-border pt-8 text-right text-2xl font-bold text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-10 text-right text-xl font-bold text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-8 text-right text-lg font-bold text-foreground">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mb-3 mt-8 text-right text-base font-bold text-foreground">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mb-3 mt-8 text-right text-base font-bold text-foreground">
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <p className="mb-6 text-right text-[1.05rem] leading-9 text-foreground/90">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-s-2 border-primary ps-5 text-right italic leading-8 text-muted-foreground">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="my-6 list-disc space-y-2.5 ps-5 text-right text-foreground/90">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2.5 ps-5 text-right text-foreground/90">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-8">
        {children}
      </li>
    ),
    
    // Code with syntax highlighting
    code: ({ inline, className, children }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'plaintext';

      if (inline) {
        return (
          <code className="bg-muted/80 px-2.5 py-1.5 rounded-md font-mono text-sm text-foreground whitespace-nowrap">
            {children}
          </code>
        );
      }

      return (
        <div className="my-10 overflow-hidden rounded-2xl border border-border shadow-lg">
          <div className="bg-muted px-6 py-4 text-xs font-mono text-muted-foreground border-b border-border">
            {language}
          </div>
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            className="!m-0 !rounded-b-2xl !bg-card !text-sm"
            showLineNumbers
            wrapLines
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    },
    
    img: ({ src, alt, title }) =>
      typeof src !== 'string' ? null : (
      <figure className="my-10">
        <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
          <Image
            src={src}
            alt={alt || 'تصویر مقاله'}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
            loading="lazy"
            unoptimized
            priority={false}
          />
        </div>
        {(title || alt) && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">
            {title || alt}
          </figcaption>
        )}
      </figure>
      ),

    // Links with professional styling
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary dark:hover:text-primary hover:underline underline-offset-2 transition-colors duration-200 font-medium"
      >
        {children}
      </a>
    ),
    
    // Horizontal rule
    hr: () => (
      <hr className="my-14 border-none h-1 bg-gradient-to-r from-transparent via-card to-transparent" />
    ),
    
    // Tables with professional styling
    table: ({ children }) => (
      <div className="my-10 overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="min-w-full divide-y divide-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted/50">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border bg-card/30">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-6 py-4 text-right text-sm md:text-base font-semibold text-foreground bg-muted">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-right text-sm md:text-base text-muted-foreground leading-relaxed">
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
