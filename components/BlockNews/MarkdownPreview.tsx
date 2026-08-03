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
    // Headings with professional spacing and typography
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-10 mt-14 text-right leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8 mt-12 text-right leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-7 mt-10 text-right leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-6 mt-8 text-right">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg md:text-xl font-semibold tracking-tight text-foreground mb-5 mt-7 text-right">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base md:text-lg font-semibold tracking-tight text-foreground mb-4 mt-6 text-right">
        {children}
      </h6>
    ),
    
    // Paragraphs with optimal reading experience
    p: ({ children }) => (
      <p className="text-base md:text-lg leading-[1.95] letter-spacing-[0.3px] mb-8 text-right text-muted-foreground/95/95 font-normal">
        {children}
      </p>
    ),
    
    // Blockquotes with professional styling
    blockquote: ({ children }) => (
      <blockquote className="my-12 border-r-4 rtl:border-r-0 rtl:border-l-4 border-primary/60 bg-gradient-to-l from-primary/60 to-transparent/30 dark:to-transparent px-8 py-6 rounded-2xl text-right italic text-muted-foreground/95/95 shadow-sm">
        {children}
      </blockquote>
    ),
    
    // Lists with proper spacing
    ul: ({ children }) => (
      <ul className="my-10 text-right text-muted-foreground/95/95 space-y-4 list-disc list-inside mr-4 md:mr-6">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-10 text-right text-muted-foreground/95/95 space-y-4 list-decimal list-inside mr-4 md:mr-6">
        {children}
      </ol>
    ),
    li: ({ children }) => (
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
          <code className="bg-muted/80/80 px-2.5 py-1.5 rounded-md font-mono text-sm text-foreground whitespace-nowrap">
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
    
    // Images with professional styling and hover effects
    img: ({ src, alt, title }) =>
      typeof src !== 'string' ? null : (
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
            <figcaption className="mt-5 text-center text-sm md:text-base text-muted-foreground font-normal leading-relaxed">
              {title || alt}
            </figcaption>
          )}
        </div>
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
      <thead className="bg-muted/80/50">
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
