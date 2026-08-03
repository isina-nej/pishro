'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, BookOpen, Download, DollarSign, Calendar, User, Eye } from 'lucide-react';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer';
import BookmarkButton from '@/components/bookmarks/bookmarkButton';

interface BookDetail {
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
  bookStatus?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/library/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('کتاب مورد نظر پیدا نشد');
          } else {
            setError('خطایی در دریافت اطلاعات کتاب رخ داد');
          }
          return;
        }

        const data = await response.json();
        setBook(data.data || data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('خطایی در دریافت اطلاعات کتاب رخ داد');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <BookOpen className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {error || 'کتاب پیدا نشد'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              ممکن است این کتاب حذف شده باشد یا دسترسی محدود داشته باشد.
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              بازگشت
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative py-12 md:py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Book Cover */}
              <div className="flex justify-center md:justify-start">
                <div className="relative w-full max-w-xs">
                  <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800">
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-contain"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Category Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {book.category}
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {book.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {book.author}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(book.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg">{book.rating.toFixed(1)}</span>
                    <span className="text-slate-500">({book.votes} نظر)</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <Eye className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-slate-500">بازدیدها</p>
                      <p className="font-semibold">{book.views.toLocaleString('fa-IR')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <Download className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-slate-500">دانلودها</p>
                      <p className="font-semibold">{book.downloads.toLocaleString('fa-IR')}</p>
                    </div>
                  </div>
                  
                  {book.pages && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500">صفحات</p>
                        <p className="font-semibold">{book.pages}</p>
                      </div>
                    </div>
                  )}
                  
                  {book.year && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-slate-500">سال</p>
                        <p className="font-semibold">{book.year}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <BookmarkButton
                    type="book"
                    itemId={book.id}
                    showLabel
                    className="justify-center px-6 py-3 font-semibold"
                  />
                  {book.fileUrl && (
                    <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-semibold">
                      <Download className="h-5 w-5" />
                      دانلود کتاب
                    </button>
                  )}
                  {book.audioUrl && (
                    <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary/5 transition-colors font-semibold">
                      <BookOpen className="h-5 w-5" />
                      گوش دادن
                    </button>
                  )}
                  {book.price && (
                    <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">{book.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="py-12 md:py-16 px-4 md:px-6 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              درباره این کتاب
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {book.description}
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {book.publisher && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">ناشر</h3>
                  <p className="text-slate-600 dark:text-slate-300">{book.publisher}</p>
                </div>
              )}
              {book.isbn && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">ISBN</h3>
                  <p className="text-slate-600 dark:text-slate-300">{book.isbn}</p>
                </div>
              )}
              {book.language && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">زبان</h3>
                  <p className="text-slate-600 dark:text-slate-300">{book.language}</p>
                </div>
              )}
              {book.readingTime && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">مدت زمان مطالعه</h3>
                  <p className="text-slate-600 dark:text-slate-300">{book.readingTime}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">برچسب‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag: string | { name: string }, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm"
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

      <Footer />
    </div>
  );
}
