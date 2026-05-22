'use client';

import React from 'react';

interface MDXEditorComponentProps {
  content: string;
  className?: string;
}

// Fallback component until MDXEditor is fully loaded
export default function MDXEditorComponent({ content, className = '' }: MDXEditorComponentProps) {
  return (
    <div className={`mdx-editor-wrapper markdown-content ${className}`}>
      <style>{`
        .markdown-content {
          direction: rtl;
        }
        
        /* Typography Styles */
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          text-align: right;
          color: rgb(15, 23, 42);
          tracking-tight: true;
        }
        
        .dark .markdown-content h1,
        .dark .markdown-content h2,
        .dark .markdown-content h3,
        .dark .markdown-content h4,
        .dark .markdown-content h5,
        .dark .markdown-content h6 {
          color: rgb(241, 245, 249);
        }
        
        .markdown-content h1 {
          font-size: 2.25rem;
          font-weight: 900;
          margin-top: 2.5rem;
          margin-bottom: 2rem;
          line-height: 1.2;
        }
        
        .markdown-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2.25rem;
          margin-bottom: 1.75rem;
          line-height: 1.3;
        }
        
        .markdown-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }
        
        .markdown-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        
        .markdown-content h5 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        
        .markdown-content h6 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        
        .markdown-content p {
          text-align: right;
          color: rgb(30, 41, 59);
          font-size: 1rem;
          line-height: 1.85;
          margin-bottom: 1.5rem;
        }
        
        .dark .markdown-content p {
          color: rgb(226, 232, 240);
        }
        
        .markdown-content ul,
        .markdown-content ol {
          text-align: right;
          margin: 2rem 0;
          padding-right: 1.5rem;
        }
        
        .markdown-content ul {
          list-style-type: disc;
        }
        
        .markdown-content ol {
          list-style-type: decimal;
        }
        
        .markdown-content li {
          line-height: 1.75;
          margin-bottom: 0.75rem;
          color: rgb(30, 41, 59);
          margin-right: 1rem;
        }
        
        .dark .markdown-content li {
          color: rgb(226, 232, 240);
        }
        
        .markdown-content blockquote {
          border-right: 4px solid rgb(148, 163, 184);
          background: rgb(248, 250, 252);
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin: 2.5rem 0;
          font-style: italic;
          color: rgb(51, 65, 85);
        }
        
        .dark .markdown-content blockquote {
          border-right-color: rgb(100, 116, 139);
          background: rgba(15, 23, 42, 0.5);
          color: rgb(226, 232, 240);
        }
        
        .markdown-content code {
          background: rgb(241, 245, 249);
          color: rgb(15, 23, 42);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875em;
        }
        
        .dark .markdown-content code {
          background: rgb(30, 41, 59);
          color: rgb(226, 232, 240);
        }
        
        .markdown-content pre {
          background: rgb(15, 23, 42);
          color: rgb(226, 232, 240);
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875em;
          line-height: 1.5;
        }
        
        .markdown-content pre code {
          background: none;
          color: inherit;
          padding: 0;
          border-radius: 0;
        }
        
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          margin: 2rem auto;
          display: block;
        }
        
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          border: 1px solid rgb(203, 213, 225);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .dark .markdown-content table {
          border-color: rgb(51, 65, 85);
        }
        
        .markdown-content table th {
          background: rgb(241, 245, 249);
          color: rgb(15, 23, 42);
          padding: 0.75rem;
          text-align: right;
          font-weight: 600;
          border-bottom: 2px solid rgb(203, 213, 225);
        }
        
        .dark .markdown-content table th {
          background: rgb(30, 41, 59);
          color: rgb(226, 232, 240);
          border-bottom-color: rgb(51, 65, 85);
        }
        
        .markdown-content table td {
          padding: 0.75rem;
          border-bottom: 1px solid rgb(226, 232, 240);
          color: rgb(30, 41, 59);
          text-align: right;
        }
        
        .dark .markdown-content table td {
          border-bottom-color: rgb(51, 65, 85);
          color: rgb(226, 232, 240);
        }
        
        .markdown-content hr {
          margin: 3rem 0;
          border: none;
          border-top: 1px solid rgb(203, 213, 225);
        }
        
        .dark .markdown-content hr {
          border-top-color: rgb(51, 65, 85);
        }
        
        .markdown-content a {
          color: rgb(37, 99, 235);
          text-decoration: underline;
          transition: color 0.2s;
        }
        
        .markdown-content a:hover {
          color: rgb(29, 78, 216);
        }
        
        .dark .markdown-content a {
          color: rgb(96, 165, 250);
        }
        
        .dark .markdown-content a:hover {
          color: rgb(147, 197, 253);
        }
      `}</style>
      
      <div
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
}

// Simple markdown to HTML converter
function renderMarkdown(markdown: string): string {
  let html = markdown;
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Convert back safe HTML tags
  html = html.replace(/&lt;img/g, '<img').replace(/&gt;/g, '>');
  html = html.replace(/&lt;figure/g, '<figure').replace(/&lt;figcaption/g, '<figcaption').replace(/&lt;\/figcaption/g, '</figcaption>').replace(/&lt;\/figure/g, '</figure>');
  
  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
  html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  
  // Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Code blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  return html;
}
