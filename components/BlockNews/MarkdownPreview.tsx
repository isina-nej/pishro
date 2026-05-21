/**
 * M2 Markdown Preview Component
 * 
 * Renders M2 Markdown with professional styling
 */

'use client';

import React from 'react';
import { parseMarkdown, formatInlineMarkdown, MarkdownBlock } from '@/lib/utils/markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const blocks = parseMarkdown(content);
  
  const renderBlock = (block: MarkdownBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        const headingClass = [
          'font-bold my-4 text-right',
          block.level === 1 && 'text-4xl md:text-5xl mb-6 mt-8',
          block.level === 2 && 'text-3xl md:text-4xl mb-5 mt-7',
          block.level === 3 && 'text-2xl md:text-3xl mb-4 mt-6',
          block.level === 4 && 'text-xl md:text-2xl mb-3 mt-5',
          block.level === 5 && 'text-lg md:text-xl mb-2 mt-4',
          block.level === 6 && 'text-base md:text-lg mb-2 mt-3',
        ];
        return React.createElement(
          `h${block.level}` as any,
          {
            key: index,
            className: headingClass.filter(Boolean).join(' '),
            dangerouslySetInnerHTML: { __html: formatInlineMarkdown(block.content || '') }
          }
        );
      
      case 'paragraph':
        return (
          <p
            key={index}
            className="text-base md:text-lg leading-relaxed mb-4 text-right text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(block.content || '') }}
          />
        );
      
      case 'code':
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 text-xs font-mono text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              {block.language}
            </div>
            <SyntaxHighlighter
              language={block.language || 'plaintext'}
              style={atomOneDark}
              className="!bg-gray-900 !m-0"
              showLineNumbers
              wrapLines
            >
              {block.content || ''}
            </SyntaxHighlighter>
          </div>
        );
      
      case 'blockquote':
        return (
          <div
            key={index}
            className="my-4 border-r-4 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded"
          >
            <p
              className="text-right text-gray-700 dark:text-gray-300 italic"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(block.content || '') }}
            />
          </div>
        );
      
      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={index}
            className={`my-4 text-right text-gray-700 dark:text-gray-300 space-y-2 ${
              block.ordered ? 'list-decimal' : 'list-disc'
            } mr-6`}
          >
            {block.items?.map((item, idx) => (
              <li
                key={idx}
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }}
              />
            ))}
          </ListTag>
        );
      
      case 'image':
        return (
          <div key={index} className="my-4 flex justify-center">
            <figure className="text-center max-w-full">
              <img
                src={block.src}
                alt={block.alt}
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
              {block.alt && (
                <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {block.alt}
                </figcaption>
              )}
            </figure>
          </div>
        );
      
      case 'hr':
        return (
          <hr
            key={index}
            className="my-6 border-t-2 border-gray-300 dark:border-gray-700"
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <article className={`prose prose-invert max-w-none ${className}`}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </article>
  );
}
