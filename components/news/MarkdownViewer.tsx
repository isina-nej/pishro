'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MDXEditorComponent = dynamic(
  () => import('./MDXEditorComponent'),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-500">در حال بارگذاری...</div> }
);

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export default function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">در حال بارگذاری...</div>}>
      <MDXEditorComponent content={content} className={className} />
    </Suspense>
  );
}
