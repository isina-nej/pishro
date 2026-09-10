"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, BookOpen, Download, DollarSign, Calendar, User, Eye } from 'lucide-react';
import BookmarkButton from '@/components/bookmarks/bookmarkButton';
import { usePublicCopy } from '@/components/site/PublicContentProvider';

export interface BookDetail {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cover?: string;
  category: string;
  rating: number;
  votes: number;
  views: number;
  downloads: number;
  year: number;
  pages?: number;
  isbn?: string;
  language: string;
  publisher?: string;
  formats: string[];
  price?: number;
  fileUrl?: string;
  audioUrl?: string;
  tags: string[];
  readingTime?: string;
  isFeatured: boolean;
}

export default function BookDetailContent({ book }: { book: BookDetail }) {
  const copy = usePublicCopy("article");
  return (
    <main className="flex-1">
      <div className="relative py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-full max-w-xs">
                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl bg-muted">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={`جلد کتاب ${book.title}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {book.category}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {book.author}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(book.rating)
                            ? 'fill-premium text-premium'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{book.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({book.votes} {copy("book.votes", "رای")})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{copy("book.views", "بازدید:")}</p>
                    <p className="font-semibold">{book.views.toLocaleString('fa-IR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Download className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{copy("book.downloads", "دانلود:")}</p>
                    <p className="font-semibold">{book.downloads.toLocaleString('fa-IR')}</p>
                  </div>
                </div>
                {book.pages && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{copy("book.pages", "تعداد صفحات")}</p>
                      <p className="font-semibold">{book.pages}</p>
                    </div>
                  </div>
                )}
                {book.year && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-accent-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{copy("book.year", "سال انتشار")}</p>
                      <p className="font-semibold">{book.year}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <BookmarkButton
                  type="book"
                  itemId={book.id}
                  showLabel
                  className="justify-center px-6 py-3 font-semibold"
                />
                {book.fileUrl && (
                  <Link
                    href={book.fileUrl}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
                  >
                    <Download className="h-5 w-5" />
                    {copy("book.downloadPdf", "دانلود PDF")}
                  </Link>
                )}
                {book.audioUrl && (
                  <Link
                    href={book.audioUrl}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary/5 transition-colors font-semibold"
                  >
                    <BookOpen className="h-5 w-5" />
                    {copy("book.downloadAudio", "دانلود صوتی")}
                  </Link>
                )}
                {book.price && (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-muted">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{book.price.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-16 px-4 md:px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {copy("book.about", "درباره کتاب")}
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {book.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {book.publisher && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">{copy("book.publisher", "ناشر")}</h3>
                <p className="text-muted-foreground">{book.publisher}</p>
              </div>
            )}
            {book.isbn && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">ISBN</h3>
                <p className="text-muted-foreground">{book.isbn}</p>
              </div>
            )}
            {book.language && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">{copy("book.language", "زبان")}</h3>
                <p className="text-muted-foreground">{book.language}</p>
              </div>
            )}
            {book.readingTime && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">{copy("book.readingTime", "زمان مطالعه:")}</h3>
                <p className="text-muted-foreground">{book.readingTime}</p>
              </div>
            )}
          </div>

          {book.tags && book.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-4">{copy("book.tags", "برچسب‌ها")}</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag: string | { name: string }, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm"
                  >
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
