"use client";

import Image from "next/image";
import { useBookDetail } from "@/lib/hooks/useBooks";
import {
  Star,
  Eye,
  Download,
  BookOpen,
  Calendar,
  FileText,
  Globe,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookDetailProps {
  bookId: string;
}

const BookDetail = ({ bookId }: BookDetailProps) => {
  const { data: book, isLoading, error } = useBookDetail(bookId);

  if (isLoading) {
    return (
      <div className="container-xl py-20 flex justify-center items-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container-xl py-20 flex justify-center items-center min-h-[600px]">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold">خطا در بارگذاری کتاب</p>
          <p className="text-sm mt-2">{error?.message || "کتاب یافت نشد"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-10 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover & Quick Info */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              {book.cover && (
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl mb-6">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">امتیاز:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">
                      {book.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({book.votes} رای)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">بازدید:</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{book.views}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">دانلود:</span>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{book.downloads}</span>
                  </div>
                </div>

                {book.readingTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">زمان مطالعه:</span>
                    <span className="font-medium">{book.readingTime}</span>
                  </div>
                )}
              </div>

              {book.fileUrl && (
                <Button className="w-full mt-4" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  دانلود کتاب
                </Button>
              )}

              {book.audioUrl && (
                <Button className="w-full mt-2" variant="outline" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  نسخه صوتی
                </Button>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title & Category */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {book.category}
                </span>
                {book.status.map((status) => (
                  <span
                    key={status}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {status}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>

              <p className="text-xl text-gray-600 mb-4">
                نوشته: {book.author}
              </p>
            </div>

            {/* Book Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {book.publisher && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ناشر</p>
                    <p className="font-medium">{book.publisher}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">سال انتشار</p>
                  <p className="font-medium">{book.year}</p>
                </div>
              </div>

              {book.pages && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">تعداد صفحات</p>
                    <p className="font-medium">{book.pages}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">زبان</p>
                  <p className="font-medium">{book.language}</p>
                </div>
              </div>
            </div>

            {/* Formats */}
            {book.formats.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">فرمت‌های موجود</h3>
                <div className="flex flex-wrap gap-2">
                  {book.formats.map((format) => (
                    <span
                      key={format}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold mb-3">درباره کتاب</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>

            {/* Tags */}
            {book.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">برچسب‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ISBN */}
            {book.isbn && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  ISBN: <span className="font-mono">{book.isbn}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
